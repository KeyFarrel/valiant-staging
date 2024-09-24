<template>
  <div class="flex flex-row items-start justify-between p-4 bg-white rounded-lg">
    <div class="flex flex-col space-y-2">
      <p class="text-lg font-semibold text-primaryTextColor">{{ props.namaMesin }}</p>
      <section class="flex items-center space-x-1 text-xs">
        <div class="flex items-center space-x-1">
          <span class="font-medium text-gray-400">Unit Pengelola : </span>
          <span v-if="props.namaPengelola">{{ props.namaPengelola }}</span>
          <ShimmerLoading v-else class="w-24 h-2.5" />
        </div>
        <span class="text-gray-200"> / </span>
        <div class="flex items-center space-x-1">
          <span class="font-medium text-gray-400">Unit Pembina : </span>
          <span v-if="props.namaPembina">{{ props.namaPembina }}</span>
          <ShimmerLoading v-else class="h-2.5 w-18" />
        </div>
        <span class="text-gray-200"> / </span>
        <div class="flex items-center space-x-1">
          <span class="font-medium text-gray-400">Status Mesin : </span>
          <span v-if="props.kondisiUnit">{{ props.kondisiUnit }}</span>
          <ShimmerLoading v-else class="w-16 h-2.5" />
        </div>
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
import ShimmerLoading from './ShimmerLoading.vue';

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