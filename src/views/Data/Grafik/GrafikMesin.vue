<template>
  <Loading v-if="isLoading" />
  <div v-if="stored.currentTabMesin === 'WLC (Realisasi & Proyeksi)'">
    <div class="flex justify-between">
      <div>
        <h1 class="px-6 pt-4 text-lg font-bold">
          Grafik WLC (Realisasi & Proyeksi)
        </h1>
      </div>
      <div class="flex px-6 pt-2">
        <!-- <div v-if="tabGraphic === 'Semua'" class="flex flex-row items-center space-x-3">
          <label class="text-sm font-semibold text-labelColor" for="">Periode</label>
          <VueDatePicker v-if="periodeTahun" class="date-picker" :model-value="yearRangePicked" @update:model-value="handleYearRangeWlcAll" :year-range="yearRange" :clearable="false" year-picker range />
        </div>
        <div v-else-if="tabGraphic === 'Biaya Komponen'" class="flex flex-row items-center space-x-3">
          <label class="text-sm font-semibold text-labelColor" for="">Periode</label>
          <VueDatePicker v-if="periodeTahun" class="date-picker" :model-value="yearRangePicked" @update:model-value="handleYearRangeWlcKom" :year-range="yearRange" :clearable="false" year-picker range />
        </div> -->
        <RouterLink :to="{ name: 'detail-rekap', params: { id: props.idMesin } }">
          <button type="button"
            class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                fill="#0099AD" />
            </svg>
            <p class="ml-2">Lihat Data</p>
          </button>
        </RouterLink>
      </div>
    </div>
    <div class="sticky top-0 z-10">
      <!--TABS2-->
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
        <li class="ml-10">
          <button @click="changeTab(1)" class="inline-flex pb-2 text-sm" :class="[
            tabGraphic === 'Semua'
              ? 'font-semibold text-black'
              : 'font-normal',
          ]">
            Semua
          </button>
          <div v-if="tabGraphic === 'Semua'" class="w-full h-1.5 bg-[#0099ad]"></div>
          <div v-else></div>
        </li>
        <li class="ml-5">
          <button @click="changeTab(2)" class="inline-flex pb-2 text-sm" :class="[
            tabGraphic === 'Biaya Komponen'
              ? 'font-semibold text-black'
              : 'font-normal',
          ]">
            Biaya Komponen
          </button>
          <div v-if="tabGraphic === 'Biaya Komponen'" class="w-full h-1.5 bg-[#0099ad]"></div>
          <div v-else></div>
        </li>
      </ul>
    </div>
    <div v-if="tabGraphic === 'Semua'">
      <div v-if="dataWLCAllMesin === null">
        <Empty />
      </div>
      <div v-else>
        <vue-echarts :option="chartWLCAllMesin" style="height: 450px" @click="handleClickWlcAll" />
        <Legend />
      </div>
    </div>
    <div v-else-if="tabGraphic === 'Biaya Komponen'">
      <div v-if="dataWLCKomMesin === null">
        <Empty />
      </div>
      <div v-else>
        <vue-echarts :option="chartWLCKomMesin" style="height: 450px" @click="handleClickWlcKom" />
        <Legend />
      </div>
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning / FS'">
    <div class="flex justify-between">
      <div>
        <h1 class="px-6 pt-4 text-lg font-bold">Planning / FS</h1>
      </div>
      <div class="px-6 pt-3">
        <RouterLink :to="{ name: 'detail-rekap', params: { id: props.idMesin } }">
          <button type="button"
            class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                fill="#0099AD" />
            </svg>
            <p class="ml-2">Lihat Data</p>
          </button>
        </RouterLink>
      </div>
    </div>
    <div v-if="dataPlanMesin === null">
      <Empty />
    </div>
    <div v-else>
      <vue-echarts :option="chartPlanningMesin" style="height: 450px" @click="handleClickPlan" />
      <Legend />
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning & Realisasi + Proyeksi'">
    <div class="flex justify-between">
      <div>
        <h1 class="px-6 pt-4 text-lg font-bold">
          Planning & Realisasi + Proyeksi
        </h1>
      </div>
      <div class="px-6 pt-3">
        <RouterLink :to="{ name: 'detail-rekap', params: { id: props.idMesin } }">
          <button type="button"
            class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                fill="#0099AD" />
            </svg>
            <p class="ml-2">Lihat Data</p>
          </button>
        </RouterLink>
      </div>
    </div>
    <div v-if="dataPRPMesin === null || dataPRPPlanMesin === null">
      <Empty />
    </div>
    <div v-else>
      <vue-echarts :option="chartPRPMesin" style="height: 450px" @click="handleClickPRP" />
      <Legend />
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning vs Realisasi s/d Tahun Berjalan'
    ">
    <div class="flex justify-between">
      <div>
        <h1 class="px-6 pt-4 text-lg font-bold">
          Planning vs Realisasi s/d Tahun Berjalan
        </h1>
      </div>
      <div class="px-6 pt-3">
        <RouterLink :to="{ name: 'detail-rekap', params: { id: props.idMesin } }">
          <button type="button"
            class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                fill="#0099AD" />
            </svg>
            <p class="ml-2">Lihat Data</p>
          </button>
        </RouterLink>
      </div>
    </div>
    <div v-if="dataPRPLastYearMesin === null || dataPRPLastYearPlanMesin === null">
      <Empty />
    </div>
    <div v-else>
      <vue-echarts :option="chartLastYearMesin" style="height: 450px" @click="handleClickLastY" />
      <Legend />
    </div>
  </div>

  <!-- Modal -->
  <ModalWrapper :showModal="showModalWlcAll" :width="'w-[1000px]'" :height="'h-auto'">
    <div class="flex justify-between text-gray-950 ">
      <div>
        <p class="px-2 text-lg font-semibold">
          Detail Perkembangan Unit Pertahun
        </p>
        <div class="flex p-2">
          <p class="mr-2">Periode Laporan</p>
          <p class="text-[#0099AD]">
            {{ tahunDetail }}
          </p>
        </div>
      </div>
      <div class="cursor-pointer" @click="showModalWlcAll = false">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_12526_72925)">
            <path d="M18 6L6 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 6L18 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_12526_72925">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
    <div>
      <vue-echarts :option="chartDetailWLCAllMesin" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <!-- <th class="px-2 py-2"></th> -->
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatableWlcAllMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9] cursor-pointer">
              <!-- <td scope="row" class="px-2 py-2 font-medium whitespace-nowrap">
                <div class="bg-[#F7F7F7] rounded-md flex justify-center py-1.5">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.44194 5.00444C4.19786 5.24852 3.80214 5.24852 3.55806 5.00444L0.433058 1.87944C0.18898 1.63536 0.18898 1.23964 0.433058 0.995558C0.677136 0.751481 1.07286 0.751481 1.31694 0.995558L4 3.67862L6.68306 0.995558C6.92714 0.751481 7.32286 0.751481 7.56694 0.995558C7.81102 1.23964 7.81102 1.63536 7.56694 1.87944L4.44194 5.00444Z" fill="#333333"/>
                  </svg>
                </div>
              </td> -->
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.planning) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ModalWrapper>

  <ModalWrapper :showModal="showModalWlcKom" :width="'w-[700px]'" :height="'h-auto'">
    <div class="flex justify-between text-gray-950">
      <div>
        <p class="px-2 text-lg font-semibold">
          Detail Perkembangan Unit Pertahun
        </p>
        <div class="flex p-2">
          <p class="mr-2">Periode Laporan</p>
          <p class="text-[#0099AD]">
            {{ tahunDetail }}
          </p>
        </div>
      </div>
      <div class="cursor-pointer" @click="showModalWlcKom = false">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_12526_72925)">
            <path d="M18 6L6 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 6L18 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_12526_72925">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
    <div>
      <vue-echarts :option="chartDetailWLCKomMesin" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatableWlcKomMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9] cursor-pointer">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.planning) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ModalWrapper>

  <ModalWrapper :showModal="showModalPlan" :width="'w-[1000px]'" :height="'h-auto'">
    <div class="flex justify-between text-gray-950">
      <div>
        <p class="px-2 text-lg font-semibold">
          Detail Perkembangan Unit Pertahun
        </p>
        <div class="flex p-2">
          <p class="mr-2">Periode Laporan</p>
          <p class="text-[#0099AD]">
            {{ tahunDetail }}
          </p>
        </div>
      </div>
      <div class="cursor-pointer" @click="showModalPlan = false">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_12526_72925)">
            <path d="M18 6L6 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 6L18 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_12526_72925">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
    <div>
      <vue-echarts :option="chartDetailPlanMesin" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatablePlanMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9] cursor-pointer">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.planning) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ModalWrapper>

  <ModalWrapper :showModal="showModalPRP" :width="'w-[1000px]'" :height="'h-auto'">
    <div class="flex justify-between text-gray-950">
      <div>
        <p class="px-2 text-lg font-semibold">
          Detail Perkembangan Unit Pertahun
        </p>
        <div class="flex p-2">
          <p class="mr-2">Periode Laporan</p>
          <p class="text-[#0099AD]">
            {{ tahunDetail }}
          </p>
        </div>
      </div>
      <div class="cursor-pointer" @click="showModalPRP = false">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_12526_72925)">
            <path d="M18 6L6 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 6L18 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_12526_72925">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
    <div>
      <vue-echarts :option="chartDetailPRPMesin" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatablePRPMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9] cursor-pointer">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.planning) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ModalWrapper>

  <ModalWrapper :showModal="showModalLastY" :width="'w-[1000px]'" :height="'h-auto'">
    <div class="flex justify-between text-gray-950">
      <div>
        <p class="px-2 text-lg font-semibold">
          Detail Perkembangan Unit Pertahun
        </p>
        <div class="flex p-2">
          <p class="mr-2">Periode Laporan</p>
          <p class="text-[#0099AD]">
            {{ tahunDetail }}
          </p>
        </div>
      </div>
      <div class="cursor-pointer" @click="showModalLastY = false">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <g clip-path="url(#clip0_12526_72925)">
            <path d="M18 6L6 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 6L18 18" stroke="#7F7F80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_12526_72925">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
    <div>
      <vue-echarts :option="chartDetailLastYMesin" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatableLastYMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9] cursor-pointer">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.planning) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue";
