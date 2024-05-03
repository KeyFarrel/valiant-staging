import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class PetaService extends BaseService {
  async getPetaSentral<T>(param: any): Promise<T> {
    return this.post(url + "peta/all-sentral", param);
  }

  async getBestPerformance<T>(param: any): Promise<T> {
    return this.get(url + "peta/best-asset", param);
  }
  
  async getYearListBPA<T>(): Promise<T> {
    return this.get(`${url}filter/best-performance-assets`);
  }

  async getPembina<T>(param: any): Promise<T> {
    return this.get(url + "filter/combo-pembina", param);
  }

  async getPengelola<T>(): Promise<T> {
    return this.get(url + "filter/combo-pengelola");
  }

  async getJenisKit<T>(param: any): Promise<T> {
    return this.get(url + "filter/combo-jenis-kit", param);
  }

  async getUmurMesin<T>(param: any): Promise<T> {
    return this.get(url + "filter/combo-umur-mesin", param);
  }

  async getSentralByKode<T>(id: any): Promise<T> {
    return this.get(`${url}peta/detail-sentral?kode_sentral=${id}`);
  }

  async getMesinByKode<T>(id: any): Promise<T> {
    return this.get(`${url}peta/detail-mesin?kode_sentral=${id}`);
  }

}
