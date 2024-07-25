<template>
  <Loading v-if="isLoading" />
  <div v-if="store.currentTabSentral === 'WLC (Realisasi & Proyeksi)'">
    <div class="flex justify-between">
      <div>
        <h1 class="px-6 pt-4 text-lg font-bold">
          Grafik WLC (Realisasi & Proyeksi)
        </h1>
      </div>
      <div class="flex px-6 pt-2">
        <!-- <div v-if="tabGraphic === 'Semua'" class="flex flex-row items-center space-x-3">
          <label class="text-sm font-semibold text-labelColor" for="">Periode</label>
          <VueDatePicker v-if="periodeTahun" class="date-picker" :model-value="yearRangePicked"
            @update:model-value="handleYearRangeWlcAll" :year-range="yearRange" :clearable="false" year-picker range />
        </div>
        <div v-else-if="tabGraphic === 'Biaya Komponen'" class="flex flex-row items-center space-x-3">
          <label class="text-sm font-semibold text-labelColor" for="">Periode</label>
          <VueDatePicker v-if="periodeTahun" class="date-picker" :model-value="yearRangePicked"
            @update:model-value="handleYearRangeWlcKom" :year-range="yearRange" :clearable="false" year-picker range />
        </div> -->
        <RouterLink :to="{ name: 'detail-rekap', params: { id: props.idSentral } }">
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
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
        <li class="ml-10">
          <button @click="changeTab(1)" class="inline-flex pb-2 text-sm" :class="[
            tabGraphic === 'Semua'
              ? 'font-semibold text-primaryTextColor'
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
              ? 'font-semibold text-primaryTextColor'
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
      <div v-if="dataWLCAll === null">
        <Empty />
      </div>
      <div v-else>
        <vue-echarts :option="chartWLCAll" style="height: 450px" @click="handleClickWlcAll" />
        <Legend />
      </div>
    </div>
    <div v-else-if="tabGraphic === 'Biaya Komponen'">
      <div v-if="dataWLCKom === null">
        <Empty />
      </div>
      <div v-else>
        <vue-echarts :option="chartWLCKom" style="height: 450px" @click="handleClickWlcKom" />
        <Legend />
      </div>
    </div>
  </div>
  <div v-else-if="store.currentTabSentral === 'Planning / Feasibility Study'">
    <div class="flex justify-between">
      <div>
        <h1 class="px-6 pt-4 text-lg font-bold">Planning / Feasibility Study</h1>
      </div>
      <div class="px-6 pt-2">
        <RouterLink :to="{ name: 'feasibility-study', params: { id: props.idSentral } }">
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
    <div v-if="dataPlanning === null">
      <Empty />
    </div>
    <div v-else class="mb-5">
      <vue-echarts :option="chartPlanning" style="height: 450px" @click="handleClickPlan" />
    </div>
  </div>
  <div v-else-if="store.currentTabSentral === 'Planning & Realisasi + Proyeksi'">
    <div class="flex justify-between">
      <div>
        <h1 class="px-6 pt-4 text-lg font-bold">
          Planning & Realisasi + Proyeksi
        </h1>
      </div>
      <div class="px-6 pt-3">
        <RouterLink :to="{ name: 'detail-rekap', params: { id: props.idSentral } }">
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
    <div v-if="dataPRP === null || dataPRPPlan === null">
      <Empty />
    </div>
    <div v-else>
      <vue-echarts :option="chartPRP" style="height: 450px" @click="handleClickPRP" />
      <Legend />
    </div>
  </div>
  <div v-else-if="store.currentTabSentral === 'Planning vs Realisasi s/d Tahun Berjalan'
  ">
    <div class="flex justify-between">
      <div>
        <h1 class="px-6 pt-4 text-lg font-bold">
          Planning vs Realisasi s/d Tahun Berjalan
        </h1>
      </div>
      <div class="px-6 pt-3">
        <RouterLink :to="{ name: 'detail-rekap', params: { id: props.idSentral } }">
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
    <div v-if="dataPRPLastYear === null || dataPRPLastYearPlan === null">
      <Empty />
    </div>
    <div v-else>
      <vue-echarts :option="chartLastYear" style="height: 450px" @click="handleClickLastY" />
      <Legend />
    </div>
  </div>

  <!-- Modal -->
  <ModalWrapper :showModal="showModalWlcAll" :width="'w-[1000px]'" :height="'h-auto'">
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
      <vue-echarts :option="chartDetailWLCAll" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-2 py-2"></th>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatableWlcAll" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td scope="row" class="px-2 py-2 font-medium whitespace-nowrap">
                <div class="bg-[#F7F7F7] rounded-md flex justify-center py-1.5">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M4.44194 5.00444C4.19786 5.24852 3.80214 5.24852 3.55806 5.00444L0.433058 1.87944C0.18898 1.63536 0.18898 1.23964 0.433058 0.995558C0.677136 0.751481 1.07286 0.751481 1.31694 0.995558L4 3.67862L6.68306 0.995558C6.92714 0.751481 7.32286 0.751481 7.56694 0.995558C7.81102 1.23964 7.81102 1.63536 7.56694 1.87944L4.44194 5.00444Z"
                      fill="#333333" />
                  </svg>
                </div>
              </td>
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatRupiah(item.planning) }}</td>
            </tr>
            <!-- <tr class="text-center text-gray-900 border-b">
              <th
                scope="row"
                class="px-2 py-2 font-medium text-center whitespace-nowrap"
              ></th>
              <td class="px-8 py-2">Revenue A</td>
              <td class="px-1 py-2">3,378</td>
              <td class="px-1 py-2">-</td>
            </tr> -->
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
      <vue-echarts :option="chartDetailWLCKom" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-2 py-2"></th>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatableWlcKom" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td scope="row" class="px-2 py-2 font-medium whitespace-nowrap">
                <div class="bg-[#F7F7F7] rounded-md flex justify-center py-1.5">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M4.44194 5.00444C4.19786 5.24852 3.80214 5.24852 3.55806 5.00444L0.433058 1.87944C0.18898 1.63536 0.18898 1.23964 0.433058 0.995558C0.677136 0.751481 1.07286 0.751481 1.31694 0.995558L4 3.67862L6.68306 0.995558C6.92714 0.751481 7.32286 0.751481 7.56694 0.995558C7.81102 1.23964 7.81102 1.63536 7.56694 1.87944L4.44194 5.00444Z"
                      fill="#333333" />
                  </svg>
                </div>
              </td>
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
      <vue-echarts :option="chartDetailPlan" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-2 py-2"></th>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatablePlan" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td scope="row" class="px-2 py-2 font-medium whitespace-nowrap">
                <div class="bg-[#F7F7F7] rounded-md flex justify-center py-1.5">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M4.44194 5.00444C4.19786 5.24852 3.80214 5.24852 3.55806 5.00444L0.433058 1.87944C0.18898 1.63536 0.18898 1.23964 0.433058 0.995558C0.677136 0.751481 1.07286 0.751481 1.31694 0.995558L4 3.67862L6.68306 0.995558C6.92714 0.751481 7.32286 0.751481 7.56694 0.995558C7.81102 1.23964 7.81102 1.63536 7.56694 1.87944L4.44194 5.00444Z"
                      fill="#333333" />
                  </svg>
                </div>
              </td>
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
      <vue-echarts :option="chartDetailPRP" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-2 py-2"></th>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatablePRP" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td scope="row" class="px-2 py-2 font-medium whitespace-nowrap">
                <div class="bg-[#F7F7F7] rounded-md flex justify-center py-1.5">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M4.44194 5.00444C4.19786 5.24852 3.80214 5.24852 3.55806 5.00444L0.433058 1.87944C0.18898 1.63536 0.18898 1.23964 0.433058 0.995558C0.677136 0.751481 1.07286 0.751481 1.31694 0.995558L4 3.67862L6.68306 0.995558C6.92714 0.751481 7.32286 0.751481 7.56694 0.995558C7.81102 1.23964 7.81102 1.63536 7.56694 1.87944L4.44194 5.00444Z"
                      fill="#333333" />
                  </svg>
                </div>
              </td>
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
      <vue-echarts :option="chartDetailLastY" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-2 py-2"></th>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi - Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatableLastY" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td scope="row" class="px-2 py-2 font-medium whitespace-nowrap">
                <div class="bg-[#F7F7F7] rounded-md flex justify-center py-1.5">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M4.44194 5.00444C4.19786 5.24852 3.80214 5.24852 3.55806 5.00444L0.433058 1.87944C0.18898 1.63536 0.18898 1.23964 0.433058 0.995558C0.677136 0.751481 1.07286 0.751481 1.31694 0.995558L4 3.67862L6.68306 0.995558C6.92714 0.751481 7.32286 0.751481 7.56694 0.995558C7.81102 1.23964 7.81102 1.63536 7.56694 1.87944L4.44194 5.00444Z"
                      fill="#333333" />
                  </svg>
                </div>
              </td>
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ item.realisasi }}</td>
              <td class="px-1 py-2 text-right">{{ item.planning }}</td>
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
import { VueEcharts } from "vue3-echarts"
import { useTagSentral } from "@/store/storeTagGrafik";
import Legend from "@/components/Grafik/LegendGrafik.vue";
import GrafikService from "@/services/grafik-service";
import GlobalFormat from "@/services/format/global-format";
import Empty from "@/components/ui/EmptyData.vue";
import Loading from '@/components/ui/LoadingSpinner.vue';
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
// import { useLamanDataPeriodeStore } from "@/store/storeLamanDataTab";
// import Modal from "@/components/Grafik/ModalGrafik.vue";
// import ButtonComponent from "@/components/ui/Button.vue";
// import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
// const stored = useLamanDataPeriodeStore();

