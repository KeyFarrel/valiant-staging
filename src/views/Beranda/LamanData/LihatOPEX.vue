<template>
  <Loading v-if="isLoading" />
  <div class="space-y-4" v-if="mesinDataById">
    <InfoHeader :nama-mesin="mesinDataById.mesin" :nama-pengelola="namaPengelola ? namaPengelola : '-'"
      :kondisi-unit="mesinDataById.kondisi_unit" :kode-jenis-pembangkit="mesinDataById.kode_jenis_pembangkit"
      :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
      :tahun-operasi="mesinDataById.tahun_operasi" :umur-teknis="mesinDataById.masa_manfaat.toString()">
      <!-- <button
        class="flex items-center px-3 py-2 text-white duration-300 border rounded-lg bg-primaryColor border-primaryColor hover:border-hoverColor hover:bg-hoverColor active:duration-0 active:outline active:outline-primaryColor">
        <span class="mr-2 font-semibold">Export</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.12496 3.20768C4.75575 3.20768 3.64579 4.31764 3.64579 5.68685C3.64579 5.84492 3.66051 5.99903 3.6885 6.14802C3.74247 6.43534 3.57543 6.71823 3.29778 6.80973C2.48281 7.07831 1.89579 7.84604 1.89579 8.74935C1.89579 9.87693 2.80988 10.791 3.93746 10.791H10.5C11.3859 10.791 12.1041 10.0728 12.1041 9.18685C12.1041 8.50243 11.6752 7.91672 11.0696 7.68658C10.7739 7.57423 10.6216 7.24669 10.7263 6.9482C10.7685 6.82804 10.7916 6.69828 10.7916 6.56185C10.7916 5.91752 10.2693 5.39518 9.62496 5.39518C9.49823 5.39518 9.37732 5.41518 9.26456 5.45175C9.11225 5.50114 8.94634 5.48576 8.80571 5.40921C8.66508 5.33266 8.5621 5.20167 8.5209 5.04694C8.23884 3.98749 7.27222 3.20768 6.12496 3.20768ZM2.47913 5.68685C2.47913 3.67331 4.11142 2.04102 6.12496 2.04102C7.62252 2.04102 8.90812 2.94352 9.46947 4.23364C9.52091 4.23024 9.57276 4.22852 9.62496 4.22852C10.9136 4.22852 11.9583 5.27318 11.9583 6.56185C11.9583 6.64957 11.9534 6.73628 11.9439 6.82171C12.7392 7.30824 13.2708 8.18495 13.2708 9.18685C13.2708 10.7171 12.0302 11.9577 10.5 11.9577H3.93746C2.16555 11.9577 0.729126 10.5213 0.729126 8.74935C0.729126 7.49971 1.44326 6.41805 2.48461 5.88823C2.48097 5.82152 2.47913 5.75438 2.47913 5.68685ZM6.99996 5.10352C7.32213 5.10352 7.58329 5.36468 7.58329 5.68685V8.21606L8.33748 7.46187C8.56529 7.23406 8.93463 7.23406 9.16244 7.46187C9.39024 7.68968 9.39024 8.05902 9.16244 8.28683L7.41244 10.0368C7.18463 10.2646 6.81529 10.2646 6.58748 10.0368L4.83748 8.28683C4.60967 8.05902 4.60967 7.68968 4.83748 7.46187C5.06529 7.23406 5.43463 7.23406 5.66244 7.46187L6.41663 8.21606V5.68685C6.41663 5.36468 6.67779 5.10352 6.99996 5.10352Z"
            fill="#FFFFFF" />
        </svg>
      </button> -->
    </InfoHeader>
    <main class="flex flex-col w-full p-4 space-y-5 bg-white rounded-lg">
      <div class="flex flex-row items-center justify-between">
        <h1 class="text-lg font-semibold">Operational Expenditure (OPEX)</h1>
        <div class="flex flex-row items-center space-x-2">
          <label>Periode</label>
          <VueDatePicker class="date-picker" v-model="selectedYear" :year-range="[2000, 2025]" :clearable="false"
            year-picker />
        </div>
      </div>
      <div
        class="overflow-hidden w-full flex flex-col border px-5 pb-4 pt-1 rounded-lg shadow-sm border-l-8 border-l-[#0099AD] space-y-3">
        <div class="absolute bottom-0 right-0">
          <svg width="126" height="61" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
          </svg>
        </div>
        <div class="absolute bottom-0 right-0">
          <svg width="66" height="121" viewBox="0 0 66 121" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
          </svg>
        </div>
        <p class="text-base font-semibold">Komponen B</p>
        <hr class="w-full">
        <div class="grid grid-cols-4 gap-5 text-sm">
          <div>
            <p class="text-textDisabledColor">Total Komponen B</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenB.cost_component_b)
                }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Kepegawaian</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_kepegawaian) }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Pemeliharaan Rutin</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_pemeliharaan_rutin) }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Administrasi dan Umum</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_administrasi_umum) }}</span>
            </p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Pembelian Tenaga Listrik</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_pembelian_tenaga_listrik) }}</span>
            </p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Lain - Lain</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_lain_lain) }}</span></p>
          </div>
        </div>
      </div>
      <div
        class="overflow-hidden w-full flex flex-col border px-5 pb-4 pt-1 rounded-lg shadow-sm border-l-8 border-l-[#0099AD] space-y-3">
        <div class="absolute bottom-0 right-0">
          <svg width="126" height="61" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
          </svg>
        </div>
        <div class="absolute bottom-0 right-0">
          <svg width="66" height="121" viewBox="0 0 66 121" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
          </svg>
        </div>
        <p class="text-base font-semibold">Komponen C</p>
        <hr class="w-full">
        <div class="grid grid-cols-4 gap-3 text-sm">
          <div>
            <p class="text-textDisabledColor">Total Komponen C</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenC.total_component_c.cost_component_c) }}</span></p>
          </div>
          <div v-for="(komponenCItem, komponenCIndex) in opexKomponenC.detail_component_c" :key="komponenCIndex">
            <p class="text-textDisabledColor">{{ komponenCItem.bahan_bakar }}</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(komponenCItem.harga_bahan_bakar) }}</span></p>
          </div>
        </div>
      </div>
      <div
        class="overflow-hidden w-full flex flex-col border px-5 pb-4 pt-1 rounded-lg shadow-sm border-l-8 border-l-[#0099AD] space-y-3">
        <div class="absolute bottom-0 right-0">
          <svg width="126" height="61" viewBox="0 0 126 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
          </svg>
        </div>
        <div class="absolute bottom-0 right-0">
          <svg width="66" height="121" viewBox="0 0 66 121" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle opacity="0.15" cx="88.5" cy="88.5" r="88.5" fill="#80C1CD" />
          </svg>
        </div>
        <p class="text-base font-semibold">Komponen D</p>
        <hr class="w-full">
        <div class="grid grid-cols-4 gap-3 text-sm">
          <div>
            <p class="text-textDisabledColor">Total Komponen D</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenD.cost_component_d) }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Minyak Pelumas</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenD.biaya_pelumas) }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Bahan Kimia</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-black">{{
              globalFormat.formatRupiah(opexKomponenD.biaya_lain_lain) }}</span></p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const idMesin = parseInt(route.params.id.toString());
