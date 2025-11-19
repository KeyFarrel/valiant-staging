<template>
  <div class="flex items-center">
    <input type="search" autocomplete="off" id="search"
      class="block px-3 py-2 focus:outline-none w-full bg-white text-sm text-gray-900 rounded-l-lg border border-[#0099AD] focus:ring-[#80C1CD] focus:border-[#80C1CD]"
      :placeholder="props.placeholder" @change="emit('onChange')" @focus="handleFocus" @keydown="emit('onKeyDown')"
      @keyup.enter="emit('onKeyEnter')" @input="emit('onInput')" v-model="model" />
    <button type="submit"
      class="relative float-left px-2 py-2.5 text-sm font-medium text-white bg-[#0099AD] rounded-r-lg border border-[#0099AD] hover:bg-[#007E8F] focus:ring-2 focus:outline-none focus:ring-[#9ddee7]"
      @click="emit('onClickSubmit')">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M6.99992 2.66536C4.60668 2.66536 2.66659 4.60546 2.66659 6.9987C2.66659 9.39193 4.60668 11.332 6.99992 11.332C8.19672 11.332 9.27914 10.8477 10.064 10.0628C10.849 9.27792 11.3333 8.1955 11.3333 6.9987C11.3333 4.60546 9.39315 2.66536 6.99992 2.66536ZM1.33325 6.9987C1.33325 3.86908 3.8703 1.33203 6.99992 1.33203C10.1295 1.33203 12.6666 3.86908 12.6666 6.9987C12.6666 8.323 12.2117 9.54196 11.4506 10.5065L14.4713 13.5273C14.7317 13.7876 14.7317 14.2098 14.4713 14.4701C14.211 14.7305 13.7889 14.7305 13.5285 14.4701L10.5078 11.4493C9.54318 12.2105 8.32422 12.6654 6.99992 12.6654C3.8703 12.6654 1.33325 10.1283 1.33325 6.9987Z"
          fill="white" />
      </svg>
      <span class="sr-only">Search</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const model = defineModel();
const emit = defineEmits(['onInput', 'onKeyEnter', 'onClickSubmit', 'onFocus', 'onChange', 'onKeyDown']);

const handleFocus = () => {
  emit('onFocus');
};

const props = withDefaults(defineProps<{
  placeholder?: string;
}>(), {
  placeholder: 'Cari...',
});
</script>