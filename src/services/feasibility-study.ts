import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class FeasibilityStudyService extends BaseService {
  async getSentralById<T>(id:any): Promise<T> {
    return this.get(`${url}pembangkit/${id}`);
  }
  async getAsumsiFeasibilitySentral<T>(id_sentral:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-asumsi-sentral`, {id_sentral: id_sentral});
  }
  async getKalkulasiFeasibilitySentral<T>(id_sentral:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-kalkulasi-sentral`, {id_sentral: id_sentral});
  }
  async getAsumsiFeasibility<T>(id_mesin: number, tahun_realisasi: number): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-asumsi`, {id_mesin: id_mesin, tahun_realisasi: tahun_realisasi});
  }
  async getDataTeknis<T>(id_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-data-teknis`, {id_mesin: id_mesin});
  }
  async getDataFinansial<T>(id_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-data-finansial`, {id_mesin: id_mesin});
  }
  async getHasilSimulasi<T>(id_mesin:any, status: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/simulasi-cod-fs`, {id_mesin: id_mesin, status: status});
  }
  async getKalkulasiFeasibility<T>(id_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-kalkulasi`, {id_mesin: id_mesin});
  }
  async getTypePeriodic<T>(kode_jenis_pembangkit:any): Promise<T> {
    return this.get(`${url}kertas-kerja-detail/type-periodic`, {kode_jenis_pembangkit: kode_jenis_pembangkit});
  }
  async getMesinById<T>(id:any): Promise<T> {
    return this.get(`${url}/mesin/${id}`);
  }
  async getPembangkitByKode<T>(kode_sentral: string): Promise<T> {
    return this.get(`${url}pembangkit/by-kode`, {kode_sentral: kode_sentral});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getComboBahanBakar<T>(jenis_pembangkit:any): Promise<T> {
    return this.get(`${url}filter/combo-bahan-bakar`, {jenis_pembangkit: jenis_pembangkit});
  }
}