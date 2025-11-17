<template>
  <Loading v-if="isLoadingSpinner" />
  <ModalWrapper :show-modal="isShowPrivacyPolicy" :width="'w-[850px]'" :height="'h-[550px]'">
    <PrivacyPolicy @on-accept="onAcceptPrivacy" @on-decline="onDeclinePrivacy" />
  </ModalWrapper>
  <ModalWrapper :show-modal="isModalOtpShow" :width="'w-[560px]'" :height="'h-auto'">
    <div class="flex flex-col items-center space-y-5">
      <button @click="closeModalOtp" class="self-end ">
        <IconClose />
      </button>
      <IconSendOTP />
      <div class="flex flex-col items-center space-y-1.5">
        <p class="text-lg font-semibold text-primaryTextColor">Verifikasi OTP</p>
        <p class="text-sm leading-6 text-center text-textDisabledColor">Kode OTP telah dikirim! <br> Masukkan kode 8
          digit untuk
          melanjutkan <br> </p>
        <p class="text-primaryColor" v-if="expiredOtpTimer > 0">
          <span class="text-textDisabledColor">
            OTP kadaluarsa dalam
          </span>
          {{ timeFormatOtp.formatTime(expiredOtpTimer) }}
        </p>
        <p class="text-textDisabledColor" v-else-if="expiredOtpTimer <= 0">OTP anda sudah kadaluarsa
          <button class="text-sm text-primaryColor" @click="resetEmailOtp">
            Kirim ulang
          </button>
        </p>
      </div>
      <div class="space-x-3">
        <input v-for="(itemData, itemIndex) in otp" :index="itemIndex" type="text"
          class="w-10 h-12 border text-center border-[#E0E0E0] rounded-lg p-3 text-sm" maxlength="1" ref="otpRefs"
          @input="handleInput(itemIndex, $event)" @keydown="handleKeyDown(itemIndex, $event)"
          v-model="otp[itemIndex]" />
      </div>
      <div>
        <p class="text-sm text-textDisabledColor">Belum menerima kode? <span v-if="resetOtpTimer > 0">Kirim ulang
            dalam <span class="text-primaryColor">
              {{ timeFormatOtp.formatTime(resetOtpTimer) }} </span> detik</span>
          <button v-else-if="resetOtpTimer <= 0" @click="resetEmailOtp" class="text-sm text-primaryColor">
            Kirim ulang
          </button>
        </p>
      </div>
    </div>
  </ModalWrapper>
  <ModalWrapper :show-modal="isShowCaptchaModal" :width="'w-auto'" :height="'h-auto'">
    <div class="flex flex-col space-y-5">
      <div class="flex justify-between">
        <p class="font-bold tracking-wide text-gray-700 text-md">Verifikasi Captcha</p>
        <button type="button" @click="closeCaptchaModal">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 16.5L16.5 1.5M1.5 1.5L16.5 16.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <gocaptcha-slide :config="captchaConfig" :data="captchaData" :events="eventCaptcha" ref="domRef" />
    </div>
  </ModalWrapper>
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
          Silahkan ganti password Anda
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
        <button @click="closeChangePasswordModal">
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
              placeholder="Masukkan password lama anda" @on-input="sanitizeOldPassword" class="pr-10 text-sm"
              v-model="formCp.oldP" />
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
          <div class="flex flex-col">
            <div class="relative flex flex-col space-y-1">
              <label for="newPassword" class="text-sm font-medium text-labelColor">Password Baru <span
                  class="text-warningColor">*</span></label>
              <TextField @on-input="sanitizeNewPassword(); verifyRequirementPassword()" id="newPassword"
                :type="showNewPassword ? 'text' : 'password'" placeholder="Masukkan password baru anda"
                class="pr-10 text-sm" v-model="formCp.newP" />
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
            <p class="mt-1 text-xs text-warningColor" v-if="hasIllegalSpace">Password tidak boleh mengandung spasi
              diawal atau diakhir</p>
          </div>
          <div class="relative flex flex-col space-y-1">
            <label for="confirmNewPassword" class="text-sm font-medium text-labelColor">Konfirmasi Password Baru <span
                class="text-warningColor">*</span><span v-if="!isPasswordMatched && formCp.confirmNewP"
                class="ml-1.5 text-sm text-warningColor">Password Tidak Sesuai</span></label>
            <TextField @on-input="sanitizeConfirmNewPassword(); verifyMatchPassword()" id="confirmNewPassword"
              :type="showConfirmNewPassword ? 'text' : 'password'" placeholder="Masukkan konfirmasi password baru anda"
              class="pr-10 text-sm" v-model="formCp.confirmNewP" />
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
            <!-- Critical logo preloaded -->
            <img src="../assets/img/LogoPLN.png" class="w-26" alt="logo-pln" fetchpriority="high" />
          </div>
          <!-- Item 1 - First carousel image preloaded -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel-1.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="Carousel slide 1" fetchpriority="high" />
          </div>
          <!-- Item 2 - Lazy loaded -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel-2.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              loading="lazy" decoding="async" alt="Carousel slide 2" />
          </div>
          <!-- Item 3 - Lazy loaded -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel-3.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              loading="lazy" decoding="async" alt="Carousel slide 3" />
          </div>
          <!-- Item 4 - Lazy loaded -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel-4.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              loading="lazy" decoding="async" alt="Carousel slide 4" />
          </div>
          <!-- Item 5 - Lazy loaded -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel-5.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              loading="lazy" decoding="async" alt="Carousel slide 5" />
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
        <div class="mb-3">
          <label for="emailAddress" class="text-xs text-[#5979A6] mb-1">Email</label>
          <input v-model="valEmail" id="emailAddress" type="email" autocomplete="email"
            class="block bg-white p-3 w-[350px] text-xs text-gray-900 rounded-md border border-gray-300 focus:ring-[#0099AD] focus:border-[#0099AD]"
            placeholder="Masukkan email anda" />
          <p class="mt-1 text-xs text-red-500">{{ valEmailErr }}</p>
        </div>
        <div class="mb-3">
          <label for="password1" class="text-xs text-[#5979A6] mb-1">Password</label>
          <div class="relative">
            <input v-model="valPassword"
              class="block bg-white p-3 w-[350px] text-xs text-gray-900 rounded-md border border-gray-300 focus:ring-[#0099AD] focus:border-[#0099AD]"
              :type="showPassword ? 'text' : 'password'" id="password1" placeholder="Masukkan kata sandi"
              @keyup.enter="onClickLogin" @copy.prevent @paste.prevent @cut.prevent />
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
          <p class="mt-1 text-xs text-red-500">{{ valKataSandiErr }}</p>
        </div>
        <button @click="onClickLogin" type="button"
          class="text-white uppercase  bg-[#0099AD] w-[350px] hover:bg-[#0099AD] hover:text-white active:ring active:ring-[#005A66] rounded-lg text-xs p-3 my-3 focus:outline-none"
          v-if="valEmail && valPassword">
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
          class="text-primaryTextColor uppercase  bg-slate-300 w-[350px] cursor-not-allowed focus:ring-4 focus:ring-slate-700 rounded-lg text-xs p-3 my-3 focus:outline-none"
          v-else disabled>
          <p class="font-medium">Masuk Ke Aplikasi</p>
        </button>
        <div class="flex flex-row items-center justify-center mb-4 space-x-3">
          <div class="w-16 h-[1px] bg-slate-300"></div>
          <p class="mr-1 text-xs text-center">atau masuk dengan</p>
          <div class="w-16 h-[1px] bg-slate-300"></div>
        </div>
        <button type="button" @click="loginSSO"
          class="text-[#0099AD] duration-300 bg-white w-[350px] hover:bg-blue-100 border border-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-xs p-3 text-center mr-2">
          LOGIN SSO
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, nextTick, reactive } from "vue";
import { initFlowbite } from "flowbite";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import { notifyError, notifySuccess } from "@/services/helper/toast-notification";
import TimeFormatOtp from '../services/format/time-format-otp';
const timeFormatOtp = new TimeFormatOtp();
import AuthService from "@/services/auth-service";
const authService = new AuthService();
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import TextField from "@/components/ui/TextField.vue";
import IconRoundedChecked from "@/components/icons/IconRoundedChecked.vue";
import IconRoundedClose from "@/components/icons/IconRoundedClose.vue";
import IconClose from "@/components/icons/IconClose.vue";
import IconSendOTP from "@/components/icons/IconSendOTP.vue";
import ModalNotification from "@/components/ui/ModalNotification.vue";
import errorJsonData from '@/assets/lottie/error.json';
import LottieInfo from "@/assets/lottie/info.json";
import Loading from "@/components/ui/LoadingSpinner.vue";
import LottieSuccess from "@/assets/lottie/success.json";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import PrivacyPolicy from "@/components/ui/PrivacyPolicy.vue";

