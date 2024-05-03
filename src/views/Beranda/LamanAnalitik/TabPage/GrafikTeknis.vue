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
            <option v-for="(item, i) in content.optionsVendor" :value="item.id" :key="i">
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
    <vue-echarts class="w-full h-[500px]" :option="chartOption" />
    <!-- <ShimmerLoading v-else-if="!props.source" class="w-full h-[500px] mt-3 mb-3" />
    <div v-else class="w-full h-[500px] flex justify-center items-center text-textDisabledColor font-semibold">
      <p>Grafik Gagal Dimuat</p>
    </div> -->
    <div class="flex flex-row items-center justify-center space-x-3">
      <div class="flex flex-row items-center space-x-1.5">
        <div class="h-3 w-3 rounded-full bg-[#AAD9F4]"></div>
        <p class="text-sm text-slate-500">PLTU</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VueEcharts } from "vue3-echarts";
import ModalFilter from "@/components/ModalFilter.vue";
import { content } from "../data-dummy";
import { id } from "date-fns/locale";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
import GlobalFormat from "@/services/format/global-format";

const globalFormat = new GlobalFormat();
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
  dataNameX: any;
  dataNameY: any;
  satuanY: any;
}

const name = ref<string[]>([]);
const props = defineProps<Props>();

const chartOption = {
  title: {
    show: false,
  },
  tooltip: {
    formatter: function (params: any) {
      return ('Tahun : ' + (params.value[0]) + '<br/>' +
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
    axisLabel: {
      formatter: function (value: any) {
        return value.toFixed(0);
      },
      rotate: 75,
    },
    splitNumber: props.maxX - props.minX,
    min: props.minX,
    max: props.maxX,
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
    splitLine: { show: false },
    axisLabel: {
      formatter: function (value: any) {
        return globalFormat.formatEnergy(formatFixed(value));
      },
    },
    min: props.minY,
    max: props.maxY,
  },
  series: [
    {
      data: props.source,
      type: "scatter",
      // symbolSize: 15,
      color: ["#AAD9F4"],
    },
  ],
};
function formatFixed(x: any) {
  return Number.parseFloat(x).toFixed(0);
}
</script>

<style scoped></style>
