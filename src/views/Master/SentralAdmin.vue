<template>
  <Loading v-if="isLoading" />
  <div class="min-h-screen bg-backgroundColor">
    <div class="flex flex-col h-full p-6 space-y-4 font-medium bg-white rounded-lg text-md">
      <div class="flex flex-col space-y-4">
        <div class="flex flex-row"
          v-if="authService.checkLevel() === 'Admin' || authService.checkLevel() === 'Pengelola' || authService.checkLevel() === 'Pembina'">
          <SearchBoxSuggestion v-if="listSuggestionSentral.length !== 0" v-model="searchQuery"
            :source="listSuggestionSentral" @on-key-enter="handleSearch" @on-click="handleSearch" />
          <ShimmerLoading class="h-8 w-80" v-else-if="listSuggestionSentral.length === 0" />
        </div>
        <div class="whitespace-nowrap" v-if="authService.checkLevel() === 'Admin'">
          <ul class="flex w-full overflow-x-auto" v-if="pengelolaData.length !== 0">
            <li
              class="p-2 ml-3 text-xs font-bold text-gray-400 border border-gray-300 rounded-lg cursor-pointer w-fit hover:text-primaryColor first:ml-0 hover:border-primaryColor hover:border-"
              v-for="pengelola in pengelolaData" :key="pengelola.id_pengelola"
              :class="{ selected: selectedPengelola.includes(pengelola.kode_pengelola) || selectedAll.includes(pengelola.kode_pengelola) }"
              @click="changeSelectedPengelola(pengelola.kode_pengelola)">
              {{ pengelola.pengelola }}
              <template
                v-if="selectedPengelola.includes(pengelola.kode_pengelola) || selectedAll.includes(pengelola.kode_pengelola)">
                <div class="absolute bottom-0 right-0">
                  <svg width="62" height="18" viewBox="0 0 62 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle opacity="0.15" cx="59.5" cy="59.5" r="59.5" fill="#80C1CD" />
                  </svg>
                </div>
                <div class="absolute bottom-0 right-0">
                  <svg width="22" height="40" viewBox="0 0 22 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle opacity="0.15" cx="59.5" cy="41.5" r="59.5" fill="#80C1CD" />
                  </svg>
                </div>
              </template>
            </li>
          </ul>
        </div>
      </div>
      <div v-auto-animate="{ duration: 300 }" class="flex flex-col w-full p-3 border rounded-lg"
        v-for="(sentralItem, sentralIndex) in sentralData" :key="sentralItem.id_sentral">
        <div class="flex items-center justify-between cursor-pointer"
          @click="togglePembangkit(sentralItem.kode_sentral)">
          <h2 class="text-base font-bold text-primaryColor">
            {{ sentralItem.nama_sentral }}
          </h2>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w.org/2000/svg"
            v-if="!isPembangkitOpen(sentralItem.kode_sentral)">
            <path d="M6 9.5L12 15.5L18 9.5" stroke="black" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" v-else>
            <path d="M3.5 9.25L7 5.75L10.5 9.25" stroke="#F7FBFC" stroke-width="1.16667" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M6 15.5L12 9.5L18 15.5" stroke="black" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
        <div class="mt-3" v-if="isPembangkitOpen(sentralItem.kode_sentral)">
          <!--Divider-->
          <div class="border-b"></div>
          <TabWrapperSentral v-if="sentralData" :is-lihat-grafik="false" :is-rekap="false"
            :tabsTitles="sentralItem.mesins" :class="'mt-3'">
            <TabItem :title="'Sentral'">
              <!--Statis Udah Pasti Sentral-->
              <template v-if="sentralData">
                <div class="flex items-start justify-start mt-3">
                  <img v-if="sentralItem.photo !== ''" :src="sentralItem.photo2" alt="Preview"
                    class="object-cover w-40 mr-6 rounded-lg h-44"></img>
                  <div v-else class="w-40 mr-6 bg-red-500 rounded-lg h-44"></div>
                  <div class="grid grid-cols-4 gap-y-5 gap-x-10">
                    <div>
                      <h3 class="text-gray-400">Nilai Aset Awal</h3>
                      <p class="text-gray-400">
                        <span class="text-sm font-semibold text-primaryTextColor">{{
                          calculateNilaiAsetAwalSentral(sentralItem.mesins) !== '-' ?
                            globalFormat.formatRupiah(calculateNilaiAsetAwalSentral(sentralItem.mesins)) : '-' }}</span>
                        Rp
                        (Juta)
                      </p>
                    </div>
                    <div>
                      <h3 class="text-gray-400">Daya Terpasang</h3>
                      <p class="text-sm font-semibold text-primaryTextColor">
                        {{ globalFormat.formatRupiah((sentralItem.daya_terpasang / 1000)) }}
                        <span class="text-gray-400">MW</span>
                      </p>
                    </div>
                    <div>
                      <h3 class="text-gray-400">Daya Mampu Netto (DMN)</h3>
                      <p class="text-sm font-semibold text-primaryTextColor">
                        {{ globalFormat.formatRupiah((sentralItem.daya_mampu / 1000)) }}
                        <span class="text-gray-400">MW</span>
                      </p>
                    </div>
                    <div>
                      <h3 class="text-gray-400">Jenis Bahan Bakar Utama</h3>
                      <p class="text-sm font-semibold text-primaryTextColor">
                        {{ sentralItem.jenis_bahan_bakar }}
                      </p>
                    </div>
                    <div>
                      <h3 class="text-gray-400">Longitude (Garis Bujur)</h3>
                      <p class="text-sm font-semibold text-primaryTextColor">
                        {{ sentralItem.longitude }}
                      </p>
                    </div>
                    <div>
                      <h3 class="text-gray-400">
                        Latitude (Garis Lintang)
                      </h3>
                      <p class="text-sm font-semibold text-primaryTextColor">
                        {{ sentralItem.latitude }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-4 border-b"></div>
                <RouterLink :to="{
                  name: 'detail-unit',
                  params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(sentralItem.id_sentral) : sentralItem.id_sentral },
                  query: { kode_pengelola: sentralItem.kode_pengelola, tab: 'Sentral' },
                }">
                  <button
                    class="flex items-center p-3 mt-2 mr-10 duration-300 rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white">
                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg"
                      class="mr-2 fill-primaryColor">
                      <path
                        d="M16.4402 9.2C14.9252 5.6825 12.0752 3.5 9.00017 3.5C5.92517 3.5 3.07517 5.6825 1.56017 9.2C1.51887 9.29462 1.49756 9.39676 1.49756 9.5C1.49756 9.60324 1.51887 9.70538 1.56017 9.8C3.07517 13.3175 5.92517 15.5 9.00017 15.5C12.0752 15.5 14.9252 13.3175 16.4402 9.8C16.4815 9.70538 16.5028 9.60324 16.5028 9.5C16.5028 9.39676 16.4815 9.29462 16.4402 9.2ZM9.00017 14C6.62267 14 4.37267 12.2825 3.07517 9.5C4.37267 6.7175 6.62267 5 9.00017 5C11.3777 5 13.6277 6.7175 14.9252 9.5C13.6277 12.2825 11.3777 14 9.00017 14ZM9.00017 6.5C8.40683 6.5 7.82681 6.67595 7.33346 7.00559C6.84011 7.33524 6.4556 7.80377 6.22853 8.35195C6.00147 8.90013 5.94206 9.50333 6.05782 10.0853C6.17357 10.6672 6.45929 11.2018 6.87885 11.6213C7.29841 12.0409 7.83296 12.3266 8.4149 12.4424C8.99684 12.5581 9.60004 12.4987 10.1482 12.2716C10.6964 12.0446 11.1649 11.6601 11.4946 11.1667C11.8242 10.6734 12.0002 10.0933 12.0002 9.5C12.0002 8.70435 11.6841 7.94129 11.1215 7.37868C10.5589 6.81607 9.79582 6.5 9.00017 6.5ZM9.00017 11C8.7035 11 8.41349 10.912 8.16682 10.7472C7.92014 10.5824 7.72788 10.3481 7.61435 10.074C7.50082 9.79994 7.47112 9.49834 7.52899 9.20736C7.58687 8.91639 7.72973 8.64912 7.93951 8.43934C8.14929 8.22956 8.41657 8.0867 8.70754 8.02882C8.99851 7.97094 9.30011 8.00065 9.5742 8.11418C9.84829 8.22771 10.0826 8.41997 10.2474 8.66665C10.4122 8.91332 10.5002 9.20333 10.5002 9.5C10.5002 9.89782 10.3421 10.2794 10.0608 10.5607C9.77953 10.842 9.398 11 9.00017 11Z" />
                    </svg>
                    <span class="font-semibold">Lihat Detail</span>
                  </button>
                </RouterLink>
              </template>
            </TabItem>
            <TabItem v-for="(mesinItem, mesinIndex) in sentralItem.mesins" :key="mesinIndex" :title="mesinItem.mesin">
              <template v-if="sentralData">
                <div class="mt-3">
                  <div class="flex items-start justify-start mt-3">
                    <img v-if="mesinItem.photo1 !== ''" :src="mesinItem.photo2" alt="Preview"
                      class="object-cover w-40 mr-6 rounded-lg h-44"></img>
                    <div v-else class="w-40 mr-6 bg-red-500 rounded-lg h-44"></div>
                    <div class="grid grid-cols-4 gap-y-5 gap-x-10">
                      <div>
                        <h3 class="text-gray-400">Nilai Aset Awal</h3>
                        <p class="text-gray-400">
                          <span class="text-sm font-semibold text-primaryTextColor">{{
                            mesinItem.nilai_asset_awal !== 0 ? globalFormat.formatRupiah(mesinItem.nilai_asset_awal /
                              1000000) :
                              '-' }}</span> Rp (Juta)
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Tahun COD</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ mesinItem.tahun_operasi }}
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Masa Manfaat</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ mesinItem.masa_manfaat }}
                          <span class="text-gray-400"> Tahun</span>
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Sisa Masa Manfaat</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">{{ mesinItem.tahun_operasi == 0 ||
                          mesinItem.masa_manfaat == 0 ? 0 : (parseInt(mesinItem.tahun_operasi) +
                            parseInt(mesinItem.masa_manfaat))
                          - tahunBerjalan }}<span class="text-gray-400"> Tahun</span>
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Daya Terpasang</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ globalFormat.formatRupiah((mesinItem.daya_terpasang / 1000))
                          }}<span class="text-gray-400"> MW</span>
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">
                          Daya Mampu Netto (DMN)
                        </h3>
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ globalFormat.formatRupiah((mesinItem.daya_mampu / 1000))
                          }}<span class="text-gray-400"> MW</span>
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Kondisi Mesin</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ mesinItem.kondisi_unit }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-4 border-b"></div>
                <RouterLink :to="{
                  name: 'detail-unit',
                  params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(sentralItem.id_sentral) : sentralItem.id_sentral },
                  query: { kode_pengelola: sentralItem.kode_pengelola, tab: mesinItem.mesin },
                }">
                  <button
                    class="flex items-center p-3 mt-2 mr-10 duration-300 rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white">
                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg"
                      class="mr-2 fill-primaryColor">
                      <path
                        d="M16.4402 9.2C14.9252 5.6825 12.0752 3.5 9.00017 3.5C5.92517 3.5 3.07517 5.6825 1.56017 9.2C1.51887 9.29462 1.49756 9.39676 1.49756 9.5C1.49756 9.60324 1.51887 9.70538 1.56017 9.8C3.07517 13.3175 5.92517 15.5 9.00017 15.5C12.0752 15.5 14.9252 13.3175 16.4402 9.8C16.4815 9.70538 16.5028 9.60324 16.5028 9.5C16.5028 9.39676 16.4815 9.29462 16.4402 9.2ZM9.00017 14C6.62267 14 4.37267 12.2825 3.07517 9.5C4.37267 6.7175 6.62267 5 9.00017 5C11.3777 5 13.6277 6.7175 14.9252 9.5C13.6277 12.2825 11.3777 14 9.00017 14ZM9.00017 6.5C8.40683 6.5 7.82681 6.67595 7.33346 7.00559C6.84011 7.33524 6.4556 7.80377 6.22853 8.35195C6.00147 8.90013 5.94206 9.50333 6.05782 10.0853C6.17357 10.6672 6.45929 11.2018 6.87885 11.6213C7.29841 12.0409 7.83296 12.3266 8.4149 12.4424C8.99684 12.5581 9.60004 12.4987 10.1482 12.2716C10.6964 12.0446 11.1649 11.6601 11.4946 11.1667C11.8242 10.6734 12.0002 10.0933 12.0002 9.5C12.0002 8.70435 11.6841 7.94129 11.1215 7.37868C10.5589 6.81607 9.79582 6.5 9.00017 6.5ZM9.00017 11C8.7035 11 8.41349 10.912 8.16682 10.7472C7.92014 10.5824 7.72788 10.3481 7.61435 10.074C7.50082 9.79994 7.47112 9.49834 7.52899 9.20736C7.58687 8.91639 7.72973 8.64912 7.93951 8.43934C8.14929 8.22956 8.41657 8.0867 8.70754 8.02882C8.99851 7.97094 9.30011 8.00065 9.5742 8.11418C9.84829 8.22771 10.0826 8.41997 10.2474 8.66665C10.4122 8.91332 10.5002 9.20333 10.5002 9.5C10.5002 9.89782 10.3421 10.2794 10.0608 10.5607C9.77953 10.842 9.398 11 9.00017 11Z" />
                    </svg>
                    <span class="font-semibold">Lihat Detail</span>
                  </button>
                </RouterLink>
              </template>
            </TabItem>
          </TabWrapperSentral>
        </div>
      </div>
      <div class="flex items-center justify-between w-full mt-7">
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
            <button @click="goToPrevious" :disabled="currentPage === 1" :class="{ 'text-gray-500': currentPage === 1 }"
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
            :class="{ selected: item === currentPage, disabled: item === '...' }"
            class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
            @click="goToPage(item)">
            {{ item }}
          </li>
          <li>
            <button @click="goToNext" :disabled="currentPage === totalPages"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { encryptStorage } from "@/utils/app-encrypt-storage";
