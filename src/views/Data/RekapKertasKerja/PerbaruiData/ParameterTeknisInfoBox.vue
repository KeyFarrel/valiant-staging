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
    <div class="flex items-center justify-between pb-4 border-b border-b-gray-250">
      <p class="text-base font-bold">Parameter Teknis & Finansial</p>
      <div class="flex items-center space-x-3">
        <p class="font-bold text-gray-500">Periode</p>
        <button class="flex items-center px-4 py-2 border rounded-lg cursor-default">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M4.50016 1.33203C4.86835 1.33203 5.16683 1.63051 5.16683 1.9987V2.83203H10.8335V1.9987C10.8335 1.63051 11.132 1.33203 11.5002 1.33203C11.8684 1.33203 12.1668 1.63051 12.1668 1.9987V2.83203H12.5002C13.6968 2.83203 14.6668 3.80208 14.6668 4.9987V12.4987C14.6668 13.6953 13.6968 14.6654 12.5002 14.6654H3.50016C2.30355 14.6654 1.3335 13.6953 1.3335 12.4987V4.9987C1.3335 3.80208 2.30355 2.83203 3.50016 2.83203H3.8335V1.9987C3.8335 1.63051 4.13197 1.33203 4.50016 1.33203ZM3.50016 4.16536C3.03993 4.16536 2.66683 4.53846 2.66683 4.9987V5.49809C2.92336 5.39111 3.20486 5.33203 3.50016 5.33203H12.5002C12.7955 5.33203 13.077 5.39111 13.3335 5.49809V4.9987C13.3335 4.53846 12.9604 4.16536 12.5002 4.16536H3.50016ZM13.3335 7.4987C13.3335 7.03846 12.9604 6.66536 12.5002 6.66536H3.50016C3.03993 6.66536 2.66683 7.03846 2.66683 7.4987V12.4987C2.66683 12.9589 3.03993 13.332 3.50016 13.332H12.5002C12.9604 13.332 13.3335 12.9589 13.3335 12.4987V7.4987Z"
              fill="#0099AD" />
          </svg>
          <span class="ml-3">{{ props.periode }}</span>
        </button>
      </div>
    </div>
    <div class="grid grid-cols-4 mt-4 text-sm gap-y-5">
      <div>
        <p class="text-gray-500">Daya Terpasang</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.daya_terpasang / 1000) }} <span
            class="text-gray-400">MW</span></p>
      </div>
      <div class="col-span-3">
        <p class="text-gray-500">Daya Mampu Netto</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.daya_mampu_netto_mw) }} <span
            class="text-gray-400">MW</span></p>
      </div>
      <div>
        <p class="text-gray-500">Auxiliary</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.auxiliary) }}
          <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Susut Trafo</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.susut_trafo) }}
          <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Pemakaian Sendiri (PS)</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.ps) }} <span
            class="text-gray-400">%</span></p>
      </div>
      <div>
        <p class="text-gray-500">Net Plant Heat Rate (NPHR)</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.nphr) }} <span
            class="text-gray-400">Kcal/kWh</span></p>
      </div>
      <div>
        <p class="text-gray-500">Total Project Cost</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.total_project_cost) }} <span
            class="text-gray-400">Rp (Juta)</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Loan</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.loan) }} <span class="text-gray-400">Rp
            (Juta)</span></p>
      </div>
      <div class="col-span-2">
        <p class="text-gray-500">Equity</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.equity) }}
          <span class="text-gray-400">Rp (Juta)</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price A</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.electricity_price_a_rp_per_kwbln) }}
          <span class="text-gray-400">Rp/kW.bln</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price B</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.electricity_price_b_rp_per_kwbln) }}
          <span class="text-gray-400">Rp/kW.bln</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price C</p>
        <p class="font-bold">
          {{ globalFormat.formatRupiah(props.parameterTeknis.electricity_price_c_rp_per_kwh) }}
          <span class="text-gray-400">Rp/kWh</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price D</p>
        <p class="font-bold">{{ globalFormat.formatRupiah(props.parameterTeknis.electricity_price_d_rp_per_kwh) }}
          <span class="text-gray-400">Rp/kWh</span>
        </p>
      </div>
    </div>
    <div class="pb-4 mt-5 border-b">
      <p class="font-semibold">Bahan Bakar</p>
    </div>
    <div class="grid grid-cols-4 mt-3 text-sm gap-y-5" v-for="(bahanBakarItem, bahanBakarIndex) in props.bahanBakars"
      :key="bahanBakarIndex">
      <div>
        <p class="text-gray-500">Bahan Bakar {{ bahanBakarItem.flag_bahan_bakar === 0 || bahanBakars.flag_bahan_bakar
          !== 0
          ?
          bahanBakarItem.flag_bahan_bakar === 1
          ? 'Utama' : bahanBakarIndex + 1 : '' }}</p>
        <p class="font-bold">{{ namaBahanBakar(bahanBakarItem.kode_bahan_bakar) }}</p>
      </div>
      <div>
        <p class="text-gray-500">Harga Bahan Bakar {{ bahanBakarItem.flag_bahan_bakar === 0 ||
          bahanBakars.flag_bahan_bakar
          !== 0 ? bahanBakarItem.flag_bahan_bakar === 1 ?
          'Utama'
          : bahanBakarIndex + 1 : 'Utama' }}
        </p>
        <p class="font-bold">{{ bahanBakarItem.harga_bahan_bakar ?
          globalFormat.formatRupiah(bahanBakarItem.harga_bahan_bakar) :
          '-'
          }}
          <span class="text-gray-400">{{ labelBahanBakar(bahanBakarItem.kode_bahan_bakar) }}</span>
        </p>
      </div>
      <div class="col-span-2">
        <p class="text-gray-500">Specific Fuel Consumption (SFC) {{ bahanBakarItem.flag_bahan_bakar === 0 ||
          bahanBakars.flag_bahan_bakar
          !== 0 ? bahanBakarItem.flag_bahan_bakar === 1 ?
          'Utama'
          : bahanBakarIndex + 1 : 'Utama' }}</p>
        <p class="font-bold">{{ bahanBakarItem.sfc ? globalFormat.formatRupiah(bahanBakarItem.sfc) : '-' }} <span
            class="text-gray-400">kg/kWH</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();
const props = defineProps<Props>()

interface Props {
  parameterTeknis: any
  bahanBakars: any
  periode: any
  comboBahanBakar: any
}

const namaBahanBakar = (kodeBahanBakar: any) => {
  const result = props.comboBahanBakar.filter((val: any) => val.kode_bahan_bakar === kodeBahanBakar);
  if (result.length !== 0) {
    return result[0].bahan_bakar;
  }
  return '-';
}
const labelBahanBakar = (kodeBahanBakar: any) => {
  const result = props.comboBahanBakar.filter((val: any) => val.kode_bahan_bakar === kodeBahanBakar);
  if (result.length !== 0) {
    return result[0].satuan_harga_bahan_bakar.replace('Rupiah', 'Rp').replace(/ /g, '');
  }
  return '';
}
</script>

<style scoped></style>