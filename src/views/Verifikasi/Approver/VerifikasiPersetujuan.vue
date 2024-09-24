<template>
  <Loading v-if="isLoading" />
  <div class="min-h-full p-6 space-y-5 bg-white border rounded-lg">
    <TabsWrapper :isLihatGrafik="false" :laman-data="false" class="ml-1">
      <TabItem title="Kertas Kerja">
        <div class="flex flex-row items-center justify-between mb-4">
          <div class="flex flex-row space-x-4">
            <SearchBox class="w-60" @on-key-enter="changeDataKK" @on-click="changeDataKK" @on-input="changeDataKK"
              v-model="searchQKK" />
            <button type="button" id="hover-button"
              class="text-primaryColor relative bg-white border border-primaryColor hover:bg-primaryColor focus:ring-2 focus:ring-[#9ddee7] ml-4 p-2.5 font-medium rounded-lg text-sm flex justify-center items-center duration-300 hover:text-white"
              @click="showModalKK = !showModalKK">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="mr-2">
                <path
                  d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
                  fill="#0099AD" />
              </svg>
              Filter
              <div v-if="
                authService.checkLevel() === 'Admin' ||
                  authService.checkLevel() === 'Pusat'
                  ? filterKK.selectedPengelola.length ||
                  filterKK.selectedPersetujuan.length || filterKK.selectedPembina.length
                  : authService.checkLevel() === 'Pengelola'
                    ? filterKK.selectedPembina.length ||
                    filterKK.selectedPersetujuan.length
                    : filterKK.selectedPersetujuan.length
              "
                class="absolute z-10 border-2 border-[#FFE5E6] w-2.5 h-2.5 rounded-full right-0.5 top-0.5 bg-warningColor">
              </div>
            </button>
            <ModalWrapper :showModal="showModalKK" :width="'w-[500px]'" :height="'h-auto'">
              <div class="flex flex-col space-y-5">
                <div class="flex justify-between">
                  <div class="flex items-center space-x-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4.6665 7.33073H11.3332V8.66406H4.6665V7.33073ZM2.6665 4.66406H13.3332V5.9974H2.6665V4.66406ZM6.6665 9.9974H9.33317V11.3307H6.6665V9.9974Z"
                        fill="#333333" />
                    </svg>
                    <span class="text-base font-semibold text-primaryTextColor">Filter</span>
                  </div>
                  <button @click="showModalKK = false">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="
                authService.checkLevel() === 'Admin' ||
                authService.checkLevel() === 'Pusat'
              " class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">
                  Unit Pengelola
                </h3>
                <el-select v-model="filterKK.selectedPengelola" multiple clearable collapse-tags
                  placeholder="Pilih Unit Pengelola" popper-class="custom-header" :max-collapse-tags="5"
                  class="w-full text-primaryTextColor">
                  <template #header>
                    <el-checkbox v-model="checkPengelolaKK" :indeterminate="indeterminatePengelola"
                      @change="handleCheckPengelolaKK">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPengelola" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div v-if="
                authService.checkLevel() === 'Admin' ||
                authService.checkLevel() === 'Pusat' ||
                authService.checkLevel() === 'Pengelola'
              " class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">Unit Pembina</h3>
                <el-select v-model="filterKK.selectedPembina" multiple clearable collapse-tags
                  placeholder="Pilih Unit Pembina" popper-class="custom-header" :max-collapse-tags="5"
                  class="w-full text-primaryTextColor">
                  <template #header>
                    <el-checkbox v-model="checkPembinaKK" :indeterminate="indeterminatePembina"
                      @change="handleCheckPembinaKK">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPembina" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">
                  Status Persetujuan
                </h3>
                <el-select v-model="filterKK.selectedPersetujuan" multiple clearable collapse-tags
                  placeholder="Pilih Status Persetujuan" popper-class="custom-header" :max-collapse-tags="6"
                  class="w-full text-primaryTextColor">
                  <template #header>
                    <el-checkbox v-model="checkPersetujuanKK" :indeterminate="indeterminateStatus"
                      @change="handleCheckPersetujuanKK">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPersetujuan" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <hr class="w-full my-4" />
              <div class="flex justify-end">
                <div class="flex items-start space-x-2">
                  <button type="submit" @click="
                    filterKK.selectedPengelola = [];
                  filterKK.selectedPembina = [];
                  filterKK.selectedPersetujuan = [];
                  "
                    class="px-5 py-2 text-sm font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor hover:text-white">
                    Reset
                  </button>
                  <button type="submit" @click="changeDataKK"
                    class="w-full text-white bg-[#0099AD] hover:bg-hoverColor duration-300 active:ring-2 active:outline-none active:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:active:ring-[#005A66]">
                    Terapkan
                  </button>
                </div>
              </div>
            </ModalWrapper>
          </div>
          <div class="flex flex-row items-center ml-4 space-x-3">
            <label class="text-sm font-semibold text-labelColor" for="">Periode</label>
            <VueDatePicker class="mr-3 date-picker" v-model="yearPicked" :clearable="false" year-picker :teleport="true"
              @update:model-value="fetchPersetujuanKK()" />
          </div>
        </div>
        <TableComponent>
          <template v-slot:table-header>
            <tr class="text-xs">
              <th class="text-center border-r">No</th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Unit Pengelola</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Unit Pembina</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Unit Sentral</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Unit Mesin</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">IRR on Equity (%)</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">NPV on Equity (Rp Juta)</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Status</h1>
                </div>
              </th>
              <th class="text-center">Aksi</th>
            </tr>
          </template>
          <template v-slot:table-body v-if="persetujuanKK.length === 0">
            <tr class="text-xs text-gray-900 border-b">
              <td colspan="9">
                <Empty />
              </td>
            </tr>
          </template>
          <template v-slot:table-body v-else>
            <tr class="text-xs text-gray-900 border-b hover:bg-gray-100" v-for="(item, index) in persetujuanKK"
              :key="index">
              <td scope="row" class="text-center whitespace-nowrap">
                {{ index + 1 }}
              </td>
              <td v-if="pengelolaList.length" class="text-left">
                {{
                  pengelolaList.filter(
                    (pengelola: any) =>
                      pengelola.kode_pengelola === item.kode_pengelola
                  )[0]
                    ? pengelolaList.filter(
                      (pengelola: any) =>
                        pengelola.kode_pengelola === item.kode_pengelola
                    )[0].pengelola
                    : "-"
                }}
              </td>
              <td class="text-left">{{ item.pembina }}</td>
              <td class="text-left">{{ item.sentral }}</td>
              <td class="text-left">{{ item.mesin }}</td>
              <td class="text-right">
                {{
                  item.irr_on_equity === ""
                    ? "NUM"
                    : globalFormat.formatRupiah(item.irr_on_equity)
                }}
              </td>
              <td class="text-right">
                {{ globalFormat.formatRupiah(item.npv_on_equity) }}
              </td>
              <td class="flex items-center justify-center text-center">
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
                  v-if="item.status_approval === 'Ditolak T1'">
                  Ditolak oleh Pembina
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
                  v-else-if="item.status_approval === 'Ditolak T2'">
                  Ditolak oleh Pengelola
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#EDF7F2] border border-[#C7E5D7] rounded-md text-[#397E5D]"
                  v-else-if="item.status_approval === 'Disetujui'">
                  Disetujui
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#B7CAF5] border border-[#B7CAF5] rounded-md text-[#1D55D7]"
                  v-else-if="item.status_approval === 'Draft'">
                  Draft
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
                  v-else-if="item.status_approval === 'Menunggu Persetujuan T1'">
                  Menunggu Persetujuan Pembina
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
                  v-else-if="item.status_approval === 'Menunggu Persetujuan T2'">
                  Menunggu Persetujuan Pengelola
                </div>
              </td>
              <td class="text-center">
                <div>
                  <RouterLink v-if="
                    (authService.checkLevel() === 'Admin' || (authService.checkLevel() === 'Pembina' && authService.checkRole() === 'Input')) &&
                    (item.status_approval === 'Draft' ||
                      item.status_approval === 'Ditolak T1' ||
                      item.status_approval === 'Ditolak T2')
                  " :to="{
                    name: 'persetujuan-kk',
                    params: {
                      id:
                        nodeMode === 'production'
                          ? encryptStorage.encryptValue(item.id_mesin)
                          : item.id_mesin,
                    },
                    query: { id_sentral: item.id_sentral, tahun: item.tahun },
                  }">
                    <button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M8.00051 3.66536C5.20279 3.66536 2.82714 5.47986 1.98946 7.99808C1.98897 7.99955 1.98897 8.00136 1.98946 8.00283C2.82818 10.5192 5.20293 12.332 7.99934 12.332C10.7971 12.332 13.1727 10.5175 14.0104 7.99932C14.0109 7.99785 14.0109 7.99604 14.0104 7.99457C13.1717 5.47817 10.7969 3.66536 8.00051 3.66536ZM0.72429 7.57722C1.73777 4.5305 4.61153 2.33203 8.00051 2.33203C11.3879 2.33203 14.2606 4.52846 15.2753 7.57297C15.3669 7.84785 15.367 8.14524 15.2756 8.42018C14.2621 11.4669 11.3883 13.6654 7.99934 13.6654C4.61194 13.6654 1.73927 11.4689 0.72454 8.42443C0.632921 8.14955 0.632834 7.85216 0.72429 7.57722ZM7.99997 6.66536C7.26359 6.66536 6.66663 7.26232 6.66663 7.9987C6.66663 8.73508 7.26359 9.33203 7.99997 9.33203C8.73635 9.33203 9.3333 8.73508 9.3333 7.9987C9.3333 7.26232 8.73635 6.66536 7.99997 6.66536ZM5.3333 7.9987C5.3333 6.52594 6.52721 5.33203 7.99997 5.33203C9.47273 5.33203 10.6666 6.52594 10.6666 7.9987C10.6666 9.47146 9.47273 10.6654 7.99997 10.6654C6.52721 10.6654 5.3333 9.47146 5.3333 7.9987Z"
                          fill="#0099AD" />
                      </svg>
                    </button>
                  </RouterLink>
                  <RouterLink v-else :to="{
                    name: 'app-kk-mesin',
                    params: {
                      id:
                        nodeMode === 'production'
                          ? encryptStorage.encryptValue(item.id_mesin)
                          : item.id_mesin,
                    },
                    query: { id_sentral: item.id_sentral, tahun: item.tahun },
                  }">
                    <button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M8.00051 3.66536C5.20279 3.66536 2.82714 5.47986 1.98946 7.99808C1.98897 7.99955 1.98897 8.00136 1.98946 8.00283C2.82818 10.5192 5.20293 12.332 7.99934 12.332C10.7971 12.332 13.1727 10.5175 14.0104 7.99932C14.0109 7.99785 14.0109 7.99604 14.0104 7.99457C13.1717 5.47817 10.7969 3.66536 8.00051 3.66536ZM0.72429 7.57722C1.73777 4.5305 4.61153 2.33203 8.00051 2.33203C11.3879 2.33203 14.2606 4.52846 15.2753 7.57297C15.3669 7.84785 15.367 8.14524 15.2756 8.42018C14.2621 11.4669 11.3883 13.6654 7.99934 13.6654C4.61194 13.6654 1.73927 11.4689 0.72454 8.42443C0.632921 8.14955 0.632834 7.85216 0.72429 7.57722ZM7.99997 6.66536C7.26359 6.66536 6.66663 7.26232 6.66663 7.9987C6.66663 8.73508 7.26359 9.33203 7.99997 9.33203C8.73635 9.33203 9.3333 8.73508 9.3333 7.9987C9.3333 7.26232 8.73635 6.66536 7.99997 6.66536ZM5.3333 7.9987C5.3333 6.52594 6.52721 5.33203 7.99997 5.33203C9.47273 5.33203 10.6666 6.52594 10.6666 7.9987C10.6666 9.47146 9.47273 10.6654 7.99997 10.6654C6.52721 10.6654 5.3333 9.47146 5.3333 7.9987Z"
                          fill="#0099AD" />
                      </svg>
                    </button>
                  </RouterLink>
                </div>
              </td>
            </tr>
          </template>
        </TableComponent>
        <div class="flex items-center justify-between w-full mt-3 mb-6">
          <div class="flex items-center space-x-2 text-sm">
            <span>Menampilkan</span>
            <select v-model="navigationKK.limit" name="" id=""
              class="text-sm text-gray-500 border-gray-300 rounded-lg cursor-pointer" @change="changePageLimit($event)">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
            <span>dari
              <span class="font-bold">{{ navigationKK.totalRecords }}</span>
              data</span>
          </div>
          <ul class="flex items-center space-x-3">
            <li>
              <button @click="goToPrevious" :disabled="navigationKK.currentPage === 1"
                :class="{ 'text-gray-500': navigationKK.currentPage === 1 }"
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
            <li id="pagination" v-for="(item, index) in generatePageList" :key="index" :class="{
              selected: item === navigationKK.currentPage,
              disabled: item === '...',
            }"
              class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
              @click="goToPage(item)">
              {{ item }}
            </li>
            <li>
              <button @click="goToNext" :disabled="navigationKK.currentPage === navigationKK.totalPages"
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
      </TabItem>
      <TabItem title="Feasibility Study">
        <div class="flex flex-row items-center justify-between mb-4">
          <div class="flex flex-row space-x-4">
            <SearchBox class="w-60" @on-key-enter="changeFS" @on-click="changeFS" @on-input="changeFS"
              v-model="searchQFS" />
            <button type="button" id="hover-button"
              class="text-primaryColor relative bg-white border border-primaryColor hover:bg-primaryColor focus:ring-2 focus:ring-[#9ddee7] ml-4 p-2.5 font-medium rounded-lg text-sm flex justify-center items-center duration-300 hover:text-white"
              @click="showModalFS = !showModalFS">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="mr-2">
                <path
                  d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
                  fill="#0099AD" />
              </svg>
              Filter
              <div v-if="
                authService.checkLevel() === 'Admin' ||
                  authService.checkLevel() === 'Pusat'
                  ? filterFS.selectedPengelola.length ||
                  filterFS.selectedPersetujuan.length || filterFS.selectedPembina.length
                  : authService.checkLevel() === 'Pengelola'
                    ? filterFS.selectedPembina.length ||
                    filterFS.selectedPersetujuan.length
                    : filterFS.selectedPersetujuan.length
              "
                class="absolute z-10 border-2 border-[#FFE5E6] w-2.5 h-2.5 rounded-full right-0.5 top-0.5 bg-warningColor">
              </div>
            </button>
            <ModalWrapper :showModal="showModalFS" :width="'w-[500px]'" :height="'h-auto'">
              <div class="flex flex-col space-y-5">
                <div class="flex justify-between">
                  <div class="flex items-center space-x-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4.6665 7.33073H11.3332V8.66406H4.6665V7.33073ZM2.6665 4.66406H13.3332V5.9974H2.6665V4.66406ZM6.6665 9.9974H9.33317V11.3307H6.6665V9.9974Z"
                        fill="#333333" />
                    </svg>
                    <span class="text-base font-semibold text-primaryTextColor">Filter</span>
                  </div>
                  <button @click="showModalFS = false">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="
                authService.checkLevel() === 'Admin' ||
                authService.checkLevel() === 'Pusat'
              " class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">
                  Unit Pengelola
                </h3>
                <el-select v-model="filterFS.selectedPengelola" multiple clearable collapse-tags
                  placeholder="Pilih Unit Pengelola" popper-class="custom-header" :max-collapse-tags="5"
                  class="w-full text-primaryTextColor">
                  <template #header>
                    <el-checkbox v-model="checkPengelolaFS" :indeterminate="indeterminatePengelola"
                      @change="handleCheckPengelolaFS">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPengelola" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div v-if="
                authService.checkLevel() === 'Admin' ||
                authService.checkLevel() === 'Pusat' ||
                authService.checkLevel() === 'Pengelola'
              " class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">Unit Pembina</h3>
                <el-select v-model="filterFS.selectedPembina" multiple clearable collapse-tags
                  placeholder="Pilih Unit Pembina" popper-class="custom-header" :max-collapse-tags="5"
                  class="w-full text-primaryTextColor">
                  <template #header>
                    <el-checkbox v-model="checkPembinaFS" :indeterminate="indeterminatePembina"
                      @change="handleCheckPembinaFS">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPembina" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">
                  Status Persetujuan
                </h3>
                <el-select v-model="filterFS.selectedPersetujuan" multiple clearable collapse-tags
                  placeholder="Pilih Status Persetujuan" popper-class="custom-header" :max-collapse-tags="6"
                  class="w-full text-primaryTextColor">
                  <template #header>
                    <el-checkbox v-model="checkPersetujuanFS" :indeterminate="indeterminateStatus"
                      @change="handleCheckPersetujuanFS">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPersetujuan" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <hr class="w-full my-4" />
              <div class="flex justify-end">
                <div class="flex items-start space-x-2">
                  <button type="submit" @click="
                    filterFS.selectedPengelola = [];
                  filterFS.selectedPembina = [];
                  filterFS.selectedPersetujuan = [];
                  "
                    class="px-5 py-2 text-sm font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor hover:text-white">
                    Reset
                  </button>
                  <button type="submit" @click="changeFS"
                    class="w-full text-white bg-[#0099AD] hover:bg-hoverColor duration-300 active:ring-2 active:outline-none active:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:active:ring-[#005A66]">
                    Terapkan
                  </button>
                </div>
              </div>
            </ModalWrapper>
          </div>
        </div>
        <TableComponent>
          <template v-slot:table-header>
            <tr class="text-xs">
              <th class="text-center border-r">No</th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Unit Pengelola</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Unit Pembina</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Unit Sentral</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Unit Mesin</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">IRR on Equity (%)</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">NPV on Equity (Rp Juta)</h1>
                </div>
              </th>
              <th class="border-r">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Status</h1>
                </div>
              </th>
              <th class="text-center">Aksi</th>
            </tr>
          </template>
          <template v-slot:table-body v-if="persetujuanFS.length === 0">
            <tr class="text-xs text-gray-900 border-b">
              <td colspan="9">
                <Empty />
              </td>
            </tr>
          </template>
          <template v-slot:table-body v-else>
            <tr class="text-xs text-gray-900 border-b hover:bg-gray-100" v-for="(item, index) in persetujuanFS"
              :key="index">
              <td scope="row" class="text-center whitespace-nowrap">
                {{ index + 1 }}
              </td>
              <td v-if="pengelolaList.length" class="text-left">
                {{
                  pengelolaList.filter(
                    (pengelola: any) =>
                      pengelola.kode_pengelola === item.kode_pengelola
                  )[0]
                    ? pengelolaList.filter(
                      (pengelola: any) =>
                        pengelola.kode_pengelola === item.kode_pengelola
                    )[0].pengelola
                    : "-"
                }}
              </td>
              <td class="text-left">{{ item.pembina }}</td>
              <td class="text-left">{{ item.sentral }}</td>
              <td class="text-left">{{ item.mesin }}</td>
              <td class="text-right">
                {{
                  item.irr_on_equity === ""
                    ? "NUM"
                    : globalFormat.formatRupiah(item.irr_on_equity)
                }}
              </td>
              <td class="text-right">
                {{ globalFormat.formatRupiah(item.npv_on_equity) }}
              </td>
              <td class="flex items-center justify-center text-center">
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
                  v-if="item.status_approval === 'Ditolak T1'">
                  Ditolak oleh Pembina
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
                  v-else-if="item.status_approval === 'Ditolak T2'">
                  Ditolak oleh Pengelola
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#EDF7F2] border border-[#C7E5D7] rounded-md text-[#397E5D]"
                  v-else-if="item.status_approval === 'Disetujui'">
                  Disetujui
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#B7CAF5] border border-[#B7CAF5] rounded-md text-[#1D55D7]"
                  v-else-if="item.status_approval === 'Draft'">
                  Draft
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
                  v-else-if="item.status_approval === 'Menunggu Persetujuan T1'">
                  Menunggu Persetujuan Pembina
                </div>
                <div
                  class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
                  v-else-if="item.status_approval === 'Menunggu Persetujuan T2'">
                  Menunggu Persetujuan Pengelola
                </div>
              </td>
              <td class="text-center">
                <div v-if="
                  (authService.checkLevel() === 'Admin' || (authService.checkLevel() === 'Pembina' && authService.checkRole() === 'Input')) &&
                  (item.status_approval === 'Draft' ||
                    item.status_approval === 'Ditolak T1' ||
                    item.status_approval === 'Ditolak T2')
                ">
                  <RouterLink :to="{
                    name: 'persetujuan-fs',
                    params: {
                      id:
                        nodeMode === 'production'
                          ? encryptStorage.encryptValue(item.id_mesin)
                          : item.id_mesin,
                    },
                    query: { id_sentral: item.id_sentral },
                  }">
                    <button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M8.00051 3.66536C5.20279 3.66536 2.82714 5.47986 1.98946 7.99808C1.98897 7.99955 1.98897 8.00136 1.98946 8.00283C2.82818 10.5192 5.20293 12.332 7.99934 12.332C10.7971 12.332 13.1727 10.5175 14.0104 7.99932C14.0109 7.99785 14.0109 7.99604 14.0104 7.99457C13.1717 5.47817 10.7969 3.66536 8.00051 3.66536ZM0.72429 7.57722C1.73777 4.5305 4.61153 2.33203 8.00051 2.33203C11.3879 2.33203 14.2606 4.52846 15.2753 7.57297C15.3669 7.84785 15.367 8.14524 15.2756 8.42018C14.2621 11.4669 11.3883 13.6654 7.99934 13.6654C4.61194 13.6654 1.73927 11.4689 0.72454 8.42443C0.632921 8.14955 0.632834 7.85216 0.72429 7.57722ZM7.99997 6.66536C7.26359 6.66536 6.66663 7.26232 6.66663 7.9987C6.66663 8.73508 7.26359 9.33203 7.99997 9.33203C8.73635 9.33203 9.3333 8.73508 9.3333 7.9987C9.3333 7.26232 8.73635 6.66536 7.99997 6.66536ZM5.3333 7.9987C5.3333 6.52594 6.52721 5.33203 7.99997 5.33203C9.47273 5.33203 10.6666 6.52594 10.6666 7.9987C10.6666 9.47146 9.47273 10.6654 7.99997 10.6654C6.52721 10.6654 5.3333 9.47146 5.3333 7.9987Z"
                          fill="#0099AD" />
                      </svg>
                    </button>
                  </RouterLink>
                </div>
                <div v-else>
                  <RouterLink :to="{
                    name: 'app-fs-mesin',
                    params: {
                      id:
                        nodeMode === 'production'
                          ? encryptStorage.encryptValue(item.id_mesin)
                          : item.id_mesin,
                    },
                    query: { id_sentral: item.id_sentral },
                  }">
                    <button>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M8.00051 3.66536C5.20279 3.66536 2.82714 5.47986 1.98946 7.99808C1.98897 7.99955 1.98897 8.00136 1.98946 8.00283C2.82818 10.5192 5.20293 12.332 7.99934 12.332C10.7971 12.332 13.1727 10.5175 14.0104 7.99932C14.0109 7.99785 14.0109 7.99604 14.0104 7.99457C13.1717 5.47817 10.7969 3.66536 8.00051 3.66536ZM0.72429 7.57722C1.73777 4.5305 4.61153 2.33203 8.00051 2.33203C11.3879 2.33203 14.2606 4.52846 15.2753 7.57297C15.3669 7.84785 15.367 8.14524 15.2756 8.42018C14.2621 11.4669 11.3883 13.6654 7.99934 13.6654C4.61194 13.6654 1.73927 11.4689 0.72454 8.42443C0.632921 8.14955 0.632834 7.85216 0.72429 7.57722ZM7.99997 6.66536C7.26359 6.66536 6.66663 7.26232 6.66663 7.9987C6.66663 8.73508 7.26359 9.33203 7.99997 9.33203C8.73635 9.33203 9.3333 8.73508 9.3333 7.9987C9.3333 7.26232 8.73635 6.66536 7.99997 6.66536ZM5.3333 7.9987C5.3333 6.52594 6.52721 5.33203 7.99997 5.33203C9.47273 5.33203 10.6666 6.52594 10.6666 7.9987C10.6666 9.47146 9.47273 10.6654 7.99997 10.6654C6.52721 10.6654 5.3333 9.47146 5.3333 7.9987Z"
                          fill="#0099AD" />
                      </svg>
                    </button>
                  </RouterLink>
                </div>
              </td>
            </tr>
          </template>
        </TableComponent>
        <div class="flex items-center justify-between w-full mt-3 mb-6">
          <div class="flex items-center space-x-2 text-sm">
            <span>Menampilkan</span>
            <select v-model="navigationFS.limit" name="" id=""
              class="text-sm text-gray-500 border-gray-300 rounded-lg cursor-pointer" @change="changeLimit($event)">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
            <span>dari
              <span class="font-bold">{{ navigationFS.totalRecords }}</span>
              data</span>
          </div>
          <ul class="flex items-center space-x-3">
            <li>
              <button @click="goPrevious" :disabled="navigationFS.currentPage === 1"
                :class="{ 'text-gray-500': navigationFS.currentPage === 1 }"
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
            <li id="pagination" v-for="(item, index) in generatePage" :key="index"
              class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
              :class="{
                selected: item === navigationFS.currentPage,
                disabled: item === '...',
              }" @click="goTo(item)">
              {{ item }}
            </li>
            <li>
              <button @click="goNext" :disabled="navigationFS.currentPage === navigationFS.totalPages"
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
      </TabItem>
    </TabsWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { encryptStorage, encryptedUserInfo } from "@/utils/app-encrypt-storage";
