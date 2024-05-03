<template>
  <Loading v-if="isLoading" />
  <InfoHeader v-if="mesinDataById" :nama-mesin="mesinDataById.nama_sentral" :nama-pengelola="namaPengelola"
    :kondisi-unit="mesinDataById.kondisi_unit" :kode-jenis-pembangkit="mesinDataById.kode_jenis_pembangkit"
    :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
    :tahun-operasi="mesinDataById.tahun_operasi.toString()" :umur-teknis="umurTeknis">
    <!-- <div class="flex">
      <button
        class="border border-[#0099AD] hover:border-blue-600 mr-3 px-3 py-2 text-[#0099AD] hover:text-white rounded-lg hover:bg-blue-600 duration-300">
        <span class="font-semibold">Lihat Grafik</span>
      </button>
      <button
        class="flex items-center bg-[#0099AD] border border-[#0099AD] px-3 py-2 rounded-lg hover:bg-blue-600 hover:border-blue-600 duration-300">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.12496 3.20768C4.75575 3.20768 3.64579 4.31764 3.64579 5.68685C3.64579 5.84492 3.66051 5.99903 3.6885 6.14802C3.74247 6.43534 3.57543 6.71823 3.29778 6.80973C2.48281 7.07831 1.89579 7.84604 1.89579 8.74935C1.89579 9.87693 2.80988 10.791 3.93746 10.791H10.5C11.3859 10.791 12.1041 10.0728 12.1041 9.18685C12.1041 8.50243 11.6752 7.91672 11.0696 7.68658C10.7739 7.57423 10.6216 7.24669 10.7263 6.9482C10.7685 6.82804 10.7916 6.69828 10.7916 6.56185C10.7916 5.91752 10.2693 5.39518 9.62496 5.39518C9.49823 5.39518 9.37732 5.41518 9.26456 5.45175C9.11225 5.50114 8.94634 5.48576 8.80571 5.40921C8.66508 5.33266 8.5621 5.20167 8.5209 5.04694C8.23884 3.98749 7.27222 3.20768 6.12496 3.20768ZM2.47913 5.68685C2.47913 3.67331 4.11142 2.04102 6.12496 2.04102C7.62252 2.04102 8.90812 2.94352 9.46947 4.23364C9.52091 4.23024 9.57276 4.22852 9.62496 4.22852C10.9136 4.22852 11.9583 5.27318 11.9583 6.56185C11.9583 6.64957 11.9534 6.73628 11.9439 6.82171C12.7392 7.30824 13.2708 8.18495 13.2708 9.18685C13.2708 10.7171 12.0302 11.9577 10.5 11.9577H3.93746C2.16555 11.9577 0.729126 10.5213 0.729126 8.74935C0.729126 7.49971 1.44326 6.41805 2.48461 5.88823C2.48097 5.82152 2.47913 5.75438 2.47913 5.68685ZM6.99996 5.10352C7.32213 5.10352 7.58329 5.36468 7.58329 5.68685V8.21606L8.33748 7.46187C8.56529 7.23406 8.93463 7.23406 9.16244 7.46187C9.39024 7.68968 9.39024 8.05902 9.16244 8.28683L7.41244 10.0368C7.18463 10.2646 6.81529 10.2646 6.58748 10.0368L4.83748 8.28683C4.60967 8.05902 4.60967 7.68968 4.83748 7.46187C5.06529 7.23406 5.43463 7.23406 5.66244 7.46187L6.41663 8.21606V5.68685C6.41663 5.36468 6.67779 5.10352 6.99996 5.10352Z"
            fill="white" />
        </svg>
        <span class="ml-2 text-white font-semibold">Export</span>
      </button>
    </div> -->
  </InfoHeader>
  <div class="flex flex-col bg-white mt-4 p-4 rounded-lg">
    <TabsWrapper>
      <TabItem :title="'Asumsi'">
        <AsumsiTab v-if="asumsiFeasibility" :tahun-berjalan="tahunBerjalan"
          :discount-rate="asumsiFeasibility.discount_rate" :total-project-cost="asumsiFeasibility.total_project_cost"
          :umur-teknis="asumsiFeasibility.umur_teknis" :interest-rate="asumsiFeasibility.interest_rate"
          :loan-portion="asumsiFeasibility.loan_portion" :equity-portion="asumsiFeasibility.equity_portion"
          :loan="asumsiFeasibility.loan" :loan-tenor="asumsiFeasibility.loan_tenor" :principal-interest-payment="asumsiFeasibility.principal_interest_payment
            " :corporate-tax-rate="asumsiFeasibility.corporate_tax_rate"
          :wacc-on-project="asumsiFeasibility.wacc_on_project" :wacc-on-equity="asumsiFeasibility.wacc_on_equity"
          :equity="asumsiFeasibility.equity" :daya-mampu-netto="asumsiFeasibility.daya_mampu_netto_mw"
          :auxiliary="asumsiFeasibility.auxiliary" :susut-trafo="asumsiFeasibility.susut_trafo" :electricity-price-a="asumsiFeasibility.electricity_price_a_rp_per_kwbln
            " :electricity-price-b="asumsiFeasibility.electricity_price_b_rp_per_kwbln
    " :electricity-price-c="asumsiFeasibility.electricity_price_c_rp_per_kwh
    " :electricity-price-d="asumsiFeasibility.electricity_price_d_rp_per_kwh
    " />
      </TabItem>
      <TabItem :title="'Kalkulasi'">
        <KalkulasiTab v-if="kalkulasiFeasibility" :kalkulasi-feasibility="kalkulasiFeasibility" :result-map="resultMap" />
      </TabItem>
    </TabsWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
