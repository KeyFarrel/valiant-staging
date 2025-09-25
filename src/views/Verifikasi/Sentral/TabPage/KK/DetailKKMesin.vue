<template>
  <Loading v-if="isLoading" />
  <div class="flex flex-col space-y-4">
    <InfoHeader v-if="mesin && approveSentralKK" :nama-mesin="mesin.mesin ? mesin.mesin : '-'"
      :nama-pengelola="namaPengelola ? namaPengelola : '-'" :status-mesin="mesin.kondisi_unit"
      :kode-jenis-pembangkit="mesin.kode_jenis_pembangkit ? mesin.kode_jenis_pembangkit : '-'"
      :daya-terpasang="mesin.daya_terpasang.toString()" :daya-mampu="mesin.daya_mampu.toString()"
      :tahun-operasi="mesin.tahun_operasi ? mesin.tahun_operasi : '-'"
      :umur-teknis="approveSentralKK.umur_teknis ? approveSentralKK.umur_teknis : '-'" :nama-pembina="namaPembina"
      :kondisi-unit="mesin.kondisi_unit">
      <div class="flex" v-if="approveMesinKK">
        <div v-if="approveMesinKK.status === 'Ditolak T1' || approveMesinKK.status === 'Ditolak T2'" class="flex">
          <!-- Revisi Data -->
          <RouterLink
            :to="{ name: avrIrr === 0 ? 'input-asumsi-parameter-approveKK' : 'perbarui-data-approveKK', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(approveMesinKK.uuid_mesin) : approveMesinKK.uuid_mesin }, query: { uuid_sentral: route.query.uuid_sentral, tahun: route.query.tahun } }">
            <button class="w-fit p-2 ml-1 flex items-center justify-center bg-[#0099AD] rounded-md text-white">
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
          </RouterLink>
        </div>
        <div
          v-else-if="approveMesinKK.status === 'Disetujui' || approveMesinKK.status === 'Menunggu Persetujuan T1' || approveMesinKK.status === 'Menunggu Persetujuan T2'">
        </div>
        <div v-else-if="approveMesinKK.status === 'Draft'" class="flex">
          <!-- Edit Data -->
          <RouterLink
            :to="{ name: avrIrr === 0 ? 'input-asumsi-parameter-approveKK' : 'perbarui-data-approveKK', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(approveMesinKK.uuid_mesin) : approveMesinKK.uuid_mesin }, query: { uuid_sentral: route.query.uuid_sentral, tahun: route.query.tahun } }">
            <button
              class="w-fit p-2 mr-1 flex items-center justify-center border border-[#0099AD] rounded-md text-[#0099AD] duration-300 hover:text-white">
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
          </RouterLink>
          <!-- Kirim Data -->
          <button
            class="w-fit p-2 ml-1 flex items-center justify-center bg-[#0099AD] rounded-md text-white duration-300"
            @click="modalApprove = !modalApprove">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.83301 8.16667L12.2497 1.75M5.83301 8.16667L7.87467 12.25C7.90027 12.3058 7.94136 12.3532 7.99306 12.3864C8.04476 12.4195 8.10491 12.4372 8.16634 12.4372C8.22778 12.4372 8.28792 12.4195 8.33962 12.3864C8.39132 12.3532 8.43241 12.3058 8.45801 12.25L12.2497 1.75M5.83301 8.16667L1.74967 6.125C1.69383 6.09941 1.6465 6.05832 1.61332 6.00661C1.58014 5.95491 1.5625 5.89477 1.5625 5.83333C1.5625 5.7719 1.58014 5.71176 1.61332 5.66005C1.6465 5.60835 1.69383 5.56726 1.74967 5.54167L12.2497 1.75"
                stroke="#F7FBFC" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ml-2 text-sm font-semibold text-white">Kirim Data</span>
          </button>
          <ModalWrapper :showModal="modalApprove" :width="'w-[600px]'" :height="'h-auto'">
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
                @click="updateKK()">
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
    <ShimmerLoading v-else class="w-full h-28" />

    <!-- Download Evidence -->
    <div class="flex justify-between p-4 bg-white rounded-lg">
      <div class="flex items-center">
        <div class="flex">
          <div class="w-1 h-7 mr-2 bg-[#0099AD]"></div>
          <p class="text-lg font-semibold">Evidence</p>
        </div>
      </div>
      <button
        class="flex items-center text-[#0099AD] bg-white border border-[#0099AD] px-3 py-2 rounded-lg duration-300 hover:text-white"
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
    <div class="items-start p-6 bg-white rounded-lg" v-if="mesin && approveSentralKK && approveMesinKK && tahunGrafik">
      <!-- Keterangan Ditolak -->
      <div>
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
          <p v-if="isHover && approveMesinKK" class="mt-2 ml-6 text-sm capitalize">{{ approveMesinKK.keterangan }}</p>
        </div>
      </div>
      <!-- Tabs -->
      <TabsWrapper :isLihatGrafik="true" :photo="mesin.photo1 === '' ? '' : mesin.photo2" :laman-data="false"
        :id-mesin="idGrafik.toString()" :tahun-grafik="tahunGrafik"
        :nilai-asset-awal="mesin.nilai_asset_awal ? mesin.nilai_asset_awal : 0"
        :tahun="approveSentralKK.tahun ? approveSentralKK.tahun : '-'" :irr-on-project="hasilSimulasi.track_irr_project"
        :irr-on-equity="hasilSimulasi.track_irr_equity" :npv-on-equity="hasilSimulasi.track_npv_equity"
        :wacc-on-project="hasilSimulasi.wacc_on_project" :wacc-on-equity="hasilSimulasi.wacc_on_equity"
        :npv-on-project="hasilSimulasi.track_npv_project" :average-ncf="hasilSimulasi.track_average_cf"
        :average-eaf="hasilSimulasi.track_average_eaf" :nama-mesin="mesin.mesin ? mesin.mesin : '-'"
        :nama-pengelola="approveSentralKK.pengelola ? approveSentralKK.pengelola : '-'" :nama-pembina="namaPembina"
        :daya-terpasang="mesin.daya_terpasang / 1000" :daya-mampu="mesin.daya_mampu / 1000"
        :tahun-operasi="mesin.tahun_operasi ? mesin.tahun_operasi : '-'"
        :tahun-perolehan-data="mesin.tahun_nilai_perolehan.toString() ? mesin.tahun_nilai_perolehan.toString() : '-'"
        :jumlah-mesin="jumlahMesin" :status-grafik="approveMesinKK.status">
        <TabItem title="Asumsi Makro">
          <AsumsiMakro @on-click-reload="reloadAsumsiParameter" :data="data"
            :tahun="tahunTerakhirAsumsi ? parseInt(tahunTerakhirAsumsi) : '-'"
            :status="approveMesinKK.status ? approveMesinKK.status : '-'"
            :corporate-tax-rate="asumsiParameter.corporate_tax_rate" :discount-rate="asumsiParameter.discount_rate"
            :interest-rate="asumsiParameter.interest_rate" :loan-tenor="asumsiParameter.loan_tenor"
            :loan-portion="asumsiParameter.loan_portion" :equity-portion="asumsiParameter.equity_portion"
            :is-fetching-error="asumsiParameter.isFetchingError" />
        </TabItem>
        <TabItem title="Parameter Teknis & Finansial">
          <ParameterTeknis @on-click-reload="reloadAsumsiParameter" :data="data"
            :tahun="tahunTerakhirAsumsi ? parseInt(tahunTerakhirAsumsi) : '-'"
            :status="approveMesinKK.status ? approveMesinKK.status : '-'"
            :daya-terpasang="parameterTeknisFinansial?.daya_terpasang ?? '-'"
            :daya-mampu-netto="parameterTeknisFinansial?.daya_mampu_netto_mw ?? '-'"
            :auxiliary="parameterTeknisFinansial?.auxiliary ?? '-'"
            :susut-trafo="parameterTeknisFinansial?.susut_trafo ?? '-'"
            :pemakaian-sendiri="parameterTeknisFinansial?.ps ?? '-'"
            :net-plant-heat-rate="parameterTeknisFinansial?.nphr"
            :total-project-cost="parameterTeknisFinansial?.total_project_cost" :loan="parameterTeknisFinansial?.loan"
            :equity="parameterTeknisFinansial?.equity"
            :electricity-price-a="parameterTeknisFinansial?.electricity_price_a_rp_per_kwbln"
            :electricity-price-b="parameterTeknisFinansial?.electricity_price_b_rp_per_kwbln"
            :electricity-price-c="parameterTeknisFinansial?.electricity_price_c_rp_per_kwh"
            :electricity-price-d="parameterTeknisFinansial?.electricity_price_d_rp_per_kwh" :bahan-bakars="bahanBakars"
            :combo-bahan-bakar="comboBahanBakar" :is-fetching-error="parameterTeknisFinansial.isFetchingError" />
        </TabItem>
        <TabItem title="Data Teknis">
          <div class="flex flex-col w-full space-y-2">
            <div class="flex flex-row justify-between">
              <div class="mt-0.5 mb-4">
                <p class="mb-2 text-base font-bold">Data Teknis</p>
                <div class="flex items-center text-xs">
                  <p class="font-bold">Periode</p>
                  <p class="ml-1 font-bold text-[#0099AD]">{{ approveMesinKK.tahun ? approveMesinKK.tahun : '-' }}</p>
                  <p class="ml-2">/</p>
                  <p class="ml-2 font-bold">Data</p>
                  <p class="ml-1 font-bold text-[#0099AD]">Kertas Kerja</p>
                </div>
              </div>
              <div class="flex items-center text-xs font-semibold">
                <p class="mr-2 font-normal">Status Laporan</p>
                <ComponentDitolakT1 v-if="approveMesinKK.status === 'Ditolak T1'" />
                <ComponentDitolakT2 v-else-if="approveMesinKK.status === 'Ditolak T2'" />
                <ComponentDisetujui v-else-if="approveMesinKK.status === 'Disetujui'" />
                <ComponentWaitingT1 v-else-if="approveMesinKK.status === 'Menunggu Persetujuan T1'" />
                <ComponentWaitingT2 v-else-if="approveMesinKK.status === 'Menunggu Persetujuan T2'" />
                <ComponentDraft v-else-if="approveMesinKK.status === 'Draft'" />
              </div>
            </div>
            <TableDataTeknis @on-click-reload="reloadDataTeknis" :data-teknis="dataTeknis"
              :tahun-terakhir-realisasi="parseInt(route.query.tahun?.toString() ?? '0')" :type-periodic="typePeriodic"
              :is-fetching-error="dataTeknis.isFetchingError" />
          </div>
        </TabItem>
        <TabItem title="Data Finansial">
          <div class="flex flex-col w-full space-y-2">
            <div class="flex flex-row justify-between">
              <div class="mt-0.5 mb-4">
                <p class="mb-2 text-base font-bold">Data Finansial</p>
                <div class="flex items-center text-xs">
                  <p class="font-bold">Periode</p>
                  <p class="ml-1 font-bold text-[#0099AD]">{{ approveMesinKK.tahun ? approveMesinKK.tahun : '-' }}</p>
                  <p class="ml-2">/</p>
                  <p class="ml-2 font-bold">Data</p>
                  <p class="ml-1 font-bold text-[#0099AD]">Kertas Kerja</p>
                </div>
              </div>
              <div class="flex items-center text-xs font-semibold">
                <p class="mr-2 font-normal">Status Laporan</p>
                <ComponentDitolakT1 v-if="approveMesinKK.status === 'Ditolak T1'" />
                <ComponentDitolakT2 v-else-if="approveMesinKK.status === 'Ditolak T2'" />
                <ComponentDisetujui v-else-if="approveMesinKK.status === 'Disetujui'" />
                <ComponentWaitingT1 v-else-if="approveMesinKK.status === 'Menunggu Persetujuan T1'" />
                <ComponentWaitingT2 v-else-if="approveMesinKK.status === 'Menunggu Persetujuan T2'" />
                <ComponentDraft v-else-if="approveMesinKK.status === 'Draft'" />
              </div>
            </div>
            <TableDataFinansial @on-click-reload="reloadDataFinansial" :data-finansial="dataFinansial"
              :tahun-terakhir-realisasi="parseInt(route.query.tahun?.toString() ?? '0')"
              :source="finansialMappingResult" :is-fetching-error="dataFinansial.isFetchingError" />
          </div>
        </TabItem>
        <TabItem title="Hasil Simulasi">
          <div class="flex flex-col w-full px-2">
            <div class="flex flex-row justify-between">
              <div class="mt-0.5 mb-4">
                <p class="mb-2 text-base font-bold">Hasil Simulasi</p>
                <div class="flex items-center text-xs">
                  <p class="font-bold">Periode</p>
                  <p class="ml-1 font-bold text-[#0099AD]">{{ approveMesinKK.tahun ? approveMesinKK.tahun : '-' }}</p>
                  <p class="ml-2">/</p>
                  <p class="ml-2 font-bold">Data</p>
                  <p class="ml-1 font-bold text-[#0099AD]">Kertas Kerja</p>
                </div>
              </div>
              <div class="flex items-center text-xs font-semibold">
                <p class="mr-2 font-normal">Status Laporan</p>
                <ComponentDitolakT1 v-if="approveMesinKK.status === 'Ditolak T1'" />
                <ComponentDitolakT2 v-else-if="approveMesinKK.status === 'Ditolak T2'" />
                <ComponentDisetujui v-else-if="approveMesinKK.status === 'Disetujui'" />
                <ComponentWaitingT1 v-else-if="approveMesinKK.status === 'Menunggu Persetujuan T1'" />
                <ComponentWaitingT2 v-else-if="approveMesinKK.status === 'Menunggu Persetujuan T2'" />
                <ComponentDraft v-else-if="approveMesinKK.status === 'Draft'" />
              </div>
            </div>
            <nav class="rounded-md bg-primaryColor bg-opacity-5">
              <ul class="table w-full text-sm text-center text-primaryColor border-spacing-x-5">
                <li id="tab"
                  class="table-cell w-1/2 py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                  @click="selectedTab = 'Akhir Masa'" :class="{ selected: selectedTab === 'Akhir Masa' }">
                  COD - Akhir Masa Manfaat
                </li>
                <li id="tab"
                  class="table-cell w-1/2 py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                  @click="selectedTab = 'Tahun Berjalan'" :class="{ selected: selectedTab === 'Tahun Berjalan' }"> COD -
                  Tahun
                  Berjalan
                </li>
              </ul>
            </nav>
            <AkhirMasaManfaat @on-click-reload="reloadHasilSimulasi" :irr-on-project="hasilSimulasi.track_irr_project"
              :irr-on-equity="hasilSimulasi.track_irr_equity" :npv-on-equity="hasilSimulasi.track_npv_equity"
              :npv-on-project="hasilSimulasi.track_npv_project" :average-ncf="hasilSimulasi.track_average_cf"
              :average-eaf="hasilSimulasi.track_average_eaf" :is-fetching-error="hasilSimulasi.isFetchingError"
              v-show="selectedTab === 'Akhir Masa'" />
            <TahunBerjalan @on-click-reload="reloadHasilSimulasi" :irr-on-project="hasilSimulasi.now_track_irr_project"
              :irr-on-equity="hasilSimulasi.now_track_irr_equity" :npv-on-equity="hasilSimulasi.now_track_npv_equity"
              :npv-on-project="hasilSimulasi.now_track_npv_project" :average-ncf="hasilSimulasi.now_track_average_cf"
              :average-eaf="hasilSimulasi.now_track_average_eaf" :is-fetching-error="hasilSimulasi.isFetchingError"
              v-show="selectedTab === 'Tahun Berjalan'" />
          </div>
        </TabItem>
      </TabsWrapper>
    </div>
    <ShimmerLoading v-else class="w-full h-96" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router'
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import { notifyError } from "@/services/helper/toast-notification";
import RekapService from "@/services/rekap-service";
const rekapService = new RekapService();
import Loading from "@/components/ui/LoadingSpinner.vue";
import PersetujuanService from '@/services/persetujuan-service';
import DetailRekapService from "@/services/detail-rekap-service";
import UserService from "@/services/user-service";
const userService = new UserService();
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import DetailSentralService from "@/services/detail-sentral-service";
const detailSentralService = new DetailSentralService();
import InfoHeader from '@/components/ui/InfoHeader.vue';
import TabsWrapper from "@/components/ui/TabsWrapperApprove.vue";
import TabItem from "@/components/ui/TabItem.vue";
import AsumsiMakro from "@/components/ui/AsumsiMakroApprove.vue";
import ParameterTeknis from "@/components/ui/ParameterTeknisApprove.vue";
import AkhirMasaManfaat from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue";
import TahunBerjalan from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue";
import jsonData from "@/assets/lottie/success.json";
import TableDataTeknis from "@/components/RekapKertasKerja/TableDataTeknis.vue";
import TableDataFinansial from "@/components/RekapKertasKerja/TableDataFinansial.vue";
import ComponentDisetujui from '@/components/Status/ComponentDisetujui.vue';
import ComponentDitolakT1 from '@/components/Status/ComponentDitolakT1.vue';
import ComponentDitolakT2 from '@/components/Status/ComponentDitolakT2.vue';
import ComponentWaitingT1 from '@/components/Status/ComponentWaitingT1.vue';
import ComponentWaitingT2 from '@/components/Status/ComponentWaitingT2.vue';
import ComponentDraft from '@/components/Status/ComponentDraft.vue';
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";

