import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class InputAsumsiParameterService extends BaseService {
  async getMesinById<T>(id:any): Promise<T> {
    return this.get(`${url}mesin-realisasi/${id}`);
  }
  async getPembangkitByKode<T>(kode_sentral: string): Promise<T> {
    return this.get(`${url}pembangkit/by-kode`, {kode_sentral: kode_sentral});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getAsumsiMakroData<T>(tahun_realisasi:any, id_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-parameter`, {tahun_realisasi: tahun_realisasi, id_mesin: id_mesin});
  }
  async getComboBahanBakar<T>(jenis_pembangkit:any): Promise<T> {
    return this.get(`${url}filter/combo-bahan-bakar`, {jenis_pembangkit: jenis_pembangkit});
  }
  async getStatusRealisasiById<T>(id_mesin: any): Promise<T> {
    return this.get(`${url}pembangkit/status-realisasi-by-mesin`, {id_mesin: id_mesin});
  }
  async createAsumsi<T>(formAsumsi: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-create`, formAsumsi);
  }
  async updateAsumsi<T>(formAsumsi: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-wacc-update`, formAsumsi);
  }
  async createParameter<T>(formParameter: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/parameter-finansial`, formParameter);
  }
}