# aes-ccm deprecation plan

Status: Phases 1-3 done; 1.1.0 is published and deprecated. Only Phase 4
decommissioning remains. Written 2026-11-19, updated 2026-11-21.

`aes-ccm` exists because Node's `crypto` module did not expose AES-CCM when this
package was written in 2018. It does now. This document records the plan to
retire the package in a controlled way.

## Why now

**The native module is already effectively unusable on supported Node.**

- The newest prebuilt binary is ABI `v88`, i.e. Node 15, Linux only. There has
  been no macOS binary since 1.0.4 and never a Windows one. Node 18/20/22/24 are
  ABI 108/115/127/137, so every install today falls through to
  `--fallback-to-build`.
- That build path depends on `node-pre-gyp@0.14` (unmaintained, superseded by
  `@mapbox/node-pre-gyp`) and a `binding.gyp` that hardcodes
  `<(node_root_dir)/deps/openssl/openssl/include`, which does not exist on Node
  built against shared OpenSSL.
- CI was Travis (`travis-ci.com`, gone for open source). Last publish was
  2021-04-17.

**Node covers the functionality natively.** `aes-128-ccm`, `aes-192-ccm` and
`aes-256-ccm` are all in `crypto.getCiphers()`, via
`createCipheriv(..., { authTagLength })` plus `setAAD(aad, { plaintextLength })`.
All 24 of this package's existing test vectors pass against a pure-JS wrapper
over `node:crypto`, unmodified. The full 32-test suite passes on Node 22, 24
and 26 with no `node_modules` present at all.

**Blast radius is small.**

| Signal | Value |
| --- | --- |
| Downloads, last month | 181 |
| Downloads, last year | 1702 |
| Real dependent packages | 3, all registry-mirror artifacts |
| First-party consumers | none; `cose-js` dropped it in `048d116` |

## Strategy

Not a bare tombstone. A plain `npm deprecate` would leave the last installable
version broken-on-install, so the remaining ~180 downloads/month keep hitting a
failing `node-gyp` build. Instead: ship one final version that is a thin wrapper
over `node:crypto` with the same API, so any straggler's install starts working
again, then mark the package deprecated with a migration message.

Published as **1.1.0**, not 2.0.0, so that everyone on `^1.0.x` actually
receives the fix. A major version would leave them stranded on the broken native
build. The new strictness (below) is technically breaking, but every affected
input previously produced garbage rather than correct output, so nothing can
reasonably depend on it.

## Phase 1 - rewrite as pure JS, with provenance (done)

1. Replace `lib/index.js` with a `node:crypto` wrapper preserving the
   `{ ciphertext, auth_tag }` / `{ plaintext, auth_ok }` snake_case API.
2. Delete `lib/aes-ccm.cc`, `binding.gyp`, `build/`, `.travis.yml`,
   `docker-compose.yml`, `.env-dist`.
3. `package.json`: drop the `install`/`configure`/`build` scripts, drop both
   runtime `dependencies` (`node-gyp-install`, `node-pre-gyp`), drop the
   `binary` block, add `engines.node >= 18`, add `files`.
4. Emit a one-shot `DeprecationWarning` on require, so the signal reaches people
   who do not read READMEs.
5. Extend `test/test.js` with the edge cases the native version got wrong.
6. **Drop every remaining dependency.** Move the suite from `ava` to the
   built-in `node:test` + `node:assert`, and drop `semistandard` and `nyc`.
   `devDependencies` is now empty and `package-lock.json` is deleted - a
   zero-dependency package does not need one. Coverage comes from
   `node --test --experimental-test-coverage` (reports 100%).

   The test cases themselves are unchanged: same 32 cases, same vectors, same
   assertions, only the harness calls were rewritten (`t.is` ->
   `assert.strictEqual`, `t.true(x)` -> `assert.strictEqual(x, true)`,
   `t.throws(fn, { instanceOf: TypeError })` ->
   `assert.throws(fn, { name: 'TypeError' })`).

   No linter replaces `semistandard`. Switching to `standard` itself would
   remove no dependency and would strip the semicolons from every file in the
   repo, which is a much larger diff than a cleanup warrants.
7. `.github/workflows/test.yml` - run the suite on Node 20/22/24/26. There is
   no install step at all, which is what proves the package now works on the
   platforms where it previously could not even build.

   `engines.node` stays at `>=18` because the runtime code only uses `crypto`
   and `Buffer` and genuinely works there, but the matrix starts at 20: that is
   where `node:test` became stable and where `--experimental-test-coverage`
   exists. Node 18 and 20 are both EOL anyway.
