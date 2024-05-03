<template>
  <Loading v-if="isLoading" />
  <ModalWrapper :show-modal="isConfirmationOpen" :width="'w-auto'" :height="'h-auto'">
    <ConfirmationDialog :title="'Konfirmasi'" :subtitle="'Apakah anda yakin menyimpan data mesin tersebut? <br>'"
      :button-title="'Kirim'" @on-batal-click="isConfirmationOpen = false"
      @on-accept-click="updateMesinById(selectedMesin.idMesin, selectedMesin.mesinIndex, selectedMesin.namaMesin)" />
  </ModalWrapper>
  <div class="flex flex-col h-full p-6 font-medium bg-white rounded-lg text-md">
    <ul class="flex items-end mb-4 overflow-auto border-b-2 border-gray-50 whitespace-nowrap">
      <li class="pb-2 mr-10 text-base font-bold transition-all duration-300 cursor-pointer text-textDisabledColor"
        :class="{ selected: 'Sentral' === selectedTitle }" @click="
          selectedTitle = 'Sentral';
        replaceSentralTab();
        ">
        Sentral
      </li>
      <li class="pb-2 mr-10 text-base font-bold transition-all duration-300 cursor-pointer text-textDisabledColor"
        v-for="(tab, mesinIndex) in mesin" :key="mesinIndex" @click="
          selectedTitle = tab.mesin;
        replaceUnitTab(tab.mesin);
        " :class="{ selected: tab.mesin === selectedTitle }">
        {{ tab.mesin }}
      </li>
    </ul>
    <div v-show="selectedTitle == 'Sentral'">
      <template v-if="sentralDataById">
        <div class="flex flex-col mt-5">
          <div class="flex items-center justify-between">
            <h2 class="pl-2 text-lg font-bold border-l-4 border-primaryColor">
              Informasi Unit Sentral
            </h2>
            <button
              class="flex items-center px-3 py-2 duration-300 border rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white border-primaryColor"
              @click="toggleEdit('Sentral')" v-if="!isEditOpen('Sentral')">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="mr-2">
                <g clip-path="url(#clip0_1055_14765)">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M11.9548 2.04663C11.7554 1.8473 11.4323 1.8473 11.2329 2.04663L10.661 2.61853L11.3829 3.34036L11.9548 2.76847C12.1541 2.56914 12.1541 2.24596 11.9548 2.04663ZM10.5579 4.16532L9.83607 3.44348L2.85121 10.4283C2.61135 10.6682 2.43503 10.9641 2.33819 11.2892L2.1795 11.8219L2.71225 11.6632C3.03735 11.5664 3.3332 11.39 3.57306 11.1502L10.5579 4.16532ZM10.408 1.22168C11.0629 0.566733 12.1248 0.566733 12.7797 1.22168C13.4347 1.87662 13.4347 2.93849 12.7797 3.59343L4.39802 11.9751C4.02109 12.3521 3.55619 12.6291 3.04532 12.7813L1.47913 13.2479C1.27385 13.309 1.05157 13.2527 0.900117 13.1013C0.748661 12.9498 0.692391 12.7275 0.753539 12.5223L1.22008 10.9561C1.37226 10.4452 1.64933 9.98032 2.02625 9.60339L10.408 1.22168Z"
                    fill="#0099AD" />
                </g>
                <defs>
                  <clipPath id="clip0_1055_14765">
                    <rect width="14" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p class="font-semibold">Edit Detail</p>
            </button>
          </div>
          <div class="flex w-full h-auto mt-5">
            <div class="flex flex-col w-48 mr-8">
              <div class="mb-3 bg-red-600 h-44" :class="isEdit ? 'rounded-t-lg' : 'rounded-lg'"></div>
              <div v-if="isEditOpen('Sentral')">
                <button
                  class="w-full h-8 mb-2 text-sm duration-300 border rounded-md text-primaryColor border-primaryColor hover:border-blue-600 hover:text-white hover:bg-blue-600">
                  Pilih Foto
                </button>
                <p class="text-xxs">
                  Besar file: maksimum 10.000.000 bytes (10 Megabytes). Ekstensi
                  file yang diperbolehkan: .JPG .JPEG .PNG
                </p>
              </div>
            </div>
            <div class="grid content-start w-full grid-cols-4 gap-5 text-sm">
              <div>
                <h6>Nilai Aset Awal</h6>
                <p class="text-textDisabledColor"><span class="font-semibold text-black">{{
                    globalFormat.formatRupiah(parseFloat(nilaiAsetAwalSentral) /
                    1000000) }}</span> Rp (Juta)</p>
              </div>
              <div>
                <h6>Daya Terpasang</h6>
                <p class="font-semibold">
                  {{ globalFormat.formatRupiah((sentralDataById.daya_terpasang / 1000)) }}
                  <span class="text-textDisabledColor">MW</span>
                </p>
              </div>
              <div>
                <h6>Daya Mampu (DMN)</h6>
                <p class="font-semibold">
                  {{ globalFormat.formatRupiah((sentralDataById.daya_mampu / 1000)) }}
                  <span class="text-textDisabledColor">MW</span>
                </p>
              </div>
              <div>
                <h6>Jenis Bahan Bakar Utama</h6>
                <p class="font-semibold">
                  {{ sentralDataById.jenis_bahan_bakar }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full mt-6">
          <h2 class="pl-2 text-lg font-bold border-l-4 border-primaryColor">
            Titik Koordinat
          </h2>
          <div class="grid grid-cols-4 gap-5 mt-5">
            <div>
              <h3 class="text-textDisabledColor">
                Longitude (Garis Bujur)
              </h3>
              <input type="text" name="" id="" class="w-full h-10 border-gray-300 rounded-lg"
                v-if="isSentral == true ? null : isEdit" />
              <p class="font-semibold" v-else>
                {{ sentralDataById.longitude }}
              </p>
            </div>
            <div>
              <h3 class="text-textDisabledColor">
                Latitude (Garis Lintang)
              </h3>
              <input type="text" name="" id="" class="w-full h-10 border-gray-300 rounded-lg"
                v-if="isSentral == true ? null : isEdit" />
              <p class="font-semibold" v-else>{{ sentralDataById.latitude }}</p>
            </div>
          </div>
          <div class="relative z-30 w-full mt-4 rounded-lg h-52">
            <ol-map style="width: 100%; height: 100%">
              <ol-view ref="viewRef" :center="center.sentral" :rotation="rotation" :zoom="zoom" :minZoom="4"
                :projection="projection" />
              <ol-tile-layer>
                <ol-source-osm />
              </ol-tile-layer>
              <ol-overlay :position="[sentralDataById.longitude, sentralDataById.latitude]">
                <img class="w-4 h-4" src="../../assets/img/Non-EBT.png" />
              </ol-overlay>
            </ol-map>
          </div>
        </div>
        <div class="mt-4 border-t" v-if="isEditOpen('Sentral')"></div>
        <div class="flex justify-end mt-4" v-if="isEditOpen('Sentral')">
          <button
            class="px-3 py-2 mr-3 text-sm font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-blue-600 hover:border-blue-600"
            @click="toggleEdit('Sentral')">
            Batal
          </button>
          <button
            class="px-3 py-2 mr-2 text-sm font-semibold text-white duration-300 border rounded-lg border-primaryColor hover:border-blue-600 bg-primaryColor hover:bg-blue-600">
            Simpan Data
          </button>
        </div>
      </template>
    </div>
    <div v-for="(mesinItem, mesinIndex) in mesin" :key="mesinIndex" v-show="selectedTitle == mesinItem.mesin">
      <template v-if="sentralDataById">
        <div class="flex flex-col mt-5">
          <div class="flex items-center justify-between">
            <h2 class="pl-2 text-lg font-bold border-l-4 border-primaryColor">
              Informasi {{ mesinItem.mesin }}
            </h2>
            <button
              class="flex items-center px-3 py-2 duration-300 border rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white border-primaryColor"
              @click="toggleEdit(mesinItem.mesin)" v-if="!isEditOpen(mesinItem.mesin)">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="mr-2">
                <g clip-path="url(#clip0_1055_14765)">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M11.9548 2.04663C11.7554 1.8473 11.4323 1.8473 11.2329 2.04663L10.661 2.61853L11.3829 3.34036L11.9548 2.76847C12.1541 2.56914 12.1541 2.24596 11.9548 2.04663ZM10.5579 4.16532L9.83607 3.44348L2.85121 10.4283C2.61135 10.6682 2.43503 10.9641 2.33819 11.2892L2.1795 11.8219L2.71225 11.6632C3.03735 11.5664 3.3332 11.39 3.57306 11.1502L10.5579 4.16532ZM10.408 1.22168C11.0629 0.566733 12.1248 0.566733 12.7797 1.22168C13.4347 1.87662 13.4347 2.93849 12.7797 3.59343L4.39802 11.9751C4.02109 12.3521 3.55619 12.6291 3.04532 12.7813L1.47913 13.2479C1.27385 13.309 1.05157 13.2527 0.900117 13.1013C0.748661 12.9498 0.692391 12.7275 0.753539 12.5223L1.22008 10.9561C1.37226 10.4452 1.64933 9.98032 2.02625 9.60339L10.408 1.22168Z"
                    fill="#0099AD" />
                </g>
                <defs>
                  <clipPath id="clip0_1055_14765">
                    <rect width="14" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p class="font-semibold">Edit Detail</p>
            </button>
          </div>
          <div class="flex w-full h-auto mt-5">
            <div class="flex flex-col w-48 mr-8">
              <div class="mb-3 bg-red-600 h-44" :class="isEdit ? 'rounded-t-lg' : 'rounded-lg'"></div>
              <div v-if="isEditOpen(mesinItem.mesin)">
                <button
                  class="w-full h-8 mb-2 text-sm duration-300 border rounded-md text-primaryColor border-primaryColor hover:border-blue-600 hover:text-white hover:bg-blue-600">
                  Pilih Foto
                </button>
                <p class="text-xxs">
                  Besar file: maksimum 10.000.000 bytes (10 Megabytes). Ekstensi
                  file yang diperbolehkan: .JPG .JPEG .PNG
                </p>
              </div>
            </div>
            <div class="grid content-start w-full grid-cols-4 gap-5 text-sm">
              <div>
                <h6>Unit Pengelola</h6>
                <p class="font-semibold">{{ unitPengelola }}</p>
              </div>
              <!-- <div>
                <h6>Unit Pembina</h6>
                <p class="font-semibold">{{ sentralDataById.nama_sentral }}</p>
              </div> -->
              <div>
                <h6>Kondisi Mesin</h6>
                <p class="font-semibold">{{ mesinItem.kondisi_unit }}</p>
              </div>
              <div>
                <h6>Tahun COD</h6>
                <p class="font-semibold">{{ mesinItem.tahun_operasi }}</p>
              </div>
              <div>
                <h6>Sisa Masa Manfaat</h6>
                <p class="font-semibold">
                  {{ mesinItem.masa_manfaat !== 0 ? mesinItem.masa_manfaat - (tahunBerjalan - mesinItem.tahun_operasi) :
                  '-'
                  }}
                  <span class="text-textDisabledColor">Tahun</span>
                </p>
              </div>
              <div>
                <h6>Daya Terpasang</h6>
                <p class="font-semibold">
                  {{ globalFormat.formatRupiah((mesinItem.daya_terpasang / 1000)) }} <span
                    class="text-textDisabledColor">MW</span>
                </p>
              </div>
              <div>
                <h6>Daya Mampu (Netto)</h6>
                <p class="font-semibold">
                  {{ globalFormat.formatRupiah((mesinItem.daya_mampu / 1000)) }} <span
                    class="text-textDisabledColor">MW</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full mt-6">
          <h2 class="pl-2 text-lg font-bold border-l-4 border-primaryColor">
            Informasi Tambahan
          </h2>
          <div class="grid grid-cols-4 gap-5 mt-5">
            <div>
              <label class="text-sm" :class="[
                isEditOpen(mesinItem.mesin) ? 'text-primaryColor' : 'text-textDisabledColor',
                isEditOpen(mesinItem.mesin) ? 'font-bold' : 'font-normal',
              ]" for="nilaiAsetAwal">
                Nilai Aset Awal
              </label>
              <TextInputPrefix v-if="isEditOpen(mesinItem.mesin)" :id="'nilaiAsetAwal'"
                v-model="mesinFormModel[mesinIndex].nilaiAsetAwal" />
              <p class="font-semibold" v-else>{{
                globalFormat.formatCurrencyNotFixed(mesinItem.nilai_asset_awal / 1000000) }} <span
                  class="font-normal text-textDisabledColor"> Rp (Juta)</span></p>
            </div>
            <div>
              <label class="text-sm" :class="[
                isEditOpen(mesinItem.mesin) ? 'text-primaryColor' : 'text-textDisabledColor',
                isEditOpen(mesinItem.mesin) ? 'font-bold' : 'font-normal',
              ]">
                Masa Manfaat
              </label>
              <div v-if="isEditOpen(mesinItem.mesin)" class="flex items-center justify-end mt-2">
                <input type="text" name="" id="" class="w-full h-10 text-sm border-gray-300 rounded-lg pr-14"
                  v-model.number="mesinFormModel[mesinIndex].masaManfaat"
                  @input="handleInputMasaManfaat(mesinFormModel[mesinIndex])" />
                <label for="" class="absolute pr-3 text-sm text-primaryColor">Tahun</label>
              </div>
              <div class="flex flex-row items-center space-x-2" v-else>
                <p class="font-semibold ">
                  {{ mesinItem.masa_manfaat }}
                </p>
                <p class="text-sm text-textDisabledColor">Tahun</p>
              </div>
            </div>
            <div>
              <div class="flex flex-row items-center space-x-1.5">
                <label class="text-sm" :class="[
                  isEditOpen(mesinItem.mesin) ? 'text-primaryColor' : 'text-textDisabledColor',
                  isEditOpen(mesinItem.mesin) ? 'font-bold' : 'font-normal',
                ]" for="nilaiAsetAwal">
                  Tahun Awal Pengisian Data
                </label>
                <TooltipDetailUnit />
              </div>
              <div class="space-y-1.5" v-if="isEditOpen(mesinItem.mesin)">
                <input @input="checkYearIsValid(mesinFormModel[mesinIndex], mesinIndex);" type="text" name="" id=""
                  :class="{ 'focus:ring-0': error[mesinIndex].tahunDataAwal, 'focus:border-2': error[mesinIndex].tahunDataAwal, 'focus:border-warningColor': error[mesinIndex].tahunDataAwal }"
                  class="w-full h-10 mt-2 text-sm border-gray-300 rounded-lg pr-14"
                  v-model.number="mesinFormModel[mesinIndex].tahunDataAwal" />
                <p class="text-sm text-warningColor" v-if="error[mesinIndex].tahunDataAwal">Tahun Tidak Valid!</p>
              </div>
              <p class="font-semibold" v-else>{{ mesinItem.tahun_nilai_perolehan }}</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full mt-6">
          <h2 class="pl-2 text-lg font-bold border-l-4 border-primaryColor">
            Titik Koordinat
          </h2>
          <div class="grid grid-cols-4 gap-5 mt-5">
            <div>
              <h3 class="text-sm" :class="[
                isEditOpen(mesinItem.mesin) ? 'text-primaryColor' : 'text-textDisabledColor',
                isEditOpen(mesinItem.mesin) ? 'font-bold' : 'font-normal',
              ]">
                Longitude (Garis Bujur)
              </h3>
              <input type="text" name="" id="" class="w-full h-10 mt-2 text-sm border-gray-300 rounded-lg"
                v-if="isEditOpen(mesinItem.mesin)" v-model="mesinFormModel[mesinIndex].longitude" />
              <p class="font-semibold" v-else>
                {{ mesinItem.longitude !== '' ? mesinItem.longitude : sentralDataById.longitude }}
              </p>
            </div>
            <div>
              <h3 class="text-sm" :class="[
                isEditOpen(mesinItem.mesin) ? 'text-primaryColor' : 'text-textDisabledColor',
                isEditOpen(mesinItem.mesin) ? 'font-bold' : 'font-normal',
              ]">
                Latitude (Garis Lintang)
              </h3>
              <input type="text" name="" id="" class="w-full h-10 mt-2 text-sm border-gray-300 rounded-lg"
                v-if="isEditOpen(mesinItem.mesin)" v-model="mesinFormModel[mesinIndex].latitude" />
              <p class="font-semibold" v-else>
                {{ mesinItem.latitude !== '' ? mesinItem.latitude : sentralDataById.latitude }}
              </p>
            </div>
          </div>
          <div class="relative z-30 w-full mt-4 rounded-lg h-52">
            <ol-map style="width: 100%; height: 100%">
              <ol-view ref="viewRef" :center="center.mesin[mesinIndex]" :rotation="rotation" :zoom="zoom" :minZoom="4"
                :projection="projection" />
              <ol-tile-layer>
                <ol-source-osm />
              </ol-tile-layer>
              <ol-overlay
                :position="[mesinItem.longitude !== '' ? mesinItem.longitude : sentralDataById.longitude, mesinItem.latitude !== '' ? mesinItem.latitude : sentralDataById.latitude]">
                <img class="w-4 h-4" src="../../assets/img/Non-EBT.png" />
              </ol-overlay>
            </ol-map>
          </div>
        </div>
        <div class="mt-4 border-t" v-if="isEditOpen(mesinItem.mesin)"></div>
        <div class="flex justify-end mt-4" v-if="isEditOpen(mesinItem.mesin)">
          <button
            class="px-3 py-2 mr-3 text-sm font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-blue-600 hover:border-blue-600"
            @click="toggleEdit(mesinItem.mesin)">
            Batal
          </button>
          <button
            class="px-3 py-2 mr-2 text-sm font-semibold text-white duration-300 border rounded-lg border-primaryColor hover:border-blue-600 bg-primaryColor hover:bg-blue-600"
            @click="selectedMesin.idMesin = mesinItem.id_mesin; selectedMesin.namaMesin = mesinItem.mesin; selectedMesin.mesinIndex = mesinIndex; isConfirmationOpen = true;">
            Simpan Data
          </button>
          <ModalNotification :showModal="showModal" :animation-data="jsonData" :title="'Data Berhasil Disimpan'"
            :subtitle="'Data telah berhasil dikirimkan'" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { notifyError } from "@/services/helper/toast-notification";
