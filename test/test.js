'use strict';

const test = require('node:test');
const assert = require('node:assert');
const ccm = require('../');

test('encrypt 01 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('202122232425262728292a2b2c2d2e2f3031323334353637', 'hex'),
    aad: Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex'),
    ct: Buffer.from('e3b201a9f5b71a7a9b1ceaeccd97e70b6176aad9a4428aa5', 'hex'),
    tag: Buffer.from('484392fbc1b09951', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  assert.strictEqual(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 02 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000004030201A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('08090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('0001020304050607', 'hex'),
    ct: Buffer.from('72C91A36E135F8CF291CA894085C87E3CC15C439C9E43A3B', 'hex'),
    tag: Buffer.from('A091D56E10400916', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  assert.strictEqual(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 03 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000003020100A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('08090A0B0C0D0E0F101112131415161718191A1B1C1D1E', 'hex'),
    aad: Buffer.from('0001020304050607', 'hex'),
    ct: Buffer.from('588C979A61C663D2F066D0C2C0F989806D5F6B61DAC384', 'hex'),
    tag: Buffer.from('17E8D12CFDF926E0', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  assert.strictEqual(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 04 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000005040302A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('08090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20', 'hex'),
    aad: Buffer.from('0001020304050607', 'hex'),
    ct: Buffer.from('51B1E5F44A197D1DA46B0F8E2D282AE871E838BB64DA859657', 'hex'),
    tag: Buffer.from('4ADAA76FBD9FB0C5', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  assert.strictEqual(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 05 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000006050403A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('A28C6865939A9A79FAAA5C4C2A9D4A91CDAC8C', 'hex'),
    tag: Buffer.from('96C861B9C9E61EF1', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  assert.strictEqual(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 06 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000007060504A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3E', 'hex'),
    tag: Buffer.from('51E83F077D9C2D93', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  assert.strictEqual(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 07 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000007060504A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3F', 'hex'),
    tag: Buffer.from('51E83F077D9C2D94', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.equals(test.ct), false);
  assert.strictEqual(res.auth_tag.equals(test.tag), false);
});

test('encrypt 08 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000007060504A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3F', 'hex'),
    tag: Buffer.from('51E83F077D9C2D93', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length / 2
  );

  assert.strictEqual(res.ciphertext.equals(test.ct), false);
  assert.strictEqual(res.auth_tag.equals(test.tag), false);
});

test('encrypt 09 - CCM-128-AES-256', () => {
  const test = {
    key: Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
    iv: Buffer.from('000000000000000000000000', 'hex'),
    plain: Buffer.from('00000000000000000000000000000000', 'hex'),
    aad: Buffer.from('00000000000000000000000000000000', 'hex'),
    ct: Buffer.from('c1944044c8e7aa95d2de9513c7f3dd8c', 'hex'),
    tag: Buffer.from('87314e9c1fa01abe6a6415943dc38521', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  assert.strictEqual(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 10 - CCM-128-AES-256', () => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('202122232425262728292a2b2c2d2e2f3031323334353637', 'hex'),
    aad: Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex'),
    ct: Buffer.from('04f883aeb3bd0730eaf50bb6de4fa2212034e4e41b0e75e5', 'hex'),
    tag: Buffer.from('9bba3f3a107f3239bd63902923f80371', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  assert.strictEqual(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 11 - CCM-128-AES-256', () => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', 'hex'),
    aad: Buffer.from('202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f', 'hex'),
    ct: Buffer.from('24d8a38e939d2710cad52b96fe6f82010014c4c43b2e55c557d69f0402e0d6f206c53d6cbd3f1c3c6de5dcdcad9fb74f25741dea741149fe4278a0cc24741e8658cc0523b8d7838c60fb1de4b7c3941f5b26dea9322aa29656ec37ac18a9b108a6f38b7917f5a9c398838b22afbd17252e96694a9e6237964a0eae21c0a6e15215a0e82022926be97268249599e456e05029c3ebc07d78fc5b4a0862e04e68c29514c7bdafc4b52e04833bf30622e4eb42504a44a9dcbc774752de7bb82891ad1eba9dc3281422a8aba8654268d3d9c81705f4c5a531ef856df5609a159af738eb753423ed2001b8f20c23725f2bef18c409f7e52132341f27cb8f0e79894dd9', 'hex'),
    tag: Buffer.from('ebb1fa9d28ccfe21bdfea7e6d91e0bab', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.toString('hex'), test.ct.toString('hex'));
  assert.strictEqual(res.auth_tag.toString('hex'), test.tag.toString('hex'));
});

test('encrypt 12 - CCM-128-AES-256', () => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('202122232425262728292a2b2c2d2e2f3031323334353637', 'hex'),
    aad: Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex'),
    ct: Buffer.from('04f883aeb3bd0730eaf50bb6de4fa2212034e4e41b0e75e4', 'hex'),
    tag: Buffer.from('9bba3f3a107f3239bd63902923f80373', 'hex')
  };

  const res = ccm.encrypt(
    test.key,
    test.iv,
    test.plain,
    test.aad,
    test.tag.length
  );

  assert.strictEqual(res.ciphertext.equals(test.ct), false);
  assert.strictEqual(res.auth_tag.equals(test.tag), false);
});

test('decrypt 01 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('202122232425262728292a2b2c2d2e2f3031323334353637', 'hex'),
    aad: Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex'),
    ct: Buffer.from('e3b201a9f5b71a7a9b1ceaeccd97e70b6176aad9a4428aa5', 'hex'),
    tag: Buffer.from('484392fbc1b09951', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), test.plain.toString('hex'));
});

test('decrypt 02 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000004030201A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('08090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('0001020304050607', 'hex'),
    ct: Buffer.from('72C91A36E135F8CF291CA894085C87E3CC15C439C9E43A3B', 'hex'),
    tag: Buffer.from('A091D56E10400916', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), test.plain.toString('hex'));
});

test('decrypt 03 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000003020100A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('08090A0B0C0D0E0F101112131415161718191A1B1C1D1E', 'hex'),
    aad: Buffer.from('0001020304050607', 'hex'),
    ct: Buffer.from('588C979A61C663D2F066D0C2C0F989806D5F6B61DAC384', 'hex'),
    tag: Buffer.from('17E8D12CFDF926E0', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), test.plain.toString('hex'));
});

test('decrypt 04 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000005040302A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('08090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F20', 'hex'),
    aad: Buffer.from('0001020304050607', 'hex'),
    ct: Buffer.from('51B1E5F44A197D1DA46B0F8E2D282AE871E838BB64DA859657', 'hex'),
    tag: Buffer.from('4ADAA76FBD9FB0C5', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), test.plain.toString('hex'));
});

test('decrypt 05 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000006050403A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('A28C6865939A9A79FAAA5C4C2A9D4A91CDAC8C', 'hex'),
    tag: Buffer.from('96C861B9C9E61EF1', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), test.plain.toString('hex'));
});

test('decrypt 06 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000007060504A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3E', 'hex'),
    tag: Buffer.from('51E83F077D9C2D93', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), test.plain.toString('hex'));
});

