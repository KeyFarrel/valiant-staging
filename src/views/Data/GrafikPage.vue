<template>
  <Loading v-if="isLoadingSentral" />
  <div class="w-full p-4 space-y-3 bg-white border rounded-md h-22">
    <div class="flex justify-between md:flex">
      <div class="flex items-center">
        <SearchBox v-if="userAuthStore.levelAlias !== 'Mb*0yT%3'" @on-focus="handleFocus" v-model="selectedSearchQuery"
          class="w-60" />
        <ModalSearch v-if="isSearchModalOpen" v-model="searchQuery" :show-modal="isSearchModalOpen"
          :source="listDataPeta" @on-click-close="isSearchModalOpen = false" @on-escape="isSearchModalOpen = false"
          @on-click-sentral="selectedSearchQuery = searchQuery; isSearchModalOpen = false; handleChangeSentral()"
          @on-key-enter="selectedSearchQuery = searchQuery; isSearchModalOpen = false; handleChangeSentral()" />
      </div>
    </div>
    <div class="bg-white">
      <ul class="flex items-end space-x-8 overflow-auto border-b-2 border-gray-50 whitespace-nowrap scrollbar-hide"
        :class="userAuthStore.levelAlias === 'Mb*0yT%3' ? 'mt-14' : 'mt-0'">
        <li v-for="(item, i) in dataUnit" :key="i"
          class="pb-2 text-base font-bold transition-all duration-300 cursor-pointer text-textDisabledColor"
          :class="{ selected: item.mesin === selectedTitle }" @click="changeTabMesin(item.mesin)">
          {{ item.mesin }}
        </li>
      </ul>
    </div>
  </div>
  <!-- Sentral -->
  <div v-show="selectedTitle === 'Unit Sentral'" @click="selectedTitle = 'Unit Sentral'">
    <div class="flex mt-2">
      <div v-auto-animate="{ duration: 300 }" class="w-full px-4 py-2 mr-2 bg-white border rounded-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="ml-1 text-lg font-semibold text-primaryTextColor">
              {{ dataSentral.sentral }}
            </p>
          </div>
          <div class="cursor-pointer" @click="toggleButton">
            <svg v-if="isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
                fill="#0099AD" />
            </svg>
            <svg v-if="!isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M14.7071 12.7071C14.3166 13.0976 13.6834 13.0976 13.2929 12.7071L10 9.41421L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071Z"
                fill="#0099AD" />
            </svg>
          </div>
        </div>
        <div v-if="isHover">
          <div class="flex my-3">
            <div class="bg-[url('../assets/img/img-cik.png')] bg-cover bg-center w-40 h-42 rounded-md mr-2"></div>
            <div class="relative">
              <div class="flex flex-row mt-4">
                <Chips :title="'Unit Pengelola'" :content="dataSentral.pengelola" />
                <Chips :title="'Unit Pembina'" :content="dataSentral.pembina" class="block w-56 truncate"
                  @mouseenter="detailPembina" @mouseleave="detailPembina">
                </Chips>
                <Chips :title="'Jumlah Unit'" :content="dataSentral.jumlah_mesin" />
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-blue-50 px-3 py-1 text-xs">
                  <p class="text-[#007E8F]">Tahun COD :</p>
                  <div class="font-bold text-[#007E8F] ml-1">
                    {{ dataSentral.tahun }}
                  </div>
                  <div class="relative flex flex-col items-center ml-2">
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                      @mouseenter="toggleDetail" @mouseleave="toggleDetail">
                      <path
                        d="M5 10C2.2385 10 0 7.7615 0 5C0 2.2385 2.2385 0 5 0C7.7615 0 10 2.2385 10 5C10 7.7615 7.7615 10 5 10ZM4.5 4.5V7.5H5.5V4.5H4.5ZM4.5 2.5V3.5H5.5V2.5H4.5Z"
                        fill="#0099AD" />
                    </svg>
                    <Transition>
                      <div v-if="isOver"
                        class="flex flex-col bg-white absolute text-xs p-2 mt-5 z-10 rounded-lg whitespace-nowrap border space-y-1.5 duration-300"
                        id="tooltipContent">
                        <div v-for="(item, i) in dataUnit" :key="i" class="flex py-1 text-xs">
                          <p class="mr-1 text-slate-400">{{ item.mesin }}</p>
                          <p class="mr-4 text-slate-400">:</p>
                          <p>{{ item.tahun }}</p>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>
              <Transition>
                <div v-if="pembinaHover"
                  class="flex flex-col bg-blue-50 border border-[#0099AD] absolute text-xs p-2 mt-3 ml-48 z-10 rounded-lg whitespace-nowrap space-y-1.5 duration-300 font-bold text-[#0099AD]"
                  id="tooltipContentPembina">
                  {{ dataSentral.pembina }}
                </div>
              </Transition>
              <div class="flex flex-row mt-3">
                <Chips :title="'Daya Terpasang'" :content="dataSentral.data_terpasang + ' MW'" />
                <Chips :title="'Daya Mampu(Netto)'" :content="dataSentral.data_mampu + ' MW'" />
                <Chips :title="'Tahun Perolehan Data'" :content="dataSentral.tahun_nilai_perolehan" />
              </div>
              <div class="flex mt-4 text-sm">
                <p class="text-[#7B8DAD] font-bold">Nilai Aset Awal</p>
                <p class="text-[#7B8DAD] ml-1">:</p>
              </div>
              <div class="flex text-sm mt-1.5">
                <p class="mr-2 text-[#7F7F80]">Rp.</p>
                <div class="text-[#333333]">
                  {{ globalFormat.formatRupiah(dataSentral.asset_awal) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-auto-animate="{ duration: 300 }" class="w-full px-4 py-2 bg-white border rounded-md">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <p class="mt-1 mr-2 text-sm font-semibold text-primaryTextColor">
              {{ tabs }}
            </p>
            <div class=" text-[#0099AD] font-semibold mt-1.5 text-xs cursor-pointer z-20 relative" @click="showElement">
              Ubah Grafik
              <Transition>
                <div v-if="message"
                  class="flex flex-col bg-white text-xs px-2 py-1 mt-0.5 left-12 rounded-lg whitespace-nowrap border space-y-1.5 duration-300 absolute -ml-[220px] top-full">
                  <div class="flex justify-between">
                    <div class="flex">
                      <svg width="12" height="11" viewBox="0 0 12 11" class="mt-2" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M0.666016 9.66667H11.3327M0.666016 7L3.33268 3L5.99935 4.33333L8.66602 1L11.3327 3.66667"
                          stroke="#333333" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <p class="mt-1 ml-2 font-semibold text-slate-800">Grafik</p>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" class="mt-1"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <button @click="changeTab(2)" class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD]">
                      Planning / Feasibility Study
                    </button>
                  </div>
                  <div>
                    <button @click="changeTab(1)" class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD]">
                      WLC (Realisasi & Proyeksi)
                    </button>
                  </div>
                  <div>
                    <button @click="changeTab(3)" class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD]">
                      Planning & Realisasi + Proyeksi
                    </button>
                  </div>
                  <div>
                    <button @click="changeTab(4)" class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD]">
                      Planning vs Realisasi s/d Tahun Berjalan
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          <div class="cursor-pointer mt-1.5" @click="toggleButton">
            <svg v-if="isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
                fill="#0099AD" />
            </svg>
            <svg v-if="!isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M14.7071 12.7071C14.3166 13.0976 13.6834 13.0976 13.2929 12.7071L10 9.41421L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071Z"
                fill="#0099AD" />
            </svg>
          </div>
        </div>
        <div v-if="isHover" class="mt-3">
          <template v-if="isLoadingPeriode">
            <div class="py-2 space-y-2">
              <ShimmerLoading class="w-1/3 h-4" />
              <ShimmerLoading class="w-1/2 h-4" />
              <ShimmerLoading class="w-2/5 h-4" />
            </div>
          </template>
          <TagSentral v-else :id-sentral="idSentral" :tahun-data="parseInt(yearPickedSentral)"
            v-if="dataSentral.length !== 0" />
        </div>
      </div>
    </div>
    <div class="w-full mt-2 bg-white border rounded-md h-1/2">
      <template v-if="isLoadingPeriode">
        <div class="p-4 space-y-3">
          <ShimmerLoading class="w-1/4 h-6" />
          <ShimmerLoading class="h-[350px] w-full" />
        </div>
      </template>
      <GrafikSentral v-else :id-sentral="idSentral" :tahun-data="parseInt(yearPickedSentral)"
        v-if="dataSentral.length !== 0" />
    </div>
    <div class="grid grid-cols-3 gap-3 mt-2">
      <template v-if="isLoadingPeriode">
        <div v-for="n in 3" :key="n" class="p-4 space-y-2 bg-white border rounded-md">
          <ShimmerLoading class="w-1/3 h-5" />
          <ShimmerLoading class="w-full h-4" />
          <ShimmerLoading class="w-2/3 h-4" />
          <ShimmerLoading class="w-1/2 h-4" />
        </div>
      </template>
      <InfoSentral v-else :id-sentral="idSentral" :tahun-data="parseInt(yearPickedSentral)"
        v-if="dataSentral.length !== 0" />
    </div>
  </div>
  <!-- Mesin -->
  <template v-if="isLoadingPeriode && dataUnit.length > 0">
    <div class="mt-2 space-y-3">
      <div class="flex gap-2">
        <div class="w-full p-4 space-y-2 bg-white border rounded-md">
          <ShimmerLoading class="w-1/4 h-5" />
          <ShimmerLoading class="w-1/2 h-4" />
          <ShimmerLoading class="w-1/3 h-4" />
        </div>
        <div class="w-full p-4 space-y-2 bg-white border rounded-md">
          <ShimmerLoading class="w-1/4 h-5" />
          <ShimmerLoading class="w-2/3 h-4" />
          <ShimmerLoading class="w-1/2 h-4" />
        </div>
      </div>
      <div class="w-full p-4 bg-white border rounded-md">
        <ShimmerLoading class="w-1/4 h-6 mb-3" />
        <ShimmerLoading class="h-[350px] w-full" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div v-for="n in 3" :key="n" class="p-4 space-y-2 bg-white border rounded-md">
          <ShimmerLoading class="w-1/3 h-5" />
          <ShimmerLoading class="w-full h-4" />
          <ShimmerLoading class="w-2/3 h-4" />
          <ShimmerLoading class="w-1/2 h-4" />
        </div>
      </div>
    </div>
  </template>
  <template v-else-if="selectedYear.length !== 0">
    <template v-for="(item, i) in dataUnit" :key="i">
      <div v-if="visitedMesin.has(item.mesin)" v-show="selectedTitle === item.mesin" class="relative">
        <div class="absolute z-20 flex flex-row items-center ml-4 space-x-3 right-5"
          :class="osDetector.getOS() === 'Windows' ? '-top-[131px]' : '-top-[118px]'"
          v-if="selectedYear[i]?.tahun !== null || (selectedYear[i]?.range?.[0] !== null && selectedYear[i]?.range?.[1] !== null)">
          <label class="text-sm font-semibold text-labelColor" for="">Periode</label>
          <VueDatePicker v-if="selectedYear[i]" class="mr-3 text-xs date-picker" v-model="selectedYear[i].tahun"
            :year-range="selectedYear[i]?.range" :clearable="false" year-picker :teleport="true"
            :filters="yearPickerService.filterYears(responseLimitTahun?.data, parseInt(selectedYear[i]?.range?.[0]), parseInt(selectedYear[i]?.range?.[1]))" />
        </div>
        <div class="flex mt-2">
          <div v-auto-animate="{ duration: 300 }" class="w-full px-4 py-2 mr-2 bg-white border rounded-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg font-semibold text-primaryTextColor">
                  {{ item.mesin }}
                </p>
              </div>
              <div class="cursor-pointer" @click="toggleButton">
                <svg v-if="!isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
                    fill="#0099AD" />
                </svg>
                <svg v-else-if="isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M14.7071 12.7071C14.3166 13.0976 13.6834 13.0976 13.2929 12.7071L10 9.41421L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071Z"
                    fill="#0099AD" />
                </svg>
              </div>
            </div>
            <div v-if="isHover">
              <div class="flex my-3">
                <div class="w-40 mr-5" v-if="item.photo1 !== ''">
                  <img :src="item.photo2" alt="Preview" class="object-cover rounded-lg h-44"></img>
                </div>
                <div v-else class="w-40 mr-5 bg-red-500 rounded-lg h-44"></div>
                <div class="relative">
                  <div class="flex flex-row mt-4">
                    <Chips :title="'Unit Pengelola'" :content="item.pengelola" class="block w-58" />
                    <Chips :title="'Unit Pembina'" :content="item.pembina ? item.pembina : '-'"
                      class="block truncate max-w-56 w-fit" :class="item.pembina?.length >= 16 ? 'cursor-pointer' : ''"
                      @mouseenter="detailPembina" @mouseleave="detailPembina">
                    </Chips>
                    <Chips :title="'Tahun COD'" :content="item.tahun" />
                  </div>
                  <Transition>
                    <div v-if="pembinaHover" v-show="item.pembina !== '' && item.pembina?.length > 16"
                      class="bg-blue-50 border border-[#0099AD] absolute text-xs p-2 -mt-[60px] z-10 rounded-lg whitespace-nowrap duration-300 font-bold text-[#0099AD]"
                      :class="item.pembina?.length <= 16 ? 'ml-[350px]' : 'ml-[195px] '" id="tooltipContentPembina">
                      {{ item.pembina ? item.pembina : '-' }}
                    </div>
                  </Transition>
                  <div class="flex flex-row mt-3">
                    <Chips :title="'Daya Terpasang'" :content="item.data_terpasang + ' MW'" />
                    <Chips :title="'Daya Mampu(Netto)'" :content="item.data_mampu + ' MW'" />
                    <Chips :title="'Tahun Perolehan Data'" :content="item.tahun_nilai_perolehan" />
                  </div>
                  <div class="flex justify-between mr-3">
                    <div>
                      <div class="flex mt-4 text-sm">
                        <p class="text-[#7B8DAD] font-bold">Nilai Aset Awal</p>
                        <p class="text-[#7B8DAD] ml-1">:</p>
                      </div>
                      <div class="flex text-sm mt-1.5">
                        <p class="mr-2 text-[#7F7F80]">Rp.</p>
                        <div class="text-[#333333]">
                          {{ globalFormat.formatRupiah(item.asset_awal) }}
                        </div>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="flex mt-4 text-sm">
                        <p class="text-[#7B8DAD] font-bold">Masa Manfaat</p>
                        <p class="text-[#7B8DAD] ml-1">:</p>
                      </div>
                      <div class="flex text-sm mt-1.5">
                        <div class="text-[#333333] mr-2">
                          {{ item.masa_manfaat }}
                        </div>
                        <p class="text-[#7F7F80]">Tahun</p>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="flex mt-4 text-sm">
                        <p class="text-[#7B8DAD] font-bold">Sisa Masa Manfaat</p>
                        <p class="text-[#7B8DAD] ml-1">:</p>
                      </div>
                      <div class="flex text-sm mt-1.5">
                        <div class="text-[#333333] mr-2">
                          {{ item.sisa_masa_manfaat }}
                        </div>
                        <p class="text-[#7F7F80]">Tahun</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-auto-animate="{ duration: 300 }" class="w-full px-4 py-2 bg-white border rounded-md">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <p class="mt-1 mr-2 text-sm font-semibold text-primaryTextColor">
                  {{ tabs }}
                </p>
                <div class=" text-[#0099AD] font-semibold mt-1.5 text-xs cursor-pointer z-10 relative"
                  @click="showElement">
                  Ubah Grafik
                  <Transition>
                    <div v-if="message"
                      class="flex flex-col bg-white text-xs px-2 py-1 mt-0.5 left-12 rounded-lg whitespace-nowrap border space-y-1.5 duration-300 absolute -ml-[220px] top-full">
                      <div class="flex justify-between">
                        <div class="flex">
                          <svg width="12" height="11" viewBox="0 0 12 11" class="mt-2" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M0.666016 9.66667H11.3327M0.666016 7L3.33268 3L5.99935 4.33333L8.66602 1L11.3327 3.66667"
                              stroke="#333333" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <p class="mt-1 ml-2 font-semibold text-slate-800">Grafik</p>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" class="mt-1"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <button @click="changeTab(2)"
                          class="block text-left px-2 w-full py-1.5 hover:bg-primaryColor hover:text-white duration-100">
                          Planning / Feasibility Study
                        </button>
                      </div>
                      <div>
                        <button @click="changeTab(1)"
                          class="block text-left px-2 w-full py-1.5 hover:bg-primaryColor  hover:text-white duration-100">
                          WLC (Realisasi & Proyeksi)
                        </button>
                      </div>
                      <div>
                        <button @click="changeTab(3)"
                          class="block text-left px-2 w-full py-1.5 hover:bg-primaryColor  hover:text-white duration-100">
                          Planning & Realisasi + Proyeksi
                        </button>
                      </div>
                      <div>
                        <button @click="changeTab(4)"
                          class="block text-left px-2 w-full py-1.5 hover:bg-primaryColor  hover:text-white duration-100">
                          Planning vs Realisasi s/d Tahun Berjalan
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="cursor-pointer mt-1.5" @click="toggleButton">
                <svg v-if="!isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
                    fill="#0099AD" />
                </svg>
                <svg v-else-if="isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M14.7071 12.7071C14.3166 13.0976 13.6834 13.0976 13.2929 12.7071L10 9.41421L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071Z"
                    fill="#0099AD" />
                </svg>
              </div>
            </div>
            <div v-if="isHover" class="mt-3">
              <TagMesin :id-mesin="item.uuid_mesin" :tahun-data="parseInt(selectedYear[i]?.tahun)"
                v-if="dataUnit.length !== 0" />
            </div>
          </div>
        </div>
        <div class="w-full py-3 mt-2 bg-white border rounded-md h-1/2">
          <GrafikMesin :id-mesin="item.uuid_mesin" :tahun-data="parseInt(selectedYear[i]?.tahun)"
            v-if="dataUnit.length !== 0" />
        </div>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <InfoMesin :id-mesin="item.uuid_mesin" :tahun-data="parseInt(selectedYear[i]?.tahun)"
            v-if="dataUnit.length !== 0" />
        </div>
      </div>
    </template>
  </template>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, onUnmounted } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { useTagSentral, useTagMesin } from "@/store/storeTagGrafik";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import { useUserAuthStore } from "@/store/storeUserAuth";