const store = useTagSentral();
const grafikService = new GrafikService();
const globalFormat = new GlobalFormat();

const dataWLCAll = ref<Grafik1[]>([]);
const dataWLCKom = ref<Grafik2[]>([]);
const dataPlanning = ref<Grafik1[]>([]);
const dataPRP = ref<Grafik1[]>([]);
const dataPRPPlan = ref<Grafik1[]>([]);
const dataPRPLastYear = ref<Grafik1[]>([]);
const dataPRPLastYearPlan = ref<Grafik1[]>([]);
const dataDetailWlcAll = ref<Grafik1[]>([]);
const datatableWlcAll = ref<table[]>([]);
const dataDetailWlcKom = ref<Grafik1[]>([]);
const datatableWlcKom = ref<table[]>([]);
const dataDetailPlan = ref<Grafik1[]>([]);
const datatablePlan = ref<table[]>([]);
const dataDetailPRP = ref<Grafik1[]>([]);
const datatablePRP = ref<table[]>([]);
const dataDetailLastY = ref<Grafik1[]>([]);
const datatableLastY = ref<table[]>([]);
const showModalWlcAll = ref(false);
const showModalWlcKom = ref(false);
const showModalPlan = ref(false);
const showModalPRP = ref(false);
const showModalLastY = ref(false);

const isLoading = ref(false);
const tabGraphic = ref("Semua");
const props = defineProps<Sentral>();
const tahunData = computed(() => props.tahunData);

// const tahunDari = ref<any>();
// const tahunSampai = ref<any>();
// const yearRangePicked = ref<number[]>([]);
// const yearRange = ref<number[]>([]);
// const periodeTahun = ref<any[]>([]);

