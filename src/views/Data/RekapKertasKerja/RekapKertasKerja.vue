<template>
  <Loading v-if="isLoading" />
  <div class="flex flex-col h-full p-6 space-y-5 font-medium bg-white rounded-lg text-md">
    <div class="flex flex-row space-x-4"
      v-if="userLevel === 'Admin' || userLevel === 'Pusat' || userLevel === 'Pengelola' || userLevel === 'Pembina'">
      <SearchBoxSuggestion v-if="listSuggestionSentral" v-model="store.searchRekapQuery" :source="listSuggestionSentral"
        @on-key-enter="store.selectedRekapSearchQuery = store.searchRekapQuery; handleSearch()"
        @on-click-sentral="store.selectedRekapSearchQuery = store.searchRekapQuery; handleSearch()" />
      <ShimmerLoading class="h-8 w-80" v-else-if="!listSuggestionSentral" />
      <button
        class="relative flex items-center h-auto px-3 text-base text-gray-400 duration-300 border border-gray-300 rounded-lg hover:text-white hover:border-primaryColor hover:bg-primaryColor"
        id="hover-button" @click="showModal = !showModal">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
          <path
            d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
            fill="#0099AD" />
        </svg>
        Filter
        <div v-if="selectedKategoriPembangkit.length || selectedUmurMesin.length || selectedKondisiMesin.length"
          class="absolute z-10 border-2 border-[#FFE5E6] w-2.5 h-2.5 rounded-full right-0.5 top-0.5  bg-warningColor">
        </div>
      </button>
      <ModalWrapper :showModal="showModal" :width="'w-[500px]'" :height="'h-auto'">
        <div class="flex flex-col space-y-5">
          <div class="flex justify-between">
            <div class="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4.6665 7.33073H11.3332V8.66406H4.6665V7.33073ZM2.6665 4.66406H13.3332V5.9974H2.6665V4.66406ZM6.6665 9.9974H9.33317V11.3307H6.6665V9.9974Z"
                  fill="#333333" />
              </svg>
              <span class="text-base font-semibold text-primaryTextColor">Filter</span>
            </div>
            <button @click="showModal = false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="flex flex-col space-y-1.5">
            <span class="font-semibold text-labelColor">Kategori Pembangkit</span>
            <el-select v-model="selectedKategoriPembangkit" multiple clearable collapse-tags
              placeholder="Pilih Kategori Pembangkit" popper-class="custom-header" :max-collapse-tags="15"
              class="w-full text-primaryTextColor">
              <template #header>
                <el-checkbox v-model="checkPembangkit" :indeterminate="indeterminate" @change="handleCheckPembangkit">
                  Select All Items
                </el-checkbox>
              </template>
              <el-option v-for="(pembangkitItem, pembangkitIndex) in kategoriPembangkitData" :key="pembangkitIndex"
                :label="pembangkitItem.name" :value="pembangkitItem.id" />
            </el-select>
          </div>
          <div v-show="selectedKategoriPembangkit.includes('PLTU')" class="flex flex-col space-y-1">
            <span class="font-semibold text-labelColor">DMN</span>
            <el-select v-model="dmn" multiple clearable collapse-tags placeholder="Pilih DMN"
              popper-class="custom-header" :max-collapse-tags="15" class="w-full text-primaryTextColor">
              <template #header>
                <el-checkbox v-model="checkDmn" :indeterminate="indeterminateDmn" @change="handleCheckDmn">
                  Select All Items
                </el-checkbox>
              </template>
              <el-option v-for="(dmnItem, dmnIndex) in childDmn" :key="dmnIndex" :label="dmnItem.name"
                :value="dmnItem.id" />
            </el-select>
            <div class="flex -mb-2">
              <p class="text-[#FF5656] text-lg mr-1 -mt-1">*</p>
              <p class="text-[#333333] text-xs ml-1">DMN hanya akan muncul jika Anda memilih PLTU dari Kategori
                Pembangkit</p>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <span class="font-semibold text-labelColor">Umur Mesin</span>
            <el-select v-model="selectedUmurMesin" multiple clearable collapse-tags placeholder="Pilih Umur Mesin"
              popper-class="custom-header" :max-collapse-tags="15" class="w-full text-primaryTextColor">
              <template #header>
                <el-checkbox v-model="checkAllUmurMesin" :indeterminate="indeterminate" @change="handleCheckUmurMesin">
                  Select All Items
                </el-checkbox>
              </template>
              <el-option v-for="(umurMesinItem, umurMesinIndex) in comboUmurMesin" :key="umurMesinIndex"
                :label="umurMesinItem.name" :value="umurMesinItem.id" />
            </el-select>
          </div>
          <div class="flex flex-col space-y-2">
            <span class="font-semibold text-labelColor">Kondisi Mesin</span>
            <el-select v-model="selectedKondisiMesin" multiple clearable collapse-tags placeholder="Pilih Kondisi Mesin"
              popper-class="custom-header" :max-collapse-tags="15" class="w-full text-primaryTextColor">
              <template #header>
                <el-checkbox v-model="checkAllKondisiMesin" :indeterminate="indeterminate"
                  @change="handleCheckKondisiMesin">
                  Select All Items
                </el-checkbox>
              </template>
              <el-option v-for="(kondisiMesinItem, kondisiMesinIndex) in comboKondisiMesin" :key="kondisiMesinIndex"
                :label="kondisiMesinItem.name" :value="kondisiMesinItem.id" />
            </el-select>
          </div>
          <div class="border-b"></div>
          <div class="flex justify-end space-x-2">
            <button
              class="px-5 py-2 text-sm font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor hover:text-white"
              @click="selectedKategoriPembangkit = []; dmn = []; selectedUmurMesin = []; selectedKondisiMesin = []">
              Reset
            </button>
            <div>
              <button type="submit" @click="changeSentralData()"
                class="w-full text-white bg-[#0099AD] hover:bg-hoverColor duration-300 active:ring-2 active:outline-none active:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center">
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </ModalWrapper>
    </div>
    <div class="whitespace-nowrap" v-if="userLevel === 'Admin' || userLevel === 'Pusat'">
      <ul class="flex flex-row w-full overflow-x-auto" v-if="pengelolaData.length !== 0">
        <li v-for="(pengelola, pengelolaIndex) in pengelolaData" :key="pengelolaIndex"
          class="relative p-2 ml-3 overflow-hidden text-xs font-bold text-gray-400 border border-gray-300 rounded-lg cursor-pointer w-fit hover:text-primaryColor first:ml-0 hover:border-primaryColor active:bg-primaryColor active:bg-opacity-20"
          :class="{ selected: selectedPengelola.includes(pengelola.kode_pengelola) || kodePengelola === pengelola.kode_pengelola }"
          @click="changeSelectedPengelola(pengelola.kode_pengelola)">
          {{ pengelola.pengelola }}
          <template
            v-if="selectedPengelola.includes(pengelola.kode_pengelola) || kodePengelola === pengelola.kode_pengelola">
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
      <div v-else-if="pengelolaData.length === 0" class="flex flex-row space-x-3">
        <ShimmerLoading class="w-24 h-7" v-for="item in 5" />
      </div>
    </div>
    <template v-if="sentralData.length">
      <div v-auto-animate="{ duration: 300 }" class="flex flex-col w-full p-3 border rounded-lg"
        v-for="(sentralItem, sentralIndex) in sentralData" :key="sentralIndex">
        <div class="flex items-center justify-between cursor-pointer" @click="togglePembangkit(sentralItem.id_sentral)">
          <h2 class="text-base font-bold text-primaryColor">
            {{ sentralItem.sentral }}
          </h2>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-if="!isPembangkitOpen(sentralItem.id_sentral)">
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
        <div class="mt-3" v-if="isPembangkitOpen(sentralItem.id_sentral)">
          <div class="border-b"></div>
          <!--Divider-->
          <TabWrapperSentral v-if="sentralData.length" :is-lihat-grafik="false" :tabs-titles="sentralItem.mesins[0]"
            :class="'mt-3'" :is-rekap="true">
            <TabItem v-for="(mesinItem, mesinIndex) in sentralItem.mesins[0]" :key="mesinIndex"
              :title="mesinItem.mesin">
              <template v-if="sentralData.length">
                <div class="mt-6">
                  <div class="flex items-start justify-start mt-3 space-x-5">
                    <img v-if="mesinItem.photo1 !== ''" :src="mesinItem.photo2" alt="Preview"
                      class="object-cover w-40 mr-6 rounded-lg h-44"></img>
                    <div v-else class="w-40 mr-6 bg-red-500 rounded-lg h-44"></div>
                    <div class="grid flex-1 w-full grid-cols-4 gap-y-5 gap-x-12">
                      <div>
                        <h3 class="text-gray-400">Nilai Aset Awal</h3>
                        <p class="text-sm text-gray-400">
                          <span class="font-semibold text-primaryTextColor">{{ mesinItem.nilai_asset_awal === '-' ?
                            mesinItem.nilai_asset_awal : globalFormat.formatRupiah(mesinItem.nilai_asset_awal / 1000000)
                            }}</span> Rp (Juta)
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Tahun COD</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ mesinItem.tahun }}
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
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ mesinItem.sisa_masa_manfaat }}<span class="text-gray-400">
                            Tahun</span>
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Tahun Awal Data</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">{{ mesinItem.tahun_nilai_perolehan === ''
                          ? '-' :
                          mesinItem.tahun_nilai_perolehan }}</p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Daya Terpasang</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ globalFormat.formatRupiah(mesinItem.daya_terpasang) }}<span class="text-gray-400">
                            MW</span>
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Daya Mampu Netto (DMN)</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ globalFormat.formatRupiah(mesinItem.daya_mampu) }}<span class="text-gray-400"> MW</span>
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">Kondisi Mesin</h3>
                        <p class="text-sm font-semibold text-primaryTextColor">
                          {{ mesinItem.kondisi_unit }}
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">IRR on Equity</h3>
                        <p class="flex items-center text-sm space-x-1.5 font-semibold" v-if="mesinSisaIRRNPV.filter((mesin) => mesin.id_mesin ===
                          mesinItem.id_mesin).length === 0
                        ">-<span class="ml-1 mr-0.5 text-gray-400"> %</span>
                          <KeteranganAnomali />
                        </p>
                        <p class="flex items-center text-sm space-x-1.5 font-semibold"
                          :class="{ 'text-warningColor': irrItem.irr_on_equity < 9 || irrItem.irr_on_equity > 14, 'text-green-500': irrItem.irr_on_equity > 9 && irrItem.irr_on_equity < 14 }"
                          v-for="(irrItem, irrIndex) in mesinSisaIRRNPV.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)"
                          :key="irrIndex" v-else>
                          {{ irrItem.irr_on_equity === '' ? 'NUM' : globalFormat.formatRupiah(irrItem.irr_on_equity) }}
                          <span class="ml-1 mr-0.5">%</span>
                          <KeteranganAnomali :value="irrItem.irr_on_equity" />
                        </p>
                      </div>
                      <div>
                        <h3 class="text-gray-400">NPV on Equity</h3>
                        <p class="text-sm font-semibold"
                          v-if="mesinSisaIRRNPV.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin).length === 0">-
                          <span class="text-gray-400">Rp (Juta)</span>
                        </p>
                        <p class="text-sm font-semibold text-primaryTextColor"
                          v-for="(npvItem, npvIndex) in mesinSisaIRRNPV.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)"
                          :key="npvIndex" v-else>{{
                            globalFormat.formatRupiah(npvItem.npv_on_equity) }}
                          <span class="text-gray-400">Rp (Juta)</span>
                        </p>
                      </div>
                      <div v-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0]">
                        <h3 class="text-gray-400">Feasibility Study</h3>
                        <ComponentNotInput
                          v-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data belum terisi'" />
                        <ComponentDisetujui
                          v-else-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data sudah update'" />
                        <ComponentDraft
                          v-else-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Draft'" />
                        <ComponentWaitingT1
                          v-else-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Menunggu Persetujuan T1'" />
                        <ComponentWaitingT2
                          v-else-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Menunggu Persetujuan T2'" />
                        <ComponentDitolakT1
                          v-else-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Ditolak T1'" />
                        <ComponentDitolakT2
                          v-else-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Ditolak T2'" />
                      </div>
                      <div v-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0]">
                        <h3 class="text-gray-400">Realisasi</h3>
                        <ComponentNotInput
                          v-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data belum terisi'" />
                        <ComponentNotUpdate
                          v-else-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data belum update'" />
                        <ComponentDisetujui
                          v-else-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data sudah update'" />
                        <ComponentDraft
                          v-else-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Draft'" />
                        <ComponentWaitingT1
                          v-else-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Menunggu Persetujuan T1'" />
                        <ComponentWaitingT2
                          v-else-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Menunggu Persetujuan T2'" />
                        <ComponentDitolakT1
                          v-else-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Ditolak T1'" />
                        <ComponentDitolakT2
                          v-else-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Ditolak T2'" />
                      </div>
                      <div v-else class="space-y-2">
                        <ShimmerLoading class="w-18 h-3 mt-0.5" />
                        <ShimmerLoading class="h-3 w-28" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-4 border-b" v-if="userRole !== 'Approver'"></div>
                <div class="flex mt-2 space-x-3"
                  v-if="listStatusInputAsumsiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0]">
                  <RouterLink
                    :to="checkUnggahRequiredProp(mesinItem.nilai_asset_awal, mesinItem.tahun_nilai_perolehan, mesinItem.masa_manfaat) ? '' : { name: 'input-asumsi-parameter', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(mesinItem.id_mesin) : mesinItem.id_mesin } }"
                    v-if="userLevel === 'Admin' || userLevel === 'Sentral' || (userLevel === 'Pembina' && userRole === 'Input')">
                    <button
                      class="flex items-center p-3 space-x-2 duration-300 rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white"
                      id="hover-button"
                      @click="checkUnggahRequiredProp(mesinItem.nilai_asset_awal, mesinItem.tahun_nilai_perolehan, mesinItem.masa_manfaat) ? isRequiredPropsComplete = true : null; currentNamaMesin = mesinItem.mesin; currentIdSentral = sentralItem.id_sentral; currentKodePengelola = sentralItem.kode_pengelola">
                      <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15 7.205C14.9922 7.1361 14.9771 7.06822 14.955 7.0025V6.935C14.9189 6.85788 14.8708 6.787 14.8125 6.725L10.3125 2.225C10.2505 2.16666 10.1796 2.11856 10.1025 2.0825H10.035C9.95881 2.03881 9.87467 2.01076 9.7875 2H5.25C4.65326 2 4.08097 2.23705 3.65901 2.65901C3.23705 3.08097 3 3.65326 3 4.25V14.75C3 15.3467 3.23705 15.919 3.65901 16.341C4.08097 16.7629 4.65326 17 5.25 17H12.75C13.3467 17 13.919 16.7629 14.341 16.341C14.7629 15.919 15 15.3467 15 14.75V7.25V7.205ZM10.5 4.5575L12.4425 6.5H11.25C11.0511 6.5 10.8603 6.42098 10.7197 6.28033C10.579 6.13968 10.5 5.94891 10.5 5.75V4.5575ZM13.5 14.75C13.5 14.9489 13.421 15.1397 13.2803 15.2803C13.1397 15.421 12.9489 15.5 12.75 15.5H5.25C5.05109 15.5 4.86032 15.421 4.71967 15.2803C4.57902 15.1397 4.5 14.9489 4.5 14.75V4.25C4.5 4.05109 4.57902 3.86032 4.71967 3.71967C4.86032 3.57902 5.05109 3.5 5.25 3.5H9V5.75C9 6.34674 9.23705 6.91903 9.65901 7.34099C10.081 7.76295 10.6533 8 11.25 8H13.5V14.75Z"
                          fill="#0099AD" />
                      </svg>
                      <span class="text-sm font-semibold">{{listStatusInputAsumsiMesin.filter((mesin) =>
                        mesin.id_mesin
                        === mesinItem.id_mesin)[0].status_kk === false ? 'Input' : 'Lihat'}} Asumsi &
                        Parameter</span>
                    </button>
                  </RouterLink>
                  <button
                    class="flex items-center p-3 space-x-2 duration-300 rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white"
                    id="hover-button"
                    v-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data belum terisi' && (userLevel === 'Admin' || userLevel === 'Sentral' || (userLevel === 'Pembina' && userRole === 'Input'))"
                    @click="checkUnggahRequiredProp(mesinItem.nilai_asset_awal, mesinItem.tahun_nilai_perolehan, mesinItem.masa_manfaat) ? isRequiredPropsComplete = true : isFSDialogOpen = true; currentIdMesin = mesinItem.id_mesin; currentNamaMesin = mesinItem.mesin; currentIdSentral = sentralItem.id_sentral; currentKodeJenisPembangkit = mesinItem.kode_jenis_pembangkit; currentKodePengelola = sentralItem.kode_pengelola">
                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13.8267 6.66779C13.368 5.6138 12.5763 4.73927 11.5731 4.17823C10.5698 3.61718 9.41027 3.40057 8.27213 3.56158C7.13398 3.72259 6.08002 4.25234 5.27175 5.06966C4.46348 5.88697 3.94549 6.94677 3.79716 8.08664C3.08142 8.25804 2.45355 8.68633 2.03279 9.29017C1.61203 9.89401 1.42768 10.6313 1.51475 11.3622C1.60181 12.093 1.95424 12.7663 2.50509 13.2544C3.05594 13.7425 3.76685 14.0113 4.50283 14.0097C4.70193 14.0097 4.89288 13.9307 5.03366 13.7899C5.17445 13.6491 5.25354 13.4581 5.25354 13.259C5.25354 13.0599 5.17445 12.869 5.03366 12.7282C4.89288 12.5874 4.70193 12.5083 4.50283 12.5083C4.10463 12.5083 3.72273 12.3501 3.44116 12.0686C3.15959 11.787 3.00141 11.4051 3.00141 11.0069C3.00141 10.6087 3.15959 10.2268 3.44116 9.94524C3.72273 9.66367 4.10463 9.50548 4.50283 9.50548C4.70193 9.50548 4.89288 9.42639 5.03366 9.2856C5.17445 9.14482 5.25354 8.95387 5.25354 8.75477C5.25546 7.86689 5.57206 7.00843 6.14709 6.33191C6.72212 5.65539 7.51835 5.20462 8.39433 5.05967C9.2703 4.91473 10.1693 5.085 10.9316 5.54023C11.6939 5.99546 12.2701 6.70618 12.558 7.54612C12.6009 7.67513 12.678 7.79005 12.7811 7.87864C12.8843 7.96722 13.0095 8.02614 13.1435 8.0491C13.6435 8.14359 14.0968 8.40464 14.4295 8.7897C14.7622 9.17477 14.9547 9.66115 14.9756 10.1696C14.9964 10.678 14.8445 11.1786 14.5446 11.5896C14.2446 12.0007 13.8143 12.2981 13.3237 12.4333C13.1306 12.483 12.9651 12.6075 12.8637 12.7792C12.7624 12.951 12.7334 13.156 12.7832 13.3491C12.833 13.5423 12.9574 13.7077 13.1292 13.8091C13.3009 13.9104 13.5059 13.9394 13.699 13.8896C14.4891 13.6809 15.1894 13.22 15.6937 12.577C16.198 11.934 16.4786 11.144 16.4931 10.327C16.5075 9.50993 16.2549 8.71051 15.7737 8.05009C15.2924 7.38967 14.6088 6.90434 13.8267 6.66779ZM9.5401 8.22176C9.46871 8.15342 9.38452 8.09984 9.29237 8.06411C9.1096 7.98903 8.9046 7.98903 8.72183 8.06411C8.62968 8.09984 8.54549 8.15342 8.47409 8.22176L6.22196 10.4739C6.0806 10.6153 6.00118 10.807 6.00118 11.0069C6.00118 11.2068 6.0806 11.3985 6.22196 11.5399C6.36332 11.6813 6.55505 11.7607 6.75496 11.7607C6.95488 11.7607 7.14661 11.6813 7.28797 11.5399L8.25639 10.564V14.7605C8.25639 14.9596 8.33548 15.1505 8.47626 15.2913C8.61705 15.4321 8.808 15.5112 9.0071 15.5112C9.2062 15.5112 9.39714 15.4321 9.53793 15.2913C9.67872 15.1505 9.75781 14.9596 9.75781 14.7605V10.564L10.7262 11.5399C10.796 11.6103 10.879 11.6661 10.9705 11.7042C11.062 11.7423 11.1601 11.762 11.2592 11.762C11.3583 11.762 11.4565 11.7423 11.5479 11.7042C11.6394 11.6661 11.7224 11.6103 11.7922 11.5399C11.8626 11.4701 11.9184 11.3871 11.9566 11.2956C11.9947 11.2041 12.0143 11.106 12.0143 11.0069C12.0143 10.9078 11.9947 10.8097 11.9566 10.7182C11.9184 10.6267 11.8626 10.5437 11.7922 10.4739L9.5401 8.22176Z"
                        fill="#0099AD" />
                    </svg>
                    <span class="text-sm font-semibold">Unggah Feasibility Study</span>
                  </button>
                  <RouterLink :to="{
                    name: 'feasibility-study', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(mesinItem.id_mesin) : mesinItem.id_mesin },
                  }
                    "
                    v-else-if="statusFSMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data sudah update' && userRole !== 'Approver'">
                    <button
                      class="flex items-center p-3 space-x-2 duration-300 rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white"
                      id="hover-button">
                      <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15 7.205C14.9922 7.1361 14.9771 7.06822 14.955 7.0025V6.935C14.9189 6.85788 14.8708 6.787 14.8125 6.725L10.3125 2.225C10.2505 2.16666 10.1796 2.11856 10.1025 2.0825H10.035C9.95881 2.03881 9.87467 2.01076 9.7875 2H5.25C4.65326 2 4.08097 2.23705 3.65901 2.65901C3.23705 3.08097 3 3.65326 3 4.25V14.75C3 15.3467 3.23705 15.919 3.65901 16.341C4.08097 16.7629 4.65326 17 5.25 17H12.75C13.3467 17 13.919 16.7629 14.341 16.341C14.7629 15.919 15 15.3467 15 14.75V7.25V7.205ZM10.5 4.5575L12.4425 6.5H11.25C11.0511 6.5 10.8603 6.42098 10.7197 6.28033C10.579 6.13968 10.5 5.94891 10.5 5.75V4.5575ZM13.5 14.75C13.5 14.9489 13.421 15.1397 13.2803 15.2803C13.1397 15.421 12.9489 15.5 12.75 15.5H5.25C5.05109 15.5 4.86032 15.421 4.71967 15.2803C4.57902 15.1397 4.5 14.9489 4.5 14.75V4.25C4.5 4.05109 4.57902 3.86032 4.71967 3.71967C4.86032 3.57902 5.05109 3.5 5.25 3.5H9V5.75C9 6.34674 9.23705 6.91903 9.65901 7.34099C10.081 7.76295 10.6533 8 11.25 8H13.5V14.75Z"
                          fill="#0099AD" />
                      </svg>
                      <span class="text-sm font-semibold">Lihat Feasibility Study</span>
                    </button>
                  </RouterLink>
                  <button
                    class="flex items-center p-3 space-x-2 duration-300 rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white"
                    id="hover-button"
                    v-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data belum terisi' && (userLevel === 'Admin' || userLevel === 'Sentral' || (userLevel === 'Pembina' && userRole === 'Input'))"
                    @click="checkUnggahRequiredProp(mesinItem.nilai_asset_awal, mesinItem.tahun_nilai_perolehan, mesinItem.masa_manfaat) ? isRequiredPropsComplete = true : checkInputAsumsi(mesinItem.id_mesin) ? isRekapDialogOpen = true : isNotAlreadyInput = true; currentIdMesin = mesinItem.id_mesin; currentNamaMesin = mesinItem.mesin; currentIdSentral = sentralItem.id_sentral; currentKodePengelola = sentralItem.kode_pengelola">
                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13.8267 6.66779C13.368 5.6138 12.5763 4.73927 11.5731 4.17823C10.5698 3.61718 9.41027 3.40057 8.27213 3.56158C7.13398 3.72259 6.08002 4.25234 5.27175 5.06966C4.46348 5.88697 3.94549 6.94677 3.79716 8.08664C3.08142 8.25804 2.45355 8.68633 2.03279 9.29017C1.61203 9.89401 1.42768 10.6313 1.51475 11.3622C1.60181 12.093 1.95424 12.7663 2.50509 13.2544C3.05594 13.7425 3.76685 14.0113 4.50283 14.0097C4.70193 14.0097 4.89288 13.9307 5.03366 13.7899C5.17445 13.6491 5.25354 13.4581 5.25354 13.259C5.25354 13.0599 5.17445 12.869 5.03366 12.7282C4.89288 12.5874 4.70193 12.5083 4.50283 12.5083C4.10463 12.5083 3.72273 12.3501 3.44116 12.0686C3.15959 11.787 3.00141 11.4051 3.00141 11.0069C3.00141 10.6087 3.15959 10.2268 3.44116 9.94524C3.72273 9.66367 4.10463 9.50548 4.50283 9.50548C4.70193 9.50548 4.89288 9.42639 5.03366 9.2856C5.17445 9.14482 5.25354 8.95387 5.25354 8.75477C5.25546 7.86689 5.57206 7.00843 6.14709 6.33191C6.72212 5.65539 7.51835 5.20462 8.39433 5.05967C9.2703 4.91473 10.1693 5.085 10.9316 5.54023C11.6939 5.99546 12.2701 6.70618 12.558 7.54612C12.6009 7.67513 12.678 7.79005 12.7811 7.87864C12.8843 7.96722 13.0095 8.02614 13.1435 8.0491C13.6435 8.14359 14.0968 8.40464 14.4295 8.7897C14.7622 9.17477 14.9547 9.66115 14.9756 10.1696C14.9964 10.678 14.8445 11.1786 14.5446 11.5896C14.2446 12.0007 13.8143 12.2981 13.3237 12.4333C13.1306 12.483 12.9651 12.6075 12.8637 12.7792C12.7624 12.951 12.7334 13.156 12.7832 13.3491C12.833 13.5423 12.9574 13.7077 13.1292 13.8091C13.3009 13.9104 13.5059 13.9394 13.699 13.8896C14.4891 13.6809 15.1894 13.22 15.6937 12.577C16.198 11.934 16.4786 11.144 16.4931 10.327C16.5075 9.50993 16.2549 8.71051 15.7737 8.05009C15.2924 7.38967 14.6088 6.90434 13.8267 6.66779ZM9.5401 8.22176C9.46871 8.15342 9.38452 8.09984 9.29237 8.06411C9.1096 7.98903 8.9046 7.98903 8.72183 8.06411C8.62968 8.09984 8.54549 8.15342 8.47409 8.22176L6.22196 10.4739C6.0806 10.6153 6.00118 10.807 6.00118 11.0069C6.00118 11.2068 6.0806 11.3985 6.22196 11.5399C6.36332 11.6813 6.55505 11.7607 6.75496 11.7607C6.95488 11.7607 7.14661 11.6813 7.28797 11.5399L8.25639 10.564V14.7605C8.25639 14.9596 8.33548 15.1505 8.47626 15.2913C8.61705 15.4321 8.808 15.5112 9.0071 15.5112C9.2062 15.5112 9.39714 15.4321 9.53793 15.2913C9.67872 15.1505 9.75781 14.9596 9.75781 14.7605V10.564L10.7262 11.5399C10.796 11.6103 10.879 11.6661 10.9705 11.7042C11.062 11.7423 11.1601 11.762 11.2592 11.762C11.3583 11.762 11.4565 11.7423 11.5479 11.7042C11.6394 11.6661 11.7224 11.6103 11.7922 11.5399C11.8626 11.4701 11.9184 11.3871 11.9566 11.2956C11.9947 11.2041 12.0143 11.106 12.0143 11.0069C12.0143 10.9078 11.9947 10.8097 11.9566 10.7182C11.9184 10.6267 11.8626 10.5437 11.7922 10.4739L9.5401 8.22176Z"
                        fill="#0099AD" />
                    </svg>
                    <span class="text-sm font-semibold">Unggah Kertas Kerja</span>
                  </button>
                  <RouterLink
                    :to="{ name: 'perbarui-data', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(mesinItem.id_mesin) : mesinItem.id_mesin } }"
                    v-else-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data belum update' && (userLevel === 'Admin' || userLevel === 'Sentral' || (userLevel === 'Pembina' && userRole === 'Input'))">
                    <button
                      class="flex items-center p-3 space-x-2 duration-300 rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white"
                      id="hover-button">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_3316_23230)">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M11.9546 2.04468C11.7553 1.84535 11.4321 1.84535 11.2328 2.04468L10.6609 2.61657L11.3827 3.33841L11.9546 2.76652C12.154 2.56719 12.154 2.24401 11.9546 2.04468ZM10.5578 4.16337L9.83595 3.44153L2.85109 10.4264C2.61123 10.6663 2.43491 10.9621 2.33807 11.2872L2.17937 11.8199L2.71213 11.6612C3.03723 11.5644 3.33307 11.3881 3.57294 11.1482L10.5578 4.16337ZM10.4078 1.21972C11.0628 0.56478 12.1247 0.56478 12.7796 1.21972C13.4345 1.87466 13.4345 2.93653 12.7796 3.59148L4.39789 11.9732C4.02097 12.3501 3.55606 12.6272 3.04519 12.7794L1.47901 13.2459C1.27373 13.3071 1.05145 13.2508 0.899995 13.0993C0.748539 12.9479 0.692269 12.7256 0.753417 12.5203L1.21996 10.9541C1.37213 10.4433 1.64921 9.97836 2.02613 9.60144L10.4078 1.21972Z"
                            fill="#0099AD" />
                        </g>
                        <defs>
                          <clipPath id="clip0_3316_23230">
                            <rect width="14" height="14" fill="" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span class="ml-2 font-semibold">Perbaharui Data</span>
                    </button>
                  </RouterLink>
                  <RouterLink
                    :to="{ name: 'detail-rekap', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(mesinItem.id_mesin) : mesinItem.id_mesin }, query: { tahun: tahunBerjalan } }"
                    v-else-if="statusRealisasiMesin.filter((mesin) => mesin.id_mesin === mesinItem.id_mesin)[0].status === 'Data sudah update' && userRole !== 'Approver'">
                    <button
                      class="flex items-center p-3 space-x-2 duration-300 rounded-lg text-primaryColor hover:bg-primaryColor hover:text-white"
                      id="hover-button">
                      <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15 7.205C14.9922 7.1361 14.9771 7.06822 14.955 7.0025V6.935C14.9189 6.85788 14.8708 6.787 14.8125 6.725L10.3125 2.225C10.2505 2.16666 10.1796 2.11856 10.1025 2.0825H10.035C9.95881 2.03881 9.87467 2.01076 9.7875 2H5.25C4.65326 2 4.08097 2.23705 3.65901 2.65901C3.23705 3.08097 3 3.65326 3 4.25V14.75C3 15.3467 3.23705 15.919 3.65901 16.341C4.08097 16.7629 4.65326 17 5.25 17H12.75C13.3467 17 13.919 16.7629 14.341 16.341C14.7629 15.919 15 15.3467 15 14.75V7.25V7.205ZM10.5 4.5575L12.4425 6.5H11.25C11.0511 6.5 10.8603 6.42098 10.7197 6.28033C10.579 6.13968 10.5 5.94891 10.5 5.75V4.5575ZM13.5 14.75C13.5 14.9489 13.421 15.1397 13.2803 15.2803C13.1397 15.421 12.9489 15.5 12.75 15.5H5.25C5.05109 15.5 4.86032 15.421 4.71967 15.2803C4.57902 15.1397 4.5 14.9489 4.5 14.75V4.25C4.5 4.05109 4.57902 3.86032 4.71967 3.71967C4.86032 3.57902 5.05109 3.5 5.25 3.5H9V5.75C9 6.34674 9.23705 6.91903 9.65901 7.34099C10.081 7.76295 10.6533 8 11.25 8H13.5V14.75Z"
                          fill="#0099AD" />
                      </svg>
                      <span class="text-sm font-semibold">Lihat Detail Rekap</span>
                    </button>
                  </RouterLink>
                </div>
                <div class="flex mt-2 space-x-3" v-else>
                  <ShimmerLoading class="w-48 h-9" />
                  <ShimmerLoading class="w-48 h-9" />
                  <ShimmerLoading class="w-48 h-9" />
                </div>
              </template>
            </TabItem>
          </TabWrapperSentral>
        </div>
      </div>
      <ModalWrapper :show-modal="isModalUnggahKertasKerjaOpen" :width="'w-[750px]'" :height="'h-auto'"
        @on-escape="isModalUnggahKertasKerjaOpen = false; selectedFileEvidence = null">
        <div class="flex flex-col space-y-5">
          <div class="flex flex-row items-center justify-between">
            <p class="text-xl font-bold text-primaryTextColor">Unggah Kertas Kerja</p>
            <button @click="isModalUnggahKertasKerjaOpen = false; selectedFileEvidence = null">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="flex flex-row items-center justify-between">
              <div class="flex flex-col space-y-3">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-semibold text-labelColor">Template Kertas Kerja <span
                      class="font-semibold text-warningColor">*</span></p>
                  <p class="text-xs text-textDisabledColor">Template ini wajib digunakan saat pertama kali
                    menginput
                    data Kertas Kerja</p>
                </div>
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-semibold text-labelColor">Unggah <span
                      class="font-semibold text-warningColor">*</span></p>
                  <p class="text-xs text-textDisabledColor">Silahkan unggah Kertas Kerja anda</p>
                </div>
              </div>
              <button
                class="px-3 py-2 font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
                @click="handleDownloadTemplateRekap()">
                Download Template
              </button>
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
          <div class="flex flex-col space-y-3">
            <div class="flex flex-row items-center justify-between">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-semibold text-labelColor">Evidence</p>
                <p class="text-xs text-textDisabledColor">Silahkan unggah Evidence yang berkaitan dengan Kertas
                  Kerja</p>
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
              @click="selectedFile = null; selectedFileEvidence = null">Reset</button>
            <button
              class="px-3 py-2 font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:text-white hover:bg-hoverColor hover:border-hoverColor active:ring active:ring-infoComponentBorderColor active:duration-0"
              @click="uploadFile">Kirim</button>
          </div>
        </div>
      </ModalWrapper>
      <ModalWrapper :show-modal="isModalUnggahFSOpen" :width="'w-[750px]'" :height="'h-auto'"
        @on-escape="isModalUnggahFSOpen = false; selectedFileEvidence = null">
        <div class="flex flex-col space-y-5">
          <div class="flex flex-row items-center justify-between">
            <p class="text-xl font-bold text-primaryTextColor">Unggah Feasibility Study</p>
            <button @click="isModalUnggahFSOpen = false; selectedFileEvidence = null">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round" />
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
      <ModalWrapper :show-modal="isRekapDialogOpen" :width="'w-[550px]'" :height="'h-auto'"
        @on-escape="isRekapDialogOpen = false">
        <ConfirmationDialog :title="'Unggah Kertas Kerja ?'"
          :subtitle="'Apakah anda yakin ingin melanjutkan unggah Kertas Kerja ?'" :button-title="'Unggah Kertas Kerja'"
          @on-batal-click="isRekapDialogOpen = false"
          @on-accept-click="isRekapDialogOpen = false; isModalUnggahKertasKerjaOpen = true" />
      </ModalWrapper>
      <ModalWrapper :show-modal="isFSDialogOpen" :width="'w-[550px]'" :height="'h-auto'"
        @on-escape="isFSDialogOpen = false">
        <ConfirmationDialog :title="'Unggah Feasibility Study ?'"
          :subtitle="'Apakah anda yakin ingin melanjutkan unggah Feasibility Study ?'" :button-title="'Unggah FS'"
          @on-batal-click="isFSDialogOpen = false"
          @on-accept-click="isFSDialogOpen = false; isModalUnggahFSOpen = true" />
      </ModalWrapper>
      <ModalWrapper :show-modal="isNotAlreadyInput" :width="'w-80'" :height="'h-auto'"
        @on-escape="isNotAlreadyInput = false">
        <div class="flex flex-col items-center space-y-5">
          <Vue3Lottie :animation-data="LottieInfo" :width="150" :height="150" />
          <p class="text-xl font-semibold text-center text-primaryTextColor">Asumsi & Parameter Belum Diisi</p>
          <p class="text-base text-center text-textDisabledColor">Silahkan lengkapi Asumsi & Parameter terlebih
            dahulu,
            sebelum melanjutkan aksi lebih lanjut</p>
          <div class="flex flex-col w-full space-y-3">
            <RouterLink
              :to="{ name: 'input-asumsi-parameter', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(currentIdMesin) : currentIdMesin } }">
              <button
                class="w-full px-3 py-2 text-sm font-semibold text-white duration-300 rounded-lg bg-primaryColor hover:bg-hoverColor active:bg-hoverColor active:bg-opacity-80 active:ring active:ring-hoverColor active:ring-opacity-90 active:duration-0">Input
                Asumsi &
                Parameter</button>
            </RouterLink>
            <button
              class="w-full px-3 py-2 text-sm font-semibold bg-white rounded-lg text-primaryColor hover:outline hover:outline-primaryColor active:bg-primaryColor active:bg-opacity-10"
              @click="isNotAlreadyInput = false">Batal</button>
          </div>
        </div>
      </ModalWrapper>
      <ModalWrapper :showModal="isRekapUploadSuccess" :width="'w-80'" :height="'h-auto'">
        <div class="flex flex-col items-center">
          <Vue3Lottie :animationData="jsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
          <h1 class="mb-3 text-lg font-semibold text-gray-700">
            Kertas Kerja Terkirim
          </h1>
          <p class="text-sm text-textDisabledColor">
            Kertas Kerja berhasil dikirim
          </p>
        </div>
      </ModalWrapper>
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
      <ModalWrapper :showModal="isRequiredPropsComplete" :width="'w-80'" :height="'h-auto'">
        <div class="flex flex-col items-center">
          <Vue3Lottie :animationData="LottieInfo" :width="150" :height="150" />
          <h1 class="mb-3 text-lg font-semibold text-center text-gray-700">
            Informasi Mesin Belum Lengkap
          </h1>
          <p class="mb-3 text-sm text-textDisabledColor">
            Silahkan lakukan pengisian informasi mesin terlebih dahulu pada menu master unit sentral, sebelum
            melanjutkan.
          </p>
          <div class="flex flex-col w-full space-y-3">
            <RouterLink :to="{
              name: 'detail-unit',
              params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(currentIdSentral) : currentIdSentral },
              query: { kode_pengelola: currentKodePengelola, tab: currentNamaMesin }
            }">
              <button
                class="w-full px-3 py-2 text-sm font-semibold text-white duration-300 rounded-lg bg-primaryColor hover:bg-hoverColor active:bg-hoverColor active:bg-opacity-80 active:ring active:ring-hoverColor active:ring-opacity-90 active:duration-0">Lengkapi
                Informasi Mesin</button>
            </RouterLink>
            <button
              class="w-full px-3 py-2 text-sm font-semibold bg-white rounded-lg text-primaryColor hover:outline hover:outline-primaryColor active:bg-primaryColor active:bg-opacity-10"
              @click="isRequiredPropsComplete = false">Tutup</button>
          </div>
        </div>
      </ModalWrapper>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-2 text-sm">
          <span>Menampilkan</span>
          <select v-model.number="navigationStore.pageLimit" name="" id=""
            class="p-2 text-sm text-gray-500 border-r-4 border-transparent rounded-lg cursor-pointer outline-1 outline outline-gray-300"
            @change="changePageLimit">
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
            <button @click="goToPrevious" :disabled="navigationStore.currentPage === 1"
              :class="{ 'text-gray-500': navigationStore.currentPage === 1 }"
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
            class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
            :class="{ selected: item === navigationStore.currentPage, disabled: item === '...' }"
            @click="goToPage(item)">
            {{ item }}
          </li>
          <li>
            <button @click="goToNext" :disabled="navigationStore.currentPage === totalPages"
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
    </template>
    <template v-else>
      <div class="flex flex-col items-center justify-center w-full py-10 space-y-3">
        <IconEmptyData />
        <p class="text-lg font-semibold text-textDisabledColor">Data Belum Tersedia</p>
        <p class="text-sm text-textDisabledColor">Data Sentral Belum Tersedia</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { Vue3Lottie } from "vue3-lottie";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import { useWindowScroll } from '@vueuse/core'
