<template>
  <Loading v-if="isLoading" />
  <ModalWrapper :width="'w-[900px]'" :height="'h-auto'" :show-modal="isShowDetail" @on-escape="isShowDetail = false">
    <div class="flex flex-col space-y-5">
      <div class="flex items-center justify-between">
        <p class="text-lg font-semibold text-primaryTextColor">Detail Akses</p>
        <button @click="isShowDetail = false">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 16.5L16.5 1.5M1.5 1.5L16.5 16.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-[5px] h-12 rounded-full bg-primaryColor"></div>
        <div class="flex flex-col space-y-1.5 text-primaryTextColor">
          <p class="text-base font-medium">Role : Super Admin</p>
          <p class="text-sm font-medium">Level : Admin</p>
        </div>
      </div>
      <div class="flex flex-col space-y-3">
        <ul class="flex items-center space-x-5 overflow-auto whitespace-nowrap">
          <li v-for="(listItem, listIndex) in dummyMenu" :key="listIndex" class="text-sm font-semibold cursor-pointer"
            @click="selectedTabMenu = listItem"
            :class="{ 'border-b': selectedTabMenu === listItem, 'border-b-[3px]': selectedTabMenu === listItem, 'border-primaryColor': selectedTabMenu === listItem, 'pb-1': selectedTabMenu === listItem, 'text-primaryColor': selectedTabMenu === listItem, 'text-textDisabledColor': selectedTabMenu !== listItem }">
            {{ listItem }}</li>
        </ul>
        <Table>
          <template v-slot:table-header>
            <tr>
              <th class="text-sm text-primaryColor text-start">Fitur</th>
              <th class="text-sm text-primaryColor">Akses</th>
            </tr>
          </template>
          <template v-slot:table-body>
            <tr v-for="(listItem, listIndex) in dummyFeature" class="text-primaryTextColor" :key="listIndex">
              <td class="text-start">{{ listItem.feature }}</td>
              <td class="flex justify-center">
                <IconRoundedChecked v-if="listItem.access" />
                <IconRoundedClose v-else />
              </td>
            </tr>
          </template>
        </Table>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 text-sm text-primaryTextColor">
          <span>Menampilkan</span>
          <select v-model="navigation.limit" name="" id=""
            class="text-sm text-gray-500 border-gray-300 rounded-lg cursor-pointer" @change="changePageLimit($event)">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <span>dari <span class="font-bold">{{ dummyData.length }}</span> data</span>
        </div>
        <ul class="flex items-center space-x-3">
          <li>
            <button @click="goToPrevious" :disabled="navigation.page === 1"
              :class="{ 'text-gray-500': navigation.page === 1 }"
              class="block px-2 py-2 ml-0 duration-300 bg-white disabled:hover:cursor-not-allowed text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
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
            :class="{ selected: item === navigation.page, disabled: item === '...' }"
            class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
            @click="goToPage(item)">
            {{ item }}
          </li>
          <li>
            <button @click="goToNext" :disabled="navigation.page === navigation.totalPages"
              class="block px-2 py-2 ml-0 duration-300 bg-white disabled:hover:cursor-not-allowed text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
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
  </ModalWrapper>
  <div class="p-6 space-y-5 bg-white rounded-lg">
    <div class="flex items-center space-x-2">
      <div class="w-[5px] h-10 rounded-full bg-primaryColor"></div>
      <p class="text-lg font-semibold">Informasi Role, Level, dan Hak Akses</p>
    </div>
    <Table>
      <template v-slot:table-header>
        <tr>
          <th>No</th>
          <th>Role</th>
          <th>Level</th>
          <th>Detail Akses</th>
        </tr>
      </template>
      <template v-slot:table-body>
        <tr v-for="(listItem, listIndex) in dummyData" :key="listIndex">
          <td class="text-center">{{ listItem.id }}</td>
          <td class="text-center">{{ listItem.role }}</td>
          <td class="text-center">{{ listItem.level }}</td>
          <td class="flex justify-center">
            <button class="p-1.5 rounded-lg bg-opacity-10 bg-primaryColor cursor-pointer" @click="isShowDetail = true">
              <IconDetailAkses />
            </button>
          </td>
        </tr>
      </template>
    </Table>
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2 text-sm">
        <span>Menampilkan</span>
        <select v-model="navigation.limit" name="" id=""
          class="text-sm text-gray-500 border-gray-300 rounded-lg cursor-pointer" @change="changePageLimit($event)">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        <span>dari <span class="font-bold">{{ dummyData.length }}</span> data</span>
      </div>
      <ul class="flex items-center space-x-3">
        <li>
          <button @click="goToPrevious" :disabled="navigation.page === 1"
            :class="{ 'text-gray-500': navigation.page === 1 }"
            class="block px-2 py-2 ml-0 duration-300 bg-white disabled:hover:cursor-not-allowed text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
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
          :class="{ selected: item === navigation.page, disabled: item === '...' }"
          class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
          @click="goToPage(item)">
          {{ item }}
        </li>
        <li>
          <button @click="goToNext" :disabled="navigation.page === navigation.totalPages"
            class="block px-2 py-2 ml-0 duration-300 bg-white disabled:hover:cursor-not-allowed text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
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
import { onMounted, ref, computed } from 'vue';
import RoleService from '@/services/role-service';
const roleService = new RoleService();
import Loading from '@/components/ui/LoadingSpinner.vue';
import IconDetailAkses from '@/components/icons/IconDetailAkses.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import Table from '@/components/ui/Table.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import IconRoundedChecked from '@/components/icons/IconRoundedChecked.vue';
import IconRoundedClose from '@/components/icons/IconRoundedClose.vue';

