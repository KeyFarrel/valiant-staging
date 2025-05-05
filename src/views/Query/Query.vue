<template>
  <Loading v-if="isLoading" />
  <div class="flex flex-col h-full p-6 space-y-8 font-medium bg-white rounded-lg text-md">
    <section class="flex flex-col">
      <div
        class="flex items-center justify-between duration-300 rounded-md cursor-pointer hover:bg-primaryColor hover:bg-opacity-5 active:duration-0 active:outline active:outline-primaryColor"
        @click="isUnitSectionOpen = !isUnitSectionOpen">
        <div class="flex items-center space-x-1.5">
          <div class="w-1 h-10 rounded-md bg-primaryColor"></div>
          <h1 class="text-base font-semibold">Unit</h1>
        </div>
        <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-if="!isUnitSectionOpen">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.04048 11.2071C8.64996 11.5976 8.01679 11.5976 7.62627 11.2071L2.62627 6.20711C2.23574 5.81658 2.23574 5.18342 2.62627 4.79289C3.01679 4.40237 3.64996 4.40237 4.04048 4.79289L8.33337 9.08579L12.6263 4.79289C13.0168 4.40237 13.65 4.40237 14.0405 4.79289C14.431 5.18342 14.431 5.81658 14.0405 6.20711L9.04048 11.2071Z"
            fill="#0099AD" />
        </svg>
        <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-else>
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7.29289 4.79289C7.68342 4.40237 8.31658 4.40237 8.70711 4.79289L13.7071 9.79289C14.0976 10.1834 14.0976 10.8166 13.7071 11.2071C13.3166 11.5976 12.6834 11.5976 12.2929 11.2071L8 6.91421L3.70711 11.2071C3.31658 11.5976 2.68342 11.5976 2.29289 11.2071C1.90237 10.8166 1.90237 10.1834 2.29289 9.79289L7.29289 4.79289Z"
            fill="#0099AD" />
        </svg>
      </div>
      <main v-if="isUnitSectionOpen" class="grid grid-cols-2 gap-5 mt-3">
        <div class="flex flex-col space-y-1.5">
          <label for="" class="font-semibold text-labelColor">Unit Induk / Subholding / Anak Perusahaan</label>
          <select name="" id=""
            class="h-10 text-sm border border-gray-300 rounded-lg cursor-pointer text-textFieldColor">
            <option value="" selected disabled>Pilih Unit Induk / Subholding / Anak Perusahaan
            </option>
          </select>
          <div class="flex items-center space-x-1.5">
            <input type="checkbox" name="" id="" class="w-3 h-3 border border-gray-300 rounded-lg cursor-pointer">
            <label for="" class="text-xs">Pilih Semua</label>
          </div>
        </div>
        <div class="flex flex-col space-y-1.5">
          <label for="" class="font-semibold text-labelColor">Unit Pengelola 2 / Unit Bisnis / SHAP</label>
          <select name="" id=""
            class="h-10 text-sm border border-gray-300 rounded-lg cursor-pointer text-textFieldColor">
            <option value="" selected disabled>Pilih Unit Pengelola 2 / Unit Bisnis / SHAP
            </option>
          </select>
          <div class="flex items-center space-x-1.5">
            <input type="checkbox" name="" id="" class="w-3 h-3 border border-gray-300 rounded-lg cursor-pointer">
            <label for="" class="text-xs">Pilih Semua</label>
          </div>
        </div>
        <div class="flex flex-col space-y-1.5">
          <label for="" class="font-semibold text-labelColor">Kategori Pembangkit</label>
          <select name="" id=""
            class="h-10 text-sm border border-gray-300 rounded-lg cursor-pointer text-textFieldColor">
            <option value="" selected disabled>Pilih Kategori Pembangkit
            </option>
          </select>
          <div class="flex items-center space-x-1.5">
            <input type="checkbox" name="" id="" class="w-3 h-3 border border-gray-300 rounded-lg cursor-pointer">
            <label for="" class="text-xs">Pilih Semua</label>
          </div>
        </div>
        <div class="flex flex-col space-y-1.5">
          <label for="" class="font-semibold text-labelColor">Unit Sentral</label>
          <select name="" id=""
            class="h-10 text-sm border border-gray-300 rounded-lg cursor-pointer text-textFieldColor">
            <option value="" selected disabled>Pilih Unit Sentral
            </option>
          </select>
          <div class="flex items-center space-x-1.5">
            <input type="checkbox" name="" id="" class="w-3 h-3 border border-gray-300 rounded-lg cursor-pointer">
            <label for="" class="text-xs">Pilih Semua</label>
          </div>
        </div>
        <div class="flex flex-col space-y-1.5 col-span-2">
          <label for="" class="font-semibold text-labelColor">Unit Mesin</label>
          <select name="" id=""
            class="h-10 text-sm border border-gray-300 rounded-lg cursor-pointer text-textFieldColor">
            <option value="" selected disabled>Pilih Unit Mesin
            </option>
          </select>
          <div class="flex items-center space-x-1.5">
            <input type="checkbox" name="" id="" class="w-3 h-3 border border-gray-300 rounded-lg cursor-pointer">
            <label for="" class="text-xs">Pilih Semua</label>
          </div>
        </div>
      </main>
    </section>
    <section class="flex flex-col">
      <div
        class="flex items-center justify-between duration-300 rounded-md cursor-pointer hover:bg-primaryColor hover:bg-opacity-5 active:duration-0 active:outline active:outline-primaryColor"
        @click="isDataSectionOpen = !isDataSectionOpen">
        <div class="flex items-center space-x-1.5">
          <div class="w-1 h-10 rounded-md bg-primaryColor"></div>
          <h1 class="text-base font-semibold">Data</h1>
        </div>
        <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-if="!isDataSectionOpen">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.04048 11.2071C8.64996 11.5976 8.01679 11.5976 7.62627 11.2071L2.62627 6.20711C2.23574 5.81658 2.23574 5.18342 2.62627 4.79289C3.01679 4.40237 3.64996 4.40237 4.04048 4.79289L8.33337 9.08579L12.6263 4.79289C13.0168 4.40237 13.65 4.40237 14.0405 4.79289C14.431 5.18342 14.431 5.81658 14.0405 6.20711L9.04048 11.2071Z"
            fill="#0099AD" />
        </svg>
        <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-else>
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7.29289 4.79289C7.68342 4.40237 8.31658 4.40237 8.70711 4.79289L13.7071 9.79289C14.0976 10.1834 14.0976 10.8166 13.7071 11.2071C13.3166 11.5976 12.6834 11.5976 12.2929 11.2071L8 6.91421L3.70711 11.2071C3.31658 11.5976 2.68342 11.5976 2.29289 11.2071C1.90237 10.8166 1.90237 10.1834 2.29289 9.79289L7.29289 4.79289Z"
            fill="#0099AD" />
        </svg>
      </div>
      <main v-if="isDataSectionOpen" class="flex flex-col space-y-5">
        <div class="grid grid-cols-4 gap-5 mt-3">
          <div class="flex flex-col space-y-1.5">
            <label for="" class="font-semibold text-labelColor">Table Name</label>
            <select name="" id=""
              class="h-10 text-sm border border-gray-300 rounded-lg cursor-pointer text-textFieldColor">
              <option value="" selected disabled>Pilih Table Name
              </option>
            </select>
          </div>
          <div class="flex flex-col space-y-1.5">
            <label for="" class="font-semibold text-labelColor">Field Name</label>
            <select name="" id=""
              class="h-10 text-sm border border-gray-300 rounded-lg cursor-pointer text-textFieldColor">
              <option value="" selected disabled>Pilih Field Name
              </option>
            </select>
          </div>
          <div class="flex flex-col space-y-1.5">
            <label for="" class="font-semibold text-labelColor">Operation</label>
            <select name="" id=""
              class="h-10 text-sm border border-gray-300 rounded-lg cursor-pointer text-textFieldColor">
              <option value="" selected disabled>Pilih Operation
              </option>
            </select>
          </div>
          <div class="flex flex-col space-y-1.5">
            <label for="" class="font-semibold text-labelColor">Table Name</label>
            <input type="text" name="" id="" placeholder="Contoh : 10"
              class="h-10 text-sm border border-gray-300 rounded-lg text-textFieldColor">
          </div>
        </div>
        <div class="flex flex-row space-x-5">
          <button
            class="flex flex-row items-center px-3 py-2 font-semibold border rounded-lg text-warningColor border-warningColor">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M7.00042 1.89323C6.68251 1.89323 6.36581 1.89831 6.0504 1.9084C5.72055 1.91895 5.44283 2.17603 5.40154 2.52054C5.93085 2.49135 6.46394 2.47656 7.00042 2.47656C7.53691 2.47656 8.06999 2.49135 8.5993 2.52054C8.55802 2.17603 8.28029 1.91895 7.95045 1.9084C7.63503 1.89831 7.31833 1.89323 7.00042 1.89323ZM9.77125 2.60918C9.771 1.6219 9.00508 0.774876 7.98775 0.742333C7.6599 0.731845 7.33077 0.726562 7.00042 0.726562C6.67007 0.726562 6.34094 0.731845 6.0131 0.742333C4.99576 0.774876 4.22984 1.6219 4.22959 2.60918C3.71471 2.65872 3.20378 2.72193 2.69719 2.79843C2.49353 2.82919 2.29058 2.8621 2.08836 2.89713C1.77092 2.95211 1.55816 3.25402 1.61315 3.57146C1.66604 3.87681 1.9474 4.08529 2.25128 4.0518L2.82559 11.5178C2.90157 12.5055 3.72519 13.2682 4.71584 13.2682H9.285C10.2756 13.2682 11.0993 12.5055 11.1753 11.5178L11.7496 4.0518C12.0534 4.0853 12.3348 3.87681 12.3877 3.57146C12.4427 3.25402 12.2299 2.95211 11.9125 2.89713C11.7103 2.8621 11.5073 2.82919 11.3037 2.79843C10.7971 2.72193 10.2861 2.65872 9.77125 2.60918ZM10.5929 3.87642C10.1134 3.81368 9.63001 3.76332 9.14298 3.72568C8.43608 3.67106 7.72156 3.64323 7.00042 3.64323C6.27929 3.64323 5.56477 3.67106 4.85786 3.72568C4.37083 3.76332 3.8874 3.81368 3.4079 3.87642L3.98882 11.4283C4.01804 11.8082 4.33482 12.1016 4.71584 12.1016H9.285C9.66602 12.1016 9.9828 11.8082 10.012 11.4283L10.5929 3.87642ZM5.37944 4.66449C5.70137 4.65211 5.97238 4.90305 5.98477 5.22498L6.18669 10.475C6.19907 10.7969 5.94813 11.0679 5.62621 11.0803C5.30428 11.0927 5.03327 10.8417 5.02088 10.5198L4.81896 5.26981C4.80658 4.94789 5.05752 4.67688 5.37944 4.66449ZM8.6214 4.66449C8.94333 4.67688 9.19426 4.94789 9.18188 5.26981L8.97996 10.5198C8.96758 10.8417 8.69656 11.0927 8.37464 11.0803C8.05271 11.0679 7.80177 10.7969 7.81415 10.475L8.01608 5.22498C8.02846 4.90305 8.29947 4.65211 8.6214 4.66449Z"
                fill="#FF5656" />
            </svg>
            Hapus Data</button>
          <button
            class="flex flex-row items-center px-3 py-2 font-semibold border rounded-lg text-primaryColor border-primaryColor">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
              <g clip-path="url(#clip0_4490_19809)">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M7 0.875C7.48325 0.875 7.875 1.26675 7.875 1.75V6.125H12.25C12.7332 6.125 13.125 6.51675 13.125 7C13.125 7.48325 12.7332 7.875 12.25 7.875H7.875V12.25C7.875 12.7332 7.48325 13.125 7 13.125C6.51675 13.125 6.125 12.7332 6.125 12.25V7.875H1.75C1.26675 7.875 0.875 7.48325 0.875 7C0.875 6.51675 1.26675 6.125 1.75 6.125H6.125V1.75C6.125 1.26675 6.51675 0.875 7 0.875Z"
                  fill="#0099AD" />
              </g>
              <defs>
                <clipPath id="clip0_4490_19809">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Tambah Data</button>
        </div>
        <div class="flex flex-row justify-end space-x-5">
          <button class="px-3 py-2 font-semibold border rounded-lg text-warningColor border-warningColor">Reset</button>
          <button
            class="px-3 py-2 font-semibold text-white duration-300 border rounded-lg bg-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor">Terapkan</button>
        </div>
      </main>
    </section>
    <section class="flex flex-col">
      <div
        class="flex items-center justify-between duration-300 rounded-md cursor-pointer hover:bg-primaryColor hover:bg-opacity-5 active:duration-0 active:outline active:outline-primaryColor"
        @click="isQuerySectionOpen = !isQuerySectionOpen">
        <div class="flex items-center space-x-1.5">
          <div class="w-1 h-10 rounded-md bg-primaryColor"></div>
          <h1 class="text-base font-semibold">Query</h1>
        </div>
        <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-if="!isQuerySectionOpen">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.04048 11.2071C8.64996 11.5976 8.01679 11.5976 7.62627 11.2071L2.62627 6.20711C2.23574 5.81658 2.23574 5.18342 2.62627 4.79289C3.01679 4.40237 3.64996 4.40237 4.04048 4.79289L8.33337 9.08579L12.6263 4.79289C13.0168 4.40237 13.65 4.40237 14.0405 4.79289C14.431 5.18342 14.431 5.81658 14.0405 6.20711L9.04048 11.2071Z"
            fill="#0099AD" />
        </svg>
        <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-else>
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7.29289 4.79289C7.68342 4.40237 8.31658 4.40237 8.70711 4.79289L13.7071 9.79289C14.0976 10.1834 14.0976 10.8166 13.7071 11.2071C13.3166 11.5976 12.6834 11.5976 12.2929 11.2071L8 6.91421L3.70711 11.2071C3.31658 11.5976 2.68342 11.5976 2.29289 11.2071C1.90237 10.8166 1.90237 10.1834 2.29289 9.79289L7.29289 4.79289Z"
            fill="#0099AD" />
        </svg>
      </div>
      <main v-if="isQuerySectionOpen" class="flex flex-col mt-3 space-y-5">
        <div class="flex flex-col space-y-1.5">
          <span class="font-semibold text-labelColor">SQL Query on Database</span>
          <textarea name="" id="" cols="50" rows="5" placeholder="Contoh : Select * From Rekap Kertas Kerja Data"
            class="text-sm border border-gray-300 rounded-lg resize-none text-textFieldColor"></textarea>
        </div>
        <div class="flex flex-row justify-end space-x-5">
          <button class="px-3 py-2 font-semibold border rounded-lg text-warningColor border-warningColor">Reset
            Query</button>
          <button
            class="px-3 py-2 font-semibold text-white duration-300 border rounded-lg bg-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor">Terapkan
            Query</button>
        </div>
      </main>
    </section>
    <section class="flex flex-col">
      <div class="flex items-center space-x-1.5">
        <div class="w-1 h-10 rounded-md bg-primaryColor"></div>
        <h1 class="text-base font-semibold">Pratinjau Data</h1>
      </div>
      <main class="flex flex-col mt-3 space-y-5">
        <table class="border table-auto">
          <thead>
            <tr class="text-sm border text-primaryColor">
              <th class="text-left">No</th>
              <th class="text-left">Unit Sentral</th>
              <th class="text-left">Unit Mesin</th>
              <th class="text-left">Table Name</th>
              <th class="text-left">Field Name</th>
              <th class="text-left">Operation</th>
              <th class="text-left">Condition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>PLTA Cikalong</td>
              <td>Unit 1</td>
              <td>Rekap Kertas Kerja</td>
              <td>IRR</td>
              <td>{{ '<' }}</td>
              <td>9</td>
            </tr>
            <tr>
              <td>2</td>
              <td>PLTA Cikalong</td>
              <td>Unit 2</td>
              <td>Rekap Kertas Kerja</td>
              <td>IRR</td>
              <td>{{ '<' }}</td>
              <td>9</td>
            </tr>
            <tr>
              <td>3</td>
              <td>PLTA Cikalong</td>
              <td>Unit 3</td>
              <td>Rekap Kertas Kerja</td>
              <td>IRR</td>
              <td>{{ '<' }}</td>
              <td>9</td>
            </tr>
          </tbody>
        </table>
        <button
          class="flex flex-row items-center px-3 py-2 ml-auto font-semibold text-white duration-300 border rounded-lg bg-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.12484 3.20573C4.75563 3.20573 3.64567 4.31569 3.64567 5.6849C3.64567 5.84297 3.66039 5.99707 3.68838 6.14607C3.74235 6.43338 3.57531 6.71628 3.29765 6.80778C2.48269 7.07636 1.89567 7.84408 1.89567 8.7474C1.89567 9.87498 2.80976 10.7891 3.93734 10.7891H10.4998C11.3858 10.7891 12.104 10.0709 12.104 9.1849C12.104 8.50047 11.6751 7.91476 11.0694 7.68463C10.7737 7.57228 10.6215 7.24473 10.7262 6.94625C10.7683 6.82609 10.7915 6.69632 10.7915 6.5599C10.7915 5.91556 10.2692 5.39323 9.62484 5.39323C9.49811 5.39323 9.3772 5.41322 9.26443 5.4498C9.11213 5.49919 8.94621 5.48381 8.80558 5.40726C8.66496 5.33071 8.56197 5.19971 8.52078 5.04499C8.23872 3.98554 7.2721 3.20573 6.12484 3.20573ZM2.479 5.6849C2.479 3.67136 4.1113 2.03906 6.12484 2.03906C7.6224 2.03906 8.908 2.94157 9.46935 4.23168C9.52079 4.22829 9.57263 4.22656 9.62484 4.22656C10.9135 4.22656 11.9582 5.27123 11.9582 6.5599C11.9582 6.64761 11.9533 6.73433 11.9438 6.81976C12.7391 7.30629 13.2707 8.18299 13.2707 9.1849C13.2707 10.7152 12.0301 11.9557 10.4998 11.9557H3.93734C2.16542 11.9557 0.729004 10.5193 0.729004 8.7474C0.729004 7.49776 1.44314 6.41609 2.48449 5.88628C2.48085 5.81957 2.479 5.75242 2.479 5.6849ZM6.99984 5.10156C7.322 5.10156 7.58317 5.36273 7.58317 5.6849V8.2141L8.33736 7.45992C8.56516 7.23211 8.93451 7.23211 9.16232 7.45992C9.39012 7.68772 9.39012 8.05707 9.16232 8.28487L7.41232 10.0349C7.18451 10.2627 6.81516 10.2627 6.58736 10.0349L4.83736 8.28487C4.60955 8.05707 4.60955 7.68772 4.83736 7.45992C5.06516 7.23211 5.43451 7.23211 5.66232 7.45992L6.4165 8.2141V5.6849C6.4165 5.36273 6.67767 5.10156 6.99984 5.10156Z"
              fill="white" />
          </svg>
          Export Data
        </button>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Loading from "@/components/ui/LoadingSpinner.vue";

const isLoading = ref(false);
const isUnitSectionOpen = ref(true);
const isDataSectionOpen = ref(true);
const isQuerySectionOpen = ref(true);
</script>

<style scoped>
th {
  font-weight: 700;
  padding: 1rem;
}

td {
  padding: 1rem;
}
</style>
