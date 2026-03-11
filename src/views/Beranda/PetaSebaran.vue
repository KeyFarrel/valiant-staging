<template>
  <Loading v-if="isLoading" />
  <div class="p-4 space-y-4 bg-white border rounded-md min-h-[75dvh]">
    <div class="flex justify-between"
      v-if="userAuthStore.levelAlias === 'Xf!8qP@7' || userAuthStore.levelAlias === 'Zp@5Kw_9' || userAuthStore.levelAlias === 'Gk#92lV&' || userAuthStore.levelAlias === 'Dr^3Zn$!'">
      <div class="flex items-center">
        <SearchBox @on-focus="handleFocus" v-model="selectedSearchQuery" class="w-72" />
        <ModalSearch v-if="isSearchModalOpen" v-model="searchQuery" :show-modal="isSearchModalOpen"
          :source="listDataPeta"
          @on-click-close="isSearchModalOpen = false; selectedSearchQuery === '' ? null : fetchPetaSentral(); searchQuery === '' ? selectedSearchQuery = '' : selectedSearchQuery = searchQuery"
          @on-escape="isSearchModalOpen = false"
          @on-click-sentral="selectedSearchQuery = searchQuery; isSearchModalOpen = false; fetchPetaSentral()"
          @on-key-enter="selectedSearchQuery = searchQuery; isSearchModalOpen = false; fetchPetaSentral()" />
        <button type="button" id="hover-button"
          class="text-primaryColor bg-white relative border border-primaryColor hover:bg-primaryColor hover:text-white duration-300 focus:ring-2 focus:ring-[#9ddee7] ml-4 p-2.5 font-medium rounded-lg text-sm flex justify-center items-center"
          @click="showModal = !showModal">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
            <path
              d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
              fill="#0099AD" />
          </svg>
          Filter
          <div v-if="pengelola.length || pembangkit.length || umur.length"
            class="absolute z-10 border-2 border-[#FFE5E6] w-2.5 h-2.5 rounded-full right-0.5 top-0.5  bg-warningColor">
          </div>
        </button>
        <ModalWrapper :showModal="showModal" :width="'w-[500px]'" :height="'h-auto'">
          <div class="flex flex-col space-y-5">
            <div class="flex justify-between">
              <div class="flex items-center space-x-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.6665 7.33073H11.3332V8.66406H4.6665V7.33073ZM2.6665 4.66406H13.3332V5.9974H2.6665V4.66406ZM6.6665 9.9974H9.33317V11.3307H6.6665V9.9974Z"
                    fill="#333333" />
                </svg>
                <span class="text-base font-semibold text-primaryTextColor">Filter</span>
              </div>
              <button @click="showModal = false">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-4" v-if="userAuthStore.levelAlias === 'Xf!8qP@7' || userAuthStore.levelAlias === 'Zp@5Kw_9'">
            <h3 class="mb-2 text-[#4D5E80] font-semibold">Unit Induk / Subholding / Anak Perusahaan</h3>
            <div class="relative">
              <div @click="togglePengelolaDropdown"
                class="flex items-center justify-between w-full min-h-[38px] p-2 transition-colors bg-white border rounded-md cursor-pointer hover:border-gray-300"
                :class="{ 'border-gray-300': isPengelolaDropdownOpen }">
                <div class="flex flex-wrap items-center flex-1 gap-1">
                  <template v-if="pengelola.length > 0">
                    <span v-for="(id, index) in pengelola.slice(0, 2)" :key="id"
                      class="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 rounded">
                      {{itemsPengelola.find(item => item.id === id)?.name}}
                      <button @click.stop="removeSelectedPengelola(id)" class="ml-1 hover:text-red-500">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                        </svg>
                      </button>
                    </span>
                    <span v-if="pengelola.length > 2" class="text-xs text-gray-500">
                      +{{ pengelola.length - 2 }}
                    </span>
                  </template>
                  <span v-else class="text-sm text-gray-400">
                    Pilih Unit Induk / Subholding / Anak Perusahaan
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button v-if="pengelola.length > 0" @click.stop="clearPengelola"
                    class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <svg class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isPengelolaDropdownOpen }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <transition name="dropdown">
                <div v-if="isPengelolaDropdownOpen"
                  class="absolute z-50 w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg">
                  <div class="p-2 border-b">
                    <label class="flex items-center p-1 rounded cursor-pointer hover:bg-gray-50 text-primaryTextColor">
                      <input type="checkbox" v-model="checkPengelola" @change="handleCheckPengelola(checkPengelola)"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2 text-sm">Select All Items</span>
                    </label>
                  </div>
                  <div class="overflow-auto max-h-60">
                    <label v-for="item in itemsPengelola" :key="item.id"
                      class="flex items-center px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-gray-50 text-primaryTextColor"
                      :class="{ 'bg-gray-100': pengelola.includes(item.id) }">
                      <input type="checkbox" :value="item.id" v-model="pengelola"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2">{{ item.name }}</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="mt-3">
            <h3 class="mb-2 text-[#4D5E80] font-semibold">Kategori Pembangkit</h3>
            <div class="relative">
              <div @click="togglePembangkitDropdown"
                class="flex items-center justify-between w-full min-h-[38px] p-2 transition-colors bg-white border rounded-md cursor-pointer hover:border-gray-300"
                :class="{ 'border-gray-300': isPembangkitDropdownOpen }">
                <div class="flex flex-wrap items-center flex-1 gap-1">
                  <template v-if="pembangkit.length > 0">
                    <span v-for="(id, index) in pembangkit.slice(0, 2)" :key="id"
                      class="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 rounded">
                      {{itemsPembangkit.find(item => item.id === id)?.name}}
                      <button @click.stop="removeSelectedPembangkit(id)" class="ml-1 hover:text-red-500">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                        </svg>
                      </button>
                    </span>
                    <span v-if="pembangkit.length > 2" class="text-xs text-gray-500">
                      +{{ pembangkit.length - 2 }}
                    </span>
                  </template>
                  <span v-else class="text-sm text-gray-400">
                    Pilih Kategori Pembangkit
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button v-if="pembangkit.length > 0" @click.stop="clearPembangkit"
                    class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <svg class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-180': isPembangkitDropdownOpen }" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <transition name="dropdown">
                <div v-if="isPembangkitDropdownOpen"
                  class="absolute z-50 w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg">
                  <div class="p-2 border-b">
                    <label class="flex items-center p-1 rounded cursor-pointer hover:bg-gray-50 text-primaryTextColor">
                      <input type="checkbox" v-model="checkPembangkit" @change="handleCheckPembangkit(checkPembangkit)"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2 text-sm">Select All Items</span>
                    </label>
                  </div>
                  <div class="overflow-auto max-h-60">
                    <label v-for="item in itemsPembangkit" :key="item.id"
                      class="flex items-center px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-gray-50 text-primaryTextColor"
                      :class="{ 'bg-gray-100': pembangkit.includes(item.id) }">
                      <input type="checkbox" :value="item.id" v-model="pembangkit"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2">{{ item.name }}</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div v-show="pembangkit.includes('PLTU')" class="mt-3">
            <h3 class="mb-2 text-[#4D5E80] font-semibold">DMN</h3>
            <div class="relative">
              <div @click="toggleDmnDropdown"
                class="flex items-center justify-between w-full min-h-[38px] p-2 transition-colors bg-white border rounded-md cursor-pointer hover:border-gray-300"
                :class="{ 'border-gray-300': isDmnDropdownOpen }">
                <div class="flex flex-wrap items-center flex-1 gap-1">
                  <template v-if="dmn.length > 0">
                    <span v-for="(id, index) in dmn.slice(0, 2)" :key="id"
                      class="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 rounded">
                      {{childDmn.find(item => item.id === id)?.name}}
                      <button @click.stop="removeSelectedDmn(id)" class="ml-1 hover:text-red-500">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                        </svg>
                      </button>
                    </span>
                    <span v-if="dmn.length > 2" class="text-xs text-gray-500">
                      +{{ dmn.length - 2 }}
                    </span>
                  </template>
                  <span v-else class="text-sm text-gray-400">
                    Pilih DMN
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button v-if="dmn.length > 0" @click.stop="clearDmn" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isDmnDropdownOpen }"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <transition name="dropdown">
                <div v-if="isDmnDropdownOpen"
                  class="absolute z-50 w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg">
                  <div class="p-2 border-b">
                    <label class="flex items-center p-1 rounded cursor-pointer hover:bg-gray-50 text-primaryTextColor">
                      <input type="checkbox" v-model="checkDmn" @change="handleCheckDmn(checkDmn)"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2 text-sm">Select All Items</span>
                    </label>
                  </div>
                  <div class="overflow-auto max-h-60">
                    <label v-for="item in childDmn" :key="item.id"
                      class="flex items-center px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-gray-50 text-primaryTextColor"
                      :class="{ 'bg-gray-100': dmn.includes(item.id) }">
                      <input type="checkbox" :value="item.id" v-model="dmn"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2">{{ item.name }}</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>
            <div class="flex mt-1 -mb-2">
              <p class="text-[#FF5656] text-lg mr-1 -mt-1">*</p>
              <p class="text-[#333333] text-xs ml-1">DMN hanya akan muncul jika Anda memilih PLTU dari Kategori
                Pembangkit</p>
            </div>
          </div>
          <div class="my-4">
            <h3 class="mb-2 text-[#4D5E80] font-semibold">Umur Mesin</h3>
            <div class="relative">
              <div @click="toggleUmurDropdown"
                class="flex items-center justify-between w-full min-h-[38px] p-2 transition-colors bg-white border rounded-md cursor-pointer hover:border-gray-300"
                :class="{ 'border-gray-300': isUmurDropdownOpen }">
                <div class="flex flex-wrap items-center flex-1 gap-1">
                  <template v-if="umur.length > 0">
                    <span v-for="(id, index) in umur.slice(0, 2)" :key="id"
                      class="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 rounded">
                      {{itemsUmurMesin.find(item => item.id === id)?.name}}
                      <button @click.stop="removeSelectedUmur(id)" class="ml-1 hover:text-red-500">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                        </svg>
                      </button>
                    </span>
                    <span v-if="umur.length > 2" class="text-xs text-gray-500">
                      +{{ umur.length - 2 }}
                    </span>
                  </template>
                  <span v-else class="text-sm text-gray-400">
                    Pilih Umur Mesin
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button v-if="umur.length > 0" @click.stop="clearUmur" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isUmurDropdownOpen }"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <transition name="dropdown">
                <div v-if="isUmurDropdownOpen"
                  class="absolute z-50 w-full mt-1 overflow-hidden bg-white border rounded-md shadow-lg">
                  <div class="p-2 border-b">
                    <label class="flex items-center p-1 rounded cursor-pointer hover:bg-gray-50 text-primaryTextColor">
                      <input type="checkbox" v-model="checkUmur" @change="handleCheckUmur(checkUmur)"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2 text-sm">Select All Items</span>
                    </label>
                  </div>
                  <div class="overflow-auto max-h-60">
                    <label v-for="item in itemsUmurMesin" :key="item.id"
                      class="flex items-center px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-gray-50 text-primaryTextColor"
                      :class="{ 'bg-gray-100': umur.includes(item.id) }">
                      <input type="checkbox" :value="item.id" v-model="umur"
                        class="w-4 h-4 bg-white border border-gray-200 rounded appearance-none cursor-pointer checked:accent-blue-200 checked:appearance-auto text-primaryColor focus:ring-primaryColor">
                      <span class="ml-2">{{ item.name }}</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <hr class="w-full my-4" />
          <div class="flex justify-end">
            <div class="flex items-start">
              <button type="submit" @click="umur = []; pembangkit = []; dmn = [], pengelola = []"
                class="w-full text-primaryColor bg-white border-2 hover:text-white duration-300 border-primaryColor hover:border-hoverColor hover:bg-hoverColor active:ring-2 active:outline-none active:ring-primaryColor font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center">
                Reset
              </button>
              <div v-if="pembangkit.includes('PLTU')">
                <button type="submit" @click="changeData()"
                  class="w-full text-white bg-primaryColor hover:bg-hoverColor duration-300 active:ring-2 active:outline-none active:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center">
                  Terapkan
                </button>
              </div>
              <div v-else>
                <button type="submit" @click="changeDataNoDMN()"
                  class="w-full text-white bg-primaryColor hover:bg-hoverColor duration-300 active:ring-2 active:outline-none active:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center">
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      </div>
      <BestPerformance />
    </div>
    <div class="z-0 space-y-3 h-[75dvh]">
      <ol-map style="width: 100%; height: calc(71.5 * var(--dvh, 1vh));">
        <ol-view ref="viewRef" :center="center" :rotation="rotation" :zoom="zoom" :minZoom="4"
          :projection="projection" />
        <ol-tile-layer>
          <ol-source-osm />
        </ol-tile-layer>
        <ol-overlay v-for="(item, i) in dataPeta" :key="i" :position="[item.lng, item.lat]">
          <img v-if="item.kode_jenis_energi === 'EBT'" @mouseenter="showByIndex = i"
            @click="getDetailSentral(item.kode_sentral)" alt="Preview" src="../../assets/img/ebt.png"
            class="rounded-full cursor-pointer" :class="zoom >= 15 ? 'w-5 h-5' : 'w-3 h-3'">
          <img v-else @mouseenter="showByIndex = i" @click="getDetailSentral(item.kode_sentral)"
            src="../../assets/img/Non-EBT.png" alt="Preview" class="rounded-full cursor-pointer"
            :class="zoom >= 15 ? 'w-5 h-5' : 'w-3 h-3'">
        </ol-overlay>
        <ol-overlay v-for="(item, i) in dataPeta" :position="[item.lng, item.lat]" :key="i" :insertFirst="false">
          <div v-if="showByIndex === i" @mouseenter="showByIndex = i, showByIndexModal = i"
            @mouseleave="showByIndex = null, showByIndexModal = null"
            :class="parseFloat(item.lat) < 0 || parseFloat(item.lng) > 138 ? 'bottom-0 right-0' : 'top-2.5 left-2'"
            class="bg-white absolute z-50 w-[18rem] rounded-md">
            <div class="flex justify-between px-2 py-2">
              <div>
                <div class="flex mb-1">
                  <div class="h-3 w-3 rounded-full shadow-md mx-2 mt-1.5 flex-shrink-0"
                    :class="item.kode_warna === '#00FF00' ? 'bg-[#10A976]' : 'bg-[#FF6362]'"></div>
                  <h1 class="font-medium">{{ item.sentral }}</h1>
                </div>
                <p class="text-[11px] ml-7">
                  {{ item.kode_jenis_energi }}
                </p>
              </div>
              <div class="mx-2 mt-1">
                <button
                  class="text-white bg-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-white dark:bg-white dark:hover:bg-white dark:focus:ring-white"
                  type="button">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"
                    @click="getDetailSentral(item.kode_sentral)">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11.2071 7.79289C11.5976 8.18342 11.5976 8.81658 11.2071 9.20711L6.20711 14.2071C5.81658 14.5976 5.18342 14.5976 4.79289 14.2071C4.40237 13.8166 4.40237 13.1834 4.79289 12.7929L9.08579 8.5L4.79289 4.20711C4.40237 3.81658 4.40237 3.18342 4.79289 2.79289C5.18342 2.40237 5.81658 2.40237 6.20711 2.79289L11.2071 7.79289Z"
                      fill="#0099AD" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex justify-between px-4 py-1 text-xs">
              <p class="text-slate-400">Jenis Bahan Bakar</p>
              <p>{{ item.bbm }}</p>
            </div>
            <div class="flex justify-between px-4 py-1 text-xs">
              <p class="text-slate-400">Unit Aktif</p>
              <div class="flex">
                <p>{{ item.jumlah_mesin }}</p>
                <p class="pl-2 text-slate-400">Unit</p>
              </div>
            </div>
            <div class="flex justify-between px-4 py-1 mb-2 text-xs">
              <p class="text-slate-400">Daya Terpasang</p>
              <div class="flex">
                <p>{{ globalFormat.formatRupiah(item.daya_terpasang) }}</p>
                <p class="pl-2 text-slate-400">MW</p>
              </div>
            </div>
          </div>
        </ol-overlay>
      </ol-map>
      <div class="flex items-center justify-center">
        <div class="flex mr-4">
          <svg width="15" height="16" viewBox="0 0 15 16" class="mt-1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.49999" cy="8.00005" r="7.2" fill="#0EA976" />
            <g clip-path="url(#clip0_13248_2057)">
              <path d="M6.60001 9.62012H8.04001" stroke="white" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M6.95999 4.57997C6.95999 4.67545 6.99792 4.76702 7.06543 4.83453C7.13295 4.90204 7.22451 4.93997 7.31999 4.93997C7.41547 4.93997 7.50704 4.90204 7.57455 4.83453C7.64206 4.76702 7.67999 4.67545 7.67999 4.57997C7.67999 4.48449 7.64206 4.39293 7.57455 4.32541C7.50704 4.2579 7.41547 4.21997 7.31999 4.21997C7.22451 4.21997 7.13295 4.2579 7.06543 4.32541C6.99792 4.39293 6.95999 4.48449 6.95999 4.57997Z"
                stroke="white" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6.23999 10.7L7.31999 5.30005L8.39999 10.7" stroke="white" stroke-linecap="round"
                stroke-linejoin="round" />
              <rect x="5.16" y="9.26001" width="4.32" height="2.16" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_13248_2057">
                <rect width="8.64" height="8.64" fill="white" transform="translate(3 3.5)" />
              </clipPath>
            </defs>
          </svg>
          <p class="ml-2 font-medium text-md">EBT</p>
        </div>
        <div class="flex">
          <svg width="15" height="16" viewBox="0 0 15 16" class="mt-1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.49999" cy="8.00005" r="7.2" fill="#FF6363" />
            <g clip-path="url(#clip0_13248_19934)">
              <path d="M6.60001 9.62012H8.04001" stroke="white" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M6.95999 4.57997C6.95999 4.67545 6.99792 4.76702 7.06543 4.83453C7.13295 4.90204 7.22451 4.93997 7.31999 4.93997C7.41547 4.93997 7.50704 4.90204 7.57455 4.83453C7.64206 4.76702 7.67999 4.67545 7.67999 4.57997C7.67999 4.48449 7.64206 4.39293 7.57455 4.32541C7.50704 4.2579 7.41547 4.21997 7.31999 4.21997C7.22451 4.21997 7.13295 4.2579 7.06543 4.32541C6.99792 4.39293 6.95999 4.48449 6.95999 4.57997Z"
                stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6.23999 10.7L7.31999 5.30005L8.39999 10.7" stroke="white" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
              <rect x="5.16" y="9.26001" width="4.32" height="2.16" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_13248_19934">
                <rect width="8.64" height="8.64" fill="white" transform="translate(3 3.5)" />
              </clipPath>
            </defs>
          </svg>
          <p class="ml-2 font-medium text-md">Non-EBT</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserAuthStore } from "@/store/storeUserAuth";