import PersetujuanService from "@/services/persetujuan-service";
import PetaService from "@/services/peta-service";
import GlobalFormat from "@/services/format/global-format";
import AuthService from "@/services/auth-service";
const authService = new AuthService();
import Loading from "@/components/ui/LoadingSpinner.vue";
import SearchBox from "@/components/ui/SearchBox.vue";
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import type { CheckboxValueType } from "element-plus";
import TableComponent from "@/components/ui/Table.vue";
import { notifyError } from "@/services/helper/toast-notification";
import Empty from "@/components/ui/EmptyData.vue";

const nodeMode = import.meta.env.MODE;
const persetujuanService = new PersetujuanService();
const petaService = new PetaService();
const globalFormat = new GlobalFormat();
const isLoading = ref<boolean>(false);
const date = new Date();
const tahunBerjalan = date.getFullYear();
const yearPicked = ref<number>(tahunBerjalan);
const showModalKK = ref<boolean>(false);
const showModalFS = ref<boolean>(false);
const searchQKK = ref<string>("");
const searchQFS = ref<string>("");
const title = ref("Kertas Kerja");

const pengelolaList = ref<any[]>([]);
const pembinaList = ref<any[]>([]);
const persetujuanKK = ref<any[]>([]);
const persetujuanFS = ref<any[]>([]);

