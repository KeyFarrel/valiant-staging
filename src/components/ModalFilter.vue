<script setup lang="ts">
import {ref} from "vue";

const emits = defineEmits(['submit'])
const visible = ref(false)

function handleModal(value: boolean) {
  visible.value = value
}

function submitFilter() {
  emits('submit')
  handleModal(false)
}
</script>

<template>
  <!-- Modal toggle -->
  <button type="button"
          @click="handleModal(true)"
          class="text-[#0099AD] bg-white border border-[#0099AD] hover:bg-[#9ddee7] focus:ring-2 focus:ring-[#9ddee7] font-medium rounded-lg text-sm ml-4 p-3 flex justify-center items-center dark:bg-[#005A66] dark:hover:bg-[#0099AD] focus:outline-none dark:focus:ring-[#007E8F]">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2">
      <path
          d="M12.6668 1.33325H3.3335C2.80306 1.33325 2.29436 1.54397 1.91928 1.91904C1.54421 2.29411 1.3335 2.80282 1.3335 3.33325V4.11325C1.3334 4.38855 1.39014 4.6609 1.50016 4.91325V4.95325C1.59435 5.16723 1.72776 5.36169 1.8935 5.52659L6.00016 9.60658V13.9999C5.99994 14.1132 6.02859 14.2247 6.08341 14.3238C6.13823 14.423 6.21742 14.5065 6.3135 14.5666C6.41959 14.6323 6.54201 14.667 6.66683 14.6666C6.77119 14.666 6.87395 14.6408 6.96683 14.5933L9.6335 13.2599C9.74344 13.2045 9.83589 13.1198 9.90061 13.015C9.96533 12.9103 9.99979 12.7897 10.0002 12.6666V9.60658L14.0802 5.52659C14.2459 5.36169 14.3793 5.16723 14.4735 4.95325V4.91325C14.5927 4.66287 14.6585 4.39044 14.6668 4.11325V3.33325C14.6668 2.80282 14.4561 2.29411 14.081 1.91904C13.706 1.54397 13.1973 1.33325 12.6668 1.33325ZM8.86016 8.85992C8.79838 8.92221 8.74949 8.99609 8.71632 9.07731C8.68314 9.15854 8.66632 9.24551 8.66683 9.33325V12.2533L7.3335 12.9199V9.33325C7.334 9.24551 7.31719 9.15854 7.28401 9.07731C7.25083 8.99609 7.20195 8.92221 7.14016 8.85992L3.60683 5.33325H12.3935L8.86016 8.85992ZM13.3335 3.99992H2.66683V3.33325C2.66683 3.15644 2.73707 2.98687 2.86209 2.86185C2.98712 2.73682 3.15669 2.66659 3.3335 2.66659H12.6668C12.8436 2.66659 13.0132 2.73682 13.1382 2.86185C13.2633 2.98687 13.3335 3.15644 13.3335 3.33325V3.99992Z"
          fill="#0099AD"/>
    </svg>
    Filter
  </button>

  <!-- Main modal -->
  <div id="modal-tambah" tabindex="-1"
       v-if="visible"
       class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-center flex"
       aria-modal="true" role="dialog">
    <div class="relative w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div class="px-6 py-6 lg:px-8">
          <div class="flex">
            <svg width="22" height="22" class="mr-2 mt-0.5" viewBox="0 0 16 16" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M4.6665 7.33268H11.3332V8.66602H4.6665V7.33268ZM2.6665 4.66602H13.3332V5.99935H2.6665V4.66602ZM6.6665 9.99935H9.33317V11.3327H6.6665V9.99935Z"
                  fill="#333333"></path>
            </svg>
            <h5 class="mb-4 text-lg font-medium text-gray-900 dark:text-white"> Filter </h5></div>
          <button @click="handleModal(false)" class="absolute top-7 right-5 text-gray-400">
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
            </svg>
          </button>
          <form>
            <slot name="content"></slot>
          </form>
        </div>
        <hr class="w-full"/>
        <div class="flex justify-end px-6 py-4 lg:px-8">
          <div class="flex items-start">
            <button @click="handleModal(false)"
                    class="w-full text-[#0099AD] bg-white border-2 border-[#80C1CD] hover:bg-[#80C1CD] focus:ring-2 focus:outline-none focus:ring-[#0099AD] font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center dark:bg-[#007E8F] dark:hover:bg-white dark:focus:ring-bg-[#80C1CD]">
              Batal
            </button>
            <button @click="submitFilter" type="submit"
                    class="w-full text-white bg-[#0099AD] hover:bg-[#005A66] focus:ring-2 focus:outline-none focus:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:focus:ring-[#005A66]">
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="visible" modal-backdrop class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
</template>

<style scoped>

</style>