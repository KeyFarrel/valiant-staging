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
      <div class="flex items-center" v-if="props.listTahunAsumsi">
        <p class="mr-3 font-bold text-gray-500">Periode</p>
        <VueDatePicker v-if="props.listTahunAsumsi" class="date-picker" v-model="selectedTahun"
          :year-range="[props.listTahunAsumsi.start, props.listTahunAsumsi.end]" :clearable="false" year-picker
          @update:model-value="emit('onChange')" />
      </div>
    </div>
    <div class="grid grid-cols-4 mt-4 text-sm gap-y-5">
      <div>
        <p class="text-gray-500">Daya Terpasang</p>
        <p class="font-bold">{{ props.dayaTerpasang !== '-' ? globalFormat.formatRupiah(props.dayaTerpasang / 1000) :
          '-'
          }} <span class="text-gray-400">MW</span></p>
      </div>
      <div class="col-span-3">
        <p class="text-gray-500">Daya Mampu Netto</p>
        <p class="font-bold">{{ props.dayaMampuNetto !== '-' ? globalFormat.formatRupiah(props.dayaMampuNetto) : '-' }}
          <span class="text-gray-400">MW</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Auxiliary</p>
        <p class="font-bold">{{ props.auxiliary !== '-' ? globalFormat.formatRupiah(props.auxiliary) : '-' }}
          <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Susut Trafo</p>
        <p class="font-bold">{{ props.susutTrafo !== '-' ? globalFormat.formatRupiah(props.susutTrafo) : '-' }}
          <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Pemakaian Sendiri (PS)</p>
        <p class="font-bold">{{ props.pemakaianSendiri !== '-' ? globalFormat.formatRupiah(props.pemakaianSendiri) : '-'
          }}
          <span class="text-gray-400">%</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Net Plant Heat Rate (NPHR)</p>
        <p class="font-bold">{{ props.netPlantHeatRate !== '-' ? globalFormat.formatRupiah(props.netPlantHeatRate) : '-'
          }}
          <span class="text-gray-400">Kcal/kWh</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Total Project Cost</p>
        <p class="font-bold">{{ props.totalProjectCost !== '-' ? globalFormat.formatRupiah(props.totalProjectCost) : '-'
          }}
          <span class="text-gray-400">Rp
            (Juta)</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Loan</p>
        <p class="font-bold">{{ props.loan !== '-' ? globalFormat.formatRupiah(props.loan) : '-' }} <span
            class="text-gray-400">Rp (Juta)</span>
        </p>
      </div>
      <div class="col-span-2">
        <p class="text-gray-500">Equity</p>
        <p class="font-bold">{{ props.equity !== '-' ? globalFormat.formatRupiah(props.equity) : '-' }}
          <span class="text-gray-400">Rp (Juta)</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price A</p>
        <p class="font-bold">{{ props.electricityPriceA !== '-' ? globalFormat.formatRupiah(props.electricityPriceA) :
          '-' }}
          <span class="text-gray-400">Rp/kW.bln</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price B</p>
        <p class="font-bold">{{ props.electricityPriceB !== '-' ? globalFormat.formatRupiah(props.electricityPriceB) :
          '-' }}
          <span class="text-gray-400">Rp/kW.bln</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price C</p>
        <p class="font-bold">
          {{ props.electricityPriceC !== '-' ? globalFormat.formatRupiah(props.electricityPriceC) : '-' }}
          <span class="text-gray-400">Rp/kWh</span>
        </p>
      </div>
      <div>
        <p class="text-gray-500">Electricity Price D</p>
        <p class="font-bold">{{ props.electricityPriceD !== '-' ? globalFormat.formatRupiah(props.electricityPriceD) :
          '-' }}
          <span class="text-gray-400">Rp/kWh</span>
        </p>
      </div>
    </div>
    <div class="pb-4 mt-8 border-b" v-if="props.bahanBakars">
      <p class="font-semibold">Bahan Bakar</p>
    </div>
    <template v-if="props.bahanBakars.length !== 0">
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
              class="text-gray-400">{{ labelSFC(bahanBakarItem.kode_bahan_bakar) }}</span></p>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-4 mt-3 text-sm gap-y-5">
        <div>
          <p class="text-gray-500">Bahan Bakar Utama</p>
          <p class="font-bold">-</p>
        </div>
        <div>
          <p class="text-gray-500">Harga Bahan Bakar Utama</p>
          <p class="font-bold">-</p>
        </div>
        <div class="col-span-2">
          <p class="text-gray-500">Specific Fuel Consumption (SFC) Utama</p>
          <p class="font-bold">-</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();

interface Props {
  dayaTerpasang: any,
  dayaMampuNetto: any,
  auxiliary: any,
  susutTrafo: any,
  pemakaianSendiri: any,
  netPlantHeatRate: any,
  totalProjectCost: any,
  loan: any,
  equity: any,
  electricityPriceA: any,
  electricityPriceB: any,
  electricityPriceC: any,
  electricityPriceD: any,
  comboBahanBakar: any,
  bahanBakars?: any,
  listTahunAsumsi?: {
    start: string | number,
    end: string | number
  }
}

const emit = defineEmits(['onChange'])
const selectedTahun = defineModel('selectedTahun');
const props = defineProps<Props>()
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
const labelSFC = (kodeBahanBakar: any) => {
  const result = props.comboBahanBakar.filter((val: any) => val.kode_bahan_bakar === kodeBahanBakar);
  if (result.length !== 0) {
    return result[0].satuan_sfc.replace(/ /g, '');
  }
  return '';
}
</script>

<style scoped>
.date-picker {
  width: 10rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
}
</style>