<template>
  <Loading v-if="isLoading" />
  <div v-if="stored.currentTabMesin === 'WLC (Realisasi & Proyeksi)'">
    <div v-if="statusApprove === 'Draft'" class="my-20 text-center">
      <DraftGrafik />
    </div>
    <div v-else-if="statusApprove === 'Menunggu Persetujuan T1'" class="my-20 text-center">
      <WaitingGraikT1 />
    </div>
    <div v-else-if="statusApprove === 'Menunggu Persetujuan T2'" class="my-20 text-center">
      <WaitingGraikT2 />
    </div>
    <div v-else-if="statusApprove === 'Ditolak T1'" class="my-20 text-center">
      <DitolakGrafikT1 />
    </div>
    <div v-else-if="statusApprove === 'Ditolak T2'" class="my-20 text-center">
      <DitolakGrafikT2 />
    </div>
    <div v-else-if="statusApprove === ''" class="my-20 text-center">
      <Empty />
    </div>
    <div v-else>
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-center">
          <h1 class="ml-6 text-lg font-bold">
            Grafik WLC (Realisasi & Proyeksi)
          </h1>
          <StatusGrafik :status-grafik="statusApprove" class="ml-4 mt-1.5" />
        </div>
        <div class="flex items-center justify-center px-6"
          v-if="props.tahunData && authService.checkRole() !== 'Approver'">
          <RouterLink
            :to="{ name: 'detail-rekap', params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(props.idMesin) : props.idMesin }, query: { tahun: props.tahunData } }">
            <button type="button"
              class="space-x-2 text-[#0099AD] hover:text-white hover:bg-primaryColor bg-white border border-[#0099AD] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2.5 flex justify-center items-center duration-300 focus:outline-none">
              <p class="font-semibold">Lihat Data</p>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                  fill="#0099AD" />
              </svg>
            </button>
          </RouterLink>
        </div>
      </div>
      <div class="sticky top-0 z-10">
        <!--TABS2-->
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
          <li class="ml-10">
            <button @click="changeTab(1)" class="inline-flex pb-2 text-sm" :class="[
              tabGraphic === 'Semua' ? 'font-semibold text-primaryTextColor' : 'font-normal',
            ]">
              Semua
            </button>
            <div v-if="tabGraphic === 'Semua'" class="w-full h-1.5 bg-[#0099ad]"></div>
            <div v-else></div>
          </li>
          <li class="ml-5">
            <button @click="changeTab(2)" class="inline-flex pb-2 text-sm" :class="[
              tabGraphic === 'Biaya Komponen' ? 'font-semibold text-primaryTextColor' : 'font-normal',
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
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning / Feasibility Study'">
    <div v-if="statusApprovePlanning === 'Draft'" class="my-20 text-center">
      <DraftGrafik />
    </div>
    <div v-else-if="statusApprovePlanning === 'Menunggu Persetujuan T1'" class="my-20 text-center">
      <WaitingGraikT1 />
    </div>
    <div v-else-if="statusApprovePlanning === 'Menunggu Persetujuan T2'" class="my-20 text-center">
      <WaitingGraikT2 />
    </div>
    <div v-else-if="statusApprovePlanning === 'Ditolak T1'" class="my-20 text-center">
      <DitolakGrafikT1 />
    </div>
    <div v-else-if="statusApprovePlanning === 'Ditolak T2'" class="my-20 text-center">
      <DitolakGrafikT2 />
    </div>
    <div v-else-if="statusApprovePlanning === ''" class="my-20 text-center">
      <Empty />
    </div>
    <div v-else>
      <div class="flex justify-between">
        <div class="flex items-center justify-center">
          <h1 class="ml-6 text-lg font-bold">Planning / Feasibility Study</h1>
          <StatusGrafik :status-grafik="statusApprovePlanning" class="ml-4 mt-1.5" />
        </div>
        <div class="flex items-center justify-center px-6">
          <RouterLink
            :to="{ name: 'feasibility-study', params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(props.idMesin) : props.idMesin } }">
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
            <button @click="changeTabFS(1)" class="inline-flex pb-2 text-sm" :class="[
              tabGraphicFS === 'Semua' ? 'font-semibold text-primaryTextColor' : 'font-normal',
            ]">
              Semua
            </button>
            <div v-if="tabGraphicFS === 'Semua'" class="w-full h-1.5 bg-[#0099ad]"></div>
            <div v-else></div>
          </li>
          <li class="ml-5">
            <button @click="changeTabFS(2)" class="inline-flex pb-2 text-sm" :class="[
              tabGraphicFS === 'Biaya Komponen' ? 'font-semibold text-primaryTextColor' : 'font-normal',
            ]">
              Biaya Komponen
            </button>
            <div v-if="tabGraphicFS === 'Biaya Komponen'" class="w-full h-1.5 bg-[#0099ad]"></div>
            <div v-else></div>
          </li>
        </ul>
      </div>
      <div v-if="tabGraphicFS === 'Semua'">
        <div v-if="dataPlanMesin === null">
          <Empty />
        </div>
        <div v-else class="mb-5">
          <vue-echarts :option="chartPlanningMesin" style="height: 450px" @click="handleClickPlan" />
        </div>
      </div>
      <div v-else-if="tabGraphicFS === 'Biaya Komponen'">
        <div v-if="dataPlanKomMesin === null">
          <Empty />
        </div>
        <div v-else class="mb-5">
          <vue-echarts :option="chartPlanKomMesin" style="height: 450px" @click="handleClickPlanKom" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning & Realisasi + Proyeksi'">
    <div v-if="statusApprove === 'Draft'" class="my-20 text-center">
      <DraftGrafik />
    </div>
    <div v-else-if="statusApprove === 'Menunggu Persetujuan T1'" class="my-20 text-center">
      <WaitingGraikT1 />
    </div>
    <div v-else-if="statusApprove === 'Menunggu Persetujuan T2'" class="my-20 text-center">
      <WaitingGraikT2 />
    </div>
    <div v-else-if="statusApprove === 'Ditolak T1'" class="my-20 text-center">
      <DitolakGrafikT1 />
    </div>
    <div v-else-if="statusApprove === 'Ditolak T2'" class="my-20 text-center">
      <DitolakGrafikT2 />
    </div>
    <div v-else-if="statusApprove === ''" class="my-20 text-center">
      <Empty />
    </div>
    <div v-else>
      <div class="flex justify-between">
        <div class="flex items-center justify-center">
          <h1 class="ml-6 text-lg font-bold"> Planning & Realisasi + Proyeksi</h1>
          <StatusGrafik :status-grafik="statusApprove" class="ml-4 mt-1.5" />
        </div>
        <div class="flex items-center justify-center px-6">
          <RouterLink
            :to="{ name: 'detail-rekap', params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(props.idMesin) : props.idMesin }, query: { tahun: props.tahunData } }">
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
        <div v-if="maxPRPPlanBep === 0 && maxPRPPlanOpt === 0">
          <vue-echarts :option="chartPRPMesin_NoPlan" style="height: 450px" @click="handleClickPRP" />
          <Legend />
        </div>
        <div v-else-if="maxPRPBep === 0 && maxPRPOpt === 0">
          <vue-echarts :option="chartPRPMesin_Plan" style="height: 450px" @click="handleClickPRP" />
          <Legend />
        </div>
        <div v-else>
          <vue-echarts :option="chartPRPMesin" style="height: 450px" @click="handleClickPRP" />
          <Legend />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning vs Realisasi s/d Tahun Berjalan'
  ">
    <div v-if="statusApprove === 'Draft'" class="my-20 text-center">
      <DraftGrafik />
    </div>
    <div v-else-if="statusApprove === 'Menunggu Persetujuan T1'" class="my-20 text-center">
      <WaitingGraikT1 />
    </div>
    <div v-else-if="statusApprove === 'Menunggu Persetujuan T2'" class="my-20 text-center">
      <WaitingGraikT2 />
    </div>
    <div v-else-if="statusApprove === 'Ditolak T1'" class="my-20 text-center">
      <DitolakGrafikT1 />
    </div>
    <div v-else-if="statusApprove === 'Ditolak T2'" class="my-20 text-center">
      <DitolakGrafikT2 />
    </div>
    <div v-else-if="statusApprove === ''" class="my-20 text-center">
      <Empty />
    </div>
    <div v-else>
      <div class="flex justify-between">
        <div class="flex items-center justify-center">
          <h1 class="ml-6 text-lg font-bold">Planning vs Realisasi s/d Tahun Berjalan</h1>
          <StatusGrafik :status-grafik="statusApprove" class="ml-4 mt-1.5" />
        </div>
        <div class="flex items-center justify-center px-6">
          <RouterLink
            :to="{ name: 'detail-rekap', params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(props.idMesin) : props.idMesin }, query: { tahun: props.tahunData } }">
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
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Realisasi + Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatableWlcAllMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.planning) }}</td>
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
              <th class="px-1 py-2 text-right">Realisasi + Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatableWlcKomMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.planning) }}</td>
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
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatablePlanMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.planning) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ModalWrapper>

  <ModalWrapper :showModal="showModalPlanKom" :width="'w-[700px]'" :height="'h-auto'">
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
      <div class="cursor-pointer" @click="showModalPlanKom = false">
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
      <vue-echarts :option="chartDetailPlanKomMesin" style="height: 350px" />
    </div>
    <div class="py-4 text-gray-950">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b">
            <tr>
              <th class="px-8 py-2 text-left">Deskripsi</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatablePlanKomMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.planning) }}</td>
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
              <th class="px-1 py-2 text-right">Realisasi + Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatablePRPMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.planning) }}</td>
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
              <th class="px-1 py-2 text-right">Realisasi + Proyeksi (Rp (Juta))</th>
              <th class="px-1 py-2 text-right">Planning (Rp (Juta))</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in datatableLastYMesin" :key="i" class="text-xs">
            <tr class="border-b bg-[#E5E7E9]">
              <td class="px-8 py-2 text-left">{{ item.name }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.realisasi) }}</td>
              <td class="px-1 py-2 text-right">{{ globalFormat.formatDecimal(item.planning) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue";
import { encryptStorage } from "@/utils/app-encrypt-storage";
import AOS from 'aos'
import { VueEcharts } from "vue3-echarts";
import { useTagMesin } from "@/store/storeTagGrafik";
import AuthService from "@/services/auth-service";
const authService = new AuthService();
import '@vuepic/vue-datepicker/dist/main.css';
import Legend from "@/components/Grafik/LegendGrafik.vue";
import GrafikService from "@/services/grafik-service";
import GlobalFormat from "@/services/format/global-format";
import Empty from "@/components/ui/EmptyData.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import Loading from '@/components/ui/LoadingSpinner.vue';
import StatusGrafik from "@/components/Status/StatusGrafik.vue";
import DraftGrafik from '@/components/Status/Grafik/DraftGrafik.vue';
import WaitingGraikT1 from '@/components/Status/Grafik/WaitingGrafikT1.vue';
import WaitingGraikT2 from '@/components/Status/Grafik/WaitingGrafikT2.vue';
import DitolakGrafikT1 from '@/components/Status/Grafik/DitolakGrafikT1.vue';
import DitolakGrafikT2 from '@/components/Status/Grafik/DitolakGrafikT2.vue';

const stored = useTagMesin();
const grafikService = new GrafikService();
const globalFormat = new GlobalFormat();

const nodeMode = import.meta.env.MODE;
const dataWLCAllMesin = ref<Grafik1[]>([]);
const dataWLCKomMesin = ref<Grafik2[]>([]);
const dataPlanMesin = ref<Grafik1[]>([]);
const dataPlanKomMesin = ref<Grafik2[]>([]);
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
const dataDetailPlanKomMesin = ref<Grafik1[]>([]);
const datatablePlanKomMesin = ref<table[]>([]);
const dataDetailPRPMesin = ref<Grafik1[]>([]);
const datatablePRPMesin = ref<table[]>([]);
const dataDetailLastYMesin = ref<Grafik1[]>([]);
const datatableLastYMesin = ref<table[]>([]);
const showModalWlcAll = ref(false);
const showModalWlcKom = ref(false);
const showModalPlan = ref(false);
const showModalPlanKom = ref(false);
const showModalPRP = ref(false);
const showModalLastY = ref(false);
const tahunBerjalan = new Date().getFullYear();

const isLoading = ref(false);
const props = defineProps<Mesin>();
const tahunData = computed(() => props.tahunData);
const tabGraphic = ref("Semua");
const tabGraphicFS = ref("Semua");
const statusApprove = ref<any>('');
const statusApprovePlanning = ref<any>('');

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
const profitLoss = ref<any[]>([]);
const chartWLCAllMesin = ref();
const updateWLCAllMesin = ref(true);
const tahunWLCAllMesin = ref<any>([]);
const revWLCMesin = ref<any>([]);
const sumLccWLCMesin = ref<any>([]);
const capexWLCMesin = ref<any>([]);
const comBDWLCMesin = ref<any>([]);
const fuelComWLCMesin = ref<any>([]);
const yAxisWlc = ref<any>([]);
const maxWlcBep = ref<any>([]);
const maxWlcOpt = ref<any>([]);

const chartDetailWLCAllMesin = ref();
const updateDetailWLCAllMesin = ref(true);
const judulDetWlcAll = ref<any>([]);
const realDetWlcAll = ref<any>([]);
const planDetWlcAll = ref<any>([]);

// chart WLC Komponen Mesin
const chartWLCKomMesin = ref();
const updateWLCKomMesin = ref(true);
const tahunWLCKomMesin = ref<any>([]);
const costCompAMesin = ref<any>([]);
const costCompCMesin = ref<any>([]);
const costCompBDMesin = ref<any>([]);
const sumCostCompMesin = ref<any>([]);

const chartDetailWLCKomMesin = ref();
const updateDetailWLCKomMesin = ref(true);
const judulDetWlcKom = ref<any>([]);
const realDetWlcKom = ref<any>([]);
const planDetWlcKom = ref<any>([]);

// chart Planning
const chartPlanningMesin = ref();
const updatePlanningMesin = ref(true);
const tahunPlanningMesin = ref<any>([]);
const capexPlanMesin = ref<any>([]);
const comBDPlanMesin = ref<any>([]);
const fuelComPlanMesin = ref<any>([]);
const revPlanMesin = ref<any>([]);
const sumLccPlanMesin = ref<any>([]);
const yAxisPlan = ref<any>([]);
const maxPlanBep = ref<any>([]);
const maxPlanOpt = ref<any>([]);

const chartDetailPlanMesin = ref();
const updateDetailPlanMesin = ref(true);
const judulDetPlan = ref<any>([]);
const realDetPlan = ref<any>([]);
const planDetPlan = ref<any>([]);

// chart Planing Komponen Mesin
const chartPlanKomMesin = ref();
const updatePlanKomMesin = ref(true);
const tahunPlanKomMesin = ref<any>([]);
const costCompAMesinPlan = ref<any>([]);
const costCompCMesinPlan = ref<any>([]);
const costCompBDMesinPlan = ref<any>([]);
const sumCostCompMesinPlan = ref<any>([]);

const chartDetailPlanKomMesin = ref();
const updateDetailPlanKomMesin = ref(true);
const judulDetPlanKom = ref<any>([]);
const realDetPlanKom = ref<any>([]);
const planDetPlanKom = ref<any>([]);

// chart Planning Realisasi Proyeksi
const chartPRPMesin = ref();
const chartPRPMesin_NoPlan = ref();
const chartPRPMesin_Plan = ref();
const updatePRPMesin = ref(true);
const tahunPRPMesin = ref<any>([]);
const capexPRPMesin = ref<any>([]);
const comBDPRPMesin = ref<any>([]);
const fuelComPRPMesin = ref<any>([]);
const sumRevPRPMesin = ref<any>([]);
const revPRPMesin = ref<any>([]);
const sumLccPRPMesin = ref<any>([]);
const revAPRPMesin = ref<any>([]);
const revBPRPMesin = ref<any>([]);
const revCPRPMesin = ref<any>([]);
const revDPRPMesin = ref<any>([]);
const yAxisPRP = ref<any>([]);
const maxPRPBep = ref<any>([]);
const maxPRPOpt = ref<any>([]);

const tahunPRPPlan = ref<any>([]);
const capexPRPPlanMesin = ref<any>([]);
const comBDPRPPlanMesin = ref<any>([]);
const fuelComPRPPlanMesin = ref<any>([]);
const revPRPPlanMesin = ref<any>([]);
const sumLccPRPPlanMesin = ref<any>([]);
const sumRevPRPPlanMesin = ref<any>([]);
const revAPRPPlanMesin = ref<any>([]);
const revBPRPPlanMesin = ref<any>([]);
const revCPRPPlanMesin = ref<any>([]);
const revDPRPPlanMesin = ref<any>([]);
const yAxisPRPPlan = ref<any>([]);
const maxPRPPlanBep = ref<any>([]);
const maxPRPPlanOpt = ref<any>([]);

const chartDetailPRPMesin = ref();
const updateDetailPRPMesin = ref(true);
const judulDetPRP = ref<any>([]);
const realDetPRP = ref<any>([]);
const planDetPRP = ref<any>([]);

// chart Last Year
const chartLastYearMesin = ref();
const updateLastYearMesin = ref(true);
const tahunLastYearMesin = ref<any>([]);
const capexLastYearMesin = ref<any>([]);
const comBDLastYearMesin = ref<any>([]);
const fuelComLastYearMesin = ref<any>([]);
const sumRevLastYearMesin = ref<any>([]);
const revLastYearMesin = ref<any>([]);
const sumLccLastYearMesin = ref<any>([]);
const revALastYearMesin = ref<any>([]);
const revBLastYearMesin = ref<any>([]);
const revCLastYearMesin = ref<any>([]);
const revDLastYearMesin = ref<any>([]);
const yAxisLastYear = ref<any>([]);
const maxLastYearBep = ref<any>([]);
const maxLastYearOpt = ref<any>([]);
const tahunDetail = ref("");

const tahunLastYearPlanMesin = ref<any>([]);
const capexLastYearPlanMesin = ref<any>([]);
const comBDLastYearPlanMesin = ref<any>([]);
const fuelComLastYearPlanMesin = ref<any>([]);
const revLastYearPlanMesin = ref<any>([]);
const sumLccLastYearPlanMesin = ref<any>([]);
const sumRevLastYearPlanMesin = ref<any>([]);
const revALastYearPlanMesin = ref<any>([]);
const revBLastYearPlanMesin = ref<any>([]);
const revCLastYearPlanMesin = ref<any>([]);
const revDLastYearPlanMesin = ref<any>([]);
const yAxisLastYearPlan = ref<any>([]);
const maxLastYearPlanBep = ref<any>([]);
const maxLastYearPlanOpt = ref<any>([]);

const chartDetailLastYMesin = ref();
const updateDetailLastYMesin = ref(true);
const judulDetLastY = ref<any>([]);
const realDetLastY = ref<any>([]);
const planDetLastY = ref<any>([]);

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

let forceRender10 = async () => {
  updatePlanKomMesin.value = false;
  await nextTick();
  updatePlanKomMesin.value = true;
};

let forceRender11 = async () => {
  updateDetailPlanKomMesin.value = false;
  await nextTick();
  updateDetailPlanKomMesin.value = true;
};

function changeTab(tabs: number) {
  if (tabs === 1) {
    tabGraphic.value = "Semua";
  } else if (tabs === 2) {
    tabGraphic.value = "Biaya Komponen";
  }
};

function changeTabFS(tabs: number) {
  if (tabs === 1) {
    tabGraphicFS.value = "Semua";
  } else if (tabs === 2) {
    tabGraphicFS.value = "Biaya Komponen";
  }
};

function handleClickWlcAll(param: any) {
  showModalWlcAll.value = true;
  tahunDetail.value = tahunWLCAllMesin.value[param.dataIndex];
  console.log(tahunDetail.value);

  grafikService
    .getGrafikWLCALLDetailMesin({
      id_mesin: props.idMesin,
      tahun_realisasi: props.tahunData,
      tahun: tahunWLCAllMesin.value[param.dataIndex],
    })
    .then((res: any) => {
      judulDetWlcAll.value = [];
      realDetWlcAll.value = [];
      planDetWlcAll.value = [];

      dataDetailWlcAllMesin.value = res.data.graph;
      datatableWlcAllMesin.value = res.data.table;
      res.data.graph.sort((a: any, b: any) => a.nomor - b.nomor);
      res.data.table.sort((a: any, b: any) => a.nomor - b.nomor);

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
          left: "3%",
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
              padding: [30, 20, 25, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 10,
            min: 0,
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
      tahun_realisasi: props.tahunData,
      tahun: tahunWLCKomMesin.value[param.dataIndex],
    })
    .then((res: any) => {
      judulDetWlcKom.value = [];
      realDetWlcKom.value = [];
      planDetWlcKom.value = [];

      dataDetailWlcKomMesin.value = res.data.graph;
      datatableWlcKomMesin.value = res.data.table;
      res.data.graph.sort((a: any, b: any) => a.nomor - b.nomor);
      res.data.table.sort((a: any, b: any) => a.nomor - b.nomor);

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
          left: "4%",
          right: "4%",
          bottom: "8%",
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
              padding: [50, 10, 20, -15],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 10,
            min: 0,
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
      tahun_realisasi: props.tahunData,
      tahun: tahunPlanningMesin.value[param.dataIndex],
    })
    .then((res: any) => {
      judulDetPlan.value = [];
      realDetPlan.value = [];
      planDetPlan.value = [];

      dataDetailPlanMesin.value = res.data.graph;
      datatablePlanMesin.value = res.data.table;
      res.data.graph.sort((a: any, b: any) => a.nomor - b.nomor);
      res.data.table.sort((a: any, b: any) => a.nomor - b.nomor);

      for (var i = 0; i < res.data.graph.length; i++) {
        judulDetPlan.value.push(res.data.graph[i].judul);
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
          data: ["Planning"],
        },
        grid: {
          top: "3%",
          left: "3%",
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
              padding: [30, 20, 25, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 10,
            min: 0,
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
          },
        ],
        color: ["#0D5A71", "#97E4FF"],
      };
      forceRender7();
    });
}

function handleClickPlanKom(param: any) {
  showModalPlanKom.value = true;
  tahunDetail.value = tahunPlanKomMesin.value[param.dataIndex];
  // console.log(tahunDetail.value);

  grafikService
    .getGrafikPlanKomDetailMesin({
      id_mesin: props.idMesin,
      tahun: tahunPlanKomMesin.value[param.dataIndex],
    })
    .then((res: any) => {
      judulDetPlanKom.value = [];
      realDetPlanKom.value = [];
      planDetPlanKom.value = [];

      dataDetailPlanKomMesin.value = res.data.graph;
      datatablePlanKomMesin.value = res.data.table;
      res.data.graph.sort((a: any, b: any) => a.nomor - b.nomor);
      res.data.table.sort((a: any, b: any) => a.nomor - b.nomor);

      for (var i = 0; i < res.data.graph.length; i++) {
        judulDetPlanKom.value.push(res.data.graph[i].judul);
        planDetPlanKom.value.push(res.data.graph[i].planning);
      }

      chartDetailPlanKomMesin.value = {
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
          data: ["Planning"],
        },
        grid: {
          top: "3%",
          left: "4%",
          right: "4%",
          bottom: "8%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: judulDetPlanKom,
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
              padding: [50, 10, 20, -15],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 10,
            min: 0,
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
            data: planDetPlanKom,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
          },
        ],
        color: ["#0D5A71", "#97E4FF"],
      };
      forceRender11();
    });
}

