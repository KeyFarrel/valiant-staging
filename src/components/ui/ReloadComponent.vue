<template>
  <div class="flex flex-col items-center justify-center w-full space-y-3">
    <Vue3Lottie :animationData="errorLottie" :width="150" :height="150" />
    <div class="flex flex-col items-center justify-center space-y-1">
      <p class="text-lg font-semibold text-primaryTextColor">Gagal Memuat Data</p>
      <p class="text-base text-primaryTextColor">Silahkan coba lagi</p>
    </div>
    <button @click="emit('onClick')"
      class="px-3 py-2 text-sm font-semibold duration-300 bg-white border rounded-full active:ring-warningColor active:ring-opacity-50 text-warningColor hover:text-white hover:bg-warningColor border-warningColor active:ring active:duration-0">Coba
      Lagi</button>
  </div>
</template>

<script setup lang="ts">
import errorLottie from '@/assets/lottie/error.json';

const emit = defineEmits(['onClick']);
</script>