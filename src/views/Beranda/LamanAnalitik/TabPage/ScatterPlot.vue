<template>
  <div class="flex flex-col h-full px-6 py-4 mt-4 bg-white rounded-lg">
    <div class="flex text-center">
      <h2 class="text-lg font-semibold text-black mt-2.5 pl-2">
        {{ props.scatterName }}
      </h2>
      <ModalFilter @submit="null">
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
          <VueDatePicker v-model="filter.periode" placeholder="Pilih Periode" :format-locale="id" :max-date="new Date()"
            :enable-time-picker="false" :hideInputIcon="false" :clearable="false" :showNowButton="true"
            :year-picker="true" :month-change-on-scroll="false"></VueDatePicker>
        </template>
      </ModalFilter>
    </div>
    <vue-echarts v-if="props.source !== 1" class="w-full h-[500px]" :option="chartOption" />
    <ShimmerLoading v-else-if="!props.source" class="w-full h-[500px] mt-3 mb-3" />
    <div v-else class="w-full h-[500px] flex justify-center items-center text-textDisabledColor font-semibold">
      <p>Grafik Gagal Dimuat</p>
    </div>
    <div class="flex flex-row items-center justify-center space-x-3">
      <div class="flex flex-row items-center space-x-1.5">
        <div class="h-3 w-3 rounded-full bg-[#AAD9F4]"></div>
        <p class="text-sm text-slate-500">PLTU</p>
      </div>
      <div class="flex flex-row items-center space-x-1.5">
        <div class="h-2 w-7 rounded-full bg-[#0EA976]"></div>
        <p class="text-sm text-slate-500">IPP</p>
      </div>
      <div class="flex flex-row items-center space-x-1.5">
        <div class="h-2 w-7 rounded-full bg-[#FF5656]"></div>
        <p class="text-sm text-slate-500">PLN</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { VueEcharts } from "vue3-echarts";
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import * as echarts from "echarts";
import ecStat from "echarts-stat";
import ModalFilter from "@/components/ModalFilter.vue";
import { content } from "../data-dummy";
import { id } from "date-fns/locale";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";

const updateData = ref(true);
const filter = ref<any>({
  kategoriPembangkit: null,
  periode: [],
});

interface Props {
  scatterName: string;
  source: [] | number;
  labelX: string;
  labelY: string;
  labelYGap: number;
  maxX: any;
  minX: any;
  maxY: any;
  minY: any;
  xLineStart: any;
  xLineEnd: any;
  xPLN: any;
  xIPP: any;
  yPLN: any;
  yIPP: any;
  dataNameX: any;
  dataNameY: any;
  satuanY: any;
  satuanX: any;
  mesin: any;
}

let forceRender = async () => {
  updateData.value = false;
  await nextTick();
  updateData.value = true;
};
const props = defineProps<Props>();

echarts.registerTransform(ecStat.transform.regression);
const chartOption = {
  dataset: [
    {
      source: props.source,
    },
    {
      transform: {
        type: "ecStat:regression",
        config: { method: "polynomial", order: 2 },
      },
    },
  ],
  title: {
    show: false,
  },
  tooltip: {
    formatter: function (params: any) {
      return ((params.value[2]) + '<br/> <br/>' + props.dataNameX + ' : ' + (params.value[0]) + ' ' + props.satuanX + '<br/>' +
        props.dataNameY + ' : ' + globalFormat.formatEnergy(params.value[1]) + ' ' + props.satuanY)
    },
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  xAxis: {
    type: "value",
    name: props.labelX,
    nameLocation: "center",
    nameTextStyle: {
      align: "center",
      fontSize: 15,
      color: "#4D5E80",
      fontWeight: "bold",
    },
    nameGap: 40,
    splitLine: {
      lineStyle: {
        type: "dashed",
      },
    },
    max: props.maxX,
    min: props.minX,
  },
  yAxis: {
    type: "value",
    name: props.labelY,
    nameLocation: "center",
    nameGap: props.labelYGap,
    nameTextStyle: {
      align: "center",
      fontSize: 15,
      color: "#4D5E80",
      fontWeight: "bold",
    },
    splitLine: {
      lineStyle: {
        type: "dashed",
      },
    },
    max: props.maxY.toFixed(0),
    min: props.minY.toFixed(0),
  },
  series: [
    {
      name: props.scatterName,
      type: "scatter",
      tooltip: {
        valueFormatter: (value: any) => globalFormat.formatRupiah(value) + " Rp(Juta)",
      },
      color: ["#AAD9F4"],
    },
    {
      name: "line",
      type: "line",
      smooth: true,
      datasetIndex: 1,
      symbolSize: 0.1,
      symbol: "circle",
      tooltip: { show: false },
      label: { show: false, fontSize: 16 },
      labelLayout: { show: false, dx: -20 },
      encode: { label: 2, tooltip: 1 },
      color: ["#AAD9F4"],
    },
    // Horizontal PLN AVG
    {
      type: "line",
      name: "PLN",
      smooth: false,
      symbol: "none",
      data: [
        [props.xLineStart, props.yPLN],
        [props.xLineEnd, props.yPLN],
      ],
      color: "#FF5656",
    },
    // Vertical PLN AVG
    {
      type: "line",
      name: "PLN",
      smooth: false,
      symbol: "none",
      data: [
        [props.xPLN, 0],
        [props.xPLN, props.maxY],
      ],
      color: "#FF5656",
    },
    // Horizontal IPP AVG
    {
      type: "line",
      name: "IPP",
      smooth: false,
      symbol: "none",
      data: [
        [props.xLineStart, props.yIPP],
        [props.xLineEnd, props.yIPP],
      ],
      color: "#0EA976",
    },
    // Vertical IPP AVG
    {
      type: "line",
      name: "IPP",
      smooth: false,
      symbol: "none",
      data: [
        [props.xIPP, 0],
        [props.xIPP, props.maxY],
      ],
      color: "#0EA976",
    },
  ],
};
// forceRender();
</script>

<style scoped></style>

