<template>
  <ModalWrapper :showModal="props.showModal" :width="'w-80'" :height="'h-auto'">
    <div class="flex flex-col items-center">
      <Vue3Lottie :animationData="props.animationData" :width="200" :height="200" :loop="false" :speed="0.8" />
      <h1 class="mb-3 text-lg font-semibold text-center text-gray-700">
        {{ props.title }}
      </h1>
      <p class="text-sm text-center text-textDisabledColor">
        {{ props.subtitle }}
      </p>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import ModalWrapper from './ModalWrapper.vue';

const props = defineProps<Props>();

interface Props {
  title: string
  subtitle: string
  showModal: boolean
  animationData: any
}
</script>

<style scoped></style>