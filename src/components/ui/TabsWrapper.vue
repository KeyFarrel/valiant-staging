<template>
  <div class="whitespace-nowrap">
    <ul class="flex items-end mb-4 border-b-2 border-gray-50">
      <li
        class="pb-2 mr-6 font-semibold text-gray-500 transition-all duration-300 cursor-pointer hover:text-primaryColor"
        v-for="title in tabTitles" :key="title" @click="handleClick(title)"
        :class="{ selected: title === selectedTitle }">{{
          title }}</li>
      <li class="items-end content-end justify-end ml-auto justify-items-end" v-if="isLihatGrafik">
        <RouterLink
          :to="{ name: 'grafik', params: { id: nodeMode === 'production' ? encryptStorage.encryptValue(props.kodeSentral) : props.kodeSentral } }">
          <button
            class="flex space-x-2 items-center px-3 py-2 border border-[#0099AD] rounded-lg text-[#0099AD] hover:bg-blue-600 hover:border-blue-600 hover:text-white duration-300">
            <span class="font-semibold">Lihat Grafik</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M9.80622 6.38128C10.1479 6.72299 10.1479 7.27701 9.80622 7.61872L5.43122 11.9937C5.08951 12.3354 4.53549 12.3354 4.19378 11.9937C3.85207 11.652 3.85207 11.098 4.19378 10.7563L7.95006 7L4.19378 3.24372C3.85207 2.90201 3.85207 2.34799 4.19378 2.00628C4.53549 1.66457 5.08951 1.66457 5.43122 2.00628L9.80622 6.38128Z"
                fill="#0099AD" />
            </svg>
          </button>
        </RouterLink>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, useSlots } from "vue";
import { useLamanDataTabStore } from "@/store/storeLamanDataTab";
const store = useLamanDataTabStore();
import { usePerbaruiTabStore } from "@/store/storeRekapKertasKerja";
const storePerbaruiTab = usePerbaruiTabStore();
import { encryptStorage } from "@/utils/app-encrypt-storage";

interface Props {
  isLihatGrafik?: boolean,
  kodeSentral?: string
  lamanData: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  isLihatGrafik: false,
  lamanData: false,
})

const handleClick = (title: string) => {
  if (props.lamanData === true) {
    selectedTitle.value = title;
    store.currentTab = title;
    return;
  }
  selectedTitle.value = title;
  storePerbaruiTab.currentTab = title;
}

const tabTitles = ref();
tabTitles.value = useSlots()
  ?.default?.()
  .map((tab) => tab?.props?.title);
const selectedTitle = ref(tabTitles.value[0]);
provide("selectedTitle", selectedTitle);

const nodeMode = import.meta.env.MODE;
</script>

<style scoped>
ul li.selected {
  border-bottom-width: 4px;
  border-color: #0099AD;
  color: #0099AD;
}
</style>