import BaseService from "./base-service";
import { encryptStoragePromise } from '@/utils/app-encrypt-storage';
import CryptoJS from "crypto-js";
import axios from "axios";

const nodeMode: any = import.meta.env.MODE;
const url: any = import.meta.env.VITE_API_URL;

export default class AuthService extends BaseService {
  async login<T>(payload: any): Promise<T> {
    try {
      const encryptStorage = await encryptStoragePromise;
      const response: any = await this.post(`${url}auth/login`, payload, true);
      if (response.message === 'Anda terdeteksi menggunakan device baru, silahkan lakukan verifikasi OTP'){
        return response;
      }
      const token = response.data.token;
      let menu;
      if (!response.data.is_reset) {
        const responseMenu: any = await axios.get(`${url}menu`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        menu = responseMenu.data.data;
      }
      const namaPegawai = response.data.nama_pegawai;
      const levelSentral =
        response.data.id_sentral === "" || response.data.id_sentral === "0"
          ? 0
          : response.data.id_sentral;
      let level: string;
      let role: string;

      if (response.data.id_level === "3") {
        level = "Sentral";
      } else if (response.data.id_level === "4") {
        level = "Pembina";
      } else if (response.data.id_level === "2") {
        level = "Pengelola";
      } else if (response.data.id_level === "1") {
        level = "Admin";
      } else if (response.data.id_level === "5") {
        level = "Pusat";
      }

      if (response.data.role_id === "138") {
        role = "Staff";
      } else if (response.data.role_id === "140") {
        role = "Approver";
      } else if (response.data.role_id === "141") {
        role = "Super Admin";
      } else if (response.data.role_id === "142") {
        role = "Monitoring";
      } else if (response.data.role_id === "143") {
        role = "Input";
      }

      const dataString = `${role}:${level}:${levelSentral}:${namaPegawai}:${JSON.stringify(menu)}`;
      const hash = CryptoJS.HmacSHA512(
        dataString,
        (window as any).userHashSecretKey(),
      ).toString();

      const setStorage = (storage: any) => {
        storage.setItem("token", token);
        storage.setItem("level", level);
        storage.setItem("role", role);
        storage.setItem("nama_pegawai", namaPegawai);
        storage.setItem("level_sentral", levelSentral);
        storage.setItem("menu", JSON.stringify(menu));
        storage.setItem("user_hash", hash);
      };

      if (response.data.is_reset) {
        sessionStorage.setItem("token", token);
      } else {
        const storage =
          nodeMode === "production" ? encryptStorage : localStorage;
        setStorage(storage);
      }

      console.log(response);
      return response;
    } catch (error) {
      console.error("Login Error", error);
      if(error.response.data.message === "Anda belum mengisi privacy policy"){
        sessionStorage.setItem("token", error.response.data.data.token);
      }
      throw error;
    }
  }
  async profile<T>(): Promise<T> {
    return this.get(`${url}user/me`);
  }
  async checkLevel() {
    const encryptStorage = await encryptStoragePromise;
    const level =
      nodeMode === "production"
        ? encryptStorage.getItem("level")
        : localStorage.getItem("level");
    return level;
  }

  async checkRole() {
    const encryptStorage = await encryptStoragePromise;
    const role =
      nodeMode === "production"
        ? encryptStorage.getItem("role")
        : localStorage.getItem("role");
    return role;
  }

  async logout<T>(): Promise<T> {
    return this.post(`${url}auths/logout`, { message: "logout" });
  }
  async getPermission<T>(param: any): Promise<T> {
    return this.get(`${url}permission`, param);
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
    return this.post(`${url}auth/generate-captcha`);
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
  async resendDeviceOtp<T>(email: string): Promise<T> {
    return this.post(`${url}auth/generate-otp-device`, { email: email });
  }
  async verifyDeviceOtp<T>(email: string, otp: string): Promise<T> {
    return this.post(`${url}auth/verify-otp-device`, { email: email, otp: otp });
  }
}
