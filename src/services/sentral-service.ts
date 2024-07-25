import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class SentralService extends BaseService {

  async getSentralData<T>(kode_pengelola: any , page: any, limit: any, search?: any): Promise<T> {
    return this.post(`${url}pembangkit/all-no-pembina`, {pengelola: kode_pengelola, page: page, limit: limit, search: search});
  }
  async getComboJenisKitData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-jenis-kit`);
  }
  async getComboBahanBakarData<T>(jenis_pembangkit:any): Promise<T> {
    return this.get(`${url}filter/combo-bahan-bakar`, {jenis_pembangkit: jenis_pembangkit});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getNilaiSentral<T>(): Promise<T> {
    return this.get(`${url}pembangkit/sentral-nilai`);
  }
  async getNilaiMesin<T>(): Promise<T> {
    return this.get(`${url}pembangkit/mesin-nilai`);
  }
    async getSuggestionSentral<T>(): Promise<T> {
    return this.get(`${url}filter/combo-sentral`);
  }
}