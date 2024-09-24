<template>
  <Loading v-if="isLoading" />
  <div class="p-6 space-y-5 bg-white rounded-lg">
    <div class="flex items-center justify-between">
      <div class="flex space-x-4">
        <SearchBox placeholder="Cari aktivitas..." class="w-72" @on-input="handleSearch"
          v-model="filterValue.searchValue" />
        <div class="relative flex flex-col" ref="dropdownContainer">
          <button
            class="relative flex items-center h-auto px-3 py-[7px] text-base text-gray-400 duration-300 border border-gray-300 rounded-lg hover:text-white hover:border-primaryColor hover:bg-primaryColor"
            id="hover-button" @click="showModalFilter = !showModalFilter">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <path
                d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
                fill="#0099AD" />
            </svg>
            Filter
            <div v-if="filterValue.selectedActivity.length"
              class="absolute z-10 border-2 border-[#FFE5E6] w-2.5 h-2.5 rounded-full right-0.5 top-0.5  bg-warningColor">
            </div>
          </button>
          <div v-if="showModalFilter"
            class="absolute left-0 w-56 overflow-y-auto bg-white border rounded-lg shadow-md top-11 max-h-60">
            <button v-for="(itemData, itemIndex) in filterData.activity" @click="processValue(itemData)"
              class="flex items-center w-full p-3 space-x-2 border-b cursor-pointer">
              <input type="checkbox" @change="handleChangeFilter" v-model="filterValue.selectedActivity"
                :value="itemData" class="border-2 border- rounded-[3px] cursor-pointer border-[#E5E7E9]">
              <p class="text-sm text-primaryTextColor">{{ itemData }}</p>
            </button>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <label for="" class="text-sm font-semibold text-labelColor">Periode</label>
        <VueDatePicker @update:model-value="handleChangeDate" v-model="filterValue.selectedDate" class="date-picker"
          :enable-time-picker="false" range :format="formatCalendar" :clearable="false" />
      </div>
    </div>
    <div class="flex items-center space-x-3" v-if="filterValue.selectedActivity.length">
      <div v-for="(itemData, itemIndex) in filterValue.selectedActivity"
        class="flex items-center px-2 py-1 space-x-1.5 border rounded-full bg-opacity-10 border-primaryColor w-fit bg-primaryColor">
        <button @click="removeValue(itemData)">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M1.43306 1.43306C1.67714 1.18898 2.07286 1.18898 2.31694 1.43306L5 4.11612L7.68306 1.43306C7.92714 1.18898 8.32286 1.18898 8.56694 1.43306C8.81102 1.67714 8.81102 2.07286 8.56694 2.31694L5.88388 5L8.56694 7.68306C8.81102 7.92714 8.81102 8.32286 8.56694 8.56694C8.32286 8.81102 7.92714 8.81102 7.68306 8.56694L5 5.88388L2.31694 8.56694C2.07286 8.81102 1.67714 8.81102 1.43306 8.56694C1.18898 8.32286 1.18898 7.92714 1.43306 7.68306L4.11612 5L1.43306 2.31694C1.18898 2.07286 1.18898 1.67714 1.43306 1.43306Z"
              fill="#0099AD" />
          </svg>
        </button>
        <p class="text-xs font-semibold text-primaryColor">{{ itemData }}</p>
      </div>
    </div>
    <div class="flex flex-col space-y-5">
      <div class="flex items-center space-x-2">
        <div class="w-1 h-7 rounded-full bg-[#0099AD]"></div>
        <p class="text-lg font-semibold">Log Aktivitas</p>
      </div>
      <!-- Konten -->
      <div class="flex flex-col space-y-8">
        <div v-for="(itemData, itemIndex) in logData" class="flex space-x-3 text-sm"
          :class="{ 'items-center': itemData.action === 'Login' || itemData.action === 'Logout' || itemData.action === 'Unduh Data' || itemData.action === 'Tambah' || itemData.action === 'Setujui Data' || itemData.action === 'Kirim Data' }">
          <div class="flex flex-col flex-shrink-0 text-xs">
            <p class="text-textFieldColor text-end" v-html="dateFormat.formatDate(itemData.created_at)"></p>
          </div>
          <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full"
            :class="{ 'bg-[#EBF6FF]': itemData.action === 'Login', 'bg-[#FCEEF2]': itemData.action === 'Logout', 'bg-[#E7F1FD]': itemData.action === 'Draft Data', 'bg-[#FFF2FF]': itemData.action === 'Revisi Data', 'bg-[#EFF3F4]': itemData.action === 'Kirim Data', 'bg-[#FFE5E6]': itemData.action.includes('Tolak'), 'bg-[#E5E5E5]': itemData.action === 'Unduh Data', 'bg-[#E2FCF3]': itemData.action === 'Setujui Data', 'bg-[#FFF8EB]': itemData.action === 'Tambah', 'bg-[#F5F5FF]': itemData.action === 'Edit' }">
            <IconDraft v-if="itemData.action === 'Draft Data'" />
            <IconEditMaster v-else-if="itemData.action === 'Edit'" />
            <IconKirim v-else-if="itemData.action === 'Kirim Data'" />
            <IconLogin v-else-if="itemData.action === 'Login'" />
            <IconLogout v-else-if="itemData.action === 'Logout'" />
            <IconRevisi v-else-if="itemData.action === 'Revisi Data'" />
            <IconSetujui v-else-if="itemData.action === 'Setujui Data'" />
            <IconTambahUser v-else-if="itemData.action === 'Tambah'" />
            <IconTolak v-else-if="itemData.action.includes('Tolak')" />
            <IconUnduh v-else-if="itemData.action === 'Unduh Data'" />
          </div>
          <div class="flex flex-col space-y-1">
            <div class="flex items-center space-x-1.5 ">
              <p class="flex items-center space-x-1.5 font-medium text-black">{{ itemData.action }}</p>
              <div class="w-[1.5px] h-[18px] bg-black ml-1.5"></div>
              <span class="font-normal text-textFieldColor">Oleh: {{ itemData.user }} ({{ itemData.role }}<span
                  v-if="itemData.level !== 'Admin' && itemData.level !== 'Pusat'"> - </span>{{ itemData.user ===
                    'Administrator' ? null :
                    itemData.sentral ? itemData.sentral : itemData.pembina ?
                      itemData.pembina : itemData.pengelola
                }})</span>
            </div>
            <p class="w-full text-xs" v-if="itemData.action !== 'Login' && itemData.action !== 'Logout'">
              {{ itemData.message }}</p>
            <div class="flex flex-col space-y-1" v-if="itemData.action === 'Tolak Data'">
              <p class="text-xs font-medium text-textFieldColor">Keterangan Ditolak:</p>
              <p class="text-xs text-black">{{ itemData.keterangan }}</p>
            </div>
            <div class="flex items-center space-x-3"
              v-else-if="itemData.action === 'Draft Data' || itemData.action === 'Revisi Data'">
              <button
                class="flex items-center space-x-1.5 bg-[#F7FBFC] rounded-md w-fit px-2 py-1 active:ring-1 active:ring-[#E7F1FD]"
                @click="itemData.status_fs == 0 ? downloadExcelKK(itemData.tahun, itemData.tahun_realisasi, itemData.id_mesin) : downloadExcelFS(itemData.tahun, itemData.tahun_realisasi, itemData.id_mesin)">
                <div class="rounded-full flex items-center p-1 bg-[#E7F1FD]">
                  <IconDocument />
                </div>
                <p class="text-xs text-[#0A448F]">Excel {{ itemData.status_fs == 0 ? 'KK' : 'FS' }} {{ itemData.sentral
                  }}.xlsx</p>
              </button>
              <button
                class="flex items-center space-x-1.5 bg-[#F7FBFC] rounded-md w-fit px-2 py-1 active:ring-1 active:ring-[#E7F1FD]"
                @click="itemData.status_fs == 0 ? downloadEvidenceKK(itemData.nama_document, itemData.nama_evidence) : downloadEvidenceFS(itemData.nama_document, itemData.nama_evidence)">
                <div class="rounded-full flex items-center p-1 bg-[#E7F1FD]">
                  <IconDocument />
                </div>
                <p class="text-xs text-[#0A448F]">{{ itemData.nama_evidence }}</p>
              </button>
            </div>
            <!-- <div class="flex items-center space-x-3" v-else-if="itemData.action === 'Edit' && itemData.nama_document">
              <button
                class="flex items-center space-x-1.5 bg-[#F7FBFC] rounded-md w-fit px-2 py-1 active:ring-1 active:ring-[#E7F1FD]">
                <div class="rounded-full flex items-center p-1 bg-[#E7F1FD]">
                  <IconPhoto />
                </div>
                <p class="text-xs text-[#0A448F]">profil.png</p>
              </button>
            </div> -->
          </div>
        </div>
      </div>
    </div>
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
        <li id="pagination" v-for="( item, index ) in generatePageList " :key="index"
          class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
          :class="{ selected: item === navigation.currentPage, disabled: item === '...' }" @click="goToPage(item)">
          {{ item }}
        </li>
        <li>
          <button @click="goToNext" :disabled="navigation.currentPage === navigation.totalPages"
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { notifyError } from '@/services/helper/toast-notification';
import DateFormat from '@/services/format/date-format';
const dateFormat = new DateFormat();
import LogActivityService from '@/services/log-activity-service';
const logActivityService = new LogActivityService();
import RekapService from '@/services/rekap-service';
const rekapService = new RekapService();
import FeasibilityStudyService from '@/services/feasibility-study';
const feasibilityStudyService = new FeasibilityStudyService();
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();
import DetailRekapService from '@/services/detail-rekap-service';
const detailRekapService = new DetailRekapService();
import Loading from '@/components/ui/LoadingSpinner.vue';
import SearchBox from '@/components/ui/SearchBox.vue';
import IconDraft from '@/components/icons/LogActivity/IconDraft.vue';
import IconEditMaster from '@/components/icons/LogActivity/IconEditMaster.vue';
import IconKirim from '@/components/icons/LogActivity/IconKirim.vue';
import IconLogin from '@/components/icons/LogActivity/IconLogin.vue';
import IconLogout from '@/components/icons/LogActivity/IconLogout.vue';
import IconRevisi from '@/components/icons/LogActivity/IconRevisi.vue';
import IconSetujui from '@/components/icons/LogActivity/IconSetujui.vue';
import IconTambahUser from '@/components/icons/LogActivity/IconTambahUser.vue';
import IconTolak from '@/components/icons/LogActivity/IconTolak.vue';
import IconUnduh from '@/components/icons/LogActivity/IconUnduh.vue';
import IconDocument from '@/components/icons/LogActivity/IconDocument.vue';
import IconPhoto from '@/components/icons/LogActivity/IconPhoto.vue';

