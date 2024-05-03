<template>
  <Loading v-if="isLoading" />
  <div class="p-4 space-y-4 bg-white border rounded-md min-h-[75dvh]">
    <div class="flex justify-between">
      <div class="flex items-center">
        <SearchBox @on-focus="handleFocus" v-model="selectedSearchQuery" class="w-60" />
        <ModalSearch v-if="isSearchModalOpen" v-model="searchQuery" :show-modal="isSearchModalOpen" :source="listDataPeta"
          @on-click-close="isSearchModalOpen = false" @on-escape="isSearchModalOpen = false"
          @on-click="selectedSearchQuery = searchQuery; isSearchModalOpen = false; fetchPetaSentral()"
          @on-key-enter="selectedSearchQuery = searchQuery; isSearchModalOpen = false; fetchPetaSentral()" />
        <button type="button"
          class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] ml-4 p-2.5 font-medium rounded-lg text-sm flex justify-center items-center"
          @click="showModal = !showModal">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
            <path
              d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
              fill="#0099AD" />
          </svg>
          Filter
        </button>
        <ModalWrapper :showModal="showModal" :width="'w-[400px]'" :height="'h-auto'">
          <div class="flex flex-col space-y-5">
            <div class="flex justify-between">
              <div class="flex items-center space-x-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.6665 7.33073H11.3332V8.66406H4.6665V7.33073ZM2.6665 4.66406H13.3332V5.9974H2.6665V4.66406ZM6.6665 9.9974H9.33317V11.3307H6.6665V9.9974Z"
                    fill="#333333" />
                </svg>
                <span class="text-base font-semibold">Filter</span>
              </div>
              <button @click="showModal = false">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <form class="mt-4 space-y-6">
            <!-- Pengelola -->
            <details class="w-full -mb-1 dropdown">
              <summary
                class="text-gray-700 bg-white border hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 w-full flex justify-between dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-400">
                <span>Unit Induk / Subholding / Anak Perusahaan</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </summary>
              <ul class="p-2 mt-2 bg-white shadow menu dropdown-content z-[1] rounded-box w-full">
                <div class="block p-2 max-h-[10rem] overflow-y-auto">
                  <MultiCheckbox v-model:value="selectPengelola" :options="optionPengelola" />
                </div>
              </ul>
            </details>
            <div class="flex">
              <input v-if="selectPengelola.length === dataPengelola.length" @input="(event: any) =>
                event.target.checked === true
                  ? (selectPengelola = setPengelola)
                  : (selectPengelola = [])
                " :checked="true" type="checkbox"
                class="w-4 h-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded-full focus:ring-[#80C1CD] dark:focus:ring-[#0099AD] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <input v-else @input="(event: any) =>
                event.target.checked === true
                  ? (selectPengelola = setPengelola)
                  : (selectPengelola = [])
                " :checked="false" type="checkbox"
                class="w-4 h-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded-full focus:ring-[#80C1CD] dark:focus:ring-[#0099AD] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <button @click="
                checkAllPengelola = !checkAllPengelola;
              checkAllPengelola === true
                ? (selectPengelola = setPengelola)
                : (selectPengelola = []);
              " class="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                Pilih Semua
              </button>
            </div>
            <!-- Pembina -->
            <!-- <details class="w-full -mb-4 dropdown">
                <summary
                  class="text-gray-700 bg-white border hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 w-full flex justify-between dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-400"
                >
                  <span>Unit Pengelola level 2 / Unit Bisnis / SHAP</span>
                  <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </summary>
                <ul
                  class="p-2 mt-2 bg-white shadow menu dropdown-content z-[1] rounded-box w-full"
                >
                  <div class="block p-2 max-h-[10rem] overflow-y-auto">
                    <MultiCheckbox
                      v-model:value="selectPembina"
                      :options="optionPembina"
                    />
                  </div>
                </ul>
              </details>
              <div class="flex -mt-6">
                <input
                  v-if="selectPembina.length === dataPembina.length"
                  @input="
                    (event) =>
                      event.target.checked === true
                        ? (selectPembina = setPembina)
                        : (selectPembina = [])
                  "
                  :checked="true"
                  type="checkbox"
                  class="w-4 h-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded-full focus:ring-[#80C1CD] dark:focus:ring-[#0099AD] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  v-else
                  @input="
                    (event) =>
                      event.target.checked === true
                        ? (selectPembina = setPembina)
                        : (selectPembina = [])
                  "
                  :checked="false"
                  type="checkbox"
                  class="w-4 h-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded-full focus:ring-[#80C1CD] dark:focus:ring-[#0099AD] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  @click="
                    checkAllPembina = !checkAllPembina;
                    checkAllPembina === true
                      ? (selectPembina = setPembina)
                      : (selectPembina = []);
                  "
                  class="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300"
                >
                  Pilih Semua
                </button>
              </div> -->
            <!-- Jenis Pembangkit -->
            <details class="w-full -mb-6 dropdown">
              <summary
                class="text-gray-700 bg-white border hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 w-full flex justify-between dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-400">
                <span>Pilih Kategori Pembangkit</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </summary>
              <ul class="p-2 mt-2 bg-white shadow menu dropdown-content z-[1] rounded-box w-full">
                <div class="block p-2 max-h-[10rem] overflow-y-auto">
                  <MultiCheckbox v-model:value="selectJenisKit" :options="optionJenisKit" />
                  <MultiChildCheckbox v-model:value="selectDMN" :options="optionDMN" />
                </div>
              </ul>
            </details>
            <div class="flex -mt-6">
              <input v-if="selectJenisKit.length === dataJenisKit.length" @input="(event: any) =>
                event.target.checked === true
                  ? (selectJenisKit = setJenisKit)
                  : (selectJenisKit = [])
                " :checked="true" type="checkbox"
                class="w-4 h-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded-full focus:ring-[#80C1CD] dark:focus:ring-[#0099AD] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <input v-else @input="(event: any) =>
                event.target.checked === true
                  ? (selectJenisKit = setJenisKit)
                  : (selectJenisKit = [])
                " :checked="false" type="checkbox"
                class="w-4 h-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded-full focus:ring-[#80C1CD] dark:focus:ring-[#0099AD] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <button @click="
                checkAllJenisKit = !checkAllJenisKit;
              checkAllJenisKit === true
                ? (selectJenisKit = setJenisKit)
                : (selectJenisKit = []);
              " class="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                Pilih Semua
              </button>
            </div>
            <!-- Umur Mesin -->
            <details class="w-full -mb-6 dropdown">
              <summary
                class="text-gray-700 bg-white border hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 w-full flex justify-between dark:bg-gray-200 dark:hover:bg-gray-300 dark:focus:ring-gray-400">
                <span>Umur Mesin</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </summary>
              <ul class="p-2 mt-2 bg-white shadow menu dropdown-content z-[1] rounded-box w-full">
                <div class="block p-2 max-h-[10rem] overflow-y-auto">
                  <MultiCheckbox v-model:value="selectUmurMesin" :options="optionUmurMesin" />
                </div>
              </ul>
            </details>
            <div class="flex -mt-6">
              <input v-if="selectUmurMesin.length === dataUmurMesin.length" @input="(event: any) =>
                event.target.checked === true
                  ? (selectUmurMesin = setUmurMesin)
                  : (selectUmurMesin = [])
                " :checked="true" type="checkbox"
                class="w-4 h-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded-full focus:ring-[#80C1CD] dark:focus:ring-[#0099AD] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <input v-else @input="(event: any) =>
                event.target.checked === true
                  ? (selectUmurMesin = setUmurMesin)
                  : (selectUmurMesin = [])
                " :checked="false" type="checkbox"
                class="w-4 h-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded-full focus:ring-[#80C1CD] dark:focus:ring-[#0099AD] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <button @click="
                checkAllUmurMesin = !checkAllUmurMesin;
              checkAllUmurMesin === true
                ? (selectUmurMesin = setUmurMesin)
                : (selectUmurMesin = []);
              " class="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                Pilih Semua
              </button>
            </div>
            <hr class="w-full" />
            <div class="flex justify-end">
              <div class="flex items-start">
                <button type="submit" @click="showModal = false"
                  class="w-full text-[#0099AD] bg-white border-2 border-[#80C1CD] hover:bg-[#80C1CD] focus:ring-2 focus:outline-none focus:ring-[#0099AD] font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center dark:bg-[#007E8F] dark:hover:bg-white dark:focus:ring-bg-[#80C1CD]">
                  Batal
                </button>
                <button type="submit" @click="changeData()"
                  class="w-full text-white bg-[#0099AD] hover:bg-[#005A66] focus:ring-2 focus:outline-none focus:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:focus:ring-[#005A66]">
                  Terapkan
                </button>
              </div>
            </div>
          </form>
        </ModalWrapper>
      </div>
      <!-- <BestPerformance v-if="startYear && endYear" @on-year-update="handleYearUpdate(yearModel)"
        v-model:year-model="yearModel" :bpa-data="bpaData" :start-year="startYear" :end-year="endYear" /> -->
      <BestPerformance />
    </div>
    <div class="z-0 h-full space-y-3">
      <ol-map style="width: 100%; height: 75dvh;" @moveend="consoleZoom">
        <ol-view ref="viewRef" :center="center" :rotation="rotation" :zoom="zoom" :minZoom="4" :projection="projection" />
        <ol-tile-layer>
          <ol-source-osm />
        </ol-tile-layer>
        <ol-overlay v-for="( item, i ) in  dataPeta " :key="i" :position="[item.lng, item.lat]">
          <img v-if="item.kode_jenis_energi === 'EBT'" @mouseover="showByIndex = i"
            @click="getDetailSentral(item.kode_sentral)" src="../../assets/img/ebt.png"
            class="rounded-full cursor-pointer" :class="zoom >= 15 ? 'w-5 h-5' : 'w-3 h-3'">
          <img v-else @mouseover="showByIndex = i" @click="getDetailSentral(item.kode_sentral)"
            src="../../assets/img/Non-EBT.png" class="rounded-full cursor-pointer"
            :class="zoom >= 15 ? 'w-5 h-5' : 'w-3 h-3'">
        </ol-overlay>
        <ol-overlay v-for="( item, i ) in  dataPeta " :position="[item.lng, item.lat]" :key="i">
          <template v-slot="">
            <!-- <div v-if="showByIndex === i" class="content absolute z-50 w-[18rem]" :class="
              item.lat < 0 || item.lng > 138 ? 'bottom-0 right-0' : 'top-0 left-0'"> -->
            <div v-if="showByIndex === i" @mouseover="showByIndex = i, showByIndexModal = i"
              @mouseleave="showByIndex = null, showByIndexModal = null"
              class="bg-white absolute z-50 w-[18rem] rounded-md"
              :class="item.lat < 0 || item.lng > 500 ? 'bottom-0 right-0' : 'top-0 left-0'">
              <div class="flex justify-between px-2 py-2">
                <div>
                  <div class="flex mb-1">
                    <div class="h-3 w-3 rounded-full shadow-md mx-2 mt-1.5"
                      :style="`background-color:${item.kode_warna}`"></div>
                    <div>
                      <h1 class="font-medium">{{ item.sentral }}</h1>
                    </div>
                  </div>
                  <p class="text-[11px] ml-7">
                    {{ item.kode_jenis_energi }}
                  </p>
                </div>
                <div class="mx-2 mt-1">
                  <button
                    class="text-white bg-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-white dark:bg-white dark:hover:bg-white dark:focus:ring-white"
                    type="button">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"
                      @click="getDetailSentral(item.kode_sentral)">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M11.2071 7.79289C11.5976 8.18342 11.5976 8.81658 11.2071 9.20711L6.20711 14.2071C5.81658 14.5976 5.18342 14.5976 4.79289 14.2071C4.40237 13.8166 4.40237 13.1834 4.79289 12.7929L9.08579 8.5L4.79289 4.20711C4.40237 3.81658 4.40237 3.18342 4.79289 2.79289C5.18342 2.40237 5.81658 2.40237 6.20711 2.79289L11.2071 7.79289Z"
                        fill="#0099AD" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex justify-between px-4 py-1 text-xs">
                <p class="text-slate-400">Jenis Bahan Bakar</p>
                <p>{{ item.bbm }}</p>
              </div>
              <div class="flex justify-between px-4 py-1 text-xs">
                <p class="text-slate-400">Unit Aktif</p>
                <div class="flex">
                  <p>{{ item.jumlah_mesin }}</p>
                  <p class="pl-2 text-slate-400">Unit</p>
                </div>
              </div>
              <div class="flex justify-between px-4 py-1 text-xs">
                <p class="text-slate-400">Daya Terpasang</p>
                <div class="flex">
                  <p>{{ formatFixed(item.daya_terpasang) }}</p>
                  <p class="pl-2 text-slate-400">MW</p>
                </div>
              </div>
              <div class="flex justify-between px-4 py-1 text-xs">
                <p class="text-slate-400">IRR on Project</p>
                <div class="flex">
                  <p>{{ item.irr_project
                    ? globalFormat.formatRupiah(item.irr_project)
                    : "-" }}</p>
                  <p class="pl-2 text-slate-400">%</p>
                </div>
              </div>
              <div class="flex justify-between px-4 py-1 text-xs">
                <p class="text-slate-400">IRR on Equity</p>
                <div class="flex">
                  <p>{{ item.irr_equity
                    ? formatFixed(globalFormat.formatRupiah(item.irr_equity))
                    : "-" }}</p>
                  <p class="pl-2 text-slate-400">%</p>
                </div>
              </div>
              <div class="flex justify-between px-4 py-1 text-xs">
                <p class="text-slate-400">Average NCF</p>
                <div class="flex">
                  <p>{{ item.average_cf
                    ? formatFixed(globalFormat.formatRupiah(item.average_cf))
                    : "-" }}</p>
                  <p class="pl-2 text-slate-400">%</p>
                </div>
              </div>
              <div class="flex justify-between px-4 py-1 mb-3 text-xs">
                <p class="text-slate-400">Average EAF</p>
                <div class="flex">
                  <p>-</p>
                  <p class="pl-2 text-slate-400">%</p>
                </div>
              </div>
            </div>
            <!-- </div> -->
          </template>
        </ol-overlay>
      </ol-map>
      <div class="flex items-center justify-center">
        <div class="flex mr-4">
          <svg width="15" height="16" viewBox="0 0 15 16" class="mt-1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.49999" cy="8.00005" r="7.2" fill="#0EA976" />
            <g clip-path="url(#clip0_13248_2057)">
              <path d="M6.60001 9.62012H8.04001" stroke="white" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M6.95999 4.57997C6.95999 4.67545 6.99792 4.76702 7.06543 4.83453C7.13295 4.90204 7.22451 4.93997 7.31999 4.93997C7.41547 4.93997 7.50704 4.90204 7.57455 4.83453C7.64206 4.76702 7.67999 4.67545 7.67999 4.57997C7.67999 4.48449 7.64206 4.39293 7.57455 4.32541C7.50704 4.2579 7.41547 4.21997 7.31999 4.21997C7.22451 4.21997 7.13295 4.2579 7.06543 4.32541C6.99792 4.39293 6.95999 4.48449 6.95999 4.57997Z"
                stroke="white" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6.23999 10.7L7.31999 5.30005L8.39999 10.7" stroke="white" stroke-linecap="round"
                stroke-linejoin="round" />
              <rect x="5.16" y="9.26001" width="4.32" height="2.16" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_13248_2057">
                <rect width="8.64" height="8.64" fill="white" transform="translate(3 3.5)" />
              </clipPath>
            </defs>
          </svg>
          <p class="ml-2 font-medium text-md">EBT</p>
        </div>
        <div class="flex">
          <svg width="15" height="16" viewBox="0 0 15 16" class="mt-1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.49999" cy="8.00005" r="7.2" fill="#FF6363" />
            <g clip-path="url(#clip0_13248_19934)">
              <path d="M6.60001 9.62012H8.04001" stroke="white" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M6.95999 4.57997C6.95999 4.67545 6.99792 4.76702 7.06543 4.83453C7.13295 4.90204 7.22451 4.93997 7.31999 4.93997C7.41547 4.93997 7.50704 4.90204 7.57455 4.83453C7.64206 4.76702 7.67999 4.67545 7.67999 4.57997C7.67999 4.48449 7.64206 4.39293 7.57455 4.32541C7.50704 4.2579 7.41547 4.21997 7.31999 4.21997C7.22451 4.21997 7.13295 4.2579 7.06543 4.32541C6.99792 4.39293 6.95999 4.48449 6.95999 4.57997Z"
                stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6.23999 10.7L7.31999 5.30005L8.39999 10.7" stroke="white" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
              <rect x="5.16" y="9.26001" width="4.32" height="2.16" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_13248_19934">
                <rect width="8.64" height="8.64" fill="white" transform="translate(3 3.5)" />
              </clipPath>
            </defs>
          </svg>
          <p class="ml-2 font-medium text-md">Non-EBT</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PetaService from "@/services/peta-service";
