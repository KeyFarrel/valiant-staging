<template>
  <Loading v-if="isLoading" />
  <div class="w-full bg-white border rounded-md h-22">
    <div class="justify-between md:flex">
      <div class="flex items-center py-1.5 px-4">
        <SearchBox @on-focus="handleFocus" v-model="selectedSearchQuery" class="w-60" />
        <ModalSearch v-if="isSearchModalOpen" v-model="searchQuery" :show-modal="isSearchModalOpen"
          :source="listDataPeta" @on-click-close="isSearchModalOpen = false" @on-escape="isSearchModalOpen = false"
          @on-click="selectedSearchQuery = searchQuery; isSearchModalOpen = false; handleChangeSentral()"
          @on-key-enter="selectedSearchQuery = searchQuery; isSearchModalOpen = false; handleChangeSentral()" />
      </div>
      <div class="px-4 py-3">
        <div class="flex flex-row items-center ml-4 space-x-3">
          <label class="text-sm font-semibold text-labelColor" for="">Periode</label>
          <VueDatePicker class="mr-3 date-picker" v-model="yearPickedSentral" :year-range="periodeTahunSentral"
            :clearable="false" year-picker />
        </div>
        <!-- <div v-for="(item, i) in dataUnit" :key="i" v-show="selectedTitle === item.mesin" class="flex flex-row items-center ml-4 space-x-3">
          <label class="text-sm font-semibold text-labelColor" for="">Periode</label>
          <VueDatePicker class="mr-3 date-picker" v-model="yearPickedMesin" :year-range="periodeTahunMesin" :clearable="false" year-picker/>
        </div> -->
      </div>
    </div>
    <div class="sticky top-0 z-10 bg-white">
      <div>
        <ul class="flex pb-2 overflow-auto font-medium text-center whitespace-nowrap scrollbar-hide">
          <!-- <li class="ml-5 text-gray-500 transition-all duration-300 cursor-pointer"
            :class="{ selected: 'Unit Sentral' === selectedTitle }" @click="selectedTitle = 'Unit Sentral'">
            Unit Sentral
          </li> -->
          <li v-for="(item, i) in dataUnit" :key="i"
            class="ml-5 text-gray-500 transition-all duration-300 cursor-pointer"
            :class="{ selected: item.mesin === selectedTitle }" @click="changeTabMesin(item.mesin)">
            {{ item.mesin }}
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Sental -->
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
            <div>
              <div class="flex flex-row mt-4">
                <Chips :title="'Unit Pengelola'" :content="dataSentral.pengelola" />
                <Chips :title="'Unit Pembina'" :content="dataSentral.pembina" />
                <Chips :title="'Jumlah Unit'" :content="dataSentral.jumlah_mesin" />
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-blue-50 px-3 py-1 text-xs">
                  <p class="text-[#007E8F]">Tahun COD :</p>
                  <div class="font-bold text-[#007E8F] ml-1">
                    {{ dataSentral.tahun }}
                  </div>
                  <div class="flex flex-col items-center ml-2">
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                      @mouseover="toggleDetail" @mouseout="toggleDetail">
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
            <div class=" text-[#0099AD] font-semibold mt-1.5 text-xs cursor-pointer z-20" @click="showElement">
              Ubah Grafik
              <Transition>
                <div v-if="message"
                  class="flex flex-col bg-white text-xs px-2 py-1 mt-0.5 left-12 rounded-lg whitespace-nowrap border space-y-1.5 duration-300"
                  id="FilterContent">
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
                      class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                      Planning / FS
                    </button>
                  </div>
                  <div>
                    <button @click="changeTab(1)"
                      class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                      WLC (Realisasi & Proyeksi)
                    </button>
                  </div>
                  <div>
                    <button @click="changeTab(3)"
                      class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                      Planning & Realisasi + Proyeksi
                    </button>
                  </div>
                  <div>
                    <button @click="changeTab(4)"
                      class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
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
          <TagSentral :id-sentral="idSentral" :tahun-data="parseInt(yearPickedSentral)"
            v-if="dataSentral.length !== 0" />
        </div>
      </div>
    </div>
    <div class="w-full mt-2 bg-white border rounded-md h-1/2">
      <GrafikSentral :id-sentral="idSentral" :tahun-data="parseInt(yearPickedSentral)"
        v-if="dataSentral.length !== 0" />
    </div>
    <div class="grid grid-cols-3 gap-3 mt-2">
      <InfoSentral :id-sentral="idSentral" :tahun-data="parseInt(yearPickedSentral)" v-if="dataSentral.length !== 0" />
    </div>
  </div>
  <!-- Mesin -->
  <div v-for="(item, i) in dataUnit" :key="i" v-show="selectedTitle === item.mesin" @click="selectedTitle = item.mesin">
    <div class="flex mt-2">
      <div v-auto-animate="{ duration: 300 }" class="w-full px-4 py-2 mr-2 bg-white border rounded-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="ml-1 text-lg font-semibold text-primaryTextColor">
              {{ item.mesin }}
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
            <div>
              <div class="flex flex-row mt-4">
                <Chips :title="'Unit Pengelola'" :content="item.pengelola" />
                <Chips :title="'Unit Pembina'" :content="item.pembina" />
                <Chips :title="'Tahun COD'" :content="item.tahun" />
              </div>
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
            <div class=" text-[#0099AD] font-semibold mt-1.5 text-xs cursor-pointer z-20" @click="showElement">
              Ubah Grafik
              <Transition>
                <div v-if="message"
                  class="flex flex-col bg-white text-xs px-2 py-1 mt-0.5 left-12 rounded-lg whitespace-nowrap border space-y-1.5 duration-300"
                  id="FilterContent">
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
                      class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                      Planning / FS
                    </button>
                  </div>
                  <div>
                    <button @click="changeTab(1)"
                      class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                      WLC (Realisasi & Proyeksi)
                    </button>
                  </div>
                  <div>
                    <button @click="changeTab(3)"
                      class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                      Planning & Realisasi + Proyeksi
                    </button>
                  </div>
                  <div>
                    <button @click="changeTab(4)"
                      class="block text-left px-2 w-full py-1.5 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
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
          <TagMesin :id-mesin="item.id_mesin" :tahun-data="parseInt(yearPickedSentral)" v-if="dataUnit.length !== 0" />
        </div>
      </div>
    </div>
    <div class="w-full mt-2 bg-white border rounded-md h-1/2">
      <GrafikMesin :id-mesin="item.id_mesin" :tahun-data="parseInt(yearPickedSentral)" v-if="dataUnit.length !== 0" />
    </div>
    <div class="grid grid-cols-3 gap-3 mt-2">
      <InfoMesin :id-mesin="item.id_mesin" :tahun-data="parseInt(yearPickedSentral)" v-if="dataUnit.length !== 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { useTagSentral } from "@/store/storeTagGrafik";
