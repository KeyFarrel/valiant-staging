<template>
  <Loading v-if="isLoading" />
  <div class="space-y-5">
    <div class="flex flex-row items-center justify-between">
      <SearchBox class="w-60" placeholder="Cari sentral..." @on-key-enter="fetchDataAnggaran"
        @on-click-submit="fetchDataAnggaran" v-model="searchQ" @on-input="fetchDataAnggaran" />
      <div class="flex flex-row items-center space-x-3">
        <div class="flex flex-row items-center space-x-3">
          <label class="text-sm font-semibold text-labelColor" for="">Tahun</label>
          <VueDatePicker v-if="periodeTahun" class="date-picker" :model-value="yearRangePicked"
            @update:model-value="handleYearRangePicked" teleport :year-range="yearRange" :clearable="false" year-picker
            range />
          <ShimmerLoading class="w-36 h-11" v-else />
        </div>
        <ButtonComponent @on-click-submit="handleExport" :text="'Export'" :text-color="'text-white'"
          :hover-text-color="'text-hoverColor'" :bg-color="'bg-primaryColor'" :icon-position="'Left'"
          :hover-bg-color="'bg-hoverColor'" :border-color="'bg-primaryColor'" :hover-border-color="'bg-hoverColor'">
          <svg width="16" height="12" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.12508 1.20829C4.75588 1.20829 3.64591 2.31825 3.64591 3.68746C3.64591 3.84553 3.66063 3.99964 3.68862 4.14863C3.74259 4.43595 3.57555 4.71884 3.2979 4.81034C2.48294 5.07892 1.89591 5.84665 1.89591 6.74996C1.89591 7.87754 2.81 8.79163 3.93758 8.79163H10.5001C11.386 8.79163 12.1042 8.07342 12.1042 7.18746C12.1042 6.50304 11.6754 5.91733 11.0697 5.68719C10.774 5.57484 10.6217 5.2473 10.7264 4.94881C10.7686 4.82865 10.7917 4.69889 10.7917 4.56246C10.7917 3.91813 10.2694 3.39579 9.62508 3.39579C9.49836 3.39579 9.37744 3.41579 9.26468 3.45236C9.11237 3.50175 8.94646 3.48637 8.80583 3.40982C8.6652 3.33327 8.56222 3.20228 8.52102 3.04755C8.23896 1.9881 7.27235 1.20829 6.12508 1.20829ZM2.47925 3.68746C2.47925 1.67392 4.11154 0.041626 6.12508 0.041626C7.62264 0.041626 8.90824 0.944132 9.46959 2.23425C9.52103 2.23085 9.57288 2.22913 9.62508 2.22913C10.9137 2.22913 11.9584 3.27379 11.9584 4.56246C11.9584 4.65018 11.9535 4.73689 11.9441 4.82232C12.7393 5.30885 13.2709 6.18556 13.2709 7.18746C13.2709 8.71775 12.0304 9.95829 10.5001 9.95829H3.93758C2.16567 9.95829 0.729248 8.52187 0.729248 6.74996C0.729248 5.50032 1.44338 4.41866 2.48473 3.88884C2.48109 3.82213 2.47925 3.75499 2.47925 3.68746ZM7.00008 3.10413C7.32225 3.10413 7.58341 3.36529 7.58341 3.68746V6.21667L8.3376 5.46248C8.56541 5.23467 8.93475 5.23467 9.16256 5.46248C9.39037 5.69029 9.39037 6.05963 9.16256 6.28744L7.41256 8.03744C7.18475 8.26524 6.81541 8.26524 6.5876 8.03744L4.8376 6.28744C4.6098 6.05963 4.6098 5.69029 4.8376 5.46248C5.06541 5.23467 5.43475 5.23467 5.66256 5.46248L6.41675 6.21667V3.68746C6.41675 3.36529 6.67791 3.10413 7.00008 3.10413Z"
              fill="white" />
          </svg>
        </ButtonComponent>
      </div>
    </div>
    <TableComponent>
      <template v-slot:table-header>
        <tr>
          <th scope="col" class="border-r" rowspan="2">
            <div class="flex flex-row items-center justify-center space-x-10">
              <h1 class="font-semibold">Unit Induk / Sentral / Mesin</h1>
            </div>
          </th>
          <th scope="col" class="border-r" rowspan="2">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Jenis Pembangkit</h1>
            </div>
          </th>
          <th scope="col" class="border-r" rowspan="2">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Tahun</h1>
            </div>
          </th>
          <th scope="col" class="font-semibold border-b border-r">Capital Expenditure (CAPEX)</th>
          <th scope="col" class="font-semibold border-b" colspan="3">Operational Expenditure (OPEX)</th>
        </tr>
        <tr>
          <th scope="col" class="border-r">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Total Capex Rp (Juta)</h1>
            </div>
          </th>
          <th scope="col" class="border-r">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Komponen B Rp (Juta)</h1>
            </div>
          </th>
          <th scope="col" class="border-r">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Komponen C Rp (Juta)</h1>
            </div>
          </th>
          <th scope="col">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Komponen D Rp (Juta)</h1>
            </div>
          </th>
        </tr>
      </template>
      <template v-slot:table-body v-if="dataAnggaran.length === 0">
        <tr class="text-xs text-gray-900 border-b">
          <td colspan="9">
            <Empty />
          </td>
        </tr>
      </template>
      <template v-slot:table-body v-else>
        <template v-for="(pengelola, pengelolaIndex) in dataAnggaran" :key="pengelolaIndex" v-if="dataAnggaran">
          <tr class="text-xs bg-strokeColor bg-opacity-30 hover:bg-strokeColor hover:bg-opacity-60"
            :class="{ 'hover:bg-opacity-30': pengelola.pembangkits.length === 0, 'cursor-pointer': pengelola.pembangkits.length !== 0 }"
            @click="toggleRow(pengelola.id_pengelola)">
            <td>
              <div class="flex flex-row items-center space-x-2" :class="{ 'ml-8': pengelola.pembangkits.length === 0 }">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  v-if="!isRowOpen(pengelola.id_pengelola) && pengelola.pembangkits.length !== 0">
                  <rect width="24" height="24" rx="6" fill="#E5E7E9" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                    fill="#333333" />
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  v-else-if="pengelola.pembangkits.length !== 0">
                  <rect width="24" height="24" rx="6" fill="#E5E7E9" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                    fill="#333333" />
                </svg>
                <span>{{ pengelola.pengelola }}</span>
              </div>
            </td>
            <td></td>
            <td></td>
            <td class="text-end">{{ globalFormat.formatRupiah(pengelola.cost_component_a) }}</td>
            <td class="text-end">{{ globalFormat.formatRupiah(pengelola.cost_component_b) }}</td>
            <td class="text-end">{{ globalFormat.formatRupiah(pengelola.cost_component_c) }}</td>
            <td class="text-end">{{ globalFormat.formatRupiah(pengelola.cost_component_d) }}</td>
          </tr>
          <template v-if="isRowOpen(pengelola.id_pengelola)"
            v-for="(pembangkit, pembangkitIndex) in pengelola.pembangkits" :key="pembangkitIndex">
            <tr class="text-xs cursor-pointer bg-strokeColor bg-opacity-20 hover:bg-opacity-60"
              @click="toggleRow(pembangkit.uuid_sentral)">
              <td id="pembangkit">
                <div class="flex flex-row items-center space-x-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    v-if="!isRowOpen(pembangkit.uuid_sentral) && pembangkit.mesins.length !== 0">
                    <rect width="24" height="24" rx="6" fill="#E5E7E9" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                      fill="#333333" />
                  </svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    v-else-if="isRowOpen(pembangkit.uuid_sentral) && pembangkit.mesins.length !== 0">
                    <rect width="24" height="24" rx="6" fill="#E5E7E9" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                      fill="#333333" />
                  </svg>
                  <span>{{ pembangkit.sentral }}</span>
                </div>
              </td>
              <td class="text-center">{{ pembangkit.kode_jenis_pembangkit }}</td>
              <td></td>
              <td class="text-end">{{ globalFormat.formatRupiah(pembangkit.cost_component_a) }}</td>
              <td class="text-end">{{ globalFormat.formatRupiah(pembangkit.cost_component_b) }}</td>
              <td class="text-end">{{ globalFormat.formatRupiah(pembangkit.cost_component_c) }}</td>
              <td class="text-end">{{ globalFormat.formatRupiah(pembangkit.cost_component_d) }}</td>
            </tr>
            <template v-if="isRowOpen(pembangkit.uuid_sentral)" v-for="(mesin, mesinIndex) in pembangkit.mesins"
              :key="mesinIndex">
              <tr class="text-xs bg-strokeColor bg-opacity-10">
                <td id="mesin">{{ mesin.mesin }}</td>
                <td class="text-center">{{ pembangkit.kode_jenis_pembangkit }}</td>
                <td></td>
                <td class="text-end">{{ globalFormat.formatRupiah(mesin.cost_component_a) }}</td>
                <td class="text-end">{{ globalFormat.formatRupiah(mesin.cost_component_b) }}</td>
                <td class="text-end">{{ globalFormat.formatRupiah(mesin.cost_component_c) }}</td>
                <td class="text-end">{{ globalFormat.formatRupiah(mesin.cost_component_d) }}</td>
              </tr>
              <template v-for="(transCostItem, transCostIndex) in mesin.detail_mesin_cost_component"
                :key="transCostIndex">
                <tr class="text-xs">
                  <td></td>
                  <td></td>
                  <td class="text-center">{{ transCostItem.tahun }}</td>
                  <td class="text-end">{{ globalFormat.formatRupiah(transCostItem.cost_component_a) }}</td>
                  <td class="text-end">{{ globalFormat.formatRupiah(transCostItem.cost_component_b) }}</td>
                  <td class="text-end">{{ globalFormat.formatRupiah(transCostItem.cost_component_c) }}</td>
                  <td class="text-end">{{ globalFormat.formatRupiah(transCostItem.cost_component_d) }}</td>
                </tr>
              </template>
            </template>
          </template>
        </template>
      </template>
    </TableComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLamanDataPeriodeStore } from "@/store/storeLamanDataTab";
