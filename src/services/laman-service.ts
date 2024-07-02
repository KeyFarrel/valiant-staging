import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;
export default class LamanService extends BaseService {

  async getTotalDaya<T>(): Promise<T> {
    return this.get(`${url}laman/total-daya`);
  }
  async getSebaranUnit<T>(): Promise<T> {
    return this.get(`${url}laman/sebaran-unit-mesin`);
  }
  async getMesinBaru<T>(page?:any, limit?:any, search?:any): Promise<T> {
    return this.get(`${url}laman/mesin-baru`, {page: page, limit: limit,search:search});
  }
  async getMesinBelumInput<T>(page: number, limit: number, kodePengelola: string[], search: string): Promise<T> {
    return this.post(`${url}laman/mesin-belum-terinput`, {page: page, limit: limit, kode_pengelola: kodePengelola, search: search});
  }
  async getKategoriPembangkit<T>(): Promise<T> {
    return this.get(`${url}laman/kategori-pembangkit`);
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getDataAnggaran<T>(search: any, tahun_sampai: any, tahun_dari: any): Promise<T> {
    return this.get(`${url}laman/data/anggaran`, {search: search, tahun_sampai: tahun_sampai, tahun_dari: tahun_dari});
  }
  async getPeriodeTahun<T>(): Promise<T> {
    return this.get(`${url}filter/combo-tahun`);
  }
  // Laman Data Finansial
  async getDataFinansial<T>(search: any, tahun: any, page:any, limit:any): Promise<T> {
    return this.get(`${url}laman/data/finansial?tahun=${tahun}`, {search: search, page: page, limit: limit});
  }
  // Laman Data Teknis
  async getDataTeknis<T>(search: any, page: any, limit: any, tahun_dari: any, tahun_sampai: any): Promise<T> {
    return this.get(`${url}laman/data/teknis`, { search: search,page: page, limit: limit, tahun_dari: tahun_dari, tahun_sampai: tahun_sampai });
  }
  async getInfoSFC<T>(): Promise<T> {
    return this.get(
      `${url}laman/data/teknis/info-sfc`
    );
  }
  async getChartDaya<T>(): Promise<T> {
    return this.get(`${url}dashboard/grafik/perbandingan-daya`);
  }
  async getTahunSelected<T>(): Promise<T> {
    return this.get(`${url}filter/combo-tahun-max`);
  }
  async getListTahun<T>(): Promise<T> {
    return this.get(`${url}filter/combo-tahun-data`);
  }
  async getChartKategori<T>(kategori:any, id_daya:any): Promise<T> {
    return this.get(`${url}dashboard/grafik/sebaran-unit`, {kategori: kategori, id_daya: id_daya});
  }
  // Laman Analitik
  async getCAPEXEAF<T>(kode_jenis_kit: string, tahun_realisasi: number): Promise<T> {
    return this.get(`${url}grafik/laman/finansial/eaf`, {kode_jenis_kit: kode_jenis_kit, tahun_realisasi: tahun_realisasi});
  }
async getListTahunAnalitik<T>(): Promise<T> {
    return this.get(`${url}filter/combo-analitik`);
  }

}
