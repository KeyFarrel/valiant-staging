<template>
  <Loading v-if="isLoading" />
  <InfoHeader v-if="mesinDataById && approveSentralFS" :nama-mesin="mesinDataById.mesin ? mesinDataById.mesin : '-'"
    :nama-pengelola="namaPengelola ? namaPengelola : '-'" :status-mesin="mesinDataById.kondisi_unit"
    :kode-jenis-pembangkit="mesinDataById.kode_jenis_pembangkit ? mesinDataById.kode_jenis_pembangkit : '-'"
    :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
    :tahun-operasi="mesinDataById.tahun_operasi ? mesinDataById.tahun_operasi : '-'"
    :umur-teknis="approveSentralFS.umur_teknis ? approveSentralFS.umur_teknis : '-'">

    <div v-if="mesin.status === 'Menunggu Persetujuan T2' && level_ID === '2'" class="flex">
      <!-- Tolak Laporan -->
      <button
        class="border border-[#C53830] hover:border-[#C53830] mr-1.5 px-3 py-2 text-[#C53830] hover:text-white rounded-lg hover:bg-[#C53830] duration-300"
        @click="modalCancel = !modalCancel">
        <span class="text-sm font-semibold">Tolak Laporan</span>
      </button>
      <ModalWrapper :showModal="modalCancel" :width="'w-[400px]'" :height="'h-auto'">
        <div class="text-black border-b">
          <h1 class="mb-3 text-lg font-bold">Tolak Laporan?</h1>
          <p class="text-sm">Apakah Anda yakin ingin menolak laporan ini?</p>
          <p class="text-sm">
            Silahkan isi alasan penolakan laporan dibawah ini.
          </p>
          <p class="my-3 text-[#4D5E80] text-base font-bold">
            Alasan Penolakan
          </p>
          <textarea name="" id="" cols="43" rows="5" v-model="pesan"
            placeholder="Masukkan alasan penolakan anda disini ..." class="rounded-md mb-4 border-[#9C9C9C]"></textarea>
        </div>
        <div class="flex flex-row justify-end mt-4">
          <button
            class="border border-[#0099AD] hover:border-[#0099AD] mr-3 px-3 py-2 text-[#0099AD] hover:text-white rounded-lg hover:bg-[#0099AD] duration-300"
            @click="modalCancel = false">
            <span class="text-sm font-semibold">Batal</span>
          </button>
          <button class="flex items-center bg-[#C53830] border border-[#C53830] px-3 py-2 rounded-lg duration-300"
            @click="rejectFSPengelola()">
            <span class="text-sm font-semibold text-white">Kirim Penolakan</span>
          </button>
        </div>
      </ModalWrapper>
      <ModalWrapper :showModal="isReject" :width="'w-80'" :height="'h-auto'">
        <div class="flex flex-col items-center">
          <Vue3Lottie :animationData="jsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
          <h1 class="mb-3 text-lg font-semibold text-gray-700">
            Laporan Berhasil Ditolak
          </h1>
          <p class="text-sm text-textDisabledColor">
            Laporan Anda Telah Berhasil Ditolak
          </p>
        </div>
      </ModalWrapper>
      <!-- Setujui Laporan -->
      <button class="flex items-center bg-[#0099AD] border border-[#0099AD] ml-1.5 px-3 py-2 rounded-lg duration-300"
        @click="modalApprove = !modalApprove">
        <span class="text-sm font-semibold text-white">Setujui Laporan</span>
      </button>
      <ModalWrapper :showModal="modalApprove" :width="'w-[y00px]'" :height="'h-auto'">
        <div class="text-black border-b">
          <h1 class="mb-3 text-lg font-bold">Setujui Laporan?</h1>
          <p class="mb-4 text-sm">
            Apakah Anda yakin ingin menyetujui Laporan ini?
          </p>
        </div>
        <div class="flex flex-row justify-end mt-4">
          <button
            class="border border-[#0099AD] hover:border-[#0099AD] mr-3 px-3 py-2 text-[#0099AD] hover:text-white rounded-lg hover:bg-[#0099AD] duration-300"
            @click="modalApprove = false">
            <span class="text-sm font-semibold">Batal</span>
          </button>
          <button class="flex items-center bg-[#0099AD] border border-[#0099AD] px-3 py-2 rounded-lg duration-300"
            @click="updateFSPengelola()">
            <span class="text-sm font-semibold text-white">Setujui Laporan</span>
          </button>
        </div>
      </ModalWrapper>
      <ModalWrapper :showModal="isSuccess" :width="'w-80'" :height="'h-auto'">
        <div class="flex flex-col items-center">
          <Vue3Lottie :animationData="jsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
          <h1 class="mb-3 text-lg font-semibold text-gray-700">
            Laporan Berhasil Disetujui
          </h1>
          <p class="text-sm text-textDisabledColor">
            Laporan Anda Telah Berhasil Disetujui
          </p>
        </div>
      </ModalWrapper>
    </div>
    <div v-else-if="mesin.status === 'Menunggu Persetujuan T1' && level_ID === '4'" class="flex">
      <!-- Tolak Laporan -->
      <button
        class="border border-[#C53830] hover:border-[#C53830] mr-1.5 px-3 py-2 text-[#C53830] hover:text-white rounded-lg hover:bg-[#C53830] duration-300"
        @click="modalCancel = !modalCancel">
        <span class="text-sm font-semibold">Tolak Laporan</span>
      </button>
      <ModalWrapper :showModal="modalCancel" :width="'w-[400px]'" :height="'h-auto'">
        <div class="text-black border-b">
          <h1 class="mb-3 text-lg font-bold">Tolak Laporan?</h1>
          <p class="text-sm">Apakah Anda yakin ingin menolak laporan ini?</p>
          <p class="text-sm">
            Silahkan isi alasan penolakan laporan dibawah ini.
          </p>
          <p class="my-3 text-[#4D5E80] text-base font-bold">
            Alasan Penolakan
          </p>
          <textarea name="" id="" cols="43" rows="5" v-model="pesan"
            placeholder="Masukkan alasan penolakan anda disini ..." class="rounded-md mb-4 border-[#9C9C9C]"></textarea>
        </div>
        <div class="flex flex-row justify-end mt-4">
          <button
            class="border border-[#0099AD] hover:border-[#0099AD] mr-3 px-3 py-2 text-[#0099AD] hover:text-white rounded-lg hover:bg-[#0099AD] duration-300"
            @click="modalCancel = false">
            <span class="text-sm font-semibold">Batal</span>
          </button>
          <button class="flex items-center bg-[#C53830] border border-[#C53830] px-3 py-2 rounded-lg duration-300"
            @click="rejectFSPembina()">
            <span class="text-sm font-semibold text-white">Kirim Penolakan</span>
          </button>
        </div>
      </ModalWrapper>
      <ModalWrapper :showModal="isReject" :width="'w-80'" :height="'h-auto'">
        <div class="flex flex-col items-center">
          <Vue3Lottie :animationData="jsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
          <h1 class="mb-3 text-lg font-semibold text-gray-700">
            Laporan Berhasil Ditolak
          </h1>
          <p class="text-sm text-textDisabledColor">
            Laporan Anda Telah Berhasil Ditolak
          </p>
        </div>
      </ModalWrapper>
      <!-- Setujui Laporan -->
      <button class="flex items-center bg-[#0099AD] border border-[#0099AD] ml-1.5 px-3 py-2 rounded-lg duration-300"
        @click="modalApprove = !modalApprove">
        <span class="text-sm font-semibold text-white">Setujui Laporan</span>
      </button>
      <ModalWrapper :showModal="modalApprove" :width="'w-[y00px]'" :height="'h-auto'">
        <div class="text-black border-b">
          <h1 class="mb-3 text-lg font-bold">Setujui Laporan?</h1>
          <p class="mb-4 text-sm">
            Apakah Anda yakin ingin menyetujui Laporan ini?
          </p>
        </div>
        <div class="flex flex-row justify-end mt-4">
          <button
            class="border border-[#0099AD] hover:border-[#0099AD] mr-3 px-3 py-2 text-[#0099AD] hover:text-white rounded-lg hover:bg-[#0099AD] duration-300"
            @click="modalApprove = false">
            <span class="text-sm font-semibold">Batal</span>
          </button>
          <button class="flex items-center bg-[#0099AD] border border-[#0099AD] px-3 py-2 rounded-lg duration-300"
            @click="updateFSPembina()">
            <span class="text-sm font-semibold text-white">Setujui Laporan</span>
          </button>
        </div>
      </ModalWrapper>
      <ModalWrapper :showModal="isSuccess" :width="'w-80'" :height="'h-auto'">
        <div class="flex flex-col items-center">
          <Vue3Lottie :animationData="jsonData" :width="200" :height="200" :loop="false" :speed="0.8" />
          <h1 class="mb-3 text-lg font-semibold text-gray-700">
            Laporan Berhasil Disetujui
          </h1>
          <p class="text-sm text-textDisabledColor">
            Laporan Anda Telah Berhasil Disetujui
          </p>
        </div>
      </ModalWrapper>
    </div>
    <div v-else></div>

  </InfoHeader>

  <!-- Button Evidence -->
  <div class="flex justify-between p-4 mt-4 bg-white rounded-lg">
    <div class="flex items-center">
      <div class="flex">
        <div class="w-1 h-7 mr-2 bg-[#0099AD]"></div>
        <p class="text-lg font-semibold">Evidence</p>
      </div>
    </div>
    <button class="flex items-center bg-white border border-[#0099AD] px-3 py-2 rounded-lg duration-300">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M6.12508 3.20964C4.75588 3.20964 3.64591 4.3196 3.64591 5.6888C3.64591 5.84688 3.66063 6.00098 3.68862 6.14997C3.74259 6.43729 3.57555 6.72018 3.2979 6.81169C2.48294 7.08026 1.89591 7.84799 1.89591 8.7513C1.89591 9.87888 2.81 10.793 3.93758 10.793H10.5001C11.386 10.793 12.1042 10.0748 12.1042 9.1888C12.1042 8.50438 11.6754 7.91867 11.0697 7.68854C10.774 7.57619 10.6217 7.24864 10.7264 6.95015C10.7686 6.83 10.7917 6.70023 10.7917 6.5638C10.7917 5.91947 10.2694 5.39714 9.62508 5.39714C9.49836 5.39714 9.37744 5.41713 9.26468 5.4537C9.11237 5.5031 8.94646 5.48772 8.80583 5.41116C8.6652 5.33461 8.56222 5.20362 8.52102 5.0489C8.23896 3.98944 7.27235 3.20964 6.12508 3.20964ZM2.47925 5.6888C2.47925 3.67526 4.11154 2.04297 6.12508 2.04297C7.62264 2.04297 8.90824 2.94548 9.46959 4.23559C9.52103 4.23219 9.57288 4.23047 9.62508 4.23047C10.9137 4.23047 11.9584 5.27514 11.9584 6.5638C11.9584 6.65152 11.9535 6.73824 11.9441 6.82366C12.7393 7.3102 13.2709 8.1869 13.2709 9.1888C13.2709 10.7191 12.0304 11.9596 10.5001 11.9596H3.93758C2.16567 11.9596 0.729248 10.5232 0.729248 8.7513C0.729248 7.50166 1.44338 6.42 2.48473 5.89018C2.48109 5.82348 2.47925 5.75633 2.47925 5.6888ZM7.00008 5.10547C7.32225 5.10547 7.58341 5.36664 7.58341 5.6888V8.21801L8.3376 7.46382C8.56541 7.23602 8.93475 7.23602 9.16256 7.46382C9.39037 7.69163 9.39037 8.06098 9.16256 8.28878L7.41256 10.0388C7.18475 10.2666 6.81541 10.2666 6.5876 10.0388L4.8376 8.28878C4.6098 8.06098 4.6098 7.69163 4.8376 7.46382C5.06541 7.23602 5.43475 7.23602 5.66256 7.46382L6.41675 8.21801V5.6888C6.41675 5.36664 6.67791 5.10547 7.00008 5.10547Z"
          fill="#0099AD" />
      </svg>
      <span class="text-[#0099AD] text-sm ml-2 font-semibold">Download Evidence</span>
    </button>
  </div>

  <!-- Tab detail -->
  <div class="items-start p-6 mt-4 bg-white rounded-lg">
    <TabsWrapper v-if="hasilSimulasi && mesinDataById && approveSentralFS" :isLihatGrafik="true" :laman-data="false"
      :id-mesin="idGrafik.toString()" :tahun-grafik="tahunData" :tahun="tahunData ? tahunData : '-'"
      :nilai-asset-awal="mesinDataById.nilai_asset_awal ? mesinDataById.nilai_asset_awal : 0"
      :irr-on-project="hasilSimulasi.now_fs_irr_project" :irr-on-equity="hasilSimulasi.now_fs_irr_equity"
      :npv-on-equity="hasilSimulasi.now_fs_npv_equity" :npv-on-project="hasilSimulasi.now_fs_npv_project"
      :average-ncf="hasilSimulasi.now_fs_average_cf" :average-eaf="hasilSimulasi.now_track_average_eaf"
      :nama-mesin="mesinDataById.mesin ? mesinDataById.mesin : '-'"
      :nama-pengelola="approveSentralFS.pengelola ? approveSentralFS.pengelola : '-'"
      :nama-pembina="approveSentralFS.pembina ? approveSentralFS.pembina : '-'"
      :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
      :tahun-operasi="mesinDataById.tahun_operasi ? mesinDataById.tahun_operasi : '-'">
      <TabItem :title="'Asumsi Makro'">
        <AsumsiMakro v-if="asumsiMakro" :data="data" :tahun="tahunData ? tahunData : '-'"
          :status="mesin.status ? mesin.status : '-'"
          :corporate-tax-rate="asumsiMakro ? asumsiMakro.corporate_tax_rate : '-'"
          :discount-rate="asumsiMakro ? asumsiMakro.discount_rate : '-'"
          :interest-rate="asumsiMakro ? asumsiMakro.discount_rate : '-'"
          :loan-tenor="asumsiMakro ? asumsiMakro.loan_tenor : '-'"
          :loan-portion="asumsiMakro ? asumsiMakro.loan_portion : '-'"
          :equity-portion="asumsiMakro ? asumsiMakro.equity_portion : '-'" />
      </TabItem>
      <TabItem :title="'Parameter Teknis & Finansial'">
        <ParameterTeknis v-if="parameterTeknisFinansial" :data="data" :tahun="tahunData ? tahunData : '-'"
          :status="mesin.status ? mesin.status : '-'" :daya-terpasang="parameterTeknisFinansial?.daya_terpasang ?? '-'"
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
        <div class="flex flex-row justify-between space-y-2" v-if="approveMesinFS">
          <div class="mt-0.5 mb-4">
            <p class="mb-2 text-base font-bold">Data Teknis</p>
            <div class="flex items-center text-xs">
              <p class="font-bold">Periode</p>
              <p class="ml-2 font-bold text-[#0099AD]">{{ approveMesinFS.tahun ? approveMesinFS.tahun : '-' }}</p>
              <p class="ml-2">/</p>
              <p class="ml-2 font-bold">Data</p>
              <p class="ml-2 font-bold text-[#0099AD]">Feasibility Study</p>
            </div>
          </div>
          <div class="flex items-center text-xs">
            <p class="mr-2">Status Laporan</p>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
              v-if="approveMesinFS.status === 'Ditolak T1'">
              Ditolak oleh Pembina
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
              v-else-if="approveMesinFS.status === 'Ditolak T2'">
              Ditolak oleh Pengelola
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#EDF7F2] border border-[#C7E5D7] rounded-md text-[#397E5D]"
              v-else-if="approveMesinFS.status === 'Disetujui'">
              Disetujui
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#B7CAF5] border border-[#B7CAF5] rounded-md text-[#1D55D7]"
              v-else-if="approveMesinFS.status === 'Draft'">
              Draft
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
              v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T1'">
              Menunggu Persetujuan Pembina
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
              v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T2'">
              Menunggu Persetujuan Pengelola
            </div>
          </div>
        </div>
        <div class="w-full overflow-auto border rounded-lg whitespace-nowrap">
          <table v-if="dataTeknis" class="w-full text-sm">
            <thead>
              <tr class="text-[#0099AD] text-sm text-left border-b-2">
                <th class="sticky left-0 z-10 bg-white">No</th>
                <th class="sticky z-10 bg-white left-10">Nama</th>
                <th class="text-center" v-for="( item, index ) in dataTeknis.tahun.length === 0 ? 1 : dataTeknis.tahun"
                  :key="index"
                  :class="{ 'text-warningColor': item < tahunBerjalan, 'text-black': item === tahunBerjalan, 'text-[#0099AD]': item > tahunBerjalan, }">
                  {{ dataTeknis.tahun.length === 0 ? "-" : item }} <br>
                  <span class="text-xs font-normal">{{ index }} </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="( item, index ) in dataTeknis.detail " :key="index">
                <td class="sticky left-0 z-10 bg-white">{{ index + 1 }}</td>
                <td class="sticky z-10 bg-white left-10">{{ item.uraian }}</td>
                <td v-for="( items, indexs ) in dataTeknis.tahun.length === 0 ? 1 : dataTeknis.tahun" :key="indexs"
                  :class="{ 'bg-blue-50': items === tahunBerjalan }">
                  {{ dataTeknis.tahun ? item["t" + items] != null ? item.uraian === 'Type of Periodic Maintenance' ?
                    getTypePeriodic(item["t" + items]) : globalFormat.formatRupiah(item["t" + items]) : "-" : "-" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabItem>
      <TabItem title="Data Finansial">
        <div class="flex flex-row justify-between space-y-2" v-if="approveMesinFS">
          <div class="mt-0.5 mb-4">
            <p class="mb-2 text-base font-bold">Data Finansial</p>
            <div class="flex items-center text-xs">
              <p class="font-bold">Periode</p>
              <p class="ml-2 font-bold text-[#0099AD]">{{ approveMesinFS.tahun ? approveMesinFS.tahun : '-' }}</p>
              <p class="ml-2">/</p>
              <p class="ml-2 font-bold">Data</p>
              <p class="ml-2 font-bold text-[#0099AD]">Feasibility Study</p>
            </div>
          </div>
          <div class="flex items-center text-xs">
            <p class="mr-2">Status Laporan</p>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
              v-if="approveMesinFS.status === 'Ditolak T1'">
              Ditolak oleh Pembina
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
              v-else-if="approveMesinFS.status === 'Ditolak T2'">
              Ditolak oleh Pengelola
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#EDF7F2] border border-[#C7E5D7] rounded-md text-[#397E5D]"
              v-else-if="approveMesinFS.status === 'Disetujui'">
              Disetujui
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#B7CAF5] border border-[#B7CAF5] rounded-md text-[#1D55D7]"
              v-else-if="approveMesinFS.status === 'Draft'">
              Draft
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
              v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T1'">
              Menunggu Persetujuan Pembina
            </div>
            <div
              class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
              v-else-if="approveMesinFS.status === 'Menunggu Persetujuan T2'">
              Menunggu Persetujuan Pengelola
            </div>
          </div>
        </div>
        <div class="w-full overflow-auto border rounded-lg whitespace-nowrap" v-if="dataFinansial">
          <table class="w-full">
            <thead>
              <tr class="text-[#0099AD] text-sm text-left border-b-2">
                <th class="pr-96" id="tableHeader">Nama</th>
                <th class="text-center"
                  v-for="( tahunItem, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun "
                  :key="tahunIndex"
                  :class="{ 'text-warningColor': tahunItem < tahunBerjalan, 'text-black': tahunItem === tahunBerjalan, 'text-primaryColor': tahunItem > tahunBerjalan, }">
                  {{ dataFinansial.tahun.length === 0 ? '-' : tahunItem }} <br>
                  <span class="text-xs font-normal">{{ tahunIndex }}</span>
                </th>
              </tr>
            </thead>
            <tbody v-for="( level1, level1Index ) in finansialMappingResult" :key="level1Index">
              <tr class="text-sm cursor-pointer bg-strokeColor bg-opacity-40 active:bg-opacity-90"
                @click="toggleRow(level1.id_uraian)">
                <td class="border-b" :colspan="dataFinansial.tahun.length === 0 ? 2 : dataFinansial.tahun.length + 1">
                  <div class="flex flex-row items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                      class="mr-2" v-if="!isRowOpen(level1.id_uraian)">
                      <rect width="24" height="24" rx="6" fill="#80C1CD" />
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                        fill="white" />
                    </svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                      class="mr-2" v-else>
                      <rect width="24" height="24" rx="6" fill="#80C1CD" />
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                        fill="white" />
                    </svg>
                    <span> {{ level1.uraian }}</span>
                  </div>
                </td>
              </tr>
              <template v-for="( level2, level2Index ) in level1.level2 " :key="level2Index"
                v-if="isRowOpen(level1.id_uraian)">
                <tr class="text-sm cursor-pointer active:bg-strokeColor active:bg-opacity-30"
                  @click="toggleRow(level2.id_uraian)">
                  <td id="level2" :class="{ selected: level2.level3.length === 0 }">
                    <div class="flex flex-row items-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        class="mr-2" v-if="!isRowOpen(level2.id_uraian) && level2.level3.length !== 0">
                        <rect width="24" height="24" rx="6" fill="#80C1CD" />
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                          fill="white" />
                      </svg>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        class="mr-2" v-else-if="isRowOpen(level2.id_uraian) && level2.level3.length !== 0">
                        <rect width="24" height="24" rx="6" fill="#80C1CD" />
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                          fill="white" />
                      </svg>
                      <span>{{ level2.uraian }}</span>
                    </div>
                  </td>
                  <td v-for="( tahun, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun "
                    :class="{ 'bg-blue-50': tahun === tahunBerjalan }">
                    {{ dataFinansial.tahun ? level2.uraian.includes('Kalkulasi' || 'kalkulasi') ? '' : level2['t' +
                      tahun] == null ? '-' : globalFormat.formatRupiah(level2['t' + tahun]) : '-' }}
                  </td>
                </tr>
                <template v-for="( level3, level3Index ) in level2.level3 " :key="level3Index"
                  v-if="isRowOpen(level2.id_uraian)">
                  <tr class="text-sm cursor-pointer" @click="toggleRow(level3.id_uraian)">
                    <td id="level3" :class="{ selected: level3.level4.length === 0 }">
                      <div class="flex flex-row items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          class="mr-2" v-if="!isRowOpen(level3.id_uraian) && level3.level4.length !== 0">
                          <rect width="24" height="24" rx="6" fill="#80C1CD" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M12.4419 14.0044C12.1979 14.2485 11.8021 14.2485 11.5581 14.0044L8.43306 10.8794C8.18898 10.6354 8.18898 10.2396 8.43306 9.99556C8.67714 9.75148 9.07286 9.75148 9.31694 9.99556L12 12.6786L14.6831 9.99556C14.9271 9.75148 15.3229 9.75148 15.5669 9.99556C15.811 10.2396 15.811 10.6354 15.5669 10.8794L12.4419 14.0044Z"
                            fill="white" />
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                          class="mr-2" v-else-if="isRowOpen(level3.id_uraian) && level3.level4.length !== 0">
                          <rect width="24" height="24" rx="6" fill="#80C1CD" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                            fill="white" />
                        </svg>
                        <span>{{ level3.uraian }}</span>
                      </div>
                    </td>
                    <td v-for="( tahun, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun "
                      :class="{ 'bg-blue-50': tahun === tahunBerjalan }" :key="tahunIndex">
                      {{ dataFinansial.tahun ? level3.uraian.includes('Kalkulasi' || 'kalkulasi') ? '' : level3['t' +
                        tahun] == null ? '-' : globalFormat.formatRupiah(level3['t' + tahun])
                        : '-' }}
                    </td>
                  </tr>
                  <template v-for="( level4, level4Index ) in level3.level4 " :key="level4Index"
                    v-if="isRowOpen(level3.id_uraian)">
                    <tr class="text-sm">
                      <td id="level4">{{ level4.uraian }}</td>
                      <td v-for="( tahun, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun "
                        :class="{ 'bg-blue-50': tahun === tahunBerjalan }">
                        {{ dataFinansial.tahun ? level4.uraian.includes('Kalkulasi' || 'kalkulasi') ? '' : level4['t' +
                          tahun] == null ? '-' : globalFormat.formatRupiah(level4['t' + tahun]) : '-' }}
                      </td>
                    </tr>
                  </template>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </TabItem>
      <TabItem title="Hasil Simulasi">
        <div class="flex flex-col w-full px-2" v-if="approveMesinFS">
          <div class="mt-0.5 mb-4">
            <p class="mb-2 text-base font-bold">Hasil Simulasi</p>
            <div class="flex items-center text-xs">
              <p class="font-bold">Periode</p>
              <p class="ml-2 font-bold text-[#0099AD]">{{ approveMesinFS.tahun ? approveMesinFS.tahun : '-' }}</p>
              <p class="ml-2">/</p>
              <p class="ml-2 font-bold">Data</p>
              <p class="ml-2 font-bold text-[#0099AD]">Feasibility Study</p>
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
          <AkhirMasaManfaat v-if="hasilSimulasi" :irr-on-project="hasilSimulasi.fs_irr_project"
            :irr-on-equity="hasilSimulasi.fs_irr_equity" :npv-on-equity="hasilSimulasi.fs_npv_equity"
            :npv-on-project="hasilSimulasi.fs_npv_project" :average-ncf="hasilSimulasi.fs_average_cf"
            :average-eaf="hasilSimulasi.track_average_eaf" v-show="selectedTab === 'Akhir Masa'" />
          <TahunBerjalan v-if="hasilSimulasi" :irr-on-project="hasilSimulasi.now_fs_irr_project"
            :irr-on-equity="hasilSimulasi.now_fs_irr_equity" :npv-on-equity="hasilSimulasi.now_fs_npv_equity"
            :npv-on-project="hasilSimulasi.now_fs_npv_project" :average-ncf="hasilSimulasi.now_fs_average_cf"
            :average-eaf="hasilSimulasi.now_track_average_eaf" v-show="selectedTab === 'Tahun Berjalan'" />
        </div>
      </TabItem>
    </TabsWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router'
import PersetujuanService from '@/services/persetujuan-service';
import FeasibilityStudyService from "@/services/feasibility-study";
import DetailRekapService from "@/services/detail-rekap-service";
import GlobalFormat from "@/services/format/global-format";
import Loading from "@/components/ui/LoadingSpinner.vue";
import InfoHeader from '@/components/ui/InfoHeaderPersetujuan.vue';
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import TabsWrapper from "@/components/ui/TabsWrapperApprove.vue";
import TabItem from "@/components/ui/TabItem.vue";
import AsumsiMakro from "@/components/ui/AsumsiMakroApprove.vue";
import ParameterTeknis from "@/components/ui/ParameterTeknisApprove.vue";
import AkhirMasaManfaat from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue";
import TahunBerjalan from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue";
import jsonData from "@/assets/lottie/success.json";
import { Vue3Lottie } from 'vue3-lottie';

const route = useRoute();
const isLoading = ref(false);
const levelID = ref(localStorage.getItem("level_id"));
const level_ID = ref(levelID);
const isSuccess = ref(false);
const isReject = ref(false);
const modalCancel = ref(false);
const modalApprove = ref(false);
const isRowTabOpen = ref<number[]>([]);
const selectedTab = ref("Akhir Masa");
const data = ref('Feasibility Study');
const detailRekapService = new DetailRekapService();
const feasibilityStudyService = new FeasibilityStudyService();
const persetujuanService = new PersetujuanService();
const globalFormat = new GlobalFormat();

const approveSentralFS = ref<ListApprove>();
const approveMesinFS = ref<ListApprove>();
const comboBahanBakar = ref<[]>([]);
const asumsiMakro = ref<AsumsiMakroItem>()
const parameterTeknisFinansial = ref<ParameterTeknisFinancialItem>();
const mesinDataById = ref<MesinItem>();
const namaPengelola = ref<string>('');
const bahanBakars = ref<{
  id_mesin: number
  tahun: string
  kode_bahan_bakar: string
  harga_bahan_bakar: number
  sfc: number
  flag_bahan_bakar: number
}[]>([]);
const finansialMappingResult = ref<any[]>([]);
const typePeriodic = ref<Object[]>([]);
const tahunBerjalan = new Date().getFullYear();
const umurTeknis = ref();
const dataTeknis = ref();
const dataFinansial = ref();
const hasilSimulasi = ref();
const updateMesinFS = ref<any>();
const mesin = ref<any>({});
const tahunData = ref<any>();
const pesan = ref<any>();
const idGrafik = ref(route.params.id);
const tahunGrafik = ref(route.query.tahun);
const statusMesin = ref<any>([]);

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
  nilai_asset_awal: number
}

interface ListApprove {
  data: any
  pengelola: string
  pembina: string
  umur_teknis: string
  tahun: string
  status: string
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

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchMesinById = async () => {
  try {
    const response: MesinItem = await feasibilityStudyService.getMesinById(
      route.params.id
    );
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
      tahun: route.query.tahun
    });
    approveSentralFS.value = response.data;
    approveMesinFS.value = response.data.mesins.filter((val: any) => val.id_mesin === route.params.id)[0];
    mesin.value = response.data.mesins.filter((val: any) => val.id_mesin === route.params.id)[0];
    for (var i = 0; i < response.data.mesins.length; i++) {
      if (route.params.id === response.data.mesins[i].id_mesin) {
        statusMesin.value.push(response.data.mesins[i].id_status)
      }
    }
  } catch (error) {
    console.error('Fetch Persetujuan FS Sentral Error : ' + error);
  }
}

