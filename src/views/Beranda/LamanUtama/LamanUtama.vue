<template>
  <Loading v-if="isLoading" />
  <div class="flex">
    <div class="w-full p-6 text-lg font-medium bg-white rounded-lg">
      <h2 class="pb-2 text-lg font-bold">Total Pembangkit Terinput</h2>
      <div class="grid grid-cols-3 gap-4 my-4">
        <div class="relative flex justify-center px-5 overflow-hidden rounded-lg card card-bordered border-strokeColor">
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
          <div class="flex items-center">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="46" height="46" rx="23" fill="#F7FBFC" />
              <rect x="8" y="8" width="30" height="30" rx="15" fill="#0099AD" />
              <g clip-path="url(#clip0_7294_79707)">
                <path
                  d="M22.0229 18.5182C22.2714 17.4939 23.7286 17.4939 23.9771 18.5182C24.0144 18.6721 24.0875 18.815 24.1904 18.9353C24.2934 19.0556 24.4233 19.1499 24.5695 19.2105C24.7158 19.2711 24.8743 19.2963 25.0322 19.2841C25.1901 19.2719 25.3428 19.2225 25.478 19.1401C26.3781 18.5917 27.4088 19.6219 26.8605 20.5226C26.7782 20.6577 26.7289 20.8104 26.7167 20.9681C26.7045 21.1259 26.7297 21.2843 26.7902 21.4305C26.8508 21.5767 26.9449 21.7065 27.0651 21.8094C27.1852 21.9124 27.328 21.9855 27.4817 22.0229C28.5061 22.2714 28.5061 23.7286 27.4817 23.9771C27.3279 24.0144 27.185 24.0875 27.0647 24.1904C26.9444 24.2934 26.8501 24.4233 26.7895 24.5695C26.7289 24.7158 26.7037 24.8743 26.7159 25.0322C26.7281 25.1901 26.7775 25.3428 26.8599 25.478C27.4083 26.3781 26.3781 27.4088 25.4774 26.8605C25.3423 26.7782 25.1896 26.7289 25.0319 26.7167C24.8741 26.7045 24.7157 26.7297 24.5695 26.7902C24.4233 26.8508 24.2935 26.9449 24.1906 27.0651C24.0876 27.1852 24.0145 27.328 23.9771 27.4817C23.7286 28.5061 22.2714 28.5061 22.0229 27.4817C21.9856 27.3279 21.9125 27.185 21.8096 27.0647C21.7066 26.9444 21.5767 26.8501 21.4305 26.7895C21.2842 26.7289 21.1257 26.7037 20.9678 26.7159C20.8099 26.7281 20.6572 26.7775 20.522 26.8599C19.6219 27.4083 18.5912 26.3781 19.1395 25.4774C19.2218 25.3423 19.2711 25.1896 19.2833 25.0319C19.2955 24.8741 19.2703 24.7157 19.2098 24.5695C19.1492 24.4233 19.0551 24.2935 18.9349 24.1906C18.8147 24.0876 18.672 24.0145 18.5182 23.9771C17.4939 23.7286 17.4939 22.2714 18.5182 22.0229C18.6721 21.9856 18.815 21.9125 18.9353 21.8096C19.0556 21.7066 19.1499 21.5767 19.2105 21.4305C19.2711 21.2842 19.2963 21.1257 19.2841 20.9678C19.2719 20.8099 19.2225 20.6572 19.1401 20.522C18.5917 19.6219 19.6219 18.5912 20.5226 19.1395C21.1059 19.4942 21.8619 19.1803 22.0229 18.5182Z"
                  stroke="white" stroke-width="1.17" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M23 24.75C23.9665 24.75 24.75 23.9665 24.75 23C24.75 22.0335 23.9665 21.25 23 21.25C22.0335 21.25 21.25 22.0335 21.25 23C21.25 23.9665 22.0335 24.75 23 24.75Z"
                  stroke="white" stroke-width="1.17" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_7294_79707">
                  <rect width="14" height="14" fill="white" transform="translate(16 16)" />
                </clipPath>
              </defs>
            </svg>
            <div class="pt-1 pl-2">
              <div class="flex">
                <h2 class="text-[#0099AD] text-[22px] font-bold">
                  {{ globalFormat.formatRupiah(totalDaya.daya_terpasang) }}
                </h2>
                <p class="pl-2 text-[#7F7F80] text-base">MW</p>
                <div class="pt-2 pl-4" v-if="totalDaya.daya_terpasang_baru">
                  <svg width="13" height="10" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 0.200195L12 8.73353H0L6 0.200195Z" fill="#0EA976" />
                  </svg>
                </div>
                <p class="text-[#0EA976] pl-2 pt-0.5 text-sm" v-if="totalDaya.daya_terpasang_baru">
                  {{ globalFormat.formatRupiah(totalDaya.daya_terpasang_baru) }} MW
                </p>
              </div>
              <p class="text-sm font-semibold text-[#7F7F80]">Total Daya Terpasang</p>
            </div>
          </div>
        </div>
        <div class="relative flex justify-center px-5 overflow-hidden rounded-lg card card-bordered border-strokeColor">
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
          <div class="flex items-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="24" fill="#F7FBFC" />
              <rect x="8" y="8" width="32" height="32" rx="16" fill="#0099AD" />
              <path
                d="M26.6665 20.667H27.3332C27.6868 20.667 28.0259 20.8075 28.276 21.0575C28.526 21.3076 28.6665 21.6467 28.6665 22.0003V22.3337C28.6665 22.4221 28.7016 22.5068 28.7641 22.5694C28.8266 22.6319 28.9114 22.667 28.9998 22.667C29.0882 22.667 29.173 22.7021 29.2355 22.7646C29.2981 22.8271 29.3332 22.9119 29.3332 23.0003V25.0003C29.3332 25.0887 29.2981 25.1735 29.2355 25.236C29.173 25.2985 29.0882 25.3337 28.9998 25.3337C28.9114 25.3337 28.8266 25.3688 28.7641 25.4313C28.7016 25.4938 28.6665 25.5786 28.6665 25.667V26.0003C28.6665 26.3539 28.526 26.6931 28.276 26.9431C28.0259 27.1932 27.6868 27.3337 27.3332 27.3337H25.9998M21.3332 20.667H19.9998C19.6462 20.667 19.3071 20.8075 19.057 21.0575C18.807 21.3076 18.6665 21.6467 18.6665 22.0003V26.0003C18.6665 26.3539 18.807 26.6931 19.057 26.9431C19.3071 27.1932 19.6462 27.3337 19.9998 27.3337H20.6665M23.9998 21.3337L22.6665 24.0003H24.6665L23.3332 26.667"
                stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="pt-1 pl-2 font-bold ">
              <div class="flex">
                <h2 class="text-[#0099AD] text-[22px] font-bold">
                  {{ globalFormat.formatRupiah(totalDaya.daya_mampu) }}
                </h2>
                <p class="pl-2 text-[#7F7F80] text-base">MW</p>
              </div>
              <p class="text-sm font-semibold text-[#7F7F80]">Total Daya Mampu Netto</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center">
          <v-chart class="w-full h-[120px] mb-2" :option="ChartDaya" />
          <p class="text-sm text-center px-4 text-[#7F7F80]">
            Perbandingan<br>Daya Terpasang & Daya Terinput
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="flex">
    <div class="w-full bg-white h-[32rem] rounded-lg mt-2 mr-2 p-5 space-y-3">
      <h2 class="text-lg font-bold">Sebaran Unit Mesin</h2>
      <p class="text-xs text-[#989899]">
        Akumulasi dari keseluruhan Mesin Terinput dan Belum Terinput
      </p>
      <div class="grid grid-cols-3 gap-2">
        <div class="flex items-center space-x-1.5">
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="46" height="46" rx="23" fill="#F7FBFC" />
            <rect x="8" y="8" width="30" height="30" rx="15" fill="#0099AD" />
            <path
              d="M18.7662 27.7496C18.932 26.6924 19.3362 25.6764 19.9413 24.7682L19.9414 24.7682C20.534 23.8791 20.9095 22.8625 21.0763 21.8256C21.0863 21.7636 21.1168 21.7111 21.1541 21.6769C21.1895 21.6445 21.2249 21.6328 21.2577 21.6328H24.78C24.8129 21.6328 24.8483 21.6445 24.8836 21.6769C24.921 21.7111 24.9515 21.7635 24.9614 21.8255C25.1283 22.8624 25.5038 23.879 26.0964 24.7682C26.6961 25.6681 27.076 26.6808 27.2332 27.7434C27.2347 27.7537 27.2335 27.7589 27.2325 27.7619C27.2312 27.7659 27.228 27.7727 27.2203 27.781C27.2043 27.7984 27.1745 27.8152 27.1335 27.8152H18.8628C18.8216 27.8152 18.7924 27.7983 18.7772 27.7818C18.77 27.774 18.7674 27.768 18.7665 27.7651C18.7659 27.7632 18.7647 27.7592 18.7662 27.7496Z"
              stroke="white" stroke-width="1.33" />
            <path d="M20.6777 19H25.3203" stroke="white" stroke-width="1.33333" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
          <div>
            <div class="flex">
              <p class="text-base font-bold">{{ globalFormat.formatDecimal(sebaranUnit.total_mesin) }}</p>
              <p class="text-[#989899] pl-1.5">Unit</p>
              <svg width="14" height="12" class="mt-1.5 ml-3" viewBox="0 0 12 9" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M6 0.200195L12 8.73353H0L6 0.200195Z" fill="#0EA976" v-if="sebaranUnit.total_mesin_baru" />
              </svg>
              <p class="pl-1 text-[#0EA976]" v-if="sebaranUnit.total_mesin_baru">
                {{ globalFormat.formatDecimal(sebaranUnit.total_mesin_baru) }} Unit
              </p>
            </div>
            <p class="text-[#7F7F80] text-xs">Total Unit Mesin</p>
          </div>
        </div>
        <div class="flex items-center space-x-1.5">
          <svg width="47" height="46" viewBox="0 0 47 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.666504" width="46" height="46" rx="23" fill="#F7FBFC" />
            <rect x="8.6665" y="8" width="30" height="30" rx="15" fill="#0099AD" />
            <path
              d="M23.6665 25.333H18.9998C18.8451 25.333 18.6968 25.2716 18.5874 25.1622C18.478 25.0528 18.4165 24.9044 18.4165 24.7497V18.9163C18.4165 18.7616 18.478 18.6133 18.5874 18.5039C18.6968 18.3945 18.8451 18.333 18.9998 18.333H28.3332C28.4879 18.333 28.6363 18.3945 28.7456 18.5039C28.855 18.6133 28.9165 18.7616 28.9165 18.9163V23.583M25.4165 27.083L26.5832 28.2497L28.9165 25.9163M20.7498 27.6663H23.0832M21.9165 25.333V27.6663"
              stroke="#F7FBFC" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div>
            <div class="flex">
              <p class="text-base font-bold">
                {{ globalFormat.formatDecimal(sebaranUnit.total_mesin_terinput) }}
              </p>
              <p class="text-[#989899] pl-1.5">Unit</p>
            </div>
            <p class="text-[#7F7F80] text-xs">Total Unit Mesin Terinput</p>
          </div>
        </div>
        <div class="flex items-center space-x-1.5">
          <svg width="47" height="46" viewBox="0 0 47 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.333496" width="46" height="46" rx="23" fill="#F7FBFC" />
            <rect x="8.3335" y="8" width="30" height="30" rx="15" fill="#0099AD" />
            <path
              d="M20.4168 27.6663H26.2502M21.5835 25.333V27.6663M25.0835 25.333V27.6663M18.0835 18.9163C18.0835 18.7616 18.145 18.6133 18.2544 18.5039C18.3637 18.3945 18.5121 18.333 18.6668 18.333H28.0002C28.1549 18.333 28.3032 18.3945 28.4126 18.5039C28.522 18.6133 28.5835 18.7616 28.5835 18.9163V24.7497C28.5835 24.9044 28.522 25.0528 28.4126 25.1622C28.3032 25.2715 28.1549 25.333 28.0002 25.333H18.6668C18.5121 25.333 18.3637 25.2715 18.2544 25.1622C18.145 25.0528 18.0835 24.9044 18.0835 24.7497V18.9163Z"
              stroke="#F7FBFC" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div>
            <div class="flex">
              <p class="text-base font-bold">
                {{ globalFormat.formatDecimal(sebaranUnit.total_mesin_belum_input) }}
              </p>
              <p class="text-[#989899] pl-1.5">Unit</p>
            </div>
            <button @click="openModalUnit" class="text-[#7F7F80] text-xs focus:outline-none flex items-center">
              Total Unit Mesin Belum Terinput
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#0099ad"
                  d="M13.293 7.293a.999.999 0 0 0 0 1.414L15.586 11H8a1 1 0 0 0 0 2h7.586l-2.293 2.293a.999.999 0 1 0 1.414 1.414L19.414 12l-4.707-4.707a.999.999 0 0 0-1.414 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <hr class="w-full" />
      <h2 class="text-sm font-bold">Kategori Pembangkit</h2>
      <div class="flex flex-row p-5 space-x-5 h-[62%]  border rounded-lg">
        <div class="w-3/12 overflow-y-auto border-r-2">
          <ul class="flex-col -mb-px text-sm font-medium text-[#7F7F80] overflow-y-auto space-y-3">
            <li class="relative cursor-pointer hover:bg-primaryColor hover:bg-opacity-5"
              v-for="(item, index) in kategoriPembangkit" :key="index"
              @click="changePage(item.kode_jenis_pembangkit, item.id_daya)">
              <p class="inline-flex p-2.5 text-sm text-left" :class="[
                tabs2 === item.kode_jenis_pembangkit
                  ? 'font-semibold text-[#0099AD]'
                  : 'font-normal',
                tabs2 === item.kode_jenis_pembangkit ? 'bg-primaryColor bg-opacity-5 w-full' : ''
              ]">
                {{ item.kode_jenis_pembangkit }}
              </p>
              <div v-if="tabs2 === item.kode_jenis_pembangkit"
                class="border-l-4 rounded-t-lg border-[#0099AD] h-full absolute top-0 rounded-lg">
              </div>
            </li>
          </ul>
        </div>
        <div class="w-9/12 h-full">
          <template v-for="item in kategoriPembangkit" :key="item.kode_jenis_pembangkit">
            <div class="h-full space-y-5" v-if="tabs2 === item.kode_jenis_pembangkit">
              <div class="flex flex-col justify-between h-full">
                <div class="flex flex-col">
                  <h2 class="text-sm font-semibold">Jumlah Unit Mesin</h2>
                  <p class="text-sm text-[#989899]">Jumlah Unit Mesin didapatkan berdasarkan kategori pembangkit</p>
                </div>
                <div class="flex flex-row items-center">
                  <v-chart class="h-48" :option="ChartPembangkit" autoresize />
                  <div class="w-full space-y-2">
                    <p class="font-semibold">Keterangan : </p>
                    <div class="flex items-center space-x-1.5">
                      <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                      <p class="text-sm">Unit Terinput</p>
                    </div>
                    <div class="flex items-center space-x-1.5">
                      <div class="w-3 h-3 rounded-full bg-warningColor"></div>
                      <p class="text-sm">Unit Belum Terinput</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="flex flex-col bg-white h-[32rem] w-1/3 rounded-lg mt-2 p-5 space-y-3">
      <h2 class="text-lg font-bold">Mesin Baru COD</h2>
      <div class="flex pb-[22px]">
        <svg width="55" height="55" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="46" height="46" rx="23" fill="#F7FBFC" />
          <rect x="8" y="8" width="30" height="30" rx="15" fill="#0099AD" />
          <path
            d="M25.6665 19.667H26.3332C26.6868 19.667 27.0259 19.8075 27.276 20.0575C27.526 20.3076 27.6665 20.6467 27.6665 21.0003V21.3337C27.6665 21.4221 27.7016 21.5068 27.7641 21.5694C27.8266 21.6319 27.9114 21.667 27.9998 21.667C28.0882 21.667 28.173 21.7021 28.2355 21.7646C28.2981 21.8271 28.3332 21.9119 28.3332 22.0003V24.0003C28.3332 24.0887 28.2981 24.1735 28.2355 24.236C28.173 24.2985 28.0882 24.3337 27.9998 24.3337C27.9114 24.3337 27.8266 24.3688 27.7641 24.4313C27.7016 24.4938 27.6665 24.5786 27.6665 24.667V25.0003C27.6665 25.3539 27.526 25.6931 27.276 25.9431C27.0259 26.1932 26.6868 26.3337 26.3332 26.3337H24.9998M20.3332 19.667H18.9998C18.6462 19.667 18.3071 19.8075 18.057 20.0575C17.807 20.3076 17.6665 20.6467 17.6665 21.0003V25.0003C17.6665 25.3539 17.807 25.6931 18.057 25.9431C18.3071 26.1932 18.6462 26.3337 18.9998 26.3337H19.6665M22.9998 20.3337L21.6665 23.0003H23.6665L22.3332 25.667"
            stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div>
          <div class="flex text-lg">
            <p class="pt-2 pl-2 font-bold">
              {{ globalFormat.formatRupiah(totalDaya.daya_terpasang_baru) }}
            </p>
            <p class="pl-2 pt-2 text-[#7F7F80]">MW</p>
          </div>
          <p class="pl-2 text-xs text-[#7F7F80]">Total Daya Terpasang</p>
        </div>
      </div>
      <hr class="w-full" />
      <div class="flex justify-between">
        <h3 class="text-sm font-bold">Mesin Terakhir COD</h3>
        <button @click="openModalCOD" class="text-xs text-[#4791F2]">
          Lihat Semua
        </button>
      </div>
      <div class="flex items-center justify-between" v-for="item in mesinBaru" :key="item.id_mesin">
        <div class="flex flex-row items-center space-x-1 w-[85%]">
          <div class="w-fit">
            <div class="w-8 h-8 rounded-full bg-slate-400"></div>
          </div>
          <div class="flex flex-col items-start justify-start w-full overflow-x-auto">
            <p class="text-xs font-bold truncate">{{ item.mesin }}</p>
            <p class="text-xxs">{{ item.tahun_operasi }}</p>
          </div>
        </div>
        <p class="flex flex-row items-center ml-auto font-bold text-xxs ">{{
          globalFormat.formatRupiah(item.daya_terpasang) }}
          <span class="text-[#7F7F80] text-xxs pl-0.5">MW</span>
        </p>
      </div>
    </div>
  </div>

  <ModalWrapper :show-modal="isModalUnit" :width="'max-w-3xl'" :height="'h-full'">
    <div class="flex flex-col space-y-2.5 text-primaryTextColor">
      <h2 class="text-base font-bold">
        Total Unit Mesin Belum Terinput
        <button @click="closeModalUnit" class="float-right text-gray-500 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </h2>
      <div class="flex">
        <svg width="50" height="50" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="46" height="46" rx="23" fill="#F7FBFC" />
          <rect x="8" y="8" width="30" height="30" rx="15" fill="#0099AD" />
          <path
            d="M25.6665 19.667H26.3332C26.6868 19.667 27.0259 19.8075 27.276 20.0575C27.526 20.3076 27.6665 20.6467 27.6665 21.0003V21.3337C27.6665 21.4221 27.7016 21.5068 27.7641 21.5694C27.8266 21.6319 27.9114 21.667 27.9998 21.667C28.0882 21.667 28.173 21.7021 28.2355 21.7646C28.2981 21.8271 28.3332 21.9119 28.3332 22.0003V24.0003C28.3332 24.0887 28.2981 24.1735 28.2355 24.236C28.173 24.2985 28.0882 24.3337 27.9998 24.3337C27.9114 24.3337 27.8266 24.3688 27.7641 24.4313C27.7016 24.4938 27.6665 24.5786 27.6665 24.667V25.0003C27.6665 25.3539 27.526 25.6931 27.276 25.9431C27.0259 26.1932 26.6868 26.3337 26.3332 26.3337H24.9998M20.3332 19.667H18.9998C18.6462 19.667 18.3071 19.8075 18.057 20.0575C17.807 20.3076 17.6665 20.6467 17.6665 21.0003V25.0003C17.6665 25.3539 17.807 25.6931 18.057 25.9431C18.3071 26.1932 18.6462 26.3337 18.9998 26.3337H19.6665M22.9998 20.3337L21.6665 23.0003H23.6665L22.3332 25.667"
            stroke="white" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div>
          <div class="flex">
            <p class="pt-1 pl-2 font-bold">{{ globalFormat.formatDecimal(sebaranUnit.total_mesin_belum_input) }} <span
                class="text-[#7F7F80]">Unit</span></p>
          </div>
          <p class="pl-2 text-xs text-[#7F7F80]">
            Total Unit Mesin Belum Terinput
          </p>
        </div>
      </div>
      <hr class="w-full mx-auto" />
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold">5 Mesin Terakhir Belum Terinput</h3>
        <button @click="handlePushPage" class="text-xs font-semibold underline text-primaryColor">Lihat Semua</button>
      </div>
      <div class="flex items-center justify-center border rounded-lg">
        <table class="w-full text-sm text-gray-500 rounded-xl">
          <thead class="text-xs border-b text-[#0099AD] top-0 text-left">
            <tr>
              <th scope="col" class="px-3 py-3 font-bold">Unit Sentral</th>
              <th scope="col" class="px-3 py-3 font-bold">Unit Mesin</th>
              <th scope="col" class="px-3 py-3 font-bold">Daya Terpasang</th>
            </tr>
          </thead>
          <tbody class="text-xs text-gray-900">
            <tr class="border-b last:border-none" v-for="item in mesinBelumInput.slice(0, 5)" :key="item.id_mesin">
              <td class="px-3 py-3 text-left">
                {{ item.sentral }}
              </td>
              <td class="px-3 py-3 text-left">
                {{ item.mesin }}
              </td>
              <td class="px-3 py-3 text-center">
                {{ globalFormat.formatRupiah(item.daya_terpasang) }} MW
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </ModalWrapper>
  <ModalWrapper :show-modal="isModalCOD" :width="'w-[50%]'" :height="'max-h-[500px]'" class="overflow-auto">
    <div class="space-y-3.5 overflow-auto">
      <h2 class="text-lg font-bold text-gray-600">
        Mesin Terakhir COD
        <button @click="closeModalCOD" class="float-right text-gray-500 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </h2>
      <SearchBox @on-click="handleSearch" @on-key-enter="handleSearch" v-model="searchQuery" class="w-full" />
      <TableComponent class="max-h-[18rem]">
        <template v-slot:table-header>
          <tr>
            <th scope="col" class="text-left">Unit Sentral</th>
            <th scope="col" class="text-left">Unit Mesin</th>
            <th scope="col" class="text-center">Tahun <br>Update</th>
            <th scope="col" class="text-center">Daya Terpasang <br>(MW)</th>
          </tr>
        </template>
        <template v-slot:table-body class="overflow-auto">
          <template v-if="filteredMesin.length">
            <tr class="text-gray-900 border" v-for="(item, index) in filteredMesin" :key="item.id_mesin">
              <td class="text-left">
                {{ item.sentral }}
              </td>
              <td class="text-left">
                {{ item.mesin }}
              </td>
              <td class="text-center">
                {{ item.tahun_operasi }}
              </td>
              <td class="text-center">
                {{ globalFormat.formatRupiah(item.daya_terpasang) }}
              </td>
            </tr>
          </template>
          <template v-else>
            <tr class="border">
              <td class="text-center" colspan="4">
                Data Tidak Tersedia
              </td>
            </tr>
          </template>
        </template>
      </TableComponent>
      <nav class="flex items-center justify-between pb-4 pl-4 pr-4 bg-white rounded-b-lg" aria-label="Table navigation">
        <div class="flex items-center space-x-2 text-sm">
          <span>Menampilkan</span>
          <select v-model="limitMesinBaru" @change="handlePageSizeChange"
            class="p-2 text-sm text-gray-500 border-r-4 border-transparent rounded-lg cursor-pointer outline-1 outline outline-gray-300">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <span>dari <span class="font-bold">{{ totalRecords }}</span> data </span>
        </div>
        <ul class="flex items-center space-x-3">
          <li>
            <button href="#" @click.prevent="handlePreviousClick" :disabled="pageMesinBaru === 1"
              class="block px-2 py-2 ml-0 duration-300 bg-white text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
              <span class="sr-only">Previous</span>
              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </li>
          <li v-for="(item, index) in displayedPages" :key="index"
            :class="{ ' text-white rounded-md bg-primaryColor': item === pageMesinBaru }"
            :style="{ 'pointer-events': item === pageMesinBaru ? 'none' : 'auto' }"
            class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer hover:bg-blue-500 hover:rounded-md hover:text-white"
            @click="handlePageChange(item)">
            {{ item }}
          </li>
          <li>
            <button href="#" @click.prevent="handleNextClick" :disabled="pageMesinBaru === totalPages"
              class="block px-2 py-2 ml-0 duration-300 bg-white text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
              <span class="sr-only">Next</span>
              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import { use } from "echarts/core";
