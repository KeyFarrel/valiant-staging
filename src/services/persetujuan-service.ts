import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;
export default class LamanService extends BaseService {
  // Persetujuan All
  async getPersetujuanKertasKerja<T>(param: any): Promise<T> {
    return this.post(url + "persetujuan/all-persetujuan", param);
  }
  async getPersetujuanFS<T>(param: any): Promise<T> {
    return this.post(url + "persetujuan/all-persetujuan-fs", param);
  }
  // Persetujuan Update
  async updateStatusKK<T>(param: any): Promise<T> {    
    return this.patch(url + "persetujuan/update-status", param);
  }
  async updateStatusFS<T>(param: any): Promise<T> {    
    return this.patch(url + "persetujuan/update-status-fs", param);
  }
  // Persetujuan Detail
  async getPersetujuanKKSentral<T>(param: any): Promise<T> {    
    return this.get(url + "persetujuan/detail-persetujuan", param);
  }
  async getPersetujuanFSSentral<T>(param: any): Promise<T> {    
    return this.get(url + "persetujuan/detail-persetujuan-fs", param);
  }
  async getDetailMesinAppr<T>(param: any): Promise<T> {    
    return this.get(url + "persetujuan/detail-sentral", param);
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
}