const indeterminatePengelola = ref(false);
const indeterminatePembina = ref(false);
const indeterminateStatus = ref(false);
const checkPengelolaKK = ref<boolean>(false);
const checkPembinaKK = ref<boolean>(false);
const checkPersetujuanKK = ref<boolean>(false);
const checkPengelolaFS = ref<boolean>(false);
const checkPembinaFS = ref<boolean>(false);
const checkPersetujuanFS = ref<boolean>(false);
const itemsPengelola = ref<{ id: string; name: string }[]>([]);
const itemsPembina = ref<{ id: number; name: string }[]>([]);
const itemsPersetujuan = ref([
  {
    id: 3,
    name: "Draft",
  },
  {
    id: 4,
    name: "Disetujui",
  },
  {
    id: 2,
    name: "Ditolak oleh Pembina",
  },
  {
    id: 5,
    name: "Ditolak oleh Pengelola",
  },
  {
    id: 0,
    name: "Menunggu Persetujuan Pembina",
  },
  {
    id: 1,
    name: "Menunggu Persetujuan Pengelola",
  },
]);
const filterKK = ref<{
  selectedPengelola: any[];
  selectedPembina: any[];
  selectedPersetujuan: any[];
}>({
  selectedPengelola: [],
  selectedPembina: [],
  selectedPersetujuan: [],
});
const filterFS = ref<{
  selectedPengelola: any[];
  selectedPembina: any[];
  selectedPersetujuan: any[];
}>({
  selectedPengelola: [],
  selectedPembina: [],
  selectedPersetujuan: [],
});
const navigationKK = ref<{
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}>({
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10,
});
const navigationFS = ref<{
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}>({
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10,
});
var debounceTimeout: any = null;

