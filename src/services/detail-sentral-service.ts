import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class DetailSentralService extends BaseService {
  async getSentralById<T>(uuid:any, kode_pengelola:any): Promise<T> {
    return this.get(`${url}pembangkit`, {uuid: uuid, kode_pengelola: kode_pengelola});
  }
  
  async uploadPhoto<T>(file: any): Promise<T> {
    return this.postFile(`${url}mutasiasset/upload-file`, file);
  }
  async getPhoto<T>(file: string): Promise<T> {
    return this.getFile(`${url}mutasiasset/download/${file}`, {}, 'arraybuffer');
  }
  async getMesinById<T>(id:any): Promise<T> {
    return this.get(`${url}mesin/${id}`);
  }
  async updateMesinById<T>(uuid_mesin:any, nilai_asset_awal:number, masa_manfaat:number, tahun_nilai_perolehan:number,latitude: string, longitude: string, photo1?: any): Promise<T> {
    return this.post(`${url}mesin/${uuid_mesin}`, {nilai_asset_awal: nilai_asset_awal, masa_manfaat: masa_manfaat, tahun_nilai_perolehan: tahun_nilai_perolehan, latitude: latitude, longitude: longitude, photo1: photo1});
  }
  async updateSentral<T>(uuid:any, photo: any): Promise<T> {
    return this.post(`${url}pembangkit/${uuid}`, {photo: photo});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
}