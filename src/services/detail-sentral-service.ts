import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class DetailSentralService extends BaseService {
  async getSentralById<T>(id_sentral:any, kode_pengelola:any): Promise<T> {
    return this.get(`${url}pembangkit`, {id_sentral: id_sentral, kode_pengelola: kode_pengelola});
  }

  async getMesinById<T>(id:any): Promise<T> {
    return this.get(`${url}mesin/${id}`);
  }
  async updateMesinById<T>(id:any, nilai_asset_awal:number, masa_manfaat:number, tahun_nilai_perolehan:number,latitude: string, longitude: string, updated_by: string | null): Promise<T> {
    return this.put(`${url}mesin/${id}`, {nilai_asset_awal: nilai_asset_awal, masa_manfaat: masa_manfaat, tahun_nilai_perolehan: tahun_nilai_perolehan, latitude: latitude, longitude: longitude, updated_by: updated_by});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
}