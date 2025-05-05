<template>
  <form class="grid grid-cols-3 gap-6">
    <div class="flex flex-col space-y-1.5">
      <label class="text-sm font-semibold text-labelColor" for="">Nama Program<span
          class="ml-2 text-xs text-textDisabledColor">2024</span></label>
      <input type="text" name="" id="" class="h-10 border-gray-300 rounded-lg" />
    </div>
    <div class="flex flex-col space-y-1.5">
      <label for="" class="text-sm font-semibold text-labelColor">AI</label>
      <div class="flex items-center justify-start">
        <TextField class="pl-9" />
        <span class="absolute pl-3 text-sm text-primaryColor">Rp.</span>
      </div>
    </div>
    <div class="flex flex-col space-y-1.5">
      <label for="" class="text-sm font-semibold text-labelColor">Realisasi AKI</label>
      <div class="flex items-center justify-start">
        <TextField class="pl-9" />
        <span class="absolute pl-3 text-sm text-primaryColor">Rp.</span>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import TextField from '../ui/TextField.vue'

</script>