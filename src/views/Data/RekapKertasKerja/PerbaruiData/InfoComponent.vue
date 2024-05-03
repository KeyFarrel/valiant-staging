<template>
  <div
    class="w-full p-3 bg-infoComponentBgColor flex flex-col border border-infoComponentBorderColor rounded-lg space-y-2">
    <div class="flex flex-row justify-between items-center">
      <div class="flex flex-row items-center space-x-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7.99998 2.66732C5.05446 2.66732 2.66665 5.05513 2.66665 8.00065C2.66665 10.9462 5.05446 13.334 7.99998 13.334C10.9455 13.334 13.3333 10.9462 13.3333 8.00065C13.3333 5.05513 10.9455 2.66732 7.99998 2.66732ZM1.33331 8.00065C1.33331 4.31875 4.31808 1.33398 7.99998 1.33398C11.6819 1.33398 14.6666 4.31875 14.6666 8.00065C14.6666 11.6825 11.6819 14.6673 7.99998 14.6673C4.31808 14.6673 1.33331 11.6825 1.33331 8.00065ZM7.99998 5.33398C8.36817 5.33398 8.66665 5.63246 8.66665 6.00065V8.50065C8.66665 8.86884 8.36817 9.16732 7.99998 9.16732C7.63179 9.16732 7.33331 8.86884 7.33331 8.50065V6.00065C7.33331 5.63246 7.63179 5.33398 7.99998 5.33398ZM7.33331 10.5007C7.33331 10.1325 7.63179 9.83398 7.99998 9.83398H8.00498C8.37317 9.83398 8.67165 10.1325 8.67165 10.5007V10.5057C8.67165 10.8738 8.37317 11.1723 8.00498 11.1723H7.99998C7.63179 11.1723 7.33331 10.8738 7.33331 10.5057V10.5007Z"
            fill="#4791F2" />
        </svg>
        <p class="text-xs font-semibold text-primaryTextColor">Informasi</p>
      </div>
      <!-- <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M2.29289 2.29289C2.68342 1.90237 3.31658 1.90237 3.70711 2.29289L8 6.58579L12.2929 2.29289C12.6834 1.90237 13.3166 1.90237 13.7071 2.29289C14.0976 2.68342 14.0976 3.31658 13.7071 3.70711L9.41421 8L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L8 9.41421L3.70711 13.7071C3.31658 14.0976 2.68342 14.0976 2.29289 13.7071C1.90237 13.3166 1.90237 12.6834 2.29289 12.2929L6.58579 8L2.29289 3.70711C1.90237 3.31658 1.90237 2.68342 2.29289 2.29289Z"
          fill="#4791F2" />
      </svg> -->
    </div>
    <p class="text-xs text-primaryTextColor">Data {{ props.simulasi }} berasal dari hasil perhitungan <span
        class="font-semibold">{{ props.proyeksi }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  simulasi: string;
  proyeksi: string;
}

const props = defineProps<Props>();
</script>

<style scoped></style>