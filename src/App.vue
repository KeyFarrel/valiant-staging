<template>
  <RouterView />
  <ModalWrapper width="w-80" height="h-auto" :show-modal="store.isOnline === false">
    <div class="flex flex-col space-y-1.5">
      <Vue3Lottie :animationData="NoConnectionLottie" :width="200" :height="200" />
      <p class="text-xl font-semibold text-center text-textDisabledColor">Ooops!</p>
      <p class="text-center text-textFieldColor">Koneksi terputus. Pastikan perangkat terhubung ke internet</p>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { RouterView } from 'vue-router';
import { useConnectionStatusStore } from './store/storeGlobal';
import { useIdle } from '@vueuse/core'
const { idle, lastActive } = useIdle(10 * 60 * 1000); // 10 menit, ini dalam Milisecond
import ModalWrapper from './components/ui/ModalWrapper.vue';
import NoConnectionLottie from '@/assets/lottie/no-connection.json';
import AuthService from './services/auth-service';
const authService = new AuthService();

const nodeMode: any = import.meta.env.MODE;
const store = useConnectionStatusStore();
watch(idle, (isTimeout) => {
  if (isTimeout) {
    if (nodeMode === 'production') {
      authService.logout();
    }
  }
});
</script>