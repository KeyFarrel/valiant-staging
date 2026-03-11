import { isWasmReady, initWasm } from '@/services/helper/encryption';

type DecryptFailureHandler = () => Promise<void> | void;
let _decryptFailureHandler: DecryptFailureHandler = () => {
  localStorage.clear();
  document.cookie.split(';').forEach(c => {
    document.cookie = c.trimStart().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  });
  window.location.href = '/login';
};

export function setDecryptFailureHandler(handler: DecryptFailureHandler): void {
  _decryptFailureHandler = handler;
}

const SALT = new TextEncoder().encode('valiant-encrypt-storage-salt-v1');
const PBKDF2_ITERATIONS = 600000;
const IV_LENGTH = 12;

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(secretKey: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretKey),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

class WebCryptoStorage {
  private key: CryptoKey;

  constructor(key: CryptoKey) {
    this.key = key;
  }

  async encryptValue(value: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoded = new TextEncoder().encode(value);
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      encoded
    );
    const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.byteLength);
    return arrayBufferToBase64Url(combined.buffer);
  }

  async decryptValue(value: string): Promise<string> {
    const combined = base64UrlToUint8Array(value);
    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  }

  async setItem(key: string, value: any): Promise<void> {
    const serialized = JSON.stringify(value);
    const encrypted = await this.encryptValue(serialized);
    localStorage.setItem(key, encrypted);
  }

  async getItem(key: string): Promise<any> {
    const encrypted = localStorage.getItem(key);
    if (encrypted === null) return null;
    try {
      const decrypted = await this.decryptValue(encrypted);
      return JSON.parse(decrypted);
    } catch {
      // Data lama (format EncryptStorage) tidak bisa didecrypt — force re-login
      await _decryptFailureHandler();
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

let instance: WebCryptoStorage | null = null;

export const encryptStoragePromise = (async () => {
  try {
    if (!isWasmReady()) {
      await initWasm();
    }
  } catch (error) {
    console.warn("WASM init failed, falling back to env secret key:", error);
  }

  if (instance) return instance;

  const secretKey =
    (typeof (window as any).encryptStorageSecretKey === 'function'
      ? (window as any).encryptStorageSecretKey()
      : null) ||
    import.meta.env.VITE_ENCRYPT_SECRET_KEY;

  if (!secretKey) {
    throw new Error("No encryption secret key available (WASM or env)");
  }

  const key = await deriveKey(secretKey);
  instance = new WebCryptoStorage(key);
  return instance;
})();