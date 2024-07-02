export interface BaseResponse<T> {
    success: boolean
    code: number
    message: string
    data: T
}

export interface ResEbitda {
    legend: Legend[] | null
    grafik: Grafik<EBITDA>[] | null
}

export interface ResCapexEaf {
    average_ipp_capex: number
    average_ipp_eaf: number
    average_pln_capex: number
    average_pln_eaf: number
    legend: Legend[] | null
    grafik: Grafik<CAPEX_EAF>[] | null
}

export interface ResCapexNcf {
    average_ipp_capex: number
    average_ipp_ncf: number
    average_pln_capex: number
    average_pln_ncf: number
    legend: Legend[]
    grafik: Grafik<CAPEX_NFC>[]
}

export interface ResCapexEfor {
    average_ipp_capex: number
    average_ipp_efor: number
    average_pln_capex: number
    average_pln_efor: number
    legend: Legend[]
    grafik: Grafik<CAPEX_EFOR>[]
}

export interface ResOpexBD {
    average_opex: number
    average_daya_terpasang: number
    average_ipp_opex: number
    legend: Legend[]
    grafik: Grafik<OPEX_BD>[]
}

export interface ResOpexNphr {
    average_value_c: number
    average_nphr: number
    average_ipp_valuec: number
    average_ipp_nphr: number
    legend: Legend[]
    grafik: Grafik<OPEX_C>[]
}

export interface ResComponent {
    percen_gap: number
    legend: Legend[]
    data: DataComponent[]
}

// --------------------------------------------------

type Legend = {
    label: string
    color: string
}

interface Grafik<T> {
    nama_mesin: string
    kode_jenis_kit: string
    tahun_realisasi: string
    data: T
}

type EBITDA = {
    ebitda_real: number
    ebitda_total: number
    rnfa_real: number
    rnfa_total: number
    total_revenue: number
    total_eat: number
    total_residual: number
}

type CAPEX_EAF = {
    capex: number
    eaf: number
}

type CAPEX_NFC = {
    capex: number
    ncf: number
}

type CAPEX_EFOR = {
    capex: number
    efor: number
}

type OPEX_BD = {
    value_b: number
    value_d: number
    opex: number
    daya_terpasang: number
}

type OPEX_C = {
    value_c: number
    nphr: number
}

type GrafikEBITDA = {
    label: string;
    unit: number;
    data: DataEBITDA[] | null;
}

type DataEBITDA = {
    kode_mesin: string;
    mesin: string;
    nilai_asset_awal: number;
    ebitda_real: number;
    ebitda_total: number;
    rnfa_real: number;
    rnfa_total: number;
    total_revenue: number;
    total_eat: number;
    total_residual: number;
    size: number;
}

type Line = {
    x: number;
    y: number;
}

type DataComponent = {
    id_mesin: string
    nama_mesin: string
    kode_jenis_kit: string
    data: DataValue
    data_ipp: DataValue
}

export interface DataValue {
    value: number
    tahun: string
    average: number
}

