<template>
    <ComponentUpdate v-if="props.statusGrafik === 'Data sudah update'"/>
    <ComponentNoIsi v-else-if="props.statusGrafik === 'Data belum terisi'"/>
    <ComponentDraft v-else-if="props.statusGrafik === 'Draft'"/>
    <ComponentDisetujui v-else-if="props.statusGrafik === 'Disetujui'"/>
    <ComponentWaitingT1 v-else-if="props.statusGrafik === 'Menunggu Persetujuan T1'"/>
    <ComponentWaitingT2 v-else-if="props.statusGrafik === 'Menunggu Persetujuan T2'"/>
    <ComponentDitolakT1 v-else-if="props.statusGrafik === 'Ditolak T1'"/>
    <ComponentDitolakT2 v-else-if="props.statusGrafik === 'Ditolak T1'"/>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ComponentDraft from "@/components/Status/ComponentDraft.vue";
import ComponentDisetujui from "@/components/Status/ComponentDisetujui.vue";
import ComponentNoIsi from "@/components/Status/ComponentNoIsi.vue";
import ComponentUpdate from "@/components/Status/ComponentUpdate.vue";
import ComponentDitolakT1 from "@/components/Status/ComponentDitolakT1.vue";
import ComponentDitolakT2 from "@/components/Status/ComponentDitolakT2.vue";
import ComponentWaitingT1 from "@/components/Status/ComponentWaitingT1.vue";
import ComponentWaitingT2 from "@/components/Status/ComponentWaitingT2.vue";
const props = defineProps<Status>();

interface Status {
  statusGrafik: string;
}
</script>