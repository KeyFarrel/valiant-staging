<template>
  <Loading v-if="isLoading" />
  <InfoHeader v-if="mesinDataById && umurTeknis" :nama-mesin="mesinDataById.mesin" :nama-pengelola="namaPengelola"
    :kondisi-unit="mesinDataById.kondisi_unit" :kode-jenis-pembangkit="mesinDataById.kode_jenis_pembangkit"
    :daya-terpasang="mesinDataById.daya_terpasang.toString()" :daya-mampu="mesinDataById.daya_mampu.toString()"
    :tahun-operasi="mesinDataById.tahun_operasi.toString()" :umur-teknis="umurTeknis">
    <RouterLink :to="{ name: 'grafik', params: { id: mesinDataById.kode_sentral } }">
      <button
        class="border flex flex-row space-x-2 items-center border-[#0099AD] hover:border-blue-600 mr-3 px-3 py-2 text-[#0099AD] hover:text-white rounded-lg hover:bg-blue-600 duration-300">
        <span class="font-semibold">Lihat Grafik</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.80622 6.38128C10.1479 6.72299 10.1479 7.27701 9.80622 7.61872L5.43122 11.9937C5.08951 12.3354 4.53549 12.3354 4.19378 11.9937C3.85207 11.652 3.85207 11.098 4.19378 10.7563L7.95006 7L4.19378 3.24372C3.85207 2.90201 3.85207 2.34799 4.19378 2.00628C4.53549 1.66457 5.08951 1.66457 5.43122 2.00628L9.80622 6.38128Z"
            fill="#0099AD" />
        </svg>
      </button>
    </RouterLink>
    <!-- <button
        class="flex items-center bg-[#0099AD] border border-[#0099AD] px-3 py-2 rounded-lg hover:bg-blue-600 hover:border-blue-600 duration-300">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.12496 3.20768C4.75575 3.20768 3.64579 4.31764 3.64579 5.68685C3.64579 5.84492 3.66051 5.99903 3.6885 6.14802C3.74247 6.43534 3.57543 6.71823 3.29778 6.80973C2.48281 7.07831 1.89579 7.84604 1.89579 8.74935C1.89579 9.87693 2.80988 10.791 3.93746 10.791H10.5C11.3859 10.791 12.1041 10.0728 12.1041 9.18685C12.1041 8.50243 11.6752 7.91672 11.0696 7.68658C10.7739 7.57423 10.6216 7.24669 10.7263 6.9482C10.7685 6.82804 10.7916 6.69828 10.7916 6.56185C10.7916 5.91752 10.2693 5.39518 9.62496 5.39518C9.49823 5.39518 9.37732 5.41518 9.26456 5.45175C9.11225 5.50114 8.94634 5.48576 8.80571 5.40921C8.66508 5.33266 8.5621 5.20167 8.5209 5.04694C8.23884 3.98749 7.27222 3.20768 6.12496 3.20768ZM2.47913 5.68685C2.47913 3.67331 4.11142 2.04102 6.12496 2.04102C7.62252 2.04102 8.90812 2.94352 9.46947 4.23364C9.52091 4.23024 9.57276 4.22852 9.62496 4.22852C10.9136 4.22852 11.9583 5.27318 11.9583 6.56185C11.9583 6.64957 11.9534 6.73628 11.9439 6.82171C12.7392 7.30824 13.2708 8.18495 13.2708 9.18685C13.2708 10.7171 12.0302 11.9577 10.5 11.9577H3.93746C2.16555 11.9577 0.729126 10.5213 0.729126 8.74935C0.729126 7.49971 1.44326 6.41805 2.48461 5.88823C2.48097 5.82152 2.47913 5.75438 2.47913 5.68685ZM6.99996 5.10352C7.32213 5.10352 7.58329 5.36468 7.58329 5.68685V8.21606L8.33748 7.46187C8.56529 7.23406 8.93463 7.23406 9.16244 7.46187C9.39024 7.68968 9.39024 8.05902 9.16244 8.28683L7.41244 10.0368C7.18463 10.2646 6.81529 10.2646 6.58748 10.0368L4.83748 8.28683C4.60967 8.05902 4.60967 7.68968 4.83748 7.46187C5.06529 7.23406 5.43463 7.23406 5.66244 7.46187L6.41663 8.21606V5.68685C6.41663 5.36468 6.67779 5.10352 6.99996 5.10352Z"
            fill="white" />
        </svg>
        <span class="ml-2 font-semibold text-white">Export</span>
      </button> -->
    <!-- </div> -->
  </InfoHeader>
  <div class="items-start p-6 mt-4 bg-white rounded-lg">
    <TabsWrapper :laman-data="false">
      <TabItem :title="'Asumsi Makro'">
        <AsumsiMakro :corporate-tax-rate="asumsiMakro
          ? asumsiMakro.corporate_tax_rate
          : '-'
          " :discount-rate="asumsiMakro ? asumsiMakro.discount_rate : '-'
            " :interest-rate="asumsiMakro ? asumsiMakro.discount_rate : '-'
              " :loan-tenor="asumsiMakro ? asumsiMakro.loan_tenor : '-'
                " :loan-portion="asumsiMakro ? asumsiMakro.loan_portion : '-'
          " :equity-portion="asumsiMakro ? asumsiMakro.equity_portion : '-'
          " />
      </TabItem>
      <TabItem :title="'Parameter Teknis & Finansial'">
        <ParameterTeknis v-if="bahanBakars" :daya-terpasang="parameterTeknisFinansial?.daya_terpasang ?? '-'"
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
        <div class="w-full overflow-auto border rounded-lg whitespace-nowrap">
          <table v-if="dataTeknis" class="w-full text-sm">
            <thead>
              <tr class="text-[#0099AD] text-sm text-left border-b-2">
                <th class="sticky left-0 z-10 bg-white">No</th>
                <th class="sticky z-10 bg-white left-10">Nama</th>
                <th v-for="( item, index ) in
                  dataTeknis.tahun.length === 0
                  ? 1
                  : dataTeknis.tahun
