<template>
  <div class="flex flex-col w-full border px-5 py-4 rounded-lg shadow-sm border-l-8 border-l-[#0099AD]">
    <div class="flex items-center justify-between pb-4 border-b border-b-gray-250">
      <p class="text-base font-bold">Asumsi</p>
      <div class="flex items-center space-x-3">
        <p class="font-bold text-gray-500">Periode</p>
        <span class="font-semibold text-primaryColor">{{
          props.tahunBerjalan
          }}</span>
      </div>
    </div>
    <div class="grid grid-cols-4 mt-4 text-sm gap-y-5">
      <div>
        <p class="text-gray-500">Discount Rate</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.discountRate) }} <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Total Project Cost</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.totalProjectCost) }}
          <span class="text-gray-400">Rp (Juta)</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Umur Teknis</p>
        <p class="font-semibold">
          {{ props.umurTeknis }} <span class="text-gray-400">Tahun</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Interest Rate</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.interestRate) }} <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Loan Portion</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.loanPortion) }} <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Equity Portion</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.equityPortion) }} <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Loan</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.loan) }} <span class="text-gray-400">Rp (Juta)</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Loan Tenor</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.loanTenor) }} <span class="text-gray-400">Tahun</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Principal + Interest Payment</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.principalInterestPayment) }}
          <span class="text-gray-400">Rp (Juta)</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Corporate Tax Rate</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.corporateTaxRate) }} <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">WACC on Project</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.waccOnProject) }} <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">WACC on Equity</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.waccOnEquity) }} <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Equity</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.equity) }} <span class="text-gray-400">Rp (Juta)</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Daya Mampu Netto</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.dayaMampuNetto) }} <span class="text-gray-400">MW</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Auxiliary</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.auxiliary) }} <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Susut Trafo</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.susutTrafo) }} <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price A</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.electricityPriceA) }} <span class="text-gray-400">Rp/kW.bln</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price B</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.electricityPriceB) }} <span class="text-gray-400">Rp/kW.bln</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price C</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.electricityPriceC) }}
          <span class="text-gray-400">Rp/kWh</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price D</p>
        <p class="font-semibold">
          {{ globalFormat.formatRupiah(props.electricityPriceD) }}
          <span class="text-gray-400">Rp/kWh</span>
        </p>
      </div>
    </div>
    <div class="pb-4 mt-8 border-b">
      <p class="font-semibold">Bahan Bakar</p>
    </div>
    <div class="grid grid-cols-4 mt-3 text-sm gap-y-5">
      <div>
        <p class="text-gray-500">Bahan Bakar Utama</p>
        <p class="font-bold">HSD</p>
      </div>
      <div>
        <p class="text-gray-500">Harga Bahan Bakar Utama</p>
        <p class="font-bold">22 <span class="text-gray-400">Rp/ton</span></p>
      </div>
      <div class="col-span-2">
        <p class="text-gray-500">Specific Fuel Consumption (SFC)</p>
        <p class="font-bold">22 <span class="text-gray-400">kg/kWH</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();

interface Props {
  tahunBerjalan: string | number;
  discountRate: string | number;
  totalProjectCost: string | number;
  umurTeknis: string | number;
  interestRate: string | number;
  loanPortion: string | number;
  equityPortion: string | number;
  loan: string | number;
  loanTenor: string | number;
  principalInterestPayment: string | number;
  corporateTaxRate: string | number;
  waccOnProject: string | number;
  waccOnEquity: string | number;
  equity: string | number;
  dayaMampuNetto: string | number;
  auxiliary: string | number;
  susutTrafo: string | number;
  electricityPriceA: string | number;
  electricityPriceB: string | number;
  electricityPriceC: string | number;
  electricityPriceD: string | number;
}

const props = defineProps<Props>();
</script>

<style scoped></style>
