<template>
  <div v-if="stored.currentTabMesin === 'WLC (Realisasi & Proyeksi)'">
    <div v-if="isLoadingPlanning || isLoadingRealisasi || isLoadingYoy" class="text-xs space-y-1">
      <div v-for="n in 6" :key="n" class="flex justify-between py-1">
        <ShimmerLoading class="h-4 w-24" />
        <ShimmerLoading class="h-4 w-20" />
      </div>
    </div>
    <div v-else class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataRealisasiMesin.wacc_on_project
            ? globalFormat.formatRupiah(dataRealisasiMesin.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.irr_project) > parseFloat(dataPlanningMesin.fs_irr_project)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.irr_project) < parseFloat(dataPlanningMesin.fs_irr_project)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.irr_project) == parseFloat(dataPlanningMesin.fs_irr_project)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.irr_project === '' ? 'NUM' : globalFormat.formatRupiah(dataRealisasiMesin.irr_project)
            }}
          </p>
          <p class="text-slate-500">%</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.irr_project) > parseFloat(dataYoyMesin.irr_project)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.irr_project) < parseFloat(dataYoyMesin.irr_project)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.irr_project) == parseFloat(dataYoyMesin.irr_project)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataRealisasiMesin.wacc_on_equity
            ? globalFormat.formatRupiah(dataRealisasiMesin.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.irr_equity) > parseFloat(dataPlanningMesin.fs_irr_equity)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.irr_equity) < parseFloat(dataPlanningMesin.fs_irr_equity)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.irr_equity) == parseFloat(dataPlanningMesin.fs_irr_equity)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.irr_equity === '' ? 'NUM' : globalFormat.formatRupiah(dataRealisasiMesin.irr_equity)
            }}
          </p>
          <p class="text-slate-500">%</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.irr_equity) > parseFloat(dataYoyMesin.irr_equity)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.irr_equity) < parseFloat(dataYoyMesin.irr_equity)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.irr_equity) == parseFloat(dataYoyMesin.irr_equity)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.npv_project) > parseFloat(dataPlanningMesin.fs_npv_project)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.npv_project) < parseFloat(dataPlanningMesin.fs_npv_project)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.npv_project) == parseFloat(dataPlanningMesin.fs_npv_project)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.npv_project
                ? globalFormat.formatRupiah(dataRealisasiMesin.npv_project)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.npv_project) > parseFloat(dataYoyMesin.npv_project)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.npv_project) < parseFloat(dataYoyMesin.npv_project)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.npv_project) == parseFloat(dataYoyMesin.npv_project)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.npv_equity) > parseFloat(dataPlanningMesin.fs_npv_equity)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.npv_equity) < parseFloat(dataPlanningMesin.fs_npv_equity)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.npv_equity) == parseFloat(dataPlanningMesin.fs_npv_equity)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.npv_equity
                ? globalFormat.formatRupiah(dataRealisasiMesin.npv_equity)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.npv_equity) > parseFloat(dataYoyMesin.npv_equity)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.npv_equity) < parseFloat(dataYoyMesin.npv_equity)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.npv_equity) == parseFloat(dataYoyMesin.npv_equity)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.average_cf) > parseFloat(dataPlanningMesin.fs_average_cf)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.average_cf) < parseFloat(dataPlanningMesin.fs_average_cf)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.average_cf) == parseFloat(dataPlanningMesin.fs_average_cf)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.average_cf
                ? globalFormat.formatRupiah(dataRealisasiMesin.average_cf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.average_cf) > parseFloat(dataYoyMesin.average_cf)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.average_cf) < parseFloat(dataYoyMesin.average_cf)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.average_cf) == parseFloat(dataYoyMesin.average_cf)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <div>
            <FSGreenUp v-if="parseFloat(dataRealisasiMesin.average_eaf) > parseFloat(dataPlanningMesin.fs_average_eaf)"
              class="mr-1" />
            <FSRedDown
              v-else-if="parseFloat(dataRealisasiMesin.average_eaf) < parseFloat(dataPlanningMesin.fs_average_eaf)"
              class="mr-1" />
            <FSRedSame
              v-else-if="parseFloat(dataRealisasiMesin.average_eaf) == parseFloat(dataPlanningMesin.fs_average_eaf)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.average_eaf
                ? globalFormat.formatRupiah(dataRealisasiMesin.average_eaf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
          <div>
            <YoyGreenUp v-if="parseFloat(dataRealisasiMesin.average_eaf) > parseFloat(dataYoyMesin.average_eaf)"
              class="ml-1" />
            <YoyRedDown v-else-if="parseFloat(dataRealisasiMesin.average_eaf) < parseFloat(dataYoyMesin.average_eaf)"
              class="ml-1" />
            <YoyRedSame v-else-if="parseFloat(dataRealisasiMesin.average_eaf) == parseFloat(dataYoyMesin.average_eaf)"
              class="mr-2 ml-2.5 mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning / Feasibility Study'">
    <div v-if="isLoadingPlanning" class="text-xs space-y-1">
      <div v-for="n in 6" :key="n" class="flex justify-between py-1">
        <ShimmerLoading class="h-4 w-24" />
        <ShimmerLoading class="h-4 w-20" />
      </div>
    </div>
    <div v-else class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataPlanningMesin.fs_wacc_on_project
            ? globalFormat.formatRupiah(dataPlanningMesin.fs_wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_irr_project
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_irr_project)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataPlanningMesin.fs_wacc_on_equity
            ? globalFormat.formatRupiah(dataPlanningMesin.fs_wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_irr_equity
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_irr_equity)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_npv_project
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_npv_project)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_npv_equity
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_npv_equity)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_average_cf
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_average_cf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataPlanningMesin.fs_average_eaf
                ? globalFormat.formatRupiah(dataPlanningMesin.fs_average_eaf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning & Realisasi + Proyeksi'">
    <div v-if="isLoadingRealisasi" class="text-xs space-y-1">
      <div v-for="n in 6" :key="n" class="flex justify-between py-1">
        <ShimmerLoading class="h-4 w-24" />
        <ShimmerLoading class="h-4 w-20" />
      </div>
    </div>
    <div v-else class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataRealisasiMesin.wacc_on_project
            ? globalFormat.formatRupiah(dataRealisasiMesin.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.irr_project === '' ? 'NUM' : globalFormat.formatRupiah(dataRealisasiMesin.irr_project)
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataRealisasiMesin.wacc_on_equity
            ? globalFormat.formatRupiah(dataRealisasiMesin.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.irr_equity === '' ? 'NUM' : globalFormat.formatRupiah(dataRealisasiMesin.irr_equity)
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.npv_project
                ? globalFormat.formatRupiah(dataRealisasiMesin.npv_project)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.npv_equity
                ? globalFormat.formatRupiah(dataRealisasiMesin.npv_equity)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.average_cf
                ? globalFormat.formatRupiah(dataRealisasiMesin.average_cf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.average_eaf
                ? globalFormat.formatRupiah(dataRealisasiMesin.average_eaf)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning vs Realisasi s/d Tahun Berjalan'">
    <div v-if="isLoadingRealisasi" class="text-xs space-y-1">
      <div v-for="n in 6" :key="n" class="flex justify-between py-1">
        <ShimmerLoading class="h-4 w-24" />
        <ShimmerLoading class="h-4 w-20" />
      </div>
    </div>
    <div v-else class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.irr_project_now === '' ? 'NUM' :
                globalFormat.formatRupiah(dataRealisasiMesin.irr_project_now)
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.irr_equity_now === '' ? 'NUM' :
                globalFormat.formatRupiah(dataRealisasiMesin.irr_equity_now)
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.npv_project_now
                ? globalFormat.formatRupiah(dataRealisasiMesin.npv_project_now)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.npv_equity_now
                ? globalFormat.formatRupiah(dataRealisasiMesin.npv_equity_now)
                : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.average_cf_now
                ? globalFormat.formatRupiah(dataRealisasiMesin.average_cf_now)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
              dataRealisasiMesin.average_eaf_now
                ? globalFormat.formatRupiah(dataRealisasiMesin.average_eaf_now)
                : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useTagMesin } from "@/store/storeTagGrafik";
import GlobalFormat from "@/services/format/global-format";
import PopUp from "@/components/Grafik/PoupWacc.vue";
import FSRedDown from "@/components/icons/FSRedDown.vue";
import FSGreenUp from "@/components/icons/FSGreenUp.vue";
import FSRedSame from "@/components/icons/FSRedSame.vue";
import YoyRedDown from "@/components/icons/YoyRedDown.vue";
import YoyGreenUp from "@/components/icons/YoyGreenUp.vue";
import YoyRedSame from "@/components/icons/YoyRedSame.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
import { fetchSharedPlanningMesin, fetchSharedRealisasiProyeksiMesin, fetchSharedRealisasiYoyMesin, invalidateMesinCache } from "@/composables/useMesinSharedData";

const isLoadingPlanning = ref(false);
const isLoadingRealisasi = ref(false);
const isLoadingYoy = ref(false);
const stored = useTagMesin();
const globalFormat = new GlobalFormat();
const dataPlanningMesin = ref<PlanningItem>({});
const dataRealisasiMesin = ref<RelProyItem>({});
const dataYoyMesin = ref<RelProyItem>({});
const props = defineProps<Mesin>();
const tahunData = computed(() => props.tahunData);

interface Mesin {
  idMesin: any;
  tahunData: number;
}

interface PlanningItem {
  data: any;
  mesin: string;
  fs_wacc_on_project: string;
  fs_wacc_on_equity: string;
  fs_average_cf: string;
  fs_average_eaf: string;
  fs_irr_equity: string;
  fs_irr_project: string;
  fs_npv_equity: string;
  fs_npv_project: string;
}

interface RelProyItem {
  data: any;
  mesin: string;
  wacc_on_project: string;
  wacc_on_equity: string;
  average_cf: string;
  average_eaf: string;
  average_cf_now: string;
  average_eaf_now: string;
  irr_equity: string;
  irr_project: string;
  irr_equity_now: string;
  irr_project_now: string;
  npv_equity: string;
  npv_project: string;
  npv_equity_now: string;
  npv_project_now: string;
}

const fetchPlanningMesin = async () => {
  isLoadingPlanning.value = true;
  try {
    dataPlanningMesin.value = await fetchSharedPlanningMesin(props.idMesin, tahunData.value) ?? {};
  } catch (error) {
    console.error('Fetch Planning Mesin Error', error);
  } finally {
    isLoadingPlanning.value = false;
  }
}
const fetchRealisasiProyeksiMesin = async () => {
  isLoadingRealisasi.value = true;
  try {
    dataRealisasiMesin.value = await fetchSharedRealisasiProyeksiMesin(props.idMesin, tahunData.value) ?? {};
  } catch (error) {
    console.error('Fetch Realisasi Proyeksi Mesin Error', error);
  } finally {
    isLoadingRealisasi.value = false;
  }
}
const fetchRealisasiYoyMesin = async () => {
  isLoadingYoy.value = true;
  try {
    dataYoyMesin.value = await fetchSharedRealisasiYoyMesin(props.idMesin, tahunData.value) ?? {};
  } catch (error) {
    console.error('Fetch Realisasi Yoy Mesin Error', error);
  } finally {
    isLoadingYoy.value = false;
  }
}

watch(tahunData, async (tahun) => {
  invalidateMesinCache(props.idMesin, tahun);
  await Promise.all([
    fetchPlanningMesin(),
    fetchRealisasiProyeksiMesin(),
    fetchRealisasiYoyMesin(),
  ]);
})

onMounted(async () => {
  await Promise.all([
    fetchPlanningMesin(),
    fetchRealisasiProyeksiMesin(),
    fetchRealisasiYoyMesin(),
  ]);
})
</script>
