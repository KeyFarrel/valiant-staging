<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from "vue";
import Empty from "@/components/icons/IconEmptyData.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue"
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import PetaService from "@/services/peta-service";
import GrafikService from "@/services/grafik-service";
import type { CheckboxValueType } from 'element-plus';
import type { BaseResponse, ResOpexBD } from "@/types/LamanAnalitik/TypeFinansial";
import { id } from "date-fns/locale";
import DynamicScatterPlot from "@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue";
import { notifyError } from "@/services/helper/toast-notification";

const petaService = new PetaService();
const grafikService = new GrafikService();
// const periodeTahun = ref<Array<number>>([]);
const checkAll = ref(false)
const checkDmn = ref(true)
const indeterminate = ref(false)
const indeterminateDmn = ref(false)
const value = ref<CheckboxValueType[]>([]);
const dmn = ref<CheckboxValueType[]>([1, 2, 3])
const showModal = ref<boolean>(false);

const props = defineProps<{
  itemsPembangkit: { id: string; name: string }[]
  itemsDayaMampu: { id: string; name: string }[]
  title: string
  yearRange: number[]
}>()

const isLoading = ref(false)
const graphData: Ref<{
  legends?: { label: string; color: string }[]
  source: any
  series: any
  pln: { x: number; y: number }
  ipp: { x: number; y: number }
  isEmpty?: boolean
  dataZoom: { start: number, type: string, orient: string }
}> = ref({
  legends: [],
  source: [],
  series: [],
  pln: { x: 0, y: 0 },
  ipp: { x: 0, y: 0 },
  isEmpty: true,
  dataZoom: { start: 0, type: 'inside', orient: 'vertical' }
})
const filter: Ref<{
  kategoriPembangkit: string[]
  tahun: number
}> = ref({
  kategoriPembangkit: [""],
  tahun: new Date().getFullYear()
})

// const fetchTahunTerakhirRealisasi = async () => {
//   try {
//     const response: any = await grafikService.getTahunTerakhirRealisasiAnalitik();
//     // filter.value.tahun = response.data.tahun;
//   } catch (error) {
//     console.error('Fetch Tahun Terakhir Realisasi Error : ' + error);
//   }
// }
const fetchInitialPembangkit = async () => {
  try {
    const response: any = await grafikService.getInitialPembangkit();
    for (const iterator of response.data) {
      value.value.push(iterator.kode_jenis_pembangkit);
    }
  } catch (error) {
    console.error('Fetch Initial Pembangkit Error : ', error);
  }
}

async function getDataGraph() {
  try {
    isLoading.value = true
    const response: BaseResponse<ResOpexBD[]> = await grafikService.getGraphicOpexBD({
      kode_jenis_pembangkit: value.value ? value.value : "",
      id_daya: dmn.value ? dmn.value : "",
      periode: filter.value.tahun.toString()
    })
    if (response.success) {
      const data = response.data[0]
      graphData.value.isEmpty = data.grafik === null
      graphData.value.series = []
      graphData.value.legends = []
      graphData.value.source = []
      graphData.value.pln.x = data.average_daya_terpasang
      graphData.value.pln.y = data.average_opex
      graphData.value.ipp.x = Math.min.apply(Math, data.grafik?.map(graph => graph.data.daya_terpasang)) // min daya
      graphData.value.ipp.y = data.average_ipp_opex
      data.legend?.map((item, index) => {
        graphData.value.legends?.push(item)
        const scatterTemplate: {
          name: string
          type: string
          data: any
          color: string
        } = {
          name: item.label,
          type: 'scatter',
          data: [],
          color: item.color,
        }
        data.grafik?.map(graph => {
          if (graph.kode_jenis_kit === item.label) {
            scatterTemplate.data.push([graph.data.daya_terpasang, graph.data.value_b + graph.data.value_d, 5, graph.nama_mesin])
            graphData.value.source?.push([graph.data.daya_terpasang, graph.data.value_b + graph.data.value_d])
          }
        })
        graphData.value.series.push(scatterTemplate)
      })
      isLoading.value = false
    }
  } catch (e) {
    isLoading.value = false
    console.log(e)
  }
}

async function getDataGraphNoDMN() {
  try {
    isLoading.value = true
    const response: BaseResponse<ResOpexBD[]> = await grafikService.getGraphicOpexBD({
      kode_jenis_pembangkit: value.value ? value.value : "",
      id_daya: [],
      periode: filter.value.tahun.toString()
    })
    if (response.success) {
      const data = response.data[0];
      graphData.value.isEmpty = data.grafik === null;
      graphData.value.series = [];
      graphData.value.legends = [];
      graphData.value.source = [];
      graphData.value.pln.x = data.average_daya_terpasang;
      graphData.value.pln.y = data.average_opex;
      graphData.value.ipp.x = Math.min.apply(Math, data.grafik?.map(graph => graph.data.daya_terpasang)); // min daya
      graphData.value.ipp.y = data.average_ipp_opex;
      data.legend?.map((item, index) => {
        graphData.value.legends?.push(item);
        const scatterTemplate: {
          name: string
          type: string
          data: any
          color: string
        } = {
          name: item.label,
          type: 'scatter',
          data: [],
          color: item.color,
        };
        data.grafik?.map(graph => {
          if (graph.kode_jenis_kit === item.label) {
            scatterTemplate.data.push([graph.data.daya_terpasang, graph.data.value_b + graph.data.value_d, 5, graph.nama_mesin]);
            graphData.value.source?.push([graph.data.daya_terpasang, graph.data.value_b + graph.data.value_d]);
          };
        });
        graphData.value.series.push(scatterTemplate);
      });
      isLoading.value = false;
    };
  } catch (e) {
    isLoading.value = false;
    console.log(e);
  };
};

