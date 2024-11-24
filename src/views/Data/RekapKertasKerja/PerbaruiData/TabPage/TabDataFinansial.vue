<template>
  <ModalWrapper :show-modal="isShowModalConfirmation" :width="'w-auto'" :height="'h-auto'">
    <ConfirmationDialog :title="'Konfirmasi'"
      :subtitle="'Apakah anda yakin menyimpan? \nInputan tidak dapat diubah jika sudah disimpan'"
      :button-title="'Kirim'" @on-batal-click="isShowModalConfirmation = false"
      @on-accept-click="isShowModalConfirmation = false; emit('on-save'); selectedTitle = 'Opsi Simulasi'" />
  </ModalWrapper>
  <div class="flex flex-col space-y-3">
    <div class="flex flex-col space-y-8">
      <div class="flex flex-col space-y-8">
        <div class="flex flex-col space-y-3">
          <div class="flex flex-row space-x-2">
            <div class="w-1 rounded-md bg-primaryColor"></div>
            <h3 class="text-base font-semibold">
              Cost Component A
              <span class="text-xs text-textDisabledColor">Pengisian dalam Rp (Juta)</span>
            </h3>
          </div>
          <div class="flex flex-col space-y-1.5">
            <label for="" class="text-sm font-semibold text-labelColor">Replacement Cost / Investment Cost (Cost
              Component A) <span class="text-warningColor">*</span> </label>
            <div class="flex items-center justify-start">
              <TextField @on-input="handleInputDecimalRupiah('costComponentA')" v-model="costComponentA" class="pl-9" />
              <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
            </div>
            <div class="text-xs text-warningColor" v-if="props.error?.costComponentA === true">
              Cost Component A wajib diisi
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-3" v-if="picked === 'pisah'">
          <div class="flex flex-row space-x-2">
            <div class="w-1 rounded-md bg-primaryColor"></div>
            <h3 class="text-base font-semibold">
              Cost Component B
              <span class="text-xs text-textDisabledColor">Pengisian dalam Rp (Juta)</span>
            </h3>
          </div>
          <div class="flex flex-col space-y-1.5">
            <label for="" class="text-sm font-semibold text-labelColor">Total Cost Component B <span
                class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                  'Unaudited' }}</span></label>
            <div class="flex items-center justify-start">
              <TextField @on-input="handleInputDecimalRupiah('costComponentB')" v-model="costComponentB" class="pl-9"
                :disabled="props.isIntegrasi" />
              <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
            </div>
            <div class="text-xs text-warningColor" v-if="props.error?.costComponentB === true">Total Cost
              Component
              B wajib diisi</div>
          </div>
          <div class="grid grid-cols-4 gap-3">
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Biaya Kepegawaian <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('biayaKepegawaian')" v-model="biayaKepegawaian"
                  class="pl-9" :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.biayaKepegawaian === true">
                Biaya Kepegawaian wajib diisi</div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Biaya Pemeliharaan Rutin <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('biayaPemeliharaanRutin')"
                  v-model="biayaPemeliharaanRutin" class="pl-9" :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.biayaPemeliharaanRutin === true">
                Biaya Pemeliharaan Rutin wajib diisi</div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Biaya Administrasi dan Umum <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('biayaAdministrasiUmum')" v-model="biayaAdministrasiUmum"
                  class="pl-9" :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.biayaAdministrasiUmum === true">
                Biaya Administrasi Umum wajib diisi</div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Biaya Pembelian Tenaga Listrik <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('biayaPembelianTenagaListrik')"
                  v-model="biayaPembelianTenagaListrik" class="pl-9" :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.biayaPembelianTenagaListrik === true">
                Biaya Pembelian Tenaga Listrik wajib diisi</div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Biaya Lain Lain <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('biayaLainLain')" v-model="biayaLainLain" class="pl-9"
                  :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.biayaLainLain === true">
                Biaya Lain Lain wajib diisi</div>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-3" v-else>
          <div class="flex flex-row space-x-2">
            <div class="w-1 rounded-md bg-primaryColor"></div>
            <h3 class="text-base font-semibold">
              Cost Component B dan D
              <span class="text-xs text-textDisabledColor">Pengisian dalam Rp (Juta)</span>
            </h3>
          </div>
          <div class="flex flex-col space-y-1.5">
            <label for="" class="text-sm font-semibold text-labelColor">Total Cost Component B dan D <span
                class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                  'Unaudited' }}</span></label>
            <div class="flex items-center justify-start">
              <TextField @on-input="handleInputDecimalRupiah('costComponentB')" v-model="costComponentB" class="pl-9"
                :disabled="props.isIntegrasi" />
              <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
            </div>
            <div class="text-xs text-warningColor" v-if="props.error?.costComponentB === true">Total Cost
              Component B dan D wajib diisi</div>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">O&M Cost <span class="text-warningColor">*
                </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('oMCost')" v-model="oMCost" class="pl-9"
                  :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.oMCost === true">O&M Cost wajib diisi
              </div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Periodic Maintenance Cost (Non MI)
                <span class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('periodicMaintenanceCost')"
                  v-model="periodicMaintenanceCost" class="pl-9" :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.periodicMaintenanceCost === true">
                Periodic Maintenance Cost (Non MI) Cost wajib diisi</div>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-3">
          <div class="flex flex-row space-x-2">
            <div class="w-1 rounded-md bg-primaryColor"></div>
            <h3 class="text-base font-semibold">
              Cost Component C
              <span class="text-xs text-textDisabledColor">Pengisian dalam Rp (Juta)</span>
            </h3>
          </div>
          <div class="flex flex-col space-y-1.5">
            <label for="" class="text-sm font-semibold text-labelColor">Total Cost Component C <span
                class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                  'Unaudited' }}</span></label>
            <div class="flex items-center justify-start">
              <TextField @on-input="handleInputDecimalRupiah('costComponentC')" v-model="costComponentC" class="pl-9"
                :disabled="props.isIntegrasi" />
              <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
            </div>
            <div class="text-xs text-warningColor" v-if="props.error?.costComponentC === true">Total Cost
              Component
              C wajib diisi</div>
          </div>
          <div class="grid grid-cols-4 gap-3" v-if="costComponentCDetail.length !== 0">
            <div class="flex flex-col space-y-1.5" v-for="(componentCItem, componentCIndex) in costComponentCDetail">
              <label for="" class="text-sm font-semibold text-labelColor">{{
                labelBahanBakar(componentCItem.kode_bahan_bakar) }}<span class="text-warningColor"> * </span><span
                  v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('componentCDetail', componentCIndex)" class="pl-9"
                  v-model="componentCItem.fuel_cost" :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.costComponentCDetail === true">Cost
                Component C Detail wajib diisi</div>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-3" v-if="picked === 'pisah'">
          <div class="flex flex-row space-x-2">
            <div class="w-1 rounded-md bg-primaryColor"></div>
            <h3 class="text-base font-semibold">
              Cost Component D
              <span class="text-xs text-textDisabledColor">Pengisian dalam Rp (Juta)</span>
            </h3>
          </div>
          <div class="flex flex-col space-y-1.5">
            <label for="" class="text-sm font-semibold text-labelColor">Total Cost Component D <span
                class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                  'Unaudited' }}</span></label>
            <div class="flex items-center justify-start">
              <TextField @on-input="handleInputDecimalRupiah('costComponentD')" v-model="costComponentD" class="pl-9"
                :disabled="props.isIntegrasi" />
              <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
            </div>
            <div class="text-xs text-warningColor" v-if="props.error?.costComponentD === true">Total Cost
              Component
              D wajib diisi</div>
          </div>
          <div class="grid grid-cols-4 gap-x-5">
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Biaya Minyak Pelumas <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('biayaMinyakPelumas')" v-model="biayaMinyakPelumas"
                  class="pl-9" :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.biayaMinyakPelumas === true">
                Biaya Minyak Pelumas wajib diisi</div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Biaya Bahan Kimia <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('bahanKimia')" v-model="bahanKimia" class="pl-9"
                  :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.biayaBahanKimia === true">
                Biaya Bahan Kimia wajib diisi</div>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-3">
          <div class="flex flex-row space-x-2">
            <div class="w-1 rounded-md bg-primaryColor"></div>
            <h3 class="text-base font-semibold">
              Revenue
              <span class="text-xs text-textDisabledColor">Pengisian dalam Rp (Juta)</span>
            </h3>
          </div>
          <div class="flex flex-col space-y-1.5">
            <label for="" class="text-sm font-semibold text-labelColor">Total Revenue <span class="text-warningColor">*
              </span><span v-if="props.isIntegrasi" class="text-xs"
                :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                  'Unaudited' }}</span></label>
            <div class="flex items-center justify-start">
              <TextField @on-input="handleInputDecimalRupiah('totalRevenue')" v-model="totalRevenue" class="pl-9"
                :disabled="props.isIntegrasi" />
              <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
            </div>
            <div class="text-xs text-warningColor" v-if="props.error?.totalRevenue === true">Total Revenue wajib diisi
            </div>
          </div>
          <div class="grid grid-cols-4 gap-x-5">
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Revenue Komp A <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('revenueKompA')" v-model="revenueKompA" class="pl-9"
                  :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.revenueKompA === true">
                Revenue Komp A wajib diisi</div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Revenue Komp B <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('revenueKompB')" v-model="revenueKompB" class="pl-9"
                  :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.revenueKompB === true">
                Revenue Komp B wajib diisi</div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Revenue Komp C <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('revenueKompC')" v-model="revenueKompC" class="pl-9"
                  :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.revenueKompC === true">
                Revenue Komp C wajib diisi</div>
            </div>
            <div class="flex flex-col space-y-1.5">
              <label for="" class="text-sm font-semibold text-labelColor">Revenue Komp D <span
                  class="text-warningColor">* </span><span v-if="props.isIntegrasi" class="text-xs"
                  :class="props.isAudited ? 'text-greenColor' : 'text-warningColor'">{{ props.isAudited ? 'Audited' :
                    'Unaudited' }}</span></label>
              <div class="flex items-center justify-start">
                <TextField @on-input="handleInputDecimalRupiah('revenueKompD')" v-model="revenueKompD" class="pl-9"
                  :disabled="props.isIntegrasi" />
                <label class="absolute pl-3 text-sm text-primaryColor">Rp.</label>
              </div>
              <div class="text-xs text-warningColor" v-if="props.error?.revenueKompD === true">
                Revenue Komp D wajib diisi</div>
            </div>
          </div>
        </div>
        <button
          class="px-3 py-2 ml-auto font-semibold text-white rounded-lg bg-primaryColor hover:bg-hoverColor active:outline active:outline-primaryColor hover:duration-300 active:duration-0"
          @click="isShowModalConfirmation = true">
          Kirim
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import GlobalFormat from "@/services/format/global-format";
const globalFormat = new GlobalFormat();
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.vue';
import TextField from "@/components/ui/TextField.vue";

