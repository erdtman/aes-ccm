[![test](https://github.com/erdtman/aes-ccm/actions/workflows/test.yml/badge.svg)](https://github.com/erdtman/aes-ccm/actions/workflows/test.yml)

# aes-ccm

> ## ⚠️ Deprecated
>
> **Node's built-in `crypto` module supports AES-CCM natively, so this package
> is no longer needed.** Use `crypto.createCipheriv` directly — see
> [Migration](#migration) below.
>
> Version 1.1.0 is the final release. It drops the native OpenSSL addon and is
> now a thin, dependency-free wrapper over `node:crypto`, so that existing
> installs keep working while you migrate. The API is unchanged.

AES-CCM for Node, originally implemented as a native OpenSSL addon because
`crypto` did not expose CCM at the time. It does now.

## Installation

```
npm install aes-ccm
```

Requires Node 18 or later. There is nothing to compile and there are no
dependencies.

## Migration

Replace this package with `node:crypto`. The mapping is direct, with one real
trap: **`crypto` throws when the auth tag does not match, where this package
returned `auth_ok: false`.** Anything relying on that flag needs a `try`/`catch`.

Pick the cipher by key length: 16 bytes → `aes-128-ccm`, 24 → `aes-192-ccm`,
32 → `aes-256-ccm`.

### encrypt

```js
// before
const ccm = require('aes-ccm');
const res = ccm.encrypt(key, iv, plain, aad, 16);
// res.ciphertext, res.auth_tag

// after
const crypto = require('crypto');

const cipher = crypto.createCipheriv('aes-128-ccm', key, iv, { authTagLength: 16 });
cipher.setAAD(aad, { plaintextLength: plain.length });
const ciphertext = Buffer.concat([cipher.update(plain), cipher.final()]);
const authTag = cipher.getAuthTag();
```

### decrypt

```js
// before
const ccm = require('aes-ccm');
const dres = ccm.decrypt(key, iv, ciphertext, aad, tag);
if (dres.auth_ok) { use(dres.plaintext); }

// after
const crypto = require('crypto');

const decipher = crypto.createDecipheriv('aes-128-ccm', key, iv, { authTagLength: tag.length });
decipher.setAuthTag(tag);
decipher.setAAD(aad, { plaintextLength: ciphertext.length });

try {
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  use(plaintext);
} catch {
  // Authentication failed. crypto throws here; aes-ccm returned auth_ok: false.
}
```

### Things to watch for

- **`setAAD` is mandatory for CCM**, and its `plaintextLength` must be set — even
  when the aad itself is empty.
- **The message must be passed in a single `update()` call.** CCM does not
  support streaming it in chunks.
- **The IV must be 7 to 13 bytes.** Its length caps the message size, at
  `2 ** (8 * (15 - ivLength)) - 1` bytes — so a 13-byte IV allows at most 65535
  bytes, and a 7-byte IV allows a little under 2**64.
- **The auth tag length must be one of 4, 6, 8, 10, 12, 14, 16.**
- **On decrypt, set the auth tag before `update()`.**

The old addon silently accepted violations of most of these and produced garbage,
because it never checked an OpenSSL return value. `crypto` throws instead, as
does 1.1.0.

## API

The compatibility API kept by 1.1.0, for reference while migrating.

### encrypt

```js
const ccm = require('aes-ccm');

const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
const iv = Buffer.from('101112131415161718191a1b', 'hex');
const plain = Buffer.from('Secret message!', 'utf8');
const aad = Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex');
const tagLength = 16;

const res = ccm.encrypt(key, iv, plain, aad, tagLength);

console.log(`ciphertext: ${res.ciphertext.toString('hex')}`);
console.log(`tag: ${res.auth_tag.toString('hex')}`);
```

### decrypt

```js
const ccm = require('aes-ccm');

const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
const iv = Buffer.from('101112131415161718191a1b', 'hex');
const aad = Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex');
const ciphertext = Buffer.from('90f640f8b4e61c30d646b3a686dfe8', 'hex');
const tag = Buffer.from('d159ba0b957a1adc9b798cd9cb0d45c1', 'hex');

const dres = ccm.decrypt(key, iv, ciphertext, aad, tag);

console.log(`ok: ${dres.auth_ok}`);
console.log(`plaintext: ${dres.plaintext.toString('utf8')}`);
```

`decrypt` reports authentication failure as `auth_ok: false` rather than
throwing, and returns an empty `plaintext` buffer in that case.

## References

- [DEPRECATION-PLAN.md](DEPRECATION-PLAN.md) — why this package is being retired.
- [Node `crypto` CCM documentation](https://nodejs.org/api/crypto.html#ccm-mode)
- Originally copied from [node-aes-ccm](https://github.com/particle-iot/node-aes-ccm).
