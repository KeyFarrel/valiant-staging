import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class PerbaruiDataService extends BaseService {
  async getMesinById<T>(id:any): Promise<T> {
    return this.get(`${url}mesin-realisasi/${id}`);
  }
  async getPembangkitByKode<T>(kode_sentral: string): Promise<T> {
    return this.get(`${url}pembangkit/by-kode`, {kode_sentral: kode_sentral});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getCheckIntegrasi<T>(tahun: any, uuid_mesin: any): Promise<T> {
    return this.get(`${url}filter/data-integrasi`, {tahun: tahun, uuid_mesin: uuid_mesin});
  }
  async getAsumsiParameterData<T>(tahun_realisasi:any, uuidMesin:any, tahun: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-parameter`, {tahun_realisasi: tahun_realisasi, uuid_mesin: uuidMesin, tahun: tahun});
  }
  async getDataTeknisByPeriode<T>(tahun_realisasi:number, uuid_mesin:number): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-teknis-periode`, {tahun_realisasi: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  async getDataTeknisByPeriodeSimulasi1<T>(tahun_realisasi:number, uuid_mesin:number): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-teknis-periode-simulasi`, {tahun_realisasi: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  async getDataTeknisByPeriodeSimulasi2<T>(tahun_realisasi:number, uuid_mesin:number): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-teknis-periode-simulasi2`, {tahun_realisasi: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  async getDataFinansialDetail<T>(tahun_realisasi:any, uuid_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-finansial-detail`, {tahun: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  async getDataFinansialDetailSimulasi1<T>(tahun_realisasi:any, uuid_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-finansial-detail-simulasi`, {tahun: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  async getDataFinansialDetailSimulasi2<T>(tahun_realisasi:any, uuid_mesin:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-finansial-detail-simulasi2`, {tahun: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  // Data Asumsi Parameter Simulasi 1 & 2 value sama
  // Data Teknis Simulasi 1
  async getDataTeknisSimulasi1<T>(tahun: any, uuid_mesin: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-teknis`, {tahun: tahun, uuid_mesin: uuid_mesin});
  }
  // Data Teknis Simulasi 2
  async getDataTeknisSimulasi2<T>(tahun: any, uuid_mesin: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-teknis-simulasi`, {tahun: tahun, uuid_mesin: uuid_mesin});
  }
  // Data Finansial Simulasi 1
  async getDataFinansialSimulasi1<T>(tahun: any, uuid_mesin: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-finansial`, {tahun: tahun, uuid_mesin: uuid_mesin});
  }
  // Data Finansial Simulasi 2
  async getDataFinansialSimulasi2<T>(tahun: any, uuid_mesin: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-finansial-simulasi`, {tahun: tahun, uuid_mesin: uuid_mesin});
  }
  // Hasil Simulasi
  async getHasilSimulasi<T>(uuid_mesin: number, tahun: number, status: number): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/simulasi-cod`, {uuid_mesin: uuid_mesin, tahun: tahun, status: status});
  }
  async downloadSimulasi1Excel<T>(tahun_realisasi: any, uuid_mesin: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/export-template-simulasi1`, {tahun_realisasi: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  async downloadSimulasi2Excel<T>(tahun_realisasi: any, uuid_mesin: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/export-template-simulasi2`, {tahun_realisasi: tahun_realisasi, uuid_mesin: uuid_mesin});
  }
  async createAsumsiMakroPermanent<T>(form_data:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-create`, form_data);
  }
  async updateAsumsiMakroPermanent<T>(form_data:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/asumsi-wacc-update`, form_data);
  }
  async updateParameterTeknisPermanent<T>(form_data:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/parameter-finansial`, form_data);
  }
  async updateDataTeknisPermanent<T>(form_data:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-teknis-create`, form_data);
  }
  async updateDataTeknisSimulasi<T>(form_data:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-teknis-create-simulasi`, form_data);
  }
  async updateDataFinansialPermanent<T>(form_data:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-finansial-create`, form_data);
  }
  async updateDataFinansialSimulasi<T>(form_data:any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/data-finansial-create-simulasi`, form_data);
  }
  async getTypePeriodic<T>(kode_jenis_pembangkit:any): Promise<T> {
    return this.get(`${url}kertas-kerja-detail/type-periodic`, {kode_jenis_pembangkit: kode_jenis_pembangkit});
  }
  async getComboBahanBakar<T>(jenis_pembangkit:any): Promise<T> {
    return this.get(`${url}filter/combo-bahan-bakar`, {jenis_pembangkit: jenis_pembangkit});
  }
}
