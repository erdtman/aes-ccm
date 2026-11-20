'use strict';

const ccm = require('../');

const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
const iv = Buffer.from('101112131415161718191a1b', 'hex');
const aad = Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex');
const ciphertext = Buffer.from('90f640f8b4e61c30d646b3a686dfe8', 'hex');
const tag = Buffer.from('d159ba0b957a1adc9b798cd9cb0d45c1', 'hex');

const dres = ccm.decrypt(key, iv, ciphertext, aad, tag);

console.log(`ok: ${dres.auth_ok}`);
console.log(`plaintext: ${dres.plaintext.toString('utf8')}`);
