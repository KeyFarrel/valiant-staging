<template>
  <button type="button"
    :class="`flex items-center border ${props.borderColor} hover:${props.hoverBorderColor} p-3 rounded-lg hover:${props.hoverTextColor} ${props.bgColor} hover:${props.hoverBgColor} space-x-2 duration-300`"
    @click="emit('onClick')">
    <slot v-if="props.iconPosition === 'Left'"></slot>
    <span :class="`text-sm font-semibold ${props.textColor}`">{{ props.text }}</span>
    <slot v-if="props.iconPosition === 'Right'"></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  iconPosition: string;
  bgColor: string;
  hoverBgColor: string;
  borderColor: string;
  hoverBorderColor: string;
  textColor: string;
  hoverTextColor: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['onClick'])
</script>

<style scoped></style>