const closeModal = () => {
  if (value.value.length) {
    showModal.value = false
  } else if (value.value.length === 0 && filter.value.tahun === null) {
    notifyError('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
  } else if (filter.value.tahun === null) {
    notifyError('Mohon pilih 1 tahun!', 5000);
  } else {
    notifyError('Mohon pilih minimal 1 kategori pembangkit!', 5000);
  }
}

const applyFilter = async () => {
  if (value.value.length) {
    getDataGraph();
    showModal.value = false;
  } else if (value.value.length === 0 && filter.value.tahun === null) {
    notifyError('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
  } else if (filter.value.tahun === null) {
    notifyError('Mohon pilih 1 tahun!', 5000);
  } else {
    notifyError('Mohon pilih minimal 1 kategori pembangkit!', 5000);
  }
}

const applyFilterNoDMN = async () => {
  if (value.value.length) {
    getDataGraphNoDMN();
    showModal.value = false;
  } else if (value.value.length === 0 && filter.value.tahun === null) {
    notifyError('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
  } else if (filter.value.tahun === null) {
    notifyError('Mohon pilih 1 tahun!', 5000);
  } else {
    notifyError('Mohon pilih minimal 1 kategori pembangkit!', 5000);
  }
}

// const fetchPeriodeTahunSentral = async () => {
//   try {
//     const response: any = await petaService.getYearListBPA();
//     periodeTahun.value = [response.data[0].tahun, response.data[response.data.length - 1].tahun];
//   } catch (error) {
//     console.error('Fetch Tahun Grafik Sentral Error : ' + error);
//   }
// }

watch(value, (val) => {
  if (val.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (val.length === props.itemsPembangkit.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    value.value = props.itemsPembangkit.map((_) => _.name)
  } else {
    value.value = []
  }
}

watch(dmn, (val) => {
  if (val.length === 0) {
    checkDmn.value = false
    indeterminateDmn.value = false
  } else if (val.length === props.itemsDayaMampu.length) {
    checkDmn.value = true
    indeterminateDmn.value = false
  } else {
    indeterminateDmn.value = true
  }
})

const handleCheckDmn = (val: CheckboxValueType) => {
  indeterminateDmn.value = false
  if (val) {
    dmn.value = props.itemsDayaMampu.map((_) => _.id)
  } else {
    dmn.value = []
  }
}

onMounted(async () => {
  isLoading.value = true
  await fetchInitialPembangkit();
  // await fetchTahunTerakhirRealisasi();
  // fetchPeriodeTahunSentral();
  getDataGraph();
})
</script>

<template>
  <div class="flex flex-col h-full px-6 pt-4 pb-4 mt-4 space-y-1.5 bg-white rounded-lg">
    <div class="flex">
      <h2 class="text-lg font-semibold text-primaryTextColor mt-2.5 pl-2">{{ props.title }}</h2>
      <button type="button" id="hover-button"
        class="text-[#0099AD] bg-white border relative border-[#0099AD] hover:bg-[#0099AD] hover:text-white duration-300 focus:ring-2 focus:ring-[#9ddee7] ml-4 p-2.5 font-medium rounded-lg text-sm flex justify-center items-center"
        @click="showModal = !showModal">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
          <path
            d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
            fill="#0099AD" />
        </svg>
        Filter
        <div v-if="value.length || filter.tahun"
          class="absolute z-10 border-2 border-[#FFE5E6] w-2.5 h-2.5 rounded-full right-0.5 top-0.5  bg-warningColor">
        </div>
      </button>
      <ModalWrapper :show-modal="showModal" :width="'w-[500px]'" :height="'h-auto'">
        <div class="flex flex-col space-y-3">
          <div class="flex justify-between">
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4.6665 7.33073H11.3332V8.66406H4.6665V7.33073ZM2.6665 4.66406H13.3332V5.9974H2.6665V4.66406ZM6.6665 9.9974H9.33317V11.3307H6.6665V9.9974Z"
                  fill="#333333" />
              </svg>
              <span class="text-base font-semibold text-primaryTextColor">Filter</span>
            </div>
            <button @click="closeModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="flex flex-col space-y-0.5">
            <label for="" class="text-sm font-semibold text-labelColor">Kategori Pembangkit</label>
            <el-select v-model="value" multiple clearable collapse-tags placeholder="Select Pembangkit"
              popper-class="custom-header" :max-collapse-tags="15" class="w-full">
              <template #header>
                <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                  Select All Items
                </el-checkbox>
              </template>
              <el-option v-for="item in props.itemsPembangkit" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
          <div v-show="value.includes('PLTU')" class="flex flex-col space-y-1">
            <label class="font-semibold text-labelColor">DMN</label>
            <el-select v-model="dmn" multiple clearable collapse-tags placeholder="Pilih DMN"
              popper-class="custom-header" :max-collapse-tags="15" class="w-full text-primaryTextColor">
              <template #header>
                <el-checkbox v-model="checkDmn" :indeterminateDmn="indeterminateDmn" @change="handleCheckDmn">
                  Select All Items
                </el-checkbox>
              </template>
              <el-option v-for="(dmnItem, dmnIndex) in props.itemsDayaMampu" :key="dmnIndex" :label="dmnItem.name"
                :value="dmnItem.id" />
            </el-select>
            <div class="flex -mb-2">
              <p class="text-[#FF5656] text-lg mr-1 -mt-1">*</p>
              <p class="text-[#333333] text-xs ml-1">DMN hanya akan muncul jika Anda memilih PLTU dari Kategori
                Pembangkit</p>
            </div>
          </div>
          <div class="flex flex-col space-y-0.5">
            <label for="" class="text-sm font-semibold text-labelColor">Tahun</label>
            <VueDatePicker v-model="filter.tahun" placeholder="Pilih Periode" :format-locale="id"
              :yearRange="props.yearRange" :enable-time-picker="false" :hideInputIcon="false" :clearable="false"
              :showNowButton="true" :year-picker="true" :month-change-on-scroll="false" :teleport="true" auto-apply />
          </div>
          <div class="flex justify-end">
            <div class="flex items-start">
              <button type="submit" @click="value = []"
                class="w-full text-[#0099AD] bg-white border-2 hover:text-white duration-300 border-primaryColor hover:border-hoverColor hover:bg-hoverColor active:ring-2 active:outline-none active:ring-[#0099AD] font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center">
                Reset
              </button>
              <div v-if="value.includes('PLTU')">
                <button type="submit" @click="applyFilter()"
                  class="w-full text-white bg-[#0099AD] hover:bg-hoverColor duration-300 active:ring-2 active:outline-none active:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center">
                  Terapkan
                </button>
              </div>
              <div v-else>
                <button type="submit" @click="applyFilterNoDMN()"
                  class="w-full text-white bg-[#0099AD] hover:bg-hoverColor duration-300 active:ring-2 active:outline-none active:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center">
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </div>
    <div class="flex">
      <div
        class="badge m-1 font-bold text-xs badge-lg text-[#0099AD] border-[#0099AD] badge-outline bg-primaryColor bg-opacity-5">
        <p class="mr-2 text-xs">Kategori Pembangkit : </p>
        <div v-for="item in value.join()">
          <div class="text-xs font-semibold tracking-wider">
            {{ item }}
          </div>
        </div>
      </div>
      <div v-show="value.includes('PLTU')"
        class="badge m-1 font-bold text-xs badge-lg text-[#0099AD] border-[#0099AD] badge-outline bg-primaryColor bg-opacity-5">
        <p class="mr-2 text-xs">DMN : </p>
        <div v-for="itemsDMN in dmn.join()">
          <div>
            <div v-show="itemsDMN == '1'" class="mr-1 text-xs font-semibold">PLTU < 100,</div>
                <div v-show="itemsDMN == '2'" class="mr-1 text-xs font-semibold">PLTU 100 - 400,</div>
                <div v-show="itemsDMN == '3'" class="text-xs font-semibold">PLTU > 400</div>
            </div>
          </div>
        </div>
        <div
          class="badge m-1 font-bold text-xs badge-lg text-[#0099AD] border-[#0099AD] badge-outline bg-primaryColor bg-opacity-5">
          <p class="mr-2 text-xs">Tahun : </p>
          <div class="text-xs font-semibold tracking-wider">
            {{ filter.tahun }}
          </div>
        </div>
      </div>
      <ShimmerLoading v-if="isLoading" class="w-full h-[460px] mt-3 mb-3" />
      <div v-else>
        <DynamicScatterPlot v-if="!graphData.isEmpty" :source="graphData.source" :series="graphData.series"
          :legends="graphData.legends || []" :pln="graphData.pln" :ipp="graphData.ipp"
          :xData="{ name: 'Daya Terpasang', satuan: 'MW' }" :yData="{ name: 'Opex B+D', satuan: 'Rp (Juta)' }"
          :data-zoom="graphData.dataZoom" />
        <div v-if="graphData.isEmpty">
          <div class="flex items-center justify-center mt-28">
            <Empty />
          </div>
          <div class="py-6 text-center">
            <h1 class="font-bold">Grafik Tidak Tersedia</h1>
            <p class="mb-14">Data tidak tersedia, sistem tidak bisa menampilkan {{ props.title }}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
.custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}
</style>