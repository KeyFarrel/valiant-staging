<template>
  <RouterView />
  <ModalWrapper width="w-80" height="h-auto" :show-modal="store.isOnline === false">
    <div class="flex flex-col space-y-1.5">
      <Vue3Lottie :animationData="NoConnectionLottie" :width="200" :height="200" />
      <p class="text-xl font-semibold text-center text-textDisabledColor">Ooops!</p>
      <p class="text-center text-textFieldColor">Koneksi terputus. Pastikan perangkat terhubung ke internet</p>
    </div>
  </ModalWrapper>
  <ModalWrapper width="w-80" height="h-auto" :show-modal="isVaultConnected === false">
    <div class="flex flex-col space-y-1.5">
      <Vue3Lottie :animationData="ServerError" :width="300" :height="300" />
      <p class="text-xl font-semibold text-center text-textDisabledColor">Ooops!</p>
      <p class="text-center text-textFieldColor">Sistem mengalami kegagalan, mohon hubungi <span
          class="font-bold">valiant@pln.co.id</span></p>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router';
import { useConnectionStatusStore } from './store/storeGlobal';
const store = useConnectionStatusStore();
import ModalWrapper from './components/ui/ModalWrapper.vue';
import NoConnectionLottie from '@/assets/lottie/no-connection.json';
import ServerError from '@/assets/lottie/server-error.json';
import AuthService from '@/services/auth-service';
import { notifyError } from '@/services/helper/toast-notification';
const authService = new AuthService();

const isVaultConnected = ref<boolean>(true)
const isShowingNetworkError = ref<boolean>(false)

const checkVaultStatus = async () => {
  try {
    const response: any = await authService.checkStatus();
    isVaultConnected.value = response.vault_status;
    // Reset network error flag if connection is restored
    if (isShowingNetworkError.value) {
      isShowingNetworkError.value = false;
    }
  } catch (error: any) {
    // Hanya log error di development mode
    if (import.meta.env.MODE === 'development') {
      console.error('Gagal mengecek status Vault:', error);
    }
    
    // Safely access nested properties with optional chaining
    isVaultConnected.value = error?.response?.data?.vault_status ?? false;
    
    // Show network error notification if it's a network error and not already showing
    if (error?.message === 'Network Error' && !isShowingNetworkError.value) {
      // Tampilkan notifikasi hanya sekali
      isShowingNetworkError.value = true;
      // Gunakan notifyError dengan timeout yang lebih pendek di production
      const timeout = import.meta.env.MODE === 'development' ? 5000 : 3000;
      notifyError('Tidak dapat terhubung ke server. Pastikan koneksi internet Anda aktif.', timeout);
    }
    
    setTimeout(checkVaultStatus, 5000);
  }
}

onMounted(() => {
  checkVaultStatus()
})
</script>