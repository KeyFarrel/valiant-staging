<template>
  <Loading v-if="isLoading" />
  <ModalNotification :show-modal="isShowModalNotification" :animation-data="errorJsonData" :title="'Data Gagal Dikirim'"
    :subtitle="'Semua input wajib diisi, mohon cek kembali inputan anda'" />
  <ModalNotification :show-modal="isSuccessSimulasi" :animation-data="successJsonData" :title="'Data Berhasil Dikirim'"
    :subtitle="'Data telah berhasil dikirim, silahkan lanjutkan perbarui dengan memilih opsi simulasi'" />
  <ModalNotification :show-modal="isSuccessEvidence" :animation-data="successJsonData"
    :title="'Evidence Berhasil Disimpan'"
    :subtitle="'Evidence berhasil disimpan, evidence bisa didownload pada menu Detail Rekap'" />
  <ModalNotification :show-modal="isSuccessPermanent" :animation-data="successJsonData"
    :title="'Data berhasil disimpan'" :subtitle="'Data telah berhasil disimpan'" />
  <ModalWrapper :show-modal="isShowFinalConfirmation" :z-index="'z-[55]'" :width="'w-auto'" :height="'h-auto'">
    <ConfirmationDialog :title="'Konfirmasi'"
      :subtitle="'Apakah anda yakin menyimpan? <br>Inputan tidak dapat diubah jika sudah disimpan'"
      :button-title="'Simpan'" @on-batal-click="isShowFinalConfirmation = false" @on-accept-click="handleFinalSubmit" />
  </ModalWrapper>
  <ModalNotification :show-modal="isFinalSubmitSuccess" :animation-data="successJsonData"
    :title="'Opsi Berhasil Disimpan'" :subtitle="'Pilihan opsi simulasi telah berhasil disimpan'" />
  <ModalWrapper :showModal="isSuccess" :width="'w-80'" :height="'h-auto'">
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
  <ModalWrapper :show-modal="isShowModalEvidence" :width="'w-[750px]'" :height="'h-auto'">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-row items-center justify-between">
        <p class="text-xl font-bold text-primaryTextColor">Unggah Evidence</p>
      </div>
      <div class="flex flex-col space-y-3">
        <div class="flex flex-col space-y-3">
          <p class="text-sm text-primaryTextColor">Apakah Anda yakin ingin menyimpan Opsi Simulasi ini? <br>
            Silahkan Unggah Evidence sebagai tahap akhir penyelesaian.</p>
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-semibold text-labelColor">Evidence</p>
            <p class="text-xs text-textDisabledColor">Silahkan unggah Evidence yang berkaitan dengan Opsi Simulasi.</p>
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <div v-if="selectedFileEvidence" class="flex flex-row items-center justify-between">
            <p>{{ selectedFileEvidence.name }} ({{ globalFormat.formatBytes(selectedFileEvidence.size) }})
            </p>
            <div class="flex flex-row items-center space-x-3">
              <label for="fileInputEvidence"
                class="flex flex-row whitespace-nowrap items-center px-3 py-2 space-x-2 text-primaryColor duration-300 rounded-lg cursor-pointer bg-[#F7FBFC] hover:ring-1 hover:ring-primaryColor active:ring active:ring-infoComponentBorderColor active:duration-0">
                <IconFolderBlue />
                <span class="font-semibold">Ganti berkas</span>
              </label>
              <input ref="fileInputEvidence" id="fileInputEvidence" type="file" class="hidden"
                @change="handleFileChangeEvidence" accept=".xlsx, .zip" />
              <button
                class="px-3 py-2 font-semibold duration-300 rounded-lg text-warningColor hover:bg-warningColor hover:text-white active:ring active:ring-red-500"
                @click="selectedFileEvidence = null">Hapus</button>
            </div>
          </div>
          <div
            class="w-full flex flex-col p-2 items-center bg-primaryColor bg-opacity-10 border border-primaryColor border-dashed rounded-lg space-y-1.5"
            v-else>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M55.3067 24.6712C53.4719 20.4552 50.3054 16.9571 46.2923 14.7129C42.2793 12.4687 37.6411 11.6023 33.0885 12.2463C28.5359 12.8904 24.3201 15.0094 21.087 18.2786C17.8539 21.5479 15.782 25.7871 15.1886 30.3465C12.3257 31.0322 9.81422 32.7453 8.13117 35.1607C6.44812 37.576 5.71072 40.5254 6.05899 43.4486C6.40725 46.3718 7.81694 49.0654 10.0203 51.0177C12.2238 52.97 15.0674 54.0452 18.0113 54.039C18.8077 54.039 19.5715 53.7226 20.1347 53.1595C20.6978 52.5963 21.0142 51.8326 21.0142 51.0361C21.0142 50.2397 20.6978 49.476 20.1347 48.9128C19.5715 48.3497 18.8077 48.0333 18.0113 48.0333C16.4185 48.0333 14.8909 47.4006 13.7647 46.2743C12.6384 45.148 12.0056 43.6204 12.0056 42.0276C12.0056 40.4348 12.6384 38.9072 13.7647 37.7809C14.8909 36.6547 16.4185 36.0219 18.0113 36.0219C18.8077 36.0219 19.5715 35.7056 20.1347 35.1424C20.6978 34.5793 21.0142 33.8155 21.0142 33.0191C21.0218 29.4675 22.2882 26.0337 24.5884 23.3276C26.8885 20.6216 30.0734 18.8185 33.5773 18.2387C37.0812 17.6589 40.6772 18.34 43.7264 20.1609C46.7756 21.9818 49.0806 24.8247 50.2318 28.1845C50.4035 28.7005 50.712 29.1602 51.1246 29.5146C51.5371 29.8689 52.0381 30.1046 52.5741 30.1964C54.5742 30.5744 56.3873 31.6186 57.718 33.1588C59.0488 34.6991 59.8186 36.6446 59.9022 38.6784C59.9858 40.7121 59.3781 42.7143 58.1783 44.3585C56.9784 46.0028 55.2571 47.1922 53.2948 47.733C52.5222 47.9321 51.8605 48.4299 51.455 49.117C51.0495 49.804 50.9336 50.624 51.1327 51.3965C51.3318 52.169 51.8296 52.8308 52.5167 53.2362C53.2037 53.6417 54.0237 53.7576 54.7962 53.5585C57.9563 52.7235 60.7577 50.88 62.7747 48.308C64.7918 45.736 65.9145 42.576 65.9723 39.3078C66.03 36.0397 65.0197 32.842 63.0947 30.2004C61.1698 27.5587 58.4353 25.6174 55.3067 24.6712ZM38.1604 30.8871C37.8748 30.6137 37.5381 30.3994 37.1695 30.2565C36.4384 29.9561 35.6184 29.9561 34.8873 30.2565C34.5187 30.3994 34.182 30.6137 33.8964 30.8871L24.8878 39.8956C24.3224 40.461 24.0047 41.2279 24.0047 42.0276C24.0047 42.8273 24.3224 43.5942 24.8878 44.1596C25.4533 44.7251 26.2202 45.0427 27.0199 45.0427C27.8195 45.0427 28.5864 44.7251 29.1519 44.1596L33.0255 40.2559V57.0418C33.0255 57.8382 33.3419 58.602 33.9051 59.1652C34.4682 59.7283 35.232 60.0447 36.0284 60.0447C36.8248 60.0447 37.5886 59.7283 38.1517 59.1652C38.7149 58.602 39.0312 57.8382 39.0312 57.0418V40.2559L42.9049 44.1596C43.1841 44.4411 43.5162 44.6645 43.8821 44.8169C44.248 44.9694 44.6405 45.0479 45.0369 45.0479C45.4333 45.0479 45.8258 44.9694 46.1917 44.8169C46.5577 44.6645 46.8898 44.4411 47.1689 44.1596C47.4504 43.8805 47.6738 43.5484 47.8262 43.1824C47.9787 42.8165 48.0572 42.424 48.0572 42.0276C48.0572 41.6312 47.9787 41.2387 47.8262 40.8728C47.6738 40.5069 47.4504 40.1747 47.1689 39.8956L38.1604 30.8871Z"
                fill="#0099AD" />
            </svg>
            <p>Silahkan pilih berkas anda</p>
            <label for="fileInputEvidence"
              class="flex flex-row items-center px-3 py-2 space-x-2 text-white duration-300 rounded-lg cursor-pointer bg-primaryColor hover:bg-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0">
              <IconFolder />
              <span class="font-semibold">Cari berkas</span>
            </label>
            <input ref="fileInputEvidence" id="fileInputEvidence" type="file" class="hidden"
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
          @click="isShowModalEvidence = false">Batal</button>
        <button
          class="px-3 py-2 font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
          @click="isShowFinalConfirmation = true">Simpan Kertas Kerja</button>
      </div>
    </div>
  </ModalWrapper>
  <ModalWrapper
    :show-modal="(storePerbaruiTab.currentTab === 'Opsi Simulasi' && statusDataFinansial === 'Simulasi') && (hasilSimulasi1.idMesin === 0)"
    :width="'w-[750px]'" :height="'h-auto'">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-row items-center justify-between">
        <p class="text-xl font-bold text-primaryTextColor">Unggah Simulasi 1</p>
      </div>
      <div class="flex flex-col space-y-3">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-col space-y-3">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-semibold text-labelColor">Unduh Simulasi 1 <span
                  class="font-semibold text-warningColor">*</span></p>
              <p class="text-xs text-textDisabledColor">Silahkan unduh simulasi 1</p>
            </div>
          </div>
          <button
            class="px-3 py-2 font-semibold duration-300 border rounded-lg border-primaryColor hover:border-hoverColor hover:text-white hover:bg-hoverColor text-primaryColor"
            @click="handleDownloadExcelSimulasi1">Unduh</button>
        </div>
        <div class="flex flex-col space-y-1">
          <div v-if="selectedFileSimulasi1">
            <p>{{ selectedFileSimulasi1.name }} ({{ globalFormat.formatBytes(selectedFileSimulasi1.size) }})</p>
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
            <input ref="fileInput" id="fileInput" type="file" class="hidden" @change="handleFileChangeSimulasi1"
              accept=".xlsx" />
          </div>
          <div class="flex flex-row items-center justify-between">
            <p class="text-xs text-textDisabledColor">Tipe File yang dapat diunggah .xlsx</p>
            <p class="text-xs text-textDisabledColor">Ukuran maksimal dokumen : 2 MB</p>
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-end space-x-3">
        <button
          class="px-3 py-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
          @click="selectedFileSimulasi1 = null">Reset</button>
        <button
          class="px-3 py-2 font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
          @click="uploadFileSimulasi1">Kirim</button>
      </div>
    </div>
  </ModalWrapper>
  <ModalWrapper :show-modal="isUnggahModalOpenSimulasi1" :width="'w-[750px]'" :height="'h-auto'"
    @on-escape="isUnggahModalOpenSimulasi1 = false">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-row items-center justify-between">
        <p class="text-xl font-bold text-primaryTextColor">Unggah Simulasi 1</p>
        <button @click="isUnggahModalOpenSimulasi1 = false">
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
              <p class="text-sm font-semibold text-labelColor">Unggah <span
                  class="font-semibold text-warningColor">*</span></p>
              <p class="text-xs text-textDisabledColor">Silahkan unggah Kertas Kerja anda</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <div v-if="selectedFileSimulasi1">
            <p>{{ selectedFileSimulasi1.name }} ({{ globalFormat.formatBytes(selectedFileSimulasi1.size) }})</p>
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
            <input ref="fileInput" id="fileInput" type="file" class="hidden" @change="handleFileChangeSimulasi1"
              accept=".xlsx" />
          </div>
          <div class="flex flex-row items-center justify-between">
            <p class="text-xs text-textDisabledColor">Tipe File yang dapat diunggah .xlsx</p>
            <p class="text-xs text-textDisabledColor">Ukuran maksimal dokumen : 2 MB</p>
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-end space-x-3">
        <button
          class="px-3 py-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
          @click="selectedFileSimulasi1 = null">Reset</button>
        <button
          class="px-3 py-2 font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
          @click="uploadFileSimulasi1">Kirim</button>
      </div>
    </div>
  </ModalWrapper>
  <ModalWrapper :show-modal="isUnggahModalOpen" :width="'w-[750px]'" :height="'h-auto'"
    @on-escape="isUnggahModalOpen = false">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-row items-center justify-between">
        <p class="text-xl font-bold text-primaryTextColor">Unggah Simulasi 2</p>
        <button @click="isUnggahModalOpen = false">
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
              <p class="text-sm font-semibold text-labelColor">Unggah <span
                  class="font-semibold text-warningColor">*</span></p>
              <p class="text-xs text-textDisabledColor">Silahkan unggah Kertas Kerja anda</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <div v-if="selectedFile">
            <p>{{ selectedFile.name }} ({{ globalFormat.formatBytes(selectedFile.size) }})</p>
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
            <p class="text-xs text-textDisabledColor">Ukuran maksimal dokumen : 2 MB</p>
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
  <div class="flex flex-col space-y-4" v-if="mesinDataById && simulasiAsumsiParameter">
    <InfoHeader :nama-mesin="mesinDataById.mesin" :nama-pengelola="namaPengelola"
      :kondisi-unit="mesinDataById.kondisi_unit" :kode-jenis-pembangkit="mesinDataById.kode_jenis_pembangkit"
      :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
      :tahun-operasi="mesinDataById.tahun_operasi.toString()" :umur-teknis="asumsiParameter.asumsiMakro.umurTeknis"
      :nama-pembina="namaPembina">
    </InfoHeader>
    <div class="items-start w-full max-w-full min-h-screen p-6 bg-white rounded-lg">
      <div v-if="approveMesinKK">
        <div v-auto-animate="{ duration: 300 }"
          v-if="approveMesinKK.status === 'Ditolak T1' || approveMesinKK.status === 'Ditolak T2'"
          class="p-2 -mt-1 mb-3 w-full bg-[#FFE5E6] border-2 border-[#FF5656] rounded-md">
          <div class="flex justify-between">
            <div class="flex space-x-0.5">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M11.0002 3.66536C6.95007 3.66536 3.66683 6.94861 3.66683 10.9987C3.66683 15.0488 6.95007 18.332 11.0002 18.332C15.0503 18.332 18.3335 15.0488 18.3335 10.9987C18.3335 6.94861 15.0503 3.66536 11.0002 3.66536ZM1.8335 10.9987C1.8335 5.93609 5.93755 1.83203 11.0002 1.83203C16.0628 1.83203 20.1668 5.93609 20.1668 10.9987C20.1668 16.0613 16.0628 20.1654 11.0002 20.1654C5.93755 20.1654 1.8335 16.0613 1.8335 10.9987ZM11.0002 7.33203C11.5064 7.33203 11.9168 7.74244 11.9168 8.2487V11.6862C11.9168 12.1925 11.5064 12.6029 11.0002 12.6029C10.4939 12.6029 10.0835 12.1925 10.0835 11.6862V8.2487C10.0835 7.74244 10.4939 7.33203 11.0002 7.33203ZM10.0835 14.4362C10.0835 13.9299 10.4939 13.5195 11.0002 13.5195H11.007C11.5133 13.5195 11.9237 13.9299 11.9237 14.4362V14.4431C11.9237 14.9493 11.5133 15.3597 11.007 15.3597H11.0002C10.4939 15.3597 10.0835 14.9493 10.0835 14.4431V14.4362Z"
                  fill="#FF5656" />
              </svg>
              <p class="font-semibold" v-if="approveMesinKK.status === 'Ditolak T1'">Ditolak Unit Pembina</p>
              <p class="font-semibold" v-else-if="approveMesinKK.status === 'Ditolak T2'">Ditolak Unit Pengelola</p>
            </div>
            <div class="cursor-pointer" @click="isShowRejected = !isShowRejected">
              <svg v-if="isShowRejected" width="20" height="20" viewBox="0 0 20 20" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
                  fill="#FF5656" />
              </svg>
              <svg v-if="!isShowRejected" width="20" height="20" viewBox="0 0 20 20" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M14.7071 12.7071C14.3166 13.0976 13.6834 13.0976 13.2929 12.7071L10 9.41421L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071Z"
                  fill="#FF5656" />
              </svg>
            </div>
          </div>
          <p v-if="isShowRejected && approveMesinKK" class="mt-2 ml-6 text-sm capitalize">{{ approveMesinKK.keterangan
            }}</p>
        </div>
      </div>
      <TabsWrapper :laman-data="false" class="w-full">
        <TabItem title="Asumsi Makro">
          <TabAsumsiMakro :error="error.asumsi" :is-permanent="isPermanent" :tahun-realisasi="tahunBerjalan"
            :mesin="mesinDataById.mesin" v-model:interest-rate="asumsiParameter.asumsiMakro.interestRate"
            v-model:umur-teknis="asumsiParameter.asumsiMakro.umurTeknis"
            v-model:loan-tenor="asumsiParameter.asumsiMakro.loanTenor"
            v-model:loan-portion="asumsiParameter.asumsiMakro.loanPortion" :init-value="{
              interestRate: asumsiParameterInit.asumsiMakro.interestRate,
              umurTeknis: masaManfaat.toString(),
              loanTenor: asumsiParameterInit.asumsiMakro.loanTenor,
              loanPortion: asumsiParameterInit.asumsiMakro.loanPortion
            }" :kode-pengelola="kodePengelola" :is-integrasi="isIntegrasi" />
        </TabItem>
        <TabItem title="Parameter Teknis & Finansial">
          <TabParameterTeknis :is-integrasi="isIntegrasi" :is-permanent="isPermanent"
            :combo-bahan-bakar="comboBahanBakar" :init-auxiliary="asumsiParameter.parameterTeknis.auxiliary"
            :init-susut-trafo="asumsiParameter.parameterTeknis.susutTrafo"
            :init-pemakaian-sendiri="asumsiParameter.parameterTeknis.pemakaianSendiri" :error="error.parameter"
            @on-change="handleChange" @on-hapus-bahan-bakar="handleHapusBahanBakar"
            @on-tambah-bahan-bakar="handleTambahBahanBakar" :tahun-realisasi="tahunBerjalan"
            :is-input-asumsi-parameter="false" :mesin="mesinDataById.mesin" :kode-pengelola="kodePengelola"
            v-model:nphr="asumsiParameter.parameterTeknis.nphr"
            v-model:auxiliary="asumsiParameter.parameterTeknis.auxiliary"
            v-model:susut-trafo="asumsiParameter.parameterTeknis.susutTrafo"
            v-model:pemakaian-sendiri="asumsiParameter.parameterTeknis.pemakaianSendiri"
            v-model:electricity-price-a="asumsiParameter.parameterTeknis.electricityPriceA"
            v-model:electricity-price-b="asumsiParameter.parameterTeknis.electricityPriceB"
            v-model:electricity-price-c="asumsiParameter.parameterTeknis.electricityPriceC"
            v-model:electricity-price-d="asumsiParameter.parameterTeknis.electricityPriceD"
            v-model:checkedBahanBakar="checkedBahanBakar" v-model:picked-value="pickedParameterValue"
            v-model:bahan-bakars="bahanBakarGroup.bahanBakars" :init-value="{
              nphr: asumsiParameterInit.parameterTeknis.nphr,
              auxiliary: asumsiParameterInit.parameterTeknis.auxiliary,
              susutTrafo: asumsiParameterInit.parameterTeknis.susutTrafo,
              pemakaianSendiri: asumsiParameterInit.parameterTeknis.pemakaianSendiri,
              electricityPriceA: asumsiParameterInit.parameterTeknis.electricityPriceA,
              electricityPriceB: asumsiParameterInit.parameterTeknis.electricityPriceB,
              electricityPriceC: asumsiParameterInit.parameterTeknis.electricityPriceC,
              electricityPriceD: asumsiParameterInit.parameterTeknis.electricityPriceD
            }" />
        </TabItem>
        <TabItem title="Data Teknis">
          <TabDataTeknis :is-integrasi="isIntegrasi" :combo-bahan-bakar="comboBahanBakar" :error="error.teknis"
            :is-permanent="isPermanent" :tahun-realisasi="tahunBerjalan" :mesin="mesinDataById.mesin"
            :combo-type-periodic="comboTypePeriodic" v-model:type-periodic="typePeriodic" v-model:ncf="ncf"
            v-model:eaf="eaf" v-model:production-brutto="productionBrutto" v-model:production-netto="productionNetto"
            v-model:energy-sales="energySales" v-model:fuel-consumption="bahanBakarGroup.fuelConsumption"
            :kode-pengelola="kodePengelola" :init-value="{
              typePeriodic: dataTeknisInit.typePeriodic,
              ncf: dataTeknisInit.ncf,
              eaf: dataTeknisInit.eaf,
              productionBrutto: dataTeknisInit.productionBrutto,
              productionNetto: dataTeknisInit.productionNetto,
              energySales: dataTeknisInit.energySales,
              // fuelConsumption: dataTeknisInit.fuelConsumption
            }" />
        </TabItem>
        <TabItem title="Data Finansial">
          <TabDataFinansial :is-integrasi="isIntegrasi" :tahun="(tahunBerjalan).toString()"
            :combo-bahan-bakar="comboBahanBakar" :mesin="mesinDataById.mesin" :is-permanent="isPermanent"
            :kode-pengelola="kodePengelola" :data-finansial-init="dataFinansialInit" :error="error.finansial"
            :is-audited="isAudited" v-model:picked="picked" v-model:cost-component-a="costComponentA"
            v-model:cost-component-b="costComponentB" v-model:biaya-kepegawaian="biayaKepegawaian"
            v-model:biaya-pemeliharaan-rutin="biayaPemeliharaanRutin"
            v-model:biaya-administrasi-umum="biayaAdministrasiUmum"
            v-model:biaya-pembelian-tenaga-listrik="biayaPembelianTenagaListrik" v-model:biaya-lain-lain="biayaLainLain"
            v-model:o-m-cost="oMCost" v-model:periodic-maintenance-cost="periodicMaintenanceCost"
            v-model:cost-component-c="costComponentC" v-model:cost-component-c-detail="bahanBakarGroup.costCDetail"
            v-model:cost-component-d="costComponentD" v-model:biaya-minyak-pelumas="biayaMinyakPelumas"
            v-model:bahan-kimia="bahanKimia" v-model:total-revenue="totalRevenue" v-model:revenue-komp-a="revenueKompA"
            v-model:revenue-komp-b="revenueKompB" v-model:revenue-komp-c="revenueKompC"
            v-model:revenue-komp-d="revenueKompD" @on-save="handleSubmit" />
        </TabItem>
        <TabItem :title="'Opsi Simulasi'" class="w-full">
          <div class="flex flex-col w-full space-y-5" v-if="statusDataFinansial === 'Simulasi'">
            <div class="flex w-full space-x-5 ">
              <aside class="w-[15%] max-w-fit mt-6">
                <ul class="w-40 space-y-10 text-sm text-textDisabledColor">
                  <li id="aside"
                    class="flex flex-row items-center justify-between duration-300 cursor-pointer hover:text-primaryColor"
                    :class="{ selected: selectedAside === 'Asumsi Makro' }" @click="selectedAside = 'Asumsi Makro'">
                    <h2>
                      Asumsi Makro
                    </h2>
                    <div id="triangle"></div>
                  </li>
                  <li id="aside"
                    class="flex flex-row items-center justify-between whitespace-pre-line duration-300 cursor-pointer hover:text-primaryColor"
                    :class="{ selected: selectedAside === 'Parameter Teknis' }"
                    @click="selectedAside = 'Parameter Teknis'">
                    <h2>
                      Parameter Teknis & Finansial
                    </h2>
                    <div id="triangle"></div>
                  </li>
                  <li id="aside"
                    class="flex flex-row items-center justify-between duration-300 cursor-pointer hover:text-primaryColor"
                    :class="{ selected: selectedAside === 'Data Teknis' }" @click="selectedAside = 'Data Teknis'">
                    <h2>
                      Data Teknis
                    </h2>
                    <div id="triangle"></div>
                  </li>
                  <li id="aside"
                    class="flex flex-row items-center justify-between duration-300 cursor-pointer hover:text-primaryColor"
                    :class="{ selected: selectedAside === 'Data Finansial' }" @click="selectedAside = 'Data Finansial'">
                    <h2>
                      Data Finansial
                    </h2>
                    <div id="triangle"></div>
                  </li>
                  <li id="aside"
                    class="flex flex-row items-center justify-between duration-300 cursor-pointer hover:text-primaryColor"
                    :class="{ selected: selectedAside === 'Hasil Simulasi' }" @click="selectedAside = 'Hasil Simulasi'"
                    v-if="(hasilSimulasi1.idMesin !== 0 ? true : false) || (hasilSimulasi2.idMesin !== 0 ? true : false)">
                    <h2>
                      Hasil Simulasi
                    </h2>
                    <div id="triangle"></div>
                  </li>
                </ul>
              </aside>
              <div
                class="flex flex-col space-y-3.5 2xl:w-[88%] 3xl:w-[90%] w-[87%] 4xl:w-[91.5%] 5xl:w-[94%] 6xl:w-[96%] 7xl:w-full">
                <nav class="w-full bg-primaryColor bg-opacity-5 p-1.5 rounded-lg">
                  <ul class="table w-full text-sm text-center text-primaryColor border-spacing-x-3">
                    <li id="tab"
                      class="table-cell py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                      :class="{ selected: selectedSimulasiTab === 'Simulasi 1' }"
                      @click="selectedSimulasiTab = 'Simulasi 1'">
                      Simulasi 1</li>
                    <li id="tab"
                      class="table-cell py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                      :class="{ selected: selectedSimulasiTab === 'Simulasi 2' }"
                      @click="selectedSimulasiTab = 'Simulasi 2'">Simulasi 2
                    </li>
                  </ul>
                </nav>
                <section class="w-full mt-2 space-y-3.5" v-if="selectedAside === 'Asumsi Makro'">
                  <div v-if="selectedSimulasiTab === 'Simulasi 1'" class="flex flex-col space-y-3.5">
                    <InfoComponent simulasi="Simulasi 1" proyeksi="Proyeksi Sebelumnya" />
                    <div class="flex flex-row items-center justify-between">
                      <h1 class="text-lg font-semibold">Simulasi - Asumsi Makro</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpenSimulasi1 = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi1">Unduh</button>
                      </div>
                    </div>
                    <AsumsiInfoBox :simulasi-asumsi-makro="simulasiAsumsiParameter.asumsi_makro"
                      :periode="tahunUpdate" />
                  </div>
                  <div v-if="selectedSimulasiTab === 'Simulasi 2'" class="flex flex-col space-y-3.5">
                    <div class="flex flex-row items-center justify-between">
                      <h1 class="text-lg font-semibold">Simulasi - Asumsi Makro</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpen = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi2">Unduh</button>
                      </div>
                    </div>
                    <AsumsiInfoBox :simulasi-asumsi-makro="simulasiAsumsiParameter.asumsi_makro"
                      :periode="tahunUpdate" />
                  </div>
                </section>
                <section class="w-full mt-2 space-y-3.5" v-if="selectedAside === 'Parameter Teknis'">
                  <div v-if="selectedSimulasiTab === 'Simulasi 1'" class="flex flex-col space-y-3.5">
                    <InfoComponent simulasi="Simulasi 1" proyeksi="Proyeksi Sebelumnya" />
                    <div class="flex flex-row items-center justify-between">
                      <h1 class="text-lg font-semibold">Simulasi - Parameter Teknis & Finansial</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpenSimulasi1 = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi1">Unduh</button>
                      </div>
                    </div>
                    <ParameterTeknisInfoBox :combo-bahan-bakar="comboBahanBakar"
                      :parameter-teknis="simulasiAsumsiParameter.parameter_teknis_financial"
                      :bahan-bakars="simulasiAsumsiParameter.harga_bahan_bakars" :periode="tahunUpdate" />
                  </div>
                  <div v-if="selectedSimulasiTab === 'Simulasi 2'" class="flex flex-col space-y-3.5">
                    <div class="flex flex-row items-center justify-between">
                      <h1 class="text-lg font-semibold">Simulasi - Parameter Teknis & Finansial</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpen = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi2">Unduh</button>
                      </div>
                    </div>
                    <ParameterTeknisInfoBox :combo-bahan-bakar="comboBahanBakar"
                      :parameter-teknis="simulasiAsumsiParameter.parameter_teknis_financial"
                      :bahan-bakars="simulasiAsumsiParameter.harga_bahan_bakars" :periode="tahunUpdate" />
                  </div>
                </section>
                <section class="w-full overflow-clip mt-2 space-y-3.5" v-if="selectedAside === 'Data Teknis'">
                  <div v-if="selectedSimulasiTab === 'Simulasi 1'" class="flex flex-col space-y-3.5 w-full">
                    <InfoComponent simulasi="Simulasi 1" proyeksi="Proyeksi Sebelumnya" />
                    <div class="flex items-center justify-between w-full">
                      <h1 class="text-lg font-semibold">Simulasi - Data Teknis</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpenSimulasi1 = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi1">Unduh</button>
                      </div>
                    </div>
                    <TableDataTeknis v-if="simulasi1DataTeknis" :data-teknis="simulasi1DataTeknis"
                      :tahun-terakhir-realisasi="tahunBerjalan" :type-periodic="listTypePeriodic" />
                  </div>
                  <div v-if="selectedSimulasiTab === 'Simulasi 2'" class="flex flex-col space-y-3.5 w-full">
                    <div class="flex items-center justify-between w-full">
                      <h1 class="text-lg font-semibold">Simulasi - Data Teknis</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpen = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi2">Unduh</button>
                      </div>
                    </div>
                    <TableDataTeknis v-if="simulasi2DataTeknis" :data-teknis="simulasi2DataTeknis"
                      :tahun-terakhir-realisasi="tahunBerjalan" :type-periodic="listTypePeriodic" />
                  </div>
                </section>
                <section class="w-full overflow-clip mt-2 space-y-3.5" v-if="selectedAside === 'Data Finansial'">
                  <div v-if="selectedSimulasiTab === 'Simulasi 1'" class="flex flex-col space-y-3.5 w-full">
                    <InfoComponent simulasi="Simulasi 1" proyeksi="Proyeksi Sebelumnya" />
                    <div class="flex items-center justify-between w-full">
                      <h1 class="text-lg font-semibold">Simulasi - Data Finansial</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpenSimulasi1 = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi1">Unduh</button>
                      </div>
                    </div>
                    <TableDataFinansial v-if="dataFinansialSimulasi1" :source="simulasi1DataFinansial"
                      :data-finansial="dataFinansialSimulasi1" :tahun-terakhir-realisasi="tahunBerjalan" />
                  </div>
                  <div v-if="selectedSimulasiTab === 'Simulasi 2'" class="flex flex-col space-y-3.5 w-full">
                    <div class="flex items-center justify-between w-full">
                      <h1 class="text-lg font-semibold">Simulasi - Data Finansial</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpen = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi2">Unduh</button>
                      </div>
                    </div>
                    <TableDataFinansial v-if="dataFinansialSimulasi2" :source="simulasi2DataFinansial"
                      :data-finansial="dataFinansialSimulasi2" :tahun-terakhir-realisasi="tahunBerjalan" />
                  </div>
                </section>
                <section class="w-full overflow-clip mt-2 space-y-3.5" v-if="selectedAside === 'Hasil Simulasi'">
                  <div v-if="selectedSimulasiTab === 'Simulasi 1'" class="flex flex-col space-y-3.5">
                    <InfoComponent simulasi="Simulasi 1" proyeksi="Proyeksi Sebelumnya" />
                    <div class="flex items-center justify-between w-full">
                      <h1 class="text-lg font-semibold">Simulasi - Hasil Simulasi</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpenSimulasi1 = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi1">Unduh</button>
                      </div>
                    </div>
                    <nav class="rounded-md bg-primaryColor bg-opacity-5">
                      <ul class="table w-full text-sm text-center text-primaryColor border-spacing-x-5">
                        <li id="tab"
                          class="table-cell w-1/2 py-2 font-semibold rounded-md cursor-pointer outline-1 outline outline-primaryColor active:bg-primaryColor active:bg-opacity-10">
                          COD - Akhir Masa Manfaat
                        </li>
                      </ul>
                    </nav>
                    <AkhirMasaManfaat :irr-on-project="hasilSimulasi1.trackIrrProject"
                      :irr-on-equity="hasilSimulasi1.trackIrrEquity" :npv-on-equity="hasilSimulasi1.trackNpvEquity ?? 0"
                      :npv-on-project="hasilSimulasi1.trackNpvProject ?? 0"
                      :average-ncf="hasilSimulasi1.trackAverageNcf ?? 0"
                      :average-eaf="hasilSimulasi1.trackAverageEaf ?? 0" />
                  </div>
                  <div v-if="selectedSimulasiTab === 'Simulasi 2'" class="flex flex-col space-y-3.5">
                    <div class="flex items-center justify-between w-full">
                      <h1 class="text-lg font-semibold">Simulasi - Hasil Simulasi</h1>
                      <div class="flex flex-row space-x-3">
                        <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                          @click="isUnggahModalOpen = true">Unggah</button>
                        <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                          @click="handleDownloadExcelSimulasi2">Unduh</button>
                      </div>
                    </div>
                    <nav class="rounded-md bg-primaryColor bg-opacity-5">
                      <ul class="table w-full text-sm text-center text-primaryColor border-spacing-x-5">
                        <li id="tab"
                          class="table-cell w-1/2 py-2 font-semibold rounded-md cursor-pointer outline-1 outline outline-primaryColor active:bg-primaryColor active:bg-opacity-10">
                          COD - Akhir Masa Manfaat
                        </li>
                      </ul>
                    </nav>
                    <AkhirMasaManfaat :irr-on-project="hasilSimulasi2.trackIrrProject"
                      :irr-on-equity="hasilSimulasi2.trackIrrEquity" :npv-on-equity="hasilSimulasi2.trackNpvEquity ?? 0"
                      :npv-on-project="hasilSimulasi2.trackNpvProject ?? 0"
                      :average-ncf="hasilSimulasi2.trackAverageNcf ?? 0"
                      :average-eaf="hasilSimulasi2.trackAverageEaf ?? 0" />
                  </div>
                </section>
              </div>
            </div>
            <nav class="flex flex-row items-center justify-end space-x-3">
              <!-- <button type="submit"
                class="px-3 py-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor">Lihat
                Grafik
              </button> -->
              <button
                class="px-3 py-2 font-semibold text-white duration-300 rounded-lg bg-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor"
                @click="isShowModalEvidence = true"
                v-if="(hasilSimulasi1.trackNpvEquity !== 0 && hasilSimulasi1.trackNpvProject !== 0) && (hasilSimulasi2.trackNpvEquity !== 0 && hasilSimulasi2.trackNpvProject !== 0)">
                Pilih & Simpan
              </button>
            </nav>
          </div>
          <div class="flex flex-col items-center justify-center mt-48" v-else>
            <div class="flex flex-col space-y-2">
              <Vue3Lottie :animationData="errorJsonData" style="width: 180px; height: 180px;" :loop="0" />
              <div class="flex flex-col items-center space-y-0.5">
                <p class="text-lg font-semibold">Menu Terkunci</p>
                <p class="text-md">Mohon kirim data yang ingin diperbarui terlebih dahulu</p>
              </div>
            </div>
          </div>
        </TabItem>
      </TabsWrapper>
    </div>
  </div>
  <div v-else-if="isLoading === false && !mesinDataById && !asumsiParameter">Tidak bisa menampilkan data</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed, watchEffect } from "vue";
