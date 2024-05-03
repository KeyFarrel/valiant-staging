<template>
  <Loading v-if="isLoading" />
  <ModalNotification :show-modal="isShowModalNotification" :animation-data="errorJsonData" :title="'Data gagal dikirim'"
    :subtitle="'Semua input wajib diisi, mohon cek kembali inputan anda'" />
  <ModalNotification :show-modal="isInsertSuccess" :animation-data="successJsonData" :title="'Data Berhasil Disimpan'"
    :subtitle="'Data telah berhasil dikirimkan'" />
  <ModalWrapper :show-modal="isShowModalConfirmation" :width="'w-auto'" :height="'h-auto'">
    <ConfirmationDialog :title="'Konfirmasi'" :subtitle="'Apakah anda yakin untuk menyimpan asumsi & parameter?'"
      :button-title="'Unggah Dokumen'" @on-batal-click="isShowModalConfirmation = false"
      @on-accept-click="insertAsumsiParameter" />
  </ModalWrapper>
  <ModalWrapper :show-modal="isModalUnggahKertasKerjaOpen" :width="'w-[750px]'" :height="'h-auto'"
    @on-escape="handleCancelUpload">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-row items-center justify-between">
        <p class="text-xl font-bold text-primaryTextColor">Unggah Kertas Kerja</p>
        <button @click="handleCancelUpload">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div class="flex flex-col space-y-3">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-col space-y-3">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-semibold text-labelColor">Template Kertas Kerja <span
                  class="font-semibold text-warningColor">*</span></p>
              <p class="text-xs text-textDisabledColor">
                Template ini wajib digunakan saat pertama kali menginput data Kertas Kerja
              </p>
            </div>
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-semibold text-labelColor">Unggah <span
                  class="font-semibold text-warningColor">*</span></p>
              <p class="text-xs text-textDisabledColor">Silahkan unggah Kertas Kerja anda</p>
            </div>
          </div>
          <button
            class="px-3 py-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
            @click="handleDownloadTemplateRekap">
            Download Template
          </button>
        </div>
        <div class="flex flex-col space-y-1">
          <div v-if="selectedFile">
            <p>{{ selectedFile.name }} ({{ formatBytes(selectedFile.size) }})</p>
          </div>
          <div v-else-if="!isDownloaded">
            <p class="text-lg font-bold text-center text-black">Mohon Download File Excel Terlebih Dahulu....</p>
          </div>
          <div
            class="w-full flex flex-col p-2 items-center bg-primaryColor bg-opacity-10 border border-primaryColor border-dashed rounded-lg space-y-1.5"
            v-else>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M55.3067 24.6712C53.4719 20.4552 50.3054 16.9571 46.2923 14.7129C42.2793 12.4687 37.6411 11.6023 33.0885 12.2463C28.5359 12.8904 24.3201 15.0094 21.087 18.2786C17.8539 21.5479 15.782 25.7871 15.1886 30.3465C12.3257 31.0322 9.81422 32.7453 8.13117 35.1607C6.44812 37.576 5.71072 40.5254 6.05899 43.4486C6.40725 46.3718 7.81694 49.0654 10.0203 51.0177C12.2238 52.97 15.0674 54.0452 18.0113 54.039C18.8077 54.039 19.5715 53.7226 20.1347 53.1595C20.6978 52.5963 21.0142 51.8326 21.0142 51.0361C21.0142 50.2397 20.6978 49.476 20.1347 48.9128C19.5715 48.3497 18.8077 48.0333 18.0113 48.0333C16.4185 48.0333 14.8909 47.4006 13.7647 46.2743C12.6384 45.148 12.0056 43.6204 12.0056 42.0276C12.0056 40.4348 12.6384 38.9072 13.7647 37.7809C14.8909 36.6547 16.4185 36.0219 18.0113 36.0219C18.8077 36.0219 19.5715 35.7056 20.1347 35.1424C20.6978 34.5793 21.0142 33.8155 21.0142 33.0191C21.0218 29.4675 22.2882 26.0337 24.5884 23.3276C26.8885 20.6216 30.0734 18.8185 33.5773 18.2387C37.0812 17.6589 40.6772 18.34 43.7264 20.1609C46.7756 21.9818 49.0806 24.8247 50.2318 28.1845C50.4035 28.7005 50.712 29.1602 51.1246 29.5146C51.5371 29.8689 52.0381 30.1046 52.5741 30.1964C54.5742 30.5744 56.3873 31.6186 57.718 33.1588C59.0488 34.6991 59.8186 36.6446 59.9022 38.6784C59.9858 40.7121 59.3781 42.7143 58.1783 44.3585C56.9784 46.0028 55.2571 47.1922 53.2948 47.733C52.5222 47.9321 51.8605 48.4299 51.455 49.117C51.0495 49.804 50.9336 50.624 51.1327 51.3965C51.3318 52.169 51.8296 52.8308 52.5167 53.2362C53.2037 53.6417 54.0237 53.7576 54.7962 53.5585C57.9563 52.7235 60.7577 50.88 62.7747 48.308C64.7918 45.736 65.9145 42.576 65.9723 39.3078C66.03 36.0397 65.0197 32.842 63.0947 30.2004C61.1698 27.5587 58.4353 25.6174 55.3067 24.6712ZM38.1604 30.8871C37.8748 30.6137 37.5381 30.3994 37.1695 30.2565C36.4384 29.9561 35.6184 29.9561 34.8873 30.2565C34.5187 30.3994 34.182 30.6137 33.8964 30.8871L24.8878 39.8956C24.3224 40.461 24.0047 41.2279 24.0047 42.0276C24.0047 42.8273 24.3224 43.5942 24.8878 44.1596C25.4533 44.7251 26.2202 45.0427 27.0199 45.0427C27.8195 45.0427 28.5864 44.7251 29.1519 44.1596L33.0255 40.2559V57.0418C33.0255 57.8382 33.3419 58.602 33.9051 59.1652C34.4682 59.7283 35.232 60.0447 36.0284 60.0447C36.8248 60.0447 37.5886 59.7283 38.1517 59.1652C38.7149 58.602 39.0312 57.8382 39.0312 57.0418V40.2559L42.9049 44.1596C43.1841 44.4411 43.5162 44.6645 43.8821 44.8169C44.248 44.9694 44.6405 45.0479 45.0369 45.0479C45.4333 45.0479 45.8258 44.9694 46.1917 44.8169C46.5577 44.6645 46.8898 44.4411 47.1689 44.1596C47.4504 43.8805 47.6738 43.5484 47.8262 43.1824C47.9787 42.8165 48.0572 42.424 48.0572 42.0276C48.0572 41.6312 47.9787 41.2387 47.8262 40.8728C47.6738 40.5069 47.4504 40.1747 47.1689 39.8956L38.1604 30.8871Z"
                fill="#0099AD" />
            </svg>
            <p>Silahkan pilih berkas excel anda</p>
            <!-- <p>ATAU</p> -->
            <label for="fileInput"
              class="flex flex-row items-center px-3 py-2 space-x-2 text-white duration-300 rounded-lg cursor-pointer bg-primaryColor hover:bg-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0">
              <IconFolder />
              <span class="font-semibold">Cari berkas</span>
            </label>
            <input ref="fileInput" id="fileInput" type="file" class="hidden" @change="handleFileChange"
              accept=".xlsx" />
          </div>
          <div class="flex flex-row items-center justify-between">
            <p class="text-xs text-textDisabledColor">Tipe File yang dapat diunggah .xlsx</p>
            <p class="text-xs text-textDisabledColor">Maximum upload file size : 2 MB</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col space-y-3">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-semibold text-labelColor">Evidence</p>
            <p class="text-xs text-textDisabledColor">
              Silahkan unggah Evidence yang berkaitan dengan Kertas Kerja
            </p>
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <div
            class="w-full flex flex-col p-2 items-center bg-primaryColor bg-opacity-10 border border-primaryColor border-dashed rounded-lg space-y-1.5">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M55.3067 24.6712C53.4719 20.4552 50.3054 16.9571 46.2923 14.7129C42.2793 12.4687 37.6411 11.6023 33.0885 12.2463C28.5359 12.8904 24.3201 15.0094 21.087 18.2786C17.8539 21.5479 15.782 25.7871 15.1886 30.3465C12.3257 31.0322 9.81422 32.7453 8.13117 35.1607C6.44812 37.576 5.71072 40.5254 6.05899 43.4486C6.40725 46.3718 7.81694 49.0654 10.0203 51.0177C12.2238 52.97 15.0674 54.0452 18.0113 54.039C18.8077 54.039 19.5715 53.7226 20.1347 53.1595C20.6978 52.5963 21.0142 51.8326 21.0142 51.0361C21.0142 50.2397 20.6978 49.476 20.1347 48.9128C19.5715 48.3497 18.8077 48.0333 18.0113 48.0333C16.4185 48.0333 14.8909 47.4006 13.7647 46.2743C12.6384 45.148 12.0056 43.6204 12.0056 42.0276C12.0056 40.4348 12.6384 38.9072 13.7647 37.7809C14.8909 36.6547 16.4185 36.0219 18.0113 36.0219C18.8077 36.0219 19.5715 35.7056 20.1347 35.1424C20.6978 34.5793 21.0142 33.8155 21.0142 33.0191C21.0218 29.4675 22.2882 26.0337 24.5884 23.3276C26.8885 20.6216 30.0734 18.8185 33.5773 18.2387C37.0812 17.6589 40.6772 18.34 43.7264 20.1609C46.7756 21.9818 49.0806 24.8247 50.2318 28.1845C50.4035 28.7005 50.712 29.1602 51.1246 29.5146C51.5371 29.8689 52.0381 30.1046 52.5741 30.1964C54.5742 30.5744 56.3873 31.6186 57.718 33.1588C59.0488 34.6991 59.8186 36.6446 59.9022 38.6784C59.9858 40.7121 59.3781 42.7143 58.1783 44.3585C56.9784 46.0028 55.2571 47.1922 53.2948 47.733C52.5222 47.9321 51.8605 48.4299 51.455 49.117C51.0495 49.804 50.9336 50.624 51.1327 51.3965C51.3318 52.169 51.8296 52.8308 52.5167 53.2362C53.2037 53.6417 54.0237 53.7576 54.7962 53.5585C57.9563 52.7235 60.7577 50.88 62.7747 48.308C64.7918 45.736 65.9145 42.576 65.9723 39.3078C66.03 36.0397 65.0197 32.842 63.0947 30.2004C61.1698 27.5587 58.4353 25.6174 55.3067 24.6712ZM38.1604 30.8871C37.8748 30.6137 37.5381 30.3994 37.1695 30.2565C36.4384 29.9561 35.6184 29.9561 34.8873 30.2565C34.5187 30.3994 34.182 30.6137 33.8964 30.8871L24.8878 39.8956C24.3224 40.461 24.0047 41.2279 24.0047 42.0276C24.0047 42.8273 24.3224 43.5942 24.8878 44.1596C25.4533 44.7251 26.2202 45.0427 27.0199 45.0427C27.8195 45.0427 28.5864 44.7251 29.1519 44.1596L33.0255 40.2559V57.0418C33.0255 57.8382 33.3419 58.602 33.9051 59.1652C34.4682 59.7283 35.232 60.0447 36.0284 60.0447C36.8248 60.0447 37.5886 59.7283 38.1517 59.1652C38.7149 58.602 39.0312 57.8382 39.0312 57.0418V40.2559L42.9049 44.1596C43.1841 44.4411 43.5162 44.6645 43.8821 44.8169C44.248 44.9694 44.6405 45.0479 45.0369 45.0479C45.4333 45.0479 45.8258 44.9694 46.1917 44.8169C46.5577 44.6645 46.8898 44.4411 47.1689 44.1596C47.4504 43.8805 47.6738 43.5484 47.8262 43.1824C47.9787 42.8165 48.0572 42.424 48.0572 42.0276C48.0572 41.6312 47.9787 41.2387 47.8262 40.8728C47.6738 40.5069 47.4504 40.1747 47.1689 39.8956L38.1604 30.8871Z"
                fill="#0099AD" />
            </svg>
            <p>Seret dan lepas berkas anda untuk unggah</p>
            <p>ATAU</p>
            <button
              class="flex flex-row items-center px-3 py-2 space-x-2 text-white duration-300 rounded-lg bg-primaryColor hover:bg-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0">
              <IconFolder />
              <span class="font-semibold">Cari berkas</span>
            </button>
          </div>
          <div class="flex flex-row items-center justify-between">
            <p class="text-xs text-textDisabledColor">
              Tipe File yang dapat diunggah .pdf, .zip, .xlsx
            </p>
            <p class="text-xs text-textDisabledColor">Maximum upload file size : 2 MB</p>
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-end space-x-3">
        <button
          class="px-3 py-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
          @click="selectedFile = null">Reset</button>
        <button
          class="px-3 py-2 font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
          @click="uploadFile">Kirim</button>
      </div>
    </div>
  </ModalWrapper>
  <ModalWrapper :showModal="isUploadSuccess" :width="'w-80'" :height="'h-auto'">
    <div class="flex flex-col items-center">
      <Vue3Lottie :animationData="successJsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
      <h1 class="mb-3 text-lg font-semibold text-gray-700">
        Kertas Kerja Terkirim
      </h1>
      <p class="text-sm text-textDisabledColor">
        Kertas Kerja berhasil dikirim
      </p>
    </div>
  </ModalWrapper>
  <InfoHeader v-if="mesin" :nama-mesin="mesin.mesin" :nama-pengelola="namaPengelola ? namaPengelola : '-'"
    :kondisi-unit="mesin.kondisi_unit" :kode-jenis-pembangkit="mesin.kode_jenis_pembangkit"
    :daya-terpasang="mesin.daya_terpasang.toString()" :daya-mampu="mesin.daya_mampu.toString()"
    :tahun-operasi="mesin.tahun_operasi.toString()" :umur-teknis="mesin.masa_manfaat" />
  <div class="items-start p-6 mt-4 bg-white rounded-lg" v-if="mesin && approveMesinKK">
    <div v-auto-animate="{ duration: 300 }"
      v-if="approveMesinKK.status === 'Ditolak T1' || approveMesinKK.status === 'Ditolak T2'"
      class="p-3 -mt-1 mb-3 w-full bg-[#FFE5E6] border-2 border-[#FF5656] rounded-md">
      <div class="flex justify-between px-2">
        <div class="flex">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M11.0002 3.66536C6.95007 3.66536 3.66683 6.94861 3.66683 10.9987C3.66683 15.0488 6.95007 18.332 11.0002 18.332C15.0503 18.332 18.3335 15.0488 18.3335 10.9987C18.3335 6.94861 15.0503 3.66536 11.0002 3.66536ZM1.8335 10.9987C1.8335 5.93609 5.93755 1.83203 11.0002 1.83203C16.0628 1.83203 20.1668 5.93609 20.1668 10.9987C20.1668 16.0613 16.0628 20.1654 11.0002 20.1654C5.93755 20.1654 1.8335 16.0613 1.8335 10.9987ZM11.0002 7.33203C11.5064 7.33203 11.9168 7.74244 11.9168 8.2487V11.6862C11.9168 12.1925 11.5064 12.6029 11.0002 12.6029C10.4939 12.6029 10.0835 12.1925 10.0835 11.6862V8.2487C10.0835 7.74244 10.4939 7.33203 11.0002 7.33203ZM10.0835 14.4362C10.0835 13.9299 10.4939 13.5195 11.0002 13.5195H11.007C11.5133 13.5195 11.9237 13.9299 11.9237 14.4362V14.4431C11.9237 14.9493 11.5133 15.3597 11.007 15.3597H11.0002C10.4939 15.3597 10.0835 14.9493 10.0835 14.4431V14.4362Z"
              fill="#FF5656" />
          </svg>
          <p class="ml-2 font-semibold" v-if="approveMesinKK.status === 'Ditolak T1'">Ditolak Unit Pembina</p>
          <p class="ml-2 font-semibold" v-else-if="approveMesinKK.status === 'Ditolak T2'">Ditolak Unit Pengelola</p>
        </div>
        <div class="cursor-pointer" @click="toggleButton">
          <svg v-if="isHover" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
              fill="#FF5656" />
          </svg>
          <svg v-if="!isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M14.7071 12.7071C14.3166 13.0976 13.6834 13.0976 13.2929 12.7071L10 9.41421L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071Z"
              fill="#FF5656" />
          </svg>
        </div>
      </div>
      <p v-if="isHover" class="mt-2 ml-8 text-sm capitalize">{{ approveMesinKK.keterangan }}</p>
    </div>
    <TabsWrapper :laman-data="false">
      <TabItem :title="'Asumsi Makro'">
        <TabAsumsiMakro :tahun-realisasi="tahunBerjalan" :mesin="mesin.mesin" v-model:interest-rate="interestRate"
          v-model:umur-teknis="umurTeknis" v-model:loan-tenor="loanTenor" v-model:loan-portion="loanPortion"
          :error="error.asumsi" :umur-teknis-init="masaManfaat.toString()" :is-perbarui-data="false" />
      </TabItem>
      <TabItem :title="'Parameter Teknis & Finansial'">
        <TabParameterTeknis :is-perbarui-data="false" :tahun-realisasi="tahunBerjalan"
          :init-pemakaian-sendiri="pemakaianSendiri" :init-auxiliary="auxiliary" :init-susut-trafo="susutTrafo"
          :combo-bahan-bakar="comboBahanBakar" :bahan-bakars="bahanBakars" :id_mesin="route.params.id"
          :is-input-asumsi-parameter="true" :mesin="mesin.mesin" v-model:pickedValue="pickedParameterValue"
          v-model:checkedBahanBakar="checkedBahanBakar" v-model:nphr="nphr" v-model:auxiliary="auxiliary"
          v-model:susut-trafo="susutTrafo" v-model:pemakaian-sendiri="pemakaianSendiri"
          v-model:electricity-price-a="electricityPriceA" v-model:electricity-price-b="electricityPriceB"
          v-model:electricity-price-c="electricityPriceC" v-model:electricity-price-d="electricityPriceD"
          @on-checked="handleChecked" @on-hapus-bahan-bakar="handleHapusBahanBakar"
          @on-tambah-bahan-bakar="handleTambahBahanBakar" @on-submit="isShowModalConfirmation = true"
          :error="error.parameter" />
      </TabItem>
    </TabsWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import router from '@/router';
