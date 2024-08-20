<template>
  <div class="relative flex flex-col" ref="container">
    <div class="flex flex-row items-center">
      <input ref="searchInput"
        class="block px-3 py-2 w-80 text-sm text-gray-900 rounded-l-lg border border-[#0099AD] focus:ring-[#80C1CD] focus:border-[#80C1CD]"
        type="search" placeholder="Cari pembangkit..." @focus="showSuggestion = true"
        @input="setSelected(searchResults[0].sentral, 0)" v-model="searchQuery" @keydown.down.prevent="selectNextItem"
        @keydown.up.prevent="selectPreviousItem"
        @keyup.enter="searchQuery = selectedSentral; showSuggestion = false; emit('onKeyEnter'); searchInput?.blur()" />
      <button type="submit"
        class="relative float-left px-2 py-2.5 text-sm font-medium text-white bg-[#0099AD] rounded-r-lg border border-[#0099AD] hover:bg-[#007E8F] focus:ring-2 focus:outline-none focus:ring-[#9ddee7]"
        @click="showSuggestion = false">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.99992 2.66536C4.60668 2.66536 2.66659 4.60546 2.66659 6.9987C2.66659 9.39193 4.60668 11.332 6.99992 11.332C8.19672 11.332 9.27914 10.8477 10.064 10.0628C10.849 9.27792 11.3333 8.1955 11.3333 6.9987C11.3333 4.60546 9.39315 2.66536 6.99992 2.66536ZM1.33325 6.9987C1.33325 3.86908 3.8703 1.33203 6.99992 1.33203C10.1295 1.33203 12.6666 3.86908 12.6666 6.9987C12.6666 8.323 12.2117 9.54196 11.4506 10.5065L14.4713 13.5273C14.7317 13.7876 14.7317 14.2098 14.4713 14.4701C14.211 14.7305 13.7889 14.7305 13.5285 14.4701L10.5078 11.4493C9.54318 12.2105 8.32422 12.6654 6.99992 12.6654C3.8703 12.6654 1.33325 10.1283 1.33325 6.9987Z"
            fill="white" />
        </svg>
        <span class="sr-only">Search</span>
      </button>
    </div>
    <ul class="py-2 absolute mt-10 w-full max-h-48 bg-white border-[1.5px] rounded-lg z-[30] overflow-scroll space-y-1 "
      ref="listContainer" v-if="showSuggestion">
      <li @click="searchQuery = pembangkitItem.sentral; showSuggestion = false; emit('onClick')"
        :class="{ 'selected-item': pembangkitItem.sentral === selectedSentral }"
        class="px-3 py-1 cursor-pointer hover:bg-primaryColor hover:text-white"
        v-for="(pembangkitItem, pembangkitIndex) in searchResults" :key="pembangkitIndex">{{
          pembangkitItem.sentral }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const showSuggestion = ref<boolean>(false);
const container = ref<HTMLDivElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const listContainer = ref<HTMLUListElement | null>(null);

interface Props {
  source: Array<{ sentral: string }>;
}

const props = defineProps<Props>();
const searchQuery: any = defineModel();
const emit = defineEmits(['onInput', 'onKeyEnter', 'onClick', 'onFocus']);

const handleClickOutside = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    searchInput.value?.blur();
    showSuggestion.value = false;
  }
};

const searchResults: any = computed(() => {
  if (searchQuery.value === '') {
    return props.source;
  }
  return props.source.filter((item: any) => {
    if (item.sentral ? item.sentral.toLowerCase().includes(searchQuery.value.toLowerCase()) : item.nama_sentral.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return item;
    }
  })
});

const selectedSentral = ref<string | null>(props.source ? props.source[0].sentral : null);

const setSelected = (item: string, index: number) => {
  selectedSentral.value = item;
  const listRect = listContainer.value?.getBoundingClientRect();
  const selectedRect = document.querySelector('.selected-item')?.getBoundingClientRect();
  const inputRect = searchInput.value?.getBoundingClientRect();
  if (listRect && selectedRect && inputRect) {
    const offset = selectedRect.bottom - listRect.bottom + inputRect.height;
    listContainer.value?.scrollBy(0, offset);
  } else {
    listContainer.value?.scrollBy(0, index * 35);
  }
};

const selectNextItem = () => {
  const currentIndex = searchResults.value.findIndex((item: any) => item.sentral === selectedSentral.value);
  if (currentIndex < searchResults.value.length - 1) {
    console.log(searchResults.value[currentIndex + 1].sentral)
    setSelected(searchResults.value[currentIndex + 1].sentral, currentIndex + 1);
  }
};

const selectPreviousItem = () => {
  const currentIndex = searchResults.value.findIndex((item: any) => item.sentral === selectedSentral.value);
  if (currentIndex > 0) {
    console.log(searchResults.value[currentIndex - 1].sentral)
    setSelected(searchResults.value[currentIndex - 1].sentral, currentIndex - 1);
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.selected-item {
  background-color: #F1F5F9;
}
</style>