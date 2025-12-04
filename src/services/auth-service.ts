import BaseService from "./base-service";
import { encryptStoragePromise } from '@/utils/app-encrypt-storage';
import CryptoJS from "crypto-js";

const nodeMode: any = import.meta.env.MODE;
const url: any = import.meta.env.VITE_API_URL;

export default class AuthService extends BaseService {
  async login<T>(payload: any): Promise<T> {
    try {
      const encryptStorage = await encryptStoragePromise;
      const response: any = await this.post(`${url}auth/login`, payload);
      if (response.message === 'Anda terdeteksi menggunakan device baru, silahkan lakukan verifikasi OTP'){
        return response;
      }
      console.log("Login Response:", response);
      const namaPegawai = response.data.nama_pegawai;
      const levelSentral =
        response.data.id_sentral === "" || response.data.id_sentral === "0"
          ? 0
          : response.data.id_sentral;

      const dataString = `${levelSentral}:${namaPegawai}`;
      const hash = CryptoJS.HmacSHA512(
        dataString,
        (window as any).userHashSecretKey(),
      ).toString();

      const setStorage = (storage: any) => {
        storage.setItem("nama_pegawai", namaPegawai);
        storage.setItem("level_sentral", levelSentral);
        storage.setItem("user_hash", hash);
      };

      if (!response.data.is_reset){
        const storage =
          nodeMode === "production" ? encryptStorage : localStorage;
        setStorage(storage);
      }

      console.log(response);
      return response;
    } catch (error) {
      console.error("Login Error", error);
      throw error;
    }
  }
  async profile<T>(): Promise<T> {
    return this.get(`${url}user/me`);
  }
  async preProfile<T>(): Promise<T> {
    return this.get(`${url}user/pre-me`);
  }

  async privacyPolicy<T>(isAccept: boolean): Promise<T> {
    return this.post(`${url}auths/privacy-policy`, { is_accept: isAccept });
  }

  async logout<T>(): Promise<T> {
    const result = await this.post(`${url}auths/logout`, { message: "logout" });
    
    const { useSessionStore } = await import('@/store/storeSession');
    const sessionStore = useSessionStore();
    sessionStore.invalidateSession();
    
    return result as T;
  }
  async getPermission<T>(param: any): Promise<T> {
    return this.get(`${url}permission`, param);
  }
  async checkStatusToken<T>(): Promise<T> {
    return this.get(`${url}auths/check-status`);
  }
  async getMenu<T>(): Promise<T> {
    return this.get(`${url}menu`);
  }
  async loginSSO<T>(): Promise<T> {
    return this.get(`${url}auth/get-urlsso`);
  }
  async checkStatus<T>(): Promise<T> {
    return this.get(`${url}auth/status`);
  }
  async verifikasiSSO<T>(code: string): Promise<T> {
    return this.post(`${url}auth/verifikasi-token`, { code: code });
  }
  async generateCaptcha<T>(): Promise<T> {
    return this.post(`${url}auth/generate-captcha`, null);
  }
  async getPublicKey<T>(): Promise<T> {
    return this.post(`${url}auth/public-key`);
  }
  async verifCaptcha<T>(payload: {
    captcha_key: string;
    tile_x: number;
  }): Promise<T> {
    return this.post(`${url}auth/verify-captcha`, payload);
  }
  async changePassword<T>(
    oldPassword: string,
    newPassword: string,
    token: string,
  ): Promise<T> {
    return this.post(`${url}user/change-password`, {
      password_old: oldPassword,
      password_new: newPassword,
      token: token,
    });
  }
  async changePrePassword<T>(
    oldPassword: string,
    newPassword: string,
    token: string,
  ): Promise<T> {
    return this.post(`${url}user/pre-change-password`, {
      password_old: oldPassword,
      password_new: newPassword,
      token: token,
    });
  }
  async resendDeviceOtp<T>(email: string): Promise<T> {
    return this.post(`${url}auth/generate-otp-device`, { email: email });
  }
  async verifyDeviceOtp<T>(email: string, otp: string): Promise<T> {
    return this.post(`${url}auth/verify-otp-device`, { email: email, otp: otp });
  }
}
