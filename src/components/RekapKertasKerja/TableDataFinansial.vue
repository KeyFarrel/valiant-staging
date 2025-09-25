<template>
  <div class="w-full overflow-auto border rounded-lg whitespace-nowrap"
    v-if="props.source.length && props.dataFinansial.tahun.length">
    <table class="w-full">
      <thead>
        <tr class="text-[#0099AD] text-sm text-left border-b-2">
          <th class="sticky left-0 z-10 bg-white pr-96" id="tableHeader">Nama</th>
          <th class="text-center "
            v-for="(tahunItem, tahunIndex) in props.dataFinansial.tahun.length === 0 ? 1 : props.dataFinansial.tahun"
            :key="tahunIndex" :class="props.tahunTerakhirRealisasi ? {
              'text-warningColor': tahunItem < props.tahunTerakhirRealisasi,
              'text-primaryTextColor': tahunItem === props.tahunTerakhirRealisasi,
              'text-primaryColor': tahunItem > props.tahunTerakhirRealisasi,
            } : null
              ">
            {{ props.dataFinansial.tahun.length === 0 ? '-' : tahunItem }} <br> <span class="text-xs font-normal">{{
              tahunIndex
              }}</span>
          </th>
        </tr>
      </thead>
      <tbody v-for="(level1, level1Index) in props.source" :key="level1Index">
        <tr class="text-sm cursor-pointer bg-strokeColor bg-opacity-40 active:bg-opacity-90"
          @click="toggleRow(level1.id_uraian)">
          <td class="sticky left-0 z-10 border-b">
            <div class="flex flex-row items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="mr-2" v-if="!isRowOpen(level1.id_uraian)">
                <rect width="24" height="24" rx="6" fill="#80C1CD" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                  fill="white" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="mr-2" v-else>
                <rect width="24" height="24" rx="6" fill="#80C1CD" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                  fill="white" />
              </svg>
              <span> {{ level1.uraian }}</span>
            </div>
          </td>
          <td class="border-b"
            v-for="(tahun, tahunIndex) in props.dataFinansial.tahun.length === 0 ? 1 : props.dataFinansial.tahun">
          </td>
        </tr>
        <template v-for="(level2, level2Index) in level1.level2" :key="level2Index" v-if="isRowOpen(level1.id_uraian)">
          <tr class="text-sm cursor-pointer active:bg-strokeColor active:bg-opacity-30"
            @click="toggleRow(level2.id_uraian)">
            <td id="level2" :class="{ selected: level2.level3.length === 0 }" class="sticky left-0 z-10 bg-white">
              <div class="flex flex-row items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="mr-2" v-if="!isRowOpen(level2.id_uraian) && level2.level3.length !== 0">
                  <rect width="24" height="24" rx="6" fill="#80C1CD" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                    fill="white" />
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="mr-2" v-else-if="isRowOpen(level2.id_uraian) && level2.level3.length !== 0">
                  <rect width="24" height="24" rx="6" fill="#80C1CD" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                    fill="white" />
                </svg>
                <span>{{ level2.uraian }}</span>
              </div>
            </td>
            <td class="text-right"
              v-for="(tahun, tahunIndex) in props.dataFinansial.tahun.length === 0 ? 1 : props.dataFinansial.tahun"
              :class="{ 'bg-blue-50': tahun === props.tahunTerakhirRealisasi }">
              {{ props.dataFinansial.tahun ? (level2.uraian.includes('Kalkulasi') ||
                level2.uraian.includes('kalkulasi')) ? '' : level2['t' +
                  tahun]
                  == null ? '-' : globalFormat.formatRupiah(level2['t' +
                    tahun])
                : '-' }}
            </td>
          </tr>
          <template v-for="(level3, level3Index) in level2.level3" :key="level3Index"
            v-if="isRowOpen(level2.id_uraian)">
            <tr class="text-sm cursor-pointer" @click="toggleRow(level3.id_uraian)">
              <td id="level3" :class="{ selected: level3.level4.length === 0 }" class="sticky left-0 z-10 bg-white">
                <div class="flex flex-row items-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="mr-2" v-if="!isRowOpen(level3.id_uraian) && level3.level4.length !== 0">
                    <rect width="24" height="24" rx="6" fill="#80C1CD" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                      fill="white" />
                  </svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    class="mr-2" v-else-if="isRowOpen(level3.id_uraian) && level3.level4.length !== 0">
                    <rect width="24" height="24" rx="6" fill="#80C1CD" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                      fill="white" />
                  </svg>
                  <span>{{ level3.uraian }}</span>
                </div>
              </td>
              <td class="text-right"
                v-for="(tahun, tahunIndex) in props.dataFinansial.tahun.length === 0 ? 1 : props.dataFinansial.tahun"
                :class="{ 'bg-blue-50': tahun === props.tahunTerakhirRealisasi }" :key="tahunIndex">
                {{ props.dataFinansial.tahun ? (level3.uraian.includes('Kalkulasi') ||
                  level3.uraian.includes('kalkulasi')) ? '' : level3['t' +
                    tahun]
                    == null ? '-'
                  : globalFormat.formatRupiah(level3['t' + tahun])
                  : '-' }}
              </td>
            </tr>
            <template v-for="(level4, level4Index) in level3.level4" :key="level4Index"
              v-if="isRowOpen(level3.id_uraian)">
              <tr class="text-sm">
                <td id="level4" class="sticky left-0 z-10 bg-white">{{ level4.uraian }}</td>
                <td class="text-right"
                  v-for="(tahun, tahunIndex) in props.dataFinansial.tahun.length === 0 ? 1 : props.dataFinansial.tahun"
                  :class="{ 'bg-blue-50': tahun === props.tahunTerakhirRealisasi }">
                  {{ props.dataFinansial.tahun ? (level4.uraian.includes('Kalkulasi') ||
                    level4.uraian.includes('kalkulasi')) ? '' : level4['t'
                      +
                      tahun] == null ? '-' :
                    globalFormat.formatRupiah(level4['t' + tahun]) : '-' }}
                </td>
              </tr>
            </template>
          </template>
        </template>
      </tbody>
    </table>
  </div>
  <ReloadComponent v-else-if="props.isFetchingError && (!props.source.length && !props.dataFinansial.tahun.length)"
    @on-clicks="emit('onClickReload')" @on-key-down="emit('onKeyDown')" @keydown="emit('onKeyDown')" />
  <ShimmerLoading v-else class="w-full h-40" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();
