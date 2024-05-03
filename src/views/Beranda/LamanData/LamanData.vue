<script setup lang="ts">
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import PageFinansial from "@/views/Beranda/LamanData/TabPage/PageFinansial.vue";
import PageTeknis from "@/views/Beranda/LamanData/TabPage/PageTeknis.vue";
import PageCAPEXOPEX from "@/views/Beranda/LamanData/TabPage/PageCAPEXOPEX.vue";
</script>

<template>
  <div class="bg-white px-6 rounded-lg min-h-full flex flex-col pt-2">
    <TabsWrapper :laman-data="true" :is-lihat-grafik="false" class="my-3 ml-1">
      <TabItem title="CAPEX - OPEX">
        <PageCAPEXOPEX />
      </TabItem>
      <TabItem title="Finansial">
        <PageFinansial />
      </TabItem>
      <TabItem title="Teknis">
        <PageTeknis />
      </TabItem>
    </TabsWrapper>
  </div>
</template>
