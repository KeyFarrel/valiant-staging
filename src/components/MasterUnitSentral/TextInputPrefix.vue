<template>
  <div class="flex items-center justify-start mt-2">
    <input type="text" name="" :id="props.id"
      class="w-full h-10 pl-20 text-sm bg-white border border-gray-300 rounded-lg" v-model="inputValue"
      @input="handleInput">
    <label for="" class="text-[#0099AD] text-sm pl-3 absolute">Rp (Juta)</label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();

const props = defineProps({
  id: String,
  inputMethod: Function,
  modelValue: {
    type: String,
    default: '',
  },
})

const inputValue = ref(props.modelValue);
const emit = defineEmits(['update:modelValue']);

const handleInput = () => {
  inputValue.value = globalFormat.formatInputDecimalRupiah(inputValue.value);
  emit('update:modelValue', inputValue.value);
};
</script>