const date = new Date();
const isLoading = ref<boolean>(false);
const dropdownContainer = ref<any>(null);
const showModalFilter = ref<boolean>(false);
const startDate = ref<any>();
const endDate = ref<any>();
const filterValue = ref<{
  selectedActivity: string[]
  selectedDate: any
  searchValue: string
}>({
  selectedActivity: [],
  selectedDate: [],
  searchValue: ''
});
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
const logData = ref<{
  user: string
  sentral: string
  keterangan: string
  message: string
  action: string
  created_at: string
  role: string
  pembina: string
  pengelola: string
  tahun: number
  tahun_realisasi: number
  nama_evidence: string
  nama_document: string
  level: string
  id_mesin: number
  status_fs: number
}[]>([]);
const filterData = ref<{
  activity: string[]
}>({
  activity: ['Login', 'Logout', 'Draft Data', 'Revisi Data', 'Kirim Data', 'Tolak Data', 'Unduh Data', 'Setujui Data', 'Tambah', 'Edit']
});
var debounceTimeout: any = null;

const changePageLimit = async () => {
  isLoading.value = true;
  navigation.value.currentPage = 1;
  await fetchLogActivity();
  isLoading.value = false;
};


const processValue = (val: string) => {
  if (filterValue.value.selectedActivity.includes(val)) {
    removeValue(val);
  } else {
    addValue(val);
  }
}