const userAuthStore = useUserAuthStore();
import { notifyError } from "@/services/helper/toast-notification";
import { osDetector } from "@/utils/os-detector";
import DetailSentralService from "@/services/detail-sentral-service";
const detailSentralService = new DetailSentralService();
import AuthService from "@/services/auth-service";
const authService = new AuthService();
import YearPickerService from "@/services/helper/year-picker-service";
const yearPickerService = new YearPickerService();
import PetaService from "@/services/peta-service";
import GrafikService from "@/services/grafik-service";
import GlobalFormat from "@/services/format/global-format";
import TagSentral from "./Grafik/TagSentral.vue";
import TagMesin from "./Grafik/TagMesin.vue";
import GrafikSentral from "./Grafik/GrafikSentral.vue";
import GrafikMesin from "./Grafik/GrafikMesin.vue";
import InfoSentral from "@/views/Data/Grafik/InformationSentral.vue";
import InfoMesin from "@/views/Data/Grafik/InformationMesin.vue";
import SearchBox from "@/components/ui/SearchBox.vue";
import ModalSearch from "@/components/ModalSearch.vue";
import Chips from "@/components/ui/Chips.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";

const nodeMode = import.meta.env.MODE;
const route = useRoute();
const store = useTagSentral();
const stored = useTagMesin();
const petaService = new PetaService();
const grafikService = new GrafikService();
const globalFormat = new GlobalFormat();
const dataSentral = ref<SentralItem[]>([]);
const dataUnit = ref<UnitItem[]>([]);
const listDataPeta = ref<SentralItem[]>([]);
const dataPeta = ref<SentralItem[]>([]);