function handleClickPRP(param: any) {
  showModalPRP.value = true;
  tahunDetail.value = tahunPRPMesin.value[param.dataIndex];
  // console.log(tahunDetail.value);

  grafikService
    .getGrafikPRPDetailMesin({
      id_mesin: props.idMesin,
      tahun_realisasi: props.tahunData,
      tahun: tahunPRPMesin.value[param.dataIndex],
    })
    .then((res: any) => {
      judulDetPRP.value = [];
      realDetPRP.value = [];
      planDetPRP.value = [];

      dataDetailPRPMesin.value = res.data.graph;
      datatablePRPMesin.value = res.data.table;
      res.data.graph.sort((a: any, b: any) => a.nomor - b.nomor);
      res.data.table.sort((a: any, b: any) => a.nomor - b.nomor);

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
          left: "3%",
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
              padding: [30, 20, 25, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 10,
            min: 0,
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
      tahun_realisasi: props.tahunData,
      tahun: tahunLastYearMesin.value[param.dataIndex],
    })
    .then((res: any) => {
      judulDetLastY.value = [];
      realDetLastY.value = [];
      planDetLastY.value = [];

      dataDetailLastYMesin.value = res.data.graph;
      datatableLastYMesin.value = res.data.table;
      res.data.graph.sort((a: any, b: any) => a.nomor - b.nomor);
      res.data.table.sort((a: any, b: any) => a.nomor - b.nomor);

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
          left: "3%",
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
              padding: [30, 20, 25, -25],
              fontSize: 14,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            axisLabel: {
              fontSize: 10,
              formatter: function (value: any) {
                return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
              },
            },
            splitNumber: 10,
            min: 0,
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
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
                globalFormat.formatDecimal(value) + " Rp(Juta)",
            },
          },
        ],
        color: ["#0D5A71", "#97E4FF"],
      };
      forceRender9();
    });
}

