[![test](https://github.com/erdtman/aes-ccm/actions/workflows/test.yml/badge.svg)](https://github.com/erdtman/aes-ccm/actions/workflows/test.yml)

# aes-ccm

AES CCM module using OpenSSL

## Installation

`npm install aes-ccm --save`

## encrypt
```js
const ccm = require('aes-ccm');

const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
const iv = Buffer.from('101112131415161718191a1b', 'hex');
const plain = Buffer.from('Secret message!', 'utf8');
const aad = Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex');
const tagLength = 16;

const res = ccm.encrypt(key, iv, plain, aad, tagLength);

console.log('ciphertext: ' + res.ciphertext.toString('hex'));
console.log('tag: ' + res.auth_tag.toString('hex'));
```

## decrypt
``` js
const ccm = require('aes-ccm');

const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
const iv = Buffer.from('101112131415161718191a1b', 'hex');
const aad = Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex');
const ciphertext = Buffer.from('90f640f8b4e61c30d646b3a686dfe8', 'hex');
const tag = Buffer.from('d159ba0b957a1adc9b798cd9cb0d45c1', 'hex');

const dres = ccm.decrypt(key, iv, ciphertext, aad, tag);

console.log('ok: ' + dres.auth_ok);
console.log('plaintext: ' + dres.plaintext.toString('utf8'));
```

## References
Copied from [node-aes-ccm](https://github.com/particle-iot/node-aes-ccm).
