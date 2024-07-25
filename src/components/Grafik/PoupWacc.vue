<template>
  <div class="flex flex-col items-center">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
      @mouseenter="toggleButton" @mouseleave="toggleButton">
      <g opacity="0.2">
        <path
          d="M7.99967 14.6666C4.31767 14.6666 1.33301 11.6819 1.33301 7.99992C1.33301 4.31792 4.31767 1.33325 7.99967 1.33325C11.6817 1.33325 14.6663 4.31792 14.6663 7.99992C14.6663 11.6819 11.6817 14.6666 7.99967 14.6666ZM7.33301 7.33325V11.3333H8.66634V7.33325H7.33301ZM7.33301 4.66658V5.99992H8.66634V4.66658H7.33301Z"
          fill="black" />
      </g>
    </svg>
    <Transition>
      <div v-if="isHover"
        class="flex flex-col bg-white absolute text-xs p-2 -mt-3 ml-48 z-10 rounded-lg whitespace-nowrap border space-y-1.5 duration-300"
        id="tooltipContent">
        <div class="flex text-xs py-1">
          <p class="mr-1 text-slate-400">{{ props.title }} : </p>
          <p>{{ props.content }} %</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isHover = ref(false);

const props = defineProps({
  title: String,
  content: [String, Number],
});

function toggleButton() {
  isHover.value = !isHover.value;
}
</script>

<style scoped>
#tooltipContent::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
