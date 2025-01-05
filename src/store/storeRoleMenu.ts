import { ref } from "vue";
import { defineStore } from 'pinia';

export const useRoleMenuStore = defineStore('roleMenu',()=>{
  const roleMenu = ref();
  return { roleMenu };
})