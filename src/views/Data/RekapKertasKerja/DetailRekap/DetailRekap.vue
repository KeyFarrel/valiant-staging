<template>
  <Loading v-if="isLoading" />
  <div class="flex flex-col space-y-4" v-if="mesin">
    <InfoHeader v-if="mesin" :nama-mesin="mesin.mesin" :is-mesin="true"
      :nama-pengelola="namaPengelola ? namaPengelola : '-'" :kondisi-unit="mesin.kondisi_unit"
      :kode-jenis-pembangkit="mesin.kode_jenis_pembangkit" :daya-terpasang="mesin.daya_terpasang.toString()"
      :daya-mampu="mesin.daya_mampu.toString()" :tahun-operasi="mesin.tahun_operasi.toString()"
      :umur-teknis="mesin.masa_manfaat">
      <div class="flex">
        <button
          class="flex items-center border border-[#0099AD] hover:border-hoverColor mr-3 px-3 py-2 rounded-lg text-[#0099AD] hover:text-white hover:bg-hoverColor duration-300">
          <span class="mr-2 font-semibold"
            @click="currentNamaMesin = mesin.mesin; handleDownloadExcelMesin()">Export</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.12496 3.20768C4.75575 3.20768 3.64579 4.31764 3.64579 5.68685C3.64579 5.84492 3.66051 5.99903 3.6885 6.14802C3.74247 6.43534 3.57543 6.71823 3.29778 6.80973C2.48281 7.07831 1.89579 7.84604 1.89579 8.74935C1.89579 9.87693 2.80988 10.791 3.93746 10.791H10.5C11.3859 10.791 12.1041 10.0728 12.1041 9.18685C12.1041 8.50243 11.6752 7.91672 11.0696 7.68658C10.7739 7.57423 10.6216 7.24669 10.7263 6.9482C10.7685 6.82804 10.7916 6.69828 10.7916 6.56185C10.7916 5.91752 10.2693 5.39518 9.62496 5.39518C9.49823 5.39518 9.37732 5.41518 9.26456 5.45175C9.11225 5.50114 8.94634 5.48576 8.80571 5.40921C8.66508 5.33266 8.5621 5.20167 8.5209 5.04694C8.23884 3.98749 7.27222 3.20768 6.12496 3.20768ZM2.47913 5.68685C2.47913 3.67331 4.11142 2.04102 6.12496 2.04102C7.62252 2.04102 8.90812 2.94352 9.46947 4.23364C9.52091 4.23024 9.57276 4.22852 9.62496 4.22852C10.9136 4.22852 11.9583 5.27318 11.9583 6.56185C11.9583 6.64957 11.9534 6.73628 11.9439 6.82171C12.7392 7.30824 13.2708 8.18495 13.2708 9.18685C13.2708 10.7171 12.0302 11.9577 10.5 11.9577H3.93746C2.16555 11.9577 0.729126 10.5213 0.729126 8.74935C0.729126 7.49971 1.44326 6.41805 2.48461 5.88823C2.48097 5.82152 2.47913 5.75438 2.47913 5.68685ZM6.99996 5.10352C7.32213 5.10352 7.58329 5.36468 7.58329 5.68685V8.21606L8.33748 7.46187C8.56529 7.23406 8.93463 7.23406 9.16244 7.46187C9.39024 7.68968 9.39024 8.05902 9.16244 8.28683L7.41244 10.0368C7.18463 10.2646 6.81529 10.2646 6.58748 10.0368L4.83748 8.28683C4.60967 8.05902 4.60967 7.68968 4.83748 7.46187C5.06529 7.23406 5.43463 7.23406 5.66244 7.46187L6.41663 8.21606V5.68685C6.41663 5.36468 6.67779 5.10352 6.99996 5.10352Z"
              fill="#0099AD" />
          </svg>
        </button>
      </div>
    </InfoHeader>
    <div class="items-start p-6 bg-white rounded-lg">
      <TabsWrapper :kode-sentral="mesin.kode_sentral" :isLihatGrafik="true" :laman-data="false">
        <TabItem title="Asumsi Makro">
          <AsumsiMakro v-if="asumsiParameter" @on-change="fetchAsumsiParameterData"
            v-model:selected-tahun="tahunTerakhirRealisasi" :list-tahun-asumsi="listTahunAsumsi" :corporate-tax-rate="asumsiParameter
              ? asumsiParameter.corporate_tax_rate
              : '-'
              " :discount-rate="asumsiParameter ? asumsiParameter.discount_rate : '-'
                " :interest-rate="asumsiParameter ? asumsiParameter.interest_rate : '-'
                  " :loan-tenor="asumsiParameter ? asumsiParameter.loan_tenor : '-'
                    " :loan-portion="asumsiParameter ? asumsiParameter.loan_portion : '-'
                      " :equity-portion="asumsiParameter ? asumsiParameter.equity_portion : '-'
                        " />
          <AsumsiMakro v-else v-model:selected-tahun="tahunTerakhirAsumsi" :list-tahun-asumsi="listTahunAsumsi"
            :corporate-tax-rate="'-'" :discount-rate="'-'" :interest-rate="'-'" :loan-tenor="'-'" :loan-portion="'-'"
            :equity-portion="'-'" />
        </TabItem>
        <TabItem title="Parameter Teknis & Finansial">
          <ParameterTeknis v-if="comboBahanBakar.length !== 0" @on-change="fetchAsumsiParameterData"
            v-model:selected-tahun="tahunTerakhirRealisasi" :list-tahun-asumsi="listTahunAsumsi"
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
            :combo-bahan-bakar="comboBahanBakar" />
        </TabItem>
        <TabItem title="Data Teknis">
          <div class="w-full overflow-auto border rounded-lg whitespace-nowrap">
            <table v-if="dataTeknis" class="w-full text-sm">
              <thead>
                <tr class="text-[#0099AD] text-sm text-left border-b-2">
                  <th class="sticky left-0 z-10 bg-white">No</th>
                  <th class="sticky z-10 bg-white left-10">Nama</th>
                  <th class="text-center" v-for="( item, index ) in
                    dataTeknis.tahun.length === 0
                    ? 1
                    : dataTeknis.tahun