const addValue = (val: string) => {
  filterValue.value.selectedActivity.push(val);
  fetchLogActivity();
}

const removeValue = (val: string) => {
  filterValue.value.selectedActivity = filterValue.value.selectedActivity.filter((item: string) => item !== val);
  fetchLogActivity();
}

const formatCalendar = (date: any) => {
  if (date.length > 1) {
    const dayStart = date[0].getDate();
    const monthStart = date[0].getMonth() + 1;
    const yearStart = date[0].getFullYear();

    console.log(date)

    const dayEnd = date[1].getDate();
    const monthEnd = date[1].getMonth() + 1;
    const yearEnd = date[1].getFullYear();

    return `${dayStart}/${monthStart}/${yearStart} - ${dayEnd}/${monthEnd}/${yearEnd}`;
  }
}

const goToPage = async (page: any) => {
  try {
    isLoading.value = true;
    navigation.value.currentPage = page;
    await fetchLogActivity();
  } catch (error) {
    console.error('Go To Page Error : ' + error);
  } finally {
    isLoading.value = false;
  }
};

const goToPrevious = () => {
  goToPage(navigation.value.currentPage - 1);
};

const goToNext = () => {
  goToPage(navigation.value.currentPage + 1);
};

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

const handleClickOutside = (event: any) => {
  if (showModalFilter.value && dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    showModalFilter.value = false;
  }
};

