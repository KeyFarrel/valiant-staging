<script setup lang="ts">
import VChart, { THEME_KEY } from "vue-echarts";
import { provide, onMounted, ref } from "vue";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  MarkLineComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { content } from "@/views/Beranda/LamanAnalitik/data-dummy";
import { id } from "date-fns/locale";
import ModalFilter from "@/components/ModalFilter.vue";
import FilteredChips from "@/components/FilteredChips.vue";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  MarkLineComponent,
  VisualMapComponent,
]);

const props = defineProps<{
  title: string;
  labelX: string;
  labelY: string;
  listLabel: string[];
  listColor: string[];
  listData: number[][];
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

const option: any = {
  title: {
    text: "",
    left: "center",
  },
  legend: {
    data: props.listLabel,
    bottom: 2,
  },
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "cross",
    },
  },
  xAxis: {
    type: "category",
    data: [
      "2000",
      "2001",
      "2002",
      "2003",
      "2004",
      "2005",
      "2006",
      "2007",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012",
      "2013",
      "2014",
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
    ],
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
  props.listLabel.map((label: any, index: number) => {
    option.series.push({
      name: label,
      type: "line",
      symbol: "none",
      data: props.listData[index],
      color: props.listColor[index],
      smooth: true,
    });
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
    </div>
    <FilteredChips ref="chips" :items="valueFilter" @remove="removeFilter" />

    <div class="mt-6">
      <div class="border border-opacity-25 rounded-lg border-[#7F7F80] p-3">
        <div class="flex m-4">
          <h4 class="font-extrabold">GAP</h4>
          <button class="text-[#0099AD] font-semibold ml-auto">
            Lihat Detail
          </button>
        </div>
        <div class="flex items-center m-4">
          <span class="w-2 h-2 bg-red-500 rounded-full"></span>
          <span class="text-[#0099AD] ml-2 align-middle leading-none text-xl font-semibold">12</span>
          <span class="text-[#7F7F80] ml-2 align-middle leading-none text-xl">%</span>
        </div>
        <div class="flex items-center m-4">
          <span class="text-[#7F7F80] font-semibold">Realisasi terhadap IPP</span>
          <span class="ml-3 text-[#7F7F80]">(2000 - 2020)</span>
        </div>
      </div>
    </div>
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<style scoped>
.chart {
  height: 434px;
}
</style>