async function getDataPengelola() {
  try {
    const response: any = await petaService.getPengelola();
    if (response.success) {
      pengelolaList.value = response.data;
      itemsPengelola.value = [];
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsPengelola.value.push({
            id: item.kode_pengelola,
            name: item.pengelola,
          });
        });
      }
    }
  } catch (e) {
    console.log("Fetch items filter Pengelola Error : " + e);
  }
}

async function getDataPembina() {
  try {
    const response: any = await petaService.getPembina({});
    if (response.success) {
      pembinaList.value = response.data;
      itemsPembina.value = [];
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsPembina.value.push({
            id: item.id_pembina,
            name: item.pembina,
          });
        });
      }
    }
  } catch (e) {
    console.log("Fetch items filter Pembina Error : " + e);
  }
}

const fetchPersetujuanKK = async (page?: number) => {
  try {
    const response: any = await persetujuanService.getPersetujuanKertasKerja({
      kode_pengelola: filterKK.value.selectedPengelola,
      id_pembina: filterKK.value.selectedPembina,
      status: filterKK.value.selectedPersetujuan,
      page: page ? page : navigationKK.value.currentPage,
      limit: navigationKK.value.limit,
      tahun: yearPicked.value.toString(),
      search: searchQKK.value.toUpperCase(),
    });
    page ? (navigationKK.value.currentPage = 1) : null;
    persetujuanKK.value = response.data;
    navigationKK.value.totalPages = response.meta.totalPages;
    navigationKK.value.totalRecords = response.meta.totalRecords;
    navigationKK.value.limit = response.meta.limit;
    showModalKK.value = false;
    isLoading.value = false;
  } catch (error) {
    console.error("Fetch Persetujuan KK Error : " + error);
  }
};
const fetchPersetujuanFS = async (page?: number) => {
  try {
    const response: any = await persetujuanService.getPersetujuanFS({
      kode_pengelola: filterFS.value.selectedPengelola,
      id_pembina: filterFS.value.selectedPembina,
      status: filterFS.value.selectedPersetujuan,
      page: page ? page : navigationFS.value.currentPage,
      limit: navigationFS.value.limit,
      search: searchQFS.value.toUpperCase(),
    });
    page ? (navigationFS.value.currentPage = 1) : null;
    persetujuanFS.value = response.data;
    navigationFS.value.totalPages = response.meta.totalPages;
    navigationFS.value.totalRecords = response.meta.totalRecords;
    navigationFS.value.limit = response.meta.limit;
    showModalFS.value = false;
  } catch (error) {
    console.error("Fetch Persetujuan FS Error : " + error);
  }
};
const changeDataKK = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    isLoading.value = true;
    fetchPersetujuanKK(1);
  }, 500);
};

