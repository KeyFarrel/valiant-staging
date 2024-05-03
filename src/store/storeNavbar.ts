import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useNavbarLabelStore = defineStore('navbarLabel',()=>{
  const label = ref<string | undefined>('');
  return { label };
})