<template>
  <div class="flex items-center justify-center">
    <div class="relative text-lg">
      <button
        class="text-[#0099AD] hover:text-white hover:border-[#007E8F] bg-white border border-[#0099AD] hover:bg-[#007E8F] duration-300 active:ring rounded-lg text-sm p-3 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD]"
        @click="isOptionsExpanded = !isOptionsExpanded">
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M0.729004 1.75008C0.729004 1.42792 0.990171 1.16675 1.31234 1.16675H12.6873C13.0095 1.16675 13.2707 1.42792 13.2707 1.75008C13.2707 2.07225 13.0095 2.33341 12.6873 2.33341H12.3957V8.31258C12.3957 9.35962 11.5469 10.2084 10.4998 10.2084H9.99667L10.6157 12.0656C10.7176 12.3712 10.5524 12.7016 10.2468 12.8035C9.94117 12.9054 9.61082 12.7402 9.50894 12.4345L9.35023 11.9584H4.64945L4.49074 12.4345C4.38886 12.7402 4.0585 12.9054 3.75287 12.8035C3.44724 12.7016 3.28206 12.3712 3.38394 12.0656L4.00301 10.2084H3.49984C2.4528 10.2084 1.604 9.35962 1.604 8.31258V2.33341H1.31234C0.990171 2.33341 0.729004 2.07225 0.729004 1.75008ZM2.77067 2.33341V8.31258C2.77067 8.71529 3.09713 9.04175 3.49984 9.04175H10.4998C10.9025 9.04175 11.229 8.71529 11.229 8.31258V2.33341H2.77067ZM5.23278 10.2084L5.03834 10.7917H8.96134L8.76689 10.2084H5.23278ZM8.74984 3.35425C9.072 3.35425 9.33317 3.61542 9.33317 3.93758V7.43758C9.33317 7.75975 9.072 8.02091 8.74984 8.02091C8.42767 8.02091 8.1665 7.75975 8.1665 7.43758V3.93758C8.1665 3.61542 8.42767 3.35425 8.74984 3.35425ZM6.99984 4.66675C7.322 4.66675 7.58317 4.92792 7.58317 5.25008V7.43758C7.58317 7.75975 7.322 8.02091 6.99984 8.02091C6.67767 8.02091 6.4165 7.75975 6.4165 7.43758V5.25008C6.4165 4.92792 6.67767 4.66675 6.99984 4.66675ZM5.24984 5.97925C5.572 5.97925 5.83317 6.24042 5.83317 6.56258V7.43758C5.83317 7.75975 5.572 8.02091 5.24984 8.02091C4.92767 8.02091 4.6665 7.75975 4.6665 7.43758V6.56258C4.6665 6.24042 4.92767 5.97925 5.24984 5.97925Z"
            fill="#0099AD" />
        </svg>
        <span class="ml-2 font-semibold">Best Performance Assets</span>
      </button>
      <Transition enter-active-class="transition duration-500 transform ease-custom"
        enter-class="scale-y-0 -translate-y-1/2 opacity-0" enter-to-class="scale-y-100 translate-y-0 opacity-100"
        leave-active-class="transition duration-300 transform ease-custom"
        leave-class="scale-y-100 translate-y-0 opacity-100" leave-to-class="scale-y-0 -translate-y-1/2 opacity-0">
        <div v-show="isOptionsExpanded"
          class="absolute z-10 w-auto p-2 mt-1 overflow-hidden bg-white border border-gray-300 divide-y rounded-lg shadow-lg -right-3">
          <div class=" max-y-[600px] overflow-y-auto space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-medium">
                Best Performance Assets
              </h3>
              <div class="flex items-center mr-4">
                <p class="mr-2 text-sm font-medium">Periode</p>
                <div class="w-32 z-[25]">
                  <select v-model="yearModel" @change="fetchBestPerformance"
                    class="mt-1 border border-gray-300 text-gray-900 text-sm rounded-lg hover:cursor-pointer focus:ring-[#0099AD] focus:border-[#0099AD] block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                    <option disable hidden>Pilih Tahun</option>
                    <option v-for="item in tahun" :key="item" :value="item">{{ item }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="block max-w-[55rem] max-h-[50rem] overflow-y-auto rounded-lg bg-white scrollbar-hide">
              <TableComponent>
                <template v-slot:table-header>
                  <tr>
                    <th scope="col" class="text-xs text-center">No</th>
                    <th scope="col" class="text-xs">Unit Pengelola</th>
                    <th scope="col" class="text-xs">Unit Sentral</th>
                    <th scope="col" class="text-xs">Unit Mesin</th>
                    <th scope="col" class="text-xs text-center">
                      NPV On Equity Rp (Juta)
                    </th>
                    <th scope="col" class="text-xs text-center">
                      IRR On Equity (%)
                    </th>
                    <th scope="col" class="text-xs text-center">
                      Average NCF (%)
                    </th>
                  </tr>
                </template>
                <template v-slot:table-body>
                  <template v-if="bpaData.length">
                    <tr class="text-gray-900 border border-gray-300" v-for="(item, index) in bpaData"
                      :key="item.kode_sentral">
                      <td scope="row" class="text-xs font-normal text-center whitespace-nowrap">
                        {{ index + 1 }}
                      </td>
                      <td class="text-xs">
                        {{ item.pengelola }}
                      </td>
                      <td class="text-xs">
                        {{ item.sentral }}
                      </td>
                      <td class="text-xs">
                        {{ item.mesin }}
                      </td>
                      <td class="text-xs text-end">
                        {{ globalFormat.formatRupiah(item.npv_equity) }}
                      </td>
                      <td class="text-xs text-end">
                        {{ globalFormat.formatRupiah(item.irr_equity) }}
                      </td>
                      <td class="text-xs text-end">
                        {{ globalFormat.formatRupiah(item.average_cf) }}
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr class="text-gray-900 border border-gray-300">
                      <td class="p-2" colspan="7">
                        <svg width="170" height="150" class="m-auto" viewBox="0 0 74 60" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <ellipse cx="36.2549" cy="30.94" rx="22.4673" ry="21.9744" fill="#D3D3D3"
                            fill-opacity="0.2" />
                          <ellipse cx="36.2546" cy="30.9399" rx="17.9739" ry="17.5795" fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M18.3727 12.643C18.6766 12.643 18.9229 12.402 18.9229 12.1048C18.9229 11.8076 18.6766 11.5667 18.3727 11.5667C18.0688 11.5667 17.8225 11.8076 17.8225 12.1048C17.8225 12.402 18.0688 12.643 18.3727 12.643ZM18.3727 12.9121C18.8285 12.9121 19.198 12.5506 19.198 12.1048C19.198 11.659 18.8285 11.2976 18.3727 11.2976C17.9169 11.2976 17.5474 11.659 17.5474 12.1048C17.5474 12.5506 17.9169 12.9121 18.3727 12.9121Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M12.0451 29.5946C12.3489 29.5946 12.5953 29.3537 12.5953 29.0565C12.5953 28.7593 12.3489 28.5183 12.0451 28.5183C11.7412 28.5183 11.4948 28.7593 11.4948 29.0565C11.4948 29.3537 11.7412 29.5946 12.0451 29.5946ZM12.0451 29.8637C12.5009 29.8637 12.8704 29.5023 12.8704 29.0565C12.8704 28.6107 12.5009 28.2493 12.0451 28.2493C11.5892 28.2493 11.2197 28.6107 11.2197 29.0565C11.2197 29.5023 11.5892 29.8637 12.0451 29.8637Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M3.2892 32.6369C3.59308 32.6369 3.83942 32.3959 3.83942 32.0987C3.83942 31.8015 3.59308 31.5606 3.2892 31.5606C2.98532 31.5606 2.73898 31.8015 2.73898 32.0987C2.73898 32.3959 2.98532 32.6369 3.2892 32.6369ZM3.2892 32.9059C3.74502 32.9059 4.11453 32.5445 4.11453 32.0987C4.11453 31.6529 3.74502 31.2915 3.2892 31.2915C2.83338 31.2915 2.46387 31.6529 2.46387 32.0987C2.46387 32.5445 2.83338 32.9059 3.2892 32.9059Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M27.1763 8.60673C27.7841 8.60673 28.2768 8.12485 28.2768 7.53043C28.2768 6.93601 27.7841 6.45413 27.1763 6.45413C26.5686 6.45413 26.0759 6.93601 26.0759 7.53043C26.0759 8.12485 26.5686 8.60673 27.1763 8.60673ZM27.1763 8.8758C27.936 8.8758 28.5519 8.27346 28.5519 7.53043C28.5519 6.7874 27.936 6.18506 27.1763 6.18506C26.4166 6.18506 25.8008 6.7874 25.8008 7.53043C25.8008 8.27346 26.4166 8.8758 27.1763 8.8758Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M13.4205 44.9318C13.7244 44.9318 13.9708 44.6909 13.9708 44.3936C13.9708 44.0964 13.7244 43.8555 13.4205 43.8555C13.1167 43.8555 12.8703 44.0964 12.8703 44.3936C12.8703 44.6909 13.1167 44.9318 13.4205 44.9318ZM13.4205 45.2009C13.8764 45.2009 14.2459 44.8395 14.2459 44.3936C14.2459 43.9478 13.8764 43.5864 13.4205 43.5864C12.9647 43.5864 12.5952 43.9478 12.5952 44.3936C12.5952 44.8395 12.9647 45.2009 13.4205 45.2009Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M13.9708 9.14506C14.5785 9.14506 15.0712 8.66318 15.0712 8.06876C15.0712 7.47434 14.5785 6.99246 13.9708 6.99246C13.363 6.99246 12.8703 7.47434 12.8703 8.06876C12.8703 8.66318 13.363 9.14506 13.9708 9.14506ZM13.9708 9.41413C14.7305 9.41413 15.3463 8.81179 15.3463 8.06876C15.3463 7.32573 14.7305 6.72339 13.9708 6.72339C13.2111 6.72339 12.5952 7.32573 12.5952 8.06876C12.5952 8.81179 13.2111 9.41413 13.9708 9.41413Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M5.63678 18.9463C6.24454 18.9463 6.73722 18.4645 6.73722 17.87C6.73722 17.2756 6.24454 16.7937 5.63678 16.7937C5.02903 16.7937 4.53634 17.2756 4.53634 17.87C4.53634 18.4645 5.02903 18.9463 5.63678 18.9463ZM5.63678 19.2154C6.39648 19.2154 7.01233 18.6131 7.01233 17.87C7.01233 17.127 6.39648 16.5247 5.63678 16.5247C4.87709 16.5247 4.26123 17.127 4.26123 17.87C4.26123 18.6131 4.87709 19.2154 5.63678 19.2154Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M45.3336 9.14506C45.9413 9.14506 46.434 8.66318 46.434 8.06876C46.434 7.47434 45.9413 6.99246 45.3336 6.99246C44.7258 6.99246 44.2331 7.47434 44.2331 8.06876C44.2331 8.66318 44.7258 9.14506 45.3336 9.14506ZM45.3336 9.41413C46.0933 9.41413 46.7091 8.81179 46.7091 8.06876C46.7091 7.32573 46.0933 6.72339 45.3336 6.72339C44.5739 6.72339 43.958 7.32573 43.958 8.06876C43.958 8.81179 44.5739 9.41413 45.3336 9.41413Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M58.814 19.1006C59.4218 19.1006 59.9145 18.6188 59.9145 18.0243C59.9145 17.4299 59.4218 16.948 58.814 16.948C58.2063 16.948 57.7136 17.4299 57.7136 18.0243C57.7136 18.6188 58.2063 19.1006 58.814 19.1006ZM58.814 19.3697C59.5737 19.3697 60.1896 18.7674 60.1896 18.0243C60.1896 17.2813 59.5737 16.679 58.814 16.679C58.0543 16.679 57.4385 17.2813 57.4385 18.0243C57.4385 18.7674 58.0543 19.3697 58.814 19.3697Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M57.7613 8.39872C58.3691 8.39872 58.8617 7.91685 58.8617 7.32242C58.8617 6.728 58.3691 6.24613 57.7613 6.24613C57.1535 6.24613 56.6609 6.728 56.6609 7.32242C56.6609 7.91685 57.1535 8.39872 57.7613 8.39872ZM57.7613 8.66779C58.521 8.66779 59.1369 8.06545 59.1369 7.32242C59.1369 6.57939 58.521 5.97705 57.7613 5.97705C57.0016 5.97705 56.3857 6.57939 56.3857 7.32242C56.3857 8.06545 57.0016 8.66779 57.7613 8.66779Z"
                            fill="#CCCCCC" />
                          <ellipse cx="51.6613" cy="50.5824" rx="0.825335" ry="0.80722" fill="#CCCCCC" />
                          <ellipse cx="62.2438" cy="53.1942" rx="0.825335" ry="0.807219" fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M41.7569 55.6949C42.3646 55.6949 42.8573 55.213 42.8573 54.6186C42.8573 54.0241 42.3646 53.5423 41.7569 53.5423C41.1491 53.5423 40.6565 54.0241 40.6565 54.6186C40.6565 55.213 41.1491 55.6949 41.7569 55.6949ZM41.7569 55.9639C42.5166 55.9639 43.1324 55.3616 43.1324 54.6186C43.1324 53.8755 42.5166 53.2732 41.7569 53.2732C40.9972 53.2732 40.3813 53.8755 40.3813 54.6186C40.3813 55.3616 40.9972 55.9639 41.7569 55.9639Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M12.3204 55.6949C12.9281 55.6949 13.4208 55.213 13.4208 54.6186C13.4208 54.0241 12.9281 53.5423 12.3204 53.5423C11.7126 53.5423 11.2199 54.0241 11.2199 54.6186C11.2199 55.213 11.7126 55.6949 12.3204 55.6949ZM12.3204 55.9639C13.0801 55.9639 13.6959 55.3616 13.6959 54.6186C13.6959 53.8755 13.0801 53.2732 12.3204 53.2732C11.5607 53.2732 10.9448 53.8755 10.9448 54.6186C10.9448 55.3616 11.5607 55.9639 12.3204 55.9639Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M49.4932 59.731C50.101 59.731 50.5937 59.2491 50.5937 58.6547C50.5937 58.0603 50.101 57.5784 49.4932 57.5784C48.8855 57.5784 48.3928 58.0603 48.3928 58.6547C48.3928 59.2491 48.8855 59.731 49.4932 59.731ZM49.4932 60.0001C50.2529 60.0001 50.8688 59.3977 50.8688 58.6547C50.8688 57.9117 50.2529 57.3093 49.4932 57.3093C48.7335 57.3093 48.1177 57.9117 48.1177 58.6547C48.1177 59.3977 48.7335 60.0001 49.4932 60.0001Z"
                            fill="#CCCCCC" />
                          <ellipse cx="23.3248" cy="51.3895" rx="0.82533" ry="0.807228" fill="#CCCCCC" />
                          <ellipse cx="7.49661" cy="23.9081" rx="1.79739" ry="1.75795" fill="#CCCCCC" />
                          <ellipse cx="42.0064" cy="1.75795" rx="1.79739" ry="1.75795" fill="#CCCCCC" />
                          <ellipse cx="9.29397" cy="38.3234" rx="1.79739" ry="1.75795" fill="#CCCCCC" />
                          <ellipse cx="20.0781" cy="3.1642" rx="1.79739" ry="1.75795" fill="#CCCCCC" />
                          <ellipse cx="53.1504" cy="1.75795" rx="1.79739" ry="1.75795" fill="#CCCCCC" />
                          <ellipse cx="65.732" cy="11.6024" rx="1.79739" ry="1.75795" fill="#CCCCCC" />
                          <ellipse cx="72.2027" cy="30.2367" rx="1.79739" ry="1.75795" fill="#CCCCCC" />
                          <ellipse cx="65.0132" cy="44.652" rx="1.79739" ry="1.75795" fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M13.3862 15.4688L11.3228 16.6339L13.3862 17.799L13.3862 15.4688ZM13.111 15.9348L11.873 16.6339L13.111 17.333L13.111 15.9348Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M1.28949 22.6688L1.4324 24.9948L3.42056 23.7107L1.28949 22.6688ZM1.59269 23.1178L1.67843 24.5135L2.87133 23.743L1.59269 23.1178Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M60.1362 41.3328L57.8248 40.7677L58.4801 43.0081L60.1362 41.3328ZM59.6072 41.4808L58.2204 41.1418L58.6136 42.486L59.6072 41.4808Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M71.5465 39.3081L72.3565 37.1166L70.0111 37.5263L71.5465 39.3081ZM71.4498 38.7783L71.9358 37.4635L70.5285 37.7092L71.4498 38.7783Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M35.6904 57.023L33.379 56.4579L34.0343 58.6983L35.6904 57.023ZM35.1614 57.171L33.7746 56.8319L34.1678 58.1762L35.1614 57.171Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M58.7469 49.971L58.2765 47.6866L56.489 49.2273L58.7469 49.971ZM58.3831 49.5673L58.1009 48.1966L57.0284 49.121L58.3831 49.5673Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M52.8609 13.2261L54.9094 12.0361L52.8315 10.896L52.8609 13.2261ZM53.1301 12.7568L54.3592 12.0428L53.1124 11.3587L53.1301 12.7568Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M16.2597 49.6217L17.5349 51.5901L18.6402 49.5258L16.2597 49.6217ZM16.7471 49.8713L17.5122 51.0524L18.1754 49.8138L16.7471 49.8713Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M59.727 26.7503L61.0021 28.7187L62.1075 26.6545L59.727 26.7503ZM60.2144 27L60.9795 28.1811L61.6427 26.9425L60.2144 27Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M69.7562 21.1952L72.0912 20.7322L70.5137 18.9859L69.7562 21.1952ZM70.1685 20.8389L71.5695 20.5611L70.6231 19.5133L70.1685 20.8389Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M34.2128 2.96369L36.1367 5.93364L37.8045 2.81903L34.2128 2.96369ZM34.9482 3.3404L36.1026 5.12237L37.1033 3.2536L34.9482 3.3404Z"
                            fill="#CCCCCC" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M29.5169 54.201L29.1517 55.5528L30.5312 55.1862L29.5169 54.201ZM29.6612 54.7203L29.5394 55.1709L29.9993 55.0487L29.6612 54.7203Z"
                            fill="#CCCCCC" />
                          <path d="M64.181 34.0191L63.9925 37.0584L61.3956 35.3791L64.181 34.0191Z" fill="#CCCCCC" />
                          <path d="M65.732 23.5566L67.2885 26.1936H64.1754L65.732 23.5566Z" fill="#CCCCCC" />
                          <path d="M3.38357 38.571L3.34123 41.6156L0.666572 40.0574L3.38357 38.571Z" fill="#CCCCCC" />
                          <path d="M5.84878 47.0413L8.87527 46.3278L7.99377 49.2481L5.84878 47.0413Z" fill="#CCCCCC" />
                          <path
                            d="M34.3259 34.561C33.7169 34.561 33.2232 34.0673 33.2232 33.4583C33.2232 32.5046 33.431 31.675 33.8466 30.9697C34.2623 30.2643 35.0225 29.5143 36.1275 28.7195C37.1919 27.9744 37.8913 27.3684 38.2259 26.9015C38.5705 26.4345 38.7429 25.913 38.7429 25.3368C38.7429 24.691 38.4996 24.1993 38.013 23.8615C37.5264 23.5237 36.8472 23.3548 35.9754 23.3548C34.9118 23.3548 33.744 23.593 32.4721 24.0694C31.5113 24.4292 30.4 24.0767 29.9355 23.162C29.4796 22.2643 29.8143 21.1539 30.7467 20.7739C32.5214 20.0506 34.3758 19.689 36.31 19.689C38.3982 19.689 40.0556 20.1807 41.2822 21.1642C42.5189 22.1478 43.1373 23.4591 43.1373 25.0983C43.1373 26.1911 42.8839 27.1349 42.377 27.9297C41.8702 28.7245 40.9071 29.6186 39.4879 30.612C38.5148 31.3174 37.8964 31.8538 37.6328 32.2214C37.3794 32.589 37.2527 33.0708 37.2527 33.6669C37.2527 34.1607 36.8524 34.561 36.3586 34.561H34.3259ZM32.7366 39.6574C32.7366 38.8229 32.9647 38.1921 33.4209 37.7649C33.877 37.3377 34.541 37.1241 35.4128 37.1241C36.2542 37.1241 36.903 37.3427 37.3591 37.7798C37.8255 38.2169 38.0586 38.8428 38.0586 39.6574C38.0586 40.4423 37.8255 41.0632 37.3591 41.5202C36.8928 41.9672 36.2441 42.1908 35.4128 42.1908C34.5613 42.1908 33.9024 41.9722 33.4361 41.5351C32.9698 41.088 32.7366 40.4621 32.7366 39.6574Z"
                            fill="white" />
                        </svg>
                        <div class="p-2 space-y-1 text-center">
                          <p class="text-sm font-bold">
                            Data Belum Tersedia
                          </p>
                          <p class="text-sm">
                            Data tidak tersedia, sistem tidak bisa menampilkan
                            Best Perfomance Assets
                          </p>
                        </div>
                      </td>
                    </tr>
                  </template>
                </template>
              </TableComponent>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import GlobalFormat from "@/services/format/global-format";
import PetaService from "@/services/peta-service";
import TableComponent from "../ui/Table.vue";

const petaService = new PetaService();
const globalFormat = new GlobalFormat();
const bpaData = ref<BestItem[]>([]);
const year = ref<any[]>([]);
const tahun = ref<any[]>([]);
let isOptionsExpanded = ref(false);
const tahunBerjalan = new Date().getFullYear();
const yearModel = ref<string>(tahunBerjalan.toString());

interface BestItem {
  kode_pengelola: string
  pengelola: string
  kode_sentral: number
  sentral: string
  tahun: number
  irr_equity: string
  npv_equity: string
  average_cf: string
  mesin: string
}

const fetchBestPerformance = async () => {
  try {
    const response: any = await petaService.getBestPerformance({ tahun: yearModel.value });
    if (response.data === null) {
      bpaData.value = []
    } else {
      bpaData.value = response.data;
    }
  } catch (error) {
    console.error('Fetch Best Performance Error : ' + error);
  }
}
const fetchYearListBPA = async () => {
  try {
    const response: any = await petaService.getYearListBPA();
    year.value = response.data;
    for (var i = 0; i < response.data.length; i++) {
      tahun.value.push(response.data[i].tahun)
    }
    tahun.value.reverse()
  } catch (error) {
    console.error('Fetch Year List BPA : ' + error);
  }
}

onMounted(async () => {
  try {
    await fetchYearListBPA();
    await fetchBestPerformance();
  } catch (error) {
    console.error('Fetch All API Error : ' + error);
  }
});
</script>

<style lang="scss">
button:hover svg,
button:hover svg path {
  fill: white;
}

.dp-custom-calendar {
  box-shadow: 0 0 6px #1976d2;
}

td {
  padding: 0.8rem;
}
</style>