import AOS from 'aos'
import { VueEcharts } from "vue3-echarts";
import { useTagMesin } from "@/store/storeTagGrafik";
import '@vuepic/vue-datepicker/dist/main.css';
import Legend from "@/components/Grafik/LegendGrafik.vue";
import GrafikService from "@/services/grafik-service";
import GlobalFormat from "@/services/format/global-format";
import Empty from "@/components/ui/EmptyData.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import Loading from '@/components/ui/LoadingSpinner.vue'
// import { useLamanDataPeriodeStore } from "@/store/storeLamanDataTab";
// import Modal from "@/components/Grafik/ModalGrafik.vue";
// import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
// const store = useLamanDataPeriodeStore();

const stored = useTagMesin();
const grafikService = new GrafikService();
const globalFormat = new GlobalFormat();

const dataWLCAllMesin = ref<Grafik1[]>([]);
const dataWLCKomMesin = ref<Grafik2[]>([]);
const dataPlanMesin = ref<Grafik1[]>([]);
const dataPRPMesin = ref<Grafik1[]>([]);
const dataPRPPlanMesin = ref<Grafik1[]>([]);
const dataPRPLastYearMesin = ref<Grafik1[]>([]);
const dataPRPLastYearPlanMesin = ref<Grafik1[]>([]);
const dataDetailWlcAllMesin = ref<Grafik1[]>([]);
const datatableWlcAllMesin = ref<table[]>([]);
const dataDetailWlcKomMesin = ref<Grafik1[]>([]);
const datatableWlcKomMesin = ref<table[]>([]);
const dataDetailPlanMesin = ref<Grafik1[]>([]);
const datatablePlanMesin = ref<table[]>([]);
const dataDetailPRPMesin = ref<Grafik1[]>([]);
const datatablePRPMesin = ref<table[]>([]);
const dataDetailLastYMesin = ref<Grafik1[]>([]);
const datatableLastYMesin = ref<table[]>([]);
const showModalWlcAll = ref(false);
const showModalWlcKom = ref(false);
const showModalPlan = ref(false);
const showModalPRP = ref(false);
const showModalLastY = ref(false);

const isLoading = ref(false);
const props = defineProps<Mesin>();
const tahunData = computed(() => props.tahunData);
const tabGraphic = ref("Semua");

// const tahunDari = ref<any>();
// const tahunSampai = ref<any>();
// const yearRangePicked = ref<number[]>([]);
// const yearRange = ref<number[]>([]);
// const periodeTahun = ref<any[]>([]);

interface Mesin {
  idMesin: any;
  tahunData: number;
}

interface Grafik1 {
  tahun: number;
  revenue_annualized: number;
  total_wlcc: number;
  capex_annualized: number;
  cost_component_bd: number;
  cost_component_c_annualized: number;
  optimum_life_fs: number;
  bep_fs: number;
  total_revenue: number;
  revenue_komp_bd: number;
}

interface Grafik2 {
  tahun: number;
  is_history: number;
  revenue_komp_a: number;
  revenue_komp_b: number;
  revenue_komp_c: number;
  revenue_komp_d: number;
}

interface table {
  name: string;
  realisasi: number;
  planning: number;
}

// chart WlC All Mesin
let chartWLCAllMesin = ref();
let updateWLCAllMesin = ref(true);
let tahunWLCAllMesin = ref<any>([]);
let revWLCMesin = ref<any>([]);
let sumLccWLCMesin = ref<any>([]);
let capexWLCMesin = ref<any>([]);
let comBDWLCMesin = ref<any>([]);
let fuelComWLCMesin = ref<any>([]);
let yAxisWlc = ref<any>([]);
let maxWlc = ref<any>([]);

let chartDetailWLCAllMesin = ref();
let updateDetailWLCAllMesin = ref(true);
let judulDetWlcAll = ref<any>([]);
let realDetWlcAll = ref<any>([]);
let planDetWlcAll = ref<any>([]);

// chart WLC Komponen Mesin
let chartWLCKomMesin = ref();
let updateWLCKomMesin = ref(true);
let tahunWLCKomMesin = ref<any>([]);
let costCompAMesin = ref<any>([]);
let costCompCMesin = ref<any>([]);
let costCompBDMesin = ref<any>([]);
let sumCostCompMesin = ref<any>([]);

let chartDetailWLCKomMesin = ref();
let updateDetailWLCKomMesin = ref(true);
let judulDetWlcKom = ref<any>([]);
let realDetWlcKom = ref<any>([]);
let planDetWlcKom = ref<any>([]);

// chart Planning
let chartPlanningMesin = ref();
let updatePlanningMesin = ref(true);
let tahunPlanningMesin = ref<any>([]);
let capexPlanMesin = ref<any>([]);
let comBDPlanMesin = ref<any>([]);
let fuelComPlanMesin = ref<any>([]);
let revPlanMesin = ref<any>([]);
let sumLccPlanMesin = ref<any>([]);
let yAxisPlan = ref<any>([]);
let maxPlan = ref<any>([]);

let chartDetailPlanMesin = ref();
let updateDetailPlanMesin = ref(true);
let judulDetPlan = ref<any>([]);
let realDetPlan = ref<any>([]);
let planDetPlan = ref<any>([]);

// chart Planning Realisasi Proyeksi
let chartPRPMesin = ref();
let updatePRPMesin = ref(true);
let tahunPRPMesin = ref<any>([]);
let capexPRPMesin = ref<any>([]);
let comBDPRPMesin = ref<any>([]);
let fuelComPRPMesin = ref<any>([]);
let sumRevPRPMesin = ref<any>([]);
let revPRPMesin = ref<any>([]);
let sumLccPRPMesin = ref<any>([]);
let revAPRPMesin = ref<any>([]);
let revBPRPMesin = ref<any>([]);
let revCPRPMesin = ref<any>([]);
let revDPRPMesin = ref<any>([]);
let yAxisPRP = ref<any>([]);
let maxPRP = ref<any>([]);

let tahunPRPPlan = ref<any>([]);
let capexPRPPlanMesin = ref<any>([]);
let comBDPRPPlanMesin = ref<any>([]);
let fuelComPRPPlanMesin = ref<any>([]);
let revPRPPlanMesin = ref<any>([]);
let sumLccPRPPlanMesin = ref<any>([]);
let sumRevPRPPlanMesin = ref<any>([]);
let revAPRPPlanMesin = ref<any>([]);
let revBPRPPlanMesin = ref<any>([]);
let revCPRPPlanMesin = ref<any>([]);
let revDPRPPlanMesin = ref<any>([]);
let yAxisPRPPlan = ref<any>([]);
let maxPRPPlan = ref<any>([]);

let chartDetailPRPMesin = ref();
let updateDetailPRPMesin = ref(true);
let judulDetPRP = ref<any>([]);
let realDetPRP = ref<any>([]);
let planDetPRP = ref<any>([]);

// chart Last Year
let chartLastYearMesin = ref();
let updateLastYearMesin = ref(true);
let tahunLastYearMesin = ref<any>([]);
let capexLastYearMesin = ref<any>([]);
let comBDLastYearMesin = ref<any>([]);
let fuelComLastYearMesin = ref<any>([]);
let sumRevLastYearMesin = ref<any>([]);
let revLastYearMesin = ref<any>([]);
let sumLccLastYearMesin = ref<any>([]);
let revALastYearMesin = ref<any>([]);
let revBLastYearMesin = ref<any>([]);
let revCLastYearMesin = ref<any>([]);
let revDLastYearMesin = ref<any>([]);
let yAxisLastYear = ref<any>([]);
let maxLastYear = ref<any>([]);

let tahunLastYearPlanMesin = ref<any>([]);
let capexLastYearPlanMesin = ref<any>([]);
let comBDLastYearPlanMesin = ref<any>([]);
let fuelComLastYearPlanMesin = ref<any>([]);
let revLastYearPlanMesin = ref<any>([]);
let sumLccLastYearPlanMesin = ref<any>([]);
let sumRevLastYearPlanMesin = ref<any>([]);
let revALastYearPlanMesin = ref<any>([]);
let revBLastYearPlanMesin = ref<any>([]);
let revCLastYearPlanMesin = ref<any>([]);
let revDLastYearPlanMesin = ref<any>([]);
let yAxisLastYearPlan = ref<any>([]);
let maxLastYearPlan = ref<any>([]);

