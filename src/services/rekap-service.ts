import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class RekapService extends BaseService {

  async getSentralData<T>(sentral: string, pengelola: Array<string>, jenis_kit: Array<string>, id_daya: any, kondisi_mesin: Array<string>, umur: Array<string>, page: number, limit: number): Promise<T> { //NOSONAR
    return this.post(`${url}kertas-kerja-detail/all-rekap-kertas-kerja`, {sentral: sentral, pengelola: pengelola, jenis_kit: jenis_kit, id_daya: id_daya, kondisi_mesin: kondisi_mesin, umur: umur, page: page, limit: limit});
  }
  async uploadEvidence<T>(file: any): Promise<T> {
    return this.postFile(`${url}mutasiasset/upload-evidence`, file);
  }
  async uploadTemplateAwalKK<T>(file: any): Promise<T> {
    return this.postFile(`${url}kertas-kerja-detail/import-template-awal`, file);
  }
  async uploadTemplateAwalFS<T>(file: any): Promise<T> {
    return this.postFile(`${url}kertas-kerja-detail/import-template-fs`, file);
  }
  async uploadSimulasi1<T>(file: any): Promise<T> {
    return this.postFile(`${url}kertas-kerja-detail/import-template-simulasi1`, file);
  }
  async uploadSimulasi2<T>(file: any): Promise<T> {
    return this.postFile(`${url}kertas-kerja-detail/import-template-simulasi`, file);
  }
  async downloadSimulasi1<T>(tahunBerjalan: any, tahunRealisasi: any, idMesin: any): Promise<T> {
    return this.getFile(`${url}kertas-kerja-detail/export-template-simulasi1`, { tahun: tahunBerjalan, tahun_realisasi: tahunRealisasi, uuid_mesin: idMesin }, 'arraybuffer');
  }
  async downloadSimulasi2<T>(tahunBerjalan: any, tahunRealisasi: any, idMesin: any): Promise<T> {
    return this.getFile(`${url}kertas-kerja-detail/export-template-simulasi2`, { tahun: tahunBerjalan, tahun_realisasi: tahunRealisasi, uuid_mesin: idMesin }, 'arraybuffer');
  }
  async downloadTemplateRekap<T>(tahunBerjalan: any, tahunRealisasi: any, idMesin: any): Promise<T> {
    return this.getFile(`${url}kertas-kerja-detail/export-template-first`, { tahun: tahunBerjalan, tahun_realisasi: tahunRealisasi, uuid_mesin: idMesin }, 'arraybuffer');
  }
  async downloadTemplateFS<T>(tahunBerjalan: any, idMesin: any, kodeJenisPembangkit: any): Promise<T> {
    return this.getFile(`${url}kertas-kerja-detail/export-template-fs`, { tahun: tahunBerjalan, uuid_mesin: idMesin, kode_jenis_pembangkit: kodeJenisPembangkit}, 'arraybuffer');
  }
  async downloadExcelKK<T>(tahunBerjalan: any, tahunRealisasi: any, idMesin: any): Promise<T> {
    return this.getFile(`${url}kertas-kerja-detail/export-template-awal`, { tahun: tahunBerjalan, tahun_realisasi: tahunRealisasi, uuid_mesin: idMesin }, 'arraybuffer');
  }
  async downloadEvidence<T>(file: string): Promise<T> {
    return this.getFile(`${url}mutasiasset/download-evidence/${file}`, {}, 'arraybuffer');
  }
  async getEvidencePath<T>(uuid_mesin: string, tahun: string, status_fs: any): Promise<T> {
    return this.get(`${url}evidence`, {uuid: uuid_mesin, tahun: tahun, status_fs: status_fs});
  }
  async updateEvidencePath<T>(uuid_mesin: any, tahun_upload: any, dokumen_evidence: any, status_fs: any, file_name: string): Promise<T> {
    return this.post(`${url}evidence`, {uuid: uuid_mesin, tahun_upload: tahun_upload, dokumen_evidence: dokumen_evidence, status_fs: status_fs, file_name: file_name});
  }
  async getPengelolaData<T>(): Promise<T> {
    return this.get(`${url}filter/combo-pengelola`);
  }
  async getMesinByIdSentral<T>(uuidSentral: any): Promise<T> {
    return this.post(`${url}kertas-kerja-detail/all-rekap-kertas-kerja-mesin`, {uuid_sentral: uuidSentral});
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
  async getStatusFSSentral<T>(uuidSentral?: string): Promise<T> {
    return this.get(`${url}pembangkit/status-fs-sentral`, uuidSentral ? { uuid: uuidSentral } : undefined);
  }
  async getStatusFSMesin<T>(uuidSentral?: string): Promise<T> {
    return this.get(`${url}pembangkit/status-fs`, uuidSentral ? { uuid: uuidSentral } : undefined);
  }
  async getStatusRealisasiSentral<T>(uuidSentral?: string): Promise<T> {
    return this.get(`${url}pembangkit/status-realisasi-sentral`, uuidSentral ? { uuid: uuidSentral } : undefined);
  }
  async getStatusRealisasiMesin<T>(uuidSentral?: string): Promise<T> {
    return this.get(`${url}pembangkit/status-realisasi`, uuidSentral ? { uuid: uuidSentral } : undefined);
  }
  async getCheckInputAsumsiSentral<T>(uuidSentral?: string): Promise<T> {
    return this.get(`${url}kertas-kerja-detail/all-rekap-asumsi`, uuidSentral ? { uuid_sentral: uuidSentral } : undefined);
  }
  async getCheckInputAsumsiMesin<T>(uuidSentral?: string): Promise<T> {
    return this.get(`${url}kertas-kerja-detail/all-rekap-asumsi-mesin`, uuidSentral ? { uuid_sentral: uuidSentral } : undefined);
  }
  async getSuggestionSentral<T>(): Promise<T> {
    return this.get(`${url}filter/combo-sentral`);
  }
}
