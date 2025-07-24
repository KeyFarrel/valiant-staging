<template>
  <div class="flex flex-col items-center justify-center h-screen -mt-24 -ml-5 space-y-3 overflow-hidden">
    <Vue3Lottie :animationData="Error404Json" :width="250" :height="250" />
    <p class="font-bold text-center text-xxxl">404</p>
    <p class="text-lg font-semibold text-center">Halaman Tidak Ditemukan</p>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie';
import Error404Json from '@/assets/lottie/404.json'
</script>