import FeasibilityStudyService from "@/services/feasibility-study";
const feasibilityStudyService = new FeasibilityStudyService();
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import AsumsiTab from "./AsumsiTab.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import InfoHeader from '@/components/ui/InfoHeader.vue'
import KalkulasiTab from './KalkulasiTab.vue'

const asumsiFeasibility = ref<AsumsiFeasibilityItem>();
const kalkulasiFeasibility = ref();
const tahunBerjalan = ref();
const isLoading = ref();
const mesinDataById = ref<SentralItem>();
const umurTeknis = ref();
const namaPengelola = ref();
const resultMap = ref<any[]>([]);

interface SentralItem {
  data: any;
  id_mesin: number;
  kode_sentral: string;
  kode_mesin: string;
  nama_sentral: string;
  kode_jenis_pembangkit: string;
  kondisi_unit: string;
  daya_terpasang: number;
  daya_mampu: number;
  tahun_operasi: string;
}
interface AsumsiFeasibilityItem {
  data: any;
  id_mesin: number;
  kode_mesin: string;
  mesin: string;
  tahun_operasi: string;
  total_project_cost: number;
  umur_teknis: number;
  interest_rate: number;
  loan_portion: number;
  equity_portion: number;
  loan_tenor: number;
  daya_mampu_netto_mw: number;
  auxiliary: number;
  susut_trafo: number;
  ps: number;
  sfc_kg_kwh: number;
  electricity_price_a_rp_per_kwbln: number;
  electricity_price_b_rp_per_kwbln: number;
  electricity_price_c_rp_per_kwh: number;
  electricity_price_d_rp_per_kwh: number;
  kode_bahan_bakar: string;
  harga_bahan_bakar: number;
  loan: number;
  principal_interest_payment: number;
  wacc_on_project: number;
  wacc_on_equity: number;
  equity: number;
  corporate_tax_rate: number;
  discount_rate: number;
  nphr: number;
}

const fetchSentralById = async () => {
  try {
    const response: SentralItem = await feasibilityStudyService.getSentralById(
      route.params.id
    );
    const pengelolaResponse: any = await feasibilityStudyService.getPengelolaData();
    const pengelola = pengelolaResponse.data.filter((pengelola: any) => pengelola.kode_pengelola === response.data.kode_pengelola);
    namaPengelola.value = pengelola[0].pengelola;
    mesinDataById.value = response.data;
  } catch (error) {
    console.error("Fetch Mesin By Id Error : " + error);
  }
};
const fetchAsumsiFeasibility = async () => {
  try {
    const response: AsumsiFeasibilityItem =
      await feasibilityStudyService.getAsumsiFeasibilitySentral(
        parseInt(route.params.id.toString())
      );
    asumsiFeasibility.value = response.data;
    umurTeknis.value = response.data.umur_teknis.toString();
  } catch (error) {
    console.error("Error Fetch Asumsi Feasibility : " + error);
  }
};
const fetchKalkulasiFeasibility = async () => {
  try {
    const response: any = await feasibilityStudyService.getKalkulasiFeasibilitySentral(
      parseInt(route.params.id.toString())
    );
    let currentParent: any | null = null;
    for (const item of response.data.detail) {
      if (item.level === 1) {
        currentParent = {
          ...item,
          children: [],
        };
        resultMap.value.push(currentParent);
      } else if (item.level === 2 && currentParent !== null) {
        currentParent.children?.push(item);
      }
    }
    kalkulasiFeasibility.value = response.data;
    console.log(resultMap.value);
  } catch (error) {
    console.error("Error Fetch Kalkulasi Feasibility : " + error);
  }
};
const fetchTahunBerjalan = () => {
  const date = new Date();
  tahunBerjalan.value = date.getFullYear();
};

onMounted(async () => {
  isLoading.value = true;
  fetchTahunBerjalan();
  await fetchSentralById();
  await fetchAsumsiFeasibility();
  await fetchKalkulasiFeasibility();
  isLoading.value = false;
});
</script>

<style lang="scss" scoped></style>
