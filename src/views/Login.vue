<template>
  <Loading v-if="isLoadingSpinner" />
  <ModalNotification :show-modal="isChangePasswordSuccess" :animation-data="LottieSuccess"
    :title="'Password Berhasil Diubah'" :subtitle="'Silahkan login kembali dengan password yang baru'" />
  <ModalNotification :show-modal="isShowLocked" :animation-data="errorJsonData" :title="'Akun Terkunci'"
    :subtitle="'Silahkan hubungi admin untuk membuka akun anda'" />
  <ModalWrapper :showModal="isShowCompletePassword" :width="'w-80'" :height="'h-auto'">
    <div class="flex flex-col items-center space-y-5">
      <Vue3Lottie :animationData="LottieInfo" :width="200" :height="200" :loop="true" :speed="0.8" />
      <div class="flex flex-col items-center">
        <h1 class="mb-3 text-lg font-semibold text-center text-gray-700">
          Lengkapi Password Anda
        </h1>
        <p class="text-sm text-center text-textDisabledColor">
          Silakan ganti password Anda yang baru yang telah dikirim ke email Anda
        </p>
      </div>
      <button @click="handleClickChangePassword" :disabled="isLoadingButton"
        class="w-full px-3 py-2 text-sm font-semibold text-white rounded-lg bg-primaryColor active:ring active:ring-primaryColor active:ring-opacity-50">Ganti
        Password</button>
    </div>
  </ModalWrapper>
  <ModalWrapper :showModal="isModalChangePasswordShow" :width="'w-[850px]'" :height="'h-auto'">
    <div class="flex flex-col space-y-5">
      <div class="flex items-center justify-between">
        <p class="text-lg font-semibold text-primaryTextColor">Ganti Password</p>
        <button @click="isModalChangePasswordShow = false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <hr>
      <div class="flex items-center space-x-3">
        <div
          class="w-[65px] items-center flex flex-col font-semibold justify-center h-[65px] bg-warningColor rounded-full text-[24px] text-white uppercase">
          {{ userData.nama_pegawai.split('')[0] }}
        </div>
        <div class="flex flex-col space-y-1">
          <p class="text-base font-medium text-primaryTextColor">{{ userData.nama_pegawai }}</p>
          <p class="text-sm text-textDisabledColor">{{ userData.email }}</p>
          <Chips :title="'Role'" :content="authService.checkRole()" class="w-fit" />
        </div>
      </div>
      <div class="flex w-full space-x-5">
        <div class="flex flex-col space-y-5 w-[60%]">
          <div class="relative flex flex-col space-y-1">
            <label for="oldPassword" class="text-sm font-medium text-labelColor">Password Lama <span
                class="text-warningColor">*</span>
              <span v-if="isOldPasswordWrong" class="text-sm text-warningColor">Password Lama Salah</span>
            </label>
            <TextField id="oldPassword" :type="showOldPassword ? 'text' : 'password'"
              placeholder="Masukkan password lama anda" class="text-sm" v-model="oldPassword" />
            <button @click="showOldPassword = !showOldPassword"
              class="absolute inset-y-0 right-0 flex items-center pt-5 pr-3">
              <svg v-if="!showOldPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                  fill="#0F172A" />
              </svg>
              <svg v-if="showOldPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                  fill="#0F172A" />
                <rect width="1.51154" height="18.1385" rx="0.75"
                  transform="matrix(0.701707 0.712466 -0.701707 0.712466 13.5835 0.105713)" fill="#0F172A" />
              </svg>
            </button>
          </div>
          <div class="relative flex flex-col space-y-1">
            <label for="newPassword" class="text-sm font-medium text-labelColor">Password Baru <span
                class="text-warningColor">*</span></label>
            <TextField @on-input="verifyRequirementPassword" id="newPassword"
              :type="showNewPassword ? 'text' : 'password'" placeholder="Masukkan password baru anda" class="text-sm"
              v-model="newPassword" />
            <button @click="showNewPassword = !showNewPassword"
              class="absolute inset-y-0 right-0 flex items-center pt-5 pr-3">
              <svg v-if="!showNewPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                  fill="#0F172A" />
              </svg>
              <svg v-if="showNewPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                  fill="#0F172A" />
                <rect width="1.51154" height="18.1385" rx="0.75"
                  transform="matrix(0.701707 0.712466 -0.701707 0.712466 13.5835 0.105713)" fill="#0F172A" />
              </svg>
            </button>
          </div>
          <div class="relative flex flex-col space-y-1">
            <label for="confirmNewPassword" class="text-sm font-medium text-labelColor">Konfirmasi Password Baru <span
                class="text-warningColor">*</span><span v-if="!isPasswordMatched && confirmNewPassword"
                class="ml-1.5 text-sm text-warningColor">Password Tidak Sesuai</span></label>
            <TextField @on-input="verifyMatchPassword" id="confirmNewPassword"
              :type="showConfirmNewPassword ? 'text' : 'password'" placeholder="Masukkan konfirmasi password baru anda"
              class="text-sm" v-model="confirmNewPassword" />
            <button @click="showConfirmNewPassword = !showConfirmNewPassword"
              class="absolute inset-y-0 right-0 flex items-center pt-5 pr-3">
              <svg v-if="!showConfirmNewPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                  fill="#0F172A" />
              </svg>
              <svg v-if="showConfirmNewPassword" width="16" height="12" viewBox="0 0 16 12" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.00051 1.66536C5.20279 1.66536 2.82714 3.47986 1.98946 5.99808C1.98897 5.99955 1.98897 6.00136 1.98946 6.00283C2.82818 8.51923 5.20293 10.332 7.99934 10.332C10.7971 10.332 13.1727 8.51754 14.0104 5.99932C14.0109 5.99785 14.0109 5.99604 14.0104 5.99457C13.1717 3.47817 10.7969 1.66536 8.00051 1.66536ZM0.72429 5.57722C1.73777 2.5305 4.61153 0.332031 8.00051 0.332031C11.3879 0.332031 14.2606 2.52846 15.2753 5.57297C15.3669 5.84785 15.367 6.14524 15.2756 6.42018C14.2621 9.46689 11.3883 11.6654 7.99934 11.6654C4.61194 11.6654 1.73927 9.46894 0.72454 6.42443C0.632921 6.14955 0.632834 5.85216 0.72429 5.57722ZM7.99997 4.66536C7.26359 4.66536 6.66663 5.26232 6.66663 5.9987C6.66663 6.73508 7.26359 7.33203 7.99997 7.33203C8.73635 7.33203 9.3333 6.73508 9.3333 5.9987C9.3333 5.26232 8.73635 4.66536 7.99997 4.66536ZM5.3333 5.9987C5.3333 4.52594 6.52721 3.33203 7.99997 3.33203C9.47273 3.33203 10.6666 4.52594 10.6666 5.9987C10.6666 7.47146 9.47273 8.66536 7.99997 8.66536C6.52721 8.66536 5.3333 7.47146 5.3333 5.9987Z"
                  fill="#0F172A" />
                <rect width="1.51154" height="18.1385" rx="0.75"
                  transform="matrix(0.701707 0.712466 -0.701707 0.712466 13.5835 0.105713)" fill="#0F172A" />
              </svg>
            </button>
          </div>
        </div>
        <div class="w-[40%] rounded-lg bg-opacity-30 h-fit px-4 py-3 space-y-2"
          :class="hasMinLength && hasNumber && hasUppercase && hasLowercase && hasSymbol ? 'bg-greenColor' : 'bg-warningColor'">
          <p class="text-base font-semibold text-primaryTextColor">Persyaratan Minimal</p>
          <div class="flex flex-col space-y-2">
            <div class="flex items-center space-x-1.5">
              <IconRoundedChecked v-if="hasMinLength" />
              <IconRoundedClose v-else />
              <p class="text-sm text-primaryTextColor">Minimal 8 karakter</p>
            </div>
            <div class="flex items-center space-x-1.5">
              <IconRoundedChecked v-if="hasNumber" />
              <IconRoundedClose v-else />
              <p class="text-sm text-primaryTextColor">Mengandung angka</p>
            </div>
            <div class="flex items-center space-x-1.5">
              <IconRoundedChecked v-if="hasUppercase" />
              <IconRoundedClose v-else />
              <p class="text-sm text-primaryTextColor">Mengandung huruf kapital</p>
            </div>
            <div class="flex items-center space-x-1.5">
              <IconRoundedChecked v-if="hasLowercase" />
              <IconRoundedClose v-else />
              <p class="text-sm text-primaryTextColor">Mengandung huruf kecil</p>
            </div>
            <div class="flex items-center space-x-1.5">
              <IconRoundedChecked v-if="hasSymbol" />
              <IconRoundedClose v-else />
              <p class="text-sm text-primaryTextColor">Mengandung simbol (unicode)</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end w-full">
        <button @click="changePassword"
          class="px-3 py-2 text-sm font-semibold text-white rounded-lg active:ring active:ring-primaryColor active:ring-opacity-50 bg-primaryColor">Ganti
          Password</button>
      </div>
    </div>
  </ModalWrapper>
  <div class="h-screen md:flex">
    <div class="relative hidden w-8/12 max-h-screen md:flex">
      <div id="default-carousel" class="relative w-full" data-carousel="slide">
        <!-- Carousel wrapper -->
        <div class="relative h-screen overflow-hidden md:h-screen">
          <div class="relative z-50 p-10">
            <img src="../assets/img/LogoPLN.png" class="w-26" alt="logo-pln" />
          </div>
          <!-- Item 1 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/Carousel2.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
          <!-- Item 2 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel4.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
          <!-- Item 3 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel5.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
          <!-- Item 4 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel6.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
          <!-- Item 5 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/Carousel3.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
        </div>
        <!-- Slider indicators -->
        <div class="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
          <button type="button" class="w-12 h-2 rounded-full" aria-current="true" aria-label="Slide 1"
            data-carousel-slide-to="0"></button>
          <button type="button" class="w-12 h-2 rounded-full" aria-current="false" aria-label="Slide 2"
            data-carousel-slide-to="1"></button>
          <button type="button" class="w-12 h-2 rounded-full" aria-current="false" aria-label="Slide 3"
            data-carousel-slide-to="2"></button>
          <button type="button" class="w-12 h-2 rounded-full" aria-current="false" aria-label="Slide 4"
            data-carousel-slide-to="3"></button>
          <button type="button" class="w-12 h-2 rounded-full" aria-current="false" aria-label="Slide 5"
            data-carousel-slide-to="4"></button>
        </div>
      </div>
    </div>
    <div class="flex md:w-4/12 min-h-screen justify-center items-center py-10 bg-[#F6FAFD] overflow-auto">
      <form class="bg-[#F6FAFD]">
        <div>
          <img src="../assets/img/LogoValiant.png" class="m-auto w-72" alt="logo-valiant" />
        </div>
        <h1 class="mb-2 text-3xl font-bold text-gray-800">Login</h1>
        <p class="mb-4 text-xs font-normal text-gray-600">
          Silahkan login terlebih dahulu untuk masuk aplikasi.
        </p>
        <div v-if="isShowCounter"
          class="flex flex-col w-full space-y-1.5 px-3 pb-3 pt-1 rounded-lg border border-warningColor bg-warningColor bg-opacity-15 mb-2 overflow-clip relative">
          <div class="absolute top-0 left-0">
            <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.4">
                <circle cx="26" cy="26" r="42" fill="#FD8A8A" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M28.5259 10.5493C27.4034 8.60375 24.5955 8.60375 23.4731 10.5493L6.31302 40.2934C5.19122 42.2379 6.59455 44.6676 8.83939 44.6676H43.1596C45.4044 44.6676 46.8078 42.2379 45.686 40.2934L28.5259 10.5493ZM19.4309 8.21723C22.3492 3.15887 29.6498 3.15887 32.5681 8.21723L49.7282 37.9614C52.6448 43.017 48.9962 49.3343 43.1596 49.3343H8.83939C3.00282 49.3343 -0.64585 43.017 2.27082 37.9614L19.4309 8.21723ZM25.9995 20.1676C27.2882 20.1676 28.3328 21.2123 28.3328 22.501V31.251C28.3328 32.5396 27.2882 33.5843 25.9995 33.5843C24.7108 33.5843 23.6662 32.5396 23.6662 31.251V22.501C23.6662 21.2123 24.7108 20.1676 25.9995 20.1676ZM23.6662 38.251C23.6662 36.9623 24.7108 35.9176 25.9995 35.9176H26.017C27.3057 35.9176 28.3503 36.9623 28.3503 38.251V38.2685C28.3503 39.5571 27.3057 40.6018 26.017 40.6018H25.9995C24.7108 40.6018 23.6662 39.5571 23.6662 38.2685V38.251Z"
                  fill="white" />
              </g>
            </svg>
          </div>
          <div class="flex justify-between">
            <p class="font-semibold text-primaryTextColor">Informasi</p>
            <button type="button" @click="isShowCounter = false">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M2.29289 2.29289C2.68342 1.90237 3.31658 1.90237 3.70711 2.29289L8 6.58579L12.2929 2.29289C12.6834 1.90237 13.3166 1.90237 13.7071 2.29289C14.0976 2.68342 14.0976 3.31658 13.7071 3.70711L9.41421 8L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L8 9.41421L3.70711 13.7071C3.31658 14.0976 2.68342 14.0976 2.29289 13.7071C1.90237 13.3166 1.90237 12.6834 2.29289 12.2929L6.58579 8L2.29289 3.70711C1.90237 3.31658 1.90237 2.68342 2.29289 2.29289Z"
                  fill="#FF5656" />
              </svg>
            </button>
          </div>
          <p class="text-sm text-primaryTextColor">Sisa {{ remainingAttempt }} kali percobaan lagi sebelum akun terkunci
          </p>
        </div>
        <div>
          <label for="emailAddress" class="text-xs text-[#5979A6] mb-1">Email</label>
          <input v-model="valEmail" id="emailAddress" type="email" autocomplete="new-email"
            class="block bg-white p-3 w-[350px] mb-4 text-xs text-gray-900 rounded-md border border-gray-300 focus:ring-[#0099AD] focus:border-[#0099AD]"
            placeholder="Masukkan Email Anda" />
        </div>
        <p class="mb-2 -mt-2 text-xs text-red-500">{{ valEmailErr }}</p>
        <div>
          <label for="password1" class="text-xs text-[#5979A6] mb-1">Password</label>
          <div class="relative">
            <input v-model="valPassword" autocomplete="new-password"
              class="block bg-white py-3 w-[350px] text-xs mb-6 text-gray-900 rounded-md border border-gray-300 focus:ring-[#0099AD] focus:border-[#0099AD]"
              :type="showPassword ? 'text' : 'password'" id="password1" placeholder="Masukkan Kata Sandi"
              @keyup.enter="onSubmitLogin" />
            <button @click="visiblePassword" class="absolute transform -translate-y-1/2 top-1/2 right-3" type="button">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" class="mr-4" height="12"
                viewBox="0 0 16 12" fill="none">
                <path
                  d="M8 1.16577C10.209 1.16577 12.0275 2.40216 13.3398 3.73427C13.989 4.39332 14.493 5.0549 14.8346 5.55215C14.9529 5.72443 15.0511 5.87613 15.1286 6.00008C15.0511 6.12403 14.9529 6.27574 14.8345 6.44803C14.493 6.94528 13.9889 7.60687 13.3397 8.26592C12.0273 9.59805 10.2088 10.8344 8 10.8344C5.79123 10.8344 3.97267 9.59805 2.66032 8.26592C2.01107 7.60687 1.50703 6.94528 1.16548 6.44803C1.04715 6.27574 0.9489 6.12404 0.871435 6.00008C0.94889 5.87613 1.04712 5.72443 1.16544 5.55215C1.50696 5.0549 2.01096 4.39332 2.66019 3.73427C3.97247 2.40216 5.79103 1.16577 8 1.16577Z"
                  stroke="#989899" stroke-width="1.5" />
                <ellipse cx="8" cy="6" rx="2.5" ry="2.53833" fill="#989899" />
              </svg>
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" class="mr-4" height="15"
                viewBox="0 0 16 15" fill="none">
                <path
                  d="M8 2.27148C10.209 2.27148 12.0275 3.50788 13.3398 4.83999C13.989 5.49903 14.493 6.16061 14.8346 6.65787C14.9529 6.83014 15.0511 6.98184 15.1286 7.10579C15.0511 7.22975 14.9529 7.38145 14.8345 7.55374C14.493 8.051 13.9889 8.71259 13.3397 9.37163C12.0273 10.7038 10.2088 11.9401 8 11.9401C5.79123 11.9401 3.97267 10.7038 2.66032 9.37163C2.01107 8.71259 1.50703 8.051 1.16548 7.55374C1.04715 7.38145 0.9489 7.22975 0.871435 7.10579C0.94889 6.98184 1.04712 6.83014 1.16544 6.65787C1.50696 6.16061 2.01096 5.49903 2.66019 4.83999C3.97247 3.50788 5.79103 2.27148 8 2.27148Z"
                  stroke="#989899" stroke-width="1.5" />
                <ellipse cx="8" cy="7.10571" rx="2.5" ry="2.53833" fill="#989899" />
                <rect width="1.51154" height="18.1385" rx="0.75"
                  transform="matrix(0.701707 0.712466 -0.701707 0.712466 13.5835 0.105713)" fill="#989899" />
              </svg>
            </button>
          </div>
        </div>
        <p class="mb-3 -mt-1 text-xs text-red-500">{{ valPasswordErr }}</p>
        <div class="flex flex-col">
          <div class="mb-2 text-sm font-bold tracking-wide text-gray-700">
            Captcha
          </div>
          <!-- <RecaptchaV2 class="flex items-center justify-center" @widget-id="handleWidgetId"
            @error-callback="handleErrorCalback" @expired-callback="handleExpiredCallback"
            @load-callback="handleLoadCallback" /> -->
          <div
            class="bg-white text-primaryTextColor h-[80px] w-[350px] px-4 border-2 border-gray-200 flex items-center justify-between rounded-md">
            <label for="check" class="space-x-2.5">
              <input type="checkbox" id="check" class="w-5 h-5 rounded-sm cursor-pointer" v-model="checkbox"
                @click="checkboxChange" />
              <span class="text-sm" :class="ceklistCaptcha === true
                ? 'text-green-500'
                : ceklistCaptcha === false
                  ? 'text-red-500'
                  : 'text-primaryTextColor'
                ">I'm not a robot</span>
            </label>
            <div>
              <div>
                <img alt="Preview" src="https://www.gstatic.com/recaptcha/api2/logo_48.png" class="w-6 ml-5" />
                <span class="text-[9px] mr-1 ml-2">reCAPTCHA</span>
                <div class="flex">
                  <a href="#" class="text-[9px] mr-1">Privacy</a>
                  <span class="text-[9px] mr-1">-</span>
                  <a href="#" class="text-[9px] mr-1">Terms</a>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-2 bg-white text-primaryTextColor h-[140px] w-[350px] border border-gray-300 rounded-md"
            :class="box === true ? 'block' : 'hidden'">
            <input type="text" id="captchaInput" class="w-[330px] mx-2 text-xs m-1 border-0"
              placeholder="Masukkan captcha disini" v-model="valCaptcha" />
            <hr class="border-gray-300 w-[330px] mx-2" />
            <div class="flex items-center justify-center">
              <div class="m-2">
                <input type="text" id="captcha" disabled class="w-24 text-xs text-center bg-gray-200 border-0"
                  :value="captcha.map((c: any) => c.char).join('')" />
              </div>
            </div>
            <hr />
            <div class="flex justify-between mr-4 mt-1.5">
              <div class="flex px-4 py-2">
                <img src="https://www.gstatic.com/recaptcha/api2/refresh.png" alt="refresh" class="w-5 h-5" />
                <img src="https://www.gstatic.com/recaptcha/api2/audio.png" alt="audio" class="w-5 h-5" />
                <img src="https://www.gstatic.com/recaptcha/api2/info.png" alt="info" class="w-5 h-5" />
              </div>
              <button
                class="w-20 text-xs font-semibold tracking-wide text-white duration-300 bg-indigo-600 rounded-md shadow-lg font-display focus:outline-none focus:shadow-outline hover:bg-indigo-300 hover:text-indigo-600"
                @click="checkCaptcha" type="button">
                Verify
              </button>
            </div>
          </div>
        </div>
        <button @click="onSubmitLogin" type="button"
          class="text-white uppercase  bg-[#0099AD] w-[350px] hover:bg-[#0099AD] hover:text-white active:ring active:ring-[#005A66] rounded-lg text-xs p-3 my-4 dark:bg-[#005A66] dark:hover:bg-slate-300 focus:outline-none dark:focus:ring-[#0099AD]"
          v-if="ceklistCaptcha && (valEmail && valPassword)">
          <p v-show="!isLoadingButton" class="font-semibold">Masuk Ke Aplikasi</p>
          <div v-show="isLoadingButton" class="flex flex-row items-center justify-center space-x-2">
            <svg aria-hidden="true" class="inline w-5 h-5 text-gray-200 animate-spin fill-[#0099AD]"
              viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg>
            <span class="font-medium">Loading...</span>
          </div>
        </button>
        <button
          class="text-primaryTextColor uppercase  bg-slate-300 w-[350px] cursor-not-allowed focus:ring-4 focus:ring-slate-700 rounded-lg text-xs p-3 my-4 dark:bg-slate-700 dark:hover:bg-slate-300 focus:outline-none dark:focus:ring-slate-400"
          v-else disabled>
          <p class="font-medium">Masuk Ke Aplikasi</p>
        </button>
        <div class="flex flex-row items-center justify-center mb-4 space-x-3">
          <div class="w-16 h-[1px] bg-slate-300"></div>
          <p class="mr-1 text-xs text-center">atau masuk dengan</p>
          <div class="w-16 h-[1px] bg-slate-300"></div>
        </div>
        <button type="button" @click="loginSSO"
          class="text-[#0099AD] duration-300 bg-white w-[350px] hover:bg-blue-100 border border-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-xs p-3 text-center dark:focus:ring-[#007E8F] dark:bg-white dark:border-[#0099AD] dark:text-[#005A66] dark:hover:bg-blue-200 mr-2">
          LOGIN SSO
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import LoginService from "@/services/auth-service";
const loginService = new LoginService();
import { initFlowbite } from "flowbite";
import axios from "axios";
import { store } from "../store";
import { encryptStorage } from "@/utils/app-encrypt-storage";
import { notifyError } from "@/services/helper/toast-notification";
import { RecaptchaV2, useRecaptcha } from "vue3-recaptcha-v2";
import AuthService from "@/services/auth-service";
const authService = new AuthService();
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import TextField from "@/components/ui/TextField.vue";
import IconRoundedChecked from "@/components/icons/IconRoundedChecked.vue";
import IconRoundedClose from "@/components/icons/IconRoundedClose.vue";
import ModalNotification from "@/components/ui/ModalNotification.vue";
import errorJsonData from '@/assets/lottie/error.json';
import LottieInfo from "@/assets/lottie/info.json";
import Loading from "@/components/ui/LoadingSpinner.vue";
import LottieSuccess from "@/assets/lottie/success.json";
import Chips from "@/components/ui/Chips.vue";