import { encryptStorage, encryptedUserInfo } from "@/utils/app-encrypt-storage";
import { notifyError } from "@/services/helper/toast-notification";
import { usePerbaruiTabStore } from "@/store/storeRekapKertasKerja";
const storePerbaruiTab = usePerbaruiTabStore();
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import PerbaruiDataService from "@/services/perbarui-data";
const perbaruiDataService = new PerbaruiDataService();
import GlobalFormat from '@/services/format/global-format'
const globalFormat = new GlobalFormat();
import UserService from "@/services/user-service";
const userService = new UserService();
import AuthService from "@/services/auth-service";
const authService = new AuthService();
import RekapService from "@/services/rekap-service";
const rekapService = new RekapService();
import PersetujuanService from "@/services/persetujuan-service";
const persetujuanService = new PersetujuanService();
import TabAsumsiMakro from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabAsumsiMakro.vue";
import TabParameterTeknis from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabParameterTeknis.vue";
import TabDataTeknis from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabDataTeknis.vue";
import TabDataFinansial from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabDataFinansial.vue";
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import InfoHeader from '@/components/ui/InfoHeader.vue';
import InfoComponent from "@/views/Data/RekapKertasKerja/PerbaruiData/InfoComponent.vue";
import AsumsiInfoBox from "@/views/Data/RekapKertasKerja/PerbaruiData/AsumsiInfoBox.vue";
import ParameterTeknisInfoBox from "@/views/Data/RekapKertasKerja/PerbaruiData/ParameterTeknisInfoBox.vue";
import errorJsonData from '@/assets/lottie/error.json';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import ModalNotification from '@/components/ui/ModalNotification.vue';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.vue';
import axios from "axios";
import IconFolder from "@/components/icons/IconFolder.vue";
import IconFolderBlue from "@/components/icons/IconFolderBlue.vue";
import successJsonData from "@/assets/lottie/success.json";
import TableDataTeknis from "@/components/RekapKertasKerja/TableDataTeknis.vue";
import TableDataFinansial from "@/components/RekapKertasKerja/TableDataFinansial.vue";
import AkhirMasaManfaat from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue";

