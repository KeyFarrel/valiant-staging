<template>
  <div class="bg-blue-50 border border-[#0099AD] rounded-3xl px-2 py-0.5 text-xs text-[#0099AD] mr-2 whitespace-nowrap">
    <span>{{ props.title }} : </span>
    <span class="font-bold">{{ props.content }}</span>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: String,
  content: [String, Number],
});
</script>

<style scoped></style>