import Loading from '@/components/ui/LoadingSpinner.vue';
import InputAsumsiParameterService from '@/services/input-asumsi-parameter-service';
import PersetujuanService from '@/services/persetujuan-service';
import GlobalFormat from '@/services/format/global-format';
import TabAsumsiMakro from '@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabAsumsiMakro.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.vue';
import TabParameterTeknis from '@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabParameterTeknis.vue';
import InfoHeader from '@/components/ui/InfoHeader.vue'
import TabsWrapper from '@/components/ui/TabsWrapper.vue';
import TabItem from '@/components/ui/TabItem.vue';
import IconFolder from "@/components/icons/IconFolder.vue";
import ModalNotification from '@/components/ui/ModalNotification.vue';
import { notifyError } from "@/services/helper/toast-notification";
import { Vue3Lottie } from "vue3-lottie";
import successJsonData from "@/assets/lottie/success.json";
import errorJsonData from '@/assets/lottie/error.json';

const route = useRoute();
const inputAsumsiParameterService = new InputAsumsiParameterService();
const persetujuanService = new PersetujuanService();
const globalFormat = new GlobalFormat();
const i = ref(2);
const isLoading = ref(false);
const isInsertSuccess = ref(false);
const isShowModalNotification = ref(false);
const isShowModalConfirmation = ref(false);
const isUploadSuccess = ref(false);
const mesin = ref();
const kodeJenisPembangkit = ref();
const asumsiParameter = ref();
const idAsumsi = ref<number>(0);
const status = ref<string>('');
const idMesin = parseInt(route.params.id.toString());
const statusCode = ref();
const namaPengelola = ref();
const kodeMesin = ref();
// const idMesin = parseInt(route.params.id.toString());
const tahunBerjalan = new Date().getFullYear();
const interestRate = ref<string>('');
const umurTeknis = ref<string>('');
const loanTenor = ref<string>('');
const loanPortion = ref<string>('');
const nphr = ref<string>('');
const auxiliary = ref<string>('');
const susutTrafo = ref<string>('');
const pemakaianSendiri = ref<string>('');
const electricityPriceA = ref<string>('');
const electricityPriceB = ref<string>('');
const electricityPriceC = ref<string>('');
const electricityPriceD = ref<string>('');
const masaManfaat = ref<any>();
const isModalUnggahKertasKerjaOpen = ref<boolean>(false);
const namaMesin = ref<string>('');
const isDownloaded = ref(false)
const pickedParameterValue = ref<string>('auxiliarySusut');
const error = ref<{
  asumsi: {
    interestRate: boolean,
    umurTeknis: boolean,
    loanTenor: boolean,
    loanPortion: boolean
  },
  parameter: {
    nphr: boolean,
    auxiliary: boolean,
    susutTrafo: boolean,
    pemakaianSendiri: boolean,
    electricityPriceA: boolean,
    electricityPriceB: boolean,
    electricityPriceC: boolean,
    electricityPriceD: boolean,
    bahanBakar: boolean
  }
}>({
  asumsi: {
    interestRate: false,
    umurTeknis: false,
    loanTenor: false,
    loanPortion: false
  },
  parameter: {
    nphr: false,
    auxiliary: false,
    susutTrafo: false,
    pemakaianSendiri: false,
    electricityPriceA: false,
    electricityPriceB: false,
    electricityPriceC: false,
    electricityPriceD: false,
    bahanBakar: false
  }
});
const comboBahanBakar = ref<any>([]);
const checkedBahanBakar = ref<number[]>([]);
const bahanBakars = ref<any[]>([
  {
    id: 1,
    id_mesin: parseInt(route.params.id.toString()),
    tahun: tahunBerjalan.toString(),
    kode_bahan_bakar: "",
    harga_bahan_bakar: "",
    sfc: "",
    flag_bahan_bakar: 1,
  }
]);
const isHover = ref(true);
const approveMesinKK = ref<any>();
const year = new Date().getFullYear();
const levelSentral = ref(localStorage.getItem("level_sentral"));

