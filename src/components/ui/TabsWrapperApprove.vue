<template>
  <div class="whitespace-nowrap">
    <ul class="flex items-end mb-4">
      <li
        class="pb-2 mr-6 font-semibold text-gray-500 transition-all duration-300 cursor-pointer hover:text-primaryColor"
        v-for="title in tabTitles" :key="title" @click="handleClick(title)"
        :class="{ selected: title === selectedTitle }">
        {{ title }}
      </li>
      <li class="items-end content-end justify-end ml-auto justify-items-end" v-if="isLihatGrafik">
        <button
          class="flex items-center px-3 py-2 border border-[#0099AD] rounded-lg text-[#0099AD] hover:bg-[#0099AD] hover:border-[#0099AD] hover:text-white duration-300"
          @click="handleClickGrafik" id="lihat-button">
          <span class="mr-2 font-semibold">Lihat Grafik</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M9.80622 6.38128C10.1479 6.72299 10.1479 7.27701 9.80622 7.61872L5.43122 11.9937C5.08951 12.3354 4.53549 12.3354 4.19378 11.9937C3.85207 11.652 3.85207 11.098 4.19378 10.7563L7.95006 7L4.19378 3.24372C3.85207 2.90201 3.85207 2.34799 4.19378 2.00628C4.53549 1.66457 5.08951 1.66457 5.43122 2.00628L9.80622 6.38128Z"
              fill="#0099AD" />
          </svg>
        </button>
      </li>
    </ul>
    <ModalWrapper :showModal="showModal" :width="'w-[1000px]'" :height="'h-auto'">
      <div class="flex justify-between border-b-2">
        <div>
          <p p class="px-2 text-lg font-semibold text-black">
            Lihat Grafik
          </p>
          <div class="flex p-2">
            <p class="mr-2 text-black">Periode Laporan</p>
            <p class="text-[#0099AD]">
              {{ props.tahun !== '-' ? props.tahun : '-' }}
            </p>
          </div>
        </div>
        <div class="mt-3 mr-3 cursor-pointer" @click="showModal = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_12526_72925)">
              <path d="M18 6L6 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_12526_72925">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div class="flex my-3">
        <div class="bg-[url('../assets/img/img-cik.png')] bg-cover bg-center w-2/12 h-42 rounded-md mr-2"></div>
        <div class="bg-[#F7FBFC] rounded-md py-3 px-5 w-10/12">
          <div class="flex justify-between">
            <div>
              <p class="text-lg font-semibold text-primaryTextColor">{{ props.namaMesin }}</p>
            </div>
            <div class="flex flex-row">
              <div class="sticky top-0 z-10">
                <!--TABS2-->
                <ul class="flex flex-wrap -mb-px space-x-2 text-sm font-medium text-center text-gray-500">
                  <li class="ml-10">
                    <button @click="changeTab(1)" class="inline-flex pb-2 text-sm">
                      <svg width="24" height="24" viewBox="0 0 24 24" class="cursor-pointer" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#0099AD" />
                        <path d="M14 8L10 12L14 16" stroke="#E7F1FD" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                    </button>
                  </li>
                  <li class="ml-1">
                    <button @click="changeTab(2)" class="inline-flex pb-2 text-sm">
                      <svg width="24" height="24" viewBox="0 0 24 24" class="cursor-pointer" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#0099AD" />
                        <path d="M10 8L14 12L10 16" stroke="#E7F1FD" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                      </svg>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-if="tab === 'prev'">
            <div class="flex flex-row mt-4">
              <Chips :title="'Unit Pengelola'" :content="props.namaPengelola" />
              <Chips :title="'Unit Pembina'" :content="props.namaPembina" />
              <Chips :title="'Tahun COD'" :content="props.tahunOperasi" />
            </div>
            <div class="flex flex-row mt-3">
              <Chips :title="'Daya Terpasang'" :content="props.dayaTerpasang + ' MW'" />
              <Chips :title="'Daya Mampu(Netto)'" :content="props.dayaMampu + ' MW'" />
              <Chips :title="'Tahun Perolehan Data'" :content="props.tahunPerolehanData" />
            </div>
            <div class="flex justify-between mr-3">
              <div>
                <div class="flex mt-4 text-sm">
                  <p class="text-[#7B8DAD] font-bold">Nilai Aset Awal</p>
                  <p class="text-[#7B8DAD] ml-1">:</p>
                </div>
                <div class="flex text-sm mt-1.5">
                  <p class="mr-2 text-[#7F7F80]">Rp.</p>
                  <div class="text-[#333333]">{{ globalFormat.formatCurrencyNotFixed(props.nilaiAssetAwal) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="tab === 'next'" class="">
            <div class="text-xs">
              <div class="flex justify-between py-1">
                <div class="text-slate-500">IRR On Project</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(props.irrOnProject) }}
                  </p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between py-1">
                <div class="text-slate-500">IRR On Equity</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(props.irrOnEquity) }}
                  </p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between py-1">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(props.npvOnEquity) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between py-1">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(props.npvOnProject) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between py-1">
                <div class="text-slate-500">Average NCF</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(props.averageNcf) }}
                  </p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between py-1">
                <div class="text-slate-500">Average EAF</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(props.averageEaf) }}
                  </p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-black">
        <h1 class="my-2 text-lg font-semibold">Grafik WLC (Realisasi & Proyeksi)</h1>
        <div class="sticky top-0 z-10">
          <!--TABS2-->
          <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
            <li>
              <button @click="changeTabGrafik(1)" class="inline-flex pb-2 text-sm" :class="[
                tabGraphic === 'Semua'
                  ? 'font-semibold text-black'
                  : 'font-normal',
              ]">
                Semua
              </button>
              <div v-if="tabGraphic === 'Semua'" class="w-full h-1.5 bg-[#0099ad]"></div>
              <div v-else></div>
            </li>
            <li class="ml-5">
              <button @click="changeTabGrafik(2)" class="inline-flex pb-2 text-sm" :class="[
                tabGraphic === 'Biaya Komponen'
                  ? 'font-semibold text-black'
                  : 'font-normal',
              ]">
                Biaya Komponen
              </button>
              <div v-if="tabGraphic === 'Biaya Komponen'" class="w-full h-1.5 bg-[#0099ad]"></div>
              <div v-else></div>
            </li>
          </ul>
        </div>
        <div v-if="tabGraphic === 'Semua'">
          <div v-if="dataWLCAllMesin === null">
            <Empty />
          </div>
          <div v-else>
            <vue-echarts :option="chartWLCAllMesin" style="height: 380px" @click="handleClickWlcAll" />
            <Legend />
          </div>
        </div>
        <div v-else-if="tabGraphic === 'Biaya Komponen'">
          <div v-if="dataWLCKomMesin === null">
            <Empty />
          </div>
          <div v-else>
            <vue-echarts :option="chartWLCKomMesin" style="height: 380px" @click="handleClickWlcKom" />
            <Legend />
          </div>
        </div>
      </div>
    </ModalWrapper>
    <!-- Modal -->
    <ModalWrapper :showModal="showModalWlcAll" :width="'w-[1000px]'" :height="'h-auto'">
      <div class="flex justify-between text-gray-950 ">
        <div>
          <p class="px-2 text-lg font-semibold">
            Detail Perkembangan Unit Pertahun
          </p>
          <div class="flex p-2">
            <p class="mr-2">Periode Laporan</p>
            <p class="text-[#0099AD]">
              {{ tahunDetail }}
            </p>
          </div>
        </div>
        <div class="cursor-pointer" @click="showModalWlcAll = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_12526_72925)">
              <path d="M18 6L6 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_12526_72925">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div>
        <vue-echarts :option="chartDetailWLCAllMesin" style="height: 350px" />
      </div>
      <div class="py-4 text-gray-950">
        <p class="px-2 font-semibold">Detail Data</p>
        <div class="mt-5 overflow-x-auto border rounded-md">
          <table class="w-full text-sm rounded-md table-auto">
            <thead class="text-[#0099AD] text-xs border-b">
              <tr>
                <!-- <th class="px-2 py-2"></th> -->
                <th class="px-8 py-2 text-left">Deskripsi</th>
                <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
                <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
              </tr>
            </thead>
            <tbody v-for="(item, i) in datatableWlcAllMesin" :key="i" class="text-xs">
              <tr class="border-b bg-[#E5E7E9] cursor-pointer">
                <!-- <td scope="row" class="px-2 py-2 font-medium whitespace-nowrap">
                <div class="bg-[#F7F7F7] rounded-md flex justify-center py-1.5">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.44194 5.00444C4.19786 5.24852 3.80214 5.24852 3.55806 5.00444L0.433058 1.87944C0.18898 1.63536 0.18898 1.23964 0.433058 0.995558C0.677136 0.751481 1.07286 0.751481 1.31694 0.995558L4 3.67862L6.68306 0.995558C6.92714 0.751481 7.32286 0.751481 7.56694 0.995558C7.81102 1.23964 7.81102 1.63536 7.56694 1.87944L4.44194 5.00444Z" fill="#333333"/>
                  </svg>
                </div>
              </td> -->
                <td class="px-8 py-2 text-left">{{ item.name }}</td>
                <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.realisasi) }}</td>
                <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.planning) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ModalWrapper>
    <ModalWrapper :showModal="showModalWlcKom" :width="'w-[700px]'" :height="'h-auto'">
      <div class="flex justify-between text-gray-950">
        <div>
          <p class="px-2 text-lg font-semibold">
            Detail Perkembangan Unit Pertahun
          </p>
          <div class="flex p-2">
            <p class="mr-2">Periode Laporan</p>
            <p class="text-[#0099AD]">
              {{ tahunDetail }}
            </p>
          </div>
        </div>
        <div class="cursor-pointer" @click="showModalWlcKom = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_12526_72925)">
              <path d="M18 6L6 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
              <clipPath id="clip0_12526_72925">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div>
        <vue-echarts :option="chartDetailWLCKomMesin" style="height: 350px" />
      </div>
      <div class="py-4 text-gray-950">
        <p class="px-2 font-semibold">Detail Data</p>
        <div class="mt-5 overflow-x-auto border rounded-md">
          <table class="w-full text-sm rounded-md table-auto">
            <thead class="text-[#0099AD] text-xs border-b">
              <tr>
                <th class="px-8 py-2 text-left">Deskripsi</th>
                <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
                <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
              </tr>
            </thead>
            <tbody v-for="(item, i) in datatableWlcKomMesin" :key="i" class="text-xs">
              <tr class="border-b bg-[#E5E7E9] cursor-pointer">
                <td class="px-8 py-2 text-left">{{ item.name }}</td>
                <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.realisasi) }}</td>
                <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.planning) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ModalWrapper>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, useSlots, onMounted, nextTick } from "vue";
