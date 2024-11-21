<template>
  <Loading v-if="isLoading" />
  <InfoHeader v-if="mesinDataById && approveSentralFS" :nama-mesin="mesinDataById.mesin ? mesinDataById.mesin : '-'"
    :nama-pengelola="namaPengelola ? namaPengelola : '-'" :status-mesin="mesinDataById.kondisi_unit"
    :kode-jenis-pembangkit="mesinDataById.kode_jenis_pembangkit ? mesinDataById.kode_jenis_pembangkit : '-'"
    :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
    :tahun-operasi="mesinDataById.tahun_operasi ? mesinDataById.tahun_operasi : '-'"
    :umur-teknis="mesinDataById.masa_manfaat" :nama-pembina="namaPembina" :kondisi-unit="mesinDataById.kondisi_unit">
    <ModalWrapper :showModal="isFSUploadSuccess" :width="'w-80'" :height="'h-auto'">
      <div class="flex flex-col items-center">
        <Vue3Lottie :animationData="jsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
        <h1 class="mb-3 text-lg font-semibold text-gray-700">
          Feasibility Study Terkirim
        </h1>
        <p class="text-sm text-textDisabledColor">
          Feasibility Study berhasil dikirim
        </p>
      </div>
    </ModalWrapper>
    <ModalWrapper :showModal="isEvidenceSuccess" :width="'w-80'" :height="'h-auto'">
      <div class="flex flex-col items-center">
        <Vue3Lottie :animationData="jsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
        <h1 class="mb-3 text-lg font-semibold text-gray-700">
          Evidence Terkirim
        </h1>
        <p class="text-sm text-textDisabledColor">
          Evidence berhasil dikirim
        </p>
      </div>
    </ModalWrapper>
    <ModalWrapper :show-modal="isModalUnggahFSOpen" :width="'w-[750px]'" :height="'h-auto'"
      @on-escape="isModalUnggahFSOpen = false">
      <div class="flex flex-col space-y-5">
        <div class="flex flex-row items-center justify-between">
          <p class="text-xl font-bold text-primaryTextColor">Unggah Feasibility Study</p>
          <button @click="isModalUnggahFSOpen = false">
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
                <p class="text-sm font-semibold text-labelColor">Template Feasibility Study <span
                    class="font-semibold text-warningColor">*</span></p>
                <p class="text-xs text-textDisabledColor">Template ini wajib digunakan saat pertama kali
                  menginput
                  data Feasibility Study</p>
              </div>
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-semibold text-labelColor">Unggah <span
                    class="font-semibold text-warningColor">*</span></p>
                <p class="text-xs text-textDisabledColor">Silahkan unggah Feasibility Study anda</p>
              </div>
            </div>
            <button @click="handleDownloadTemplateFS"
              class="px-3 py-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0">
              Download Template
            </button>
          </div>
          <div class="flex flex-col space-y-1">
            <div v-if="selectedFileFS">
              <p>{{ selectedFileFS.name }} ({{ globalFormat.formatBytes(selectedFileFS.size) }})</p>
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
              <label for="fileInputFS"
                class="flex flex-row items-center px-3 py-2 space-x-2 text-white duration-300 rounded-lg cursor-pointer bg-primaryColor hover:bg-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0">
                <IconFolder />
                <span class="font-semibold">Cari berkas</span>
              </label>
              <input ref="fileInputFS" id="fileInputFS" type="file" class="hidden" @change="handleFileFSChange"
                accept=".xlsx" />
            </div>
            <div class="flex flex-row items-center justify-between">
              <p class="text-xs text-textDisabledColor">Tipe File yang dapat diunggah .xlsx</p>
              <p class="text-xs text-textDisabledColor">Ukuran maksimal dokumen : 2 MB</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-3">
          <div class="flex flex-row items-center justify-between">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-semibold text-labelColor">Evidence</p>
              <p class="text-xs text-textDisabledColor">Silahkan unggah Evidence yang berkaitan dengan
                Feasibility Study</p>
            </div>
          </div>
          <div class="flex flex-col space-y-1">
            <div v-if="selectedFileEvidence">
              <p>{{ selectedFileEvidence.name }} ({{ globalFormat.formatBytes(selectedFileEvidence.size) }})</p>
            </div>
            <div
              class="w-full flex flex-col p-2 items-center bg-primaryColor bg-opacity-10 border border-primaryColor border-dashed rounded-lg space-y-1.5"
              v-else>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M55.3067 24.6712C53.4719 20.4552 50.3054 16.9571 46.2923 14.7129C42.2793 12.4687 37.6411 11.6023 33.0885 12.2463C28.5359 12.8904 24.3201 15.0094 21.087 18.2786C17.8539 21.5479 15.782 25.7871 15.1886 30.3465C12.3257 31.0322 9.81422 32.7453 8.13117 35.1607C6.44812 37.576 5.71072 40.5254 6.05899 43.4486C6.40725 46.3718 7.81694 49.0654 10.0203 51.0177C12.2238 52.97 15.0674 54.0452 18.0113 54.039C18.8077 54.039 19.5715 53.7226 20.1347 53.1595C20.6978 52.5963 21.0142 51.8326 21.0142 51.0361C21.0142 50.2397 20.6978 49.476 20.1347 48.9128C19.5715 48.3497 18.8077 48.0333 18.0113 48.0333C16.4185 48.0333 14.8909 47.4006 13.7647 46.2743C12.6384 45.148 12.0056 43.6204 12.0056 42.0276C12.0056 40.4348 12.6384 38.9072 13.7647 37.7809C14.8909 36.6547 16.4185 36.0219 18.0113 36.0219C18.8077 36.0219 19.5715 35.7056 20.1347 35.1424C20.6978 34.5793 21.0142 33.8155 21.0142 33.0191C21.0218 29.4675 22.2882 26.0337 24.5884 23.3276C26.8885 20.6216 30.0734 18.8185 33.5773 18.2387C37.0812 17.6589 40.6772 18.34 43.7264 20.1609C46.7756 21.9818 49.0806 24.8247 50.2318 28.1845C50.4035 28.7005 50.712 29.1602 51.1246 29.5146C51.5371 29.8689 52.0381 30.1046 52.5741 30.1964C54.5742 30.5744 56.3873 31.6186 57.718 33.1588C59.0488 34.6991 59.8186 36.6446 59.9022 38.6784C59.9858 40.7121 59.3781 42.7143 58.1783 44.3585C56.9784 46.0028 55.2571 47.1922 53.2948 47.733C52.5222 47.9321 51.8605 48.4299 51.455 49.117C51.0495 49.804 50.9336 50.624 51.1327 51.3965C51.3318 52.169 51.8296 52.8308 52.5167 53.2362C53.2037 53.6417 54.0237 53.7576 54.7962 53.5585C57.9563 52.7235 60.7577 50.88 62.7747 48.308C64.7918 45.736 65.9145 42.576 65.9723 39.3078C66.03 36.0397 65.0197 32.842 63.0947 30.2004C61.1698 27.5587 58.4353 25.6174 55.3067 24.6712ZM38.1604 30.8871C37.8748 30.6137 37.5381 30.3994 37.1695 30.2565C36.4384 29.9561 35.6184 29.9561 34.8873 30.2565C34.5187 30.3994 34.182 30.6137 33.8964 30.8871L24.8878 39.8956C24.3224 40.461 24.0047 41.2279 24.0047 42.0276C24.0047 42.8273 24.3224 43.5942 24.8878 44.1596C25.4533 44.7251 26.2202 45.0427 27.0199 45.0427C27.8195 45.0427 28.5864 44.7251 29.1519 44.1596L33.0255 40.2559V57.0418C33.0255 57.8382 33.3419 58.602 33.9051 59.1652C34.4682 59.7283 35.232 60.0447 36.0284 60.0447C36.8248 60.0447 37.5886 59.7283 38.1517 59.1652C38.7149 58.602 39.0312 57.8382 39.0312 57.0418V40.2559L42.9049 44.1596C43.1841 44.4411 43.5162 44.6645 43.8821 44.8169C44.248 44.9694 44.6405 45.0479 45.0369 45.0479C45.4333 45.0479 45.8258 44.9694 46.1917 44.8169C46.5577 44.6645 46.8898 44.4411 47.1689 44.1596C47.4504 43.8805 47.6738 43.5484 47.8262 43.1824C47.9787 42.8165 48.0572 42.424 48.0572 42.0276C48.0572 41.6312 47.9787 41.2387 47.8262 40.8728C47.6738 40.5069 47.4504 40.1747 47.1689 39.8956L38.1604 30.8871Z"
                  fill="#0099AD" />
              </svg>
              <p>Silahkan pilih berkas evidence anda</p>
              <!-- <p>ATAU</p> -->
              <label for="fileInputEvidenceFS"
                class="flex flex-row items-center px-3 py-2 space-x-2 text-white duration-300 rounded-lg cursor-pointer bg-primaryColor hover:bg-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0">
                <IconFolder />
                <span class="font-semibold">Cari berkas</span>
              </label>
              <input ref="fileInputEvidenceFS" id="fileInputEvidenceFS" type="file" class="hidden"
                @change="handleFileChangeEvidence" accept=".xlsx, .zip" />
            </div>
            <div class="flex flex-row items-center justify-between">
              <p class="text-xs text-textDisabledColor">Tipe File yang dapat diunggah .xlsx, .zip</p>
              <p class="text-xs text-textDisabledColor">Ukuran maksimal dokumen : 5 MB</p>
            </div>
          </div>
        </div>
        <div class="flex flex-row justify-end space-x-3">
          <button
            class="px-3 py-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
            @click="selectedFileFS = null; selectedFileEvidence = null">Reset</button>
          <button
            class="px-3 py-2 font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
            @click="uploadFileFS">Kirim</button>
        </div>
      </div>
    </ModalWrapper>
    <div class="flex" v-if="approveMesinFS">
      <div v-if="approveMesinFS.status === 'Ditolak T1' || approveMesinFS.status === 'Ditolak T2'" class="flex">
        <!-- Revisi Data -->
        <button class="w-fit p-2 ml-1 flex items-center justify-center bg-[#0099AD] rounded-md text-white"
          @click="isModalUnggahFSOpen = true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_8312_23311)">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M11.9548 2.04663C11.7554 1.8473 11.4323 1.8473 11.2329 2.04663L10.661 2.61853L11.3829 3.34036L11.9548 2.76847C12.1541 2.56914 12.1541 2.24596 11.9548 2.04663ZM10.5579 4.16532L9.83607 3.44348L2.85121 10.4283C2.61135 10.6682 2.43503 10.9641 2.33819 11.2892L2.1795 11.8219L2.71225 11.6632C3.03735 11.5664 3.3332 11.39 3.57306 11.1502L10.5579 4.16532ZM10.408 1.22168C11.0629 0.566733 12.1248 0.566733 12.7797 1.22168C13.4347 1.87662 13.4347 2.93849 12.7797 3.59343L4.39802 11.9751C4.02109 12.3521 3.55619 12.6291 3.04532 12.7813L1.47913 13.2479C1.27385 13.309 1.05157 13.2527 0.900117 13.1013C0.748661 12.9498 0.692391 12.7275 0.753539 12.5223L1.22008 10.9561C1.37226 10.4452 1.64933 9.98032 2.02625 9.60339L10.408 1.22168Z"
                fill="#FFFFFF" />
            </g>
            <defs>
              <clipPath id="clip0_8312_23311">
                <rect width="14" height="14" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="ml-2 font-semibold">Revisi Data</p>
        </button>
      </div>
      <div
        v-else-if="approveMesinFS.status === 'Disetujui' || approveMesinFS.status === 'Menunggu Persetujuan T1' || approveMesinFS.status === 'Menunggu Persetujuan T2'">
      </div>
      <div v-else-if="approveMesinFS.status === 'Draft'" class="flex">
        <!-- Edit Data -->
        <button
          class="w-fit p-2 mr-1 flex items-center justify-center border border-[#0099AD] rounded-md text-[#0099AD] duration-300 hover:text-white"
          @click="isModalUnggahFSOpen = true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_8312_23311)">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M11.9548 2.04663C11.7554 1.8473 11.4323 1.8473 11.2329 2.04663L10.661 2.61853L11.3829 3.34036L11.9548 2.76847C12.1541 2.56914 12.1541 2.24596 11.9548 2.04663ZM10.5579 4.16532L9.83607 3.44348L2.85121 10.4283C2.61135 10.6682 2.43503 10.9641 2.33819 11.2892L2.1795 11.8219L2.71225 11.6632C3.03735 11.5664 3.3332 11.39 3.57306 11.1502L10.5579 4.16532ZM10.408 1.22168C11.0629 0.566733 12.1248 0.566733 12.7797 1.22168C13.4347 1.87662 13.4347 2.93849 12.7797 3.59343L4.39802 11.9751C4.02109 12.3521 3.55619 12.6291 3.04532 12.7813L1.47913 13.2479C1.27385 13.309 1.05157 13.2527 0.900117 13.1013C0.748661 12.9498 0.692391 12.7275 0.753539 12.5223L1.22008 10.9561C1.37226 10.4452 1.64933 9.98032 2.02625 9.60339L10.408 1.22168Z"
                fill="#0099AD" />
            </g>
            <defs>
              <clipPath id="clip0_8312_23311">
                <rect width="14" height="14" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p class="ml-2 font-semibold">Edit Data</p>
        </button>
        <!-- Kirim Data -->
        <button class="w-fit p-2 ml-1 flex items-center justify-center bg-[#0099AD] rounded-md text-white duration-300"
          @click="modalApprove = !modalApprove">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.83301 8.16667L12.2497 1.75M5.83301 8.16667L7.87467 12.25C7.90027 12.3058 7.94136 12.3532 7.99306 12.3864C8.04476 12.4195 8.10491 12.4372 8.16634 12.4372C8.22778 12.4372 8.28792 12.4195 8.33962 12.3864C8.39132 12.3532 8.43241 12.3058 8.45801 12.25L12.2497 1.75M5.83301 8.16667L1.74967 6.125C1.69383 6.09941 1.6465 6.05832 1.61332 6.00661C1.58014 5.95491 1.5625 5.89477 1.5625 5.83333C1.5625 5.7719 1.58014 5.71176 1.61332 5.66005C1.6465 5.60835 1.69383 5.56726 1.74967 5.54167L12.2497 1.75"
              stroke="#F7FBFC" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="ml-2 text-sm font-semibold text-white">Kirim Data</span>
        </button>
        <ModalWrapper :showModal="modalApprove" :width="'w-[y00px]'" :height="'h-auto'">
          <div class="border-b text-primaryTextColor">
            <h1 class="mb-3 text-lg font-bold">Kirim Laporan?</h1>
            <p class="mb-4 text-sm">
              Apakah Anda yakin ingin Mengirim Laporan ini?
            </p>
          </div>
          <div class="flex flex-row justify-end mt-4">
            <button
              class="border border-[#0099AD] hover:border-[#0099AD] mr-3 px-3 py-2 text-[#0099AD] hover:text-white rounded-lg hover:bg-[#0099AD] duration-300"
              @click="modalApprove = false">
              <span class="text-sm font-semibold">Batal</span>
            </button>
            <button class="flex items-center bg-[#0099AD] border border-[#0099AD] px-3 py-2 rounded-lg duration-300"
              @click="updateFS()">
              <span class="text-sm font-semibold text-white">Kirim</span>
            </button>
          </div>
        </ModalWrapper>
        <ModalWrapper :showModal="isSuccess" :width="'w-80'" :height="'h-auto'">
          <div class="flex flex-col items-center">
            <Vue3Lottie :animationData="jsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
            <h1 class="mb-3 text-lg font-semibold text-gray-700">
              Laporan Berhasil Dikirim
            </h1>
            <p class="text-sm text-textDisabledColor">
              Laporan Anda Telah Berhasil Dikirim Ke Pembina
            </p>
          </div>
        </ModalWrapper>
      </div>
    </div>
  </InfoHeader>

  <!-- Download Evidence -->
  <div class="flex justify-between p-4 mt-4 bg-white rounded-lg">
    <div class="flex items-center">
      <div class="flex">
        <div class="w-1 h-7 mr-2 bg-[#0099AD]"></div>
        <p class="text-lg font-semibold">Evidence</p>
      </div>
    </div>
    <button
      class="flex items-center px-3 py-2 duration-300 bg-white border rounded-lg border-primaryColor text-primaryColor hover:text-white"
      @click="downloadEvidence">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M6.12508 3.20964C4.75588 3.20964 3.64591 4.3196 3.64591 5.6888C3.64591 5.84688 3.66063 6.00098 3.68862 6.14997C3.74259 6.43729 3.57555 6.72018 3.2979 6.81169C2.48294 7.08026 1.89591 7.84799 1.89591 8.7513C1.89591 9.87888 2.81 10.793 3.93758 10.793H10.5001C11.386 10.793 12.1042 10.0748 12.1042 9.1888C12.1042 8.50438 11.6754 7.91867 11.0697 7.68854C10.774 7.57619 10.6217 7.24864 10.7264 6.95015C10.7686 6.83 10.7917 6.70023 10.7917 6.5638C10.7917 5.91947 10.2694 5.39714 9.62508 5.39714C9.49836 5.39714 9.37744 5.41713 9.26468 5.4537C9.11237 5.5031 8.94646 5.48772 8.80583 5.41116C8.6652 5.33461 8.56222 5.20362 8.52102 5.0489C8.23896 3.98944 7.27235 3.20964 6.12508 3.20964ZM2.47925 5.6888C2.47925 3.67526 4.11154 2.04297 6.12508 2.04297C7.62264 2.04297 8.90824 2.94548 9.46959 4.23559C9.52103 4.23219 9.57288 4.23047 9.62508 4.23047C10.9137 4.23047 11.9584 5.27514 11.9584 6.5638C11.9584 6.65152 11.9535 6.73824 11.9441 6.82366C12.7393 7.3102 13.2709 8.1869 13.2709 9.1888C13.2709 10.7191 12.0304 11.9596 10.5001 11.9596H3.93758C2.16567 11.9596 0.729248 10.5232 0.729248 8.7513C0.729248 7.50166 1.44338 6.42 2.48473 5.89018C2.48109 5.82348 2.47925 5.75633 2.47925 5.6888ZM7.00008 5.10547C7.32225 5.10547 7.58341 5.36664 7.58341 5.6888V8.21801L8.3376 7.46382C8.56541 7.23602 8.93475 7.23602 9.16256 7.46382C9.39037 7.69163 9.39037 8.06098 9.16256 8.28878L7.41256 10.0388C7.18475 10.2666 6.81541 10.2666 6.5876 10.0388L4.8376 8.28878C4.6098 8.06098 4.6098 7.69163 4.8376 7.46382C5.06541 7.23602 5.43475 7.23602 5.66256 7.46382L6.41675 8.21801V5.6888C6.41675 5.36664 6.67791 5.10547 7.00008 5.10547Z"
          fill="#0099AD" />
      </svg>
      <span class="ml-2 text-sm font-semibold">Download Evidence</span>
    </button>
  </div>

  <!-- Tab Detail -->
  <div class="items-start p-6 mt-4 bg-white rounded-lg">
    <!-- Keterangan di Tolak -->
    <div v-if="approveMesinFS">
      <div v-auto-animate="{ duration: 300 }"
        v-if="approveMesinFS.status === 'Ditolak T1' || approveMesinFS.status === 'Ditolak T2'"
        class="p-2 -mt-1 mb-3 w-full bg-[#FFE5E6] border-2 border-[#FF5656] rounded-md">
        <div class="flex justify-between">
          <div class="flex space-x-0.5">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M11.0002 3.66536C6.95007 3.66536 3.66683 6.94861 3.66683 10.9987C3.66683 15.0488 6.95007 18.332 11.0002 18.332C15.0503 18.332 18.3335 15.0488 18.3335 10.9987C18.3335 6.94861 15.0503 3.66536 11.0002 3.66536ZM1.8335 10.9987C1.8335 5.93609 5.93755 1.83203 11.0002 1.83203C16.0628 1.83203 20.1668 5.93609 20.1668 10.9987C20.1668 16.0613 16.0628 20.1654 11.0002 20.1654C5.93755 20.1654 1.8335 16.0613 1.8335 10.9987ZM11.0002 7.33203C11.5064 7.33203 11.9168 7.74244 11.9168 8.2487V11.6862C11.9168 12.1925 11.5064 12.6029 11.0002 12.6029C10.4939 12.6029 10.0835 12.1925 10.0835 11.6862V8.2487C10.0835 7.74244 10.4939 7.33203 11.0002 7.33203ZM10.0835 14.4362C10.0835 13.9299 10.4939 13.5195 11.0002 13.5195H11.007C11.5133 13.5195 11.9237 13.9299 11.9237 14.4362V14.4431C11.9237 14.9493 11.5133 15.3597 11.007 15.3597H11.0002C10.4939 15.3597 10.0835 14.9493 10.0835 14.4431V14.4362Z"
                fill="#FF5656" />
            </svg>
            <p class="font-semibold" v-if="approveMesinFS.status === 'Ditolak T1'">Ditolak Unit Pembina</p>
            <p class="font-semibold" v-else-if="approveMesinFS.status === 'Ditolak T2'">Ditolak Unit Pengelola</p>
          </div>
          <div class="cursor-pointer" @click="toggleButton">
            <svg v-if="isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
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
        <p v-if="isHover" class="mt-2 ml-6 text-sm capitalize">{{ approveMesinFS.keterangan }}</p>
      </div>
    </div>
    <!-- Tabs -->
    <TabsWrapper v-if="hasilSimulasi && mesinDataById && approveSentralFS && approveMesinFS" :isLihatGrafik="true"
      :photo="mesinDataById.photo1 === '' ? '' : mesinDataById.photo2" :laman-data="false"
      :id-mesin="idGrafik.toString()"
      :nilai-asset-awal="mesinDataById.nilai_asset_awal ? mesinDataById.nilai_asset_awal : 0" :tahun-grafik="tahunData"
      :tahun="tahunData ? tahunData : '-'" :irr-on-project="hasilSimulasi.fs_irr_project"
      :irr-on-equity="hasilSimulasi.fs_irr_equity" :npv-on-equity="hasilSimulasi.fs_npv_equity"
      :npv-on-project="hasilSimulasi.fs_npv_project" :average-ncf="hasilSimulasi.fs_average_cf"
      :wacc-on-project="hasilSimulasi.fs_on_project" :wacc-on-equity="hasilSimulasi.fs_on_equity"
      :average-eaf="hasilSimulasi.fs_average_eaf" :nama-mesin="mesinDataById.mesin ? mesinDataById.mesin : '-'"
      :nama-pengelola="approveSentralFS.pengelola ? approveSentralFS.pengelola : '-'" :nama-pembina="namaPembina"
      :daya-terpasang="mesinDataById.daya_terpasang" :daya-mampu="mesinDataById.daya_mampu"
      :tahun-perolehan-data="mesinDataById.tahun_nilai_perolehan.toString() ? mesinDataById.tahun_nilai_perolehan.toString() : '-'"
      :tahun-operasi="mesinDataById.tahun_operasi ? mesinDataById.tahun_operasi : '-'" :jumlah-mesin="jumlahMesin"
      :status-grafik="approveMesinFS.status">
      <TabItem :title="'Asumsi Makro'">
        <AsumsiMakro v-if="asumsiMakro" :data="data" :tahun="'-'"
          :status="arrMesin.status ? arrMesin.status.toString() : '-'"
          :corporate-tax-rate="asumsiMakro ? asumsiMakro.corporate_tax_rate : '-'"
          :discount-rate="asumsiMakro ? asumsiMakro.discount_rate : '-'"
          :interest-rate="asumsiMakro ? asumsiMakro.interest_rate : '-'"
          :loan-tenor="asumsiMakro ? asumsiMakro.loan_tenor : '-'"
          :loan-portion="asumsiMakro ? asumsiMakro.loan_portion : '-'"
          :equity-portion="asumsiMakro ? asumsiMakro.equity_portion : '-'" />
      </TabItem>
      <TabItem :title="'Parameter Teknis & Finansial'">
        <ParameterTeknis v-if="parameterTeknisFinansial" :data="data" :tahun="'-'"
          :status="arrMesin.status ? arrMesin.status : '-'"
          :daya-terpasang="parameterTeknisFinansial?.daya_terpasang ?? '-'"
          :daya-mampu-netto="parameterTeknisFinansial?.daya_mampu_netto_mw ?? '-'"
          :auxiliary="parameterTeknisFinansial?.auxiliary ?? '-'"
          :susut-trafo="parameterTeknisFinansial?.susut_trafo ?? '-'"
          :pemakaian-sendiri="parameterTeknisFinansial?.ps ?? '-'" :net-plant-heat-rate="parameterTeknisFinansial?.nphr"
          :total-project-cost="parameterTeknisFinansial?.total_project_cost" :loan="parameterTeknisFinansial?.loan"
          :equity="parameterTeknisFinansial?.equity"
          :electricity-price-a="parameterTeknisFinansial?.electricity_price_a_rp_per_kwbln"
          :electricity-price-b="parameterTeknisFinansial?.electricity_price_b_rp_per_kwbln"
          :electricity-price-c="parameterTeknisFinansial?.electricity_price_c_rp_per_kwh"
          :electricity-price-d="parameterTeknisFinansial?.electricity_price_d_rp_per_kwh" :bahan-bakars="bahanBakars"
          :combo-bahan-bakar="comboBahanBakar" />
      </TabItem>
      <TabItem title="Data Teknis">
        <div class="flex flex-col w-full space-y-2">
          <div v-if="approveMesinFS" class="flex flex-row justify-between">
            <div class="mt-0.5 mb-4">
              <p class="mb-2 text-base font-bold">Data Teknis</p>
              <div class="flex items-center text-xs">
                <p class="font-bold">Periode</p>
                <p class="ml-2 font-bold text-[#0099AD]">-</p>
                <p class="ml-2">/</p>
                <p class="ml-2 font-bold">Data</p>
                <p class="ml-2 font-bold text-[#0099AD]">Feasibility Study</p>
              </div>
            </div>
            <div class="flex items-center text-xs">
              <p class="mr-2">Status Laporan</p>
              <ComponentDitolakT1 v-if="approveMesinFS.status === 'Ditolak T1'" />
              <ComponentDitolakT2 v-else-if="approveMesinFS.status === 'Ditolak T2'" />
              <ComponentDisetujui v-else-if="approveMesinFS.status === 'Disetujui'" />
              <ComponentWaitingT1 v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T1'" />
              <ComponentWaitingT2 v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T2'" />
              <ComponentDraft v-else-if="approveMesinFS.status === 'Draft'" />
            </div>
          </div>
          <TableDataTeknis :data-teknis="dataTeknis" :type-periodic="typePeriodic" />
        </div>
      </TabItem>
      <TabItem title="Data Finansial">
        <div class="flex flex-col w-full space-y-2">
          <div class="flex flex-row justify-between" v-if="approveMesinFS">
            <div class="mt-0.5 mb-4">
              <p class="mb-2 text-base font-bold">Data Finansial</p>
              <div class="flex items-center text-xs">
                <p class="font-bold">Periode</p>
                <p class="ml-2 font-bold text-[#0099AD]">-</p>
                <p class="ml-2">/</p>
                <p class="ml-2 font-bold">Data</p>
                <p class="ml-2 font-bold text-[#0099AD]">Feasibility Study</p>
              </div>
            </div>
            <div class="flex items-center text-xs">
              <p class="mr-2">Status Laporan</p>
              <ComponentDitolakT1 v-if="approveMesinFS.status === 'Ditolak T1'" />
              <ComponentDitolakT2 v-else-if="approveMesinFS.status === 'Ditolak T2'" />
              <ComponentDisetujui v-else-if="approveMesinFS.status === 'Disetujui'" />
              <ComponentWaitingT1 v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T1'" />
              <ComponentWaitingT2 v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T2'" />
              <ComponentDraft v-else-if="approveMesinFS.status === 'Draft'" />
            </div>
          </div>
          <TableDataFinansial v-if="dataFinansial" :data-finansial="dataFinansial" :source="finansialMappingResult" />
        </div>
      </TabItem>
      <TabItem title="Hasil Simulasi">
        <div class="flex flex-col w-full px-2">
          <div class="flex flex-row justify-between" v-if="approveMesinFS">
            <div class="mt-0.5 mb-4">
              <p class="mb-2 text-base font-bold">Hasil Simulasi</p>
              <div class="flex items-center text-xs">
                <p class="font-bold">Periode</p>
                <p class="ml-2 font-bold text-[#0099AD]">-</p>
                <p class="ml-2">/</p>
                <p class="ml-2 font-bold">Data</p>
                <p class="ml-2 font-bold text-[#0099AD]">Feasibility Study</p>
              </div>
            </div>
            <div class="flex items-center text-xs">
              <p class="mr-2">Status Laporan</p>
              <ComponentDitolakT1 v-if="approveMesinFS.status === 'Ditolak T1'" />
              <ComponentDitolakT2 v-else-if="approveMesinFS.status === 'Ditolak T2'" />
              <ComponentDisetujui v-else-if="approveMesinFS.status === 'Disetujui'" />
              <ComponentWaitingT1 v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T1'" />
              <ComponentWaitingT2 v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T2'" />
              <ComponentDraft v-else-if="approveMesinFS.status === 'Draft'" />
            </div>
          </div>
          <nav class="rounded-md bg-primaryColor bg-opacity-5">
            <ul class="table w-full text-sm text-center text-primaryColor border-spacing-x-5">
              <li id="tab"
                class="table-cell w-1/2 py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                @click="selectedTab = 'Akhir Masa'" :class="{ selected: selectedTab === 'Akhir Masa' }">
                COD - Akhir Masa Manfaat
              </li>
              <!-- <li id="tab"
                class="table-cell w-1/2 py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                @click="selectedTab = 'Tahun Berjalan'" :class="{ selected: selectedTab === 'Tahun Berjalan' }"> COD -
                Tahun
                Berjalan
              </li> -->
            </ul>
          </nav>
          <AkhirMasaManfaat v-if="hasilSimulasi" :irr-on-project="hasilSimulasi.fs_irr_project"
            :irr-on-equity="hasilSimulasi.fs_irr_equity" :npv-on-equity="hasilSimulasi.fs_npv_equity"
            :npv-on-project="hasilSimulasi.fs_npv_project" :average-ncf="hasilSimulasi.fs_average_cf"
            :average-eaf="hasilSimulasi.fs_average_eaf" v-show="selectedTab === 'Akhir Masa'" />
          <TahunBerjalan v-if="hasilSimulasi" :irr-on-project="hasilSimulasi.now_fs_irr_project"
            :irr-on-equity="hasilSimulasi.now_fs_irr_equity" :npv-on-equity="hasilSimulasi.now_fs_npv_equity"
            :npv-on-project="hasilSimulasi.now_fs_npv_project" :average-ncf="hasilSimulasi.now_fs_average_cf"
            :average-eaf="hasilSimulasi.now_fs_average_eaf" v-show="selectedTab === 'Tahun Berjalan'" />
        </div>
      </TabItem>
    </TabsWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { encryptStorage, encryptedUserInfo } from "@/utils/app-encrypt-storage";