const nodeMode = import.meta.env.MODE;
const router = useRouter();
const isLoadingButton = ref<boolean>(false);
const isLoadingSpinner = ref<boolean>(false);
const valEmail = ref<string>("");
const valPassword = ref<string>("");
const valEmailErr = ref<string>("");
const valPasswordErr = ref<string>("");
const showPassword = ref<boolean>(false);
const isVerified = ref<boolean>(false)
const isShowCounter = ref<boolean>(false);
const remainingAttempt = ref<number>(0);
const isShowLocked = ref<boolean>(false);
const isModalChangePasswordShow = ref<boolean>(false);
const showOldPassword = ref<boolean>(false);
const showNewPassword = ref<boolean>(false);
const showConfirmNewPassword = ref<boolean>(false);
const oldPassword = ref<string>("");
const newPassword = ref<string>("");
const confirmNewPassword = ref<string>("");
const hasMinLength = ref<boolean>(false);
const hasNumber = ref<boolean>(false);
const hasUppercase = ref<boolean>(false);
const hasLowercase = ref<boolean>(false);
const hasSymbol = ref<boolean>(false);
const isNewPasswordSameAsOld = ref<boolean>(false);
const isPasswordMatched = ref<boolean>(false);
const isOldPasswordWrong = ref<boolean>(false);
const isShowCompletePassword = ref<boolean>(false);
const url = import.meta.env.VITE_API_URL;
const isChangePasswordSuccess = ref<boolean>(false);
const checkbox = ref<boolean>(false);
const ceklistCaptcha = ref<boolean | null>(null);
const box = ref<boolean>(false);
const valCaptcha = ref<string>("");
const captcha = ref<any[]>([]);
const verify = ref(false);