const fetchGrafikWLCAllMesin = async () => {
  try {
    const response: any = await grafikService.getGrafikWLCALLMesin({ id_mesin: props.idMesin, start_year: '', end_year: '', tahun_realisasi: tahunData.value });
    let indexTerdekat;
    let tahunBEP;
    let indexBEP;
    let indexOpt;
    let indexOptimum;
    let tahunOptimum;
    let selisih = Infinity;
    let selisihOpt = Infinity;

    dataWLCAllMesin.value = response.data;

    tahunWLCAllMesin.value = [];
    revWLCMesin.value = [];
    sumLccWLCMesin.value = [];
    profitLoss.value = [];
    capexWLCMesin.value = [];
    comBDWLCMesin.value = [];
    fuelComWLCMesin.value = [];
    yAxisWlc.value = [];

    if (response.data != null) {
      var wlcAnnu = [];
      var revenAnnu = [];
      var capexAnnu = [];
      var comBDAnnu = [];
      var fuelComAnnu = [];
      var finalMax;

      for (var i = 0; i < response.data.length; i++) {
        tahunWLCAllMesin.value.push(response.data[i].tahun);
        revWLCMesin.value.push(response.data[i].revenue_annualized);
        sumLccWLCMesin.value.push(response.data[i].total_wlcc_annualized);
        profitLoss.value.push(response.data[i].profit_loss);
        capexWLCMesin.value.push(response.data[i].capex_annualized);
        comBDWLCMesin.value.push(response.data[i].cost_component_bd);
        fuelComWLCMesin.value.push(response.data[i].cost_component_c_annualized);
        yAxisWlc.value.push(response.data[i].capex_annualized + response.data[i].cost_component_bd + response.data[i].cost_component_c_annualized);
        maxWlcBep.value = Math.max.apply(Math, yAxisWlc.value) * 1.1;
        maxWlcOpt.value = Math.max.apply(Math, yAxisWlc.value);

        wlcAnnu.push(response.data[i].total_wlcc_annualized);
        revenAnnu.push(response.data[i].revenue_annualized);
        capexAnnu.push(response.data[i].capex_annualized);
        comBDAnnu.push(response.data[i].cost_component_bd);
        fuelComAnnu.push(response.data[i].cost_component_c_annualized);

        const difference = Math.abs(response.data[i].total_wlcc_annualized - response.data[i].revenue_annualized);
        if (difference < selisih) {
          indexTerdekat = i;
          indexBEP = i + 1;
          selisih = difference;
          tahunBEP = response.data[i].tahun
        }

        const finalOptimum = Math.max.apply(Math, profitLoss.value)
        if (finalOptimum == response.data[i].profit_loss) {
          indexOptimum = i
          indexOpt = i + 1
          tahunOptimum = response.data[i].tahun
        }
      }

      var maxWlc = Math.max.apply(Math, wlcAnnu);
      var maxRev = Math.max.apply(Math, revenAnnu);
      var maxCapex = Math.max.apply(Math, capexAnnu);
      var maxComBD = Math.max.apply(Math, comBDAnnu);
      var maxFuelCom = Math.max.apply(Math, fuelComAnnu);

      var listOfMax = [maxCapex, maxComBD, maxFuelCom, maxWlc, maxRev];
      finalMax = Math.max.apply(Math, listOfMax);

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
        top: "5%",
        left: "3%",
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
              const filterTahun = tahunData.value.toString();
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
            padding: [30, 20, 25, -25],
            fontSize: 14,
            color: "#4D5E80",
            fontWeight: "bold",
          },
          axisLabel: {
            fontSize: 10,
            formatter: function (value: any) {
              return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
            },
          },
          splitNumber: 20,
          min: 0,
          max: finalMax ? finalMax * 1.1 : finalMax
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            data: [{ name: 'BEPP', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: finalMax }],
            symbolOffset: [0, 0]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'BEP', xAxis: indexTerdekat }, { xAxis: indexTerdekat }]],
          },
          color: "#0D5A71",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            data: [{ name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: finalMax }],
            symbolOffset: [0, 20]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'Optimum Life', xAxis: indexOptimum }, { xAxis: indexOptimum }]]
          },
          color: "#37B1D5",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
      ],
    };
    forceRender();
  } catch (error) {
    console.error('Fetch Grafik WLC All Mesin', error)
  }
}

