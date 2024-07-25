<template>
  <Loading v-if="isLoading" />
  <div class="p-6 space-y-5 bg-white rounded-lg ">
    <div class="flex flex-row items-center space-x-2">
      <div class="w-[5px] h-10 rounded-full bg-primaryColor"></div>
      <p class="text-lg font-semibold text-primaryTextColor">Informasi Role, Level, dan Hak Akses</p>
    </div>
    <TableComponent>
      <template v-slot:table-header>
        <tr>
          <th>No</th>
          <th class="text-start">Nama Role</th>
          <th class="text-start">Level</th>
          <th>Detail Akses</th>
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
            <td class="flex items-center justify-center">
              <div class="rounded-md bg-[#F7FBFC] cursor-pointer">
                <IconDetailAkses class="m-2" />
              </div>
            </td>
          </tr>
        </template>
      </template>
    </TableComponent>
    <div class="flex items-center justify-between w-full mt-7">
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
        <li id="pagination" v-for="(item, index) in generatePageList" :key="index"
          :class="{ selected: item === navigation.currentPage, disabled: item === '...' }"
          class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
          @click="goToPage(item)">
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
import IconDetailAkses from "@/components/icons/IconDetailAkses.vue"

const roleService = new RoleService();
const isLoading = ref<boolean>(false);
const search = ref<string>("");
const selectedRoleId = ref<number | null>(null);
const isModalEdit = ref(false);
const role = ref<RoleItem[]>([]);
const filteredRole = ref<RoleItem[]>([]);
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
const comboLevel = ref<LevelItem[]>([]);
const levelMappings = ref<{ [key: string]: string }>({});

interface RoleItem {
  meta: any;
  data: any;
  id: number;
  role: string;
  status: boolean;
  kode_level: string;
}
interface LevelItem {
  kode_level: string;
  level: string;
}
interface GroupedData {
  [key: string]: RoleItem[];
}
interface MinimizedGroups {
  [key: string]: boolean;
}

const minimizedGroups = ref<MinimizedGroups>({});

const fetchData = async () => {
  try {
    isLoading.value = true;
    const response: RoleItem = await roleService.getRoleData(navigation.value.currentPage, navigation.value.limit, search.value)

    const { data, meta } = response;
    role.value = data;
    filteredRole.value = role.value;
    navigation.value.totalPages = meta.totalPages;
    navigation.value.totalRecords = meta.totalRecords;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

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

const goToPage = async (page: any) => {
  isLoading.value = true;
  navigation.value.currentPage = page;
  await fetchData();
  isLoading.value = false
};

const goToPrevious = () => {
  if (navigation.value.currentPage > 1) {
    goToPage(navigation.value.currentPage - 1);
  }
};

const goToNext = () => {
  if (navigation.value.currentPage < navigation.value.totalPages) {
    goToPage(navigation.value.currentPage + 1);
  }
};

const changePageLimit = async (event: any) => {
  isLoading.value = true;
  navigation.value.limit = parseInt(event.target.value);
  navigation.value.currentPage = 1;
  await fetchData();
  isLoading.value = false;
};

const calculateRowNumber = (group: string, index: number) => {
  let totalPreviousItems = 0;
  for (const key in groupedRoles.value) {
    if (key === group) break;
    totalPreviousItems += groupedRoles.value[key].length;
  }
  const offset = (navigation.value.currentPage - 1) * navigation.value.limit;
  return totalPreviousItems + index + 1 + offset;
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

onMounted(async () => {
  try {
    fetchData();
    const response: any = await roleService.getLevel();
    comboLevel.value = response.data;
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
        fetchData();

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
        fetchData();
      } else {
        console.error("Gagal menyimpan data:", errorsEdit.value);
      }
    } catch (error: any) {
      console.error("Error saat mengirim data:", error.message || error);
    }
  }
};

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

ul li#pagination.selected {
  background-color: #0099AD;
  border-radius: 6px;
  color: white;
  transition: 300ms;
}
</style>