const userAuthStore = useUserAuthStore();
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import { notifyError } from "@/services/helper/toast-notification";
import PetaService from "@/services/peta-service";
import GlobalFormat from "@/services/format/global-format";
import BestPerformance from "@/components/Peta/BestPerformance.vue"
import SearchBox from "@/components/ui/SearchBox.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import ModalSearch from "@/components/ModalSearch.vue";
import type View from "ol/View";

const nodeMode = import.meta.env.MODE;
const router = useRouter();
const globalFormat = new GlobalFormat();
const petaService = new PetaService();
const dataPeta = ref<PetaItem[]>([]);
const listDataPeta = ref<PetaItem[]>([]);
const isSearchModalOpen = ref<boolean>(false);
const showByIndex = ref<number | null>(null);
const showByIndexModal = ref<number | null>(null);
const kode_sentral = ref("");
const isLoading = ref();
const showModal = ref(false);
const searchQuery = ref("");
const selectedSearchQuery = ref("");

const viewRef = ref<{ view: View }>();
const center = ref([117.478751, -0.808498]);
const projection = ref("EPSG:4326");
const zoom = ref<any>(5);
const rotation = ref(0);

const checkPengelola = ref(false)
const checkPembangkit = ref(false)
const checkDmn = ref(true)
const checkUmur = ref(false)
const indeterminatePengelola = ref(false)
const indeterminatePembangkit = ref(false)
const indeterminateDmn = ref(false)
const indeterminateUmur = ref(false)
const itemsPengelola = ref<{ id: string; name: string; }[]>([])
const itemsPembangkit = ref<{ id: string; name: string; power?: string }[]>([])
const itemsDmn = ref<{
  [x: string]: any; id: string; name: string;
}[]>([])
const childDmn = ref<any[]>([])
const itemsUmurMesin = ref<{ id: string; name: string; }[]>([])
const pengelola = ref<any[]>([])
const pembangkit = ref<any[]>([])
const dmn = ref<any[]>([1, 2, 3])
const umur = ref<any[]>([])
const isPengelolaDropdownOpen = ref(false)
const isPembangkitDropdownOpen = ref(false)
const isDmnDropdownOpen = ref(false)
const isUmurDropdownOpen = ref(false)


