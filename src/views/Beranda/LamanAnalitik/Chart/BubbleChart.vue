<script setup lang="ts">
import VChart, { THEME_KEY } from "vue-echarts";
import { provide, onMounted, ref } from "vue";
import { use } from "echarts/core";
import { ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  MarkLineComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ModalFilter from "@/components/ModalFilter.vue";
import { content } from "../data-dummy";
import { id } from "date-fns/locale";
import FilteredChips from "@/components/FilteredChips.vue";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ScatterChart,
  CanvasRenderer,
  MarkLineComponent,
  VisualMapComponent,
]);

const props = defineProps<{
  title: string;
  listLabel: string[];
  labelX: string;
  labelY: string;
  listColor: string[];
  listData: number[][][];
}>();
const chips = ref<InstanceType<typeof FilteredChips> | null>(null);
const filter = ref<any>({
  kategoriPembangkit: null,
  periode: [],
});
const valueFilter = ref<any>({
  kategoriPembangkit: null,
  periode: [],
});

provide(THEME_KEY, "light");

const markLineOpt = {
  animation: false,
  label: {
    formatter: "",
    align: "right",
  },
  lineStyle: {
    type: "solid",
  },
  tooltip: {
    formatter: "y = 0.5 * x + 3",
  },
  data: [
    [
      {
        coord: [2000, 0, 3000],
        symbol: "none",
      },
      {
        coord: [2000, 95, 3000],
        symbol: "none",
      },
    ],
  ],
};

const option: any = {
  title: {
    text: "",
    left: "center",
  },
  // legend: {
  //   data: props.listLabel,
  //   bottom: 2
  // },
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "cross",
    },
  },
  xAxis: {
    type: "value",
    name: props.labelX,
    nameLocation: "center",
    nameGap: 30,
    nameTextStyle: {
      align: "center",
    },
    splitNumber: 10,
  },
  yAxis: {
    type: "value",
    name: props.labelY,
    nameLocation: "center",
    nameGap: 30,
    nameTextStyle: {
      align: "center",
    },
    splitNumber: 10,
  },
  visualMap: {
    show: false,
    dimension: 2,
    min: 2000,
    max: 1500000000,
    seriesIndex: [0, 1],
    inRange: {
      symbolSize: [10, 70],
    },
  },
  series: [],
};

async function handleFilter() {
  if (filter.value.kategoriPembangkit)
    valueFilter.value.kategoriPembangkit = content.optionsVendor.find(
      (data) => data.id === filter.value.kategoriPembangkit
    )?.name;
  if (filter.value.periode)
    valueFilter.value.periode = filter.value.periode.join(" - ");
  await chips.value?.setValue();
}

async function removeFilter(prop: any) {
  filter.value[prop.key] = null;
  valueFilter.value[prop.key] = null;
  await chips.value?.setValue();
}

onMounted(() => {
  props.listLabel.map((label: string, index: number) => {
    option.series.push({
      name: label,
      type: "scatter",
      datasetIndex: index + 1,
      data: props.listData[index],
      color: props.listColor[index],
      markLine: markLineOpt,
    });
  });
  option.series.push({
    type: "line",
    data: [
      [15510, 0],
      [15510, 500],
    ],
    color: "#FF5656",
  });
});
</script>

<template>
  <div class="flex flex-col h-full px-6 pt-4 pb-4 mt-4 bg-white rounded-lg">
    <div class="flex text-center">
      <h2 class="text-lg font-semibold text-black mt-2.5 pl-2">
        {{ props.title }}
      </h2>
      <ModalFilter @submit="handleFilter">
        <template v-slot:content>
          <label class="block mb-2 text-left font-medium text-[#4D5E80] dark:text-white">Kategori Pembangkit</label>
          <select v-model="filter.kategoriPembangkit" class="select text-[#4D5E80] bg-white select-bordered w-full">
            <option disabled selected :value="null">
              Pilih Kategori Pembangkit
            </option>
            <option v-for="item in content.optionsVendor" :value="item.id">
              {{ item.name }}
            </option>
          </select>
          <label class="block mt-4 mb-2 text-left font-medium text-[#4D5E80] dark:text-white">Periode</label>
          <VueDatePicker range v-model="filter.periode" placeholder="Pilih Periode" :format-locale="id"
            :max-date="new Date()" :enable-time-picker="false" :hideInputIcon="false" :clearable="false"
            :showNowButton="true" :year-picker="true" :month-change-on-scroll="false"></VueDatePicker>
        </template>
      </ModalFilter>
      <button
        class="btn ml-auto mt-[-7px] text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm p-3 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
        Detail
      </button>
    </div>
    <FilteredChips ref="chips" :items="valueFilter" @remove="removeFilter" />
    <v-chart class="chart" :option="option" autoresize />

    <div class="grid grid-cols-4 gap-1 ml-12">
      <div v-for="(item, index) in props.listLabel" class="grid grid-cols-2">
        <div>
          <span class="border-0 rounded-lg badge badge-xs" :style="`background-color: ${props.listColor[index]}`"></span>
          <span class="ml-1" style="font-size: 14px">{{ item }}</span>
        </div>
        <div class="text-center">
          <strong>{{ props.listData[index].length }}</strong> unit
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-1 mt-4 ml-12">
      <div class="text-center">
        <span class="w-6 border-0 rounded-lg badge badge-xs" style="background-color: #ff5656"></span>
        <span class="ml-1" style="font-size: 14px">Median</span>
      </div>
      <div class="text-center">
        <span class="w-6 border-0 rounded-lg badge badge-xs" style="background-color: #0ea976"></span>
        <span class="ml-1" style="font-size: 14px">IPP</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart {
  height: 434px;
}
</style>