const changeFS = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    isLoading.value = true;
    fetchPersetujuanFS(1);
  }, 500);
};

watch(filterKK.value.selectedPengelola, (val) => {
  if (val.length === 0) {
    checkPengelolaKK.value = false;
    indeterminatePengelola.value = false;
  } else if (val.length === itemsPengelola.value.length) {
    checkPengelolaKK.value = true;
    indeterminatePengelola.value = false;
  } else {
    indeterminatePengelola.value = true;
  }
});
watch(filterFS.value.selectedPengelola, (val) => {
  if (val.length === 0) {
    checkPengelolaFS.value = false;
    indeterminatePengelola.value = false;
  } else if (val.length === itemsPengelola.value.length) {
    checkPengelolaFS.value = true;
    indeterminatePengelola.value = false;
  } else {
    indeterminatePengelola.value = true;
  }
});

watch(filterKK.value.selectedPembina, (val) => {
  if (val.length === 0) {
    checkPembinaKK.value = false;
    indeterminatePembina.value = false;
  } else if (val.length === itemsPembina.value.length) {
    checkPembinaKK.value = true;
    indeterminatePembina.value = false;
  } else {
    indeterminatePembina.value = true;
  }
});
watch(filterFS.value.selectedPembina, (val) => {
  if (val.length === 0) {
    checkPembinaFS.value = false;
    indeterminatePembina.value = false;
  } else if (val.length === itemsPembina.value.length) {
    checkPembinaFS.value = true;
    indeterminatePembina.value = false;
  } else {
    indeterminatePembina.value = true;
  }
});

