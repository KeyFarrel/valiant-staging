<template>
  <div v-bind="$attrs">
    <div class="flex justify-between items-center mt-5">
      <h3 class="text-lg font-semibold">Periode</h3>
      <div class="flex items-center space-x-3">
        <label for="" class="font-semibold text-labelColor">Periode</label>
        <VueDatePicker
          v-model="tahunPeriode"
          :year-range="[2022, 2023]"
          year-picker
        />
      </div>
    </div>
    <div class="grid grid-cols-2 mt-3 gap-x-10 gap-y-5">
      <div
        class="flex flex-col px-5 py-4 border-l-8 border-l-[#0099AD] rounded-lg border"
      >
        <p class="text-base font-semibold pb-3 border-b">
          Internal Rate of Return (IRR)
        </p>
        <div class="grid grid-cols-2 mt-5">
          <div>
            <p class="text-gray-500">IRR on Project</p>
            <p class="font-bold">22 <span class="text-gray-400">%</span></p>
          </div>
          <div>
            <p class="text-gray-500">IRR on Equity</p>
            <p class="font-bold">22 <span class="text-gray-400">%</span></p>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col px-5 py-4 border-l-8 border-l-[#0099AD] rounded-lg border"
      >
        <p class="text-base font-semibold pb-3 border-b">
          Net Present Value (NPV)
        </p>
        <div class="grid grid-cols-2 mt-5">
          <div>
            <p class="text-gray-500">NPV on Equity</p>
            <p class="font-semibold">
              6,948 <span class="text-textDisabledColor">Rp (Juta)</span>
            </p>
          </div>
          <div>
            <p class="text-gray-500">NPV on Project</p>
            <p class="font-semibold">
              7,649 <span class="text-textDisabledColor">Rp (Juta)</span>
            </p>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col px-5 py-4 border-l-8 border-l-[#0099AD] rounded-lg border space-y-3"
      >
        <p class="text-base font-semibold pb-3 border-b">
          Average Net Capacity Factor (NCF)
        </p>
        <p>7 <span class="text-textDisabledColor">%</span></p>
      </div>
      <div
        class="flex flex-col px-5 py-4 border-l-8 border-l-[#0099AD] rounded-lg border space-y-3"
      >
        <p class="text-base font-semibold pb-3 border-b">
          Average Equivalent Availability Factor (EAF)
        </p>
        <p>7 <span class="text-textDisabledColor">%</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";

const tahunPeriode = ref();
</script>

<style scoped></style>
