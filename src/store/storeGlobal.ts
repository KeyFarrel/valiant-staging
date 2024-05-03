import { ref, computed } from "vue";
import { defineStore } from 'pinia';
import { useOnline } from '@vueuse/core';


export const useConnectionStatusStore = defineStore('connectionStatus',()=>{
  const online = useOnline();
  const isOnline = computed(() => { return online.value });
  return { isOnline };
})