<template>
  <ModalWrapper @on-escape="emit('onEscape')" :show-modal="props.showModal" :width="'w-[50%]'" :height="'h-auto'"
    :items-position="'items-start'" :margin-top="'mt-18'">
    <div class="flex flex-col space-y-3.5">
      <div class="flex justify-between">
        <p class="text-lg font-semibold text-gray-700">Cari Pembangkit</p>
        <button class="cursor-pointer" @click="emit('onClickClose')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 19.5L19.5 4.5M4.5 4.5L19.5 19.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div class="flex justify-between">
        <input ref="searchInput" type="search" name="" placeholder="Cari..."
          class="w-full text-sm rounded-md text-primaryTextColor" v-model="searchQuery"
          @input="setSelected(searchResults[0].sentral, 0)" @keydown.down.prevent="selectNextItem"
          @keydown.up.prevent="selectPreviousItem" @keyup.enter="searchQuery = selectedSentral; emit('onKeyEnter')" />
      </div>
      <hr />
      <ul class="space-y-2 overflow-auto max-h-48" ref="listContainer">
        <li
          class="px-3 py-2.5 text-xs text-primaryTextColor duration-200 cursor-pointer rounded-[3px] hover:bg-primaryColor hover:text-white"
          v-for="(pembangkitItem, pembangkitIndex) in searchResults" :key="pembangkitIndex"
          :class="{ 'selected-item': pembangkitItem.sentral === selectedSentral }"
          @click="searchQuery = pembangkitItem.sentral; selectedSentral = pembangkitItem.sentral; emit('onClick')">
          {{ pembangkitItem.sentral }}
        </li>
      </ul>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import ModalWrapper from './ui/ModalWrapper.vue';

const searchInput = ref<HTMLInputElement | null>(null);
const listContainer = ref<HTMLUListElement | null>(null);

interface Props {
  showModal: boolean;
  source: Array<{ sentral: string }>;
}

const props = defineProps<Props>();
const searchQuery: any = defineModel();
const emit = defineEmits(['onClick', 'onClickClose', 'onKeyEnter', 'onEscape']);

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

const setAutofocus = () => {
  if (searchInput.value) {
    searchInput.value.focus();
  }
};

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
  nextTick(() => {
    setAutofocus();
  });
  console.log(searchQuery.value);
});
</script>

<style scoped>
.selected-item {
  background-color: #F1F5F9;
  border-radius: 3px;
}
</style>