interface PetaItem {
  data: any;
  kode_sentral: string;
  sentral: string;
  jenis_pembangkit: string;
  kode_jenis_energi: string;
  daya_terpasang: string;
  bbm: string;
  jumlah_mesin: number;
  irr_project: string;
  irr_equity: string;
  average_cf: string;
  kode_warna: string;
  icon: string;
  lat: any;
  lng: any;
}

const fetchPetaSentral = async () => {
  try {
    isLoading.value = true;
    const response: any = await petaService.getPetaSentral({ sentral: searchQuery.value, pengelola: [], pembina: [], jenis_kit: [], id_daya: [], umur: [] });
    if (listDataPeta.value.length === 0) {
      listDataPeta.value = response.data;
      dataPeta.value = response.data;
    } else {
      dataPeta.value = response.data;
      console.log(response.data);
    }
    if (dataPeta.value.length === 1) {
      center.value = [parseFloat(dataPeta.value[0].lng), parseFloat(dataPeta.value[0].lat)]
      zoom.value = 17;
    } else {
      center.value = [117.478751, -0.808498];
      zoom.value = 5;
    }
    if (dataPeta.value.length === 0) {
      notifyError("Data Peta Sebaran Tidak Ditemukan", false);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

async function getDetailSentral(kode: string) {
  kode_sentral.value = kode;
  try {
    const encryptStorage = await encryptStoragePromise;
    petaService.getSentralByKode(kode);
    return router.push({
      name: "grafik",
      params: { id: nodeMode === 'production' ? await encryptStorage.encryptValue(kode) : kode },
    });
  } catch (error) {
    console.error('Fetch Detail Sentral By Kode Error : ', error);
  }
}

const handleFocus = () => {
  isSearchModalOpen.value = true;
}

const togglePengelolaDropdown = () => {
  isPengelolaDropdownOpen.value = !isPengelolaDropdownOpen.value;
}

const removeSelectedPengelola = (id: any) => {
  pengelola.value = pengelola.value.filter(item => item !== id);
}

const clearPengelola = () => {
  pengelola.value = [];
}

const togglePembangkitDropdown = () => {
  isPembangkitDropdownOpen.value = !isPembangkitDropdownOpen.value;
}

const removeSelectedPembangkit = (id: any) => {
  pembangkit.value = pembangkit.value.filter(item => item !== id);
}

const clearPembangkit = () => {
  pembangkit.value = [];
}

const toggleDmnDropdown = () => {
  isDmnDropdownOpen.value = !isDmnDropdownOpen.value;
}

const removeSelectedDmn = (id: any) => {
  dmn.value = dmn.value.filter(item => item !== id);
}

const clearDmn = () => {
  dmn.value = [];
}

const toggleUmurDropdown = () => {
  isUmurDropdownOpen.value = !isUmurDropdownOpen.value;
}

const removeSelectedUmur = (id: any) => {
  umur.value = umur.value.filter(item => item !== id);
}

const clearUmur = () => {
  umur.value = [];
}

function formatFixed(x: any) {
  return Number.parseFloat(x).toFixed(1);
}

const defaultProps = {
  children: 'children',
  label: 'label',
}
async function getDataPengelola() {
  try {
    const response: any = await petaService.getPengelola()
    if (response.success) {
      itemsPengelola.value = []
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsPengelola.value.push({
            id: item.kode_pengelola,
            name: item.pengelola
          })
        })

      }
    }
  } catch (e) {
    console.log("Fetch items filter Pengelola Error : " + e)
  }
}

