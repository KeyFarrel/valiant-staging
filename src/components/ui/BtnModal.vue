<script setup lang="ts">
import { ref } from "vue";

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
</script>

<template>
  <!-- Modal toggle -->
  <button :class="props.btnClass" @click="handleModal(true)">{{ props.btnText }}</button>

  <!-- Main modal -->
  <div id="modal-tambah" tabindex="-1" v-if="visible"
    class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full justify-center items-center flex"
    aria-modal="true">
    <div :class="`relative ${props.width} max-h-full`">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow">
        <div class="px-6 py-6 lg:px-8">
          <div class="flex">
            <h5 class="mb-4 text-lg font-bold text-gray-900"> {{ props.header }} </h5>
          </div>
          <button @click="handleModal(false)" class="absolute text-gray-400 top-7 right-5">
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
            </svg>
          </button>
          <form>
            <slot name="content"></slot>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div v-if="visible" modal-backdrop class="fixed inset-0 z-40 bg-gray-900 bg-opacity-50"></div>
</template>
