<template>
  <Loading v-if="isLoading" />
  <ModalNotification :show-modal="isShowModalNotification" :animation-data="errorJsonData" :title="'Data gagal dikirim'"
    :subtitle="'Semua input wajib diisi, mohon cek kembali inputan anda'" />
  <ModalNotification :show-modal="isSuccessSimulasi" :animation-data="successJsonData" :title="'Data berhasil dikirim'"
    :subtitle="'Data telah berhasil dikirim, silahkan lanjutkan perbarui dengan memilih opsi simulasi'" />
  <ModalNotification :show-modal="isSuccessPermanent" :animation-data="successJsonData"
    :title="'Data berhasil disimpan'" :subtitle="'Data telah berhasil disimpan'" />
  <ModalWrapper :show-modal="isShowModalConfirmation" :width="'w-auto'" :height="'h-auto'">
    <ConfirmationDialog :title="'Konfirmasi'"
      :subtitle="'Apakah anda yakin menyimpan? <br>Inputan tidak dapat diubah jika sudah disimpan'"
      :button-title="'Kirim'" @on-batal-click="isShowModalConfirmation = false" @on-accept-click="handleSubmit" />
  </ModalWrapper>
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
  <ModalWrapper :show-modal="isUnggahModalOpen" :width="'w-[750px]'" :height="'h-auto'"
    @on-escape="isUnggahModalOpen = false">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-row items-center justify-between">
        <p class="text-xl font-bold text-primaryTextColor">Unggah Kertas Kerja</p>
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
            <p>{{ selectedFile.name }} ({{ formatBytes(selectedFile.size) }})</p>
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
  <div class="space-y-4" v-if="mesinDataById && simulasiAsumsiParameter">
    <InfoHeader :nama-mesin="mesinDataById.mesin" :nama-pengelola="namaPengelola"
      :kondisi-unit="mesinDataById.kondisi_unit" :kode-jenis-pembangkit="mesinDataById.kode_jenis_pembangkit"
      :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
      :tahun-operasi="mesinDataById.tahun_operasi.toString()" :umur-teknis="asumsiParameter.asumsiMakro.umurTeknis">
    </InfoHeader>
    <div class="items-start min-h-screen p-6 bg-white rounded-lg">
      <TabsWrapper :laman-data="false">
        <TabItem title="Asumsi Makro">
          <TabAsumsiMakro :error="error.asumsi" :isAsumsiUpdated="statusAsumsi === 'update'"
            :tahun-realisasi="tahunRealisasiUpdate" :mesin="mesinDataById.mesin"
            v-model:interest-rate="asumsiParameter.asumsiMakro.interestRate"
            v-model:umur-teknis="asumsiParameter.asumsiMakro.umurTeknis"
            v-model:loan-tenor="asumsiParameter.asumsiMakro.loanTenor"
            v-model:loan-portion="asumsiParameter.asumsiMakro.loanPortion" :umur-teknis-init="masaManfaat.toString()" />
        </TabItem>
        <TabItem title="Parameter Teknis & Finansial">
          <TabParameterTeknis :isParameterUpdated="statusAsumsi === 'update'" :combo-bahan-bakar="comboBahanBakar"
            :init-auxiliary="asumsiParameter.parameterTeknis.auxiliary"
            :init-susut-trafo="asumsiParameter.parameterTeknis.susutTrafo"
            :init-pemakaian-sendiri="asumsiParameter.parameterTeknis.pemakaianSendiri" :error="error.parameter"
            @on-hapus-bahan-bakar="handleHapusBahanBakar" @on-tambah-bahan-bakar="handleTambahBahanBakar"
            :tahun-realisasi="tahunRealisasiUpdate" :is-input-asumsi-parameter="false" :mesin="mesinDataById.mesin"
            v-model:nphr="asumsiParameter.parameterTeknis.nphr"
            v-model:auxiliary="asumsiParameter.parameterTeknis.auxiliary"
            v-model:susut-trafo="asumsiParameter.parameterTeknis.susutTrafo"
            v-model:pemakaian-sendiri="asumsiParameter.parameterTeknis.pemakaianSendiri"
            v-model:electricity-price-a="asumsiParameter.parameterTeknis.electricityPriceA"
            v-model:electricity-price-b="asumsiParameter.parameterTeknis.electricityPriceB"
            v-model:electricity-price-c="asumsiParameter.parameterTeknis.electricityPriceC"
            v-model:electricity-price-d="asumsiParameter.parameterTeknis.electricityPriceD"
            v-model:checkedBahanBakar="checkedBahanBakar" v-model:picked-value="pickedParameterValue"
            v-model:bahan-bakars="bahanBakars" />
        </TabItem>
        <TabItem title="Data Teknis">
          <TabDataTeknis :error="error.teknis" :is-data-simulasi="statusDataTeknis === 'Simulasi'"
            :tahun-realisasi="tahunRealisasiUpdate" :mesin="mesinDataById.mesin"
            :combo-type-periodic="comboTypePeriodic" v-model:type-periodic="typePeriodic" v-model:ncf="ncf"
            v-model:eaf="eaf" v-model:production-brutto="productionBrutto" v-model:production-netto="productionNetto"
            v-model:energy-sales="energySales" v-model:fuel-consumption="fuelConsumption" />
        </TabItem>
        <TabItem title="Data Finansial">
          <div class="flex flex-col space-y-3">
            <section class="flex flex-row items-center space-x-1 text-xs">
              <span class="font-medium text-gray-400">Periode : </span>
              <span class="font-semibold">{{ tahunRealisasiUpdate }}</span>
              <span class="text-gray-200"> / </span>
              <span class="font-medium text-gray-400">Unit : </span>
              <span class="font-semibold">{{ mesinDataById.mesin }}</span>
              <span class="text-gray-200"> / </span>
              <span class="mr-1.5 font-medium text-gray-400">Catatan : </span>
              <div class="flex flex-row items-center space-x-1">
                <WarningIcon />
                <span class="text-warningColor" v-if="statusDataFinansial === 'Simulasi'">Data yang
                  ditampilkan
                  merupakan data simulasi,
                  mohon pilih opsi simulasi untuk mengubah ke data tetap</span>
                <span class="text-warningColor" v-else>Data yang ditampilkan merupakan data tahun
                  sebelumnya, silahkan
                  lakukan
                  update
                  terhadap data tersebut!</span>
              </div>
            </section>
            <div class="flex flex-col space-y-8">
              <div class="flex flex-col space-y-3.5">
                <div
                  class="w-full p-3 flex flex-col bg-infoComponentBorderColor bg-opacity-10 border border-infoComponentBorderColor rounded-lg space-y-1.5">
                  <div class="flex items-center space-x-2">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M11 3.66732C6.94995 3.66732 3.66671 6.95056 3.66671 11.0007C3.66671 15.0507 6.94995 18.334 11 18.334C15.0501 18.334 18.3334 15.0507 18.3334 11.0007C18.3334 6.95056 15.0501 3.66732 11 3.66732ZM1.83337 11.0007C1.83337 5.93804 5.93743 1.83398 11 1.83398C16.0626 1.83398 20.1667 5.93804 20.1667 11.0007C20.1667 16.0633 16.0626 20.1673 11 20.1673C5.93743 20.1673 1.83337 16.0633 1.83337 11.0007ZM11 7.33398C11.5063 7.33398 11.9167 7.74439 11.9167 8.25065V11.6882C11.9167 12.1944 11.5063 12.6048 11 12.6048C10.4938 12.6048 10.0834 12.1944 10.0834 11.6882V8.25065C10.0834 7.74439 10.4938 7.33398 11 7.33398ZM10.0834 14.4382C10.0834 13.9319 10.4938 13.5215 11 13.5215H11.0069C11.5132 13.5215 11.9236 13.9319 11.9236 14.4382V14.445C11.9236 14.9513 11.5132 15.3617 11.0069 15.3617H11C10.4938 15.3617 10.0834 14.9513 10.0834 14.445V14.4382Z"
                        fill="#4791F2" />
                    </svg>
                    <p class="text-base font-semibold">Informasi Cost Component B dan D</p>
                  </div>
                  <p class="text-sm text-gray-500 whitespace-normal">Apabila Cost Component B dan D
                    digabung,
                    maka data yang diinputkan pada
                    kolom total Cost Component B dan D
                    merupakan hasil penggabungan dari Cost Component B dan Cost Component D
                  </p>
                </div>
                <div class="flex space-x-3">
                  <div class="flex space-x-1.5">
                    <input type="radio" id="gabung" name="radio-1" class="radio radio-sm radio-info" value="gabung"
                      v-model="picked" />
                    <label class="text-sm" for="gabung">Gabung</label>
                  </div>
                  <div class="flex space-x-3">
                    <div class="flex space-x-1.5">
                      <input type="radio" id="pisah" name="radio-1" class="radio radio-sm radio-info" value="pisah"
                        v-model="picked" checked />
                      <label class="text-sm" for="pisah">Pisah</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col space-y-8">
                <div class="flex flex-col space-y-3">
                  <div class="flex flex-row space-x-2">
                    <div class="w-1 rounded-md bg-primaryColor"></div>
                    <h3 class="text-base font-semibold">
                      Cost Component A
                      <span class="text-xs text-textDisabledColor">Pengisian dalam Rp
                        (Juta)</span>
                    </h3>
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <label for="" class="text-sm font-semibold text-labelColor">Replacement Cost /
                      Investment Cost (Cost
                      Component
                      A) </label>
                    <div class="flex items-center justify-start">
                      <TextField @on-input="handleInputDecimalRupiah('costComponentA')" v-model="costComponentA"
                        class="pl-9" />
                      <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                    </div>
                    <div class="text-xs text-warningColor" v-if="error.finansial.costComponentA === true">
                      Biaya Investasi Tambahan (Non AI-AKI) & Biaya Periodic Maintenance (MI)
                      wajib diisi
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-3" v-if="picked === 'pisah'">
                  <div class="flex flex-row space-x-2">
                    <div class="w-1 rounded-md bg-primaryColor"></div>
                    <h3 class="text-base font-semibold">
                      Cost Component B
                      <span class="text-xs text-textDisabledColor">Pengisian dalam Rp
                        (Juta)</span>
                    </h3>
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <label for="" class="text-sm font-semibold text-labelColor">Total Cost Component
                      B</label>
                    <div class="flex items-center justify-start">
                      <TextField @on-input="handleInputDecimalRupiah('costComponentB')" v-model="costComponentB"
                        class="pl-9" />
                      <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                    </div>
                    <div class="text-xs text-warningColor" v-if="error.finansial.costComponentB === true">Semua
                      input Cost Component B wajib diisi</div>
                  </div>
                  <div class="grid grid-cols-4 gap-3">
                    <div class="flex flex-col space-y-1.5">
                      <label for="" class="text-sm font-semibold text-labelColor">Biaya
                        Kepegawaian <span class="text-warningColor">*</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('biayaKepegawaian')" v-model="biayaKepegawaian"
                          class="pl-9" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                      <div class="text-xs text-warningColor" v-if="error.finansial.biayaKepegawaian === true">
                        Biaya Kepegawaian wajib diisi</div>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <label for="" class="text-sm font-semibold text-labelColor">Biaya
                        Pemeliharaan Rutin <span class="text-warningColor">*</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('biayaPemeliharaanRutin')"
                          v-model="biayaPemeliharaanRutin" class="pl-9" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                      <div class="text-xs text-warningColor" v-if="error.finansial.biayaPemeliharaanRutin === true">
                        Biaya Pemeliharaan Rutin wajib diisi</div>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <label for="" class="text-sm font-semibold text-labelColor">Biaya
                        Administrasi dan Umum <span class="text-warningColor">*</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('biayaAdministrasiUmum')"
                          v-model="biayaAdministrasiUmum" class="pl-9" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                      <div class="text-xs text-warningColor" v-if="error.finansial.biayaAdministrasiUmum === true">
                        Biaya Administrasi Umum wajib diisi</div>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <label for="" class="text-sm font-semibold text-labelColor">Biaya Pembelian
                        Tenaga Listrik <span class="text-warningColor">*</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('biayaPembelianTenagaListrik')"
                          v-model="biayaPembelianTenagaListrik" class="pl-9" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                      <div class="text-xs text-warningColor"
                        v-if="error.finansial.biayaPembelianTenagaListrik === true">
                        Biaya Pembelian Tenaga Listrik wajib diisi</div>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <label for="" class="text-sm font-semibold text-labelColor">Biaya Lain-Lain
                        <span class="text-warningColor">*</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('biayaLainLain')" v-model="biayaLainLain"
                          class="pl-9" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                      <div class="text-xs text-warningColor" v-if="error.finansial.biayaLainLain === true">
                        Biaya lain-lain wajib diisi</div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-3" v-else>
                  <div class="flex flex-row space-x-2">
                    <div class="w-1 rounded-md bg-primaryColor"></div>
                    <h3 class="text-base font-semibold">
                      Cost Component B dan D
                      <span class="text-xs text-textDisabledColor">Pengisian dalam Rp
                        (Juta)</span>
                    </h3>
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <label for="" class="text-sm font-semibold text-labelColor">Total Cost Component
                      B dan D</label>
                    <div class="flex items-center justify-start">
                      <TextField @on-input="handleInputDecimalRupiah('costComponentB')" v-model="costComponentB"
                        class="pl-9" />
                      <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-6">
                    <div class="flex flex-col space-y-1.5">
                      <label for="" class="text-sm font-semibold text-labelColor">O&M Cost <span
                          class="text-warningColor">*</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('oMCost')" v-model="oMCost" class="pl-9" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <label for="" class="text-sm font-semibold text-labelColor">Periodic
                        Maintenance Cost (Non MI)
                        <span class="text-warningColor">*</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('periodicMaintenanceCost')"
                          v-model="periodicMaintenanceCost" class="pl-9" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-3">
                  <div class="flex flex-row space-x-2">
                    <div class="w-1 rounded-md bg-primaryColor"></div>
                    <h3 class="text-base font-semibold">
                      Cost Component C
                      <span class="text-xs text-textDisabledColor">Pengisian dalam Rp
                        (Juta)</span>
                    </h3>
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <label for="" class="text-sm font-semibold text-labelColor">Total Cost Component
                      C </label>
                    <div class="flex items-center justify-start">
                      <TextField @on-input="handleInputDecimalRupiah('costComponentC')" v-model="costComponentC"
                        class="pl-9" />
                      <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                    </div>
                    <div class="text-xs text-warningColor" v-if="error.finansial.costComponentC === true">Semua Input
                      Cost
                      Component C wajib diisi</div>
                  </div>
                  <div class="grid grid-cols-4 gap-3" v-if="costComponentCDetail">
                    <div class="flex flex-col space-y-1.5"
                      v-for="(componentCItem, componentCIndex) in costComponentCDetail">
                      <label for="" class="text-sm font-semibold text-labelColor">{{
                        componentCItem.kode_bahan_bakar
                        }}<span class="text-warningColor"> *</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('componentCDetail', componentCIndex)"
                          class="pl-9" v-model="componentCItem.harga_bahan_bakar" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                      <div class="text-xs text-warningColor" v-if="error.finansial.costComponentCDetail === true">Cost
                        Component C Detail wajib diisi</div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-3" v-if="picked === 'pisah'">
                  <div class="flex flex-row space-x-2">
                    <div class="w-1 rounded-md bg-primaryColor"></div>
                    <h3 class="text-base font-semibold">
                      Cost Component D
                      <span class="text-xs text-textDisabledColor">Pengisian dalam Rp
                        (Juta)</span>
                    </h3>
                  </div>
                  <div class="flex flex-col space-y-1.5">
                    <label for="" class="text-sm font-semibold text-labelColor">Total Cost Component
                      D</label>
                    <div class="flex items-center justify-start">
                      <TextField @on-input="handleInputDecimalRupiah('costComponentD')" v-model="costComponentD"
                        class="pl-9" />
                      <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                    </div>
                    <div class="text-xs text-warningColor" v-if="error.finansial.costComponentD === true">
                      Semua input Cost Component D wajib diisi</div>
                  </div>
                  <div class="grid grid-cols-4 gap-x-5">
                    <div class="flex flex-col space-y-1.5">
                      <label for="" class="text-sm font-semibold text-labelColor">Biaya Minyak
                        Pelumas <span class="text-warningColor">*</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('biayaMinyakPelumas')"
                          v-model="biayaMinyakPelumas" class="pl-9" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                      <div class="text-xs text-warningColor" v-if="error.finansial.biayaMinyakPelumas === true">
                        Biaya Minyak Pelumas wajib diisi</div>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <label for="" class="text-sm font-semibold text-labelColor">Biaya Bahan
                        Kimia <span class="text-warningColor">*</span></label>
                      <div class="flex items-center justify-start">
                        <TextField @on-input="handleInputDecimalRupiah('bahanKimia')" v-model="bahanKimia"
                          class="pl-9" />
                        <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
                      </div>
                      <div class="text-xs text-warningColor" v-if="error.finansial.biayaBahanKimia === true">
                        Biaya Bahan Kimia wajib diisi</div>
                    </div>
                  </div>
                </div>
                <button
                  class="px-3 py-2 ml-auto font-semibold text-white rounded-lg bg-primaryColor hover:bg-hoverColor active:outline active:outline-primaryColor hover:duration-300 active:duration-0"
                  @click="isShowModalConfirmation = true">
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </TabItem>
        <TabItem title="Opsi Simulasi" v-if="statusAsumsi === 'update'">
          <div class="flex flex-col w-full space-y-5">
            <div class="flex flex-row w-full">
              <aside class="w-auto mt-6 mr-10">
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
                </ul>
              </aside>
              <section class="w-full mt-2 space-y-3.5" v-if="selectedAside === 'Asumsi Makro'">
                <nav class=" bg-primaryColor bg-opacity-5 p-1.5 rounded-lg">
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
                <div v-if="selectedSimulasiTab === 'Simulasi 1'" class="flex flex-col space-y-3.5">
                  <InfoComponent simulasi="Simulasi 1" proyeksi="Proyeksi Sebelumnya" />
                  <div class="flex flex-row items-center justify-between">
                    <h1 class="text-lg font-semibold">Simulasi - Asumsi Makro</h1>
                    <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                      @click="handleDownloadExcelSimulasi1">Unduh</button>
                  </div>
                  <AsumsiInfoBox :simulasi-asumsi-makro="simulasiAsumsiParameter.asumsi_makro"
                    :periode="tahunRealisasiUpdate" />
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
                    :periode="tahunRealisasiUpdate" />
                </div>
              </section>
              <section class="w-full mt-2 space-y-3.5" v-if="selectedAside === 'Parameter Teknis'">
                <nav class=" bg-primaryColor bg-opacity-5 p-1.5 rounded-lg">
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
                <div v-if="selectedSimulasiTab === 'Simulasi 1'" class="flex flex-col space-y-3.5">
                  <InfoComponent simulasi="Simulasi 1" proyeksi="Proyeksi Sebelumnya" />
                  <div class="flex flex-row items-center justify-between">
                    <h1 class="text-lg font-semibold">Simulasi - Parameter Teknis & Finansial</h1>
                    <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                      @click="handleDownloadExcelSimulasi1">Unduh</button>
                  </div>
                  <ParameterTeknisInfoBox :parameter-teknis="simulasiAsumsiParameter.parameter_teknis_financial"
                    :bahan-bakars="simulasiAsumsiParameter.bahan_bakars" :periode="tahunRealisasiUpdate" />
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
                  <ParameterTeknisInfoBox :parameter-teknis="simulasiAsumsiParameter.parameter_teknis_financial"
                    :bahan-bakars="simulasiAsumsiParameter.bahan_bakars" :periode="tahunRealisasiUpdate" />
                </div>
              </section>
              <section class="w-full overflow-clip mt-2 space-y-3.5" v-if="selectedAside === 'Data Teknis'">
                <nav class="bg-primaryColor bg-opacity-5 p-1.5 rounded-lg">
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
                <div v-if="selectedSimulasiTab === 'Simulasi 1'" class="flex flex-col space-y-3.5">
                  <InfoComponent simulasi="Simulasi 1" proyeksi="Proyeksi Sebelumnya" />
                  <div class="flex items-center justify-between w-full">
                    <h1 class="text-lg font-semibold">Simulasi - Data Teknis</h1>
                    <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                      @click="handleDownloadExcelSimulasi1">Unduh</button>
                  </div>
                  <div class="w-full overflow-auto border rounded-lg whitespace-nowrap">
                    <table v-if="simulasi1DataTeknis">
                      <thead>
                        <tr class="text-[#0099AD] text-sm text-left border-b-2">
                          <th class="sticky left-0 z-10 bg-white">No</th>
                          <th class="sticky z-10 bg-white left-10">Nama</th>
                          <th class="text-center" v-for="(item, index) in simulasi1DataTeknis.tahun.length === 0
                              ? 1
                              : simulasi1DataTeknis.tahun" :key="index" :class="{
                                'text-warningColor': item < tahunBerjalan,
                                'text-black': item === tahunBerjalan,
                                'text-[#0099AD]': item > tahunBerjalan,
                              }">
                            {{ simulasi1DataTeknis.tahun.length === 0 ? "-" : item }} <br>
                            <span class="text-xs font-normal">{{ index
                              }}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in simulasi1DataTeknis.detail" :key="index">
                          <td class="sticky left-0 z-10 bg-white">{{ index + 1 }}</td>
                          <td class="sticky z-10 bg-white left-10">{{ item.uraian }}</td>
                          <td v-for="(items, indexs) in simulasi1DataTeknis.tahun.length === 0
                              ? 1
                              : simulasi1DataTeknis.tahun" :key="indexs"
                            :class="{ 'text-right': item.uraian !== 'Type of Periodic Maintenance', 'text-center': item.uraian == 'Type of Periodic Maintenance', 'bg-blue-50': items === tahunBerjalan }">
                            {{
                            simulasi1DataTeknis.tahun
                            ? item["t" + items] != null
                            ? item.uraian === 'Type of Periodic Maintenance' ? item["t" +
                            items] === 0 ? '-' :
                            getTypePeriodic(item["t" + items]) :
                            globalFormat.formatRupiah(item["t" + items])
                            : "-"
                            : "-"
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-if="selectedSimulasiTab === 'Simulasi 2'" class="flex flex-col space-y-3.5">
                  <div class="flex items-center justify-between w-full">
                    <h1 class="text-lg font-semibold">Simulasi - Data Teknis</h1>
                    <div class="flex flex-row space-x-3">
                      <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                        @click="isUnggahModalOpen = true">Unggah</button>
                      <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                        @click="handleDownloadExcelSimulasi2">Unduh</button>
                    </div>
                  </div>
                  <div class="w-full overflow-auto border rounded-lg whitespace-nowrap">
                    <table>
                      <thead>
                        <tr class="text-[#0099AD] text-sm text-left border-b-2">
                          <th class="sticky left-0 z-10 bg-white">No</th>
                          <th class="sticky z-10 bg-white left-10">Nama</th>
                          <th class="text-center" v-for="(item, index) in simulasi2DataTeknis.tahun.length === 0
                              ? 1
                              : simulasi2DataTeknis.tahun" :key="index" :class="{
                                'text-warningColor': item < tahunBerjalan,
                                'text-black': item === tahunBerjalan,
                                'text-[#0099AD]': item > tahunBerjalan,
                              }">
                            {{ simulasi2DataTeknis.tahun.length === 0 ? "-" : item }} <br>
                            <span class="text-xs font-normal">{{ index
                              }}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in simulasi2DataTeknis.detail" :key="index">
                          <td class="sticky left-0 z-10 bg-white">{{ index + 1 }}</td>
                          <td class="sticky z-10 bg-white left-10">{{ item.uraian }}</td>
                          <td v-for="(items, indexs) in simulasi2DataTeknis.tahun.length === 0
                              ? 1
                              : simulasi2DataTeknis.tahun" :key="indexs"
                            :class="{ 'text-right': item.uraian !== 'Type of Periodic Maintenance', 'text-center': item.uraian == 'Type of Periodic Maintenance', 'bg-blue-50': items === tahunBerjalan }">
                            {{
                            simulasi2DataTeknis.tahun
                            ? item["t" + items] != null
                            ? item.uraian === 'Type of Periodic Maintenance' ? item["t" +
                            items] === 0 ? '-' :
                            getTypePeriodic(item["t" + items]) :
                            globalFormat.formatRupiah(item["t" + items])
                            : "-"
                            : "-"
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
              <section class="w-full overflow-clip mt-2 space-y-3.5" v-if="selectedAside === 'Data Finansial'">
                <nav class=" bg-primaryColor bg-opacity-5 p-1.5 rounded-lg">
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
                <div v-if="selectedSimulasiTab === 'Simulasi 1'" class="flex flex-col space-y-3.5">
                  <InfoComponent simulasi="Simulasi 1" proyeksi="Proyeksi Sebelumnya" />
                  <div class="flex items-center justify-between w-full">
                    <h1 class="text-lg font-semibold">Simulasi - Data Finansial</h1>
                    <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                      @click="handleDownloadExcelSimulasi1">Unduh</button>
                  </div>
                  <div class="w-full overflow-auto border rounded-lg whitespace-nowrap" v-if="dataFinansialSimulasi1">
                    <table class="w-full">
                      <thead>
                        <tr class="text-[#0099AD] text-sm text-left border-b-2">
                          <th class="pr-96" id="tableHeader">Nama</th>
                          <th class="text-center"
                            v-for="(tahunItem, tahunIndex) in dataFinansialSimulasi1.tahun.length === 0 ? 1 : dataFinansialSimulasi1.tahun"
                            :key="tahunIndex" :class="{
                                'text-warningColor': tahunItem < tahunBerjalan,
                                'text-black': tahunItem === tahunBerjalan,
                                'text-primaryColor': tahunItem > tahunBerjalan,
                              }">
                            {{ dataFinansialSimulasi1.tahun.length === 0 ? '-' : tahunItem
                            }} <br> <span class="text-xs font-normal">{{ tahunIndex
                              }}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody v-for="(level1, level1Index) in simulasi1DataFinansial" :key="level1Index"
                        v-auto-animate="{ duration: 300 }">
                        <tr class="text-sm cursor-pointer bg-strokeColor bg-opacity-40 active:bg-opacity-90"
                          @click="toggleRowSimulasi1(level1.id_uraian)">
                          <td class="border-b"
                            :colspan="dataFinansialSimulasi1.tahun.length === 0 ? 2 : dataFinansialSimulasi1.tahun.length + 1">
                            <div class="flex flex-row items-center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                v-if="!isRowOpenSimulasi1(level1.id_uraian)">
                                <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                                  fill="white" />
                              </svg>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg" class="mr-2" v-else>
                                <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                                  fill="white" />
                              </svg>
                              <span>{{ level1.uraian }}</span>
                            </div>
                          </td>
                        </tr>
                        <template v-for="(level2, level2Index) in level1.level2" :key="level2Index"
                          v-if="isRowOpenSimulasi1(level1.id_uraian)">
                          <tr class="text-sm cursor-pointer active:bg-strokeColor active:bg-opacity-30"
                            @click="toggleRowSimulasi1(level2.id_uraian)">
                            <td id="level2" :class="{ selected: level2.level3.length === 0 }">
                              <div class="flex flex-row items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                  xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                  v-if="!isRowOpenSimulasi1(level2.id_uraian) && level2.level3.length !== 0">
                                  <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                                    fill="white" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                  xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                  v-else-if="isRowOpenSimulasi1(level2.id_uraian) && level2.level3.length !== 0">
                                  <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                                    fill="white" />
                                </svg>
                                <span>{{ level2.uraian }}</span>
                              </div>
                            </td>
                            <td class="text-right"
                              v-for="(tahun, tahunIndex) in dataFinansialSimulasi1.tahun.length === 0 ? 1 : dataFinansialSimulasi1.tahun"
                              :class="{ 'bg-blue-50': tahun === tahunBerjalan }">
                              {{ dataFinansialSimulasi1.tahun ?
                              level2.uraian.includes('Kalkulasi' || 'kalkulasi') ? '' :
                              level2['t' +
                              tahun]
                              == null ? '-' : globalFormat.formatRupiah(level2['t' +
                              tahun])
                              : '-' }}
                            </td>
                          </tr>
                          <template v-for="(level3, level3Index) in level2.level3" :key="level3Index"
                            v-if="isRowOpenSimulasi1(level2.id_uraian)">
                            <tr class="text-sm cursor-pointer" @click="toggleRowSimulasi1(level3.id_uraian)">
                              <td id="level3" :class="{ selected: level3.level4.length === 0 }">
                                <div class="flex flex-row items-center">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                    v-if="!isRowOpenSimulasi1(level3.id_uraian) && level3.level4.length !== 0">
                                    <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                                      fill="white" />
                                  </svg>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                    v-else-if="isRowOpenSimulasi1(level3.id_uraian) && level3.level4.length !== 0">
                                    <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                                      fill="white" />
                                  </svg>
                                  <span>{{ level3.uraian }}</span>
                                </div>
                              </td>
                              <td class="text-right"
                                v-for="(tahun, tahunIndex) in dataFinansialSimulasi1.tahun.length === 0 ? 1 : dataFinansialSimulasi1.tahun"
                                :class="{ 'bg-blue-50': tahun === tahunBerjalan }">
                                {{ dataFinansialSimulasi1.tahun ?
                                level3.uraian.includes('Kalkulasi' || 'kalkulasi') ? ''
                                : level3['t' +
                                tahun]
                                == null ? '-'
                                : globalFormat.formatRupiah(level3['t' + tahun])
                                : '-' }}
                              </td>
                            </tr>
                            <template v-for="(level4, level4Index) in level3.level4" :key="level4Index"
                              v-if="isRowOpenSimulasi1(level3.id_uraian)">
                              <tr class="text-sm">
                                <td id="level4">{{ level4.uraian }}</td>
                                <td class="text-right"
                                  v-for="(tahun, tahunIndex) in dataFinansialSimulasi1.tahun.length === 0 ? 1 : dataFinansialSimulasi1.tahun"
                                  :class="{ 'bg-blue-50': tahun === tahunBerjalan }">
                                  {{ dataFinansialSimulasi1.tahun ?
                                  level4.uraian.includes('Kalkulasi' || 'kalkulasi') ?
                                  '' : level4['t'
                                  +
                                  tahun] == null ? '-' :
                                  globalFormat.formatRupiah(level4['t' + tahun]) : '-'
                                  }}
                                </td>
                              </tr>
                            </template>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-if="selectedSimulasiTab === 'Simulasi 2'" class="flex flex-col space-y-3.5">
                  <div class="flex items-center justify-between w-full">
                    <h1 class="text-lg font-semibold">Simulasi - Data Finansial</h1>
                    <div class="flex flex-row space-x-3">
                      <button class="px-3 py-2 font-semibold rounded-lg text-primaryColor"
                        @click="isUnggahModalOpen = true">Unggah</button>
                      <button class="px-3 py-2 font-semibold border rounded-lg border-primaryColor text-primaryColor"
                        @click="handleDownloadExcelSimulasi2">Unduh</button>
                    </div>
                  </div>
                  <div class="w-full overflow-auto border rounded-lg whitespace-nowrap" v-if="dataFinansialSimulasi2">
                    <table class="w-full">
                      <thead>
                        <tr class="text-[#0099AD] text-sm text-left border-b-2">
                          <th class="pr-96" id="tableHeader">Nama</th>
                          <th class="text-center"
                            v-for="(tahunItem, tahunIndex) in dataFinansialSimulasi2.tahun.length === 0 ? 1 : dataFinansialSimulasi2.tahun"
                            :key="tahunIndex" :class="{
                                'text-warningColor': tahunItem < tahunBerjalan,
                                'text-black': tahunItem === tahunBerjalan,
                                'text-primaryColor': tahunItem > tahunBerjalan,
                              }">
                            {{ dataFinansialSimulasi2.tahun.length === 0 ? '-' : tahunItem
                            }} <br> <span class="text-xs font-normal">{{
                              tahunIndex
                              }}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody v-for="(level1, level1Index) in simulasi2DataFinansial" :key="level1Index"
                        v-auto-animate="{ duration: 300 }">
                        <tr class="text-sm cursor-pointer bg-strokeColor bg-opacity-40 active:bg-opacity-90"
                          @click="toggleRowSimulasi2(level1.id_uraian)">
                          <td class="border-b"
                            :colspan="dataFinansialSimulasi2.tahun.length === 0 ? 2 : dataFinansialSimulasi2.tahun.length + 1">
                            <div class="flex flex-row items-center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                v-if="!isRowOpenSimulasi2(level1.id_uraian)">
                                <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                                  fill="white" />
                              </svg>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg" class="mr-2" v-else>
                                <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                                  fill="white" />
                              </svg>
                              <span>{{ level1.uraian }}</span>
                            </div>
                          </td>
                        </tr>
                        <template v-for="(level2, level2Index) in level1.level2" :key="level2Index"
                          v-if="isRowOpenSimulasi2(level1.id_uraian)">
                          <tr class="text-sm cursor-pointer active:bg-strokeColor active:bg-opacity-30"
                            @click="toggleRowSimulasi2(level2.id_uraian)">
                            <td id="level2" :class="{ selected: level2.level3.length === 0 }">
                              <div class="flex flex-row items-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                  xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                  v-if="!isRowOpenSimulasi2(level2.id_uraian) && level2.level3.length !== 0">
                                  <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                                    fill="white" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                  xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                  v-else-if="isRowOpenSimulasi2(level2.id_uraian) && level2.level3.length !== 0">
                                  <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                                    fill="white" />
                                </svg>
                                <span>{{ level2.uraian }}</span>
                              </div>
                            </td>
                            <td class="text-right"
                              v-for="(tahun, tahunIndex) in dataFinansialSimulasi2.tahun.length === 0 ? 1 : dataFinansialSimulasi2.tahun"
                              :class="{ 'bg-blue-50': tahun === tahunBerjalan }">
                              {{ dataFinansialSimulasi2.tahun ?
                              level2.uraian.includes('Kalkulasi' || 'kalkulasi') ? '' :
                              level2['t' +
                              tahun]
                              == null ? '-' : globalFormat.formatRupiah(level2['t' +
                              tahun])
                              : '-' }}
                            </td>
                          </tr>
                          <template v-for="(level3, level3Index) in level2.level3" :key="level3Index"
                            v-if="isRowOpenSimulasi2(level2.id_uraian)">
                            <tr class="text-sm cursor-pointer" @click="toggleRowSimulasi2(level3.id_uraian)">
                              <td id="level3" :class="{ selected: level3.level4.length === 0 }">
                                <div class="flex flex-row items-center">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                    v-if="!isRowOpenSimulasi2(level3.id_uraian) && level3.level4.length !== 0">
                                    <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                                      fill="white" />
                                  </svg>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" class="mr-2"
                                    v-else-if="isRowOpenSimulasi2(level3.id_uraian) && level3.level4.length !== 0">
                                    <rect width="24" height="24" rx="6" fill="#80C1CD" />
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                                      fill="white" />
                                  </svg>
                                  <span>{{ level3.uraian }}</span>
                                </div>
                              </td>
                              <td class="text-right"
                                v-for="(tahun, tahunIndex) in dataFinansialSimulasi2.tahun.length === 0 ? 1 : dataFinansialSimulasi2.tahun"
                                :class="{ 'bg-blue-50': tahun === tahunBerjalan }">
                                {{ dataFinansialSimulasi2.tahun ?
                                level3.uraian.includes('Kalkulasi' || 'kalkulasi') ? ''
                                : level3['t' +
                                tahun]
                                == null ? '-'
                                : globalFormat.formatRupiah(level3['t' + tahun])
                                : '-' }}
                              </td>
                            </tr>
                            <template v-for="(level4, level4Index) in level3.level4" :key="level4Index"
                              v-if="isRowOpenSimulasi2(level3.id_uraian)">
                              <tr class="text-sm">
                                <td id="level4">{{ level4.uraian }}</td>
                                <td class="text-right"
                                  v-for="(tahun, tahunIndex) in dataFinansialSimulasi2.tahun.length === 0 ? 1 : dataFinansialSimulasi2.tahun"
                                  :class="{ 'bg-blue-50': tahun === tahunBerjalan }">
                                  {{ dataFinansialSimulasi2.tahun ?
                                  level4.uraian.includes('Kalkulasi' || 'kalkulasi') ?
                                  '' : level4['t'
                                  +
                                  tahun] == null ? '-' :
                                  globalFormat.formatRupiah(level4['t' + tahun]) : '-'
                                  }}
                                </td>
                              </tr>
                            </template>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
            <nav class="flex flex-row items-center justify-end space-x-3">
              <!-- <button type="submit"
                  class="px-3 py-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor">Lihat
                  Grafik
                </button> -->
              <button
                class="px-3 py-2 font-semibold text-white duration-300 rounded-lg bg-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor"
                @click="handleFinalSubmit">
                Pilih & Simpan
              </button>
            </nav>
          </div>
        </TabItem>
      </TabsWrapper>
    </div>
  </div>
  <div v-else-if="isLoading === false && !mesinDataById && !asumsiParameter">Tidak bisa menampilkan data</div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from "vue";
  import { useRoute } from "vue-router";
  const route = useRoute();
  const idMesin = parseInt(route.params.id.toString());
  import PerbaruiDataService from "@/services/perbarui-data";
  const perbaruiDataService = new PerbaruiDataService();
  import GlobalFormat from '@/services/format/global-format'
  const globalFormat = new GlobalFormat();
  import TabAsumsiMakro from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabAsumsiMakro.vue";
  import TabParameterTeknis from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabParameterTeknis.vue";
  import TabDataTeknis from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabDataTeknis.vue";
  import TabsWrapper from "@/components/ui/TabsWrapper.vue";
  import TabItem from "@/components/ui/TabItem.vue";
  import TextField from "@/components/ui/TextField.vue";
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
  import successJsonData from "@/assets/lottie/success.json";
  import WarningIcon from '@/components/icons/WarningIcon.vue';
  import { notifyError } from "@/services/helper/toast-notification";
  
  const mesinDataById = ref<MesinItem>();
  const tahunRealisasi = ref();
  const tahunBerjalan = new Date().getFullYear();
  const kodeMesin = ref();
  const jenisPembangkit = ref();
  const namaPengelola = ref<string>('');
  const comboTypePeriodic = ref<ComboTypePeriodicItem[]>([]);
  const isLoading = ref(true);
  const isShowModalConfirmation = ref(false);
  const selectedAside = ref<String>('Asumsi Makro');
  const selectedSimulasiTab = ref<String>('Simulasi 1');
  const tahunRealisasiUpdate = ref<number>(tahunBerjalan);
  const isShowModalNotification = ref(false);
  const isSuccess = ref(false);
  const picked = ref('pisah');
  const pickedParameterValue = ref<string>('auxiliarySusut');
  const masaManfaat = ref<any>();
  const isSuccessSimulasi = ref<boolean>(false);
  const isSuccessPermanent = ref<boolean>(false);
  // Tab Asumsi Makro & Parameter Teknis Model
  const asumsiParameterRealisasi = ref<any>();
  const statusAsumsi = ref<string>('');
  const idAsumsi = ref<number>(0);
  const asumsiParameter = ref<{
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
  // Tab Parameter Teknis & Finansial Model
  const comboBahanBakar = ref();
  const checkedBahanBakar = ref<number[]>([]);
  const i = ref(1);
  // Tab Data Teknis
  const typePeriodic = ref('');
  const listTypePeriodic = ref<any[]>([]);
  const ncf = ref();
  const eaf = ref();
  const productionBrutto = ref();
  const productionNetto = ref();
  const energySales = ref();
  const fuelConsumption = ref();
  const dataTeknisByPeriode = ref();
  const bahanBakars = ref<any[]>([]);
  const statusDataTeknis = ref<string>('');
  const dataTeknisSimulasi1 = ref();
  const dataTeknisSimulasi2 = ref();
  // Tab Data Finansial
  const dataFinansialDetail = ref();
  const biayaKepegawaian = ref('');
  const costComponentA = ref('');
  const biayaPeriodicMaintenance = ref();
  const costComponentADetail = ref<any[]>([]);
  const costComponentB = ref(picked.value === 'pisah' ? '' : '');
  const biayaPemeliharaanRutin = ref();
  const biayaAdministrasiUmum = ref();
  const biayaPembelianTenagaListrik = ref();
  const biayaPenyusutanAsset = ref();
  const biayaLainLain = ref();
  const oMCost = ref();
  const periodicMaintenanceCost = ref();
  const costComponentCDetail = ref<any[]>([]);
  const costComponentC = ref('');
  const biayaMinyakPelumas = ref('');
  const bahanKimia = ref('');
  const statusDataFinansial = ref<string>('');
  const costComponentD = ref('');
  const checkedProgram = ref<number[]>([]);
  const formFinansialSimulasi1 = ref();
  const formFinansialSimulasi2 = ref();
  const iProgram = ref(1);
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
  const isUnggahModalOpen = ref(false);
  const selectedFile: any = ref(null);
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
      eaf: boolean
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
      biayaBahanKimia: boolean
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
      eaf: false
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
      biayaBahanKimia: false
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
  interface AsumsiParamaterItem {
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
        route.params.id
      );
      mesinDataById.value = response.data;
      kodeMesin.value = response.data.kode_mesin;
      masaManfaat.value = response.data.masa_manfaat;
      jenisPembangkit.value = response.data.kode_jenis_pembangkit;
      tahunRealisasi.value = parseInt(response.data.tahun_realisasi);
      tahunRealisasiUpdate.value = parseInt(response.data.tahun_realisasi) + 1;
      console.log("Kode Mesin : " + jenisPembangkit.value);
    } catch (error) {
      console.error("Fetch Mesin By Id Error : " + error);
    }
  };
  const fetchUnitPengelola = async () => {
    try {
      if (mesinDataById.value) {
        const kodeSentral = mesinDataById.value.kode_sentral;
        const pembangkitResponse: any =
          await perbaruiDataService.getPembangkitByKode(kodeSentral);
        const kodePengelola = pembangkitResponse.data.kode_pengelola;
        const pengelolaResponse: any =
          await perbaruiDataService.getPengelolaData();
        const pengelola = pengelolaResponse.data.filter(
          (pengelola: any) => pengelola.kode_pengelola === kodePengelola
        );
        namaPengelola.value = pengelola[0].pengelola;
      }
    } catch (error) {
      console.error("Fetch Unit Pengelola Error : " + error);
    }
  };
  const fetchAsumsiParameterRealisasi = async () => {
    try {
      const response: any = await perbaruiDataService.getAsumsiParameterData(
        tahunRealisasi.value,
        idMesin
      )
      asumsiParameterRealisasi.value = response.data;
    } catch (error) {
      console.error('Fetch Asumsi Parameter Realisasi Error : ', error);
    }
  }
  const fetchAsumsiParameter = async () => {
    try {
      const response: AsumsiParamaterItem =
        await perbaruiDataService.getAsumsiParameterData(
          tahunRealisasiUpdate.value,
          idMesin
        );
      statusAsumsi.value = response.data.status;
      simulasiAsumsiParameter.value = response.data;
      idAsumsi.value = response.data.id_asumsi;
      // Mengisi Asumsi Makro Data Variable
      asumsiParameter.value.asumsiMakro.interestRate = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.interest_rate.toString());
      asumsiParameter.value.asumsiMakro.umurTeknis = masaManfaat.value.toString();
      asumsiParameter.value.asumsiMakro.loanTenor = response.data.asumsi_makro.loan_tenor.toString();
      asumsiParameter.value.asumsiMakro.loanPortion = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.loan_portion.toString());
      // Mengisi Parameter Teknis & Finansial Data Variable
      asumsiParameter.value.parameterTeknis.nphr = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.nphr.toString());
      asumsiParameter.value.parameterTeknis.auxiliary = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.auxiliary.toString());
      asumsiParameter.value.parameterTeknis.susutTrafo = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.susut_trafo.toString());
      asumsiParameter.value.parameterTeknis.pemakaianSendiri = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.ps.toString());
      asumsiParameter.value.parameterTeknis.electricityPriceA = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_a_rp_per_kwbln.toString());
      asumsiParameter.value.parameterTeknis.electricityPriceB = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_b_rp_per_kwbln.toString());
      asumsiParameter.value.parameterTeknis.electricityPriceC = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_c_rp_per_kwh.toString());
      asumsiParameter.value.parameterTeknis.electricityPriceD = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_d_rp_per_kwh.toString());
      pickedParameterValue.value = asumsiParameter.value.parameterTeknis.pemakaianSendiri === '0,00' ? 'auxiliarySusut' : 'pemakaianSendiri';
      const tempBahanBakars = response.data.harga_bahan_bakars;
      for (const iterator of tempBahanBakars) {
        iterator.harga_bahan_bakar = globalFormat.formatCurrencyNotFixed(iterator.harga_bahan_bakar.toString());
        iterator.sfc = globalFormat.formatCurrencyNotFixed(iterator.sfc.toString())
      }
      bahanBakars.value = tempBahanBakars;
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
          tahunRealisasiUpdate.value,
          idMesin
        );
        const responseSimulasi2: any =
        await perbaruiDataService.getDataTeknisByPeriodeSimulasi2(
          tahunRealisasiUpdate.value,
          idMesin
        );
      if(responseSimulasi1.data === null){
        const response: any = await perbaruiDataService.getDataTeknisByPeriode(
          tahunRealisasi.value,
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
        if (tempTypePeriodic !== '') {
          const fetchTypePeriodicResult = await fetchTypePeriodic(tempTypePeriodic);
          typePeriodic.value = fetchTypePeriodicResult[0].id_type_periodic;
        }
        ncf.value = globalFormat.formatCurrencyNotFixed(ncfItem[0].value.toString());
        eaf.value = globalFormat.formatCurrencyNotFixed(eafItem[0].value.toString());
        productionBrutto.value = globalFormat.formatCurrencyNotFixed(prodBruttoItem[0].value.toString());
        productionNetto.value = globalFormat.formatCurrencyNotFixed(prodNettoItem[0].value.toString());
        energySales.value = globalFormat.formatCurrencyNotFixed(energySalesItem[0].value.toString());
        fuelConsumption.value = globalFormat.formatCurrencyNotFixed(fuelConsItem[0].value.toString());
      } else {
        dataTeknisByPeriode.value = responseSimulasi1.data;
        statusDataTeknis.value = 'Simulasi';
        const periodicItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Periodic'));
        const ncfItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('NCF'));
        const eafItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('EAF'));
        const prodBruttoItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Bruto'));
        const prodNettoItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Netto'));
        const energySalesItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Energy'));
        const fuelConsItem1 = responseSimulasi1.data.filter((value: any) => value.uraian.includes('Consumption'));
        const tempTypePeriodic1 = periodicItem1.length !== 0 ? periodicItem1[0].value : '';
        if (tempTypePeriodic1 !== '') {
          const fetchTypePeriodicResult = await fetchTypePeriodic(tempTypePeriodic1);
          typePeriodic.value = fetchTypePeriodicResult[0].id_type_periodic;
        }
        ncf.value = globalFormat.formatCurrencyNotFixed(ncfItem1[0].value.toString());
        eaf.value = globalFormat.formatCurrencyNotFixed(eafItem1[0].value.toString());
        productionBrutto.value = globalFormat.formatCurrencyNotFixed(prodBruttoItem1[0].value.toString());
        productionNetto.value = globalFormat.formatCurrencyNotFixed(prodNettoItem1[0].value.toString());
        energySales.value = globalFormat.formatCurrencyNotFixed(energySalesItem1[0].value.toString());
        fuelConsumption.value = globalFormat.formatCurrencyNotFixed(fuelConsItem1[0].value.toString());
        dataTeknisSimulasi1.value = {
          id_mesin: idMesin,
          tahun_realisasi: tahunRealisasiUpdate.value,
          id_type_periodic: typePeriodic.value,
          nfc: parseFloat(ncfItem1[0].value),
          eaf: parseFloat(eafItem1[0].value),
          production_bruto: parseFloat(prodBruttoItem1[0].value),
          production_netto: parseFloat(prodNettoItem1[0].value),
          energy_sales: parseFloat(energySalesItem1[0].value),
          fuel_consumption: parseFloat(fuelConsItem1[0].value)
        }
        const periodicItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Periodic'));
        const ncfItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('NCF'));
        const eafItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('EAF'));
        const prodBruttoItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Bruto'));
        const prodNettoItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Netto'));
        const energySalesItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Energy'));
        const fuelConsItem2 = responseSimulasi2.data.filter((value: any) => value.uraian.includes('Consumption'));
        const tempTypePeriodic2 = periodicItem2.length !== 0 ? periodicItem2[0].value : '';
        dataTeknisSimulasi2.value = {
          id_mesin: idMesin,
          tahun_realisasi: tahunRealisasiUpdate.value,
          id_type_periodic: typePeriodic.value,
          nfc: parseFloat(ncfItem2[0].value),
          eaf: parseFloat(eafItem2[0].value),
          production_bruto: parseFloat(prodBruttoItem2[0].value),
          production_netto: parseFloat(prodNettoItem2[0].value),
          energy_sales: parseFloat(energySalesItem2[0].value),
          fuel_consumption: parseFloat(fuelConsItem2[0].value)
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
      comboTypePeriodic.value = response.data;
      console.log(response.data);
    } catch (error) {
      console.error("Fetch Combo Type Periodic Error : " + error);
    }
  };
  const fetchDataFinansialDetail = async () => {
    try {
      const responseSimulasi1: any = await perbaruiDataService.getDataFinansialDetailSimulasi1(
        tahunRealisasiUpdate.value,
        idMesin
      );
      const responseSimulasi2: any = await perbaruiDataService.getDataFinansialDetailSimulasi2(
        tahunRealisasiUpdate.value,
        idMesin
      );
      if(responseSimulasi1.data.id_mesin === 0){
        const response: ComboTypePeriodicItem =
        await perbaruiDataService.getDataFinansialDetail(
          tahunRealisasiUpdate.value,
          idMesin
        );
        statusDataFinansial.value = 'Permanent';
        dataFinansialDetail.value = response.data;
        costComponentA.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_a);
        // biayaInvestasiTambahan.value = globalFormat.formatRupiah(response.data.cost_component_a_detail_ai.biaya_investasi_tambahan);
        costComponentB.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b);
        biayaKepegawaian.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_kepegawaian);
        biayaPemeliharaanRutin.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_pemeliharaan_rutin);
        biayaAdministrasiUmum.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_administrasi_umum);
        biayaPembelianTenagaListrik.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik);
        biayaPenyusutanAsset.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_penyusutan_aset_tetap);
        biayaLainLain.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_lain_lain);
        oMCost.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_lain_lain);
        periodicMaintenanceCost.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_b_detail.biaya_periodic_maintenance_non_mi);
        costComponentC.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_c);
        costComponentD.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_d);
        for (const value of response.data.cost_component_c_detail) {
          value.harga_bahan_bakar = globalFormat.formatCurrencyNotFixed(value.harga_bahan_bakar);
        }
        costComponentCDetail.value = response.data.cost_component_c_detail;
        biayaMinyakPelumas.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_d_detail.biaya_pelumas);
        bahanKimia.value = globalFormat.formatCurrencyNotFixed(response.data.cost_component_d_detail.biaya_bahan_kimia);
        formFinansialSimulasi1.value = {
          id_mesin: idMesin,
          tahun: tahunRealisasiUpdate.value,
          status_b_d: response.data.status_b_d,
          cost_component_a: response.data.cost_component_a,
          cost_component_b: response.data.cost_component_b,
          cost_component_b_detail: {
              id_ao: 0,
              id_mesin: idMesin,
              tahun: tahunRealisasiUpdate.value,
              biaya_kepegawaian: response.data.cost_component_b_detail.biaya_kepegawaian,
              biaya_pemeliharaan_rutin: response.data.cost_component_b_detail.biaya_pemeliharaan_rutin,
              biaya_administrasi_umum: response.data.cost_component_b_detail.biaya_administrasi_umum,
              biaya_pembelian_tenaga_listrik: response.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik,
              biaya_penyusutan_aset_tetap: response.data.cost_component_b_detail.biaya_penyusutan_aset_tetap,
              biaya_lain_lain: response.data.cost_component_b_detail.biaya_lain_lain,
              biaya_periodic_maintenance_non_mi: 0
          },
          cost_component_c: response.data.cost_component_c,    
          cost_component_d: response.data.cost_component_d,
          cost_component_d_detail: {
              id_pelumas_bahan_kimia: 0,
              id_mesin: idMesin,
              tahun: tahunRealisasiUpdate.value,
              biaya_pelumas: response.data.cost_component_d_detail.biaya_pelumas,
              biaya_bahan_kimia: response.data.cost_component_d_detail.biaya_bahan_kimia,
              biaya_lain_lain: 0
          }
        };
      } else {
        statusDataFinansial.value = 'Simulasi';
        dataFinansialDetail.value = responseSimulasi1.data;
        costComponentA.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_a);
        // biayaInvestasiTambahan.value = globalFormat.formatRupiah(responseSimulasi1.data.cost_component_a_detail_ai.biaya_investasi_tambahan);
        costComponentB.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b);
        biayaKepegawaian.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_kepegawaian);
        biayaPemeliharaanRutin.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_pemeliharaan_rutin);
        biayaAdministrasiUmum.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_administrasi_umum);
        biayaPembelianTenagaListrik.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik);
        biayaPenyusutanAsset.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_penyusutan_aset_tetap);
        biayaLainLain.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_lain_lain);
        oMCost.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_lain_lain);
        periodicMaintenanceCost.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_b_detail.biaya_periodic_maintenance_non_mi);
        costComponentC.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_c);
        costComponentD.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_d);
        for (const value of responseSimulasi1.data.cost_component_c_detail) {
          value.harga_bahan_bakar = globalFormat.formatCurrencyNotFixed(value.harga_bahan_bakar);
        }
        costComponentCDetail.value = responseSimulasi1.data.cost_component_c_detail;
        biayaMinyakPelumas.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_d_detail.biaya_pelumas);
        bahanKimia.value = globalFormat.formatCurrencyNotFixed(responseSimulasi1.data.cost_component_d_detail.biaya_bahan_kimia);
        formFinansialSimulasi1.value = {
          id_mesin: idMesin,
          tahun: tahunRealisasiUpdate.value,
          status_b_d: responseSimulasi1.data.status_b_d,
          cost_component_a: responseSimulasi1.data.cost_component_a,
          cost_component_b: responseSimulasi1.data.cost_component_b,
          cost_component_b_detail: {
              id_ao: 0,
              id_mesin: idMesin,
              tahun: tahunRealisasiUpdate.value,
              biaya_kepegawaian: responseSimulasi1.data.cost_component_b_detail.biaya_kepegawaian,
              biaya_pemeliharaan_rutin: responseSimulasi1.data.cost_component_b_detail.biaya_pemeliharaan_rutin,
              biaya_administrasi_umum: responseSimulasi1.data.cost_component_b_detail.biaya_administrasi_umum,
              biaya_pembelian_tenaga_listrik: responseSimulasi1.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik,
              biaya_penyusutan_aset_tetap: responseSimulasi1.data.cost_component_b_detail.biaya_penyusutan_aset_tetap,
              biaya_lain_lain: responseSimulasi1.data.cost_component_b_detail.biaya_lain_lain,
              biaya_periodic_maintenance_non_mi: 0
          },
          cost_component_c: responseSimulasi1.data.cost_component_c,    
          cost_component_d: responseSimulasi1.data.cost_component_d,
          cost_component_d_detail: {
              id_pelumas_bahan_kimia: 0,
              id_mesin: idMesin,
              tahun: tahunRealisasiUpdate.value,
              biaya_pelumas: responseSimulasi1.data.cost_component_d_detail.biaya_pelumas,
              biaya_bahan_kimia: responseSimulasi1.data.cost_component_d_detail.biaya_bahan_kimia,
              biaya_lain_lain: 0
          }
        };
        formFinansialSimulasi2.value = {
          id_mesin: idMesin,
          tahun: tahunRealisasiUpdate.value,
          status_b_d: responseSimulasi2.data.status_b_d,
          cost_component_a: responseSimulasi2.data.cost_component_a,
          cost_component_b: responseSimulasi2.data.cost_component_b,
          cost_component_b_detail: {
              id_ao: 0,
              id_mesin: idMesin,
              tahun: tahunRealisasiUpdate.value,
              biaya_kepegawaian: responseSimulasi2.data.cost_component_b_detail.biaya_kepegawaian,
              biaya_pemeliharaan_rutin: responseSimulasi2.data.cost_component_b_detail.biaya_pemeliharaan_rutin,
              biaya_administrasi_umum: responseSimulasi2.data.cost_component_b_detail.biaya_administrasi_umum,
              biaya_pembelian_tenaga_listrik: responseSimulasi2.data.cost_component_b_detail.biaya_pembelian_tenaga_listrik,
              biaya_penyusutan_aset_tetap: responseSimulasi2.data.cost_component_b_detail.biaya_penyusutan_aset_tetap,
              biaya_lain_lain: responseSimulasi2.data.cost_component_b_detail.biaya_lain_lain,
              biaya_periodic_maintenance_non_mi: 0
          },
          cost_component_c: responseSimulasi2.data.cost_component_c,    
          cost_component_d: responseSimulasi2.data.cost_component_d,
          cost_component_d_detail: {
              id_pelumas_bahan_kimia: 0,
              id_mesin: idMesin,
              tahun: tahunRealisasiUpdate.value,
              biaya_pelumas: responseSimulasi2.data.cost_component_d_detail.biaya_pelumas,
              biaya_bahan_kimia: responseSimulasi2.data.cost_component_d_detail.biaya_bahan_kimia,
              biaya_lain_lain: 0
          }
        };
      }
    } catch (error) {
      console.error("Fetch Combo Type Periodic Error : " + error);
    }
  };
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
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data',
      };
      const response = await axios.post('https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/import-template-simulasi', formData, {
        headers,
      });
      console.log('Sukses mengirim file : ', response.data);
      isUnggahModalOpen.value = false;
      isLoading.value = false;
      // Fetching Data Simulasi Disini
      isSuccess.value = true;
      await wait(1500)
      isSuccess.value = false;
      isLoading.value = true;
      await fetchDataTeknisSimulasi2();
      await fetchDataFinansialSimulasi2();
      isLoading.value = false;
    } catch (error) {
      isLoading.value = false;
      console.error('Error upload file : ', error);
    }
  };
  const formatBytes = (bytes: any) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)).toString());
    return Math.round(100 * (bytes / Math.pow(k, i))) / 100 + ' ' + sizes[i];
  };
  function handleTambahBahanBakar() {
    bahanBakars.value.push({
      flag_bahan_bakar: 0,
      harga_bahan_bakar: 0,
      id_mesin: idMesin,
      kode_bahan_bakar: "",
      sfc: 0,
      tahun: tahunBerjalan,
      id: i.value++
    });
  }
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
  }
  const handleTambahProgram = () => {
    // let urutanTerakhir = 1;
    // for (const urutan in costComponentADetail.value) {
    //   if (costComponentADetail.value[urutan].urutan > urutanTerakhir && costComponentADetail.value[urutan].tahun === tahunRealisasiUpdate.value.toString()) {
    //     urutanTerakhir = costComponentADetail.value[urutan].urutan;
    //   }
    // }
    // let finalUrutan = urutanTerakhir + 1;
    costComponentADetail.value.push({
      id: iProgram.value++,
      id_ai_aki: 0,
      id_mesin: idMesin,
      tahun: tahunRealisasiUpdate.value.toString(),
      judul_program: "",
      ai: "",
      realisasi_aki: "",
      urutan: 2
    });
  };
  const handleHapusProgram = () => {
    if (checkedProgram.value.length) {
      checkedProgram.value.forEach((checkedItemId) => {
        const result = costComponentADetail.value.findIndex((checkbox) => checkbox.id === checkedItemId);
        if (result !== -1) {
          costComponentADetail.value.splice(result, 1);
        }
      });
      checkedProgram.value = [];
    }
  }
  const handleInputDecimalRupiah = (targetModel: string, index?: number) => {
    switch (targetModel) {
      case 'costComponentA':
        costComponentA.value = globalFormat.formatInputDecimalRupiah(costComponentA.value);
        break;
      case 'costComponentB':
        costComponentB.value = globalFormat.formatInputDecimalRupiah(costComponentB.value);
        break;
      case 'ai':
        costComponentADetail.value[index ?? -1].ai = globalFormat.formatInputDecimalRupiah(costComponentADetail.value[index ?? -1].ai);
        break;
      case 'aki':
        costComponentADetail.value[index ?? -1].realisasi_aki = globalFormat.formatInputDecimalRupiah(costComponentADetail.value[index ?? -1].realisasi_aki);
        break;
      case 'biayaPeriodicMaintenance':
        biayaPeriodicMaintenance.value = globalFormat.formatInputDecimalRupiah(biayaPeriodicMaintenance.value);
        break;
      case 'biayaKepegawaian':
        biayaKepegawaian.value = globalFormat.formatInputDecimalRupiah(biayaKepegawaian.value);
        break;
      case 'biayaPemeliharaanRutin':
        biayaPemeliharaanRutin.value = globalFormat.formatInputDecimalRupiah(biayaPemeliharaanRutin.value);
        break;
      case 'biayaAdministrasiUmum':
        biayaAdministrasiUmum.value = globalFormat.formatInputDecimalRupiah(biayaAdministrasiUmum.value);
        break;
      case 'biayaPembelianTenagaListrik':
        biayaPembelianTenagaListrik.value = globalFormat.formatInputDecimalRupiah(biayaPembelianTenagaListrik.value);
        break;
      case 'biayaLainLain':
        biayaLainLain.value = globalFormat.formatInputDecimalRupiah(biayaLainLain.value);
        break;
      case 'costComponentC':
        costComponentC.value = globalFormat.formatInputDecimalRupiah(costComponentC.value);
        break;
      case 'oMCost':
        oMCost.value = globalFormat.formatInputDecimalRupiah(oMCost.value);
        break;
      case 'periodicMaintenanceCost':
        periodicMaintenanceCost.value = globalFormat.formatInputDecimalRupiah(periodicMaintenanceCost.value);
        break;
      case 'componentCDetail':
        dataFinansialDetail.value.cost_component_c_detail[index ?? -1].harga_bahan_bakar = globalFormat.formatInputDecimalRupiah(dataFinansialDetail.value.cost_component_c_detail[index ?? -1].harga_bahan_bakar);
        break;
      case 'costComponentD':
        costComponentD.value = globalFormat.formatInputDecimalRupiah(costComponentD.value);
        break;
      case 'biayaMinyakPelumas':
        biayaMinyakPelumas.value = globalFormat.formatInputDecimalRupiah(biayaMinyakPelumas.value);
        break;
      case 'bahanKimia':
        bahanKimia.value = globalFormat.formatInputDecimalRupiah(bahanKimia.value);
        break;
    }
  }
  const fetchDataTeknisSimulasi1 = async () => {
    try {
      const response: any = await perbaruiDataService.getDataTeknisSimulasi1(tahunRealisasiUpdate.value, idMesin);
      simulasi1DataTeknis.value = response.data;
      console.log('Simulasi Teknis 1 : ', response.data);
    } catch (error) {
      console.error('Fetch Opsi Simulasi Error : ', error);
    }
  }
  const fetchDataTeknisSimulasi2 = async () => {
    try {
      const response: any = await perbaruiDataService.getDataTeknisSimulasi2(tahunRealisasiUpdate.value, idMesin);
      simulasi2DataTeknis.value = response.data;
      console.log('Simulasi Teknis 2: ', response.data);
    } catch (error) {
      console.error('Fetch Opsi Simulasi Error : ', error);
    }
  }
  const fetchDataFinansialSimulasi1 = async () => {
    try {
      const response: any = await perbaruiDataService.getDataFinansialSimulasi1(tahunRealisasiUpdate.value, idMesin);
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
      console.log('Simulasi Finansial 1 : ', simulasi1DataFinansial.value);
    } catch (error) {
      console.error('Fetch Opsi Simulasi Error : ', error);
    }
  }
  const fetchDataFinansialSimulasi2 = async () => {
    try {
      const response: any = await perbaruiDataService.getDataFinansialSimulasi2(tahunRealisasiUpdate.value, idMesin);
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
    isShowModalConfirmation.value = false;
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
    if (bahanBakars.value.some(obj => Object.values(obj).some(value => value === ""))) {
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
    if (costComponentA.value === 'NaN' || costComponentA.value === '') {
      errorDataFinansial.costComponentA = true;
    } else {
      errorDataFinansial.costComponentA = false;
    }
    if (biayaPeriodicMaintenance.value === 'NaN' || biayaPeriodicMaintenance.value === '') {
      errorDataFinansial.biayaPeriodicMaintenance = true;
    } else {
      errorDataFinansial.biayaPeriodicMaintenance = false;
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
    if (picked.value === 'pisah') {
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
    } else if (picked.value === 'gabung') {
      if (oMCost.value === 'NaN' || oMCost.value === '') {
        errorDataFinansial.oMCost = true;
      } else {
        errorDataFinansial.oMCost = false;
      }
      if (periodicMaintenanceCost.value === 'NaN' || periodicMaintenanceCost.value === '') {
        errorDataFinansial.periodicMaintenanceCost = true;
      } else {
        errorDataFinansial.periodicMaintenanceCost = false;
      }
    }
    if (costComponentC.value === 'NaN' || costComponentC.value === '') {
      errorDataFinansial.costComponentC = true;
    } else {
      errorDataFinansial.costComponentC = false;
    }
    if (costComponentCDetail.value.some(obj => Object.values(obj).some(value => value === ""))) {
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
    if (Object.values(errorAsumsiInput).some(value => value === true) || Object.values(errorParameterTeknis).some(value => value === true) || Object.values(errorDataTeknis).some(value => value === true) || Object.values(errorDataFinansial).some(value => value === true)) {
      isShowModalNotification.value = true;
      await wait(5000);
      isShowModalNotification.value = false;
    } else {
      try {
        isLoading.value = true;
        // Update Asumsi Makro 
        if (idAsumsi.value === 0 && statusAsumsi.value === 'create') {
        const formAsumsiCreate = {
          tahun: tahunRealisasiUpdate.value,
          id_mesin: idMesin,
          interest_rate: asumsiParameter.value.asumsiMakro.interestRate.includes(',') ? parseFloat(asumsiParameter.value.asumsiMakro.interestRate.replace(',', '.')) : parseFloat(asumsiParameter.value.asumsiMakro.interestRate),
          umur_teknis: parseInt(masaManfaat.value),
          loan_tenor: parseInt(asumsiParameter.value.asumsiMakro.loanTenor),
          loan_portion: asumsiParameter.value.asumsiMakro.loanPortion.includes(',') ? parseFloat(asumsiParameter.value.asumsiMakro.loanPortion.replace(',', '.')) : parseFloat(asumsiParameter.value.asumsiMakro.loanPortion),
          status_fs: 0
        }
        await perbaruiDataService.createAsumsiMakroPermanent(formAsumsiCreate);
        const response: AsumsiParamaterItem =
          await perbaruiDataService.getAsumsiParameterData(
            tahunRealisasiUpdate.value,
            idMesin
          );
        statusAsumsi.value = response.data.status;
        idAsumsi.value = response.data.id_asumsi;
      } else {
        const formAsumsiUpdate = {
          id_asumsi: idAsumsi.value,
          tahun: tahunRealisasiUpdate.value,
          id_mesin: idMesin,
          interest_rate: asumsiParameter.value.asumsiMakro.interestRate.includes(',') ? parseFloat(asumsiParameter.value.asumsiMakro.interestRate.replace(',', '.')) : parseFloat(asumsiParameter.value.asumsiMakro.interestRate),
          umur_teknis: parseInt(masaManfaat.value),
          loan_tenor: parseInt(asumsiParameter.value.asumsiMakro.loanTenor),
          loan_portion: asumsiParameter.value.asumsiMakro.loanPortion.includes(',') ? parseFloat(asumsiParameter.value.asumsiMakro.loanPortion.replace(',', '.')) : parseFloat(asumsiParameter.value.asumsiMakro.loanPortion)
        }
        await perbaruiDataService.updateAsumsiMakroPermanent(formAsumsiUpdate);
        const response: AsumsiParamaterItem =
          await perbaruiDataService.getAsumsiParameterData(
            tahunRealisasiUpdate.value,
            idMesin
          );
        statusAsumsi.value = response.data.status;
        idAsumsi.value = response.data.id_asumsi;
      }
  
      // Update Parameter Teknis & Finansial
      const finalBahanBakars = bahanBakars.value.map(value => {
        let newValue = { ...value };
        let finalHargaBahanBakar = newValue.harga_bahan_bakar.includes('.') ? newValue.harga_bahan_bakar.replace(/[.]/g, '') : newValue.harga_bahan_bakar;
        newValue.harga_bahan_bakar = parseFloat(finalHargaBahanBakar.replace(/,/g, '.'));
        let finalSFC = newValue.sfc.includes('.') ? newValue.sfc.replace(/[.]/g, '') : newValue.sfc;
        newValue.sfc = parseFloat(finalSFC.replace(/,/g, '.'));
        newValue.tahun = tahunRealisasiUpdate.value.toString();
        return newValue;
      });
      const finalNPHR = asumsiParameter.value.parameterTeknis.nphr.includes('.') ? asumsiParameter.value.parameterTeknis.nphr.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.nphr;
      const finalElecA = asumsiParameter.value.parameterTeknis.electricityPriceA.includes('.') ? asumsiParameter.value.parameterTeknis.electricityPriceA.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.electricityPriceA;
      const finalElecB = asumsiParameter.value.parameterTeknis.electricityPriceB.includes('.') ? asumsiParameter.value.parameterTeknis.electricityPriceB.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.electricityPriceB;
      const finalElecC = asumsiParameter.value.parameterTeknis.electricityPriceC.includes('.') ? asumsiParameter.value.parameterTeknis.electricityPriceC.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.electricityPriceC;
      const finalElecD = asumsiParameter.value.parameterTeknis.electricityPriceD.includes('.') ? asumsiParameter.value.parameterTeknis.electricityPriceD.replace(/[.]/g, '') : asumsiParameter.value.parameterTeknis.electricityPriceD;
      const formParameterUpdate = {
        id_asumsi: idAsumsi.value,
        id_mesin: idMesin,
        tahun: tahunRealisasiUpdate.value,
        nphr: parseFloat(finalNPHR.replace(/,/g, '.')),
        auxiliary: pickedParameterValue.value === 'auxiliarySusut' ? asumsiParameter.value.parameterTeknis.auxiliary.includes(',') ? parseFloat(asumsiParameter.value.parameterTeknis.auxiliary.replace(',', '.')) : parseFloat(asumsiParameter.value.parameterTeknis.auxiliary) : 0,
        susut_trafo: pickedParameterValue.value === 'auxiliarySusut' ? asumsiParameter.value.parameterTeknis.susutTrafo.includes(',') ? parseFloat(asumsiParameter.value.parameterTeknis.susutTrafo.replace(',', '.')) : parseFloat(asumsiParameter.value.parameterTeknis.susutTrafo) : 0,
        ps: pickedParameterValue.value === 'pemakaianSendiri' ? asumsiParameter.value.parameterTeknis.pemakaianSendiri.includes(',') ? parseFloat(asumsiParameter.value.parameterTeknis.pemakaianSendiri.replace(',', '.')) : parseFloat(asumsiParameter.value.parameterTeknis.pemakaianSendiri) : 0,
        electricity_price_a_rp_per_kwbln: parseFloat(finalElecA.replace(/,/g, '.')),
        electricity_price_b_rp_per_kwbln: parseFloat(finalElecB.replace(/,/g, '.')),
        electricity_price_c_rp_per_kwh: parseFloat(finalElecC.replace(/,/g, '.')),
        electricity_price_d_rp_per_kwh: parseFloat(finalElecD.replace(/,/g, '.')),
        harga_bahan_bakars: finalBahanBakars
      }
      await perbaruiDataService.updateParameterTeknisPermanent(formParameterUpdate);
      
      // Update Data Teknis
      const formDataTeknisUpdate = {
        id_mesin: idMesin,
        tahun_realisasi: tahunRealisasiUpdate.value,
        id_type_periodic: typePeriodic.value,
        nfc: ncf.value.includes(',') ? parseFloat(ncf.value.replace(/,/g, '.')) : parseFloat(ncf.value),
        eaf: eaf.value.includes(',') ? parseFloat(eaf.value.replace(/,/g, '.')) : parseFloat(eaf.value),
        production_bruto: productionBrutto.value.includes(',') ? parseFloat(productionBrutto.value.replace(/,/g, '.')) : parseFloat(productionBrutto.value),
        production_netto: productionNetto.value.includes(',') ? parseFloat(productionNetto.value.replace(/,/g, '.')) : parseFloat(productionNetto.value),
        energy_sales: energySales.value.includes(',') ? parseFloat(energySales.value.replace(/,/g, '.')) : parseFloat(energySales.value),
        fuel_consumption: fuelConsumption.value.includes(',') ? parseFloat(fuelConsumption.value.replace(/,/g, '.')) : parseFloat(fuelConsumption.value)
      }
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
      const finalCostComponentA = parseFloat(costComponentA.value.replace(/,/g, '.'));
      // const finalBiayaPeriodicMaintenance = parseFloat(biayaPeriodicMaintenance.value.replace(/,/g, '.'));
      // const finalCostComponentADetail = costComponentADetail.value;
      const finalCostComponentB = parseFloat(costComponentB.value.replace(/,/g, '.'));
      const finalBiayaKepegawaian = parseFloat(biayaKepegawaian.value.replace(/,/g, '.'));
      const finalBiayaPemeliharaanRutin = parseFloat(biayaPemeliharaanRutin.value.replace(/,/g, '.'));
      const finalBiayaAdministrasiUmum = parseFloat(biayaAdministrasiUmum.value.replace(/,/g, '.'));
      const finalBiayaPembelianTenagaListrik = parseFloat(biayaPembelianTenagaListrik.value.replace(/,/g, '.'));
      const finalPenyusutanAsetTetap = parseFloat(biayaPenyusutanAsset.value.replace(/,/g, '.'));
      const finalBiayaLainLain = parseFloat(biayaLainLain.value.replace(/,/g, '.'));
      const finalCostComponentC = parseFloat(costComponentC.value.replace(/,/g, '.'));
      const finalCostComponentD = parseFloat(costComponentD.value.replace(/,/g, '.'));
      const finalBiayaPelumas = parseFloat(biayaMinyakPelumas.value.replace(/,/g, '.'));
      const finalBahanKimia = parseFloat(bahanKimia.value.replace(/,/g, '.'));
  
      let formDataFinansialUpdate;
      if(picked.value === 'pisah'){
        formDataFinansialUpdate = {
        id_mesin: idMesin,
        tahun: tahunRealisasiUpdate.value,
        status_b_d: 2,
        cost_component_a: finalCostComponentA,
        cost_component_b: finalCostComponentB,
        cost_component_b_detail: {
            id_ao: 0,
            id_mesin: idMesin,
            tahun: tahunRealisasiUpdate.value,
            biaya_kepegawaian: finalBiayaKepegawaian,
            biaya_pemeliharaan_rutin: finalBiayaPemeliharaanRutin,
            biaya_administrasi_umum: finalBiayaAdministrasiUmum,
            biaya_pembelian_tenaga_listrik: finalBiayaPembelianTenagaListrik,
            biaya_penyusutan_aset_tetap: finalPenyusutanAsetTetap,
            biaya_lain_lain: finalBiayaLainLain,
            biaya_periodic_maintenance_non_mi: 0
        },
        cost_component_c: finalCostComponentC,    
        cost_component_d: finalCostComponentD,
        cost_component_d_detail: {
            id_pelumas_bahan_kimia: 0,
            id_mesin: idMesin,
            tahun: tahunRealisasiUpdate.value,
            biaya_pelumas: finalBiayaPelumas,
            biaya_bahan_kimia: finalBahanKimia,
            biaya_lain_lain: 0
        }
      }
      } else {
        formDataFinansialUpdate = {
        id_mesin: idMesin,
        tahun: tahunRealisasiUpdate.value,
        status_b_d: 1,
        cost_component_a: finalCostComponentA,
        cost_component_b: finalCostComponentB,
        cost_component_b_detail: {
            id_ao: 0,
            id_mesin: idMesin,
            tahun: tahunRealisasiUpdate.value,
            biaya_kepegawaian: finalBiayaKepegawaian,
            biaya_pemeliharaan_rutin: finalBiayaPemeliharaanRutin,
            biaya_administrasi_umum: finalBiayaAdministrasiUmum,
            biaya_pembelian_tenaga_listrik: finalBiayaPembelianTenagaListrik,
            biaya_penyusutan_aset_tetap: finalPenyusutanAsetTetap,
            biaya_lain_lain: finalBiayaLainLain,
            biaya_periodic_maintenance_non_mi: 0
        },
        cost_component_c: finalCostComponentC,    
        cost_component_d: finalCostComponentD,
        cost_component_d_detail: {
            id_pelumas_bahan_kimia: 0,
            id_mesin: idMesin,
            tahun: tahunRealisasiUpdate.value,
            biaya_pelumas: 0,
            biaya_bahan_kimia: 0,
            biaya_lain_lain: 0
        }
      }
    }
      await perbaruiDataService.updateDataFinansialSimulasi(formDataFinansialUpdate);
      
      // Handle Sesudah Submit
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
      } catch (error) {
        console.error('Update Error : ' + error);
      } finally {
        isLoading.value = false;
      }
    }
  }
  const handleFinalSubmit = async () => {
    try {
      console.log('Form Data Teknis Simulasi 1 : ', dataTeknisSimulasi1.value);
      console.log('Form Data Finansial Simulasi 1 : ', formFinansialSimulasi1.value);
      console.log('Form Data Teknis Simulasi 2 : ', dataTeknisSimulasi2.value);
      console.log('Form Data Finansial Simulasi 2 : ', formFinansialSimulasi2.value);
      if(selectedSimulasiTab.value === 'Simulasi 1'){
        await perbaruiDataService.updateDataTeknisPermanent(dataTeknisSimulasi1.value);
        await perbaruiDataService.updateDataFinansialPermanent(formFinansialSimulasi1.value);
      } else {
        await perbaruiDataService.updateDataTeknisPermanent(dataTeknisSimulasi2.value);
        await perbaruiDataService.updateDataFinansialPermanent(formFinansialSimulasi2.value);
      }
    } catch (error) {
      console.error('Final Submit Error : ' + error);
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
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const response: any = await axios.get('https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/export-template-simulasi1', {
        responseType: 'arraybuffer',
        headers,
        params: {
          tahun: tahunRealisasiUpdate.value,
          id_mesin: idMesin
        }
      });
      console.log(response);
      const contentDisposition = response.headers['content-disposition'];
      const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
      const fileName = fileNameMatch ? fileNameMatch[1] : `Simulasi 1 - ${idMesin}.xlsx`;
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
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const response: any = await axios.get('https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail//export-template-simulasi2', {
        responseType: 'arraybuffer',
        headers,
        params: {
          tahun: tahunRealisasiUpdate.value,
          id_mesin: idMesin
        }
      });
      console.log(response);
      const contentDisposition = response.headers['content-disposition'];
      const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
      const fileName = fileNameMatch ? fileNameMatch[1] : `Simulasi 2 - ${idMesin}.xlsx`;
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
  
  onMounted(async () => {
    await fetchMesinById();
    await fetchUnitPengelola();
    await fetchComboBahanBakar();
    await fetchAsumsiParameterRealisasi();
    await fetchAsumsiParameter();
    await fetchComboTypePeriodic();
    await fetchDataFinansialDetail();
    await fetchDataTeknisByPeriode();
    await fetchDataTeknisSimulasi1();
    await fetchDataTeknisSimulasi2();
    await fetchDataFinansialSimulasi1();
    await fetchDataFinansialSimulasi2();
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