const userData = ref<DataItem>({
  data: {},
  id_user: "",
  nip: "",
  email: "",
  username: "",
  nama_pegawai: "",
  atasan: "",
  photo: "",
  status: true,
  no_tlpn: 0,
  pengelola: "",
  pembina: "",
  sentral: "",
  roles: {},
  created_at: ""
});

interface DataItem {
  data: any
  id_user: string
  nip: string
  email: string
  username: string
  nama_pegawai: string
  atasan: string
  photo: string
  status: boolean
  no_tlpn: number
  pengelola: string
  pembina: string
  sentral: string
  roles: any
  created_at: any
}

const visiblePassword = () => {
  showPassword.value = !showPassword.value;
}

const checkboxChange = () => {
  box.value = true;
}

const { handleGetResponse } = useRecaptcha();
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const handleWidgetId = (widgetId: number) => {
  console.log("Widget ID: ", widgetId);
  const widget = handleGetResponse(widgetId);
  console.log('oo', widget);
};
const handleErrorCalback = () => {
  isVerified.value = false;
  console.log("Error callback");
};
const handleExpiredCallback = () => {
  isVerified.value = false;
  console.log("Expired callback");
};
const handleLoadCallback = (response: unknown) => {
  isVerified.value = true;
  console.log("Load callback", response);

};
const fetchDataProfile = async () => {
  try {
    isLoadingSpinner.value = true;
    const response: DataItem = await axios.get(`${url}user/me`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      }
    });
    userData.value = response.data.data;
    isLoadingSpinner.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
    isLoadingSpinner.value = false;
  }
};