import { Vue3Lottie } from 'vue3-lottie';
import { notifyError } from "@/services/helper/toast-notification";
import UserService from "@/services/user-service";
const userService = new UserService();
import DetailSentralService from "@/services/detail-sentral-service";
const detailSentralService = new DetailSentralService();
import RekapService from "@/services/rekap-service";
const rekapService = new RekapService();
import TableDataTeknis from "@/components/RekapKertasKerja/TableDataTeknis.vue";
import TableDataFinansial from "@/components/RekapKertasKerja/TableDataFinansial.vue";
import PersetujuanService from '@/services/persetujuan-service';
import FeasibilityStudyService from "@/services/feasibility-study";
import DetailRekapService from "@/services/detail-rekap-service";
import GlobalFormat from "@/services/format/global-format";
import Loading from "@/components/ui/LoadingSpinner.vue";
import InfoHeader from '@/components/ui/InfoHeader.vue';
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import TabsWrapper from "@/components/ui/TabsWrapperApproveFS.vue";
import TabItem from "@/components/ui/TabItem.vue";
import AsumsiMakro from "@/components/ui/AsumsiMakroApprove.vue";
import ParameterTeknis from "@/components/ui/ParameterTeknisApprove.vue";
import AkhirMasaManfaat from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue";
import TahunBerjalan from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue";
import jsonData from "@/assets/lottie/success.json";
import axios from "axios";
import IconFolder from "@/components/icons/IconFolder.vue";
import ComponentDisetujui from '@/components/Status/ComponentDisetujui.vue';
import ComponentDitolakT1 from '@/components/Status/ComponentDitolakT1.vue';
import ComponentDitolakT2 from '@/components/Status/ComponentDitolakT2.vue';
import ComponentWaitingT1 from '@/components/Status/ComponentWaitingT1.vue';
import ComponentWaitingT2 from '@/components/Status/ComponentWaitingT2.vue';
import ComponentDraft from '@/components/Status/ComponentDraft.vue';

