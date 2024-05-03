<template>
  <div v-if="isLoading">
    <Loading />
  </div>
  <div v-else>
    <!-- Buttons -->
    <div class="w-full bg-white border rounded-md h-28">
      <div class="justify-between md:flex">
        <div class="flex items-center px-4 py-3">
          <input type="search" autocomplete="off" id="search-dropdown"
            class="block p-3 w-60 text-sm text-gray-900 rounded-l-lg border-l-2 border border-[#0099AD] focus:ring-[#80C1CD] focus:border-[#80C1CD]"
            placeholder="Cari..." />
          <button type="submit"
            class="relative float-left p-3 text-sm font-medium text-white bg-[#0099AD] rounded-r-lg border border-[#0099AD] hover:bg-[#007E8F] focus:ring-2 focus:outline-none focus:ring-[#9ddee7]">
            <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="sr-only">Search</span>
          </button>
          <div class="ml-4 w-28">
            <VueDatePicker v-model="yesterday" year-picker :clearable="false">
              <!-- <template #input-icon>
                    <img
                      class="input-slot-image"
                      src="../../assets/img/Calendar.png"
                    />
                  </template> -->
            </VueDatePicker>
          </div>
        </div>
        <div class="px-4 py-3">
          <button type="button"
            class="relative float-left p-3 text-xs font-medium text-white bg-[#0099AD] rounded-lg border border-[#0099AD] hover:bg-[#007E8F] focus:ring-4 focus:outline-none focus:ring-[#80C1CD]">
            <div class="flex items-center">
              <span class="mr-2">Export</span>
              <svg width="16" height="12" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M6.12508 1.20829C4.75588 1.20829 3.64591 2.31825 3.64591 3.68746C3.64591 3.84553 3.66063 3.99964 3.68862 4.14863C3.74259 4.43595 3.57555 4.71884 3.2979 4.81034C2.48294 5.07892 1.89591 5.84665 1.89591 6.74996C1.89591 7.87754 2.81 8.79163 3.93758 8.79163H10.5001C11.386 8.79163 12.1042 8.07342 12.1042 7.18746C12.1042 6.50304 11.6754 5.91733 11.0697 5.68719C10.774 5.57484 10.6217 5.2473 10.7264 4.94881C10.7686 4.82865 10.7917 4.69889 10.7917 4.56246C10.7917 3.91813 10.2694 3.39579 9.62508 3.39579C9.49836 3.39579 9.37744 3.41579 9.26468 3.45236C9.11237 3.50175 8.94646 3.48637 8.80583 3.40982C8.6652 3.33327 8.56222 3.20228 8.52102 3.04755C8.23896 1.9881 7.27235 1.20829 6.12508 1.20829ZM2.47925 3.68746C2.47925 1.67392 4.11154 0.041626 6.12508 0.041626C7.62264 0.041626 8.90824 0.944132 9.46959 2.23425C9.52103 2.23085 9.57288 2.22913 9.62508 2.22913C10.9137 2.22913 11.9584 3.27379 11.9584 4.56246C11.9584 4.65018 11.9535 4.73689 11.9441 4.82232C12.7393 5.30885 13.2709 6.18556 13.2709 7.18746C13.2709 8.71775 12.0304 9.95829 10.5001 9.95829H3.93758C2.16567 9.95829 0.729248 8.52187 0.729248 6.74996C0.729248 5.50032 1.44338 4.41866 2.48473 3.88884C2.48109 3.82213 2.47925 3.75499 2.47925 3.68746ZM7.00008 3.10413C7.32225 3.10413 7.58341 3.36529 7.58341 3.68746V6.21667L8.3376 5.46248C8.56541 5.23467 8.93475 5.23467 9.16256 5.46248C9.39037 5.69029 9.39037 6.05963 9.16256 6.28744L7.41256 8.03744C7.18475 8.26524 6.81541 8.26524 6.5876 8.03744L4.8376 6.28744C4.6098 6.05963 4.6098 5.69029 4.8376 5.46248C5.06541 5.23467 5.43475 5.23467 5.66256 5.46248L6.41675 6.21667V3.68746C6.41675 3.36529 6.67791 3.10413 7.00008 3.10413Z"
                  fill="white" />
              </svg>
            </div>
          </button>
        </div>
      </div>
      <div class="sticky top-0 z-10 pt-2 bg-white">
        <!--TABS2-->
        <div>
          <ul class="flex pb-2 overflow-x-auto font-medium text-center whitespace-nowrap">
            <li class="ml-5 text-gray-500 transition-all duration-300 cursor-pointer"
              :class="{ selected: 'Unit Sentral' === selectedTitle }" @click="selectedTitle = 'Unit Sentral'">
              Unit Sentral
            </li>
            <li v-for="(item, i) in dataUnit" :key="i"
              class="ml-5 text-gray-500 transition-all duration-300 cursor-pointer"
              :class="{ selected: item.mesin === selectedTitle }" @click="
                changeTabMesin(item.mesin, item.id_mesin);
              consoled();
              ">
              {{ item.mesin }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Tab Sentral -->
    <div v-show="selectedTitle === 'Unit Sentral'" @click="selectedTitle = 'Unit Sentral'">
      <!-- Content 1/Tag -->
      <div class="flex mt-2">
        <div class="w-[873px] h-52 border bg-white rounded-md mr-2 p-4">
          <div class="flex">
            <div class="bg-[url('../assets/img/img-cik.png')] bg-cover bg-center w-40 h-44 rounded-md mr-2"></div>
            <div class="ml-2">
              <div v-if="loading"></div>
              <div v-else class="text-xl font-medium">
                {{ dataSentral.sentral }}
              </div>
              <div class="flex w-full mt-3 h-7">
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Unit Pengelola :</p>
                  <div v-if="loading"></div>
                  <div v-else class="font-bold text-[#007E8F] ml-1">
                    {{ dataSentral.pengelola }}
                  </div>
                </div>
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Unit Pembina :</p>
                  <div v-if="loading"></div>
                  <div v-else class="font-bold text-[#007E8F] ml-1">
                    {{ dataSentral.pembina }}
                  </div>
                </div>
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Kategori Unit Pembangkit :</p>
                  <div v-if="loading"></div>
                  <div v-else class="font-bold text-[#007E8F] ml-1">
                    {{ dataSentral.jenis_pembangkit }}
                  </div>
                </div>
              </div>
              <div class="flex w-full mt-3 h-7">
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Jumlah Unit :</p>
                  <div v-if="loading"></div>
                  <div v-else class="font-bold text-[#007E8F] ml-1">
                    {{ dataSentral.jumlah_mesin }}
                  </div>
                </div>
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Daya Terpasang :</p>
                  <div v-if="loading"></div>
                  <div v-else class="font-bold text-[#007E8F] ml-1">
                    {{ globalFormat.formatEnergy(dataSentral.data_terpasang) }}
                    MW
                  </div>
                </div>
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Daya Mampu (Netto) :</p>
                  <div v-if="loading"></div>
                  <div v-else class="font-bold text-[#007E8F] ml-1">
                    {{ globalFormat.formatEnergy(dataSentral.data_mampu) }} MW
                  </div>
                </div>
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Tahun COD :</p>
                  <div v-if="loading"></div>
                  <div v-else class="font-bold text-[#007E8F] ml-1">
                    {{ dataSentral.tahun }}
                  </div>
                  <div class="flex flex-col items-center ml-2" @mouseover="toggleButton" @mouseout="toggleButton">
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 10C2.2385 10 0 7.7615 0 5C0 2.2385 2.2385 0 5 0C7.7615 0 10 2.2385 10 5C10 7.7615 7.7615 10 5 10ZM4.5 4.5V7.5H5.5V4.5H4.5ZM4.5 2.5V3.5H5.5V2.5H4.5Z"
                        fill="#0099AD" />
                    </svg>
                    <Transition>
                      <div v-if="isHover"
                        class="flex flex-col bg-white absolute text-xs p-2 mt-5 z-10 rounded-lg whitespace-nowrap border space-y-1.5 duration-300"
                        id="tooltipContent">
                        <div class="flex py-1 text-xs" v-for="(item, i) in dataUnit" :key="i">
                          <p class="mr-1 text-slate-400">
                            {{ item.mesin }}
                          </p>
                          <p class="mr-4 text-slate-400">:</p>
                          <p>{{ item.tahun }}</p>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>
              <div class="flex mt-4 text-sm">
                <p class="text-[#7B8DAD] font-bold">Nilai Aset Awal</p>
                <p class="text-[#7B8DAD] ml-1">:</p>
              </div>
              <div class="flex text-sm mt-1.5">
                <p class="mr-2 text-[#7F7F80]">Rp.</p>
                <div v-if="loading"></div>
                <div v-else class="text-[#333333]">
                  {{ globalFormat.formatRupiah(dataSentral.asset_awal) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-auto bg-white border rounded-md h-52">
          <div class="flex justify-between mt-1.5">
            <div class="flex px-3 py-2">
              <div class="flex items-center justify-center mr-2 rounded-full w-7 h-7 bg-slate-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.25 7.5H19.125L13.5 1.875V6.75C13.5 6.94891 13.579 7.13968 13.7197 7.28033C13.8603 7.42098 14.0511 7.5 14.25 7.5ZM14.25 9C13.6533 9 13.081 8.76295 12.659 8.34099C12.2371 7.91903 12 7.34674 12 6.75V1.5H6.75C6.15326 1.5 5.58097 1.73705 5.15901 2.15901C4.73705 2.58097 4.5 3.15326 4.5 3.75V20.25C4.5 20.8467 4.73705 21.419 5.15901 21.841C5.58097 22.2629 6.15326 22.5 6.75 22.5H17.25C17.8467 22.5 18.419 22.2629 18.841 21.841C19.2629 21.419 19.5 20.8467 19.5 20.25V9H14.25ZM9 18.75C9 18.9489 8.92098 19.1397 8.78033 19.2803C8.63968 19.421 8.44891 19.5 8.25 19.5C8.05109 19.5 7.86032 19.421 7.71967 19.2803C7.57902 19.1397 7.5 18.9489 7.5 18.75V9.75C7.5 9.55109 7.57902 9.36032 7.71967 9.21967C7.86032 9.07902 8.05109 9 8.25 9C8.44891 9 8.63968 9.07902 8.78033 9.21967C8.92098 9.36032 9 9.55109 9 9.75V18.75ZM12.75 18.75C12.75 18.9489 12.671 19.1397 12.5303 19.2803C12.3897 19.421 12.1989 19.5 12 19.5C11.8011 19.5 11.6103 19.421 11.4697 19.2803C11.329 19.1397 11.25 18.9489 11.25 18.75V15.75C11.25 15.5511 11.329 15.3603 11.4697 15.2197C11.6103 15.079 11.8011 15 12 15C12.1989 15 12.3897 15.079 12.5303 15.2197C12.671 15.3603 12.75 15.5511 12.75 15.75V18.75ZM16.5 18.75C16.5 18.9489 16.421 19.1397 16.2803 19.2803C16.1397 19.421 15.9489 19.5 15.75 19.5C15.5511 19.5 15.3603 19.421 15.2197 19.2803C15.079 19.1397 15 18.9489 15 18.75V12.75C15 12.5511 15.079 12.3603 15.2197 12.2197C15.3603 12.079 15.5511 12 15.75 12C15.9489 12 16.1397 12.079 16.2803 12.2197C16.421 12.3603 16.5 12.5511 16.5 12.75V18.75Z"
                    fill="#4D5E80" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-[#7B8DAD] mt-1">
                  {{ tabs2 }}
                </p>
              </div>
            </div>
            <div class="mx-4 my-3">
              <div class="flex flex-col items-center cursor-pointer" @click="showElement">
                <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 9C1 9.26522 1.10536 9.51957 1.29289 9.70711C1.48043 9.89464 1.73478 10 2 10C2.26522 10 2.51957 9.89464 2.70711 9.70711C2.89464 9.51957 3 9.26522 3 9C3 8.73478 2.89464 8.48043 2.70711 8.29289C2.51957 8.10536 2.26522 8 2 8C1.73478 8 1.48043 8.10536 1.29289 8.29289C1.10536 8.48043 1 8.73478 1 9ZM1 16C1 16.2652 1.10536 16.5196 1.29289 16.7071C1.48043 16.8946 1.73478 17 2 17C2.26522 17 2.51957 16.8946 2.70711 16.7071C2.89464 16.5196 3 16.2652 3 16C3 15.7348 2.89464 15.4804 2.70711 15.2929C2.51957 15.1054 2.26522 15 2 15C1.73478 15 1.48043 15.1054 1.29289 15.2929C1.10536 15.4804 1 15.7348 1 16ZM1 2C1 2.26522 1.10536 2.51957 1.29289 2.70711C1.48043 2.89464 1.73478 3 2 3C2.26522 3 2.51957 2.89464 2.70711 2.70711C2.89464 2.51957 3 2.26522 3 2C3 1.73478 2.89464 1.48043 2.70711 1.29289C2.51957 1.10536 2.26522 1 2 1C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2Z"
                    stroke="#697586" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <Transition>
                  <div v-if="message"
                    class="flex flex-col bg-white absolute text-xs p-1 mt-3.5 z-10 rounded-lg whitespace-nowrap border space-y-1.5 duration-300"
                    id="FilterContent">
                    <div>
                      <button @click="changePage(1)"
                        class="block text-left px-2 w-full py-2 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                        WLC (Realisasi & Proyeksi)
                      </button>
                    </div>
                    <div>
                      <button @click="changePage(2)"
                        class="block text-left px-2 w-full py-2 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                        Planning / FS
                      </button>
                    </div>
                    <div>
                      <button @click="changePage(3)"
                        class="block text-left px-2 w-full py-2 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                        Planning & Realisasi + Proyeksi
                      </button>
                    </div>
                    <div>
                      <button @click="changePage(4)"
                        class="block text-left px-2 w-full py-2 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                        Planning vs Realisasi s/d Tahun Berjalan
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
          <hr class="mb-1" />
          <div v-if="tabs2 === 'WLC (Realisasi & Proyeksi)'">
            <div class="text-xs">
              <div class="flex justify-between px-3 py-1 text-xs">
                <div class="flex">
                  <div class="text-slate-500">IRR On Project</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <RedDown class="mr-1" />
                  <div v-if="loading"></div>
                  <div v-else-if="dataRealisasi.irr_project == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataRealisasi.irr_project }}
                  </div>
                  <p class="text-slate-500">%</p>
                  <GreenUp class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1 text-xs">
                <div class="flex">
                  <div class="text-slate-500">IRR On Equity</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <GreenUp class="mr-1" />
                  <div v-if="loading"></div>
                  <div v-else-if="dataRealisasi.irr_project == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataRealisasi.irr_project }}
                  </div>
                  <p class="text-slate-500">%</p>
                  <RedDown class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1 text-xs">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <GreenUp class="mr-1" />
                  <div v-if="loading"></div>
                  <div v-else-if="dataRealisasi.npv_project == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(dataRealisasi.npv_project) }}
                  </div>
                  <p class="text-slate-500">Rp (Juta)</p>
                  <RedDown class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1 text-xs">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <GreenUp class="mr-1" />
                  <div v-if="loading"></div>
                  <div v-else-if="dataRealisasi.npv_equity == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(dataRealisasi.npv_equity) }}
                  </div>
                  <p class="text-slate-500">Rp (Juta)</p>
                  <RedDown class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1 text-xs">
                <div class="text-slate-500">Average CF</div>
                <div class="flex">
                  <RedDown class="mr-1" />
                  <div v-if="loading"></div>
                  <div v-else-if="dataRealisasi.average_cf == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataRealisasi.average_cf }}
                  </div>
                  <p class="text-slate-500">%</p>
                  <GreenUp class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1 text-xs">
                <div class="text-slate-500">Average EAF</div>
                <div class="flex">
                  <RedDown class="mr-1" />
                  <div v-if="loading"></div>
                  <div v-else-if="dataRealisasi.average_eaf == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataRealisasi.average_eaf }}
                  </div>
                  <p class="text-slate-500">%</p>
                  <GreenUp class="ml-1" />
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="tabs2 === 'Planning / FS'">
            <div class="text-xs">
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Project</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataPlanning.fs_irr_project }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Equity</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataPlanning.fs_irr_equity }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else class="mr-2 font-bold">
                    {{
                    globalFormat.formatRupiah(dataPlanning.fs_npv_project)
                    }}
                  </div>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else class="mr-2 font-bold">
                    {{
                    globalFormat.formatRupiah(dataPlanning.fs_npv_equity)
                    }}
                  </div>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average CF</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataPlanning.fs_average_cf }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average EAF</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataPlanning.fs_average_eaf }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="tabs2 === 'Planning & Realisasi + Proyeksi'">
            <div class="text-xs">
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Project</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataYoy.irr_project == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataYoy.irr_project }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Equity</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataYoy.irr_equity == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataYoy.irr_equity }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataYoy.npv_project == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(dataYoy.npv_project) }}
                  </div>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataYoy.npv_equity == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(dataYoy.npv_equity) }}
                  </div>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average CF</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataYoy.average_cf == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataYoy.average_cf }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average EAF</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataYoy.average_eaf == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataYoy.average_eaf }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="tabs2 === 'Planning vs Realisasi s/d Tahun Berjalan'">
            <div class="text-xs">
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Project</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataPlanReal.irr_project == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataPlanReal.irr_project }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Equity</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataPlanReal.irr_equity == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataPlanReal.irr_equity }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataPlanReal.npv_project == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(dataPlanReal.npv_project) }}
                  </div>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataPlanReal.npv_equity == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(dataPlanReal.npv_equity) }}
                  </div>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average CF</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataPlanReal.average_cf == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataPlanReal.average_cf }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average EAF</div>
                <div class="flex">
                  <div v-if="loading"></div>
                  <div v-else-if="dataPlanReal.average_eaf == ''" class="mr-2 font-bold">
                    -
                  </div>
                  <div v-else class="mr-2 font-bold">
                    {{ dataPlanReal.average_eaf }}
                  </div>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Content 2/Grafik -->
      <div class="w-full mt-2 bg-white border rounded-md h-1/2">
        <div v-if="tabs2 === 'WLC (Realisasi & Proyeksi)'">
          <div class="flex justify-between">
            <div>
              <h1 class="px-6 pt-4 text-lg font-bold">
                Grafik WLC (Realisasi & Proyeksi)
              </h1>
            </div>
            <div class="flex px-6 pt-3">
              <div class="ml-4 w-28">
                <VueDatePicker v-model="yesterday" year-picker :clearable="false">
                </VueDatePicker>
              </div>
              <button type="button"
                class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                    fill="#0099AD" />
                </svg>
                <p class="ml-2">Lihat Data</p>
              </button>
            </div>
          </div>
          <div class="sticky top-0 z-10 pb-2 bg-white">
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
            <div v-if="chartWLCAll == null">
              <Empty />
            </div>
            <div v-else class="-mt-12">
              <vue-echarts :option="chartWLCAll" style="height: 350px" @click="handleClick" />
              <Legend />
            </div>
          </div>
          <div v-else-if="tabGraphic === 'Biaya Komponen'">
            <div v-if="chartWLCKom == null">
              <Empty />
            </div>
            <div v-else class="-mt-12">
              <vue-echarts :option="chartWLCKom" style="height: 350px" @click="handleClick" />
              <Legend />
            </div>
          </div>
        </div>
        <div v-else-if="tabs2 === 'Planning / FS'">
          <div class="flex justify-between">
            <div>
              <h1 class="px-6 pt-4 text-lg font-bold">Planning / FS</h1>
            </div>
            <div class="flex px-6 pt-3">
              <div class="ml-4 w-28">
                <VueDatePicker v-model="yesterday" year-picker :clearable="false">
                </VueDatePicker>
              </div>
              <button type="button"
                class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                    fill="#0099AD" />
                </svg>
                <p class="ml-2">Lihat Data</p>
              </button>
            </div>
          </div>
          <div v-if="chartPlanning == null">
            <Empty />
          </div>
          <div v-else class="-mt-12">
            <vue-echarts :option="chartPlanning" style="height: 350px" @click="handleClick" />
            <Legend />
          </div>
        </div>
        <div v-else-if="tabs2 === 'Planning & Realisasi + Proyeksi'">
          <div class="flex justify-between">
            <div>
              <h1 class="px-6 pt-4 text-lg font-bold">
                Planning & Realisasi + Proyeksi
              </h1>
            </div>
            <div class="flex px-6 pt-3">
              <div class="ml-4 w-28">
                <VueDatePicker v-model="yesterday" year-picker :clearable="false">
                </VueDatePicker>
              </div>
              <button type="button"
                class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                    fill="#0099AD" />
                </svg>
                <p class="ml-2">Lihat Data</p>
              </button>
            </div>
          </div>
          <div v-if="chartPRP == null">
            <Empty />
          </div>
          <div v-else class="-mt-12">
            <vue-echarts :option="chartPRP" style="height: 350px" @click="handleClick" />
            <Legend />
          </div>
        </div>
        <div v-else-if="tabs2 === 'Planning vs Realisasi s/d Tahun Berjalan'">
          <div class="flex justify-between">
            <div>
              <h1 class="px-6 pt-4 text-lg font-bold">
                Planning vs Realisasi s/d Tahun Berjalan
              </h1>
            </div>
            <div class="flex px-6 pt-3">
              <div class="ml-4 w-28">
                <VueDatePicker v-model="yesterday" year-picker :clearable="false">
                </VueDatePicker>
              </div>
              <button type="button"
                class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                    fill="#0099AD" />
                </svg>
                <p class="ml-2">Lihat Data</p>
              </button>
            </div>
          </div>
          <div v-if="chartLastYear == null">
            <Empty />
          </div>
          <div v-else class="-mt-12">
            <vue-echarts :option="chartLastYear" style="height: 350px" @click="handleClick" />
            <Legend />
          </div>
        </div>
      </div>
      <InfoSentral />
    </div>
    <!-- Tab Mesin -->
    <div v-for="(item, i) in dataUnit" :key="i" v-show="selectedTitle === item.mesin"
      @click="selectedTitle = item.mesin">
      <!-- Content 1/Tag -->
      <div class="flex mt-2">
        <div class="w-[873px] h-52 border bg-white rounded-md mr-2 p-4">
          <div class="flex">
            <div class="bg-[url('../assets/img/img-cik.png')] bg-cover bg-center w-40 h-44 rounded-md mr-2"></div>
            <div class="ml-2">
              <div class="text-xl font-medium">
                {{ item.mesin }}
              </div>
              <div class="flex w-full mt-3 h-7">
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Unit Pengelola :</p>

                  <div class="font-bold text-[#007E8F] ml-1">
                    {{ item.pengelola }}
                  </div>
                </div>
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Unit Pembina :</p>
                  <div class="font-bold text-[#007E8F] ml-1">
                    {{ item.pembina }}
                  </div>
                </div>
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Kategori Unit Pembangkit :</p>
                  <div class="font-bold text-[#007E8F] ml-1">
                    {{ item.jenis_pembangkit }}
                  </div>
                </div>
              </div>
              <div class="flex w-full mt-3 h-7">
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Daya Terpasang :</p>
                  <div class="font-bold text-[#007E8F] ml-1">
                    {{ globalFormat.formatEnergy(item.data_terpasang) }} MW
                  </div>
                </div>
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Daya Mampu (Netto) :</p>
                  <div class="font-bold text-[#007E8F] ml-1">
                    {{ globalFormat.formatEnergy(item.data_mampu) }} MW
                  </div>
                </div>
                <div class="flex items-center rounded-xl border border-[#007E8F] bg-white px-3 py-1 mr-2 text-[10px]">
                  <p class="text-[#007E8F]">Tahun COD :</p>
                  <div class="font-bold text-[#007E8F] ml-1">
                    {{ item.tahun }}
                  </div>
                </div>
              </div>
              <div class="flex justify-between">
                <div>
                  <div class="flex mt-4 text-sm">
                    <p class="text-[#7B8DAD] font-bold">Nilai Aset Awal</p>
                    <p class="text-[#7B8DAD] ml-1">:</p>
                  </div>
                  <div class="flex text-sm mt-1.5">
                    <p class="mr-2 text-[#7F7F80]">Rp.</p>
                    <div class="text-[#333333]">
                      {{ globalFormat.formatRupiah(item.asset_awal) }}
                    </div>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="flex mt-4 text-sm">
                    <p class="text-[#7B8DAD] font-bold">Masa Manfaat</p>
                    <p class="text-[#7B8DAD] ml-1">:</p>
                  </div>
                  <div class="flex text-sm mt-1.5">
                    <div class="text-[#333333] mr-2">
                      {{ item.masa_manfaat }}
                    </div>
                    <p class="text-[#7F7F80]">Tahun</p>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="flex mt-4 text-sm">
                    <p class="text-[#7B8DAD] font-bold">Sisa Masa Manfaat</p>
                    <p class="text-[#7B8DAD] ml-1">:</p>
                  </div>
                  <div class="flex text-sm mt-1.5">
                    <div class="text-[#333333] mr-2">
                      {{ item.sisa_masa_manfaat }}
                    </div>
                    <p class="text-[#7F7F80]">Tahun</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-auto bg-white border rounded-md h-52">
          <div class="flex justify-between mt-1.5">
            <div class="flex px-3 py-2">
              <div class="flex items-center justify-center mr-2 rounded-full w-7 h-7 bg-slate-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.25 7.5H19.125L13.5 1.875V6.75C13.5 6.94891 13.579 7.13968 13.7197 7.28033C13.8603 7.42098 14.0511 7.5 14.25 7.5ZM14.25 9C13.6533 9 13.081 8.76295 12.659 8.34099C12.2371 7.91903 12 7.34674 12 6.75V1.5H6.75C6.15326 1.5 5.58097 1.73705 5.15901 2.15901C4.73705 2.58097 4.5 3.15326 4.5 3.75V20.25C4.5 20.8467 4.73705 21.419 5.15901 21.841C5.58097 22.2629 6.15326 22.5 6.75 22.5H17.25C17.8467 22.5 18.419 22.2629 18.841 21.841C19.2629 21.419 19.5 20.8467 19.5 20.25V9H14.25ZM9 18.75C9 18.9489 8.92098 19.1397 8.78033 19.2803C8.63968 19.421 8.44891 19.5 8.25 19.5C8.05109 19.5 7.86032 19.421 7.71967 19.2803C7.57902 19.1397 7.5 18.9489 7.5 18.75V9.75C7.5 9.55109 7.57902 9.36032 7.71967 9.21967C7.86032 9.07902 8.05109 9 8.25 9C8.44891 9 8.63968 9.07902 8.78033 9.21967C8.92098 9.36032 9 9.55109 9 9.75V18.75ZM12.75 18.75C12.75 18.9489 12.671 19.1397 12.5303 19.2803C12.3897 19.421 12.1989 19.5 12 19.5C11.8011 19.5 11.6103 19.421 11.4697 19.2803C11.329 19.1397 11.25 18.9489 11.25 18.75V15.75C11.25 15.5511 11.329 15.3603 11.4697 15.2197C11.6103 15.079 11.8011 15 12 15C12.1989 15 12.3897 15.079 12.5303 15.2197C12.671 15.3603 12.75 15.5511 12.75 15.75V18.75ZM16.5 18.75C16.5 18.9489 16.421 19.1397 16.2803 19.2803C16.1397 19.421 15.9489 19.5 15.75 19.5C15.5511 19.5 15.3603 19.421 15.2197 19.2803C15.079 19.1397 15 18.9489 15 18.75V12.75C15 12.5511 15.079 12.3603 15.2197 12.2197C15.3603 12.079 15.5511 12 15.75 12C15.9489 12 16.1397 12.079 16.2803 12.2197C16.421 12.3603 16.5 12.5511 16.5 12.75V18.75Z"
                    fill="#4D5E80" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-[#7B8DAD] mt-1">
                  {{ tabs2 }}
                </p>
              </div>
            </div>
            <div class="mx-4 my-3">
              <div class="flex flex-col items-center cursor-pointer" @click="showElement">
                <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 9C1 9.26522 1.10536 9.51957 1.29289 9.70711C1.48043 9.89464 1.73478 10 2 10C2.26522 10 2.51957 9.89464 2.70711 9.70711C2.89464 9.51957 3 9.26522 3 9C3 8.73478 2.89464 8.48043 2.70711 8.29289C2.51957 8.10536 2.26522 8 2 8C1.73478 8 1.48043 8.10536 1.29289 8.29289C1.10536 8.48043 1 8.73478 1 9ZM1 16C1 16.2652 1.10536 16.5196 1.29289 16.7071C1.48043 16.8946 1.73478 17 2 17C2.26522 17 2.51957 16.8946 2.70711 16.7071C2.89464 16.5196 3 16.2652 3 16C3 15.7348 2.89464 15.4804 2.70711 15.2929C2.51957 15.1054 2.26522 15 2 15C1.73478 15 1.48043 15.1054 1.29289 15.2929C1.10536 15.4804 1 15.7348 1 16ZM1 2C1 2.26522 1.10536 2.51957 1.29289 2.70711C1.48043 2.89464 1.73478 3 2 3C2.26522 3 2.51957 2.89464 2.70711 2.70711C2.89464 2.51957 3 2.26522 3 2C3 1.73478 2.89464 1.48043 2.70711 1.29289C2.51957 1.10536 2.26522 1 2 1C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2Z"
                    stroke="#697586" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <Transition>
                  <div v-if="message"
                    class="flex flex-col bg-white absolute text-xs p-1 mt-3.5 z-10 rounded-lg whitespace-nowrap border space-y-1.5 duration-300"
                    id="FilterContent">
                    <div>
                      <button @click="changePage(1)"
                        class="block text-left px-2 w-full py-2 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                        WLC (Realisasi & Proyeksi)
                      </button>
                    </div>
                    <div>
                      <button @click="changePage(2)"
                        class="block text-left px-2 w-full py-2 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                        Planning / FS
                      </button>
                    </div>
                    <div>
                      <button @click="changePage(3)"
                        class="block text-left px-2 w-full py-2 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                        Planning & Realisasi + Proyeksi
                      </button>
                    </div>
                    <div>
                      <button @click="changePage(4)"
                        class="block text-left px-2 w-full py-2 hover:bg-[#80C1CD] dark:hover:bg-[#80C1CD] dark:hover:text-[#80C1CD]">
                        Planning vs Realisasi s/d Tahun Berjalan
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
          <hr class="mb-1" />
          <div v-if="tabs2 === 'WLC (Realisasi & Proyeksi)'">
            <div v-for="item in dataRealisasiMesin" :key="item.mesin" class="text-xs">
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Project</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <RedDown class="mr-1" />
                  <p v-if="item.irr_project == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.irr_project }}</p>
                  <p class="text-slate-500">%</p>
                  <GreenUp class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Equity</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <GreenUp class="mr-1" />

                  <p v-if="item.irr_equity == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.irr_equity }}</p>
                  <p class="text-slate-500">%</p>
                  <RedDown class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <GreenUp class="mr-1" />
                  <p v-if="item.npv_project == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(item.npv_project) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                  <RedDown class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <GreenUp class="mr-1" />

                  <p v-if="item.npv_equity == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(item.npv_equity) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                  <RedDown class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average CF</div>
                <div class="flex">
                  <RedDown class="mr-1" />
                  <p v-if="item.average_cf == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.average_cf }}</p>
                  <p class="text-slate-500">%</p>
                  <GreenUp class="ml-1" />
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average EAF</div>
                <div class="flex">
                  <RedDown class="mr-1" />
                  <p v-if="item.average_eaf == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.average_eaf }}</p>
                  <p class="text-slate-500">%</p>
                  <GreenUp class="ml-1" />
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="tabs2 === 'Planning / FS'">
            <div v-for="item in dataPlanningMesin" :key="item.mesin" class="text-xs">
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Project</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <p class="mr-2 font-bold">{{ item.fs_irr_project }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Equity</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <p class="mr-2 font-bold">{{ item.fs_irr_equity }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(item.fs_npv_project) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <p class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(item.fs_npv_equity) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average CF</div>
                <div class="flex">
                  <p class="mr-2 font-bold">{{ item.fs_average_cf }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average EAF</div>
                <div class="flex">
                  <p v-if="item.fs_average_eaf == ''" class="mr-2 font-bold">
                    -
                  </p>
                  <p v-else class="mr-2 font-bold">{{ item.fs_average_eaf }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="tabs2 === 'Planning & Realisasi + Proyeksi'">
            <div v-for="item in dataYoyMesin" :key="item.mesin" class="text-xs">
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Project</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <p v-if="item.irr_project == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.irr_project }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Equity</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <p v-if="item.irr_equity == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.irr_equity }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <p v-if="item.npv_project == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(item.npv_project) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <p v-if="item.npv_equity == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(item.npv_equity) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average CF</div>
                <div class="flex">
                  <p v-if="item.average_cf == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.average_cf }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average EAF</div>
                <div class="flex">
                  <p v-if="item.average_eaf == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.average_eaf }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="tabs2 === 'Planning vs Realisasi s/d Tahun Berjalan'">
            <div v-for="item in dataPlanRealMesin" :key="item.mesin" class="text-xs">
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Project</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <p v-if="item.irr_project == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.irr_project }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="flex">
                  <div class="text-slate-500">IRR on Equity</div>
                  <PopUp class="ml-2" />
                </div>
                <div class="flex">
                  <p v-if="item.irr_equity == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.irr_equity }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Project</div>
                <div class="flex">
                  <p v-if="item.npv_project == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(item.npv_project) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">NPV On Equity</div>
                <div class="flex">
                  <p v-if="item.npv_equity == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">
                    {{ globalFormat.formatRupiah(item.npv_equity) }}
                  </p>
                  <p class="text-slate-500">Rp (Juta)</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average CF</div>
                <div class="flex">
                  <p v-if="item.average_cf == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.average_cf }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
              <div class="flex justify-between px-3 py-1">
                <div class="text-slate-500">Average EAF</div>
                <div class="flex">
                  <p v-if="item.average_eaf == ''" class="mr-2 font-bold">-</p>
                  <p v-else class="mr-2 font-bold">{{ item.average_eaf }}</p>
                  <p class="text-slate-500">%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Content 2/Grafik -->
      <div class="w-full mt-2 bg-white border rounded-md h-1/2">
        <div v-if="tabs2 === 'WLC (Realisasi & Proyeksi)'">
          <div class="flex justify-between">
            <div>
              <h1 class="px-6 pt-4 text-lg font-bold">
                Grafik WLC (Realisasi & Proyeksi)
              </h1>
            </div>
            <div class="flex px-6 pt-3">
              <div class="ml-4 w-28">
                <VueDatePicker v-model="yesterday" year-picker :clearable="false">
                </VueDatePicker>
              </div>
              <button type="button"
                class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                    fill="#0099AD" />
                </svg>
                <p class="ml-2">Lihat Data</p>
              </button>
            </div>
          </div>
          <div class="sticky top-0 z-10 pb-2 bg-white">
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
            <div v-if="chartWLCAllMesin == null"></div>
            <div v-else class="-mt-12">
              <vue-echarts :option="chartWLCAllMesin" style="height: 350px" @click="handleClick" />
              <Legend />
            </div>
          </div>
          <div v-else-if="tabGraphic === 'Biaya Komponen'">
            <div v-if="chartWLCKomMesin == null"></div>
            <div v-else class="-mt-12">
              <vue-echarts :option="chartWLCKomMesin" style="height: 350px" @click="handleClick" />
              <Legend />
            </div>
          </div>
        </div>
        <div v-else-if="tabs2 === 'Planning / FS'">
          <div class="flex justify-between">
            <div>
              <h1 class="px-6 pt-4 text-lg font-bold">Planning / FS</h1>
            </div>
            <div class="flex px-6 pt-3">
              <div class="ml-4 w-28">
                <VueDatePicker v-model="yesterday" year-picker :clearable="false">
                </VueDatePicker>
              </div>
              <button type="button"
                class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                    fill="#0099AD" />
                </svg>
                <p class="ml-2">Lihat Data</p>
              </button>
            </div>
          </div>
          <div v-if="chartPlanningMesin == null"></div>
          <div v-else class="-mt-12">
            <vue-echarts :option="chartPlanningMesin" style="height: 350px" @click="handleClick" />
            <Legend />
          </div>
        </div>
        <div v-else-if="tabs2 === 'Planning & Realisasi + Proyeksi'">
          <div class="flex justify-between">
            <div>
              <h1 class="px-6 pt-4 text-lg font-bold">
                Planning & Realisasi + Proyeksi
              </h1>
            </div>
            <div class="flex px-6 pt-3">
              <div class="ml-4 w-28">
                <VueDatePicker v-model="yesterday" year-picker :clearable="false">
                </VueDatePicker>
              </div>
              <button type="button"
                class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                    fill="#0099AD" />
                </svg>
                <p class="ml-2">Lihat Data</p>
              </button>
            </div>
          </div>
          <div v-if="chartPRPMesin == null"></div>
          <div v-else class="-mt-12">
            <vue-echarts :option="chartPRPMesin" style="height: 350px" @click="handleClick" />
            <Legend />
          </div>
        </div>
        <div v-else-if="tabs2 === 'Planning vs Realisasi s/d Tahun Berjalan'">
          <div class="flex justify-between">
            <div>
              <h1 class="px-6 pt-4 text-lg font-bold">
                Planning vs Realisasi s/d Tahun Berjalan
              </h1>
            </div>
            <div class="flex px-6 pt-3">
              <div class="ml-4 w-28">
                <VueDatePicker v-model="yesterday" year-picker :clearable="false">
                </VueDatePicker>
              </div>
              <button type="button"
                class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-2 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.80622 5.38128C7.14793 5.72299 7.14793 6.27701 6.80622 6.61872L2.43122 10.9937C2.08951 11.3354 1.53549 11.3354 1.19378 10.9937C0.852073 10.652 0.852073 10.098 1.19378 9.75628L4.95006 6L1.19378 2.24372C0.852073 1.90201 0.852073 1.34799 1.19378 1.00628C1.53549 0.664573 2.08951 0.664573 2.43122 1.00628L6.80622 5.38128Z"
                    fill="#0099AD" />
                </svg>
                <p class="ml-2">Lihat Data</p>
              </button>
            </div>
          </div>
          <div v-if="chartLastYearMesin == null"></div>
          <div v-else class="-mt-12">
            <vue-echarts :option="chartLastYearMesin" style="height: 350px" @click="handleClick" />
            <Legend />
          </div>
        </div>
      </div>
      <InfoMesin />
    </div>
  </div>

  <!-- Modal -->
  <Modal v-model="show">
    <div class="flex justify-between -mb-10 border-b">
      <div>
        <p class="px-2 text-lg font-semibold">
          Detail Perkembangan Unit Pertahun
        </p>
        <div class="flex p-2">
          <p class="mr-2">Periode Laporan</p>
          <p class="text-[#0099AD]">2022</p>
        </div>
      </div>
      <div class="cursor-pointer" @click="show = false">
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
      <vue-echarts :option="modalChart" style="height: 350px" />
    </div>
    <div class="py-4 border-t">
      <p class="px-2 font-semibold">Detail Data</p>
      <div class="mt-5 overflow-x-auto border rounded-md">
        <table class="w-full text-sm rounded-md table-auto">
          <thead class="text-[#0099AD] text-xs border-b text-center">
            <tr>
              <th class="px-2 py-2"></th>
              <th class="px-8 py-2"></th>
              <th class="px-1 py-2">Realisasi - Proyeksi</th>
              <th class="px-1 py-2">Planning</th>
            </tr>
          </thead>
          <tbody class="text-xs">
            <tr class="border-b text-center text-gray-900 bg-[#F7F7F7] cursor-pointer">
              <th scope="row" class="px-2 py-2 font-medium text-center whitespace-nowrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="#E5E7E9" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M11.5581 9.99556C11.8021 9.75148 12.1979 9.75148 12.4419 9.99556L15.5669 13.1206C15.811 13.3646 15.811 13.7604 15.5669 14.0044C15.3229 14.2485 14.9271 14.2485 14.6831 14.0044L12 11.3214L9.31694 14.0044C9.07286 14.2485 8.67714 14.2485 8.43306 14.0044C8.18898 13.7604 8.18898 13.3646 8.43306 13.1206L11.5581 9.99556Z"
                    fill="#333333" />
                </svg>
              </th>
              <td class="px-8 py-2">Total Revenue</td>
              <td class="px-1 py-2">5,067</td>
              <td class="px-1 py-2">-</td>
            </tr>
            <tr class="text-center text-gray-900 border-b cursor-pointer">
              <th scope="row" class="px-2 py-2 font-medium text-center whitespace-nowrap"></th>
              <td class="px-8 py-2">Revenue A</td>
              <td class="px-1 py-2">3,378</td>
              <td class="px-1 py-2">-</td>
            </tr>
            <tr class="text-center text-gray-900 border-b cursor-pointer">
              <th scope="row" class="px-2 py-2 font-medium text-center whitespace-nowrap"></th>
              <td class="px-8 py-2">Revenue B</td>
              <td class="px-1 py-2">1,562</td>
              <td class="px-1 py-2">-</td>
            </tr>
            <tr class="text-center text-gray-900 border-b cursor-pointer">
              <th scope="row" class="px-2 py-2 font-medium text-center whitespace-nowrap"></th>
              <td class="px-8 py-2">Revenue C</td>
              <td class="px-1 py-2">127</td>
              <td class="px-1 py-2">-</td>
            </tr>
            <tr class="text-center text-gray-900 border-b cursor-pointer">
              <th scope="row" class="px-2 py-2 font-medium text-center whitespace-nowrap"></th>
              <td class="px-8 py-2">Revenue D</td>
              <td class="px-1 py-2">0</td>
              <td class="px-1 py-2">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import PetaService from "@/services/peta-service";
import GrafikService from "@/services/grafik-service";
import Loading from "@/components/ui/LoadingSpinner.vue";
import { VueEcharts } from "vue3-echarts";
import "vue-final-modal/style.css";
import Modal from "@/components/Grafik/ModalGrafik.vue";
import PopUp from "@/components/Grafik/PoupWacc.vue";
import RedDown from "@/components/icons/RedDown.vue";
import GreenUp from "@/components/icons/GreenUp.vue";
import Legend from "@/components/Grafik/LegendGrafik.vue";
import Empty from "@/components/ui/EmptyData.vue";
import InfoSentral from "@/views/Data/Grafik/InformationSentral.vue";
import InfoMesin from "@/views/Data/Grafik/InformationMesin.vue";
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
// import routers from "@/router";

const router = useRoute();
// const route = useRoute();
const petaService = new PetaService();
const grafikService = new GrafikService();
const selectedTitle = ref("Unit Sentral");
let loading = ref(true);
let isLoading = ref(false);

const dataSentral = ref<SentralItem[]>([]);
const dataUnit = ref<UnitItem[]>([]);
const dataPlanning = ref<PlanningItem[]>([]);
const dataRealisasi = ref<RelProyItem[]>([]);
const dataYoy = ref<RelProyItem[]>([]);
const dataPlanReal = ref<RelProyItem[]>([]);
const dataPlanningMesin = ref<PlanningItem[]>([]);
const dataRealisasiMesin = ref<RelProyItem[]>([]);
const dataYoyMesin = ref<RelProyItem[]>([]);
const dataPlanRealMesin = ref<RelProyItem[]>([]);
const dataWLCAll = ref<Grafik1[]>([]);
const dataWLCKom = ref<Grafik2[]>([]);
const dataGraphPlan = ref<Grafik1[]>([]);
const dataGraphPRP = ref<Grafik1[]>([]);
const dataGraphPRPPlan = ref<Grafik1[]>([]);
const dataGraphPRPLastYear = ref<Grafik1[]>([]);
const dataGraphPRPLastYearPlan = ref<Grafik1[]>([]);
const dataWLCAllMesin = ref<Grafik1[]>([]);
const dataWLCKomMesin = ref<Grafik2[]>([]);
const dataGraphPlanMesin = ref<Grafik1[]>([]);
const dataGraphPRPMesin = ref<Grafik1[]>([]);
const dataGraphPRPPlanMesin = ref<Grafik1[]>([]);
const dataGraphPRPLastYearMesin = ref<Grafik1[]>([]);
const dataGraphPRPLastYearPlanMesin = ref<Grafik1[]>([]);
const dataDetailWLCALLMesin = ref<Grafik1[]>([]);
const date = new Date();
const year = date.getFullYear();
const yesterday = date.getFullYear() - 1;

// chart WlC All
let chartWLCAll = ref();
let updateWLCAll = ref(true);
let tahunWLCAll = ref<any>([]);
let capexWLC = ref<any>([]);
let comBWLC = ref<any>([]);
let comDWLC = ref<any>([]);
let fuelComWLC = ref<any>([]);
let sumRevWLC = ref<any>([]);
let revWLC = ref<any>([]);
let sumLccWLC = ref<any>([]);
let revAWLC = ref<any>([]);
let revBWLC = ref<any>([]);
let revCWLC = ref<any>([]);
let revDWLC = ref<any>([]);

// chart WLC Komponen
let chartWLCKom = ref();
let updateWLCKom = ref(true);
let tahunWLCKom = ref<any>([]);
let revenueA = ref<any>([]);
let revenueB = ref<any>([]);
let revenueC = ref<any>([]);
let revenueD = ref<any>([]);

// chart Planning
let chartPlanning = ref();
let updatePlanning = ref(true);
let tahunPlanning = ref<any>([]);
let capexPlan = ref<any>([]);
let comBPlan = ref<any>([]);
let comDPlan = ref<any>([]);
let fuelComPlan = ref<any>([]);
let revPlan = ref<any>([]);
let sumLccPlan = ref<any>([]);

// chart Planning Realisasi Proyeksi
let chartPRP = ref();
let updatePRP = ref(true);
let tahunPRP = ref<any>([]);
let capexPRP = ref<any>([]);
let comBPRP = ref<any>([]);
let comDPRP = ref<any>([]);
let fuelComPRP = ref<any>([]);
let sumRevPRP = ref<any>([]);
let revPRP = ref<any>([]);
let sumLccPRP = ref<any>([]);
let revAPRP = ref<any>([]);
let revBPRP = ref<any>([]);
let revCPRP = ref<any>([]);
let revDPRP = ref<any>([]);

let capexPRPPlan = ref<any>([]);
let comBPRPPlan = ref<any>([]);
let comDPRPPlan = ref<any>([]);
let fuelComPRPPlan = ref<any>([]);
let revPRPPlan = ref<any>([]);
let sumLccPRPPlan = ref<any>([]);

// chart Planning Realisasi Proyeksi
let chartLastYear = ref();
let updateLastYear = ref(true);
let tahunLastYear = ref<any>([]);
let capexLastYear = ref<any>([]);
let comBLastYear = ref<any>([]);
let comDLastYear = ref<any>([]);
let fuelComLastYear = ref<any>([]);
let sumRevLastYear = ref<any>([]);
let revLastYear = ref<any>([]);
let sumLccLastYear = ref<any>([]);
let revALastYear = ref<any>([]);
let revBLastYear = ref<any>([]);
let revCLastYear = ref<any>([]);
let revDLastYear = ref<any>([]);

let capexLastYearPlan = ref<any>([]);
let comBLastYearPlan = ref<any>([]);
let comDLastYearPlan = ref<any>([]);
let fuelComLastYearPlan = ref<any>([]);
let revLastYearPlan = ref<any>([]);
let sumLccLastYearPlan = ref<any>([]);

// chart WlC All Mesin
let chartWLCAllMesin = ref();
let updateWLCAllMesin = ref(true);
let tahunWLCAllMesin = ref<any>([]);
let capexWLCMesin = ref<any>([]);
let comBWLCMesin = ref<any>([]);
let comDWLCMesin = ref<any>([]);
let fuelComWLCMesin = ref<any>([]);
let sumRevWLCMesin = ref<any>([]);
let revWLCMesin = ref<any>([]);
let sumLccWLCMesin = ref<any>([]);
let revAWLCMesin = ref<any>([]);
let revBWLCMesin = ref<any>([]);
let revCWLCMesin = ref<any>([]);
let revDWLCMesin = ref<any>([]);

// chart WlC Detail All Mesin
let chartDetWLCALLMesin = ref();
let updateDetWLCALLMesin = ref(true);
let tahunDetWLCALLMesin = ref<any>([]);
let capexDetWLCMesin = ref<any>([]);
let comBDetWLCMesin = ref<any>([]);
let comDDetWLCMesin = ref<any>([]);
let fuelComDetWLCMesin = ref<any>([]);
let revDetWLCMesin = ref<any>([]);
let sumLccDetWLCMesin = ref<any>([]);

// chart WLC Komponen
let chartWLCKomMesin = ref();
let updateWLCKomMesin = ref(true);
let tahunWLCKomMesin = ref<any>([]);
let revenueAMesin = ref<any>([]);
let revenueBMesin = ref<any>([]);
let revenueCMesin = ref<any>([]);
let revenueDMesin = ref<any>([]);

// chart Planning
let chartPlanningMesin = ref();
let updatePlanningMesin = ref(true);
let tahunPlanningMesin = ref<any>([]);
let capexPlanMesin = ref<any>([]);
let comBPlanMesin = ref<any>([]);
let comDPlanMesin = ref<any>([]);
let fuelComPlanMesin = ref<any>([]);
let revPlanMesin = ref<any>([]);
let sumLccPlanMesin = ref<any>([]);

// chart Planning Realisasi Proyeksi
let chartPRPMesin = ref();
let updatePRPMesin = ref(true);
let tahunPRPMesin = ref<any>([]);
let capexPRPMesin = ref<any>([]);
let comBPRPMesin = ref<any>([]);
let comDPRPMesin = ref<any>([]);
let fuelComPRPMesin = ref<any>([]);
let sumRevPRPMesin = ref<any>([]);
let revPRPMesin = ref<any>([]);
let sumLccPRPMesin = ref<any>([]);
let revAPRPMesin = ref<any>([]);
let revBPRPMesin = ref<any>([]);
let revCPRPMesin = ref<any>([]);
let revDPRPMesin = ref<any>([]);

let capexPRPPlanMesin = ref<any>([]);
let comBPRPPlanMesin = ref<any>([]);
let comDPRPPlanMesin = ref<any>([]);
let fuelComPRPPlanMesin = ref<any>([]);
let revPRPPlanMesin = ref<any>([]);
let sumLccPRPPlanMesin = ref<any>([]);

// chart Planning Realisasi Proyeksi
let chartLastYearMesin = ref();
let updateLastYearMesin = ref(true);
let tahunLastYearMesin = ref<any>([]);
let capexLastYearMesin = ref<any>([]);
let comBLastYearMesin = ref<any>([]);
let comDLastYearMesin = ref<any>([]);
let fuelComLastYearMesin = ref<any>([]);
let sumRevLastYearMesin = ref<any>([]);
let revLastYearMesin = ref<any>([]);
let sumLccLastYearMesin = ref<any>([]);
let revALastYearMesin = ref<any>([]);
let revBLastYearMesin = ref<any>([]);
let revCLastYearMesin = ref<any>([]);
let revDLastYearMesin = ref<any>([]);

let capexLastYearPlanMesin = ref<any>([]);
let comBLastYearPlanMesin = ref<any>([]);
let comDLastYearPlanMesin = ref<any>([]);
let fuelComLastYearPlanMesin = ref<any>([]);
let revLastYearPlanMesin = ref<any>([]);
let sumLccLastYearPlanMesin = ref<any>([]);

let show = ref(false);
const isHover = ref(false);
const message = ref(false);

function showElement() {
  message.value = !message.value;
}

function toggleButton() {
  isHover.value = !isHover.value;
}

let forceRerender = async () => {
  updateWLCAll.value = false;
  await nextTick();
  updateWLCAll.value = true;
};

let forceRerender1 = async () => {
  updateWLCKom.value = false;
  await nextTick();
  updateWLCKom.value = true;
};

let forceRerender2 = async () => {
  updatePlanning.value = false;
  await nextTick();
  updatePlanning.value = true;
};

let forceRerender3 = async () => {
  updatePRP.value = false;
  await nextTick();
  updatePRP.value = true;
};

let forceRerender4 = async () => {
  updateLastYear.value = false;
  await nextTick();
  updateLastYear.value = true;
};

let forceRerender5 = async () => {
  updateWLCAllMesin.value = false;
  await nextTick();
  updateWLCAllMesin.value = true;
};

let forceRerender6 = async () => {
  updateWLCKomMesin.value = false;
  await nextTick();
  updateWLCKomMesin.value = true;
};

let forceRerender7 = async () => {
  updatePlanningMesin.value = false;
  await nextTick();
  updatePlanningMesin.value = true;
};

let forceRerender8 = async () => {
  updatePRPMesin.value = false;
  await nextTick();
  updatePRPMesin.value = true;
};

let forceRerender9 = async () => {
  updateLastYearMesin.value = false;
  await nextTick();
  updateLastYearMesin.value = true;
};

let forceRerender10 = async () => {
  updateDetWLCALLMesin.value = false;
  await nextTick();
  updateDetWLCALLMesin.value = true;
};

let tabs2 = ref("WLC (Realisasi & Proyeksi)");

function changePage(tabb: number) {
  if (tabb === 1) {
    tabs2.value = "WLC (Realisasi & Proyeksi)";
  } else if (tabb === 2) {
    tabs2.value = "Planning / FS";
  } else if (tabb === 3) {
    tabs2.value = "Planning & Realisasi + Proyeksi";
  } else if (tabb === 4) {
    tabs2.value = "Planning vs Realisasi s/d Tahun Berjalan";
  }
}

let tabGraphic = ref("Semua");

function changeTab(tabs: number) {
  if (tabs === 1) {
    tabGraphic.value = "Semua";
  } else if (tabs === 2) {
    tabGraphic.value = "Biaya Komponen";
  }
}

interface SentralItem {
  kode_sentral: string;
  sentral: string;
  pengelola: string;
  pembina: string;
  jenis_pembangkit: string;
  data_terpasang: string;
  data_mampu: string;
  asset_awal: string;
  jumlah_mesin: number;
  tahun: number;
  photo: string;
}

interface UnitItem {
  kode_sentral: string;
  mesin: string;
  id_mesin: number;
  sentral: string;
  pengelola: string;
  pembina: string;
  jenis_pembangkit: string;
  data_terpasang: string;
  data_mampu: string;
  asset_awal: string;
  sisa_masa_manfaat: number;
  masa_manfaat: number;
  tahun: number;
  photo: string;
}

interface PlanningItem {
  mesin: string;
  fs_average_cf: string;
  fs_average_eaf: string;
  fs_irr_equity: string;
  fs_irr_project: string;
  fs_npv_equity: string;
  fs_npv_project: string;
}

interface RelProyItem {
  mesin: string;
  average_cf: string;
  average_eaf: string;
  irr_equity: string;
  irr_project: string;
  npv_equity: string;
  npv_project: string;
}

interface Grafik1 {
  tahun: number;
  revenue_komp_a: number;
  revenue_komp_b: number;
  revenue_komp_c: number;
  revenue_komp_d: number;
  optimum_life_fs: number;
  bep_fs: number;
  capex_annualized: number;
  cost_component_b_annualized: number;
  cost_component_d_annualized: number;
  fuel_cost_annualized: number;
  revenue_annualized: number;
  total_wlcc: number;
  total_revenue: number;
}

interface Grafik2 {
  tahun: number;
  is_history: number;
  revenue_komp_a: number;
  revenue_komp_b: number;
  revenue_komp_c: number;
  revenue_komp_d: number;
}

const props = defineProps({
  tabsTitle: Array as () => UnitItem[],
});

// const queryTab = ref(route.query.tab);
const changeTabMesin = async (mesin: any, id_mesin: any) => {
  selectedTitle.value = mesin;
  await getApiGraphic(id_mesin);
};

const getApiGraphic = async (id_mesin: any) => {
  if (chartWLCAllMesin.value) {
    return null;
  } else {
    await grafikService
      .getGrafikWLCALLMesin(id_mesin, yesterday)
      .then((res: any) => {
        dataWLCAllMesin.value = res.data;
        for (var i = 0; i < res.data.length; i++) {
          tahunWLCAllMesin.value.push(res.data[i].tahun);
          capexWLCMesin.value.push(res.data[i].capex_annualized);
          comBWLCMesin.value.push(res.data[i].cost_component_b_annualized);
          comDWLCMesin.value.push(res.data[i].cost_component_d_annualized);
          fuelComWLCMesin.value.push(res.data[i].fuel_cost_annualized);
          revWLCMesin.value.push(res.data[i].revenue_annualized);
          sumLccWLCMesin.value.push(res.data[i].total_wlcc);
        }
        loading.value = false;
        isLoading.value = false;
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
              "Total LCC",
              "Capex Annualized",
              "Cost Component B Annualized",
              "Cost Component D Annualized",
              "Fuel Cost Annualized",
            ],
          },
          grid: {
            left: "4%",
            right: "4%",
            bottom: "15%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: tahunWLCAllMesin,
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "Triliun Rupiah",
              nameLocation: "center",
              nameTextStyle: {
                align: "left",
                padding: [30, 20, 30, -25],
                fontSize: 15,
                color: "#4D5E80",
                fontWeight: "bold",
              },
              splitNumber: 10,
              axisLabel: {
                // Formatter: (value: any) => value.toFixed(2),
                formatter: function (value: any) {
                  return globalFormat.formatRupiah(
                    value.toFixed(2) / 1000000
                  );
                },
              },
            },
          ],
          series: [
            {
              name: "Capex Annualized",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: capexWLCMesin,
              color: "#0D5A71",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Cost Component B Annualized",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: comBWLCMesin,
              color: "#37B1D5",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Cost Component D Annualized",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: comDWLCMesin,
              color: "#97E4FF",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Fuel Cost Annualized",
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
              name: "Total LCC",
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
          ],
        };
        forceRerender5();
      });
  }
  if (chartWLCKomMesin.value) {
    return null;
  } else {
    await grafikService
      .getGrafikWLCKomMesin(id_mesin, yesterday)
      .then((res: any) => {
        dataWLCKomMesin.value = res.data;
        for (var i = 0; i < res.data.length; i++) {
          tahunWLCKomMesin.value.push(res.data[i].tahun);
          revenueAMesin.value.push(res.data[i].revenue_komp_a);
          revenueBMesin.value.push(res.data[i].revenue_komp_b);
          revenueCMesin.value.push(res.data[i].revenue_komp_c);
          revenueDMesin.value.push(res.data[i].revenue_komp_d);
        }

        for (var j = 0; j < dataWLCAllMesin.value.length; j++) {
          sumRevWLCMesin.value.push(dataWLCAllMesin.value[j].total_revenue);
          revAWLCMesin.value.push(dataWLCAllMesin.value[j].revenue_komp_a);
          revBWLCMesin.value.push(dataWLCAllMesin.value[j].revenue_komp_b);
          revCWLCMesin.value.push(dataWLCAllMesin.value[j].revenue_komp_c);
          revDWLCMesin.value.push(dataWLCAllMesin.value[j].revenue_komp_d);
        }

        loading.value = false;
        isLoading.value = false;
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
            data: [
              "Komponen A",
              "Komponen B",
              "Komponen C",
              "Komponen D",
              "Total Revenue",
              "Revenue A",
              "Revenue B",
              "Revenue C",
              "Revenue D",
            ],
          },
          grid: {
            left: "4%",
            right: "4%",
            bottom: "10%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: tahunWLCKomMesin,
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "Triliun Rupiah",
              nameLocation: "center",
              nameTextStyle: {
                align: "left",
                padding: [30, 20, 30, -25],
                fontSize: 15,
                color: "#4D5E80",
                fontWeight: "bold",
              },
              splitNumber: 10,
              axisLabel: {
                // Formatter: (value: any) => value.toFixed(2),
                formatter: function (value: any) {
                  return globalFormat.formatRupiah(
                    value.toFixed(2) / 1000000
                  );
                },
              },
            },
          ],
          series: [
            {
              name: "Komponen A",
              type: "bar",
              stack: "Ad",
              zlevel: 1,
              emphasis: {
                focus: "series",
              },
              data: revenueAMesin,
              color: "#068D9D",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Komponen B",
              type: "bar",
              stack: "Ad",
              zlevel: 1,
              emphasis: {
                focus: "series",
              },
              data: revenueBMesin,
              color: "#53599A",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Komponen C",
              type: "bar",
              stack: "Ad",
              zlevel: 1,
              emphasis: {
                focus: "series",
              },
              data: revenueCMesin,
              color: "#6D9DC5",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Komponen D",
              type: "bar",
              stack: "Ad",
              zlevel: 1,
              emphasis: {
                focus: "series",
              },
              itemStyle: {
                borderRadius: [5, 5, 0, 0],
              },
              data: revenueDMesin,
              color: "#80DED9",
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
              data: sumRevWLCMesin,
              color: "#58B069",
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
              data: revAWLCMesin,
              color: "#B2533E",
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
              data: revBWLCMesin,
              color: "#FCE09B",
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
              data: revCWLCMesin,
              color: "#B5CB99",
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
              data: revDWLCMesin,
              color: "#186F65",
              areaStyle: {},
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
          ],
        };
        forceRerender6();
      });
  }
  if (chartPlanningMesin.value) {
    return null;
  } else {
    await grafikService.getGrafikPlanMesin(id_mesin).then((res: any) => {
      dataGraphPlanMesin.value = res.data;
      for (var i = 0; i < res.data.length; i++) {
        tahunPlanningMesin.value.push(res.data[i].tahun);
        capexPlanMesin.value.push(res.data[i].capex_annualized);
        comBPlanMesin.value.push(res.data[i].cost_component_b_annualized);
        comDPlanMesin.value.push(res.data[i].cost_component_d_annualized);
        fuelComPlanMesin.value.push(res.data[i].fuel_cost_annualized);
        revPlanMesin.value.push(res.data[i].revenue_annualized);
        sumLccPlanMesin.value.push(res.data[i].total_wlcc);
      }
      loading.value = false;
      isLoading.value = false;
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
            "FS: Capex Annualized",
            "FS: Cost Component B Annualized",
            "FS: Cost Component D Annualized",
            "FS: Fuel Cost Annualized",
          ],
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunPlanningMesin,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 30, -25],
              fontSize: 15,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            splitNumber: 10,
            axisLabel: {
              // Formatter: (value: any) => value.toFixed(2),
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "FS: Capex Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: capexPlanMesin,
            color: "#0D5A71",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component B Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comBPlanMesin,
            color: "#37B1D5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component D Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comDPlanMesin,
            color: "#97E4FF",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Fuel Cost Annualized",
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
      forceRerender7();
    });
  }
  if (chartPRPMesin.value) {
    return null;
  } else {
    await grafikService
      .getGrafikPRPMesin(id_mesin, yesterday)
      .then((res: any) => {
        dataGraphPRPMesin.value = res.data[0].realisasi_proyeksi;
        for (var i = 0; i < res.data[0].realisasi_proyeksi.length; i++) {
          tahunPRPMesin.value.push(res.data[0].realisasi_proyeksi[i].tahun);
          capexPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].capex_annualized
          );
          comBPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].cost_component_b_annualized
          );
          comDPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].cost_component_d_annualized
          );
          fuelComPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].fuel_cost_annualized
          );
          sumRevPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].total_revenue
          );
          revPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_annualized
          );
          sumLccPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].total_wlcc
          );
          revAPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_a
          );
          revBPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_b
          );
          revCPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_c
          );
          revDPRPMesin.value.push(
            res.data[0].realisasi_proyeksi[i].revenue_komp_d
          );
        }
        dataGraphPRPPlanMesin.value = res.data[0].planning;
        for (var j = 0; j < res.data[0].planning.length; j++) {
          // tahunPRPPlan.value.push(res.data[0].planning[j].tahun);
          capexPRPPlanMesin.value.push(
            res.data[0].planning[j].capex_annualized
          );
          comBPRPPlanMesin.value.push(
            res.data[0].planning[j].cost_component_b_annualized
          );
          comDPRPPlanMesin.value.push(
            res.data[0].planning[j].cost_component_d_annualized
          );
          fuelComPRPPlanMesin.value.push(
            res.data[0].planning[j].fuel_cost_annualized
          );
          revPRPPlanMesin.value.push(
            res.data[0].planning[j].revenue_annualized
          );
          sumLccPRPPlanMesin.value.push(res.data[0].planning[j].total_wlcc);
        }
        loading.value = false;
        isLoading.value = false;
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
              "Total Revenue",
              "Capex Annualized",
              "Cost Component B Annualized",
              "Cost Component D Annualized",
              "Fuel Cost Annualized",
              "Revenue A",
              "Revenue B",
              "Revenue C",
              "Revenue D",
              "FS: Revenue Annualized",
              "FS: Total LCC",
              "FS: Capex Annualized",
              "FS: Cost Component B Annualized",
              "FS: Cost Component D Annualized",
              "FS: Fuel Cost Annualized",
            ],
          },
          grid: {
            left: "4%",
            right: "4%",
            bottom: "20%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: tahunPRPMesin,
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "Triliun Rupiah",
              nameLocation: "center",
              nameTextStyle: {
                align: "left",
                padding: [30, 20, 30, -25],
                fontSize: 15,
                color: "#4D5E80",
                fontWeight: "bold",
              },
              splitNumber: 10,
              axisLabel: {
                // Formatter: (value: any) => value.toFixed(2),
                formatter: function (value: any) {
                  return globalFormat.formatRupiah(
                    value.toFixed(2) / 1000000
                  );
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
              color: "#1E1F4E",
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
              color: "#DDE3EC",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Capex Annualized",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: capexPRPMesin,
              color: "#A8E2FC",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Cost Component B Annualized",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: comBPRPMesin,
              color: "#212E7C",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Cost Component D Annualized",
              type: "bar",
              stack: "Ad",
              emphasis: {
                focus: "series",
              },
              data: comDPRPMesin,
              color: "#B7DFCB",
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Fuel Cost Annualized",
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
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "Revenue A",
              type: "line",
              smooth: true,
              showSymbol: false,
              data: revAPRPMesin,
              color: "#DDE3EC",
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
              color: "#DDE3EC",
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
              color: "#DDE3EC",
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
              color: "#DDE3EC",
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
              zlevel: 2,
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
              zlevel: 2,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "FS: Capex Annualized",
              type: "bar",
              stack: "Ab",
              emphasis: {
                focus: "series",
              },
              data: capexPRPPlanMesin,
              color: "#DDDDDD",
              zlevel: 2,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "FS: Cost Component B Annualized",
              type: "bar",
              stack: "Ab",
              emphasis: {
                focus: "series",
              },
              data: comBPRPPlanMesin,
              color: "#BFBFBF",
              zlevel: 2,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "FS: Cost Component D Annualized",
              type: "bar",
              stack: "Ab",
              emphasis: {
                focus: "series",
              },
              data: comDPRPPlanMesin,
              color: "#4B4B4B",
              zlevel: 2,
              tooltip: {
                valueFormatter: (value: any) =>
                  globalFormat.formatRupiah(value) + " Rp(Juta)",
              },
            },
            {
              name: "FS: Fuel Cost Annualized",
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
          ],
        };
        forceRerender8();
      });
  }
  if (chartLastYearMesin.value) {
    return null;
  } else {
    await grafikService.getGrafikPRPLastYearMesin(id_mesin).then((res: any) => {
      dataGraphPRPLastYearMesin.value = res.data[0].realisasi_proyeksi;
      for (var i = 0; i < res.data[0].realisasi_proyeksi.length; i++) {
        tahunLastYearMesin.value.push(res.data[0].realisasi_proyeksi[i].tahun);
        capexLastYearMesin.value.push(
          res.data[0].realisasi_proyeksi[i].capex_annualized
        );
        comBLastYearMesin.value.push(
          res.data[0].realisasi_proyeksi[i].cost_component_b_annualized
        );
        comDLastYearMesin.value.push(
          res.data[0].realisasi_proyeksi[i].cost_component_d_annualized
        );
        fuelComLastYearMesin.value.push(
          res.data[0].realisasi_proyeksi[i].fuel_cost_annualized
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
      }
      dataGraphPRPLastYearPlanMesin.value = res.data[0].planning;
      for (var j = 0; j < res.data[0].planning.length; j++) {
        capexLastYearPlanMesin.value.push(
          res.data[0].planning[j].capex_annualized
        );
        comBLastYearPlanMesin.value.push(
          res.data[0].planning[j].cost_component_b_annualized
        );
        comDLastYearPlanMesin.value.push(
          res.data[0].planning[j].cost_component_d_annualized
        );
        fuelComLastYearPlanMesin.value.push(
          res.data[0].planning[j].fuel_cost_annualized
        );
        revLastYearPlanMesin.value.push(
          res.data[0].planning[j].revenue_annualized
        );
        sumLccLastYearPlanMesin.value.push(res.data[0].planning[j].total_wlcc);
      }
      loading.value = false;
      isLoading.value = false;
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
            "Total Revenue",
            "Capex Annualized",
            "Cost Component B Annualized",
            "Cost Component D Annualized",
            "Fuel Cost Annualized",
            "Revenue A",
            "Revenue B",
            "Revenue C",
            "Revenue D",
            "FS: Revenue Annualized",
            "FS: Total LCC",
            "FS: Capex Annualized",
            "FS: Cost Component B Annualized",
            "FS: Cost Component D Annualized",
            "FS: Fuel Cost Annualized",
          ],
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunLastYearMesin,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 30, -25],
              fontSize: 15,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            splitNumber: 10,
            axisLabel: {
              // Formatter: (value: any) => value.toFixed(2),
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
            color: "#1E1F4E",
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
            color: "#DDE3EC",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Capex Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: capexLastYearMesin,
            color: "#A8E2FC",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comBLastYearMesin,
            color: "#212E7C",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component D Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comDLastYearMesin,
            color: "#B7DFCB",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Fuel Cost Annualized",
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
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Revenue A",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revALastYearMesin,
            color: "#DDE3EC",
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
            color: "#DDE3EC",
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
            color: "#DDE3EC",
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
            color: "#DDE3EC",
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
            zlevel: 2,
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
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Capex Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: capexLastYearPlanMesin,
            color: "#DDDDDD",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component B Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: comBLastYearPlanMesin,
            color: "#BFBFBF",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component D Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: comDLastYearPlanMesin,
            color: "#4B4B4B",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Fuel Cost Annualized",
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
        ],
      };
      forceRerender9();
    });
  }
  if (chartDetWLCALLMesin.value) {
    return null;
  } else {
    await grafikService.getRDetailWLCALLMes(2014, id_mesin).then((res: any) => {
      dataDetailWLCALLMesin.value = res.data;
    });
  }
};