test('decrypt 07 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000007060504A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3F', 'hex'),
    tag: Buffer.from('51E83F077D9C2D94', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, false);
});

test('decrypt 08 - CCM-128-AES-128', () => {
  const test = {
    key: Buffer.from('C0C1C2C3C4C5C6C7C8C9CACBCCCDCECF', 'hex'),
    iv: Buffer.from('00000007060504A0A1A2A3A4A5', 'hex'),
    plain: Buffer.from('0C0D0E0F101112131415161718191A1B1C1D1E1F', 'hex'),
    aad: Buffer.from('000102030405060708090A0B', 'hex'),
    ct: Buffer.from('DCF1FB7B5D9E23FB9D4E131253658AD86EBDCA3F', 'hex'),
    tag: Buffer.from('51E83F077D9C2D93', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, false);
});

test('decrypt 09 - CCM-128-AES-256', () => {
  const test = {
    key: Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex'),
    iv: Buffer.from('000000000000000000000000', 'hex'),
    plain: Buffer.from('00000000000000000000000000000000', 'hex'),
    aad: Buffer.from('00000000000000000000000000000000', 'hex'),
    ct: Buffer.from('c1944044c8e7aa95d2de9513c7f3dd8c', 'hex'),
    tag: Buffer.from('87314e9c1fa01abe6a6415943dc38521', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), test.plain.toString('hex'));
});

test('decrypt 10 - CCM-128-AES-256', () => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('202122232425262728292a2b2c2d2e2f3031323334353637', 'hex'),
    aad: Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex'),
    ct: Buffer.from('04f883aeb3bd0730eaf50bb6de4fa2212034e4e41b0e75e5', 'hex'),
    tag: Buffer.from('9bba3f3a107f3239bd63902923f80371', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), test.plain.toString('hex'));
});

test('decrypt 11 - CCM-128-AES-256', () => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', 'hex'),
    aad: Buffer.from('202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f', 'hex'),
    ct: Buffer.from('24d8a38e939d2710cad52b96fe6f82010014c4c43b2e55c557d69f0402e0d6f206c53d6cbd3f1c3c6de5dcdcad9fb74f25741dea741149fe4278a0cc24741e8658cc0523b8d7838c60fb1de4b7c3941f5b26dea9322aa29656ec37ac18a9b108a6f38b7917f5a9c398838b22afbd17252e96694a9e6237964a0eae21c0a6e15215a0e82022926be97268249599e456e05029c3ebc07d78fc5b4a0862e04e68c29514c7bdafc4b52e04833bf30622e4eb42504a44a9dcbc774752de7bb82891ad1eba9dc3281422a8aba8654268d3d9c81705f4c5a531ef856df5609a159af738eb753423ed2001b8f20c23725f2bef18c409f7e52132341f27cb8f0e79894dd9', 'hex'),
    tag: Buffer.from('ebb1fa9d28ccfe21bdfea7e6d91e0bab', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), test.plain.toString('hex'));
});

