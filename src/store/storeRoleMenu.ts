import { ref, computed } from "vue";
import { defineStore } from 'pinia';
import { useOnline } from '@vueuse/core';


export const useRoleMenuStore = defineStore('roleMenu',()=>{
  const roleMenu = ref();
  return { roleMenu };
})