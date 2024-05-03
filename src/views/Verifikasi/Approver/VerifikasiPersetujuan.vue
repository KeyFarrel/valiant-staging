<template>
  <Loading v-if="isLoading" />
  <div class="min-h-full p-6 space-y-5 bg-white border rounded-lg">
    <TabsWrapper :isLihatGrafik="false" :laman-data="false" class="ml-1">
      <TabItem title="Kertas Kerja">
        <div class="flex flex-row items-center justify-between mb-4">
          <div class="flex flex-row space-x-4">
            <SearchBox class="w-60" @on-key-enter="fetchPersetujuanKK() " @on-click="fetchPersetujuanKK()"
              v-model="searchQ" />
            <button type="button"
              class="text-primaryColor bg-white border border-primaryColor hover:bg-primaryColor focus:ring-2 focus:ring-[#9ddee7] ml-4 p-2.5 font-medium rounded-lg text-sm flex justify-center items-center duration-300 hover:text-white"
              @click="showModal = !showModal">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="mr-2">
                <path
                  d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
                  fill="#0099AD" />
              </svg>
              Filter
            </button>
            <ModalWrapper :showModal="showModal" :width="'w-[500px]'" :height="'h-auto'">
              <div class="flex flex-col space-y-5">
                <div class="flex justify-between">
                  <div class="flex items-center space-x-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4.6665 7.33073H11.3332V8.66406H4.6665V7.33073ZM2.6665 4.66406H13.3332V5.9974H2.6665V4.66406ZM6.6665 9.9974H9.33317V11.3307H6.6665V9.9974Z"
                        fill="#333333" />
                    </svg>
                    <span class="text-base font-semibold text-black">Filter</span>
                  </div>
                  <button @click="showModal = false">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="level_ID === '1'" class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">Unit Pengelola</h3>
                <el-select v-model="pengelola" multiple clearable collapse-tags placeholder="Pilih Unit Pengelola"
                  popper-class="custom-header" :max-collapse-tags="5" class="w-full text-black">
                  <template #header>
                    <el-checkbox v-model="checkPengelola" :indeterminate="indeterminate" @change="handleCheckPengelola">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPengelola" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div v-if="level_ID === '2'" class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">Unit Pembina</h3>
                <el-select v-model="pembina" multiple clearable collapse-tags placeholder="Pilih Unit Pembina"
                  popper-class="custom-header" :max-collapse-tags="5" class="w-full text-black">
                  <template #header>
                    <el-checkbox v-model="checkPembina" :indeterminate="indeterminate" @change="handleCheckPembina">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPembina" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">Status Persetujuan</h3>
                <el-select v-model="persetujuan" multiple clearable collapse-tags placeholder="Pilih Status Persetujuan"
                  popper-class="custom-header" :max-collapse-tags="6" class="w-full text-black">
                  <template #header>
                    <el-checkbox v-model="checkPersetujuan" :indeterminate="indeterminate"
                      @change="handleCheckPersetujuan">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPersetujuan" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <hr class="w-full my-4" />
              <div class="flex justify-end">
                <div class="flex items-start">
                  <button type="submit" @click="showModal = false"
                    class="w-full text-primaryColor bg-white border-2 border-[#80C1CD] hover:bg-[#80C1CD] focus:ring-2 focus:outline-none focus:ring-primaryColor font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center dark:bg-[#007E8F] dark:hover:bg-white dark:focus:ring-bg-[#80C1CD]">
                    Batal
                  </button>
                  <button type="submit" @click="changeData()"
                    class="w-full text-white bg-primaryColor hover:bg-[#005A66] focus:ring-2 focus:outline-none focus:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-primaryColor dark:focus:ring-[#005A66]">
                    Terapkan
                  </button>
                </div>
              </div>
            </ModalWrapper>
          </div>
          <div class="flex flex-row items-center ml-4 space-x-3">
            <label class="text-sm font-semibold text-labelColor" for="">Periode</label>
            <!-- <VueDatePicker class="mr-2 date-picker" v-model="tahun" :clearable="false" year-picker /> -->
            <VueDatePicker class="mr-3 date-picker" v-model="yearPicked" :clearable="false" year-picker
              @update:model-value="fetchPersetujuanKK()" />
          </div>
        </div>
        <TableComponent>
          <template v-slot:table-header>
            <tr class="text-xs bg-gray-100">
              <th class="text-center border">No</th>
              <th class="border" v-if="level_ID === '1'">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">Unit Pengelola</h1>
                </div>
              </th>
              <th class="border" v-if="level_ID === '1' || level_ID === '2'">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">Unit Pembina</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">Unit Sentral</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">Unit Mesin</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">IRR on Equity (%)</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">NPV on Equity (Rp Juta)</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Status</h1>
                </div>
              </th>
              <th class="text-center border">Aksi</th>
            </tr>
          </template>
          <template v-slot:table-body v-if="persetujuanKK === null">
            <tr class="text-xs text-gray-900 border-b hover:bg-gray-100">
              <td colspan="8">
                <h1 class="mb-2 text-lg font-semibold text-center">Data Tidak Tersedia</h1>
                <p class="text-center">Silahkan lakukan pengisian atau hubungi unit terkait</p>
              </td>
            </tr>
          </template>
          <template v-slot:table-body v-else>
            <tr class="text-xs text-gray-900 border-b hover:bg-gray-100" v-for="(item, index) in persetujuanKK"
              :key="index">
              <td scope="row" class="text-center whitespace-nowrap">
                {{ index + 1 }}
              </td>
              <!-- <td v-if="props.pengelolaList.length" class="text-center">{{ props.pengelolaList.filter((pengelola: any) => pengelola.kode_pengelola === persetujuanKKItem.kode_pengelola)[0].pengelola ?? '' }}</td> -->
              <td v-if="pengelolaList.length && level_ID === '1'" class="text-center">{{ pengelolaList.filter((pengelola:any) =>
                pengelola.kode_pengelola === item.kode_pengelola)[0] ? pengelolaList.filter((pengelola:any) =>
                pengelola.kode_pengelola === item.kode_pengelola)[0].pengelola : '-' }}</td>
              <td class="text-center" v-if="level_ID === '1' || level_ID === '2'">{{ item.pembina }}</td>
              <td class="text-center">{{ item.sentral }}</td>
              <td class="text-center">{{ item.mesin }}</td>
              <td class="text-right">{{ globalFormat.formatRupiah(item.irr_on_equity) }}</td>
              <td class="text-right">{{ globalFormat.formatRupiah(item.npv_on_equity) }}</td>
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
                  <RouterLink
                    :to="{ name: 'app-kk-mesin', params: { id: item.id_mesin}, query: {id_sentral: item.id_sentral, tahun: item.tahun} }">
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
            <select v-model="pageLimit" name="" id=""
              class="text-sm text-gray-500 border-gray-300 rounded-lg cursor-pointer" @change="changePageLimit($event)">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
            <span>dari <span class="font-bold">{{ totalRecords }}</span> data</span>
          </div>
          <ul class="flex items-center space-x-3">
            <li>
              <button @click="goToPrevious" :disabled="currentPage === 1"
                :class="{ 'text-gray-500': currentPage === 1 }"
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
              :class="{ selected: item === currentPage, disabled: item === '...' }"
              class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
              @click="goToPage(item)">
              {{ item }}
            </li>
            <li>
              <button @click="goToNext" :disabled="currentPage === totalPages"
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
      </TabItem>
      <TabItem title="Feasibility Study">
        <div class="flex flex-row items-center justify-between mb-4">
          <div class="flex flex-row space-x-4">
            <SearchBox class="w-60" @on-key-enter="fetchPersetujuanFS()" @on-click="fetchPersetujuanFS()"
              v-model="searchQ" />
            <button type="button"
              class="text-primaryColor bg-white border border-primaryColor hover:bg-primaryColor focus:ring-2 focus:ring-[#9ddee7] ml-4 p-2.5 font-medium rounded-lg text-sm flex justify-center items-center duration-300 hover:text-white"
              @click="showModal = !showModal">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="mr-2">
                <path
                  d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
                  fill="#0099AD" />
              </svg>
              Filter
            </button>
            <ModalWrapper :showModal="showModal" :width="'w-[500px]'" :height="'h-auto'">
              <div class="flex flex-col space-y-5">
                <div class="flex justify-between">
                  <div class="flex items-center space-x-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4.6665 7.33073H11.3332V8.66406H4.6665V7.33073ZM2.6665 4.66406H13.3332V5.9974H2.6665V4.66406ZM6.6665 9.9974H9.33317V11.3307H6.6665V9.9974Z"
                        fill="#333333" />
                    </svg>
                    <span class="text-base font-semibold text-black">Filter</span>
                  </div>
                  <button @click="showModal = false">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="level_ID === '1'" class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">Unit Pengelola</h3>
                <el-select v-model="pengelola" multiple clearable collapse-tags placeholder="Pilih Unit Pengelola"
                  popper-class="custom-header" :max-collapse-tags="5" class="w-full text-black">
                  <template #header>
                    <el-checkbox v-model="checkPengelola" :indeterminate="indeterminate" @change="handleCheckPengelola">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPengelola" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div v-if="level_ID === '2'" class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">Unit Pembina</h3>
                <el-select v-model="pembina" multiple clearable collapse-tags placeholder="Pilih Unit Pembina"
                  popper-class="custom-header" :max-collapse-tags="5" class="w-full text-black">
                  <template #header>
                    <el-checkbox v-model="checkPembina" :indeterminate="indeterminate" @change="handleCheckPembina">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPembina" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <div class="mt-4">
                <h3 class="mb-2 text-[#4D5E80] font-semibold">Status Persetujuan</h3>
                <el-select v-model="persetujuan" multiple clearable collapse-tags placeholder="Pilih Status Persetujuan"
                  popper-class="custom-header" :max-collapse-tags="6" class="w-full text-black">
                  <template #header>
                    <el-checkbox v-model="checkPersetujuan" :indeterminate="indeterminate"
                      @change="handleCheckPersetujuan">
                      Select All Items
                    </el-checkbox>
                  </template>
                  <el-option v-for="item in itemsPersetujuan" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </div>
              <hr class="w-full my-4" />
              <div class="flex justify-end">
                <div class="flex items-start">
                  <button type="submit" @click="showModal = false"
                    class="w-full text-primaryColor bg-white border-2 border-[#80C1CD] hover:bg-[#80C1CD] focus:ring-2 focus:outline-none focus:ring-primaryColor font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center dark:bg-[#007E8F] dark:hover:bg-white dark:focus:ring-bg-[#80C1CD]">
                    Batal
                  </button>
                  <button type="submit" @click="changeFS()"
                    class="w-full text-white bg-primaryColor hover:bg-[#005A66] focus:ring-2 focus:outline-none focus:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-primaryColor dark:focus:ring-[#005A66]">
                    Terapkan
                  </button>
                </div>
              </div>
            </ModalWrapper>
          </div>
        </div>
        <TableComponent>
          <template v-slot:table-header>
            <tr class="text-xs bg-gray-100">
              <th class="text-center border">No</th>
              <th class="border" v-if="level_ID === '1'">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">Unit Pengelola</h1>
                </div>
              </th>
              <th class="border" v-if="level_ID === '1' || level_ID === '2'">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">Unit Pembina</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">Unit Sentral</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">Unit Mesin</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">IRR on Equity (%)</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center ">
                  <h1 class="font-semibold">NPV on Equity (Rp Juta)</h1>
                </div>
              </th>
              <th class="border">
                <div class="flex flex-row items-center justify-center space-x-10 text-center">
                  <h1 class="font-semibold">Status</h1>
                </div>
              </th>
              <th class="text-center border">Aksi</th>
            </tr>
          </template>
          <template v-slot:table-body v-if="persetujuanFS === null">
            <tr class="text-xs text-gray-900 border-b hover:bg-gray-100">
              <td colspan="8">
                <h1 class="mb-2 text-lg font-semibold text-center">Data Tidak Tersedia</h1>
                <p class="text-center">Silahkan lakukan pengisian atau hubungi unit terkait</p>
              </td>
            </tr>
          </template>
          <template v-slot:table-body v-else>
            <tr class="text-xs text-gray-900 border-b hover:bg-gray-100" v-for="(item, index) in persetujuanFS"
              :key="index">
              <td scope="row" class="text-center whitespace-nowrap">
                {{ index + 1 }}
              </td>
              <td v-if="pengelolaList.length && level_ID === '1'" class="text-center">{{ pengelolaList.filter((pengelola:any) =>
                pengelola.kode_pengelola === item.kode_pengelola)[0] ? pengelolaList.filter((pengelola:any) =>
                pengelola.kode_pengelola === item.kode_pengelola)[0].pengelola : '-' }}</td>
              <td class="text-center" v-if="level_ID === '1' || level_ID === '2'">{{ item.pembina }}</td>
              <td class="text-center">{{ item.sentral }}</td>
              <td class="text-center">{{ item.mesin }}</td>
              <td class="text-right">{{ globalFormat.formatRupiah(item.irr_on_equity) }}</td>
              <td class="text-right">{{ globalFormat.formatRupiah(item.npv_on_equity) }}</td>
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
                  <RouterLink
                    :to="{ name: 'app-fs-mesin', params: { id: item.id_mesin}, query: {id_sentral: item.id_sentral} }">
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
            <select v-model="pageLimitFS" name="" id=""
              class="text-sm text-gray-500 border-gray-300 rounded-lg cursor-pointer" @change="changeLimit($event)">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
            <span>dari <span class="font-bold">{{ totalRecordsFS }}</span> data</span>
          </div>
          <ul class="flex items-center space-x-3">
            <li>
              <button @click="goPrevious" :disabled="currentPage === 1" :class="{ 'text-gray-500': currentPage === 1 }"
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
            <li id="pagination" v-for="(item, index) in generatePage" :key="index"
              :class="{ selected: item === currentPage, disabled: item === '...' }"
              class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
              @click="goTo(item)">
              {{ item }}
            </li>
            <li>
              <button @click="goNext" :disabled="currentPage === totalPagesFS"
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
      </TabItem>
    </TabsWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import PersetujuanService from '@/services/persetujuan-service';
