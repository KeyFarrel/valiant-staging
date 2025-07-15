<template>
  <div class="w-full bg-white rounded-md h-52">
    <div class="flex px-3 py-2">
      <div class="flex items-center justify-center mr-2 rounded-full w-7 h-7 bg-slate-200">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.25 7.5H19.125L13.5 1.875V6.75C13.5 6.94891 13.579 7.13968 13.7197 7.28033C13.8603 7.42098 14.0511 7.5 14.25 7.5ZM14.25 9C13.6533 9 13.081 8.76295 12.659 8.34099C12.2371 7.91903 12 7.34674 12 6.75V1.5H6.75C6.15326 1.5 5.58097 1.73705 5.15901 2.15901C4.73705 2.58097 4.5 3.15326 4.5 3.75V20.25C4.5 20.8467 4.73705 21.419 5.15901 21.841C5.58097 22.2629 6.15326 22.5 6.75 22.5H17.25C17.8467 22.5 18.419 22.2629 18.841 21.841C19.2629 21.419 19.5 20.8467 19.5 20.25V9H14.25ZM9 18.75C9 18.9489 8.92098 19.1397 8.78033 19.2803C8.63968 19.421 8.44891 19.5 8.25 19.5C8.05109 19.5 7.86032 19.421 7.71967 19.2803C7.57902 19.1397 7.5 18.9489 7.5 18.75V9.75C7.5 9.55109 7.57902 9.36032 7.71967 9.21967C7.86032 9.07902 8.05109 9 8.25 9C8.44891 9 8.63968 9.07902 8.78033 9.21967C8.92098 9.36032 9 9.55109 9 9.75V18.75ZM12.75 18.75C12.75 18.9489 12.671 19.1397 12.5303 19.2803C12.3897 19.421 12.1989 19.5 12 19.5C11.8011 19.5 11.6103 19.421 11.4697 19.2803C11.329 19.1397 11.25 18.9489 11.25 18.75V15.75C11.25 15.5511 11.329 15.3603 11.4697 15.2197C11.6103 15.079 11.8011 15 12 15C12.1989 15 12.3897 15.079 12.5303 15.2197C12.671 15.3603 12.75 15.5511 12.75 15.75V18.75ZM16.5 18.75C16.5 18.9489 16.421 19.1397 16.2803 19.2803C16.1397 19.421 15.9489 19.5 15.75 19.5C15.5511 19.5 15.3603 19.421 15.2197 19.2803C15.079 19.1397 15 18.9489 15 18.75V12.75C15 12.5511 15.079 12.3603 15.2197 12.2197C15.3603 12.079 15.5511 12 15.75 12C15.9489 12 16.1397 12.079 16.2803 12.2197C16.421 12.3603 16.5 12.5511 16.5 12.75V18.75Z"
            fill="#4D5E80" />
        </svg>
      </div>
      <div>
        <p class="text-sm text-[#7B8DAD] mt-1">Planning / Feasibility Study</p>
      </div>
    </div>
    <hr class="mb-2" />
    <div class="text-xs">
      <div class="flex justify-between px-3 py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataPlanningMesin.fs_wacc_on_project
            ? globalFormat.formatRupiah(dataPlanningMesin.fs_wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_irr_project === '' ? 'NUM' :
                globalFormat.formatRupiah(dataPlanningMesin.fs_irr_project)
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataPlanningMesin.fs_wacc_on_equity
            ? globalFormat.formatRupiah(dataPlanningMesin.fs_wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_irr_equity === '' ? 'NUM' : globalFormat.formatRupiah(dataPlanningMesin.fs_irr_equity)
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_npv_project
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_npv_project)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_npv_equity
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_npv_equity)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_average_cf
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_average_cf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_average_eaf
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_average_eaf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full bg-white rounded-md h-52">
    <div class="flex px-3 py-2">
      <div class="flex items-center justify-center mr-2 rounded-full w-7 h-7 bg-slate-200">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.25 7.5H19.125L13.5 1.875V6.75C13.5 6.94891 13.579 7.13968 13.7197 7.28033C13.8603 7.42098 14.0511 7.5 14.25 7.5ZM14.25 9C13.6533 9 13.081 8.76295 12.659 8.34099C12.2371 7.91903 12 7.34674 12 6.75V1.5H6.75C6.15326 1.5 5.58097 1.73705 5.15901 2.15901C4.73705 2.58097 4.5 3.15326 4.5 3.75V20.25C4.5 20.8467 4.73705 21.419 5.15901 21.841C5.58097 22.2629 6.15326 22.5 6.75 22.5H17.25C17.8467 22.5 18.419 22.2629 18.841 21.841C19.2629 21.419 19.5 20.8467 19.5 20.25V9H14.25ZM9 18.75C9 18.9489 8.92098 19.1397 8.78033 19.2803C8.63968 19.421 8.44891 19.5 8.25 19.5C8.05109 19.5 7.86032 19.421 7.71967 19.2803C7.57902 19.1397 7.5 18.9489 7.5 18.75V9.75C7.5 9.55109 7.57902 9.36032 7.71967 9.21967C7.86032 9.07902 8.05109 9 8.25 9C8.44891 9 8.63968 9.07902 8.78033 9.21967C8.92098 9.36032 9 9.55109 9 9.75V18.75ZM12.75 18.75C12.75 18.9489 12.671 19.1397 12.5303 19.2803C12.3897 19.421 12.1989 19.5 12 19.5C11.8011 19.5 11.6103 19.421 11.4697 19.2803C11.329 19.1397 11.25 18.9489 11.25 18.75V15.75C11.25 15.5511 11.329 15.3603 11.4697 15.2197C11.6103 15.079 11.8011 15 12 15C12.1989 15 12.3897 15.079 12.5303 15.2197C12.671 15.3603 12.75 15.5511 12.75 15.75V18.75ZM16.5 18.75C16.5 18.9489 16.421 19.1397 16.2803 19.2803C16.1397 19.421 15.9489 19.5 15.75 19.5C15.5511 19.5 15.3603 19.421 15.2197 19.2803C15.079 19.1397 15 18.9489 15 18.75V12.75C15 12.5511 15.079 12.3603 15.2197 12.2197C15.3603 12.079 15.5511 12 15.75 12C15.9489 12 16.1397 12.079 16.2803 12.2197C16.421 12.3603 16.5 12.5511 16.5 12.75V18.75Z"
            fill="#4D5E80" />
        </svg>
      </div>
      <div>
        <p class="text-sm text-[#7B8DAD] mt-1">
          WLC (Realisasi & Proyeksi) ({{ tahunData }})
        </p>
      </div>
    </div>
    <hr class="mb-2" />
    <div class="text-xs">
      <div class="flex justify-between px-3 py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataRealisasiMesin.wacc_on_project
            ? globalFormat.formatRupiah(dataRealisasiMesin.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <div v-if="parseFloat(dataRealisasiMesin.irr_project) > parseFloat(dataPlanningMesin.fs_irr_project)"
            class="mr-1">
            <FSGreenUp />
          </div>
          <div v-else-if="parseFloat(dataRealisasiMesin.irr_project) < parseFloat(dataPlanningMesin.fs_irr_project)"
            class="mr-1">
            <FSRedDown />
          </div>
          <div v-else-if="parseFloat(dataRealisasiMesin.irr_project) == parseFloat(dataPlanningMesin.fs_irr_project)"
            class="mr-2 ml-2.5 mt-0.5">
            <FSRedSame />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.irr_project === '' ? 'NUM' : globalFormat.formatRupiah(dataRealisasiMesin.irr_project)
            }}
          </p>
          <p class="text-slate-500">%</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.irr_project) > parseFloat(dataYoyMesin.irr_project)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.irr_project) < parseFloat(dataYoyMesin.irr_project)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.irr_project) == parseFloat(dataYoyMesin.irr_project)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataRealisasiMesin.wacc_on_equity
            ? globalFormat.formatRupiah(dataRealisasiMesin.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.irr_equity) > parseFloat(dataPlanningMesin.fs_irr_equity)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.irr_equity) < parseFloat(dataPlanningMesin.fs_irr_equity)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.irr_equity) == parseFloat(dataPlanningMesin.fs_irr_equity)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.irr_equity === '' ? 'NUM' : globalFormat.formatRupiah(dataRealisasiMesin.irr_equity)
            }}
          </p>
          <p class="text-slate-500">%</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.irr_equity) > parseFloat(dataYoyMesin.irr_equity)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.irr_equity) < parseFloat(dataYoyMesin.irr_equity)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.irr_equity) == parseFloat(dataYoyMesin.irr_equity)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.npv_project) > parseFloat(dataPlanningMesin.fs_npv_project)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.npv_project) < parseFloat(dataPlanningMesin.fs_npv_project)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.npv_project) == parseFloat(dataPlanningMesin.fs_npv_project)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.npv_project
                ? globalFormat.formatRupiah(dataRealisasiMesin.npv_project)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.npv_project) > parseFloat(dataYoyMesin.npv_project)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.npv_project) < parseFloat(dataYoyMesin.npv_project)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.npv_project) == parseFloat(dataYoyMesin.npv_project)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.npv_equity) > parseFloat(dataPlanningMesin.fs_npv_equity)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.npv_equity) < parseFloat(dataPlanningMesin.fs_npv_equity)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.npv_equity) == parseFloat(dataPlanningMesin.fs_npv_equity)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.npv_equity
                ? globalFormat.formatRupiah(dataRealisasiMesin.npv_equity)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.npv_equity) > parseFloat(dataYoyMesin.npv_equity)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.npv_equity) < parseFloat(dataYoyMesin.npv_equity)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.npv_equity) == parseFloat(dataYoyMesin.npv_equity)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.average_cf) > parseFloat(dataPlanningMesin.fs_average_cf)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.average_cf) < parseFloat(dataPlanningMesin.fs_average_cf)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.average_cf) == parseFloat(dataPlanningMesin.fs_average_cf)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.average_cf
                ? globalFormat.formatRupiah(dataRealisasiMesin.average_cf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.average_cf) > parseFloat(dataYoyMesin.average_cf)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.average_cf) < parseFloat(dataYoyMesin.average_cf)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.average_cf) == parseFloat(dataYoyMesin.average_cf)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.average_eaf) > parseFloat(dataPlanningMesin.fs_average_eaf)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.average_eaf) < parseFloat(dataPlanningMesin.fs_average_eaf)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.average_eaf) == parseFloat(dataPlanningMesin.fs_average_eaf)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.average_eaf
                ? globalFormat.formatRupiah(dataRealisasiMesin.average_eaf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.average_eaf) > parseFloat(dataYoyMesin.average_eaf)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.average_eaf) < parseFloat(dataYoyMesin.average_eaf)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.average_eaf) == parseFloat(dataYoyMesin.average_eaf)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full bg-white rounded-md h-52">
    <div class="flex px-3 py-2">
      <div class="flex items-center justify-center mr-2 rounded-full w-7 h-7 bg-slate-200">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.25 7.5H19.125L13.5 1.875V6.75C13.5 6.94891 13.579 7.13968 13.7197 7.28033C13.8603 7.42098 14.0511 7.5 14.25 7.5ZM14.25 9C13.6533 9 13.081 8.76295 12.659 8.34099C12.2371 7.91903 12 7.34674 12 6.75V1.5H6.75C6.15326 1.5 5.58097 1.73705 5.15901 2.15901C4.73705 2.58097 4.5 3.15326 4.5 3.75V20.25C4.5 20.8467 4.73705 21.419 5.15901 21.841C5.58097 22.2629 6.15326 22.5 6.75 22.5H17.25C17.8467 22.5 18.419 22.2629 18.841 21.841C19.2629 21.419 19.5 20.8467 19.5 20.25V9H14.25ZM9 18.75C9 18.9489 8.92098 19.1397 8.78033 19.2803C8.63968 19.421 8.44891 19.5 8.25 19.5C8.05109 19.5 7.86032 19.421 7.71967 19.2803C7.57902 19.1397 7.5 18.9489 7.5 18.75V9.75C7.5 9.55109 7.57902 9.36032 7.71967 9.21967C7.86032 9.07902 8.05109 9 8.25 9C8.44891 9 8.63968 9.07902 8.78033 9.21967C8.92098 9.36032 9 9.55109 9 9.75V18.75ZM12.75 18.75C12.75 18.9489 12.671 19.1397 12.5303 19.2803C12.3897 19.421 12.1989 19.5 12 19.5C11.8011 19.5 11.6103 19.421 11.4697 19.2803C11.329 19.1397 11.25 18.9489 11.25 18.75V15.75C11.25 15.5511 11.329 15.3603 11.4697 15.2197C11.6103 15.079 11.8011 15 12 15C12.1989 15 12.3897 15.079 12.5303 15.2197C12.671 15.3603 12.75 15.5511 12.75 15.75V18.75ZM16.5 18.75C16.5 18.9489 16.421 19.1397 16.2803 19.2803C16.1397 19.421 15.9489 19.5 15.75 19.5C15.5511 19.5 15.3603 19.421 15.2197 19.2803C15.079 19.1397 15 18.9489 15 18.75V12.75C15 12.5511 15.079 12.3603 15.2197 12.2197C15.3603 12.079 15.5511 12 15.75 12C15.9489 12 16.1397 12.079 16.2803 12.2197C16.421 12.3603 16.5 12.5511 16.5 12.75V18.75Z"
            fill="#4D5E80" />
        </svg>
      </div>
      <div>
        <p class="text-sm text-[#7B8DAD] mt-1">
          Realisasi - Proyeksi (YoY) ({{ tahunData - 1 }})
        </p>
      </div>
    </div>
    <hr class="mb-2" />
    <div class="text-xs">
      <div class="flex justify-between px-3 py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataYoyMesin.wacc_on_project
            ? globalFormat.formatRupiah(dataYoyMesin.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataYoyMesin.irr_project === '' ? 'NUM' : globalFormat.formatRupiah(dataYoyMesin.irr_project)
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataYoyMesin.wacc_on_equity
            ? globalFormat.formatRupiah(dataYoyMesin.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataYoyMesin.irr_equity === '' ? 'NUM' : globalFormat.formatRupiah(dataYoyMesin.irr_equity)
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataYoyMesin.npv_project
                ? globalFormat.formatRupiah(dataYoyMesin.npv_project)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataYoyMesin.npv_equity
                ? globalFormat.formatRupiah(dataYoyMesin.npv_equity)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataYoyMesin.average_cf
                ? globalFormat.formatRupiah(dataYoyMesin.average_cf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between px-3 py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataYoyMesin.average_eaf
                ? globalFormat.formatRupiah(dataYoyMesin.average_eaf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import PopUp from "@/components/Grafik/PoupWacc.vue";
import FSRedDown from "@/components/icons/FSRedDown.vue";
import FSGreenUp from "@/components/icons/FSGreenUp.vue";
import FSRedSame from "@/components/icons/FSRedSame.vue";
import YoyRedDown from "@/components/icons/YoyRedDown.vue";
import YoyGreenUp from "@/components/icons/YoyGreenUp.vue";
import YoyRedSame from "@/components/icons/YoyRedSame.vue";
import GrafikService from "@/services/grafik-service";
import GlobalFormat from "@/services/format/global-format";

const isLoading = ref(false);
const globalFormat = new GlobalFormat();
const grafikService = new GrafikService();
const dataPlanningMesin = ref<PlanningItem>({});
const dataRealisasiMesin = ref<RelProyItem>({});
const dataYoyMesin = ref<RelYoyItem>({});
const props = defineProps<Mesin>();
const tahunData = computed(() => props.tahunData);

interface Mesin {
  idMesin: number
  tahunData: number
}

interface PlanningItem {
  data: any
  mesin: string
  fs_wacc_on_project: string
  fs_wacc_on_equity: string
  fs_average_cf: string
  fs_average_eaf: string
  fs_irr_equity: string
  fs_irr_project: string
  fs_npv_equity: string
  fs_npv_project: string
}

interface RelProyItem {
  data: any
  mesin: string
  wacc_on_project: string
  wacc_on_equity: string
  average_cf: string
  average_eaf: string
  irr_equity: string
  irr_project: string
  npv_equity: string
  npv_project: string
}

interface RelYoyItem {
  data: any
  mesin: string
  wacc_on_project: string
  wacc_on_equity: string
  average_cf: string
  average_eaf: string
  irr_equity: string
  irr_project: string
  npv_equity: string
  npv_project: string
}

const fetchPlanningMesin = async () => {
  try {
    const response: any = await grafikService.getPlanningMesin({ uuid_mesin: props.idMesin })
    dataPlanningMesin.value = response.data
  } catch (error) {
    console.error('Fetch Planning Mesin Error :', error)
  }
}

const fetchRealisasiProyeksiMesin = async () => {
  try {
    const response: any = await grafikService.getRealisasiProyeksiMesin({ tahun: tahunData.value, uuid_mesin: props.idMesin })
    dataRealisasiMesin.value = response.data
  } catch (error) {
    console.error('Fetch Planning Mesin Error :', error)
  }
}
const fetchRealisasiYoyMesin = async () => {
  try {
    const response: any = await grafikService.getRealisasiYoyMesin({ uuid_mesin: props.idMesin, tahun: tahunData.value - 1 })
    dataYoyMesin.value = response.data
  } catch (error) {
    console.error('Fetch Planning Mesin Error :', error)
  }
}

watch(tahunData, async (tahun) => {
  isLoading.value = true
  await fetchPlanningMesin()
  await fetchRealisasiProyeksiMesin()
  await fetchRealisasiYoyMesin()
  isLoading.value = false
})

onMounted(async () => {
  isLoading.value = true
  await fetchPlanningMesin()
  await fetchRealisasiProyeksiMesin()
  await fetchRealisasiYoyMesin()
  isLoading.value = false
})
</script>
