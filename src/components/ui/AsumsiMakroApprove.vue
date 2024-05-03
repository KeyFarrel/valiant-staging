<template>
  <div class="overflow-hidden flex flex-col w-full border px-5 py-4 rounded-lg shadow-sm border-l-8 border-l-[#0099AD]">
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
    <div class="flex flex-row justify-between border-b border-b-gray-250">
      <div>
        <p class="mb-2 text-base font-bold">Asumsi Makro</p>
        <div class="mt-0.5 mb-4">
          <div class="flex items-center text-xs">
            <p class="font-bold">Periode</p>
            <p class="ml-2 font-bold text-[#0099AD]">{{ props.tahun !== '-' ? props.tahun : '-' }}</p>
            <p class="ml-2">/</p>
            <p class="ml-2 font-bold">Data</p>
            <p class="ml-2 font-bold text-[#0099AD]">{{ props.data }}</p>
          </div>
        </div>
      </div>
      <div class="flex items-center text-xs">
        <p class="mr-2">Status Laporan</p>
        <div
          class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
          v-if="props.status === 'Ditolak T1'">Ditolak oleh Pembina</div>
        <div
          class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
          v-else-if="props.status === 'Ditolak T2'">Ditolak oleh Pengelola</div>
        <div
          class="w-fit p-1 flex items-center justify-center bg-[#EDF7F2] border border-[#C7E5D7] rounded-md text-[#397E5D]"
          v-else-if="props.status === 'Disetujui'">Disetujui</div>
        <div
          class="w-fit p-1 flex items-center justify-center font-bold bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
          v-else-if="props.status === 'Menunggu Persetujuan T1'">Menunggu Persetujuan Pembina</div>
        <div
          class="w-fit p-1 flex items-center justify-center font-bold bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
          v-else-if="props.status === 'Menunggu Persetujuan T2'">Menunggu Persetujuan Pengelola</div>
        <div
          class="w-fit p-1 flex items-center justify-center bg-[#B7CAF5] border border-[#B7CAF5] rounded-md text-[#1D55D7]"
          v-else-if="props.status === 'Draft'">Draft</div>
      </div>
    </div>
    <div class="grid grid-cols-3 mt-4 gap-y-5">
      <div>
        <p class="text-gray-500">Corporate Tax Rate</p>
        <p class="font-bold">{{ props.corporateTaxRate !== '-' ? globalFormat.formatEnergy(props.corporateTaxRate) :
          '-'
          }}
          <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Discount Rate WACC PLN / SHAP</p>
        <p class="font-bold">{{ props.discountRate !== '-' ? globalFormat.formatEnergy(props.discountRate) : '-' }}
          <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Interest Rate</p>
        <p class="font-bold">{{ props.discountRate !== '-' ? globalFormat.formatEnergy(props.interestRate) : '-' }}
          <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Loan Tenor</p>
        <p class="font-bold">{{ props.loanTenor !== '-' ? props.loanTenor : '-' }} <span
            class="text-gray-400">Tahun</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Loan Portion</p>
        <p class="font-bold">{{ props.loanPortion !== '-' ? globalFormat.formatEnergy(props.loanPortion) : '-' }} <span
            class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Equity Portion</p>
        <p class="font-bold">{{ props.equityPortion !== '-' ? globalFormat.formatEnergy(props.equityPortion) : '-' }}
          <span class="text-gray-400">%</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();

interface Props {
  data: string,
  status: string,
  tahun: number | string,
  corporateTaxRate: string | number,
  discountRate: string | number,
  interestRate: string | number,
  loanTenor: string | number,
  loanPortion: string | number,
  equityPortion: string | number,
}

const props = defineProps<Props>()
</script>

<style scoped>
.date-picker {
  width: 10rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
}
</style>