<script setup lang="ts">
import VChart, { THEME_KEY } from 'vue-echarts';
import { provide, computed } from 'vue';
import { use } from "echarts/core"
import { ScatterChart, ScatterSeriesOption } from "echarts/charts"
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  MarkLineComponent,
  TooltipComponentOption,
  VisualMapComponentOption,
  GridComponentOption
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import type { ComposeOption } from "echarts/core"
import GlobalFormat from "@/services/format/global-format";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ScatterChart,
  CanvasRenderer,
  MarkLineComponent,
  VisualMapComponent
])

const globalFormat = new GlobalFormat();
const emits = defineEmits(['update:series'])
const props = defineProps<{
  dataZoom?: {
    start: number, type: string, orient: string
  }
  series: ScatterSeriesOption[]
  xData: { name: string; satuan: string }
  yData: { name: string; satuan: string }
  legends: { label: string; color: string }[]
  years: number[]
  yValues: number[]
}>()

provide(THEME_KEY, 'light');

const option = computed({
  get() {
    const chartOption: ComposeOption<ScatterSeriesOption | GridComponentOption | TooltipComponentOption | VisualMapComponentOption> = {
      grid: {
        top: "2%",
        left: "5%",
        right: "2%",
        bottom: "5%",
        containLabel: true,
      },
      tooltip: {
        formatter: function (params: any) {
          return (params.value[3] + '<br/> <br/>' + 'Tahun : ' + params.value[0] + '<br/>' +
            props.yData.name + ' : ' + globalFormat.formatRupiah(params.value[1]) + ' ' + props.yData.satuan)
        },
      },
      xAxis: {
        type: "value",
        name: props.xData.name,
        nameLocation: "middle",
        nameGap: 36,
        // boundaryGap: false,
        nameTextStyle: {
          align: "center",
          fontSize: 15,
          color: "#4D5E80",
          padding: [20, 0, 0, -80],
          fontWeight: "bold",
        },
        axisLabel: {
          formatter: function (value: any) {
            return value.toFixed(0);
          },
          // rotate: 60,
          fontSize: 10,
          showMinLabel: false,
          showMaxLabel: false
        },
        splitNumber: Math.max(...props.years) - Math.min(...props.years),
        min: Math.min(...props.years) - 0.05,
        max: Math.max(...props.years) + 0.05,
      },
      yAxis: {
        type: "value",
        name: `${props.yData.name} ${props.yData.satuan}`,
        nameLocation: "middle",
        nameGap: 62,
        nameTextStyle: {
          align: "center",
          fontSize: 15,
          // padding: [10, 20, 0, 25],
          color: "#4D5E80",
          fontWeight: "bold",
        },
        splitNumber: 10,
        splitLine: { show: false },
        axisLabel: {
          formatter: function (value: any) {
            return globalFormat.formatEnergy(Number.parseFloat(value).toFixed(0));
          },
          fontSize: 10,
        },
        // min: Math.min.apply(Math, props.yValues) - Math.round((Math.max.apply(Math, props.yValues) - Math.min.apply(Math, props.yValues)) / 10),
        // max: Math.max.apply(Math, props.yValues) + 1000
        max: Math.max(...props.yValues) + Math.round((Math.max(...props.yValues) - Math.min(...props.yValues)) / 10),
      },
      visualMap: {
        show: false,
        dimension: 2,
        min: 2000,
        max: 1500000000,
        seriesIndex: [0, 1],
        inRange: {
          symbolSize: [10, 70]
        }
      },
      dataZoom: props.dataZoom,
      series: props.series
    }
    return chartOption
  },
  set(val) {
    emits('update:series', val)
  }
})
</script>

<template>
  <v-chart class="chart" :option="option" :w-full="true" :autocapitalize="true" />
  <div class="flex flex-row items-center justify-center space-x-3">
    <div v-for="(item, index) in props.legends" :key="index" class="flex flex-row items-center space-x-1.5">
      <div class="w-3 h-3 rounded-full" :style="`background-color: ${item.color}`"></div>
      <p class="text-sm text-slate-500">{{ item.label }}</p>
    </div>
  </div>
</template>

<style scoped>
.chart {
  height: 462px;
}
</style>