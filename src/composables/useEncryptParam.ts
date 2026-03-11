import { reactive } from 'vue';
import { encryptStoragePromise } from '@/utils/app-encrypt-storage';

const nodeMode = import.meta.env.MODE;

export function useEncryptParam() {
  const cache = reactive<Record<string, string>>({});

  async function encryptParam(value: any): Promise<string> {
    const str = String(value);
    if (nodeMode !== 'production') return str;
    if (cache[str]) return cache[str];
    const storage = await encryptStoragePromise;
    const encrypted = await storage.encryptValue(str);
    cache[str] = encrypted;
    return encrypted;
  }

  async function encryptParams(values: any[]): Promise<void> {
    if (nodeMode !== 'production') return;
    const storage = await encryptStoragePromise;
    for (const v of values) {
      const str = String(v);
      if (!cache[str]) {
        cache[str] = await storage.encryptValue(str);
      }
    }
  }

  function getEncrypted(value: any): string {
    const str = String(value);
    if (nodeMode !== 'production') return str;
    return cache[str] || str;
  }

  return { encryptParam, encryptParams, getEncrypted };
}
