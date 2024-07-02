<template>
  <div class="flex flex-row items-start justify-between p-4 bg-white rounded-lg">
    <div class="flex flex-col space-y-2">
      <p class="text-lg font-semibold text-primaryTextColor">{{ props.namaMesin }}</p>
      <section class="text-xs">
        <span class="font-medium text-gray-400">Unit Pengelola : </span>
        <span>{{ props.namaPengelola }}</span>
        <span class="text-gray-200"> / </span>
        <span class="font-medium text-gray-400">Unit Pembina : </span>
        <span>{{ props.namaPembina }}</span>
        <span class="text-gray-200"> / </span>
        <span class="font-medium text-gray-400">Status Mesin : </span>
        <span>{{ props.kondisiUnit }}</span>
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
  namaMesin: string
  namaPengelola: string
  kondisiUnit: string
  kodeJenisPembangkit: string
  dayaTerpasang: string
  dayaMampu: string
  tahunOperasi: string
  namaPembina: string
  umurTeknis: string | number
}
const props = defineProps<Props>()
</script>

<style scoped></style>