8. `.github/workflows/publish.yml` - publish via npm **trusted publishing**
   (OIDC), which also produces a signed provenance attestation.

### Provenance via trusted publishing

Requirements, from <https://docs.npmjs.com/trusted-publishers>:

- npm CLI **11.5.1+** and Node **22.14.0+** on the runner. The `ubuntu-latest`
  image still ships npm 10.x, so the workflow upgrades npm explicitly.
- `permissions: id-token: write` in the publishing workflow. This is the part
  that lets Actions mint the OIDC token.
- GitHub-hosted runners only; self-hosted is not supported.
- `repository.url` in `package.json` must exactly match the GitHub repository.
  Ours already does (`git+https://github.com/erdtman/aes-ccm.git`).
- **No `--provenance` flag and no `NPM_TOKEN` secret.** Provenance is generated
  automatically for trusted publishing when both repo and package are public,
  and the publish authenticates over OIDC rather than with a stored token.

Registered at: npmjs.com -> Packages -> `aes-ccm` -> Settings -> Trusted
publishing -> Trusted Publisher -> Select your publisher -> **GitHub Actions**.
All fields are case-sensitive, and npm does not validate any of them on save - a
typo only surfaces at publish time, often as a misleading `E404`.

| Field | Value | Verified against |
| --- | --- | --- |
| Organization or user | `erdtman` | GitHub API `owner.login`, type User |
| Repository | `aes-ccm` | GitHub API `name`; `full_name` is `erdtman/aes-ccm` |
| Workflow filename | `publish.yml` | the file at `.github/workflows/publish.yml` |
| Environment name | leave blank | the workflow uses no GitHub environment |
| Allowed actions | see below | - |
| Allow npm dist-tag | leave off | off by default; nothing here sets a dist-tag |

Workflow filename is the filename only, never
`.github/workflows/publish.yml`, and the file must live in
`.github/workflows/`.

**Allowed actions: keep the stage-only default.** A configuration created now -
i.e. after 2026-09-03 - defaults to `npm stage publish` only, and `publish.yml`
runs `npm stage publish` to match, so nothing extra needs ticking. `npm publish`
does **not** need to be allowed.

`npm stage publish` is a subcommand, not a flag on `npm publish`. It uploads the
version without making it public; a maintainer then approves it with
`npm stage approve` or on npmjs.com. Approval needs interactive 2FA and
deliberately cannot use an OIDC token, so CI cannot approve its own release -
which is the point. The other stage subcommands are `npm stage list`,
`npm stage view` and `npm stage reject`.

**Timing.** A new trusted-publisher configuration **expires if its first
successful publish does not happen within 2 days**, and an expired one cannot be
edited - it has to be deleted and recreated. So register it only once the code is
ready to go out, at the end of Phase 2, not before.

## Phase 2 - document the exit (done)

Rewrote `README.md`:

- Deprecation banner and the reason.
- Migration section with before/after for `encrypt` and `decrypt`, including the
  one real porting trap: **`node:crypto` throws from `final()` on tag mismatch,
  where this module returned `{ auth_ok: false }`.** Anyone migrating needs the
  `try`/`catch`.
- The cipher-per-key-length mapping, so `aes-192-ccm` is discoverable.
- The CCM constraints that the old addon silently let through: mandatory
  `setAAD` with `plaintextLength`, single `update()` call, 7-13 byte IV, tag
  length from the allowed set, auth tag set before `update()` on decrypt.

This was a prerequisite for Phase 3, not optional: the `DeprecationWarning` in
`lib/index.js` links to `#migration`, which did not exist until this landed, and
the README is what npm shows as the package page for 1.1.0.

Every snippet in it was executed, not just written: the `after` encrypt produces
byte-identical output to the `before`, the decrypt round-trips, and the
documented message-size cap was checked against the real limit, which is
`2 ** (8 * (15 - ivLength)) - 1` rather than `2 ** (8 * (15 - ivLength))`.

## Phase 3 - publish and deprecate (done, 2026-11-20)

1. Registered the trusted publisher on npmjs.com.
2. Tagged `v1.1.0` at `9670c8b` and cut the GitHub release, which triggered
   `publish.yml`. It staged the version
   (`65121651-1f67-46b9-ba14-d0716ce76d29`), and the staged publish was then
   approved with 2FA.
