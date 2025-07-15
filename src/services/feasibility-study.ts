import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class FeasibilityStudyService extends BaseService {
  async getSentralById<T>(id:any): Promise<T> {
    return this.get(`${url}pembangkit/${id}`);
  }
  async getAsumsiFeasibilitySentral<T>(uuid_sentral:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-asumsi-sentral`, {uuid_sentral: uuid_sentral});
  }
  async getKalkulasiFeasibilitySentral<T>(uuid_sentral:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-kalkulasi-sentral`, {uuid_sentral: uuid_sentral});
  }
  async getAsumsiFeasibility<T>(uuid_mesin: number, tahun_realisasi: number): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-asumsi`, {uuid_mesin: uuid_mesin, tahun_realisasi: tahun_realisasi});
  }
  async getDataTeknis<T>(uuid_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-data-teknis`, {uuid_mesin: uuid_mesin});
  }
  async getDataFinansial<T>(uuid_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-data-finansial`, {uuid_mesin: uuid_mesin});
  }
  async getHasilSimulasi<T>(uuid_mesin:any, status: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/simulasi-cod-fs`, {uuid_mesin: uuid_mesin, status: status});
  }
  async getKalkulasiFeasibility<T>(uuid_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/fs-kalkulasi`, {uuid_mesin: uuid_mesin});
  }
  async getTypePeriodic<T>(kode_jenis_pembangkit:any): Promise<T> {
    return this.get(`${url}kertas-kerja-detail/type-periodic`, {kode_jenis_pembangkit: kode_jenis_pembangkit});
  }
  async getMesinById<T>(id:any): Promise<T> {
    return this.get(`${url}mesin-realisasi/${id}`);
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
  async downloadExcelFS<T>(tahunBerjalan: any, tahunRealisasi: any, idMesin: any): Promise<T> {
    return this.getFile(`${url}kertas-kerja-detail/export-template-fs-detail`, { tahun: tahunBerjalan, tahun_realisasi: tahunRealisasi, uuid_mesin: idMesin }, 'arraybuffer');
  }
}