import { VueEcharts } from "vue3-echarts";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import Chips from "@/components/ui/Chips.vue";
import { useLamanDataTabStore } from "@/store/storeLamanDataTab";
import GlobalFormat from "@/services/format/global-format";
import GrafikService from "@/services/grafik-service";
import Legend from "@/components/Grafik/LegendGrafik.vue";
import Empty from "@/components/ui/EmptyData.vue";

const store = useLamanDataTabStore();
const grafikService = new GrafikService();
const globalFormat = new GlobalFormat();
const tabGraphic = ref("Semua");
const showModal = ref(false);
const tab = ref("next");

const dataDetailWlcAllMesin = ref<Grafik1[]>([]);
const datatableWlcAllMesin = ref<table[]>([]);
const dataDetailWlcKomMesin = ref<Grafik1[]>([]);
const datatableWlcKomMesin = ref<table[]>([]);
const dataWLCAllMesin = ref<any[]>([]);
const dataWLCKomMesin = ref<any[]>([]);
const showModalWlcAll = ref(false);
const showModalWlcKom = ref(false);
// chart WlC All Mesin
let chartWLCAllMesin = ref();
let updateWLCAllMesin = ref(true);
let tahunWLCAllMesin = ref<any>([]);
let revWLCMesin = ref<any>([]);
let sumLccWLCMesin = ref<any>([]);
let capexWLCMesin = ref<any>([]);
let comBDWLCMesin = ref<any>([]);
let fuelComWLCMesin = ref<any>([]);
let yAxisWlc = ref<any>([]);
let maxWlc = ref<any>([]);
let minWlc = ref<any>([]);
let chartDetailWLCAllMesin = ref();
let updateDetailWLCAllMesin = ref(true);
let judulDetWlcAll = ref<any>([]);
let realDetWlcAll = ref<any>([]);
let planDetWlcAll = ref<any>([]);