test('decrypt 12 - CCM-128-AES-256', () => {
  const test = {
    key: Buffer.from('404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f', 'hex'),
    iv: Buffer.from('101112131415161718191a1b', 'hex'),
    plain: Buffer.from('202122232425262728292a2b2c2d2e2f3031323334353637', 'hex'),
    aad: Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex'),
    ct: Buffer.from('04f883aeb3bd0730eaf50bb6de4fa2212034e4e41b0e75e4', 'hex'),
    tag: Buffer.from('9bba3f3a107f3239bd63902923f80373', 'hex')
  };

  const dres = ccm.decrypt(
    test.key,
    test.iv,
    test.ct,
    test.aad,
    test.tag
  );

  assert.strictEqual(dres.auth_ok, false);
});

test('encrypt/decrypt - AES-192 key', () => {
  const key = Buffer.from('404142434445464748494a4b4c4d4e4f5051525354555657', 'hex');
  const iv = Buffer.from('101112131415161718191a1b', 'hex');
  const plain = Buffer.from('202122232425262728292a2b2c2d2e2f', 'hex');
  const aad = Buffer.from('000102030405060708090a0b', 'hex');

  const res = ccm.encrypt(key, iv, plain, aad, 16);
  const dres = ccm.decrypt(key, iv, res.ciphertext, aad, res.auth_tag);

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), plain.toString('hex'));
});

test('encrypt/decrypt - empty plaintext', () => {
  const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
  const iv = Buffer.from('101112131415161718191a1b', 'hex');
  const plain = Buffer.alloc(0);
  const aad = Buffer.from('000102030405060708090a0b', 'hex');

  const res = ccm.encrypt(key, iv, plain, aad, 16);
  assert.strictEqual(res.ciphertext.length, 0);
  assert.strictEqual(res.auth_tag.length, 16);

  const dres = ccm.decrypt(key, iv, res.ciphertext, aad, res.auth_tag);
  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.length, 0);
});

test('encrypt/decrypt - empty aad', () => {
  const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
  const iv = Buffer.from('101112131415161718191a1b', 'hex');
  const plain = Buffer.from('202122232425262728292a2b2c2d2e2f', 'hex');
  const aad = Buffer.alloc(0);

  const res = ccm.encrypt(key, iv, plain, aad, 16);
  const dres = ccm.decrypt(key, iv, res.ciphertext, aad, res.auth_tag);

  assert.strictEqual(dres.auth_ok, true);
  assert.strictEqual(dres.plaintext.toString('hex'), plain.toString('hex'));
});

test('decrypt - failed auth returns no plaintext', () => {
  const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
  const iv = Buffer.from('101112131415161718191a1b', 'hex');
  const aad = Buffer.from('000102030405060708090a0b0c0d0e0f10111213', 'hex');
  const ct = Buffer.from('e3b201a9f5b71a7a9b1ceaeccd97e70b6176aad9a4428aa5', 'hex');
  const wrongTag = Buffer.from('484392fbc1b09952', 'hex');

  const dres = ccm.decrypt(key, iv, ct, aad, wrongTag);

  assert.strictEqual(dres.auth_ok, false);
  assert.strictEqual(dres.plaintext.length, 0);
});

test('encrypt - unsupported key length throws', () => {
  const key = Buffer.alloc(20);
  const iv = Buffer.from('101112131415161718191a1b', 'hex');
  const plain = Buffer.from('202122232425262728292a2b2c2d2e2f', 'hex');
  const aad = Buffer.alloc(0);

  assert.throws(() => ccm.encrypt(key, iv, plain, aad, 16), {
    name: 'TypeError',
    message: 'unsupported key length 20, expected 16, 24 or 32 bytes'
  });
});

test('decrypt - unsupported key length throws', () => {
  const key = Buffer.alloc(20);
  const iv = Buffer.from('101112131415161718191a1b', 'hex');
  const ct = Buffer.from('202122232425262728292a2b2c2d2e2f', 'hex');
  const aad = Buffer.alloc(0);

  assert.throws(() => ccm.decrypt(key, iv, ct, aad, Buffer.alloc(16)), { name: 'TypeError' });
});

test('encrypt - invalid auth tag length throws', () => {
  const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
  const iv = Buffer.from('101112131415161718191a1b', 'hex');
  const plain = Buffer.from('202122232425262728292a2b2c2d2e2f', 'hex');
  const aad = Buffer.alloc(0);

  assert.throws(() => ccm.encrypt(key, iv, plain, aad, 9));
});

test('encrypt - invalid iv length throws', () => {
  const key = Buffer.from('404142434445464748494a4b4c4d4e4f', 'hex');
  const plain = Buffer.from('202122232425262728292a2b2c2d2e2f', 'hex');
  const aad = Buffer.alloc(0);

  assert.throws(() => ccm.encrypt(key, Buffer.alloc(14), plain, aad, 16));
});
