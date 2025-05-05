<template>
  <Loading v-if="isLoading" />
  <ModalWrapper :show-modal="showModalSubmit" ref="modal" :width="'w-80'" :height="'h-auto'">
    <Vue3Lottie :width="200" :height="200" :loop="false" :speed="0.8" :animationData="jsonData" />
    <h1 class="mb-3 text-lg font-semibold text-gray-700">
      Data Berhasil disimpan
    </h1>
    <p class="text-sm text-gray-500">Data telah berhasil ditambahkan</p>
  </ModalWrapper>
  <ModalWrapper :showModal="showModalEdit" ref="modal" :width="'w-80'" :height="'h-auto'">
    <Vue3Lottie :animationData="jsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
    <h1 class="mb-3 text-lg font-semibold text-gray-700">
      Data Berhasil Disimpan
    </h1>
    <p class="text-sm text-gray-500">Data telah berhasil dikirimkan</p>
  </ModalWrapper>
  <div class="p-6 space-y-5 bg-white rounded-lg">
    <button @click="isModalOpen = true" type="button"
      class="px-3 py-2 ml-auto space-x-3 text-white bg-[#0099AD] hover:bg-[#007E8F] focus:ring-4 focus:ring-[#9ddee7] font-medium rounded-lg text-sm flex justify-center items-center focus:outline-none duration-300">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M7 0.875C7.48325 0.875 7.875 1.26675 7.875 1.75V6.125H12.25C12.7332 6.125 13.125 6.51675 13.125 7C13.125 7.48325 12.7332 7.875 12.25 7.875H7.875V12.25C7.875 12.7332 7.48325 13.125 7 13.125C6.51675 13.125 6.125 12.7332 6.125 12.25V7.875H1.75C1.26675 7.875 0.875 7.48325 0.875 7C0.875 6.51675 1.26675 6.125 1.75 6.125H6.125V1.75C6.125 1.26675 6.51675 0.875 7 0.875Z"
          fill="white" />
      </svg>
      <span class="font-semibold">Tambah Parameter</span>
    </button>
    <TableComponent>
      <template v-slot:table-header>
        <tr>
          <th scope="col">No</th>
          <th scope="col">Tahun</th>
          <th scope="col">Discount Rate (%)</th>
          <th scope="col">Corporate Tax Rate (%)</th>
          <th scope="col">Status</th>
          <th scope="col">Aksi</th>
        </tr>
      </template>
      <template v-slot:table-body>
        <tr v-for="(item, index) in filteredParameter" class="border-b last:border-none">
          <td class="font-medium text-center whitespace-nowrap">
            {{ index + 1 }}
          </td>
          <td class="text-center">
            {{ item.tahun }}
          </td>
          <td class="text-center">
            {{ globalFormat.formatRupiah(item.discount_rate) }}
          </td>
          <td class="text-center">
            {{ globalFormat.formatRupiah(item.corporate_tax_rate) }}
          </td>
          <td class="flex justify-center">
            <div v-if="item.status === 1"
              class="px-1.5 py-1 border border-[#C7E5D7] w-fit rounded-xl bg-[#E2FCF3] text-center flex justify-center items-center ">
              <p class="text-[#397E5D] font-semibold">Aktif</p>
            </div>
            <div v-else
              class="px-1.5 py-1 w-fit rounded-xl border border-[#EFC0BD] bg-[#FAEBEA] text-center flex justify-center items-center">
              <p class="text-[#C53830] font-semibold">Tidak Aktif</p>
            </div>
          </td>
          <td class="text-center">
            <button type="button" @click="openEditModals(item.id_parameter)"
              v-if="item.tahun == currentYear.toString()">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_14293_14997)">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M13.6627 2.33622C13.4349 2.10841 13.0655 2.10841 12.8377 2.33622L12.1841 2.98981L13.0091 3.81477L13.6627 3.16118C13.8905 2.93337 13.8905 2.56402 13.6627 2.33622ZM12.0663 4.75758L11.2413 3.93262L3.2586 11.9153C2.98447 12.1895 2.78296 12.5276 2.67229 12.8991L2.49092 13.508L3.09978 13.3266C3.47132 13.2159 3.80944 13.0144 4.08356 12.7403L12.0663 4.75758ZM11.8949 1.39341C12.6434 0.644905 13.857 0.644905 14.6055 1.39341C15.354 2.14192 15.354 3.35548 14.6055 4.10399L5.02637 13.6831C4.5956 14.1139 4.06428 14.4305 3.48043 14.6044L1.6905 15.1376C1.4559 15.2075 1.20187 15.1432 1.02877 14.9701C0.855682 14.797 0.791373 14.543 0.861258 14.3084L1.39444 12.5185C1.56836 11.9346 1.88502 11.4033 2.31579 10.9725L11.8949 1.39341Z"
                    fill="#0099AD" />
                </g>
                <defs>
                  <clipPath id="clip0_14293_14997">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </td>
        </tr>
      </template>
    </TableComponent>
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center space-x-2 text-sm">
        <span>Menampilkan</span>
        <select v-model.number="navigation.pageLimit" name="" id=""
          class="p-2 text-sm text-gray-500 border-r-4 border-transparent rounded-lg cursor-pointer outline-1 outline outline-gray-300"
          @change="handlePageSizeChange">
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
          <button @click="handlePreviousClick" :disabled="navigation.currentPage === 1"
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
          :class="{ selected: item === navigation.currentPage, disabled: item === '...' }"
          @click="handlePageChange(item)">
          {{ item }}
        </li>
        <li>
          <button @click="handleNextClick" :disabled="navigation.currentPage === navigation.totalPages"
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
  <!-- Modal Tambah -->
  <ModalWrapper :show-modal="isModalOpen" :width="'w-[500px]'" :height="'h-auto'">
    <h3 class="mb-4 text-xl font-bold text-primaryTextColor">
      Tambah Parameter
    </h3>
    <div class="space-y-5">
      <div v-if="errors.length > 0" class="p-3 text-xs text-red-600 bg-red-400 bg-opacity-50 rounded-lg">
        <ul>
          <li v-for="error in errors" :key="error" class="ml-2 list-disc">
            {{ error }}
          </li>
        </ul>
      </div>
      <div>
        <label for="tahun" class="block mb-2 text-xs font-semibold text-[#4D5E80]">Tahun</label>
        <select id="tahun" v-model="formData.tahun"
          class="border focus:border-transparent border-gray-300 text-primaryTextColor text-xs rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 border-r-4 border-transparent cursor-pointer outline-1 outline outline-gray-300"
          required>
          <option value="" disabled selected hidden>2xxx</option>
          <option v-for="tahun in tahunOptions" :key="tahun" :value="tahun">
            {{ tahun }}
          </option>
        </select>
      </div>
      <div>
        <label for="discount" class="block mb-2 text-xs font-semibold text-[#4D5E80]">Discount
          Rate
          (%)</label>
        <div v-if="errors_DT.includes('kosong')" class="text-xs text-red-500">
          Discount Rate harus diisi
        </div>
        <div v-if="errors_DT.includes('non_angka')" class="text-xs text-red-500">
          Discount Rate harus berupa angka
        </div>
        <div v-if="errors_DT.includes('negatif')" class="text-xs text-red-500">
          Discount Rate harus berupa angka positif
        </div>
        <div v-if="errors_DT.includes('diatas_100')" class="text-xs text-red-500">
          Discount Rate harus tidak lebih dari 100.
        </div>
        <input type="text" id="discount" v-model="formData.discount_rate" @input="validForm_DT"
          class="bg-white border border-gray-300 text-primaryTextColor text-xs rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5"
          placeholder="Contoh : 10" required />
      </div>
      <div>
        <label for="tax" class="block mb-2 text-xs font-semibold text-[#4D5E80]">Corporate Tax
          Rate
          (%)</label>
        <div v-if="errors_CT.includes('kosong')" class="text-xs text-red-500">
          Corporate Tax Rate harus diisi
        </div>
        <div v-if="errors_CT.includes('non_angka')" class="text-xs text-red-500">
          Corporate Tax Rate harus berupa angka positif
        </div>
        <div v-if="errors_CT.includes('negatif')" class="text-xs text-red-500">
          Corporate Tax Rate harus berupa angka positif
        </div>
        <div v-if="errors_CT.includes('diatas_100')" class="text-xs text-red-500">
          Corporate Tax Rate harus tidak lebih dari 100.
        </div>
        <input type="text" id="tax" v-model="formData.corporate_tax_rate" @input="validForm_CT"
          class="bg-white border border-gray-300 text-primaryTextColor text-xs rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5"
          placeholder="Contoh : 10" required />
      </div>
      <div class="flex justify-end space-x-2">
        <button
          class="px-5 py-2 text-sm font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor hover:text-white"
          @click="closeModal">
          Batal
        </button>
        <button
          class="px-5 py-2 text-sm font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:bg-hoverColor hover:border-hoverColor"
          @click="submitForm">
          Simpan Data
        </button>
      </div>
    </div>
  </ModalWrapper>
  <ModalWrapper :show-modal="isModalEdit" :width="'w-[500px]'" :height="'h-auto'">
    <h3 class="mb-4 text-xl font-bold text-primaryTextColor">
      Edit Parameter
    </h3>
    <form class="space-y-6">
      <div v-if="errors.length > 0" class="p-3 text-xs text-red-600 bg-red-400 bg-opacity-50 rounded-lg">
        <ul>
          <li v-for="error in errors" :key="error" class="ml-2 list-disc">
            {{ error }}
          </li>
        </ul>
      </div>
      <div>
        <label for="tahun" class="block mb-2 text-xs font-semibold text-[#4D5E80]">Tahun</label>
        <input type="text" id="tahun" v-model="formData.tahun"
          class="border border-gray-300 text-primaryTextColor text-xs rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5"
          placeholder="2xxx" disabled />
      </div>
      <div>
        <label for="discount" class="block mb-2 text-xs font-semibold text-[#4D5E80]">Discount
          Rate (%)</label>
        <div v-if="errors_DT.includes('non_angka')" class="text-xs text-red-500">
          Discount Rate harus berupa angka
        </div>
        <div v-if="errors_DT.includes('negatif')" class="text-xs text-red-500">
          Discount Rate harus berupa angka positif
        </div>
        <div v-if="errors_DT.includes('diatas_100')" class="text-xs text-red-500">
          Discount Rate harus tidak lebih dari 100.
        </div>
        <input type="text" id="discount" v-model="formData.discount_rate" @input="validForm_DT"
          class="bg-white border border-gray-300 text-primaryTextColor text-xs rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5"
          placeholder="Contoh : 10" required />
      </div>
      <div>
        <label for="tax" class="block mb-2 text-xs font-semibold text-[#4D5E80]">Corporate Tax
          Rate (%)</label>
        <div v-if="errors_CT.includes('non_angka')" class="text-xs text-red-500">
          Corporate Tax Rate harus berupa angka positif
        </div>
        <div v-if="errors_CT.includes('negatif')" class="text-xs text-red-500">
          Corporate Tax Rate harus berupa angka positif
        </div>
        <div v-if="errors_CT.includes('diatas_100')" class="text-xs text-red-500">
          Corporate Tax Rate harus tidak lebih dari 100.
        </div>
        <input type="text" id="tax" v-model="formData.corporate_tax_rate" @input="validForm_CT"
          class="bg-white border border-gray-300 text-primaryTextColor text-xs rounded-lg focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5"
          placeholder="Contoh : 10" required />
      </div>
      <div class="flex justify-end space-x-2">
        <button type="button"
          class="px-5 py-2 text-sm font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor hover:text-white"
          @click="closeModalEdit">
          Batal
        </button>
        <button
          class="px-5 py-2 text-sm font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:bg-hoverColor hover:border-hoverColor"
          @click="submitEditForm">
          Simpan Data
        </button>
      </div>
    </form>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import Loading from "@/components/ui/LoadingSpinner.vue";
