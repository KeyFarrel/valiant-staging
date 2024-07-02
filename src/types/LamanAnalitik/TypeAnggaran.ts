import type { ComposeOption } from "echarts/core"
import type { ScatterSeriesOption } from "echarts/charts"
import type {
    TitleComponentOption,
    TooltipComponentOption,
    LegendComponentOption
} from "echarts/components"

export type EChartsOption = ComposeOption<
    | TitleComponentOption
    | TooltipComponentOption
    | LegendComponentOption
    | ScatterSeriesOption
>