// chart WLC Komponen Mesin
let chartWLCKomMesin = ref();
let updateWLCKomMesin = ref(true);
let tahunWLCKomMesin = ref<any>([]);
let costCompAMesin = ref<any>([]);
let costCompCMesin = ref<any>([]);
let costCompBDMesin = ref<any>([]);
let sumCostCompMesin = ref<any>([]);
let chartDetailWLCKomMesin = ref();
let updateDetailWLCKomMesin = ref(true);
let judulDetWlcKom = ref<any>([]);
let realDetWlcKom = ref<any>([]);
let planDetWlcKom = ref<any>([]);


let forceRender = async () => {
  updateWLCAllMesin.value = false;
  await nextTick();
  updateWLCAllMesin.value = true;
};

let forceRender1 = async () => {
  updateWLCKomMesin.value = false;
  await nextTick();
  updateWLCKomMesin.value = true;
};
let forceRender5 = async () => {
  updateDetailWLCAllMesin.value = false;
  await nextTick();
  updateDetailWLCAllMesin.value = true;
};

let forceRender6 = async () => {
  updateDetailWLCKomMesin.value = false;
  await nextTick();
  updateDetailWLCKomMesin.value = true;
};


interface Props {
  // kodeSentral?: string
  idMesin: number | string,
  tahunGrafik: number,
  irrOnProject: number,
  irrOnEquity: number,
  npvOnEquity: number,
  npvOnProject: number,
  averageNcf: number,
  averageEaf: number,
  namaMesin: string,
  namaPengelola: string,
  namaPembina: string,
  tahunOperasi: string,
  dayaTerpasang: number,
  dayaMampu: number,
  tahun: number | string,
  isLihatGrafik?: boolean,
  lamanData: boolean,
  nilaiAssetAwal: number,
  tahunPerolehanData: string
}