const { x, y } = useWindowScroll()
import { useRekapSearchStore, useRekapNavigationStore } from "@/store/storeRekapKertasKerja";
const store = useRekapSearchStore();
const navigationStore = useRekapNavigationStore();
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import RekapService from "@/services/rekap-service";
const rekapService = new RekapService();
import AuthService from "@/services/auth-service";
const authService = new AuthService();
import DetailSentralService from "@/services/detail-sentral-service";
const detailSentralService = new DetailSentralService();
import { notifyError } from "@/services/helper/toast-notification";
import type { CheckboxValueType } from 'element-plus';
import SearchBoxSuggestion from "@/components/ui/SearchBoxSuggestion.vue";
import LottieInfo from "@/assets/lottie/info.json";
import ComponentDraft from "@/components/Status/ComponentDraft.vue";
import ComponentDisetujui from "@/components/Status/ComponentDisetujui.vue";
import ComponentDitolakT1 from "@/components/Status/ComponentDitolakT1.vue";
import ComponentDitolakT2 from "@/components/Status/ComponentDitolakT2.vue";
import ComponentWaitingT1 from "@/components/Status/ComponentWaitingT1.vue";
import ComponentWaitingT2 from "@/components/Status/ComponentWaitingT2.vue";
import ComponentNotInput from "@/components/Status/ComponentNotInput.vue";
import ComponentNotUpdate from "@/components/Status/ComponentNotUpdate.vue";
import TabWrapperSentral from "@/components/MasterUnitSentral/TabWrapperSentral.vue";
import TabItem from "@/components/ui/TabItem.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import KeteranganAnomali from "@/components/RekapKertasKerja/KeteranganAnomali.vue";
import IconEmptyData from "@/components/icons/IconEmptyData.vue";
import jsonData from "@/assets/lottie/success.json";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog.vue";
import IconFolder from "@/components/icons/IconFolder.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";

