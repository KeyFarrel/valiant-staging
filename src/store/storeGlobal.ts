import { computed } from "vue";
import { defineStore } from 'pinia';
import { useOnline } from '@vueuse/core';

export const useConnectionStatusStore = defineStore('connectionStatus',()=>{
  const online = useOnline();
  const isOnline = computed(() => { return online.value });
  return { isOnline };
})

// export const useUserInfoStore = defineStore('userInfo',()=>{
//   const userInfo = {
//     token: '',
//     level: '',
//     role: '',
//     namaPegawai: '',
//     levelSentral: null,
//     isLoggedInBefore: false
//   }
//   const setUserInfo = (payload: {
//     token: string
//     level: string
//     role: string
//     nama_pegawai: string
//     level_sentral: number | null
//     isLoggedInBefore: boolean
//   }) => {
//     userInfo.token = payload.token;
//     userInfo.level = payload.level;
//     userInfo.role = payload.role;
//     userInfo.namaPegawai = payload.nama_pegawai;
//     userInfo.levelSentral = payload.level_sentral;
//     userInfo.isLoggedInBefore = payload.isLoggedInBefore;
//   }
//   return { userInfo, setUserInfo };
// })