const kodeSentral = ref<any>('');
const idSentral = ref<any>('');
const tahunSentral = ref<any>('');
const yearPickedMesin = ref<any>('2024');
const jumlahMesin = ref<any>('');
const idMesin = ref<any>([]);
const namaMesin = ref<any>();
const tahunMesin = ref<any>([]);
const searchQuery = ref("");
const selectedSearchQuery = ref("");
const isSearchModalOpen = ref<boolean>(false);
const periodeTahunSentral = ref<any>();
const yearPickedSentral = ref<any>();
const periodeTahunMesin = ref<any>();
const selectedYear = ref<any[]>([]);
const yearResponseMesin = ref<any>();
const responseLimitTahun = ref<any>();

const isLoadingSentral = ref(false);
const isLoadingPeriode = ref(false);
const isHover = ref(true);
const isOver = ref(false);
const message = ref(false);
const pembinaHover = ref(false);
const tabs = ref("WLC (Realisasi & Proyeksi)");
const selectedTitle = ref(namaMesin);
const visitedMesin = ref<Set<string>>(new Set());

function toggleButton() {
  isHover.value = !isHover.value;
}

function toggleDetail() {
  isOver.value = !isOver.value;
}

function detailPembina() {
  pembinaHover.value = !pembinaHover.value;
}