import { useTagMesin } from "@/store/storeTagGrafik";
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
import { notifyError } from "@/services/helper/toast-notification";
// import Export from "@/components/ui/ExportModal.vue";
// import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
// const periodeTahunMesin = ref<Array<number>>([]);

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
const idMesin = ref<any>([]);
const namaMesin = ref<any>();
const tahunMesin = ref<any>([]);
const searchQuery = ref("");
const selectedSearchQuery = ref("");
const isSearchModalOpen = ref<boolean>(false);
const periodeTahunSentral = ref<any>();
const yearPickedSentral = ref<any>();

const isLoading = ref(false);
const isHover = ref(true);
const isOver = ref(false);
const message = ref(false);
const tabs = ref("WLC (Realisasi & Proyeksi)");
// const selectedTitle = ref("Unit Sentral");
const selectedTitle = ref(namaMesin);

function toggleButton() {
  isHover.value = !isHover.value;
}

function toggleDetail() {
  isOver.value = !isOver.value;
}

const props = defineProps({
  tabsTitle: Array as () => UnitItem[],
});

const changeTabMesin = async (mesin: any) => {
  selectedTitle.value = mesin;
};

function showElement() {
  message.value = !message.value;
}

const handleFocus = () => {
  isSearchModalOpen.value = true;
}

interface SentralItem {
  data: any;
  kode_sentral: string;
  id_sentral: string;
  sentral: string;
  pengelola: string;
  pembina: string;
  jenis_pembangkit: string;
  data_terpasang: string;
  data_mampu: string;
  asset_awal: string;
  jumlah_mesin: number;
  tahun_nilai_perolehan: string;
  tahun_data: string;
  tahun: number;
  photo: string;
}

