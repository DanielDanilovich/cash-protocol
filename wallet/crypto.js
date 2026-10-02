/* CASH Protocol - Cryptographic Core */
'use strict';

const CashCrypto = (() => {
  const SUBTLE = crypto.subtle;
  const ENC = new TextEncoder();
  const PBKDF2_ITER = 2400000;
  const GCM_IV_BYTES = 16;

  const b64 = {
    fromBuf(buf) {
      const bytes = new Uint8Array(buf);
      let bin = '';
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      return btoa(bin);
    },
    toBuf(s) {
      const bin = atob(s);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return bytes.buffer;
    }
  };

  const hex = {
    fromBuf(buf) {
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
  };

  async function pbkdf2Bits(password, salt, lengthBits) {
    const km = await SUBTLE.importKey('raw', ENC.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
    return SUBTLE.deriveBits(
      { name: 'PBKDF2', salt, iterations: PBKDF2_ITER, hash: 'SHA-512' },
      km, lengthBits
    );
  }

  async function deriveKey(password, salt, usages) {
    const bits = await pbkdf2Bits(password, salt, 256);
    return SUBTLE.importKey('raw', bits, { name: 'AES-GCM' }, false, usages);
  }

  async function sha256(text) {
    const buf = await SUBTLE.digest('SHA-256', ENC.encode(text));
    return hex.fromBuf(buf);
  }

  async function sha512(text) {
    const buf = await SUBTLE.digest('SHA-512', ENC.encode(text));
    return hex.fromBuf(buf);
  }

  async function encrypt(data, password) {
    const pt = ENC.encode(JSON.stringify(data));
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_BYTES));
    const key = await deriveKey(password, salt, ['encrypt']);
    const ct = await SUBTLE.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, pt);
    return {
      salt: b64.fromBuf(salt),
      iv: b64.fromBuf(iv),
      ciphertext: b64.fromBuf(ct),
      version: 'v1.0.0',
      ivBits: 128,
    };
  }

  async function decrypt(blob, password) {
    const salt = b64.toBuf(blob.salt);
    const iv = new Uint8Array(b64.toBuf(blob.iv));
    const ct = b64.toBuf(blob.ciphertext);
    const key = await deriveKey(password, salt, ['decrypt']);
    const pt = await SUBTLE.decrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, ct);
    return JSON.parse(new TextDecoder().decode(pt));
  }

  function randomHex(bytes) {
    const arr = crypto.getRandomValues(new Uint8Array(bytes || 32));
    if (arr.every(b => b === 0) || arr.every(b => b === arr[0])) throw new Error('CSPRNG failure');
    return hex.fromBuf(arr);
  }

  return {
    encrypt, decrypt, sha256, sha512,
    randomHex, randomBytes: (n) => crypto.getRandomValues(new Uint8Array(n)),
    b64, hex,
  };
})();