async function getDataPembangkit() {
  try {
    const response: any = await petaService.getJenisKit({})
    if (response.success) {
      itemsPembangkit.value = []
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsPembangkit.value.push({
            id: item.jenis_kit,
            name: item.jenis_kit
          })
          if (item.dmn) {
            item.dmn.map((child: any) => {
              if (child.daya_mampu != "")
                childDmn.value.push({
                  id: child.id_daya,
                  name: 'PLTU ' + child.daya_mampu
                })
            })
          }
        })
      }
    }
    itemsPembangkit.value.reverse()
  } catch (e) {
    console.log("Fetch items filter Pembangkit Error : " + e)
  }
}

async function getDataUmurMesin() {
  try {
    const response: any = await petaService.getUmurMesin({})
    if (response.success) {
      itemsUmurMesin.value = []
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsUmurMesin.value.push({
            id: item.umur_mesin,
            name: item.umur_mesin
          })
        })

      }
    }
  } catch (e) {
    console.log("Fetch items filter Umur Mesin Error : " + e)
  }
}

watch(pengelola, (val) => {
  if (val.length === 0) {
    checkPengelola.value = false
    indeterminatePengelola.value = false
  } else if (val.length === itemsPengelola.value.length) {
    checkPengelola.value = true
    indeterminatePengelola.value = false
  } else {
    indeterminatePengelola.value = true
  }
})