const isLoading = ref<boolean>(false);
const navigation = ref<{
  page: number,
  totalPages: number,
  totalRecords: number,
  limit: number
}>({
  page: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10
});
const selectedTabMenu = ref<string>('Peta Sebaran');
const isShowDetail = ref<boolean>(false);
const dummyFeature = [{
  id: 1,
  feature: 'Filter',
  access: false
},
{
  id: 2,
  feature: 'Filter - Pengelola',
  access: true
},
{
  id: 3,
  feature: 'Filter - Pembina',
  access: false
},
{
  id: 4,
  feature: 'Export Data',
  access: true
},
{
  id: 5,
  feature: 'Input Asumsi Parameter',
  access: true
},
]
const dummyMenu = ['Peta Sebaran', 'Laman Utama', 'Laman Data', 'Laman Analitik', 'Grafik', 'Rekap Kertas Kerja', 'Persetujuan', 'Unit Sentral', 'Parameter', 'Pengguna', 'Role', 'Log Aktivitas']
const dummyData = [{
  id: 1,
  role: 'Super Admin',
  level: 'Admin'
},
{
  id: 2,
  role: 'Super Admin',
  level: 'Pusat'
},
{
  id: 3,
  role: 'Monitoring',
  level: 'Pusat'
},
{
  id: 4,
  role: 'Approver',
  level: 'Pengelola'
},
{
  id: 5,
  role: 'Monitoring',
  level: 'Pengelola'
},
{
  id: 6,
  role: 'Approver',
  level: 'Pembina'
},
{
  id: 7,
  role: 'Monitoring',
  level: 'Pembina'
},
{
  id: 8,
  role: 'Input',
  level: 'Pembina'
},
{
  id: 9,
  role: 'Staff',
  level: 'Sentral'
}];

const fetchRoles = async () => {
  try {
    isLoading.value = true;
  } catch (error) {
    console.error('Gagal Fetching Data Role', error);
  } finally {
    isLoading.value = false;
  }
}

const goToPage = (page: any) => {
  navigation.value.page = page;
  fetchRoles();
};
const goToPrevious = () => {
  if (navigation.value.page > 1) {
    goToPage(navigation.value.page - 1);
  }
};
const goToNext = () => {
  if (navigation.value.page < navigation.value.totalPages) {
    goToPage(navigation.value.page + 1);
  }
};

const generatePageList = computed(() => {
  const pageList = [];
  const maxPages = 5;

  if (navigation.value.totalPages <= maxPages) {
    for (let i = 1; i <= navigation.value.totalPages; i++) {
      pageList.push(i);
    }
  } else {
    if (navigation.value.page <= 3) {
      for (let i = 1; i <= Math.min(navigation.value.totalPages, maxPages - 1); i++) {
        pageList.push(i);
      }
      if (navigation.value.totalPages > maxPages) {
        pageList.push('...');
        pageList.push(navigation.value.totalPages);
      }
    } else if (navigation.value.page >= navigation.value.totalPages - 2) {
      pageList.push(1);
      pageList.push('...');
      for (let i = navigation.value.totalPages - (maxPages - 2); i <= navigation.value.totalPages; i++) {
        pageList.push(i);
      }
    } else {
      pageList.push(1);
      pageList.push('...');
      for (let i = navigation.value.page - 1; i <= navigation.value.page + 1; i++) {
        pageList.push(i);
      }
      pageList.push('...');
      pageList.push(navigation.value.totalPages);
    }
  }
  return pageList;
});

const changePageLimit = (event: any) => {
  navigation.value.limit = parseInt(event.target.value);
  navigation.value.page = 1;
  fetchRoles();
};

onMounted(() => {
  fetchRoles();
});
</script>

<style scoped>
td {
  padding: 0.85rem;
}

ul li#pagination.selected {
  background-color: #0099AD;
  border-radius: 6px;
  color: white;
  transition: 300ms;
}

:disabled {
  background-color: #F5F5F5;
  cursor: not-allowed;
}

ul li.disabled {
  pointer-events: none;
  cursor: not-allowed;
  color: #D1D1DB;
}
</style>