const isLoading = ref<boolean>(false);
const nodeMode = import.meta.env.MODE;
const isPembangkitTabOpen = ref<string[]>([]);
const sentralData = ref<SentralItem[]>([]);
const pengelolaData = ref<any[]>([]);
const kategoriPembangkitData = ref<any[]>([]);
const kategoriUmurMesinData = ref<any[]>([]);
const kategoriKondisiMesinData = ref<any[]>([]);
const comboJenisKit = ref<any[]>([]);
const comboUmurMesin = ref<any[]>([]);
const checkAllUmurMesin = ref(false);
const comboKondisiMesin = ref<any[]>([]);
const checkAllKondisiMesin = ref(false);
const checkPembangkit = ref(false)
const checkDmn = ref(false)
const pengelola = ref<CheckboxValueType[]>([])
const indeterminate = ref(false);
const indeterminateDmn = ref(false);
const listSentralData = ref<any[]>([]);
const selectedKategoriPembangkit = ref<string[]>([]);
const dmn = ref<CheckboxValueType[]>([])
const itemsDmn = ref<{
  [x: string]: any; id: string; name: string;
}[]>([])
const childDmn = ref<any[]>([])
const selectedUmurMesin = ref<string[]>([]);
const selectedKondisiMesin = ref<any[]>([]);
const isSearchModalOpen = ref<boolean>(false);
const sentralAssetIRRNPV = ref<any[]>([]);
const mesinSisaIRRNPV = ref<any[]>([]);
const statusFSSentral = ref<any[]>([]);
const statusFSMesin = ref<any[]>([]);
const statusRealisasiSentral = ref<any[]>([])
const statusRealisasiMesin = ref<any[]>([])
const comboIRR = ref<any[]>([]);
const isFSUploadSuccess = ref(false);
const isEvidenceSuccess = ref<boolean>(false);
const showModal = ref(false);
const selectedPengelola = ref<any[]>([]);
const isNotAlreadyInput = ref(false);
const isRekapDialogOpen = ref(false);
const isFSDialogOpen = ref(false);
const kodePengelola = ref<any>('ALL');
const tahunBerjalan = ref<number>(new Date().getFullYear());
const listStatusInputAsumsiSentral = ref<any[]>([]);
const listStatusInputAsumsiMesin = ref<any[]>([]);
const isModalUnggahKertasKerjaOpen = ref<boolean>(false);
const isModalUnggahFSOpen = ref<boolean>(false);
const currentKodePengelola = ref<string>('');
const listSuggestionSentral = ref();
const isRequiredPropsComplete = ref<boolean>(false);
const currentIdMesin = ref<string>('');
const currentIdSentral = ref<string>('');
const currentNamaMesin = ref<string>('');
const currentKodeJenisPembangkit = ref<string>('');
const isRekapUploadSuccess = ref(false);
const totalPagesRef = ref(1);
const totalRecords = ref(0);
const totalPages = ref(0);
const userLevel = ref<string | null>(null);
const userRole = ref<string | null>(null);
let encryptStorageRef: any = null;