const nodeMode = import.meta.env.MODE;
const route = useRoute();
const isLoading = ref(false);
const modalApprove = ref(false);
const selectedTab = ref("Akhir Masa");
const data = ref('Feasibility Study');
const isSuccess = ref(false);
const isHover = ref(true);
const feasibilityStudyService = new FeasibilityStudyService();
const detailRekapService = new DetailRekapService();
const persetujuanService = new PersetujuanService();
const globalFormat = new GlobalFormat();
const isFSUploadSuccess = ref<boolean>(false);
const isModalUnggahFSOpen = ref<boolean>(false);
const selectedFileEvidence: any = ref(null);
const isEvidenceSuccess = ref<boolean>(false);

const selectedFileFS: any = ref(null);
const namaPengelola = ref<string>('');
const namaPembina = ref<string>('');
const mesinDataById = ref<MesinItem>();
const approveSentralFS = ref<ListApprove>();
const approveMesinFS = ref<ListApprove>();
const asumsiMakro = ref<AsumsiMakroItem>()
const parameterTeknisFinansial = ref<ParameterTeknisFinancialItem>();
const bahanBakars = ref<{
  id_mesin: number
  tahun: string
  kode_bahan_bakar: string
  harga_bahan_bakar: number
  sfc: number
  flag_bahan_bakar: number
}[]>([]);
const comboBahanBakar = ref<[]>([]);
const finansialMappingResult = ref<any[]>([]);
const typePeriodic = ref<Object[]>([]);
const statusMesin = ref<any>([]);
const umurTeknis = ref();
const dataTeknis = ref<{
  header: any[],
  tahun: number[],
  detail: any[]
}>({
  header: [],
  tahun: [],
  detail: []
});
const dataFinansial = ref();
const hasilSimulasi = ref();

