<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from "vue";
import Empty from "@/components/icons/IconEmptyData.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue"
import ModalFilter from "@/components/ModalFilter.vue";
import GrafikService from "@/services/grafik-service";
import type { BaseResponse, ResComponent } from "@/views/Beranda/LamanAnalitik/TypeFinansial";
import type { CheckboxValueType } from 'element-plus';
import { id } from "date-fns/locale";
import DynamicScatterPlotVertiLine from "@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlotVertiLine.vue";
// import FilteredChips from "@/components/FilteredChips.vue";
// import MultiSelect from 'primevue/multiselect';

const grafikService = new GrafikService();
const checkAll = ref(false)
const indeterminate = ref(false)
const value = ref<CheckboxValueType[]>([])

const startYear = new Date().getFullYear() - 5
const endYear = new Date().getFullYear()

const props = defineProps<{
  itemsPembangkit: { id: string; name: string, power?: string }[]
  itemsDaya: { id: string; daya: string; satuan: string }[]
  title: string,
  yearRange: number[]
}>()

// const filterChips = ref<InstanceType<typeof FilteredChips> | null>(null)
const isLoading = ref(false)
const graphData: Ref<{
  legends?: { label: string; color: string }[]
  series: any
  isEmpty?: boolean
  years: number[]
  values: number[]
  dataZoom: { start: number, type: string, orient: string }
}> = ref({
  legends: [],
  series: [],
  isEmpty: true,
  years: [],
  values: [],
  dataZoom: { start: 0, type: 'inside', orient: 'vertical' }
})
const filter: Ref<{
  kategoriPembangkit: string[] | null
  periode: string[] | null
}> = ref({
  kategoriPembangkit: [""],
  periode: [startYear, endYear]
})
// const filter = ref<{ id: string; name: string, power?: string }[]>([])
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
    const param = {
      kode_jenis_pembangkit: "",
      tahun_awal: "",
      tahun_akhir: ""
    }
    param.kode_jenis_pembangkit = value.value ? value.value : ""
    param.tahun_awal = filter.value.periode ? filter.value.periode[0].toString() : ""
    param.tahun_akhir = filter.value.periode ? filter.value.periode[1].toString() : ""

    const response: BaseResponse<ResComponent> = await grafikService.getGraphicTeknisEAF(param)
    if (response.success) {
      const data = response.data
      graphData.value.isEmpty = data.data === null
      graphData.value.series = []
      graphData.value.legends = []
      graphData.value.years = []
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
        }
        data.data?.map(graph => {
          graphData.value.years.push(parseInt(graph.data.tahun))
          graphData.value.values.push(graph.data.value)
          if (graph.kode_jenis_kit === item.label) {
            scatterTemplate.data.push([parseInt(graph.data.tahun), graph.data.value, 5, graph.nama_mesin])
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
  await fetchInitialPembangkit();
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
          <label for="" class="block mt-3 mb-1 font-semibold text-labelColor">Periode</label>
          <VueDatePicker v-model="filter.periode" placeholder="Pilih Periode" :format-locale="id"
            :yearRange="props.yearRange" :enable-time-picker="false" :hideInputIcon="false" :clearable="false"
            :showNowButton="true" :year-picker="true" :month-change-on-scroll="false" range />
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
          {{ filter.periode?.join('-') }}
        </div>
      </div>
    </div>
    <ShimmerLoading v-if="isLoading" class="w-full h-[460px] mt-3 mb-3" />
    <div v-else>
      <DynamicScatterPlotVertiLine v-if="!graphData.isEmpty" :series="graphData.series" :legends="graphData.legends"
        :years="graphData.years" :y-values="graphData.values" :xData="{ name: 'Tahun', satuan: '' }"
        :yData="{ name: 'EAF', satuan: '(%)' }" :data-zoom="graphData.dataZoom" />
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