const fetchGrafikWLCKomMesin = async () => {
  try {
    const response: any = await grafikService.getGrafikWLCKomMesin({ id_mesin: props.idMesin, start_year: '', end_year: '', tahun_realisasi: tahunData.value });
    dataWLCKomMesin.value = response.data;

    tahunWLCKomMesin.value = [];
    costCompAMesin.value = [];
    costCompCMesin.value = [];
    costCompBDMesin.value = [];
    sumCostCompMesin.value = [];

    if (response.data != null) {
      for (var i = 0; i < response.data.length; i++) {
        tahunWLCKomMesin.value.push(response.data[i].tahun);
        costCompAMesin.value.push(response.data[i].cost_komp_a);
        costCompCMesin.value.push(response.data[i].cost_komp_c);
        costCompBDMesin.value.push(response.data[i].cost_komp_bd);
        sumCostCompMesin.value.push(
          response.data[i].cost_komp_a +
          response.data[i].cost_komp_b +
          response.data[i].cost_komp_c +
          response.data[i].cost_komp_d
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
        top: "5%",
        left: "3%",
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
              const filterTahun = tahunData.value.toString();
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
            padding: [30, 20, 25, -25],
            fontSize: 14,
            color: "#4D5E80",
            fontWeight: "bold",
          },
          axisLabel: {
            fontSize: 10,
            formatter: function (value: any) {
              return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
            },
          },
          splitNumber: 20,
          min: 0,
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
      ],
    };
    forceRender1();
  } catch (error) {
    console.error('Fetch Grafik WLC Kom Mesin', error);
  }
}

const fetchGrafikPlanMesin = async () => {
  try {
    const response: any = await grafikService.getGrafikPlanMesin({ id_mesin: props.idMesin, tahun_realisasi: tahunData.value })
    let indexTerdekat;
    let tahunBEP;
    let indexBEP;
    let indexOpt;
    let indexOptimum;
    let tahunOptimum;
    let selisih = Infinity;
    let selisihOpt = Infinity;

    dataPlanMesin.value = response.data;

    tahunPlanningMesin.value = [];
    capexPlanMesin.value = [];
    comBDPlanMesin.value = [];
    fuelComPlanMesin.value = [];
    revPlanMesin.value = [];
    sumLccPlanMesin.value = [];
    yAxisPlan.value = [];

    if (response.data != null) {
      var wlcAnnu = [];
      var revenAnnu = [];
      var capexAnnu = [];
      var comBDAnnu = [];
      var fuelComAnnu = [];
      var finalMax;

      for (var i = 0; i < response.data.length; i++) {
        tahunPlanningMesin.value.push(response.data[i].tahun);
        capexPlanMesin.value.push(response.data[i].capex_annualized);
        comBDPlanMesin.value.push(response.data[i].cost_component_bd);
        revPlanMesin.value.push(response.data[i].revenue_annualized);
        profitLoss.value.push(response.data[i].profit_loss);
        fuelComPlanMesin.value.push(response.data[i].cost_component_c_annualized);
        sumLccPlanMesin.value.push(response.data[i].total_wlcc_annualized);
        yAxisPlan.value.push(response.data[i].capex_annualized + response.data[i].cost_component_bd + response.data[i].cost_component_c_annualized);
        maxPlanBep.value = Math.max.apply(Math, yAxisPlan.value) * 1.1;
        maxPlanOpt.value = Math.max.apply(Math, yAxisPlan.value);

        wlcAnnu.push(response.data[i].total_wlcc_annualized);
        revenAnnu.push(response.data[i].revenue_annualized);
        capexAnnu.push(response.data[i].capex_annualized);
        comBDAnnu.push(response.data[i].cost_component_bd);
        fuelComAnnu.push(response.data[i].cost_component_c_annualized);

        const difference = Math.abs(response.data[i].total_wlcc_annualized - response.data[i].revenue_annualized);
        if (difference < selisih) {
          indexTerdekat = i;
          indexBEP = i + 1;
          selisih = difference;
          tahunBEP = response.data[i].tahun
        }

        // const diffOpt = Math.min.apply(Math, sumLccPlanMesin.value)
        // if (diffOpt < selisihOpt) {
        //   indexOptimum = i;
        //   indexOpt = i + 1;
        //   selisihOpt = diffOpt;
        //   tahunOptimum = response.data[i].tahun
        // }
        const finalOptimum = Math.max.apply(Math, profitLoss.value)
        if (finalOptimum == response.data[i].profit_loss) {
          indexOptimum = i
          indexOpt = i + 1
          tahunOptimum = response.data[i].tahun
        }
      }
      var maxWlc = Math.max.apply(Math, wlcAnnu);
      var maxRev = Math.max.apply(Math, revenAnnu);
      var maxCapex = Math.max.apply(Math, capexAnnu);
      var maxComBD = Math.max.apply(Math, comBDAnnu);
      var maxFuelCom = Math.max.apply(Math, fuelComAnnu);

      var listOfMax = [maxCapex, maxComBD, maxFuelCom, maxWlc, maxRev];
      finalMax = Math.max.apply(Math, listOfMax);
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
          "FS: Total LCC Annualized",
          "FS: Cost Component A (Capex) Annualized",
          "FS: Cost Component B + D Annualized",
          "FS: Cost Component C Annualized",
        ],
      },
      grid:
      {
        top: "5%",
        left: "3%",
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
            padding: [30, 20, 25, -25],
            fontSize: 14,
            color: "#4D5E80",
            fontWeight: "bold",
          },
          axisLabel: {
            fontSize: 10,
            formatter: function (value: any) {
              return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
            },
          },
          splitNumber: 20,
          min: 0,
          // max: maxPlanBep
          max: finalMax ? finalMax * 1.1 : finalMax
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
            symbolSize: [100, 30],
            itemStyle: { color: '#0D5A71' },
            label: { fontSize: 10, fontWeight: 'bold' },
            data: [{ name: 'Max', value: `BEP FS : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: finalMax }],
            symbolOffset: [0, 0]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'BEP FS', xAxis: indexTerdekat }, { xAxis: indexTerdekat }]]
          },
          color: "#0D5A71",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            data: [{ name: 'Min', value: `Optimum life FS : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: finalMax }],
            symbolOffset: [0, 20]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'Optimum Life FS', xAxis: indexOptimum }, { xAxis: indexOptimum }]]
          },
          color: "#37B1D5",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Total LCC Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: sumLccPlanMesin,
          color: "#1E1F4E",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
      ],
    };
    forceRender2();
  } catch (error) {
    console.error('Fetch Grafik Plan Mesin', error)
  }
}

