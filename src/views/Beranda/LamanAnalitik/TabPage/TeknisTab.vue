<template>
  <Loading v-if="isLoading" />
  <!-- Grafik NCF -->
  <GraphicNCF title="Grafik Net Capacity Factor (NCF)" :items-pembangkit="itemsCategory" :items-daya="itemsDaya"
    :year-range="yearRange" :items-daya-mampu="childDmn"/>
  <!-- Grafik EAF -->
  <GraphicEAF title="Grafik Equivalent Availability Factor (EAF)" :items-pembangkit="itemsCategory" :items-daya="itemsDaya" 
  :year-range="yearRange" :items-daya-mampu="childDmn"/>
  <!-- Grafik NPHR -->
  <GraphicNPHR title="Grafik Net Plant Heat Rate (NPHR)" :items-pembangkit="itemsCategory" :items-daya="itemsDaya"
    :year-range="yearRange" :items-daya-mampu="childDmn"/>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import GrafikService from "@/services/grafik-service";
import LamanService from "@/services/laman-service";
import GraphicNCF from "@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNCF.vue";
import GraphicEAF from "@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicEAF.vue";
import GraphicNPHR from "@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNPHR.vue";

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
    const res: any = await grafikService.getFilterDaya()
    if (response.success) {
      itemsCategory.value = []
      if (response.data.length > 0) {
        response.data.map((item: any) => {
          itemsCategory.value.push({
            id: item.jenis_kit,
            name: item.jenis_kit
          })
          // if (item.dmn) {
          //   item.dmn.map((child: any) => {
          //     if (child.daya_mampu != "") 
          //     itemsCategory.value.push({
          //       id: item.jenis_kit,
          //       name: `${item.jenis_kit} ${child.daya_mampu}`,
          //       power: child.daya_mampu
          //     })
          //   })
          // }
        })
        itemsDmn.value = response.data[11].dmn
          for(var i = 0; i < itemsDmn.value.length; i++) {
              if(itemsDmn.value[i].daya_mampu != ""){
                childDmn.value.push({
                  id: itemsDmn.value[i].id_daya,
                  name: 'PLTU ' + itemsDmn.value[i].daya_mampu
                })
              }
            }
      }
    }
    itemsCategory.value.reverse()
  } catch (e) {
    console.log("Fetch items filter Kategori Error : " + e)
  }
}

// async function getDaya() {
//   try {
//     const response: any = await grafikService.getFilterDaya()
//     if (response.success) {
//       if (response.data.length > 0) {
//         itemsDaya.value = response.data
//       }
//     }
//   } catch (e) {
//     console.log("Fetch items filter Daya Error : " + e)
//   }
// }

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



onMounted(async () => {
  fetchYearRange()
  getCategory()
  // getDaya()
});

</script>

<style scoped></style>
