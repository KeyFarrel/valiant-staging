import BaseService from "./base-service";
import router from "@/router";
import { encryptStorage } from "@/utils/app-encrypt-storage";

const nodeMode: any = import.meta.env.MODE;
const url: any = import.meta.env.VITE_API_URL;

export default class AuthService extends BaseService {
  setUserInfo(){

  }
  async login<T>(payload: any): Promise<T> {
    try {
      const response: any = await this.post(`${url}auth/login`, payload);
      const roleId = response.data.role_id;
      const token = response.data.token;
      const namaPegawai = response.data.nama_pegawai;
      const levelID = response.data.id_level;
      const levelSentral = response.data.id_sentral === '' || response.data.id_sentral === '0' ? 0 : response.data.id_sentral;
      const idPembina = response.data.id_pembina === '' || response.data.id_pembina === '0' ? 0 : response.data.id_pembina;
      const kodePengelola = response.data.kode_pengelola === '' || response.data.kode_pengelola === 'ALL' ? 0 : response.data.kode_pengelola;
      if (nodeMode === 'production'){
        encryptStorage.setItem('token', token);
        encryptStorage.setItem('role_id', roleId);
        encryptStorage.setItem('nama_pegawai', namaPegawai);
        encryptStorage.setItem('level_id', levelID);
        encryptStorage.setItem('level_sentral', levelSentral);
        encryptStorage.setItem('id_pembina', idPembina);
        encryptStorage.setItem('kode_pengelola', kodePengelola);
      } else {
        localStorage.setItem('token', token);
        localStorage.setItem('role_id', roleId);
        localStorage.setItem('nama_pegawai', namaPegawai);
        localStorage.setItem('level_id', levelID);
        localStorage.setItem('level_sentral', levelSentral);
        localStorage.setItem('id_pembina', idPembina);
        localStorage.setItem('kode_pengelola', kodePengelola);
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
  async profile<T>(): Promise<T> {
    return this.get(`${url}user/me`);
  }
  checkLevel(){
    const levelSentral = nodeMode === 'production' ? encryptStorage.getItem('level_sentral') : localStorage.getItem('level_sentral');
    const idPembina = nodeMode === 'production' ? encryptStorage.getItem('id_pembina') : localStorage.getItem('id_pembina');
    const kodePengelola = nodeMode === 'production' ? encryptStorage.getItem('kode_pengelola') : localStorage.getItem('kode_pengelola');
    if (levelSentral != 0 && idPembina != 0 && kodePengelola != 0){
      return 'Sentral';
    } else if(levelSentral == 0 && idPembina != 0 && kodePengelola != 0){
      return 'Pembina';
    } else if(levelSentral == 0 && idPembina == 0 && kodePengelola != 0){
        return 'Pengelola';
    } else{
      return 'Admin';
    }
  }

  checkRole(){
    const roleId = nodeMode === 'production' ? encryptStorage.getItem('role_id') : localStorage.getItem('role_id');
    if(roleId == 138){
      return 'Staff';
    }else if(roleId == 140){
      return 'Approver';
    }else if(roleId == 141){
        return 'Super Admin';
    }else{
      return 'Monitoring';
    }
  }

  logOut(){
    nodeMode === 'production' ? encryptStorage.clear() : localStorage.clear();
    router.push("/login");
  }
  async getPermission<T>(param: any): Promise<T> {
    return this.get(`${url}v1/permission`, param);
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