watch(filterKK.value.selectedPersetujuan, (val) => {
  if (val.length === 0) {
    checkPersetujuanKK.value = false;
    indeterminateStatus.value = false;
  } else if (val.length === itemsPersetujuan.value.length) {
    checkPersetujuanKK.value = true;
    indeterminateStatus.value = false;
  } else {
    indeterminateStatus.value = true;
  }
});
watch(filterFS.value.selectedPersetujuan, (val) => {
  if (val.length === 0) {
    checkPersetujuanFS.value = false;
    indeterminateStatus.value = false;
  } else if (val.length === itemsPersetujuan.value.length) {
    checkPersetujuanFS.value = true;
    indeterminateStatus.value = false;
  } else {
    indeterminateStatus.value = true;
  }
});

const handleCheckPengelolaKK = (val: CheckboxValueType) => {
  indeterminatePengelola.value = false;
  if (val) {
    filterKK.value.selectedPengelola = itemsPengelola.value.map((_) => _.id);
  } else {
    filterKK.value.selectedPengelola = [];
  }
};
const handleCheckPengelolaFS = (val: CheckboxValueType) => {
  indeterminatePengelola.value = false;
  if (val) {
    filterFS.value.selectedPengelola = itemsPengelola.value.map((_) => _.id);
  } else {
    filterFS.value.selectedPengelola = [];
  }
};