watch(pembangkit, (val) => {
  if (val.length === 0) {
    checkPembangkit.value = false
    indeterminatePembangkit.value = false
  } else if (val.length === itemsPembangkit.value.length) {
    checkPembangkit.value = true
    indeterminatePembangkit.value = false
  } else {
    indeterminatePembangkit.value = true
  }
})

watch(dmn, (val) => {
  if (val.length === 0) {
    checkDmn.value = false
    indeterminateDmn.value = false
  } else if (val.length === childDmn.value.length) {
    checkDmn.value = true
    indeterminateDmn.value = false
  } else {
    indeterminateDmn.value = true
  }
})

watch(umur, (val) => {
  if (val.length === 0) {
    checkUmur.value = false
    indeterminateUmur.value = false
  } else if (val.length === itemsUmurMesin.value.length) {
    checkUmur.value = true
    indeterminateUmur.value = false
  } else {
    indeterminateUmur.value = true
  }
})

const handleCheckPengelola = (val: any) => {
  indeterminatePengelola.value = false
  if (val) {
    pengelola.value = itemsPengelola.value.map((_) => _.id)
  } else {
    pengelola.value = []
  }
}

const handleCheckPembangkit = (val: any) => {
  indeterminatePembangkit.value = false
  if (val) {
    pembangkit.value = itemsPembangkit.value.map((_) => _.name)
  } else {
    pembangkit.value = []
  }
}

