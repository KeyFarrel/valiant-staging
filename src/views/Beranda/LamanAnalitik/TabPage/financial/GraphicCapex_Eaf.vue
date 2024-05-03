<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from "vue";
import Empty from "@/components/icons/IconEmptyData.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue"
import ModalFilter from "@/components/ModalFilter.vue";
import PetaService from "@/services/peta-service";
import GrafikService from "@/services/grafik-service";
import type { BaseResponse, ResCapexEaf } from "@/views/Beranda/LamanAnalitik/TypeFinansial";
import type { CheckboxValueType } from 'element-plus';
import { id } from "date-fns/locale";
import DynamicScatterPlot from "@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue";
// import FilteredChips from "@/components/FilteredChips.vue";
// import MultiSelect from 'primevue/multiselect';

const petaService = new PetaService();
const grafikService = new GrafikService();
const periodeTahun = ref<Array<number>>([]);
const checkAll = ref(false)
const indeterminate = ref(false)
const value = ref<CheckboxValueType[]>([])

const props = defineProps<{
  itemsPembangkit: { id: string; name: string }[]
  title: string
  yearRange: number[]
}>()

// const filterChips = ref<InstanceType<typeof FilteredChips> | null>(null)
const isLoading = ref(false)
const graphData: Ref<{
  legends?: { label: string; color: string }[]
  source: any
  series: any
  pln: { x: number; y: number }
  ipp: { x: number; y: number }
  isEmpty?: boolean,
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
  kategoriPembangkit: string[] | null
  tahun: number
}> = ref({
  kategoriPembangkit: [""],
  tahun: new Date().getFullYear()
})

const fetchTahunTerakhirRealisasi = async () => {
  try {
    const response: any = await grafikService.getTahunTerakhirRealisasiAnalitik();
    filter.value.tahun = response.data.tahun;
  } catch (error) {
    console.error('Fetch Tahun Terakhir Realisasi Error : ' + error);
  }
}
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
    // filterChips.value?.setValue()
    const response: BaseResponse<ResCapexEaf[]> = await grafikService.getGraphicAnalitikEAF({
      kode_jenis_pembangkit: value.value ? value.value : "",
      periode: filter.value.tahun.toString()
    })
    if (response.success) {
      const data = response.data[0]
      graphData.value.isEmpty = data.grafik === null
      graphData.value.series = []
      graphData.value.legends = []
      graphData.value.source = []
      graphData.value.pln.x = data.average_pln_eaf
      graphData.value.pln.y = data.average_pln_capex
      graphData.value.ipp.x = data.average_ipp_eaf
      graphData.value.ipp.y = data.average_ipp_capex
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
            scatterTemplate.data.push([graph.data.eaf, graph.data.capex, 5, graph.nama_mesin])
            graphData.value.source?.push([graph.data.eaf, graph.data.capex])
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

const fetchPeriodeTahunSentral = async () => {
  try {
    const response: any = await petaService.getYearListBPA();
    periodeTahun.value = [response.data[0].tahun, response.data[response.data.length - 1].tahun];
  } catch (error) {
    console.error('Fetch Tahun Grafik Sentral Error : ' + error);
  }
}

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


onMounted(async () => {
  isLoading.value = true
  await fetchInitialPembangkit();
  await fetchTahunTerakhirRealisasi();
  fetchPeriodeTahunSentral();
  getDataGraph();
})
</script>

<template>
  <div class="flex flex-col h-full px-6 pt-4 pb-4 mt-4 bg-white rounded-lg">
    <div class="flex">
      <h2 class="text-lg font-semibold text-black mt-2.5 pl-2">{{ props.title }}</h2>
      <ModalFilter @submit="getDataGraph">
        <template v-slot:content>
          <label for="" class="block mb-1 font-semibold text-labelColor">Kategori Pembangkit</label>
          <!-- <MultiSelect v-model="filter.kategoriPembangkit" :options="props.itemsPembangkit" option-label="name"
            option-value="id" placeholder="Pilih Kategori Pembangkit" class="w-full md:w-14rem" :highlightOnSelect="true"
            checkmark display="chip" :pt="{
              label: 'flex gap-2 w-full overflow-x-auto scrollbar-hide',
              tokenLabel: 'px-1',
              header: 'bg-[#9C9C9C] pl-3',
              virtualScroller: 'scrollbar-hide'
            }" /> -->
          <el-select v-model="value" multiple clearable collapse-tags placeholder="Select Pembangkit"
            popper-class="custom-header" :max-collapse-tags="15" class="w-full">
            <template #header>
              <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll">
                Select All Items
              </el-checkbox>
            </template>
            <el-option v-for="item in props.itemsPembangkit" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <label for="" class="block mt-3 mb-1 font-semibold text-labelColor">Tahun</label>
          <VueDatePicker v-model="filter.tahun" placeholder="Pilih Periode" :format-locale="id"
            :yearRange="props.yearRange" :enable-time-picker="false" :hideInputIcon="false" :clearable="false"
            :showNowButton="true" :year-picker="true" :month-change-on-scroll="false" />
        </template>
      </ModalFilter>
    </div>
    <!-- <FilteredChips ref="filterChips" v-model="filter" @remove="getDataGraph" /> -->
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
        :legends="graphData.legends" :pln="graphData.pln" :data-zoom="graphData.dataZoom" :ipp="graphData.ipp"
        :xData="{ name: 'EAF', satuan: '%' }" :yData="{ name: 'Capex', satuan: 'Rp (Juta)' }" />
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

<style lang="scss">
.custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}
</style>