import { useRouter } from "vue-router";
const router = useRouter();
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, BarChart, LineChart } from "echarts/charts";
import LamanService from "@/services/laman-service";
const lamanService = new LamanService();
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import TableComponent from "@/components/ui/Table.vue";
import SearchBox from "@/components/ui/SearchBox.vue";

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

const isLoading = ref(false);
const totalDaya = ref<any>({ data: null });
const sebaranUnit = ref<any>({ data: null });
const chartDaya = ref<any>({ data: null });
const chartKategori = ref<any>({ data: null });
const kategoriPembangkit = ref<any[]>([]);
const mesinBaru = ref<any[]>([]);
const mesinBelumInput = ref<any[]>([]);
const isModalUnit = ref(false);
const isModalCOD = ref(false);
const pageMesinBaru = ref(1);
const limitMesinBaru = ref(5);
const totalRecords = ref();
const totalPages = ref(0);
const searchQuery = ref("");
const maxDisplayedPages = ref(5);
const tabs = ref<string>('');
const tabs2 = ref<string | null>(null);
const kodeJenisPembangkit = ref<string[]>([]);
const kodePengelola = ref<string[]>([]);
const dayaMampu = ref<string[]>([]);
const filteredMesin = ref<MesinTerinputItem[]>([]);
const totalMesinBelumTerinput = ref<number>();
const navigation = ref<{
  currentPage: number,
  totalPages: number,
  totalRecords: number,
  limit: number
}>({
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10
});

