<script setup lang="ts">
import VChart, { THEME_KEY } from 'vue-echarts';
import { provide, computed } from 'vue';
import { use } from "echarts/core"
import * as echarts from 'echarts';
import ecStat from "echarts-stat";
import { ScatterChart, LineChart, LineSeriesOption, ScatterSeriesOption } from "echarts/charts"
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
  LineChart,
  CanvasRenderer,
  MarkLineComponent,
  VisualMapComponent
])

const globalFormat = new GlobalFormat();
const emits = defineEmits(['update:series'])
const props = defineProps<{
  series: LineSeriesOption[] | ScatterSeriesOption[]
  source: number[][]
  xData: { name: string; satuan: string }
  yData: { name: string; satuan: string }
  pln: { x: number; y: number }
  ipp: { x: number; y: number }
  legends: { label: string; color: string }[]
  dataZoom: { start: number, type: string, orient: string }
}>()

provide(THEME_KEY, 'light');

echarts.registerTransform(ecStat.transform.regression);
const option = computed({
  get() {
    const chartOption: ComposeOption<LineSeriesOption | ScatterSeriesOption | GridComponentOption | TooltipComponentOption | VisualMapComponentOption> = {
      grid: {
        top: "2%",
        left: "5%",
        right: "2%",
        bottom: "8%",
        containLabel: true,
      },
      tooltip: {
        formatter: function (params: any) {
          return (params.value[3] + '<br/> <br/>' + props.xData.name + ' : ' + params.value[0] + ' ' + props.xData.satuan + '<br/>' +
            props.yData.name + ' : ' + globalFormat.formatEnergy(params.value[1]) + ' ' + props.yData.satuan)
        }
      },
      xAxis: {
        type: "value",
        name: `${props.xData.name} (${props.xData.satuan})`,
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: {
          align: "center",
          fontSize: 15,
          color: "#4D5E80",
          fontWeight: "bold",
          padding: [2, 0, 0, -80],
        },
        splitNumber: 10,
        min: Math.min.apply(Math, props.source.map(item => item[0])) - Math.round((Math.max.apply(Math, props.source.map(item => item[0])) - Math.min.apply(Math, props.source.map(item => item[0]))) / 10),
        max: Math.max.apply(Math, props.source.map(item => item[0])) + Math.round((Math.max.apply(Math, props.source.map(item => item[0])) - Math.min.apply(Math, props.source.map(item => item[0]))) / 10),
      },
      yAxis: {
        type: "value",
        name: `${props.yData.name} ${props.yData.satuan}`,
        nameLocation: "middle",
        nameGap: 62,
        nameTextStyle: {
          align: "center",
          fontSize: 15,
          // padding: [10, 20, -10, 25],
          color: "#4D5E80",
          fontWeight: "bold",
        },
        splitNumber: 10,
        min: Math.min.apply(Math, props.source.map(item => item[1])) - Math.round((Math.max.apply(Math, props.source.map(item => item[1])) - Math.min.apply(Math, props.source.map(item => item[1]))) / 10),
        max: Math.max.apply(Math, props.source.map(item => item[1])) + Math.round((Math.max.apply(Math, props.source.map(item => item[1])) - Math.min.apply(Math, props.source.map(item => item[1]))) / 10)
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
      dataZoom: props.dataZoom,
      series: [
        ...props.series,
        // {
        //   name: 'line',
        //   type: 'line',
        //   smooth: true,
        //   datasetIndex: 1,
        //   color: '#AAD9F4',
        //   symbolSize: 0.1,
        //   symbol: 'none',
        //   label: {show: true, fontSize: 16},
        //   labelLayout: {dx: -20},
        //   encode: {label: 2, tooltip: 1}
        // },
        // Horizontal PLN AVG
        {
          type: "line",
          name: "PLN",
          smooth: false,
          symbol: "none",
          data: [
            [0, props.pln.y],
            [Math.max.apply(Math, props.source.map(item => item[0])) + Math.round((Math.max.apply(Math, props.source.map(item => item[0])) - Math.min.apply(Math, props.source.map(item => item[0]))) / 10), props.pln.y],
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
            [props.pln.x, 0],
            [props.pln.x, Math.max.apply(Math, props.source.map(item => item[1])) + Math.round((Math.max.apply(Math, props.source.map(item => item[1])) - Math.min.apply(Math, props.source.map(item => item[1]))) / 10)],
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
            [0, props.ipp.y],
            [Math.max.apply(Math, props.source.map(item => item[0])) + Math.round((Math.max.apply(Math, props.source.map(item => item[0])) - Math.min.apply(Math, props.source.map(item => item[0]))) / 10), props.ipp.y],
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
            [props.ipp.x, 0],
            [props.ipp.x, Math.max.apply(Math, props.source.map(item => item[1])) + Math.round((Math.max.apply(Math, props.source.map(item => item[1])) - Math.min.apply(Math, props.source.map(item => item[1]))) / 10)],
          ],
          color: "#0EA976",
        },
      ]
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
    <div class="flex flex-row items-center space-x-1.5">
      <div class="h-2 w-7 rounded-full bg-[#0EA976]"></div>
      <p class="text-sm text-slate-500">IPP</p>
    </div>
    <div class="flex flex-row items-center space-x-1.5">
      <div class="h-2 w-7 rounded-full bg-[#FF5656]"></div>
      <p class="text-sm text-slate-500">PLN</p>
    </div>
  </div>
</template>

<style scoped>
.chart {
  height: 462px;
}
</style>