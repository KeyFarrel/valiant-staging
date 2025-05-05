<template>
  <div class="w-full overflow-auto border rounded-lg whitespace-nowrap" v-if="props.dataTeknis.detail.length">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-[#0099AD] text-sm text-left border-b-2">
          <th class="sticky left-0 z-10 bg-white">No</th>
          <th class="sticky z-10 bg-white left-10">Nama</th>
          <th class="text-center" v-for="(item, index) in
            props.dataTeknis.tahun.length === 0
              ? 1
              : props.dataTeknis.tahun
" :key="index" :class="props.tahunTerakhirRealisasi ? {
  'text-warningColor': item < props.tahunTerakhirRealisasi,
  'text-primaryTextColor': item === props.tahunTerakhirRealisasi,
  'text-[#0099AD]': item > props.tahunTerakhirRealisasi,
} : null
  ">
            {{ props.dataTeknis.tahun.length === 0 ? "-" : item }} <br> <span class="text-xs font-normal">{{ index + 1
            }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in props.dataTeknis.detail" :key="index">
          <td class="sticky left-0 z-10 bg-white">{{ index + 1 }}</td>
          <td class="sticky z-10 bg-white left-10">{{ item.uraian }}</td>
          <td v-for="(items, indexs) in
            props.dataTeknis.tahun.length === 0
              ? 1
              : props.dataTeknis.tahun
" :key="indexs"
            :class="{ 'text-right': item.uraian !== 'Type of Periodic Maintenance', 'text-center': item.uraian == 'Type of Periodic Maintenance', 'bg-blue-50': items === tahunTerakhirRealisasi }">
            {{
              props.dataTeknis.tahun
                ? item["t" + items] != null
                  ? item.uraian === 'Type of Periodic Maintenance' ? item["t" + items] === 0 ? '-' :
                    getTypePeriodic(item["t" + items]) : item.uraian === 'Tahun Ke' ? item["t" + items] :
                    globalFormat.formatRupiah(item["t" + items])
                  : "-"
                : "-"
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ReloadComponent v-else-if="isFetchingError && !props.dataTeknis.detail.length" @on-click="emit('onClickReload')"
    @on-key-down="emit('onKeyDown')" />
  <ShimmerLoading v-else class="w-full h-96" />
</template>

<script setup lang="ts">
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();
import ShimmerLoading from '../ui/ShimmerLoading.vue';
import ReloadComponent from '../ui/ReloadComponent.vue';

interface Props {
  isFetchingError: boolean
  dataTeknis: {
    tahun: number[]
    detail: any[]
  }
  typePeriodic: any[]
  tahunTerakhirRealisasi?: number
}

const props = withDefaults(defineProps<Props>(), {
  isFetchingError: false
})
const emit = defineEmits(['onClickReload', 'onKeyDown']);

const getTypePeriodic = (num: number) => {
  let filteredTypePeriodic: any;
  if (props.typePeriodic.length !== 0) {
    filteredTypePeriodic = props.typePeriodic.filter((periodic: any) => periodic.id_type_periodic === num);
    return filteredTypePeriodic.length === 0 ? '-' : filteredTypePeriodic[0].kode_type_periodic;
  }
  return "-";
}
</script>

<style scoped>
th {
  font-weight: 700;
  padding: 1rem;
}

td {
  padding: 1rem;
}
</style>