" :key="index" :class="{
  'text-warningColor': item < tahunTerakhirRealisasi,
  'text-black': item === tahunTerakhirRealisasi,
  'text-[#0099AD]': item > tahunTerakhirRealisasi,
}
  ">
                    {{ dataTeknis.tahun.length === 0 ? "-" : item }} <br> <span class="text-xs font-normal">{{ index
                      }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="( item, index ) in dataTeknis.detail " :key="index">
                  <td class="sticky left-0 z-10 bg-white">{{ index + 1 }}</td>
                  <td class="sticky z-10 bg-white left-10">{{ item.uraian }}</td>
                  <td v-for="( items, indexs ) in
                    dataTeknis.tahun.length === 0
                    ? 1
                    : dataTeknis.tahun
" :key="indexs" :class="{ 'text-right': item.uraian !== 'Type of Periodic Maintenance', 'text-center': item.uraian == 'Type of Periodic Maintenance', 'bg-blue-50': items === tahunTerakhirRealisasi }">
                    {{
                      dataTeknis.tahun
                        ? item["t" + items] != null
                          ? item.uraian === 'Type of Periodic Maintenance' ? item["t" + items] === 0 ? '-' :
                            getTypePeriodic(item["t" + items]) : item.uraian === 'Tahun Ke' ? item["t" + items] :
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
                  <th class="text-center"
                    v-for="( tahunItem, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun "
                    :key="tahunIndex" :class="{
                      'text-warningColor': tahunItem < tahunTerakhirRealisasi,
                      'text-black': tahunItem === tahunTerakhirRealisasi,
                      'text-primaryColor': tahunItem > tahunTerakhirRealisasi,
                    }
                      ">
                    {{ dataFinansial.tahun.length === 0 ? '-' : tahunItem }} <br> <span class="text-xs font-normal">{{
                      tahunIndex
                      }}</span>
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
                    <td class="text-right"
                      v-for="( tahun, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun "
                      :class="{ 'bg-blue-50': tahun === tahunTerakhirRealisasi }">
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
                        :class="{ 'bg-blue-50': tahun === tahunTerakhirRealisasi }" :key="tahunIndex">
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
                          v-for="( tahun, tahunIndex ) in dataFinansial.tahun.length === 0 ? 1 : dataFinansial.tahun "
                          :class="{ 'bg-blue-50': tahun === tahunTerakhirRealisasi }">
                          {{ dataFinansial.tahun ? level4.uraian.includes('Kalkulasi' || 'kalkulasi') ? '' : level4['t'
                            +
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
            <AkhirMasaManfaat v-if="hasilSimulasi" :irr-on-project="hasilSimulasi.track_irr_project"
              :irr-on-equity="hasilSimulasi.track_irr_equity" :npv-on-equity="hasilSimulasi.track_npv_equity"
              :npv-on-project="hasilSimulasi.track_npv_project" :average-ncf="hasilSimulasi.track_average_cf"
              :average-eaf="hasilSimulasi.track_average_eaf" v-show="selectedTab === 'Akhir Masa'" />
            <TahunBerjalan v-if="hasilSimulasi" :irr-on-project="hasilSimulasi.now_track_irr_project"
              :irr-on-equity="hasilSimulasi.now_track_irr_equity" :npv-on-equity="hasilSimulasi.now_track_npv_equity"
              :npv-on-project="hasilSimulasi.now_track_npv_project" :average-ncf="hasilSimulasi.now_track_average_cf"
              :average-eaf="hasilSimulasi.now_track_average_eaf" v-show="selectedTab === 'Tahun Berjalan'" />
            <Periode v-show="selectedTab === 'Periode'" />
            <Proyeksi v-show="selectedTab === 'Proyeksi'" />
          </div>
        </TabItem>
      </TabsWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import DetailRekapService from "@/services/detail-rekap-service";
const detailRekapService = new DetailRekapService();
import { useRoute } from "vue-router";
const route = useRoute();
import AkhirMasaManfaat from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue";
import TahunBerjalan from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue";
import Periode from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/Periode.vue";
import Proyeksi from "@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/Proyeksi.vue";
import AsumsiMakro from "@/components/ui/AsumsiMakro.vue";
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import ParameterTeknis from "@/components/ui/ParameterTeknis.vue";
import InfoHeader from '@/components/ui/InfoHeader.vue'
import axios from "axios";

const kodeMesin = ref<MesinItem>();
const idMesin = ref();
const mesin = ref<MesinItem>();
const kodeJenisPembangkit = ref<string>("");
const namaPengelola = ref();
const asumsiParameter = ref<AsumsiParameterItem>();
const parameterTeknisFinansial = ref<ParameterTeknisFinancialItem>();
const bahanBakars = ref<any[]>([]);
const dataTeknis = ref<DataTeknisItem>();
const dataFinansial = ref<any>();
const tahunBerjalan = new Date().getFullYear();
const comboBahanBakar = ref<any>([]);
const tahunRealisasi = ref<number>(tahunBerjalan);
const listTahunAsumsi = ref<{
  start: string,
  end: string
}>({
  start: "1990",
  end: "2050"
});
const tahunTerakhirAsumsi = ref<number>();
const tahunTerakhirRealisasi = ref<number>(-1);
const typePeriodic = ref<Object[]>([]);
const isLoading = ref();
const selectedTab = ref("Akhir Masa");
const finansialMappingResult = ref<any[]>([]);
const isRowTabOpen = ref<number[]>([]);
const hasilSimulasi = ref();
const currentNamaMesin = ref<string>('');

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
  masa_manfaat: number
}
interface AsumsiParameterItem {
  data: any
  id_asumsi: number
  id_mesin: number
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
}
interface DataTeknisItem {
  data: any
  tahun: any
  detail: any
}
const fetchMesinById = async () => {
  try {
    const response: MesinItem = await detailRekapService.getMesinById(
      route.params.id
    );
    mesin.value = response.data;
    kodeMesin.value = response.data.kode_mesin;
    idMesin.value = response.data.id_mesin;
    kodeJenisPembangkit.value = response.data.kode_jenis_pembangkit;
    tahunTerakhirAsumsi.value = parseInt(response.data.tahun_asumsi);
    tahunTerakhirRealisasi.value = parseInt(response.data.tahun_realisasi);
    tahunRealisasi.value = parseInt(response.data.tahun_realisasi);
  } catch (error) {
    console.error(error);
  }
};
const fetchAsumsiParameterData = async () => {
  try {
    isLoading.value = true;
    const response: AsumsiParameterItem =
      await detailRekapService.getAsumsiParameter(
        tahunTerakhirRealisasi.value,
        idMesin.value
      );
    asumsiParameter.value = response.data.asumsi_makro;
    parameterTeknisFinansial.value = response.data.parameter_teknis_financial;
    bahanBakars.value = response.data.harga_bahan_bakars;
  } catch (error) {
    console.error("Fetch Asumsi Parameter Error : " + error);
  }
  finally {
    isLoading.value = false;
  }
};
const fetchDataTeknisData = async () => {
  try {
    const response: DataTeknisItem = await detailRekapService.getDataTeknis(
      tahunTerakhirRealisasi.value,
      idMesin.value
    );
    dataTeknis.value = response.data;
  } catch (error) {
    console.error("Fetch Data Teknis Error : " + error);
  }
};
const fetchComboBahanBakar = async () => {
  try {
    const response: any = await detailRekapService.getComboBahanBakar(kodeJenisPembangkit.value);
    comboBahanBakar.value = response.data;
    console.log(response.data)
  } catch (error) {
    console.error('Fetch Combo Bahan Bakar Error : ' + error);
  }
}
const fetchDataFinansialData = async () => {
  try {
    const response: any = await detailRekapService.getDataFinansial(
      tahunTerakhirRealisasi.value,
      idMesin.value
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
    const response: any = await detailRekapService.getHasilSimulasi(
      idMesin.value,
      tahunBerjalan,
      4
    );
    console.log(response.data)
    hasilSimulasi.value = response.data;
  } catch (error) {
    console.error("Fetch Hasil Simulasi Error : " + error);
  }
}
const handleDownloadExcelMesin = async () => {
  try {
    isLoading.value = true;
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response: any = await axios.get('https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/export-template-awal', {
      responseType: 'arraybuffer',
      headers,
      params: {
        id_mesin: idMesin.value,
        tahun: tahunTerakhirRealisasi.value,
      }
    });
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `Actual - ${currentNamaMesin.value}_${tahunTerakhirRealisasi.value}_${globalFormat.formatNumberFiveDigits(parseInt(idMesin.value))}.xlsx`;
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
  }
}
const fetchTahunRealisasiData = async () => {
  try {
    const response: any = await detailRekapService.getTahunRealisasi(
      parseInt(route.params.id.toString())
    );
  } catch (error) {
    console.error("Fetch Tahun Realisasi Error : " + error);
  }
};
const fetchListTahunAsumsi = async () => {
  try {
    const response: any = await detailRekapService.getListTahunAsumsi();
    listTahunAsumsi.value.start = response.data[0].tahun;
    listTahunAsumsi.value.end = response.data.slice(-1)[0].tahun;
  } catch (error) {
    console.error("Fetch Tahun Realisasi Error : " + error);
  }
};
const fetchUnitPengelola = async () => {
  try {
    if (mesin.value) {
      const kodeSentral = mesin.value.kode_sentral;
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
const fetchTypePeriodic = async () => {
  try {
    const response: any = await detailRekapService.getTypePeriodic(kodeJenisPembangkit.value.replace(/ /g, ''));
    typePeriodic.value = response.data;
  } catch (error) {
    console.error("Fetch Type Periodic Error : " + error);
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
  await fetchTahunRealisasiData();
  await fetchUnitPengelola();
  await fetchTypePeriodic();
  await fetchHasilSimulasi();
  await fetchAsumsiParameterData();
  await fetchListTahunAsumsi();
  await fetchDataTeknisData();
  await fetchDataFinansialData();
  await fetchComboBahanBakar();
  isLoading.value = false;
});
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