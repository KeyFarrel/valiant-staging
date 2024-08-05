<template>
  <div class="flex flex-col space-y-4">
    <section class="flex flex-row items-center space-x-1 text-xs" v-if="props.isPerbaruiData === true">
      <span class="font-medium text-gray-400">Periode : </span>
      <span class="font-semibold">{{ props.tahunRealisasi }}</span>
      <span class="text-gray-200"> / </span>
      <span class="font-medium text-gray-400">Unit : </span>
      <span class="font-semibold">{{ props.mesin }}</span>
      <!-- <span class="text-gray-200"> / </span>
      <span class="mr-1.5 font-medium text-gray-400">Catatan : </span> -->
      <!-- <div class="flex flex-row items-center space-x-1">
        <WarningIcon />
        <span class="text-warningColor" v-if="props.isPermanent">Data yang ditampilkan merupakan data tahun sebelumnya,
          silahkan lakukan
          update
          terhadap data tersebut!</span>
        <span class="text-warningColor" v-else>Data yang ditampilkan merupakan data simulasi,
          mohon pilih opsi simulasi untuk mengubah ke data tetap</span>
      </div> -->
    </section>
    <section class="text-xs" v-else-if="props.isPerbaruiData === false">
      <span class="font-medium text-gray-400">Periode : </span>
      <span class="font-semibold">{{ props.tahunRealisasi }}</span>
      <span class="text-gray-200"> / </span>
      <span class="font-medium text-gray-400">Unit : </span>
      <span class="font-semibold">{{ props.mesin }}</span>
    </section>
    <div class="grid grid-cols-3 gap-6 text-sm">
      <div class="space-y-1">
        <label class="block font-bold text-gray-500" for="periodic">Type of Periodic Maintenance <span
            class="text-warningColor">*</span></label>
        <select name="" id="periodic" class="w-full text-sm border-gray-300 rounded-lg cursor-pointer"
          v-model="typePeriodic" required :disabled="props.isIntegrasi ? props.initValue.typePeriodic !== '' : false">
          <option value="" disabled hidden>Pilih Type of Periodic Maintenance</option>
          <option v-for="(comboTypePeriodicItem, index) in props.comboTypePeriodic"
            :value="comboTypePeriodicItem.id_type_periodic" :key="index">
            {{ comboTypePeriodicItem.kode_type_periodic }}
          </option>
        </select>
        <div class="text-xs text-warningColor" v-if="props.error?.periodicMaintenance === true">Type of Periodic
          Maintenance wajib diisi</div>
      </div>
      <div class="space-y-1">
        <label class="block font-bold text-gray-500">Net Capacity Factor (NCF) <span
            class="text-warningColor">*</span></label>
        <div class="flex items-center justify-end">
          <TextField @on-input="handleInputDecimalRupiah('ncf')" v-model="ncf" class="pr-10"
            :disabled="props.isIntegrasi" />
          <label class="absolute pr-3 text-sm text-primaryColor">%</label>
        </div>
        <div class="text-xs text-warningColor" v-if="props.error?.ncf === true">Net Capacity Factor wajib diisi</div>
      </div>
      <div class="space-y-1">
        <label class="block font-bold text-gray-500">Equivalent Availability Factor (EAF) <span
            class="text-warningColor">*</span></label>
        <div class="flex items-center justify-end">
          <TextField @on-input="handleInputDecimalRupiah('eaf')" v-model="eaf" class="pr-10"
            :disabled="props.isIntegrasi" />
          <label class="absolute pr-3 text-sm text-primaryColor">%</label>
        </div>
        <div class="text-xs text-warningColor" v-if="props.error?.eaf === true">Equivalent Availability Factor wajib
          diisi
        </div>
      </div>
      <div class="space-y-1">
        <label class="block font-bold text-gray-500">Production (Bruto) <span class="text-warningColor">*</span></label>
        <div class="flex items-center justify-end">
          <TextField @on-input="handleInputDecimalRupiah('productionBrutto')" v-model="productionBrutto" class="pr-10"
            :disabled="props.isIntegrasi" />
          <label class="absolute pr-3 text-sm text-primaryColor">MWh</label>
        </div>
        <div class="text-xs text-warningColor" v-if="props.error?.productionBrutto === true">Production (Brutto) wajib
          diisi</div>
      </div>
      <div class="space-y-1">
        <label class="block font-bold text-gray-500">Production (Netto) <span class="text-warningColor">*</span></label>
        <div class="flex items-center justify-end">
          <TextField @on-input="handleInputDecimalRupiah('productionNetto')" v-model="productionNetto" class="pr-10"
            :disabled="props.isIntegrasi" />
          <label class="absolute pr-3 text-sm text-primaryColor">MWh</label>
        </div>
        <div class="text-xs text-warningColor" v-if="props.error?.productionNetto === true">Production (Netto) wajib
          diisi
        </div>
      </div>
      <div class="space-y-1">
        <label class="block font-bold text-gray-500">Energy Sales <span class="text-warningColor">*</span></label>
        <div class="flex items-center justify-end">
          <TextField @on-input="handleInputDecimalRupiah('energySales')" v-model="energySales" class="pr-10"
            :disabled="props.isIntegrasi" />
          <label class="absolute pr-3 text-sm text-primaryColor">MWh</label>
        </div>
        <div class="text-xs text-warningColor" v-if="props.error?.energySales === true">Energy Sales wajib diisi</div>
      </div>
    </div>
    <div class="flex flex-col p-3 space-y-3 border border-gray-300 rounded-lg">
      <p class="font-semibold text-gray-500">Fuel Consumption</p>
      <div class="text-xs text-warningColor" v-if="props.error?.fuelConsumption === true">Fuel Consumption wajib diisi
      </div>
      <div class="grid grid-cols-3 gap-5">
        <div class="space-y-1" v-for="(fuelConsumptionItem, fuelConsumptionIndex) in fuelConsumption"
          :index="fuelConsumptionIndex">
          <label class="block font-bold text-gray-500">Fuel Consumption {{ fuelConsumptionItem.bahan_bakar }} <span
              class="text-warningColor">
              *</span></label>
          <div class="flex items-center justify-end">
            <TextField @on-input="handleInputDecimalRupiah('fuelConsumption', fuelConsumptionIndex)" class="pr-18"
              v-model="fuelConsumptionItem.value" :disabled="props.isIntegrasi" />
            <label class="absolute pr-3 text-sm text-primaryColor">{{
              labelFuelConsumption(fuelConsumptionItem.id_uraian.toString()) }}</label>
          </div>
        </div>
      </div>
    </div>
    <button
      class="px-3 py-2 ml-auto font-semibold text-white rounded-lg bg-primaryColor hover:bg-hoverColor active:outline active:outline-primaryColor hover:duration-300 active:duration-0"
      type="submit" @click="selectedTitle = 'Data Finansial'">
      Selanjutnya
    </button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import GlobalFormat from '@/services/format/global-format'
