<template>
  <div class="flex flex-col justify-center items-center h-screen space-y-3 overflow-hidden -mt-24 -ml-5">
    <Vue3Lottie :animationData="Error404Json" :width="250" :height="250" />
    <p class="text-xxxl font-bold text-center">404</p>
    <p class="text-lg font-semibold text-center">Halaman Tidak Ditemukan</p>
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie';
import Error404Json from '@/assets/lottie/404.json'
import ServerMaintenance from '@/assets/lottie/server-maintenance.json'
</script>

<style scoped></style>