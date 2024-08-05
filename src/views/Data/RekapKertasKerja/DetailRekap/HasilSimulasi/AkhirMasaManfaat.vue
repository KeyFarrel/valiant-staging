<template>
  <div class="grid grid-cols-2 mt-5 gap-x-10 gap-y-5" v-bind="$attrs">
    <div class="overflow-hidden flex flex-col px-5 py-4 border-l-8 border-l-[#0099AD] rounded-lg border">
      <div class="absolute bottom-0 right-0">
        <svg width="126" height="61" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
        </svg>
      </div>
      <div class="absolute bottom-0 right-0">
        <svg width="66" height="121" viewBox="0 0 66 121" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
        </svg>
      </div>
      <p class="pb-3 text-base font-semibold border-b">
        Internal Rate of Return (IRR)
      </p>
      <div class="grid grid-cols-2 mt-5">
        <div>
          <p class="text-gray-500">IRR on Project</p>
          <p class="font-bold">{{ props.irrOnProject === '' ? 'NUM' : globalFormat.formatRupiah(props.irrOnProject) }}
            <span class="text-gray-400">%</span>
          </p>
        </div>
        <div>
          <p class="text-gray-500">IRR on Equity</p>
          <p class="font-bold">{{ props.irrOnEquity === '' ? 'NUM' : globalFormat.formatRupiah(props.irrOnEquity) }}
            <span class="text-gray-400">%</span>
          </p>
        </div>
      </div>
    </div>
    <div class="overflow-hidden flex flex-col px-5 py-4 border-l-8 border-l-[#0099AD] rounded-lg border">
      <div class="absolute bottom-0 right-0">
        <svg width="126" height="61" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
        </svg>
      </div>
      <div class="absolute bottom-0 right-0">
        <svg width="66" height="121" viewBox="0 0 66 121" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
        </svg>
      </div>
      <p class="pb-3 text-base font-semibold border-b">
        Net Present Value (NPV)
      </p>
      <div class="grid grid-cols-2 mt-5">
        <div>
          <p class="text-gray-500">NPV on Project</p>
          <p class="font-semibold">
            {{ globalFormat.formatRupiah(props.npvOnProject) }} <span class="text-textDisabledColor">Rp (Juta)</span>
          </p>
        </div>
        <div>
          <p class="text-gray-500">NPV on Equity</p>
          <p class="font-semibold">
            {{ globalFormat.formatRupiah(props.npvOnEquity) }} <span class="text-textDisabledColor">Rp (Juta)</span>
          </p>
        </div>
      </div>
    </div>
    <div class="overflow-hidden flex flex-col px-5 py-4 border-l-8 border-l-[#0099AD] rounded-lg border space-y-3">
      <div class="absolute bottom-0 right-0">
        <svg width="126" height="61" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
        </svg>
      </div>
      <div class="absolute bottom-0 right-0">
        <svg width="66" height="121" viewBox="0 0 66 121" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
        </svg>
      </div>
      <p class="pb-3 text-base font-semibold border-b">
        Average Net Capacity Factor (NCF)
      </p>
      <p class="font-semibold">{{ globalFormat.formatRupiah(props.averageNcf) }} <span
          class="text-textDisabledColor">%</span></p>
    </div>
    <div class="overflow-hidden flex flex-col px-5 py-4 border-l-8 border-l-[#0099AD] rounded-lg border space-y-3">
      <div class="absolute bottom-0 right-0">
        <svg width="126" height="61" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
        </svg>
      </div>
      <div class="absolute bottom-0 right-0">
        <svg width="66" height="121" viewBox="0 0 66 121" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
        </svg>
      </div>
      <p class="pb-3 text-base font-semibold border-b">
        Average Equivalent Availability Factor (EAF)
      </p>
      <p class="font-semibold">{{ globalFormat.formatRupiah(props.averageEaf) }} <span
          class="text-textDisabledColor">%</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();

const props = defineProps<Props>()

interface Props {
  irrOnProject: number | string
  irrOnEquity: number | string
  npvOnEquity: number
  npvOnProject: number
  averageNcf: number
  averageEaf: number
}

onMounted(() => {
  console.log('props', props.irrOnProject);
})
</script>

<style scoped></style>
