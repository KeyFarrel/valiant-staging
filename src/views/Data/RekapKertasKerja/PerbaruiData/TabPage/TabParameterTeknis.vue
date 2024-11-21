<template>
  <div class="flex flex-col space-y-6">
    <section class="text-xs" v-if="props.isPerbaruiData === false">
      <span class="font-medium text-gray-400">Periode : </span>
      <span class="font-semibold">{{ props.tahunRealisasi }}</span>
      <span class="text-gray-200"> / </span>
      <span class="font-medium text-gray-400">Unit : </span>
      <span class="font-semibold">{{ props.mesin }}</span>
    </section>
    <form class="flex flex-col space-y-6 text-sm">
      <div class="grid grid-cols-4 gap-x-6">
        <div class="space-y-1">
          <label class="block font-bold text-gray-500">Net Plant Heat Rate (NPHR) <span
              class="text-warningColor">*</span></label>
          <div class="flex items-center justify-end">
            <TextField @on-input="handleInputDecimalRupiah('nphr')" v-model="nphr" class="pr-20"
              :disabled="props.isRealisasiUploaded === true || props.isIntegrasi" />
            <label class="absolute pr-3 text-sm text-primaryColor">Kcal/kWH</label>
          </div>
          <div class="text-xs text-warningColor" v-if="props.error?.nphr === true">NPHR wajib diisi</div>
        </div>
        <div class="space-y-1">
          <label class="block font-bold text-gray-500">Auxiliary <span class="text-warningColor">*</span></label>
          <div class="flex items-center justify-end">
            <TextField @on-input="handleInputDecimalRupiah('auxiliary')" v-model="auxiliary" class="pr-10"
              :disabled="props.isRealisasiUploaded === true || props.isIntegrasi" />
            <label class="absolute pr-3 text-sm text-primaryColor">%</label>
          </div>
          <div class="text-xs text-warningColor" v-if="props.error?.auxiliary === true">Auxiliary wajib diisi</div>
        </div>
        <div class="space-y-1">
          <label class="block font-bold text-gray-500">Susut Trafo <span class="text-warningColor">*</span></label>
          <div class="flex items-center justify-end">
            <TextField @on-input="handleInputDecimalRupiah('susutTrafo')" v-model="susutTrafo" class="pr-10"
              :disabled="props.isRealisasiUploaded === true || props.isIntegrasi" />
            <label class="absolute pr-3 text-sm text-primaryColor">%</label>
          </div>
          <div class="text-xs text-warningColor" v-if="props.error?.susutTrafo === true">Susut Trafo wajib diisi</div>
        </div>
        <div class="space-y-1">
          <label class="block font-bold text-gray-500">Pemakaian Sendiri (PS) <span
              class="text-warningColor">*</span></label>
          <div class="flex items-center justify-end">
            <TextField @on-input="handleInputDecimalRupiah('pemakaianSendiri')" v-model="pemakaianSendiri" class="pr-10"
              :disabled="props.isRealisasiUploaded === true || props.isIntegrasi" />
            <label class="absolute pr-3 text-sm text-primaryColor">%</label>
          </div>
          <div class="text-xs text-warningColor" v-if="props.error?.pemakaianSendiri === true">Pemakaian Sendiri wajib
            diisi
          </div>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-x-6">
        <div class="space-y-1">
          <label class="block font-bold text-gray-500">Electricity Price A <span
              class="text-warningColor">*</span></label>
          <div class="flex items-center justify-end">
            <TextField @on-input="handleInputDecimalRupiah('electricityPriceA')" v-model="electricityPriceA"
              class="pr-20" :disabled="props.isRealisasiUploaded === true" />
            <label class="absolute pr-3 text-sm text-primaryColor">Rp/kW.bln</label>
          </div>
          <div class="text-xs text-warningColor" v-if="props.error?.electricityPriceA === true">Electricity Price A
            wajib
            diisi</div>
        </div>
        <div class="space-y-1">
          <label class="block font-bold text-gray-500">Electricity Price B <span
              class="text-warningColor">*</span></label>
          <div class="flex items-center justify-end">
            <TextField @on-input="handleInputDecimalRupiah('electricityPriceB')" v-model="electricityPriceB"
              class="pr-20" :disabled="props.isRealisasiUploaded === true" />
            <label class="absolute pr-3 text-sm text-primaryColor">Rp/kW.bln</label>
          </div>
          <div class="text-xs text-warningColor" v-if="props.error?.electricityPriceB === true">Electricity Price B
            wajib
            diisi</div>
        </div>
        <div class="space-y-1">
          <label class="block font-bold text-gray-500">Electricity Price C <span
              class="text-warningColor">*</span></label>
          <div class="flex items-center justify-end">
            <TextField @on-input="handleInputDecimalRupiah('electricityPriceC')" v-model="electricityPriceC"
              class="pr-18" :disabled="props.isRealisasiUploaded === true" />
            <label class="absolute pr-3 text-sm text-primaryColor">Rp/kWh</label>
          </div>
          <div class="text-xs text-warningColor" v-if="props.error?.electricityPriceC === true">Electricity Price C
            wajib
            diisi</div>
        </div>
        <div class="space-y-1">
          <label class="block font-bold text-gray-500">Electricity Price D <span
              class="text-warningColor">*</span></label>
          <div class="flex items-center justify-end">
            <TextField @on-input="handleInputDecimalRupiah('electricityPriceD')" v-model="electricityPriceD"
              class="pr-18" :disabled="props.isRealisasiUploaded === true" />
            <label class="absolute pr-3 text-sm text-primaryColor">Rp/kWh</label>
          </div>
          <div class="text-xs text-warningColor" v-if="props.error?.electricityPriceD === true">Electricity Price D
            wajib
            diisi</div>
        </div>
      </div>
    </form>
    <div class="flex flex-col p-3 space-y-3 border border-gray-300 rounded-lg">
      <p class="font-semibold text-gray-500">Bahan Bakar</p>
      <div class="text-xs text-warningColor" v-if="props.error?.bahanBakar === true">Bahan Bakar wajib diisi</div>
      <div class="grid grid-cols-3 gap-5">
        <template v-for="( bahanBakarItem, bahanBakarIndex ) in bahanBakarsFinal()" :key="bahanBakarIndex">
          <div class="flex flex-row items-center space-x-3">
            <input type="checkbox" name="" class="rounded-[3.5px] border-primaryColor cursor-pointer"
              :id="bahanBakarItem.id" :value="bahanBakarItem.id" v-model="checkedBahanBakar" @change="emit('onChecked')"
              v-if="props.isRealisasiUploaded === false && bahanBakarItem.flag_bahan_bakar === 0">
            <div class="flex flex-col w-full space-y-1">
              <label class="block font-bold text-gray-500">Bahan Bakar {{ bahanBakars.length > 0 ?
                bahanBakarItem.flag_bahan_bakar === 1 ? 'Utama' : bahanBakarIndex + 1 : '-' }}<span
                  class="text-warningColor">*</span></label>
              <select class="text-sm border-gray-300 rounded-lg" @change="emit('onChange')"
                v-model="bahanBakarItem.kode_bahan_bakar" required :disabled="props.isRealisasiUploaded === true">
                <option value="" disabled hidden>Pilih Bahan Bakar</option>
                <option v-for="( comboBahanBakarItem, comboBahanBakarIndex ) in props.comboBahanBakar"
                  :value="(comboBahanBakarItem as any).kode_bahan_bakar" :key="comboBahanBakarIndex"
                  :disabled="bahanBakars.some((e: any) => e.kode_bahan_bakar === comboBahanBakarItem.kode_bahan_bakar && e !== bahanBakarItem)">
                  {{
                    (comboBahanBakarItem as any).bahan_bakar
                  }}
                </option>
              </select>
            </div>
          </div>
          <div class="space-y-1">
            <label class="block font-bold text-gray-500">Harga Bahan Bakar {{ bahanBakars.length > 0 ?
              bahanBakarItem.flag_bahan_bakar === 1 ? 'Utama' : bahanBakarIndex + 1 : '-' }}<span
                class="text-warningColor">
                *</span></label>
            <div class="flex items-center justify-end">
              <TextField @on-input="handleInputDecimalRupiah('hargaBahanBakar', bahanBakarIndex)" class="pr-18"
                v-model="bahanBakarItem.harga_bahan_bakar" :disabled="props.isRealisasiUploaded === true" />
              <label class="absolute pr-3 text-sm text-primaryColor">{{
                labelBahanBakar(bahanBakarItem.kode_bahan_bakar) }}</label>
            </div>
          </div>
          <!-- v-if="isSfcTrue(bahanBakarItem.kode_bahan_bakar) == true" -->
          <div class="space-y-1">
            <label class="block font-bold text-gray-500">Specific Fuel Consumption (SFC) {{ bahanBakars.length > 0 ?
              bahanBakarItem.flag_bahan_bakar === 1 ? 'Utama' : bahanBakarIndex + 1 : '-' }}<span
                class="text-warningColor">*</span></label>
            <div class="flex items-center justify-end">
              <TextField @on-input="handleInputDecimalRupiah('sfc', bahanBakarIndex)" class="pr-24"
                v-model="bahanBakarItem.sfc"
                :disabled="bahanBakarItem.status_sfc === false || props.isRealisasiUploaded === true || props.isIntegrasi" />
              <label class="absolute pr-3 text-sm text-primaryColor">{{ labelSFC(bahanBakarItem.kode_bahan_bakar)
                }}</label>
            </div>
          </div>
        </template>
      </div>
      <div class="flex flex-row items-center justify-end space-x-3" v-if="props.isRealisasiUploaded === false">
        <button
          class="px-3 py-2 font-semibold duration-300 rounded-lg text-warningColor hover:border-warningColor hover:bg-warningColor hover:text-white active:ring active:ring-warningColor active:ring-opacity-50 active:duration-0"
          @click="emit('onHapusBahanBakar')" v-if="bahanBakars.length > 1">Hapus</button>
        <button
          class="flex flex-row items-center px-3 py-2 space-x-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:border-hoverColor hover:bg-hoverColor hover:text-white active:ring active:infoComponentBorderColor active:duration-0"
          @click="emit('onTambahBahanBakar')" type="submit" v-if="bahanBakars.length !== props.comboBahanBakar.length">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_6305_16384)">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M7 0.875C7.48325 0.875 7.875 1.26675 7.875 1.75V6.125H12.25C12.7332 6.125 13.125 6.51675 13.125 7C13.125 7.48325 12.7332 7.875 12.25 7.875H7.875V12.25C7.875 12.7332 7.48325 13.125 7 13.125C6.51675 13.125 6.125 12.7332 6.125 12.25V7.875H1.75C1.26675 7.875 0.875 7.48325 0.875 7C0.875 6.51675 1.26675 6.125 1.75 6.125H6.125V1.75C6.125 1.26675 6.51675 0.875 7 0.875Z"
                fill="#0099AD" />
            </g>
            <defs>
              <clipPath id="clip0_6305_16384">
                <rect width="14" height="14" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span class="font-semibold">Tambah</span>
        </button>
        <div v-else class="absolute"></div>
      </div>
    </div>
    <button
      class="px-3 py-2 ml-auto font-semibold text-white rounded-lg bg-primaryColor hover:bg-hoverColor active:outline active:outline-primaryColor hover:duration-300 active:duration-0"
      type="submit" @click="props.isInputAsumsiParameter === true ? emit('onSubmit') : selectedTitle = 'Data Teknis'"
      v-if="props.isRealisasiUploaded === false">
      {{ props.isInputAsumsiParameter === true ? 'Kirim' : 'Selanjutnya' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();
import TextField from '@/components/ui/TextField.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';

const checkedBahanBakar = defineModel('checkedBahanBakar');
const bahanBakars: any = defineModel('bahanBakars');
const nphr = defineModel('nphr');
const auxiliary = defineModel('auxiliary');
const susutTrafo = defineModel('susutTrafo');
const pemakaianSendiri = defineModel('pemakaianSendiri');
const electricityPriceA = defineModel('electricityPriceA');
const electricityPriceB = defineModel('electricityPriceB');
const electricityPriceC = defineModel('electricityPriceC');
const electricityPriceD = defineModel('electricityPriceD');
const pickedValue = defineModel('pickedValue');
const emit = defineEmits(['onSubmit', 'onChecked', 'onHapusBahanBakar', 'onTambahBahanBakar', 'onChange'])
const selectedTitle = inject("selectedTitle");

interface Props {
  error?: {
    nphr: boolean,
    auxiliary: boolean,
    susutTrafo: boolean,
    pemakaianSendiri: boolean,
    electricityPriceA: boolean,
    electricityPriceB: boolean,
    electricityPriceC: boolean,
    electricityPriceD: boolean,
    bahanBakar: boolean
  }
  initValue?: {
    nphr: string,
    auxiliary: string,
    susutTrafo: string,
    pemakaianSendiri: string,
    electricityPriceA: string,
    electricityPriceB: string,
    electricityPriceC: string,
    electricityPriceD: string
  }
  mesin: string
  tahunRealisasi: number
  isInputAsumsiParameter: boolean
  comboBahanBakar: any
  isPermanent?: boolean
  isPerbaruiData?: boolean
  isRealisasiUploaded?: boolean
  kodePengelola?: string
  isIntegrasi?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPermanent: true,
  isPerbaruiData: true,
  isRealisasiUploaded: false,
  kodePengelola: '',
  isIntegrasi: false
});
const bahanBakarsFinal = () => {
  if (bahanBakars.value.some((e: any) => e.flag_bahan_bakar === 1)) {
    const utamaIndex = bahanBakars.value.findIndex((e: any) => e.flag_bahan_bakar === 1);
    if (utamaIndex) {
      const utama = bahanBakars.value[utamaIndex];
      bahanBakars.value.splice(utamaIndex, 1);
      bahanBakars.value.unshift(utama);
    }
  }
  return bahanBakars.value;
}
const comboBahanBakar = () => {
  if (bahanBakars.value.length === 0 || !bahanBakars.value) {
    return props.comboBahanBakar;
  } else {
    return props.comboBahanBakar.filter((val: any) => {
      return bahanBakars.value.every((bahanBakar: any) => bahanBakar.kode_bahan_bakar !== val.kode_bahan_bakar);
    });
  }
};
const labelBahanBakar = (kodeBahanBakar: any) => {
  const result = props.comboBahanBakar.filter((val: any) => val.kode_bahan_bakar === kodeBahanBakar)
  if (result.length !== 0) {
    return result[0].satuan_harga_bahan_bakar.replace('Rupiah', 'Rp').replace(/ /g, '');
  }
  return ''
}
const labelSFC = (kodeBahanBakar: any) => {
  const result = props.comboBahanBakar.filter((val: any) => val.kode_bahan_bakar === kodeBahanBakar);
  if (result.length !== 0) {
    return result[0].satuan_sfc.replace(/ /g, '');
  }
  return '';
}
const isSfcTrue = (kodeBahanBakar: any) => {
  const result = props.comboBahanBakar.filter((val: any) => val.bahan_bakar === kodeBahanBakar);
  if (result.length !== 0) {
    return result[0].status_sfc;
  }
  return '';
}

const handleInputDecimalRupiah = (targetModel: string, index?: number) => {
  switch (targetModel) {
    case 'nphr':
      nphr.value = globalFormat.formatInputDecimalRupiah(nphr.value);
      break;
    case 'auxiliary':
      auxiliary.value = globalFormat.formatInputDecimalRupiah(auxiliary.value);
      break;
    case 'susutTrafo':
      susutTrafo.value = globalFormat.formatInputDecimalRupiah(susutTrafo.value);
      break;
    case 'pemakaianSendiri':
      pemakaianSendiri.value = globalFormat.formatInputDecimalRupiah(pemakaianSendiri.value);
      break;
    case 'sfc':
      bahanBakars.value[index ?? -1].sfc = globalFormat.formatInputDecimalRupiah(bahanBakars.value[index ?? -1].sfc);
      console.log('xixi', bahanBakars.value[index ?? -1]);
      break;
    case 'electricityPriceA':
      electricityPriceA.value = globalFormat.formatInputDecimalRupiah(electricityPriceA.value);
      break;
    case 'electricityPriceB':
      electricityPriceB.value = globalFormat.formatInputDecimalRupiah(electricityPriceB.value);
      break;
    case 'electricityPriceC':
      electricityPriceC.value = globalFormat.formatInputDecimalRupiah(electricityPriceC.value);
      break;
    case 'electricityPriceD':
      electricityPriceD.value = globalFormat.formatInputDecimalRupiah(electricityPriceD.value);
      break;
    case 'hargaBahanBakar':
      bahanBakars.value[index ?? -1].harga_bahan_bakar = globalFormat.formatInputDecimalRupiah(bahanBakars.value[index ?? -1].harga_bahan_bakar);
      console.log('bakar', bahanBakars.value[index ?? -1]);
      break;
  }
}
</script>

<style scoped>
button:hover svg g path {
  fill: white;
}

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