let chartDetailLastYMesin = ref();
let updateDetailLastYMesin = ref(true);
let judulDetLastY = ref<any>([]);
let realDetLastY = ref<any>([]);
let planDetLastY = ref<any>([]);

let forceRender = async () => {
  updateWLCAllMesin.value = false;
  await nextTick();
  updateWLCAllMesin.value = true;
};

let forceRender1 = async () => {
  updateWLCKomMesin.value = false;
  await nextTick();
  updateWLCKomMesin.value = true;
};

let forceRender2 = async () => {
  updatePlanningMesin.value = false;
  await nextTick();
  updatePlanningMesin.value = true;
};

let forceRender3 = async () => {
  updatePRPMesin.value = false;
  await nextTick();
  updatePRPMesin.value = true;
};

let forceRender4 = async () => {
  updateLastYearMesin.value = false;
  await nextTick();
  updateLastYearMesin.value = true;
};

let forceRender5 = async () => {
  updateDetailWLCAllMesin.value = false;
  await nextTick();
  updateDetailWLCAllMesin.value = true;
};

let forceRender6 = async () => {
  updateDetailWLCKomMesin.value = false;
  await nextTick();
  updateDetailWLCKomMesin.value = true;
};

let forceRender7 = async () => {
  updateDetailPlanMesin.value = false;
  await nextTick();
  updateDetailPlanMesin.value = true;
};

let forceRender8 = async () => {
  updateDetailPRPMesin.value = false;
  await nextTick();
  updateDetailPRPMesin.value = true;
};

let forceRender9 = async () => {
  updateDetailLastYMesin.value = false;
  await nextTick();
  updateDetailLastYMesin.value = true;
};

// const fetchPeriodeTahun = async () => {
//   try {
//     const response: any = await grafikService.getRangeYearMesin({
//       id_mesin: props.idMesin,
//     });
//     periodeTahun.value = response.data;
//     tahunDari.value = periodeTahun.value[0].tahun;
//     tahunSampai.value = periodeTahun.value[periodeTahun.value.length - 1].tahun;
//     yearRangePicked.value = [tahunDari.value, tahunSampai.value];
//     yearRange.value = [tahunDari.value, tahunSampai.value];
//     store.periodeTahun = [tahunDari.value, tahunSampai.value];
//   } catch (error) {
//     console.error('Fetch Tahun Grafik Mesin Error : ' + error);
//   }
// }

function changeTab(tabs: number) {
  if (tabs === 1) {
    tabGraphic.value = "Semua";
  } else if (tabs === 2) {
    tabGraphic.value = "Biaya Komponen";
  }
}

onMounted(async () => {
  AOS.init();
  // await fetchPeriodeTahun();
});

let tahunDetail = ref("");