import GlobalFormat from "@/services/format/global-format";
import BestPerformance from "@/components/Peta/BestPerformance.vue"
import SearchBox from "@/components/ui/SearchBox.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import MultiCheckbox from "@/components/ui/MultiCheckbox.vue";
import MultiChildCheckbox from "@/components/ui/MultiChildCheckbox.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import ModalSearch from "@/components/ModalSearch.vue";
import type View from "ol/View";
import { notifyError } from "@/services/helper/toast-notification";

const router = useRouter();
const globalFormat = new GlobalFormat();
const petaService = new PetaService();
const dataPeta = ref<PetaItem[]>([]);
const listDataPeta = ref<PetaItem[]>([]);
const filteredDataPeta = ref();
const isSearchModalOpen = ref<boolean>(false);
// const dataPembina = ref<PembinaItem[]>([]);
const dataPengelola = ref<PengelolaItem[]>([]);
const dataJenisKit = ref<JenisKitItem[]>([]);
const dataUmurMesin = ref<UmurMesinItem[]>([]);
const dataDMN = ref<DMN[]>([]);
const showByIndex = ref<number | null>(null);
const showByIndexModal = ref<number | null>(null);
const kode_sentral = ref("");
const isLoading = ref();
const showModal = ref(false);
const searchQuery = ref("");
const selectedSearchQuery = ref("");
const checkAllPengelola = ref(true);
const checkAllPembina = ref(true);
const checkAllJenisKit = ref(true);
const checkAllUmurMesin = ref(true);