interface MesinTerinputItem {
  id_mesin: string;
  sentral: string;
  mesin: string;
  tahun_operasi: string;
  daya_terpasang: number;
}

let response: any;

const closeModalUnit = () => {
  isModalUnit.value = false;
  // Reset selectedParameterId
};

const openModalUnit = () => {
  isModalUnit.value = true;
  // Reset selectedParameterId
};

const closeModalCOD = () => {
  isModalCOD.value = false;
  // Reset selectedParameterId
};

const openModalCOD = () => {
  isModalCOD.value = true;
  // Reset selectedParameterId
};

const handlePageChange = async (newPage: number) => {
  isLoading.value = true;
  pageMesinBaru.value = newPage;
  const data = await getMesinBaru(pageMesinBaru.value, limitMesinBaru.value, searchQuery.value);
  filteredMesin.value = data;
  isLoading.value = false;
};

const displayedPages = computed(() => {
  const startPage = Math.max(1, pageMesinBaru.value - Math.floor(maxDisplayedPages.value / 2));
  const endPage = Math.min(totalPages.value, startPage + maxDisplayedPages.value - 1);
  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const handlePageSizeChange = async () => {
  isLoading.value = true;
  pageMesinBaru.value = 1; // Reset halaman ke halaman pertama
  const data = await getMesinBaru(pageMesinBaru.value, limitMesinBaru.value, searchQuery.value);
  filteredMesin.value = data;
  isLoading.value = false;
};

// Tombol Previous
const handlePreviousClick = async () => {
  if (pageMesinBaru.value > 1) {
    await handlePageChange(pageMesinBaru.value - 1);
  }
};

const handleNextClick = async () => {
  if (pageMesinBaru.value < totalPages.value) {
    await handlePageChange(pageMesinBaru.value + 1);
  }

};

const handleSearch = async () => {
  isLoading.value = true;
  const data = await getMesinBaru(pageMesinBaru.value, limitMesinBaru.value, searchQuery.value);
  filteredMesin.value = data;
  isLoading.value = false;
};

const getTotalDaya = async () => {
  try {
    response = await lamanService.getTotalDaya();
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getChartDaya = async () => {
  try {
    response = await lamanService.getChartDaya();
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getChartKategori = async (kategori: any, id_daya: any) => {
  try {
    response = await lamanService.getChartKategori(kategori, id_daya);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getSebaranUnit = async () => {
  try {
    response = await lamanService.getSebaranUnit();

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getMesinBaru = async (page?: any, limit?: any, search?: any) => {
  try {
    response = await lamanService.getMesinBaru(page, limit, search);
    const responseData = response;
    const { data, meta } = responseData;

    totalRecords.value = meta.totalRecords;
    totalPages.value = meta.totalPages;
    limitMesinBaru.value = meta.limit;
    // Update jumlah total data
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getMesinBelumInput = async () => {
  try {
    const response: any = await lamanService.getMesinBelumInput(navigation.value.currentPage, navigation.value.limit, kodePengelola.value, '');
    mesinBelumInput.value = response.data;
    totalMesinBelumTerinput.value = response.meta.totalRecords;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const getKategoriPembangkit = async () => {
  try {
    response = await lamanService.getKategoriPembangkit();
    if (response.data.length > 0) {
      tabs.value = response.data[0].kode_jenis_pembangkit;
      tabs2.value = response.data[0].kode_jenis_pembangkit;
    } else {
      console.warn("Array is empty. Unable to set tabs2.value.");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

pageMesinBaru.value = 1;

const dataChart = ref<Array<{ value: number; name: string }>>([]);

const dataChartsKategori = ref<Array<{ value: number, name: string }>>([]);

async function changePage(kodeJenisPembangkit: any, idDaya: number) {
  isLoading.value = true;
  try {
    if (kodeJenisPembangkit.includes('PLTU')) {
      tabs.value = 'PLTU';
    } else {
      tabs.value = kodeJenisPembangkit;
    }
    tabs2.value = kodeJenisPembangkit;
    const dataChartKategori = await getChartKategori(tabs.value, idDaya);
    chartKategori.value = dataChartKategori;
    console.log(chartKategori.value);
    dataChartsKategori.value = [
      { value: chartKategori.value.total_mesin_terinput, name: 'Unit Terinput' },
      { value: chartKategori.value.total_mesin_belum_terinput, name: 'Unit Belum Terinput' },
    ];
  } catch (error) {
    console.error('Change Page Error : ', error);
  } finally {
    isLoading.value = false;
  }
}
let tooltipDayaTerpasang: any;
let tooltipDayaTerinput: any;
const ChartDaya = ref({
  tooltip: {
    trigger: 'item',
    formatter: () => {
      return `<span style="font-weight: bold;color:black">Total Daya </span><br/>${tooltipDayaTerinput}${tooltipDayaTerpasang}`;
    },
    textStyle: {
      color: '#0009',
      fontSize: 12,
      position: 'center',
    },
  },
  series: [
    {
      type: 'pie',
      name: 'Total Daya',
      radius: ['70%', '90%'],
      center: ['50%', '55%'],
      avoidLabelOverlap: false,
      stillShowZeroSum: false,
      showEmptyCircle: true,
      label: {
        show: true,
        position: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        formatter: () => {
          return `${globalFormat.formatRupiah(chartDaya.value.persentase)}%`;
        },
      },
      emphasis: {
        disabled: true,
      },
      data: dataChart,
    },
  ],
  color: ['#0099AD', '#80C1CD'],
});

const ChartPembangkit = ref({
  tooltip: {
    trigger: "item",
  },
  series: [
    {
      type: "pie",
      name: "Jumlah Unit Mesin",
      radius: ["100%", "80%"],
      center: ["50%", "50%"],
      avoidLabelOverlap: true,
      stillShowZeroSum: false,
      showEmptyCircle: true,
      itemStyle: {
        borderRadius: 0,
        borderColor: "#fff",
        borderWidth: 4,
      },
      label: {
        show: true,
        position: "center",
        fontSize: 25,
        fontWeight: "bold",
        formatter: () => {
          return `{x|${chartKategori.value.total_mesin}}\n{y|Unit Mesin}`;
        },
        rich: {
          x: {
            fontSize: 40,
            fontWeight: "bold",
            color: "black",
          },
          y: {
            color: "black",
          },
        },
      },
      labelLine: {
        show: false,
      },
      data: dataChartsKategori,
    },
  ],
  color: ["#0C9F6E", "#FF5656"],
});
const handlePushPage = () => {
  isModalUnit.value = false;
  router.push({ name: 'mesin-belum-terinput' });
}

watch(isModalUnit, (value) => {
  value === true ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
})

watch(isLoading, (value) => {
  value === true ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
})

watch(isModalCOD, (value) => {
  value === true ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
})

onMounted(async () => {
  isLoading.value = true;
  const dataTotalDaya = await getTotalDaya();
  const dataSebaranUnit = await getSebaranUnit();
  const dataMesinBaru = await getMesinBaru(pageMesinBaru.value, limitMesinBaru.value, searchQuery.value);
  const dataMesinBelumInput = await getMesinBelumInput();
  const dataKategoriPembangkit = await getKategoriPembangkit();
  const dataChartDaya = await getChartDaya();
  const dataChartKategori = await getChartKategori(tabs2.value, 0);
  chartDaya.value = dataChartDaya;
  chartKategori.value = dataChartKategori;
  dataChart.value = [
    { value: chartDaya.value.daya_terpasang, name: "Total Daya Terpasang" },
    { value: chartDaya.value.daya_terinput, name: "Total Daya Terinput" }
  ];
  dataChartsKategori.value = [
    { value: chartKategori.value.total_mesin_terinput, name: 'Unit Terinput' },
    { value: chartKategori.value.total_mesin_belum_terinput, name: 'Unit Belum Terinput' },
  ];
  totalDaya.value = dataTotalDaya;
  sebaranUnit.value = dataSebaranUnit;
  mesinBaru.value = dataMesinBaru;
  filteredMesin.value = mesinBaru.value;
  for (const value of dataKategoriPembangkit) {
    kategoriPembangkit.value.push({
      ...value,
      id_daya: value.kode_jenis_pembangkit === 'PLTU < 100' ? 1 : value.kode_jenis_pembangkit === 'PLTU 100 - 400' ? 2 : value.kode_jenis_pembangkit === 'PLTU > 400' ? 3 : 0
    })
  }
  console.log(kategoriPembangkit.value);
  if (kategoriPembangkit.value.length > 0) {
    tabs2.value = kategoriPembangkit.value[0].kode_jenis_pembangkit;
  }
  tooltipDayaTerinput = `<div style="align-items: center; flex-direction: row; display: flex; justify-content: space-between;">
      <div style="flex-direction: row; display: flex; align-items: center;">
        <div style="width: 8px; height: 8px; border-radius: 999px; background-color: #80C1CD; margin-right: 5px;"></div>
        <span>Daya Terinput</span>
      </div>
      <span style="font-weight: bold;color:black">&nbsp;&nbsp;&nbsp;&nbsp;
          ${globalFormat.formatRupiah(chartDaya.value.daya_terinput ? chartDaya.value.daya_terinput : '0')} 
        MW
      </span>
    </div>`;
  tooltipDayaTerpasang = `<div style="align-items: center; flex-direction: row; display: flex; justify-content: space-between;">
      <div style="flex-direction: row; display: flex; align-items: center;">
        <div style="width: 8px; height: 8px; border-radius: 999px; background-color: #0099AD; margin-right: 5px;"></div>
        <span>Daya Terpasang</span>
      </div>
      <span style="font-weight: bold;color:black">&nbsp;&nbsp;&nbsp;&nbsp;
          ${globalFormat.formatRupiah(chartDaya.value.daya_terpasang ? chartDaya.value.daya_terpasang : '0')} 
        MW
      </span>
    </div>`;
  isLoading.value = false;
});
</script>

<style scoped>
.hover-content {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.hover-item {
  margin-bottom: 5px;
}

td {
  padding: 0.8rem;
}
</style>
