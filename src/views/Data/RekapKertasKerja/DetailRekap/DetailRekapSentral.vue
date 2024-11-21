<template>
  <Loading v-if="isLoading" />
  <InfoHeader v-if="sentral" :nama-mesin="sentral.nama_sentral" :nama-pengelola="namaPengelola ? namaPengelola : '-'"
    :kondisi-unit="sentral.kondisi_unit" :kode-jenis-pembangkit="sentral.kode_jenis_pembangkit"
    :daya-terpasang="sentral.daya_terpasang.toString()" :daya-mampu="sentral.daya_mampu.toString()"
    :tahun-operasi="sentral.tahun_operasi.toString()"
    :umur-teknis="asumsiParameter ? asumsiParameter.asumsi_makro.umur_teknis.toString() : '-'">
  </InfoHeader>
  <div class="items-start p-6 mt-4 bg-white rounded-lg">
    <TabsWrapper :isLihatGrafik="true">
      <TabItem title="Asumsi Makro">
        <AsumsiMakro v-model="tahunRealisasi" :corporate-tax-rate="asumsiParameter
          ? asumsiParameter.asumsi_makro.corporate_tax_rate
          : '-'
          " :discount-rate="asumsiParameter ? asumsiParameter.asumsi_makro.discount_rate : '-'
            " :interest-rate="asumsiParameter ? asumsiParameter.asumsi_makro.discount_rate : '-'
              " :loan-tenor="asumsiParameter ? asumsiParameter.asumsi_makro.loan_tenor : '-'
        " :loan-portion="asumsiParameter ? asumsiParameter.asumsi_makro.loan_portion : '-'
        " :equity-portion="asumsiParameter ? asumsiParameter.asumsi_makro.equity : '-'
        " />
      </TabItem>
      <TabItem title="Parameter Teknis & Finansial">
        <ParameterTeknis v-model="tahunRealisasi" :daya-terpasang="asumsiParameter
          ? asumsiParameter.parameter_teknis_financial.daya_terpasang
          : '-'
          " :daya-mampu-netto="asumsiParameter
            ? asumsiParameter.parameter_teknis_financial.daya_mampu_netto_mw
            : '-'
            " :auxiliary="asumsiParameter
              ? asumsiParameter.parameter_teknis_financial.auxiliary
              : '-'
              " :susut-trafo="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial.susut_trafo
        : '-'
        " :pemakaian-sendiri="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial.ps
        : '-'
        " :net-plant-heat-rate="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial.nphr
        : '-'
        " :total-project-cost="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial.total_project_cost
        : '-'
        " :loan="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial.loan
        : '-'
        " :equity="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial.equity
        : '-'
        " :electricity-price-a="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial
          .electricity_price_a_rp_per_kwbln
        : '-'
        " :electricity-price-b="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial
          .electricity_price_b_rp_per_kwbln
        : '-'
        " :electricity-price-c="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial
          .electricity_price_c_rp_per_kwh
        : '-'
        " :electricity-price-d="asumsiParameter
        ? asumsiParameter.parameter_teknis_financial
          .electricity_price_d_rp_per_kwh
        : '-'
        " :bahan-bakars="asumsiParameter ? asumsiParameter.bahan_bakars : '-'" />
      </TabItem>
      <TabItem title="Data Teknis">
        <div class="w-full overflow-auto border rounded-lg whitespace-nowrap">
          <table v-if="dataTeknis" class="w-full text-sm">
            <thead>
              <tr class="text-[#0099AD] text-sm text-left border-b-2">
                <th class="sticky left-0 z-10 bg-white">No</th>
                <th class="sticky z-10 bg-white left-10">Nama</th>
                <th v-for="(item, index) in dataTeknis.tahun.length === 0
                  ? 1
                  : dataTeknis.tahun" :key="index" :class="{
                    'text-warningColor': item < tahunRealisasi,
                    'text-primaryTextColor': item === tahunRealisasi,
                    'text-[#0099AD]': item > tahunRealisasi,
                  }">
                  {{ dataTeknis.tahun.length === 0 ? "-" : item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dataTeknis.detail" :key="index">
                <td class="sticky left-0 z-10 bg-white">{{ index + 1 }}</td>
                <td class="sticky z-10 bg-white left-10">{{ item.uraian }}</td>
                <td v-for="(items, indexs) in dataTeknis.tahun.length === 0
                  ? 1
                  : dataTeknis.tahun" :key="indexs" :class="{ 'bg-blue-50': items === tahunRealisasi }">
                  {{
                    dataTeknis.tahun
                      ? item["t" + items] != null
                        ? item.uraian === 'Type of Periodic Maintenance' ? getTypePeriodic(item["t" + items]) :
                          globalFormat.formatRupiah(item["t" + items])
                        : "-"
                      : "-"
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabItem>
      <TabItem title="Data Finansial">
        <div class="w-full overflow-auto border rounded-lg whitespace-nowrap" v-if="dataFinansial">
          <table class="w-full">
            <thead>
              <tr class="text-[#0099AD] text-sm text-left border-b-2">
                <th class="pr-96" id="tableHeader">Nama</th>
                <th v-for="(tahunItem, tahunIndex) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun"
                  :key="tahunIndex" :class="{
                    'text-warningColor': tahunItem < tahunRealisasi,
                    'text-primaryTextColor': tahunItem === tahunRealisasi,
                    'text-primaryColor': tahunItem > tahunRealisasi,
                  }">
                  {{ dataFinansial.tahun.length === 0 ? '-' : tahunItem }}
                </th>
              </tr>
            </thead>
            <tbody v-for="(level1, level1Index) in finansialMappingResult" :key="level1Index">
              <tr class="text-sm cursor-pointer bg-strokeColor bg-opacity-40 active:bg-opacity-90"
                @click="toggleRow(level1.id_uraian)">
                <td class="border-b" :colspan="dataFinansial.tahun.length === 0 ? 2 : dataFinansial.tahun.length + 1">
                  <div class="flex flex-row items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                      class="mr-2" v-if="!isRowOpen(level1.id_uraian)">
                      <rect width="24" height="24" rx="6" fill="#80C1CD" />
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                        fill="white" />
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                      class="mr-2" v-else>
                      <rect width="24" height="24" rx="6" fill="#80C1CD" />
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                        fill="white" />
                    </svg>
                    <span>{{ level1.uraian }}</span>
                  </div>
                </td>
              </tr>
              <template v-for="(level2, level2Index) in level1.level2" :key="level2Index"
                v-if="isRowOpen(level1.id_uraian)">
                <tr class="text-sm cursor-pointer active:bg-strokeColor active:bg-opacity-30"
                  @click="toggleRow(level2.id_uraian)">
                  <td id="level2" :class="{ selected: level2.level3.length === 0 }">
                    <div class="flex flex-row items-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        class="mr-2" v-if="!isRowOpen(level2.id_uraian) && level2.level3.length !== 0">
                        <rect width="24" height="24" rx="6" fill="#80C1CD" />
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                          fill="white" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        class="mr-2" v-else-if="isRowOpen(level2.id_uraian) && level2.level3.length !== 0">
                        <rect width="24" height="24" rx="6" fill="#80C1CD" />
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                          fill="white" />
                      </svg>
                      <span>{{ level2.uraian }}</span>
                    </div>
                  </td>
                  <td v-for="(tahun, tahunIndex) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun"
                    :class="{ 'bg-blue-50': tahun === 2023 }">
                    {{ dataFinansial.tahun ? level2['t' + tahun] ? globalFormat.formatRupiah(level2['t' + tahun]) : '-'
                      : '-' }}
                  </td>
                </tr>
                <template v-for="(level3, level3Index) in level2.level3" :key="level3Index"
                  v-if="isRowOpen(level2.id_uraian)">
                  <tr class="text-sm cursor-pointer" @click="toggleRow(level3.id_uraian)">
                    <td id="level3" :class="{ selected: level3.level4.length === 0 }">
                      <div class="flex flex-row items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          class="mr-2" v-if="!isRowOpen(level3.id_uraian) && level3.level4.length !== 0">
                          <rect width="24" height="24" rx="6" fill="#80C1CD" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                            fill="white" />
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          class="mr-2" v-else-if="isRowOpen(level3.id_uraian) && level3.level4.length !== 0">
                          <rect width="24" height="24" rx="6" fill="#80C1CD" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                            fill="white" />
                        </svg>
                        <span>{{ level3.uraian }}</span>
                      </div>
                    </td>
                    <td v-for="(tahun, tahunIndex) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun"
                      :class="{ 'bg-blue-50': tahun === 2023 }">
                      {{ dataFinansial.tahun ? level3['t' + tahun] ? globalFormat.formatRupiah(level3['t' + tahun]) :
                        '-' : '-' }}
                    </td>
                  </tr>
                  <template v-for="(level4, level4Index) in level3.level4" :key="level4Index"
                    v-if="isRowOpen(level3.id_uraian)">
                    <tr class="text-sm">
                      <td id="level4">{{ level4.uraian }}</td>
                      <td v-for="(tahun, tahunIndex) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun"
                        :class="{ 'bg-blue-50': tahun === 2023 }">
                        {{ dataFinansial.tahun ? level4['t' + tahun] ? globalFormat.formatRupiah(level4['t' + tahun]) :
                          '-' : '-' }}
                      </td>
                    </tr>
                  </template>
                </template>
              </template>
            </tbody>
            <tbody>
              <tr v-for="(level0, index) in dataFinansial.detail.filter((level0Item: any) => level0Item.level === 0)">
                <td>{{ level0.uraian }}</td>
                <td v-for="(tahuns, index) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun"
                  :class="{ 'bg-blue-50': tahuns === 2023 }">{{ level0['t' + tahuns] ? level0['t' + tahuns] : '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabItem>
      <!-- <TabItem title="Hasil Simulasi">
        <div class="flex flex-col w-full px-2">
          <nav class="rounded-md bg-primaryColor bg-opacity-5">
            <ul class="flex justify-around text-sm text-primaryColor">
              <li class="font-semibold py-1.5 px-20 cursor-pointer" @click="selectedTab = 'Akhir Masa'"
                :class="{ selected: selectedTab === 'Akhir Masa' }">
                COD - Akhir Masa Manfaat
              </li>
              <li class="font-semibold py-1.5 px-20 cursor-pointer" @click="selectedTab = 'Tahun Berjalan'"
                :class="{ selected: selectedTab === 'Tahun Berjalan' }">
                COD - Tahun Berjalan
              </li>
              <li class="font-semibold py-1.5 px-20 cursor-pointer" @click="selectedTab = 'Periode'"
                :class="{ selected: selectedTab === 'Periode' }">
                Periode
              </li>
              <li class="font-semibold py-1.5 px-20 cursor-pointer" @click="selectedTab = 'Proyeksi'"
                :class="{ selected: selectedTab === 'Proyeksi' }">
                Proyeksi (N+1 s.d Akhir Masa Manfaat)
              </li>
            </ul>
          </nav>
          <AkhirMasaManfaat v-show="selectedTab === 'Akhir Masa'" />
          <TahunBerjalan v-show="selectedTab === 'Tahun Berjalan'" />
          <Periode v-show="selectedTab === 'Periode'" />
          <Proyeksi v-show="selectedTab === 'Proyeksi'" />
        </div>
      </TabItem> -->
    </TabsWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import DetailRekapService from "@/services/detail-rekap-service";
const detailRekapService = new DetailRekapService();
import { useRoute } from "vue-router";
const route = useRoute();
import AsumsiMakro from "@/components/ui/AsumsiMakro.vue";
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import ParameterTeknis from "@/components/ui/ParameterTeknis.vue";
import InfoHeader from '@/components/ui/InfoHeader.vue'

const idSentral = parseInt(route.params.id.toString());
const sentral = ref<SentralItem>();
const namaPengelola = ref();
const asumsiParameter = ref<AsumsiParamaterItem>();
const dataTeknis = ref<DataTeknisItem>();
const dataFinansial = ref<any>();
const tahunBerjalan = ref(new Date().getFullYear());
const tahunRealisasi = ref(2023);
const typePeriodic = ref<Object[]>([]);
const isLoading = ref();
const selectedTab = ref("Akhir Masa");
const finansialMappingResult = ref<any[]>([]);
const isRowTabOpen = ref<number[]>([]);

interface SentralItem {
  data: any;
  id_mesin: number;
  kode_sentral: string;
  nama_sentral: string;
  kode_jenis_pembangkit: string;
  kondisi_unit: string;
  daya_terpasang: number;
  daya_mampu: number;
  tahun_operasi: string;
}
interface AsumsiParamaterItem {
  data: any;
  id_asumsi: number;
  id_mesin: number;
  kode_mesin: string;
  status: string;
  asumsi_makro: AsumsiMakroItem;
  parameter_teknis_financial: ParameterTeknisFinancialItem;
  bahan_bakars: any;
}
interface AsumsiMakroItem {
  corporate_tax_rate: number;
  discount_rate: number;
  interest_rate: number;
  loan_tenor: number;
  loan_portion: number;
  equity: number;
  umur_teknis: number;
}
interface ParameterTeknisFinancialItem {
  daya_terpasang: number;
  daya_mampu_netto_mw: number;
  auxiliary: number;
  susut_trafo: number;
  ps: number;
  total_project_cost: number;
  loan: number;
  equity: number;
  nphr: number;
  electricity_price_a_rp_per_kwbln: number;
  electricity_price_b_rp_per_kwbln: number;
  electricity_price_c_rp_per_kwh: number;
  electricity_price_d_rp_per_kwh: number;
}
interface DataTeknisItem {
  data: any;
  tahun: any;
  detail: any;
}

const fetchSentralById = async () => {
  try {
    const response: any = await detailRekapService.getSentralById(idSentral);
    sentral.value = response.data;
    const pengelolaResponse: any = await detailRekapService.getPengelolaData();
    const pengelola = pengelolaResponse.data.filter((pengelola: any) => pengelola.kode_pengelola === response.data.kode_pengelola);
    namaPengelola.value = pengelola[0].pengelola;
  } catch (error) {
    console.error('Fetch Sentral By Id Error : ' + error);
  }
}
const fetchAsumsiParameter = async () => {
  try {
    const response: AsumsiParamaterItem =
      await detailRekapService.getAsumsiMakroSentral(
        tahunRealisasi.value,
        idSentral
      );
    asumsiParameter.value = response.data;
  } catch (error) {
    console.error("Fetch Asumsi Parameter Error : " + error);
  }
};
const fetchDataTeknis = async () => {
  try {
    const response: DataTeknisItem = await detailRekapService.getDataTeknisSentral(
      tahunRealisasi.value,
      idSentral
    );
    dataTeknis.value = response.data;
  } catch (error) {
    console.error("Fetch Data Teknis Error : " + error);
  }
};
const fetchDataFinansial = async () => {
  try {
    const response: any = await detailRekapService.getDataFinansialSentral(
      tahunRealisasi.value,
      idSentral
    );
    let currentLevel1: any | null = null
    let currentLevel2: any | null = null
    let currentLevel3: any | null = null
    for (const item of response.data.detail) {
      if (item.level === 1) {
        currentLevel1 = {
          ...item,
          level2: [],
        }
        finansialMappingResult.value.push(currentLevel1);
      } else if (item.level === 2 && currentLevel1 !== null) {
        currentLevel2 = {
          ...item,
          level3: [],
        };
        currentLevel1.level2.push(currentLevel2)
      } else if (item.level === 3 && currentLevel1 !== null) {
        currentLevel3 = {
          ...item,
          level4: [],
        };
        currentLevel2.level3.push(currentLevel3);
      } else if (item.level === 4 && currentLevel1 !== null) {
        currentLevel3.level4.push({ ...item });
      }
    };
    dataFinansial.value = response.data
  } catch (error) {
    console.error("Fetch Data Finansial Error : " + error);
  };
};
const fetchTypePeriodic = async () => {
  try {
    const response: any = await detailRekapService.getTypePeriodic(sentral.value?.kode_jenis_pembangkit);
    typePeriodic.value = response.data;
  } catch (error) {
    console.error("Fetch Type Periodic Error : " + error);
  }
};
const getTypePeriodic = (num: number) => {
  let filteredTypePeriodic: any;
  if (typePeriodic.value.length !== 0) {
    filteredTypePeriodic = typePeriodic.value.filter((periodic: any) => periodic.id_type_periodic === num);
    return filteredTypePeriodic[0].kode_type_periodic;
  }
  return "-";
}
const toggleRow = (itemId: number) => {
  if (isRowOpen(itemId)) {
    isRowTabOpen.value = isRowTabOpen.value.filter(
      (id) => id !== itemId
    );
  } else {
    isRowTabOpen.value.push(itemId);
  }
};
const isRowOpen = (itemId: number) => {
  return isRowTabOpen.value.includes(itemId);
};

onMounted(async () => {
  isLoading.value = true;
  // await fetchTahunRealisasiData();
  // await fetchUnitPengelola();
  await fetchSentralById();
  await fetchTypePeriodic();
  await fetchAsumsiParameter();
  await fetchDataTeknis();
  await fetchDataFinansial();
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

th {
  font-weight: 700;
  padding: 1rem;
}

td {
  padding: 1rem;
}

ul li.selected {
  outline: 1px solid #0099ad;
  border-radius: 6px;
}

#level2 {
  padding-left: 3.1rem;
}

#level2.selected {
  padding-left: 5.1rem;
}

#level3 {
  padding-left: 5.3rem;
}

#level3.selected {
  padding-left: 7.3rem;
}

#level4 {
  padding-left: 9.3rem;
}

#tableHeader {
  padding-right: 30rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>