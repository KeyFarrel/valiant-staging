import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class RekapService extends BaseService {

  async getSentralData<T>(sentral: string, pengelola: Array<string>, jenis_kit: Array<string>, id_daya: any, kondisi_mesin: Array<string>, umur: Array<string>, page: number, limit: number): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/all-rekap-kertas-kerja`, {sentral: sentral, pengelola: pengelola, jenis_kit: jenis_kit, id_daya: id_daya, kondisi_mesin: kondisi_mesin, umur: umur, page: page, limit: limit});
  }
  async uploadEvidence<T>(file: any): Promise<T> {
    return this.postFile(`${url}mutasiasset/upload-minio`, file);
  }
  async getEvidencePath<T>(id_mesin: string, tahun: string, status_fs: any): Promise<T> {
    return this.get(`${url}evidence`, {id_mesin: id_mesin, tahun: tahun, status_fs: status_fs},);
  }
  async downloadEvidence<T>(file: string): Promise<T> {
    return this.get(`${url}mutasiasset/view-dokumen`, {id_dokumen: file}, 'arraybuffer');
  }
  async updateEvidencePath<T>(id_mesin: any, tahun_upload: any, dokumen_evidence: any, status_fs: any): Promise<T> {
    return this.post(`${url}evidence`, {id_mesin: id_mesin, tahun_upload: tahun_upload, dokumen_evidence: dokumen_evidence, status_fs: status_fs});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getMesinByIdSentral<T>(id_sentral: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/all-rekap-kertas-kerja-mesin`, {id_sentral: id_sentral});
  }
  async getComboKategoriPembangkit<T>(): Promise<T> {
    return this.get(`${url}filter/combo-jenis-kit`);
  }
  async getComboUmurMesin<T>(): Promise<T> {
    return this.get(`${url}filter/combo-umur-mesin`);
  }
  async getComboKondisiMesin<T>(): Promise<T> {
    return this.get(`${url}filter/combo-kondisi-mesin`);
  }
  async getComboIRR<T>(): Promise<T> {
    return this.get(`${url}filter/combo-irr`);
  }
  async getNilaiSentral<T>(tahun_berjalan: any): Promise<T> {
    return this.get(`${url}pembangkit/sentral-nilai`, {tahun: tahun_berjalan});
  }
  async getNilaiMesin<T>(tahun_berjalan:any): Promise<T> {
    return this.get(`${url}pembangkit/mesin-nilai`, {tahun: tahun_berjalan});
  }
  async getMesinById<T>(idMesin: any): Promise<T> {
    return this.get(`${url}mesin-realisasi/${idMesin}`);
  }
  async getStatusFSSentral<T>(): Promise<T> {
    return this.get(`${url}pembangkit/status-fs-sentral`);
  }
  async getStatusFSMesin<T>(): Promise<T> {
    return this.get(`${url}pembangkit/status-fs`);
  }
  async getStatusRealisasiSentral<T>(): Promise<T> {
    return this.get(`${url}pembangkit/status-realisasi-sentral`);
  }
  async getStatusRealisasiMesin<T>(): Promise<T> {
    return this.get(`${url}pembangkit/status-realisasi`);
  }
  async getCheckInputAsumsiSentral<T>(): Promise<T> {
    return this.get(`${url}kertas-kerja-detail/all-rekap-asumsi`);
  }
  async getCheckInputAsumsiMesin<T>(): Promise<T> {
    return this.get(`${url}kertas-kerja-detail/all-rekap-asumsi-mesin`);
  }
  async getSuggestionSentral<T>(): Promise<T> {
    return this.get(`${url}filter/combo-sentral`);
  }
  async downloadTemplateExcel<T>(id_mesin: any, tahun: any): Promise<T> {
    return this.get(`${url}kertas-kerja-detail/export-template-awal`, {id_mesin: id_mesin, tahun: tahun});
  }
}
