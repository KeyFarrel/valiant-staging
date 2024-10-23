<template>
  <input type="text" name="" class="w-full h-[38px] text-sm text-gray-500 border-gray-300 rounded-lg"
    @input="emit('onInput')" @copy="$emit('onCopy', $event)" @paste="$emit('onPaste', $event)" v-model="model" required>
</template>

<script setup lang="ts">
const model = defineModel();
const emit = defineEmits(['onInput', 'onCopy', 'onPaste'])
</script>

<style scoped></style>
