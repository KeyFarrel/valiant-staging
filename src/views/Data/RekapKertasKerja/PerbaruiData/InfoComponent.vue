<template>
  <div
    class="flex flex-col w-full p-3 space-y-2 border rounded-lg bg-infoComponentBgColor border-infoComponentBorderColor">
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-row items-center space-x-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7.99998 2.66732C5.05446 2.66732 2.66665 5.05513 2.66665 8.00065C2.66665 10.9462 5.05446 13.334 7.99998 13.334C10.9455 13.334 13.3333 10.9462 13.3333 8.00065C13.3333 5.05513 10.9455 2.66732 7.99998 2.66732ZM1.33331 8.00065C1.33331 4.31875 4.31808 1.33398 7.99998 1.33398C11.6819 1.33398 14.6666 4.31875 14.6666 8.00065C14.6666 11.6825 11.6819 14.6673 7.99998 14.6673C4.31808 14.6673 1.33331 11.6825 1.33331 8.00065ZM7.99998 5.33398C8.36817 5.33398 8.66665 5.63246 8.66665 6.00065V8.50065C8.66665 8.86884 8.36817 9.16732 7.99998 9.16732C7.63179 9.16732 7.33331 8.86884 7.33331 8.50065V6.00065C7.33331 5.63246 7.63179 5.33398 7.99998 5.33398ZM7.33331 10.5007C7.33331 10.1325 7.63179 9.83398 7.99998 9.83398H8.00498C8.37317 9.83398 8.67165 10.1325 8.67165 10.5007V10.5057C8.67165 10.8738 8.37317 11.1723 8.00498 11.1723H7.99998C7.63179 11.1723 7.33331 10.8738 7.33331 10.5057V10.5007Z"
            fill="#4791F2" />
        </svg>
        <p class="text-xs font-semibold text-primaryTextColor">Informasi</p>
      </div>
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