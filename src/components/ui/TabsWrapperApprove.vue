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
          class="flex items-center px-3 py-2 border border-[#0099AD] rounded-lg text-[#0099AD] hover:bg-hoverColor hover:border-[#0099AD] hover:text-white duration-300"
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
      <div class="flex items-center justify-between border-b-2">
        <div>
          <p p class="px-2 text-lg font-semibold text-primaryTextColor">
            Lihat Grafik
          </p>
          <div class="flex p-2">
            <p class="mr-2 text-primaryTextColor">Periode Laporan</p>
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
      <div class="flex items-center my-3">
        <img v-if="props.photo !== ''" :src="props.photo" alt="Preview"
          class="object-cover w-40 mr-6 rounded-lg h-44"></img>
        <div v-else class="w-40 mr-6 bg-red-500 rounded-lg h-44"></div>
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
                      <div class="w-7 h-7 rounded-full bg-[#0099AD] flex justify-center items-center"
                        :class="tab === 'prev' ? 'bg-gray-500' : ''">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 4L6 8L10 12" stroke="#E7F1FD" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>
                      </div>
                    </button>
                  </li>
                  <li class="ml-1">
                    <button @click="changeTab(2)" class="inline-flex pb-2 text-sm">
                      <div class="w-7 h-7 rounded-full bg-[#0099AD] flex justify-center items-center"
                        :class="tab === 'next' ? 'bg-gray-500' : ''">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 4L10 8L6 12" stroke="#E7F1FD" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-if="tab === 'prev'">
            <div class="flex flex-row mt-4">
              <Chips :title="'Unit Pengelola'" :content="props.namaPengelola" class="block w-58" />
              <Chips :title="'Unit Pembina'" :content="props.namaPembina ? props.namaPembina : '-'"
                class="block w-56 truncate cursor-pointer"
                :class="props.namaPembina.length >= 16 ? 'cursor-pointer' : ''" @mouseenter="detailPembina"
                @mouseleave="detailPembina">
              </Chips>
              <Chips :title="'Tahun COD'" :content="props.tahunOperasi" />
            </div>
            <Transition>
              <div v-if="pembinaHover" v-show="props.namaPembina !== '' && props.namaPembina.length > 16"
                class="bg-blue-50 border border-[#0099AD] absolute text-xs p-2 -mt-[60px] z-10 rounded-lg whitespace-nowrap duration-300 font-bold text-[#0099AD]"
                :class="props.namaPembina.length <= 16 ? 'ml-[350px]' : 'ml-[195px] '" id="tooltipContentPembina">
                {{ props.namaPembina ? props.namaPembina : '-' }}
              </div>
            </Transition>
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
          <div v-if="tab === 'next'">
            <div class="text-xs">
              <div class="flex justify-between py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR On Project</div>
                  <PopUp class="ml-2" title="WACC On Project"
                    :content="props.waccOnProject ? globalFormat.formatEnergy(props.waccOnProject) : '-'" />
                </div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ props.irrOnProject === '' ? 'NUM' : globalFormat.formatRupiah(props.irrOnProject) }}
                  </p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR On Equity</div>
                  <PopUp class="ml-2" title="WACC On Equity"
                    :content="props.waccOnEquity ? globalFormat.formatEnergy(props.waccOnEquity) : '-'" />
                </div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ props.irrOnEquity === '' ? 'NUM' : globalFormat.formatRupiah(props.irrOnEquity) }}
                  </p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between py-1">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(props.npvOnProject) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between py-1">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(props.npvOnEquity) }}
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
      <div class="text-primaryTextColor">
        <div class="flex items-center">
          <h1 class="my-2 text-lg font-semibold">Grafik WLC (Realisasi & Proyeksi)</h1>
          <StatusGrafik :status-grafik="props.statusGrafik" class="mt-1.5 ml-4" />
        </div>
        <div class="sticky top-0 z-10">
          <!--TABS2-->
          <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
            <li>
              <button @click="changeTabGrafik(1)" class="inline-flex pb-2 text-sm" :class="[
                tabGraphic === 'Semua'
                  ? 'font-semibold text-primaryTextColor'
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
                  ? 'font-semibold text-primaryTextColor'
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
                <th class="px-8 py-2 text-left">Deskripsi</th>
                <th class="px-1 py-2 text-right">Realisasi + Proyeksi (Rp (Juta))</th>
              </tr>
            </thead>
            <tbody v-for="(item, i) in datatableWlcAllMesin" :key="i" class="text-xs">
              <tr class="border-b bg-[#E5E7E9]">
                <td class="px-8 py-2 text-left">{{ item.name }}</td>
                <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.realisasi) }}</td>
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
                <th class="px-1 py-2 text-right">Realisasi + Proyeksi (Rp (Juta))</th>
              </tr>
            </thead>
            <tbody v-for="(item, i) in datatableWlcKomMesin" :key="i" class="text-xs">
              <tr class="border-b bg-[#E5E7E9]">
                <td class="px-8 py-2 text-left">{{ item.name }}</td>
                <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.realisasi) }}</td>
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
import PopUp from "@/components/Grafik/PoupWacc.vue";
import { useLamanDataTabStore } from "@/store/storeLamanDataTab";
import GlobalFormat from "@/services/format/global-format";
import GrafikService from "@/services/grafik-service";
import DetailSentralService from "@/services/detail-sentral-service";
import Legend from "@/components/Grafik/LegendGrafik.vue";
import Empty from "@/components/ui/EmptyData.vue";
import StatusGrafik from "@/components/Status/StatusGrafik.vue";