const globalFormat = new GlobalFormat();
import TextField from '@/components/ui/TextField.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';

const typePeriodic = defineModel('typePeriodic');
const ncf = defineModel('ncf');
const eaf = defineModel('eaf');
const productionBrutto = defineModel('productionBrutto');
const productionNetto = defineModel('productionNetto');
const energySales = defineModel('energySales');
const fuelConsumption: any = defineModel('fuelConsumption');
const selectedTitle = inject("selectedTitle");

interface Props {
  mesin: string
  tahunRealisasi: number
  comboTypePeriodic: any
  comboBahanBakar: any
  initValue: {
    typePeriodic: string | number
    ncf: string
    eaf: string
    productionBrutto: string
    productionNetto: string
    energySales: string
    // fuelConsumption: any
  }
  kodePengelola?: string
  isPerbaruiData?: boolean
  isPermanent?: boolean
  bahanBakars?: any
  isIntegrasi?: boolean
  error?: {
    periodicMaintenance: boolean
    ncf: boolean
    eaf: boolean
    productionBrutto: boolean
    productionNetto: boolean
    energySales: boolean
    fuelConsumption: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  isPerbaruiData: true,
  isPermanent: false,
  kodePengelola: '',
  isIntegrasi: false
});
const handleInputDecimalRupiah = (targetModel: string, index?: number) => {
  console.log(fuelConsumption.value)
  switch (targetModel) {
    case 'ncf':
      ncf.value = globalFormat.formatInputDecimalRupiah(ncf.value);
      break;
    case 'eaf':
      eaf.value = globalFormat.formatInputDecimalRupiah(eaf.value);
      break;
    case 'productionBrutto':
      productionBrutto.value = globalFormat.formatInputDecimalRupiah(productionBrutto.value);
      break;
    case 'productionNetto':
      productionNetto.value = globalFormat.formatInputDecimalRupiah(productionNetto.value);
      break;
    case 'energySales':
      energySales.value = globalFormat.formatInputDecimalRupiah(energySales.value);
      break;
    case 'fuelConsumption':
      fuelConsumption.value[index ?? -1].value = globalFormat.formatInputDecimalRupiah(fuelConsumption.value[index ?? -1].value);
      break;
  }
}
const labelFuelConsumption = (idUraian: string) => {
  const result = props.comboBahanBakar.filter((val: any) => val.id_uraian_fuel_consumption === idUraian);
  console.log(fuelConsumption.value)
  if (result.length !== 0) {
    return result[0].satuan_volume_bahan_bakar.replace(/ /g, '');
  }
  return '';
}
</script>

<style scoped>
select:required:invalid {
  color: gray;
}

select,
option {
  color: black;
}

:disabled,
:disabled:hover {
  background-color: #F5F5F5;
  cursor: not-allowed;
}
</style>