const store = useLamanDataPeriodeStore();
import LamanService from '@/services/laman-service';
const lamanService = new LamanService();
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import AOS from 'aos'
import Empty from "@/components/ui/EmptyData.vue";
import ButtonComponent from "@/components/ui/Button.vue";
import TableComponent from '@/components/ui/Table.vue'
import Loading from '@/components/ui/LoadingSpinner.vue'
import SearchBox from '@/components/ui/SearchBox.vue'
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";

const tahunDari = ref<any>();
const tahunSampai = ref<any>();
const dataAnggaran = ref<any[]>([]);
const isRowTabOpen = ref<number[]>([]);
const isLoading = ref();
const yearRangePicked = ref<number[]>([]);
const yearRange = ref<number[]>([]);
const periodeTahun = ref<any[]>([]);
const tahunBerjalan = new Date().getFullYear();
const searchQ = ref<string>("");

const handleYearRangePicked = async (modelData: Array<number>) => {
  yearRangePicked.value = modelData;
  tahunDari.value = modelData[0];
  tahunSampai.value = modelData[modelData.length - 1];
  store.periodeTahun = modelData;
  isLoading.value = true;
  await fetchDataAnggaran();
  isLoading.value = false;
}
const toggleRow = (itemId: number) => {
  console.log(yearRangePicked.value);
  if (isRowOpen(itemId)) {
    isRowTabOpen.value = isRowTabOpen.value.filter(
      (id) => id !== itemId
    );
  } else {
    isRowTabOpen.value.push(itemId);
  }
};
const isRowOpen = (itemId: number) => {
  return isRowTabOpen.value.includes(itemId);
};
const fetchPeriodeTahun = async () => {
  try {
    const response: any = await lamanService.getPeriodeTahun();
    periodeTahun.value = response.data;
    tahunDari.value = tahunBerjalan - 5;
    tahunSampai.value = tahunBerjalan;
    yearRangePicked.value = [tahunDari.value, tahunSampai.value];
    yearRange.value = [periodeTahun.value[0].tahun, periodeTahun.value[periodeTahun.value.length - 1].tahun];
    store.periodeTahun = [periodeTahun.value[0].tahun, periodeTahun.value[periodeTahun.value.length - 1].tahun];
  } catch (error) {
    console.error('Fetch Tahun Anggaran Error : ', error);
  }
}
const fetchDataAnggaran = async () => {
  try {
    isLoading.value = true;
    const response: any = await lamanService.getDataAnggaran(searchQ.value, tahunSampai.value, tahunDari.value);
    const filteredResponse = response.data.filter((val: any) => val.pembangkits.length > 0);
    dataAnggaran.value = filteredResponse;
    isLoading.value = false;
  } catch (error) {
    console.error('Fetch Data Anggaran Error : ', error);
  }
}
const handleExport = async () => {
  try {
    isLoading.value = true;
    const response: any = await lamanService.downloadExcelCAPEXOPEX(yearRangePicked.value[0], yearRangePicked.value[1], searchQ.value.toUpperCase(), 'all');
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Laman Data - CAPEX OPEX - ${yearRangePicked.value[0]}_${yearRangePicked.value[1]}.xlsx`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    isLoading.value = false;
  } catch (error) {
    console.error('Handle Download Template Rekap Error : ', error);
  }
}

onMounted(async () => {
  isLoading.value = true;
  AOS.init();
  await fetchPeriodeTahun();
  await fetchDataAnggaran();
  console.log(dataAnggaran.value);
  isLoading.value = false;
})
</script>

<style scoped>
td {
  padding: 0.85rem;
}

tr td#pembangkit {
  padding-left: 3rem;
}

tr td#mesin {
  padding-left: 5.1rem;
}

.date-picker {
  width: 10rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
}
</style>