const nodeMode = import.meta.env.MODE;
const idMesin = parseInt(nodeMode === 'production' ? encryptStorage.decryptValue(route.params.id.toString()) : route.params.id.toString());
const mesinDataById = ref<MesinItem>();
const tahunTerakhirRealisasi = ref<number>(0);
const tahunTerakhirAsumsi = ref<number>(0);
const tahunUpdate = ref<number>(0);
const tahunBerjalan = new Date().getFullYear();
const kodeMesin = ref();
const isPermanent = ref<boolean>(false);
const jenisPembangkit = ref();
const approveMesinKK = ref<any>();
const statusMesin = ref<string>('');
const namaPengelola = ref<string>('');
const namaPembina = ref<string>('');
const comboTypePeriodic = ref<ComboTypePeriodicItem[]>([]);
const isLoading = ref(true);
const selectedAside = ref<String>('Asumsi Makro');
const selectedSimulasiTab = ref<String>('Simulasi 1');
const isShowModalNotification = ref(false);
const isSuccess = ref(false);
const picked = ref('pisah');
const kodePengelola = ref<string>('');
const pickedParameterValue = ref<string>('auxiliarySusut');
const masaManfaat = ref<any>();
const isFinalSubmitSuccess = ref<boolean>(false);
const isSuccessSimulasi = ref<boolean>(false);
const isSuccessPermanent = ref<boolean>(false);
const isShowModalEvidence = ref<boolean>(false);
const isSuccessEvidence = ref<boolean>(false);
const idSentral = ref<string>('');
const isShowFinalConfirmation = ref<boolean>(false);
const isShowRejected = ref<boolean>(true);
const isIntegrasi = ref<boolean>(false);
// Tab Asumsi Makro & Parameter Teknis Model
const statusAsumsi = ref<string>('');
const idAsumsi = ref<number>(0);
const asumsiParameter = ref<{
  asumsiMakro: {
    interestRate: string,
    umurTeknis: string,
    loanTenor: string,
    loanPortion: string,
    totalProjectCost: string,
    dayaMampuNettoMW: string
  },
  parameterTeknis: {
    nphr: string,
    auxiliary: string,
    susutTrafo: string,
    pemakaianSendiri: string,
    electricityPriceA: string,
    electricityPriceB: string,
    electricityPriceC: string,
    electricityPriceD: string,
  }
}>({
  asumsiMakro: {
    interestRate: '',
    umurTeknis: '',
    loanTenor: '',
    loanPortion: '',
    totalProjectCost: '',
    dayaMampuNettoMW: ''
  },
  parameterTeknis: {
    nphr: '',
    auxiliary: '',
    susutTrafo: '',
    pemakaianSendiri: '',
    electricityPriceA: '',
    electricityPriceB: '',
    electricityPriceC: '',
    electricityPriceD: '',
  }
});
const asumsiParameterInit = ref<{
  asumsiMakro: {
    interestRate: string,
    umurTeknis: string,
    loanTenor: string,
    loanPortion: string
  },
  parameterTeknis: {
    nphr: string,
    auxiliary: string,
    susutTrafo: string,
    pemakaianSendiri: string,
    electricityPriceA: string,
    electricityPriceB: string,
    electricityPriceC: string,
    electricityPriceD: string,
  }
}>({
  asumsiMakro: {
    interestRate: '',
    umurTeknis: '',
    loanTenor: '',
    loanPortion: ''
  },
  parameterTeknis: {
    nphr: '',
    auxiliary: '',
    susutTrafo: '',
    pemakaianSendiri: '',
    electricityPriceA: '',
    electricityPriceB: '',
    electricityPriceC: '',
    electricityPriceD: '',
  }
});
const i = ref(1);
const bahanBakarGroup = ref<{
  bahanBakars: any[],
  fuelConsumption: any[],
  costCDetail: any[]
}>({
  bahanBakars: [],
  fuelConsumption: [],
  costCDetail: []
});
// Tab Parameter Teknis & Finansial Model
const comboBahanBakar = ref<any[]>([]);
const checkedBahanBakar = ref<number[]>([]);
// Tab Data Teknis
const typePeriodic = ref<string | number>('');
const listTypePeriodic = ref<any[]>([]);
const ncf = ref();
const eaf = ref();
const productionBrutto = ref();
const productionNetto = ref();
const energySales = ref();
const fuelConsumption = ref<any[]>([]);
const dataTeknisByPeriode = ref();
const bahanBakars = ref<any[]>([]);
const statusDataTeknis = ref<string>('');
const dataTeknisSimulasi1 = ref();
const dataTeknisSimulasi2 = ref();
const dataTeknisInit = ref<{
  typePeriodic: string | number,
  ncf: string,
  eaf: string,
  productionBrutto: string,
  productionNetto: string,
  energySales: string,
  // fuelConsumption: string
}>({
  typePeriodic: '',
  ncf: '',
  eaf: '',
  productionBrutto: '',
  productionNetto: '',
  energySales: '',
  // fuelConsumption: ''
});
// Tab Data Finansial
const dataFinansialDetail = ref();
const biayaKepegawaian = ref('');
const costComponentA = ref('');
const costComponentADetail = ref<any[]>([]);
const costComponentB = ref(picked.value === 'pisah' ? '' : '');
const biayaPemeliharaanRutin = ref('');
const biayaAdministrasiUmum = ref('');
const biayaPembelianTenagaListrik = ref('');
const biayaLainLain = ref('');
const oMCost = ref('');
const periodicMaintenanceCost = ref('');
const costComponentC = ref('');
const biayaMinyakPelumas = ref('');
const bahanKimia = ref('');
const statusDataFinansial = ref<string>('');
const costComponentD = ref('');
const totalRevenue = ref<string>('');
const revenueKompA = ref<string>('');
const revenueKompB = ref<string>('');
const revenueKompC = ref<string>('');
const revenueKompD = ref<string>('');
const isAudited = ref<boolean>(false);
// const totalRevenue = computed(() => {
//   const valueToFormat = parseFloat(revenueKompA.value.replace(/[.]/g, '')) + parseFloat(revenueKompB.value.replace(/[.]/g, '')) + parseFloat(revenueKompC.value.replace(/[.]/g, '')) + parseFloat(revenueKompD.value.replace(/[.]/g, ''));
//   return globalFormat.formatCurrencyNotFixed(valueToFormat);
// }
// );
const formFinansialSimulasi1 = ref();
const formFinansialSimulasi2 = ref();
const dataFinansialInit = ref<{
  costComponentA: string,
  biayaPeriodicMaintenance: string,
  costComponentB: string,
  oMCost: string,
  periodicMaintenanceCost: string,
  biayaKepegawaian: string,
  biayaPemeliharaanRutin: string,
  biayaAdministrasiUmum: string,
  biayaPembelianTenagaListrik: string,
  biayaLainLain: string,
  costComponentC: string,
  costComponentCDetail: string,
  costComponentD: string,
  biayaMinyakPelumas: string,
  biayaBahanKimia: string
}>({
  costComponentA: '',
  biayaPeriodicMaintenance: '',
  costComponentB: '',
  oMCost: '',
  periodicMaintenanceCost: '',
  biayaKepegawaian: '',
  biayaPemeliharaanRutin: '',
  biayaAdministrasiUmum: '',
  biayaPembelianTenagaListrik: '',
  biayaLainLain: '',
  costComponentC: '',
  costComponentCDetail: '',
  costComponentD: '',
  biayaMinyakPelumas: '',
  biayaBahanKimia: ''
});
// Tab Opsi Simulasi
const simulasiAsumsiParameter = ref();
const simulasi1DataTeknis = ref();
const simulasi2DataTeknis = ref();
const dataFinansialSimulasi1 = ref();
const simulasi1DataFinansial = ref<any[]>([]);
const dataFinansialSimulasi2 = ref();
const simulasi2DataFinansial = ref<any[]>([]);
const isRowTabOpenSimulasi1 = ref<number[]>([]);
const isRowTabOpenSimulasi2 = ref<number[]>([]);
const hasilSimulasi1 = ref<{
  idMesin: number | null
  trackIrrProject: number | string
  trackIrrEquity: number | string
  trackNpvProject: number | null
  trackNpvEquity: number | null
  trackAverageEaf: number | null
  trackAverageNcf: number | null
}>({
  idMesin: 0,
  trackIrrProject: '',
  trackIrrEquity: '',
  trackNpvProject: null,
  trackNpvEquity: null,
  trackAverageEaf: null,
  trackAverageNcf: null
});
const hasilSimulasi2 = ref<{
  idMesin: number | null
  trackIrrProject: number | string
  trackIrrEquity: number | string
  trackNpvProject: number | null
  trackNpvEquity: number | null
  trackAverageEaf: number | null
  trackAverageNcf: number | null
}>({
  idMesin: 0,
  trackIrrProject: '',
  trackIrrEquity: '',
  trackNpvProject: null,
  trackNpvEquity: null,
  trackAverageEaf: null,
  trackAverageNcf: null
});
const selectedFileSimulasi1: any = ref(null);
const isUnggahModalOpenSimulasi1 = ref<boolean>(false);
const isUnggahModalOpen = ref(false);
const selectedFile: any = ref(null);
const selectedFileEvidence: any = ref(null);
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
  },
  teknis: {
    periodicMaintenance: boolean,
    ncf: boolean,
    eaf: boolean,
    productionBrutto: boolean,
    productionNetto: boolean,
    energySales: boolean,
    fuelConsumption: boolean
  },
  finansial: {
    costComponentA: boolean,
    biayaInvestasiTambahan: boolean,
    biayaPeriodicMaintenance: boolean,
    biayaInvestasiAiAki: boolean,
    costComponentB: boolean,
    oMCost: boolean,
    periodicMaintenanceCost: boolean,
    biayaKepegawaian: boolean,
    biayaPemeliharaanRutin: boolean,
    biayaAdministrasiUmum: boolean,
    biayaPembelianTenagaListrik: boolean,
    biayaLainLain: boolean,
    costComponentC: boolean,
    costComponentCDetail: boolean,
    costComponentD: boolean,
    biayaMinyakPelumas: boolean,
    biayaBahanKimia: boolean,
    totalRevenue: boolean,
    revenueKompA: boolean,
    revenueKompB: boolean,
    revenueKompC: boolean,
    revenueKompD: boolean
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
  },
  teknis: {
    periodicMaintenance: false,
    ncf: false,
    eaf: false,
    productionBrutto: false,
    productionNetto: false,
    energySales: false,
    fuelConsumption: false
  },
  finansial: {
    costComponentA: false,
    biayaInvestasiTambahan: false,
    biayaPeriodicMaintenance: false,
    biayaInvestasiAiAki: false,
    costComponentB: false,
    oMCost: false,
    periodicMaintenanceCost: false,
    biayaKepegawaian: false,
    biayaPemeliharaanRutin: false,
    biayaAdministrasiUmum: false,
    biayaPembelianTenagaListrik: false,
    biayaLainLain: false,
    costComponentC: false,
    costComponentCDetail: false,
    costComponentD: false,
    biayaMinyakPelumas: false,
    biayaBahanKimia: false,
    totalRevenue: false,
    revenueKompA: false,
    revenueKompB: false,
    revenueKompC: false,
    revenueKompD: false
  }
});

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
  tahun_realisasi: string
  masa_manfaat: number
}
interface AsumsiParameterItem {
  data: any
  id_asumsi: number
  id_mesin: number
  kode_mesin: string
  status: string
  asumsi_makro: AsumsiMakroItem
  parameter_teknis_financial: ParameterTeknisFinancialItem
}
interface AsumsiMakroItem {
  corporate_tax_rate: number
  discount_rate: number
  interest_rate: number
  loan_tenor: number
  loan_portion: number
  equity: number
  umur_teknis: number
}
interface ParameterTeknisFinancialItem {
  daya_terpasang: number
  daya_mampu_netto_mw: number
  auxiliary: number
  susut_trafo: number
  ps: number
  total_project_cost: number
  load: number
  equity: number
  electricity_price_a_rp_per_kwbln: number
  electricity_price_b_rp_per_kwbln: number
  electricity_price_c_rp_per_kwh: number
  electricity_price_d_rp_per_kwh: number
}
interface DataTeknisItem {
  data: any
  tahun: any
  detail: any
}
interface ComboTypePeriodicItem {
  data: any
}
const fetchMesinById = async () => {
  try {
    const response: MesinItem = await perbaruiDataService.getMesinById(
      idMesin
    );
    mesinDataById.value = response.data;
    kodeMesin.value = response.data.kode_mesin;
    masaManfaat.value = response.data.masa_manfaat;
    jenisPembangkit.value = response.data.kode_jenis_pembangkit;
    tahunTerakhirRealisasi.value = parseInt(response.data.tahun_realisasi);
    tahunTerakhirAsumsi.value = parseInt(response.data.tahun_asumsi);
    tahunUpdate.value = parseInt(response.data.tahun_realisasi) + 1;
  } catch (error) {
    console.error("Fetch Mesin By Id Error : " + error);
  }
};
const fetchListPembina = async () => {
  try {
    const response: any = await userService.getPembina('');
    return response.data;
  } catch (error) {
    console.error('Fetch Pembina Error : ' + error)
  }
}
const fetchCheckIntegrasi = async () => {
  try {
    const response: any = await perbaruiDataService.getCheckIntegrasi(tahunTerakhirRealisasi.value, idMesin);
    isIntegrasi.value = response.data[0].status_data_integrasi === "0" ? false : true;
    console.log(isIntegrasi.value, 'dds');
  } catch (error) {
    console.error('Fetch Check Integrasi Error : ' + error)
  }
}
const fetchUnitPengelola = async () => {
  try {
    if (mesinDataById.value) {
      const kodeSentral = mesinDataById.value.kode_sentral;
      const pembangkitResponse: any =
        await perbaruiDataService.getPembangkitByKode(kodeSentral);
      kodePengelola.value = pembangkitResponse.data.kode_pengelola;
      idSentral.value = pembangkitResponse.data.id_sentral;
      const pengelolaResponse: any =
        await perbaruiDataService.getPengelolaData();
      const pengelola = pengelolaResponse.data.filter(
        (pengelola: any) => pengelola.kode_pengelola === kodePengelola.value
      );
      namaPengelola.value = pengelola[0].pengelola;
      const idPembina = pembangkitResponse.data.id_pembina;
      const pembinaList: any = await fetchListPembina();
      namaPembina.value = pembinaList.find((pembina: any) => pembina.id_pembina === idPembina).pembina;
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : " + error);
  }
};
const fetchPersetujuanKK = async () => {
  try {
    const response: any = await persetujuanService.getPersetujuanKKSentral({
      id_sentral: idSentral.value,
      tahun: tahunBerjalan
    });
    approveMesinKK.value = response.data.mesins.filter((val: any) => val.id_mesin == idMesin)[0];
    statusMesin.value = approveMesinKK.value.id_status;
  } catch (error) {
    console.error('Fetch Persetujuan KK Sentral Error : ' + error);
  }
}
const fetchAsumsiParameter = async () => {
  try {
    const response: AsumsiParameterItem =
      await perbaruiDataService.getAsumsiParameterData(
        tahunBerjalan - 1,
        idMesin,
        tahunBerjalan
      );
    const tempBahanBakars = response.data.harga_bahan_bakars.map((value: any) => {
      const newValue = { ...value };
      newValue.id = i.value++;
      newValue.harga_bahan_bakar = globalFormat.formatCurrencyNotFixed(newValue.harga_bahan_bakar.toString());
      newValue.sfc = globalFormat.formatCurrencyNotFixed(newValue.sfc.toString());
      return newValue;
    });
    bahanBakarGroup.value.bahanBakars = tempBahanBakars;
    statusAsumsi.value = response.data.status;
    simulasiAsumsiParameter.value = response.data;
    idAsumsi.value = response.data.id_asumsi;
    // Mengisi Asumsi Makro Data Variable
    asumsiParameter.value.asumsiMakro.interestRate = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.interest_rate.toString());
    asumsiParameter.value.asumsiMakro.umurTeknis = masaManfaat.value.toString();
    asumsiParameter.value.asumsiMakro.loanTenor = response.data.asumsi_makro.loan_tenor.toString();
    asumsiParameter.value.asumsiMakro.loanPortion = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.loan_portion.toString());
    asumsiParameter.value.asumsiMakro.totalProjectCost = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.total_project_cost.toString());
    asumsiParameter.value.asumsiMakro.dayaMampuNettoMW = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.daya_mampu_netto_mw.toString());
    asumsiParameterInit.value.asumsiMakro.interestRate = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.interest_rate.toString());
    asumsiParameterInit.value.asumsiMakro.umurTeknis = masaManfaat.value.toString();
    asumsiParameterInit.value.asumsiMakro.loanTenor = response.data.asumsi_makro.loan_tenor.toString();
    asumsiParameterInit.value.asumsiMakro.loanPortion = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.loan_portion.toString());
    // Mengisi Parameter Teknis & Finansial Data Variable
    asumsiParameter.value.parameterTeknis.nphr = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.nphr.toString());
    asumsiParameter.value.parameterTeknis.auxiliary = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.auxiliary.toString());
    asumsiParameter.value.parameterTeknis.susutTrafo = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.susut_trafo.toString());
    asumsiParameter.value.parameterTeknis.pemakaianSendiri = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.ps.toString());
    asumsiParameter.value.parameterTeknis.electricityPriceA = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_a_rp_per_kwbln.toString());
    asumsiParameter.value.parameterTeknis.electricityPriceB = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_b_rp_per_kwbln.toString());
    asumsiParameter.value.parameterTeknis.electricityPriceC = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_c_rp_per_kwh.toString());
    asumsiParameter.value.parameterTeknis.electricityPriceD = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_d_rp_per_kwh.toString());
    asumsiParameterInit.value.parameterTeknis.nphr = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.nphr.toString());
    asumsiParameterInit.value.parameterTeknis.auxiliary = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.auxiliary.toString());
    asumsiParameterInit.value.parameterTeknis.susutTrafo = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.susut_trafo.toString());
    asumsiParameterInit.value.parameterTeknis.pemakaianSendiri = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.ps.toString());
    asumsiParameterInit.value.parameterTeknis.electricityPriceA = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_a_rp_per_kwbln.toString());
    asumsiParameterInit.value.parameterTeknis.electricityPriceB = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_b_rp_per_kwbln.toString());
    asumsiParameterInit.value.parameterTeknis.electricityPriceC = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_c_rp_per_kwh.toString());
    asumsiParameterInit.value.parameterTeknis.electricityPriceD = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_d_rp_per_kwh.toString());
    pickedParameterValue.value = asumsiParameter.value.parameterTeknis.pemakaianSendiri === '0,00' ? 'auxiliarySusut' : 'pemakaianSendiri';
    isPermanent.value = asumsiParameterInit.value.parameterTeknis.electricityPriceA === '0,00' && asumsiParameterInit.value.parameterTeknis.electricityPriceB === '0,00' && asumsiParameterInit.value.parameterTeknis.electricityPriceC === '0,00' && asumsiParameterInit.value.parameterTeknis.electricityPriceD === '0,00';
    console.log(isPermanent.value)
  } catch (error) {
    console.error("Fetch Asumsi Parameter Error : " + error);
  }
};
const fetchTypePeriodic = async (idTypePeriodic: any) => {
  try {
    const response: any = await perbaruiDataService.getTypePeriodic(jenisPembangkit.value)
    const result = response.data.filter((value: any) => value.id_type_periodic === idTypePeriodic);
    return result;
  } catch (error) {
    console.error('Fetch Type Periodic Error : ' + error);
  }
}
const fetchListTypePeriodic = async () => {
  try {
    const response: any = await perbaruiDataService.getTypePeriodic(jenisPembangkit.value)
    listTypePeriodic.value = response.data
  } catch (error) {
    console.error('Fetch Type Periodic Error : ' + error);
  }
}
const fetchDataTeknisByPeriode = async () => {
  try {
    const responseSimulasi1: any =
      await perbaruiDataService.getDataTeknisByPeriodeSimulasi1(
        tahunBerjalan - 1,
        idMesin
      );
    const responseSimulasi2: any =
      await perbaruiDataService.getDataTeknisByPeriodeSimulasi2(
        tahunBerjalan - 1,
        idMesin
      );
    if (responseSimulasi1.data === null || responseSimulasi2.data === null) {
      const response: any = await perbaruiDataService.getDataTeknisByPeriode(
        tahunTerakhirRealisasi.value,
        idMesin
      );
      dataTeknisByPeriode.value = response.data;
      statusDataTeknis.value = 'Permanent';
      const periodicItem = response.data.filter((value: any) => value.uraian.includes('Periodic'));
      const ncfItem = response.data.filter((value: any) => value.uraian.includes('NCF'));
      const eafItem = response.data.filter((value: any) => value.uraian.includes('EAF'));
      const prodBruttoItem = response.data.filter((value: any) => value.uraian.includes('Bruto'));
      const prodNettoItem = response.data.filter((value: any) => value.uraian.includes('Netto'));
      const energySalesItem = response.data.filter((value: any) => value.uraian.includes('Energy'));
      const fuelConsItem = response.data.filter((value: any) => value.uraian.includes('Consumption'));
      const tempTypePeriodic = periodicItem.length !== 0 ? periodicItem[0].value : '';
      if (tempTypePeriodic !== '' && tempTypePeriodic !== 0) {
        const fetchTypePeriodicResult = await fetchTypePeriodic(tempTypePeriodic);
        typePeriodic.value = fetchTypePeriodicResult[0].id_type_periodic;
        dataTeknisInit.value.typePeriodic = fetchTypePeriodicResult[0].id_type_periodic;
      }
      else if (tempTypePeriodic === 0) {
        typePeriodic.value = 0;
        dataTeknisInit.value.typePeriodic = 0;
      }
      ncf.value = globalFormat.formatCurrencyNotFixed(ncfItem[0].value.toString());
      eaf.value = globalFormat.formatCurrencyNotFixed(eafItem[0].value.toString());
      productionBrutto.value = globalFormat.formatCurrencyNotFixed(prodBruttoItem[0].value.toString());
      productionNetto.value = globalFormat.formatCurrencyNotFixed(prodNettoItem[0].value.toString());
      energySales.value = globalFormat.formatCurrencyNotFixed(energySalesItem[0].value.toString());
      dataTeknisInit.value.ncf = globalFormat.formatCurrencyNotFixed(ncfItem[0].value.toString());
      dataTeknisInit.value.eaf = globalFormat.formatCurrencyNotFixed(eafItem[0].value.toString());
      dataTeknisInit.value.productionBrutto = globalFormat.formatCurrencyNotFixed(prodBruttoItem[0].value.toString());
      dataTeknisInit.value.productionNetto = globalFormat.formatCurrencyNotFixed(prodNettoItem[0].value.toString());
      dataTeknisInit.value.energySales = globalFormat.formatCurrencyNotFixed(energySalesItem[0].value.toString());
      for (const item of fuelConsItem) {
        const words = item.uraian.split(" ");
        const fuelIndex = words.indexOf("Fuel");
        const textAfterFuel = words.slice(fuelIndex + 2).join(" ");
        bahanBakarGroup.value.fuelConsumption.push({
          id_uraian: item.IdUraian,
          bahan_bakar: textAfterFuel,
          value: globalFormat.formatCurrencyNotFixed(item.value.toString())
        })
      }
    } else {
      dataTeknisByPeriode.value = responseSimulasi1.data;
      statusDataTeknis.value = 'Simulasi';
      const fuelConsumptionFinal: any = [];
      const periodicItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Periodic'));
      const ncfItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('NCF'));
      const eafItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('EAF'));
      const prodBruttoItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Bruto'));
      const prodNettoItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Netto'));
      const energySalesItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Energy'));
      const fuelConsItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Consumption'));
      const tempTypePeriodic1 = periodicItem1.length !== 0 ? periodicItem1[0].value : '';
      if (tempTypePeriodic1 !== '' && tempTypePeriodic1 !== 0) {
        const fetchTypePeriodicResult = await fetchTypePeriodic(tempTypePeriodic1);
        typePeriodic.value = fetchTypePeriodicResult[0].id_type_periodic;
      }
      else if (tempTypePeriodic1 === 0) {
        typePeriodic.value = 0;
      }
      ncf.value = globalFormat.formatCurrencyNotFixed(ncfItem1[0].value.toString());
      eaf.value = globalFormat.formatCurrencyNotFixed(eafItem1[0].value.toString());
      productionBrutto.value = globalFormat.formatCurrencyNotFixed(prodBruttoItem1[0].value.toString());
      productionNetto.value = globalFormat.formatCurrencyNotFixed(prodNettoItem1[0].value.toString());
      energySales.value = globalFormat.formatCurrencyNotFixed(energySalesItem1[0].value.toString());
      dataTeknisInit.value.ncf = globalFormat.formatCurrencyNotFixed(ncfItem1[0].value.toString());
      dataTeknisInit.value.eaf = globalFormat.formatCurrencyNotFixed(eafItem1[0].value.toString());
      dataTeknisInit.value.productionBrutto = globalFormat.formatCurrencyNotFixed(prodBruttoItem1[0].value.toString());
      dataTeknisInit.value.productionNetto = globalFormat.formatCurrencyNotFixed(prodNettoItem1[0].value.toString());
      dataTeknisInit.value.energySales = globalFormat.formatCurrencyNotFixed(energySalesItem1[0].value.toString());
      for (const item of fuelConsItem1) {
        const words = item.uraian.split(" ");
        const fuelIndex = words.indexOf("Fuel");
        const textAfterFuel = words.slice(fuelIndex + 2).join(" ");
        bahanBakarGroup.value.fuelConsumption.push({
          id_uraian: item.IdUraian,
          bahan_bakar: textAfterFuel,
          value: globalFormat.formatCurrencyNotFixed(item.value.toString())
        })
        fuelConsumptionFinal.push({
          id_uraian: item.IdUraian,
          value: item.value
        })
      }
      dataTeknisSimulasi1.value = {
        id_mesin: idMesin,
        tahun: tahunBerjalan,
        tahun_realisasi: tahunBerjalan - 1,
        id_type_periodic: typePeriodic.value,
        nfc: ncfItem1[0].value,
        eaf: eafItem1[0].value,
        production_bruto: prodBruttoItem1[0].value,
        production_netto: prodNettoItem1[0].value,
        energy_sales: energySalesItem1[0].value,
        fuel_consumption: fuelConsumptionFinal
      }
      var typePeriodic2 = 0;
      const fuelConsumptionFinal2: any = [];
      const periodicItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Periodic'));
      const ncfItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('NCF'));
      const eafItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('EAF'));
      const prodBruttoItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Bruto'));
      const prodNettoItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Netto'));
      const energySalesItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Energy'));
      const fuelConsItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Consumption'));
      const tempTypePeriodic2 = periodicItem2.length !== 0 ? periodicItem2[0].value : '';
      if (tempTypePeriodic2 !== '' && tempTypePeriodic2 !== 0) {
        const fetchTypePeriodicResult = await fetchTypePeriodic(tempTypePeriodic2);
        typePeriodic2 = fetchTypePeriodicResult[0].id_type_periodic;
      } else if (tempTypePeriodic2 === 0) {
        typePeriodic2 = 0;
      }
      for (const item of fuelConsItem2) {
        fuelConsumptionFinal2.push({
          id_uraian: item.IdUraian,
          value: item.value
        })
      }
      dataTeknisSimulasi2.value = {
        id_mesin: idMesin,
        tahun: tahunBerjalan,
        tahun_realisasi: tahunBerjalan - 1,
        id_type_periodic: typePeriodic2,
        nfc: ncfItem2[0].value,
        eaf: eafItem2[0].value,
        production_bruto: prodBruttoItem2[0].value,
        production_netto: prodNettoItem2[0].value,
        energy_sales: energySalesItem2[0].value,
        fuel_consumption: fuelConsumptionFinal2
      }
    }
  } catch (error) {
    console.error("Fetch Data Teknis Error : " + error);
  }
};
const fetchComboTypePeriodic = async () => {
  try {
    const response: ComboTypePeriodicItem =
      await perbaruiDataService.getTypePeriodic(
        jenisPembangkit.value
      );
    const newValue: any = {
      id_type_periodic: 0,
      kode_type_periodic: '-',
    }
    comboTypePeriodic.value = response.data;
    comboTypePeriodic.value.unshift(newValue);
  } catch (error) {
    console.error("Fetch Combo Type Periodic Error : " + error);
  }
};
const fetchDataFinansialDetail = async () => {
  try {
    const responseSimulasi1: any = await perbaruiDataService.getDataFinansialDetailSimulasi1(
      tahunBerjalan - 1,
      idMesin
    );
    const responseSimulasi2: any = await perbaruiDataService.getDataFinansialDetailSimulasi2(
      tahunBerjalan - 1,
      idMesin
    );
    const response: ComboTypePeriodicItem = await perbaruiDataService.getDataFinansialDetail(tahunTerakhirRealisasi.value, idMesin);
    isAudited.value = response.data.is_audited;
    if (responseSimulasi1.data.id_mesin === 0 || responseSimulasi2.data.id_mesin === 0) {
      statusDataFinansial.value = 'Permanent';
      dataFinansialDetail.value = response.data;
      costComponentA.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_a);
      costComponentB.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b);
      biayaKepegawaian.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_kepegawaian);
      biayaPemeliharaanRutin.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_pemeliharaan_rutin);
      biayaAdministrasiUmum.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_administrasi_umum);
      biayaPembelianTenagaListrik.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik);
      biayaLainLain.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_lain_lain);
      oMCost.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_lain_lain);
      periodicMaintenanceCost.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_periodic_maintenance_non_mi);
      costComponentC.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_c);
      costComponentD.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_d);
      totalRevenue.value = globalFormat.formatCurrencyNotFixed(response.data.revenue);
      revenueKompA.value = globalFormat.formatCurrencyNotFixed(response.data.revenue_a);
      revenueKompB.value = globalFormat.formatCurrencyNotFixed(response.data.revenue_b);
      revenueKompC.value = globalFormat.formatCurrencyNotFixed(response.data.revenue_c);
      revenueKompD.value = globalFormat.formatCurrencyNotFixed(response.data.revenue_d);
      for (const value of response.data.cost_component_c_detail) {
        value.fuel_cost = globalFormat.formatCurrencyNotFixed(value.fuel_cost);
      }
      bahanBakarGroup.value.costCDetail = response.data.cost_component_c_detail;
      biayaMinyakPelumas.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_d_detail.biaya_pelumas);
      bahanKimia.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_d_detail.biaya_bahan_kimia);
      dataFinansialInit.value.costComponentA = globalFormat.formatCurrencyNotFixed(response.data.cost_component_a);
      dataFinansialInit.value.costComponentA = globalFormat.formatCurrencyNotFixed(response.data.cost_component_a);
      dataFinansialInit.value.costComponentB = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b);
      dataFinansialInit.value.biayaKepegawaian = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_kepegawaian);
      dataFinansialInit.value.biayaPemeliharaanRutin = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_pemeliharaan_rutin);
      dataFinansialInit.value.biayaAdministrasiUmum = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_administrasi_umum);
      dataFinansialInit.value.biayaPembelianTenagaListrik = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik);
      dataFinansialInit.value.biayaLainLain = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_lain_lain);
      dataFinansialInit.value.oMCost = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_lain_lain);
      dataFinansialInit.value.periodicMaintenanceCost = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_periodic_maintenance_non_mi);
      dataFinansialInit.value.costComponentC = globalFormat.formatCurrencyNotFixed(response.data.cost_component_c);
      dataFinansialInit.value.costComponentD = globalFormat.formatCurrencyNotFixed(response.data.cost_component_d)
    } else {
      statusDataFinansial.value = 'Simulasi';
      dataFinansialDetail.value = responseSimulasi1.data;
      costComponentA.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_a);
      costComponentB.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b);
      biayaKepegawaian.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_kepegawaian);
      biayaPemeliharaanRutin.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_pemeliharaan_rutin);
      biayaAdministrasiUmum.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_administrasi_umum);
      biayaPembelianTenagaListrik.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik);
      biayaLainLain.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_lain_lain);
      oMCost.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_lain_lain);
      periodicMaintenanceCost.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_periodic_maintenance_non_mi);
      costComponentC.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_c);
      costComponentD.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_d);
      for (const value of responseSimulasi1.data.cost_component_c_detail) {
        value.fuel_cost = globalFormat.formatCurrencyNotFixed(value.fuel_cost);
      }
      bahanBakarGroup.value.costCDetail = responseSimulasi1.data.cost_component_c_detail;
      biayaMinyakPelumas.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_d_detail.biaya_pelumas);
      bahanKimia.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_d_detail.biaya_bahan_kimia);
      totalRevenue.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.revenue);
      revenueKompA.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.revenue_a);
      revenueKompB.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.revenue_b);
      revenueKompC.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.revenue_c);
      revenueKompD.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.revenue_d);
      dataFinansialInit.value.costComponentA = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_a);
      dataFinansialInit.value.costComponentA = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_a);
      dataFinansialInit.value.costComponentB = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b);
      dataFinansialInit.value.biayaKepegawaian = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_kepegawaian);
      dataFinansialInit.value.biayaPemeliharaanRutin = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_pemeliharaan_rutin);
      dataFinansialInit.value.biayaAdministrasiUmum = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_administrasi_umum);
      dataFinansialInit.value.biayaPembelianTenagaListrik = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik);
      dataFinansialInit.value.biayaLainLain = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_lain_lain);
      dataFinansialInit.value.oMCost = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_lain_lain);
      dataFinansialInit.value.periodicMaintenanceCost = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_periodic_maintenance_non_mi);
      dataFinansialInit.value.costComponentC = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_c);
      dataFinansialInit.value.costComponentD = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_d);
      formFinansialSimulasi1.value = {
        id_mesin: idMesin,
        tahun: tahunBerjalan - 1,
        status_b_d: responseSimulasi1.data.status_b_d,
        cost_component_a: responseSimulasi1.data.cost_component_a,
        cost_component_b: responseSimulasi1.data.cost_component_b,
        cost_component_b_detail: {
          id_ao: 0,
          id_mesin: idMesin,
          tahun: tahunBerjalan - 1,
          biaya_kepegawaian: responseSimulasi1.data.cost_component_b_detail.biaya_kepegawaian,
          biaya_pemeliharaan_rutin: responseSimulasi1.data.cost_component_b_detail.biaya_pemeliharaan_rutin,
          biaya_administrasi_umum: responseSimulasi1.data.cost_component_b_detail.biaya_administrasi_umum,
          biaya_pembelian_tenaga_listrik: responseSimulasi1.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik,
          biaya_penyusutan_aset_tetap: responseSimulasi1.data.cost_component_b_detail.biaya_penyusutan_aset_tetap,
          biaya_lain_lain: responseSimulasi1.data.cost_component_b_detail.biaya_lain_lain,
          biaya_periodic_maintenance_non_mi: responseSimulasi1.data.cost_component_b_detail.biaya_periodic_maintenance_non_mi
        },
        cost_component_c: responseSimulasi1.data.cost_component_c,
        cost_component_c_detail: responseSimulasi1.data.cost_component_c_detail,
        cost_component_d: responseSimulasi1.data.cost_component_d,
        cost_component_d_detail: {
          id_pelumas_bahan_kimia: 0,
          id_mesin: idMesin,
          tahun: tahunBerjalan - 1,
          biaya_pelumas: responseSimulasi1.data.cost_component_d_detail.biaya_pelumas,
          biaya_bahan_kimia: responseSimulasi1.data.cost_component_d_detail.biaya_bahan_kimia,
          biaya_lain_lain: responseSimulasi1.data.cost_component_d_detail.biaya_lain_lain
        },
        revenue: responseSimulasi1.data.revenue,
        revenue_a: responseSimulasi1.data.revenue_a,
        revenue_b: responseSimulasi1.data.revenue_b,
        revenue_c: responseSimulasi1.data.revenue_c,
        revenue_d: responseSimulasi1.data.revenue_d,
        opsi_simulasi: 1
      };
      formFinansialSimulasi2.value = {
        id_mesin: idMesin,
        tahun: tahunBerjalan - 1,
        status_b_d: responseSimulasi2.data.status_b_d,
        cost_component_a: responseSimulasi2.data.cost_component_a,
        cost_component_b: responseSimulasi2.data.cost_component_b,
        cost_component_b_detail: {
          id_ao: 0,
          id_mesin: idMesin,
          tahun: tahunBerjalan - 1,
          biaya_kepegawaian: responseSimulasi2.data.cost_component_b_detail.biaya_kepegawaian,
          biaya_pemeliharaan_rutin: responseSimulasi2.data.cost_component_b_detail.biaya_pemeliharaan_rutin,
          biaya_administrasi_umum: responseSimulasi2.data.cost_component_b_detail.biaya_administrasi_umum,
          biaya_pembelian_tenaga_listrik: responseSimulasi2.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik,
          biaya_penyusutan_aset_tetap: responseSimulasi2.data.cost_component_b_detail.biaya_penyusutan_aset_tetap,
          biaya_lain_lain: responseSimulasi2.data.cost_component_b_detail.biaya_lain_lain,
          biaya_periodic_maintenance_non_mi: responseSimulasi2.data.cost_component_b_detail.biaya_periodic_maintenance_non_mi
        },
        cost_component_c: responseSimulasi2.data.cost_component_c,
        cost_component_c_detail: responseSimulasi2.data.cost_component_c_detail,
        cost_component_d: responseSimulasi2.data.cost_component_d,
        cost_component_d_detail: {
          id_pelumas_bahan_kimia: 0,
          id_mesin: idMesin,
          tahun: tahunBerjalan - 1,
          biaya_pelumas: responseSimulasi2.data.cost_component_d_detail.biaya_pelumas,
          biaya_bahan_kimia: responseSimulasi2.data.cost_component_d_detail.biaya_bahan_kimia,
          biaya_lain_lain: responseSimulasi2.data.cost_component_d_detail.biaya_lain_lain
        },
        revenue: responseSimulasi2.data.revenue,
        revenue_a: responseSimulasi2.data.revenue_a,
        revenue_b: responseSimulasi2.data.revenue_b,
        revenue_c: responseSimulasi2.data.revenue_c,
        revenue_d: responseSimulasi2.data.revenue_d,
        opsi_simulasi: 2
      };
    }
  } catch (error) {
    console.error("Fetch Data Finansial Simulasi Error : " + error);
  }
};
const fetchHasilSimulasi1 = async () => {
  try {
    const response: any = await perbaruiDataService.getHasilSimulasi(idMesin, tahunBerjalan, 6);
    hasilSimulasi1.value.idMesin = response.data.id_mesin;
    hasilSimulasi1.value.trackAverageEaf = response.data.track_average_eaf;
    hasilSimulasi1.value.trackAverageNcf = response.data.track_average_cf;
    hasilSimulasi1.value.trackIrrEquity = response.data.track_irr_equity;
    hasilSimulasi1.value.trackIrrProject = response.data.track_irr_project;
    hasilSimulasi1.value.trackNpvEquity = response.data.track_npv_equity;
    hasilSimulasi1.value.trackNpvProject = response.data.track_npv_project;
  } catch (error) {
    console.error(error);
  }
}
const fetchHasilSimulasi2 = async () => {
  try {
    const response: any = await perbaruiDataService.getHasilSimulasi(idMesin, tahunBerjalan, 7);
    hasilSimulasi2.value.idMesin = response.data.id_mesin;
    hasilSimulasi2.value.trackAverageEaf = response.data.track_average_eaf;
    hasilSimulasi2.value.trackAverageNcf = response.data.track_average_cf;
    hasilSimulasi2.value.trackIrrEquity = response.data.track_irr_equity;
    hasilSimulasi2.value.trackIrrProject = response.data.track_irr_project;
    hasilSimulasi2.value.trackNpvEquity = response.data.track_npv_equity;
    hasilSimulasi2.value.trackNpvProject = response.data.track_npv_project;
  } catch (error) {
    console.error(error);
  }
}
const fetchComboBahanBakar = async () => {
  try {
    const response: any = await perbaruiDataService.getComboBahanBakar(jenisPembangkit.value);
    comboBahanBakar.value = response.data;
  } catch (error) {
    console.error(error);
  }
}
const getTypePeriodic = (num: number) => {
  let filteredTypePeriodic: any;
  if (listTypePeriodic.value.length !== 0) {
    filteredTypePeriodic = listTypePeriodic.value.filter((periodic: any) => periodic.id_type_periodic === num);
    return filteredTypePeriodic.length === 0 ? '-' : filteredTypePeriodic[0].kode_type_periodic;
  }
  return "-";
}
const handleFileChangeEvidence = (event: any) => {
  if (event.target.files.length === 1) {
    selectedFileEvidence.value = event.target.files[0];
  } else {
    selectedFileEvidence.value = null;
  }
};
const uploadFileEvidence = async () => {
  try {
    isLoading.value = true
    const formData = new FormData();
    formData.append('file', selectedFileEvidence.value);
    const response: any = await rekapService.uploadEvidence(formData);
    await rekapService.updateEvidencePath(idMesin, tahunBerjalan.toString(), response.data, 0, selectedFileEvidence.value.name);
    isShowFinalConfirmation.value = false;
    isShowModalEvidence.value = false;
    isLoading.value = false;
    isSuccessEvidence.value = true;
    await wait(3000)
    isSuccessEvidence.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error('Error upload file : ', error);
  }
};
const handleFileChangeSimulasi1 = (event: any) => {
  if (event.target.files.length === 1) {
    selectedFileSimulasi1.value = event.target.files[0];
  } else {
    selectedFileSimulasi1.value = null;
  }
};
const uploadFileSimulasi1 = async () => {
  try {
    isLoading.value = true
    if (selectedFileSimulasi1.value == null) {
      notifyError('Mohon pilih file excel terlebih dahulu', 3000)
      isLoading.value = false
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFileSimulasi1.value);
    const response: any = await rekapService.uploadSimulasi1(formData);
    await fetchHasilSimulasi1();
    console.log('Sukses mengirim file : ', response.data);
    isUnggahModalOpenSimulasi1.value = false;
    isLoading.value = false;
    // Fetching Data Simulasi Disini
    isSuccess.value = true;
    await wait(3000)
    isSuccess.value = false;
    isLoading.value = true;
    simulasi1DataFinansial.value = [];
    dataFinansialSimulasi1.value = [];
    bahanBakarGroup.value.fuelConsumption = [];
    await fetchAsumsiParameter();
    await fetchDataFinansialDetail();
    await fetchDataTeknisByPeriode();
    await fetchDataTeknisSimulasi1();
    await fetchDataTeknisSimulasi2();
    await fetchDataFinansialSimulasi1();
    await fetchDataFinansialSimulasi2();
    console.log(bahanBakarGroup.value);
    selectedFileSimulasi1.value = null
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error('Error upload file : ', error);
  }
};
const handleFileChange = (event: any) => {
  if (event.target.files.length === 1) {
    selectedFile.value = event.target.files[0];
  } else {
    selectedFile.value = null;
  }
};

