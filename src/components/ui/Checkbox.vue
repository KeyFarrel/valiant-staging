<template>
  <li
    class="flex border text-xs border-b-gray-200 hover:bg-[#80C1CD] dark:hover:bg-gray-600 dark:hover:text-white"
  >
    <div class="">
      <label class="">
        <input
          @input="(event) => $emit('update:checked', event.target.checked)"
          type="checkbox"
          :checked="checked"
          :id="fieldId"
          class="h-4 w-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded focus:ring-[#80C1CD] dark:focus:ring-[#0099AD] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <span
          :for="fieldId"
          class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >{{ label }}</span
        >
      </label>
    </div>
  </li>
</template>

<script lang="ts">
export default {
  props: {
    label: String,
    fieldId: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
    },
  },
};
</script>

<style></style>
