<template>
  <div v-show="props.title == selectedTitle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps({
  title: String,
})

const selectedTitle = inject("selectedTitle")
</script>

<style lang="scss" scoped></style>