const handleCheckPembinaKK = (val: CheckboxValueType) => {
  indeterminatePembina.value = false;
  if (val) {
    filterKK.value.selectedPembina = itemsPembina.value.map((_) => _.id);
  } else {
    filterKK.value.selectedPembina = [];
  }
};
const handleCheckPembinaFS = (val: CheckboxValueType) => {
  indeterminatePembina.value = false;
  if (val) {
    filterFS.value.selectedPembina = itemsPembina.value.map((_) => _.id);
  } else {
    filterFS.value.selectedPembina = [];
  }
};

const handleCheckPersetujuanKK = (val: CheckboxValueType) => {
  indeterminateStatus.value = false;
  if (val) {
    filterKK.value.selectedPersetujuan = itemsPersetujuan.value.map(
      (_) => _.id
    );
  } else {
    filterKK.value.selectedPersetujuan = [];
  }
};
const handleCheckPersetujuanFS = (val: CheckboxValueType) => {
  indeterminateStatus.value = false;
  if (val) {
    filterFS.value.selectedPersetujuan = itemsPersetujuan.value.map(
      (_) => _.id
    );
  } else {
    filterFS.value.selectedPersetujuan = [];
  }
};

// Pages Persetujuan KK
const generatePageList = computed(() => {
  const pageList = [];
  const maxPages = 5;

  if (navigationKK.value.totalPages <= maxPages) {
    for (let i = 1; i <= navigationKK.value.totalPages; i++) {
      pageList.push(i);
    }
  } else {
    if (navigationKK.value.currentPage <= 3) {
      for (
        let i = 1;
        i <= Math.min(navigationKK.value.totalPages, maxPages - 1);
        i++
      ) {
        pageList.push(i);
      }
      if (navigationKK.value.totalPages > maxPages) {
        pageList.push("...");
        pageList.push(navigationKK.value.totalPages);
      }
    } else if (
      navigationKK.value.currentPage >=
      navigationKK.value.totalPages - 2
    ) {
      pageList.push(1);
      pageList.push("...");
      for (
        let i = navigationKK.value.totalPages - (maxPages - 2);
        i <= navigationKK.value.totalPages;
        i++
      ) {
        pageList.push(i);
      }
    } else {
      pageList.push(1);
      pageList.push("...");
      for (
        let i = navigationKK.value.currentPage - 1;
        i <= navigationKK.value.currentPage + 1;
        i++
      ) {
        pageList.push(i);
      }
      pageList.push("...");
      pageList.push(navigationKK.value.totalPages);
    }
  }
  return pageList;
});