interface PengelolaItem {
  data: any
  id_pengelola: number
  kode_pengelola: string
  pengelola: string
}
interface SentralItem {
  meta: any
  data: any
  id_sentral: any
  sentral: string
  kode_sentral: string
  jenis_pembangkit: string
  bbm: string
  daya_terpasang: number
  daya_mampu: number
  irr_equity: string
  npv_equity: string
  kode_pengelola: string
  mesins: any
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const fetchSuggestionSentral = async () => {
  try {
    const response: any = await rekapService.getSuggestionSentral();
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
    const response: SentralItem = await rekapService.getSentralData(store.searchRekapQuery, selectedPengelola.value, selectedKategoriPembangkit.value, dmn.value, selectedKondisiMesin.value, selectedUmurMesin.value, navigationStore.currentPage, navigationStore.pageLimit)
    if (response.data !== null) {
      if (listSentralData.value.length === 0) {
        listSentralData.value = response.data;
        sentralData.value = response.data.map((sentral: any) => ({ ...sentral, mesins: [] }));
      } else {
        sentralData.value = response.data.map((sentral: any) => ({ ...sentral, mesins: [] }));
      }
      await togglePembangkit(response.data[0].id_sentral);
      console.log(sentralData.value, 'uy');
    } else {
      sentralData.value = [];
    }
    totalRecords.value = response.meta.totalRecords;
    totalPages.value = response.meta.totalPages;
    navigationStore.pageLimit = response.meta.limit;
  } catch (error) {
    isLoading.value = false;
    console.error('Fetch Sentral Data Error : ' + error);
  }
};
const fetchMesinByIdSentral = async (idSentral: any) => {
  try {
    const mesinById: any | undefined = await rekapService.getMesinByIdSentral(idSentral);
    for (const item of mesinById.data) {
      if (item.photo1 !== '') {
        try {
          const response: any = await detailSentralService.getPhoto(item.photo1);
          const blob = new Blob([response]);
          item.photo2 = URL.createObjectURL(blob);
        } catch (error) {
          console.error('Error Fetch Photo: ', error)
        }
      }
    }
    const sentral: any | undefined = sentralData.value.filter((sentral) => sentral.id_sentral === idSentral);
    return { mesinById, sentral };
  } catch (error) {
    console.error('Fetch Mesin By Kode Sentral Error : ' + error);
  }
}
const fetchPengelolaData = async () => {
  try {
    const response: PengelolaItem = await rekapService.getPengelolaData();
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

const fetchComboKategoriPembangkit = async () => {
  try {
    const response: any = await rekapService.getComboKategoriPembangkit();
    if (response.success) {
      kategoriPembangkitData.value = []
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          kategoriPembangkitData.value.push({
            id: item.jenis_kit,
            name: item.jenis_kit
          })
          if (item.dmn) {
            item.dmn.map((child: any) => {
              if (child.daya_mampu != "")
                childDmn.value.push({
                  id: child.id_daya,
                  name: 'PLTU ' + child.daya_mampu
                })
            })
          }
        })
      }
    }
    kategoriPembangkitData.value.reverse();
    const comboJenisKitData = response.data;
    for (const item of comboJenisKitData) {
      comboJenisKit.value.push({
        name: item.jenis_kit,
        id: item.jenis_kit,
      })
    }
  } catch (error) {
    console.error("Fetch Filter Kategori Error : " + error);
  }
};
const fetchComboUmurMesin = async () => {
  try {
    const response: any = await rekapService.getComboUmurMesin();
    const comboUmurMesinData = response.data;
    kategoriUmurMesinData.value = response.data
    for (const item of comboUmurMesinData) {
      comboUmurMesin.value.push({
        name: item.umur_mesin,
        id: item.umur_mesin,
      })
    }
  } catch (error) {
    console.error("Fetch Umur Mesin Error : " + error);
  }
};
const fetchComboKondisiMesin = async () => {
  try {
    const response: any = await rekapService.getComboKondisiMesin();
    const comboKondisiMesinData = response.data;
    kategoriKondisiMesinData.value = response.data;
    for (const item of comboKondisiMesinData) {
      comboKondisiMesin.value.push({
        name: item.kondisi_unit,
        id: item.kondisi_unit,
      })
    }
  } catch (error) {
    console.error('Fetch Kondisi Mesin Error : ' + error);
  }
}
const fetchComboIRR = async () => {
  try {
    const response: any = await rekapService.getComboIRR();
    const comboIRRData = response.data;
    for (const item of comboIRRData) {
      comboIRR.value.push({
        name: item.nilai_irr,
        id: item.nilai_irr,
      })
    }
  } catch (error) {
    console.error('Fetch Combo IRR Error : ' + error);
  }
}
const fetchNilaiSentral = async () => {
  try {
    const response: any = await rekapService.getNilaiSentral(tahunBerjalan.value);
    if (response.data !== null) {
      sentralAssetIRRNPV.value = response.data;
    } else {
      sentralAssetIRRNPV.value = [];
    }
  } catch (error) {
    console.error('Fetch Nilai Sentral Error : ' + error)
  }
}
const fetchNilaiMesin = async () => {
  try {
    const response: any = await rekapService.getNilaiMesin(tahunBerjalan.value);
    mesinSisaIRRNPV.value = response.data === null ? [] : response.data;
  } catch (error) {
    console.error('Fetch Nilai Mesin Error : ' + error)
  }
}
const fetchStatusFSSentral = async () => {
  try {
    const response: any = await rekapService.getStatusFSSentral();
    if (response.data !== null) {
      statusFSSentral.value = response.data;
    } else {
      statusFSSentral.value = [];
    }
  } catch (error) {
    console.error('Fetch Status FS Sentral Error : ' + error);
  }
}
const fetchStatusFSMesin = async () => {
  try {
    const response: any = await rekapService.getStatusFSMesin();
    statusFSMesin.value = response.data;
  } catch (error) {
    console.error('Fetch Status FS Mesin Error : ' + error);
  }
}
const fetchStatusRealisasiSentral = async () => {
  try {
    const response: any = await rekapService.getStatusRealisasiSentral();
    statusRealisasiSentral.value = response.data;
  } catch (error) {
    console.error('Fetch Status Realisasi Sentral Error : ' + error);
  }
}
const fetchStatusRealisasiMesin = async () => {
  try {
    const response: any = await rekapService.getStatusRealisasiMesin();
    statusRealisasiMesin.value = response.data;
  } catch (error) {
    console.error('Fetch Status Realisasi Sentral Error : ' + error);
  }
}
const fetchCheckInputAsumsiSentral = async () => {
  try {
    const response: any = await rekapService.getCheckInputAsumsiSentral();
    listStatusInputAsumsiSentral.value = response.data;
  } catch (error) {
    console.error('Fetch Check Input Asumsi Mesin Error : ' + error);
  }
}
const fetchCheckInputAsumsiMesin = async () => {
  try {
    const response: any = await rekapService.getCheckInputAsumsiMesin();
    listStatusInputAsumsiMesin.value = response.data;
  } catch (error) {
    console.error('Fetch Check Input Asumsi Mesin Error : ' + error);
  }
}
const handleDownloadTemplateRekap = async () => {
  try {
    isLoading.value = true;
    const response: any = await rekapService.downloadTemplateRekap(tahunBerjalan.value, tahunBerjalan.value - 1, currentIdMesin.value);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Kertas Kerja Actual - ${currentNamaMesin.value}_${tahunBerjalan.value}_${globalFormat.formatNumberFiveDigits(parseInt(currentIdMesin.value))}.xlsx`;
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link);
  } catch (error) {
    notifyError("Download Template Rekap Gagal", 3000);
    console.error("Handle Download Template Rekap Error : " + error);
  } finally {
    isLoading.value = false;
  };
}
const handleDownloadTemplateFS = async () => {
  try {
    isLoading.value = true;
    const response: any = await rekapService.downloadTemplateFS(tahunBerjalan.value, currentIdMesin.value, currentKodeJenisPembangkit.value);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Kertas Kerja FS - ${currentNamaMesin.value}_${globalFormat.formatNumberFiveDigits(parseInt(currentIdMesin.value))}.xlsx`;
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    notifyError('Download Template FS Gagal', 3000)
    console.error('Handle Download Template Rekap Error : ' + error)
  } finally {
    isLoading.value = false;
  };
};
const selectedFile: any = ref(null);
const selectedFileEvidence: any = ref(null);
const selectedFileFS: any = ref(null);
const handleFileChange = (event: any) => {
  if (event.target.files.length === 1) {
    selectedFile.value = event.target.files[0];
  } else {
    selectedFile.value = null;
  }
};
const handleFileChangeEvidence = (event: any) => {
  if (event.target.files.length === 1) {
    selectedFileEvidence.value = event.target.files[0];
  } else {
    selectedFileEvidence.value = null;
  }
};
const handleFileFSChange = (event: any) => {
  if (event.target.files.length === 1) {
    selectedFileFS.value = event.target.files[0];
  } else {
    selectedFileFS.value = null;
  }
};
const uploadFileEvidence = async (statusFS: any) => {
  try {
    isLoading.value = true
    const formData = new FormData();
    formData.append('file', selectedFileEvidence.value);
    const response: any = await rekapService.uploadEvidence(formData);
    await rekapService.updateEvidencePath(currentIdMesin.value, tahunBerjalan.value.toString(), response.data, statusFS, selectedFileEvidence.value.name);
    isLoading.value = false
    isEvidenceSuccess.value = true;
    await wait(1500)
    isEvidenceSuccess.value = false;
    isModalUnggahKertasKerjaOpen.value = false;
    await fetchStatusRealisasiSentral();
    await fetchStatusRealisasiMesin();
  } catch (error) {
    console.error('Error upload file : ', error);
  } finally {
    isLoading.value = false;
  }
}