const props = defineProps({
  tabsTitle: Array as () => UnitItem[],
});

const changeTabMesin = async (mesin: any) => {
  selectedTitle.value = mesin;
  visitedMesin.value.add(mesin);
};

function showElement() {
  message.value = !message.value;
}

const handleFocus = () => {
  isSearchModalOpen.value = true;
}

interface SentralItem {
  data: any
  kode_sentral: string
  uuid_sentral: string
  sentral: string
  pengelola: string
  pembina: string
  jenis_pembangkit: string
  data_terpasang: string
  data_mampu: string
  asset_awal: string
  jumlah_mesin: number
  tahun_nilai_perolehan: string
  tahun_data: string
  tahun: number
  photo: string
}

interface UnitItem {
  kode_sentral: string
  mesin: string
  uuid_mesin: number
  sentral: string
  pengelola: string
  pembina: string
  jenis_pembangkit: string
  data_terpasang: string
  data_mampu: string
  asset_awal: string
  sisa_masa_manfaat: number
  masa_manfaat: number
  tahun_data: string
  tahun_nilai_perolehan: string
  tahun: number
  photo: string
  photo1: string
  photo2: string
  length: number
}

const fetchDataSentral = async () => {
  try {
    const encryptStorage = await encryptStoragePromise;
    selectedYear.value = [];
    idMesin.value = [];
    tahunMesin.value = [];
    const response: SentralItem = await petaService.getSentralByKode(
      nodeMode === 'production' ? encryptStorage.decryptValue(route.params.id.toString()) : route.params.id
    );
    dataSentral.value = response.data;
    idSentral.value = response.data.uuid_sentral;
    tahunSentral.value = response.data.tahun_data;
    namaMesin.value = response.data.mesins[0].mesin;
    jumlahMesin.value = response.data.jumlah_mesin;
    for (const item of response.data.mesins) {
      idMesin.value.push(item.uuid_mesin);
      tahunMesin.value.push(item.tahun_data);
    }
    // Load photos in parallel for faster loading
    await Promise.all(
      response.data.mesins.map(async (item: any) => {
        try {
          const responsePhoto: any = await detailSentralService.getPhoto(item.photo1);
          const blob = new Blob([responsePhoto.data]);
          item.photo2 = URL.createObjectURL(blob);
        } catch (error) {
          console.error('Error Fetch Photo: ', error);
        }
      })
    );
    dataUnit.value = response.data.mesins;
  } catch (error) {
    console.error(error);
  }
};