interface Sentral {
  idSentral: any;
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

// chart WlC All
let chartWLCAll = ref();
let updateWLCAll = ref(true);
let tahunWLCAll = ref<any>([]);
let revWLC = ref<any>([]);
let sumLccWLC = ref<any>([]);
let capexWLC = ref<any>([]);
let comBDWLC = ref<any>([]);
let fuelComWLC = ref<any>([]);
let yAxisWlc = ref<any>([]);
let maxWlc = ref<any>([]);

let chartDetailWLCAll = ref();
let updateDetailWLCAll = ref(true);
let judulDetWlcAll = ref<any>([]);
let realDetWlcAll = ref<any>([]);
let planDetWlcAll = ref<any>([]);

// chart WLC Komponen
let chartWLCKom = ref();
let updateWLCKom = ref(true);
let tahunWLCKom = ref<any>([]);
let costCompA = ref<any>([]);
let costCompC = ref<any>([]);
let costCompBD = ref<any>([]);
let sumCostComp = ref<any>([]);

let chartDetailWLCKom = ref();
let updateDetailWLCKom = ref(true);
let judulDetWlcKom = ref<any>([]);
let realDetWlcKom = ref<any>([]);
let planDetWlcKom = ref<any>([]);

// chart Planning
let chartPlanning = ref();
let updatePlanning = ref(true);
let tahunPlanning = ref<any>([]);
let capexPlan = ref<any>([]);
let comBDPlan = ref<any>([]);
let fuelComPlan = ref<any>([]);
let revPlan = ref<any>([]);
let sumLccPlan = ref<any>([]);
let yAxisPlan = ref<any>([]);
let maxPlan = ref<any>([]);

let chartDetailPlan = ref();
let updateDetailPlan = ref(true);
let judulDetPlan = ref<any>([]);
let realDetPlan = ref<any>([]);
let planDetPlan = ref<any>([]);

// chart Planning Realisasi Proyeksi
let chartPRP = ref();
let updatePRP = ref(true);
let tahunPRP = ref<any>([]);
let capexPRP = ref<any>([]);
let comBDPRP = ref<any>([]);
let fuelComPRP = ref<any>([]);
let sumRevPRP = ref<any>([]);
let revPRP = ref<any>([]);
let sumLccPRP = ref<any>([]);
let revAPRP = ref<any>([]);
let revBPRP = ref<any>([]);
let revCPRP = ref<any>([]);
let revDPRP = ref<any>([]);
let yAxisPRP = ref<any>([]);
let maxPRP = ref<any>([]);

let tahunPRPPlan = ref<any>([]);
let capexPRPPlan = ref<any>([]);
let comBDPRPPlan = ref<any>([]);
let fuelComPRPPlan = ref<any>([]);
let revPRPPlan = ref<any>([]);
let sumLccPRPPlan = ref<any>([]);
let sumRevPRPPlan = ref<any>([]);
let revAPRPPlan = ref<any>([]);
let revBPRPPlan = ref<any>([]);
let revCPRPPlan = ref<any>([]);
let revDPRPPlan = ref<any>([]);
let yAxisPRPPlan = ref<any>([]);
let maxPRPPlan = ref<any>([]);

let chartDetailPRP = ref();
let updateDetailPRP = ref(true);
let judulDetPRP = ref<any>([]);
let realDetPRP = ref<any>([]);
let planDetPRP = ref<any>([]);

// chart Last Year
let chartLastYear = ref();
let updateLastYear = ref(true);
let tahunLastYear = ref<any>([]);
let capexLastYear = ref<any>([]);
let comBDLastYear = ref<any>([]);
let fuelComLastYear = ref<any>([]);
let sumRevLastYear = ref<any>([]);
let revLastYear = ref<any>([]);
let sumLccLastYear = ref<any>([]);
let revALastYear = ref<any>([]);
let revBLastYear = ref<any>([]);
let revCLastYear = ref<any>([]);
let revDLastYear = ref<any>([]);
let yAxisLastYear = ref<any>([]);
let maxLastYear = ref<any>([]);

let tahunLastYearPlan = ref<any>([]);
let capexLastYearPlan = ref<any>([]);
let comBDLastYearPlan = ref<any>([]);
let fuelComLastYearPlan = ref<any>([]);
let revLastYearPlan = ref<any>([]);
let sumLccLastYearPlan = ref<any>([]);
let sumRevLastYearPlan = ref<any>([]);
let revALastYearPlan = ref<any>([]);
let revBLastYearPlan = ref<any>([]);
let revCLastYearPlan = ref<any>([]);
let revDLastYearPlan = ref<any>([]);
let yAxisLastYearPlan = ref<any>([]);
let maxLastYearPlan = ref<any>([]);

let chartDetailLastY = ref();
let updateDetailLastY = ref(true);
let judulDetLastY = ref<any>([]);
let realDetLastY = ref<any>([]);
let planDetLastY = ref<any>([]);

let forceRender = async () => {
  updateWLCAll.value = false;
  await nextTick();
  updateWLCAll.value = true;
};

let forceRender1 = async () => {
  updateWLCKom.value = false;
  await nextTick();
  updateWLCKom.value = true;
};

let forceRender2 = async () => {
  updatePlanning.value = false;
  await nextTick();
  updatePlanning.value = true;
};

let forceRender3 = async () => {
  updatePRP.value = false;
  await nextTick();
  updatePRP.value = true;
};

let forceRender4 = async () => {
  updateLastYear.value = false;
  await nextTick();
  updateLastYear.value = true;
};

let forceRender5 = async () => {
  updateDetailWLCAll.value = false;
  await nextTick();
  updateDetailWLCAll.value = true;
};

let forceRender6 = async () => {
  updateDetailWLCKom.value = false;
  await nextTick();
  updateDetailWLCKom.value = true;
};

let forceRender7 = async () => {
  updateDetailPlan.value = false;
  await nextTick();
  updateDetailPlan.value = true;
};

let forceRender8 = async () => {
  updateDetailPRP.value = false;
  await nextTick();
  updateDetailPRP.value = true;
};

let forceRender9 = async () => {
  updateDetailLastY.value = false;
  await nextTick();
  updateDetailLastY.value = true;
};

// const fetchPeriodeTahun = async () => {
//   try {
//     const response: any = await grafikService.getRangeYearSentral({
//       id_sentral: props.idSentral,
//     });
//     periodeTahun.value = response.data;
//     tahunDari.value = periodeTahun.value[0].tahun;
//     tahunSampai.value = periodeTahun.value[periodeTahun.value.length - 1].tahun;
//     yearRangePicked.value = [tahunDari.value, tahunSampai.value];
//     yearRange.value = [tahunDari.value, tahunSampai.value];
//     stored.periodeTahun = [tahunDari.value, tahunSampai.value];
//   } catch (error) {
//     console.error('Fetch Tahun Grafik Sentral Error : ' + error);
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
  tahunDetail.value = tahunWLCAll.value[param.dataIndex];
  // console.log(param);