import PetaService from "@/services/peta-service";
import GlobalFormat from "@/services/format/global-format";
import Loading from "@/components/ui/LoadingSpinner.vue";
import SearchBox from '@/components/ui/SearchBox.vue';
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import type { CheckboxValueType } from 'element-plus';
import TableComponent from "@/components/ui/Table.vue";
import { notifyError } from "@/services/helper/toast-notification";

const persetujuanService = new PersetujuanService();
const petaService = new PetaService();
const globalFormat = new GlobalFormat();
const isLoading = ref(false);
const date = new Date();
const tahunBerjalan = date.getFullYear();
const yearPicked = ref<number>(tahunBerjalan);
const showModal = ref(false);
const searchQ = ref<string>("");
const title = ref('Kertas Kerja');

const levelID = ref(localStorage.getItem("level_id"));
const level_ID = ref(levelID);
const pengelolaList = ref<any[]>([]);
const pembinaList = ref<any[]>([]);
const persetujuanKK = ref<any[]>([]);
const persetujuanFS = ref<any[]>([]);

const currentPage = ref(1);
const totalPages = ref(0);
const pageLimit = ref(10);
const totalRecords = ref();

const totalPagesFS = ref(0);
const pageLimitFS = ref(10);
const totalRecordsFS = ref();

