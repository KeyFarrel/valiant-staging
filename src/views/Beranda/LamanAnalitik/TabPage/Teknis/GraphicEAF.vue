<script setup lang="ts">
import { onMounted, onUnmounted, type Ref, ref, watch } from "vue"
import Empty from "@/components/icons/IconEmptyData.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue"
import ModalWrapper from "@/components/ui/ModalWrapper.vue"
import GrafikService from "@/services/grafik-service";
import type { BaseResponse, ResComponent } from "@/types/LamanAnalitik/TypeFinansial"
import { id } from "date-fns/locale"
import DynamicScatterPlotVertiLine from "@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlotVertiLine.vue";
import { notifyError } from "@/services/helper/toast-notification"

const grafikService = new GrafikService()
const checkAll = ref(false);
const checkDmn = ref(true)
const indeterminate = ref(false);
const indeterminateDmn = ref(false);
const value = ref<any[]>([])
const dmn = ref<any[]>([1, 2, 3]);
const showModal = ref<boolean>(false)
const isPembangkitDropdownOpen = ref(false);
const isDmnDropdownOpen = ref(false);

const startYear = new Date().getFullYear() - 5;
const endYear = new Date().getFullYear();

const props = defineProps<{
  itemsPembangkit: {
    id: string;
    name: string,
    power?: string
  }[]
  itemsDayaMampu: {
    id: string;
    name: string
  }[]
  itemsDaya: {
    id: string;
    daya: string;
    satuan: string
  }[]
  title: string,
  yearRange: number[]
  initialPembangkit: string[]
}>()

const isLoading = ref(false);
const graphData: Ref<{
  legends?: { label: string; color: string }[]
  series: any;
  isEmpty?: boolean
  years: number[];
  values: number[]
  dataZoom: { start: number, type: string, orient: string };
}> = ref({
  legends: [],
  series: [],
  isEmpty: true,
  years: [],
  values: [],
  dataZoom: { start: 0, type: 'inside', orient: 'vertical' },
});
const filter: Ref<{
  kategoriPembangkit: string[] | null
  periode: number[] | null;
}> = ref({
  kategoriPembangkit: [""],
  periode: [startYear, endYear]
});
const fetchInitialPembangkit = () => {
  value.value = [...(props.initialPembangkit || [])]
};

async function getDataGraph() {
  try {
    isLoading.value = true
    // filterChips.value?.setValue()
    const param: any = {
      kode_jenis_pembangkit: [],
      id_daya: [],
      tahun_awal: "",
      tahun_akhir: ""
    };
    param.kode_jenis_pembangkit = value.value;
    param.id_daya = dmn.value;
    param.tahun_awal = filter.value.periode ? filter.value.periode[0].toString() : "";
    param.tahun_akhir = filter.value.periode ? filter.value.periode[1].toString() : "";

    const response: BaseResponse<ResComponent> = await grafikService.getGraphicTeknisEAF(param)
    if (response.success) {
      const data = response.data;
      graphData.value.isEmpty = data.data === null
      graphData.value.series = []
      graphData.value.legends = [];
      graphData.value.years = []
      graphData.value.values = []
      data.legend?.map((item) => {
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
        }
        data.data?.map(graph => {
          graphData.value.years.push(parseInt(graph.data.tahun));
          graphData.value.values.push(graph.data.value)
          if (graph.kode_jenis_kit === item.label) {
            scatterTemplate.data.push([parseInt(graph.data.tahun), graph.data.value, 5, graph.nama_mesin])
          };
        })
        graphData.value.series.push(scatterTemplate)
      })
      isLoading.value = false;
    }
  } catch (e) {
    isLoading.value = false
    console.log(e);
  }
}

async function getDataGraphNoDMN() {
  try {
    // filterChips.value?.setValue()
    isLoading.value = true
    const param: any = {
      kode_jenis_pembangkit: [],
      id_daya: [],
      tahun_awal: "",
      tahun_akhir: '',
    };
    param.id_daya = [];
    param.tahun_awal = filter.value.periode ? filter.value.periode[0].toString() : "";
    param.tahun_akhir = filter.value.periode ? filter.value.periode[1].toString() : '';
    param.kode_jenis_pembangkit = value.value;

    const response: BaseResponse<ResComponent> = await grafikService.getGraphicTeknisEAF(param)
    if (response.success) {
      const data = response.data
      graphData.value.isEmpty = data.data === null;
      graphData.value.series = []
      graphData.value.legends = []
      graphData.value.years = [];
      graphData.value.values = []
      data.legend?.map((item) => {
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
        };
        data.data?.map(graph => {
          graphData.value.years.push(parseInt(graph.data.tahun))
          graphData.value.values.push(graph.data.value)
          if (graph.kode_jenis_kit === item.label) {
            scatterTemplate.data.push([parseInt(graph.data.tahun), graph.data.value, 5, graph.nama_mesin]);
          }
        })
        graphData.value.series.push(scatterTemplate);
      })
      isLoading.value = false
    };
  } catch (e) {
    isLoading.value = false
    console.log(e)
  };
}