const store = useLamanDataTabStore();
const grafikService = new GrafikService();
const detailSentralService = new DetailSentralService();
const globalFormat = new GlobalFormat();
const tabGraphic = ref("Semua");
const showModal = ref(false);
const pembinaHover = ref(false);
const tab = ref("prev");

const dataDetailWlcAllMesin = ref<Grafik1[]>([]);
const datatableWlcAllMesin = ref<table[]>([]);
const dataDetailWlcKomMesin = ref<Grafik1[]>([]);
const datatableWlcKomMesin = ref<table[]>([]);
const dataWLCAllMesin = ref<any[]>([]);
const dataWLCKomMesin = ref<any[]>([]);
const showModalWlcAll = ref(false);
const showModalWlcKom = ref(false);
// chart WlC All Mesin
const profitLoss = ref<any[]>([]);
const chartWLCAllMesin = ref()
const updateWLCAllMesin = ref(true)
const tahunWLCAllMesin = ref<any>([])
const revWLCMesin = ref<any>([])
const sumLccWLCMesin = ref<any>([])
const capexWLCMesin = ref<any>([])
const comBDWLCMesin = ref<any>([])
const fuelComWLCMesin = ref<any>([])
const yAxisWlc = ref<any>([])
const maxWlcBep = ref<any>([])
const maxWlcOpt = ref<any>([])

const chartDetailWLCAllMesin = ref()
const updateDetailWLCAllMesin = ref(true)
const judulDetWlcAll = ref<any>([])
const realDetWlcAll = ref<any>([])
const planDetWlcAll = ref<any>([])

// chart WLC Komponen Mesin
const chartWLCKomMesin = ref()
const updateWLCKomMesin = ref(true)
const tahunWLCKomMesin = ref<any>([])
const costCompAMesin = ref<any>([])
const costCompCMesin = ref<any>([])
const costCompBDMesin = ref<any>([])
const sumCostCompMesin = ref<any>([])

const chartDetailWLCKomMesin = ref()
const updateDetailWLCKomMesin = ref(true)
const judulDetWlcKom = ref<any>([])
const realDetWlcKom = ref<any>([])
const planDetWlcKom = ref<any>([])


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
let forceRender2 = async () => {
  updateDetailWLCAllMesin.value = false;
  await nextTick();
  updateDetailWLCAllMesin.value = true;
};

let forceRender3 = async () => {
  updateDetailWLCKomMesin.value = false;
  await nextTick();
  updateDetailWLCKomMesin.value = true;
}

interface Props {
  // kodeSentral?: string
  tahunGrafik: number
  idMesin: number | string
  irrOnEquity: number | string
  irrOnProject: number | string
  waccOnEquity: number
  waccOnProject: number
  npvOnProject: number
  npvOnEquity: number
  averageEaf: number
  averageNcf: number
  namaPengelola: string
  namaMesin: string
  tahunOperasi: string
  namaPembina: string
  dayaMampu: number
  dayaTerpasang: number
  isLihatGrafik?: boolean
  tahun: number | string
  nilaiAssetAwal: number
  lamanData: boolean
  jumlahMesin: number
  tahunPerolehanData: string
  photo: any
  statusGrafik: string
}

