'use strict';

const ccm = require('../');

const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
const iv = Buffer.from('101112131415161718191a1b', 'hex');
const plain = Buffer.from('Secret message!', 'utf8');
const aad = Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex');
const tagLength = 16;

const res = ccm.encrypt(key, iv, plain, aad, tagLength);

console.log(`ciphertext: ${res.ciphertext.toString('hex')}`);
console.log(`tag: ${res.auth_tag.toString('hex')}`);