import ShimmerLoading from '../ui/ShimmerLoading.vue';
import ReloadComponent from '../ui/ReloadComponent.vue';

const isRowTabOpen = ref<number[]>([]);

interface Props {
  isFetchingError: boolean
  dataFinansial: {
    tahun: number[]
  }
  source: any[]
  tahunTerakhirRealisasi?: number
}
const props = withDefaults(defineProps<Props>(), {
  isFetchingError: false
})
const emit = defineEmits(['onClickReload', 'onKeyDown']);

const toggleRow = (itemId: number) => {
  if (isRowOpen(itemId)) {
    isRowTabOpen.value = isRowTabOpen.value.filter(
      (id: any) => id !== itemId
    );
  } else {
    isRowTabOpen.value.push(itemId);
  }
};

const isRowOpen = (itemId: number) => {
  return isRowTabOpen.value.includes(itemId);
};
</script>

<style scoped>
th {
  font-weight: 700;
  padding: 1rem;
}

td {
  padding: 1rem;
}

#level2 {
  padding-left: 3.1rem;
}

#level2.selected {
  padding-left: 5.1rem;
}

#level3 {
  padding-left: 5.3rem;
}

#level3.selected {
  padding-left: 7.3rem;
}

#level4 {
  padding-left: 9.3rem;
}

#tableHeader {
  padding-right: 30rem;
}
</style>