import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class DetailSentralService extends BaseService {
  async getSentralById<T>(id_sentral:any, kode_pengelola:any): Promise<T> {
    return this.get(`${url}pembangkit`, {id_sentral: id_sentral, kode_pengelola: kode_pengelola});
  }
  
  async uploadPhoto<T>(file: any): Promise<T> {
    return this.postFile(`${url}mutasiasset/s3-amazon-upload-file`, file);
  }
  async getPhoto<T>(file: string): Promise<T> {
    return this.get(`${url}mutasiasset/s3-amazon-download/${file}`, {}, 'arraybuffer');
  }
  async getMesinById<T>(id:any): Promise<T> {
    return this.get(`${url}mesin/${id}`);
  }
  async updateMesinById<T>(id:any, nilai_asset_awal:number, masa_manfaat:number, tahun_nilai_perolehan:number,latitude: string, longitude: string, photo1?: any): Promise<T> {
    return this.patch(`${url}mesin/${id}`, {nilai_asset_awal: nilai_asset_awal, masa_manfaat: masa_manfaat, tahun_nilai_perolehan: tahun_nilai_perolehan, latitude: latitude, longitude: longitude, photo1: photo1});
  }
  async updateSentral<T>(id:any, photo: any): Promise<T> {
    return this.patch(`${url}pembangkit/${id}`, {photo: photo});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
}