const indeterminate = ref(false);
const checkPengelola = ref(false);
const checkPembina = ref(false);
const checkPersetujuan = ref(false);
const pengelola = ref<CheckboxValueType[]>([]);
const pembina = ref<CheckboxValueType[]>([]);
const persetujuan = ref<CheckboxValueType[]>([]);
const itemsPengelola = ref<{ id: string; name: string; }[]>([]);
const itemsPembina = ref<{ id: number; name: string; }[]>([]);
const itemsPersetujuan = ref([
  {
    id: 0,
    name: 'Menunggu Persetujuan Pembina',
  },
  {
    id: 1,
    name: 'Menunggu Persetujuan Pengelola',
  },
  {
    id: 2,
    name: 'Ditolak oleh Pembina',
  },
  {
    id: 3,
    name: 'Draft',
  },
  {
    id: 4,
    name: 'Ditolak oleh Pengelola',
  },
  {
    id: 5,
    name: 'Disetujui',
  },
])

async function getDataPengelola() {
  try {
    const response: any = await petaService.getPengelola()
    if (response.success) {
      pengelolaList.value = response.data;
      itemsPengelola.value = []
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsPengelola.value.push({
            id: item.kode_pengelola,
            name: item.pengelola
          })
        })
      }
    }
  } catch (e) {
    console.log("Fetch items filter Pengelola Error : " + e)
  }
}