// const preventCopyPaste = (event: ClipboardEvent) => {
//   event.preventDefault();
// };

const verifyRequirementPassword = () => {
  const password = newPassword.value;
  hasMinLength.value = password.length >= 8;
  hasNumber.value = /\d/.test(password);
  hasUppercase.value = /[A-Z]/.test(password);
  hasLowercase.value = /[a-z]/.test(password);
  hasSymbol.value = /[\p{P}\p{S}]/u.test(password);
  isNewPasswordSameAsOld.value = newPassword.value === oldPassword.value;
  verifyMatchPassword();
};

const verifyMatchPassword = () => {
  if (newPassword.value !== confirmNewPassword.value) {
    isPasswordMatched.value = false;
    console.log("Password tidak sama");
  } else {
    isPasswordMatched.value = true;
    console.log("Password sama");
  }
}
const resetInputAndAttribute = () => {
  oldPassword.value = "";
  newPassword.value = "";
  confirmNewPassword.value = "";
  hasMinLength.value = false;
  hasNumber.value = false;
  hasUppercase.value = false;
  hasLowercase.value = false;
  hasSymbol.value = false;
  isNewPasswordSameAsOld.value = false;
  isPasswordMatched.value = false;
  showOldPassword.value = false;
  showNewPassword.value = false;
  showConfirmNewPassword.value = false;
};
const changePassword = async () => {
  if (!isPasswordMatched.value || !hasMinLength.value || !hasNumber.value || !hasUppercase.value || !hasLowercase.value || !hasSymbol.value) {
    notifyError("Password tidak memenuhi persyaratan, mohon lengkapi persyaratan tersebut!", 7000);
  } else if (isNewPasswordSameAsOld.value) {
    notifyError("Password baru tidak boleh sama dengan password lama yang anda masukkan!", 7000);
  } else {
    try {
      isLoadingSpinner.value = true;
      await axios.post(`${url}user/change-password`, {
        email: userData.value.email,
        password_old: oldPassword.value,
        password_new: newPassword.value,
      }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        }
      });
      isOldPasswordWrong.value = false;
      isLoadingSpinner.value = false;
      isModalChangePasswordShow.value = false;
      resetInputAndAttribute();
      isChangePasswordSuccess.value = true;
      await wait(3000);
      isChangePasswordSuccess.value = false;
      nodeMode === 'production' ? encryptStorage.clear() : localStorage.clear();
    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error.response.data.message === 'Password Lama tidak sesuai') {
        isOldPasswordWrong.value = true;
        notifyError("Password lama anda salah, mohon periksa kembali password lama anda!", 7000);
      }
      isLoadingSpinner.value = false;
    }
  }
};

