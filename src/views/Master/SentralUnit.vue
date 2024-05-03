<script setup lang="ts">
import { ref } from "vue";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

const center = ref([-0.808498, 117.478751]);
const zoom = ref(5);

const isEdit = ref(false);

const temporaryData = ref([
  {
    id_sentral: 1,
    nama_sentral: "Cikalong",
    foto_sentral: "",
    unit_pengelola: "PT PLN Nusantara Power",
    unit_pembina: "-",
    unit_pembangkit: "Unit 1, 2, 3",
    kapasitas_daya_terpasang: "5.22",
    kapasitas_daya_mampu_netto: "5.22",
    nilai_aset_awal: "376.900.000.000",
    tahun_cod: "1987",
    masa_manfaat: "41",
    sisa_manfaat: "5",
    status: "Aktif",
  },
]);

const sliderData = [
  {
    sliderItemName: "SENTRAL",
  },
  {
    sliderItemName: "UNIT 1",
  },
  {
    sliderItemName: "UNIT 2",
  },
  {
    sliderItemName: "UNIT 3",
  },
];
</script>

<style scoped>
h3 {
  margin-bottom: 6px;
  font-weight: 600;
  --tw-text-opacity: 1;
  color: rgb(0 90 102 / var(--tw-text-opacity));
}
</style>

