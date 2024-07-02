<template>
  <Loading v-if="isLoading" />
  <div class="flex flex-col space-y-4" v-if="mesin">
    <InfoHeader v-if="mesin" :nama-mesin="mesin.mesin" :nama-pengelola="namaPengelola ? namaPengelola : '-'"
      :kondisi-unit="mesin.kondisi_unit" :kode-jenis-pembangkit="mesin.kode_jenis_pembangkit"
      :daya-terpasang="mesin.daya_terpasang.toString()" :daya-mampu="mesin.daya_mampu.toString()"
      :tahun-operasi="mesin.tahun_operasi.toString()" :umur-teknis="mesin.masa_manfaat" :nama-pembina="namaPembina">
      <div class="flex flex-row items-center space-x-3">
        <VueDatePicker class="date-picker" v-model="selectedYear" @update:model-value="handleYearChange" year-picker
          teleport :clearable="false" :yearRange="listYear" />
        <button
          class="flex items-center border border-[#0099AD] hover:border-hoverColor mr-3 px-3 py-2 rounded-lg text-[#0099AD] hover:text-white hover:bg-hoverColor duration-300">
          <span class="mr-2 font-semibold"
            @click="currentNamaMesin = mesin.mesin; handleDownloadExcelMesin()">Export</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.12496 3.20768C4.75575 3.20768 3.64579 4.31764 3.64579 5.68685C3.64579 5.84492 3.66051 5.99903 3.6885 6.14802C3.74247 6.43534 3.57543 6.71823 3.29778 6.80973C2.48281 7.07831 1.89579 7.84604 1.89579 8.74935C1.89579 9.87693 2.80988 10.791 3.93746 10.791H10.5C11.3859 10.791 12.1041 10.0728 12.1041 9.18685C12.1041 8.50243 11.6752 7.91672 11.0696 7.68658C10.7739 7.57423 10.6216 7.24669 10.7263 6.9482C10.7685 6.82804 10.7916 6.69828 10.7916 6.56185C10.7916 5.91752 10.2693 5.39518 9.62496 5.39518C9.49823 5.39518 9.37732 5.41518 9.26456 5.45175C9.11225 5.50114 8.94634 5.48576 8.80571 5.40921C8.66508 5.33266 8.5621 5.20167 8.5209 5.04694C8.23884 3.98749 7.27222 3.20768 6.12496 3.20768ZM2.47913 5.68685C2.47913 3.67331 4.11142 2.04102 6.12496 2.04102C7.62252 2.04102 8.90812 2.94352 9.46947 4.23364C9.52091 4.23024 9.57276 4.22852 9.62496 4.22852C10.9136 4.22852 11.9583 5.27318 11.9583 6.56185C11.9583 6.64957 11.9534 6.73628 11.9439 6.82171C12.7392 7.30824 13.2708 8.18495 13.2708 9.18685C13.2708 10.7171 12.0302 11.9577 10.5 11.9577H3.93746C2.16555 11.9577 0.729126 10.5213 0.729126 8.74935C0.729126 7.49971 1.44326 6.41805 2.48461 5.88823C2.48097 5.82152 2.47913 5.75438 2.47913 5.68685ZM6.99996 5.10352C7.32213 5.10352 7.58329 5.36468 7.58329 5.68685V8.21606L8.33748 7.46187C8.56529 7.23406 8.93463 7.23406 9.16244 7.46187C9.39024 7.68968 9.39024 8.05902 9.16244 8.28683L7.41244 10.0368C7.18463 10.2646 6.81529 10.2646 6.58748 10.0368L4.83748 8.28683C4.60967 8.05902 4.60967 7.68968 4.83748 7.46187C5.06529 7.23406 5.43463 7.23406 5.66244 7.46187L6.41663 8.21606V5.68685C6.41663 5.36468 6.67779 5.10352 6.99996 5.10352Z"
              fill="#0099AD" />
          </svg>
        </button>
      </div>
    </InfoHeader>
    <div class="flex justify-between p-4 my-4 bg-white rounded-lg">
      <div class="flex items-center">
        <div class="flex">
          <div class="w-1 h-7 mr-2 bg-[#0099AD]"></div>
          <p class="text-lg font-semibold">Evidence</p>
        </div>
      </div>
      <button
        class="flex items-center text-[#0099AD] bg-white border border-[#0099AD] px-3 py-2 rounded-lg duration-300 hover:text-white"
        @click="downloadEvidence">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.12508 3.20964C4.75588 3.20964 3.64591 4.3196 3.64591 5.6888C3.64591 5.84688 3.66063 6.00098 3.68862 6.14997C3.74259 6.43729 3.57555 6.72018 3.2979 6.81169C2.48294 7.08026 1.89591 7.84799 1.89591 8.7513C1.89591 9.87888 2.81 10.793 3.93758 10.793H10.5001C11.386 10.793 12.1042 10.0748 12.1042 9.1888C12.1042 8.50438 11.6754 7.91867 11.0697 7.68854C10.774 7.57619 10.6217 7.24864 10.7264 6.95015C10.7686 6.83 10.7917 6.70023 10.7917 6.5638C10.7917 5.91947 10.2694 5.39714 9.62508 5.39714C9.49836 5.39714 9.37744 5.41713 9.26468 5.4537C9.11237 5.5031 8.94646 5.48772 8.80583 5.41116C8.6652 5.33461 8.56222 5.20362 8.52102 5.0489C8.23896 3.98944 7.27235 3.20964 6.12508 3.20964ZM2.47925 5.6888C2.47925 3.67526 4.11154 2.04297 6.12508 2.04297C7.62264 2.04297 8.90824 2.94548 9.46959 4.23559C9.52103 4.23219 9.57288 4.23047 9.62508 4.23047C10.9137 4.23047 11.9584 5.27514 11.9584 6.5638C11.9584 6.65152 11.9535 6.73824 11.9441 6.82366C12.7393 7.3102 13.2709 8.1869 13.2709 9.1888C13.2709 10.7191 12.0304 11.9596 10.5001 11.9596H3.93758C2.16567 11.9596 0.729248 10.5232 0.729248 8.7513C0.729248 7.50166 1.44338 6.42 2.48473 5.89018C2.48109 5.82348 2.47925 5.75633 2.47925 5.6888ZM7.00008 5.10547C7.32225 5.10547 7.58341 5.36664 7.58341 5.6888V8.21801L8.3376 7.46382C8.56541 7.23602 8.93475 7.23602 9.16256 7.46382C9.39037 7.69163 9.39037 8.06098 9.16256 8.28878L7.41256 10.0388C7.18475 10.2666 6.81541 10.2666 6.5876 10.0388L4.8376 8.28878C4.6098 8.06098 4.6098 7.69163 4.8376 7.46382C5.06541 7.23602 5.43475 7.23602 5.66256 7.46382L6.41675 8.21801V5.6888C6.41675 5.36664 6.67791 5.10547 7.00008 5.10547Z"
            fill="#0099AD" />
        </svg>
        <span class="ml-2 text-sm font-semibold">Download Evidence</span>
      </button>
    </div>
    <div class="items-start p-6 bg-white rounded-lg">
      <TabsWrapper :kode-sentral="mesin.kode_sentral" :isLihatGrafik="true" :laman-data="false">
        <TabItem title="Asumsi Makro">
          <AsumsiMakro v-if="asumsiParameter" @on-change="fetchAsumsiParameterData" :list-tahun-asumsi="listTahunAsumsi"
            :corporate-tax-rate="asumsiParameter
              ? asumsiParameter.corporate_tax_rate
              : '-'
              " :discount-rate="asumsiParameter ? asumsiParameter.discount_rate : '-'
                " :interest-rate="asumsiParameter ? asumsiParameter.interest_rate : '-'
                  " :loan-tenor="asumsiParameter ? asumsiParameter.loan_tenor : '-'
                    " :loan-portion="asumsiParameter ? asumsiParameter.loan_portion : '-'
                      " :equity-portion="asumsiParameter ? asumsiParameter.equity_portion : '-'
                        " :selected-year="selectedYear" />
          <AsumsiMakro v-else :selected-year="selectedYear" :list-tahun-asumsi="listTahunAsumsi"
            :corporate-tax-rate="'-'" :discount-rate="'-'" :interest-rate="'-'" :loan-tenor="'-'" :loan-portion="'-'"
            :equity-portion="'-'" />
        </TabItem>
        <TabItem title="Parameter Teknis & Finansial">
          <ParameterTeknis v-if="comboBahanBakar.length !== 0" @on-change="fetchAsumsiParameterData"
            v-model:selected-tahun="tahunTerakhirRealisasi" :selected-year="selectedYear"
            :list-tahun-asumsi="listTahunAsumsi" :daya-terpasang="parameterTeknisFinansial?.daya_terpasang ?? '-'"
            :daya-mampu-netto="parameterTeknisFinansial?.daya_mampu_netto_mw ?? '-'"
            :auxiliary="parameterTeknisFinansial?.auxiliary ?? '-'"
            :susut-trafo="parameterTeknisFinansial?.susut_trafo ?? '-'"
            :pemakaian-sendiri="parameterTeknisFinansial?.ps ?? '-'"
            :net-plant-heat-rate="parameterTeknisFinansial?.nphr"
            :total-project-cost="parameterTeknisFinansial?.total_project_cost" :loan="parameterTeknisFinansial?.loan"
            :equity="parameterTeknisFinansial?.equity"
            :electricity-price-a="parameterTeknisFinansial?.electricity_price_a_rp_per_kwbln"
            :electricity-price-b="parameterTeknisFinansial?.electricity_price_b_rp_per_kwbln"
            :electricity-price-c="parameterTeknisFinansial?.electricity_price_c_rp_per_kwh"
            :electricity-price-d="parameterTeknisFinansial?.electricity_price_d_rp_per_kwh" :bahan-bakars="bahanBakars"
            :combo-bahan-bakar="comboBahanBakar" />
        </TabItem>
        <TabItem title="Data Teknis">
          <TableDataTeknis :data-teknis="dataTeknis" :tahun-terakhir-realisasi="parseInt(selectedYear)"
            :type-periodic="typePeriodic" />
        </TabItem>
        <TabItem title="Data Finansial">
          <TableDataFinansial v-if="dataFinansial" :source="finansialMappingResult" :data-finansial="dataFinansial"
            :tahun-terakhir-realisasi="parseInt(selectedYear)" />
        </TabItem>
        <TabItem title="Hasil Simulasi">
          <div class="flex flex-col w-full px-2">
            <nav class="rounded-md bg-primaryColor bg-opacity-5">
              <ul class="table w-full text-sm text-center text-primaryColor border-spacing-x-5">
                <li id="tab"
                  class="table-cell w-1/2 py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                  @click="selectedTab = 'Akhir Masa'" :class="{ selected: selectedTab === 'Akhir Masa' }">
                  COD - Akhir Masa Manfaat</li>
                <li id="tab"
                  class="table-cell w-1/2 py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                  @click="selectedTab = 'Tahun Berjalan'" :class="{ selected: selectedTab === 'Tahun Berjalan' }">COD -
                  Tahun Berjalan
                </li>
              </ul>
            </nav>
            <AkhirMasaManfaat v-if="hasilSimulasi" :irr-on-project="hasilSimulasi.track_irr_project"
              :irr-on-equity="hasilSimulasi.track_irr_equity" :npv-on-equity="hasilSimulasi.track_npv_equity"
              :npv-on-project="hasilSimulasi.track_npv_project" :average-ncf="hasilSimulasi.track_average_cf"
              :average-eaf="hasilSimulasi.track_average_eaf" v-show="selectedTab === 'Akhir Masa'" />
            <TahunBerjalan v-if="hasilSimulasi" :irr-on-project="hasilSimulasi.now_track_irr_project"
              :irr-on-equity="hasilSimulasi.now_track_irr_equity" :npv-on-equity="hasilSimulasi.now_track_npv_equity"
              :npv-on-project="hasilSimulasi.now_track_npv_project" :average-ncf="hasilSimulasi.now_track_average_cf"
              :average-eaf="hasilSimulasi.now_track_average_eaf" v-show="selectedTab === 'Tahun Berjalan'" />
            <Periode v-show="selectedTab === 'Periode'" />
            <Proyeksi v-show="selectedTab === 'Proyeksi'" />
          </div>
        </TabItem>
      </TabsWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { encryptStorage, encryptedUserInfo } from "@/utils/app-encrypt-storage";
