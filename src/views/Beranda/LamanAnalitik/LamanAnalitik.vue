<script setup lang="ts">
import { ref } from "vue";
import FinansialPage from "@/views/Beranda/LamanAnalitik/TabPage/FinansialTab.vue";
import TeknisPage from "@/views/Beranda/LamanAnalitik/TabPage/TeknisTab.vue";
// import TeknisPage from '@/views/Beranda/LamanAnalitik/TeknisPage.vue'

const currentTab = ref("finansial");

const showContent = (tab: string) => {
  currentTab.value = tab;
};
</script>

<template>
  <div class="flex flex-col h-full px-6 bg-white rounded-lg">
    <div class="flex">
      <div class="mt-5 justify-beetween">
        <button class="font-semibold hover:text-[#0099AD] border-b-4 border-[#0099AD] pb-2"
          @click="showContent('finansial')" :class="currentTab === 'finansial'
            ? 'text-[#0099AD]'
            : 'text-gray-600 border-transparent'
            ">
          Finansial
        </button>
        <button class="font-semibold hover:text-[#0099AD] border-b-4 border-[#0099AD] pb-2 ml-8"
          @click="showContent('teknis')" :class="currentTab === 'teknis'
            ? 'text-[#0099AD]'
            : 'text-gray-600 border-transparent'
            ">
          Teknis
        </button>
      </div>
    </div>
  </div>
  <div v-if="currentTab === 'finansial'">
    <FinansialPage />
  </div>
  <div v-else-if="currentTab === 'teknis'">
    <TeknisPage />
  </div>
</template>
