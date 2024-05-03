<template>
  <form class="grid grid-cols-3 gap-6">
    <div class="flex flex-col space-y-1.5">
      <label class="text-labelColor font-semibold text-sm" for="">Nama Program<span
          class="text-xs text-textDisabledColor ml-2">2024</span></label>
      <input type="text" name="" id="" class="h-10 rounded-lg border-gray-300" />
    </div>
    <div class="flex flex-col space-y-1.5">
      <label for="" class="text-labelColor font-semibold text-sm">AI</label>
      <div class="flex justify-start items-center">
        <TextField class="pl-9" />
        <label class="text-primaryColor text-sm absolute pl-3">Rp.</label>
      </div>
    </div>
    <div class="flex flex-col space-y-1.5">
      <label for="" class="text-labelColor font-semibold text-sm">Realisasi AKI</label>
      <div class="flex justify-start items-center">
        <TextField class="pl-9" />
        <label class="text-primaryColor text-sm absolute pl-3">Rp.</label>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import TextField from '../ui/TextField.vue'

</script>

<style scoped></style>