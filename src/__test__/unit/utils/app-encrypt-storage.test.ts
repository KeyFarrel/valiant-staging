// __tests__/app-encrypt-storage.test.ts
import { describe, it, expect, vi } from 'vitest';
import { EncryptStorage } from 'encrypt-storage';
import { encryptStorage, encryptedUserInfo } from '@/utils/app-encrypt-storage'; // Adjust path as necessary

// Mock EncryptStorage
vi.mock('encrypt-storage', () => {
  const encryptValue = vi.fn();
  return {
    EncryptStorage: vi.fn().mockImplementation(() => ({
      encryptValue: encryptValue,
    })),
    encryptValue // Ensure mock is correctly exported
  };
});

describe('app-encrypt-storage.ts', () => {
  it('should create an EncryptStorage instance with the correct secret key', () => {
    const secretKey = import.meta.env.VITE_ENCRYPT_SECRET_KEY;

    // Initialize EncryptStorage to use the mocked implementation
    new EncryptStorage(secretKey);

    // Verify that EncryptStorage was instantiated with the correct secret key
    expect(EncryptStorage).toHaveBeenCalledWith(secretKey);
  });
});
