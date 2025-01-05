<template>
  <Loading v-if="isLoading" />
  <InfoHeader v-if="mesinDataById" :nama-mesin="mesinDataById.nama_sentral" :nama-pengelola="namaPengelola"
    :kondisi-unit="mesinDataById.kondisi_unit" :kode-jenis-pembangkit="mesinDataById.kode_jenis_pembangkit"
    :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
    :tahun-operasi="mesinDataById.tahun_operasi.toString()" :umur-teknis="umurTeknis">
  </InfoHeader>
  <div class="flex flex-col p-4 mt-4 bg-white rounded-lg">
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
        <KalkulasiTab v-if="kalkulasiFeasibility" :kalkulasi-feasibility="kalkulasiFeasibility"
          :result-map="resultMap" />
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
import Loading from "@/components/ui/LoadingSpinner.vue";
import InfoHeader from '@/components/ui/InfoHeader.vue'

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