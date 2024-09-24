<template>
  <div class="flex flex-col space-y-4">
    <!-- <section class="flex flex-row items-center space-x-1 text-xs" v-if="props.isPerbaruiData === true">
      <span class="font-medium text-gray-400">Periode : </span>
      <span class="font-semibold">{{ props.tahunRealisasi }}</span>
      <span class="text-gray-200"> / </span>
      <span class="font-medium text-gray-400">Unit : </span>
      <span class="font-semibold">{{ props.mesin }}</span> -->
    <!-- <span class="text-gray-200"> / </span>
      <span class="mr-1.5 font-medium text-gray-400">Catatan : </span>
      <div class="flex flex-row items-center space-x-1">
        <WarningIcon />
        <span class="text-warningColor" v-if="props.isPermanent === true">Data yang ditampilkan merupakan data tahun
          sebelumnya, silahkan lakukan
          update terhadap data tersebut!</span>
        <span class="text-warningColor" v-else>Data yang ditampilkan merupakan data simulasi,
          mohon pilih opsi simulasi untuk mengubah ke data tetap</span>
      </div> -->
    <!-- </section> -->
    <section class="text-xs" v-if="props.isPerbaruiData === false">
      <span class="font-medium text-gray-400">Periode : </span>
      <span class="font-semibold">{{ props.tahunRealisasi }}</span>
      <span class="text-gray-200"> / </span>
      <span class="font-medium text-gray-400">Unit : </span>
      <span class="font-semibold">{{ props.mesin }}</span>
    </section>
    <form class="grid grid-cols-4 text-sm gap-x-6">
      <div class="space-y-1">
        <label class="block font-bold text-gray-500">Interest Rate <span class="text-warningColor">*</span></label>
        <div class="flex items-center justify-end">
          <TextField @on-input="handleInputDecimalRupiah('interestRate')" v-model="interestRate" class="pr-14"
            :disabled="props.isRealisasiUploaded === true" />
          <label for="" class="absolute pr-3 text-primaryColor">%</label>
        </div>
        <div class="text-xs text-warningColor" v-if="props.error?.interestRate === true">Interest Rate wajib diisi</div>
      </div>
      <div class="space-y-1">
        <label class="block font-bold text-gray-500">Umur Teknis <span class="text-warningColor">*</span></label>
        <div class="flex items-center justify-end">
          <TextField @on-input="handleInputNumberOnly('umurTeknis')" v-model="umurTeknis" class="pr-14"
            :disabled="props.initValue?.umurTeknis !== ''" />
          <label for="" class="absolute pr-3 text-sm text-primaryColor">Tahun</label>
        </div>
        <div class="text-xs text-warningColor" v-if="props.error?.umurTeknis === true">Umur Teknis wajib diisi</div>
      </div>
      <div class="space-y-1">
        <label class="block font-bold text-gray-500">Loan Tenor <span class="text-warningColor">*</span></label>
        <div class="flex items-center justify-end">
          <TextField @on-input="handleInputNumberOnly('loanTenor')" v-model="loanTenor" class="pr-14"
            :disabled="props.isRealisasiUploaded === true" />
          <label for="" class="absolute pr-3 text-sm text-primaryColor">Tahun</label>
        </div>
        <div class="text-xs text-warningColor" v-if="props.error?.loanTenor === true">Loan Tenor wajib diisi</div>
      </div>
      <div class="space-y-1">
        <label class="block font-bold text-gray-500">Loan Portion <span class="text-warningColor">*</span></label>
        <div class="flex items-center justify-end">
          <TextField @on-input="handleInputDecimalRupiah('loanPortion')" v-model="loanPortion" class="pr-10"
            :disabled="props.isRealisasiUploaded === true" />
          <label for="" class="absolute pr-3 text-sm text-primaryColor">%</label>
        </div>
        <div class="text-xs text-warningColor" v-if="props.error?.loanPortion === true">Loan Portion wajib diisi</div>
      </div>
    </form>
    <button
      class="px-3 py-2 ml-auto font-semibold text-white rounded-lg bg-primaryColor hover:bg-hoverColor active:outline active:outline-primaryColor hover:duration-300 active:duration-0"
      type="submit" @click="selectedTitle = 'Parameter Teknis & Finansial'">
      Selanjutnya
    </button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();
import TextField from '@/components/ui/TextField.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';

const interestRate = defineModel('interestRate');
const umurTeknis = defineModel('umurTeknis');
const loanTenor = defineModel('loanTenor');
const loanPortion = defineModel('loanPortion');
const selectedTitle = inject("selectedTitle");

interface Props {
  error?: {
    interestRate: boolean
    umurTeknis: boolean
    loanTenor: boolean
    loanPortion: boolean
  }
  initValue?: {
    interestRate: string
    umurTeknis: string
    loanTenor: string
    loanPortion: string
  }
  mesin: string
  tahunRealisasi: number
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
  isIntegrasi: false,
});

const handleInputDecimalRupiah = (targetModel: string) => {
  switch (targetModel) {
    case 'interestRate':
      interestRate.value = globalFormat.formatInputDecimalRupiah(interestRate.value);
      break;
    case 'loanPortion':
      loanPortion.value = globalFormat.formatInputDecimalRupiah(loanPortion.value);
      break;
  }
}
const handleInputNumberOnly = (targetModel: string) => {
  switch (targetModel) {
    case 'umurTeknis':
      umurTeknis.value = globalFormat.formatInputNumberOnly(umurTeknis.value);
      break;
    case 'loanTenor':
      loanTenor.value = globalFormat.formatInputNumberOnly(loanTenor.value);
      break;
  }
}

</script>

<style scoped>
:disabled {
  background-color: #F5F5F5;
  cursor: not-allowed;
}
</style>