const picked = defineModel('picked');
const costComponentA = defineModel('costComponentA');
const costComponentB = defineModel('costComponentB');
const biayaKepegawaian = defineModel('biayaKepegawaian');
const biayaPemeliharaanRutin = defineModel('biayaPemeliharaanRutin');
const biayaPeriodicMaintenance = defineModel('biayaPeriodicMaintenance');
const biayaAdministrasiUmum = defineModel('biayaAdministrasiUmum');
const biayaPembelianTenagaListrik = defineModel('biayaPembelianTenagaListrik');
const biayaLainLain = defineModel('biayaLainLain');
const oMCost = defineModel('oMCost');
const periodicMaintenanceCost = defineModel('periodicMaintenanceCost');
const costComponentC = defineModel('costComponentC');
const costComponentCDetail: any = defineModel('costComponentCDetail');
const costComponentD = defineModel('costComponentD');
const biayaMinyakPelumas = defineModel('biayaMinyakPelumas');
const bahanKimia = defineModel('bahanKimia');
const totalRevenue = defineModel('totalRevenue');
const revenueKompA = defineModel('revenueKompA');
const revenueKompB = defineModel('revenueKompB');
const revenueKompC = defineModel('revenueKompC');
const revenueKompD = defineModel('revenueKompD');
const isShowModalConfirmation = ref<boolean>(false);
const selectedTitle = inject('selectedTitle');

