<template>
  <input type="text" name="" class="w-full h-[38px] text-sm text-gray-500 border-gray-300 rounded-lg"
    @input="emit('onInput')" v-model="model" required>
</template>

<script setup lang="ts">
const model = defineModel();
const emit = defineEmits(['onInput'])
</script>

<style scoped></style>