const nodeMode = import.meta.env.MODE;
const route = useRoute();
const isLoading = ref(false);
const modalApprove = ref(false);
const selectedTab = ref("Akhir Masa");
const data = ref('Kertas Kerja')
const isSuccess = ref(false);
const isHover = ref(true);
const persetujuanService = new PersetujuanService();
const detailRekapService = new DetailRekapService();
const tahunGrafik = ref<number>(0);
let encryptStorageRef: any = null;

const approveSentralKK = ref<ListApprove>();
const approveMesinKK = ref<ListApprove>({
  data: [],
  pengelola: '',
  pembina: '',
  umur_teknis: '',
  tahun: '',
  status: '',
  keterangan: '',
  uuid_mesin: '',
  id_status: -1
});
const mesin = ref<MesinItem>()
const asumsiParameter = ref<AsumsiParameterItem>({
  id_asumsi: 0,
  data: {},
  kode_mesin: '',
  uuid_mesin: 0,
  corporate_tax_rate: 0,
  status: '',
  interest_rate: 0,
  discount_rate: 0,
  loan_portion: 0,
  loan_tenor: 0,
  umur_teknis: 0,
  equity_portion: 0,
  isFetchingError: false,
  bahan_bakars: [],
});
const parameterTeknisFinansial = ref<ParameterTeknisFinancialItem>({
  daya_mampu_netto_mw: 0,
  daya_terpasang: 0,
  susut_trafo: 0,
  auxiliary: 0,
  total_project_cost: 0,
  ps: 0,
  equity: 0,
  loan: 0,
  electricity_price_a_rp_per_kwbln: 0,
  nphr: 0,
  electricity_price_c_rp_per_kwh: 0,
  electricity_price_b_rp_per_kwbln: 0,
  isFetchingError: false,
  electricity_price_d_rp_per_kwh: 0,
});
const dataTeknis = ref<{
  header: any[]
  tahun: number[]
  detail: any[]
  isFetchingError: boolean
}>({
  tahun: [],
  header: [],
  isFetchingError: false,
  detail: [],
});
const tahunTerakhirAsumsi = ref<any>([]);
const tahunBerjalan = new Date().getFullYear();
const typePeriodic = ref<Object[]>([]);
const tahunTerakhirRealisasi = ref<number>();
const finansialMappingResult = ref<any[]>([]);
const kodeJenisPembangkit = ref<string>("");
const comboBahanBakar = ref<any>([]);
const bahanBakars = ref<any[]>([]);
const namaPengelola = ref<string>('');
const namaPembina = ref<string>('');
const dataFinansial = ref<{
  header: any[]
  tahun: number[]
  detail: any[]
  isFetchingError: boolean
}>({
  tahun: [],
  header: [],
  isFetchingError: false,
  detail: [],
});
const hasilSimulasi = ref<{
  track_irr_equity: number
  track_irr_project: number
  track_npv_project: number
  track_npv_equity: number
  track_average_eaf: number
  track_average_cf: number
  wacc_on_equity: number
  wacc_on_project: number
  now_track_irr_equity: number
  now_track_irr_project: number
  now_track_npv_project: number
  now_track_npv_equity: number
  now_track_average_eaf: number
  isFetchingError: boolean
  now_track_average_cf: number
}>({
  track_irr_equity: 0,
  track_irr_project: 0,
  track_npv_project: 0,
  track_npv_equity: 0,
  track_average_eaf: 0,
  track_average_cf: 0,
  wacc_on_equity: 0,
  wacc_on_project: 0,
  now_track_irr_equity: 0,
  now_track_irr_project: 0,
  now_track_npv_project: 0,
  now_track_npv_equity: 0,
  now_track_average_eaf: 0,
  isFetchingError: false,
  now_track_average_cf: 0,
});
const updateMesin = ref<any>();
const avrIrr = ref<number>();
const statusMesin = ref<number>(-1);