const tahunBerjalan = new Date().getFullYear();
const tahunTerakhirRealisasi = ref<any>();
const tahunData = ref<any>();
const arrMesin = ref<any>({});
const idGrafik = nodeMode === 'production' ? encryptStorage.decryptValue(route.params.id.toString()) : route.params.id;
const updateMesin = ref<any>();
const jumlahMesin = ref<any>('');

interface MesinItem {
  data: any
  id_mesin: number
  kode_sentral: string
  kode_mesin: string
  mesin: string
  kode_jenis_pembangkit: string
  kondisi_unit: string
  daya_terpasang: number
  daya_mampu: number
  tahun_operasi: string
  masa_manfaat: string
  nilai_asset_awal: number
  tahun_nilai_perolehan: string
  photo1: string
  photo2: string
}

interface ListApprove {
  data: any
  pengelola: string
  pembina: string
  umur_teknis: string
  tahun: string
  status: string
  id_mesin: string
  keterangan: string
}

interface AsumsiMakroItem {
  corporate_tax_rate: number
  discount_rate: number
  interest_rate: number
  loan_tenor: number
  loan_portion: number
  equity_portion: number
}

interface ParameterTeknisFinancialItem {
  daya_terpasang: number
  daya_mampu_netto_mw: number
  auxiliary: number
  susut_trafo: number
  ps: number
  nphr: number
  total_project_cost: number
  loan: number
  equity: number
  electricity_price_a_rp_per_kwbln: number
  electricity_price_b_rp_per_kwbln: number
  electricity_price_c_rp_per_kwh: number
  electricity_price_d_rp_per_kwh: number
}

