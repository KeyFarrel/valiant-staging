<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: boolean): void;
}>();
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center z-50"
    content-class="flex flex-col w-3/6 whitespace-nowrap overflow-auto scrollbar-hide h-4/6 mx-4 p-4 bg-white border rounded-lg space-y-2"
  >
    <slot />
  </VueFinalModal>
</template>

<style>
/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>