onMounted(async () => {
  isLoading.value = true;
  if (props.tabsTitle) {
    if (props.tabsTitle.length > 0) {
      selectedTitle.value = "Unit Sentral";
    }
  }

  await petaService.getSentralByKode(router.params.id).then((res: any) => {
    dataSentral.value = res.data == null ? [] : res.data;
    dataUnit.value = res.data.mesins == null ? [] : res.data.mesins;
    loading.value = false;
    isLoading.value = false;
  });

  await grafikService.getPlanning(router.params.id).then((res: any) => {
    dataPlanning.value = res.data;
    dataPlanningMesin.value = res.data.mesins;
    loading.value = false;
    isLoading.value = false;
  });

  await grafikService
    .getRealisasiProyeksi(year, router.params.id)
    .then((res: any) => {
      dataRealisasi.value = res.data;
      dataRealisasiMesin.value = res.data.mesins;
      loading.value = false;
      isLoading.value = false;
    });

  await grafikService
    .getRealisasiYoy(router.params.id, yesterday)
    .then((res: any) => {
      dataYoy.value = res.data;
      dataYoyMesin.value = res.data.mesins;
      loading.value = false;
      isLoading.value = false;
    });

  await grafikService.getPlanReal(router.params.id).then((res: any) => {
    dataPlanReal.value = res.data;
    dataPlanRealMesin.value = res.data.mesins;
    console.log(dataPlanReal.value);
    loading.value = false;
    isLoading.value = false;
  });

  await grafikService
    .getGrafikWLCALL(router.params.id, yesterday)
    .then((res: any) => {
      dataWLCAll.value = res.data;

      for (var i = 0; i < res.data.length; i++) {
        tahunWLCAll.value.push(res.data[i].tahun);
        capexWLC.value.push(res.data[i].capex_annualized);
        comBWLC.value.push(res.data[i].cost_component_b_annualized);
        comDWLC.value.push(res.data[i].cost_component_d_annualized);
        fuelComWLC.value.push(res.data[i].fuel_cost_annualized);
        revWLC.value.push(res.data[i].revenue_annualized);
        sumLccWLC.value.push(res.data[i].total_wlcc);
      }

      loading.value = false;
      isLoading.value = false;
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
            "Capex Annualized",
            "Cost Component B Annualized",
            "Cost Component D Annualized",
            "Fuel Cost Annualized",
          ],
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunWLCAll,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 30, -25],
              fontSize: 15,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            splitNumber: 10,
            axisLabel: {
              // Formatter: (value: any) => value.toFixed(2),
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Capex Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: capexWLC,
            color: "#0D5A71",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comBWLC,
            color: "#37B1D5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component D Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comDWLC,
            color: "#97E4FF",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Fuel Cost Annualized",
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
      forceRerender();
    });

  await grafikService
    .getGrafikWLCKom(router.params.id, yesterday)
    .then((res: any) => {
      dataWLCKom.value = res.data;

      for (var i = 0; i < res.data.length; i++) {
        tahunWLCKom.value.push(res.data[i].tahun);
        revenueA.value.push(res.data[i].revenue_komp_a);
        revenueB.value.push(res.data[i].revenue_komp_b);
        revenueC.value.push(res.data[i].revenue_komp_c);
        revenueD.value.push(res.data[i].revenue_komp_d);
      }

      for (var j = 0; j < dataWLCAll.value.length; j++) {
        sumRevWLC.value.push(dataWLCAll.value[j].total_revenue);
        revAWLC.value.push(dataWLCAll.value[j].revenue_komp_a);
        revBWLC.value.push(dataWLCAll.value[j].revenue_komp_b);
        revCWLC.value.push(dataWLCAll.value[j].revenue_komp_c);
        revDWLC.value.push(dataWLCAll.value[j].revenue_komp_d);
      }

      loading.value = false;
      isLoading.value = false;
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
            "Komponen A",
            "Komponen B",
            "Komponen C",
            "Komponen D",
            "Total Revenue",
            "Revenue A",
            "Revenue B",
            "Revenue C",
            "Revenue D",
          ],
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunWLCKom,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 30, -25],
              fontSize: 15,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            splitNumber: 10,
            axisLabel: {
              // Formatter: (value: any) => value.toFixed(2),
              formatter: function (value: any) {
                return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
              },
            },
          },
        ],
        series: [
          {
            name: "Komponen A",
            type: "bar",
            stack: "Ad",
            zlevel: 1,
            emphasis: {
              focus: "series",
            },
            data: revenueA,
            color: "#068D9D",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Komponen B",
            type: "bar",
            stack: "Ad",
            zlevel: 1,
            emphasis: {
              focus: "series",
            },
            data: revenueB,
            color: "#53599A",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Komponen C",
            type: "bar",
            stack: "Ad",
            zlevel: 1,
            emphasis: {
              focus: "series",
            },
            data: revenueC,
            color: "#6D9DC5",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Komponen D",
            type: "bar",
            stack: "Ad",
            zlevel: 1,
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: revenueD,
            color: "#80DED9",
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
            data: sumRevWLC,
            color: "#58B069",
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
            data: revAWLC,
            color: "#B2533E",
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
            data: revBWLC,
            color: "#FCE09B",
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
            data: revCWLC,
            color: "#B5CB99",
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
            data: revDWLC,
            color: "#186F65",
            areaStyle: {},
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
        ],
      };
      forceRerender1();
    });

  await grafikService.getGrafikPlan(router.params.id).then((res: any) => {
    dataGraphPlan.value = res.data;

    for (var i = 0; i < res.data.length; i++) {
      tahunPlanning.value.push(res.data[i].tahun);
      capexPlan.value.push(res.data[i].capex_annualized);
      comBPlan.value.push(res.data[i].cost_component_b_annualized);
      comDPlan.value.push(res.data[i].cost_component_d_annualized);
      fuelComPlan.value.push(res.data[i].fuel_cost_annualized);
      revPlan.value.push(res.data[i].revenue_annualized);
      sumLccPlan.value.push(res.data[i].total_wlcc);
    }

    loading.value = false;
    isLoading.value = false;
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
          "FS: Capex Annualized",
          "FS: Cost Component B Annualized",
          "FS: Cost Component D Annualized",
          "FS: Fuel Cost Annualized",
        ],
      },
      grid: {
        left: "4%",
        right: "4%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: tahunPlanning,
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Triliun Rupiah",
          nameLocation: "center",
          nameTextStyle: {
            align: "left",
            padding: [30, 20, 30, -25],
            fontSize: 15,
            color: "#4D5E80",
            fontWeight: "bold",
          },
          splitNumber: 10,
          axisLabel: {
            // Formatter: (value: any) => value.toFixed(2),
            formatter: function (value: any) {
              return globalFormat.formatRupiah(value.toFixed(2) / 1000000);
            },
          },
        },
      ],
      series: [
        {
          name: "FS: Capex Annualized",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: capexPlan,
          color: "#0D5A71",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatRupiah(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Cost Component B Annualized",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: comBPlan,
          color: "#37B1D5",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatRupiah(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Cost Component D Annualized",
          type: "bar",
          stack: "Ad",
          emphasis: {
            focus: "series",
          },
          data: comDPlan,
          color: "#97E4FF",
          tooltip: {
            valueFormatter: (value: any) =>
              globalFormat.formatRupiah(value) + " Rp(Juta)",
          },
        },
        {
          name: "FS: Fuel Cost Annualized",
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
    forceRerender2();
  });

  await grafikService
    .getGrafikPRP(router.params.id, yesterday)
    .then((res: any) => {
      dataGraphPRP.value = res.data[0].realisasi_proyeksi;
      for (var i = 0; i < res.data[0].realisasi_proyeksi.length; i++) {
        tahunPRP.value.push(res.data[0].realisasi_proyeksi[i].tahun);
        capexPRP.value.push(res.data[0].realisasi_proyeksi[i].capex_annualized);
        comBPRP.value.push(
          res.data[0].realisasi_proyeksi[i].cost_component_b_annualized
        );
        comDPRP.value.push(
          res.data[0].realisasi_proyeksi[i].cost_component_d_annualized
        );
        fuelComPRP.value.push(
          res.data[0].realisasi_proyeksi[i].fuel_cost_annualized
        );
        sumRevPRP.value.push(res.data[0].realisasi_proyeksi[i].total_revenue);
        revPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_annualized);
        sumLccPRP.value.push(res.data[0].realisasi_proyeksi[i].total_wlcc);
        revAPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_a);
        revBPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_b);
        revCPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_c);
        revDPRP.value.push(res.data[0].realisasi_proyeksi[i].revenue_komp_d);
      }

      dataGraphPRPPlan.value = res.data[0].planning;
      for (var j = 0; j < res.data[0].planning.length; j++) {
        // tahunPRPPlan.value.push(res.data[0].planning[j].tahun);
        capexPRPPlan.value.push(res.data[0].planning[j].capex_annualized);
        comBPRPPlan.value.push(
          res.data[0].planning[j].cost_component_b_annualized
        );
        comDPRPPlan.value.push(
          res.data[0].planning[j].cost_component_d_annualized
        );
        fuelComPRPPlan.value.push(res.data[0].planning[j].fuel_cost_annualized);
        revPRPPlan.value.push(res.data[0].planning[j].revenue_annualized);
        sumLccPRPPlan.value.push(res.data[0].planning[j].total_wlcc);
      }

      loading.value = false;
      isLoading.value = false;
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
            "Total Revenue",
            "Capex Annualized",
            "Cost Component B Annualized",
            "Cost Component D Annualized",
            "Fuel Cost Annualized",
            "Revenue A",
            "Revenue B",
            "Revenue C",
            "Revenue D",
            "FS: Revenue Annualized",
            "FS: Total LCC",
            "FS: Capex Annualized",
            "FS: Cost Component B Annualized",
            "FS: Cost Component D Annualized",
            "FS: Fuel Cost Annualized",
          ],
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunPRP,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 30, -25],
              fontSize: 15,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            splitNumber: 10,
            axisLabel: {
              // Formatter: (value: any) => value.toFixed(2),
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
            showSymbol: false,
            data: sumLccPRP,
            color: "#1E1F4E",
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
            color: "#DDE3EC",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Capex Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: capexPRP,
            color: "#A8E2FC",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comBPRP,
            color: "#212E7C",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component D Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comDPRP,
            color: "#B7DFCB",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Fuel Cost Annualized",
            type: "bar",
            stack: "Ad",
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
            name: "Revenue A",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revAPRP,
            color: "#DDE3EC",
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
            color: "#DDE3EC",
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
            color: "#DDE3EC",
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
            color: "#DDE3EC",
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
            zlevel: 2,
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
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Capex Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: capexPRPPlan,
            color: "#DDDDDD",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component B Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: comBPRPPlan,
            color: "#BFBFBF",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component D Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: comDPRPPlan,
            color: "#4B4B4B",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Fuel Cost Annualized",
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
        ],
      };
      forceRerender3();
    });

  await grafikService
    .getGrafikPRPLastYear(router.params.id)
    .then((res: any) => {
      dataGraphPRPLastYear.value = res.data[0].realisasi_proyeksi;
      for (var i = 0; i < res.data[0].realisasi_proyeksi.length; i++) {
        tahunLastYear.value.push(res.data[0].realisasi_proyeksi[i].tahun);
        capexLastYear.value.push(
          res.data[0].realisasi_proyeksi[i].capex_annualized
        );
        comBLastYear.value.push(
          res.data[0].realisasi_proyeksi[i].cost_component_b_annualized
        );
        comDLastYear.value.push(
          res.data[0].realisasi_proyeksi[i].cost_component_d_annualized
        );
        fuelComLastYear.value.push(
          res.data[0].realisasi_proyeksi[i].fuel_cost_annualized
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
      }

      dataGraphPRPLastYearPlan.value = res.data[0].planning;
      for (var j = 0; j < res.data[0].planning.length; j++) {
        capexLastYearPlan.value.push(res.data[0].planning[j].capex_annualized);
        comBLastYearPlan.value.push(
          res.data[0].planning[j].cost_component_b_annualized
        );
        comDLastYearPlan.value.push(
          res.data[0].planning[j].cost_component_d_annualized
        );
        fuelComLastYearPlan.value.push(
          res.data[0].planning[j].fuel_cost_annualized
        );
        revLastYearPlan.value.push(res.data[0].planning[j].revenue_annualized);
        sumLccLastYearPlan.value.push(res.data[0].planning[j].total_wlcc);
      }

      loading.value = false;
      isLoading.value = false;
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
            "Total Revenue",
            "Capex Annualized",
            "Cost Component B Annualized",
            "Cost Component D Annualized",
            "Fuel Cost Annualized",
            "Revenue A",
            "Revenue B",
            "Revenue C",
            "Revenue D",
            "FS: Revenue Annualized",
            "FS: Total LCC",
            "FS: Capex Annualized",
            "FS: Cost Component B Annualized",
            "FS: Cost Component D Annualized",
            "FS: Fuel Cost Annualized",
          ],
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "20%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: tahunLastYear,
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Triliun Rupiah",
            nameLocation: "center",
            nameTextStyle: {
              align: "left",
              padding: [30, 20, 30, -25],
              fontSize: 15,
              color: "#4D5E80",
              fontWeight: "bold",
            },
            splitNumber: 10,
            axisLabel: {
              // Formatter: (value: any) => value.toFixed(2),
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
            data: sumLccLastYear,
            color: "#1E1F4E",
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
            color: "#DDE3EC",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Capex Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: capexLastYear,
            color: "#A8E2FC",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component B Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comBLastYear,
            color: "#212E7C",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Cost Component D Annualized",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: comDLastYear,
            color: "#B7DFCB",
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "Fuel Cost Annualized",
            type: "bar",
            stack: "Ad",
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
            name: "Revenue A",
            type: "line",
            smooth: true,
            showSymbol: false,
            data: revALastYear,
            color: "#DDE3EC",
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
            color: "#DDE3EC",
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
            color: "#DDE3EC",
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
            color: "#DDE3EC",
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
            zlevel: 2,
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
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Capex Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: capexLastYearPlan,
            color: "#DDDDDD",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component B Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: comBLastYearPlan,
            color: "#BFBFBF",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Cost Component D Annualized",
            type: "bar",
            stack: "Ab",
            emphasis: {
              focus: "series",
            },
            data: comDLastYearPlan,
            color: "#4B4B4B",
            zlevel: 2,
            tooltip: {
              valueFormatter: (value: any) =>
                globalFormat.formatRupiah(value) + " Rp(Juta)",
            },
          },
          {
            name: "FS: Fuel Cost Annualized",
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
        ],
      };
      forceRerender4();
    });
});