function toggleButton() {
  isHover.value = !isHover.value;
}

const fetchPersetujuanKK = async () => {
  try {
    const response: any = await persetujuanService.getPersetujuanKKSentral({ id_sentral: levelSentral.value, tahun: year });
    approveMesinKK.value = response.data.mesins.filter((val: any) => val.id_mesin === route.params.id)[0];
  } catch (error) {
    console.error('Fetch Persetujuan KK Sentral Error : ' + error);
  }
}

const fetchMesinById = async () => {
  try {
    const response: any = await inputAsumsiParameterService.getMesinById(
      route.params.id
    );
    mesin.value = response.data;
    kodeJenisPembangkit.value = response.data.kode_jenis_pembangkit;
    kodeMesin.value = response.data.kode_mesin;
    namaMesin.value = response.data.mesin;
    masaManfaat.value = response.data.masa_manfaat;
    umurTeknis.value = response.data.masa_manfaat;
  } catch (error) {
    console.error(error);
  }
};

const fetchAsumsiParameter = async (isCreate: boolean) => {
  try {
    const response: any = await inputAsumsiParameterService.getAsumsiMakroData(
      tahunBerjalan,
      idMesin
    )
    if (isCreate !== true) {
      if (response.code === 200) {
        // if (response.data.status === 'update') {
        const tempBahanBakars = response.data.harga_bahan_bakars;
        for (const iterator of tempBahanBakars) {
          iterator.harga_bahan_bakar = globalFormat.formatCurrencyNotFixed(iterator.harga_bahan_bakar.toString());
          iterator.sfc = globalFormat.formatCurrencyNotFixed(iterator.sfc.toString());
        }
        interestRate.value = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.interest_rate.toString());
        umurTeknis.value = masaManfaat.value.toString();
        loanTenor.value = response.data.asumsi_makro.loan_tenor.toString();
        loanPortion.value = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.loan_portion.toString());
        nphr.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.nphr.toString());
        auxiliary.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.auxiliary.toString());
        susutTrafo.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.susut_trafo.toString());
        pemakaianSendiri.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.ps.toString());
        electricityPriceA.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_a_rp_per_kwbln.toString());
        electricityPriceB.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_b_rp_per_kwbln.toString());
        electricityPriceC.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_c_rp_per_kwh.toString());
        electricityPriceD.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_d_rp_per_kwh.toString());
        bahanBakars.value = tempBahanBakars;
        pickedParameterValue.value = pemakaianSendiri.value === '0,00' ? 'auxiliarySusut' : 'pemakaianSendiri';
        // }
      }
    }
    asumsiParameter.value = response.data;
    if (response.data.tahun === tahunBerjalan) {
      status.value = response.data.status;
      idAsumsi.value = response.data.id_asumsi;
      statusCode.value = response.code;
    }
  } catch (error) {
    console.error('Fetch Asumsi Parameter Error : ', error);
  }
}

