import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;

export default class GrafikService extends BaseService {
  // Api for Card Information in Bottom
  async getPlanning<T>(param: any): Promise<T> {    
    return this.get(`${url}peta/detail-planing`, param);
  }

  async getRealisasiProyeksi<T>(param: any): Promise<T> {    
    return this.get(`${url}peta/detail-realisasi-proyeksi`, param);
  }

  async getRealisasiYoy<T>(param: any): Promise<T> {    
    return this.get(`${url}peta/detail-realisasi-yoy`, param);
  }
  

  async getPlanningMesin<T>(param: any): Promise<T> {    
    return this.get(`${url}peta/detail-planing-mesin`, param);
  }

  async getRealisasiProyeksiMesin<T>(param: any): Promise<T> {    
    return this.get(`${url}peta/detail-realisasi-proyeksi-mesin`, param);
  }

  async getRealisasiYoyMesin<T>(param: any): Promise<T> {    
    return this.get(`${url}peta/detail-realisasi-yoy-mesin`, param);
  }
  

  async getYearSentral<T>(param: any): Promise<T> {    
    return this.get(`${url}filter/tahun-persentral`, param);
  }

  async getYearMesin<T>(param: any): Promise<T> {    
    return this.get(`${url}filter/tahun-permesin`, param);
  }

  async getRangeYearSentral<T>(param: any): Promise<T> {
    return this.get(`${url}filter/range-tahun-persentral`, param);
  }

  async getRangeYearMesin<T>(param: any): Promise<T> {
    return this.get(`${url}filter/range-tahun-permesin`, param);
  }

  // Api for All Graphic
  async getGrafikWLCALL<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-all-sentral`, param);
  }

  async getGrafikWLCALLDetail<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-all-sentral/detail`, param);
  }

  async getGrafikWLCKom<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-komponen-sentral`, param);
  }

  async getGrafikWLCKomDetail<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-komponen-sentral/detail`, param);
  }

  async getGrafikPlan<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/planning-fs-sentral`, param);
  }

  async getGrafikPlanDetail<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/planning-fs-sentral/detail`, param);
  }

  async getGrafikPRP<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/planning-realisasi-proyeksi-sentral`, param);
  }

  async getGrafikPRPDetail<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/planning-realisasi-proyeksi-sentral/detail`, param);
  }

  async getGrafikPRPLastYear<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/prp-lastyear-sentral`, param);
  }

  async getGrafikLastYearDetail<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/prp-lastyear-sentral/detail`, param);
  }

  // Api for All Graphic Mesin
  async getGrafikWLCALLMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-all`, param);
  }

  async getGrafikWLCALLDetailMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-all/detail`, param);
  }

  async getGrafikWLCKomMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-komponen`, param);
  }

  async getGrafikWLCKomDetailMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-komponen/detail`, param);
  }

  async getGrafikPlanMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/planning-fs`, param);
  }

  async getGrafikPlanDetailMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/planning-fs/detail`, param);
  }

  async getGrafikPlanKomMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-komponen-fs`, param);
  }

  async getGrafikPlanKomDetailMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/wlc-komponen-fs/detail`, param);
  }

  async getGrafikPRPMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/planning-realisasi-proyeksi`, param);
  }

  async getGrafikPRPDetailMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/planning-realisasi-proyeksi/detail`, param);
  }

  async getGrafikPRPLastYearMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/prp-lastyear`, param);
  }

  async getGrafikPRPLastYearDetailMesin<T>(param: any): Promise<T> {
    return this.get(`${url}dashboard/grafik/prp-lastyear/detail`, param);
  }


  async getGraphicBiaya<T>(param: any): Promise<T> {
    return this.post(`${url}grafik/laman/komponen`, param);
  }

  async getGraphicRNFA<T>(param: any): Promise<T> {
    return this.post(`${url}dashboard/grafik/finansial-ebitda`, param);
  }

  async getGraphicAnalitikEAF<T>(param: any): Promise<T> {
    return this.post(`${url}grafik/laman/finansial/eaf`, param);
  }

  async getGraphicAnalitikCF<T>(param: any): Promise<T> {
    return this.post(`${url}grafik/laman/finansial/ncf`, param);
  }

  async getGraphicAnalitikEFOR<T>(param: any): Promise<T> {
    return this.post(`${url}grafik/laman/finansial/efor`, param);
  }

  async getGraphicOpexBD<T>(param: any): Promise<T> {
    return this.post(`${url}grafik/laman/finansial/opex-bd`, param);
  }

  async getGraphicOpexC<T>(param: any): Promise<T> {
    return this.post(`${url}grafik/laman/finansial/opexc-nphr`, param);
  }

  async getGraphicTeknisNCF<T>(param: any): Promise<T> {
    return this.post(`${url}grafik/laman/teknis/ncf`, param);
  }

  async getGraphicTeknisEAF<T>(param: any): Promise<T> {
    return this.post(`${url}grafik/laman/teknis/eaf`, param);
  }

  async getGraphicTeknisNPHR<T>(param: any): Promise<T> {
    return this.post(`${url}grafik/laman/teknis/nphr`, param);
  }
  async getComboKategoriPembangkit<T>(): Promise<T> {
    return this.get(`${url}filter/combo-jenis-kit`);
  }
  async getFilterDaya<T>(): Promise<T> {
    return this.get(`${url}grafik/filter/daya`)
  }
  async getTahunTerakhirRealisasiAnalitik<T>(): Promise<T> {
    return this.get(`${url}filter/combo-tahun-max`)
  }
  async getInitialPembangkit<T>(): Promise<T> {
    return this.get(`${url}filter/combo-max-jenis-pembangkit`)
  }
}