const fetchGrafikPlanKomMesin = async () => {
  try {
    const response: any = await grafikService.getGrafikPlanKomMesin({ id_mesin: props.idMesin, })
    dataPlanKomMesin.value = response.data;

    tahunPlanKomMesin.value = [];
    costCompAMesinPlan.value = [];
    costCompCMesinPlan.value = [];
    costCompBDMesinPlan.value = [];
    sumCostCompMesinPlan.value = [];

    if (response.data != null) {
      for (var i = 0; i < response.data.length; i++) {
        tahunPlanKomMesin.value.push(response.data[i].tahun);
        costCompAMesinPlan.value.push(response.data[i].cost_komp_a);
        costCompCMesinPlan.value.push(response.data[i].cost_komp_c);
        costCompBDMesinPlan.value.push(response.data[i].cost_komp_bd);
        sumCostCompMesinPlan.value.push(
          response.data[i].cost_komp_a +
          response.data[i].cost_komp_b +
          response.data[i].cost_komp_c +
          response.data[i].cost_komp_d
        );
      }
    } else {
      dataPlanKomMesin == null;
    }

    chartPlanKomMesin.value = {
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
        data: ["FS: Total Cost", "FS: Cost Component A", "FS: Cost Component B + D", "FS: Cost Component C"],
      },
      grid: {
        top: "5%",
        left: "3%",
        right: "2%",
        bottom: "8%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: tahunPlanKomMesin,
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
            padding: [30, 20, 25, -25],
            fontSize: 14,
            color: "#4D5E80",
            fontWeight: "bold",
          },
          axisLabel: {
            fontSize: 10,
            formatter: function (value: any) {
              return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
            },
          },
          splitNumber: 20,
          min: 0,
        },
      ],
      series: [
        {
          name: "FS: Cost Component A",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: costCompAMesinPlan,
          color: "#068D9D",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Cost Component B + D",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: costCompBDMesinPlan,
          color: "#6D9DC5",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Cost Component C",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
          },
          data: costCompCMesinPlan,
          color: "#CCF2FF",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Total Cost",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: sumCostCompMesinPlan,
          color: "#53599A",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
      ],
    };
    forceRender10();
  } catch (error) {
    console.error('Fetch Grafik Plan Kom Mesin', error)
  }
}

