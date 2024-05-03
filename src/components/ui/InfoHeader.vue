<template>
  <div class="flex flex-row justify-between items-start bg-white p-4 rounded-lg">
    <div class="flex flex-col space-y-2">
      <p class="font-semibold text-primaryTextColor text-lg">{{ props.namaMesin }}</p>
      <section class="text-xs">
        <span class="text-gray-400 font-medium">Unit Pengelola : </span>
        <span>{{ props.namaPengelola }}</span>
        <span class="text-gray-200" v-if="props.isMesin"> / </span>
        <span class="text-gray-400 font-medium" v-if="props.isMesin">Status Mesin : </span>
        <span v-if="props.isMesin">{{ props.kondisiUnit }}</span>
      </section>
      <div class="flex">
        <Chips :title="'Kategori Unit Pembangkit'" :content="props.kodeJenisPembangkit" />
        <Chips :title="'Daya Terpasang'"
          :content="globalFormat.formatEnergy(parseInt(props.dayaTerpasang) / 1000) + ' MW'" />
        <Chips :title="'Daya Mampu (Netto)'"
          :content="globalFormat.formatEnergy(parseInt(props.dayaMampu) / 1000) + ' MW'" />
        <Chips :title="'Tahun COD'" :content="props.tahunOperasi" />
        <Chips :title="'Umur Teknis'" :content="props.umurTeknis !== null
          ? props.umurTeknis + ' Tahun'
          : '-'
          " />
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();
import Chips from './Chips.vue';

interface Props {
  namaMesin: string,
  namaPengelola: string,
  kondisiUnit: string,
  kodeJenisPembangkit: string,
  dayaTerpasang: string,
  dayaMampu: string,
  tahunOperasi: string,
  umurTeknis: string | number,
  isMesin?: boolean
}
const props = defineProps<Props>()
</script>

<style scoped></style>