<template>
  <div class="bg-white p-6 font-medium text-md h-full rounded-lg flex flex-col">
    <div class="flex flex-row">
      <div class="flex items-center">
        <input type="search" autocomplete="off" id="search-dropdown"
          class="block p-3 w-60 text-sm text-gray-900 rounded-l-lg border border-gray-300 focus:ring-[#0099AD] focus:border-[#0099AD]"
          placeholder="Cari...." />
        <button type="submit"
          class="relative float-left p-3 text-sm font-medium text-white bg-[#0099AD] rounded-r-lg border border-[#0099AD] hover:bg-[#007E8F] focus:ring-4 focus:outline-none focus:ring-blue-300">
          <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span class="sr-only">Search</span>
        </button>
      </div>
      <button class="btn ml-4 text-gray-400 btn-ghost btn-outline border-gray-300">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
          <path
            d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
            fill="#0099AD" />
        </svg>
        Filter
      </button>
    </div>
    <div class="mt-4">
      <ul class="flex">
        <li
          class="cursor-pointer border p-3 text-sm font-bold text-gray-400 hover:text-[#0099AD] border-gray-300 rounded-lg ml-5 first:ml-0 hover:border-[#0099AD] hover:border-"
          v-for="item in sliderData" :key="item.sliderItemName">
          {{ item.sliderItemName }}
        </li>
      </ul>
    </div>
  </div>
  <div class="mt-4 bg-white p-6 font-medium text-md h-full rounded-lg flex flex-col">
    <div class="flex flex-col">
      <div class="flex items-center justify-between">
        <h2 class="border-l-4 border-[#0099AD] pl-2 text-lg font-bold">
          Informasi Unit Sentral
        </h2>
        <button class="btn btn-ghost btn-outline border-[#0099AD] text-[#0099AD]" @click="isEdit = true">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
            <g clip-path="url(#clip0_144_30595)">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M11.9545 2.04663C11.7552 1.8473 11.432 1.8473 11.2327 2.04663L10.6608 2.61853L11.3826 3.34036L11.9545 2.76847C12.1539 2.56914 12.1539 2.24596 11.9545 2.04663ZM10.5577 4.16532L9.83583 3.44348L2.85097 10.4283C2.61111 10.6682 2.43479 10.9641 2.33795 11.2892L2.17925 11.8219L2.712 11.6632C3.0371 11.5664 3.33295 11.39 3.57281 11.1502L10.5577 4.16532ZM10.4077 1.22168C11.0627 0.566733 12.1245 0.566733 12.7795 1.22168C13.4344 1.87662 13.4344 2.93849 12.7795 3.59343L4.39777 11.9751C4.02085 12.3521 3.55594 12.6291 3.04507 12.7813L1.47889 13.2479C1.27361 13.309 1.05133 13.2527 0.899873 13.1013C0.748416 12.9498 0.692146 12.7275 0.753295 12.5223L1.21983 10.9561C1.37201 10.4452 1.64908 9.98032 2.02601 9.60339L10.4077 1.22168Z"
                fill="#0099AD" />
            </g>
            <defs>
              <clipPath id="clip0_144_30595">
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Edit Detail
        </button>
      </div>
      <div class="flex w-full h-auto mt-6">
        <div class="flex flex-col w-48 mr-8">
          <div class="h-44 bg-red-600 rounded-t-lg mb-3"></div>
          <button
            class="h-8 text-sm text-[#0099AD] border border-[#0099AD] rounded-md mb-2 hover:text-white hover:bg-blue-600 duration-300">
            Pilih Foto
          </button>
          <p class="text-xxs">
            Besar file: maksimum 10.000.000 bytes (10 Megabytes). Ekstensi file
            yang diperbolehkan: .JPG .JPEG .PNG
          </p>
        </div>
        <div v-for="(item, index) in temporaryData" :key="index"
          class="grid grid-cols-4 gap-5 text-sm w-full content-start">
          <div>
            <h6>Unit Pengelola</h6>
            <p class="font-semibold">{{ item.unit_pengelola }}</p>
          </div>
          <div>
            <h6>Unit Pembina</h6>
            <p class="font-semibold">{{ item.unit_pembina }}</p>
          </div>
          <div>
            <h6>Unit Sentral</h6>
            <p class="font-semibold">{{ item.nama_sentral }}</p>
          </div>
          <div>
            <h6>Unit Pembangkit</h6>
            <p class="font-semibold">{{ item.unit_pembangkit }}</p>
          </div>
          <div>
            <h6>Kapasitas Daya Terpasang</h6>
            <p class="font-semibold">
              {{ item.kapasitas_daya_terpasang }}
              <span class="text-gray-500">MW</span>
            </p>
          </div>
          <div>
            <h6>Kapasitas Daya Mampu (Netto)</h6>
            <p class="font-semibold">
              {{ item.kapasitas_daya_mampu_netto }}
              <span class="text-gray-500">MW</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 flex flex-col" v-if="isEdit">
      <h2 class="border-l-4 border-[#0099AD] pl-2 text-lg font-bold">
        Informasi Tambahan
      </h2>
      <div class="mt-5 grid grid-cols-4 gap-5">
        <div>
          <h3>Nilai Aset Awal</h3>
          <div class="flex items-center border border-gray-300 rounded-lg pl-3">
            <label for="" class="text-[#0099AD]">Rp.</label>
            <input type="text" name="" id=""
              class="w-full rounded-r-lg h-10 border-none focus:outline-none focus:border-none focus:ring-0" />
          </div>
        </div>
        <div>
          <h3>Tahun COD</h3>
          <input type="text" name="" id="" class="w-full rounded-lg h-10 border-gray-300" />
        </div>
        <div>
          <h3>Masa Manfaat</h3>
          <input type="text" name="" id="" class="w-full rounded-lg h-10 border-gray-300" />
        </div>
        <div>
          <h3>Sisa Manfaat</h3>
          <input type="text" name="" id="" disabled class="w-full rounded-lg h-10 border-none disabled:bg-gray-200" />
        </div>
        <div>
          <h3>Status</h3>
          <select name="" id="" class="w-full rounded-lg border-gray-300">
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>
    </div>
    <div class="mt-8 flex flex-col w-full">
      <h2 class="border-l-4 border-[#0099AD] pl-2 text-lg font-bold">
        Titik Koordinat
      </h2>
      <div class="grid grid-cols-4 gap-5 mt-5">
        <div>
          <h3>Longitude (Garis Bujur)</h3>
          <input type="text" name="" id="" class="w-full rounded-lg h-10 border-gray-300" />
        </div>
        <div>
          <h3>Latitude (Garis Lintang)</h3>
          <input type="text" name="" id="" class="w-full rounded-lg h-10 border-gray-300" />
        </div>
      </div>
      <div class="mt-4 rounded-lg h-52 relative z-30 w-full">
        <l-map ref="map" v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
            name="OpenStreetMap"></l-tile-layer>
        </l-map>
      </div>
    </div>
    <div v-if="isEdit">
      <div class="w-full border mt-4"></div>
      <div class="flex mt-4 justify-end">
        <button
          class="rounded-lg px-3 py-2 text-sm font-semibold text-[#0099AD] border border-[#0099AD] mr-3 hover:text-white hover:bg-blue-600 duration-300">
          Batal
        </button>
        <button
          class="rounded-lg px-3 py-2 text-sm font-semibold text-white mr-2 bg-[#0099AD] hover:bg-blue-600 duration-300">
          Simpan Data
        </button>
      </div>
    </div>
  </div>
</template>
