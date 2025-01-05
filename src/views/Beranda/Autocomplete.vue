<template>
  <div class="relative">
    <SearchBox v-model="searchQuery" @on-input="isOpen = true" @on-key-enter="emit('onKeyEnter')"
      @on-click="emit('onClick')" />
    <ul class="bg-white p-3 w-[17rem] max-h-48 border rounded-md absolute z-40 overflow-y-auto"
      v-show="searchResults.length && isOpen">
      <li class="text-sm p-2 cursor-pointer hover:bg-strokeColor hover:bg-opacity-50"
        v-for="(resultItem, resultIndex) in searchResults" :key="resultIndex" @click="setSelected(resultItem.sentral)">
        {{ resultItem.sentral }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SearchBox from '@/components/ui/SearchBox.vue';

const isOpen = ref(false);
const searchQuery: any = defineModel();
const emit = defineEmits(['onKeyEnter', 'onClick']);

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

const searchResults: any = computed(() => {
  if (searchQuery.value === '') {
    return [];
  }
  return props.data.filter((item: any) => {
    if (item.sentral.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return item;
    }
  })
});
const setSelected: any = (item: any) => {
  searchQuery.value = item;
}
</script>