const idGrafik = ref<any>('');
const jumlahMesin = ref<number>(0);

interface MesinItem {
  data: any
  uuid_mesin: number
  kode_sentral: string
  kode_mesin: string
  mesin: string
  kode_jenis_pembangkit: string
  kondisi_unit: string
  daya_terpasang: number
  daya_mampu: number
  tahun_operasi: string
  masa_manfaat: number
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
  keterangan: string
  uuid_mesin: string
  id_status: number
}

interface AsumsiParameterItem {
  data: any
  id_asumsi: number
  uuid_mesin: number
  kode_mesin: string
  status: string
  corporate_tax_rate: number
  discount_rate: number
  interest_rate: number
  loan_tenor: number
  loan_portion: number
  equity_portion: number
  umur_teknis: number
  bahan_bakars: any
  isFetchingError: boolean
}

interface ParameterTeknisFinancialItem {
  daya_terpasang: number
  daya_mampu_netto_mw: number
  auxiliary: number
  susut_trafo: number
  ps: number
  total_project_cost: number
  loan: number
  equity: number
  nphr: number
  electricity_price_a_rp_per_kwbln: number
  electricity_price_b_rp_per_kwbln: number
  electricity_price_c_rp_per_kwh: number
  electricity_price_d_rp_per_kwh: number
  isFetchingError: boolean
}

