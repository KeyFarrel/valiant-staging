<template>
  <Loading v-if="isLoading" />
  <div class="space-y-4" v-if="mesinDataById">
    <InfoHeader :nama-mesin="mesinDataById.mesin" :nama-pengelola="namaPengelola ? namaPengelola : '-'"
      :kondisi-unit="mesinDataById.kondisi_unit" :kode-jenis-pembangkit="mesinDataById.kode_jenis_pembangkit"
      :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
      :tahun-operasi="mesinDataById.tahun_operasi" :umur-teknis="mesinDataById.masa_manfaat.toString()"
      :nama-pembina="namaPembina">
    </InfoHeader>
    <main class="flex flex-col w-full p-4 space-y-5 bg-white rounded-lg">
      <div class="flex flex-row items-center justify-between">
        <h1 class="text-lg font-semibold">Operational Expenditure (OPEX)</h1>
        <p>Periode <span class="ml-1 font-semibold text-primaryColor">{{ tahun }}</span></p>
      </div>
      <div
        v-if="opexKomponenB"
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
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(opexKomponenB.cost_component_b)
                }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Kepegawaian</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_kepegawaian) }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Pemeliharaan Rutin</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_pemeliharaan_rutin) }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Administrasi dan Umum</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_administrasi_umum) }}</span>
            </p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Pembelian Tenaga Listrik</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_pembelian_tenaga_listrik) }}</span>
            </p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Lain - Lain</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(opexKomponenB.biaya_lain_lain) }}</span></p>
          </div>
        </div>
      </div>
      <div
        v-if="opexKomponenC"
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
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(opexKomponenC.total_component_c.cost_component_c) }}</span></p>
          </div>
          <div v-for="(komponenCItem, komponenCIndex) in opexKomponenC.detail_component_c" :key="komponenCIndex">
            <p class="text-textDisabledColor">{{ komponenCItem.bahan_bakar }}</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(komponenCItem.harga_bahan_bakar) }}</span></p>
          </div>
        </div>
      </div>
      <div
        v-if="opexKomponenD"
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
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(opexKomponenD.cost_component_d) }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Minyak Pelumas</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
              globalFormat.formatRupiah(opexKomponenD.biaya_pelumas) }}</span></p>
          </div>
          <div>
            <p class="text-textDisabledColor">Biaya Bahan Kimia</p>
            <p class="text-textDisabledColor">Rp. <span class="font-medium text-primaryTextColor">{{
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
import UserService from "@/services/user-service";
const userService = new UserService();
import InfoHeader from '@/components/ui/InfoHeader.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();

const isLoading = ref<boolean>(false);
const mesinDataById = ref<any>();
const namaPengelola = ref<string>('');
const namaPembina = ref<string>('');
const umurTeknis = ref<any>();
const opexKomponenB = ref<any>();
const opexKomponenC = ref<any>();
const opexKomponenD = ref<any>();
const tahun = route.query.tahun;
const tahunBerjalan = new Date().getFullYear();

const fetchMesinById = async () => {
  try {
    const response: any = await lihatOPEXService.getMesinById(
      idMesin
    );
    mesinDataById.value = response.data;
  } catch (error) {
    console.error("Fetch Mesin By Id Error : ", error);
  }
};
const fetchListPembina = async () => {
  try {
    const response: any = await userService.getPembina('');
    return response.data;
  } catch (error) {
    console.error('Fetch Pembina Error : ', error)
  }
}
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
      const idPembina = pembangkitResponse.data.uuid_pembina;
      const pembinaList: any = await fetchListPembina();
      namaPembina.value = pembinaList.find((pembina: any) => pembina.uuid_pembina === idPembina).pembina;
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : ", error);
  }
};
const fetchAsumsiParameter = async () => {
  try {
    const response: any =
      await lihatOPEXService.getAsumsiParameterData(
        parseInt(tahun ? tahun.toString() : tahunBerjalan.toString()),
        idMesin,
        parseInt(tahun ? tahun.toString() : tahunBerjalan.toString()) + 1
      );
    umurTeknis.value = response.data.asumsi_makro.umur_teknis;
  } catch (error) {
    console.error("Fetch Asumsi Parameter Error : ", error);
  }
};

const fetchOPEXKomponenB = async () => {
  try {
    const response: any = await lihatOPEXService.getOPEXKomponenB(
      idMesin,
      parseInt(tahun ? tahun.toString() : tahunBerjalan.toString())
    );
    opexKomponenB.value = response.data;
  } catch (error) {
    console.error("Fetch OPEX Komponen B Error : ", error);
  }
}
const fetchOPEXKomponenC = async () => {
  try {
    const response: any = await lihatOPEXService.getOPEXKomponenC(
      idMesin,
      parseInt(tahun ? tahun.toString() : tahunBerjalan.toString())
    );
    opexKomponenC.value = response.data;
  } catch (error) {
    console.error("Fetch OPEX Komponen C Error : ", error);
  }
}
const fetchOPEXKomponenD = async () => {
  try {
    const response: any = await lihatOPEXService.getOPEXKomponenD(
      idMesin,
      parseInt(tahun ? tahun.toString() : tahunBerjalan.toString())
    );
    opexKomponenD.value = response.data;
  } catch (error) {
    console.error("Fetch OPEX Komponen D Error : ", error);
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchMesinById();
  await fetchUnitPengelola();
  await fetchAsumsiParameter();
  await fetchOPEXKomponenB();
  await fetchOPEXKomponenC();
  await fetchOPEXKomponenD();
  isLoading.value = false;
})
</script>

<style scoped>
.date-picker {
  width: 10rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
}
</style>