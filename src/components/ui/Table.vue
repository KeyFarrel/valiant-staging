<template>
  <div
    class="w-full border whitespace-nowrap rounded-lg overflow-auto max-h-[50rem] relative"
  >
    <table class="w-full border-separate border-spacing-0">
      <thead
        class="sticky top-0 z-10 text-sm bg-white border-b text-primaryColor"
      >
        <slot name="table-header"></slot>
      </thead>
      <tbody class="text-xs">
        <slot name="table-body"></slot>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
:slotted(th) {
  font-weight: 600;
  padding: 0.8rem;
  border-bottom: 1px solid #e5e7e9;
}

:slotted(td) {
  border-bottom: 1px solid #e5e7e9;
}
</style>
