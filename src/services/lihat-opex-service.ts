import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class LihatOPEXService extends BaseService {
  async getMesinById<T>(id: any): Promise<T> {
    return this.get(`${url}mesin-realisasi/${id}`);
  }
  async getPembangkitByKode<T>(kode_sentral: string): Promise<T> {
    return this.get(`${url}pembangkit/by-kode`, {kode_sentral: kode_sentral});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getAsumsiParameterData<T>(tahun_realisasi: any, uuidMesin: any, tahun: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-parameter`, {tahun_realisasi: tahun_realisasi, uuid_mesin: uuidMesin, tahun: tahun});
  }
  async getAnggaranDetailCAPEX<T>(tahun_realisasi: any, uuid_mesin: any): Promise<T> {
    return this.get(`${url}laman/data/anggaran/capex`, {tahun: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  async getTotalReplacement<T>(tahun_realisasi: any, uuid_mesin: any): Promise<T> {
    return this.get(`${url}laman/data/anggaran/capex-replacement`, {tahun: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  async getOPEXKomponenB<T>(uuid_mesin: any, tahun_realisasi: any): Promise<T> {
    return this.get(`${url}laman/data/anggaran/opex-komponen-b`, {uuid_mesin: uuid_mesin, tahun: tahun_realisasi});
  }
  async getOPEXKomponenC<T>(uuid_mesin: any, tahun_realisasi: any): Promise<T> {
    return this.get(`${url}laman/data/anggaran/opex-komponen-c`, {uuid_mesin: uuid_mesin, tahun: tahun_realisasi});
  }
  async getOPEXKomponenD<T>(uuid_mesin: any, tahun_realisasi: any): Promise<T> {
    return this.get(`${url}laman/data/anggaran/opex-komponen-d`, {uuid_mesin: uuid_mesin, tahun: tahun_realisasi});
  }
  async getTahunAnggaran<T>(): Promise<T> {
    return this.get(`${url}laman/data/anggaran/tahun`);
  }
}