async function getDataPembina() {
  try {
    const response: any = await petaService.getPembina({})
    if (response.success) {
      pembinaList.value = response.data;
      itemsPembina.value = []
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsPembina.value.push({
            id: item.id_pembina,
            name: item.pembina
          })
        })
      }
    }
  } catch (e) {
    console.log("Fetch items filter Pembina Error : " + e)
  }
}

const fetchPersetujuanKK = async () => {
  try {
    const response: any = await persetujuanService.getPersetujuanKertasKerja({
      kode_pengelola : [],
      id_pembina: [],
      status: [],
      page: currentPage.value,
      limit: pageLimit.value,
      tahun: yearPicked.value,
      search: searchQ.value
    });
    persetujuanKK.value = response.data;
    totalPages.value = response.meta.totalPages;
    totalRecords.value = response.meta.totalRecords;
    pageLimit.value = response.meta.limit;
  } catch (error) {
    console.error('Fetch Persetujuan KK Error : ' + error);
  }
}
const fetchPersetujuanFS = async () => {
  try {
    const response: any = await persetujuanService.getPersetujuanFS({
      kode_pengelola : [],
      id_pembina: [],
      status: [],
      page: currentPage.value,
      limit: pageLimitFS.value,
      search: searchQ.value
    });
    persetujuanFS.value = response.data;
    totalPagesFS.value = response.meta.totalPages;
    totalRecordsFS.value = response.meta.totalRecords;
    pageLimitFS.value = response.meta.limit;
  } catch (error) {
    console.error('Fetch Persetujuan FS Error : ' + error);
  }
}

