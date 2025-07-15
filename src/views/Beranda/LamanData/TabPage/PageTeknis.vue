<template>
  <Loading v-if="isLoading" />
  <div class="space-y-5">
    <div class="justify-between md:flex">
      <SearchBox class="w-60" placeholder="Cari sentral..." @on-input="fetchDataTeknis" @on-key-enter="fetchDataTeknis"
        @on-click-submit="fetchDataTeknis" v-model="searchQ" />
      <div class="flex items-center space-x-3">
        <div class="flex flex-row items-center">
          <p class="mr-3 font-semibold text-labelColor">Tahun</p>
          <VueDatePicker v-if="periodeTahun" class="date-picker" teleport :model-value="yearRangePicked"
            @update:model-value="handleYearRangePicked" :year-range="yearRange" :clearable="false" year-picker range />
          <ShimmerLoading class="w-36 h-11" v-else />
        </div>
        <div class="flex items-center justify-center">
          <div class="relative text-lg">
            <button id="button-hover-putih"
              class="text-primaryColor hover:text-white bg-white border border-[#0099AD] hover:bg-hoverColor hover:border-hoverColor rounded-lg text-sm p-3 flex justify-center items-center duration-300"
              @click="isOptionsExpanded = !isOptionsExpanded">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.99996 1.33366C3.42263 1.33366 1.33329 3.423 1.33329 6.00033C1.33329 8.57765 3.42263 10.667 5.99996 10.667C8.57729 10.667 10.6666 8.57765 10.6666 6.00033C10.6666 3.423 8.57729 1.33366 5.99996 1.33366ZM0.166626 6.00033C0.166626 2.77866 2.7783 0.166992 5.99996 0.166992C9.22162 0.166992 11.8333 2.77866 11.8333 6.00033C11.8333 9.22199 9.22162 11.8337 5.99996 11.8337C2.7783 11.8337 0.166626 9.22199 0.166626 6.00033ZM5.99996 3.66699C6.32213 3.66699 6.58329 3.92816 6.58329 4.25033V6.43783C6.58329 6.75999 6.32213 7.02116 5.99996 7.02116C5.67779 7.02116 5.41663 6.75999 5.41663 6.43783V4.25033C5.41663 3.92816 5.67779 3.66699 5.99996 3.66699ZM5.41663 8.18783C5.41663 7.86566 5.67779 7.60449 5.99996 7.60449H6.00433C6.3265 7.60449 6.58767 7.86566 6.58767 8.18783V8.1922C6.58767 8.51437 6.3265 8.77553 6.00433 8.77553H5.99996C5.67779 8.77553 5.41663 8.51437 5.41663 8.1922V8.18783Z"
                  fill="#0099AD" />
              </svg>
              <span class="ml-2 font-semibold">Info SFC</span>
            </button>
            <Transition enter-active-class="transition duration-500 transform ease-custom"
              enter-class="scale-y-0 -translate-y-1/2 opacity-0" enter-to-class="scale-y-100 translate-y-0 opacity-100"
              leave-active-class="transition duration-300 transform ease-custom"
              leave-class="scale-y-100 translate-y-0 opacity-100" leave-to-class="scale-y-0 -translate-y-1/2 opacity-0">
              <div v-show="isOptionsExpanded"
                class="z-[40] p-1.5 absolute w-[500px] h-80 right-0 my-3 border border-gray-300 bg-white divide-y rounded-lg shadow-lg overflow-auto">
                <div class="flex justify-between mb-2">
                  <h3 class="p-2 text-sm font-semibold">
                    Specific Fuel Consumption (SFC)
                  </h3>
                </div>
                <div class="block max-h-[43rem] overflow-y-auto rounded-lg bg-white scrollbar-hide mx-2">
                  <table class="w-full text-sm text-left text-gray-500">
                    <thead class="bg-white border-r border-l text-xs text-[#0099AD] sticky top-0">
                      <tr>
                        <th scope="col" class="px-3 py-4 font-semibold">
                          Kategori Pembangkit
                        </th>
                        <th scope="col" class="font-semibold ">
                          Jenis Bahan Bakar
                        </th>
                        <th scope="col" class="font-semibold text-center">Satuan SFC</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, i) in dataSFC" :key="i" class="text-xs">
                      <tr class="text-gray-900 border ">
                        <td class="px-1 py-2">{{ item.jenis_kit }}</td>
                        <td class="px-1 py-2">{{ item.bahan_bakar }}</td>
                        <td class="px-1 py-2 text-center">{{ item.satuan_sfc ? item.satuan_sfc : '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Transition>
          </div>
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
          <th scope="col" class="border-r">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Unit Induk / Sentral / Mesin</h1>
            </div>
          </th>
          <th scope="col" class="border-r">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Jenis Pembangkit</h1>
            </div>
          </th>
          <th scope="col" class="border-r">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Tahun</h1>
            </div>
          </th>
          <th scope="col" class="border-r">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">NCF (%)</h1>
            </div>
          </th>
          <th scope="col" class="border-r">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">EAF (%)</h1>
            </div>
          </th>
          <th scope="col" class="border-r text-start">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">NPHR <br>(kcal/kWh)</h1>
            </div>
          </th>
          <th scope="col" class="border-r text-start">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">SFC</h1>
            </div>
          </th>
          <th scope="col" class="border-r text-start">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Produksi <br>Netto (MWh)</h1>
            </div>
          </th>
          <th scope="col" class="text-start">
            <div class="flex flex-row items-center justify-center space-x-5">
              <h1 class="font-semibold">Status Unit <br>Mesin</h1>
            </div>
          </th>
        </tr>
      </template>
      <template v-slot:table-body v-if="teknisData.length === 0">
        <tr class="text-xs text-gray-900 border-b">
          <td colspan="9">
            <Empty />
          </td>
        </tr>
      </template>
      <template v-slot:table-body v-else>
        <template v-for="pengelola in teknisData" :key="pengelola.kode_pengelola">
          <tr class="text-xs bg-strokeColor bg-opacity-30 hover:bg-strokeColor hover:bg-opacity-60"
            :class="{ 'hover:bg-opacity-30': pengelola.pembangkits.length === 0, 'cursor-pointer': pengelola.pembangkits.length !== 0 }"
            @click="toggleUp(pengelola.kode_pengelola)">
            <td :colspan="100">
              <div class="flex flex-row items-center space-x-2" :class="{ 'ml-8': pengelola.pembangkits.length === 0 }">
                <svg v-if="!isUpOpen(pengelola.kode_pengelola) && pengelola.pembangkits.length !== 0" width="24"
                  height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="24" y="24" width="24" height="24" rx="6" transform="rotate(-180 24 24)" fill="#E5E7E9" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                    fill="#333333" />
                </svg>
                <svg v-else-if="pengelola.pembangkits.length !== 0" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="#E5E7E9" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                    fill="#333333" />
                </svg>
                <span>{{ pengelola.pengelola }}</span>
              </div>
            </td>
          </tr>
          <template v-if="isUpOpen(pengelola.kode_pengelola)" v-for="pembangkit in pengelola.pembangkits"
            :key="pembangkit.uuid_sentral">
            <tr class="text-xs cursor-pointer bg-strokeColor bg-opacity-20 hover:bg-opacity-60"
              @click="togglePembangkit(pembangkit.uuid_sentral)">
              <td id="pembangkit">
                <div class="flex flex-row items-center space-x-2">
                  <svg v-if="!isPembangkitOpen(pembangkit.uuid_sentral) && pembangkit.mesins.length !== 0" width="24"
                    height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="24" y="24" width="24" height="24" rx="6" transform="rotate(-180 24 24)" fill="#E5E7E9" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                      fill="#333333" />
                  </svg>
                  <svg v-else-if="isPembangkitOpen(pembangkit.uuid_sentral) && pembangkit.mesins.length !== 0"
                    width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="6" fill="#E5E7E9" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                      fill="#333333" />
                  </svg>
                  <span>{{ pembangkit.sentral }}</span>
                </div>
              </td>
              <td class="text-center">{{ pembangkit.kode_jenis_pembangkit }}</td>
              <td class="text-center"></td>
              <td class="text-end"></td>
              <td class="text-end"></td>
              <td class="text-end"></td>
              <td class="text-end"></td>
              <td class="text-end"></td>
              <td class="text-center"></td>
            </tr>
            <template v-if="isPembangkitOpen(pembangkit.uuid_sentral) && isUpOpen(pengelola.kode_pengelola)"
              v-for="mesin in pembangkit.mesins" :key="mesin.uuid_mesin">
              <tr class="text-xs bg-strokeColor bg-opacity-10">
                <td id="mesin">{{ mesin.mesin }}</td>
                <td class="text-center">{{ mesin.kode_jenis_pembangkit }}</td>
                <td class="text-center"></td>
                <td class="text-end"></td>
                <td class="text-end"></td>
                <td class="text-end"></td>
                <td class="text-end"></td>
                <td class="text-end"></td>
                <td class="text-end"></td>
              </tr>
              <template v-for="(teknisItem, transCostIndex) in mesin.detail_teknis" :key="transCostIndex">
                <tr class="text-xs">
                  <td></td>
                  <td></td>
                  <td class="text-center">{{ teknisItem.tahun }}</td>
                  <td class="text-end">{{ globalFormat.formatRupiah(teknisItem.net_capacity_factor) }}</td>
                  <td class="text-end">{{ globalFormat.formatRupiah(teknisItem.eaf) }}</td>
                  <td class="text-end">{{ globalFormat.formatRupiah(teknisItem.nphr) }}</td>
                  <td class="text-end">{{ globalFormat.formatRupiah(teknisItem.sfc) }}</td>
                  <td class="text-end">{{ globalFormat.formatRupiah(teknisItem.produksi_netto) }}</td>
                  <td class="text-start">{{ teknisItem.kondisi_unit }}</td>
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
import { ref, watch } from "vue";
import { useLamanDataTabStore } from "@/store/storeLamanDataTab";
const store = useLamanDataTabStore();
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import SearchBox from "@/components/ui/SearchBox.vue";
import Empty from "@/components/ui/EmptyData.vue";
import ButtonComponent from "@/components/ui/Button.vue";
import TableComponent from "@/components/ui/Table.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import LamanService from "@/services/laman-service";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
import { isNull } from "node:util";

const lamanService = new LamanService();
const teknisData = ref<PengelolaItem[]>([]);
const isUpTabOpen = ref<string[]>([]);
const isPembangkitTabOpen = ref<number[]>([]);
const dataSFC = ref<ItemSFC[]>([]);
const isLoading = ref<boolean>(false);
const currentPage = ref(1);
const totalPages = ref(0);
const pageLimit = ref(10);
const totalRecords = ref();
const yearRangePicked = ref<number[]>([]);
const yearRange = ref<number[]>([]);
const tahunDari = ref<any>();
const tahunSampai = ref<any>();
const periodeTahun = ref<Array<any>>([]);
const searchQ = ref<string>("");
const tahunBerjalan = new Date().getFullYear();
const isOptionsExpanded = ref(false);

interface ItemSFC {
  jenis_kit: string
  bahan_bakar: string
  satuan_sfc: string
}
interface PengelolaItem {
  meta: any
  data: any
  id_pengelola: number
  kode_pengelola: string
  pengelola: string
  sfc: number
  pembangkits: PembangkitItem[]
}
interface PembangkitItem {
  uuid_sentral: number
  kode_sentral: string
  sentral: string
  mesins: any
  kode_jenis_pembangkit: string
  net_capacity_factor: any
  eaf: any
  sfc: number
  nphr: any
  produksi_netto: any
  kondisi_unit: any
}

const handleYearRangePicked = async (modelData: Array<number>) => {
  yearRangePicked.value = modelData;
  tahunDari.value = modelData[0];
  tahunSampai.value = modelData[1];
  isLoading.value = true;
  await fetchDataTeknis();
  isLoading.value = false;
}
const fetchPeriodeTahun = async () => {
  try {
    const response: any = await lamanService.getPeriodeTahun();
    periodeTahun.value = response.data;
    tahunDari.value = tahunBerjalan - 5;
    tahunSampai.value = tahunBerjalan;
    yearRangePicked.value = [tahunDari.value, tahunSampai.value];
    yearRange.value = [periodeTahun.value[0].tahun, periodeTahun.value[periodeTahun.value.length - 1].tahun];
  } catch (error) {
    console.error('Fetch Tahun Anggaran Error : ' + error);
  }
}

const fetchDataTeknis = async () => {
  try {
    isLoading.value = true;
    const response: PengelolaItem = await lamanService.getDataTeknis(searchQ.value, currentPage.value, pageLimit.value, tahunDari.value, tahunSampai.value);
    const { data, meta } = response;
    const filteredResponse = data.filter((val: any) => val.pembangkits.length > 0);
    teknisData.value = filteredResponse;
    totalPages.value = meta.totalPages;
    totalRecords.value = meta.totalRecords;
    pageLimit.value = meta.limit;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};
const fetchListTahun = async () => {
  try {
    const response: any = await lamanService.getListTahun();
    periodeTahun.value = [response.data[0].tahun, response.data[response.data.length - 1].tahun];
  } catch (error) {
    console.error('Fetch Tahun Terakhir Realisasi Error : ' + error);
  }
}
const toggleUp = (itemKode: string) => {
  if (isUpOpen(itemKode)) {
    isUpTabOpen.value = isUpTabOpen.value.filter((Kode) => Kode !== itemKode);
  } else {
    isUpTabOpen.value.push(itemKode);
  }
};
const isUpOpen = (itemKode: string) => {
  return isUpTabOpen.value.includes(itemKode);
};
const togglePembangkit = (itemId: number) => {
  if (isPembangkitOpen(itemId)) {
    isPembangkitTabOpen.value = isPembangkitTabOpen.value.filter(
      (Id) => Id !== itemId
    );
  } else {
    isPembangkitTabOpen.value.push(itemId);
  }
}
const isPembangkitOpen = (itemId: number) => {
  return isPembangkitTabOpen.value.includes(itemId);
};

const handleExport = async () => {
  try {
    isLoading.value = true;
    const response: any = await lamanService.downloadExcelTeknis(yearRangePicked.value[0], yearRangePicked.value[1], searchQ.value.toUpperCase());
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Laman Data - Teknis - ${yearRangePicked.value[0]}_${yearRangePicked.value[1]}.xlsx`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a");
    link.href = url
    link.setAttribute('download', fileName);
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link)
    isLoading.value = false;
  } catch (error) {
    console.error('Handle Download Template Rekap Error : ' + error)
  };
}

watch(store, async (store) => {
  if (store.currentTab === 'Teknis') {
    if (dataSFC.value.length !== 0 && teknisData.value.length !== 0) {
      return 0;
    }
    isLoading.value = true;
    try {
      await lamanService.getInfoSFC().then((res: any) => {
        dataSFC.value = res.data == null ? [] : res.data;
      });
      await fetchPeriodeTahun();
      await fetchDataTeknis();
      await fetchListTahun();
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
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

#button-hover-putih:hover svg {
  fill: white;
}

#button-hover-putih:hover svg path {
  fill: white;
}

.date-picker {
  width: 10rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
}
</style>