const viewRef = ref<{ view: View }>();
const center = ref([117.478751, -0.808498]);
const projection = ref("EPSG:4326");
const zoom = ref<any>(5);
const rotation = ref(0);

// Filter Pengelola
let setPengelola = ref<any>([]);
const selectPengelola = ref<any>([]);
const optionPengelola = ref<any>([]);

// Filter Pembina
// let setPembina = ref<any>([]);
// const selectPembina = ref<any>([]);
// const optionPembina = ref<any>([]);

// Filter JenisKit
let setJenisKit = ref<any>([]);
const selectJenisKit = ref<any>([]);
const optionJenisKit = ref<any>([]);

// Filter JenisKit
let setDMN = ref<any>([]);
const selectDMN = ref<any>([]);
const optionDMN = ref<any>([]);

// Filter Umur Mesin
let setUmurMesin = ref<any>([]);
const selectUmurMesin = ref<any>([]);
const optionUmurMesin = ref<any>([]);

interface PetaItem {
  data: any;
  kode_sentral: string;
  sentral: string;
  jenis_pembangkit: string;
  kode_jenis_energi: string;
  daya_terpasang: string;
  bbm: string;
  jumlah_mesin: number;
  irr_project: string;
  irr_equity: string;
  average_cf: string;
  kode_warna: string;
  icon: string;
  lat: any;
  lng: any;
}
interface PengelolaItem {
  id_pengelola: number;
  kode_pengelola: string;
  pengelola: string;
}
interface JenisKitItem {
  jenis_kit: string;
  dmn: any;
}
interface UmurMesinItem {
  id_umur_mesin: number;
  umur_mesin: string;
}
interface DMN {
  daya_mampu: any;
}

