<template>
  <TableComponent class="scrollbar-hide">
    <template v-slot:table-header>
      <tr class="text-xs">
        <th scope="col" class="text-center border-r">No</th>
        <th scope="col" class="border-r">
          <div class="flex flex-row items-center justify-center space-x-10 text-center ">
            <h1 class="font-semibold">Periode</h1>
          </div>
        </th>
        <th scope="col" class="border-r">
          <div class="flex flex-row items-center justify-center space-x-10 text-center ">
            <h1 class="font-semibold">IRR on Equity (%)</h1>
          </div>
        </th>
        <th scope="col" class="border-r">
          <div class="flex flex-row items-center justify-center space-x-10 text-center ">
            <h1 class="font-semibold">NPV on Equity (Rp Juta)</h1>
          </div>
        </th>
        <th scope="col" class="border-r">
          <div class="flex flex-row items-center justify-center space-x-10 text-center">
            <h1 class="font-semibold">Status</h1>
          </div>
        </th>
        <th scope="col" class="text-center">Aksi</th>
      </tr>
    </template>
    <template v-slot:table-body v-if="!props.source?.length">
      <tr class="text-xs text-gray-900 border-b hover:bg-gray-100">
        <td colspan="8">
          <h1 class="mb-2 text-lg font-semibold text-center">Data Tidak Tersedia</h1>
          <p class="text-center">Silahkan lakukan pengisian atau hubungi unit terkait</p>
        </td>
      </tr>
    </template>
    <template v-slot:table-body v-else>
      <tr class="text-xs text-gray-900 border-b hover:bg-gray-100"
        v-for="(persetujuanFSItem, persetujuanFSIndex) in props.source" :key="persetujuanFSIndex">
        <td class="px-1 py-4 text-center whitespace-nowrap">{{ persetujuanFSIndex + 1 }}</td>
        <td class="text-center">{{ persetujuanFSItem.tahun ? persetujuanFSItem.tahun : '-' }}</td>
        <td class="text-right">{{ persetujuanFSItem.irr_on_equity === '' ? 'NUM' :
          globalFormat.formatRupiah(persetujuanFSItem.irr_on_equity) }}</td>
        <td class="text-right">{{ globalFormat.formatRupiah(persetujuanFSItem.npv_on_equity) }}</td>
        <td class="flex items-center justify-center text-center">
          <div
            class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
            v-if="persetujuanFSItem.status === 'Ditolak T1' || persetujuanFSItem.status === 'Ditolak T2'">
            Ditolak oleh Pembina
          </div>
          <div
            class="w-fit p-1 flex items-center justify-center bg-[#FAEBEA] border border-[#EFC0BD] rounded-md text-[#C53830]"
            v-else-if="persetujuanFSItem.status === 'Ditolak T2'">
            Ditolak oleh Pengelola
          </div>
          <div
            class="w-fit p-1 flex items-center justify-center bg-[#EDF7F2] border border-[#C7E5D7] rounded-md text-[#397E5D]"
            v-else-if="persetujuanFSItem.status === 'Disetujui'">
            Disetujui
          </div>
          <div
            class="w-fit p-1 flex items-center justify-center bg-[#B7CAF5] border border-[#B7CAF5] rounded-md text-[#1D55D7]"
            v-else-if="persetujuanFSItem.status === 'Draft'">
            Draft
          </div>
          <div
            class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
            v-else-if="persetujuanFSItem.status === 'Menunggu Persetujuan T1'">
            Menunggu Persetujuan Pembina
          </div>
          <div
            class="w-fit p-1 flex items-center justify-center bg-[#FFF3E6] border border-[#FFD6AD] rounded-md text-[#FF8000]"
            v-else-if="persetujuanFSItem.status === 'Menunggu Persetujuan T2'">
            Menunggu Persetujuan Pengelola
          </div>
        </td>
        <td class="text-center">
          <div>
            <RouterLink
              :to="{ name: 'persetujuan-fs', params: { id: nodeMode === 'production' ? encryptStorageRef.encryptValue(persetujuanFSItem.uuid_mesin) : persetujuanFSItem.uuid_mesin }, query: { uuid_sentral: persetujuanFSItem.uuid_sentral } }">
              <button>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M8.00051 3.66536C5.20279 3.66536 2.82714 5.47986 1.98946 7.99808C1.98897 7.99955 1.98897 8.00136 1.98946 8.00283C2.82818 10.5192 5.20293 12.332 7.99934 12.332C10.7971 12.332 13.1727 10.5175 14.0104 7.99932C14.0109 7.99785 14.0109 7.99604 14.0104 7.99457C13.1717 5.47817 10.7969 3.66536 8.00051 3.66536ZM0.72429 7.57722C1.73777 4.5305 4.61153 2.33203 8.00051 2.33203C11.3879 2.33203 14.2606 4.52846 15.2753 7.57297C15.3669 7.84785 15.367 8.14524 15.2756 8.42018C14.2621 11.4669 11.3883 13.6654 7.99934 13.6654C4.61194 13.6654 1.73927 11.4689 0.72454 8.42443C0.632921 8.14955 0.632834 7.85216 0.72429 7.57722ZM7.99997 6.66536C7.26359 6.66536 6.66663 7.26232 6.66663 7.9987C6.66663 8.73508 7.26359 9.33203 7.99997 9.33203C8.73635 9.33203 9.3333 8.73508 9.3333 7.9987C9.3333 7.26232 8.73635 6.66536 7.99997 6.66536ZM5.3333 7.9987C5.3333 6.52594 6.52721 5.33203 7.99997 5.33203C9.47273 5.33203 10.6666 6.52594 10.6666 7.9987C10.6666 9.47146 9.47273 10.6654 7.99997 10.6654C6.52721 10.6654 5.3333 9.47146 5.3333 7.9987Z"
                    fill="#0099AD" />
                </svg>
              </button>
            </RouterLink>
          </div>
        </td>
      </tr>
    </template>
  </TableComponent>
  <div class="flex items-center justify-between w-full mt-3 mb-6">
    <div class="flex items-center space-x-2 text-sm">
      <span>Menampilkan</span>
      <select name="" id=""
        class="p-2 text-sm text-gray-500 bg-white border-r-4 border-transparent rounded-lg cursor-pointer outline-1 outline outline-gray-300">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
      <span>dari <span class="font-bold">{{ props.source.length }}</span> data</span>
    </div>
    <ul class="flex items-center space-x-3">
      <li>
        <button @click="goToPrevious" :disabled="navigation.currentPage === 1"
          :class="{ 'text-gray-500': navigation.currentPage === 1 }"
          class="block px-2 py-2 ml-0 duration-300 bg-white disabled:hover:cursor-not-allowed text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
          <span class="sr-only">Previous</span>
          <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"></path>
          </svg>
        </button>
      </li>
      <li id="pagination" v-for="(item, index) in generatePageList" :key="index"
        class="w-8 h-8 mr-2 text-sm leading-8 text-center duration-300 cursor-pointer text hover:bg-blue-500 hover:rounded-md hover:text-white"
        :class="{ selected: item === navigation.currentPage, disabled: item === '...' }" @click="goToPage(item)">
        {{ item }}
      </li>
      <li>
        <button @click="goToNext" :disabled="navigation.currentPage === navigation.totalPages"
          class="block px-2 py-2 ml-0 duration-300 bg-white disabled:hover:cursor-not-allowed text-primaryColor disabled:text-gray-500 hover:bg-blue-500 disabled:bg-white hover:text-white hover:rounded-md">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