const fpPromise = FingerprintJS.load()
const getFingerprint = async () => {
  const fp = await fpPromise
  const result = await fp.get()
  console.log(result);
  return result.visitorId;
};

const nodeMode = import.meta.env.MODE;
const router = useRouter();
const isLoadingButton = ref<boolean>(false);
const isLoadingSpinner = ref<boolean>(false);
const isModalOtpShow = ref<boolean>(false);
const valEmail = ref<string>("");
const valPassword = ref<string>("");
const valEmailErr = ref<string>("");
const valKataSandiErr = ref<string>("");
const showPassword = ref<boolean>(false);
const expiredOtpTimer = ref<number>(300); // 5 menit dalam detik
const resetOtpTimer = ref<number>(60); // 1 menit dalam detik
let expiredOtpInterval = null;
let resetOtpInterval = null;
const otp = ref(Array(8).fill(null));
const otpRefs = ref([])
const isShowCounter = ref<boolean>(false);
const remainingAttempt = ref<number>(0);
const isShowLocked = ref<boolean>(false);
const showOldPassword = ref<boolean>(false);
const isModalChangePasswordShow = ref<boolean>(false);
const showConfirmNewPassword = ref<boolean>(false);
const showNewPassword = ref<boolean>(false);
const formCp = reactive({
  oldP: '',
  newP: '',
  confirmNewP: ''
})
const hasIllegalSpace = ref<boolean>(false);
const hasMinLength = ref<boolean>(false);
const hasUppercase = ref<boolean>(false);
const hasNumber = ref<boolean>(false);
const hasSymbol = ref<boolean>(false);
const hasLowercase = ref<boolean>(false);
const isPasswordMatched = ref<boolean>(false);
const isNewPasswordSameAsOld = ref<boolean>(false);
const isShowCompletePassword = ref<boolean>(false);
const isShowPrivacyPolicy = ref<boolean>(false);
const isOldPasswordWrong = ref<boolean>(false);
const isChangePasswordSuccess = ref<boolean>(false);
const debuggingFingerprint = ref<any>("");
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
const isCaptchaVerified = ref<boolean>(false);
const isShowCaptchaModal = ref<boolean>(false);
const captchaKey = ref<string>('');
const captchaConfig = ref<any>({
  showTheme: true,
  title: "Geser untuk verifikasi",
  iconSize: 0,
  scope: true
});
const captchaData = ref<any>({
  thumbX: 0,
  thumbY: 0,
  thumbWidth: 0,
  thumbHeight: 0,
  image: "",
  thumb: "",
});