const fetchGrafikPRPMesin = async () => {
  try {
    const response: any = await grafikService.getGrafikPRPMesin({ id_mesin: props.idMesin, tahun_realisasi: tahunData.value });
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

    dataPRPMesin.value = response.data[0].realisasi_proyeksi;

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
    profitLoss.value = [];
    yAxisPRP.value = [];

    if (response.data[0].realisasi_proyeksi != null) {
      var capexAnnu: number[] = [];
      var comBDAnnu: number[] = [];
      var fuelComAnnu: number[] = [];
      var sumrevenAnnu: number[] = [];
      var revenAnnu: number[] = [];
      var wlcAnnu: number[] = [];
      var revaAnnu: number[] = [];
      var revbAnnu: number[] = [];
      var revcAnnu: number[] = [];
      var revdAnnu: number[] = [];
      var finalMax: any;

      for (var i = 0; i < response.data[0].realisasi_proyeksi.length; i++) {
        tahunPRPMesin.value.push(response.data[0].realisasi_proyeksi[i].tahun);
        capexPRPMesin.value.push(
          response.data[0].realisasi_proyeksi[i].capex_annualized
        );
        comBDPRPMesin.value.push(
          response.data[0].realisasi_proyeksi[i].cost_component_bd
        );
        fuelComPRPMesin.value.push(
          response.data[0].realisasi_proyeksi[i].cost_component_c_annualized
        );
        sumRevPRPMesin.value.push(
          response.data[0].realisasi_proyeksi[i].total_revenue
        );
        revPRPMesin.value.push(
          response.data[0].realisasi_proyeksi[i].revenue_annualized
        );
        profitLoss.value.push(response.data[0].realisasi_proyeksi[i].profit_loss);
        sumLccPRPMesin.value.push(response.data[0].realisasi_proyeksi[i].total_wlcc_annualized);
        revAPRPMesin.value.push(response.data[0].realisasi_proyeksi[i].revenue_komp_a);
        revBPRPMesin.value.push(response.data[0].realisasi_proyeksi[i].revenue_komp_b);
        revCPRPMesin.value.push(response.data[0].realisasi_proyeksi[i].revenue_komp_c);
        revDPRPMesin.value.push(response.data[0].realisasi_proyeksi[i].revenue_komp_d);
        yAxisPRP.value.push(response.data[0].realisasi_proyeksi[i].capex_annualized + response.data[0].realisasi_proyeksi[i].cost_component_bd + response.data[0].realisasi_proyeksi[i].cost_component_c_annualized);
        maxPRPBep.value = Math.max.apply(Math, yAxisPRP.value) / 1.2;
        maxPRPOpt.value = Math.max.apply(Math, yAxisPRP.value);

        capexAnnu.push(response.data[0].realisasi_proyeksi[i].capex_annualized);
        comBDAnnu.push(response.data[0].realisasi_proyeksi[i].cost_component_bd);
        fuelComAnnu.push(response.data[0].realisasi_proyeksi[i].cost_component_c_annualized);
        sumrevenAnnu.push(response.data[0].realisasi_proyeksi[i].total_revenue);
        revenAnnu.push(response.data[0].realisasi_proyeksi[i].revenue_annualized);
        wlcAnnu.push(response.data[0].realisasi_proyeksi[i].total_wlcc_annualized);
        revaAnnu.push(response.data[0].realisasi_proyeksi[i].revenue_komp_a);
        revbAnnu.push(response.data[0].realisasi_proyeksi[i].revenue_komp_b);
        revcAnnu.push(response.data[0].realisasi_proyeksi[i].revenue_komp_c);
        revdAnnu.push(response.data[0].realisasi_proyeksi[i].revenue_komp_d);

        const difference = Math.abs(response.data[0].realisasi_proyeksi[i].total_wlcc_annualized - response.data[0].realisasi_proyeksi[i].revenue_annualized);
        if (difference < selisih) {
          indexTerdekat = i;
          indexBEP = i + 1;
          selisih = difference;
          tahunBEP = response.data[0].realisasi_proyeksi[i].tahun
        }

        const finalOptimum = Math.max.apply(Math, profitLoss.value)
        if (finalOptimum == response.data[0].realisasi_proyeksi[i].profit_loss) {
          indexOptimum = i
          indexOpt = i + 1
          tahunOptimum = response.data[0].realisasi_proyeksi[i].tahun
        }
      }

      var maxCapex = Math.max.apply(Math, capexAnnu);
      var maxComBD = Math.max.apply(Math, comBDAnnu);
      var maxFuelCom = Math.max.apply(Math, fuelComAnnu);
      var maxsumRev = Math.max.apply(Math, sumrevenAnnu);
      var maxRev = Math.max.apply(Math, revenAnnu);
      var maxWlc = Math.max.apply(Math, wlcAnnu);
      var maxRevA = Math.max.apply(Math, revaAnnu);
      var maxRevB = Math.max.apply(Math, revbAnnu);
      var maxRevC = Math.max.apply(Math, revcAnnu);
      var maxRevD = Math.max.apply(Math, revdAnnu);

      var listOfMax = [maxCapex, maxComBD, maxFuelCom, maxsumRev, maxWlc, maxRev, maxRevA, maxRevB, maxRevC, maxRevD];
      finalMax = Math.max.apply(Math, listOfMax);
    } else {
      dataPRPMesin == null;
    }

    dataPRPPlanMesin.value = response.data[0].planning;

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

    if (response.data[0].planning != null) {
      var capexAnnu: number[] = [];
      var comBDAnnu: number[] = [];
      var fuelComAnnu: number[] = [];
      var sumrevenAnnu: number[] = [];
      var revenAnnu: number[] = [];
      var wlcAnnu: number[] = [];
      var revaAnnu: number[] = [];
      var revbAnnu: number[] = [];
      var revcAnnu: number[] = [];
      var revdAnnu: number[] = [];
      var finalMaxPlan: any;

      for (var j = 0; j < response.data[0].planning.length; j++) {
        tahunPRPPlan.value.push(response.data[0].planning[j].tahun);
        capexPRPPlanMesin.value.push(response.data[0].planning[j].capex_annualized);
        comBDPRPPlanMesin.value.push(response.data[0].planning[j].cost_component_bd);
        fuelComPRPPlanMesin.value.push(
          response.data[0].planning[j].cost_component_c_annualized
        );
        revPRPPlanMesin.value.push(response.data[0].planning[j].revenue_annualized);
        sumLccPRPPlanMesin.value.push(response.data[0].planning[j].total_wlcc_annualized);
        profitLoss.value.push(response.data[0].planning[j].profit_loss);
        sumRevPRPPlanMesin.value.push(response.data[0].planning[j].total_revenue);
        revAPRPPlanMesin.value.push(response.data[0].planning[j].revenue_komp_a);
        revBPRPPlanMesin.value.push(response.data[0].planning[j].revenue_komp_b);
        revCPRPPlanMesin.value.push(response.data[0].planning[j].revenue_komp_c);
        revDPRPPlanMesin.value.push(response.data[0].planning[j].revenue_komp_d);
        yAxisPRPPlan.value.push(response.data[0].planning[j].capex_annualized + response.data[0].planning[j].cost_component_bd + response.data[0].planning[j].cost_component_c_annualized);
        maxPRPPlanBep.value = Math.max.apply(Math, yAxisPRPPlan.value) / 1.4;
        maxPRPPlanOpt.value = Math.max.apply(Math, yAxisPRPPlan.value) / 1.6;

        capexAnnu.push(response.data[0].planning[j].capex_annualized);
        comBDAnnu.push(response.data[0].planning[j].cost_component_bd);
        fuelComAnnu.push(response.data[0].planning[j].cost_component_c_annualized);
        sumrevenAnnu.push(response.data[0].planning[j].total_revenue);
        revenAnnu.push(response.data[0].planning[j].revenue_annualized);
        wlcAnnu.push(response.data[0].planning[j].total_wlcc_annualized);
        revaAnnu.push(response.data[0].planning[j].revenue_komp_a);
        revbAnnu.push(response.data[0].planning[j].revenue_komp_b);
        revcAnnu.push(response.data[0].planning[j].revenue_komp_c);
        revdAnnu.push(response.data[0].planning[j].revenue_komp_d);

        const difference = Math.abs(response.data[0].planning[j].total_wlcc_annualized - response.data[0].planning[j].revenue_annualized);
        if (difference < selisihPlan) {
          indexTerdekatPlan = j;
          indexBEPPlan = j + 1;
          selisihPlan = difference;
          tahunBEPPlan = response.data[0].planning[j].tahun
        }

        // const diffOptPlan = Math.min.apply(Math, sumLccPRPPlanMesin.value)
        // if (diffOptPlan < selisihOptPlan) {
        //   indexOptimumPlan = j;
        //   indexOptPlan = j + 1;
        //   selisihOptPlan = diffOptPlan;
        //   tahunOptimumPlan = response.data[0].planning[j].tahun
        // }
        const finalOptimum = Math.max.apply(Math, profitLoss.value)
        if (finalOptimum == response.data[0].planning[j].profit_loss) {
          indexOptimumPlan = j
          indexOptPlan = j + 1
          tahunOptimumPlan = response.data[0].planning[j].tahun
        }
      }
      var maxCapex = Math.max.apply(Math, capexAnnu);
      var maxComBD = Math.max.apply(Math, comBDAnnu);
      var maxFuelCom = Math.max.apply(Math, fuelComAnnu);
      var maxsumRev = Math.max.apply(Math, sumrevenAnnu);
      var maxRev = Math.max.apply(Math, revenAnnu);
      var maxWlc = Math.max.apply(Math, wlcAnnu);
      var maxRevA = Math.max.apply(Math, revaAnnu);
      var maxRevB = Math.max.apply(Math, revbAnnu);
      var maxRevC = Math.max.apply(Math, revcAnnu);
      var maxRevD = Math.max.apply(Math, revdAnnu);

      var listOfMax = [maxCapex, maxComBD, maxFuelCom, maxsumRev, maxWlc, maxRev, maxRevA, maxRevB, maxRevC, maxRevD];
      finalMaxPlan = Math.max.apply(Math, listOfMax);
      console.log(profitLoss.value)
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
          "Total LCC Annualized",
          "Cost Component A (Capex) Annualized",
          "Cost Component B + D Annualized",
          "Cost Component C Annualized",
          "FS: Revenue Annualized",
          "FS: Total LCC Annualized",
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
        top: "5%",
        left: "3%",
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
              const filterTahun = tahunData.value.toString();
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
            padding: [30, 20, 25, -25],
            fontSize: 14,
            color: "#4D5E80",
            fontWeight: "bold",
          },
          axisLabel: {
            fontSize: 10,
            formatter: function (value: any) {
              return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
            },
          },
          splitNumber: 20,
          min: 0,
          // max: finalMax,
          max: function () {
            if (finalMax > finalMaxPlan) {
              return finalMax;
            } else if (finalMax < finalMaxPlan) {
              return finalMaxPlan;
            }
          }
        },
      ],
      series: [
        {
          name: "Revenue Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: revPRPMesin,
          color: "#489FB7",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Total LCC Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: sumLccPRPMesin,
          color: "#1E1F4E",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Cost Component A (Capex) Annualized",
          type: "bar",
          stack: "Ad",
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
            data: [{ name: 'Max', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: finalMax }],
            symbolOffset: [10, 0]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'BEP', xAxis: indexTerdekat }, { xAxis: indexTerdekat }]]
          },
          color: "#A8E2FC",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Cost Component B + D Annualized",
          type: "bar",
          stack: "Ad",
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
            data: [{ name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: finalMax }],
            symbolOffset: [10, 20]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'Optimum Life', xAxis: indexOptimum }, { xAxis: indexOptimum }]]
          },
          color: "#212E7C",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            borderRadius: [2, 2, 0, 0],
          },
          data: fuelComPRPMesin,
          color: "#4EB180",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Total LCC Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: {
            type: "dashed",
          },
          data: sumLccPRPPlanMesin,
          color: "#7A7A7A",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            symbolSize: [95, 30],
            itemStyle: { color: '#0D5A71' },
            label: { fontSize: 10, fontWeight: 'bold' },
            data: [{ name: 'Max', value: `BEP FS : ${tahunBEPPlan} (${indexBEPPlan})`, xAxis: indexTerdekatPlan, yAxis: finalMaxPlan }],
            symbolOffset: [-10, 20]
          },
          markArea: {
            silent: true,
            itemStyle: {
              color: '#E2EAF2'
            },
            label: { show: false },
            data: [[{ name: 'BEP FS', xAxis: indexTerdekatPlan }, { xAxis: indexTerdekatPlan }]]
          },
          color: "#DDDDDD",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            data: [{ name: 'Min', value: `Optimum life FS : \n ${tahunOptimumPlan} (${indexOptPlan})`, xAxis: indexOptimumPlan, yAxis: finalMaxPlan }],
            symbolOffset: [-10, 30]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'Optimum Life FS', xAxis: indexOptimumPlan }, { xAxis: indexOptimumPlan }]]
          },
          color: "#BFBFBF",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
      ],
    };

    // No Planning
    chartPRPMesin_NoPlan.value = {
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
          "FS: Revenue Annualized",
          "FS: Total LCC Annualized",
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
        top: "5%",
        left: "3%",
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
              const filterTahun = tahunData.value.toString();
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
            padding: [30, 20, 25, -25],
            fontSize: 14,
            color: "#4D5E80",
            fontWeight: "bold",
          },
          axisLabel: {
            fontSize: 10,
            formatter: function (value: any) {
              return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
            },
          },
          splitNumber: 20,
          min: 0,
          // max: finalMax,
          max: function () {
            if (finalMax > finalMaxPlan) {
              return finalMax;
            } else if (finalMax < finalMaxPlan) {
              return finalMaxPlan;
            }
          }
        },
      ],
      series: [
        {
          name: "Revenue Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: revPRPMesin,
          color: "#489FB7",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Total LCC Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: sumLccPRPMesin,
          color: "#1E1F4E",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Cost Component A (Capex) Annualized",
          type: "bar",
          stack: "Ad",
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
            data: [{ name: 'Max', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: finalMax }],
            symbolOffset: [10, 0]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'BEP', xAxis: indexTerdekat }, { xAxis: indexTerdekat }]]
          },
          color: "#A8E2FC",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Cost Component B + D Annualized",
          type: "bar",
          stack: "Ad",
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
            data: [{ name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: finalMax }],
            symbolOffset: [10, 10]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'Optimum Life', xAxis: indexOptimum }, { xAxis: indexOptimum }]]
          },
          color: "#212E7C",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            borderRadius: [2, 2, 0, 0],
          },
          data: fuelComPRPMesin,
          color: "#4EB180",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Total LCC Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: {
            type: "dashed",
          },
          data: sumLccPRPPlanMesin,
          color: "#7A7A7A",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          color: "#DDDDDD",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          color: "#BFBFBF",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
      ],
    };

    // Planning
    chartPRPMesin_Plan.value = {
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
          "FS: Revenue Annualized",
          "FS: Total LCC Annualized",
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
        top: "5%",
        left: "3%",
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
              const filterTahun = tahunData.value.toString();
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
            padding: [30, 20, 25, -25],
            fontSize: 14,
            color: "#4D5E80",
            fontWeight: "bold",
          },
          axisLabel: {
            fontSize: 10,
            formatter: function (value: any) {
              return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
            },
          },
          splitNumber: 20,
          min: 0,
          // max: maxPRPPlanBep,
          max: function () {
            if (finalMax > finalMaxPlan) {
              return finalMax;
            } else if (finalMax < finalMaxPlan) {
              return finalMaxPlan;
            }
          }
        },
      ],
      series: [
        {
          name: "Revenue Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: revPRPMesin,
          color: "#489FB7",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Total LCC Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: sumLccPRPMesin,
          color: "#1E1F4E",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Cost Component A (Capex) Annualized",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: capexPRPMesin,
          color: "#A8E2FC",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Cost Component B + D Annualized",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: comBDPRPMesin,
          color: "#212E7C",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            borderRadius: [2, 2, 0, 0],
          },
          data: fuelComPRPMesin,
          color: "#4EB180",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Total LCC Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: {
            type: "dashed",
          },
          data: sumLccPRPPlanMesin,
          color: "#7A7A7A",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            symbolSize: [95, 30],
            itemStyle: { color: '#0D5A71' },
            label: { fontSize: 10, fontWeight: 'bold' },
            data: [{ name: 'Max', value: `BEP FS : ${tahunBEPPlan} (${indexBEPPlan})`, xAxis: indexTerdekatPlan, yAxis: finalMaxPlan }],
            symbolOffset: [-10, 0]
          },
          markArea: {
            silent: true,
            itemStyle: {
              color: '#E2EAF2'
            },
            label: { show: false },
            data: [[{ name: 'BEP FS', xAxis: indexTerdekatPlan }, { xAxis: indexTerdekatPlan }]]
          },
          color: "#DDDDDD",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            data: [{ name: 'Min', value: `Optimum life FS : \n ${tahunOptimumPlan} (${indexOptPlan})`, xAxis: indexOptimumPlan, yAxis: finalMaxPlan }],
            symbolOffset: [-10, 10]
          },
          markArea: {
            silent: true,
            itemStyle: { color: '#E2EAF2' },
            label: { show: false },
            data: [[{ name: 'Optimum Life FS', xAxis: indexOptimumPlan }, { xAxis: indexOptimumPlan }]]
          },
          color: "#BFBFBF",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
      ],
    };
    forceRender3();
  } catch (error) {
    console.error('Fetch Grafik PRP Mesin', error)
  }
}