watch(pengelola, (val) => {
  if (val.length === 0) {
    checkPengelola.value = false
    indeterminate.value = false
  } else if (val.length === itemsPengelola.value.length) {
    checkPengelola.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

watch(pembina, (val) => {
  if (val.length === 0) {
    checkPembina.value = false
    indeterminate.value = false
  } else if (val.length === itemsPembina.value.length) {
    checkPembina.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

watch(persetujuan, (val) => {
  if (val.length === 0) {
    checkPersetujuan.value = false
    indeterminate.value = false
  } else if (val.length === itemsPersetujuan.value.length) {
    checkPersetujuan.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

const handleCheckPengelola = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    pengelola.value = itemsPengelola.value.map((_) => _.id)
  } else {
    pengelola.value = []
  }
}

const handleCheckPembina = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    pembina.value = itemsPembina.value.map((_) => _.id)
  } else {
    pembina.value = []
  }
}

const handleCheckPersetujuan = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    persetujuan.value = itemsPersetujuan.value.map((_) => _.id)
  } else {
    persetujuan.value = []
  }
}

async function changeData() {
  try {
    isLoading.value = true;
    const response: any = await persetujuanService.getPersetujuanKertasKerja({
      kode_pengelola : pengelola.value ? pengelola.value : "",
      id_pembina: pembina.value ? pembina.value : "",
      status: persetujuan.value ? persetujuan.value : "",
      page: currentPage.value,
      limit: pageLimit.value,
      tahun: 2024,
      mesin: searchQ.value
    });
    persetujuanKK.value = response.data;
    totalPages.value = response.meta.totalPages;
    totalRecords.value = response.meta.totalRecords;
    pageLimit.value = response.meta.limit;
    showModal.value = false;
  } catch (error) {
    notifyError("Data Persetujuan Gagal Dimuat, Mohon Coba Lagi", false);
  } finally {
    isLoading.value = false;
  }
}

async function changeFS() {
  try {
    isLoading.value = true;
    const response: any = await persetujuanService.getPersetujuanFS({
      kode_pengelola : pengelola.value ? pengelola.value : "",
      id_pembina: pembina.value ? pembina.value : "",
      status: persetujuan.value ? persetujuan.value : "",
      page: currentPage.value,
      limit: pageLimit.value,
      mesin: searchQ.value
    });
    persetujuanFS.value = response.data;
    totalPagesFS.value = response.meta.totalPages;
    totalRecordsFS.value = response.meta.totalRecords;
    pageLimitFS.value = response.meta.limit;
    showModal.value = false;
  } catch (error) {
    notifyError("Data Persetujuan Gagal Dimuat, Mohon Coba Lagi", false);
  } finally {
    isLoading.value = false;
  }
}

// Pages Persetujuan KK
const generatePageList = computed(() => {
  const pageList = [];
  const maxPages = 5;

  if (totalPages.value <= maxPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pageList.push(i);
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= Math.min(totalPages.value, maxPages - 1); i++) {
        pageList.push(i);
      }
      if (totalPages.value > maxPages) {
        pageList.push('...');
        pageList.push(totalPages.value);
      }
    } else if (currentPage.value >= totalPages.value - 2) {
      pageList.push(1);
      pageList.push('...');
      for (let i = totalPages.value - (maxPages - 2); i <= totalPages.value; i++) {
        pageList.push(i);
      }
    } else {
      pageList.push(1);
      pageList.push('...');
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
        pageList.push(i);
      }
      pageList.push('...');
      pageList.push(totalPages.value);
    }
  }
  return pageList;
});