function handleClick() {
  show.value = true;
}

function consoled() {
  console.log(selectedTitle.value);
}

const modalChart = ref({
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
    data: ["Realisasi + Proyeksi", "Planning"],
  },
  grid: {
    left: "4%",
    right: "4%",
    bottom: "8%",
    containLabel: true,
  },
  xAxis: [
    {
      show: true,
      type: "category",
      data: [
        "Revenue Annualized",
        "Fuel Cost Annualized",
        "Cost Component B Annualized",
        "Cost Component D Annualized",
        "Capex Annualized",
        "Total LCC",
      ],
    },
  ],
  yAxis: [
    {
      type: "value",
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
      data: [100, 100, 100, 100, 100, 100],
    },
    {
      name: "Realisasi + Proyeksi",
      type: "bar",
      stack: "Ad",
      label: {
        show: true,
        position: "top",
        formatter: "{c} k",
      },
      emphasis: {
        focus: "series",
      },
      data: [1000, 250, 689, 689, 289, 712],
    },
  ],
  color: ["#0D5A71", "#97E4FF"],
});

// function formatFixed(x: any) {
//   return Number.parseFloat(x).toFixed(2);
// }

provide("selectedTitle", selectedTitle);
</script>

<style scoped>
.input-slot-image {
  height: 20px;
  width: auto;
  margin-left: 8px;
  margin-top: -29px;
}

ul li.selected {
  border-bottom-width: 5px;
  border-color: #0099ad;
  color: #0099ad;
}

#tooltipContent::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent gray transparent;
}

#FilterContent {
  position: absolute;
  z-index: 1;
  top: 100%;
  /* left: 50%; */
  /* margin-top: -8px; */
  margin-left: -220px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
