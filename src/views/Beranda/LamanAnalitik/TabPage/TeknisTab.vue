<template>
  <Loading v-if="isLoading" />
  <template v-else-if="itemsCategory.length !== 0">
    <!-- Grafik NCF -->
    <GraphicNCF title="Grafik Net Capacity Factor (NCF)" :items-pembangkit="itemsCategory" :items-daya="itemsDaya"
      :year-range="yearRange" :items-daya-mampu="childDmn" :initial-pembangkit="initialPembangkit" />
    <!-- Grafik EAF -->
    <GraphicEAF title="Grafik Equivalent Availability Factor (EAF)" :items-pembangkit="itemsCategory"
      :items-daya="itemsDaya" :year-range="yearRange" :items-daya-mampu="childDmn"
      :initial-pembangkit="initialPembangkit" />
    <!-- Grafik NPHR -->
    <GraphicNPHR title="Grafik Net Plant Heat Rate (NPHR)" :items-pembangkit="itemsCategory" :items-daya="itemsDaya"
      :year-range="yearRange" :items-daya-mampu="childDmn" :initial-pembangkit="initialPembangkit" />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GrafikService from "@/services/grafik-service";
import Loading from "@/components/ui/LoadingSpinner.vue";
import GraphicNCF from "@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNCF.vue";
import LamanService from "@/services/laman-service";
import GraphicNPHR from "@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNPHR.vue";
import GraphicEAF from "@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicEAF.vue";

const lamanService = new LamanService();
const grafikService = new GrafikService();
const itemsCategory = ref<{ id: string; name: string; power?: string }[]>([])
const isLoading = ref();
const initialPembangkit = ref<string[]>([])
const itemsDmn = ref<{
  [x: string]: any; id: string; name: string;
}[]>([])
const itemsDaya = ref<{ id: string; daya: string; satuan: string }[]>([])
const yearRange = ref<number[]>([])
const childDmn = ref<any[]>([])

const fetchYearRange = async () => {
  try {
    const response: any = await lamanService.getListTahunAnalitik();
    const startYear = response.data[1].tahun;
    const endYear = response.data[response.data.length - 1].tahun;
    yearRange.value = [startYear, endYear];
    console.log(yearRange.value)
  } catch (e) {
    console.log("Fetch year range Error : " + e)
  }
}

async function getCategory() {
  try {
    isLoading.value = true
    const [response, pembangkitResponse]: any[] = await Promise.all([
      grafikService.getComboKategoriPembangkit(),
      grafikService.getInitialPembangkit(),
    ])
    if (pembangkitResponse?.data) {
      initialPembangkit.value = pembangkitResponse.data.map((item: any) => item.kode_jenis_pembangkit)
    }
    if (response.success) {
      itemsCategory.value = [];
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsCategory.value.push({
            id: item.jenis_kit,
            name: item.jenis_kit
          });
          if (item.dmn) {
            item.dmn.map((child: any) => {
              if (child.daya_mampu != "")
                childDmn.value.push({
                  id: child.id_daya,
                  name: 'PLTU ' + child.daya_mampu
                });
            });
          };
        });
      };
    };
    itemsCategory.value.reverse();

    // If PLTU is not in the category list, fall back to the first available category as default
    const hasPLTU = itemsCategory.value.some(item => item.id === 'PLTU')
    if (!hasPLTU && itemsCategory.value.length > 0) {
      initialPembangkit.value = [itemsCategory.value[0].id]
    }
  } catch (e) {
    console.log("Fetch items filter Kategori Error : " + e);
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  fetchYearRange()
  getCategory()
  // getDaya()
});

</script>