const props = withDefaults(defineProps<Props>(), {
  isLihatGrafik: false,
  lamanData: false,
})

interface Grafik1 {
  tahun: number;
  revenue_annualized: number;
  total_wlcc_annualized: number;
  capex_annualized: number;
  cost_component_bd: number;
  cost_component_c_annualized: number;
  optimum_life_fs: number;
  bep_fs: number;
  total_revenue: number;
  revenue_komp_bd: number;
}

interface table {
  name: string;
  realisasi: number;
  planning: number;
}


onMounted(async () => {
  await grafikService
    .getGrafikWLCALLMesin({
      id_mesin: props.idMesin,
      start_year: '',
      end_year: '',
      tahun_realisasi: props.tahunGrafik
    })
    .then((res: any) => {
      let indexTerdekat;
      let tahunBEP;
      let indexBEP;
      let indexOpt;
      let indexOptimum;
      let tahunOptimum;
      let selisih = Infinity;
      let selisihOpt = Infinity;

      dataWLCAllMesin.value = res.data;

      tahunWLCAllMesin.value = [];
      revWLCMesin.value = [];
      sumLccWLCMesin.value = [];
      capexWLCMesin.value = [];
      comBDWLCMesin.value = [];
      fuelComWLCMesin.value = [];
      yAxisWlc.value = [];

      if (res.data != null) {
        for (var i = 0; i < res.data.length; i++) {
          tahunWLCAllMesin.value.push(res.data[i].tahun);
          revWLCMesin.value.push(res.data[i].revenue_annualized);
          sumLccWLCMesin.value.push(res.data[i].total_wlcc_annualized);
          capexWLCMesin.value.push(res.data[i].capex_annualized);
          comBDWLCMesin.value.push(res.data[i].cost_component_bd);
          fuelComWLCMesin.value.push(res.data[i].cost_component_c_annualized);
          yAxisWlc.value.push(res.data[i].capex_annualized + res.data[i].cost_component_bd + res.data[i].cost_component_c_annualized);
          maxWlc.value = Math.max.apply(Math, yAxisWlc.value);

          const difference = Math.abs(res.data[i].total_wlcc_annualized - res.data[i].revenue_annualized);
          if (difference < selisih) {
            indexTerdekat = i;
            indexBEP = i + 1;
            selisih = difference;
            tahunBEP = res.data[i].tahun
          }

          const diffOpt = Math.min.apply(Math, sumLccWLCMesin.value)
          if (diffOpt < selisihOpt) {
            indexOptimum = i;
            indexOpt = i + 1;
            selisihOpt = diffOpt;
            tahunOptimum = res.data[i].tahun
          }
        }
      } else {
        dataWLCAllMesin == null;
      }

      chartWLCAllMesin.value = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          bottom: "bottom",
          data: [
            "Revenue Annualized",
            "Total LCC Annualized",
            "Cost Component A (Capex) Annualized",
            "Cost Component B + D Annualized",
            "Cost Component C Annualized",
          ],
        },
        grid: {
          top: "5%",
          left: "2%",
          right: "2%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunWLCAllMesin,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = props.tahunGrafik;
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value === filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 15, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Revenue Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revWLCMesin,
            color: "#0099AD",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Total LCC Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumLccWLCMesin,
            color: "#1E1F4E",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component A (Capex) Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: capexWLCMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [80, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Max', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: maxWlc },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'BEP',
                    xAxis: indexTerdekat
                  },
                  {
                    xAxis: indexTerdekat
                  }
                ],
              ]
            },
            color: "#0D5A71",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B + D Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comBDWLCMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [85, 30],
              itemStyle: { color: '#295C02' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: maxWlc },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#D9EBC1'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'Optimum Life',
                    xAxis: indexOptimum
                  },
                  {
                    xAxis: indexOptimum
                  }
                ],
              ]
            },
            color: "#37B1D5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component C Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: fuelComWLCMesin,
            color: "#CCF2FF",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
      };
      forceRender();
    });

  await grafikService
    .getGrafikWLCKomMesin({
      id_mesin: props.idMesin,
      start_year: '',
      end_year: '',
      tahun_realisasi: props.tahunGrafik
    })
    .then((res: any) => {
      dataWLCKomMesin.value = res.data;
      tahunWLCKomMesin.value = [];
      costCompAMesin.value = [];
      costCompCMesin.value = [];
      costCompBDMesin.value = [];
      sumCostCompMesin.value = [];
      if (res.data != null) {
        for (var i = 0; i < res.data.length; i++) {
          tahunWLCKomMesin.value.push(res.data[i].tahun);
          costCompAMesin.value.push(res.data[i].cost_komp_a);
          costCompCMesin.value.push(res.data[i].cost_komp_c);
          costCompBDMesin.value.push(res.data[i].cost_komp_bd);
          sumCostCompMesin.value.push(
            res.data[i].cost_komp_a +
            res.data[i].cost_komp_b +
            res.data[i].cost_komp_c +
            res.data[i].cost_komp_d
          );
        }
      } else {
        dataWLCKomMesin == null;
      }
      chartWLCKomMesin.value = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          bottom: "bottom",
          padding: 0,
          data: ["Total Cost", "Cost Component A", "Cost Component B + D", "Cost Component C"],
        },
        grid: {
          top: "5%",
          left: "2%",
          right: "2%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunWLCKomMesin,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = props.tahunGrafik;
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value === filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 15, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Cost Component A",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: costCompAMesin,
            color: "#068D9D",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B + D",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: costCompBDMesin,
            color: "#6D9DC5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component C",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: costCompCMesin,
            color: "#CCF2FF",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Total Cost",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumCostCompMesin,
            color: "#53599A",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
      };
      forceRender1();
    });
})
let tahunDetail = ref("");