const replaceSentral = async () => {
  const encryptStorage = await encryptStoragePromise;
  await router.push({
    name: "grafik",
    params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(kodeSentral.value) : kodeSentral.value }
  });
};

const fetchPetaSentral = async () => {
  try {
    const response: any = await petaService.getPetaSentral({
      sentral: searchQuery.value,
      pengelola: [],
      pembina: [],
      jenis_kit: [],
      id_daya: [],
      umur: []
    });
    if (listDataPeta.value.length === 0) {
      listDataPeta.value = response.data;
      dataPeta.value = response.data;
    } else {
      dataPeta.value = response.data;
      kodeSentral.value = response.data[0].kode_sentral;
    }
  } catch (error) {
    notifyError("List Data Pembangkit Gagal Dimuat, Mohon Coba Lagi", false);
    console.error('Fetch Peta Sentral Error : ', error);
  }
}

const handleChangeSentral = async () => {
  try {
    isLoadingSentral.value = true;
    await fetchPetaSentral();
    // Clear stale state before navigating
    visitedMesin.value.clear();
    idMesin.value = [];
    tahunMesin.value = [];
    // Navigate — the route watcher will handle fetchDataSentral + fetchPeriodeTahunSentral
    await replaceSentral();
  } catch (error) {
    console.error('Handle Change Sentral Error : ', error);
    isLoadingSentral.value = false;
  }
}