const fetchComboBahanBakar = async () => {
  try {
    const response: any = await inputAsumsiParameterService.getComboBahanBakar(kodeJenisPembangkit.value);
    comboBahanBakar.value = response.data;
  } catch (error) {
    console.error('Fetch Combo Bahan Bakar Error : ' + error);
  }
}

const fetchUnitPengelola = async () => {
  try {
    if (mesin.value) {
      const kodeSentral = mesin.value.kode_sentral;
      const pembangkitResponse: any =
        await inputAsumsiParameterService.getPembangkitByKode(kodeSentral);
      const kodePengelola = pembangkitResponse.data.kode_pengelola;
      const pengelolaResponse: any =
        await inputAsumsiParameterService.getPengelolaData();
      const pengelola = pengelolaResponse.data.filter(
        (pengelola: any) => pengelola.kode_pengelola === kodePengelola
      );
      namaPengelola.value = pengelola[0].pengelola;
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : " + error);
  }
};

function handleHapusBahanBakar() {
  if (checkedBahanBakar.value.length) {
    checkedBahanBakar.value.forEach((checkedItemId) => {
      const result = bahanBakars.value.findIndex((checkbox) => checkbox.id === checkedItemId);
      if (result !== -1) {
        bahanBakars.value.splice(result, 1);
      }
    });
    checkedBahanBakar.value = [];
  }
};

function handleTambahBahanBakar() {
  bahanBakars.value.push({
    id: i.value++,
    id_mesin: parseInt(route.params.id.toString()),
    tahun: tahunBerjalan,
    kode_bahan_bakar: "",
    harga_bahan_bakar: "",
    sfc: "",
    flag_bahan_bakar: 0,
  })
}

function handleChecked() {
  console.log('Handle Checked ' + checkedBahanBakar.value);
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const insertAsumsiParameter = async () => {
  try {
    isShowModalConfirmation.value = false;
    const errorAsumsiInput = error.value.asumsi;
    const errorParameterTeknis = error.value.parameter;
    if (interestRate.value === '') {
      errorAsumsiInput.interestRate = true;
    } else {
      errorAsumsiInput.interestRate = false;
    }
    if (umurTeknis.value === '') {
      errorAsumsiInput.umurTeknis = true;
    } else {
      errorAsumsiInput.umurTeknis = false;
    }
    if (loanTenor.value === '') {
      errorAsumsiInput.loanTenor = true;
    } else {
      errorAsumsiInput.loanTenor = false;
    }
    if (loanPortion.value === '') {
      errorAsumsiInput.loanPortion = true;
    } else {
      errorAsumsiInput.loanPortion = false;
    }
    if (nphr.value === '') {
      errorParameterTeknis.nphr = true;
    } else {
      errorParameterTeknis.nphr = false;
    }
    if (pickedParameterValue.value === 'auxiliarySusut') {
      if (auxiliary.value === '') {
        errorParameterTeknis.auxiliary = true;
        errorParameterTeknis.pemakaianSendiri = false;
      } else {
        errorParameterTeknis.auxiliary = false;
        errorParameterTeknis.pemakaianSendiri = false;
      }
      if (susutTrafo.value === '') {
        errorParameterTeknis.susutTrafo = true;
        errorParameterTeknis.pemakaianSendiri = false;
      } else {
        errorParameterTeknis.susutTrafo = false;
        errorParameterTeknis.pemakaianSendiri = false;
      }
    } else if (pickedParameterValue.value === 'pemakaianSendiri') {
      if (pemakaianSendiri.value === '') {
        errorParameterTeknis.pemakaianSendiri = true;
        errorParameterTeknis.auxiliary = false;
        errorParameterTeknis.susutTrafo = false;
      } else {
        errorParameterTeknis.pemakaianSendiri = false;
        errorParameterTeknis.auxiliary = false;
        errorParameterTeknis.susutTrafo = false;
      }
    }
    if (electricityPriceA.value === '') {
      errorParameterTeknis.electricityPriceA = true;
    } else {
      errorParameterTeknis.electricityPriceA = false;
    }
    if (electricityPriceB.value === '') {
      errorParameterTeknis.electricityPriceB = true;
    } else {
      errorParameterTeknis.electricityPriceB = false;
    }
    if (electricityPriceC.value === '') {
      errorParameterTeknis.electricityPriceC = true;
    } else {
      errorParameterTeknis.electricityPriceC = false;
    }
    if (electricityPriceD.value === '') {
      errorParameterTeknis.electricityPriceD = true;
    } else {
      errorParameterTeknis.electricityPriceD = false;
    }
    console.log(bahanBakars.value)
    if (bahanBakars.value.some(obj => Object.values(obj).some(value => value === ""))) {
      errorParameterTeknis.bahanBakar = true;
    } else {
      errorParameterTeknis.bahanBakar = false;
    }
    if (Object.values(errorAsumsiInput).some(value => value === true) || Object.values(errorParameterTeknis).some(value => value === true)) {
      isShowModalNotification.value = true;
      await wait(5000);
      isShowModalNotification.value = false;
    } else {
      isLoading.value = true;
      for (let index = 0; index < bahanBakars.value.length; index++) {
        delete bahanBakars.value[index].id;
      }
      const idMesin = route.params.id.toString();
      const finalInterestRate = interestRate.value.includes('.') ? interestRate.value.replace(/[.]/g, '') : interestRate.value;
      const finalLoanPortion = loanPortion.value.includes('.') ? loanPortion.value.replace(/[.]/g, '') : loanPortion.value;
      if (idAsumsi.value !== 0) {
        const formAsumsiUpdate = {
          id_asumsi: idAsumsi.value,
          tahun: tahunBerjalan,
          id_mesin: parseInt(idMesin),
          interest_rate: parseFloat(finalInterestRate.replace(/,/g, '.')),
          umur_teknis: parseInt(masaManfaat.value),
          loan_tenor: parseInt(loanTenor.value),
          loan_portion: parseFloat(finalLoanPortion.replace(/,/g, '.'))
        }
        await inputAsumsiParameterService.updateAsumsi(formAsumsiUpdate);
        const finalBahanBakars = bahanBakars.value.map(value => {
          let newValue = { ...value };
          let finalHargaBahanBakar = newValue.harga_bahan_bakar.includes('.') ? newValue.harga_bahan_bakar.replace(/[.]/g, '') : newValue.harga_bahan_bakar;
          newValue.harga_bahan_bakar = parseFloat(finalHargaBahanBakar.replace(/,/g, '.'));
          let finalSFC = newValue.sfc.includes('.') ? newValue.sfc.replace(/[.]/g, '') : newValue.sfc;
          newValue.sfc = parseFloat(finalSFC.replace(/,/g, '.'));
          newValue.tahun = tahunBerjalan.toString();
          return newValue;
        });
        const finalNPHR = nphr.value.includes('.') ? nphr.value.replace(/[.]/g, '') : nphr.value;
        const finalAuxiliary = auxiliary.value.includes('.') ? auxiliary.value.replace(/[.]/g, '') : auxiliary.value;
        const finalSusutTrafo = susutTrafo.value.includes('.') ? susutTrafo.value.replace(/[.]/g, '') : susutTrafo.value;
        const finalPemakaianSendiri = pemakaianSendiri.value.includes('.') ? pemakaianSendiri.value.replace(/[.]/g, '') : pemakaianSendiri.value;
        const finalElecA = electricityPriceA.value.includes('.') ? electricityPriceA.value.replace(/[.]/g, '') : electricityPriceA.value;
        const finalElecB = electricityPriceB.value.includes('.') ? electricityPriceB.value.replace(/[.]/g, '') : electricityPriceB.value;
        const finalElecC = electricityPriceC.value.includes('.') ? electricityPriceC.value.replace(/[.]/g, '') : electricityPriceC.value;
        const finalElecD = electricityPriceD.value.includes('.') ? electricityPriceD.value.replace(/[.]/g, '') : electricityPriceD.value;
        const formParameterUpdate = {
          id_asumsi: idAsumsi.value,
          id_mesin: parseInt(idMesin),
          tahun: tahunBerjalan,
          nphr: parseFloat(finalNPHR.replace(/,/g, '.')),
          auxiliary: pickedParameterValue.value === 'auxiliarySusut' ? parseFloat(finalAuxiliary.replace(/,/g, '.')) : 0,
          susut_trafo: pickedParameterValue.value === 'auxiliarySusut' ? parseFloat(finalSusutTrafo.replace(/,/g, '.')) : 0,
          ps: pickedParameterValue.value === 'pemakaianSendiri' ? parseFloat(finalPemakaianSendiri.replace(/,/g, '.')) : 0,
          electricity_price_a_rp_per_kwbln: parseFloat(finalElecA.replace(/,/g, '.')),
          electricity_price_b_rp_per_kwbln: parseFloat(finalElecB.replace(/,/g, '.')),
          electricity_price_c_rp_per_kwh: parseFloat(finalElecC.replace(/,/g, '.')),
          electricity_price_d_rp_per_kwh: parseFloat(finalElecD.replace(/,/g, '.')),
          harga_bahan_bakars: finalBahanBakars
        }
        console.log(idAsumsi.value, 'Update');
        await inputAsumsiParameterService.createParameter(formParameterUpdate);
        isLoading.value = false;
        isInsertSuccess.value = true;
        await wait(1500);
        isInsertSuccess.value = false;
        isModalUnggahKertasKerjaOpen.value = true;
      }
    }
  } catch (error: any) {
    // if (error.response.data.message === 'Data Asumsi sudah ada') {
    //   notifyError('Data Asumsi sudah ada', 3500);
    // } else {
    //   notifyError('Data gagal dikirim', 3500);
    // }
    console.error('Insert Asumsi Parameter Error : ' + error);
  } finally {
    isLoading.value = false;
  }
}

const formatBytes = (bytes: any) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)).toString());
  return Math.round(100 * (bytes / Math.pow(k, i))) / 100 + ' ' + sizes[i];
};

