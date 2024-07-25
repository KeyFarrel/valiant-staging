<template>
  <div class="flex flex-col items-center" @mouseenter="toggleButtonActive" @mouseleave="toggleButtonDisabled">
    <CheckIcon class="cursor-pointer" v-if="props.value > 9 && props.value < 14" />
    <WarningIcon class="cursor-pointer" v-else />
    <Transition>
      <div v-if="isHover"
        class="flex flex-col bg-white absolute text-xs p-3 mt-7 z-10 rounded-lg whitespace-nowrap border space-y-1.5 duration-300"
        id="tooltipContent">
        <div class="flex items-center space-x-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="12" height="12" rx="6" fill="#FF5656" />
            <g clip-path="url(#clip0_1804_76244)">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.36068 3.79308C6.20034 3.51515 5.7992 3.51515 5.63886 3.79308L3.18742 8.04225C3.02716 8.32003 3.22764 8.66714 3.54833 8.66714H8.45121C8.7719 8.66714 8.97238 8.32003 8.81212 8.04225L6.36068 3.79308ZM5.0614 3.45994C5.4783 2.73731 6.52124 2.73731 6.93814 3.45994L9.38958 7.7091C9.80625 8.43133 9.28501 9.3338 8.45121 9.3338H3.54833C2.71453 9.3338 2.19329 8.43132 2.60996 7.7091L5.0614 3.45994ZM5.99977 5.16714C6.18386 5.16714 6.3331 5.31637 6.3331 5.50047V6.75047C6.3331 6.93456 6.18386 7.0838 5.99977 7.0838C5.81567 7.0838 5.66644 6.93456 5.66644 6.75047V5.50047C5.66644 5.31637 5.81567 5.16714 5.99977 5.16714ZM5.66644 7.75047C5.66644 7.56637 5.81567 7.41714 5.99977 7.41714H6.00227C6.18636 7.41714 6.3356 7.56637 6.3356 7.75047V7.75297C6.3356 7.93706 6.18636 8.0863 6.00227 8.0863H5.99977C5.81567 8.0863 5.66644 7.93706 5.66644 7.75297V7.75047Z"
                fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_1804_76244">
                <rect width="8" height="8" fill="white" transform="translate(2 2)" />
              </clipPath>
            </defs>
          </svg>
          <p class="text-warningColor">Anomali
            <span class="text-primaryTextColor">{{ ': 9% > IRR > 14%' }}</span>
          </p>
        </div>
        <div class="flex items-center space-x-1.5">
          <div class="w-3 h-3 bg-green-500 rounded-lg"></div>
          <p class="text-green-500">Normal
            <span class="text-primaryTextColor">: IRR 9% - 14%</span>
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WarningIcon from '../icons/WarningIcon.vue';
import CheckIcon from '@/components/icons/CheckIcon.vue'

const props = defineProps({
  value: {
    type: Number,
    required: false,
    default: 0
  },
})

const isHover = ref<boolean>(false);

const toggleButtonActive = () => {
  isHover.value = true
}
const toggleButtonDisabled = () => {
  isHover.value = false
}
</script>

<style scoped>
#tooltipContent::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent gray transparent;
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