const changePageLimit = async (event: any) => {
  isLoading.value = true;
  pageLimit.value = parseInt(event.target.value);
  currentPage.value = 1;
  await fetchPersetujuanKK();
  isLoading.value = false;
};
const goToPage = async (page: any) => {
  isLoading.value = true;
  currentPage.value = page;
  await fetchPersetujuanKK();
  isLoading.value = false
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

// Page Persetujuan FS
const generatePage = computed(() => {
  const pageList = [];
  const maxPages = 5;

  if (totalPagesFS.value <= maxPages) {
    for (let i = 1; i <= totalPagesFS.value; i++) {
      pageList.push(i);
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= Math.min(totalPagesFS.value, maxPages - 1); i++) {
        pageList.push(i);
      }
      if (totalPagesFS.value > maxPages) {
        pageList.push('...');
        pageList.push(totalPagesFS.value);
      }
    } else if (currentPage.value >= totalPagesFS.value - 2) {
      pageList.push(1);
      pageList.push('...');
      for (let i = totalPagesFS.value - (maxPages - 2); i <= totalPagesFS.value; i++) {
        pageList.push(i);
      }
    } else {
      pageList.push(1);
      pageList.push('...');
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
        pageList.push(i);
      }
      pageList.push('...');
      pageList.push(totalPagesFS.value);
    }
  }
  return pageList;
});

const changeLimit = async (event: any) => {
  isLoading.value = true;
  pageLimitFS.value = parseInt(event.target.value);
  currentPage.value = 1;
  await fetchPersetujuanFS();
  isLoading.value = false;
};
const goTo = async (page: any) => {
  isLoading.value = true;
  currentPage.value = page;
  await fetchPersetujuanFS();
  isLoading.value = false
};
const goPrevious = () => {
  if (currentPage.value > 1) {
    goTo(currentPage.value - 1);
  }
};
const goNext = () => {
  if (currentPage.value < totalPagesFS.value) {
    goTo(currentPage.value + 1);
  }
};

onMounted(async () => {
  isLoading.value = true;
  await fetchPersetujuanKK();
  await fetchPersetujuanFS();
  await getDataPengelola();
  await getDataPembina();
  isLoading.value = false;
})
</script>

<style lang="scss" scoped>
.date-picker {
  width: 7rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
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

button:hover>svg * {
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
  color: #0099AD;
  border-color: #0099AD;
}

ul li.disabled {
  pointer-events: none;
  cursor: not-allowed;
  color: #D1D1DB;
}
</style>