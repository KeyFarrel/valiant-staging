import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class LihatCAPEXService extends BaseService {
  async getMesinById<T>(id:any): Promise<T> {
    return this.get(`${url}mesin/${id}`);
  }
  async getPembangkitByKode<T>(kode_sentral: string): Promise<T> {
    return this.get(`${url}pembangkit/by-kode`, {kode_sentral: kode_sentral});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getAsumsiParameterData<T>(tahun_realisasi:any, id_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-parameter`, {tahun_realisasi: tahun_realisasi, id_mesin: id_mesin});
  }
  async getAnggaranDetailCAPEX<T>(tahun_realisasi:any, id_mesin:any): Promise<T> {
    return this.get(`${url}laman/data/anggaran/capex`, {tahun: tahun_realisasi, id_mesin: id_mesin});
  }
  async getTotalReplacement<T>(tahun_realisasi:any, id_mesin:any): Promise<T> {
    return this.get(`${url}laman/data/anggaran/capex-replacement`, {tahun: tahun_realisasi, id_mesin: id_mesin});
  }
  async getTahunAnggaran<T>(): Promise<T> {
    return this.get(`${url}/laman/data/anggaran/tahun`);
  }
}