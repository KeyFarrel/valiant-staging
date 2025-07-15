<template>
  <Loading v-if="isLoading" />
  <InfoHeader v-if="approveSentralFS" :nama-mesin="approveSentralFS.sentral ? approveSentralFS.sentral : '-'"
    :nama-pengelola="approveSentralFS.pengelola ? approveSentralFS.pengelola : '-'"
    :nama-pembina="approveSentralFS.pembina ? approveSentralFS.pembina : '-'"
    :kode-jenis-pembangkit="approveSentralFS.jenis_kit ? approveSentralFS.jenis_kit : '-'"
    :daya-terpasang="approveSentralFS.daya_terpasang ? approveSentralFS.daya_terpasang.toString() : '-'"
    :daya-mampu="approveSentralFS.daya_mampu ? approveSentralFS.daya_mampu.toString() : '-'"
    :tahun-operasi="approveSentralFS.tahun_operasi ? approveSentralFS.tahun_operasi : '-'"
    :umur-teknis="approveSentralFS.umur_teknis ? approveSentralFS.umur_teknis : '-'">
  </InfoHeader>

  <!-- Download Evidence -->
  <div class="flex justify-between p-4 mt-4 bg-white rounded-lg">
    <div class="flex items-center">
      <div class="flex">
        <div class="w-1 h-7 mr-2 bg-[#0099AD]"></div>
        <p class="text-lg font-semibold">Evidence</p>
      </div>
    </div>
    <button class="flex items-center bg-white border border-[#0099AD] px-3 py-2 rounded-lg duration-300">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M6.12508 3.20964C4.75588 3.20964 3.64591 4.3196 3.64591 5.6888C3.64591 5.84688 3.66063 6.00098 3.68862 6.14997C3.74259 6.43729 3.57555 6.72018 3.2979 6.81169C2.48294 7.08026 1.89591 7.84799 1.89591 8.7513C1.89591 9.87888 2.81 10.793 3.93758 10.793H10.5001C11.386 10.793 12.1042 10.0748 12.1042 9.1888C12.1042 8.50438 11.6754 7.91867 11.0697 7.68854C10.774 7.57619 10.6217 7.24864 10.7264 6.95015C10.7686 6.83 10.7917 6.70023 10.7917 6.5638C10.7917 5.91947 10.2694 5.39714 9.62508 5.39714C9.49836 5.39714 9.37744 5.41713 9.26468 5.4537C9.11237 5.5031 8.94646 5.48772 8.80583 5.41116C8.6652 5.33461 8.56222 5.20362 8.52102 5.0489C8.23896 3.98944 7.27235 3.20964 6.12508 3.20964ZM2.47925 5.6888C2.47925 3.67526 4.11154 2.04297 6.12508 2.04297C7.62264 2.04297 8.90824 2.94548 9.46959 4.23559C9.52103 4.23219 9.57288 4.23047 9.62508 4.23047C10.9137 4.23047 11.9584 5.27514 11.9584 6.5638C11.9584 6.65152 11.9535 6.73824 11.9441 6.82366C12.7393 7.3102 13.2709 8.1869 13.2709 9.1888C13.2709 10.7191 12.0304 11.9596 10.5001 11.9596H3.93758C2.16567 11.9596 0.729248 10.5232 0.729248 8.7513C0.729248 7.50166 1.44338 6.42 2.48473 5.89018C2.48109 5.82348 2.47925 5.75633 2.47925 5.6888ZM7.00008 5.10547C7.32225 5.10547 7.58341 5.36664 7.58341 5.6888V8.21801L8.3376 7.46382C8.56541 7.23602 8.93475 7.23602 9.16256 7.46382C9.39037 7.69163 9.39037 8.06098 9.16256 8.28878L7.41256 10.0388C7.18475 10.2666 6.81541 10.2666 6.5876 10.0388L4.8376 8.28878C4.6098 8.06098 4.6098 7.69163 4.8376 7.46382C5.06541 7.23602 5.43475 7.23602 5.66256 7.46382L6.41675 8.21801V5.6888C6.41675 5.36664 6.67791 5.10547 7.00008 5.10547Z"
          fill="#0099AD" />
      </svg>
      <span class="text-[#0099AD] text-sm ml-2 font-semibold">Download Evidence</span>
    </button>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PersetujuanService from '@/services/persetujuan-service';
import Loading from "@/components/ui/LoadingSpinner.vue";
import InfoHeader from '@/components/ui/InfoHeader.vue';
import { useRoute } from 'vue-router'

const route = useRoute();
const isLoading = ref(false);
const persetujuanService = new PersetujuanService();
const approveSentralFS = ref<ListApprove>({});

interface ListApprove {
  data: any
  sentral: string
  pengelola: string
  pembina: string
  jenis_kit: string
  daya_terpasang: string
  daya_mampu: string
  tahun_operasi: string
  umur_teknis: string
}

const fetchPersetujuanFS = async () => {
  try {
    const response: ListApprove = await persetujuanService.getPersetujuanFSSentral({
      uuid_sentral: route.query.uuid_sentral
    });
    approveSentralFS.value = response.data;
  } catch (error) {
    console.error('Fetch Persetujuan FS Sentral Error : ' + error);
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchPersetujuanFS();
  isLoading.value = false;
})
</script>