const fetchAsumsiFeasibility = async () => {
  try {
    const response: any =
      await feasibilityStudyService.getAsumsiFeasibility(
        parseInt(route.params.id.toString()),
        parseInt(mesinDataById.value?.tahun_operasi ?? '')
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
      daya_mampu_netto_mw: response.data.parameter_teknis_financial
        .daya_mampu_netto_mw,
      auxiliary: response.data.parameter_teknis_financial
        .auxiliary,
      susut_trafo: response.data.parameter_teknis_financial
        .susut_trafo,
      ps: response.data.parameter_teknis_financial
        .ps,
      nphr: response.data.parameter_teknis_financial
        .nphr,
      total_project_cost: response.data.parameter_teknis_financial
        .total_project_cost,
      loan: response.data.parameter_teknis_financial
        .loan,
      equity: response.data.parameter_teknis_financial
        .equity,
      electricity_price_a_rp_per_kwbln: response.data.parameter_teknis_financial
        .electricity_price_a_rp_per_kwbln,
      electricity_price_b_rp_per_kwbln: response.data.parameter_teknis_financial
        .electricity_price_b_rp_per_kwbln,
      electricity_price_c_rp_per_kwh: response.data.parameter_teknis_financial
        .electricity_price_c_rp_per_kwh,
      electricity_price_d_rp_per_kwh: response.data.parameter_teknis_financial
        .electricity_price_d_rp_per_kwh,
    };
    bahanBakars.value = response.data.harga_bahan_bakars;
    umurTeknis.value = response.data.umur_teknis;
  } catch (error) {
    console.error("Error Fetch Asumsi Feasibility : " + error);
  }
};