const changePageLimit = async (event: any) => {
  isLoading.value = true;
  navigationKK.value.limit = parseInt(event.target.value);
  navigationKK.value.currentPage = 1;
  await fetchPersetujuanKK();
  isLoading.value = false;
};
const goToPage = async (page: any) => {
  isLoading.value = true;
  navigationKK.value.currentPage = page;
  await fetchPersetujuanKK();
  isLoading.value = false;
};
const goToPrevious = () => {
  if (navigationKK.value.currentPage > 1) {
    goToPage(navigationKK.value.currentPage - 1);
  }
};
const goToNext = () => {
  if (navigationKK.value.currentPage < navigationKK.value.totalPages) {
    goToPage(navigationKK.value.currentPage + 1);
  }
};

// Page Persetujuan FS
const generatePage = computed(() => {
  const pageList = [];
  const maxPages = 5;

  if (navigationFS.value.totalPages <= maxPages) {
    for (let i = 1; i <= navigationFS.value.totalPages; i++) {
      pageList.push(i);
    }
  } else {
    if (navigationFS.value.currentPage <= 3) {
      for (
        let i = 1;
        i <= Math.min(navigationFS.value.totalPages, maxPages - 1);
        i++
      ) {
        pageList.push(i);
      }
      if (navigationFS.value.totalPages > maxPages) {
        pageList.push("...");
        pageList.push(navigationFS.value.totalPages);
      }
    } else if (
      navigationFS.value.currentPage >=
      navigationFS.value.totalPages - 2
    ) {
      pageList.push(1);
      pageList.push("...");
      for (
        let i = navigationFS.value.totalPages - (maxPages - 2);
        i <= navigationFS.value.totalPages;
        i++
      ) {
        pageList.push(i);
      }
    } else {
      pageList.push(1);
      pageList.push("...");
      for (
        let i = navigationFS.value.currentPage - 1;
        i <= navigationFS.value.currentPage + 1;
        i++
      ) {
        pageList.push(i);
      }
      pageList.push("...");
      pageList.push(navigationFS.value.totalPages);
    }
  }
  return pageList;
});

const changeLimit = async (event: any) => {
  isLoading.value = true;
  navigationFS.value.limit = parseInt(event.target.value);
  navigationFS.value.currentPage = 1;
  await fetchPersetujuanFS();
  isLoading.value = false;
};
const goTo = async (page: any) => {
  isLoading.value = true;
  navigationFS.value.currentPage = page;
  await fetchPersetujuanFS();
  isLoading.value = false;
};
const goPrevious = () => {
  if (navigationFS.value.currentPage > 1) {
    goTo(navigationFS.value.currentPage - 1);
  }
};
const goNext = () => {
  if (navigationFS.value.currentPage < navigationFS.value.totalPages) {
    goTo(navigationFS.value.currentPage + 1);
  }
};

onMounted(async () => {
  isLoading.value = true;
  await fetchPersetujuanKK();
  await fetchPersetujuanFS();
  await getDataPengelola();
  await getDataPembina();
  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
.date-picker {
  width: 7rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099ad;
}

/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

#hover-button:hover>svg * {
  background-color: #0099ad;
  fill: #ffffff;
}

ul li#pagination.selected {
  background-color: #0099ad;
  border-radius: 6px;
  color: white;
  transition: 300ms;
}

ul li.selected {
  color: #0099ad;
  border-color: #0099ad;
}

ul li.disabled {
  pointer-events: none;
  cursor: not-allowed;
  color: #d1d1db;
}
</style>
