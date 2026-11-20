'use strict';

const crypto = require('crypto');

/**
  AES-CCM is supported natively by Node's crypto module. This package is now a
  thin compatibility wrapper over it and is deprecated; see the README for how
  to call crypto directly.
*/
process.emitWarning(
  `aes-ccm is deprecated: Node's crypto module supports AES-CCM natively, e.g. ` +
  `crypto.createCipheriv('aes-128-ccm', key, iv, { authTagLength }). ` +
  `See https://github.com/erdtman/aes-ccm#migration`,
  'DeprecationWarning'
);

const ciphers = {
  16: 'aes-128-ccm',
  24: 'aes-192-ccm',
  32: 'aes-256-ccm'
};

/**
  Pick the AES-CCM variant matching the key size.

  @param key, the key that will be used for the crypto operation.

  @return the Node cipher name for that key length.
*/
function cipherFor (key) {
  const cipher = ciphers[key.length];
  if (!cipher) {
    throw new TypeError(`unsupported key length ${key.length}, expected 16, 24 or 32 bytes`);
  }
  return cipher;
}

/**
  Perform CCM mode AES-128, AES-192 and AES-256 encryption using the provided
  key, IV, plaintext and aad buffers.

  @param key, the key to encrypt with, 16, 24 or 32 bytes
  @param iv, the initialization vector to use for the encryption, 7-13 bytes
  @param plaintext, data to encrypt
  @param aad, additional authenticated data
  @param authTagLength, length of the auth tag, one of 4, 6, 8, 10, 12, 14, 16

  @return object containing "ciphertext" and "auth_tag" buffers.
*/
function encrypt (key, iv, plaintext, aad, authTagLength) {
  const cipher = crypto.createCipheriv(cipherFor(key), key, iv, { authTagLength });
  cipher.setAAD(aad, { plaintextLength: plaintext.length });
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return { ciphertext, auth_tag: cipher.getAuthTag() };
}

/**
  Perform CCM mode AES-128, AES-192 and AES-256 decryption using the provided
  key, IV, ciphertext, aad and auth tag buffers.

  Unlike Node's crypto module, which throws when the auth tag does not match,
  this reports the failure as "auth_ok" being false, as earlier releases of this
  package did.

  @param key, the key to decrypt with, 16, 24 or 32 bytes
  @param iv, the initialization vector used for the encryption, 7-13 bytes
  @param ciphertext, the encrypted data
  @param aad, additional authenticated data
  @param authTag, the auth tag to verify against

  @return object containing a "plaintext" buffer and an "auth_ok" boolean. On
          failure "auth_ok" is false and "plaintext" is empty.
*/
function decrypt (key, iv, ciphertext, aad, authTag) {
  const decipher = crypto.createDecipheriv(cipherFor(key), key, iv, { authTagLength: authTag.length });
  decipher.setAuthTag(authTag);
  decipher.setAAD(aad, { plaintextLength: ciphertext.length });
  try {
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return { plaintext, auth_ok: true };
  } catch (error) {
    return { plaintext: Buffer.alloc(0), auth_ok: false };
  }
}

module.exports = { encrypt, decrypt };