function handleClickWlcAll(param: any) {
  showModalWlcAll.value = true;
  tahunDetail.value = tahunWLCAllMesin.value[param.dataIndex];
  // console.log(tahunDetail.value);

  grafikService
    .getGrafikWLCALLDetailMesin({
      id_mesin: props.idMesin,
      tahun_realisasi: props.tahunGrafik,
      tahun: tahunWLCAllMesin.value[param.dataIndex],
    })
    .then((res: any) => {
      judulDetWlcAll.value = [];
      realDetWlcAll.value = [];
      planDetWlcAll.value = [];

      dataDetailWlcAllMesin.value = res.data.graph;
      datatableWlcAllMesin.value = res.data.table;
      res.data.graph.sort((a: any, b: any) => a.nomor - b.nomor);
      res.data.table.sort((a: any, b: any) => a.nomor - b.nomor);

      console.log(datatableWlcAllMesin.value);

      for (var i = 0; i < res.data.graph.length; i++) {
        judulDetWlcAll.value.push(res.data.graph[i].judul);
        realDetWlcAll.value.push(res.data.graph[i].realisasi);
        planDetWlcAll.value.push(res.data.graph[i].planning);
      }
      chartDetailWLCAllMesin.value = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          bottom: "bottom",
          data: ["Realisasi + Proyeksi", "Planning"],
        },
        grid: {
          top: "3%",
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: judulDetWlcAll,
            axisLabel: {
              fontSize: 10,
              rotate: 25
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 20, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Planning",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: planDetWlcAll,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Realisasi + Proyeksi",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: realDetWlcAll,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
        color: ["#0D5A71", "#97E4FF"],
      };
      forceRender5();
    });
}

