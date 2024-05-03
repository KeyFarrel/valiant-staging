<template>  
  <!-- <Loading v-if="isLoading" /> -->
  <div v-if="store.currentTabSentral === 'WLC (Realisasi & Proyeksi)'">
    <div class="text-xs">
      <div class="flex justify-between py-1 text-xs">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataRealisasi.wacc_on_project
            ? globalFormat.formatEnergy(dataRealisasi.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasi.irr_project > dataPlanning.fs_irr_project" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasi.irr_project < dataPlanning.fs_irr_project" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasi.irr_project == dataPlanning.fs_irr_project" class="mr-2 ml-2.5 mt-0.5" />
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.irr_project
              ? globalFormat.formatEnergy(dataRealisasi.irr_project)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
          <YoyGreenUp v-if="dataRealisasi.irr_project > dataYoy.irr_project" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasi.irr_project < dataYoy.irr_project" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasi.irr_project == dataYoy.irr_project" class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1 text-xs">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataRealisasi.wacc_on_equity
            ? globalFormat.formatEnergy(dataRealisasi.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasi.irr_equity > dataPlanning.fs_irr_equity" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasi.irr_equity < dataPlanning.fs_irr_equity" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasi.irr_equity == dataPlanning.fs_irr_equity" class="mr-2 ml-2.5 mt-0.5" />
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.irr_equity
              ? globalFormat.formatEnergy(dataRealisasi.irr_equity)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
          <YoyGreenUp v-if="dataRealisasi.irr_equity > dataYoy.irr_equity" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasi.irr_equity < dataYoy.irr_equity" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasi.irr_equity == dataYoy.irr_equity" class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1 text-xs">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasi.npv_project > dataPlanning.fs_npv_project" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasi.npv_project < dataPlanning.fs_npv_project" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasi.npv_project == dataPlanning.fs_npv_project" class="mr-2 ml-2.5 mt-0.5" />
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.npv_project
              ? globalFormat.formatRupiah(dataRealisasi.npv_project)
              : "-"
            }}
          </div>
          <p class="text-slate-500">Rp (Juta)</p>
          <YoyGreenUp v-if="dataRealisasi.npv_project > dataYoy.npv_project" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasi.npv_project < dataYoy.npv_project" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasi.npv_project == dataYoy.npv_project" class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1 text-xs">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasi.npv_equity > dataPlanning.fs_npv_equity" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasi.npv_equity < dataPlanning.fs_npv_equity" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasi.npv_equity == dataPlanning.fs_npv_equity" class="mr-2 ml-2.5 mt-0.5" />
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.npv_equity
              ? globalFormat.formatRupiah(dataRealisasi.npv_equity)
              : "-"
            }}
          </div>
          <p class="text-slate-500">Rp (Juta)</p>
          <YoyGreenUp v-if="dataRealisasi.npv_equity > dataYoy.npv_equity" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasi.npv_equity < dataYoy.npv_equity" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasi.npv_equity == dataYoy.npv_equity" class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1 text-xs">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasi.average_cf > dataPlanning.fs_average_cf" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasi.average_cf < dataPlanning.fs_average_cf" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasi.average_cf == dataPlanning.fs_average_cf" class="mr-2 ml-2.5 mt-0.5" />
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.average_cf
              ? globalFormat.formatEnergy(dataRealisasi.average_cf)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
          <YoyGreenUp v-if="dataRealisasi.average_cf > dataYoy.average_cf" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasi.average_cf < dataYoy.average_cf" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasi.average_cf == dataYoy.average_cf" class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
      <div class="flex justify-between py-1 text-xs">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <FSGreenUp v-if="dataRealisasi.average_eaf > dataPlanning.fs_average_eaf" class="mr-1" />
          <FSRedDown v-else-if="dataRealisasi.average_eaf < dataPlanning.fs_average_eaf" class="mr-1" />
          <FSRedSame v-else-if="dataRealisasi.average_eaf == dataPlanning.fs_average_eaf" class="mr-2 ml-2.5 mt-0.5" />
          <div class="mr-2 font-bold">
            {{ dataRealisasi.average_eaf
              ? globalFormat.formatEnergy(dataRealisasi.average_eaf)
              : "-" }}
          </div>
          <p class="text-slate-500">%</p>
          <YoyGreenUp v-if="dataRealisasi.average_eaf > dataYoy.average_eaf" class="ml-1" />
          <YoyRedDown v-else-if="dataRealisasi.average_eaf < dataYoy.average_eaf" class="ml-1" />
          <YoyRedSame v-else-if="dataRealisasi.average_eaf == dataYoy.average_eaf" class="mr-2 ml-2.5 mt-0.5" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="store.currentTabSentral === 'Planning / FS'">
    <div class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataPlanning.fs_wacc_on_project
            ? globalFormat.formatEnergy(dataPlanning.fs_wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataPlanning.fs_irr_project
              ? globalFormat.formatEnergy(dataPlanning.fs_irr_project)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataPlanning.fs_wacc_on_equity
            ? globalFormat.formatEnergy(dataPlanning.fs_wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataPlanning.fs_irr_equity
              ? globalFormat.formatEnergy(dataPlanning.fs_irr_equity)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataPlanning.fs_npv_project
              ? globalFormat.formatRupiah(dataPlanning.fs_npv_project)
              : "-"
            }}
          </div>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataPlanning.fs_npv_equity
              ? globalFormat.formatRupiah(dataPlanning.fs_npv_equity)
              : "-"
            }}
          </div>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataPlanning.fs_average_cf
              ? globalFormat.formatEnergy(dataPlanning.fs_average_cf)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataPlanning.fs_average_eaf
              ? globalFormat.formatEnergy(dataPlanning.fs_average_eaf)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="store.currentTabSentral === 'Planning & Realisasi + Proyeksi'">
    <div class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataRealisasi.wacc_on_project
            ? globalFormat.formatEnergy(dataRealisasi.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.irr_project
              ? globalFormat.formatEnergy(dataRealisasi.irr_project)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataRealisasi.wacc_on_equity
            ? globalFormat.formatEnergy(dataRealisasi.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.irr_equity
              ? globalFormat.formatEnergy(dataRealisasi.irr_equity)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.npv_project
              ? globalFormat.formatRupiah(dataRealisasi.npv_project)
              : "-"
            }}
          </div>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.npv_equity
              ? globalFormat.formatRupiah(dataRealisasi.npv_equity)
              : "-"
            }}
          </div>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.average_cf
              ? globalFormat.formatEnergy(dataRealisasi.average_cf)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.average_eaf
              ? globalFormat.formatEnergy(dataRealisasi.average_eaf)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="store.currentTabSentral === 'Planning vs Realisasi s/d Tahun Berjalan'">
    <div class="text-xs">
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Project</div>
          <PopUp class="ml-2" :title="'WACC On Project'" :content="dataRealisasi.wacc_on_project
            ? globalFormat.formatEnergy(dataRealisasi.wacc_on_project)
            : '-'" />
        </div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.irr_project
              ? globalFormat.formatEnergy(dataRealisasi.irr_project)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="flex">
          <div class="text-slate-500">IRR On Equity</div>
          <PopUp class="ml-2" :title="'WACC On Equity'" :content="dataRealisasi.wacc_on_equity
            ? globalFormat.formatEnergy(dataRealisasi.wacc_on_equity)
            : '-'" />
        </div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.irr_equity
              ? globalFormat.formatEnergy(dataRealisasi.irr_equity)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Project</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.npv_project
              ? globalFormat.formatRupiah(dataRealisasi.npv_project)
              : "-"
            }}
          </div>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">NPV On Equity</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.npv_equity
              ? globalFormat.formatRupiah(dataRealisasi.npv_equity)
              : "-"
            }}
          </div>
          <p class="text-slate-500">Rp (Juta)</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average NCF</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.average_cf
              ? globalFormat.formatEnergy(dataRealisasi.average_cf)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
      <div class="flex justify-between py-1">
        <div class="text-slate-500">Average EAF</div>
        <div class="flex">
          <div class="mr-2 font-bold">
            {{
              dataRealisasi.average_eaf
              ? globalFormat.formatEnergy(dataRealisasi.average_eaf)
              : "-"
            }}
          </div>
          <p class="text-slate-500">%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTagSentral } from "@/store/storeTagGrafik";
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
const store = useTagSentral();
const grafikService = new GrafikService();
const globalFormat = new GlobalFormat();
const dataPlanning = ref<PlanningItem>({});
const dataRealisasi = ref<RelProyItem>({});
const dataYoy = ref<RelProyItem>({});
const props = defineProps<Sentral>();
const tahunData = computed(() => props.tahunData);
// const idSentral = computed(() => props.idSentral);
// const dataPlanReal = ref<RelProyItem[]>([]);

interface Sentral {
  idSentral: any;
  tahunData: number;
}

interface PlanningItem {
  data: any;
  mesin: string;
  fs_wacc_on_equity: string;
  fs_wacc_on_project: string;
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
  await grafikService.getPlanning({ 
    id_sentral: props.idSentral 
  }).then((res: any) => {
  dataPlanning.value = res.data;
  });

  await grafikService.getRealisasiProyeksi({ 
    tahun: tahun, 
    id_sentral: props.idSentral })
  .then((res: any) => {
    dataRealisasi.value = res.data;
  });

  await grafikService.getRealisasiYoy({ 
    id_sentral: props.idSentral, 
    tahun: tahun -1
  }).then((res: any) => {
    dataYoy.value = res.data;
  });
  isLoading.value = false;
})
</script>

<style scoped></style>