const closeModal = () => {
  if (value.value.length) {
    showModal.value = false;
  } else if (value.value.length === 0 && filter.value.periode === null) {
    notifyError('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)
  } else if (filter.value.periode === null) {
    notifyError('Mohon pilih 1 tahun!', 5000);
  } else {
    notifyError('Mohon pilih minimal 1 kategori pembangkit!', 5000)
  }
}

const applyFilter = async () => {
  if (value.value.length) {
    getDataGraph();
    showModal.value = false
  } else if (value.value.length === 0 && filter.value.periode === null) {
    notifyError('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
  } else if (filter.value.periode === null) {
    notifyError('Mohon pilih 1 tahun!', 5000)
  } else {
    notifyError('Mohon pilih minimal 1 kategori pembangkit!', 5000);
  }
};

const applyFilterNoDMN = async () => {
  if (value.value.length) {
    getDataGraphNoDMN();
    showModal.value = false
  } else if (value.value.length === 0 && filter.value.periode === null) {
    notifyError('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
  } else if (filter.value.periode === null) {
    notifyError('Mohon pilih 1 tahun!', 5000)
  } else {
    notifyError('Mohon pilih minimal 1 kategori pembangkit!', 5000);
  }
};

watch(value, (val) => {
  if (val.length === 0) {
    checkAll.value = false;
    indeterminate.value = false
  } else if (val.length === props.itemsPembangkit.length) {
    checkAll.value = true;
    indeterminate.value = false
  } else {
    indeterminate.value = true;
  }
});

watch(dmn, (val) => {
  if (val.length === 0) {
    checkDmn.value = false;
    indeterminateDmn.value = false
  } else if (val.length === props.itemsDayaMampu.length) {
    checkDmn.value = true;
    indeterminateDmn.value = false
  } else {
    indeterminateDmn.value = true;
  }
});

const handleCheckAll = (val: any) => {
  indeterminate.value = false;
  if (val) {
    value.value = props.itemsPembangkit.map((_) => _.name)
  } else {
    value.value = [];
  }
};

const togglePembangkitDropdown = () => {
  isPembangkitDropdownOpen.value = !isPembangkitDropdownOpen.value;
}

const handleCheckDmn = (val: any) => {
  indeterminateDmn.value = false;
  if (val) {
    dmn.value = props.itemsDayaMampu.map((_) => _.id)
  } else {
    dmn.value = [];
  }
};

const clearPembangkit = () => {
  value.value = [];
}

const toggleDmnDropdown = () => {
  isDmnDropdownOpen.value = !isDmnDropdownOpen.value;
}

const removeSelectedPembangkit = (id: any) => {
  value.value = value.value.filter(item => item !== id);
}

const clearDmn = () => {
  dmn.value = [];
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    isPembangkitDropdownOpen.value = false;
    isDmnDropdownOpen.value = false;
  }
};

const removeSelectedDmn = (id: any) => {
  dmn.value = dmn.value.filter(item => item !== id);
}

onMounted(async () => {
  fetchInitialPembangkit();
  getDataGraph()
  document.addEventListener('click', handleClickOutside)
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
});
</script>

<template>
  <div class="flex flex-col h-full px-6 pt-4 pb-4 mt-4 bg-white rounded-lg">
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
        <div v-if="value.length || filter.periode"
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
            <div class="relative">
              <div @click="togglePembangkitDropdown"
                class="flex items-center justify-between w-full min-h-[38px] p-2 transition-colors bg-white border rounded-md cursor-pointer hover:border-gray-300"
                :class="{ 'border-gray-300': isPembangkitDropdownOpen }">
                <div class="flex flex-wrap items-center flex-1 gap-1">
                  <template v-if="value.length > 0">
                    <span v-for="(id, index) in value.slice(0, 2)" :key="id"
                      class="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 rounded">
                      {{props.itemsPembangkit.find(item => item.id === id)?.name}}
                      <button @click.stop="removeSelectedPembangkit(id)" class="ml-1 hover:text-red-500">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                        </svg>
                      </button>
                    </span>
                    <span v-if="value.length > 2" class="text-xs text-gray-500">
                      +{{ value.length - 2 }}
                    </span>
                  </template>
                  <span v-else class="text-sm text-gray-400">
                    Select Pembangkit
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button v-if="value.length > 0" @click.stop="clearPembangkit"
                    class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <svg class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isPembangkitDropdownOpen }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <transition name="dropdown">
                <div v-if="isPembangkitDropdownOpen"
                  class="absolute z-50 w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg">
                  <div class="p-2 border-b">
                    <label class="flex items-center p-1 rounded cursor-pointer hover:bg-gray-50 text-primaryTextColor">
                      <input type="checkbox" v-model="checkAll" @change="handleCheckAll(checkAll)"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2 text-sm">Select All Items</span>
                    </label>
                  </div>
                  <div class="overflow-auto max-h-60">
                    <label v-for="item in props.itemsPembangkit" :key="item.id"
                      class="flex items-center px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-gray-50 text-primaryTextColor"
                      :class="{ 'bg-gray-100': value.includes(item.id) }">
                      <input type="checkbox" :value="item.id" v-model="value"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2">{{ item.name }}</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div v-show="value.includes('PLTU')" class="flex flex-col space-y-1">
            <span class="font-semibold text-labelColor">DMN</span>
            <div class="relative">
              <div @click="toggleDmnDropdown"
                class="flex items-center justify-between w-full min-h-[38px] p-2 transition-colors bg-white border rounded-md cursor-pointer hover:border-gray-300"
                :class="{ 'border-gray-300': isDmnDropdownOpen }">
                <div class="flex flex-wrap items-center flex-1 gap-1">
                  <template v-if="dmn.length > 0">
                    <span v-for="(id, index) in dmn.slice(0, 2)" :key="id"
                      class="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 rounded">
                      {{props.itemsDayaMampu.find(item => item.id === id)?.name}}
                      <button @click.stop="removeSelectedDmn(id)" class="ml-1 hover:text-red-500">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                        </svg>
                      </button>
                    </span>
                    <span v-if="dmn.length > 2" class="text-xs text-gray-500">
                      +{{ dmn.length - 2 }}
                    </span>
                  </template>
                  <span v-else class="text-sm text-gray-400">
                    Pilih DMN
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button v-if="dmn.length > 0" @click.stop="clearDmn" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isDmnDropdownOpen }"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <transition name="dropdown">
                <div v-if="isDmnDropdownOpen"
                  class="absolute z-50 w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg">
                  <div class="p-2 border-b">
                    <label class="flex items-center p-1 rounded cursor-pointer hover:bg-gray-50 text-primaryTextColor">
                      <input type="checkbox" v-model="checkDmn" @change="handleCheckDmn(checkDmn)"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2 text-sm">Select All Items</span>
                    </label>
                  </div>
                  <div class="overflow-auto max-h-60">
                    <label v-for="(dmnItem, dmnIndex) in props.itemsDayaMampu" :key="dmnIndex"
                      class="flex items-center px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-gray-50 text-primaryTextColor"
                      :class="{ 'bg-gray-100': dmn.includes(dmnItem.id) }">
                      <input type="checkbox" :value="dmnItem.id" v-model="dmn"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2">{{ dmnItem.name }}</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>
            <div class="flex -mb-2">
              <p class="text-[#FF5656] text-lg mr-1 -mt-1">*</p>
              <p class="text-[#333333] text-xs ml-1">DMN hanya akan muncul jika Anda memilih PLTU dari Kategori
                Pembangkit</p>
            </div>
          </div>
          <div class="flex flex-col space-y-0.5">
            <label for="" class="text-sm font-semibold text-labelColor">Tahun</label>
            <VueDatePicker v-model="filter.periode" placeholder="Pilih Periode" :format-locale="id"
              :yearRange="props.yearRange" :enable-time-picker="false" :hideInputIcon="false" :clearable="false"
              :showNowButton="true" :year-picker="true" :month-change-on-scroll="false" :teleport="true" range />
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
            {{ filter.periode?.join('-') }}
          </div>
        </div>
      </div>
      <ShimmerLoading v-if="isLoading" class="w-full h-[460px] mt-3 mb-3" />
      <div v-else>
        <DynamicScatterPlotVertiLine v-if="!graphData.isEmpty" :series="graphData.series"
          :legends="graphData.legends || []" :years="filter.periode || []" :y-values="graphData.values"
          :xData="{ name: 'Tahun', satuan: '' }" :yData="{ name: 'EAF', satuan: '(%)' }"
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
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top;
}

.dropdown-enter-from {
  opacity: 0;
  transform: scaleY(0.95) translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-10px);
}
</style>