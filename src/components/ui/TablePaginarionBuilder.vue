<script setup lang="ts">
import {computed, ref} from "vue";

const props = defineProps<{
  header: any
  items: any
}>()

const itemsPerPage = ref(5)
const totalPages = computed({
  get() {
    return Math.ceil(props.items.length / itemsPerPage.value)
  },
  set() {
  }
})
const displayedItems = computed({
  get() {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return dataTable.value.slice(start, end)
  },
  set() {
  }
})
const dataTable = computed({
  get() {
    return props.items
  },
  set() {
  }
})
const currentPage = ref(1)
const optionPage = computed({
  get() {
    const roundUp = Math.ceil(props.items.length / 5 + 1)
    const result = []
    for (let i = 1; i < roundUp; i++) {
      if (i === roundUp - 1) {
        result.push({id: i * 5, name: 'All'})
      } else {
        result.push({id: i * 5, name: (i * 5).toString()})
      }
    }
    return result
  },
  set() {
  }
})

function handlePage(value: number) {
  currentPage.value = value
}
</script>

<template>
  <!--  table  -->
  <div class="overflow-x-auto overflow-y-auto">
    <table class="table-compact w-full">
      <!-- head -->
      <thead>
      <tr class="border">
        <th v-for="head in props.header" :key="head.key" class="text-[#0099AD] font-semibold">
          {{ head.label }}
        </th>
      </tr>
      </thead>
      <tbody>
      <!-- row 1 -->
      <tr class="border" v-for="(body, index) in displayedItems" :key="index">
        <th v-for="head in props.header" :key="head.key">{{ body[head.key] }}</th>
      </tr>
      </tbody>
    </table>
  </div>

  <!--  Footer pagination  -->
  <nav class="mt-3 bg-white flex items-center justify-between px-2 pb-4 rounded-b-lg"
       aria-label="Table navigation">
    <div class="flex items-center">
      <span class="text-sm font-normal text-gray-500 inline-block pr-2">Menampilkan</span>
      <select class="float-right border border-gray-300 text-sm font-semibold rounded block" v-model="itemsPerPage"
              @change="() => currentPage = 1">
        <option v-for="opt in optionPage" :value="opt.id" :key="opt.id">{{ opt.name }}</option>
      </select>
      <span class="pl-2">dari {{ props.items.length }} data</span>
    </div>

    <ul class="inline-flex items-center -space-x-px">
      <li>
        <button @click="() => currentPage -= 1" :disabled="currentPage === 1"
                class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
          <span class="sr-only">Previous</span>
          <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
          </svg>
        </button>
      </li>
      <li class="" v-for="num in totalPages" :key="num">
        <button
            v-if="num === currentPage"
            class="block ml-2 w-9 h-9 text-white bg-[#0099AD] focus:outline-none font-medium rounded-lg text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:focus:ring-[#005A66]">
          {{ num }}
        </button>
        <button
            v-else
            @click="handlePage(num)"
            class="block ml-2 w-9 h-9 hover:bg-[#0099AD] hover:text-white border-[1px] font-medium rounded-lg text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:focus:ring-[#005A66]">
          {{ num }}
        </button>
      </li>
      <li>
        <button @click="() => currentPage += 1" :disabled="currentPage === totalPages"
                class="ml-2 block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
                style="cursor: pointer;">
          <span class="sr-only">Next</span>
          <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"></path>
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>
