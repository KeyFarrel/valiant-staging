<template>
  <div class="flex flex-col items-center" @mouseenter="toggleButton" @mouseleave="toggleButton">
    <IconInfo class="cursor-pointer" />
    <Transition>
      <div v-if="isHover"
        class="flex flex-col bg-white absolute text-xs p-2 bottom-5 z-10 rounded-lg whitespace-nowrap border space-y-1.5 duration-300"
        id="tooltipContent">
        <p class="text-xs">Tahun Awal Pengisian Kertas Kerja</p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IconInfo from '../icons/IconInfo.vue';

const isHover = ref(false);

function toggleButton() {
  isHover.value = !isHover.value
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>