import LihatOPEXService from '@/services/lihat-opex-service'
const lihatOPEXService = new LihatOPEXService();
import InfoHeader from '@/components/ui/InfoHeader.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();

const isLoading = ref<boolean>();
const mesinDataById = ref<any>();
const namaPengelola = ref<any>();
const umurTeknis = ref<any>();
const opexKomponenB = ref<any>();
const opexKomponenC = ref<any>();
const opexKomponenD = ref<any>();
const selectedYear = ref<number>();

const fetchMesinById = async () => {
  try {
    const response: any = await lihatOPEXService.getMesinById(
      idMesin
    );
    mesinDataById.value = response.data;
    selectedYear.value = response.data.tahun_realisasi;
  } catch (error) {
    console.error("Fetch Mesin By Id Error : " + error);
  }
};
const fetchUnitPengelola = async () => {
  try {
    if (mesinDataById.value) {
      const kodeSentral = mesinDataById.value.kode_sentral;
      const pembangkitResponse: any =
        await lihatOPEXService.getPembangkitByKode(kodeSentral);
      const kodePengelola = pembangkitResponse.data.kode_pengelola;
      const pengelolaResponse: any =
        await lihatOPEXService.getPengelolaData();
      const pengelola = pengelolaResponse.data.filter(
        (pengelola: any) => pengelola.kode_pengelola === kodePengelola
      );
      namaPengelola.value = pengelola[0].pengelola;
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : " + error);
  }
};
const fetchAsumsiParameter = async () => {
  try {
    const response: any =
      await lihatOPEXService.getAsumsiParameterData(
        2022,
        idMesin,
      );
    umurTeknis.value = response.data.asumsi_makro.umur_teknis;
  } catch (error) {
    console.error("Fetch Asumsi Parameter Error : " + error);
  }
};

const fetchOPEXKomponenB = async () => {
  try {
    const response: any = await lihatOPEXService.getOPEXKomponenB(
      idMesin,
      mesinDataById.value.tahun_realisasi
    );
    opexKomponenB.value = response.data;
  } catch (error) {
    console.error("Fetch OPEX Komponen B Error : " + error);
  }
}
const fetchOPEXKomponenC = async () => {
  try {
    const response: any = await lihatOPEXService.getOPEXKomponenC(
      idMesin,
      mesinDataById.value.tahun_realisasi
    );
    opexKomponenC.value = response.data;
  } catch (error) {
    console.error("Fetch OPEX Komponen C Error : " + error);
  }
}
const fetchOPEXKomponenD = async () => {
  try {
    const response: any = await lihatOPEXService.getOPEXKomponenD(
      idMesin,
      mesinDataById.value.tahun_realisasi
    );
    opexKomponenD.value = response.data;
  } catch (error) {
    console.error("Fetch OPEX Komponen D Error : " + error);
  }
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchMesinById();
    await fetchUnitPengelola();
    await fetchAsumsiParameter();
    await fetchOPEXKomponenB();
    await fetchOPEXKomponenC();
    await fetchOPEXKomponenD();
    console.log(mesinDataById.value);
  } catch (error) {
    isLoading.value = false;
    console.log('Fetch All API Error : ' + error);
  } finally {
    isLoading.value = false;
  }
})
</script>

<style scoped>
.date-picker {
  width: 10rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
}
</style>