const props = withDefaults(defineProps<Props>(), {
  lamanData: false,
  isLihatGrafik: false,
})

interface Grafik1 {
  tahun: number
  revenue_annualized: number
  total_wlcc_annualized: number
  capex_annualized: number
  cost_component_bd: number
  cost_component_c_annualized: number
  optimum_life_fs: number
  bep_fs: number
  total_revenue: number
  revenue_komp_bd: number
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

      dataWLCAllMesin.value = res.data;

      tahunWLCAllMesin.value = [];
      revWLCMesin.value = [];
      sumLccWLCMesin.value = [];
      capexWLCMesin.value = [];
      comBDWLCMesin.value = [];
      fuelComWLCMesin.value = [];
      yAxisWlc.value = [];
      var isBepFounded = false;

      if (res.data != null) {
        var wlcAnnu = [];
        var revenAnnu = [];
        var capexAnnu = [];
        var comBDAnnu = [];
        var fuelComAnnu = [];
        var finalMax;

        for (var i = 0; i < res.data.length; i++) {
          tahunWLCAllMesin.value.push(res.data[i].tahun);
          revWLCMesin.value.push(res.data[i].revenue_annualized);
          sumLccWLCMesin.value.push(res.data[i].total_wlcc_annualized);
          capexWLCMesin.value.push(res.data[i].capex_annualized);
          profitLoss.value.push(res.data[i].profit_loss);
          comBDWLCMesin.value.push(res.data[i].cost_component_bd);
          fuelComWLCMesin.value.push(res.data[i].cost_component_c_annualized);
          yAxisWlc.value.push(res.data[i].capex_annualized + res.data[i].cost_component_bd + res.data[i].cost_component_c_annualized);
          maxWlcBep.value = Math.max.apply(Math, yAxisWlc.value) * 1.1;
          maxWlcOpt.value = Math.max.apply(Math, yAxisWlc.value);

          wlcAnnu.push(res.data[i].total_wlcc_annualized)
          revenAnnu.push(res.data[i].revenue_annualized)
          capexAnnu.push(res.data[i].capex_annualized)
          comBDAnnu.push(res.data[i].cost_component_bd)
          fuelComAnnu.push(res.data[i].cost_component_c_annualized)

          if (i > 0 && !isBepFounded && res.data[i].revenue_annualized >= res.data[i].total_wlcc_annualized) {
            const selisihNow = res.data[i].revenue_annualized - res.data[i].total_wlcc_annualized;
            const selisihMinus1 = res.data[i - 1].revenue_annualized - res.data[i - 1].total_wlcc_annualized;
            if (Math.abs(selisihNow) > Math.abs(selisihMinus1)) {
              indexTerdekat = i - 1
              indexBEP = i
              tahunBEP = res.data[i - 1].tahun
            } else {
              indexTerdekat = i
              indexBEP = i + 1
              tahunBEP = res.data[i].tahun
            }
            isBepFounded = true
          }

          const finalOptimum = Math.max.apply(Math, profitLoss.value);
          if (finalOptimum == res.data[i].profit_loss) {
            indexOptimum = i;
            indexOpt = i + 1;
            tahunOptimum = res.data[i].tahun;
          }
        }
        var maxWlc = Math.max.apply(Math, wlcAnnu)
        var maxRev = Math.max.apply(Math, revenAnnu)
        var maxCapex = Math.max.apply(Math, capexAnnu)
        var maxComBD = Math.max.apply(Math, comBDAnnu)
        var maxFuelCom = Math.max.apply(Math, fuelComAnnu)

        var listOfMax = [maxCapex, maxComBD, maxFuelCom, maxWlc, maxRev]
        finalMax = Math.max.apply(Math, listOfMax)
      } else {
        dataWLCAllMesin == null
      }