interface Props {
  tahun: string
  mesin: any
  isPermanent: boolean
  kodePengelola: string
  comboBahanBakar: any
  dataFinansialInit: any
  isIntegrasi: boolean
  isAudited: boolean
  error?: {
    costComponentA: boolean
    biayaInvestasiTambahan: boolean
    biayaPeriodicMaintenance: boolean
    biayaInvestasiAiAki: boolean
    costComponentB: boolean
    oMCost: boolean
    periodicMaintenanceCost: boolean
    biayaKepegawaian: boolean
    biayaPemeliharaanRutin: boolean
    biayaAdministrasiUmum: boolean
    biayaPembelianTenagaListrik: boolean
    biayaLainLain: boolean
    costComponentC: boolean
    costComponentCDetail: boolean
    costComponentD: boolean
    biayaMinyakPelumas: boolean
    biayaBahanKimia: boolean
    totalRevenue: boolean
    revenueKompA: boolean
    revenueKompB: boolean
    revenueKompC: boolean
    revenueKompD: boolean
  }
}

const props = defineProps<Props>();
const emit = defineEmits(['on-save']);

const handleInputDecimalRupiah = (targetModel: string, index?: number) => {
  switch (targetModel) {
    case 'costComponentA':
      costComponentA.value = globalFormat.formatInputDecimalRupiah(costComponentA.value);
      break;
    case 'costComponentB':
      costComponentB.value = globalFormat.formatInputDecimalRupiah(costComponentB.value);
      break;
    case 'biayaPeriodicMaintenance':
      biayaPeriodicMaintenance.value = globalFormat.formatInputDecimalRupiah(biayaPeriodicMaintenance.value);
      break;
    case 'biayaKepegawaian':
      biayaKepegawaian.value = globalFormat.formatInputDecimalRupiah(biayaKepegawaian.value);
      break;
    case 'biayaPemeliharaanRutin':
      biayaPemeliharaanRutin.value = globalFormat.formatInputDecimalRupiah(biayaPemeliharaanRutin.value);
      break;
    case 'biayaAdministrasiUmum':
      biayaAdministrasiUmum.value = globalFormat.formatInputDecimalRupiah(biayaAdministrasiUmum.value);
      break;
    case 'biayaPembelianTenagaListrik':
      biayaPembelianTenagaListrik.value = globalFormat.formatInputDecimalRupiah(biayaPembelianTenagaListrik.value);
      break;
    case 'biayaLainLain':
      biayaLainLain.value = globalFormat.formatInputDecimalRupiah(biayaLainLain.value);
      break;
    case 'costComponentC':
      costComponentC.value = globalFormat.formatInputDecimalRupiah(costComponentC.value);
      break;
    case 'oMCost':
      oMCost.value = globalFormat.formatInputDecimalRupiah(oMCost.value);
      break;
    case 'periodicMaintenanceCost':
      periodicMaintenanceCost.value = globalFormat.formatInputDecimalRupiah(periodicMaintenanceCost.value);
      break;
    case 'componentCDetail':
      costComponentCDetail.value[index ?? -1].fuel_cost = globalFormat.formatInputDecimalRupiah(costComponentCDetail.value[index ?? -1].fuel_cost);
      break;
    case 'costComponentD':
      costComponentD.value = globalFormat.formatInputDecimalRupiah(costComponentD.value);
      break;
    case 'biayaMinyakPelumas':
      biayaMinyakPelumas.value = globalFormat.formatInputDecimalRupiah(biayaMinyakPelumas.value);
      break;
    case 'bahanKimia':
      bahanKimia.value = globalFormat.formatInputDecimalRupiah(bahanKimia.value);
      break;
    case 'totalRevenue':
      totalRevenue.value = globalFormat.formatInputDecimalRupiah(totalRevenue.value);
      break;
    case 'revenueKompA':
      revenueKompA.value = globalFormat.formatInputDecimalRupiah(revenueKompA.value);
      break;
    case 'revenueKompB':
      revenueKompB.value = globalFormat.formatInputDecimalRupiah(revenueKompB.value);
      break;
    case 'revenueKompC':
      revenueKompC.value = globalFormat.formatInputDecimalRupiah(revenueKompC.value);
      break;
    case 'revenueKompD':
      revenueKompD.value = globalFormat.formatInputDecimalRupiah(revenueKompD.value);
      break;
  }
}
const labelBahanBakar = (kodeBahanBakar: any) => {
  const result = props.comboBahanBakar.filter((val: any) => val.kode_bahan_bakar === kodeBahanBakar);
  if (result.length !== 0) {
    return result[0].bahan_bakar;
  }
  return '';
}
</script>

<style scoped>
:disabled {
  background-color: #F5F5F5;
  cursor: not-allowed;
}
</style>