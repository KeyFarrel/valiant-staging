<template>
  <div class="flex flex-col space-y-5">
    <p class="text-xl font-semibold text-primaryTextColor">{{ props.title }}</p>
    <p class="text-base text-textDisabledColor" v-html="props.subtitle"></p>
    <div class="w-full h-0.5 bg-strokeColor"></div>
    <div class="flex flex-row justify-end space-x-3">
      <button
        class="px-3 py-2 text-primaryColor rounded-lg hover:text-white hover:bg-hoverColor cursor-pointer duration-300"
        @click="emit('onBatalClick')">Batal</button>
      <button
        class="px-3 py-2 bg-primaryColor text-white font-semibold rounded-lg hover:bg-hoverColor cursor-pointer duration-300"
        @click="emit('onAcceptClick')">{{
          props.buttonTitle }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string,
  subtitle: string,
  buttonTitle: string,
}

const props = defineProps<Props>();
const emit = defineEmits(['onBatalClick', 'onAcceptClick']);
</script>

<style scoped></style>