const uploadFile = async () => {
  try {
    isLoading.value = true
    if (!selectedFile.value) {
      console.error('Mohon pilih file excel terlebih dahulu');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    const response: any = await rekapService.uploadSimulasi2(formData);
    await fetchHasilSimulasi2();
    console.log('Sukses mengirim file : ', response.data);
    isUnggahModalOpen.value = false;
    isLoading.value = false;
    // Fetching Data Simulasi Disini
    isSuccess.value = true;
    await wait(3000)
    isSuccess.value = false;
    isLoading.value = true;
    simulasi2DataFinansial.value = [];
    dataFinansialSimulasi2.value = [];
    bahanBakarGroup.value.fuelConsumption = [];
    await fetchAsumsiParameter();
    await fetchDataFinansialDetail();
    await fetchDataTeknisByPeriode();
    await fetchDataTeknisSimulasi1();
    await fetchDataTeknisSimulasi2();
    await fetchDataFinansialSimulasi1();
    await fetchDataFinansialSimulasi2();
    console.log(bahanBakarGroup.value);
    selectedFile.value = null
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    console.error('Error upload file : ', error);
  }
};
function handleTambahBahanBakar() {
  bahanBakarGroup.value.bahanBakars.push({
    flag_bahan_bakar: 0,
    harga_bahan_bakar: "0",
    id_mesin: idMesin,
    kode_bahan_bakar: "",
    sfc: "0",
    tahun: (tahunBerjalan - 1).toString(),
    id: i.value++
  });
  bahanBakarGroup.value.fuelConsumption.push({
    id_uraian: 0,
    bahan_bakar: "",
    value: "0"
  });
  bahanBakarGroup.value.costCDetail.push({
    id_mesin: idMesin,
    tahun: tahunBerjalan - 1,
    kode_bahan_bakar: "",
    fuel_cost: "0"
  })
  watch(() => bahanBakarGroup.value.bahanBakars.map(b => b.kode_bahan_bakar), (newValues, oldValues) => {
    newValues.forEach((newValue, index) => {
      const selectedBahanBakar = comboBahanBakar.value.find(data => data.kode_bahan_bakar === newValue);
      console.log(selectedBahanBakar, 'Selected Bahan Bakar');
      if (selectedBahanBakar) {
        bahanBakarGroup.value.fuelConsumption[index].id_uraian = parseInt(selectedBahanBakar.id_uraian_fuel_consumption);
        bahanBakarGroup.value.fuelConsumption[index].bahan_bakar = selectedBahanBakar.bahan_bakar;
      }
      bahanBakarGroup.value.costCDetail[index].kode_bahan_bakar = newValue;
      console.log(bahanBakarGroup.value, 'Bahan Bakar Group')
    });
  });
}

const handleChange = () => {
  watchEffect(() => {
    bahanBakarGroup.value.bahanBakars.forEach((bahanBakar, index) => {
      const newValue = bahanBakar.kode_bahan_bakar;
      const selectedBahanBakar = comboBahanBakar.value.find(data => data.kode_bahan_bakar === newValue);

      if (selectedBahanBakar) {
        bahanBakarGroup.value.fuelConsumption[index].id_uraian = parseInt(selectedBahanBakar.id_uraian_fuel_consumption);
        bahanBakarGroup.value.fuelConsumption[index].bahan_bakar = selectedBahanBakar.bahan_bakar;
      }
      bahanBakarGroup.value.costCDetail[index].kode_bahan_bakar = newValue;
      console.log(bahanBakarGroup.value, 'Bahan Bakar Group');
    });
  });
}

function handleHapusBahanBakar() {
  if (checkedBahanBakar.value.length) {
    checkedBahanBakar.value.forEach((checkedItemId) => {
      const result = bahanBakarGroup.value.bahanBakars.findIndex((checkbox) => checkbox.id === checkedItemId);
      if (result !== -1) {
        bahanBakarGroup.value.bahanBakars.splice(result, 1);
        bahanBakarGroup.value.fuelConsumption.splice(result, 1);
        bahanBakarGroup.value.costCDetail.splice(result, 1);
      }
    });
    checkedBahanBakar.value = [];
  }
}
const fetchDataTeknisSimulasi1 = async () => {
  try {
    const response: any = await perbaruiDataService.getDataTeknisSimulasi1(tahunBerjalan, idMesin);
    simulasi1DataTeknis.value = response.data;
    console.log('Simulasi Teknis 1 : ', response.data);
  } catch (error) {
    console.error('Fetch Opsi Simulasi Error : ', error);
  }
}
const fetchDataTeknisSimulasi2 = async () => {
  try {
    const response: any = await perbaruiDataService.getDataTeknisSimulasi2(tahunBerjalan, idMesin);
    simulasi2DataTeknis.value = response.data;
    console.log('Simulasi Teknis 2: ', response.data);
  } catch (error) {
    console.error('Fetch Opsi Simulasi Error : ', error);
  }
}
const fetchDataFinansialSimulasi1 = async () => {
  try {
    simulasi1DataFinansial.value = [];
    const response: any = await perbaruiDataService.getDataFinansialSimulasi1(tahunBerjalan, idMesin);
    let currentLevel1: any | null = null;
    let currentLevel2: any | null = null;
    let currentLevel3: any | null = null;
    for (const item of response.data.detail) {
      if (item.level === 1) {
        currentLevel1 = {
          ...item,
          level2: [],
        };
        simulasi1DataFinansial.value.push(currentLevel1);
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
        currentLevel3.level4.push({ ...item });
      }
    }
    dataFinansialSimulasi1.value = response.data;
    console.log('Simulasi Finansial 1 : ', response.data);
  } catch (error) {
    console.error('Fetch Opsi Simulasi Error : ', error);
  }
}
const fetchDataFinansialSimulasi2 = async () => {
  try {
    simulasi2DataFinansial.value = [];
    const response: any = await perbaruiDataService.getDataFinansialSimulasi2(tahunBerjalan, idMesin);
    let currentLevel1: any | null = null;
    let currentLevel2: any | null = null;
    let currentLevel3: any | null = null;
    for (const item of response.data.detail) {
      if (item.level === 1) {
        currentLevel1 = {
          ...item,
          level2: [],
        };
        simulasi2DataFinansial.value.push(currentLevel1);
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
        currentLevel3.level4.push({ ...item });
      }
    }
    dataFinansialSimulasi2.value = response.data;
    console.log('Simulasi : Finansial 2', simulasi2DataFinansial.value);
  } catch (error) {
    console.error('Fetch Opsi Simulasi Error : ', error);
  }
}
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const handleSubmit = async () => {
  const errorAsumsiInput = error.value.asumsi;
  const errorParameterTeknis = error.value.parameter;
  const errorDataTeknis = error.value.teknis;
  const errorDataFinansial = error.value.finansial;
  if (asumsiParameter.value.asumsiMakro.interestRate === '') {
    errorAsumsiInput.interestRate = true;
  } else {
    errorAsumsiInput.interestRate = false;
  }
  if (asumsiParameter.value.asumsiMakro.umurTeknis === '') {
    errorAsumsiInput.umurTeknis = true;
  } else {
    errorAsumsiInput.umurTeknis = false;
  }
  if (asumsiParameter.value.asumsiMakro.loanTenor === '') {
    errorAsumsiInput.loanTenor = true;
  } else {
    errorAsumsiInput.loanTenor = false;
  }
  if (asumsiParameter.value.asumsiMakro.loanPortion === '') {
    errorAsumsiInput.loanPortion = true;
  } else {
    errorAsumsiInput.loanPortion = false;
  }
  if (asumsiParameter.value.parameterTeknis.nphr === '') {
    errorParameterTeknis.nphr = true;
  } else {
    errorParameterTeknis.nphr = false;
  }
  if (asumsiParameter.value.parameterTeknis.auxiliary === '') {
    errorParameterTeknis.auxiliary = true;
  } else {
    errorParameterTeknis.auxiliary = false;
  }
  if (asumsiParameter.value.parameterTeknis.susutTrafo === '') {
    errorParameterTeknis.susutTrafo = true;
  } else {
    errorParameterTeknis.susutTrafo = false;
  }
  if (asumsiParameter.value.parameterTeknis.pemakaianSendiri === '') {
    errorParameterTeknis.pemakaianSendiri = true;
  } else {
    errorParameterTeknis.pemakaianSendiri = false;
  }
  if (asumsiParameter.value.parameterTeknis.electricityPriceA === '') {
    errorParameterTeknis.electricityPriceA = true;
  } else {
    errorParameterTeknis.electricityPriceA = false;
  }
  if (asumsiParameter.value.parameterTeknis.electricityPriceB === '') {
    errorParameterTeknis.electricityPriceB = true;
  } else {
    errorParameterTeknis.electricityPriceB = false;
  }
  if (asumsiParameter.value.parameterTeknis.electricityPriceC === '') {
    errorParameterTeknis.electricityPriceC = true;
  } else {
    errorParameterTeknis.electricityPriceC = false;
  }
  if (asumsiParameter.value.parameterTeknis.electricityPriceD === '') {
    errorParameterTeknis.electricityPriceD = true;
  } else {
    errorParameterTeknis.electricityPriceD = false;
  }
  if (bahanBakarGroup.value.bahanBakars.some(obj => Object.values(obj).some(value => value === ""))) {
    errorParameterTeknis.bahanBakar = true;
  } else {
    errorParameterTeknis.bahanBakar = false;
  }
  if (typePeriodic.value === '') {
    errorDataTeknis.periodicMaintenance = true;
  } else {
    errorDataTeknis.periodicMaintenance = false;
  }
  if (ncf.value === '') {
    errorDataTeknis.ncf = true;
  } else {
    errorDataTeknis.ncf = false;
  }
  if (eaf.value === '') {
    errorDataTeknis.eaf = true;
  } else {
    errorDataTeknis.eaf = false;
  }
  if (productionBrutto.value === '') {
    errorDataTeknis.productionBrutto = true;
  } else {
    errorDataTeknis.productionBrutto = false;
  }
  if (productionNetto.value === '') {
    errorDataTeknis.productionNetto = true;
  } else {
    errorDataTeknis.productionNetto = false;
  }
  if (energySales.value === '') {
    errorDataTeknis.energySales = true;
  } else {
    errorDataTeknis.energySales = false;
  }
  if (bahanBakarGroup.value.fuelConsumption.filter((value: any) => value.value === '').length !== 0) {
    errorDataTeknis.fuelConsumption = true;
  } else {
    errorDataTeknis.fuelConsumption = false;
  }
  if (costComponentA.value === 'NaN' || costComponentA.value === '') {
    errorDataFinansial.costComponentA = true;
  } else {
    errorDataFinansial.costComponentA = false;
  }
  if (costComponentADetail.value.some(obj => Object.values(obj).some(value => value === ""))) {
    errorDataFinansial.biayaInvestasiAiAki = true;
  } else {
    errorDataFinansial.biayaInvestasiAiAki = false;
  }
  if (costComponentB.value === 'NaN' || costComponentB.value === '') {
    errorDataFinansial.costComponentB = true;
  } else {
    errorDataFinansial.costComponentB = false;
  }
  // if (picked.value === 'pisah') {
  if (biayaKepegawaian.value === 'NaN' || biayaKepegawaian.value === '') {
    errorDataFinansial.biayaKepegawaian = true;
  } else {
    errorDataFinansial.biayaKepegawaian = false;
  }
  if (biayaPemeliharaanRutin.value === 'NaN' || biayaPemeliharaanRutin.value === '') {
    errorDataFinansial.biayaPemeliharaanRutin = true;
  } else {
    errorDataFinansial.biayaPemeliharaanRutin = false;
  }
  if (biayaAdministrasiUmum.value === 'NaN' || biayaAdministrasiUmum.value === '') {
    errorDataFinansial.biayaAdministrasiUmum = true;
  } else {
    errorDataFinansial.biayaAdministrasiUmum = false;
  }
  if (biayaPembelianTenagaListrik.value === 'NaN' || biayaPembelianTenagaListrik.value === '') {
    errorDataFinansial.biayaPembelianTenagaListrik = true;
  } else {
    errorDataFinansial.biayaPembelianTenagaListrik = false;
  }
  if (biayaLainLain.value === 'NaN' || biayaLainLain.value === '') {
    errorDataFinansial.biayaLainLain = true;
  } else {
    errorDataFinansial.biayaLainLain = false;
  }
  // } else if (picked.value === 'gabung') {
  // if (oMCost.value === 'NaN' || oMCost.value === '') {
  //   errorDataFinansial.oMCost = true;
  // } else {
  //   errorDataFinansial.oMCost = false;
  // }
  // if (periodicMaintenanceCost.value === 'NaN' || periodicMaintenanceCost.value === '') {
  //   errorDataFinansial.periodicMaintenanceCost = true;
  // } else {
  //   errorDataFinansial.periodicMaintenanceCost = false;
  // }
  // }
  if (costComponentC.value === 'NaN' || costComponentC.value === '') {
    errorDataFinansial.costComponentC = true;
  } else {
    errorDataFinansial.costComponentC = false;
  }
  if (bahanBakarGroup.value.costCDetail.some(obj => Object.values(obj).some(value => value === ""))) {
    errorDataFinansial.costComponentCDetail = true;
  } else {
    errorDataFinansial.costComponentCDetail = false;
  }
  if (costComponentD.value === 'NaN' || costComponentD.value === '') {
    errorDataFinansial.costComponentD = true;
  } else {
    errorDataFinansial.costComponentD = false;
  }
  if (biayaMinyakPelumas.value === 'NaN' || biayaMinyakPelumas.value === '') {
    errorDataFinansial.biayaMinyakPelumas = true;
  } else {
    errorDataFinansial.biayaMinyakPelumas = false;
  }
  if (bahanKimia.value === 'NaN' || bahanKimia.value === '') {
    errorDataFinansial.biayaBahanKimia = true;
  } else {
    errorDataFinansial.biayaBahanKimia = false;
  }
  if (totalRevenue.value === 'NaN' || totalRevenue.value === '') {
    errorDataFinansial.totalRevenue = true;
  } else {
    errorDataFinansial.totalRevenue = false;
  }
  if (revenueKompA.value === 'NaN' || revenueKompA.value === '') {
    errorDataFinansial.revenueKompA = true;
  } else {
    errorDataFinansial.revenueKompA = false;
  }
  if (revenueKompB.value === 'NaN' || revenueKompB.value === '') {
    errorDataFinansial.revenueKompB = true;
  } else {
    errorDataFinansial.revenueKompB = false;
  }
  if (revenueKompC.value === 'NaN' || revenueKompC.value === '') {
    errorDataFinansial.revenueKompC = true;
  } else {
    errorDataFinansial.revenueKompC = false;
  }
  if (revenueKompD.value === 'NaN' || revenueKompD.value === '') {
    errorDataFinansial.revenueKompD = true;
  } else {
    errorDataFinansial.revenueKompD = false;
  }
  if (Object.values(errorAsumsiInput).some(value => value === true) || Object.values(errorParameterTeknis).some(value => value === true) || Object.values(errorDataTeknis).some(value => value === true) || Object.values(errorDataFinansial).some(value => value === true)) {
    isShowModalNotification.value = true;
    console.log(error.value)
    await wait(5000);
    isShowModalNotification.value = false;
  } else {
    try {
      isLoading.value = true;
      // Update Asumsi Makro 
      const finalInterestRate = asumsiParameter.value.asumsiMakro.interestRate.includes('.') ? asumsiParameter.value.asumsiMakro.interestRate.replace(/[.]/g, '') : asumsiParameter.value.asumsiMakro.interestRate;
      const finalLoanPortion = asumsiParameter.value.asumsiMakro.loanPortion.includes('.') ? asumsiParameter.value.asumsiMakro.loanPortion.replace(/[.]/g, '') : asumsiParameter.value.asumsiMakro.loanPortion;
      const finalTotalProjectCost = asumsiParameter.value.asumsiMakro.totalProjectCost.includes('.') ? asumsiParameter.value.asumsiMakro.totalProjectCost.replace(/[.]/g, '') : asumsiParameter.value.asumsiMakro.totalProjectCost;
      const finalDayaMampuNettoMW = asumsiParameter.value.asumsiMakro.dayaMampuNettoMW.includes('.') ? asumsiParameter.value.asumsiMakro.dayaMampuNettoMW.replace(/[.]/g, '') : asumsiParameter.value.asumsiMakro.dayaMampuNettoMW;
      console.log(finalTotalProjectCost, 'Total Project Cost');
      console.log(finalDayaMampuNettoMW, 'Daya Mampu Netto MW');
      if (idAsumsi.value === 0 && statusAsumsi.value === 'create') {
        const formAsumsiCreate = {
          // Tahun Berjalan
          tahun: tahunBerjalan,
          // Tahun Realisasi
          tahun_realisasi: tahunBerjalan - 1,
          id_mesin: idMesin,
          interest_rate: parseFloat(finalInterestRate.replace(/,/g, '.')),
          umur_teknis: parseInt(masaManfaat.value),
          loan_tenor: parseInt(asumsiParameter.value.asumsiMakro.loanTenor),
          loan_portion: parseFloat(finalLoanPortion.replace(/,/g, '.')),
          status_fs: 0,
          total_project_cost: parseFloat(finalTotalProjectCost.replace(/,/g, '.')),
          daya_mampu_netto_mw: parseFloat(finalDayaMampuNettoMW.replace(/,/g, '.'))
        }
        console.log(formAsumsiCreate)
        await perbaruiDataService.createAsumsiMakroPermanent(formAsumsiCreate);
        await fetchMesinById();
        const response: AsumsiParameterItem =
          await perbaruiDataService.getAsumsiParameterData(
            tahunBerjalan - 1,
            idMesin,
            tahunBerjalan
          );
        statusAsumsi.value = response.data.status;
        idAsumsi.value = response.data.id_asumsi;
      } else {
        const formAsumsiUpdate = {
          id_asumsi: idAsumsi.value,
          // Tahun Berjalan
          tahun: tahunBerjalan,
          // Tahun Realisasi
          tahun_realisasi: tahunBerjalan - 1,
          id_mesin: idMesin,
          interest_rate: parseFloat(finalInterestRate.replace(/,/g, '.')),
          umur_teknis: parseInt(masaManfaat.value),
          loan_tenor: parseInt(asumsiParameter.value.asumsiMakro.loanTenor),
          loan_portion: parseFloat(finalLoanPortion.replace(/,/g, '.')),
          total_project_cost: parseFloat(finalTotalProjectCost.replace(/,/g, '.')),
          daya_mampu_netto_mw: parseFloat(finalDayaMampuNettoMW.replace(/,/g, '.'))
        }
        await perbaruiDataService.updateAsumsiMakroPermanent(formAsumsiUpdate);
        await fetchMesinById();
        const response: AsumsiParameterItem =
          await perbaruiDataService.getAsumsiParameterData(
            tahunBerjalan - 1,
            idMesin,
            tahunBerjalan
          );
        statusAsumsi.value = response.data.status;
        idAsumsi.value = response.data.id_asumsi;
      }
      // Update Parameter Teknis & Finansial
      const finalBahanBakars = bahanBakarGroup.value.bahanBakars.map(value => {
        delete value.id;
        let newValue = { ...value };
        let finalHargaBahanBakar = newValue.harga_bahan_bakar.includes('.') ? newValue.harga_bahan_bakar.replace(/[.]/g, '') : newValue.harga_bahan_bakar;
        newValue.harga_bahan_bakar = parseFloat(finalHargaBahanBakar.replace(/,/g, '.'));
        let finalSFC = newValue.sfc.includes('.') ? newValue.sfc.replace(/[.]/g, '') : newValue.sfc;
        newValue.sfc = parseFloat(finalSFC.replace(/,/g, '.'));
        newValue.tahun = (tahunBerjalan - 1).toString();
        return newValue;
      });
      console.log(finalBahanBakars, 'Final');
      const finalNPHR = asumsiParameter.value.parameterTeknis.nphr.includes('.') ? asumsiParameter.value.parameterTeknis.nphr.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.nphr;
      const finalAuxiliary = asumsiParameter.value.parameterTeknis.auxiliary.includes('.') ? asumsiParameter.value.parameterTeknis.auxiliary.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.auxiliary;
      const finalSusutTrafo = asumsiParameter.value.parameterTeknis.susutTrafo.includes('.') ? asumsiParameter.value.parameterTeknis.susutTrafo.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.susutTrafo;
      const finalPemakaianSendiri = asumsiParameter.value.parameterTeknis.pemakaianSendiri.includes('.') ? asumsiParameter.value.parameterTeknis.pemakaianSendiri.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.pemakaianSendiri;
      const finalElecA = asumsiParameter.value.parameterTeknis.electricityPriceA.includes('.') ? asumsiParameter.value.parameterTeknis.electricityPriceA.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.electricityPriceA;
      const finalElecB = asumsiParameter.value.parameterTeknis.electricityPriceB.includes('.') ? asumsiParameter.value.parameterTeknis.electricityPriceB.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.electricityPriceB;
      const finalElecC = asumsiParameter.value.parameterTeknis.electricityPriceC.includes('.') ? asumsiParameter.value.parameterTeknis.electricityPriceC.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.electricityPriceC;
      const finalElecD = asumsiParameter.value.parameterTeknis.electricityPriceD.includes('.') ? asumsiParameter.value.parameterTeknis.electricityPriceD.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.electricityPriceD;
      var formParameterUpdate = {};
      // if (kodePengelola.value === 'PIP') {
      formParameterUpdate = {
        id_asumsi: idAsumsi.value,
        id_mesin: idMesin,
        tahun: tahunBerjalan,
        tahun_realisasi: tahunBerjalan - 1,
        nphr: parseFloat(finalNPHR.replace(/,/g, '.')),
        auxiliary: parseFloat(finalAuxiliary.replace(/,/g, '.')),
        susut_trafo: parseFloat(finalSusutTrafo.replace(/,/g, '.')),
        ps: parseFloat(finalPemakaianSendiri.replace(/,/g, '.')),
        electricity_price_a_rp_per_kwbln: parseFloat(finalElecA.replace(/,/g, '.')),
        electricity_price_b_rp_per_kwbln: parseFloat(finalElecB.replace(/,/g, '.')),
        electricity_price_c_rp_per_kwh: parseFloat(finalElecC.replace(/,/g, '.')),
        electricity_price_d_rp_per_kwh: parseFloat(finalElecD.replace(/,/g, '.')),
        harga_bahan_bakars: finalBahanBakars
      }
      // } else {
      //   formParameterUpdate = {
      //     id_asumsi: idAsumsi.value,
      //     id_mesin: idMesin,
      //     tahun: tahunBerjalan,
      //     tahun_realisasi: tahunBerjalan - 1,
      //     nphr: parseFloat(finalNPHR.replace(/,/g, '.')),
      //     auxiliary: pickedParameterValue.value === 'auxiliarySusut' ? parseFloat(finalAuxiliary.replace(/,/g, '.')) : 0,
      //     susut_trafo: pickedParameterValue.value === 'auxiliarySusut' ? parseFloat(finalSusutTrafo.replace(/,/g, '.')) : 0,
      //     ps: pickedParameterValue.value === 'pemakaianSendiri' ? parseFloat(finalPemakaianSendiri.replace(/,/g, '.')) : 0,
      //     electricity_price_a_rp_per_kwbln: parseFloat(finalElecA.replace(/,/g, '.')),
      //     electricity_price_b_rp_per_kwbln: parseFloat(finalElecB.replace(/,/g, '.')),
      //     electricity_price_c_rp_per_kwh: parseFloat(finalElecC.replace(/,/g, '.')),
      //     electricity_price_d_rp_per_kwh: parseFloat(finalElecD.replace(/,/g, '.')),
      //     harga_bahan_bakars: finalBahanBakars
      //   }
      // }
      await perbaruiDataService.updateParameterTeknisPermanent(formParameterUpdate);

      // Update Data Teknis
      const finalFuelConsumption: any = [];
      for (const itemTeknis of bahanBakarGroup.value.fuelConsumption) {
        let finalItem = itemTeknis.value.includes('.') ? itemTeknis.value.replace(/[.]/g, '') : itemTeknis.value;
        finalFuelConsumption.push({
          id_uraian: itemTeknis.id_uraian,
          value: parseFloat(finalItem.replace(/,/g, '.'))
        })
      }
      const finalNFC = ncf.value.includes('.') ? ncf.value.replace(/[.]/g, '') : ncf.value;
      const finalEAF = eaf.value.includes('.') ? eaf.value.replace(/[.]/g, '') : eaf.value;
      const finalProductionBrutto = productionBrutto.value.includes('.') ? productionBrutto.value.replace(/[.]/g, '') : productionBrutto.value;
      const finalProductionNetto = productionNetto.value.includes('.') ? productionNetto.value.replace(/[.]/g, '') : productionNetto.value;
      const finalEnergySales = energySales.value.includes('.') ? energySales.value.replace(/[.]/g, '') : energySales.value;

      const formDataTeknisUpdate = {
        id_mesin: idMesin,
        tahun: tahunBerjalan,
        tahun_realisasi: tahunBerjalan - 1,
        id_type_periodic: typePeriodic.value,
        // const finalBiayaPeriodicMaintenance = parseFloat(biayaPeriodicMaintenance.value.replace(/,/g, '.'));
        nfc: parseFloat(finalNFC.replace(/,/g, '.')),
        eaf: parseFloat(finalEAF.replace(/,/g, '.')),
        production_bruto: parseFloat(finalProductionBrutto.replace(/,/g, '.')),
        production_netto: parseFloat(finalProductionNetto.replace(/,/g, '.')),
        energy_sales: parseFloat(finalEnergySales.replace(/,/g, '.')),
        fuel_consumption: finalFuelConsumption
      }
      console.log(formDataTeknisUpdate);
      // Matikan Comment dibawah ini jika sudah di FIX API Update Data Teknis
      await perbaruiDataService.updateDataTeknisSimulasi(formDataTeknisUpdate);

      // Update Data Finansial
      for (let index = 0; index < costComponentADetail.value.length; index++) {
        delete costComponentADetail.value[index].id;
      }
      for (const value of costComponentADetail.value) {
        if (value.ai !== '') {
          value.ai = parseFloat(value.ai.toString().replace(/,/g, ''));
        }
        if (value.realisasi_aki !== '') {
          value.realisasi_aki = parseFloat(value.realisasi_aki.toString().replace(/,/g, ''));
        }
      }
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 1')
      const finalCostComponentA = costComponentA.value.includes('.') ? costComponentA.value.replace(/[.]/g, '') : costComponentA.value;
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 2')
      // const finalBiayaPeriodicMaintenance = parseFloat(biayaPeriodicMaintenance.value.replace(/,/g, '.'));
      // const finalCostComponentADetail = costComponentADetail.value;
      const finalCostComponentB = costComponentB.value.includes('.') ? costComponentB.value.replace(/[.]/g, '') : costComponentB.value;
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 3')
      const finalBiayaKepegawaian = biayaKepegawaian.value.includes('.') ? biayaKepegawaian.value.replace(/[.]/g, '') : biayaKepegawaian.value;
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 4')
      console.log(periodicMaintenanceCost.value, 'Cost C Detail 4.1')
      const finalBiayaPeriodic = periodicMaintenanceCost.value.includes('.') ? periodicMaintenanceCost.value.replace(/[.]/g, '') : periodicMaintenanceCost.value;
      console.log(finalBiayaPeriodic, 'Cost C Detail 5')
      const finalBiayaPemeliharaanRutin = biayaPemeliharaanRutin.value.includes('.') ? biayaPemeliharaanRutin.value.replace(/[.]/g, '') : biayaPemeliharaanRutin.value;
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 6')
      const finalBiayaAdministrasiUmum = biayaAdministrasiUmum.value.includes('.') ? biayaAdministrasiUmum.value.replace(/[.]/g, '') : biayaAdministrasiUmum.value;
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 7')
      const finalBiayaPembelianTenagaListrik = biayaPembelianTenagaListrik.value.includes('.') ? biayaPembelianTenagaListrik.value.replace(/[.]/g, '') : biayaPembelianTenagaListrik.value;
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 8')
      const finalBiayaLainLain = biayaLainLain.value.includes('.') ? biayaLainLain.value.replace(/[.]/g, '') : biayaLainLain.value;
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 9')
      const finalOMCost = oMCost.value.includes('.') ? oMCost.value.replace(/[.]/g, '') : oMCost.value;
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 10')
      const finalCostComponentC = costComponentC.value.includes('.') ? costComponentC.value.replace(/[.]/g, '') : costComponentC.value;
      console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail 11')
      const finalCostComponentCDetail = [];

      for (const item of bahanBakarGroup.value.costCDetail) {
        const formattedFuelCost = item.fuel_cost.includes('.') ? item.fuel_cost.replace(/[.]/g, '') : item.fuel_cost;
        console.log(bahanBakarGroup.value.costCDetail, 'Cost C Detail', item.fuel_cost)
        finalCostComponentCDetail.push({
          id_mesin: idMesin,
          tahun: tahunBerjalan - 1,
          kode_bahan_bakar: item.kode_bahan_bakar,
          fuel_cost: parseFloat(formattedFuelCost.replace(/,/g, '.'))
        });
      }
      const finalCostComponentD = costComponentD.value.includes('.') ? costComponentD.value.replace(/[.]/g, '') : costComponentD.value;
      const finalBiayaPelumas = biayaMinyakPelumas.value.includes('.') ? biayaMinyakPelumas.value.replace(/[.]/g, '') : biayaMinyakPelumas.value;
      const finalBahanKimia = bahanKimia.value.includes('.') ? bahanKimia.value.replace(/[.]/g, '') : bahanKimia.value;
      const finalRevenue = totalRevenue.value.includes('.') ? totalRevenue.value.replace(/[.]/g, '') : totalRevenue.value;
      const finalRevenueKompA = revenueKompA.value.includes('.') ? revenueKompA.value.replace(/[.]/g, '') : revenueKompA.value;
      const finalRevenueKompB = revenueKompB.value.includes('.') ? revenueKompB.value.replace(/[.]/g, '') : revenueKompB.value;
      const finalRevenueKompC = revenueKompC.value.includes('.') ? revenueKompC.value.replace(/[.]/g, '') : revenueKompC.value;
      const finalRevenueKompD = revenueKompD.value.includes('.') ? revenueKompD.value.replace(/[.]/g, '') : revenueKompD.value;

      let formDataFinansialUpdate;
      // if (picked.value === 'pisah') {
      formDataFinansialUpdate = {
        id_mesin: idMesin,
        tahun: tahunBerjalan - 1,
        status_b_d: 2,
        cost_component_a: parseFloat(finalCostComponentA.replace(/,/g, '.')),
        cost_component_b: parseFloat(finalCostComponentB.replace(/,/g, '.')),
        cost_component_b_detail: {
          id_ao: 0,
          id_mesin: idMesin,
          tahun: tahunBerjalan - 1,
          biaya_kepegawaian: parseFloat(finalBiayaKepegawaian.replace(/,/g, '.')),
          biaya_pemeliharaan_rutin: parseFloat(finalBiayaPemeliharaanRutin.replace(/,/g, '.')),
          biaya_administrasi_umum: parseFloat(finalBiayaAdministrasiUmum.replace(/,/g, '.')),
          biaya_pembelian_tenaga_listrik: parseFloat(finalBiayaPembelianTenagaListrik.replace(/,/g, '.')),
          biaya_penyusutan_aset_tetap: 0,
          biaya_lain_lain: parseFloat(finalBiayaLainLain.replace(/,/g, '.')),
          biaya_periodic_maintenance_non_mi: 0
        },
        cost_component_c: parseFloat(finalCostComponentC.replace(/,/g, '.')),
        cost_component_c_detail: finalCostComponentCDetail,
        cost_component_d: parseFloat(finalCostComponentD.replace(/,/g, '.')),
        cost_component_d_detail: {
          id_pelumas_bahan_kimia: 0,
          id_mesin: idMesin,
          tahun: tahunBerjalan - 1,
          biaya_pelumas: parseFloat(finalBiayaPelumas.replace(/,/g, '.')),
          biaya_bahan_kimia: parseFloat(finalBahanKimia.replace(/,/g, '.')),
          biaya_lain_lain: 0
        },
        revenue: parseFloat(finalRevenue.replace(/,/g, '.')),
        revenue_a: parseFloat(finalRevenueKompA.replace(/,/g, '.')),
        revenue_b: parseFloat(finalRevenueKompB.replace(/,/g, '.')),
        revenue_c: parseFloat(finalRevenueKompC.replace(/,/g, '.')),
        revenue_d: parseFloat(finalRevenueKompD.replace(/,/g, '.'))
      }
      // } else {
      //   formDataFinansialUpdate = {
      //     id_mesin: idMesin,
      //     tahun: tahunBerjalan - 1,
      //     status_b_d: 1,
      //     cost_component_a: parseFloat(finalCostComponentA.replace(/,/g, '.')),
      //     cost_component_b: parseFloat(finalCostComponentB.replace(/,/g, '.')),
      //     cost_component_b_detail: {
      //       id_ao: 0,
      //       id_mesin: idMesin,
      //       tahun: tahunBerjalan - 1,
      //       biaya_kepegawaian: 0,
      //       biaya_pemeliharaan_rutin: 0,
      //       biaya_administrasi_umum: 0,
      //       biaya_pembelian_tenaga_listrik: 0,
      //       biaya_penyusutan_aset_tetap: 0,
      //       biaya_lain_lain: parseFloat(finalOMCost.replace(/,/g, '.')),
      //       biaya_periodic_maintenance_non_mi: parseFloat(finalBiayaPeriodic.replace(/,/g, '.'))
      //     },
      //     cost_component_c: parseFloat(finalCostComponentC.replace(/,/g, '.')),
      //     cost_component_c_detail: finalCostComponentCDetail,
      //     cost_component_d: 0,
      //     cost_component_d_detail: {
      //       id_pelumas_bahan_kimia: 0,
      //       id_mesin: idMesin,
      //       tahun: tahunBerjalan - 1,
      //       biaya_pelumas: 0,
      //       biaya_bahan_kimia: 0,
      //       biaya_lain_lain: 0
      //     },
      //     revenue: parseFloat(finalRevenue.replace(/,/g, '.')),
      //     revenue_a: parseFloat(finalRevenueKompA.replace(/,/g, '.')),
      //     revenue_b: parseFloat(finalRevenueKompB.replace(/,/g, '.')),
      //     revenue_c: parseFloat(finalRevenueKompC.replace(/,/g, '.')),
      //     revenue_d: parseFloat(finalRevenueKompD.replace(/,/g, '.'))
      //   }
      // }
      await perbaruiDataService.updateDataFinansialSimulasi(formDataFinansialUpdate);
      // Handle Sesudah Submit
      bahanBakarGroup.value.fuelConsumption = [];
      isLoading.value = false;
      isSuccessSimulasi.value = true;
      await wait(3000);
      isSuccessSimulasi.value = false;
      isLoading.value = true;
      // Disini harusnya fetching data lagi
      await fetchAsumsiParameter();
      await fetchDataFinansialDetail();
      await fetchDataTeknisByPeriode();
      await fetchDataTeknisSimulasi1();
      await fetchDataTeknisSimulasi2();
      await fetchDataFinansialSimulasi1();
      await fetchDataFinansialSimulasi2();
      await fetchHasilSimulasi1();
      await fetchHasilSimulasi2();
      console.log(bahanBakarGroup.value);
      storePerbaruiTab.currentTab = 'Opsi Simulasi';
    } catch (error: any) {
      console.error('Update Error : ' + error);
      notifyError('Update Error: ' + error.response.data.message, 1000);
    } finally {
      isLoading.value = false;
    }
  }
}
const handleFinalSubmit = async () => {
  try {
    console.log(dataTeknisSimulasi1.value)
    console.log(dataTeknisSimulasi2.value)
    isShowFinalConfirmation.value = false;
    isShowModalEvidence.value = false;
    isLoading.value = true;
    if (selectedSimulasiTab.value === 'Simulasi 1') {
      const finalCostComponentCDetail = [];
      for (const item of formFinansialSimulasi1.value.cost_component_c_detail) {
        const formattedFuelCost = item.fuel_cost.includes('.') ? item.fuel_cost.replace(/[.]/g, '') : item.fuel_cost;
        finalCostComponentCDetail.push({
          id_mesin: idMesin,
          tahun: tahunBerjalan - 1,
          kode_bahan_bakar: item.kode_bahan_bakar,
          fuel_cost: parseFloat(formattedFuelCost.replace(/,/g, '.'))
        });
      }
      formFinansialSimulasi1.value.cost_component_c_detail = finalCostComponentCDetail;
      if (selectedFileEvidence.value) {
        await uploadFileEvidence();
      }
      isLoading.value = true;
      await perbaruiDataService.updateDataTeknisPermanent(dataTeknisSimulasi1.value);
      await perbaruiDataService.updateDataFinansialPermanent(formFinansialSimulasi1.value);
    } else {
      if (selectedFileEvidence.value) {
        await uploadFileEvidence();
      }
      isLoading.value = true;
      await perbaruiDataService.updateDataTeknisPermanent(dataTeknisSimulasi2.value);
      await perbaruiDataService.updateDataFinansialPermanent(formFinansialSimulasi2.value);
    }
    isShowFinalConfirmation.value = false;
    isShowModalEvidence.value = false;
    isLoading.value = false;
    isFinalSubmitSuccess.value = true;
    await wait(3000);
    isFinalSubmitSuccess.value = false;
    if (authService.checkLevel() === 'Sentral') {
      router.replace({ name: 'persetujuan-kk', params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(idMesin) : idMesin }, query: { id_sentral: idSentral.value, tahun: tahunBerjalan } });
    } else {
      router.replace({ name: 'persetujuan-by-approve' });
    }
  } catch (error) {
    console.error('Final Submit Error : ' + error);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
}
const toggleRowSimulasi1 = (itemId: number) => {
  if (isRowOpenSimulasi1(itemId)) {
    isRowTabOpenSimulasi1.value = isRowTabOpenSimulasi1.value.filter(
      (id) => id !== itemId
    );
  } else {
    isRowTabOpenSimulasi1.value.push(itemId);
  }
};

const isRowOpenSimulasi1 = (itemId: number) => {
  return isRowTabOpenSimulasi1.value.includes(itemId);
};

const toggleRowSimulasi2 = (itemId: number) => {
  if (isRowOpenSimulasi2(itemId)) {
    isRowTabOpenSimulasi2.value = isRowTabOpenSimulasi2.value.filter(
      (id) => id !== itemId
    );
  } else {
    isRowTabOpenSimulasi2.value.push(itemId);
  }
};

const isRowOpenSimulasi2 = (itemId: number) => {
  return isRowTabOpenSimulasi2.value.includes(itemId);
};
const handleDownloadExcelSimulasi1 = async () => {
  try {
    isLoading.value = true;
    console.log('Form 1', formFinansialSimulasi1.value);
    console.log('Form 2', formFinansialSimulasi2.value);
    const response: any = await rekapService.downloadSimulasi1(tahunBerjalan, tahunBerjalan - 1, idMesin);
    console.log(response);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Simulasi 1 - Kertas Kerja Actual - ${mesinDataById.value?.mesin}_${tahunBerjalan}_${globalFormat.formatNumberFiveDigits(idMesin)}.xlsx`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    isLoading.value = false;
  } catch (error) {
    console.error('Handle Download Template Rekap Error : ' + error);
  } finally {
    isLoading.value = false;
  }
}
const handleDownloadExcelSimulasi2 = async () => {
  try {
    isLoading.value = true;
    const response: any = await rekapService.downloadSimulasi2(tahunBerjalan, tahunBerjalan - 1, idMesin);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Simulasi 2 - Kertas Kerja Actual - ${mesinDataById.value?.mesin}_${tahunBerjalan}_${globalFormat.formatNumberFiveDigits(idMesin)}.xlsx`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    isLoading.value = false;
  } catch (error) {
    console.error('Handle Download Template Rekap Error : ' + error);
  } finally {
    isLoading.value = false;
  }
}

onUnmounted(() => {
  storePerbaruiTab.currentTab = 'Asumsi Makro';
});

onMounted(async () => {
  await fetchMesinById();
  await fetchUnitPengelola();
  await fetchPersetujuanKK();
  await fetchCheckIntegrasi();
  await fetchComboBahanBakar();
  await fetchAsumsiParameter();
  await fetchComboTypePeriodic();
  await fetchDataFinansialDetail();
  await fetchDataTeknisByPeriode();
  await fetchDataTeknisSimulasi1();
  await fetchDataTeknisSimulasi2();
  await fetchDataFinansialSimulasi1();
  await fetchDataFinansialSimulasi2();
  await fetchHasilSimulasi1();
  await fetchHasilSimulasi2();
  await fetchListTypePeriodic();
  isLoading.value = false;
});
</script>

<style scoped>
button:hover svg g path {
  fill: white;
}

th {
  font-weight: 700;
  padding: 1rem;
}

td {
  padding: 1rem;
}

li.selected #triangle {
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 5px 0 5px 9px;
  border-color: transparent transparent transparent #0099AD;
  transform: rotate(0deg);
  transition-delay: 300ms;
}

li.selected#aside {
  color: #0099AD;
  font-weight: 600;
}

li.selected#tab {
  outline: 1px solid #0099AD;
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

:disabled {
  background-color: #F5F5F5;
  cursor: not-allowed;
}
</style>