function toggleButton() {
  isHover.value = !isHover.value
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const fetchMesinById = async () => {
  try {
    const response: MesinItem = await detailRekapService.getMesinById(
      idGrafik.value
    )
    try {
      const responsePhoto: any = await detailSentralService.getPhoto(response.data.photo1)
      const blob = new Blob([responsePhoto.data])
      response.data.photo2 = URL.createObjectURL(blob)
    } catch (error) {
      console.error('Photo Error: ', error)
    }
    mesin.value = response.data
    tahunTerakhirRealisasi.value = parseInt(response.data.tahun_realisasi)
    kodeJenisPembangkit.value = response.data.kode_jenis_pembangkit
    avrIrr.value = response.data.avg_irr
  } catch (error) {
    console.error(error)
  }
};

const fetchPersetujuanKK = async () => {
  try {
    const response: ListApprove = await persetujuanService.getPersetujuanKKSentral({
      uuid_sentral: route.query.uuid_sentral,
      tahun: route.query.tahun
    });
    approveSentralKK.value = response.data;
    approveMesinKK.value = response.data.mesins.filter((val: any) => val.uuid_mesin == idGrafik.value)[0];
    tahunTerakhirAsumsi.value = approveMesinKK.value.tahun;
    statusMesin.value = approveMesinKK.value.id_status;
  } catch (error) {
    console.error('Fetch Persetujuan KK Sentral Error : ', error)
  }
}

const fetchAsumsiParameter = async () => {
  try {
    const response: AsumsiParameterItem =
      await detailRekapService.getAsumsiParameter(
        parseInt(route.query.tahun?.toString() ?? '0') - 1,
        idGrafik.value,
        parseInt(route.query.tahun?.toString() ?? '0')
      )
    asumsiParameter.value = response.data.asumsi_makro
    parameterTeknisFinansial.value = response.data.parameter_teknis_financial
    bahanBakars.value = response.data.harga_bahan_bakars
  } catch (error) {
    console.error("Fetch Asumsi Parameter Error : ", error)
    asumsiParameter.value.isFetchingError = true
    parameterTeknisFinansial.value.isFetchingError = true
  }
};

const reloadAsumsiParameter = () => {
  asumsiParameter.value.isFetchingError = false
  parameterTeknisFinansial.value.isFetchingError = false
  fetchAsumsiParameter()
}

const fetchDataTeknis = async () => {
  try {
    const response: any = await detailRekapService.getDataTeknis(
      parseInt(route.query.tahun?.toString() ?? '0'),
      idGrafik.value
    )
    if (response.data.tahun[response.data.tahun.length - 1] == tahunBerjalan - 1) {
      const responseTahunRealisasi: any = await detailRekapService.getDataTeknis(
        parseInt(route.query.tahun?.toString() ?? '0') - 1,
        idGrafik.value
      )
      dataTeknis.value = responseTahunRealisasi.data
      tahunGrafik.value = parseInt(route.query.tahun?.toString() ?? '0') - 1
    } else {
      dataTeknis.value = response.data
      tahunGrafik.value = parseInt(route.query.tahun?.toString() ?? '0')
    }
  } catch (error) {
    console.error("Fetch Data Teknis Error : ", error)
    dataTeknis.value.isFetchingError = true
  }
};

const reloadDataTeknis = () => {
  dataTeknis.value.isFetchingError = false
  fetchDataTeknis()
}

const fetchDataFinansial = async () => {
  try {
    finansialMappingResult.value = []
    const response: any = await detailRekapService.getDataFinansial(
      parseInt(route.query.tahun?.toString() ?? '0'),
      idGrafik.value
    )
    let currentLevel1: any | null = null
    let currentLevel2: any | null = null
    let currentLevel3: any | null = null
    if (response.data.tahun[response.data.tahun.length - 1] == tahunBerjalan - 1) {
      const responseTahunRealisasi: any = await detailRekapService.getDataFinansial(
        parseInt(route.query.tahun?.toString() ?? '0') - 1,
        idGrafik.value
      )
      for (const item of responseTahunRealisasi.data.detail) {
        if (item.level === 1) {
          currentLevel1 = {
            ...item,
            level2: [],
          }
          finansialMappingResult.value.push(currentLevel1)
        } else if (item.level === 2 && currentLevel1 !== null) {
          currentLevel2 = {
            ...item,
            level3: [],
          }
          currentLevel1.level2.push(currentLevel2)
        } else if (item.level === 3 && currentLevel1 !== null) {
          currentLevel3 = {
            ...item,
            level4: [],
          }
          currentLevel2.level3.push(currentLevel3)
        } else if (item.level === 4 && currentLevel1 !== null) {
          currentLevel3.level4.push({ ...item })
        }
      }
      dataFinansial.value = responseTahunRealisasi.data
    } else {
      for (const item of response.data.detail) {
        if (item.level === 1) {
          currentLevel1 = {
            ...item,
            level2: [],
          };
          finansialMappingResult.value.push(currentLevel1)
        } else if (item.level === 2 && currentLevel1 !== null) {
          currentLevel2 = {
            ...item,
            level3: [],
          };
          currentLevel1.level2.push(currentLevel2)
        } else if (item.level === 3 && currentLevel1 !== null) {
          currentLevel3 = {
            ...item,
            level4: [],
          };
          currentLevel2.level3.push(currentLevel3)
        } else if (item.level === 4 && currentLevel1 !== null) {
          currentLevel3.level4.push({ ...item });
        }
      }
      dataFinansial.value = response.data;
    }
  } catch (error) {
    console.error("Fetch Data Finansial Error : ", error)
    dataFinansial.value.isFetchingError = true
  }
}

const reloadDataFinansial = () => {
  dataFinansial.value.isFetchingError = false
  fetchDataFinansial()
}

const fetchHasilSimulasi = async () => {
  try {
    const response: any = await detailRekapService.getHasilSimulasi(
      idGrafik.value,
      parseInt(route.query.tahun?.toString() ?? '0'),
      statusMesin.value
    );
    hasilSimulasi.value = response.data;
  } catch (error) {
    console.error("Fetch Hasil Simulasi Error : ", error);
    hasilSimulasi.value.isFetchingError = true;
  }
}

const reloadHasilSimulasi = () => {
  hasilSimulasi.value.isFetchingError = false;
  fetchHasilSimulasi();
}

const fetchTypePeriodic = async () => {
  try {
    const response: any = await detailRekapService.getTypePeriodic(
      mesin.value?.kode_jenis_pembangkit
    );
    typePeriodic.value = response.data;
  } catch (error) {
    console.error("Fetch Type Periodic Error : ", error);
  }
};

const downloadEvidence = async () => {
  try {
    isLoading.value = true
    const filePath: any = await rekapService.getEvidencePath(idGrafik.value, route.query.tahun?.toString() ?? '0', 0)
    const finalFileName: any = filePath.data[0].file_name
    const response: any = await rekapService.downloadEvidence(filePath.data[0].dokumen_evidence)
    const contentDisposition = response.headers['content-disposition']
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/)
    const fileName = fileNameMatch ? fileNameMatch[1] : `${finalFileName}`
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a')
    link.href = url;
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link);
    isLoading.value = false;
  } catch (error) {
    console.error('Evidence Error : ', error)
    isLoading.value = false
    notifyError('Evidence Tidak Ada', 5000)
  };
};

