<template>
  <div class="flex flex-col items-center">
    <button type="submit" class="rounded-md active:ring-2 active:ring-textFieldColor hover:bg-primaryColor"
      @click="toggleButton">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" class="fill-[#E5E7E9]" />
        <path
          d="M12 9.8125C11.9171 9.8125 11.8376 9.77958 11.779 9.72097C11.7204 9.66237 11.6875 9.58288 11.6875 9.5C11.6875 9.41712 11.7204 9.33763 11.779 9.27903C11.8376 9.22042 11.9171 9.1875 12 9.1875C12.0829 9.1875 12.1624 9.22042 12.221 9.27903C12.2796 9.33763 12.3125 9.41712 12.3125 9.5C12.3125 9.58288 12.2796 9.66237 12.221 9.72097C12.1624 9.77958 12.0829 9.8125 12 9.8125ZM12 12.3125C11.9171 12.3125 11.8376 12.2796 11.779 12.221C11.7204 12.1624 11.6875 12.0829 11.6875 12C11.6875 11.9171 11.7204 11.8376 11.779 11.779C11.8376 11.7204 11.9171 11.6875 12 11.6875C12.0829 11.6875 12.1624 11.7204 12.221 11.779C12.2796 11.8376 12.3125 11.9171 12.3125 12C12.3125 12.0829 12.2796 12.1624 12.221 12.221C12.1624 12.2796 12.0829 12.3125 12 12.3125ZM12 14.8125C11.9171 14.8125 11.8376 14.7796 11.779 14.721C11.7204 14.6624 11.6875 14.5829 11.6875 14.5C11.6875 14.4171 11.7204 14.3376 11.779 14.279C11.8376 14.2204 11.9171 14.1875 12 14.1875C12.0829 14.1875 12.1624 14.2204 12.221 14.279C12.2796 14.3376 12.3125 14.4171 12.3125 14.5C12.3125 14.5829 12.2796 14.6624 12.221 14.721C12.1624 14.7796 12.0829 14.8125 12 14.8125Z"
          stroke-linecap="round" stroke-linejoin="round" class="stroke-[#333333]" />
      </svg>
    </button>
    <Transition>
      <div v-if="isOpen"
        class="absolute flex flex-col justify-center text-xs duration-300 bg-white border rounded-lg bottom-5 right-2 whitespace-nowrap"
        id="tooltipContent">
        <RouterLink :to="{ name: 'lihat-opex', params: { id: props.idMesin }, query: { tahun: props.tahun } }">
          <button class="w-full p-2 cursor-pointer hover:bg-strokeColor hover:bg-opacity-60"
            @click="handleChangePage(props.tahun)">
            <div class="flex flex-row space-x-2">
              <IconView />
              <p class="text-xs">Lihat OPEX</p>
            </div>
          </button>
        </RouterLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLamanDataPeriodeStore } from "@/store/storeLamanDataTab";
const store = useLamanDataPeriodeStore();
import IconView from '../icons/IconView.vue';

const isOpen = ref(false);

interface Props {
  idMesin: number;
  tahun: number;
}
const props = defineProps<Props>();

function toggleButton() {
  isOpen.value = !isOpen.value
}
const handleChangePage = (periodeInitial: number) => {
  store.periodeInitial = periodeInitial;
  console.log(periodeInitial)
}
</script>

<style scoped>
button:hover svg rect {
  fill: #0099AD;
  transition: all;
  transition-duration: 300ms;
}

button:hover svg path {
  stroke: white;
  transition: all;
  transition-duration: 300ms;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>