import { useRoute } from "vue-router";
const route = useRoute();
const id = route.params.id;
const kode_pengelola = route.query.kode_pengelola;
const initialTab = route.query.tab;
const isConfirmationOpen = ref(false);
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import DetailSentralService from "@/services/detail-sentral-service";
const detailSentralService = new DetailSentralService();
import jsonData from "@/assets/lottie/success.json";
import ModalNotification from "@/components/ui/ModalNotification.vue";
import "leaflet/dist/leaflet.css";
import TextInputPrefix from "@/components/MasterUnitSentral/TextInputPrefix.vue";
import router from "@/router";
import Loading from "@/components/ui/LoadingSpinner.vue";
import path from "path";
import TooltipDetailUnit from "@/components/ui/TooltipDetailUnit.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog.vue";

const isSentral = ref(true);
const showModal = ref(false);
const isEdit = ref<string[]>([]);
const selectedTitle = ref(initialTab);
const mesinFormModel = ref<Array<any>>([]);
const isLoading = ref();
const zoom = ref(17);
const sentralDataById = ref<PembangkitItem>();
const mesin = ref<Array<PembangkitItem>>([]);
const tahunBerjalan = new Date().getFullYear();
const error = ref<any[]>([]);
const unitPengelola = ref<string>("");
const nilaiAsetAwalSentral = ref<string>("");
const selectedIdMesin = ref<number>(-1);
const selectedMesin = ref<{
  idMesin: number,
  namaMesin: string,
  mesinIndex: number
}>({
  idMesin: -1,
  namaMesin: "",
  mesinIndex: -1
});
const center = ref<{
  sentral: Array<number>,
  mesin: Array<[number, number]>
}>({
  sentral: [],
  mesin: []
});
const projection = ref("EPSG:4326");
const rotation = ref(0);

