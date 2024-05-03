import BaseService from "./base-service";
import router from "@/router";

const url: any = import.meta.env.VITE_API_URL;

export default class AuthService extends BaseService {
  async login<T>(payload: any): Promise<T> {
    try {
      const response: any = await this.post(`${url}auth/login`, payload);
      const role_id = response.data.role_id;
      if (role_id) {
        localStorage.setItem('role_id', role_id);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
  async profile<T>(): Promise<T> {
    return this.get(`${url}user/me`);
  }
  checkRole(){
    const levelSentral = localStorage.getItem('level_sentral');
    const idPembina = localStorage.getItem('id_pembina');
    const kodePengelola = localStorage.getItem('kode_pengelola');
    if(levelSentral != 0 && idPembina != 0 && kodePengelola != 0){
      return 'Sentral';
    }else if(levelSentral == 0 && idPembina != 0 && kodePengelola != 0){
      return 'Pembina';
    }else if(levelSentral == 0 && idPembina == 0 && kodePengelola != 0){
        return 'Pengelola';
    }else{
      return 'Admin';
    }
}
  logOut(){
    localStorage.clear();
    router.push("/login");
  }
  async getPermission<T>(param: any): Promise<T> {
    return this.get(`${url}permission`, param);
  }
  async findAllMenu<T>(): Promise<T> {
    return this.get(`${url}rolepermission?limit=1000`);
  }
  async loginSSO<T>(): Promise<T> {
    return this.get(`${url}auth/get-urlsso`);
  }
  async verifikasiSSO<T>(code: string): Promise<T> {
    return this.post(`${url}auth/verifikasi-token`, { code: code });
  }
}

