<template>
  <Loading v-if="isLoading" />
  <div class="p-6 space-y-5 bg-white rounded-lg">
    <SearchBox class="w-72" v-model="searchQuery" @on-click="handleSearch" @on-key-enter="handleSearch"
      @on-input="handleSearch" />
    <div class="whitespace-nowrap">
      <ul class="flex w-full overflow-x-auto">
        <li v-for="(pengelola, pengelolaIndex) in pengelolaData" :key="pengelolaIndex"
          class="p-2 ml-5 text-xs font-bold text-gray-400 border border-gray-300 rounded-lg cursor-pointer w-fit hover:text-primaryColor first:ml-0 hover:border-primaryColor active:bg-primaryColor active:bg-opacity-20"
          :class="{ selected: selectedPengelola.includes(pengelola.kode_pengelola) || kodePengelola === pengelola.kode_pengelola }"
          @click="changeSelectedPengelola(pengelola.kode_pengelola)">
          {{ pengelola.pengelola }}
          <template
            v-if="selectedPengelola.includes(pengelola.kode_pengelola) || kodePengelola === pengelola.kode_pengelola">
            <div class="absolute bottom-0 right-0">
              <svg width="62" height="18" viewBox="0 0 62 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle opacity="0.15" cx="59.5" cy="59.5" r="59.5" fill="#80C1CD" />
              </svg>
            </div>
            <div class="absolute bottom-0 right-0">
              <svg width="22" height="40" viewBox="0 0 22 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle opacity="0.15" cx="59.5" cy="41.5" r="59.5" fill="#80C1CD" />
              </svg>
            </div>
          </template>
        </li>
      </ul>
    </div>
    <TableComponent>
      <template v-slot:table-header>
        <tr>
          <th scope="col">No</th>
          <th scope="col" class="text-left">Unit Induk / Subholding / <br>Anak Perusahaan</th>
          <th scope="col" class="text-left">Unit Sentral</th>
          <th scope="col" class="text-left">Unit Mesin</th>
          <th scope="col" class="text-center">Total Daya Terpasang (MW)</th>
        </tr>
      </template>
      <template v-slot:table-body v-if="mesinBelumTerinput.length === 0">
        <tr>
          <td colspan="5">
            <Empty :subtitle="'Data tidak tersedia, silahkan cari unit mesin lain'" />
          </td>
        </tr>
      </template>
      <template v-slot:table-body v-else>
        <tr v-for="(mesinBelumTerinputItem, mesinBelumTerinputIndex) in mesinBelumTerinput"
          :key="mesinBelumTerinputIndex" class="border">
          <td class="text-center">{{ mesinBelumTerinputIndex + 1 }}</td>
          <td>{{ mesinBelumTerinputItem.pengelola }}</td>
          <td>
            {{ mesinBelumTerinputItem.sentral }}
          </td>
          <td>
            {{ mesinBelumTerinputItem.mesin }}
          </td>
          <td class="text-center">{{ globalFormat.formatRupiah(mesinBelumTerinputItem.daya_terpasang) }}</td>
        </tr>
      </template>
    </TableComponent>
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center space-x-2 text-sm">
        <span>Menampilkan</span>
        <select v-model.number="navigation.limit" name="" id=""
          class="text-sm text-gray-500 border-gray-300 rounded-lg cursor-pointer" @change="changePageLimit">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        <span>dari <span class="font-bold">{{ navigation.totalRecords }}</span> data</span>
      </div>
      <ul class="flex items-center space-x-3">
        <li>
          <button @click="goToPrevious" :disabled="navigation.currentPage === 1"
            :class="{ 'text-gray-500': navigation.currentPage === 1 }"
            class="block px-2 py-2 ml-0 duration-300 bg-white text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
            <span class="sr-only">Previous</span>
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </button>
        </li>
        <li id="pagination" v-for="(item, index) in generatePageList" :key="index"
          class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
          :class="{ selected: item === navigation.currentPage, disabled: item === '...' }" @click="goToPage(item)">
          {{ item }}
        </li>
        <li>
          <button @click="goToNext" :disabled="navigation.currentPage === navigation.totalPages"
            class="block px-2 py-2 ml-0 duration-300 bg-white text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
            <span class="sr-only">Next</span>
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import LamanService from "@/services/laman-service";
const lamanService = new LamanService();
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import SearchBox from "@/components/ui/SearchBox.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import TableComponent from "@/components/ui/Table.vue";
import Empty from "@/components/ui/EmptyData.vue";

