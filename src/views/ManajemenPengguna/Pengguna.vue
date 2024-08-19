<template>
  <Loading v-if="isLoading" />
  <ModalNotification :show-modal="isSuccess" :animation-data="successJson" :title="'Pengguna Berhasil Ditambahkan'"
    :subtitle="'Pengguna telah berhasil ditambahkan ke aplikasi Valiant'" />
  <ModalNotification :show-modal="isEditSuccess" :animation-data="successJson" :title="'Pengguna Berhasil Diedit'"
    :subtitle="'Pengguna telah berhasil diedit'" />
  <div class="p-6 space-y-5 bg-white rounded-lg">
    <div class="flex items-center justify-between">
      <SearchBox class="w-72" :placeholder="'Cari nama pengguna...'" @on-key-enter="fetchData" v-model="search"
        @on-click="fetchData" @on-input="fetchData" />
      <button @click="showModalCreate = !showModalCreate" type="button"
        class="flex justify-center items-center px-3 py-2 rounded-lg text-sm text-white bg-[#0099AD] space-x-2 duration-300 active:outline-none hover:bg-[#007E8F] active:ring active:ring-[#9ddee7]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7 0.875C7.48325 0.875 7.875 1.26675 7.875 1.75V6.125H12.25C12.7332 6.125 13.125 6.51675 13.125 7C13.125 7.48325 12.7332 7.875 12.25 7.875H7.875V12.25C7.875 12.7332 7.48325 13.125 7 13.125C6.51675 13.125 6.125 12.7332 6.125 12.25V7.875H1.75C1.26675 7.875 0.875 7.48325 0.875 7C0.875 6.51675 1.26675 6.125 1.75 6.125H6.125V1.75C6.125 1.26675 6.51675 0.875 7 0.875Z"
            fill="white" />
        </svg>
        <span class="font-semibold">Tambah Pengguna</span>
      </button>
    </div>
    <TableComponent>
      <template v-slot:table-header>
        <tr>
          <th scope="col" class="text-center">No</th>
          <th scope="col" class="text-left">Unit Pengelola</th>
          <th scope="col" class="text-left">
            Unit Pembina
          </th>
          <th scope="col" class="text-left">Nama</th>
          <th scope="col" class="text-left">Email</th>
          <th scope="col" class="text-left">Level</th>
          <th scope="col" class="text-left">Role</th>
          <th scope="col" class="text-center">Status</th>
          <th scope="col" class="text-center">Aksi</th>
        </tr>
      </template>
      <template v-slot:table-body v-if="pengguna.length === 0">
        <tr>
          <td colspan="8" class="text-sm text-center text-textDisabledColor">Data Tidak Ditemukan</td>
        </tr>
      </template>
      <template v-slot:table-body v-else>
        <tr v-for="(user, index) in pengguna" :key="user.id">
          <td scope="row" class="text-center whitespace-nowrap">
            {{ index + 1 }}
          </td>
          <td class="text-left">
            {{
              user.pengelola && user.pengelola.length > 0
                ? user.pengelola[0].pengelola
                : "Tidak tersedia"
            }}
          </td>
          <td class="text-left">
            {{ userPembina(user.id_pembina) }}
          </td>
          <td>
            {{ user.nama_pegawai }}
          </td>
          <td>
            {{ user.email }}
          </td>
          <td>
            {{ userLevel(user.level_id) }}
          </td>
          <td>
            <span v-for="(item, index) in user.role">{{ item.role }}</span>
          </td>
          <td class="flex items-center justify-center">
            <div v-if="user.status == true"
              class="px-1.5 py-1 border border-[#C7E5D7] w-fit rounded-xl bg-[#E2FCF3] text-center flex justify-center items-center">
              <p class="text-[#397E5D] font-semibold">Aktif</p>
            </div>
            <div v-else
              class="px-1.5 py-1 w-fit rounded-xl border border-[#EFC0BD] bg-[#FAEBEA] text-center flex justify-center items-center">
              <p class="text-[#C53830] font-semibold">Tidak Aktif</p>
            </div>
          </td>
          <td>
            <div class="flex items-center justify-center">
              <button type="button" @click="openEditModals(user.id)"
                class="flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-blue-500">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_14293_14997)">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M13.6627 2.33622C13.4349 2.10841 13.0655 2.10841 12.8377 2.33622L12.1841 2.98981L13.0091 3.81477L13.6627 3.16118C13.8905 2.93337 13.8905 2.56402 13.6627 2.33622ZM12.0663 4.75758L11.2413 3.93262L3.2586 11.9153C2.98447 12.1895 2.78296 12.5276 2.67229 12.8991L2.49092 13.508L3.09978 13.3266C3.47132 13.2159 3.80944 13.0144 4.08356 12.7403L12.0663 4.75758ZM11.8949 1.39341C12.6434 0.644905 13.857 0.644905 14.6055 1.39341C15.354 2.14192 15.354 3.35548 14.6055 4.10399L5.02637 13.6831C4.5956 14.1139 4.06428 14.4305 3.48043 14.6044L1.6905 15.1376C1.4559 15.2075 1.20187 15.1432 1.02877 14.9701C0.855682 14.797 0.791373 14.543 0.861258 14.3084L1.39444 12.5185C1.56836 11.9346 1.88502 11.4033 2.31579 10.9725L11.8949 1.39341Z"
                      fill="#0099AD" />
                  </g>
                  <defs>
                    <clipPath id="clip0_14293_14997">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </template>
    </TableComponent>
    <div class="flex items-center justify-between w-full mt-7">
      <div class="flex items-center space-x-2 text-sm">
        <span>Menampilkan</span>
        <select v-model="navigation.limit" name="" id=""
          class="text-sm text-gray-500 border-gray-300 rounded-lg cursor-pointer" @change="changePageLimit($event)">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        <span>dari <span class="font-bold">{{ navigation.totalRecords }}</span> data</span>
      </div>
      <ul class="flex items-center space-x-3">
        <li>
          <button @click="goToPrevious" :disabled="navigation.currentPage === 1"
            :class="{ 'text-gray-500': navigation.currentPage === 1 }"
            class="block px-2 py-2 ml-0 duration-300 bg-white disabled:hover:cursor-not-allowed text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
            <span class="sr-only">Previous</span>
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"></path>
            </svg>
          </button>
        </li>
        <li id="pagination" v-for="(item, index) in generatePageList" :key="index"
          :class="{ selected: item === navigation.currentPage, disabled: item === '...' }"
          class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
          @click="goToPage(item)">
          {{ item }}
        </li>
        <li>
          <button @click="goToNext" :disabled="navigation.currentPage === navigation.totalPages"
            class="block px-2 py-2 ml-0 duration-300 bg-white disabled:hover:cursor-not-allowed text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
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
    </div>
  </div>
  <!-- Modal Tambah -->
  <ModalWrapper :showModal="showModalCreate" :width="'w-[750px]'" :height="'h-auto'">
    <div class="flex flex-row items-center justify-between">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">
        Tambah Pengguna
      </h3>
      <div>
        <button type="button" @click="closeModal">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 16.5L16.5 1.5M1.5 1.5L16.5 16.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
    <form class="mt-4 space-y-4">
      <div v-if="errors.length > 0" class="p-3 text-xs text-red-600 bg-red-400 bg-opacity-50 rounded-lg">
        <ul>
          <li v-for="error in errors" :key="error" class="ml-2 list-disc">
            {{ error }}
          </li>
        </ul>
      </div>
      <div class="flex flex-wrap -mx-2">
        <!-- Kolom Kiri -->
        <div class="w-1/2 px-2">
          <div>
            <label for="nama" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Nama
              Lengkap <span class="text-warningColor">*</span></label>
            <TextField id="nama" placeholder="Masukkan Nama Lengkap" class="text-xs" v-model="formData.nama_pegawai" />
          </div>
        </div>
        <!-- Kolom Kanan -->
        <div class="w-1/2 px-2">
          <div>
            <label for="nip" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">NIP <span
                class="text-warningColor">*</span></label>
            <TextField id="nip" placeholder="Masukkan NIP" class="text-xs" v-model="formData.nip" />
          </div>
        </div>
      </div>
      <div>
        <label for="email" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Email <span
            class="text-warningColor">*</span></label>
        <TextField id="email" placeholder="Masukkan Email" class="text-xs" v-model="formData.email" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="relative">
          <label for="password" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Password <span
              class="text-warningColor">*</span></label>
          <input id="password" :type="showPassword ? 'text' : 'password'" v-model="formData.password"
            class="w-full text-xs h-[38px] text-gray-500 border-gray-300 rounded-lg" placeholder="Masukkan Password" />
          <button type="button" @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-0 flex items-center pt-6 pr-3">
            <svg v-if="!showPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                fill="#0F172A" />
            </svg>
            <svg v-if="showPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                fill="#0F172A" />
              <rect width="1.51154" height="18.1385" rx="0.75"
                transform="matrix(0.701707 0.712466 -0.701707 0.712466 13.5835 0.105713)" fill="#0F172A" />
            </svg>
          </button>
        </div>
        <div class="relative">
          <label for="konfirmasiPassword"
            class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Konfirmasi Password <span
              class="text-warningColor">*</span></label>
          <input id="konfirmasiPassword" :type="showConfirmPassword ? 'text' : 'password'"
            v-model="formData.konfirmasi_password"
            class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg" placeholder="Masukkan Password" />
          <button type="button" @click="toggleConfirmPasswordVisibility"
            class="absolute inset-y-0 right-0 flex items-center pt-6 pr-3">
            <svg v-if="!showConfirmPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                fill="#0F172A" />
            </svg>
            <svg v-if="showConfirmPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                fill="#0F172A" />
              <rect width="1.51154" height="18.1385" rx="0.75"
                transform="matrix(0.701707 0.712466 -0.701707 0.712466 13.5835 0.105713)" fill="#0F172A" />
            </svg>
          </button>
        </div>
        <div>
          <label for="level" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Level <span
              class="text-warningColor">*</span></label>
          <select v-model="formData.level_id"
            class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer"
            @change="handleChangeLevel(formData.level_id)">
            <option value="" disable hidden>Pilih Level</option>
            <option v-for="item in comboLevel" :key="item.kode_level" :value="item.kode_level">
              {{ item.level }}
            </option>
          </select>
        </div>
        <div v-if="formData.level_id !== '1'">
          <label for="unitInduk" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Unit
            Pengelola <span class="text-warningColor">*</span></label>
          <select v-model="formData.id_pengelola" :disabled="formData.level_id == ''"
            class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer"
            @change="handleChangePengelola">
            <option value="" disable hidden>Pilih Pengelola</option>
            <option v-for="item in comboInduk" :key="item.id_pengelola" :value="item.id_pengelola">
              {{ item.pengelola }}
            </option>
          </select>
        </div>
        <div>
          <label for="role" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Role <span
              class="text-warningColor">*</span></label>
          <select v-model="formData.role_id" :disabled="formData.level_id == ''"
            class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer">
            <option value="" disable hidden>Pilih Role</option>
            <option v-for="item in comboRole" :key="item.id" :value="item.id">
              {{ item.role }}
            </option>
          </select>
        </div>
        <div v-if="!hiddenPembina.includes(formData.level_id)">
          <label for="unitPembina" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Unit
            Pembina <span class="text-warningColor">*</span></label>
          <select v-model="formData.id_pembina" :disabled="formData.id_pengelola === ''"
            class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer"
            @change="handleChangePembina">
            <option value="" disable hidden>Pilih Pembina</option>
            <option v-for="item in comboPengelola" :key="item.id_pembina" :value="item.id_pembina">
              {{ item.pembina }}
            </option>
          </select>
        </div>
      </div>
      <div v-if="!hiddenSentral.includes(formData.level_id)" class="w-full">
        <label for="unitSentral" class="block mb-3 text-xs font-semibold text-[#4D5E80] dark:text-white">Unit
          Sentral <span class="text-warningColor">*</span></label>
        <select v-model="formData.id_sentral" :disabled="formData.id_pengelola === ''"
          class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer">
          <option value="" disable hidden>Pilih Unit Sentral</option>
          <option v-for="item in comboSentral" :key="item.id_sentral" :value="item.id_sentral">
            {{ item.sentral }}
          </option>
        </select>
      </div>
      <div class="grid items-center grid-cols-2 gap-x-4">
        <div>
          <p class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">
            Status
          </p>
          <div class="flex">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" v-model="isActive" />
              <div
                class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]">
              </div>
              <span class="pl-3 text-xs font-medium text-[#333333]">
                {{ isActive ? "Aktif" : "Tidak Aktif" }}
              </span>
            </label>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-4 space-x-2">
        <button type="button"
          class="px-5 py-2 text-sm font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor hover:text-white"
          @click="closeModal">
          Batal
        </button>
        <button type="button"
          class="px-5 py-2 text-sm font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:bg-hoverColor hover:border-hoverColor"
          @click="saveUserDataAndCloseModal">
          Simpan Data
        </button>
      </div>
    </form>
  </ModalWrapper>

  <!-- Modal Edit -->
  <ModalWrapper :show-modal="isModalEdit" :width="'w-[800px]'" :height="'h-auto'">
    <div class="flex">
      <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Edit Pengguna
      </h3>
      <div class="mt-2 ml-auto">
        <button type="button" @click="closeModalEdit">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 16.5L16.5 1.5M1.5 1.5L16.5 16.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
    <form class="mt-4 space-y-4">
      <div v-if="errors.length > 0" class="p-3 text-xs text-red-600 bg-red-400 bg-opacity-50 rounded-lg">
        <ul>
          <li v-for="error in errors" :key="error" class="ml-2 list-disc">
            {{ error }}
          </li>
        </ul>
      </div>
      <div class="flex flex-wrap -mx-2">
        <!-- Kolom Kiri -->
        <div class="w-1/2 px-2">
          <div>
            <label for="nama" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Nama
              Lengkap <span class="text-warningColor">*</span></label>
            <TextField id="nama" placeholder="Masukkan Nama Lengkap" class="text-xs" v-model="formData.nama_pegawai" />
          </div>
        </div>
        <!-- Kolom Kanan -->
        <div class="w-1/2 px-2">
          <div>
            <label for="nip" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">NIP <span
                class="text-warningColor">*</span></label>
            <TextField id="nip" placeholder="Masukkan NIP" class="text-xs" v-model="formData.nip" />
          </div>
        </div>
      </div>
      <div>
        <label for="email" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Email <span
            class="text-warningColor">*</span></label>
        <TextField id="email" placeholder="Masukkan Email" class="text-xs" v-model="formData.email" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="level" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Level <span
              class="text-warningColor">*</span></label>
          <select v-model="formData.level_id"
            class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer"
            @change="handleChangeLevel(formData.level_id)">
            <option value="" disable hidden>Pilih Level</option>
            <option v-for="item in comboLevel" :key="item.kode_level" :value="item.kode_level">
              {{ item.level }}
            </option>
          </select>
        </div>
        <div v-if="formData.level_id !== '1'">
          <label for="unitInduk" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Unit
            Pengelola <span class="text-warningColor">*</span></label>
          <select v-model="formData.id_pengelola" :disabled="formData.level_id == ''"
            class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer"
            @change="handleChangePengelola">
            <option value="" disable hidden>Pilih Pengelola</option>
            <option v-for="item in comboInduk" :key="item.id_pengelola" :value="item.id_pengelola">
              {{ item.pengelola }}
            </option>
          </select>
        </div>
        <div>
          <label for="role" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Role <span
              class="text-warningColor">*</span></label>
          <select v-model="formData.role_id" :disabled="formData.level_id === ''"
            class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer">
            <option value="" disable hidden>Pilih Role</option>
            <option v-for="item in comboRole" :key="item.id" :value="item.id">
              {{ item.role }}
            </option>
          </select>
        </div>
        <div v-if="!hiddenPembina.includes(formData.level_id)">
          <label for="unitPembina" class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">Unit
            Pembina <span class="text-warningColor">*</span></label>
          <select v-model="formData.id_pembina" :disabled="formData.id_pengelola === ''"
            class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer"
            @change="handleChangePembina">
            <option value="" disable hidden>Pilih Pembina</option>
            <option v-for="item in comboPengelola" :key="item.id_pembina" :value="item.id_pembina">
              {{ item.pembina }}
            </option>
          </select>
        </div>
      </div>
      <div v-if="!hiddenSentral.includes(formData.level_id)" class="w-full">
        <label for="unitSentral" class="block mb-3 text-xs font-semibold text-[#4D5E80] dark:text-white">Unit
          Sentral <span class="text-warningColor">*</span></label>
        <select v-model="formData.id_sentral" :disabled="formData.id_pengelola === ''"
          class="w-full h-[38px] text-xs text-gray-500 border-gray-300 rounded-lg cursor-pointer">
          <option value="" disable hidden>Pilih Unit Sentral</option>
          <option v-for="item in comboSentral" :key="item.id_sentral" :value="item.id_sentral">
            {{ item.sentral }}
          </option>
        </select>
      </div>
      <div class="grid items-center grid-cols-2 gap-x-4">
        <div>
          <p class="block mb-2 text-xs font-semibold text-[#4D5E80] dark:text-white">
            Status
          </p>
          <div class="flex">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" v-model="isActive" />
              <div
                class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]">
              </div>
              <span class="pl-3 text-xs font-medium text-[#333333]">
                {{ isActive ? "Aktif" : "Tidak Aktif" }}
              </span>
            </label>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-4 space-x-2">
        <button type="button"
          class="px-5 py-2 text-sm font-semibold duration-300 border rounded-lg text-primaryColor border-primaryColor hover:bg-hoverColor hover:border-hoverColor hover:text-white"
          @click="closeModalEdit">
          Batal
        </button>
        <button type="button"
          class="px-5 py-2 text-sm font-semibold text-white duration-300 border rounded-lg border-primaryColor bg-primaryColor hover:bg-hoverColor hover:border-hoverColor"
          @click="editUserDataAndCloseModal">
          Simpan Data
        </button>
      </div>
    </form>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import TableComponent from "@/components/ui/Table.vue";
