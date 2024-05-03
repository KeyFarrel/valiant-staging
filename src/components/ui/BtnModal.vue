<script setup lang="ts">
import {ref} from "vue";

const emits = defineEmits(['submit'])
const props = defineProps<{
  header: string
  btnClass: string
  btnText: string
  width: string
}>()
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
  <button :class="props.btnClass" @click="handleModal(true)">{{ props.btnText }}</button>

  <!-- Main modal -->
  <div id="modal-tambah" tabindex="-1"
       v-if="visible"
       class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-center flex"
       aria-modal="true" role="dialog">
    <div :class="`relative ${props.width} max-h-full`">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div class="px-6 py-6 lg:px-8">
          <div class="flex">
            <h5 class="mb-4 text-lg font-bold text-gray-900 dark:text-white"> {{props.header}} </h5>
          </div>
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
        <!--        <hr class="w-full"/>-->
        <!--        <div class="flex justify-end px-6 py-4 lg:px-8">-->
        <!--          <div class="flex items-start">-->
        <!--            <button @click="handleModal(false)"-->
        <!--                    class="w-full text-[#0099AD] bg-white border-2 border-[#80C1CD] hover:bg-[#80C1CD] focus:ring-2 focus:outline-none focus:ring-[#0099AD] font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center dark:bg-[#007E8F] dark:hover:bg-white dark:focus:ring-bg-[#80C1CD]">-->
        <!--              Batal-->
        <!--            </button>-->
        <!--            <button @click="submitFilter" type="submit"-->
        <!--                    class="w-full text-white bg-[#0099AD] hover:bg-[#005A66] focus:ring-2 focus:outline-none focus:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:focus:ring-[#005A66]">-->
        <!--              Terapkan-->
        <!--            </button>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
  </div>

  <div v-if="visible" modal-backdrop class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>
</template>