  grafikService
    .getGrafikWLCALLDetail({
      id_sentral: props.idSentral,
      tahun: tahunWLCAll.value[param.dataIndex],
      tahun_realisasi: tahunData.value
    })
    .then((res: any) => {
      judulDetWlcAll.value = [];
      realDetWlcAll.value = [];
      planDetWlcAll.value = [];

      dataDetailWlcAll.value = res.data.graph;
      datatableWlcAll.value = res.data.table;
      dataDetailWlcAll.value.reverse();
      datatableWlcAll.value.reverse();

      for (var i = 0; i < res.data.graph.length; i++) {
        judulDetWlcAll.value.push(res.data.graph[i].judul);
        realDetWlcAll.value.push(res.data.graph[i].realisasi);
        planDetWlcAll.value.push(res.data.graph[i].planning);
      }

      chartDetailWLCAll.value = {
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
            // label: {
            //   show: true,
            //   position: "top",
            //   fontSize: 10,
            //   formatter: function (params: any) {
            //     return globalFormat.formatEnergy(params.value / 1000) + ' k'
            //   },
            // },
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
  tahunDetail.value = tahunWLCKom.value[param.dataIndex];
  // console.log(tahunDetail.value);

  grafikService
    .getGrafikWLCKomDetail({
      id_sentral: props.idSentral,
      tahun: tahunWLCKom.value[param.dataIndex],
      tahun_realisasi: tahunData.value
    })
    .then((res: any) => {
      judulDetWlcKom.value = [];
      realDetWlcKom.value = [];
      planDetWlcKom.value = [];

      dataDetailWlcKom.value = res.data.graph;
      datatableWlcKom.value = res.data.table;
      dataDetailWlcKom.value.reverse();
      datatableWlcKom.value.reverse();

      for (var i = 0; i < res.data.graph.length; i++) {
        judulDetWlcKom.value.push(res.data.graph[i].judul);
        realDetWlcKom.value.push(res.data.graph[i].realisasi);
        planDetWlcKom.value.push(res.data.graph[i].planning);
      }

      chartDetailWLCKom.value = {
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
  tahunDetail.value = tahunPlanning.value[param.dataIndex];
  // console.log(tahunDetail.value);

  grafikService
    .getGrafikPlanDetail({
      id_sentral: props.idSentral,
      tahun: tahunPlanning.value[param.dataIndex],
      tahun_realisasi: tahunData.value
    })
    .then((res: any) => {
      judulDetPlan.value = [];
      realDetPlan.value = [];
      planDetPlan.value = [];

      dataDetailPlan.value = res.data.graph;
      datatablePlan.value = res.data.table;
      dataDetailPlan.value.reverse();
      datatablePlan.value.reverse();

      for (var i = 0; i < res.data.graph.length; i++) {
        judulDetPlan.value.push(res.data.graph[i].judul);
        realDetPlan.value.push(res.data.graph[i].realisasi);
        planDetPlan.value.push(res.data.graph[i].planning);
      }

      chartDetailPlan.value = {
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
  tahunDetail.value = tahunPRP.value[param.dataIndex];
  // console.log(tahunDetail.value);

  if (chartDetailPRP.value) {
    return null;
  } else {
    grafikService
      .getGrafikPRPDetail({
        id_sentral: props.idSentral,
        tahun: tahunPRP.value[param.dataIndex],
        tahun_realisasi: tahunData.value
      })
      .then((res: any) => {
        judulDetPRP.value = [];
        realDetPRP.value = [];
        planDetPRP.value = [];

        dataDetailPRP.value = res.data.graph;
        datatablePRP.value = res.data.table;
        dataDetailPRP.value.reverse();
        datatablePRP.value.reverse();

        for (var i = 0; i < res.data.graph.length; i++) {
          judulDetPRP.value.push(res.data.graph[i].judul);
          realDetPRP.value.push(res.data.graph[i].realisasi);
          planDetPRP.value.push(res.data.graph[i].planning);
        }

        chartDetailPRP.value = {
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
}

function handleClickLastY(param: any) {
  showModalLastY.value = true;
  tahunDetail.value = tahunLastYear.value[param.dataIndex];
  // console.log(tahunDetail.value);

  grafikService
    .getGrafikLastYearDetail({
      id_sentral: props.idSentral,
      tahun: tahunLastYear.value[param.dataIndex],
      tahun_realisasi: tahunData.value
    })
    .then((res: any) => {
      judulDetLastY.value = [];
      realDetLastY.value = [];
      planDetLastY.value = [];

      dataDetailLastY.value = res.data.graph;
      datatableLastY.value = res.data.table;
      dataDetailLastY.value.reverse();
      datatableLastY.value.reverse();

      for (var i = 0; i < res.data.graph.length; i++) {
        judulDetLastY.value.push(res.data.graph[i].judul);
        realDetLastY.value.push(res.data.graph[i].realisasi);
        planDetLastY.value.push(res.data.graph[i].planning);
      }

      chartDetailLastY.value = {
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

watch(tahunData, async (tahun) => {
  isLoading.value = true;
  await grafikService
    .getGrafikWLCALL({
      id_sentral: props.idSentral,
      start_year: '',
      end_year: '',
      tahun_realisasi: tahun,
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

      dataWLCAll.value = res.data;

      tahunWLCAll.value = [];
      revWLC.value = [];
      sumLccWLC.value = [];
      capexWLC.value = [];
      comBDWLC.value = [];
      fuelComWLC.value = [];
      yAxisWlc.value = [];

      if (res.data != null) {
        for (var i = 0; i < res.data.length; i++) {
          tahunWLCAll.value.push(res.data[i].tahun);
          revWLC.value.push(res.data[i].revenue_annualized);
          sumLccWLC.value.push(res.data[i].total_wlcc);
          capexWLC.value.push(res.data[i].capex_annualized);
          comBDWLC.value.push(res.data[i].cost_component_bd);
          fuelComWLC.value.push(res.data[i].cost_component_c_annualized);
          yAxisWlc.value.push(res.data[i].capex_annualized + res.data[i].cost_component_bd + res.data[i].cost_component_c_annualized);

          maxWlc.value = Math.max.apply(Math, yAxisWlc.value)

          const difference = Math.abs(res.data[i].total_wlcc - res.data[i].revenue_annualized);
          if (difference < selisih) {
            indexTerdekat = i;
            indexBEP = i + 1;
            selisih = difference;
            tahunBEP = res.data[i].tahun
          }
          const diffOpt = Math.min.apply(Math, sumLccWLC.value)
          if (diffOpt < selisihOpt) {
            indexOptimum = i;
            indexOpt = i + 1;
            selisihOpt = diffOpt;
            tahunOptimum = res.data[i].tahun
          }
        }
      } else {
        dataWLCAll == null;
      }

      chartWLCAll.value = {
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
            data: tahunWLCAll,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = tahun.toString();
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value == filterTahun) {
                  return '#6C6C6C';
                } else if (value > filterTahun) {
                  return '#37B1D5';
                }
              },
              formatter: function (value: any, index: number) {
                return index + 1 + `\n${value}`;
              },
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
            name: "Cost Component A (Capex) Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: capexWLC,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [80, 30],
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
            data: comBDWLC,
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
            data: fuelComWLC,
            color: "#CCF2FF",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue Annualized",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revWLC,
            color: "#0099AD",
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
            data: sumLccWLC,
            color: "#1E1F4E",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
      };
      forceRender();
    });

  await grafikService
    .getGrafikWLCKom({
      id_sentral: props.idSentral,
      start_year: '',
      end_year: '',
      tahun_realisasi: tahun,
    })
    .then((res: any) => {
      dataWLCKom.value = res.data;

      tahunWLCKom.value = [];
      costCompA.value = [];
      costCompC.value = [];
      costCompBD.value = [];
      sumCostComp.value = [];

      if (res.data != null) {
        for (var i = 0; i < res.data.length; i++) {
          tahunWLCKom.value.push(res.data[i].tahun);
          costCompA.value.push(res.data[i].cost_komp_a);
          costCompC.value.push(res.data[i].cost_komp_c);
          costCompBD.value.push(res.data[i].cost_komp_bd);
          sumCostComp.value.push(
            res.data[i].cost_komp_a +
            res.data[i].cost_komp_b +
            res.data[i].cost_komp_c +
            res.data[i].cost_komp_d
          );
        }
      } else {
        dataWLCKom == null;
      }

      chartWLCKom.value = {
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
          data: [
            "Total Cost",
            "Cost Component A",
            "Cost Component B + D",
            "Cost Component C",
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
            data: tahunWLCKom,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = tahun.toString();
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value == filterTahun) {
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
            data: costCompA,
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
            data: costCompBD,
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
            data: costCompC,
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
            data: sumCostComp,
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

  await grafikService
    .getGrafikPlan({
      id_sentral: props.idSentral,
      tahun_realisasi: tahun,
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

      dataPlanning.value = res.data;

      tahunPlanning.value = [];
      capexPlan.value = [];
      comBDPlan.value = [];
      fuelComPlan.value = [];
      revPlan.value = [];
      sumLccPlan.value = [];
      yAxisPlan.value = [];

      if (res.data != null) {
        for (var i = 0; i < res.data.length; i++) {
          tahunPlanning.value.push(res.data[i].tahun);
          capexPlan.value.push(res.data[i].capex_annualized);
          comBDPlan.value.push(res.data[i].cost_component_bd);
          fuelComPlan.value.push(res.data[i].cost_component_c_annualized);
          revPlan.value.push(res.data[i].revenue_annualized);
          sumLccPlan.value.push(res.data[i].total_wlcc);
          yAxisPlan.value.push(res.data[i].capex_annualized + res.data[i].cost_component_bd + res.data[i].cost_component_c_annualized);

          maxPlan.value = Math.max.apply(Math, yAxisPlan.value)

          const difference = Math.abs(res.data[i].total_wlcc - res.data[i].revenue_annualized);
          if (difference < selisih) {
            indexTerdekat = i;
            indexBEP = i + 1;
            selisih = difference;
            tahunBEP = res.data[i].tahun
          }

          const diffOpt = Math.min.apply(Math, sumLccPlan.value)
          if (diffOpt < selisihOpt) {
            indexOptimum = i;
            indexOpt = i + 1;
            selisihOpt = diffOpt;
            tahunOptimum = res.data[i].tahun
          }
        }
      } else {
        dataPlanning == null;
      }

      chartPlanning.value = {
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
            data: tahunPlanning,
            axisLabel: {
              fontSize: 10,
              color: '#37B1D5',
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
            data: capexPlan,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [90, 30],
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Max', value: `BEP FS: ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: maxPlan },
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
            data: comBDPlan,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [95, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life FS: \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: maxPlan },
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
            data: fuelComPlan,
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
            data: revPlan,
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
            data: sumLccPlan,
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

  await grafikService
    .getGrafikPRP({
      id_sentral: props.idSentral,
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

      dataPRP.value = res.data[0].realisasi_proyeksi;

      tahunPRP.value = [];
      capexPRP.value = []
      comBDPRP.value = [];
      fuelComPRP.value = [];
      sumRevPRP.value = [];
      revPRP.value = [];
      sumLccPRP.value = [];
      revAPRP.value = [];
      revBPRP.value = [];
      revCPRP.value = [];
      revDPRP.value = [];
      yAxisPRP.value = [];

      if (res.data[0].realisasi_proyeksi != null) {
        for (var i = 0; i < res.data[0].realisasi_proyeksi.length; i++) {
          tahunPRP.value.push(res.data[0].realisasi_proyeksi[i].tahun);
          capexPRP.value.push(res.data[0].realisasi_proyeksi[i].capex_annualized);
          comBDPRP.value.push(res.data[0].realisasi_proyeksi[i].cost_component_bd);
          fuelComPRP.value.push(
            res.data[0].realisasi_proyeksi[i].cost_component_c_annualized
          );
          sumRevPRP.value.push(res.data[0].realisasi_proyeksi[i].total_revenue);
          revPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_annualized);
          sumLccPRP.value.push(res.data[0].realisasi_proyeksi[i].total_wlcc);
          revAPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_a);
          revBPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_b);
          revCPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_c);
          revDPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_d);
          yAxisPRP.value.push(res.data[0].realisasi_proyeksi[i].capex_annualized + res.data[0].realisasi_proyeksi[i].cost_component_bd + res.data[0].realisasi_proyeksi[i].cost_component_c_annualized)
          maxPRP.value = Math.max.apply(Math, yAxisPRP.value)

          const difference = Math.abs(res.data[0].realisasi_proyeksi[i].total_wlcc - res.data[0].realisasi_proyeksi[i].revenue_annualized);
          if (difference < selisih) {
            indexTerdekat = i;
            indexBEP = i + 1;
            selisih = difference;
            tahunBEP = res.data[0].realisasi_proyeksi[i].tahun
          }

          const diffOpt = Math.min.apply(Math, sumLccPRP.value)
          if (diffOpt < selisihOpt) {
            indexOptimum = i;
            indexOpt = i + 1;
            selisihOpt = diffOpt;
            tahunOptimum = res.data[0].realisasi_proyeksi[i].tahun
          }
        }
      } else {
        dataPRP == null;
      }

      dataPRPPlan.value = res.data[0].planning;

      tahunPRPPlan.value = [];
      capexPRPPlan.value = []
      comBDPRPPlan.value = [];
      fuelComPRPPlan.value = [];
      sumRevPRPPlan.value = [];
      revPRPPlan.value = [];
      sumLccPRPPlan.value = [];
      revAPRPPlan.value = [];
      revBPRPPlan.value = [];
      revCPRPPlan.value = [];
      revDPRPPlan.value = [];
      yAxisPRPPlan.value = [];

      if (res.data[0].planning != null) {
        for (var j = 0; j < res.data[0].planning.length; j++) {
          tahunPRPPlan.value.push(res.data[0].planning[j].tahun);
          capexPRPPlan.value.push(res.data[0].planning[j].capex_annualized);
          comBDPRPPlan.value.push(res.data[0].planning[j].cost_component_bd);
          fuelComPRPPlan.value.push(res.data[0].planning[j].cost_component_c_annualized);
          revPRPPlan.value.push(res.data[0].planning[j].revenue_annualized);
          sumLccPRPPlan.value.push(res.data[0].planning[j].total_wlcc);
          sumRevPRPPlan.value.push(res.data[0].planning[j].total_revenue);
          revAPRPPlan.value.push(res.data[0].planning[j].revenue_komp_a);
          revBPRPPlan.value.push(res.data[0].planning[j].revenue_komp_b);
          revCPRPPlan.value.push(res.data[0].planning[j].revenue_komp_c);
          revDPRPPlan.value.push(res.data[0].planning[j].revenue_komp_d);
          yAxisPRPPlan.value.push(res.data[0].planning[j].capex_annualized + res.data[0].planning[j].cost_component_bd + res.data[0].planning[j].cost_component_c_annualized)
          maxPRPPlan.value = Math.max.apply(Math, yAxisPRPPlan.value)

          const difference = Math.abs(res.data[0].planning[j].total_wlcc - res.data[0].planning[j].revenue_annualized);
          if (difference < selisihPlan) {
            indexTerdekatPlan = j;
            indexBEPPlan = j + 1;
            selisihPlan = difference;
            tahunBEPPlan = res.data[0].planning[j].tahun
          }

          const diffOptPlan = Math.min.apply(Math, sumLccPRPPlan.value)
          if (diffOptPlan < selisihOptPlan) {
            indexOptimumPlan = j;
            indexOptPlan = j + 1;
            selisihOptPlan = diffOptPlan;
            tahunOptimumPlan = res.data[0].planning[j].tahun
          }
        }
      } else {
        dataPRPPlan == null;
      }

      chartPRP.value = {
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
            data: tahunPRP,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = tahun.toString();
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value == filterTahun) {
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
            zlevel: 1,
            data: revPRP,
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
            zlevel: 1,
            showSymbol: false,
            data: sumLccPRP,
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
            data: capexPRP,
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
            data: comBDPRP,
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
            data: fuelComPRP,
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
            data: sumRevPRP,
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
            data: revAPRP,
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
            data: revBPRP,
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
            data: revCPRP,
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
            data: revDPRP,
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
            data: revPRPPlan,
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
            data: sumLccPRPPlan,
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
            data: capexPRPPlan,
            color: "#DDDDDD",
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [90, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Max', value: `BEP FS: ${tahunBEPPlan} (${indexBEPPlan})`, xAxis: indexTerdekatPlan, yAxis: maxPRPPlan },
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
            data: comBDPRPPlan,
            color: "#BFBFBF",
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [95, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life FS: \n ${tahunOptimumPlan} (${indexOptPlan})`, xAxis: indexOptimumPlan, yAxis: maxPRPPlan },
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
            data: fuelComPRPPlan,
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
            data: sumRevPRPPlan,
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
            data: revAPRPPlan,
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
            data: revBPRPPlan,
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
            data: revCPRPPlan,
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
            data: revDPRPPlan,
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

  await grafikService
    .getGrafikPRPLastYear({
      id_sentral: props.idSentral,
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

      dataPRPLastYear.value = res.data[0].realisasi_proyeksi;

      tahunLastYear.value = [];
      capexLastYear.value = []
      comBDLastYear.value = [];
      fuelComLastYear.value = [];
      sumRevLastYear.value = [];
      revLastYear.value = [];
      sumLccLastYear.value = [];
      revALastYear.value = [];
      revBLastYear.value = [];
      revCLastYear.value = [];
      revDLastYear.value = [];
      yAxisLastYear.value = [];

      if (res.data[0].realisasi_proyeksi != null) {
        for (var i = 0; i < res.data[0].realisasi_proyeksi.length; i++) {
          tahunLastYear.value.push(res.data[0].realisasi_proyeksi[i].tahun);
          capexLastYear.value.push(
            res.data[0].realisasi_proyeksi[i].capex_annualized
          );
          comBDLastYear.value.push(
            res.data[0].realisasi_proyeksi[i].cost_component_bd
          );
          fuelComLastYear.value.push(
            res.data[0].realisasi_proyeksi[i].cost_component_c_annualized
          );
          sumRevLastYear.value.push(
            res.data[0].realisasi_proyeksi[i].total_revenue
          );
          revLastYear.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_annualized
          );
          sumLccLastYear.value.push(res.data[0].realisasi_proyeksi[i].total_wlcc);
          revALastYear.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_a
          );
          revBLastYear.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_b
          );
          revCLastYear.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_c
          );
          revDLastYear.value.push(
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

          const diffOpt = Math.min.apply(Math, sumLccLastYear.value)
          if (diffOpt < selisihOpt) {
            indexOptimum = i;
            indexOpt = i + 1;
            selisihOpt = diffOpt;
            tahunOptimum = res.data[0].realisasi_proyeksi[i].tahun
          }
        }
      } else {
        dataPRPLastYear == null;
      }

      dataPRPLastYearPlan.value = res.data[0].planning;

      tahunLastYearPlan.value = [];
      capexLastYearPlan.value = []
      comBDLastYearPlan.value = [];
      fuelComLastYearPlan.value = [];
      sumRevLastYearPlan.value = [];
      revLastYearPlan.value = [];
      sumLccLastYearPlan.value = [];
      revALastYearPlan.value = [];
      revBLastYearPlan.value = [];
      revCLastYearPlan.value = [];
      revDLastYearPlan.value = [];
      yAxisLastYearPlan.value = [];

      if (res.data[0].planning != null) {
        for (var j = 0; j < res.data[0].planning.length; j++) {
          tahunLastYearPlan.value.push(res.data[0].planning[j].tahun);
          capexLastYearPlan.value.push(res.data[0].planning[j].capex_annualized);
          comBDLastYearPlan.value.push(res.data[0].planning[j].cost_component_bd);
          fuelComLastYearPlan.value.push(
            res.data[0].planning[j].cost_component_c_annualized
          );
          revLastYearPlan.value.push(res.data[0].planning[j].revenue_annualized);
          sumLccLastYearPlan.value.push(res.data[0].planning[j].total_wlcc);
          sumRevLastYearPlan.value.push(res.data[0].planning[j].total_revenue);
          revALastYearPlan.value.push(res.data[0].planning[j].revenue_komp_a);
          revBLastYearPlan.value.push(res.data[0].planning[j].revenue_komp_b);
          revCLastYearPlan.value.push(res.data[0].planning[j].revenue_komp_c);
          revDLastYearPlan.value.push(res.data[0].planning[j].revenue_komp_d);
          yAxisLastYearPlan.value.push(res.data[0].planning[j].capex_annualized + res.data[0].planning[j].cost_component_bd + res.data[0].planning[j].cost_component_c_annualized);
          maxLastYearPlan.value = Math.max.apply(Math, yAxisLastYearPlan.value);

          const difference = Math.abs(res.data[0].planning[j].total_wlcc - res.data[0].planning[j].revenue_annualized);
          if (difference < selisihPlan) {
            indexTerdekatPlan = j;
            indexBEPPlan = j + 1;
            selisihPlan = difference;
            tahunBEPPlan = res.data[0].planning[j].tahun
          }

          const diffOptPlan = Math.min.apply(Math, sumLccLastYearPlan.value)
          if (diffOptPlan < selisihOptPlan) {
            indexOptimumPlan = j;
            indexOptPlan = j + 1;
            selisihOptPlan = diffOptPlan;
            tahunOptimumPlan = res.data[0].planning[j].tahun
          }
        }
      } else {
        dataPRPLastYearPlan == null;
      }

      chartLastYear.value = {
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
            data: tahunLastYear,
            axisLabel: {
              fontSize: 10,
              color: function (value: any, index: number) {
                const filterTahun = tahun.toString();
                if (value < filterTahun) {
                  return '#FF5656';
                } else if (value == filterTahun) {
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
            zlevel: 1,
            data: revLastYear,
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
            zlevel: 1,
            data: sumLccLastYear,
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
            data: capexLastYear,
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
            data: comBDLastYear,
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
            data: fuelComLastYear,
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
            data: sumRevLastYear,
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
            data: revALastYear,
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
            data: revBLastYear,
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
            data: revCLastYear,
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
            data: revDLastYear,
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
            data: revLastYearPlan,
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
            data: sumLccLastYearPlan,
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
            data: capexLastYearPlan,
            color: "#DDDDDD",
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
            data: comBDLastYearPlan,
            markPoint: {
              silent: true,
              symbol: 'rect',
              symbolSize: [95, 30],
              itemStyle: { color: '#0D5A71' },
              label: { fontSize: 10, fontWeight: 'bold' },
              data: [
                { name: 'Min', value: `Optimum life FS: \n ${tahunOptimumPlan}  (${indexOptPlan})`, xAxis: indexOptimumPlan, yAxis: maxLastYearPlan },
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
            data: fuelComLastYearPlan,
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
            data: sumRevLastYearPlan,
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
            data: revALastYearPlan,
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
            data: revBLastYearPlan,
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
            data: revCLastYearPlan,
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
            data: revDLastYearPlan,
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
//   stored.periodeTahun = modelData;

//   isLoading.value = true;
//   await grafikService
//     .getGrafikWLCALL({
//       id_sentral: props.idSentral,
//       start_year: modelData[0],
//       end_year: modelData[1],
//       tahun_realisasi: tahunData.value,
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

//       dataWLCAll.value = res.data;

//       tahunWLCAll.value = [];
//       revWLC.value = [];
//       sumLccWLC.value = [];
//       fuelComWLC.value = [];
//       comBDWLC.value = [];
//       yAxisWlc.value = [];

//       for (var i = 0; i < res.data.length; i++) {
//         tahunWLCAll.value.push(res.data[i].tahun);
//         revWLC.value.push(res.data[i].revenue_annualized);
//         sumLccWLC.value.push(res.data[i].total_wlcc);
//         capexWLC.value.push(res.data[i].capex_annualized);
//         comBDWLC.value.push(res.data[i].cost_component_bd);
//         fuelComWLC.value.push(res.data[i].fuel_cost_annualized);
//         yAxisWlc.value.push(res.data[i].capex_annualized + res.data[i].cost_component_bd + res.data[i].fuel_cost_annualized);
//         maxWlc.value = Math.max.apply(Math, yAxisWlc.value);

//         const difference = Math.abs(res.data[i].total_wlcc - res.data[i].revenue_annualized);
//         if (difference < selisih) {
//           indexTerdekat = i;
//           indexBEP = i + 1;
//           selisih = difference;
//           tahunBEP = res.data[i].tahun
//         }

//         const diffOpt = Math.min.apply(Math, sumLccWLC.value)
//         if (diffOpt < selisihOpt) {
//           indexOptimum = i;
//           indexOpt = i + 1;
//           selisihOpt = diffOpt;
//           tahunOptimum = res.data[i].tahun
//         }
//       }

//       chartWLCAll.value = {
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
//             "Fuel Cost Annualized",
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
//             data: tahunWLCAll,
//             axisLabel: {
//               fontSize: 10,
//               color: function (value: any, index: number) {
//                 const filterTahun = tahunData.value;
//                 if (value < filterTahun) {
//                   return '#FF5656';
//                 } else if (value == filterTahun) {
//                   return '#6C6C6C';
//                 } else if (value > filterTahun) {
//                   return '#37B1D5';
//                 }
//               },
//               formatter: function (value: any, index: number) {
//                 return index + 1 + `\n${value}`;
//               },
//             },
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
//             name: "Cost Component A (Capex) Annualized",
//             type: "bar",
//             stack: "Ad",
//             emphasis: {
//               focus: "series",
//             },
//             data: capexWLC,
//             markPoint: {
//               silent: true,
//               symbol: 'rect',
//               symbolSize: [80, 30],
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
//             data: comBDWLC,
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
//             name: "Fuel Cost Annualized",
//             type: "bar",
//             stack: "Ad",
//             emphasis: {
//               focus: "series",
//             },
//             itemStyle: {
//               borderRadius: [5, 5, 0, 0],
//             },
//             data: fuelComWLC,
//             color: "#CCF2FF",
//             tooltip: {
//               valueFormatter: (value: any) =>
//                 globalFormat.formatRupiah(value) + " Rp(Juta)",
//             },
//           },
//           {
//             name: "Revenue Annualized",
//             type: "line",
//             smooth: true,
//             showSymbol: false,
//             data: revWLC,
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
//             data: sumLccWLC,
//             color: "#1E1F4E",
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
//   stored.periodeTahun = modelData;

//   isLoading.value = true;
//   await grafikService
//     .getGrafikWLCKom({
//       id_sentral: props.idSentral,
//       start_year: modelData[0],
//       end_year: modelData[1],
//       tahun_realisasi: tahunData.value,
//     })
//     .then((res: any) => {
//       dataWLCKom.value = res.data;

//       tahunWLCKom.value = [];
//       costCompA.value = [];
//       costCompC.value = [];
//       costCompBD.value = [];
//       sumCostComp.value = [];

//       for (var i = 0; i < res.data.length; i++) {
//         tahunWLCKom.value.push(res.data[i].tahun);
//         costCompA.value.push(res.data[i].cost_komp_a);
//         costCompC.value.push(res.data[i].cost_komp_c);
//         costCompBD.value.push(res.data[i].cost_komp_bd);
//         sumCostComp.value.push(
//           res.data[i].cost_komp_a +
//           res.data[i].cost_komp_b +
//           res.data[i].cost_komp_c +
//           res.data[i].cost_komp_d
//         );
//       }

//       chartWLCKom.value = {
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
//           data: [
//             "Total Cost",
//             "Komponen A",
//             "Komponen B + D",
//             "Komponen C",
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
//             data: tahunWLCKom,
//             axisLabel: {
//               fontSize: 10,
//               color: function (value: any, index: number) {
//                 const filterTahun = tahunData.value;
//                 if (value < filterTahun) {
//                   return '#FF5656';
//                 } else if (value == filterTahun) {
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
//             data: costCompA,
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
//             data: costCompBD,
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
//             data: costCompC,
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
//             data: sumCostComp,
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
