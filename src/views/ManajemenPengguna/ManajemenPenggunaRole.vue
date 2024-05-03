<template>
  <Loading v-if="isLoading" />
  <div class="p-6 space-y-5 bg-white rounded-lg ">
    <div class="flex flex-row items-center justify-between">
      <SearchBox class="w-60" @on-key-enter="searchQuery" @on-click="searchQuery" />
      <button @click="showModalCreate = !showModalCreate" type="button"
        class="text-white bg-[#0099AD] hover:bg-[#007E8F] focus:ring-4 focus:ring-[#9ddee7] rounded-lg text-sm px-3 py-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
        <span class="mr-2 font-semibold">Tambah Role</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7 0.875C7.48325 0.875 7.875 1.26675 7.875 1.75V6.125H12.25C12.7332 6.125 13.125 6.51675 13.125 7C13.125 7.48325 12.7332 7.875 12.25 7.875H7.875V12.25C7.875 12.7332 7.48325 13.125 7 13.125C6.51675 13.125 6.125 12.7332 6.125 12.25V7.875H1.75C1.26675 7.875 0.875 7.48325 0.875 7C0.875 6.51675 1.26675 6.125 1.75 6.125H6.125V1.75C6.125 1.26675 6.51675 0.875 7 0.875Z"
            fill="white" />
        </svg>
      </button>
    </div>
    <TableComponent>
      <template v-slot:table-header>
        <tr>
          <th scope="col">No</th>
          <th scope="col" class="text-start">Nama Role</th>
          <th scope="col" class="text-start">Level</th>
          <th scope="col" class="text-center">Status</th>
          <th scope="col">Aksi</th>
        </tr>
      </template>
      <template v-slot:table-body>
        <template v-for="(group, level) in groupedData" :key="level">
          <tr v-for="(item, index) in group" :key="item.id" class="border">
            <td scope="row" class="text-center whitespace-nowrap">
              {{ calculateRowNumber(level.toString(), index) }}
            </td>
            <td>
              {{ item.role }}
            </td>
            <td>
              {{ levelMappings[item.kode_level] }}
            </td>
            <td>
              <div class="flex items-center justify-center">
                <div v-if="item.status == true" class="w-fit p-1 rounded-md bg-[#E2FCF3] text-center text-[#397E5D]">
                  Aktif
                </div>
                <div v-else class="w-fit p-1 rounded-md bg-[#E0E0E0] text-center text-[#7F7F80]">
                  Tidak Aktif
                </div>
              </div>
            </td>
            <td>
              <div class="flex justify-center space-x-3">
                <button type="button" @click="openEditModals(item.id)"
                  class="flex justify-center items-center p-1.5 rounded-md bg-gray-200 hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-blue-500 duration-300">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_14293_14997)">
                      <path class="fill-black" fill-rule="evenodd" clip-rule="evenodd"
                        d="M13.6627 2.33622C13.4349 2.10841 13.0655 2.10841 12.8377 2.33622L12.1841 2.98981L13.0091 3.81477L13.6627 3.16118C13.8905 2.93337 13.8905 2.56402 13.6627 2.33622ZM12.0663 4.75758L11.2413 3.93262L3.2586 11.9153C2.98447 12.1895 2.78296 12.5276 2.67229 12.8991L2.49092 13.508L3.09978 13.3266C3.47132 13.2159 3.80944 13.0144 4.08356 12.7403L12.0663 4.75758ZM11.8949 1.39341C12.6434 0.644905 13.857 0.644905 14.6055 1.39341C15.354 2.14192 15.354 3.35548 14.6055 4.10399L5.02637 13.6831C4.5956 14.1139 4.06428 14.4305 3.48043 14.6044L1.6905 15.1376C1.4559 15.2075 1.20187 15.1432 1.02877 14.9701C0.855682 14.797 0.791373 14.543 0.861258 14.3084L1.39444 12.5185C1.56836 11.9346 1.88502 11.4033 2.31579 10.9725L11.8949 1.39341Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_14293_14997">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <RouterLink :to="{ name: 'edit-permission', params: { id: item.id } }">
                  <button type="button"
                    class="flex justify-center items-center p-1.5 rounded-md bg-gray-200 hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-blue-500 duration-300">
                    <svg width="18" height="18" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path class="fill-black"
                        d="M0.5625 3.37437C0.47962 3.37437 0.400134 3.34145 0.341529 3.28285C0.282924 3.22424 0.25 3.14475 0.25 3.06187V0.5625C0.25 0.47962 0.282924 0.400134 0.341529 0.341529C0.400134 0.282924 0.47962 0.25 0.5625 0.25H3.0625C3.14538 0.25 3.22487 0.282924 3.28347 0.341529C3.34208 0.400134 3.375 0.47962 3.375 0.5625V3.06187C3.375 3.14475 3.34208 3.22424 3.28347 3.28285C3.22487 3.34145 3.14538 3.37437 3.0625 3.37437H0.5625ZM4.9375 3.37437C4.85462 3.37437 4.77513 3.34145 4.71653 3.28285C4.65792 3.22424 4.625 3.14475 4.625 3.06187V0.5625C4.625 0.47962 4.65792 0.400134 4.71653 0.341529C4.77513 0.282924 4.85462 0.25 4.9375 0.25H7.43687C7.51975 0.25 7.59924 0.282924 7.65785 0.341529C7.71645 0.400134 7.74937 0.47962 7.74937 0.5625V3.06187C7.74937 3.14475 7.71645 3.22424 7.65785 3.28285C7.59924 3.34145 7.51975 3.37437 7.43687 3.37437H4.9375ZM0.5625 7.74937C0.47962 7.74937 0.400134 7.71645 0.341529 7.65785C0.282924 7.59924 0.25 7.51975 0.25 7.43687V4.93687C0.25 4.85399 0.282924 4.77451 0.341529 4.7159C0.400134 4.6573 0.47962 4.62437 0.5625 4.62437H3.0625C3.14538 4.62437 3.22487 4.6573 3.28347 4.7159C3.34208 4.77451 3.375 4.85399 3.375 4.93687V7.43687C3.375 7.51975 3.34208 7.59924 3.28347 7.65785C3.22487 7.71645 3.14538 7.74937 3.0625 7.74937H0.5625ZM4.9375 7.74937C4.85462 7.74937 4.77513 7.71645 4.71653 7.65785C4.65792 7.59924 4.625 7.51975 4.625 7.43687V4.93687C4.625 4.85399 4.65792 4.77451 4.71653 4.7159C4.77513 4.6573 4.85462 4.62437 4.9375 4.62437H7.43687C7.51975 4.62437 7.59924 4.6573 7.65785 4.7159C7.71645 4.77451 7.74937 4.85399 7.74937 4.93687V7.43687C7.74937 7.51975 7.71645 7.59924 7.65785 7.65785C7.59924 7.71645 7.51975 7.74937 7.43687 7.74937H4.9375Z" />
                    </svg>
                  </button>
                </RouterLink>
              </div>
            </td>
          </tr>
        </template>
      </template>
    </TableComponent>
    <nav class="flex items-center justify-between bg-white rounded-b-lg" aria-label="Table navigation">
      <div class="flex items-center">
        <span class="inline-block pr-2 text-sm font-normal text-gray-500">Menampilkan</span>
        <select v-model="pageSize" @change="changePageSize"
          class="block float-right text-sm font-semibold border border-gray-300 rounded">
          <option value="-1">All</option>
          <option selected value="10">10</option>
          <option value="20">20</option>
          <option value="40">40</option>
          <option value="60">60</option>
          <option value="80">80</option>
          <option value="100">100</option>
        </select>
        <span class="pl-2">dari {{ totalRecords }} data</span>
      </div>
      <ul class="inline-flex items-center -space-x-px">
        <li>
          <button @click="goToPrevious" :disable="currentPage === 1"
            class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
            <span class="sr-only">Previous</span>
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </button>
        </li>
        <li>
          <button @click="goToNext" :disabled="currentPage === totalPages"
            class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">
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
    </nav>
  </div>

  <ModalWrapper :showModal="showModalCreate" :width="'w-[500px]'" :height="'h-auto'">
    <div>
      <div class="flex">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Tambah Role
        </h3>
        <div class="mt-2 ml-auto">
          <button type="button" @click="closeModal">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 16.5L16.5 1.5M1.5 1.5L16.5 16.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <form @submit.prevent="saveRoleDataAndCloseModal" class="space-y-6">
        <div v-if="errors.length > 0" class="p-3 text-xs text-red-600 bg-red-400 bg-opacity-50 rounded-lg">
          <!-- Menampilkan pesan kesalahan jika ada kesalahan -->
          <ul>
            <li v-for="error in errors" :key="error" class="ml-2 list-disc">
              {{ error }}
            </li>
          </ul>
        </div>
        <!-- <div v-if="!formData.role" class="mt-1 text-xs text-red-500">Role harus diisi.</div> -->
        <div>
          <label for="role" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Role</label>
          <input type="role" v-model="formData.role"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-[#0099AD] focus:border-[#0099AD] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Contoh : admin" />
        </div>
        <!-- <div v-if="!formData.kode_level" class="mt-1 text-xs text-red-500">Level harus dipilih.</div> -->
        <div>
          <label for="level" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Level</label>
          <select placeholder="Pilih Level" v-model="formData.kode_level"
            class="bg-white border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
            <option value="" disabled hidden>Pilih Level</option>
            <option v-for="item in comboLevel" :key="item.kode_level" :value="item.kode_level">
              {{ item.level }}
            </option>
          </select>
        </div>
        <div class="flex items-center mt-4">
          <p class="text-[#4D5E80] text-xs font-semibold">Status</p>
          <label class="relative inline-flex items-center ml-4 mr-5 cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="isActive" />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]">
            </div>
            <span class="pl-4 text-xs font-medium text-[#333333]">
              {{ isActive ? "Aktif" : "Tidak Aktif" }}
            </span>
          </label>
        </div>
        <div class="w-full mt-10 border"></div>
        <div class="flex justify-end">
          <div class="flex items-start">
            <button type="button" @click="closeModal"
              class="w-full text-[#0099AD] bg-white border-2 border-[#80C1CD] hover:bg-[#80C1CD] focus:ring-4 focus:outline-none focus:ring-[#0099AD] font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center dark:bg-[#007E8F] dark:hover:bg-white dark:focus:ring-bg-[#80C1CD]">
              Batal
            </button>
            <button type="submit"
              class="w-full text-white whitespace-nowrap bg-[#0099AD] hover:bg-[#005A66] focus:ring-4 focus:outline-none focus:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:focus:ring-[#005A66]">
              Simpan Data
            </button>
          </div>
        </div>
      </form>
    </div>
  </ModalWrapper>
  <ModalWrapper :showModal="isModalEdit" :width="'w-[500px]'" :height="'h-auto'">
    <div>
      <div class="flex">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Edit Role
        </h3>
        <div class="mt-2 ml-auto">
          <button type="button" @click="closeModalEdit">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 16.5L16.5 1.5M1.5 1.5L16.5 16.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <form class="space-y-6" @submit.prevent="editRoleDataAndCloseModal">
        <div v-if="errorsEdit.length > 0" class="p-3 text-xs text-red-600 bg-red-400 bg-opacity-50 rounded-lg">
          <!-- Menampilkan pesan kesalahan jika ada kesalahan -->
          <ul>
            <li v-for="error in errorsEdit" :key="error" class="ml-2 list-disc">
              {{ error }}
            </li>
          </ul>
        </div>
        <div>
          <label for="role" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Role</label>
          <input type="role" v-model="formData.role"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-[#0099AD] focus:border-[#0099AD] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Contoh : admin" />
        </div>
        <div>
          <label for="level" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Level</label>
          <select v-model="formData.kode_level"
            class="bg-white border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
            <option disable hidden>Pilih Level</option>
            <option v-for="item in comboLevel" :key="item.kode_level" :value="item.kode_level">
              {{ item.level }}
            </option>
          </select>
        </div>
        <div class="flex items-center mt-4">
          <p class="text-[#4D5E80] text-xs font-semibold">Status</p>
          <label class="relative inline-flex items-center ml-4 mr-5 cursor-pointer">
            <input type="checkbox" class="sr-only peer" v-model="isActive" />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]">
            </div>
            <span class="pl-4 text-xs font-medium text-[#333333]">
              {{ isActiveEdit ? "Aktif" : "Tidak Aktif" }}
            </span>
          </label>
        </div>
        <div class="w-full mt-10 border"></div>
        <div class="flex justify-end">
          <div class="flex items-start">
            <button type="button" @click="closeModalEdit"
              class="w-full text-[#0099AD] bg-white border-2 border-[#80C1CD] hover:bg-[#80C1CD] focus:ring-4 focus:outline-none focus:ring-[#0099AD] font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center dark:bg-[#007E8F] dark:hover:bg-white dark:focus:ring-bg-[#80C1CD]">
              Batal
            </button>
            <button type="submit"
              class="w-full text-white whitespace-nowrap bg-[#0099AD] hover:bg-[#005A66] focus:ring-4 focus:outline-none focus:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:focus:ring-[#005A66]">
              Simpan Data
            </button>
          </div>
        </div>
      </form>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import RoleService from "@/services/role-service";
import Loading from "@/components/ui/LoadingSpinner.vue";
import TableComponent from "@/components/ui/Table.vue";
import SearchBox from "@/components/ui/SearchBox.vue";

const roleService = new RoleService();
const isLoading = ref(false);
const search = ref<string>("");
const selectedRoleId = ref<number | null>(null);
const isModalEdit = ref(false);
const role = ref<RoleItem[]>([]);
const filteredRole = ref<RoleItem[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);
const totalPages = ref(0);

interface RoleItem {
  meta: any;
  data: any;
  id: number;
  role: string;
  status: boolean;
  kode_level: string;
}

const fetchData = async (page: any, limit: any) => {
  try {
    isLoading.value = true;
    const response: RoleItem = search.value === "" ? await roleService.getRoleData(
      page,
      limit
    ) : await roleService.getRoleData(page, limit, search.value)

    const { data, meta } = response;
    role.value = data;
    filteredRole.value = role.value;
    totalPages.value = meta.totalPages;
    totalRecords.value = meta.totalRecords;
    console.log(totalRecords);
    // Update jumlah total data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

const searchQuery = async () => {
  isLoading.value = true;
  await fetchData(currentPage.value, pageSize.value);
  isLoading.value = false;
}

const groupedRoles = computed(() => {
  const groups: Record<string, RoleItem[]> = {};
  filteredRole.value.forEach((item) => {
    if (!groups[item.kode_level]) {
      groups[item.kode_level] = [];
    }
    groups[item.kode_level].push(item);
  });
  return groups;
});

onMounted(() => {
  fetchData(currentPage.value, pageSize.value);
});

const goToPage = (page: number) => {
  currentPage.value = page;
  fetchData(currentPage.value, pageSize.value);
};

const goToPrevious = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const goToNext = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

const changePageSize = () => {
  fetchData(currentPage.value, pageSize.value);
};

const calculateRowNumber = (group: string, index: number) => {
  let totalPreviousItems = 0;
  for (const key in groupedRoles.value) {
    if (key === group) break;
    totalPreviousItems += groupedRoles.value[key].length;
  }
  const offset = (currentPage.value - 1) * pageSize.value;
  return totalPreviousItems + index + 1 + offset;
};

interface LevelItem {
  kode_level: string;
  level: string;
}

const comboLevel = ref<LevelItem[]>([]);
const levelMappings = ref<{ [key: string]: string }>({});

onMounted(async () => {
  try {
    const response: any = await roleService.getLevel();
    const responseData = response;
    // const response = await axios.get(`${url}/level`);
    comboLevel.value = response.data; // Mengisi data comboSubmenu dengan hasil dari API

    comboLevel.value.forEach((item) => {
      levelMappings.value[item.kode_level] = item.level;
    });
  } catch (error) {
    console.error("Error fetching combo submenu:", error);
    throw error;
  }
});

const closeModal = () => {
  showModalCreate.value = false;
  resetFormData();
  errors.value = [];
}

const formData = ref({
  role: "",
  kode_level: "",
  status: false,
});

const isActive = computed({
  get: () => formData.value.status === true,
  set: (value) => (formData.value.status = value ? true : false),
});

const showModalCreate = ref(false);
const errors = ref<string[]>([]);

const saveRoleDataAndCloseModal = async () => {
  errors.value = [];

  if (!formData.value.role) {
    errors.value.push("Role wajib diisi.");
  }

  if (!formData.value.kode_level) {
    errors.value.push("Level wajib diisi.");
  }
  if (errors.value.length === 0) {
    try {
      const response = await roleService.createRole(formData.value);
      const responseData: any = response;

      if (responseData.success) {
        showModalCreate.value = false;
        fetchData(currentPage.value, pageSize.value);

        formData.value = {
          role: "",
          kode_level: "",
          status: false,
        };
      } else {
        console.error("Gagal menyimpan data:", responseData.error);
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
    }
  }
};


const isActiveEdit = computed({
  get: () => formData.value.status === true,
  set: (value) => (formData.value.status = value ? true : false),
});

const openEditModals = async (id: number) => {
  try {
    const response: any = await roleService.getRoleById(id);
    const roleData = response.data;
    formData.value = roleData;
    isModalEdit.value = true;
    selectedRoleId.value = id;
  } catch (error) {
    console.error("Error fetching role data:", error);
  }
};

const resetFormData = () => {
  formData.value = {
    role: "",
    kode_level: "",
    status: false,
  };
};

const closeModalEdit = () => {
  isModalEdit.value = false;
  resetFormData();
  errorsEdit.value = [];
};

const errorsEdit = ref<string[]>([]);
const editRoleDataAndCloseModal = async () => {
  errorsEdit.value = [];

  if (!formData.value.role) {
    errorsEdit.value.push("Role wajib diisi.");
  }

  if (!formData.value.kode_level) {
    errorsEdit.value.push("Level wajib diisi.");
  }

  if (errorsEdit.value.length === 0) {
    try {
      const idRole: any = selectedRoleId.value;
      const response = await roleService.updateRole(idRole, formData.value);
      const responseData: any = response;
      if (responseData.success) {
        isModalEdit.value = false;
        resetFormData();
        fetchData(currentPage.value, pageSize.value);
      } else {
        console.error("Gagal menyimpan data:", errorsEdit.value);
      }
    } catch (error: any) {
      console.error("Error saat mengirim data:", error.message || error);
    }
  }
};

interface GroupedData {
  [key: string]: RoleItem[];
}

interface MinimizedGroups {
  [key: string]: boolean;
}

const minimizedGroups = ref<MinimizedGroups>({});

const groupedData = computed(() => {
  const result: GroupedData = {};
  role.value.forEach((item) => {
    let roleLevel = item.kode_level || "Tidak tersedia";
    if (!result[roleLevel]) {
      result[roleLevel] = [];
    }
    result[roleLevel].push(item);
  });

  return result;
});

function toggleLevel(level: string) {
  if (minimizedGroups.value[level] === undefined) {
    minimizedGroups.value[level] = true;
  } else {
    minimizedGroups.value[level] = !minimizedGroups.value[level];
  }
}
</script>
<style scoped>
td {
  padding: 0.8rem;
}

button:hover svg g path,
button:hover svg path {
  fill: #0099AD;
  transition: all 300ms;
}
</style>
