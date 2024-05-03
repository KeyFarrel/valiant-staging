<template>
  <input type="text" name="" class="w-full text-sm rounded-lg h-10 text-gray-500 border-gray-300" @input="emit('onInput')"
    v-model="model" required>
</template>

<script setup lang="ts">
const model = defineModel();
const emit = defineEmits(['onInput'])

// const onInput = (event: Event) => {
//   const inputValue = (event.target as HTMLInputElement).value;
//   model.value = inputValue.replace(/[^0-9\-\,\.\s]/g, '');
// };
</script>

<style scoped></style>