const uploadFile = async () => {
  try {
    isLoading.value = true;
    if (!selectedFile.value) {
      notifyError('Mohon pilih file excel terlebih dahulu', 3000);
      return
    };
    if (selectedFile.value.size > 2000000) {
      notifyError('Ukuran file Kertas Kerja tidak boleh lebih dari 2MB', 5000)
      return;
    };
    const formData = new FormData()
    formData.append('file', selectedFile.value);
    if (selectedFileEvidence.value) {
      if (selectedFileEvidence.value.size > 5000000) {
        notifyError('Ukuran file Evidence tidak boleh lebih dari 5MB', 5000)
        return
      } else {
        await uploadFileEvidence(0);
      }
    }
    await rekapService.uploadTemplateAwalKK(formData);
    isLoading.value = false;
    isRekapUploadSuccess.value = true;
    await wait(1500);
    isRekapUploadSuccess.value = false;
    isModalUnggahKertasKerjaOpen.value = false;
    await fetchStatusRealisasiSentral();
    await fetchStatusRealisasiMesin();
    selectedFileEvidence.value = null;
    if (userLevel.value === 'Sentral' || userLevel.value === 'Admin' || (userLevel.value === 'Pembina' && userRole.value === 'Input')) {
      router.push({ name: 'persetujuan-kk', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(currentIdMesin.value) : currentIdMesin.value }, query: { id_sentral: currentIdSentral.value, tahun: tahunBerjalan.value } });
    }
    else {
      router.push({ name: 'persetujuan-by-approve' });
    }
  } catch (error) {
    console.error('Error upload file : ', error);
    notifyError('Upload File Gagal, mohon coba lagi', 3000);
  } finally {
    isLoading.value = false;
  }
};
const uploadFileFS = async () => {
  try {
    isLoading.value = true
    if (!selectedFileFS.value) {
      notifyError('Mohon pilih file excel terlebih dahulu', 3000);
      return;
    }
    if (selectedFileFS.value.size > 2000000) {
      notifyError('Ukuran file Feasibility Study tidak boleh lebih dari 2MB', 5000);
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFileFS.value);
    if (selectedFileEvidence.value) {
      if (selectedFileEvidence.value.size > 5000000) {
        notifyError('Ukuran file Evidence tidak boleh lebih dari 5MB', 5000);
        return;
      } else {
        await uploadFileEvidence(1);
      }
    }
    await rekapService.uploadTemplateAwalFS(formData);
    isLoading.value = false;
    isFSUploadSuccess.value = true;
    await wait(1500)
    isFSUploadSuccess.value = false;
    isModalUnggahFSOpen.value = false;
    await fetchStatusFSSentral();
    await fetchStatusFSMesin();
    selectedFileEvidence.value = null
    if (userLevel.value === 'Sentral') {
      router.push({ name: 'persetujuan-fs', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(currentIdMesin.value) : currentIdMesin.value }, query: { id_sentral: currentIdSentral.value } });
    } else {
      router.push({ name: 'persetujuan-by-approve' });
    }
  } catch (error) {
    console.error('Error upload file : ', error);
    notifyError('Upload File Gagal, mohon coba lagi', 3000);
  } finally {
    isLoading.value = false;
  }
};