const fetchPetaSentral = async () => {
  try {
    isLoading.value = true;
    const response: any = await petaService.getPetaSentral({ sentral: searchQuery.value, pengelola: [], pembina: [], jenis_kit: [], daya_mampu: [], umur: [] });
    if (listDataPeta.value.length === 0) {
      listDataPeta.value = response.data;
      dataPeta.value = response.data;
    } else {
      dataPeta.value = response.data;
      console.log(response.data);
    }
    console.log(viewRef.value?.view.getZoom())
    if (dataPeta.value.length === 1) {
      center.value = [parseFloat(dataPeta.value[0].lng), parseFloat(dataPeta.value[0].lat)]
      zoom.value = 17;
    }
  } catch (error) {
    notifyError("Data Peta Sebaran Gagal Dimuat, Mohon Coba Lagi", false);
  } finally {
    isLoading.value = false;
  }
}
const fetchPengelola = async () => {
  try {
    const response: any = await petaService.getPengelola({});
    dataPengelola.value = response.data;
    for (var i = 0; i < dataPengelola.value.length; i++) {
      optionPengelola.value.push({
        name: dataPengelola.value[i].pengelola,
        id: dataPengelola.value[i].kode_pengelola,
      });
      selectPengelola.value.push(dataPengelola.value[i].kode_pengelola);
      setPengelola.value.push(dataPengelola.value[i].kode_pengelola);
    }
  } catch (error) {
    console.error('Fetch Pengelola Error : ' + error);
  }
}
const fetchJenisKit = async () => {
  try {
    const response: any = await petaService.getJenisKit({});
    dataJenisKit.value = response.data;
    for (var i = 0; i < dataJenisKit.value.length; i++) {
      dataDMN.value = dataJenisKit.value[i].dmn;
    }
    for (var j = 0; j < dataJenisKit.value.length; j++) {
      optionJenisKit.value.push({
        name: dataJenisKit.value[j].jenis_kit,
        id: dataJenisKit.value[j].jenis_kit,
      });
      selectJenisKit.value.push(dataJenisKit.value[j].jenis_kit);
      setJenisKit.value.push(dataJenisKit.value[j].jenis_kit);
    }
    for (var k = 0; k < dataDMN.value.length; k++) {
      optionDMN.value.push({
        name: dataDMN.value[k].daya_mampu,
        id: dataDMN.value[k].daya_mampu,
      });
      selectDMN.value.push(dataDMN.value[k].daya_mampu);
      setDMN.value.push(dataDMN.value[k].daya_mampu);
    }
  } catch (error) {
    console.error('Fetch Jenis Pembangkit Error : ' + error);
  }
}
const fetchUmurMesin = async () => {
  try {
    const response: any = await petaService.getUmurMesin({});
    dataUmurMesin.value = response.data;
    for (var i = 0; i < dataUmurMesin.value.length; i++) {
      optionUmurMesin.value.push({
        name: dataUmurMesin.value[i].umur_mesin,
        id: dataUmurMesin.value[i].umur_mesin,
      });
      selectUmurMesin.value.push(dataUmurMesin.value[i].umur_mesin);
      setUmurMesin.value.push(dataUmurMesin.value[i].umur_mesin);
    }
  } catch (error) {
    console.error('Fetch Umur Mesin Error : ' + error);
  }
}
function getDetailSentral(kode: string) {
  kode_sentral.value = kode;
  try {
    petaService.getSentralByKode(kode);
    return router.push({
      name: "grafik",
      params: { id: kode },
    });
  } catch (error) {
    console.error('Fetch Detail Sentral By Kode Error : ' + error);
  }
}