import ParameterService from "@/services/parameter-service";
const parameterService = new ParameterService();
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import jsonData from "@/assets/lottie/success.json";
import TableComponent from "@/components/ui/Table.vue";

const isLoading = ref(false);
const parameter = ref<any[]>([]);
const isModalOpen = ref(false);
const showModalSubmit = ref(false);
const showModalEdit = ref(false);
const isModalEdit = ref(false);
const selectedParameterId = ref<string | null>(null);
const detailData = ref<any>([]);
const searchQuery = ref("");
const filteredParameter = ref<ParameterItem[]>([]);
const errors = ref<string[]>([]);
const errors_DT = ref<string[]>([]);
const errors_CT = ref<string[]>([]);
const currentYear = new Date().getFullYear();
let years = generateYears(currentYear);
const tahunOptions = ref(years);
const navigation = ref<{
  currentPage: number;
  totalPages: number;
  pageLimit: number;
  totalRecords: number;
}>({
  currentPage: 1,
  totalPages: 0,
  pageLimit: 10,
  totalRecords: 0,
});

interface ParameterItem {
  id_parameter: string;
  tahun: string;
  discount_rate: string;
  corporate_tax_rate: string;
  status: number;
}

const handlePageChange = async (newPage: any) => {
  navigation.value.currentPage = newPage;
  const data = await fetchData();
  parameter.value = data;
  filteredParameter.value = parameter.value;
};
const handlePageSizeChange = async () => {
  navigation.value.currentPage = 1;
  const data = await fetchData();
  parameter.value = data;
  filteredParameter.value = parameter.value;
};
const handlePreviousClick = async () => {
  if (navigation.value.currentPage > 1) {
    await handlePageChange(navigation.value.currentPage - 1);
  }
};
const handleNextClick = async () => {
  if (navigation.value.currentPage < navigation.value.totalPages) {
    await handlePageChange(navigation.value.currentPage + 1);
  }
};
const fetchData = async () => {
  isLoading.value = true;
  try {
    const response: any = await parameterService.getParameterData();
    const responseData = response;
    const { data, meta } = responseData;
    navigation.value.totalRecords = meta.totalRecords;
    navigation.value.totalPages = meta.totalPages;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};
function generateYears(currentYear: number) {
  const generatedYears = [];
  for (let i = currentYear; i <= currentYear; i++) {
    generatedYears.push(i.toString());
  }
  return generatedYears;
}

const validForm_DT = () => {
  errors_DT.value = [];
  const discountRate = formData.value.discount_rate;
  if (formData.value.discount_rate) {
    if (/[^0-9.]/.test(discountRate)) {
      errors_DT.value.push("non_angka");
    } else {
      const numericValue = parseFloat(discountRate);
      if (numericValue <= 0) {
        errors_DT.value.push("negatif");
      } else if (isNaN(numericValue) || numericValue > 100) {
        errors_DT.value.push("diatas_100");
      }
    }
  }
};
const validForm_CT = () => {
  errors_CT.value = [];
  const corporateTaxRate = formData.value.corporate_tax_rate;
  if (formData.value.discount_rate) {
    if (/[^0-9.]/.test(corporateTaxRate)) {
      errors_CT.value.push("non_angka");
    } else {
      const numericValue = parseFloat(corporateTaxRate);
      if (numericValue <= 0) {
        errors_CT.value.push("negatif");
      } else if (isNaN(numericValue) || numericValue > 100) {
        errors_CT.value.push("diatas_100");
      }
    }
  }
};

// Data untuk menyimpan input formulir
const formData = ref({
  tahun: currentYear.toString(),
  discount_rate: "",
  corporate_tax_rate: "",
});

// Handler untuk mengirim formulir
const submitForm = async () => {
  errors.value = []; // Mengosongkan pesan kesalahan sebelum validasi
  if (!formData.value.tahun) {
    errors.value.push("Tahun harus diisi.");
  }
  if (!formData.value.discount_rate) {
    errors.value.push("Discount Rate harus diisi.");
  } else {
    const discountRate = parseFloat(formData.value.discount_rate);
    if (isNaN(discountRate) || discountRate <= 0 || discountRate >= 100) {
      errors.value.push(
        "Discount Rate harus berupa angka positif dan tidak lebih dari 100."
      );
    }
  }

  if (!formData.value.corporate_tax_rate) {
    errors.value.push("Corporate Tax Rate harus diisi.");
  } else {
    const corporateTaxRate = parseFloat(formData.value.corporate_tax_rate);
    if (
      isNaN(corporateTaxRate) ||
      corporateTaxRate <= 0 ||
      corporateTaxRate >= 100
    ) {
      errors.value.push(
        "Corporate Tax Rate harus berupa angka positif dan tidak lebih dari 100."
      );
    }
  }

  if (errors.value.length === 0) {
    // Lanjutkan dengan pengiriman data jika tidak ada kesalahan
    try {
      const existingData = await fetchData();
      // Check if the inputted year already exists
      const yearExists = existingData.some(
        (item: { tahun: string }) => item.tahun === formData.value.tahun
      );
      if (yearExists) {
        errors.value.push("Tahun sudah ada di database.");
      } else {
        const dataToPost = {
          tahun: formData.value.tahun.toString(),
          discount_rate: parseFloat(formData.value.discount_rate),
          corporate_tax_rate: parseFloat(formData.value.corporate_tax_rate),
          status: 1,
        };
        // Kirim permintaan POST ke API
        const response: any = await parameterService.addParameter(dataToPost);
        console.log("POST response:", response.data);
        // Reset formulir
        isModalOpen.value = false;
        formData.value.tahun = currentYear.toString();
        formData.value.discount_rate = "";
        formData.value.corporate_tax_rate = "";
        errors.value = [];
        errors_CT.value = [];
        errors_DT.value = [];
        // Ambil ulang data setelah perubahan
        const data = await fetchData();
        parameter.value = data;
        filteredParameter.value = parameter.value;
        showModalSubmit.value = true;
        setTimeout(() => {
          showModalSubmit.value = false;
        }, 1000);
      }
    } catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  }
};

const generatePageList = computed(() => {
  const maxPages = 5;
  const pageList = [];
  if (navigation.value.totalPages <= maxPages) {
    for (let i = 1; i <= navigation.value.totalPages; i++) {
      pageList.push(i);
    }
  } else if (navigation.value.currentPage <= 3) {
    for (let i = 1; i <= Math.min(navigation.value.totalPages, maxPages - 1); i++) {
      pageList.push(i);
    };
    if (navigation.value.totalPages > maxPages) {
      pageList.push('...');
      pageList.push(navigation.value.totalPages)
    };
  } else if (navigation.value.currentPage >= navigation.value.totalPages - 2) {
    pageList.push(1);
    pageList.push('...');
    for (let i = navigation.value.totalPages - (maxPages - 2); i <= navigation.value.totalPages; i++) {
      pageList.push(i)
    };
  } else {
    pageList.push(1);
    pageList.push('...');
    for (let i = navigation.value.currentPage - 1; i <= navigation.value.currentPage + 1; i++) {
      pageList.push(i)
    };
    pageList.push('...');
    pageList.push(navigation.value.totalPages);
  }
  return pageList;
});
const submitEditForm = async () => {
  errors.value = [] // Mengosongkan pesan kesalahan sebelum validasi
  if (!formData.value.tahun) {
    errors.value.push("Tahun harus diisi.")
  }
  if (!formData.value.discount_rate) {
    errors.value.push("Discount Rate harus diisi.")
  } else {
    const discountRate = parseFloat(formData.value.discount_rate)
    if (isNaN(discountRate) || discountRate <= 0 || discountRate >= 100) {
      errors.value.push(
        "Discount Rate harus berupa angka positif dan tidak lebih dari 100."
      )
    }
  }
  if (!formData.value.corporate_tax_rate) {
    errors.value.push("Corporate Tax Rate harus diisi.")
  } else {
    const corporateTaxRate = parseFloat(formData.value.corporate_tax_rate)
    if (
      isNaN(corporateTaxRate) ||
      corporateTaxRate <= 0 ||
      corporateTaxRate >= 100
    ) {
      errors.value.push(
        "Corporate Tax Rate harus berupa angka positif dan tidak lebih dari 100."
      )
    }
  }
  if (errors.value.length === 0) {
    try {
      // Mengambil data dari formData
      //const statusValue = formData.value.status ? 1 : 0;
      const dataToPut = {
        discount_rate: parseFloat(formData.value.discount_rate),
        corporate_tax_rate: parseFloat(formData.value.corporate_tax_rate),
        status: detailData.value.status,
      };
      // Mengirim permintaan PUT ke API dengan ID parameter yang dipilih
      const idParameter = selectedParameterId.value;
      const response: any = await parameterService.editParameter(idParameter, dataToPut);
      console.log("PUT response:", response.data);
      // Reset formulir setelah berhasil
      formData.value.tahun = currentYear.toString();
      formData.value.discount_rate = "";
      formData.value.corporate_tax_rate = "";
      errors.value = [];
      errors_CT.value = [];
      errors_DT.value = [];
      //formData.value.status = 0;
      // Tutup modal edit setelah berhasil
      isModalEdit.value = false;
      showModalEdit.value = true;
      setTimeout(() => {
        showModalEdit.value = false;
      }, 1000);
      // Ambil ulang data setelah perubahan
      const data = await fetchData();
      parameter.value = data;
      filteredParameter.value = parameter.value;
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  }
};
const closeModal = () => {
  isModalOpen.value = false;
  showModalSubmit.value = false;
  formData.value.tahun = currentYear.toString();
  formData.value.discount_rate = "";
  formData.value.corporate_tax_rate = "";
  errors.value = [];
  errors_CT.value = [];
  errors_DT.value = [];
};
const closeModalEdit = () => {
  isModalEdit.value = false;
  selectedParameterId.value = null; // Reset selectedParameterId
  showModalEdit.value = false;
  // Reset formulir setelah berhasil
  formData.value.tahun = currentYear.toString();
  formData.value.discount_rate = "";
  formData.value.corporate_tax_rate = "";
  errors.value = [];
  errors_CT.value = [];
  errors_DT.value = [];
};
const fetchDetailData = async (Id: string) => {
  try {
    const response: any = await parameterService.getParameterByID(Id);
    detailData.value = response.data; // Menyimpan data detail yang diterima dari API
  } catch (error) {
    console.error("Error fetching detail data:", error);
    throw error;
  }
};
const openEditModals = async (id_parameter: string) => {
  selectedParameterId.value = id_parameter;
  isModalEdit.value = true;
  try {
    // Panggil API untuk mendapatkan data detail
    await fetchDetailData(id_parameter);
    // Inisialisasi formData dengan data yang diterima
    if (detailData.value) {
      formData.value.tahun = detailData.value.tahun;
      formData.value.discount_rate = detailData.value.discount_rate;
      formData.value.corporate_tax_rate = detailData.value.corporate_tax_rate;
      //formData.value.status = detailData.value.data.status
    }
  } catch (error) {
    console.error("Failed to open modal detail:", error);
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const data = await fetchData();
    parameter.value = data;
    filteredParameter.value = parameter.value;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
td {
  padding: 0.85rem;
}

:disabled {
  background-color: #F5F5F5;
  cursor: not-allowed;
}

ul li#pagination.selected {
  background-color: #0099AD;
  border-radius: 6px;
  color: white;
  transition: 300ms;
}

ul li.disabled {
  pointer-events: none;
  cursor: not-allowed;
  color: #D1D1DB;
}
</style>