import SearchBox from "@/components/ui/SearchBox.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import UserService from "@/services/user-service";
import Loading from "@/components/ui/LoadingSpinner.vue";
import ModalNotification from '@/components/ui/ModalNotification.vue';
import successJson from "@/assets/lottie/success.json";
import TextField from "@/components/ui/TextField.vue";

const userService = new UserService();
const isSuccess = ref<boolean>(false);
const isEditSuccess = ref<boolean>(false);
const userRole = ref(userService.role_id);
const userData = ref({ role_id: null });
const showModalCreate = ref(false);
const hiddenSentral = ["2", "1", "4"];
const hiddenPembina = ["2", "1"];
const isModalEdit = ref(false);
const pengguna = ref<PenggunaItem[]>([]);
const filteredPengguna = ref<PenggunaItem[]>([]);
const isLoading = ref(false);
const search = ref<string>("");
const selectedUserId = ref<number | null>(null);
const showPasswordFields = ref(false);
const errors = ref<string[]>([]);
const errorsEdit = ref<string[]>([]);
const comboSentral = ref<SentralItem[]>([]);
const sentralMappings = ref<{ [key: string]: string }>({});
const comboPengelola = ref<PengelolaItem[]>([]);
const pengelolaMappings = ref<{ [key: number]: number }>({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showEditPassword = ref(false);
const showEditConfirmPassword = ref(false);
const comboLevel = ref<LevelItem[]>([]);
const levelMappings = ref<{ [key: string]: string }>({});
const comboMesin = ref<MesinItem[]>([]);
const mesinMappings = ref<{ [key: string]: string }>({});
const comboRole = ref<RoleItem[]>([]);
const comboInduk = ref<IndukItem[]>([]);
const indukMappings = ref<{ [key: number]: number }>({});
const listPembina = ref<any[]>([]);
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
const formData = ref({
  nama_pegawai: "",
  nip: "",
  email: "",
  password: "",
  konfirmasi_password: "",
  role_id: "",
  level_id: "",
  id_ranting: 1,
  id_mesin: "",
  id_cabang: "",
  id_pembina: "",
  id_sentral: "",
  id_pengelola: "",
  status: true,
});
const resetFormData = () => {
  formData.value = {
    nama_pegawai: "",
    nip: "",
    email: "",
    password: "",
    konfirmasi_password: "",
    role_id: "",
    level_id: "",
    id_ranting: 1,
    id_mesin: "",
    id_cabang: "",
    id_pembina: "",
    id_sentral: "",
    id_pengelola: "",
    status: true,
  };
};

interface PenggunaItem {
  data: any
  meta: any
  id: number
  nama_pegawai: string
  email: string
  status: boolean
  nip: string
  id_pembina: any
  level_id: any
  role: [
    {
      role: string
    }
  ]
  pengelola: [
    {
      pengelola: string
    }
  ]
  pembina: [
    {
      pembina: string
    }
  ]
  sentral: [
    {
      sentral: string
    }
  ]
}
interface SentralItem {
  id_sentral: number
  sentral: string
}
interface GroupedData {
  [key: string]: PenggunaItem[]
}
interface MinimizedGroups {
  [key: string]: boolean
}
interface RoleItem {
  id: number
  role: string
}
interface MesinItem {
  id_mesin: string
  mesin: string
}
interface IndukItem {
  id_pengelola: number
  pengelola: string
}
interface LevelItem {
  kode_level: string
  level: string
}
interface PengelolaItem {
  id_pembina: number
  pembina: string
}
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

onMounted(() => {
  showPasswordFields.value = userRole.value === "1";
});

onMounted(async () => {
  isLoading.value = true;
  try {
    userData.value = await userService.getUserData();
    userRole.value = userData.value.role_id;
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    isLoading.value = false;
  }
});
const generatePageList = computed(() => {
  const pageList = [];
  const maxPages = 5;

  if (navigation.value.totalPages <= maxPages) {
    for (let i = 1; i <= navigation.value.totalPages; i++) {
      pageList.push(i);
    }
  } else {
    if (navigation.value.currentPage <= 3) {
      for (let i = 1; i <= Math.min(navigation.value.totalPages, maxPages - 1); i++) {
        pageList.push(i);
      }
      if (navigation.value.totalPages > maxPages) {
        pageList.push('...');
        pageList.push(navigation.value.totalPages);
      }
    } else if (navigation.value.currentPage >= navigation.value.totalPages - 2) {
      pageList.push(1);
      pageList.push('...');
      for (let i = navigation.value.totalPages - (maxPages - 2); i <= navigation.value.totalPages; i++) {
        pageList.push(i);
      }
    } else {
      pageList.push(1);
      pageList.push('...');
      for (let i = navigation.value.currentPage - 1; i <= navigation.value.currentPage + 1; i++) {
        pageList.push(i);
      }
      pageList.push('...');
      pageList.push(navigation.value.totalPages);
    }
  }
  return pageList;
});
const closeModalEdit = () => {
  isModalEdit.value = false;
  showEditPassword.value = false;
  showEditConfirmPassword.value = false;
  resetFormData();
  errorsEdit.value = [];
  comboRole.value = [
    {
      id: 138,
      role: 'Staff'
    },
    {
      id: 140,
      role: 'Approver'
    },
    {
      id: 141,
      role: 'Super Admin'
    },
    {
      id: 142,
      role: 'Monitoring'
    }
  ];
};

const closeModal = () => {
  showModalCreate.value = false;
  showPassword.value = false;
  showConfirmPassword.value = false;
  resetFormData();
  errors.value = [];
  comboRole.value = [
    {
      id: 138,
      role: 'Staff'
    },
    {
      id: 140,
      role: 'Approver'
    },
    {
      id: 141,
      role: 'Super Admin'
    },
    {
      id: 142,
      role: 'Monitoring'
    }
  ];
};
const fetchData = async () => {
  try {
    isLoading.value = true;
    const response: PenggunaItem = await userService.getUserData(
      navigation.value.currentPage,
      navigation.value.limit,
      search.value
    );
    const { data, meta } = response;
    if (!data) pengguna.value = [];
    else pengguna.value = data;
    filteredPengguna.value = pengguna.value;
    navigation.value.totalPages = meta.totalPages;
    navigation.value.totalRecords = meta.totalRecords;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

const changePageLimit = async (event: any) => {
  isLoading.value = true;
  navigation.value.limit = parseInt(event.target.value);
  navigation.value.currentPage = 1;
  await fetchData();
  isLoading.value = false;
};

const isActive = computed({
  get: () => formData.value.status === true,
  set: (value) => (formData.value.status = value ? true : false),
});

const openEditModals = async (id: number) => {
  try {
    isLoading.value = true;
    const response: any = await userService.getUserById(id);
    formData.value.nama_pegawai = response.data.nama_pegawai;
    formData.value.nip = response.data.nip;
    formData.value.email = response.data.email;
    formData.value.role_id = response.data.role_id;
    formData.value.level_id = response.data.level_id.toString();
    formData.value.id_ranting = response.data.id_ranting;
    formData.value.id_mesin = response.data.id_mesin;
    formData.value.id_cabang = response.data.id_cabang;
    formData.value.id_pembina = response.data.id_pembina;
    formData.value.id_pengelola = response.data.id_pengelola;
    formData.value.id_sentral = response.data.id_sentral;
    const responseSentral: any = await userService.getSentralByPengelola(
      parseInt(formData.value.id_pengelola),
      parseInt(formData.value.id_pembina)
    );
    handleChangeLevel(response.data.level_id);
    comboSentral.value = responseSentral.data;
    comboSentral.value.forEach((item) => {
      sentralMappings.value[item.id_sentral] = item.sentral;
    });
    formData.value.status = response.data.status;
    console.log('formulir', formData.value);
    console.log('sentral', formData.value.id_sentral);
    isModalEdit.value = true;
    selectedUserId.value = id;
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching role data:", error);
    isLoading.value = false;
  }
};

const fetchPembina = async () => {
  try {
    const response: any = await userService.getPembina('');
    listPembina.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

const userPembina = (idPembina: number) => {
  if (listPembina.value.length > 0) {
    if (idPembina !== 0) {
      return listPembina.value.find((pembina: any) => pembina.id_pembina === idPembina).pembina;
    }
    return 'Tidak Tersedia'
  }
}

const userLevel = (idLevel: number) => {
  if (idLevel) {
    if (idLevel === 1) return 'Pusat';
    else if (idLevel === 2) return 'Pengelola';
    else if (idLevel === 3) return 'Sentral';
    else if (idLevel === 4) return 'Pembina';
  }
  return 'Tidak Tersedia';
}

const editUserDataAndCloseModal = async () => {
  errorsEdit.value = [];
  if (!formData.value.nama_pegawai) {
    errorsEdit.value.push("Nama Lengkap wajib diisi.");
  }
  if (!formData.value.nip) {
    errorsEdit.value.push("NIP wajib diisi.");
  }
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!formData.value.email) {
    errorsEdit.value.push("Email wajib diisi.");
  } else if (!emailPattern.test(formData.value.email)) {
    errorsEdit.value.push("Email tidak valid.");
  }
  if (!formData.value.role_id) {
    errorsEdit.value.push("Role wajib diisi.");
  }
  if (errorsEdit.value.length === 0) {
    try {
      var dataToPost = {};
      if (formData.value.level_id === '1') {
        dataToPost = {
          nama_pegawai: formData.value.nama_pegawai,
          nip: formData.value.nip,
          email: formData.value.email,
          password: formData.value.password,
          konfirmasi_password: formData.value.konfirmasi_password,
          role_id: parseInt(formData.value.role_id),
          level_id: parseInt(formData.value.level_id),
          id_ranting: formData.value.id_ranting,
          id_mesin: parseInt(formData.value.id_mesin),
          id_cabang: parseInt(formData.value.id_cabang),
          id_pembina: null,
          id_sentral: null,
          id_pengelola: null,
          status: formData.value.status,
        }
      }
      else if (hiddenPembina.includes(formData.value.level_id)) {
        dataToPost = {
          nama_pegawai: formData.value.nama_pegawai,
          nip: formData.value.nip,
          email: formData.value.email,
          password: formData.value.password,
          konfirmasi_password: formData.value.konfirmasi_password,
          role_id: parseInt(formData.value.role_id),
          level_id: parseInt(formData.value.level_id),
          id_ranting: formData.value.id_ranting,
          id_mesin: parseInt(formData.value.id_mesin),
          id_cabang: parseInt(formData.value.id_cabang),
          id_pembina: null,
          id_sentral: null,
          id_pengelola: parseInt(formData.value.id_pengelola),
          status: formData.value.status,
        }
      } else if (hiddenSentral.includes(formData.value.level_id)) {
        dataToPost = {
          nama_pegawai: formData.value.nama_pegawai,
          nip: formData.value.nip,
          email: formData.value.email,
          password: formData.value.password,
          konfirmasi_password: formData.value.konfirmasi_password,
          role_id: parseInt(formData.value.role_id),
          level_id: parseInt(formData.value.level_id),
          id_ranting: formData.value.id_ranting,
          id_mesin: parseInt(formData.value.id_mesin),
          id_cabang: parseInt(formData.value.id_cabang),
          id_pembina: parseInt(formData.value.id_pembina),
          id_sentral: null,
          id_pengelola: parseInt(formData.value.id_pengelola),
          status: formData.value.status,
        }
      } else {
        dataToPost = {
          nama_pegawai: formData.value.nama_pegawai,
          nip: formData.value.nip,
          email: formData.value.email,
          password: formData.value.password,
          konfirmasi_password: formData.value.konfirmasi_password,
          role_id: parseInt(formData.value.role_id),
          level_id: parseInt(formData.value.level_id),
          id_ranting: formData.value.id_ranting,
          id_mesin: parseInt(formData.value.id_mesin),
          id_cabang: parseInt(formData.value.id_cabang),
          id_pembina: parseInt(formData.value.id_pembina),
          id_sentral: parseInt(formData.value.id_sentral),
          id_pengelola: parseInt(formData.value.id_pengelola),
          status: formData.value.status,
        }
      }
      const idUser: any = selectedUserId.value;
      const response = await userService.updateUser(idUser, dataToPost);
      const responseData: any = response;
      if (responseData.success) {
        formData.value = {
          nama_pegawai: "",
          nip: "",
          email: "",
          password: "",
          konfirmasi_password: "",
          role_id: "",
          level_id: "",
          id_ranting: 1,
          id_mesin: "",
          id_cabang: "",
          id_pembina: "",
          id_sentral: "",
          id_pengelola: "",
          status: false,
        };
        isModalEdit.value = false;
        resetFormData();
        await fetchData();
        isEditSuccess.value = true;
        await wait(3000);
        isEditSuccess.value = false;
      } else {
        console.error("Gagal Menyimpan Data: ", responseData.error);
      }
    } catch (error) {
      console.error("Error saat mengirim data:", error);
    }
  }
};

const saveUserDataAndCloseModal = async () => {
  isLoading.value = true;
  errors.value = [];
  if (!formData.value.nama_pegawai) {
    errors.value.push("Nama Lengkap wajib diisi.");
  }
  if (!formData.value.nip) {
    errors.value.push("NIP wajib diisi.");
  }
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!formData.value.email) {
    errors.value.push("Email wajib diisi.");
  } else if (!emailPattern.test(formData.value.email)) {
    errors.value.push("Email tidak valid.");
  }

  const passwordPattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{}|;':"<>?,./]).{8,}$/;
  if (!formData.value.password) {
    errors.value.push("Password wajib diisi.");
  } else if (!passwordPattern.test(formData.value.password)) {
    errors.value.push(
      "Password harus mengandung angka, karakter, huruf besar, dan huruf kecil."
    );
  }
  if (!formData.value.konfirmasi_password) {
    errors.value.push("Konfirmasi Password wajib diisi.");
  }
  if (formData.value.password !== formData.value.konfirmasi_password) {
    errors.value.push("Password dan Konfirmasi Password tidak cocok.");
  }
  if (!formData.value.role_id) {
    errors.value.push("Role wajib diisi.");
  }
  if (errors.value.length === 0) {
    try {
      const dataToPost = {
        nama_pegawai: formData.value.nama_pegawai,
        nip: formData.value.nip,
        email: formData.value.email,
        password: formData.value.password,
        konfirmasi_password: formData.value.konfirmasi_password,
        role_id: parseInt(formData.value.role_id),
        level_id: parseInt(formData.value.level_id),
        id_ranting: formData.value.id_ranting,
        id_mesin: parseInt(formData.value.id_mesin),
        id_cabang: parseInt(formData.value.id_cabang),
        id_pembina: parseInt(formData.value.id_pembina),
        id_sentral: parseInt(formData.value.id_sentral),
        id_pengelola: parseInt(formData.value.id_pengelola),
        status: formData.value.status,
      };
      const response = await userService.createUser(dataToPost);
      const responseData: any = response;
      if (responseData.success) {
        formData.value = {
          nama_pegawai: "",
          nip: "",
          email: "",
          password: "",
          konfirmasi_password: "",
          role_id: "",
          level_id: "",
          id_ranting: 1,
          id_mesin: "",
          id_cabang: "",
          id_pembina: "",
          id_sentral: "",
          id_pengelola: "",
          status: false,
        };
        showModalCreate.value = false;
        await fetchData();
        isLoading.value = false;
        isSuccess.value = true;
        await wait(3000);
        isSuccess.value = false;
      } else {
        isLoading.value = false;
        console.error("Gagal Menyimpan Data: ", responseData.error);
      }
    } catch (error) {
      isLoading.value = false;
      console.error("Error saat mengirim data:", error);
    }
  } else {
    isLoading.value = false;
  }
};

const handleChangePengelola = async () => {
  try {
    isLoading.value = true;
    const response: any = await userService.getPembina(formData.value.id_pengelola);
    comboPengelola.value = response.data;
    comboPengelola.value.forEach((item) => {
      pengelolaMappings.value[item.id_pembina] = item.id_pembina;
    });
    formData.value.id_pembina = "";
    formData.value.id_sentral = "";
    comboSentral.value = [];
  } catch (error) {
    console.error("Error fetching combo pengelola: ", error);
  } finally {
    isLoading.value = false;
  }
};
const handleChangePembina = async () => {
  try {
    const response: any = await userService.getSentralByPengelola(
      parseInt(formData.value.id_pengelola),
      parseInt(formData.value.id_pembina)
    );
    comboSentral.value = response.data;
    comboSentral.value.forEach((item) => {
      sentralMappings.value[item.id_sentral] = item.sentral;
    });
    formData.value.id_sentral = "";
  } catch (error) {
    console.error("Error fetching combo pengelola: ", error);
  }
}
const handleChangeLevel = (levelId: any) => {
  console.log(levelId);
  // Level Id 1 = Pusat
  if (levelId == 1) comboRole.value = [{ id: 141, role: 'Super Admin' }, { id: 142, role: 'Monitoring' }];
  // Level Id 2 = Pengelola
  else if (levelId == 2) comboRole.value = [{ id: 140, role: 'Approver' }, { id: 142, role: 'Monitoring' }];
  // Level Id 3 = Sentral
  else if (levelId == 3) comboRole.value = [{ id: 138, role: 'Staff' }];
  // Level Id 4 = Pembina
  else if (levelId == 4) comboRole.value = [{ id: 140, role: 'Approver' }, { id: 142, role: 'Monitoring' }];
  console.log(comboRole.value)
}

const goToPage = async (page: any) => {
  isLoading.value = true;
  navigation.value.currentPage = page;
  await fetchData();
  isLoading.value = false
};
const goToPrevious = () => {
  if (navigation.value.currentPage > 1) {
    goToPage(navigation.value.currentPage - 1);
  }
};
const goToNext = () => {
  if (navigation.value.currentPage < navigation.value.totalPages) {
    goToPage(navigation.value.currentPage + 1);
  }
};

onMounted(async () => {
  fetchData();
  await fetchPembina();
});

const calculateRowNumber = (group: string, index: number) => {
  let totalPreviousItems = 0;
  for (const key in groupedData.value) {
    console.log(key)
    if (key === group) break;
    totalPreviousItems += groupedData.value[key].length;
  }
  const offset = (navigation.value.currentPage - 1) * navigation.value.limit;
  return totalPreviousItems + index + 1 + offset;
};

onMounted(async () => {
  try {
    const response: any = await userService.getSentral();
  } catch (error) {
    console.error("Error fetching combo sentral:", error);
  }
});

onMounted(async () => {
  try {
    const response: any = await userService.getMesin();
    comboMesin.value = response.data;
    comboMesin.value.forEach((item) => {
      mesinMappings.value[item.id_mesin] = item.mesin;
    });
  } catch (error) {
    console.error("Error fetching combo mesin:", error);
  }
});

onMounted(async () => {
  try {
    const response: any = await userService.getRole();
    console.log(response.data, 'role')
    comboRole.value = response.data;
  } catch (error) {
    console.error("Error fetching combo role:", error);
  }
});

onMounted(async () => {
  try {
    const response: any = await userService.getInduk();
    const responseData = response;
    comboInduk.value = response.data;
    comboInduk.value.forEach((item) => {
      indukMappings.value[item.id_pengelola] = item.id_pengelola;
    });
  } catch (error) {
    console.error("Error fetching combo induk:", error);
  }
});
onMounted(async () => {
  try {
    const response: any = await userService.getPembina(formData.value.id_pengelola);
    comboPengelola.value = response.data;
    comboPengelola.value.forEach((item) => {
      pengelolaMappings.value[item.id_pembina] = item.id_pembina;
    });
  } catch (error) {
    console.error("Error fetching combo pengelola:", error);
  }
});
onMounted(async () => {
  try {
    const response: any = await userService.getLevel();
    const responseData = response;
    comboLevel.value = response.data;
    comboLevel.value.forEach((item) => {
      levelMappings.value[item.kode_level] = item.level;
    });
  } catch (error) {
    console.error("Error fetching combo submenu:", error);
    throw error;
  }
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const toggleEditPasswordVisibility = () => {
  showEditPassword.value = !showEditPassword.value;
};

const toggleEditConfirmPasswordVisibility = () => {
  showEditConfirmPassword.value = !showEditConfirmPassword.value;
};

const groupedData = computed(() => {
  const result: GroupedData = {};
  pengguna.value.forEach((user) => {
    let userRole = user.role[0]?.role || "Tidak tersedia";
    if (!result[userRole]) {
      result[userRole] = [];
    }
    result[userRole].push(user);
  });
  return result;
});
setTimeout(() => {
  console.log(groupedData.value);
  console.log(pengguna.value);
  console.log((navigation.value.currentPage - 1) * navigation.value.limit);
}, 5000);
</script>
<style scoped>
td {
  padding: 0.85rem;
}

ul li#pagination.selected {
  background-color: #0099AD;
  border-radius: 6px;
  color: white;
  transition: 300ms;
}

:disabled {
  background-color: #F5F5F5;
  cursor: not-allowed;
}

ul li.disabled {
  pointer-events: none;
  cursor: not-allowed;
  color: #D1D1DB;
}
</style>