const changeSelectedPengelola = async (pengelola: any) => {
  isLoading.value = true;
  if (pengelola === 'ALL') {
    if (kodePengelola.value !== 'ALL') {
      kodePengelola.value = pengelola;
      selectedPengelola.value = [];
      navigationStore.currentPage = 1;
      await fetchSentralData();
    }
  } else if (!selectedPengelola.value.includes(pengelola)) {
    selectedPengelola.value.push(pengelola);
    kodePengelola.value = null;
    navigationStore.currentPage = 1;
    await fetchSentralData();
  } else {
    if (selectedPengelola.value.length === 1) {
      kodePengelola.value = 'ALL';
    }
    const pengelolaIndex = selectedPengelola.value.indexOf(pengelola);
    selectedPengelola.value.splice(pengelolaIndex, 1);
    navigationStore.currentPage = 1;
    await fetchSentralData();
  }
  isLoading.value = false;
}
const changePageLimit = async () => {
  isLoading.value = true;
  navigationStore.currentPage = 1;
  await fetchSentralData();
  isLoading.value = false;
};
const handleSearch = async () => {
  try {
    isLoading.value = true;
    navigationStore.currentPage = 1;
    await fetchSentralData();
  } catch (error) {
    console.error('Search Error : ' + error);
  } finally {
    isLoading.value = false;
  }
}
const togglePembangkit = async (idSentral: any) => {
  isLoading.value = true;
  try {
    const { mesinById, sentral }: any = await fetchMesinByIdSentral(idSentral);
    if (isPembangkitOpen(idSentral)) {
      isPembangkitTabOpen.value = isPembangkitTabOpen.value.filter(
        (id) => id !== idSentral
      );
      sentral[0].mesins.pop()
    } else {
      isPembangkitTabOpen.value.push(idSentral);
      const finalMesin = mesinById.data.map((mesin: any) => {
        return {
          ...mesin,
          status_fs: statusFSMesin.value.find((status: any) => status.id_mesin === mesin.id_mesin)?.status,
          status_realisasi: statusRealisasiMesin.value.find((status: any) => status.id_mesin === mesin.id_mesin)?.status,
        }
      });
      sentral[0].mesins.push(finalMesin);
    }
  } catch (error) {
    console.error('Toggle Error : ', error);
  } finally {
    isLoading.value = false;
  }
};
const isPembangkitOpen = (idSentral: string) => {
  return isPembangkitTabOpen.value.includes(idSentral);
};
const goToPage = async (page: any) => {
  try {
    isLoading.value = true;
    navigationStore.currentPage = page;
    y.value = 0;
    await fetchSentralData();

  } catch (error) {
    console.error('Go To Page Error : ' + error);
  } finally {
    isLoading.value = false;
  }
};
const goToPrevious = () => {
  goToPage(navigationStore.currentPage - 1);
};
const goToNext = () => {
  goToPage(navigationStore.currentPage + 1);
};
const generatePageList = computed(() => {
  const pageList = [];
  const maxPages = 5;
  if (totalPages.value <= maxPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pageList.push(i);
    }
  } else if (navigationStore.currentPage <= 3) {
    for (let i = 1; i <= Math.min(totalPages.value, maxPages - 1); i++) {
      pageList.push(i);
    }
    if (totalPages.value > maxPages) {
      pageList.push('...');
      pageList.push(totalPages.value);
    }
  } else if (navigationStore.currentPage >= totalPages.value - 2) {
    pageList.push(1);
    pageList.push('...');
    for (let i = totalPages.value - (maxPages - 2); i <= totalPages.value; i++) {
      pageList.push(i);
    }
  } else {
    pageList.push(1);
    pageList.push('...');
    for (let i = navigationStore.currentPage - 1; i <= navigationStore.currentPage + 1; i++) {
      pageList.push(i);
    }
    pageList.push('...');
    pageList.push(totalPages.value);
  }
  return pageList;
});
const handleFocus = () => {
  isSearchModalOpen.value = true;
};
const changeSentralData = async () => {
  isLoading.value = true;
  if (!selectedKategoriPembangkit.value.includes('PLTU')) {
    dmn.value = []
  }
  await fetchSentralData();
  showModal.value = false;
  isLoading.value = false;
}
const checkInputAsumsi = (idMesin: any) => {
  const isMatched = listStatusInputAsumsiMesin.value.filter((mesin) => mesin.id_mesin === idMesin)[0].status_kk === true;
  return isMatched;
}
const checkUnggahRequiredProp = (nilaiAssetAwal: any, tahunDataAwal: any, masaManfaat: any) => {
  const isComplete: boolean = nilaiAssetAwal === '-' || tahunDataAwal === '' || masaManfaat === '0';
  return isComplete;
}
const handleCheckPembangkit = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    selectedKategoriPembangkit.value = kategoriPembangkitData.value.map((_) => _.id)
  } else {
    selectedKategoriPembangkit.value = []
  }
}
const handleCheckDmn = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    dmn.value = childDmn.value.map((_) => _.id)
  } else {
    dmn.value = []
  }
}
const handleCheckUmurMesin = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    selectedUmurMesin.value = comboUmurMesin.value.map((_) => _.id)
  } else {
    selectedUmurMesin.value = []
  }
}
const handleCheckKondisiMesin = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    selectedKondisiMesin.value = comboKondisiMesin.value.map((_) => _.id)
  } else {
    selectedKondisiMesin.value = []
  }
}