import TabWrapperSentral from "@/components/MasterUnitSentral/TabWrapperSentral.vue";
import TabItem from "@/components/ui/TabItem.vue";
import DetailSentralService from "@/services/detail-sentral-service";
const detailSentralService = new DetailSentralService();
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import SentralService from "@/services/sentral-service";
const sentralService = new SentralService();
import AuthService from "@/services/auth-service";
const authService = new AuthService();
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import SearchBoxSuggestion from "@/components/ui/SearchBoxSuggestion.vue";

const nodeMode = import.meta.env.MODE;
const isPembangkitTabOpen = ref<string[]>([]);
const sentralData = ref<SentralItem[]>([]);
const listSentralData = ref<any[]>([]);
const pengelolaData = ref<any[]>([]);
const comboJenisKit = ref<ComboJenisKitItem>();
const selectedPengelola = ref<string[]>([]);
const currentPage = ref(1);
const totalPages = ref(0);
const pageLimit = ref(10);
const totalRecords = ref();
const searchQuery = ref<string>('');
const mesinSisaIRRNPV = ref();
const listSuggestionSentral = ref<any[]>([]);
const isLoading = ref();
const selectedAll = ref<string[]>(['ALL']);
const tahunBerjalan = new Date().getFullYear();

interface PengelolaItem {
  data: any
  id_pengelola: number
  kode_pengelola: string
  pengelola: string
}
interface SentralItem {
  meta: any
  data: any
  id_sentral: number
  kode_sentral: string
  nama_sentral: string
  daya_terpasang: number
  daya_mampu: number
  jenis_bahan_bakar: string
  kode_pengelola: string
  longitude: string
  latitude: string
  photo: string
  photo2: string
  mesins: any
}
interface ComboJenisKitItem {
  data: any
}