const fetchPeriodeTahunSentral = async () => {
  try {
    const encryptStorage = await encryptStoragePromise;
    const response: any = await grafikService.getYearSentral({
      kode_sentral: nodeMode === 'production' ? encryptStorage.decryptValue(route.params.id.toString()) : route.params.id,
    });
    periodeTahunSentral.value = [response.data[0].tahun, response.data[response.data.length - 1].tahun];
    yearPickedSentral.value = response.data[response.data.length - 1].tahun;
    for (const item of dataUnit.value) {
      responseLimitTahun.value = await grafikService.getYearMesin({
        uuid_mesin: item.uuid_mesin
      });
      if (responseLimitTahun.value.data !== null) {
        selectedYear.value.push({ tahun: responseLimitTahun.value.data[responseLimitTahun.value.data.length - 1].tahun, range: [responseLimitTahun.value.data[0].tahun, responseLimitTahun.value.data[responseLimitTahun.value.data.length - 1].tahun] })
        console.log('year', responseLimitTahun.value.data, selectedYear.value)
      } else {
        selectedYear.value.push({ tahun: null, range: [null, null] })
      }
    }
    console.log(yearPickerService.filterYears(responseLimitTahun.value.data, parseInt(selectedYear.value[0].range[0]), parseInt(selectedYear.value[0].range[1])))
  } catch (error) {
    console.error('Fetch Tahun Grafik Sentral Error : ', error);
  }
}