watch(totalPages, (newTotalPages) => {
  totalPagesRef.value = newTotalPages;
});

watch(isLoading, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

})

watch(pengelola, (val) => {
  if (val.length === 0) {
    checkPembangkit.value = false
    indeterminate.value = false
  } else if (val.length === kategoriPembangkitData.value.length) {
    checkPembangkit.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

watch(dmn, (val) => {
  if (val.length === 0) {
    checkDmn.value = false
    indeterminate.value = false
  } else if (val.length === childDmn.value.length) {
    checkDmn.value = true
    indeterminate.value = false
  } else {
    indeterminate.value = true
  }
})

watch(store, async (val) => {
  if (val.searchRekapQuery === '') {
    await handleSearch();
  }
});

onBeforeUnmount(() => {
  navigationStore.scrollPosition.top = y.value;
});
onMounted(async () => {
  isLoading.value = true;
  encryptStorageRef = await encryptStoragePromise;
  userLevel.value = await authService.checkLevel();
  userRole.value = await authService.checkRole();
  await fetchStatusFSSentral();
  await fetchStatusFSMesin();
  await fetchStatusRealisasiSentral();
  await fetchStatusRealisasiMesin();
  await fetchSentralData();
  await fetchSuggestionSentral();
  await fetchPengelolaData();
  y.value = navigationStore.scrollPosition.top;
  await fetchComboKategoriPembangkit();
  await fetchComboUmurMesin();
  await fetchComboKondisiMesin();
  await fetchComboIRR();
  await fetchNilaiSentral();
  await fetchNilaiMesin();
  await fetchCheckInputAsumsiSentral();
  await fetchCheckInputAsumsiMesin();
  isLoading.value = false;
});

</script>

<style lang="scss" scoped>
#button-hover-putih:hover svg,
#button-hover-putih:hover svg path,
#button-hover-putih:hover svg g path {
  fill: white;
}

ul li#pagination.selected {
  background-color: #0099AD;
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