import { notifyError } from "@/services/helper/toast-notification";
import Loading from "@/components/ui/LoadingSpinner.vue";
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import RekapService from "@/services/rekap-service";
const rekapService = new RekapService();
import DetailRekapService from "@/services/detail-rekap-service";
const detailRekapService = new DetailRekapService();
import { useRoute } from "vue-router";
const route = useRoute();
import router from "@/router";
import AkhirMasaManfaat from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue";
import UserService from "@/services/user-service";
const userService = new UserService();
import TahunBerjalan from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue";
import Periode from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/Periode.vue";
import Proyeksi from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/Proyeksi.vue";
import AsumsiMakro from "@/components/ui/AsumsiMakro.vue";
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import ParameterTeknis from "@/components/ui/ParameterTeknis.vue";
import InfoHeader from '@/components/ui/InfoHeader.vue'
import axios from "axios";
import TableDataTeknis from "@/components/RekapKertasKerja/TableDataTeknis.vue";
import TableDataFinansial from "@/components/RekapKertasKerja/TableDataFinansial.vue";

const nodeMode: any = import.meta.env.MODE;
const kodeMesin = ref<MesinItem>();
const idMesin = ref();
const mesin = ref<MesinItem>();
const kodeJenisPembangkit = ref<string>("");
const namaPengelola = ref<string>('');
const namaPembina = ref<string>('');
const asumsiParameter = ref<AsumsiParameterItem>();
const parameterTeknisFinansial = ref<ParameterTeknisFinancialItem>();
const bahanBakars = ref<any[]>([]);
const selectedYear = ref<any>(route.query.tahun);
const listYear = ref<any[]>([]);
const dataTeknis = ref<{
  header: any[],
  tahun: number[],
  detail: any[]
}>({
  header: [],
  tahun: [],
  detail: []
});
const dataFinansial = ref<any>();
const tahunBerjalan = new Date().getFullYear();
const comboBahanBakar = ref<any>([]);
const tahunRealisasi = ref<number>(tahunBerjalan);
const listTahunAsumsi = ref<{
  start: string,
  end: string
}>({
  start: "1990",
  end: "2050"
});
const tahunTerakhirAsumsi = ref<number>(-1);
const tahunTerakhirRealisasi = ref<number>(-1);
const typePeriodic = ref<Object[]>([]);
const isLoading = ref();
const selectedTab = ref("Akhir Masa");
const finansialMappingResult = ref<any[]>([]);
const hasilSimulasi = ref();
const currentNamaMesin = ref<string>('');