// Event Handling
const eventCaptcha: Partial<{
  move: (x: number, y: number) => void;
  refresh: () => void;
  close: () => void;
  confirm: any;
}> = {
  move: (x, y) => {
    console.log(`Mouse bergerak ke posisi: X=${x}, Y=${y}`);
  },
  refresh: () => {
    console.log("Captcha di-refresh");
    domRef.value?.clear()
  },
  close: () => {
    console.log("Captcha ditutup");
  },
  confirm: (point, reset) => {
    onCaptchaVerified(point.x);
  },
};


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

const domRef = ref<any>();
const visiblePassword = () => {
  showPassword.value = !showPassword.value;
}

const sanitizeOldPassword = () => {
  formCp.oldP = formCp.oldP
    .replace(/['"\\`\0\n\r\t]/g, '')
    .replace(/\s{2,}/g, ' ')
}

const sanitizeNewPassword = () => {
  formCp.newP = formCp.newP
    .replace(/['"\\`\0\n\r\t]/g, '')
    .replace(/\s{2,}/g, ' ')
}

const sanitizeConfirmNewPassword = () => {
  formCp.confirmNewP = formCp.confirmNewP
    .replace(/['"\\`\0\n\r\t]/g, '')
    .replace(/\s{2,}/g, ' ')
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const verifyRequirementPassword = () => {
  const password = formCp.newP
  hasMinLength.value = password.length >= 8;
  hasNumber.value = /\d/.test(password)
  hasUppercase.value = /[A-Z]/.test(password);
  hasLowercase.value = /[a-z]/.test(password)
  hasSymbol.value = /[\p{P}\p{S}]/u.test(password);
  isNewPasswordSameAsOld.value = formCp.newP === formCp.oldP
  verifyMatchPassword();
}

const verifyMatchPassword = () => {
  if (formCp.newP !== formCp.confirmNewP) {
    isPasswordMatched.value = false
    console.log("Password tidak sama");
  } else {
    isPasswordMatched.value = true;
    console.log("Password sama")
  }
};
const resetInputAndAttribute = () => {
  formCp.oldP = ""
  formCp.newP = "";
  formCp.confirmNewP = ""
  hasMinLength.value = false;
  hasNumber.value = false
  hasUppercase.value = false;
  hasLowercase.value = false
  hasSymbol.value = false
  isNewPasswordSameAsOld.value = false;
  isPasswordMatched.value = false
  showOldPassword.value = false;
  showNewPassword.value = false
  showConfirmNewPassword.value = false;
};

const handleClickChangePassword = async () => {
  await fetchDataProfile();
  isShowCompletePassword.value = false;
  isModalChangePasswordShow.value = true;
}

const closeModalOtp = () => {
  isModalOtpShow.value = false
  otp.value = Array(8).fill(null);
  clearInterval(expiredOtpInterval);
  clearInterval(resetOtpInterval);
  expiredOtpTimer.value = 300;
  resetOtpTimer.value = 60;
}

const closeChangePasswordModal = () => {
  isModalChangePasswordShow.value = false;
  resetInputAndAttribute();
  hasIllegalSpace.value = false;
}

const clickDebugFingerprint = async () => {
  const fingerprintID = await getFingerprint();
  debuggingFingerprint.value = fingerprintID;
}

const onClickLogin = () => {
  isShowCaptchaModal.value = true;
}

const closeCaptchaModal = () => {
  isShowCaptchaModal.value = false;
}

const loginSSO = async () => {
  try {
    const response: any = await authService.loginSSO();
    window.location.href = response.data;
    console.log(response);
  } catch (error) {
    console.error('Login SSO Gagal : ', error);
  }
}

const generateCaptcha = async () => {
  try {
    const response: any = await authService.generateCaptcha();
    captchaKey.value = response.captcha_key
    captchaData.value.thumbY = response.tile_y;
    captchaData.value.thumbWidth = response.tile_width;
    captchaData.value.thumbHeight = response.tile_height;
    captchaData.value.image = response.image_base64;
    captchaData.value.thumb = response.tile_base64;
  } catch (error: any) {
    if (import.meta.env.MODE === 'development') {
      console.error('Error Generate Captcha : ', error);
    }
    if (error?.message === 'Network Error') {
      notifyError('Tidak dapat memuat captcha. Silakan coba lagi nanti.', 3000);
      setTimeout(generateCaptcha, 5000);
    } else {
      notifyError('Terjadi kesalahan saat memuat captcha.', 3000);
    }
  }
}

const startTimers = () => {
  expiredOtpInterval = setInterval(() => {
    if (expiredOtpTimer.value > 0) {
      expiredOtpTimer.value--;
    } else {
      clearInterval(expiredOtpInterval);
    }
  }, 1000);

  resetOtpInterval = setInterval(() => {
    if (resetOtpTimer.value > 0) {
      resetOtpTimer.value--;
    } else {
      clearInterval(resetOtpInterval);
    }
  }, 1000);
};

const handleInput = (index, event) => {
  let value = event.target.value.replace(/\D/g, '');
  if (value) {
    otp.value[index] = value;
    nextTick(() => {
      if (index < otp.value.length - 1) {
        otpRefs.value[index + 1]?.focus();
      }
    });
  } else {
    otp.value[index] = null;
  }
  if (otp.value.every(digit => digit !== null)) {
    verifyEmailOtp();
  }
};

const handleKeyDown = (index, event) => {
  if (!/\d/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab') {
    event.preventDefault();
  }

  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    nextTick(() => {
      otpRefs.value[index - 1]?.focus();
    });
  }
};

const resetEmailOtp = async () => {
  try {
    isLoadingSpinner.value = true;
    const response: any = await authService.resendDeviceOtp(valEmail.value);
    if (response.code === 200) {
      notifySuccess("OTP berhasil dikirimkan, mohon periksa email anda!", 7000);
      clearInterval(expiredOtpInterval);
      clearInterval(resetOtpInterval);
      expiredOtpTimer.value = 300;
      resetOtpTimer.value = 60;
      startTimers();
    }
  } catch (error) {
    console.error("Error reset OTP:", error);
  } finally {
    isLoadingSpinner.value = false;
  }
};

const fetchDataProfile = async () => {
  try {
    isLoadingSpinner.value = true;
    const response: DataItem = await authService.preProfile()
    userData.value = response.data;
    isLoadingSpinner.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
    isLoadingSpinner.value = false;
  }
};

const verifyEmailOtp = async () => {
  try {
    isLoadingSpinner.value = true;
    const formattedOtp = otp.value.join("");

    let responseVerifyOtp
    try {
      responseVerifyOtp = await authService.verifyDeviceOtp(valEmail.value, formattedOtp);
      if (responseVerifyOtp.code !== 200) {
        throw new Error('Failed to verify OTP');
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      notifyError(`Gagal verifikasi OTP! ${error.response.data.message}`, 5000);
      return;
    }

    let param;

    param = {
      email: valEmail.value,
      password: valPassword.value,
    };

    try {
      const responseLogin: any = await authService.login(param);
      if (responseLogin.message === 'Anda terdeteksi menggunakan device baru, silahkan lakukan verifikasi OTP') {
        notifyError(responseLogin.message, 7000);
        isShowCounter.value = false;
        isModalOtpShow.value = true;
        isLoadingButton.value = false;
      } else if (responseLogin.data.is_reset) {
        if (responseLogin.message === 'Password anda sudah expired, silahkan ganti password') {
          notifyError("Password anda sudah expired, silahkan ganti password", 7000);
        } else if (responseLogin.message === 'Password anda sudah direset sebelumnya, silahkan ganti password anda') {
          notifyError("Password anda sudah direset sebelumnya, silahkan ganti password anda", 7000);
        }
        isShowCounter.value = false;
        isShowCompletePassword.value = true;
        isLoadingButton.value = false;
      } else {
        console.log("Masuk else")
        setTimeout(() => {
          router.push({ name: "peta" });
        }, 500);
      }
      isLoadingSpinner.value = false;
      isModalOtpShow.value = false;
      otp.value = Array(8).fill(null);
      resetInputAndAttribute();
      clearInterval(expiredOtpInterval);
      clearInterval(resetOtpInterval);
      expiredOtpTimer.value = 300;
      resetOtpTimer.value = 60;
    } catch (error) {
      isModalOtpShow.value = false;
      console.error("Error during login:", error);
      return;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    notifyError("Unexpected error occurred", 5000);
  } finally {
    isLoadingSpinner.value = false;
  }
};

const changePassword = async () => {
  const encryptStorage = await encryptStoragePromise;
  if (!isPasswordMatched.value || !hasMinLength.value || !hasNumber.value || !hasUppercase.value || !hasLowercase.value || !hasSymbol.value) {
    notifyError("Password tidak memenuhi persyaratan, mohon lengkapi persyaratan tersebut!", 7000)
  } else if (isNewPasswordSameAsOld.value) {
    notifyError("Password baru tidak boleh sama dengan password lama yang anda masukkan!", 7000)
  } else if (/(^\s|\s$)/.test(formCp.newP)) {
    hasIllegalSpace.value = true;
  } else {
    try {
      isLoadingSpinner.value = true;
      await authService.changePrePassword(formCp.oldP, formCp.newP, "this-is-reset")
      isOldPasswordWrong.value = false;
      isLoadingSpinner.value = false;
      resetInputAndAttribute();
      isModalChangePasswordShow.value = false;
      isChangePasswordSuccess.value = true;
      await wait(5000);
      isChangePasswordSuccess.value = false;
      nodeMode === 'production' ? encryptStorage.clear() : localStorage.clear();
    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error.response.data.message === 'Password Lama tidak sesuai') {
        isOldPasswordWrong.value = true;
        notifyError("Password lama anda salah, mohon periksa kembali password lama anda!", 7000);
      }
      if (error.response.data.message === 'password tidak boleh sama dengan 15 password terakhir') {
        notifyError("Password baru tidak boleh sama dengan 15 password terakhir yang pernah anda gunakan!", 7000);
      }
      if (error.response.data.message === 'password anda terlalu umum dan banyak digunakan, mohon mencoba password lainnya') {
        notifyError("Password baru anda terlalu umum dan banyak digunakan, mohon mencoba password lainnya!", 7000);
      }
      isLoadingSpinner.value = false;
    } finally {
      hasIllegalSpace.value = false;
    }
  }
};

const onCaptchaVerified = async (tileX: number) => {
  isLoadingSpinner.value = true;
  isCaptchaVerified.value = true;
  if (isLoadingButton.value) return;
  const maxAttempt = 5;
  if (valEmail.value === "") {
    valEmailErr.value = "Email kosong mohon diisi";
  } else if (valPassword.value === "") {
    valKataSandiErr.value = "Kata sandi kosong mohon diisi";
    valEmailErr.value = "";
  } else if (isCaptchaVerified.value) {
    isLoadingButton.value = true;
    valEmailErr.value = "";
    valKataSandiErr.value = "";
    let param;
    valEmail.value = valEmail.value.replace(/\s+/g, '');

    param = {
      email: valEmail.value,
      password: valPassword.value,
      captcha_key: captchaKey.value,
      tile_x: tileX
    };

    try {
      const response: any = await authService.login(param);
      isShowCaptchaModal.value = false;
      if (response.message === 'Anda terdeteksi menggunakan device baru, silahkan lakukan verifikasi OTP') {
        notifyError(response.message, 7000);
        isShowCounter.value = false;
        isModalOtpShow.value = true;
        isLoadingButton.value = false;
        startTimers();
      } else if (response.data.is_reset) {
        if (response.message === 'Password anda sudah expired, silahkan ganti password') {
          notifyError("Password anda sudah expired, silahkan ganti password", 7000);
        } else if (response.message === 'Password anda sudah direset sebelumnya, silahkan ganti password anda') {
          notifyError("Password anda sudah direset sebelumnya, silahkan ganti password anda", 7000);
        }
        isShowCounter.value = false;
        isShowCompletePassword.value = true;
        isLoadingButton.value = false;
      } else {
        console.log("Masuk else")
        setTimeout(() => {
          router.push({ name: "peta" });
        }, 500);
      }
    } catch (error: any) {
      console.error("Error: ", error)
      if (error.response.data.message === `validation failed: Key: 'RequestAuth.Email' Error:Field validation for 'Email' failed on the 'email' tag`) {
        notifyError("Format email tidak valid, mohon periksa kembali email anda", 5000);
        isShowCaptchaModal.value = false;
      } else if (error.response.data.message === 'Captcha verification failed') {
        notifyError("Verifikasi captcha gagal, mohon coba lagi", 5000);
        generateCaptcha();
      } else {
        notifyError(error.response.data.message, 5000);
        isShowCaptchaModal.value = false;
      }
      isLoadingButton.value = false;
      if (error.response.data && error.response.data.data && error.response.data.data.temp_loc && error.response.data.data.temp_loc !== 0) {
        isShowCounter.value = true;
        remainingAttempt.value = maxAttempt - error.response.data.data.temp_loc;
      } else if (error.response.data.message && error.response.data.message === 'Anda belum mengisi privacy policy') {
        isShowPrivacyPolicy.value = true;
      }
      if (error.response.data.message === "User / Password tidak sesuai") {
        valEmailErr.value = "Email atau Kata Sandi salah";
        valKataSandiErr.value = "Email atau Kata Sandi salah";
      }
      if (error.response.data.data.is_locked) {
        isLoadingSpinner.value = false;
        isShowCounter.value = false;
        isShowLocked.value = true;
        await wait(5000);
        isShowLocked.value = false;
      }
    } finally {
      domRef.value?.clear();
      isLoadingSpinner.value = false;
    }
  }
}

const onAcceptPrivacy = async () => {
  try {
    isLoadingSpinner.value = true;
    await authService.privacyPolicy(true);
    const param = {
      email: valEmail.value,
      password: valPassword.value,
    };
    await authService.login(param);
    sessionStorage.clear();
    router.push({ name: "peta" });
  } catch (error) {
    console.error("Error Accept Privacy Policy:", error);
    notifyError("Gagal menyetujui kebijakan privasi, mohon coba lagi", 5000);
  } finally {
    isLoadingSpinner.value = false;
    isShowPrivacyPolicy.value = false;
  }
}

const onDeclinePrivacy = async () => {
  try {
    isLoadingSpinner.value = true;
    await authService.privacyPolicy(false);
    sessionStorage.clear();
    notifyError("Anda tidak dapat menggunakan aplikasi ini sebelum menyetujui kebijakan privasi", 7000);
  } catch (error) {
    console.error("Error Decline Privacy Policy:", error);
    notifyError("Gagal menolak kebijakan privasi, mohon coba lagi", 5000);
  } finally {
    isLoadingSpinner.value = false;
    isShowPrivacyPolicy.value = false;
  }
}

onMounted(async () => {
  initFlowbite();
  generateCaptcha();
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
  clearInterval(expiredOtpInterval);
  clearInterval(resetOtpInterval);
})
</script>