const nodeMode = import.meta.env.MODE;
import TableComponent from "@/components/ui/Table.vue";
import GlobalFormat from "@/services/format/global-format";

const globalFormat = new GlobalFormat();
let encryptStorageRef: any = null;
interface Props {
  source: PersetujuanFSItem[]
}

interface PersetujuanFSItem {
  irr_on_project: number | string
  tahun: string
  npv_on_project: number
  irr_on_equity: number | string
  status: string
  npv_on_equity: number
  uuid_sentral: any
  uuid_mesin: any
}

const navigation = ref<{
  currentPage: number
  totalPages: number
  totalRecords: number
  limit: number
}>({
  totalPages: 1,
  currentPage: 1,
  limit: 10,
  totalRecords: 0,
});

const generatePageList = computed(() => {
  const pageList = []
  const maxPages = 5;
  if (navigation.value.totalPages <= maxPages) {
    for (let i = 1; i <= navigation.value.totalPages; i++) {
      pageList.push(i)
    };
  } else if (navigation.value.currentPage <= 3) {
    for (let i = 1; i <= Math.min(navigation.value.totalPages, maxPages - 1); i++) {
      pageList.push(i)
    }
    if (navigation.value.totalPages > maxPages) {
      pageList.push('...');
      pageList.push(navigation.value.totalPages)
    }
  } else if (navigation.value.currentPage >= navigation.value.totalPages - 2) {
    pageList.push(1);
    pageList.push('...')
    for (let i = navigation.value.totalPages - (maxPages - 2); i <= navigation.value.totalPages; i++) {
      pageList.push(i)
    };
  } else {
    pageList.push(1)
    pageList.push('...')
    for (let i = navigation.value.currentPage - 1; i <= navigation.value.currentPage + 1; i++) {
      pageList.push(i);
    }
    pageList.push('...')
    pageList.push(navigation.value.totalPages);
  }
  return pageList;
})

const goToPage = async (page: any) => {
  try {
    navigation.value.currentPage = page
  } catch (error) {
    console.error('Go To Page Error : ', error)
  }
};
const goToPrevious = () => {
  goToPage(navigation.value.currentPage - 1)
}
const goToNext = () => {
  goToPage(navigation.value.currentPage + 1)
}

const props = defineProps<Props>();

onMounted(async () => {
  encryptStorageRef = await encryptStoragePromise;
})

</script>

<style scoped>
td {
  padding: 0.85rem;
}

/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

ul li#pagination.selected {
  background-color: #0099AD;
  border-radius: 6px;
  color: white;
  transition: 300ms;
}

ul li.disabled {
  pointer-events: none;
  cursor: not-allowed;
  color: #D1D1DB;
}
</style>