interface MesinItem {
  data: any
  id_mesin: number
  kode_sentral: string
  kode_mesin: string
  mesin: string
  kode_jenis_pembangkit: string
  kondisi_unit: string
  daya_terpasang: number
  daya_mampu: number
  tahun_operasi: string
  masa_manfaat: number
}
interface AsumsiParameterItem {
  data: any
  id_asumsi: number
  id_mesin: number
  kode_mesin: string
  status: string
  corporate_tax_rate: number
  discount_rate: number
  interest_rate: number
  loan_tenor: number
  loan_portion: number
  equity_portion: number
  umur_teknis: number
  bahan_bakars: any
}
interface ParameterTeknisFinancialItem {
  daya_terpasang: number
  daya_mampu_netto_mw: number
  auxiliary: number
  susut_trafo: number
  ps: number
  total_project_cost: number
  loan: number
  equity: number
  nphr: number
  electricity_price_a_rp_per_kwbln: number
  electricity_price_b_rp_per_kwbln: number
  electricity_price_c_rp_per_kwh: number
  electricity_price_d_rp_per_kwh: number
}

const fetchMesinById = async () => {
  try {
    isLoading.value = true;
    const response: MesinItem = await detailRekapService.getMesinById(
      nodeMode === 'production' ? encryptStorage.decryptValue(route.params.id.toString()) : route.params.id
    );
    mesin.value = response.data;
    kodeMesin.value = response.data.kode_mesin;
    idMesin.value = response.data.id_mesin;
    kodeJenisPembangkit.value = response.data.kode_jenis_pembangkit;
    tahunTerakhirAsumsi.value = parseInt(response.data.tahun_asumsi);
    tahunTerakhirRealisasi.value = parseInt(response.data.tahun_realisasi);
    tahunRealisasi.value = parseInt(response.data.tahun_realisasi);
  } catch (error) {
    console.error(error);
  }
};
const downloadEvidence = async () => {
  try {
    isLoading.value = true;
    const filePath: any = await rekapService.getEvidencePath(idMesin.value, route.query.tahun?.toString() ?? '0', 0);
    const splittedFileName = filePath.data[0].dokumen_evidence.split(' ');
    splittedFileName.shift();
    const finalFileName = splittedFileName.join(' ');
    const headers = {
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };
    const response: any = await axios.get('https://portalapp.iconpln.co.id:5080/valiant-be/v1/mutasiasset/view-dokumen', {
      responseType: 'arraybuffer',
      headers,
      params: {
        id_dokumen: filePath.data[0].dokumen_evidence
      }
    });
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `${finalFileName}`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    isLoading.value = false;
  } catch (error) {
    console.error('Evidence Error : ' + error)
    isLoading.value = false;
    notifyError('Evidence Tidak Ada', 5000)
  }
}
const fetchAsumsiParameterData = async () => {
  try {
    isLoading.value = true;
    const response: AsumsiParameterItem =
      await detailRekapService.getAsumsiParameter(
        parseInt(selectedYear.value) - 1,
        idMesin.value,
        parseInt(selectedYear.value)
      );
    asumsiParameter.value = response.data.asumsi_makro;
    parameterTeknisFinansial.value = response.data.parameter_teknis_financial;
    bahanBakars.value = response.data.harga_bahan_bakars;
  } catch (error) {
    console.error("Fetch Asumsi Parameter Error : " + error);
  }
};
const fetchDataTeknisData = async () => {
  try {
    const response: any = await detailRekapService.getDataTeknis(
      parseInt(selectedYear.value),
      idMesin.value
    );
    dataTeknis.value = response.data;
    console.log(dataTeknis.value)
  } catch (error) {
    console.error("Fetch Data Teknis Error : " + error);
  }
};
const fetchComboBahanBakar = async () => {
  try {
    const response: any = await detailRekapService.getComboBahanBakar(kodeJenisPembangkit.value);
    comboBahanBakar.value = response.data;
    console.log(response.data)
  } catch (error) {
    console.error('Fetch Combo Bahan Bakar Error : ' + error);
  }
}
const fetchDataFinansialData = async () => {
  try {
    finansialMappingResult.value = []
    const response: any = await detailRekapService.getDataFinansial(
      parseInt(selectedYear.value),
      idMesin.value
    );
    let currentLevel1: any | null = null;
    let currentLevel2: any | null = null;
    let currentLevel3: any | null = null;
    for (const item of response.data.detail) {
      if (item.level === 1) {
        currentLevel1 = {
          ...item,
          level2: [],
        };
        finansialMappingResult.value.push(currentLevel1);
      } else if (item.level === 2 && currentLevel1 !== null) {
        currentLevel2 = {
          ...item,
          level3: [],
        }
        currentLevel1.level2.push(currentLevel2);
      } else if (item.level === 3 && currentLevel1 !== null) {
        currentLevel3 = {
          ...item,
          level4: [],
        }
        currentLevel2.level3.push(currentLevel3);
      } else if (item.level === 4 && currentLevel1 !== null) {
        currentLevel3.level4.push({ ...item });
      }
    }
    dataFinansial.value = response.data;
  } catch (error) {
    console.error("Fetch Data Finansial Error : " + error);
  }
};
const fetchHasilSimulasi = async () => {
  try {
    const response: any = await detailRekapService.getHasilSimulasi(
      idMesin.value,
      parseInt(selectedYear.value),
      4
    );
    console.log(response.data)
    hasilSimulasi.value = response.data;
  } catch (error) {
    console.error("Fetch Hasil Simulasi Error : " + error);
  }
}
const handleDownloadExcelMesin = async () => {
  try {
    isLoading.value = true;
    const headers = {
      Authorization: `Bearer ${nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem("token")}`,
    };
    const response: any = await axios.get('https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/export-template-awal', {
      responseType: 'arraybuffer',
      headers,
      params: {
        id_mesin: idMesin.value,
        tahun: parseInt(selectedYear.value),
        tahun_realisasi: selectedYear.value - 1
      }
    });
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Actual - ${currentNamaMesin.value}_${tahunTerakhirRealisasi.value}_${globalFormat.formatNumberFiveDigits(parseInt(idMesin.value))}.xlsx`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    isLoading.value = false;
  } catch (error) {
    console.error('Handle Download Template Rekap Error : ' + error);
  }
}
const fetchTahunRealisasiData = async () => {
  try {
    const response: any = await detailRekapService.getTahunRealisasi(
      nodeMode === 'production' ? encryptStorage.decryptValue(route.params.id.toString()) : route.params.id
    );
    listYear.value[0] = response.data[0].tahun;
    listYear.value[1] = response.data[response.data.length - 1].tahun;
    console.log(listYear.value);
  } catch (error) {
    console.error("Fetch Tahun Realisasi Error : " + error);
  }
};
const fetchListTahunAsumsi = async () => {
  try {
    const response: any = await detailRekapService.getListTahunAsumsi();
    listTahunAsumsi.value.start = response.data[0].tahun;
    listTahunAsumsi.value.end = response.data.slice(-1)[0].tahun;
  } catch (error) {
    console.error("Fetch Tahun Realisasi Error : " + error);
  }
};
const fetchListPembina = async () => {
  try {
    const response: any = await userService.getPembina('');
    return response.data;
  } catch (error) {
    console.error('Fetch Pembina Error : ' + error)
  }
}
const fetchUnitPengelola = async () => {
  try {
    if (mesin.value) {
      const kodeSentral = mesin.value.kode_sentral;
      const pembangkitResponse: any =
        await detailRekapService.getPembangkitByKode(kodeSentral);
      const kodePengelola = pembangkitResponse.data.kode_pengelola;
      const pengelolaResponse: any =
        await detailRekapService.getPengelolaData();
      const pengelola = pengelolaResponse.data.filter(
        (pengelola: any) => pengelola.kode_pengelola === kodePengelola
      );
      namaPengelola.value = pengelola[0].pengelola;
      const idPembina = pembangkitResponse.data.id_pembina;
      const pembinaList: any = await fetchListPembina();
      namaPembina.value = pembinaList.find((pembina: any) => pembina.id_pembina === idPembina).pembina;
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : " + error);
  }
};
const fetchTypePeriodic = async () => {
  try {
    const response: any = await detailRekapService.getTypePeriodic(kodeJenisPembangkit.value.replace(/ /g, ''));
    typePeriodic.value = response.data;
    console.log(typePeriodic.value)
  } catch (error) {
    console.error("Fetch Type Periodic Error : " + error);
  }
};

const handleYearChange = async () => {
  isLoading.value = true
  router.replace({ name: 'detail-rekap', params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(idMesin.value) : idMesin.value }, query: { tahun: selectedYear.value } });
  await fetchMesinById();
  await fetchTahunRealisasiData();
  await fetchUnitPengelola();
  await fetchTypePeriodic();
  await fetchHasilSimulasi();
  await fetchAsumsiParameterData();
  await fetchListTahunAsumsi();
  await fetchDataTeknisData();
  await fetchDataFinansialData();
  await fetchComboBahanBakar();
  isLoading.value = false
}

onMounted(async () => {
  isLoading.value = true;
  await fetchMesinById();
  await fetchTahunRealisasiData();
  await fetchUnitPengelola();
  await fetchTypePeriodic();
  await fetchHasilSimulasi();
  await fetchAsumsiParameterData();
  await fetchListTahunAsumsi();
  await fetchDataTeknisData();
  await fetchDataFinansialData();
  await fetchComboBahanBakar();
  isLoading.value = false;
});
</script>

<style scoped>
button:hover>svg *,
button:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(28 100 242 / var(--tw-bg-opacity));
  fill: #ffffff;
}

ul li.selected {
  outline: 1px solid #0099ad;
  border-radius: 6px;
}

.date-picker {
  width: 10rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
}
</style>