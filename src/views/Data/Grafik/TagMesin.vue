<template>
  <!-- <Loading v-if="isLoading" /> -->
  <div v-if="stored.currentTabMesin === 'WLC (Realisasi & Proyeksi)'">
    <div class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataRealisasiMesin.wacc_on_project
            ? globalFormat.formatEnergy(dataRealisasiMesin.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasiMesin.irr_project > dataPlanningMesin.fs_irr_project" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasiMesin.irr_project < dataPlanningMesin.fs_irr_project" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasiMesin.irr_project == dataPlanningMesin.fs_irr_project"
            class="mr-2 ml-2.5 mt-0.5" />
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.irr_project
            ? globalFormat.formatEnergy(dataRealisasiMesin.irr_project)
            : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
          <YoyGreenUp v-if="dataRealisasiMesin.irr_project > dataYoyMesin.irr_project" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasiMesin.irr_project < dataYoyMesin.irr_project" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasiMesin.irr_project == dataYoyMesin.irr_project"
            class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataRealisasiMesin.wacc_on_equity
            ? globalFormat.formatEnergy(dataRealisasiMesin.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasiMesin.irr_equity > dataPlanningMesin.fs_irr_equity" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasiMesin.irr_equity < dataPlanningMesin.fs_irr_equity" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasiMesin.irr_equity == dataPlanningMesin.fs_irr_equity"
            class="mr-2 ml-2.5 mt-0.5" />
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.irr_equity
            ? globalFormat.formatEnergy(dataRealisasiMesin.irr_equity)
            : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
          <YoyGreenUp v-if="dataRealisasiMesin.irr_equity > dataYoyMesin.irr_equity" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasiMesin.irr_equity < dataYoyMesin.irr_equity" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasiMesin.irr_equity == dataYoyMesin.irr_equity" class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasiMesin.npv_project > dataPlanningMesin.fs_npv_project" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasiMesin.npv_project < dataPlanningMesin.fs_npv_project" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasiMesin.npv_project == dataPlanningMesin.fs_npv_project"
            class="mr-2 ml-2.5 mt-0.5" />
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.npv_project
            ? globalFormat.formatRupiah(dataRealisasiMesin.npv_project)
            : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
          <YoyGreenUp v-if="dataRealisasiMesin.npv_project > dataYoyMesin.npv_project" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasiMesin.npv_project < dataYoyMesin.npv_project" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasiMesin.npv_project == dataYoyMesin.npv_project"
            class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasiMesin.npv_equity > dataPlanningMesin.fs_npv_equity" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasiMesin.npv_equity < dataPlanningMesin.fs_npv_equity" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasiMesin.npv_equity == dataPlanningMesin.fs_npv_equity"
            class="mr-2 ml-2.5 mt-0.5" />
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.npv_equity
            ? globalFormat.formatRupiah(dataRealisasiMesin.npv_equity)
            : "-"
            }}
          </p>
          <p class="text-slate-500">Rp (Juta)</p>
          <YoyGreenUp v-if="dataRealisasiMesin.npv_equity > dataYoyMesin.npv_equity" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasiMesin.npv_equity < dataYoyMesin.npv_equity" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasiMesin.npv_equity == dataYoyMesin.npv_equity" class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasiMesin.average_cf > dataPlanningMesin.fs_average_cf" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasiMesin.average_cf < dataPlanningMesin.fs_average_cf" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasiMesin.average_cf == dataPlanningMesin.fs_average_cf"
            class="mr-2 ml-2.5 mt-0.5" />
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.average_cf
            ? globalFormat.formatEnergy(dataRealisasiMesin.average_cf)
            : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
          <YoyGreenUp v-if="dataRealisasiMesin.average_cf > dataYoyMesin.average_cf" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasiMesin.average_cf < dataYoyMesin.average_cf" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasiMesin.average_cf == dataYoyMesin.average_cf" class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <FSRedDown v-if="dataRealisasiMesin.average_eaf < dataPlanningMesin.fs_average_eaf" class="mr-1" />
          <FSGreenUp v-else-if="dataRealisasiMesin.average_eaf > dataPlanningMesin.fs_average_eaf" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasiMesin.average_eaf == dataPlanningMesin.fs_average_eaf"
            class="mr-2 ml-2.5 mt-0.5" />
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.average_eaf
            ? globalFormat.formatEnergy(dataRealisasiMesin.average_eaf)
            : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
          <YoyGreenUp v-if="dataRealisasiMesin.average_eaf > dataYoyMesin.average_eaf" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasiMesin.average_eaf < dataYoyMesin.average_eaf" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasiMesin.average_eaf == dataYoyMesin.average_eaf"
            class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning / FS'">
    <div class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataPlanningMesin.fs_wacc_on_project
            ? globalFormat.formatEnergy(dataPlanningMesin.fs_wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
            dataPlanningMesin.fs_irr_project
            ? globalFormat.formatEnergy(dataPlanningMesin.fs_irr_project)
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
            ? globalFormat.formatEnergy(dataPlanningMesin.fs_wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
            dataPlanningMesin.fs_irr_equity
            ? globalFormat.formatEnergy(dataPlanningMesin.fs_irr_equity)
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
            ? globalFormat.formatEnergy(dataPlanningMesin.fs_average_cf)
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
            ? globalFormat.formatEnergy(dataPlanningMesin.fs_average_eaf)
            : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning & Realisasi + Proyeksi'">
    <div class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataRealisasiMesin.wacc_on_project
            ? globalFormat.formatEnergy(dataRealisasiMesin.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.irr_project
            ? globalFormat.formatEnergy(dataRealisasiMesin.irr_project)
            : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataRealisasiMesin.wacc_on_equity
            ? globalFormat.formatEnergy(dataRealisasiMesin.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.irr_equity
            ? globalFormat.formatEnergy(dataRealisasiMesin.irr_equity)
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
            ? globalFormat.formatEnergy(dataRealisasiMesin.average_cf)
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
            ? globalFormat.formatEnergy(dataRealisasiMesin.average_eaf)
            : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="stored.currentTabMesin === 'Planning vs Realisasi s/d Tahun Berjalan'">
    <div class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataRealisasiMesin.wacc_on_project
            ? globalFormat.formatEnergy(dataRealisasiMesin.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.irr_project
            ? globalFormat.formatEnergy(dataRealisasiMesin.irr_project)
            : "-"
            }}
          </p>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataRealisasiMesin.wacc_on_equity
            ? globalFormat.formatEnergy(dataRealisasiMesin.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <p class="mr-2 font-bold">
            {{
            dataRealisasiMesin.irr_equity
            ? globalFormat.formatEnergy(dataRealisasiMesin.irr_equity)
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
            ? globalFormat.formatEnergy(dataRealisasiMesin.average_cf)
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
            ? globalFormat.formatEnergy(dataRealisasiMesin.average_eaf)
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
import { ref, computed, watch } from "vue";
import { useTagMesin } from "@/store/storeTagGrafik";
import GrafikService from "@/services/grafik-service";
import GlobalFormat from "@/services/format/global-format";
import PopUp from "@/components/Grafik/PoupWacc.vue";
import FSRedDown from "@/components/icons/FSRedDown.vue";
import FSGreenUp from "@/components/icons/FSGreenUp.vue";
import FSRedSame from "@/components/icons/FSRedSame.vue";
import YoyRedDown from "@/components/icons/YoyRedDown.vue";
import YoyGreenUp from "@/components/icons/YoyGreenUp.vue";
import YoyRedSame from "@/components/icons/YoyRedSame.vue";
// import Loading from '@/components/ui/LoadingSpinner.vue'

const isLoading = ref(false);
const stored = useTagMesin();
const grafikService = new GrafikService();
const globalFormat = new GlobalFormat();
const dataPlanningMesin = ref<PlanningItem>({});
const dataRealisasiMesin = ref<RelProyItem>({});
const dataYoyMesin = ref<RelProyItem>({});
const props = defineProps<Mesin>();
const tahunData = computed(() => props.tahunData);
// const dataPlanRealMesin = ref<RelProyItem[]>([]);
// const idMesin = computed(() => props.idMesin);

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
  irr_equity: string;
  irr_project: string;
  npv_equity: string;
  npv_project: string;
}

watch(tahunData, async (tahun) => {
  isLoading.value = true;
  await grafikService.getPlanningMesin({
    id_mesin: props.idMesin
    }).then((res: any) => {
    dataPlanningMesin.value = res.data;
  });

  await grafikService.getRealisasiProyeksiMesin({
      tahun: tahun,
      id_mesin: props.idMesin
    }).then((res: any) => {
    dataRealisasiMesin.value = res.data;
  });

  await grafikService.getRealisasiYoyMesin({
      id_mesin: props.idMesin,
      tahun: tahun -1
    }).then((res: any) => {
      dataYoyMesin.value = res.data;
  });
  isLoading.value = false;
})
</script>

<style scoped></style>
