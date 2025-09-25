import { EncryptStorage } from 'encrypt-storage';
import { isWasmReady, initWasm } from '@/services/helper/encryption';

let instance: EncryptStorage | null = null;

export const encryptStoragePromise = (async () => {
  if (!isWasmReady()) {
    await initWasm();
  }
  if (instance) return instance;

  const secretKey = (window as any).encryptStorageSecretKey();
  if (!secretKey) {
    throw new Error("encryptStorageSecretKey is not available");
  }
  instance = new EncryptStorage(secretKey);
  return instance;
})();