const handleCheckDmn = (val: any) => {
  indeterminateDmn.value = false
  if (val) {
    dmn.value = childDmn.value.map((_) => _.id)
  } else {
    dmn.value = []
  }
}

const handleCheckUmur = (val: any) => {
  indeterminateUmur.value = false
  if (val) {
    umur.value = itemsUmurMesin.value.map((_) => _.id)
  } else {
    umur.value = []
  }
}

async function changeData() {
  try {
    isLoading.value = true;
    const response: any = await petaService.getPetaSentral({ sentral: searchQuery.value, pengelola: pengelola.value ? pengelola.value : "", pembina: [], jenis_kit: pembangkit.value ? pembangkit.value : "", id_daya: dmn.value ? dmn.value : "", umur: umur.value ? umur.value : "" });
    if (listDataPeta.value.length === 0) {
      listDataPeta.value = response.data;
      dataPeta.value = response.data;
    } else {
      dataPeta.value = response.data;
    }
    showModal.value = false;
    if (dataPeta.value.length === 0) {
      notifyError("Data Peta Sebaran Tidak Ditemukan", false);
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false;
  }
}

async function changeDataNoDMN() {
  try {
    isLoading.value = true;
    const response: any = await petaService.getPetaSentral({ sentral: searchQuery.value, pengelola: pengelola.value ? pengelola.value : "", pembina: [], jenis_kit: pembangkit.value ? pembangkit.value : "", id_daya: [], umur: umur.value ? umur.value : "" });
    if (listDataPeta.value.length === 0) {
      listDataPeta.value = response.data;
      dataPeta.value = response.data;
    } else {
      dataPeta.value = response.data;
    }
    showModal.value = false;
    if (dataPeta.value.length === 0) {
      notifyError("Data Peta Sebaran Tidak Ditemukan", false);
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchPetaSentral();
  getDataPengelola()
  getDataPembangkit()
  getDataUmurMesin()
  isLoading.value = false;

  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    isPengelolaDropdownOpen.value = false;
    isPembangkitDropdownOpen.value = false;
    isDmnDropdownOpen.value = false;
    isUmurDropdownOpen.value = false;
  }
};
</script>

<style lang="scss" scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top;
}

.dropdown-enter-from {
  opacity: 0;
  transform: scaleY(0.95) translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-10px);
}
</style>