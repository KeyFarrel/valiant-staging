<template>
  <Loading v-if="isLoading" />
  <!-- Grafik RNFA -->
  <template v-else-if="itemsCategory.length !== 0">
    <GraphicRnfa_Ebitda title="Grafik RNFA - EBITDA MARGIN" :items-pembangkit="itemsCategory" :year-range="yearRange"
      :items-daya-mampu="childDmn" />
    <!-- Grafik CAPEX - EAF -->
    <GraphicCapex_Eaf title="Grafik CAPEX - EAF" :items-pembangkit="itemsCategory" :year-range="yearRange"
      :items-daya-mampu="childDmn" />
    <!-- Grafik CAPEX - CF -->
    <GraphicCapex_Ncf title="Grafik CAPEX - NCF" :items-pembangkit="itemsCategory" :year-range="yearRange"
      :items-daya-mampu="childDmn" />
    <!-- Grafik CAPEX - EFOR -->
    <GraphicCapex_Efor title="Grafik CAPEX - EFOR" :items-pembangkit="itemsCategory" :year-range="yearRange"
      :items-daya-mampu="childDmn" />
    <!-- Grafik B+D Daya Terpasang -->
    <GraphicOpexBd title="Grafik OPEX B+D - Daya Terpasang" :items-pembangkit="itemsCategory" :year-range="yearRange"
      :items-daya-mampu="childDmn" />
    <!-- Grafik NPHR -->
    <GraphicOpexc_Nphr title="Grafik OPEX C - NPHR" :items-pembangkit="itemsCategory" :year-range="yearRange"
      :items-daya-mampu="childDmn" />
    <!-- Grafik Biaya Komponen A -->
    <GraphicComponentA title="Grafik Biaya Komponen A" :items-pembangkit="itemsCategory" :items-daya="itemsDaya"
      :year-range="yearRange" :items-daya-mampu="childDmn" />
    <!-- Grafik Biaya Komponen B+D -->
    <GraphicComponentBD title="Grafik Biaya Komponen B + D" :items-pembangkit="itemsCategory" :items-daya="itemsDaya"
      :year-range="yearRange" :items-daya-mampu="childDmn" />
    <!-- Grafik Biaya Komponen C -->
    <GraphicComponentC title="Grafik Biaya Komponen C" :items-pembangkit="itemsCategory" :items-daya="itemsDaya"
      :year-range="yearRange" :items-daya-mampu="childDmn" />
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import GrafikService from "@/services/grafik-service";
import LamanService from "@/services/laman-service";
import Loading from "@/components/ui/LoadingSpinner.vue";
import GraphicCapex_Eaf from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Eaf.vue";
import GraphicRnfa_Ebitda from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicRnfa_Ebitda.vue";
import GraphicCapex_Ncf from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Ncf.vue";
import GraphicOpexBd from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexBd.vue";
import GraphicOpexc_Nphr from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexc_Nphr.vue";
import GraphicCapex_Efor from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Efor.vue";
import GraphicComponentA from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentA.vue";
import GraphicComponentBD from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentBD.vue";
import GraphicComponentC from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentC.vue";

const grafikService = new GrafikService();
const lamanService = new LamanService();
const isLoading = ref();
const itemsCategory = ref<{ id: string; name: string; power?: string }[]>([])
const itemsDaya = ref<{ id: string; daya: string; satuan: string }[]>([])
const itemsDmn = ref<{
  [x: string]: any; id: string; name: string;
}[]>([])
const childDmn = ref<any[]>([])
const yearRange = ref<number[]>([])

async function getCategory() {
  try {
    const response: any = await grafikService.getComboKategoriPembangkit()
    await grafikService.getFilterDaya()
    if (response.success) {
      itemsCategory.value = []
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsCategory.value.push({
            id: item.jenis_kit,
            name: item.jenis_kit
          })
          if (item.dmn) {
            item.dmn.map((child: any) => {
              if (child.daya_mampu != "")
                childDmn.value.push({
                  id: child.id_daya,
                  name: 'PLTU ' + child.daya_mampu
                })
            })
          }
        })
      }
    }
    itemsCategory.value.reverse()
  } catch (e) {
    console.log("Fetch items filter Kategori Error : " + e)
  }
}

const fetchYearRange = async () => {
  try {
    const response: any = await lamanService.getListTahunAnalitik();
    const startYear = response.data[1].tahun;
    const endYear = response.data[response.data.length - 1].tahun;
    yearRange.value = [startYear, endYear];
  } catch (error) {
    console.error("Fetch Year Range Error", error);
  }
}

onMounted(() => {
  fetchYearRange()
  getCategory()
  // getDaya()
});
</script>
