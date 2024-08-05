import { EncryptStorage } from 'encrypt-storage';
const secretKey = 'V4L1anT-s3CreT-k3Y';
export const encryptStorage = new EncryptStorage(secretKey);

export const encryptedUserInfo = {
  token: encryptStorage.encryptValue('token'),
  role_id: encryptStorage.encryptValue('role_id'),
  nama_pegawai: encryptStorage.encryptValue('nama_pegawai'),
  level_id: encryptStorage.encryptValue('level_id'),
  level_sentral: encryptStorage.encryptValue('level_sentral'),
  id_pembina: encryptStorage.encryptValue('id_pembina'),
  kode_pengelola: encryptStorage.encryptValue('kode_pengelola'),
}