" :key="index">
                  {{ dataTeknis.tahun.length === 0 ? "-" : item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="( item, index ) in dataTeknis.detail " :key="index">
                <td class="sticky left-0 z-10 bg-white">{{ index + 1 }}</td>
                <td class="sticky z-10 bg-white left-10">{{ item.uraian }}</td>
                <td
                  :class="{ 'text-right': item.uraian !== 'Type of Periodic Maintenance', 'text-center': item.uraian == 'Type of Periodic Maintenance', }"
                  v-for="( items, indexs ) in
                    dataTeknis.tahun.length === 0
                    ? 1
                    : dataTeknis.tahun
" :key="indexs">
                  {{
                    dataTeknis.tahun
                      ? item["t" + items] != null
                        ? item.uraian === 'Type of Periodic Maintenance' ? item["t" + items] === 0 ? "-" :
                          getTypePeriodic(item["t"
                            + items]) :
                          globalFormat.formatRupiah(item["t" + items])
                        : "-"
                      : "-"
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabItem>
      <TabItem title="Data Finansial">
        <div class="w-full overflow-auto border rounded-lg whitespace-nowrap" v-if="dataFinansial">
          <table class="w-full">
            <thead>
              <tr class="text-[#0099AD] text-sm text-left border-b-2">
                <th class="pr-96" id="tableHeader">Nama</th>
                <th v-for="( tahunItem, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun "
                  :key="tahunIndex">
                  {{ dataFinansial.tahun.length === 0 ? '-' : tahunItem }}
                </th>
              </tr>
            </thead>
            <tbody v-for="( level1, level1Index ) in finansialMappingResult " :key="level1Index">
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
                    <span>{{ level1.uraian }}</span>
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
                  <td class="text-right"
                    v-for="( tahun, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun ">
                    {{ dataFinansial.tahun ? level2.uraian.includes('Kalkulasi' || 'kalkulasi') ? '' : level2['t' +
                      tahun]
                      == null ? '-' : globalFormat.formatRupiah(level2['t' +
                        tahun])
                      : '-' }}
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
                    <td class="text-right"
                      v-for="( tahun, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun "
                      :key="tahunIndex">
                      {{ dataFinansial.tahun ? level3.uraian.includes('Kalkulasi' || 'kalkulasi') ? '' : level3['t' +
                        tahun]
                        == null ? '-'
                        : globalFormat.formatRupiah(level3['t' + tahun])
                        : '-' }}
                    </td>
                  </tr>
                  <template v-for="( level4, level4Index ) in level3.level4 " :key="level4Index"
                    v-if="isRowOpen(level3.id_uraian)">
                    <tr class="text-sm">
                      <td id="level4">{{ level4.uraian }}</td>
                      <td class="text-right"
                        v-for="( tahun, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun ">
                        {{ dataFinansial.tahun ? level4.uraian.includes('Kalkulasi' || 'kalkulasi') ? '' : level4['t' +
                          tahun] == null ? '-' :
                          globalFormat.formatRupiah(level4['t' + tahun]) : '-' }}
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
        <div class="flex flex-col w-full px-2">
          <nav class="rounded-md bg-primaryColor bg-opacity-5">
            <ul class="table w-full text-sm text-center text-primaryColor border-spacing-x-5">
              <li id="tab"
                class="table-cell w-1/2 py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                @click="selectedTab = 'Akhir Masa'" :class="{ selected: selectedTab === 'Akhir Masa' }">
                COD - Akhir Masa Manfaat</li>
              <li id="tab"
                class="table-cell w-1/2 py-2 font-semibold rounded-lg cursor-pointer active:bg-primaryColor active:bg-opacity-10"
                @click="selectedTab = 'Tahun Berjalan'" :class="{ selected: selectedTab === 'Tahun Berjalan' }">COD -
                Tahun Berjalan
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
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import AsumsiMakro from "@/components/ui/AsumsiMakro.vue";
import ParameterTeknis from "@/components/ui/ParameterTeknis.vue";
import AkhirMasaManfaat from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue";
import TahunBerjalan from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import InfoHeader from '@/components/ui/InfoHeader.vue'
import { useRoute } from "vue-router";
const route = useRoute();
import FeasibilityStudyService from "@/services/feasibility-study";
const feasibilityStudyService = new FeasibilityStudyService();
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();

const mesinDataById = ref<MesinItem>();
const asumsiMakro = ref<AsumsiMakroItem>()
const parameterTeknisFinansial = ref<ParameterTeknisFinancialItem>();
const bahanBakars = ref<{
  id_mesin: number
  tahun: string
  kode_bahan_bakar: string
  harga_bahan_bakar: number
  sfc: number
  flag_bahan_bakar: number
}[]>();
const comboBahanBakar = ref<[]>([]);
const dataTeknis = ref();
const dataFinansial = ref();
const hasilSimulasi = ref();
const isLoading = ref();
const umurTeknis = ref();
const namaPengelola = ref('');
const finansialMappingResult = ref<any[]>([]);
const typePeriodic = ref<Object[]>([]);
const idMesin = parseInt(route.params.id.toString());
const isRowTabOpen = ref<number[]>([]);
const selectedTab = ref("Akhir Masa");

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

const fetchMesinById = async () => {
  try {
    const response: MesinItem = await feasibilityStudyService.getMesinById(
      route.params.id
    );
    mesinDataById.value = response.data;
  } catch (error) {
    console.error("Fetch Mesin By Id Error : " + error);
  }
};
const fetchAsumsiFeasibility = async () => {
  try {
    const response: any =
      await feasibilityStudyService.getAsumsiFeasibility(
        idMesin,
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
      daya_terpasang: response.data.parameter_teknis_financial.daya_terpasang,
      daya_mampu_netto_mw: response.data.parameter_teknis_financial.daya_mampu_netto_mw,
      auxiliary: response.data.parameter_teknis_financial.auxiliary,
      susut_trafo: response.data.parameter_teknis_financial.susut_trafo,
      ps: response.data.parameter_teknis_financial.ps,
      nphr: response.data.parameter_teknis_financial.nphr,
      total_project_cost: response.data.parameter_teknis_financial.total_project_cost,
      loan: response.data.parameter_teknis_financial.loan,
      equity: response.data.parameter_teknis_financial.equity,
      electricity_price_a_rp_per_kwbln: response.data.parameter_teknis_financial.electricity_price_a_rp_per_kwbln,
      electricity_price_b_rp_per_kwbln: response.data.parameter_teknis_financial.electricity_price_b_rp_per_kwbln,
      electricity_price_c_rp_per_kwh: response.data.parameter_teknis_financial.electricity_price_c_rp_per_kwh,
      electricity_price_d_rp_per_kwh: response.data.parameter_teknis_financial.electricity_price_d_rp_per_kwh,
    };
    bahanBakars.value = response.data.harga_bahan_bakars;
    console.log(bahanBakars.value)
    umurTeknis.value = response.data.asumsi_makro.umur_teknis.toString();
  } catch (error) {
    console.error("Error Fetch Asumsi Feasibility : " + error);
  }
};
const fetchDataTeknis = async () => {
  try {
    const response: any = await feasibilityStudyService.getDataTeknis(idMesin);
    dataTeknis.value = response.data;
  } catch (error) {
    console.error("Error Fetch Data Teknis : " + error);
  }
};
const fetchDataFinansial = async () => {
  try {
    const response: any = await feasibilityStudyService.getDataFinansial(
      idMesin
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
      idMesin,
      4
    );
    hasilSimulasi.value = response.data;
  } catch (error) {
    console.error("Fetch Hasil Simulasi Error : " + error);
  }
}
const fetchTypePeriodic = async () => {
  try {
    const response: any = await feasibilityStudyService.getTypePeriodic(mesinDataById.value?.kode_jenis_pembangkit);
    typePeriodic.value = response.data;
  } catch (error) {
    console.error("Fetch Type Periodic Error : " + error);
  }
};
const getTypePeriodic = (num: number) => {
  let filteredTypePeriodic: any;
  if (typePeriodic.value.length !== 0) {
    filteredTypePeriodic = typePeriodic.value.filter((periodic: any) => periodic.id_type_periodic === num);
    return filteredTypePeriodic[0].kode_type_periodic;
  }
  return "-";
}
const fetchComboBahanBakar = async () => {
  try {
    const response: any = await feasibilityStudyService.getComboBahanBakar(mesinDataById.value?.kode_jenis_pembangkit);
    comboBahanBakar.value = response.data;
    console.log(response.data)
  } catch (error) {
    console.error('Fetch Combo Bahan Bakar Error : ' + error);
  }
}
const fetchUnitPengelola = async () => {
  try {
    if (mesinDataById.value) {
      const kodeSentral = mesinDataById.value.kode_sentral;
      const pembangkitResponse: any =
        await feasibilityStudyService.getPembangkitByKode(kodeSentral);
      const kodePengelola = pembangkitResponse.data.kode_pengelola;
      const pengelolaResponse: any =
        await feasibilityStudyService.getPengelolaData();
      const pengelola = pengelolaResponse.data.filter(
        (pengelola: any) => pengelola.kode_pengelola === kodePengelola
      );
      namaPengelola.value = pengelola[0].pengelola;
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : " + error);
  }
};
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

onMounted(async () => {
  isLoading.value = true;
  await fetchMesinById();
  await fetchAsumsiFeasibility();
  await fetchDataTeknis();
  await fetchDataFinansial();
  await fetchHasilSimulasi();
  await fetchTypePeriodic();
  await fetchUnitPengelola();
  await fetchComboBahanBakar();
  isLoading.value = false;
});
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
</style>