function handleClickWlcAll(param: any) {
  showModalWlcAll.value = true;
  tahunDetail.value = tahunWLCAllMesin.value[param.dataIndex];
  console.log(tahunDetail.value);

    grafikService
      .getGrafikWLCALLDetailMesin({
        id_mesin: props.idMesin,
        tahun_realisasi: tahunData.value.toString(),
        tahun: tahunWLCAllMesin.value[param.dataIndex],
      })
      .then((res: any) => {
        judulDetWlcAll.value = [];
        realDetWlcAll.value = [];
        planDetWlcAll.value = [];

        dataDetailWlcAllMesin.value = res.data.graph;
        datatableWlcAllMesin.value = res.data.table;
        res.data.graph.sort((a :any, b: any) => a.nomor - b.nomor);
        res.data.table.sort((a :any, b: any) => a.nomor - b.nomor);

        for (var i = 0; i < res.data.graph.length; i++) {
          judulDetWlcAll.value.push(res.data.graph[i].judul);
          realDetWlcAll.value.push(res.data.graph[i].realisasi);
          planDetWlcAll.value.push(res.data.graph[i].planning);
        }
        chartDetailWLCAllMesin.value = {
          title: {
            show: false,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            bottom: "bottom",
            data: ["Realisasi + Proyeksi", "Planning"],
          },
          grid: {
            top: "3%",
            left: "2%",
            right: "2%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: judulDetWlcAll,
              axisLabel: {
                fontSize: 10,
                rotate: 25
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "Triliun Rupiah",
              nameLocation: "center",
              nameTextStyle: {
                align: "left",
                padding: [30, 20, 20, -25],
                fontSize: 14,
                color: "#4D5E80",
                fontWeight: "bold",
              },
              axisLabel: {
                fontSize: 10,
                formatter: function (value: any) {
                  return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
                },
              },
            },
          ],
          series: [
            {
              name: "Planning",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: planDetWlcAll,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Realisasi + Proyeksi",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: realDetWlcAll,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
          ],
          color: ["#0D5A71", "#97E4FF"],
        };
        forceRender5();
      });
}

function handleClickWlcKom(param: any) {
  showModalWlcKom.value = true;
  tahunDetail.value = tahunWLCKomMesin.value[param.dataIndex];
  // console.log(tahunDetail.value);

    grafikService
      .getGrafikWLCKomDetailMesin({
        id_mesin: props.idMesin,
        tahun_realisasi: tahunData.value.toString(),
        tahun: tahunWLCKomMesin.value[param.dataIndex],
      })
      .then((res: any) => {
        judulDetWlcKom.value = [];
        realDetWlcKom.value = [];
        planDetWlcKom.value = [];

        dataDetailWlcKomMesin.value = res.data.graph;
        datatableWlcKomMesin.value = res.data.table;
        res.data.graph.sort((a :any, b: any) => a.nomor - b.nomor);
        res.data.table.sort((a :any, b: any) => a.nomor - b.nomor);

        for (var i = 0; i < res.data.graph.length; i++) {
          judulDetWlcKom.value.push(res.data.graph[i].judul);
          realDetWlcKom.value.push(res.data.graph[i].realisasi);
          planDetWlcKom.value.push(res.data.graph[i].planning);
        }

        chartDetailWLCKomMesin.value = {
          title: {
            show: false,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            bottom: "bottom",
            data: ["Realisasi + Proyeksi", "Planning"],
          },
          grid: {
            top: "3%",
            left: "2%",
            right: "2%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: judulDetWlcKom,
              axisLabel: {
                fontSize: 10,
                rotate: 10
              },
            },
          ],
          yAxis: [
              {
                type: "value",
                name: "Triliun Rupiah",
                nameLocation: "center",
                nameTextStyle: {
                  align: "left",
                  padding: [30, 20, 20, -25],
                  fontSize: 14,
                  color: "#4D5E80",
                  fontWeight: "bold",
                },
                axisLabel: {
                  fontSize: 10,
                  formatter: function (value: any) {
                    return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
                  },
                },
              },
          ],
          series: [
            {
              name: "Planning",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: planDetWlcKom,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Realisasi + Proyeksi",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: realDetWlcKom,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
          ],
          color: ["#0D5A71", "#97E4FF"],
        };
        forceRender6();
      });
}

function handleClickPlan(param: any) {
  showModalPlan.value = true;
  tahunDetail.value = tahunPlanningMesin.value[param.dataIndex];
  // console.log(tahunDetail.value);

    grafikService
      .getGrafikPlanDetailMesin({
        id_mesin: props.idMesin,
        tahun_realisasi: tahunData.value.toString(),
        tahun: tahunPlanningMesin.value[param.dataIndex],
      })
      .then((res: any) => {
        judulDetPlan.value = [];
        realDetPlan.value = [];
        planDetPlan.value = [];

        dataDetailPlanMesin.value = res.data.graph;
        datatablePlanMesin.value = res.data.table;
        res.data.graph.sort((a :any, b: any) => a.nomor - b.nomor);
        res.data.table.sort((a :any, b: any) => a.nomor - b.nomor);

        for (var i = 0; i < res.data.graph.length; i++) {
          judulDetPlan.value.push(res.data.graph[i].judul);
          realDetPlan.value.push(res.data.graph[i].realisasi);
          planDetPlan.value.push(res.data.graph[i].planning);
        }

        chartDetailPlanMesin.value = {
          title: {
            show: false,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            bottom: "bottom",
            data: ["Realisasi + Proyeksi", "Planning"],
          },
          grid: {
            top: "3%",
            left: "2%",
            right: "2%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: judulDetPlan,
              axisLabel: {
                fontSize: 10,
                rotate: 25
              },
            },
          ],
          yAxis: [
              {
                type: "value",
                name: "Triliun Rupiah",
                nameLocation: "center",
                nameTextStyle: {
                  align: "left",
                  padding: [30, 20, 20, -25],
                  fontSize: 14,
                  color: "#4D5E80",
                  fontWeight: "bold",
                },
                axisLabel: {
                  fontSize: 10,
                  formatter: function (value: any) {
                    return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
                  },
                },
              },
          ],
          series: [
            {
              name: "Planning",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: planDetPlan,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Realisasi + Proyeksi",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: realDetPlan,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
          ],
          color: ["#0D5A71", "#97E4FF"],
        };
        forceRender7();
      });
}

function handleClickPRP(param: any) {
  showModalPRP.value = true;
  tahunDetail.value = tahunPRPMesin.value[param.dataIndex];
  // console.log(tahunDetail.value);

    grafikService
      .getGrafikPRPDetailMesin({
        id_mesin: props.idMesin,
        tahun_realisasi: tahunData.value.toString(),
        tahun: tahunPRPMesin.value[param.dataIndex],
      })
      .then((res: any) => {
        judulDetPRP.value = [];
        realDetPRP.value = [];
        planDetPRP.value = [];

        dataDetailPRPMesin.value = res.data.graph;
        datatablePRPMesin.value = res.data.table;
        res.data.graph.sort((a :any, b: any) => a.nomor - b.nomor);
        res.data.table.sort((a :any, b: any) => a.nomor - b.nomor);

        for (var i = 0; i < res.data.graph.length; i++) {
          judulDetPRP.value.push(res.data.graph[i].judul);
          realDetPRP.value.push(res.data.graph[i].realisasi);
          planDetPRP.value.push(res.data.graph[i].planning);
        }

        chartDetailPRPMesin.value = {
          title: {
            show: false,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            bottom: "bottom",
            data: ["Realisasi + Proyeksi", "Planning"],
          },
          grid: {
            top: "3%",
            left: "2%",
            right: "2%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: judulDetPRP,
              axisLabel: {
                fontSize: 10,
                rotate: 25
              },
            },
          ],
          yAxis: [
              {
                type: "value",
                name: "Triliun Rupiah",
                nameLocation: "center",
                nameTextStyle: {
                  align: "left",
                  padding: [30, 20, 20, -25],
                  fontSize: 14,
                  color: "#4D5E80",
                  fontWeight: "bold",
                },
                axisLabel: {
                  fontSize: 10,
                  formatter: function (value: any) {
                    return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
                  },
                },
              },
          ],
          series: [
            {
              name: "Planning",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: planDetPRP,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Realisasi + Proyeksi",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: realDetPRP,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
          ],
          color: ["#0D5A71", "#97E4FF"],
        };
        forceRender8();
      });
}

function handleClickLastY(param: any) {
  showModalLastY.value = true;
  tahunDetail.value = tahunLastYearMesin.value[param.dataIndex];
  // console.log(tahunDetail.value);

    grafikService
      .getGrafikPRPLastYearDetailMesin({
        id_mesin: props.idMesin,
        tahun_realisasi: tahunData.value.toString(),
        tahun: tahunLastYearMesin.value[param.dataIndex],
      })
      .then((res: any) => {
        judulDetLastY.value = [];
        realDetLastY.value = [];
        planDetLastY.value = [];

        dataDetailLastYMesin.value = res.data.graph;
        datatableLastYMesin.value = res.data.table;
        res.data.graph.sort((a :any, b: any) => a.nomor - b.nomor);
        res.data.table.sort((a :any, b: any) => a.nomor - b.nomor);

        for (var i = 0; i < res.data.graph.length; i++) {
          judulDetLastY.value.push(res.data.graph[i].judul);
          realDetLastY.value.push(res.data.graph[i].realisasi);
          planDetLastY.value.push(res.data.graph[i].planning);
        }

        chartDetailLastYMesin.value = {
          title: {
            show: false,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            bottom: "bottom",
            data: ["Realisasi + Proyeksi", "Planning"],
          },
          grid: {
            top: "3%",
            left: "2%",
            right: "2%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: judulDetLastY,
              axisLabel: {
                fontSize: 10,
                rotate: 25
              },
            },
          ],
          yAxis: [
              {
                type: "value",
                name: "Triliun Rupiah",
                nameLocation: "center",
                nameTextStyle: {
                  align: "left",
                  padding: [30, 20, 20, -25],
                  fontSize: 14,
                  color: "#4D5E80",
                  fontWeight: "bold",
                },
                axisLabel: {
                  fontSize: 10,
                  formatter: function (value: any) {
                    return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
                  },
                },
              },
          ],
          series: [
            {
              name: "Planning",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: planDetLastY,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Realisasi + Proyeksi",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: realDetLastY,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
          ],
          color: ["#0D5A71", "#97E4FF"],
        };
        forceRender9();
      });
}

watch(tahunData, (tahun) => {
  isLoading.value = true;
  grafikService
    .getGrafikWLCALLMesin({
      id_mesin: props.idMesin,
      start_year: '',
      end_year: '',
      tahun_realisasi: tahun
    })
    .then((res: any) => {
      let indexTerdekat;
      let tahunBEP;
      let indexBEP;
      let indexOpt;
      let indexOptimum;
      let tahunOptimum;
      let selisih = Infinity;
      let selisihOpt = Infinity;

      dataWLCAllMesin.value = res.data;

      tahunWLCAllMesin.value = [];
      revWLCMesin.value = [];
      sumLccWLCMesin.value = [];
      capexWLCMesin.value = [];
      comBDWLCMesin.value = [];
      fuelComWLCMesin.value = [];
      yAxisWlc.value = [];

      if (res.data != null) {
        for (var i = 0; i < res.data.length; i++) {
          tahunWLCAllMesin.value.push(res.data[i].tahun);
          revWLCMesin.value.push(res.data[i].revenue_annualized);
          sumLccWLCMesin.value.push(res.data[i].total_wlcc_annualized);
          capexWLCMesin.value.push(res.data[i].capex_annualized);
          comBDWLCMesin.value.push(res.data[i].cost_component_bd);
          fuelComWLCMesin.value.push(res.data[i].cost_component_c_annualized);
          yAxisWlc.value.push(res.data[i].capex_annualized + res.data[i].cost_component_bd + res.data[i].cost_component_c_annualized);
          maxWlc.value = Math.max.apply(Math, yAxisWlc.value);

          const difference = Math.abs(res.data[i].total_wlcc_annualized - res.data[i].revenue_annualized);
          if (difference < selisih) {
            indexTerdekat = i;
            indexBEP = i + 1;
            selisih = difference;
            tahunBEP = res.data[i].tahun
          }

          const diffOpt = Math.min.apply(Math, sumLccWLCMesin.value)
          if (diffOpt < selisihOpt) {
            indexOptimum = i;
            indexOpt = i + 1;
            selisihOpt = diffOpt;
            tahunOptimum = res.data[i].tahun
          }
        }
      } else {
        dataWLCAllMesin == null;
      }

      chartWLCAllMesin.value = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          bottom: "bottom",
          data: [
            "Revenue Annualized",
            "Total LCC Annualized",
            "Cost Component A (Capex) Annualized",
            "Cost Component B + D Annualized",
            "Cost Component C Annualized",
          ],
        },
        grid: {
          top: "3%",
          left: "2%",
          right: "2%",
          bottom: "8%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunWLCAllMesin,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = tahun.toString();
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value === filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 15, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Revenue Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revWLCMesin,
            color: "#0099AD",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Total LCC Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumLccWLCMesin,
            color: "#1E1F4E",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component A (Capex) Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: capexWLCMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [80, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Max', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: maxWlc },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'BEP',
                    xAxis: indexTerdekat
                  },
                  {
                    xAxis: indexTerdekat
                  }
                ],
              ]
            },
            color: "#0D5A71",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B + D Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comBDWLCMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [85, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: maxWlc },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'Optimum Life',
                    xAxis: indexOptimum
                  },
                  {
                    xAxis: indexOptimum
                  }
                ],
              ]
            },
            color: "#37B1D5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component C Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: fuelComWLCMesin,
            color: "#CCF2FF",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
      };
      forceRender();
    });

  grafikService
    .getGrafikWLCKomMesin({
      id_mesin: props.idMesin,
      start_year: '',
      end_year: '',
      tahun_realisasi: tahun
    })
    .then((res: any) => {
      dataWLCKomMesin.value = res.data;

      tahunWLCKomMesin.value = [];
      costCompAMesin.value = [];
      costCompCMesin.value = [];
      costCompBDMesin.value = [];
      sumCostCompMesin.value = [];

      if (res.data != null) {
        for (var i = 0; i < res.data.length; i++) {
          tahunWLCKomMesin.value.push(res.data[i].tahun);
          costCompAMesin.value.push(res.data[i].cost_komp_a);
          costCompCMesin.value.push(res.data[i].cost_komp_c);
          costCompBDMesin.value.push(res.data[i].cost_komp_bd);
          sumCostCompMesin.value.push(
            res.data[i].cost_komp_a +
            res.data[i].cost_komp_b +
            res.data[i].cost_komp_c +
            res.data[i].cost_komp_d
          );
        }
      } else {
        dataWLCKomMesin == null;
      }

      chartWLCKomMesin.value = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          bottom: "bottom",
          padding: 0,
          data: ["Total Cost", "Cost Component A", "Cost Component B + D", "Cost Component C"],
        },
        grid: {
          top: "3%",
          left: "2%",
          right: "2%",
          bottom: "8%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunWLCKomMesin,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = tahun.toString();
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value === filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 15, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Cost Component A",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: costCompAMesin,
            color: "#068D9D",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B + D",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: costCompBDMesin,
            color: "#6D9DC5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component C",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: costCompCMesin,
            color: "#CCF2FF",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Total Cost",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumCostCompMesin,
            color: "#53599A",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
      };
      forceRender1();
    });

  grafikService
    .getGrafikPlanMesin({
      id_mesin: props.idMesin,
      tahun_realisasi: tahun
    })
    .then((res: any) => {

      let indexTerdekat;
      let tahunBEP;
      let indexBEP;
      let indexOpt;
      let indexOptimum;
      let tahunOptimum;
      let selisih = Infinity;
      let selisihOpt = Infinity;

      dataPlanMesin.value = res.data;

      tahunPlanningMesin.value = [];
      capexPlanMesin.value = [];
      comBDPlanMesin.value = [];
      fuelComPlanMesin.value = [];
      revPlanMesin.value = [];
      sumLccPlanMesin.value = [];
      yAxisPlan.value = [];

      if (res.data != null) {
        for (var i = 0; i < res.data.length; i++) {
          tahunPlanningMesin.value.push(res.data[i].tahun);
          capexPlanMesin.value.push(res.data[i].capex_annualized);
          comBDPlanMesin.value.push(res.data[i].cost_component_bd);
          revPlanMesin.value.push(res.data[i].revenue_annualized);
          fuelComPlanMesin.value.push(res.data[i].cost_component_c_annualized);
          sumLccPlanMesin.value.push(res.data[i].total_wlcc);
          yAxisPlan.value.push(res.data[i].capex_annualized + res.data[i].cost_component_bd + res.data[i].cost_component_c_annualized);
          maxPlan.value = Math.max.apply(Math, yAxisPlan.value);

          const difference = Math.abs(res.data[i].total_wlcc - res.data[i].revenue_annualized);
          if (difference < selisih) {
            indexTerdekat = i;
            indexBEP = i + 1;
            selisih = difference;
            tahunBEP = res.data[i].tahun
          }

          const diffOpt = Math.min.apply(Math, sumLccPlanMesin.value)
          if (diffOpt < selisihOpt) {
            indexOptimum = i;
            indexOpt = i + 1;
            selisihOpt = diffOpt;
            tahunOptimum = res.data[i].tahun
          }
        }
      } else {
        dataPlanMesin == null;
      }

      chartPlanningMesin.value = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          bottom: "bottom",
          data: [
            "FS: Revenue Annualized",
            "FS: Total LCC",
            "FS: Cost Component A (Capex) Annualized",
            "FS: Cost Component B + D Annualized",
            "FS: Cost Component C Annualized",
          ],
        },
        grid:
        {
          top: "3%",
          left: "2%",
          right: "2%",
          bottom: "8%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunPlanningMesin,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = tahun.toString();
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value === filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 15, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "FS: Cost Component A (Capex) Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: capexPlanMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [90, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Max', value: `BEP FS : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: maxPlan },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'BEP FS',
                    xAxis: indexTerdekat
                  },
                  {
                    xAxis: indexTerdekat
                  }
                ],
              ]
            },
            color: "#0D5A71",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component B + D Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comBDPlanMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [95, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life FS : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: maxPlan },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'Optimum Life FS',
                    xAxis: indexOptimum
                  },
                  {
                    xAxis: indexOptimum
                  }
                ],
              ]
            },
            color: "#37B1D5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component C Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: fuelComPlanMesin,
            color: "#CCF2FF",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revPlanMesin,
            color: "#0099AD",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Total LCC",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumLccPlanMesin,
            color: "#1E1F4E",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
      };
      forceRender2();
    });

  grafikService
    .getGrafikPRPMesin({
      id_mesin: props.idMesin,
      tahun_realisasi: tahun
    })
    .then((res: any) => {

      let indexTerdekat;
      let tahunBEP;
      let indexBEP;
      let indexOpt;
      let indexOptimum;
      let tahunOptimum;
      let indexTerdekatPlan;
      let tahunBEPPlan;
      let indexBEPPlan;
      let indexOptPlan;
      let indexOptimumPlan;
      let tahunOptimumPlan;
      let selisih = Infinity;
      let selisihOpt = Infinity;
      let selisihPlan = Infinity;
      let selisihOptPlan = Infinity;

      dataPRPMesin.value = res.data[0].realisasi_proyeksi;

      tahunPRPMesin.value = [];
      capexPRPMesin.value = []
      comBDPRPMesin.value = [];
      fuelComPRPMesin.value = [];
      sumRevPRPMesin.value = [];
      revPRPMesin.value = [];
      sumLccPRPMesin.value = [];
      revAPRPMesin.value = [];
      revBPRPMesin.value = [];
      revCPRPMesin.value = [];
      revDPRPMesin.value = [];
      yAxisPRP.value = [];

      if (res.data[0].realisasi_proyeksi != null) {
        for (var i = 0; i < res.data[0].realisasi_proyeksi.length; i++) {
          tahunPRPMesin.value.push(res.data[0].realisasi_proyeksi[i].tahun);
          capexPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].capex_annualized
          );
          comBDPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].cost_component_bd
          );
          fuelComPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].cost_component_c_annualized
          );
          sumRevPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].total_revenue
          );
          revPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_annualized
          );
          sumLccPRPMesin.value.push(res.data[0].realisasi_proyeksi[i].total_wlcc);
          revAPRPMesin.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_a);
          revBPRPMesin.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_b);
          revCPRPMesin.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_c);
          revDPRPMesin.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_d);
          yAxisPRP.value.push(res.data[0].realisasi_proyeksi[i].capex_annualized + res.data[0].realisasi_proyeksi[i].cost_component_bd + res.data[0].realisasi_proyeksi[i].cost_component_c_annualized);
          maxPRP.value = Math.max.apply(Math, yAxisPRP.value);

          const difference = Math.abs(res.data[0].realisasi_proyeksi[i].total_wlcc - res.data[0].realisasi_proyeksi[i].revenue_annualized);
          if (difference < selisih) {
            indexTerdekat = i;
            indexBEP = i + 1;
            selisih = difference;
            tahunBEP = res.data[0].realisasi_proyeksi[i].tahun
          }

          const diffOpt = Math.min.apply(Math, sumLccPRPMesin.value)
          if (diffOpt < selisihOpt) {
            indexOptimum = i;
            indexOpt = i + 1;
            selisihOpt = diffOpt;
            tahunOptimum = res.data[0].realisasi_proyeksi[i].tahun
          }
        }
      } else {
        dataPRPMesin == null;
      }

      dataPRPPlanMesin.value = res.data[0].planning;

      tahunPRPPlan.value = [];
      capexPRPPlanMesin.value = []
      comBDPRPPlanMesin.value = [];
      fuelComPRPPlanMesin.value = [];
      sumRevPRPPlanMesin.value = [];
      revPRPPlanMesin.value = [];
      sumLccPRPPlanMesin.value = [];
      revAPRPPlanMesin.value = [];
      revBPRPPlanMesin.value = [];
      revCPRPPlanMesin.value = [];
      revDPRPPlanMesin.value = [];
      yAxisPRPPlan.value = [];

      if (res.data[0].planning != null) {
        for (var j = 0; j < res.data[0].planning.length; j++) {
          tahunPRPPlan.value.push(res.data[0].planning[j].tahun);
          capexPRPPlanMesin.value.push(res.data[0].planning[j].capex_annualized);
          comBDPRPPlanMesin.value.push(res.data[0].planning[j].cost_component_bd);
          fuelComPRPPlanMesin.value.push(
            res.data[0].planning[j].cost_component_c_annualized
          );
          revPRPPlanMesin.value.push(res.data[0].planning[j].revenue_annualized);
          sumLccPRPPlanMesin.value.push(res.data[0].planning[j].total_wlcc);
          sumRevPRPPlanMesin.value.push(res.data[0].planning[j].total_revenue);
          revAPRPPlanMesin.value.push(res.data[0].planning[j].revenue_komp_a);
          revBPRPPlanMesin.value.push(res.data[0].planning[j].revenue_komp_b);
          revCPRPPlanMesin.value.push(res.data[0].planning[j].revenue_komp_c);
          revDPRPPlanMesin.value.push(res.data[0].planning[j].revenue_komp_d);
          yAxisPRPPlan.value.push(res.data[0].planning[j].capex_annualized + res.data[0].planning[j].cost_component_bd + res.data[0].planning[j].cost_component_c_annualized);
          maxPRPPlan.value = Math.max.apply(Math, yAxisPRPPlan.value);

          const difference = Math.abs(res.data[0].planning[j].total_wlcc - res.data[0].planning[j].revenue_annualized);
          if (difference < selisihPlan) {
            indexTerdekatPlan = j;
            indexBEPPlan = j + 1;
            selisihPlan = difference;
            tahunBEPPlan = res.data[0].planning[j].tahun
          }

          const diffOptPlan = Math.min.apply(Math, sumLccPRPPlanMesin.value)
          if (diffOptPlan < selisihOptPlan) {
            indexOptimumPlan = j;
            indexOptPlan = j + 1;
            selisihOptPlan = diffOptPlan;
            tahunOptimumPlan = res.data[0].planning[j].tahun
          }
        }
      } else {
        dataPRPPlanMesin == null;
      }

      chartPRPMesin.value = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          bottom: "bottom",
          data: [
            "Revenue Annualized",
            "Total LCC",
            "Cost Component A (Capex) Annualized",
            "Cost Component B + D Annualized",
            "Cost Component C Annualized",
            "FS: Revenue Annualized",
            "FS: Total LCC",
            "FS: Cost Component A (Capex) Annualized",
            "FS: Cost Component B + D Annualized",
            "FS: Cost Component C Annualized",
            "Total Revenue",
            "Revenue A",
            "Revenue B",
            "Revenue C",
            "Revenue D",
            "FS: Total Revenue",
            "FS: Revenue A",
            "FS: Revenue B",
            "FS: Revenue C",
            "FS: Revenue D",
          ],
          selected: {
            "Revenue A": false,
            "Revenue B": false,
            "Revenue C": false,
            "Revenue D": false,
            "Total Revenue": false,
            "FS: Revenue A": false,
            "FS: Revenue B": false,
            "FS: Revenue C": false,
            "FS: Revenue D": false,
            "FS: Total Revenue": false,
          }
        },
        grid: {
          top: "3%",
          left: "2%",
          right: "2%",
          bottom: "18%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunPRPMesin,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = tahun.toString();
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value === filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 15, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Revenue Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revPRPMesin,
            zlevel: 1,
            color: "#489FB7",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Total LCC",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumLccPRPMesin,
            zlevel: 1,
            color: "#1E1F4E",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component A (Capex) Annualized",
            type: "bar",
            stack: "Ad",
            zlevel: 2,
            emphasis: {
              focus: "series",
            },
            data: capexPRPMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [80, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Max', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: maxPRP },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'BEP',
                    xAxis: indexTerdekat
                  },
                  {
                    xAxis: indexTerdekat
                  }
                ],
              ]
            },
            color: "#A8E2FC",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B + D Annualized",
            type: "bar",
            stack: "Ad",
            zlevel: 2,
            emphasis: {
              focus: "series",
            },
            data: comBDPRPMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [85, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: maxPRP },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'Optimum Life',
                    xAxis: indexOptimum
                  },
                  {
                    xAxis: indexOptimum
                  }
                ],
              ]
            },
            color: "#212E7C",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component C Annualized",
            type: "bar",
            stack: "Ad",
            zlevel: 2,
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
            },
            data: fuelComPRPMesin,
            color: "#4EB180",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Total Revenue",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumRevPRPMesin,
            color: "#5F6F52",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue A",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revAPRPMesin,
            color: "#191919",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue B",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revBPRPMesin,
            color: "#750E21",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue C",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revCPRPMesin,
            color: "#E3651D",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue D",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revDPRPMesin,
            color: "#BED754",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            lineStyle: {
              type: "dashed",
            },
            data: revPRPPlanMesin,
            color: "#A6A6A6",
            zlevel: 1,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Total LCC",
            type: "line",
            smooth: true,
            showSymbol: false,
            lineStyle: {
              type: "dashed",
            },
            data: sumLccPRPPlanMesin,
            color: "#7A7A7A",
            zlevel: 1,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component A (Capex) Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: capexPRPPlanMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [90, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Max', value: `BEP FS : ${tahunBEPPlan} (${indexBEPPlan})`, xAxis: indexTerdekatPlan, yAxis: maxPRPPlan },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'BEP FS',
                    xAxis: indexTerdekatPlan
                  },
                  {
                    xAxis: indexTerdekatPlan
                  }
                ],
              ]
            },
            color: "#DDDDDD",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component B + D Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: comBDPRPPlanMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [95, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life FS : \n ${tahunOptimumPlan} (${indexOptPlan})`, xAxis: indexOptimumPlan, yAxis: maxPRPPlan },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'Optimum Life FS',
                    xAxis: indexOptimumPlan
                  },
                  {
                    xAxis: indexOptimumPlan
                  }
                ],
              ]
            },
            color: "#BFBFBF",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component C Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
            },
            data: fuelComPRPPlanMesin,
            color: "#7C7C7C",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Total Revenue",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumRevPRPPlanMesin,
            color: "#3C0753",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue A",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revAPRPPlanMesin,
            color: "#761A1A",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue B",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revBPRPPlanMesin,
            color: "#C13131",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue C",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revCPRPPlanMesin,
            color: "#A7CD78",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue D",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revDPRPPlanMesin,
            color: "#FFF279",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
      };
      forceRender3();
    });

  grafikService
    .getGrafikPRPLastYearMesin({
      id_mesin: props.idMesin,
      tahun_realisasi: tahun
    })
    .then((res: any) => {

      let indexTerdekat;
      let tahunBEP;
      let indexBEP;
      let indexOpt;
      let indexOptimum;
      let tahunOptimum;
      let indexTerdekatPlan;
      let tahunBEPPlan;
      let indexBEPPlan;
      let indexOptPlan;
      let indexOptimumPlan;
      let tahunOptimumPlan;
      let selisih = Infinity;
      let selisihOpt = Infinity;
      let selisihPlan = Infinity;
      let selisihOptPlan = Infinity;

      dataPRPLastYearMesin.value = res.data[0].realisasi_proyeksi;

      tahunLastYearMesin.value = [];
      capexLastYearMesin.value = []
      comBDLastYearMesin.value = [];
      fuelComLastYearMesin.value = [];
      sumRevLastYearMesin.value = [];
      revLastYearMesin.value = [];
      sumLccLastYearMesin.value = [];
      revALastYearMesin.value = [];
      revBLastYearMesin.value = [];
      revCLastYearMesin.value = [];
      revDLastYearMesin.value = [];
      yAxisLastYear.value = [];

      if (res.data[0].realisasi_proyeksi != null) {
        for (var i = 0; i < res.data[0].realisasi_proyeksi.length; i++) {
          tahunLastYearMesin.value.push(res.data[0].realisasi_proyeksi[i].tahun);
          capexLastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].capex_annualized
          );
          comBDLastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].cost_component_bd
          );
          fuelComLastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].cost_component_c_annualized
          );
          sumRevLastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].total_revenue
          );
          revLastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_annualized
          );
          sumLccLastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].total_wlcc
          );
          revALastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_a
          );
          revBLastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_b
          );
          revCLastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_c
          );
          revDLastYearMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_d
          );
          yAxisLastYear.value.push(res.data[0].realisasi_proyeksi[i].capex_annualized + res.data[0].realisasi_proyeksi[i].cost_component_bd + res.data[0].realisasi_proyeksi[i].cost_component_c_annualized);
          maxLastYear.value = Math.max.apply(Math, yAxisLastYear.value);

          const difference = Math.abs(res.data[0].realisasi_proyeksi[i].total_wlcc - res.data[0].realisasi_proyeksi[i].revenue_annualized);
          if (difference < selisih) {
            indexTerdekat = i;
            indexBEP = i + 1;
            selisih = difference;
            tahunBEP = res.data[0].realisasi_proyeksi[i].tahun
          }

          const diffOpt = Math.min.apply(Math, sumLccLastYearMesin.value)
          if (diffOpt < selisihOpt) {
            indexOptimum = i;
            indexOpt = i + 1;
            selisihOpt = diffOpt;
            tahunOptimum = res.data[0].realisasi_proyeksi[i].tahun
          }
        }
      } else {
        dataPRPLastYearMesin == null;
      }

      dataPRPLastYearPlanMesin.value = res.data[0].planning;

      tahunLastYearPlanMesin.value = [];
      capexLastYearPlanMesin.value = []
      comBDLastYearPlanMesin.value = [];
      fuelComLastYearPlanMesin.value = [];
      sumRevLastYearPlanMesin.value = [];
      revLastYearPlanMesin.value = [];
      sumLccLastYearPlanMesin.value = [];
      revALastYearPlanMesin.value = [];
      revBLastYearPlanMesin.value = [];
      revCLastYearPlanMesin.value = [];
      revDLastYearPlanMesin.value = [];
      yAxisLastYearPlan.value = [];

      if (res.data[0].planning != null) {
        for (var j = 0; j < res.data[0].planning.length; j++) {
          tahunLastYearPlanMesin.value.push(
            res.data[0].planning[j].tahun
          );
          capexLastYearPlanMesin.value.push(
            res.data[0].planning[j].capex_annualized
          );
          comBDLastYearPlanMesin.value.push(
            res.data[0].planning[j].cost_component_bd
          );
          fuelComLastYearPlanMesin.value.push(
            res.data[0].planning[j].cost_component_c_annualized
          );
          revLastYearPlanMesin.value.push(
            res.data[0].planning[j].revenue_annualized
          );
          sumLccLastYearPlanMesin.value.push(res.data[0].planning[j].total_wlcc);
          sumRevLastYearPlanMesin.value.push(
            res.data[0].planning[j].total_revenue
          );
          revALastYearPlanMesin.value.push(
            res.data[0].planning[j].revenue_komp_a
          );
          revBLastYearPlanMesin.value.push(
            res.data[0].planning[j].revenue_komp_b
          );
          revCLastYearPlanMesin.value.push(
            res.data[0].planning[j].revenue_komp_c
          );
          revDLastYearPlanMesin.value.push(
            res.data[0].planning[j].revenue_komp_d
          );
          yAxisLastYearPlan.value.push(res.data[0].planning[j].capex_annualized + res.data[0].planning[j].cost_component_bd + res.data[0].planning[j].cost_component_c_annualized);
          maxLastYearPlan.value = Math.max.apply(Math, yAxisLastYearPlan.value);

          const difference = Math.abs(res.data[0].planning[j].total_wlcc - res.data[0].planning[j].revenue_annualized);
          if (difference < selisihPlan) {
            indexTerdekatPlan = j;
            indexBEPPlan = j + 1;
            selisihPlan = difference;
            tahunBEPPlan = res.data[0].planning[j].tahun
          }

          const diffOptPlan = Math.min.apply(Math, sumLccLastYearPlanMesin.value)
          if (diffOptPlan < selisihOptPlan) {
            indexOptimumPlan = j;
            indexOptPlan = j + 1;
            selisihOptPlan = diffOptPlan;
            tahunOptimumPlan = res.data[0].planning[j].tahun
          }
        }
      } else {
        dataPRPLastYearPlanMesin == null;
      }

      chartLastYearMesin.value = {
        title: {
          show: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          bottom: "bottom",
          data: [
            "Revenue Annualized",
            "Total LCC",
            "Cost Component A (Capex) Annualized",
            "Cost Component B + D Annualized",
            "Cost Component C Annualized",
            "FS: Revenue Annualized",
            "FS: Total LCC",
            "FS: Cost Component A (Capex) Annualized",
            "FS: Cost Component B + D Annualized",
            "FS: Cost Component C Annualized",
            "Total Revenue",
            "Revenue A",
            "Revenue B",
            "Revenue C",
            "Revenue D",
            "FS: Total Revenue",
            "FS: Revenue A",
            "FS: Revenue B",
            "FS: Revenue C",
            "FS: Revenue D",
          ],
          selected: {
            "Revenue A": false,
            "Revenue B": false,
            "Revenue C": false,
            "Revenue D": false,
            "Total Revenue": false,
            "FS: Revenue A": false,
            "FS: Revenue B": false,
            "FS: Revenue C": false,
            "FS: Revenue D": false,
            "FS: Total Revenue": false,
          }
        },
        grid: {
          top: "3%",
          left: "2%",
          right: "2%",
          bottom: "18%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunLastYearMesin,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = tahun.toString();
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value === filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
            }
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 15, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Revenue Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revLastYearMesin,
            zlevel: 1,
            color: "#489FB7",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Total LCC",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumLccLastYearMesin,
            zlevel: 1,
            color: "#1E1F4E",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component A (Capex) Annualized",
            type: "bar",
            stack: "Ad",
            zlevel: 2,
            emphasis: {
              focus: "series",
            },
            data: capexLastYearMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [80, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Max', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: maxLastYear },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'BEP',
                    xAxis: indexTerdekat
                  },
                  {
                    xAxis: indexTerdekat
                  }
                ],
              ]
            },
            color: "#A8E2FC",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B + D Annualized",
            type: "bar",
            stack: "Ad",
            zlevel: 2,
            emphasis: {
              focus: "series",
            },
            data: comBDLastYearMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [85, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: maxLastYear },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'Optimum Life',
                    xAxis: indexOptimum
                  },
                  {
                    xAxis: indexOptimum
                  }
                ],
              ]
            },
            color: "#212E7C",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component C Annualized",
            type: "bar",
            stack: "Ad",
            zlevel: 2,
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
            },
            data: fuelComLastYearMesin,
            color: "#4EB180",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Total Revenue",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumRevLastYearMesin,
            color: "#5F6F52",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue A",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revALastYearMesin,
            color: "#191919",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue B",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revBLastYearMesin,
            color: "#750E21",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue C",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revCLastYearMesin,
            color: "#E3651D",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue D",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revDLastYearMesin,
            color: "#BED754",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            lineStyle: {
              type: "dashed",
            },
            data: revLastYearPlanMesin,
            color: "#A6A6A6",
            zlevel: 1,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Total LCC",
            type: "line",
            smooth: true,
            showSymbol: false,
            lineStyle: {
              type: "dashed",
            },
            data: sumLccLastYearPlanMesin,
            color: "#7A7A7A",
            zlevel: 1,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component A (Capex) Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: capexLastYearPlanMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [90, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Max', value: `BEP FS: ${tahunBEPPlan} (${indexBEPPlan})`, xAxis: indexTerdekatPlan, yAxis: maxLastYearPlan },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'BEP FS',
                    xAxis: indexTerdekatPlan
                  },
                  {
                    xAxis: indexTerdekatPlan
                  }
                ],
              ]
            },
            color: "#DDDDDD",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component B + D Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: comBDLastYearPlanMesin,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [95, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life FS: \n ${tahunOptimumPlan} (${indexOptPlan})`, xAxis: indexOptimumPlan, yAxis: maxLastYearPlan },
              ]
            },
            markArea: {
              silent: true,
              itemStyle: {
                color: '#E2EAF2'
              },
              label: { show: false },
              data: [
                [
                  {
                    name: 'Optimum Life FS',
                    xAxis: indexOptimumPlan
                  },
                  {
                    xAxis: indexOptimumPlan
                  }
                ],
              ]
            },
            color: "#BFBFBF",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component C Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
            },
            data: fuelComLastYearPlanMesin,
            color: "#7C7C7C",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Total Revenue",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: sumRevLastYearPlanMesin,
            color: "#3C0753",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue A",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revALastYearPlanMesin,
            color: "#761A1A",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue B",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revBLastYearPlanMesin,
            color: "#C13131",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue C",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revCLastYearPlanMesin,
            color: "#A7CD78",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Revenue D",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revDLastYearPlanMesin,
            color: "#FFF279",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
      };
      forceRender4();
    });

  isLoading.value = false;
})