const fetchDataTeknis = async () => {
  try {
    const response: any = await feasibilityStudyService.getDataTeknis(
      parseInt(route.params.id.toString())
    );
    dataTeknis.value = response.data;
  } catch (error) {
    console.error("Error Fetch Data Teknis : " + error);
  }
};

const fetchDataFinansial = async () => {
  try {
    const response: any = await feasibilityStudyService.getDataFinansial(
      parseInt(route.params.id.toString())
    );
    let currentLevel1: any | null = null;
    let currentLevel2: any | null = null;
    let currentLevel3: any | null = null;
    for (const item of response.data.detail) {
      if (item.level === 1) {
        currentLevel1 = {
          ...item,
          level2: [],
        };
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
        currentLevel3.level4.push({ ...item });
      }
    }
    dataFinansial.value = response.data;
  } catch (error) {
    console.error("Fetch Data Finansial Error : " + error);
  }
};

const fetchHasilSimulasi = async () => {
  try {
    const response: any = await feasibilityStudyService.getHasilSimulasi(
      parseInt(route.params.id.toString()),
      parseInt(statusMesin.value)
    );
    hasilSimulasi.value = response.data;
  } catch (error) {
    console.error("Fetch Hasil Simulasi Error : " + error);
  }
}

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
const fetchUnitPengelola = async () => {
  try {
    if (mesinDataById.value) {
      const kodeSentral = mesinDataById.value.kode_sentral;
      const pembangkitResponse: any =
        await detailRekapService.getPembangkitByKode(kodeSentral);
      const kodePengelola = pembangkitResponse.data.kode_pengelola;
      const pengelolaResponse: any =
        await detailRekapService.getPengelolaData();
      const pengelola = pengelolaResponse.data.filter(
        (pengelola: any) => pengelola.kode_pengelola === kodePengelola
      );
      namaPengelola.value = pengelola[0].pengelola;
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : " + error);
  }
};

const getTypePeriodic = (num: number) => {
  let filteredTypePeriodic: any;
  if (typePeriodic.value.length !== 0) {
    filteredTypePeriodic = typePeriodic.value.filter((periodic: any) => periodic.id_type_periodic === num);
    return filteredTypePeriodic.length === 0 ? '-' : filteredTypePeriodic[0].kode_type_periodic;
  }
  return "-";
}

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

const toggleRow = (itemId: number) => {
  if (isRowOpen(itemId)) {
    isRowTabOpen.value = isRowTabOpen.value.filter(
      (id) => id !== itemId
    );
  } else {
    isRowTabOpen.value.push(itemId);
  }
};

const isRowOpen = (itemId: number) => {
  return isRowTabOpen.value.includes(itemId);
};

const updateFSPengelola = async () => {
  try {
    const response: any = await persetujuanService.updateStatusFS({
      status_approval: 4,
      keterangan: '',
      id_mesin: parseInt(route.params.id.toString())
    })
    isLoading.value = true;
    updateMesinFS.value = response.data
    modalApprove.value = false;
    isLoading.value = false;

    await fetchMesinById();
    await fetchPersetujuanFS();
    await fetchAsumsiFeasibility();
    await fetchTypePeriodic();
    await fetchDataTeknis();
    await fetchDataFinansial();
    await fetchHasilSimulasi();
    await fetchComboBahanBakar();
    isLoading.value = false;
  } catch (error) {
    console.error("Error Fetch Update Feasibility : " + error);
  } finally {
    isSuccess.value = true;
    await wait(1500)
    isSuccess.value = false;
  }
}

const rejectFSPengelola = async () => {
  try {
    const response: any = await persetujuanService.updateStatusFS({
      status_approval: 5,
      keterangan: pesan.value,
      id_mesin: parseInt(route.params.id.toString())
    })
    isLoading.value = true
    updateMesinFS.value = response.data
    modalCancel.value = false;
    isLoading.value = false;

    await fetchMesinById();
    await fetchPersetujuanFS();
    await fetchAsumsiFeasibility();
    await fetchTypePeriodic();
    await fetchDataTeknis();
    await fetchDataFinansial();
    await fetchHasilSimulasi();
    await fetchComboBahanBakar();
    isLoading.value = false;
  } catch (error) {
    console.error("Error Fetch Update Feasibility : " + error);
  } finally {
    isReject.value = true;
    await wait(1500)
    isReject.value = false;
  }
}

const updateFSPembina = async () => {
  try {
    const response: any = await persetujuanService.updateStatusFS({
      status_approval: 1,
      keterangan: '',
      id_mesin: parseInt(route.params.id.toString())
    })
    isLoading.value = true
    updateMesinFS.value = response.data
    modalApprove.value = false;
    isLoading.value = false;

    await fetchMesinById();
    await fetchPersetujuanFS();
    await fetchAsumsiFeasibility();
    await fetchTypePeriodic();
    await fetchDataTeknis();
    await fetchDataFinansial();
    await fetchHasilSimulasi();
    await fetchComboBahanBakar();
    isLoading.value = false;
  } catch (error) {
    console.error("Error Fetch Update Feasibility : " + error);
  } finally {
    isSuccess.value = true;
    await wait(1500)
    isSuccess.value = false;
  }
}

const rejectFSPembina = async () => {
  try {
    const response: any = await persetujuanService.updateStatusFS({
      status_approval: 2,
      keterangan: pesan.value,
      id_mesin: parseInt(route.params.id.toString())
    })
    isLoading.value = true
    updateMesinFS.value = response.data
    modalCancel.value = false;
    isLoading.value = false;

    await fetchMesinById();
    await fetchPersetujuanFS();
    await fetchAsumsiFeasibility();
    await fetchTypePeriodic();
    await fetchDataTeknis();
    await fetchDataFinansial();
    await fetchHasilSimulasi();
    await fetchComboBahanBakar();
    isLoading.value = false;
  } catch (error) {
    console.error("Error Fetch Update Feasibility : " + error);
  } finally {
    isReject.value = true;
    await wait(1500)
    isReject.value = false;
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