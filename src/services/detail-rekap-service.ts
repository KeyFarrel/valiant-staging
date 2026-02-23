import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class DetailRekapService extends BaseService {
  async getMesinById<T>(id:any): Promise<T> {
    return this.get(`${url}mesin-realisasi/${id}`);
  }
  async getPembangkitByKode<T>(kode_sentral: string): Promise<T> {
    return this.get(`${url}pembangkit/by-kode`, {kode_sentral: kode_sentral});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getTypePeriodic<T>(kode_jenis_pembangkit:any): Promise<T> {
    return this.get(`${url}kertas-kerja-detail/type-periodic`, {kode_jenis_pembangkit: kode_jenis_pembangkit});
  }
  // Mesin
  async getAsumsiParameter<T>(tahunRealisasi:any, uuidMesin:any, tahun: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-parameter`, {tahun_realisasi: tahunRealisasi, uuid_mesin: uuidMesin, tahun: tahun});
  }
  async getDataTeknis<T>(tahun:any, uuid_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-teknis-final`, {tahun: tahun, uuid_mesin: uuid_mesin});
  }
  async getDataFinansial<T>(tahun:any, uuid_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-finansial-final`, {tahun: tahun, uuid_mesin: uuid_mesin});
  }
  async getComboBahanBakar<T>(jenis_pembangkit:any): Promise<T> {
    return this.get(`${url}filter/combo-bahan-bakar`, {jenis_pembangkit: jenis_pembangkit});
  }
  async getTahunRealisasi<T>(uuid_mesin:any): Promise<T> {
    return this.get(`${url}filter/tahun-permesin`, {uuid_mesin: uuid_mesin});
  }
  async getHasilSimulasi<T>(uuid_mesin: number, tahun: number, status: number): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/simulasi-cod`, {uuid_mesin: uuid_mesin, tahun: tahun, status: status});
  }
  // Sentral
  async getSentralById<T>(id:any): Promise<T> {
    return this.get(`${url}pembangkit/${id}`);
  }
  async getAsumsiMakroSentral<T>(tahun_realisasi:any, uuid_sentral:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-parameter-sentral`, {tahun_realisasi: tahun_realisasi, uuid_sentral: uuid_sentral});
  }
  async getDataTeknisSentral<T>(tahun_realisasi:any, uuid_sentral:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-teknis-sentral`, {tahun_realisasi: tahun_realisasi, uuid_sentral: uuid_sentral});
  }
  async getDataFinansialSentral<T>(tahun_realisasi:any, uuid_sentral:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-finansial-sentral`, {tahun_realisasi: tahun_realisasi, uuid_sentral: uuid_sentral});
  }
  async getListTahunAsumsi<T>(): Promise<T> {
    return this.get(`${url}filter/best-performance-assets`);
  }
}