const isLoading = ref(false);
const kodePengelola = ref<any>('ALL');
const mesinBelumTerinput = ref<any[]>([]);
const searchQuery = ref("");
const selectedPengelola = ref<string[]>([]);
const pengelolaData = ref<any[]>([]);
const navigation = ref<{
  currentPage: number,
  totalPages: number,
  totalRecords: number,
  limit: number
}>({
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10
});

const fetchMesinBelumInput = async () => {
  isLoading.value = true;
  try {
    const response: any = await lamanService.getMesinBelumInput(navigation.value.currentPage, navigation.value.limit, selectedPengelola.value, searchQuery.value);
    mesinBelumTerinput.value = response.data;
    navigation.value.totalRecords = response.meta.totalRecords;
    navigation.value.totalPages = response.meta.totalPages;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async () => {
  await fetchMesinBelumInput();
};

const fetchPengelolaData = async () => {
  try {
    isLoading.value = true;
    const response: any = await lamanService.getPengelolaData();
    pengelolaData.value = response.data;
    pengelolaData.value.push({
      id_pengelola: 0,
      kode_pengelola: "ALL",
      pengelola: "ALL"
    });
    pengelolaData.value.reverse();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
const changeSelectedPengelola = async (pengelola: any) => {
  isLoading.value = true;
  if (pengelola === 'ALL') {
    if (kodePengelola.value !== 'ALL') {
      kodePengelola.value = pengelola;
      selectedPengelola.value = [];
      await fetchMesinBelumInput();
    }
  } else {
    if (!selectedPengelola.value.includes(pengelola)) {
      selectedPengelola.value.push(pengelola);
      kodePengelola.value = null;
      await fetchMesinBelumInput();
    } else {
      if (selectedPengelola.value.length === 1) {
        kodePengelola.value = 'ALL';
      }
      const pengelolaIndex = selectedPengelola.value.indexOf(pengelola);
      selectedPengelola.value.splice(pengelolaIndex, 1);
      await fetchMesinBelumInput();
    }
  }
  isLoading.value = false;
}
const generatePageList = computed(() => {
  const pageList = [];
  const maxPages = 5;
  if (navigation.value.totalPages <= maxPages) {
    for (let i = 1; i <= navigation.value.totalPages; i++) {
      pageList.push(i);
    }
  } else {
    if (navigation.value.currentPage <= 3) {
      for (let i = 1; i <= Math.min(navigation.value.totalPages, maxPages - 1); i++) {
        pageList.push(i);
      }
      if (navigation.value.totalPages > maxPages) {
        pageList.push('...');
        pageList.push(navigation.value.totalPages);
      }
    } else if (navigation.value.currentPage >= navigation.value.totalPages - 2) {
      pageList.push(1);
      pageList.push('...');
      for (let i = navigation.value.totalPages - (maxPages - 2); i <= navigation.value.totalPages; i++) {
        pageList.push(i);
      }
    } else {
      pageList.push(1);
      pageList.push('...');
      for (let i = navigation.value.currentPage - 1; i <= navigation.value.currentPage + 1; i++) {
        pageList.push(i);
      }
      pageList.push('...');
      pageList.push(navigation.value.totalPages);
    }
  }
  return pageList;
});

const changePageLimit = async () => {
  isLoading.value = true;
  navigation.value.currentPage = 1;
  await fetchMesinBelumInput();
  isLoading.value = false;
};
const goToPage = async (page: any) => {
  try {
    isLoading.value = true;
    navigation.value.currentPage = page;
    await fetchMesinBelumInput();
  } catch (error) {
    console.error('Go To Page Error : ' + error);
  }
};

const goToPrevious = () => {
  goToPage(navigation.value.currentPage - 1);
};

const goToNext = () => {
  goToPage(navigation.value.currentPage + 1);
};

onMounted(() => {
  fetchMesinBelumInput();
  fetchPengelolaData();
});
</script>

<style scoped>
#button-hover-putih:hover svg {
  fill: white;
}

#button-hover-putih:hover svg path {
  fill: white;
}

td {
  padding: 1rem;
}

ul li#pagination.selected {
  background-color: #0099AD;
  border-radius: 6px;
  color: white;
  transition: 300ms;
}

ul li.selected {
  color: #0099AD;
  border-color: #0099AD;
}

ul li.disabled {
  pointer-events: none;
  cursor: not-allowed;
  color: #D1D1DB;
}
</style>