const checkCaptcha = () => {
  if (valCaptcha.value !== captcha.value.map((c: any) => c.char).join("")) {
    console.log('papa')
    valPasswordErr.value = "Captcha yang anda masukkan tidak sesuai";
  } else if (valCaptcha.value === captcha.value.map((c: any) => c.char).join("")) {
    console.log('masuk2')
    valPasswordErr.value = "";
    verify.value = true;
    checkbox.value = true;
    ceklistCaptcha.value = true;
    box.value = false;
  } else {
    console.log('rtes')
    valPasswordErr.value = "";
    box.value = false;
    ceklistCaptcha.value = false;
  }
}


const handleClickChangePassword = async () => {
  await fetchDataProfile();
  isShowCompletePassword.value = false;
  isModalChangePasswordShow.value = true;
}

const generateCaptcha = () => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let captchaChars = [];
  for (let i = 0; i < 6; i++) {
    // SonarQube: Math.random() is safe to use here
    let char = chars[Math.floor(Math.random() * chars.length)];
    // SonarQube: Math.random() is safe to use here
    let fontSize = Math.floor(Math.random() * 10) + 20; // random font size between 20 and 30
    // SonarQube: Math.random() is safe to use here
    let rotation = Math.floor(Math.random() * 21) - 10; // random rotation between -10 and 10 degrees
    captchaChars.push({ char, fontSize, rotation });
  }
  captcha.value = captchaChars;
}