3. Provenance verified, and the open question it carried is now settled:
   **automatic provenance does survive the staged-approval flow.** The run
   logged `Signed provenance statement with source and build information from
   GitHub Actions` and published it to the Sigstore transparency log at
   `logIndex=4030284015`. The attestation on the registry resolves to
   `pkg:npm/aes-ccm@1.1.0`, built from `refs/tags/v1.1.0` in
   `https://github.com/erdtman/aes-ccm` via `.github/workflows/publish.yml` on a
   GitHub-hosted runner. No fallback to direct publishing was needed, so the
   trusted publisher stays stage-only.

   The published tarball is 4 files and 3.8 kB - `LICENSE`, `README.md`,
   `lib/index.js`, `package.json` - with shasum
   `667309d1ad59eb29cad40930b89512492d7f7e3b`, identical to the local
   `npm pack --dry-run`.
4. Deprecated afterwards, so 1.1.0 carries the notice too:

   ```
   NPM_CONFIG_REGISTRY=https://registry.npmjs.org/ npm deprecate aes-ccm@"*" "Deprecated: Node's built-in crypto supports AES-CCM natively - use crypto.createCipheriv('aes-128-ccm', key, iv, { authTagLength }). See https://github.com/erdtman/aes-ccm#migration"
   ```

   The registry override matters: this machine has `NPM_CONFIG_REGISTRY` pointed
   at an internal Artifactory mirror, and **trusted publishing only covers
   publishing**, so `npm deprecate` needs ordinary auth and would otherwise go
   to the wrong registry. Publishing from CI sidesteps the same problem.

   The npmjs.com web UI can deprecate a package, but its documented flow has no
   message field, and the message is the point - so the CLI is the only way to
   do this properly.
5. Verified: all 11 published versions carry the message, 1.1.0 included, the
   migration link is in it, and the attestation and tarball are intact.

**One consequence worth knowing.** `npm deprecate aes-ccm@"*"` sets the
per-version `deprecated` field on every version, which is what npm prints at
install time. It does **not** set the package-level field, so `aes-ccm` is still
listed in npm search. Removing it from search needs the whole-package form -
`npm deprecate aes-ccm "<message>"` with no version range, or the website's
Deprecate package button. Whether that preserves or clobbers the per-version
messages is untested, so it was left alone.

## Phase 4 - decommission

1. **The GitHub PAT in `.env`: done, nothing to revoke.** The file held a
   `NODE_PRE_GYP_GITHUB_TOKEN` - a GitHub PAT that `node-pre-gyp-github` used to
   upload prebuilt binaries to GitHub Releases, not an npm token - as a 40-hex
   classic token dating from 2019.

   It was never committed: no commit on any branch or tag touches `.env`, and
   the value appears zero times across every object in the repo, because
   `.gitignore` caught it from the start. It did not appear in the account's
   classic-PAT list either, and an authenticated read against
   `https://api.github.com/user` returned `401 Bad credentials`, so it had
   already been revoked or expired. Confirmed dead rather than assumed, then the
   file was deleted. Nothing in the repo reads that variable any more.
2. Set the package to require 2FA and disallow tokens. There are no npm
   automation tokens left to revoke - the account's token list is empty, which
   also independently confirms the release went out over OIDC, since no token
   existed to publish with. Do this only now that the Phase 3 deprecate has gone
   through; earlier it would have locked out the credential that step needed.
3. Leave the old GitHub release binaries in place - someone pinned to 1.0.x on
   Node 14 still resolves against them.
4. Archive the repository **last**, after the README lands and anyone with
   questions has had a window to file an issue. Archived repositories are
   read-only.

## Behavior changes in 1.1.0

The wrapper is stricter in several places, all on paths where the native module
produced garbage rather than correct results.

| Input | Native 1.0.12 | 1.1.0 |
| --- | --- | --- |
| Key length other than 16/32 | silently treated as AES-256; OpenSSL return values were never checked, so output was garbage | `TypeError: unsupported key length ...` |
| 24-byte key | same silent AES-256 mishandling | works, as AES-192-CCM |
| Tag length not in {4,6,8,10,12,14,16} | unchecked, garbage tag | `Invalid authentication tag length` |
| IV outside 7-13 bytes | unchecked | `Invalid initialization vector` |
| Empty plaintext | `((0 - 1) / 16 + 1) * 16` underflows `size_t`, giving an enormous allocation | works; empty ciphertext plus valid tag |
| Failed decrypt | `{ auth_ok: false, plaintext: <uninitialized heap memory> }` | `{ auth_ok: false, plaintext: <empty buffer> }` |

That last row is a fix, not just a change: the old code handed a buffer of
never-written `new unsigned char[]` memory back to JS on every authentication
failure.
