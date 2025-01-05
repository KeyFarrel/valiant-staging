<template>
  <ul>
    <li class="flex border text-xs border-b-gray-200 hover:bg-[#80C1CD]">
      <div class="">
        <label class="">
          <input @input="(event) => $emit('update:checked', event.target.checked)" type="checkbox" :checked="checked"
            :id="fieldId" class="h-4 w-4 text-[#0099AD] bg-gray-100 border-gray-300 rounded focus:ring-[#80C1CD]" />
          <span :for="fieldId" class="ml-2 text-sm font-medium text-gray-900">{{ label }}</span>
        </label>
      </div>
    </li>
  </ul>
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
