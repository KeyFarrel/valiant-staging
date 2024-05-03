<script setup lang="ts">
import {computed, ref} from "vue";

const emits = defineEmits(['update:modelValue', 'remove'])
const props = defineProps<{
  modelValue: any
}>()

const filter = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})
const filterObject = ref({})

function transformKeyToLabel(text: string) {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function remove(key: any) {
  if (typeof filter.value[key] === 'object') {
    filter.value[key] = []
  } else {
    filter.value[key] = null
  }
  emits('remove', key)
}

function setValue() {
  const stringData = JSON.stringify(props.modelValue)
  filterObject.value = JSON.parse(stringData)
}

function displayValue(value: any) {
  let result: string
  if (typeof value === 'object' && value !== null && value.length > 0) {
    if (value.every((item: any) => typeof item === 'number')) {
      result = value.join(' - ')
    } else {
      result = value.join(', ')
    }
  } else {
    result = value
  }
  return result
}

function handleShow(key: string) {
  let isShow: boolean
  isShow = filter.value[key] !== null
  if (typeof filter.value[key] === 'object' && filter.value[key] !== null) {
    isShow = filter.value[key].length > 0
  }
  return isShow
}

defineExpose({setValue})
</script>

<template>
  <div class="my-4">
    <span v-for="key in Object.keys(filterObject)"
          :style="handleShow(key) ? '' : 'display: none'"
          class="badge mx-1 badge-lg text-[#0099AD] border-[#0099AD] badge-outline gap-2 bg-primaryColor bg-opacity-5">
        <svg @click="remove(key)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             class="inline-block w-4 h-4 stroke-current cursor-pointer">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <span class="text-xs font-semibold">{{ transformKeyToLabel(key) }}: {{ displayValue(filterObject[key]) }}</span>
    </span>
  </div>
</template>