interface UnitItem {
  kode_sentral: string;
  mesin: string;
  id_mesin: number;
  sentral: string;
  pengelola: string;
  pembina: string;
  jenis_pembangkit: string;
  data_terpasang: string;
  data_mampu: string;
  asset_awal: string;
  sisa_masa_manfaat: number;
  masa_manfaat: number;
  tahun_data: string;
  tahun_nilai_perolehan: string;
  tahun: number;
  photo: string;
}

const fetchDataSentral = async () => {
  try {
    isLoading.value = true;
    const response: SentralItem = await petaService.getSentralByKode(
      route.params.id
    );
    // const { data } = response;
    dataSentral.value = response.data;
    idSentral.value = response.data.id_sentral;
    tahunSentral.value = response.data.tahun_data;
    dataUnit.value = response.data.mesins;
    namaMesin.value = response.data.mesins[0].mesin;
    for (var i = 0; i < response.data.mesins.length; i++) {
      idMesin.value.push(response.data.mesins[i].id_mesin)
      tahunMesin.value.push(response.data.mesins[i].tahun_data)
    }
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};

const replaceSentral = async () => {
  router.push({ path: `/grafik/${kodeSentral.value}` });
};

const fetchPetaSentral = async () => {
  try {
    isLoading.value = true;
    const response: any = await petaService.getPetaSentral({
      sentral: searchQuery.value,
      pengelola: [],
      pembina: [],
      jenis_kit: [],
      daya_mampu: [],
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
  } finally {
    isLoading.value = false;
  }
}

const handleChangeSentral = async () => {
  try {
    await fetchPetaSentral();
    replaceSentral();
    selectedTitle.value = namaMesin;
  } catch (error) {
    console.error('Handle Change Sentral Error : ' + error);
  }
}

// const tahunSen = tahunSentral;
// const yearPickedSentral = ref(tahunSen);
// const tahunMes = tahunMesin;
// const yearPickedMesin = ref(tahunMes);

const fetchPeriodeTahunSentral = async () => {
  try {
    const response: any = await grafikService.getYearSentral({
      kode_sentral: route.params.id,
    });
    periodeTahunSentral.value = [response.data[0].tahun, response.data[response.data.length - 1].tahun];
    yearPickedSentral.value = response.data[response.data.length - 1].tahun
    // console.log('year', yearPickedSentral.value)
  } catch (error) {
    console.error('Fetch Tahun Grafik Sentral Error : ' + error);
  }
}

// const fetchPeriodeTahunMesin = async () => {
//   try {
//     const response: any = await grafikService.getYearMesin({
//       id_mesin: idMesin.value,
//     });
//     periodeTahunMesin.value = [response.data[0].tahun, response.data[response.data.length - 1].tahun];
//   } catch (error) {
//     console.error('Fetch Tahun Grafik Mesin Error : ' + error);
//   }
// }

watch(route, async (value) => {
  await fetchDataSentral();
  await fetchPeriodeTahunSentral();
  // await fetchPeriodeTahunMesin();
})

onMounted(async () => {
  if (props.tabsTitle) {
    if (props.tabsTitle.length > 0) {
      selectedTitle.value = 'Unit Sentral';
    }
  }
  await fetchDataSentral();
  await fetchPetaSentral();
  await fetchPeriodeTahunSentral();
  // await fetchPeriodeTahunMesin();
});

function changeTab(tabb: number) {
  if (tabb === 1) {
    store.currentTabSentral = "WLC (Realisasi & Proyeksi)";
    stored.currentTabMesin = "WLC (Realisasi & Proyeksi)";
    tabs.value = "WLC (Realisasi & Proyeksi)";
  } else if (tabb === 2) {
    store.currentTabSentral = "Planning / FS";
    stored.currentTabMesin = "Planning / FS";
    tabs.value = "Planning / FS";
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

provide("selectedTitle", selectedTitle);
</script>

<style scoped>
ul li.selected {
  border-bottom-width: 5px;
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

#FilterContent {
  position: absolute;
  z-index: 1;
  top: 100%;
  /* left: 50%; */
  /* margin-top: -8px; */
  margin-left: -220px;
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
</style>