const fetchGrafikPRPLastYearMesin = async () => {
  try {
    const response: any = await grafikService.getGrafikPRPLastYearMesin({ id_mesin: props.idMesin, tahun_realisasi: tahunData.value })
    // let indexTerdekat;
    // let tahunBEP;
    // let indexBEP;
    // let indexOpt;
    // let indexOptimum;
    // let tahunOptimum;
    // let indexTerdekatPlan;
    // let tahunBEPPlan;
    // let indexBEPPlan;
    // let indexOptPlan;
    // let indexOptimumPlan;
    // let tahunOptimumPlan;
    // let selisih = Infinity;
    // let selisihOpt = Infinity;
    // let selisihPlan = Infinity;
    // let selisihOptPlan = Infinity;

    dataPRPLastYearMesin.value = response.data[0].realisasi_proyeksi;

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

    if (response.data[0].realisasi_proyeksi != null) {
      for (var i = 0; i < response.data[0].realisasi_proyeksi.length; i++) {
        tahunLastYearMesin.value.push(response.data[0].realisasi_proyeksi[i].tahun);
        capexLastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].capex_annualized
        );
        comBDLastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].cost_component_bd
        );
        fuelComLastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].cost_component_c_annualized
        );
        sumRevLastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].total_revenue
        );
        revLastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].revenue_annualized
        );
        sumLccLastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].total_wlcc_annualized
        );
        revALastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].revenue_komp_a
        );
        revBLastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].revenue_komp_b
        );
        revCLastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].revenue_komp_c
        );
        revDLastYearMesin.value.push(
          response.data[0].realisasi_proyeksi[i].revenue_komp_d
        );
        yAxisLastYear.value.push(response.data[0].realisasi_proyeksi[i].capex_annualized + response.data[0].realisasi_proyeksi[i].cost_component_bd + response.data[0].realisasi_proyeksi[i].cost_component_c_annualized);
        // maxLastYearBep.value = Math.max.apply(Math, yAxisLastYear.value) / 1.2;
        // maxLastYearOpt.value = Math.max.apply(Math, yAxisLastYear.value);

        // const difference = Math.abs(response.data[0].realisasi_proyeksi[i].total_wlcc_annualized - response.data[0].realisasi_proyeksi[i].revenue_annualized);
        // if (difference < selisih) {
        //   indexTerdekat = i;
        //   indexBEP = i + 1;
        //   selisih = difference;
        //   tahunBEP = response.data[0].realisasi_proyeksi[i].tahun
        // }

        // const diffOpt = Math.min.apply(Math, sumLccLastYearMesin.value)
        // if (diffOpt < selisihOpt) {
        //   indexOptimum = i;
        //   indexOpt = i + 1;
        //   selisihOpt = diffOpt;
        //   tahunOptimum = response.data[0].realisasi_proyeksi[i].tahun
        // }
      }
    } else {
      dataPRPLastYearMesin == null;
    }

    dataPRPLastYearPlanMesin.value = response.data[0].planning;

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

    if (response.data[0].planning != null) {
      for (var j = 0; j < response.data[0].planning.length; j++) {
        tahunLastYearPlanMesin.value.push(
          response.data[0].planning[j].tahun
        );
        capexLastYearPlanMesin.value.push(
          response.data[0].planning[j].capex_annualized
        );
        comBDLastYearPlanMesin.value.push(
          response.data[0].planning[j].cost_component_bd
        );
        fuelComLastYearPlanMesin.value.push(
          response.data[0].planning[j].cost_component_c_annualized
        );
        revLastYearPlanMesin.value.push(
          response.data[0].planning[j].revenue_annualized
        );
        sumLccLastYearPlanMesin.value.push(response.data[0].planning[j].total_wlcc_annualized);
        sumRevLastYearPlanMesin.value.push(
          response.data[0].planning[j].total_revenue
        );
        revALastYearPlanMesin.value.push(
          response.data[0].planning[j].revenue_komp_a
        );
        revBLastYearPlanMesin.value.push(
          response.data[0].planning[j].revenue_komp_b
        );
        revCLastYearPlanMesin.value.push(
          response.data[0].planning[j].revenue_komp_c
        );
        revDLastYearPlanMesin.value.push(
          response.data[0].planning[j].revenue_komp_d
        );
        yAxisLastYearPlan.value.push(response.data[0].planning[j].capex_annualized + response.data[0].planning[j].cost_component_bd + response.data[0].planning[j].cost_component_c_annualized);
        // maxLastYearPlanBep.value = Math.max.apply(Math, yAxisLastYearPlan.value) / 1.4;
        // maxLastYearPlanOpt.value = Math.max.apply(Math, yAxisLastYearPlan.value) / 1.8;

        // const difference = Math.abs(response.data[0].planning[j].total_wlcc_annualized - response.data[0].planning[j].revenue_annualized);
        // if (difference < selisihPlan) {
        //   indexTerdekatPlan = j;
        //   indexBEPPlan = j + 1;
        //   selisihPlan = difference;
        //   tahunBEPPlan = response.data[0].planning[j].tahun
        // }

        // const diffOptPlan = Math.min.apply(Math, sumLccLastYearPlanMesin.value)
        // if (diffOptPlan < selisihOptPlan) {
        //   indexOptimumPlan = j;
        //   indexOptPlan = j + 1;
        //   selisihOptPlan = diffOptPlan;
        //   tahunOptimumPlan = response.data[0].planning[j].tahun
        // }
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
          "Total LCC Annualized",
          "Cost Component A (Capex) Annualized",
          "Cost Component B + D Annualized",
          "Cost Component C Annualized",
          "FS: Revenue Annualized",
          "FS: Total LCC Annualized",
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
        top: "5%",
        left: "3%",
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
              const filterTahun = tahunData.value.toString();
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
            padding: [30, 20, 25, -25],
            fontSize: 14,
            color: "#4D5E80",
            fontWeight: "bold",
          },
          axisLabel: {
            fontSize: 10,
            formatter: function (value: any) {
              return globalFormat.formatRupiah((value * 1000000) / 1000000000000);
            },
          },
          splitNumber: 20,
          min: 0,
          // max: maxLastYearPlanBep
          max: function () {
            const nilaiLY = maxLastYearBep;
            const nilaiLYPlan = maxLastYearPlanBep;
            if (nilaiLY > nilaiLYPlan) {
              return maxLastYearBep;
            } else if (nilaiLY < nilaiLYPlan) {
              return maxLastYearPlanBep;
            }
          }
        },
      ],
      series: [
        {
          name: "Revenue Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: revLastYearMesin,
          color: "#489FB7",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Total LCC Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: sumLccLastYearMesin,
          color: "#1E1F4E",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Cost Component A (Capex) Annualized",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: capexLastYearMesin,
          // markPoint: {
          //   silent: true,
          //   symbol: 'rect',
          //   symbolSize: [80, 30],
          //   itemStyle: { color: '#0D5A71' },
          //   label: { fontSize: 10, fontWeight: 'bold' },
          //   data: [{ name: 'Max', value: `BEP : ${tahunBEP} (${indexBEP})`, xAxis: indexTerdekat, yAxis: maxLastYearBep }],
          //   symbolOffset: [35, 0]
          // },
          // markArea: {
          //   silent: true,
          //   itemStyle: { color: '#E2EAF2' },
          //   label: { show: false },
          //   data: [[{ name: 'BEP', xAxis: indexTerdekat }, { xAxis: indexTerdekat }]]
          // },
          color: "#A8E2FC",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "Cost Component B + D Annualized",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          // markPoint: {
          //   silent: true,
          //   symbol: 'rect',
          //   symbolSize: [85, 30],
          //   itemStyle: { color: '#0D5A71' },
          //   label: { fontSize: 10, fontWeight: 'bold' },
          //   data: [{ name: 'Min', value: `Optimum life : \n ${tahunOptimum} (${indexOpt})`, xAxis: indexOptimum, yAxis: maxLastYearOpt }],
          //   symbolOffset: [35, 0],
          // },
          // markArea: {
          //   silent: true,
          //   itemStyle: { color: '#E2EAF2' },
          //   label: { show: false },
          //   data: [[{ name: 'Optimum Life', xAxis: indexOptimum }, { xAxis: indexOptimum }]]
          // },
          data: comBDLastYearMesin,
          color: "#212E7C",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
            borderRadius: [2, 2, 0, 0],
          },
          data: fuelComLastYearMesin,
          color: "#4EB180",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Total LCC Annualized",
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: {
            type: "dashed",
          },
          data: sumLccLastYearPlanMesin,
          color: "#7A7A7A",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Cost Component A (Capex) Annualized",
          type: "bar",
          stack: "Ab",
          emphasis: {
            focus: "series",
          },
          // markPoint: {
          //   silent: true,
          //   symbol: 'rect',
          //   symbolSize: [90, 30],
          //   itemStyle: { color: '#0D5A71' },
          //   label: { fontSize: 10, fontWeight: 'bold' },
          //   data: [{ name: 'Max', value: `BEP FS: ${tahunBEPPlan} (${indexBEPPlan})`, xAxis: indexTerdekatPlan, yAxis: maxLastYearPlanBep }],
          //   symbolOffset: [-35, 0]
          // },
          // markArea: {
          //   silent: true,
          //   itemStyle: { color: '#E2EAF2' },
          //   label: { show: false },
          //   data: [[{ name: 'BEP FS', xAxis: indexTerdekatPlan }, { xAxis: indexTerdekatPlan }]]
          // },
          data: capexLastYearPlanMesin,
          color: "#DDDDDD",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          // markPoint: {
          //   silent: true,
          //   symbol: 'rect',
          //   symbolSize: [95, 30],
          //   itemStyle: { color: '#0D5A71' },
          //   label: { fontSize: 10, fontWeight: 'bold' },
          //   data: [{ name: 'Min', value: `Optimum life FS: \n ${tahunOptimumPlan} (${indexOptPlan})`, xAxis: indexOptimumPlan, yAxis: maxLastYearPlanOpt }],
          //   symbolOffset: [-35, 0]
          // },
          // markArea: {
          //   silent: true,
          //   itemStyle: { color: '#E2EAF2' },
          //   label: { show: false },
          //   data: [[{ name: 'Optimum Life FS', xAxis: indexOptimumPlan }, { xAxis: indexOptimumPlan }]]
          // },
          color: "#BFBFBF",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
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
              globalFormat.formatDecimal(value) + " Rp(Juta)",
          },
        },
      ],
    };
    forceRender4();
  } catch (error) {
    console.error('Fetch Grafik PRP Last Year Mesin', error)
  }
}