const fetchComboBahanBakar = async () => {
  try {
    const response: any = await detailRekapService.getComboBahanBakar(
      kodeJenisPembangkit.value
    )
    comboBahanBakar.value = response.data;
  } catch (error) {
    console.error('Fetch Combo Bahan Bakar Error : ', error);
  }
}


const updateKK = async () => {
  try {
    isLoading.value = true;
    const response: any = await persetujuanService.updateStatusKK({
      status_approval: 0,
      keterangan: '',
      tahun: parseInt(route.query.tahun?.toString() ?? '0'),
      uuid_mesin: idGrafik.value
    })
    updateMesin.value = response.data;
    modalApprove.value = false;
    isLoading.value = false;
    isSuccess.value = true;
    await wait(3000);
    isSuccess.value = false;

    isLoading.value = true;
    await fetchMesinById();
    await fetchPersetujuanKK();
    isLoading.value = false;
    fetchAsumsiParameter();
    fetchHasilSimulasi();
    fetchDataTeknis();
    fetchTypePeriodic();
    fetchComboBahanBakar();
    fetchDataFinansial();
  } catch (error) {
    isLoading.value = false;
    console.error("Error Fetch Update Kertas Kerja : ", error);
    notifyError('Gagal kirim kertas kerja, mohon coba lagi', 5000)
  }
}
const fetchListPembina = async () => {
  try {
    const response: any = await userService.getPembina('')
    return response.data
  } catch (error) {
    console.error('Fetch Pembina Error : ', error)
  }
}
const fetchUnitPengelola = async () => {
  try {
    if (mesin.value) {
      const kodeSentral = mesin.value.kode_sentral
      const pembangkitResponse: any =
        await detailRekapService.getPembangkitByKode(kodeSentral)
      const kodePengelola = pembangkitResponse.data.kode_pengelola
      jumlahMesin.value = pembangkitResponse.data.mesins.length
      const pengelolaResponse: any =
        await detailRekapService.getPengelolaData()
      const pengelola = pengelolaResponse.data.filter(
        (pengelola: any) => pengelola.kode_pengelola === kodePengelola
      )
      namaPengelola.value = pengelola[0].pengelola
      const idPembina = pembangkitResponse.data.uuid_pembina
      const pembinaList: any = await fetchListPembina()
      namaPembina.value = pembinaList.find((pembina: any) => pembina.uuid_pembina === idPembina).pembina
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : ", error)
  }
};

onMounted(async () => {
  isLoading.value = true;
  encryptStorageRef = await encryptStoragePromise;
  idGrafik.value = nodeMode === 'production' ? encryptStorageRef.decryptValue(route.params.id.toString()) : route.params.id;
  console.log(idGrafik.value);
  await fetchMesinById();
  await fetchPersetujuanKK();
  isLoading.value = false;
  fetchAsumsiParameter();
  fetchHasilSimulasi();
  fetchDataTeknis();
  fetchUnitPengelola();
  fetchTypePeriodic();
  fetchComboBahanBakar();
  fetchDataFinansial();
})
</script>

<style scoped>
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
  outline: 1px solid #0099ad;
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