const selectedFile: any = ref(null);
const handleFileChange = (event: any) => {
  if (event.target.files.length === 1) {
    selectedFile.value = event.target.files[0];
  } else {
    selectedFile.value = null;
  }
};

const handleDownloadTemplateRekap = async () => {
  try {
    isLoading.value = true;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response: any = await axios.get('https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/export-template-first', {
      responseType: 'arraybuffer',
      headers,
      params: {
        id_mesin: idMesin,
        tahun: tahunBerjalan,
      }
    });
    isDownloaded.value = true;
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Kertas Kerja Actual - ${namaMesin.value}_${tahunBerjalan}_${globalFormat.formatNumberFiveDigits(idMesin)}.xlsx`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    notifyError('Download Template Rekap Gagal', 3000);
    console.error('Handle Download Template Rekap Error : ' + error);
  } finally {
    isLoading.value = false;
  }
}

const uploadFile = async () => {
  try {
    isLoading.value = true
    if (!selectedFile.value) {
      notifyError('Mohon pilih file excel terlebih dahulu', 3000);
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'multipart/form-data',
    };
    const response = await axios.post('https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/import-template-awal', formData, {
      headers,
    });
    console.log('Sukses mengirim file : ', response.data);
    isUploadSuccess.value = true;
    await wait(1500)
    isUploadSuccess.value = false;
    isModalUnggahKertasKerjaOpen.value = false;
    router.go(-1);
  } catch (error) {
    console.error('Error upload file : ', error);
  } finally {
    isLoading.value = false;
  }
};

const handleCancelUpload = async () => {
  try {
    isLoading.value = true;
    await fetchMesinById();
    await fetchAsumsiParameter(false);
    await fetchUnitPengelola();
    await fetchComboBahanBakar();
    isModalUnggahKertasKerjaOpen.value = false
    isLoading.value = false;
  } catch (error) {
    console.error('Cancel Upload Error : ', error);
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchMesinById();
  await fetchAsumsiParameter(false);
  await fetchUnitPengelola();
  await fetchComboBahanBakar();
  await fetchPersetujuanKK();
  isLoading.value = false;
})
</script>

<style scoped></style>