function toggleButton() {
  isHover.value = !isHover.value;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchMesinById = async () => {
  try {
    const response: MesinItem = await detailRekapService.getMesinById(
      idGrafik
    );
    try {
      const responsePhoto: any = await detailSentralService.getPhoto(response.data.photo1);
      const blob = new Blob([responsePhoto]);
      response.data.photo2 = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error Fetch Photo: ', error)
    }
    mesinDataById.value = response.data;
    tahunData.value = parseInt(response.data.tahun_nilai_perolehan);
  } catch (error) {
    console.error("Fetch Mesin By Id Error : " + error);
  }
};

const fetchPersetujuanFS = async () => {
  try {
    const response: ListApprove = await persetujuanService.getPersetujuanFSSentral({
      id_sentral: route.query.id_sentral,
    });
    approveSentralFS.value = response.data;
    approveMesinFS.value = response.data.mesins.filter((val: any) => val.id_mesin == idGrafik)[0];
    console.log(approveMesinFS.value)
    arrMesin.value = response.data.mesins.filter((val: any) => val.id_mesin == idGrafik)[0];
    statusMesin.value = response.data.mesins.filter((val: any) => val.id_mesin == idGrafik)[0].id_status;
  } catch (error) {
    console.error('Fetch Persetujuan FS Sentral Error : ' + error);
  }
}
const handleFileFSChange = (event: any) => {
  if (event.target.files.length === 1) {
    selectedFileFS.value = event.target.files[0];
  } else {
    selectedFileFS.value = null;
  }
};
const fetchAsumsiFeasibility = async () => {
  try {
    const response: any =
      await feasibilityStudyService.getAsumsiFeasibility(
        parseInt(idGrafik),
        parseInt(tahunTerakhirRealisasi.value)
      );
    asumsiMakro.value = {
      corporate_tax_rate: response.data.asumsi_makro.corporate_tax_rate,
      discount_rate: response.data.asumsi_makro.discount_rate,
      interest_rate: response.data.asumsi_makro.interest_rate,
      loan_tenor: response.data.asumsi_makro.loan_tenor,
      loan_portion: response.data.asumsi_makro.loan_portion,
      equity_portion: response.data.asumsi_makro.equity_portion,
    }
    parameterTeknisFinansial.value = {
      daya_terpasang: response.data.parameter_teknis_financial
        .daya_terpasang,
      daya_mampu_netto_mw: response.data.parameter_teknis_financial.daya_mampu_netto_mw,
      susut_trafo: response.data.parameter_teknis_financial.susut_trafo,
      auxiliary: response.data.parameter_teknis_financial.auxiliary,
      nphr: response.data.parameter_teknis_financial.nphr,
      ps: response.data.parameter_teknis_financial.ps,
      loan: response.data.parameter_teknis_financial.loan,
      total_project_cost: response.data.parameter_teknis_financial.total_project_cost,
      electricity_price_a_rp_per_kwbln: response.data.parameter_teknis_financial.electricity_price_a_rp_per_kwbln,
      equity: response.data.parameter_teknis_financial.equity,
      electricity_price_c_rp_per_kwh: response.data.parameter_teknis_financial.electricity_price_c_rp_per_kwh,
      electricity_price_d_rp_per_kwh: response.data.parameter_teknis_financial.electricity_price_d_rp_per_kwh,
      electricity_price_b_rp_per_kwbln: response.data.parameter_teknis_financial.electricity_price_b_rp_per_kwbln,
    };
    bahanBakars.value = response.data.harga_bahan_bakars;
    umurTeknis.value = response.data.umur_teknis;
  } catch (error) {
    console.error("Error Fetch Asumsi Feasibility : " + error);
  }
};
const formatBytes = (bytes: any) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)).toString());
  return Math.round(100 * (bytes / Math.pow(k, i))) / 100 + ' ' + sizes[i];
};
const fetchDataTeknis = async () => {
  try {
    const response: any = await feasibilityStudyService.getDataTeknis(
      parseInt(idGrafik)
    );
    dataTeknis.value = response.data;
  } catch (error) {
    console.error("Error Fetch Data Teknis : " + error);
  }
};
const uploadFileEvidence = async () => {
  try {
    isLoading.value = true
    const formData = new FormData();
    formData.append('file', selectedFileEvidence.value);
    const response: any = await rekapService.uploadEvidence(formData);
    await rekapService.updateEvidencePath(parseInt(idGrafik), tahunBerjalan.toString(), response.data, 1, selectedFileEvidence.value.name);
    isLoading.value = false
    isEvidenceSuccess.value = true;
    await wait(1500)
    isEvidenceSuccess.value = false;
  } catch (error) {
    console.error('Error upload file : ', error);
  } finally {
    isLoading.value = false;
  }
};
const downloadEvidence = async () => {
  try {
    isLoading.value = true;
    const filePath: any = await rekapService.getEvidencePath(idGrafik, tahunBerjalan.toString() ?? '0', 1);
    const finalFileName: any = filePath.data[0].file_name;
    const response: any = await rekapService.downloadEvidence(filePath.data[0].dokumen_evidence);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `${finalFileName}`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a');
    link.href = url
    link.setAttribute('download', fileName);
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link)
    isLoading.value = false;
  } catch (error) {
    console.error('Evidence Error : ' + error)
    isLoading.value = false;
    notifyError('Evidence Tidak Ada', 5000)
  };
}

