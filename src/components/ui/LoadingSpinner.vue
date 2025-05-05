<template>
  <Teleport :to="'body'">
    <Transition name="modal">
      <div ref="modal-backdrop" class="fixed inset-0 z-50 overflow-y-auto bg-gray-700 bg-opacity-50">
        <div class="flex items-center justify-center min-h-screen">
          <div class="relative flex items-center justify-center">
            <div class="absolute animate-spin rounded-full h-28 w-28 border-t-8 border-b-8 border-[#FEF200]"></div>
            <img src="/logo-rounded.png" alt="Loading Icon" class="w-[60px] h-[60px] animate-bounce z-10" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">

</script>