const fetchSuggestionSentral = async () => {
  try {
    const response: any = await sentralService.getSuggestionSentral();
    listSuggestionSentral.value = response.data.filter((value: any, index: any, self: any) =>
      index === self.findIndex((t: any) => (
        t.sentral === value.sentral
      ))
    );
  } catch (error) {
    console.error('Fetch Suggestion Sentral Error : ', error);
  }
}
const fetchSentralData = async () => {
  try {
    isLoading.value = true;
    const response: SentralItem = await sentralService.getSentralData(selectedPengelola.value, currentPage.value, pageLimit.value, searchQuery.value);
    const { data, meta } = response;
    if (listSentralData.value.length === 0) {
      listSentralData.value = data;
      sentralData.value = data.map((val: any) => ({ ...val, photo2: '' }));
    } else {
      sentralData.value = data;
    }
    totalPages.value = meta.totalPages;
    totalRecords.value = meta.totalRecords;
    pageLimit.value = meta.limit;
    for (const val of sentralData.value) {
      try {
        const response: any = await detailSentralService.getPhoto(val.photo);
        const blob = new Blob([response]);
        val.photo2 = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Error Fetch Photo: ', error);
      }
    }
    console.log(sentralData.value, 'sentralData')
    for (const val of sentralData.value) {
      for (const key in val.mesins) {
        if (val.mesins[key].photo1 !== '') {
          try {
            const response: any = await detailSentralService.getPhoto(val.mesins[key].photo1);
            const blob = new Blob([response]);
            val.mesins[key].photo2 = URL.createObjectURL(blob);
          } catch (error) {
            console.error('Error Fetch Photo: ', error);
          }
        }
      }
    }
    isPembangkitTabOpen.value.push(data[0].kode_sentral);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
const fetchPengelolaData = async () => {
  try {
    const response: PengelolaItem = await sentralService.getPengelolaData();
    pengelolaData.value = response.data;
    pengelolaData.value.push({
      id_pengelola: 0,
      kode_pengelola: "ALL",
      pengelola: "ALL"
    });
    pengelolaData.value.reverse();
  } catch (error) {
    console.error(error);
  }
};
const fetchComboJenisKit = async () => {
  try {
    const response: ComboJenisKitItem =
      await sentralService.getComboJenisKitData();
    comboJenisKit.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const fetchNilaiMesin = async () => {
  try {
    const response: any = await sentralService.getNilaiMesin();
    mesinSisaIRRNPV.value = response.data;
  } catch (error) {
    console.error('Fetch Nilai Sentral Error : ' + error)
  }
}
const changeSelectedPengelola = async (pengelola: any) => {
  isLoading.value = true;
  if (pengelola === 'ALL') {
    selectedAll.value.push(pengelola);
    selectedPengelola.value = [];
    await fetchSentralData();
  } else {
    if (!selectedPengelola.value.includes(pengelola)) {
      selectedAll.value = [];
      selectedPengelola.value.push(pengelola);
      await fetchSentralData();
    } else {
      if (selectedPengelola.value.length === 1) {
        selectedPengelola.value = [];
        selectedAll.value = ['ALL'];
      }
      const pengelolaIndex = selectedPengelola.value.indexOf(pengelola);
      selectedPengelola.value.splice(pengelolaIndex, 1);
      await fetchSentralData();
    }
  }
  isLoading.value = false;
}
const handleSearch = async () => {
  isLoading.value = true;
  currentPage.value = 1;
  await fetchSentralData();
  isLoading.value = false;
}
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
const togglePembangkit = async (kodeSentral: string) => {
  if (isPembangkitOpen(kodeSentral)) {
    isPembangkitTabOpen.value = isPembangkitTabOpen.value.filter(
      (id) => id !== kodeSentral
    );
  } else {
    isPembangkitTabOpen.value.push(kodeSentral);
  }
};
const isPembangkitOpen = (kodeSentral: string) => {
  return isPembangkitTabOpen.value.includes(kodeSentral);
};
const changePageLimit = async (event: any) => {
  isLoading.value = true;
  pageLimit.value = parseInt(event.target.value);
  currentPage.value = 1;
  await fetchSentralData();
  isLoading.value = false;
};
const goToPage = async (page: any) => {
  isLoading.value = true;
  currentPage.value = page;
  await fetchSentralData();
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
const calculateNilaiAsetAwalSentral = (mesins: any) => {
  const tempNilaiAsetAwalSentral = mesins.reduce((acc: any, mesin: any) => {
    return acc + mesin.nilai_asset_awal
  }, 0);
  return tempNilaiAsetAwalSentral !== 0 ? tempNilaiAsetAwalSentral / 1000000 : '-';
}

watch(searchQuery, async (val) => {
  if (val === '') {
    await fetchSentralData();
  }
});

onMounted(async () => {
  isLoading.value = true;
  await fetchSuggestionSentral();
  await fetchSentralData();
  isLoading.value = true;
  fetchComboJenisKit();
  fetchPengelolaData();
  fetchNilaiMesin();
  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
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