function handleClickWlcKom(param: any) {
  showModalWlcKom.value = true;
  tahunDetail.value = tahunWLCKomMesin.value[param.dataIndex];
  // console.log(tahunDetail.value);

  grafikService
    .getGrafikWLCKomDetailMesin({
      id_mesin: props.idMesin,
      tahun_realisasi: props.tahunGrafik,
      tahun: tahunWLCKomMesin.value[param.dataIndex],
    })
    .then((res: any) => {
      judulDetWlcKom.value = [];
      realDetWlcKom.value = [];
      planDetWlcKom.value = [];

      dataDetailWlcKomMesin.value = res.data.graph;
      datatableWlcKomMesin.value = res.data.table;
      res.data.graph.sort((a: any, b: any) => a.nomor - b.nomor);
      res.data.table.sort((a: any, b: any) => a.nomor - b.nomor);

      for (var i = 0; i < res.data.graph.length; i++) {
        judulDetWlcKom.value.push(res.data.graph[i].judul);
        realDetWlcKom.value.push(res.data.graph[i].realisasi);
        planDetWlcKom.value.push(res.data.graph[i].planning);
      }

      chartDetailWLCKomMesin.value = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          bottom: "bottom",
          data: ["Realisasi + Proyeksi", "Planning"],
        },
        grid: {
          top: "3%",
          left: "2%",
          right: "2%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: judulDetWlcKom,
            axisLabel: {
              fontSize: 10,
              rotate: 10
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 20, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Planning",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: planDetWlcKom,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Realisasi + Proyeksi",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: realDetWlcKom,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
        color: ["#0D5A71", "#97E4FF"],
      };
      forceRender6();
    });
}

function changeTabGrafik(tabs: number) {
  if (tabs === 1) {
    tabGraphic.value = "Semua";
  } else if (tabs === 2) {
    tabGraphic.value = "Biaya Komponen";
  }
}

function handleClickGrafik() {
  showModal.value = true;
}

function changeTab(tabs: number) {
  if (tabs === 1) {
    tab.value = "prev";
  } else if (tabs === 2) {
    tab.value = "next";
  }
}

const handleClick = (title: string) => {
  if (props.lamanData === true) {
    selectedTitle.value = title;
    store.currentTab = title;
  }
  selectedTitle.value = title;
}

const tabTitles = ref();
tabTitles.value = useSlots()
  ?.default?.()
  .map((tab) => tab?.props?.title);
const selectedTitle = ref(tabTitles.value[0]);
provide("selectedTitle", selectedTitle);
</script>

<style scoped>
ul li.selected {
  border-bottom-width: 4px;
  border-color: #0099AD;
  color: #0099AD;
}

#lihat-button:hover>svg *,
#lihat-button:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(28 100 242 / var(--tw-bg-opacity));
  fill: #ffffff;
}
</style>