const fetchDataFinansial = async () => {
  try {
    dataFinansial.value = undefined
    finansialMappingResult.value = [];
    const response: any = await feasibilityStudyService.getDataFinansial(
      parseInt(idGrafik)
    )
    let currentLevel1: any | null = null;
    let currentLevel2: any | null = null
    let currentLevel3: any | null = null;
    for (const item of response.data.detail) {
      if (item.level === 1) {
        currentLevel1 = {
          ...item,
          level2: [],
        }
        finansialMappingResult.value.push(currentLevel1);
      } else if (item.level === 2 && currentLevel1 !== null) {
        currentLevel2 = {
          ...item,
          level3: [],
        }
        currentLevel1.level2.push(currentLevel2);
      } else if (item.level === 3 && currentLevel1 !== null) {
        currentLevel3 = {
          ...item,
          level4: [],
        }
        currentLevel2.level3.push(currentLevel3);
      } else if (item.level === 4 && currentLevel1 !== null) {
        currentLevel3.level4.push({ ...item })
      };
    }
    dataFinansial.value = response.data;
  } catch (error) {
    console.error("Fetch Data Finansial Error : " + error)
  };
}

const fetchHasilSimulasi = async () => {
  try {
    const response: any = await feasibilityStudyService.getHasilSimulasi(
      parseInt(idGrafik),
      parseInt(statusMesin.value)
    );
    hasilSimulasi.value = response.data;
  } catch (error) {
    console.error("Fetch Hasil Simulasi Error : " + error);
  }
}
const fetchListPembina = async () => {
  try {
    const response: any = await userService.getPembina('');
    return response.data;
  } catch (error) {
    console.error('Fetch Pembina Error : ' + error)
  }
}
const fetchUnitPengelola = async () => {
  try {
    if (mesinDataById.value) {
      const kodeSentral = mesinDataById.value.kode_sentral;
      const pembangkitResponse: any =
        await detailRekapService.getPembangkitByKode(kodeSentral);
      const kodePengelola = pembangkitResponse.data.kode_pengelola;
      jumlahMesin.value = pembangkitResponse.data.mesins.length;
      const pengelolaResponse: any = await detailRekapService.getPengelolaData()
      const pengelola = pengelolaResponse.data.filter(
        (pengelola: any) => pengelola.kode_pengelola === kodePengelola
      );
      namaPengelola.value = pengelola[0].pengelola
      const idPembina = pembangkitResponse.data.id_pembina;
      const pembinaList: any = await fetchListPembina()
      namaPembina.value = pembinaList.find((pembina: any) => pembina.id_pembina === idPembina).pembina;
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : " + error);
  };
};
const handleFileChangeEvidence = (event: any) => {
  if (event.target.files.length === 1) {
    selectedFileEvidence.value = event.target.files[0];
  } else {
    selectedFileEvidence.value = null;
  }
};
const uploadFileFS = async () => {
  try {
    isLoading.value = true
    if (!selectedFileFS.value) {
      notifyError('Mohon pilih file excel terlebih dahulu', 3000);
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFileFS.value);
    await rekapService.uploadTemplateAwalFS(formData);
    isModalUnggahFSOpen.value = false;
    isLoading.value = false;
    isFSUploadSuccess.value = true;
    await wait(1500)
    isFSUploadSuccess.value = false;
    await uploadFileEvidence();
    selectedFileFS.value = null;
    selectedFileEvidence.value = null;
    approveMesinFS.value = undefined;
    approveSentralFS.value = undefined;
    arrMesin.value = [];
    asumsiMakro.value = undefined;
    parameterTeknisFinansial.value = undefined;
    bahanBakars.value = [];
    umurTeknis.value = undefined;
    dataTeknis.value = {
      header: [],
      tahun: [],
      detail: []
    };
    hasilSimulasi.value = [];
    isLoading.value = true;
    await fetchPersetujuanFS();
    await fetchAsumsiFeasibility();
    await fetchTypePeriodic();
    await fetchUnitPengelola();
    await fetchDataTeknis();
    await fetchDataFinansial();
    await fetchHasilSimulasi();
    isLoading.value = false;
  } catch (error) {
    console.error('Error upload file : ', error);
  } finally {
    isLoading.value = false;
  }
};
const handleDownloadTemplateFS = async () => {
  try {
    isLoading.value = true;
    const response: any = await rekapService.downloadTemplateFS(tahunBerjalan, idGrafik, mesinDataById.value?.kode_jenis_pembangkit);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Kertas Kerja FS - ${mesinDataById.value?.mesin}_${globalFormat.formatNumberFiveDigits(parseInt(idGrafik))}.xlsx`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    notifyError('Download Template FS Gagal', 3000);
    console.error('Handle Download Template Rekap Error : ' + error);
  } finally {
    isLoading.value = false
  }
};

const fetchTypePeriodic = async () => {
  try {
    const response: any = await detailRekapService.getTypePeriodic(
      mesinDataById.value?.kode_jenis_pembangkit
    );
    typePeriodic.value = response.data;
  } catch (error) {
    console.error("Fetch Type Periodic Error : " + error);
  }
};

const fetchComboBahanBakar = async () => {
  try {
    const response: any = await feasibilityStudyService.getComboBahanBakar(
      mesinDataById.value?.kode_jenis_pembangkit
    );
    comboBahanBakar.value = response.data;
  } catch (error) {
    console.error('Fetch Combo Bahan Bakar Error : ' + error);
  }
}

const updateFS = async () => {
  try {
    isLoading.value = true
    const response: any = await persetujuanService.updateStatusFS({
      status_approval: 0,
      keterangan: '',
      id_mesin: parseInt(idGrafik)
    })
    isLoading.value = false;
    updateMesin.value = response.data
    modalApprove.value = false;
    isSuccess.value = true;
    await wait(3000);
    isSuccess.value = false;
    isLoading.value = true;
    await fetchPersetujuanFS();
    isLoading.value = false;
  } catch (error) {
    console.error("Error Fetch Update Fesibilty Study : " + error);
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchMesinById();
  await fetchPersetujuanFS();
  await fetchAsumsiFeasibility();
  await fetchTypePeriodic();
  await fetchUnitPengelola();
  await fetchDataTeknis();
  await fetchDataFinansial();
  await fetchHasilSimulasi();
  await fetchComboBahanBakar();
  isLoading.value = false;
})
</script>

<style lang="scss" scoped>
button:hover>svg *,
button:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(28 100 242 / var(--tw-bg-opacity));
  fill: #ffffff;
}

th {
  font-weight: 700;
  padding: 1rem;
}

td {
  padding: 1rem;
}

ul li.selected {
  outline: 1px solid #0099AD;
  border-radius: 6px;
}

#level2 {
  padding-left: 3.1rem;
}

#level2.selected {
  padding-left: 5.1rem;
}

#level3 {
  padding-left: 5.3rem;
}

#level3.selected {
  padding-left: 7.3rem;
}

#level4 {
  padding-left: 9.3rem;
}

#tableHeader {
  padding-right: 30rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>