function consoleZoom() {
  // zoom.value = viewRef.value?.view.getZoom();
  // console.log(viewRef.value?.view.getZoom());
  // console.log(viewRef.value?.view.d);
}

const handleFocus = () => {
  isSearchModalOpen.value = true;
}
async function changeData() {
  isLoading.value = true;
  const response: any = await petaService.getPetaSentral({ sentral: searchQuery, pengelola: selectPengelola.value, jenis_kit: selectJenisKit.value, daya_mampu: selectDMN.value, umur: selectUmurMesin.value, })
  dataPeta.value = response.data;
  showModal.value = false;
  checkAllPengelola.value = false;
  checkAllPembina.value = false;
  checkAllJenisKit.value = false;
  checkAllUmurMesin.value = false;
  isLoading.value = false;
}
async function handleSearch() {
  isLoading.value = true;
  const response: any = await petaService.getPetaSentral({ sentral: searchQuery, pengelola: selectPengelola.value, jenis_kit: selectJenisKit.value, daya_mampu: selectDMN.value, umur: selectUmurMesin.value, })
  dataPeta.value = response.data;
  isLoading.value = false;
}
function formatFixed(x: any) {
  return Number.parseFloat(x).toFixed(1);
}

onMounted(async () => {
  const view: View | undefined = viewRef.value?.view;
  try {
    isLoading.value = true;
    await fetchPetaSentral();
    await fetchPengelola();
    await fetchJenisKit();
    await fetchUmurMesin();
  } catch (error) {
    isLoading.value = false;
    console.error('Fetch All API Error : ' + error);
  } finally {
    isLoading.value = false;
  }
  //   petaService.getPembina({}).then((res: any) => {
  //   dataPembina.value = res.data;

  //   for (var i = 0; i < dataPembina.value.length; i++) {
  //     optionPembina.value.push({
  //       name: dataPembina.value[i].pembina,
  //       id: dataPembina.value[i].kode_pembina,
  //     });
  //     selectPembina.value.push(dataPembina.value[i].kode_pembina);
  //     setPembina.value.push(dataPembina.value[i].kode_pembina);
  //   }
  //   isLoading.value = false;
  // });
});
</script>

<style lang="scss" scoped></style>