const onSubmitLogin = async () => {
  if (isLoadingButton.value) return;

  const maxAttempt = 5;
  if (valEmail.value === "") {
    valEmailErr.value = "Email kosong mohon diisi";
  } else if (valPassword.value === "") {
    valPasswordErr.value = "Password kosong mohon diisi";
    valEmailErr.value = "";
  } else {
    if (ceklistCaptcha.value) {
      isLoadingButton.value = true;
      valEmailErr.value = "";
      valPasswordErr.value = "";
      let param;
      valEmail.value = valEmail.value.replace(/\s+/g, '');
      valPassword.value = valPassword.value.replace(/\s+/g, '');

      param = {
        email: valEmail.value,
        password: valPassword.value,
      };

      try {
        const response: any = await loginService.login(param);
        const token = response.data.token;
        const permission = await axios.get(`${url}permission`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        store.setMenus(permission.data.data);
        if (response.data.is_reset) {
          try {
            isShowCompletePassword.value = true;
            isLoadingButton.value = false;
          } catch (error) {
            console.error(error);
          }
        } else {
          setTimeout(() => {
            router.push({ name: "dashboard" });
          }, 500);
        }
      } catch (error: any) {
        isShowCounter.value = true;
        remainingAttempt.value = maxAttempt - error.response.data.data.temp_loc;
        valEmailErr.value = "Email atau Password salah";
        valPasswordErr.value = "Email atau Password salah";
        if (error.response.data.data.is_locked) {
          isShowCounter.value = false;
          isShowLocked.value = true;
          await wait(5000);
          isShowLocked.value = false;
        }
        isLoadingButton.value = false;
      }
    }
  }
}
const loginSSO = async () => {
  try {
    const response: any = await loginService.loginSSO();
    window.location.href = response.data;
    console.log(response);
  } catch (error) {
    console.error('Login SSO Gagal : ', error);
  }
}

onMounted(() => {
  generateCaptcha();
  initFlowbite();
  const hasRefreshed = sessionStorage.getItem('hasRefreshed');
  if (!hasRefreshed) {
    sessionStorage.setItem('hasRefreshed', 'true');
    window.location.reload(true);
  } else {
    sessionStorage.removeItem('hasRefreshed');
  }
});
onUnmounted(() => {
  sessionStorage.clear();
})
</script>

<style lang="scss" scoped></style>