// const handleYearRangeWlcAll = async (modelData: Array<number>) => {
  //   yearRangePicked.value = modelData;
  //   store.periodeTahun = modelData;
  
  //   isLoading.value = true;
  //   await grafikService
  //     .getGrafikWLCALLMesin({
  //       id_mesin: props.idMesin,
  //       start_year: modelData[0],
  //       end_year: modelData[1],
  //       tahun_realisasi: tahunData.value
  //     })
  //     .then((res: any) => {
  //       let indexTerdekat;
  //       let tahunBEP;
  //       let indexBEP;
  //       let indexOpt;
  //       let indexOptimum;
  //       let tahunOptimum;
  //       let selisih = Infinity;
  //       let selisihOpt = Infinity;
  
  //       dataWLCAllMesin.value = res.data;
  
  //       tahunWLCAllMesin.value = [];
  //       revWLCMesin.value = [];
  //       sumLccWLCMesin.value = [];
  //       capexWLCMesin.value = [];
  //       comBDWLCMesin.value = [];
  //       fuelComWLCMesin.value = [];
  //       yAxisWlc.value = [];
  
  //       for (var i = 0; i < res.data.length; i++) {
  //         tahunWLCAllMesin.value.push(res.data[i].tahun);
  //         revWLCMesin.value.push(res.data[i].revenue_annualized);
  //         sumLccWLCMesin.value.push(res.data[i].total_wlcc);
  //         capexWLCMesin.value.push(res.data[i].capex_annualized);
  //         comBDWLCMesin.value.push(res.data[i].cost_component_bd);
  //         fuelComWLCMesin.value.push(res.data[i].cost_component_c_annualized);
  //         yAxisWlc.value.push(res.data[i].capex_annualized + res.data[i].cost_component_bd + res.data[i].cost_component_c_annualized);
  //         maxWlc.value = Math.max.apply(Math, yAxisWlc.value);
  
  //         const difference = Math.abs(res.data[i].total_wlcc - res.data[i].revenue_annualized);
  //         if (difference < selisih) {
  //           indexTerdekat = i;
  //           indexBEP = i + 1;
  //           selisih = difference;
  //           tahunBEP = res.data[i].tahun
  //         }
  
  //         const diffOpt = Math.min.apply(Math, sumLccWLCMesin.value)
  //         if (diffOpt < selisihOpt) {
  //           indexOptimum = i;
  //           indexOpt = i + 1;
  //           selisihOpt = diffOpt;
  //           tahunOptimum = res.data[i].tahun
  //         }
  //       }
  
  //       chartWLCAllMesin.value = {
  //         title: {
  //           show: false,
  //         },
  //         tooltip: {
  //           trigger: "axis",
  //           axisPointer: {
  //             type: "shadow",
  //           },
  //         },
  //         legend: {
  //           bottom: "bottom",
  //           data: [
  //             "Revenue Annualized",
  //             "Total LCC",
  //             "Cost Component A (Capex) Annualized",
  //             "Cost Component B + D Annualized",
  //             "Cost Component C Annualized",
  //           ],
  //         },
  //         grid: {
  //           top: "3%",
  //           left: "2%",
  //           right: "2%",
  //           bottom: "8%",
  //           containLabel: true,
  //         },
  //         xAxis: [
  //           {
  //             type: "category",
  //             data: tahunWLCAllMesin,
  //             axisLabel: {
  //               fontSize: 10,
  //               color: function (value: any, index: number) {
  //                 const filterTahun = tahunData.value;
  //                 if (value < filterTahun) {
  //                   return '#FF5656';
  //                 } else if (value === filterTahun) {
  //                   return '#6C6C6C';
  //                 } else if (value > filterTahun) {
  //                   return '#37B1D5';
  //                 }
  //               },
  //               formatter: function (value: any, index: number) {
  //                 return index + 1 + `\n${value}`;
  //               },
  //             }
  //           },
  //         ],
  //         yAxis: [
  //           {
  //             type: "value",
  //             name: "Triliun Rupiah",
  //             nameLocation: "center",
  //             nameTextStyle: {
  //               align: "left",
  //               padding: [30, 20, 15, -25],
  //               fontSize: 14,
  //               color: "#4D5E80",
  //               fontWeight: "bold",
  //             },
  //             axisLabel: {
  //               fontSize: 10,
  //               formatter: function (value: any) {
  //                 return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
  //               },
  //             },
  //           },
  //         ],
  //         series: [
  //           {
  //             name: "Revenue Annualized",
  //             type: "line",
  //             smooth: true,
  //             showSymbol: false,
  //             data: revWLCMesin,
  //             color: "#0099AD",
  //             tooltip: {
  //               valueFormatter: (value: any) =>
  //                 globalFormat.formatRupiah(value) + " Rp(Juta)",
  //             },
  //           },
  //           {
  //             name: "Total LCC",
  //             type: "line",
  //             smooth: true,
  //             showSymbol: false,
  //             data: sumLccWLCMesin,
  //             color: "#1E1F4E",
  //             tooltip: {
  //               valueFormatter: (value: any) =>
  //                 globalFormat.formatRupiah(value) + " Rp(Juta)",
  //             },
  //           },
  //           {
  //             name: "Cost Component A (Capex) Annualized",
  //             type: "bar",
  //             stack: "Ad",
  //             emphasis: {
  //               focus: "series",
  //             },
  //             data: capexWLCMesin,
  //             markPoint: {
  //               silent: true,
  //               symbol: 'rect',
  //               symbolSize: [80, 30],
  //               itemStyle: { color: '#0D5A71' },
  //               label: { fontSize: 10, fontWeight: 'bold'},
  //               data: [
  //                 { name: 'Max', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: maxWlc },
  //               ]
  //             },
  //             markArea: {
  //               silent: true,
  //               itemStyle: {
  //                 color: '#E2EAF2'
  //               },
  //               label: { show: false },
  //               data: [
  //                 [
  //                   {
  //                     name: 'BEP',
  //                     xAxis: indexTerdekat
  //                   },
  //                   {
  //                     xAxis: indexTerdekat
  //                   }
  //                 ],
  //               ]
  //             },
  //             color: "#0D5A71",
  //             tooltip: {
  //               valueFormatter: (value: any) =>
  //                 globalFormat.formatRupiah(value) + " Rp(Juta)",
  //             },
  //           },
  //           {
  //             name: "Cost Component B + D Annualized",
  //             type: "bar",
  //             stack: "Ad",
  //             emphasis: {
  //               focus: "series",
  //             },
  //             data: comBDWLCMesin,
  //             markPoint: {
  //               silent: true,
  //               symbol: 'rect',
  //               symbolSize: [85, 30],
  //               itemStyle: { color: '#0D5A71' },
  //               label: { fontSize: 10, fontWeight: 'bold'},
  //               data: [
  //                 { name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: maxWlc },
  //               ]
  //             },
  //             markArea: {
  //               silent: true,
  //               itemStyle: {
  //                 color: '#E2EAF2'
  //               },
  //               label: { show: false },
  //               data: [
  //                 [
  //                   {
  //                     name: 'Optimum Life',
  //                     xAxis: indexOptimum
  //                   },
  //                   {
  //                     xAxis: indexOptimum
  //                   }
  //                 ],
  //               ]
  //             },
  //             color: "#37B1D5",
  //             tooltip: {
  //               valueFormatter: (value: any) =>
  //                 globalFormat.formatRupiah(value) + " Rp(Juta)",
  //             },
  //           },
  //           {
  //             name: "Cost Component C Annualized",
  //             type: "bar",
  //             stack: "Ad",
  //             emphasis: {
  //               focus: "series",
  //             },
  //             itemStyle: {
  //               borderRadius: [5, 5, 0, 0],
  //             },
  //             data: fuelComWLCMesin,
  //             color: "#CCF2FF",
  //             tooltip: {
  //               valueFormatter: (value: any) =>
  //                 globalFormat.formatRupiah(value) + " Rp(Juta)",
  //             },
  //           },
  //         ],
  //       };
  //       forceRender();
  //     });
  //   isLoading.value = false;
  
  // }
  
  // const handleYearRangeWlcKom = async (modelData: Array<number>) => {
  //   yearRangePicked.value = modelData;
  //   store.periodeTahun = modelData;
  
  //   isLoading.value = true;
  //   await grafikService
  //     .getGrafikWLCKomMesin({
  //       id_mesin: props.idMesin,
  //       start_year: modelData[0],
  //       end_year: modelData[1],
  //       tahun_realisasi: tahunData.value
  //     })
  //     .then((res: any) => {
  //       dataWLCKomMesin.value = res.data;
  
  //       tahunWLCKomMesin.value = [];
  //       costCompAMesin.value = [];
  //       costCompCMesin.value = [];
  //       costCompBDMesin.value = [];
  //       sumCostCompMesin.value = [];
  
  //       for (var i = 0; i < res.data.length; i++) {
  //         tahunWLCKomMesin.value.push(res.data[i].tahun);
  //         costCompAMesin.value.push(res.data[i].cost_komp_a);
  //         costCompCMesin.value.push(res.data[i].cost_komp_c);
  //         costCompBDMesin.value.push(res.data[i].cost_komp_bd);
  //         sumCostCompMesin.value.push(
  //           res.data[i].cost_komp_a +
  //           res.data[i].cost_komp_b +
  //           res.data[i].cost_komp_c +
  //           res.data[i].cost_komp_d
  //         );
  //       }
  
  //       chartWLCKomMesin.value = {
  //         title: {
  //           show: false,
  //         },
  //         tooltip: {
  //           trigger: "axis",
  //           axisPointer: {
  //             type: "shadow",
  //           },
  //         },
  //         legend: {
  //           bottom: "bottom",
  //           padding: 0,
  //           data: ["Total Cost", "Komponen A", "Komponen B + D", "Komponen C"],
  //         },
  //         grid: {
  //           top: "3%",
  //           left: "2%",
  //           right: "2%",
  //           bottom: "8%",
  //           containLabel: true,
  //         },
  //         xAxis: [
  //           {
  //             type: "category",
  //             data: tahunWLCKomMesin,
  //             axisLabel: {
  //               fontSize: 10,
  //               color: function (value: any, index: number) {
  //                 const filterTahun = tahunData.value;
  //                 if (value < filterTahun) {
  //                   return '#FF5656';
  //                 } else if (value === filterTahun) {
  //                   return '#6C6C6C';
  //                 } else if (value > filterTahun) {
  //                   return '#37B1D5';
  //                 }
  //               },
  //               formatter: function (value: any, index: number) {
  //                 return index + 1 + `\n${value}`;
  //               },
  //             }
  //           },
  //         ],
  //         yAxis: [
  //           {
  //             type: "value",
  //             name: "Triliun Rupiah",
  //             nameLocation: "center",
  //             nameTextStyle: {
  //               align: "left",
  //               padding: [30, 20, 15, -25],
  //               fontSize: 14,
  //               color: "#4D5E80",
  //               fontWeight: "bold",
  //             },
  //             axisLabel: {
  //               fontSize: 10,
  //               formatter: function (value: any) {
  //                 return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
  //               },
  //             },
  //           },
  //         ],
  //         series: [
  //           {
  //             name: "Komponen A",
  //             type: "bar",
  //             stack: "Ad",
  //             emphasis: {
  //               focus: "series",
  //             },
  //             data: costCompAMesin,
  //             color: "#068D9D",
  //             tooltip: {
  //               valueFormatter: (value: any) =>
  //                 globalFormat.formatRupiah(value) + " Rp(Juta)",
  //             },
  //           },
  //           {
  //             name: "Komponen B + D",
  //             type: "bar",
  //             stack: "Ad",
  //             emphasis: {
  //               focus: "series",
  //             },
  //             data: costCompBDMesin,
  //             color: "#6D9DC5",
  //             tooltip: {
  //               valueFormatter: (value: any) =>
  //                 globalFormat.formatRupiah(value) + " Rp(Juta)",
  //             },
  //           },
  //           {
  //             name: "Komponen C",
  //             type: "bar",
  //             stack: "Ad",
  //             emphasis: {
  //               focus: "series",
  //             },
  //             itemStyle: {
  //               borderRadius: [5, 5, 0, 0],
  //             },
  //             data: costCompCMesin,
  //             color: "#CCF2FF",
  //             tooltip: {
  //               valueFormatter: (value: any) =>
  //                 globalFormat.formatRupiah(value) + " Rp(Juta)",
  //             },
  //           },
  //           {
  //             name: "Total Cost",
  //             type: "line",
  //             smooth: true,
  //             showSymbol: false,
  //             data: sumCostCompMesin,
  //             color: "#53599A",
  //             tooltip: {
  //               valueFormatter: (value: any) =>
  //                 globalFormat.formatRupiah(value) + " Rp(Juta)",
  //             },
  //           },
  //         ],
  //       };
  //       forceRender1();
  //     });
  //   isLoading.value = false;
  
  // }
</script>

<style scoped>
.date-picker {
  width: 10rem;
  --dp-border-radius: 10px;
  --dp-icon-color: #0099AD;
}
</style>