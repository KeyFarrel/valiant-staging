import BaseService from "./base-service";

const url = import.meta.env.VITE_API_URL;
interface ParamBubble {
    kategori: string | null
    periode: string | null
}
interface ParamLine {
    komponen: string | null
    startDate: string | null
    endDate: string | null
    pembangkit: string | null
    id_daya: string | null
}

export default class AnalyticService extends BaseService {
    async getFinancialEBITDA<T>(param: ParamBubble): Promise<T> {
        return this.get(`${url}dashboard/grafik/finansial-ebitda`, param)
    }
    async getFinancialROIC<T>(param: ParamBubble): Promise<T> {
        return this.get(`${url}dashboard/grafik/finansial-roic`, param)
    }
    async getFinancialKomponen<T>(param: ParamLine): Promise<T> {
        return this.get(`${url}grafik/laman/komponen`, param)
    }
    async getTeknisNcf<T>(param: ParamLine): Promise<T> {
        return this.get(`${url}grafik/laman/teknis/ncf`, param)
    }
    async getTeknisEaf<T>(param: ParamLine): Promise<T> {
        return this.get(`${url}grafik/laman/teknis/eaf`, param)
    }
    async getFilterPembangkit<T>(): Promise<T> {
        return this.get(`${url}grafik/filter/pembangkit`)
    }
    async getFilterDaya<T>(): Promise<T> {
        return this.get(`${url}grafik/filter/daya`)
    }
    async getFilterTahun<T>(): Promise<T> {
        return this.get(`${url}grafik/filter/tahun`)
    }
}
