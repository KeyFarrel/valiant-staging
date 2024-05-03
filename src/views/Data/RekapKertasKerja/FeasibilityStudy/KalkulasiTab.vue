<template>
  <div class="w-full overflow-auto border rounded-lg whitespace-nowrap">
    <table class="w-full text-xs">
      <thead>
        <tr class="text-[#0099AD] text-sm text-left border-b">
          <th id="tableHeader">Nama</th>
          <th
            v-for="(tahun, index) in props.kalkulasiFeasibility.tahun.length === 0 ? 1 : props.kalkulasiFeasibility.tahun">
            {{ props.kalkulasiFeasibility.tahun.length === 0 ? '-' : tahun }}
          </th>
        </tr>
      </thead>
      <tbody v-for="(level1, resultMapIndex) in props.resultMap" :key="resultMapIndex">
        <tr @click="toggleRow(resultMapIndex)" class="cursor-pointer bg-strokeColor bg-opacity-40 active:bg-opacity-90">
          <td class="border-b"
            :colspan="props.kalkulasiFeasibility.tahun.length === 0 ? 2 : props.kalkulasiFeasibility.tahun.length + 1">
            <div class="flex flex-row items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2"
                v-if="!isRowOpen(resultMapIndex)">
                <rect width="24" height="24" rx="6" fill="#E5E7E9" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                  fill="#333333" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2"
                v-else>
                <rect width="24" height="24" rx="6" fill="#E5E7E9" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                  fill="#333333" />
              </svg>
              <span>{{ level1.uraian }}</span>
            </div>
          </td>
        </tr>
        <tr v-for="(level2, level1Index) in level1.children" :key="level1Index" v-if="isRowOpen(resultMapIndex)">
          <td id="children">{{ level2.uraian }}</td>
          <td
            v-for="(tahuns, index) in props.kalkulasiFeasibility.tahun.length === 0 ? 1 : props.kalkulasiFeasibility.tahun"
            :class="{ 'bg-blue-50': tahuns === 2023 }">
            {{ props.kalkulasiFeasibility.tahun ? level2['t' + tahuns] ? globalFormat.formatRupiah(level2['t' + tahuns])
              : '-' : '-' }}
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr
          v-for="(level0, index) in props.kalkulasiFeasibility.detail.filter((level0Item: any) => level0Item.level === 0)">
          <td>{{ level0.uraian }}</td>
          <td
            v-for="(tahuns, index) in props.kalkulasiFeasibility.tahun.length === 0 ? 1 : props.kalkulasiFeasibility.tahun"
            :class="{ 'bg-blue-50': tahuns === 2023 }">{{ level0['t' + tahuns] ? level0['t' + tahuns] : '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();

interface Props {
  kalkulasiFeasibility: any,
  resultMap: any,
}

const props = defineProps<Props>();

const openedRow = ref<any[]>([]);
const toggleRow = (rowId: number) => {
  if (isRowOpen(rowId)) {
    openedRow.value = openedRow.value.filter(
      (id) => id !== rowId
    );
  } else {
    openedRow.value.push(rowId);
  }
}
const isRowOpen = (rowId: any) => {
  return openedRow.value.includes(rowId);
}
</script>

<style scoped>
th {
  font-weight: 700;
  padding: 1rem;
}

#tableHeader {
  padding-right: 20rem;
}

td {
  padding: 1rem;
}

#children {
  padding-left: 3.1rem;
}
</style>