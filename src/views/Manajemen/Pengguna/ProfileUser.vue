<template>
  <Loading v-if="isLoading" />
  <ModalNotification :show-modal="isSuccess" :animation-data="successJson" :title="'Berhasil Mengganti Password'"
    :subtitle="'Password berhasil diubah! anda akan diarahkan untuk login kembali'" />
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
          {{ data.nama_pegawai.split('')[0] }}
        </div>
        <div class="flex flex-col space-y-1">
          <p class="text-base font-medium text-primaryTextColor">{{ data.nama_pegawai }}</p>
          <p class="text-sm text-textDisabledColor">{{ data.email }}</p>
          <Chips :title="'Role'" :content="userAuthStore.roleName" class="w-fit" />
        </div>
      </div>
      <div class="flex w-full space-x-5">
        <div class="flex flex-col space-y-5 w-[60%]">
          <div class="relative flex flex-col space-y-1">
            <label for="oldPassword" class="text-sm font-medium text-labelColor">Password Lama <span
                class="text-warningColor">*</span>
              <span v-if="isOldPasswordWrong" class="text-sm text-warningColor">Password Lama Salah</span>
            </label>
            <TextField id="oldPassword" :type="showOldPassword ? 'text' : 'password'" @on-copy="preventCopyPaste"
              @on-paste="preventCopyPaste" @on-input="sanitizeOldPassword" placeholder="Masukkan password lama anda"
              class="pr-10 text-sm" v-model="formCp.oldP" />
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
              <TextField @on-input="sanitizeNewPassword(); verifyRequirementPassword()" @on-copy="preventCopyPaste"
                @on-paste="preventCopyPaste" id="newPassword" :type="showNewPassword ? 'text' : 'password'"
                placeholder="Masukkan password baru anda" class="pr-10 text-sm" v-model="formCp.newP" />
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
            <TextField @on-input="sanitizeConfirmNewPassword(); verifyMatchPassword()" @on-copy="preventCopyPaste"
              @on-paste="preventCopyPaste" id="confirmNewPassword" :type="showConfirmNewPassword ? 'text' : 'password'"
              placeholder="Masukkan konfirmasi password baru anda" class="pr-10 text-sm" v-model="formCp.confirmNewP" />
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
          class="w-10 h-12 border text-center bg-white border-[#E0E0E0] rounded-lg p-3 text-sm" maxlength="1"
          ref="otpRefs" @input="handleInput(itemIndex, $event)" @keydown="handleKeyDown(itemIndex, $event)"
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
  <div class="flex flex-row items-center justify-center h-screen -mt-24 space-x-12">
    <div
      class="bg-white rounded-lg w-full max-w-[32%] items-center h-[60%] top-12 max-h-[600px] px-10 py-5 flex flex-col space-y-5">
      <div class="flex flex-col items-center space-y-3.5">
        <div
          class="w-[150px] items-center flex flex-col font-semibold justify-center h-[150px] bg-warningColor rounded-full text-[42px] text-white uppercase">
          {{ data.nama_pegawai.split('')[0] }}
        </div>
        <div class="flex flex-col items-center space-y-1">
          <p class="text-base font-semibold">{{ data.nama_pegawai }}</p>
          <p class="text-[#4791F2]">{{ data.email }}</p>
        </div>
      </div>
      <hr class="w-full">
      <div class="flex flex-col justify-between w-full h-full">
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-sm font-semibold text-labelColor">Level</p>
          <p class="text-sm">{{ userAuthStore.levelName }}</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-sm font-semibold text-labelColor">Role</p>
          <div
            class="w-fit px-1.5 py-1 flex items-center justify-center text-xs font-semibold bg-[#F7FBFC] border border-primaryColor rounded-full text-primaryColor">
            {{ userAuthStore.roleName }}
          </div>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-sm font-semibold text-labelColor">Status</p>
          <div
            class="w-fit px-1.5 py-1 flex items-center justify-center font-semibold text-xs bg-[#EDF7F2] border border-[#C7E5D7] rounded-full text-[#397E5D]"
            v-if="data.status">
            Aktif
          </div>
          <div v-else-if="!data.status"
            class="w-fit px-1.5 py-1 flex items-center justify-center font-semibold text-xs bg-[#FAEBEA] border border-[#EFC0BD] rounded-full text-[#C53830]">
            Tidak Aktif
          </div>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-sm font-semibold text-labelColor">Aktif Sejak</p>
          <p class="text-sm">{{ activeDate }}</p>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg w-full max-w-[52%] top-12 h-[60%] max-h-[600px] p-5 space-y-5 flex flex-col">
      <div class="space-y-3.5">
        <div class="flex items-center justify-between">
          <p class="text-base font-semibold">Data Pribadi</p>
          <button @click="isModalChangePasswordShow = true"
            class="flex items-center space-x-1.5 border border-primaryColor rounded-lg px-3 py-2 hover:bg-primaryColor duration-300 hover:text-white text-primaryColor active:ring active:duration-0 active:ring-primaryColor active:ring-opacity-50">
            <IconEdit />
            <p class="text-sm font-semibold">Ganti Password</p>
          </button>
        </div>
        <hr>
      </div>
      <div class="flex flex-col justify-between w-full h-full">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Nama Pengguna</p>
          <p class="text-xs">{{ data.nama_pegawai }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">NIP</p>
          <p class="text-xs">{{ data.nip }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Email Pengguna</p>
          <p class="text-xs">{{ data.email }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Unit Pengelola</p>
          <p class="text-xs">{{ data.pengelola === '' ? '-' : data.pengelola }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Unit Pembina</p>
          <p class="text-xs">{{ data.pembina === '' ? '-' : data.pembina }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Unit Sentral</p>
          <p class="text-xs">{{ data.sentral === '' ? '-' : data.sentral }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, reactive } from "vue";
import { notifyError } from "@/services/helper/toast-notification";
import { notifySuccess } from '../../../services/helper/toast-notification';
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import { useSessionStore } from "@/store/storeSession";
const sessionStore = useSessionStore();
import { useUserAuthStore } from "@/store/storeUserAuth";
const userAuthStore = useUserAuthStore();
import router from "@/router";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import ModalNotification from "@/components/ui/ModalNotification.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import IconRoundedChecked from "@/components/icons/IconRoundedChecked.vue";
import IconRoundedClose from "@/components/icons/IconRoundedClose.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import Chips from "@/components/ui/Chips.vue";
import TextField from "@/components/ui/TextField.vue";
import IconClose from "@/components/icons/IconClose.vue";
import IconSendOTP from "@/components/icons/IconSendOTP.vue";
import successJson from "@/assets/lottie/success.json";
import AuthService from "@/services/auth-service";
const authService = new AuthService();
import UserService from "@/services/user-service";
const userService = new UserService();
import TimeFormatOtp from '../../../services/format/time-format-otp';
const timeFormatOtp = new TimeFormatOtp();

const nodeMode = import.meta.env.MODE;
const isLoading = ref<boolean>(false);
const isModalChangePasswordShow = ref<boolean>(false);
const isModalOtpShow = ref<boolean>(false);
const expiredOtpTimer = ref<number>(300); // 5 menit dalam detik
const resetOtpTimer = ref<number>(60); // 1 menit dalam detik
let expiredOtpInterval = null;
let resetOtpInterval = null;
const otp = ref(Array(8).fill(null))
const otpRefs = ref([]);
const showOldPassword = ref<boolean>(false);
const showNewPassword = ref<boolean>(false);
const showConfirmNewPassword = ref<boolean>(false);
const formCp = reactive({
  oldP: '',
  newP: '',
  confirmNewP: ''
})
const hasMinLength = ref<boolean>(false);
const hasIllegalSpace = ref<boolean>(false);
const hasNumber = ref<boolean>(false);
const hasUppercase = ref<boolean>(false);
const hasLowercase = ref<boolean>(false);
const hasSymbol = ref<boolean>(false);
const isNewPasswordSameAsOld = ref<boolean>(false);
const isPasswordMatched = ref<boolean>(false);
const isSuccess = ref<boolean>(false);
const isOldPasswordWrong = ref<boolean>(false);
const activeDate = ref<any>('');

interface DataItemInterface {
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

const data = ref<DataItemInterface>({
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

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const preventCopyPaste = (event: ClipboardEvent) => {
  event.preventDefault();
};

const calculateTimeAgo = (createdAt: any) => {
  const now: any = new Date();
  const date: any = new Date(createdAt);
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} tahun yang lalu`;
  } else if (months > 0) {
    return `${months} bulan yang lalu`;
  } else if (days > 0) {
    return `${days} hari yang lalu`;
  } else if (hours > 0) {
    return `${hours} jam yang lalu`;
  } else if (minutes > 0) {
    return `${minutes} menit yang lalu`;
  } else {
    return `${seconds} detik yang lalu`;
  }
};

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

const fetchDataProfile = async () => {
  try {
    isLoading.value = true;
    const response: DataItemInterface = await authService.profile();
    data.value = response.data;
    const createdAt = data.value.created_at;
    activeDate.value = calculateTimeAgo(createdAt);
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
    isLoading.value = false;
  }
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

const closeChangePasswordModal = () => {
  isModalChangePasswordShow.value = false;
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

const resetEmailOtp = async () => {
  try {
    isLoading.value = true;
    const response: any = await userService.sendEmailOtp();
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
    isLoading.value = false;
  }
};

const verifyEmailOtp = async () => {
  try {
    isLoading.value = true;
    const encryptStorage = await encryptStoragePromise;
    const formattedOtp = otp.value.join("");

    let responseVerifyOtp
    try {
      responseVerifyOtp = await userService.verifyOtp(formattedOtp);
      if (responseVerifyOtp.code !== 200) {
        throw new Error('Failed to verify OTP');
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return;
    }

    try {
      const responseChangePassword: any = await authService.changePassword(formCp.oldP, formCp.newP, responseVerifyOtp.data.otp_token);
      if (responseChangePassword.code !== 200) {
        throw new Error('Failed to change password');
      }
      isLoading.value = false;
      isModalOtpShow.value = false;
      isOldPasswordWrong.value = false;
      isModalChangePasswordShow.value = false;
      resetInputAndAttribute();
      clearInterval(expiredOtpInterval);
      clearInterval(resetOtpInterval);
      isSuccess.value = true;
      await wait(5000);
      isSuccess.value = false;
      nodeMode === "production" ? encryptStorage.clear() : localStorage.clear();
      sessionStore.invalidateSession();
      router.push("/login");
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response.data.message === 'Password Lama tidak sesuai') {
        isOldPasswordWrong.value = true;
      }
      isModalOtpShow.value = false;
      clearInterval(expiredOtpInterval);
      clearInterval(resetOtpInterval);
      expiredOtpTimer.value = 300;
      resetOtpTimer.value = 60;
      otp.value = Array(8).fill(null);
      return;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  } finally {
    isLoading.value = false;
  }
};

const closeModalOtp = () => {
  isModalOtpShow.value = false
  clearInterval(expiredOtpInterval);
  clearInterval(resetOtpInterval);
  expiredOtpTimer.value = 300;
  resetOtpTimer.value = 60;
}

const verifyRequirementPassword = () => {
  const password = formCp.newP;
  hasMinLength.value = password.length >= 8;
  hasNumber.value = /\d/.test(password);
  hasUppercase.value = /[A-Z]/.test(password);
  hasLowercase.value = /[a-z]/.test(password);
  hasSymbol.value = /[\p{P}\p{S}]/u.test(password);
  isNewPasswordSameAsOld.value = formCp.newP === formCp.oldP;
  verifyMatchPassword();
};

const verifyMatchPassword = () => {
  if (formCp.newP !== formCp.confirmNewP) {
    isPasswordMatched.value = false;
    console.log("Password tidak sama");
  } else {
    isPasswordMatched.value = true;
    console.log("Password sama");
  }
}

const resetInputAndAttribute = () => {
  formCp.oldP = "";
  formCp.newP = "";
  formCp.confirmNewP = "";
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
  } else if (/(^\s|\s$)/.test(formCp.newP)) {
    hasIllegalSpace.value = true;
  } else {
    try {
      isLoading.value = true;
      const response: any = await userService.sendEmailOtp();
      if (response.code === 200) {
        notifySuccess("OTP berhasil dikirimkan, mohon periksa email anda!", 7000);
        startTimers();
        isModalOtpShow.value = true;
      }
    } catch (error: any) {
      console.error("Error send OTP:", error);
    } finally {
      isLoading.value = false;
      hasIllegalSpace.value = false;
    }
  }
};

onMounted(async () => {
  await fetchDataProfile();
});

onUnmounted(() => {
  clearInterval(expiredOtpInterval);
  clearInterval(resetOtpInterval);
});
</script>

<style lang="scss" scoped>
button:hover svg g path {
  transition-duration: 300ms;
  fill: white
}
</style>