const fetchRealisasiProyeksiMesin = async () => {
  try {
    const response: any = await grafikService.getRealisasiProyeksiMesin({
      tahun: tahunData.value, id_mesin: props.idMesin
    })
    statusApprove.value = response.data.status;
  } catch (error) {
    console.error('Fetch Realisasi Proyeksi Mesin Error', error);
  }
}

const fetchPlanningMesin = async () => {
  try {
    const response: any = await grafikService.getPlanningMesin({ id_mesin: props.idMesin })
    statusApprovePlanning.value = response.data.status;
  } catch (error) {
    console.error('Fetch Planning Mesin Error', error)
  }
}

onMounted(async () => {
  AOS.init();
  isLoading.value = true;
  await fetchGrafikWLCAllMesin();
  await fetchGrafikWLCKomMesin();
  await fetchGrafikPlanMesin();
  await fetchGrafikPlanKomMesin();
  await fetchGrafikPRPMesin();
  await fetchGrafikPRPLastYearMesin();
  await fetchRealisasiProyeksiMesin();
  await fetchPlanningMesin();
  isLoading.value = false;
});


watch(tahunData, async (tahun) => {
  isLoading.value = true;
  await fetchGrafikWLCAllMesin();
  await fetchGrafikWLCKomMesin();
  await fetchGrafikPlanMesin();
  await fetchGrafikPlanKomMesin();
  await fetchGrafikPRPMesin();
  await fetchGrafikPRPLastYearMesin();
  await fetchRealisasiProyeksiMesin();
  await fetchPlanningMesin();
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