const handleSearch = () => {
  navigation.value.currentPage = 1;
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    fetchLogActivity();
  }, 500);
}

const handleChangeFilter = () => {
  navigation.value.currentPage = 1;
  nextTick(() => {
    fetchLogActivity();
  });
}

const handleChangeDate = () => {
  navigation.value.currentPage = 1;
  nextTick(() => {
    fetchLogActivity();
  });
}

const fetchLogActivity = async () => {
  try {
    isLoading.value = true;
    const formattedStartDate = `${filterValue.value.selectedDate[0].getFullYear()}-${String(filterValue.value.selectedDate[0].getMonth() + 1).padStart(2, '0')}-${String(filterValue.value.selectedDate[0].getDate()).padStart(2, '0')}`;
    const formattedEndDate = `${filterValue.value.selectedDate[1].getFullYear()}-${String(filterValue.value.selectedDate[1].getMonth() + 1).padStart(2, '0')}-${String(filterValue.value.selectedDate[1].getDate()).padStart(2, '0')}`;
    console.log(formattedStartDate);
    console.log(formattedEndDate);
    const response: any = await logActivityService.getLogActivity({
      action: filterValue.value.selectedActivity,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      search: filterValue.value.searchValue,
      limit: navigation.value.limit,
      page: navigation.value.currentPage
    });
    logData.value = response.data;
    navigation.value.currentPage = response.meta.page;
    navigation.value.totalPages = response.meta.totalPages;
    navigation.value.totalRecords = response.meta.totalRecords
    navigation.value.limit = response.meta.limit;
    isLoading.value = false;
  } catch (error) {
    console.error('Fetch Log Error : ' + error);
    isLoading.value = false;
  }
};

const downloadEvidenceKK = async (dokumenEvidence: string, namaFileEvidence: string) => {
  try {
    isLoading.value = true;
    const response: any = await rekapService.downloadEvidence(dokumenEvidence);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `${namaFileEvidence}`;
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
    console.error('Evidence Error : ' + error)
    isLoading.value = false;
    notifyError('Evidence Tidak Ada', 5000)
  }
}

const downloadEvidenceFS = async (dokumenEvidence: string, namaFileEvidence: string) => {
  try {
    isLoading.value = true;
    const response: any = await rekapService.downloadEvidence(dokumenEvidence);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `${namaFileEvidence}`;
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
    console.error('Evidence Error : ' + error)
    isLoading.value = false;
    notifyError('Evidence Tidak Ada', 5000)
  }
}

const downloadExcelKK = async (tahun: number, tahunRealisasi: number, idMesin: number) => {
  try {
    isLoading.value = true;
    var responseMesin: any;
    try {
      responseMesin = await detailRekapService.getMesinById(idMesin);
    } catch (error) {
      console.error('Error : ' + error);
    }
    const response: any = await rekapService.downloadExcelKK(tahun, tahunRealisasi, idMesin);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Actual - ${responseMesin.data.mesin}_${tahun}_${globalFormat.formatNumberFiveDigits(idMesin)}.xlsx`;
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
    console.error('Handle Download Template Rekap Error : ' + error);
  }
}

const downloadExcelFS = async (tahun: number, tahunRealisasi: number, idMesin: number) => {
  try {
    isLoading.value = true;
    var responseMesin: any;
    try {
      responseMesin = await detailRekapService.getMesinById(idMesin);
    } catch (error) {
      console.error('Error : ' + error);
    }
    const response: any = await feasibilityStudyService.downloadExcelFS(tahun, tahunRealisasi, idMesin);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Feasibility Study - ${responseMesin.data.mesin}_${tahun}_${globalFormat.formatNumberFiveDigits(idMesin)}.xlsx`;
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
    isLoading.value = false;
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  startDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
  endDate.value = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  filterValue.value.selectedDate = [startDate.value, endDate.value];
  fetchLogActivity();
});
</script>

<style scoped lang="scss">
.date-picker {
  width: fit-content;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
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
</style>