watch(route, async (value) => {
  isLoadingSentral.value = true;
  isLoadingPeriode.value = true;
  try {
    visitedMesin.value.clear();
    await fetchDataSentral();
    // Mark the first mesin as visited so its components mount immediately
    if (selectedTitle.value && selectedTitle.value !== 'Unit Sentral') {
      visitedMesin.value.add(selectedTitle.value);
    }
  } finally {
    isLoadingSentral.value = false;
  }
  try {
    await fetchPeriodeTahunSentral();
  } finally {
    isLoadingPeriode.value = false;
  }
})

onMounted(async () => {
  isLoadingSentral.value = true;
  isLoadingPeriode.value = true;
  try {
    if (props.tabsTitle) {
      if (props.tabsTitle.length > 0) {
        selectedTitle.value = 'Unit Sentral';
      }
    }
    await fetchDataSentral();
    // If selectedTitle is a mesin name (not 'Unit Sentral'), mark it as visited
    if (selectedTitle.value && selectedTitle.value !== 'Unit Sentral') {
      visitedMesin.value.add(selectedTitle.value);
    }
  } finally {
    isLoadingSentral.value = false;
  }
  try {
    await Promise.all([fetchPetaSentral(), fetchPeriodeTahunSentral()]);
  } finally {
    isLoadingPeriode.value = false;
  }
});

function changeTab(tabb: number) {
  if (tabb === 1) {
    store.currentTabSentral = "WLC (Realisasi & Proyeksi)";
    stored.currentTabMesin = "WLC (Realisasi & Proyeksi)";
    tabs.value = "WLC (Realisasi & Proyeksi)";
  } else if (tabb === 2) {
    store.currentTabSentral = "Planning / Feasibility Study";
    stored.currentTabMesin = "Planning / Feasibility Study";
    tabs.value = "Planning / Feasibility Study";
  } else if (tabb === 3) {
    store.currentTabSentral = "Planning & Realisasi + Proyeksi";
    stored.currentTabMesin = "Planning & Realisasi + Proyeksi";
    tabs.value = "Planning & Realisasi + Proyeksi";
  } else if (tabb === 4) {
    store.currentTabSentral = "Planning vs Realisasi s/d Tahun Berjalan";
    stored.currentTabMesin = "Planning vs Realisasi s/d Tahun Berjalan";
    tabs.value = "Planning vs Realisasi s/d Tahun Berjalan";
  }
}

onUnmounted(() => {
  store.currentTabSentral = "WLC (Realisasi & Proyeksi)";
  stored.currentTabMesin = "WLC (Realisasi & Proyeksi)";
  tabs.value = "WLC (Realisasi & Proyeksi)";
})

provide("selectedTitle", selectedTitle);
</script>

<style scoped>
ul li.selected {
  border-bottom-width: 4px;
  border-color: #0099ad;
  color: #0099ad;
}

#tooltipContent::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent gray transparent;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.date-picker {
  width: 10rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
}

#tooltipContentPembina::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  rotate: 270deg;
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}
</style>