      chartWLCAllMesin.value = isBepFounded ? {
        title: {
          show: false
        },
        tooltip: {
          axisPointer: {
            type: "shadow",
          },
          trigger: "axis",
        },
        legend: {
          data: [
            "Revenue Annualized",
            "Total LCC Annualized",
            "Cost Component A (Capex) Annualized",
            "Cost Component B + D Annualized",
            "Cost Component C Annualized"
          ],
          bottom: "bottom",
        },
        grid: {
          top: "8%",
          left: "3%",
          right: "3%",
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
                } else if (value == filterTahun) {
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
              padding: [30, 20, 30, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 20,
            min: 0,
            max: finalMax ? finalMax * 1.1 : finalMax
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              data: [{ name: 'Max', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: finalMax }],
              symbolOffset: [0, 0]
            },
            markArea: {
              silent: true,
              itemStyle: { color: '#E2EAF2' },
              label: { show: false },
              data: [[{ name: 'BEP', xAxis: indexTerdekat }, { xAxis: indexTerdekat }]]
            },
            color: "#0D5A71",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              data: [{ name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: finalMax }],
              symbolOffset: [0, 20]
            },
            markArea: {
              silent: true,
              itemStyle: { color: '#D9EBC1' },
              label: { show: false },
              data: [[{ name: 'Optimum Life', xAxis: indexOptimum }, { xAxis: indexOptimum }]]
            },
            color: "#37B1D5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
          },
        ],
      } : {
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
          left: "3%",
          top: "8%",
          bottom: "15%",
          right: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            data: tahunWLCAllMesin,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = props.tahunGrafik;
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value == filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
            },
            type: "category",
          },
        ],
        yAxis: [
          {
            name: "Triliun Rupiah",
            type: "value",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 30, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            nameLocation: "center",
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            min: 0,
            max: finalMax ? finalMax * 1.1 : finalMax,
            splitNumber: 20,
          },
        ],
        series: [
          {
            type: "line",
            name: "Revenue Annualized",
            showSymbol: false,
            smooth: true,
            color: "#0099AD",
            data: revWLCMesin,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            }
          },
          {
            type: "line",
            name: "Total LCC Annualized",
            showSymbol: false,
            smooth: true,
            color: "#1E1F4E",
            data: sumLccWLCMesin,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            }
          },
          {
            type: "bar",
            name: "Cost Component A (Capex) Annualized",
            emphasis: {
              focus: "series",
            },
            stack: "Ad",
            color: "#0D5A71",
            data: capexWLCMesin,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            }
          },
          {
            name: 'Cost Component B + D Annualized',
            stack: "Ad",
            type: 'bar',
            data: comBDWLCMesin,
            emphasis: {
              focus: 'series'
            },
            markPoint: {
              symbol: 'rect',
              symbolSize: [85, 30],
              symbolOffset: [0, 20],
              itemStyle: { color: '#295C02' },
              silent: true,
              data: [{ name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: finalMax }],
              label: { fontSize: 10, fontWeight: 'bold' },
            },
            color: "#37B1D5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
            markArea: {
              itemStyle: { color: '#D9EBC1' },
              label: { show: false },
              data: [[{ name: 'Optimum Life', xAxis: indexOptimum }, { xAxis: indexOptimum }]],
              silent: true
            }
          },
          {
            stack: "Ad",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: fuelComWLCMesin,
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            color: "#CCF2FF",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
            name: "Cost Component C Annualized",
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
          top: "8%",
          left: "5%",
          right: "3%",
          bottom: "8%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = props.tahunGrafik;
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value == filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
            },
            data: tahunWLCKomMesin
          },
        ],
        yAxis: [
          {
            name: "Triliun Rupiah",
            nameLocation: "center",
            type: "value",
            nameTextStyle: {
              padding: [30, 20, 30, -25],
              fontSize: 14,
              align: "left",
              fontWeight: "bold",
              color: "#4D5E80",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 20,
            min: 0
          },
        ],
        series: [
          {
            type: "bar",
            stack: "Ad",
            name: "Cost Component A",
            data: costCompAMesin,
            color: "#068D9D",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            stack: "Ad",
            name: "Cost Component B + D",
            data: costCompBDMesin,
            color: "#6D9DC5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
            emphasis: {
              focus: "series",
            }
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          data: ["Realisasi + Proyeksi"],
        },
        grid: {
          top: "3%",
          left: "3%",
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
              padding: [30, 20, 25, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 10,
            min: 0,
          },
        ],
        series: [
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
          },
        ],
        color: ["#97E4FF"],
      };
      forceRender2();
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
          data: ["Planning"],
        },
        grid: {
          top: "3%",
          left: "4%",
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
              padding: [50, 20, 25, -15],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 10,
            min: 0,
          },
        ],
        series: [
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
          },
        ],
        color: ["#97E4FF"],
      };
      forceRender3();
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

function detailPembina() {
  pembinaHover.value = !pembinaHover.value;
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
#tooltipContentPembina::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  rotate: 270deg;
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

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