interface PembangkitItem {
  data: any;
  id_sentral: number;
  kode_sentral: string;
  nama_sentral: string;
  provinsi: string;
  alamat: string;
  kode_jenis_pembangkit: string;
  jenis_bahan_bakar: string;
  daya_terpasang: number;
  daya_mampu: number;
  tahun_operasi: number;
  latitude: string;
  longitude: string;
  mesin: any;
  mesins: any;
  kondisi_unit: any;
  masa_manfaat: any;
  tahun_nilai_perolehan: number;
  sisa_masa_manfaat: any;
  nilai_asset_awal: any;
  id_mesin: any;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const fetchPengelola = async () => {
  try {
    const response: any = await detailSentralService.getPengelolaData();
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const getSentralById = async () => {
  try {
    const response: PembangkitItem = await detailSentralService.getSentralById(id, kode_pengelola);
    sentralDataById.value = response.data[0];
    center.value.sentral.push(parseFloat(response.data[0].longitude), parseFloat(response.data[0].latitude))
    mesin.value = response.data[0].mesins;
    if (sentralDataById.value) {
      for (const val of sentralDataById.value.mesins) {
        const longLatMesin: any = val.longitude !== '' && val.latitude !== '' ? [parseFloat(val.longitude), parseFloat(val.latitude)] : [parseFloat(response.data[0].longitude), parseFloat(response.data[0].latitude)];
        center.value.mesin.push(longLatMesin);
      }
      console.log(center.value);
    }
    for (const i of mesin.value) {
      error.value.push({
        nilaiAsetAwal: false,
        masaManfaat: false,
        tahunDataAwal: false,
        longitude: false,
        latitude: false
      })
    };
    nilaiAsetAwalSentral.value = response.data[0].mesins.reduce((acc: number, val: any) => acc + val.nilai_asset_awal, 0);
    const allPengelola = await fetchPengelola();
    unitPengelola.value = allPengelola.find((pengelola: any) => pengelola.kode_pengelola === kode_pengelola).pengelola;
  } catch (error) {
    console.error(error);
  }
};
const updateMesinById = async (id_mesin: number, index: number, mesin: string) => {
  try {
    isConfirmationOpen.value = false;
    isLoading.value = true
    const finalNilaiAsetAwal = mesinFormModel.value[index].nilaiAsetAwal.includes('.') ? mesinFormModel.value[index].nilaiAsetAwal.replace(/[.]/g, '') : mesinFormModel.value[index].nilaiAsetAwal;
    const deFormattedNilaiAsetAwal = finalNilaiAsetAwal.replace(/,/g, '.');
    const nilaiAsetAwal = deFormattedNilaiAsetAwal * 1000000;
    const tempUserId = localStorage.getItem('user_id') ?? 0;
    const userId = tempUserId.toString();
    const masaManfaat = parseInt(mesinFormModel.value[index].masaManfaat);
    const tahunDataAwal = parseInt(mesinFormModel.value[index].tahunDataAwal);
    await detailSentralService.updateMesinById(id_mesin, nilaiAsetAwal, masaManfaat, tahunDataAwal, mesinFormModel.value[index].latitude, mesinFormModel.value[index].longitude, userId);
    // Function akan dijalankan jika sukses mengupdate data
    await getSentralById();
    isLoading.value = false;
    showModal.value = true;
    await wait(1500);
    isEdit.value = isEdit.value.filter((id) => id !== mesin);
    showModal.value = false;
  } catch (error) {
    isLoading.value = false;
    notifyError('Update data mesin gagal, mohon coba lagi!', 3000);
    console.error('Update Data Mesin error' + error);
  }
}
const toggleEdit = (itemId: string) => {
  if (isEditOpen(itemId)) {
    isEdit.value = isEdit.value.filter((id) => id !== itemId);
  } else {
    isEdit.value.push(itemId);
  }
};
const isEditOpen = (itemId: string) => {
  return isEdit.value.includes(itemId);
};
const replaceUnitTab = (tab: string) => {
  router.replace({ path: route.path, query: { kode_pengelola: kode_pengelola, tab: tab } });
};
const replaceSentralTab = () => {
  router.replace({ path: route.path, query: { kode_pengelola: kode_pengelola, tab: "Sentral" } });
};

const handleInputMasaManfaat = (targetValue: any) => {
  targetValue.masaManfaat = globalFormat.formatInputNumberOnly(targetValue.masaManfaat.toString());
}
const handleInputTahunDataAwal = (targetValue: any) => {
  targetValue.tahunDataAwal = globalFormat.formatInputNumberOnly(targetValue.tahunDataAwal.toString());
}
const checkYearIsValid = (targetValue: any, index: any) => {
  handleInputTahunDataAwal(targetValue);
  if (targetValue.tahunDataAwal.length > 4) {
    error.value[index].tahunDataAwal = true;
  } else {
    error.value[index].tahunDataAwal = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  await getSentralById();
  for (const val of mesin.value) {
    mesinFormModel.value.push({
      nilaiAsetAwal: globalFormat.formatCurrencyNotFixed(val.nilai_asset_awal / 1000000),
      masaManfaat: val.masa_manfaat,
      tahunDataAwal: val.tahun_nilai_perolehan,
      longitude: val.longitude !== '' ? val.longitude : sentralDataById.value?.longitude,
      latitude: val.latitude !== '' ? val.latitude : sentralDataById.value?.latitude,
    });
  }
  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
button:hover>svg *,
button:hover {
  fill: #ffffff;
  transition-duration: 300ms;
}

h6 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity));
}

ul li.selected {
  border-bottom-width: 4px;
  border-color: #0099ad;
  color: #0099ad;
}
</style>
