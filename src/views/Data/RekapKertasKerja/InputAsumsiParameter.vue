<template>
  <Loading v-if="isLoading" />
  <ModalNotification :show-modal="isShowModalNotification" :animation-data="errorJsonData" :title="'Data gagal dikirim'"
    :subtitle="'Semua input wajib diisi, mohon cek kembali inputan anda'" />
  <ModalNotification :show-modal="isInsertSuccess" :animation-data="successJsonData" :title="'Data Berhasil Disimpan'"
    :subtitle="'Data telah berhasil dikirimkan'" />
  <ModalWrapper :show-modal="isShowModalConfirmation" :width="'w-auto'" :height="'h-auto'">
    <ConfirmationDialog :title="'Konfirmasi'" :subtitle="'Apakah anda yakin untuk menyimpan asumsi & parameter?'"
      :button-title="'Kirim'" @on-batal-click="isShowModalConfirmation = false"
      @on-accept-click="insertAsumsiParameter" />
  </ModalWrapper>
  <InfoHeader v-if="mesin" :nama-mesin="mesin.mesin" :nama-pengelola="namaPengelola ? namaPengelola : '-'"
    :kondisi-unit="mesin.kondisi_unit" :kode-jenis-pembangkit="mesin.kode_jenis_pembangkit"
    :daya-terpasang="mesin.daya_terpasang.toString()" :daya-mampu="mesin.daya_mampu.toString()"
    :tahun-operasi="mesin.tahun_operasi.toString()" :umur-teknis="mesin.masa_manfaat" :nama-pembina="namaPembina" />
  <div class="items-start p-6 mt-4 bg-white rounded-lg" v-if="mesin">
    <TabsWrapper :laman-data="false">
      <TabItem :title="'Asumsi Makro'">
        <TabAsumsiMakro :tahun-realisasi="tahunBerjalan" :mesin="mesin.mesin" v-model:interest-rate="interestRate"
          v-model:umur-teknis="umurTeknis" v-model:loan-tenor="loanTenor" v-model:loan-portion="loanPortion"
          :error="error.asumsi" :umur-teknis-init="masaManfaat.toString()" :is-perbarui-data="false"
          :is-realisasi-uploaded="statusRealisasi" />
      </TabItem>
      <TabItem :title="'Parameter Teknis & Finansial'">
        <TabParameterTeknis :is-realisasi-uploaded="statusRealisasi" :tahun-realisasi="tahunBerjalan" :init-value="{
          nphr: asumsiParameterInit.parameterTeknis.nphr,
          auxiliary: asumsiParameterInit.parameterTeknis.auxiliary,
          susutTrafo: asumsiParameterInit.parameterTeknis.susutTrafo,
          pemakaianSendiri: asumsiParameterInit.parameterTeknis.pemakaianSendiri,
          electricityPriceA: asumsiParameterInit.parameterTeknis.electricityPriceA,
          electricityPriceB: asumsiParameterInit.parameterTeknis.electricityPriceB,
          electricityPriceC: asumsiParameterInit.parameterTeknis.electricityPriceC,
          electricityPriceD: asumsiParameterInit.parameterTeknis.electricityPriceD
        }" :combo-bahan-bakar="comboBahanBakar" v-model:bahan-bakars="bahanBakars" :is-input-asumsi-parameter="true"
          :mesin="mesin.mesin" v-model:pickedValue="pickedParameterValue" v-model:checkedBahanBakar="checkedBahanBakar"
          v-model:nphr="nphr" v-model:auxiliary="auxiliary" v-model:susut-trafo="susutTrafo"
          v-model:pemakaian-sendiri="pemakaianSendiri" v-model:electricity-price-a="electricityPriceA"
          v-model:electricity-price-b="electricityPriceB" v-model:electricity-price-c="electricityPriceC"
          v-model:electricity-price-d="electricityPriceD" @on-checked="handleChecked"
          @on-hapus-bahan-bakar="handleHapusBahanBakar" @on-tambah-bahan-bakar="handleTambahBahanBakar"
          @on-submit="isShowModalConfirmation = true" :error="error.parameter" :is-perbarui-data="false"
          :is-integrasi="isIntegrasi" />
      </TabItem>
    </TabsWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { notifyError } from '@/services/helper/toast-notification';
import { encryptStorage } from '@/utils/app-encrypt-storage';
import router from '@/router';
import { useRoute } from 'vue-router';
const route = useRoute();
import InputAsumsiParameterService from '@/services/input-asumsi-parameter-service';
const inputAsumsiParameterService = new InputAsumsiParameterService();
import UserService from "@/services/user-service";
const userService = new UserService();
import PerbaruiDataService from '@/services/perbarui-data';
const perbaruiDataService = new PerbaruiDataService();
import TabAsumsiMakro from './PerbaruiData/TabPage/TabAsumsiMakro.vue';
import successJsonData from "@/assets/lottie/success.json";
import errorJsonData from '@/assets/lottie/error.json';
import ModalNotification from '@/components/ui/ModalNotification.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.vue';
import TabParameterTeknis from './PerbaruiData/TabPage/TabParameterTeknis.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import InfoHeader from '@/components/ui/InfoHeader.vue'
import TabsWrapper from '@/components/ui/TabsWrapper.vue';
import TabItem from '@/components/ui/TabItem.vue';
import GlobalFormat from '@/services/format/global-format';
const globalFormat = new GlobalFormat();

const nodeMode = import.meta.env.MODE;
const i = ref(2);
const isLoading = ref(false);
const isInsertSuccess = ref(false);
const isShowModalNotification = ref(false);
const isShowModalConfirmation = ref(false);
const mesin = ref();
const statusRealisasi = ref<boolean>(false);
const kodeJenisPembangkit = ref();
const asumsiParameter = ref();
const idAsumsi = ref<number>(0);
const status = ref<string>('');
const statusCode = ref();
const namaPengelola = ref<string>('');
const namaPembina = ref<string>('');
const kodeMesin = ref();
const idMesin = parseInt(nodeMode === 'production' ? encryptStorage.decryptValue(route.params.id.toString()) : route.params.id.toString());
const tahunBerjalan = new Date().getFullYear();
const interestRate = ref<string>('');
const umurTeknis = ref<string>('');
const loanTenor = ref<string>('');
const isIntegrasi = ref<boolean>(false);
const nphr = ref<string>('');
const loanPortion = ref<string>('');
const susutTrafo = ref<string>('');
const auxiliary = ref<string>('');
const electricityPriceA = ref<string>('');
const pemakaianSendiri = ref<string>('');
const electricityPriceC = ref<string>('');
const electricityPriceB = ref<string>('');
const masaManfaat = ref<any>();
const electricityPriceD = ref<string>('');
const pickedParameterValue = ref<string>('auxiliarySusut');
const asumsiParameterInit = ref<{
  asumsiMakro: {
    umurTeknis: string,
    interestRate: string,
    loanPortion: string,
    loanTenor: string,
  },
  parameterTeknis: {
    auxiliary: string,
    nphr: string,
    pemakaianSendiri: string,
    susutTrafo: string,
    electricityPriceB: string,
    electricityPriceA: string,
    electricityPriceD: string,
    electricityPriceC: string,
  }
}>({
  asumsiMakro: {
    umurTeknis: '',
    interestRate: '',
    loanPortion: '',
    loanTenor: '',
  },
  parameterTeknis: {
    auxiliary: '',
    nphr: '',
    pemakaianSendiri: '',
    electricityPriceA: '',
    susutTrafo: '',
    electricityPriceC: '',
    electricityPriceD: '',
    electricityPriceB: '',
  }
});
const error = ref<{
  asumsi: {
    umurTeknis: boolean,
    interestRate: boolean,
    loanPortion: boolean
    loanTenor: boolean,
  },
  parameter: {
    auxiliary: boolean,
    nphr: boolean,
    pemakaianSendiri: boolean,
    susutTrafo: boolean,
    electricityPriceB: boolean,
    electricityPriceA: boolean,
    electricityPriceC: boolean,
    bahanBakar: boolean
    electricityPriceD: boolean,
  }
}>({
  asumsi: {
    umurTeknis: false,
    interestRate: false,
    loanPortion: false,
    loanTenor: false,
  },
  parameter: {
    auxiliary: false,
    nphr: false,
    pemakaianSendiri: false,
    susutTrafo: false,
    electricityPriceB: false,
    electricityPriceA: false,
    electricityPriceD: false,
    bahanBakar: false,
    electricityPriceC: false,
  }
});
const comboBahanBakar = ref<any>([]);
const checkedBahanBakar = ref<number[]>([]);
const bahanBakars = ref<any[]>([
  {
    id: 1,
    id_mesin: idMesin,
    tahun: tahunBerjalan.toString(),
    kode_bahan_bakar: "",
    harga_bahan_bakar: "",
    sfc: "",
    flag_bahan_bakar: 1,
  }
]);

const fetchCheckIntegrasi = async () => {
  try {
    const response: any = await perbaruiDataService.getCheckIntegrasi(tahunBerjalan - 1, idMesin);
    isIntegrasi.value = response.data[0].status_data_integrasi !== "0";
    console.log(isIntegrasi.value, 'dds');
  } catch (error) {
    console.error('Fetch Check Integrasi Error : ' + error)
  }
}
const fetchMesinById = async () => {
  try {
    const response: any = await inputAsumsiParameterService.getMesinById(
      idMesin
    );
    mesin.value = response.data;
    kodeJenisPembangkit.value = response.data.kode_jenis_pembangkit;
    kodeMesin.value = response.data.kode_mesin;
    masaManfaat.value = response.data.masa_manfaat;
    umurTeknis.value = response.data.masa_manfaat;
  } catch (error) {
    console.error(error);
  }
};
const fetchStatusRealisasiById = async () => {
  try {
    const response: any = await inputAsumsiParameterService.getStatusRealisasiById(idMesin);
    statusRealisasi.value = response.data[0].status_kk;
  } catch (error) {
    console.error('Fetch Combo Bahan Bakar Error : ' + error);
  }
}
const fetchAsumsiParameter = async (isCreate: boolean) => {
  try {
    const response: any = await inputAsumsiParameterService.getAsumsiMakroData(
      tahunBerjalan - 1,
      idMesin,
      tahunBerjalan
    )
    if (isCreate !== true) {
      if (response.code === 200) {
        const tempBahanBakars = response.data.harga_bahan_bakars.map((value: any) => {
          const newValue = { ...value };
          newValue.id = i.value++;
          newValue.harga_bahan_bakar = globalFormat.formatCurrencyNotFixed(newValue.harga_bahan_bakar.toString());
          newValue.sfc = globalFormat.formatCurrencyNotFixed(newValue.sfc.toString());
          return newValue;
        });
        umurTeknis.value = masaManfaat.value.toString();
        interestRate.value = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.interest_rate.toString());
        loanPortion.value = globalFormat.formatCurrencyNotFixed(response.data.asumsi_makro.loan_portion.toString());
        loanTenor.value = response.data.asumsi_makro.loan_tenor.toString();
        auxiliary.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.auxiliary.toString());
        nphr.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.nphr.toString());
        pemakaianSendiri.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.ps.toString());
        susutTrafo.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.susut_trafo.toString());
        electricityPriceB.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_b_rp_per_kwbln.toString());
        electricityPriceA.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_a_rp_per_kwbln.toString());
        electricityPriceD.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_d_rp_per_kwh.toString());
        electricityPriceC.value = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_c_rp_per_kwh.toString());
        asumsiParameterInit.value.parameterTeknis.auxiliary = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.auxiliary.toString());
        asumsiParameterInit.value.parameterTeknis.nphr = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.nphr.toString());
        asumsiParameterInit.value.parameterTeknis.pemakaianSendiri = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.ps.toString());
        asumsiParameterInit.value.parameterTeknis.susutTrafo = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.susut_trafo.toString());
        asumsiParameterInit.value.parameterTeknis.electricityPriceB = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_b_rp_per_kwbln.toString());
        asumsiParameterInit.value.parameterTeknis.electricityPriceA = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_a_rp_per_kwbln.toString());
        asumsiParameterInit.value.parameterTeknis.electricityPriceD = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_d_rp_per_kwh.toString());
        asumsiParameterInit.value.parameterTeknis.electricityPriceC = globalFormat.formatCurrencyNotFixed(response.data.parameter_teknis_financial.electricity_price_c_rp_per_kwh.toString());
        pickedParameterValue.value = pemakaianSendiri.value === '0,00' ? 'auxiliarySusut' : 'pemakaianSendiri';
        bahanBakars.value = tempBahanBakars;
      }
    }
    asumsiParameter.value = response.data;
    if (response.data.tahun === tahunBerjalan) {
      status.value = response.data.status;
      idAsumsi.value = response.data.id_asumsi;
      statusCode.value = response.code;
    }
  } catch (error) {
    console.error('Fetch Asumsi Parameter Error : ', error);
  }
}
const fetchListPembina = async () => {
  try {
    const response: any = await userService.getPembina('');
    return response.data;
  } catch (error) {
    console.error('Fetch Pembina Error : ' + error)
  }
}
const fetchComboBahanBakar = async () => {
  try {
    const response: any = await inputAsumsiParameterService.getComboBahanBakar(kodeJenisPembangkit.value);
    comboBahanBakar.value = response.data;
  } catch (error) {
    console.error('Fetch Combo Bahan Bakar Error : ' + error);
  }
}
function handleHapusBahanBakar() {
  if (checkedBahanBakar.value.length) {
    checkedBahanBakar.value.forEach((checkedItemId) => {
      const result = bahanBakars.value.findIndex((checkbox) => checkbox.id === checkedItemId);
      if (result !== -1) {
        bahanBakars.value.splice(result, 1);
      }
    });
    checkedBahanBakar.value = [];
  }
}
const fetchUnitPengelola = async () => {
  try {
    if (mesin.value) {
      const kodeSentral = mesin.value.kode_sentral
      const pembangkitResponse: any =
        await inputAsumsiParameterService.getPembangkitByKode(kodeSentral)
      const kodePengelola = pembangkitResponse.data.kode_pengelola
      const pengelolaResponse: any =
        await inputAsumsiParameterService.getPengelolaData()
      const pengelola = pengelolaResponse.data.filter(
        (pengelola: any) => pengelola.kode_pengelola === kodePengelola
      )
      namaPengelola.value = pengelola[0].pengelola
      const idPembina = pembangkitResponse.data.id_pembina
      const pembinaList: any = await fetchListPembina()
      namaPembina.value = pembinaList.find((pembina: any) => pembina.id_pembina === idPembina).pembina
    }
  } catch (error) {
    console.error("Fetch Unit Pengelola Error : " + error)
  }
};
function handleTambahBahanBakar() {
  bahanBakars.value.push({
    id: i.value++,
    id_mesin: idMesin,
    tahun: tahunBerjalan,
    kode_bahan_bakar: "",
    harga_bahan_bakar: "",
    sfc: "",
    flag_bahan_bakar: 0,
  })
}
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
function handleChecked() {
  console.log('Handle Checked ' + checkedBahanBakar.value);
}
const insertAsumsiParameter = async () => {
  try {
    isShowModalConfirmation.value = false
    const errorAsumsiInput = error.value.asumsi
    const errorParameterTeknis = error.value.parameter
    if (interestRate.value === '') {
      errorAsumsiInput.interestRate = true
    } else {
      errorAsumsiInput.interestRate = false
    }
    if (umurTeknis.value === '') {
      errorAsumsiInput.umurTeknis = true
    } else {
      errorAsumsiInput.umurTeknis = false
    }
    if (loanTenor.value === '') {
      errorAsumsiInput.loanTenor = true
    } else {
      errorAsumsiInput.loanTenor = false
    }
    if (loanPortion.value === '') {
      errorAsumsiInput.loanPortion = true
    } else {
      errorAsumsiInput.loanPortion = false
    }
    if (nphr.value === '') {
      errorParameterTeknis.nphr = true
    } else {
      errorParameterTeknis.nphr = false
    }
    if (auxiliary.value === '') {
      errorParameterTeknis.auxiliary = true
    } else {
      errorParameterTeknis.auxiliary = false
    }
    if (susutTrafo.value === '') {
      errorParameterTeknis.susutTrafo = true
    } else {
      errorParameterTeknis.susutTrafo = false
    }
    if (pemakaianSendiri.value === '') {
      errorParameterTeknis.pemakaianSendiri = true
    } else {
      errorParameterTeknis.pemakaianSendiri = false
    }
    // } else if (pickedParameterValue.value === 'pemakaianSendiri') {
    //   if (pemakaianSendiri.value === '') {
    //     errorParameterTeknis.pemakaianSendiri = true
    //     errorParameterTeknis.auxiliary = false
    //     errorParameterTeknis.susutTrafo = false
    //   } else {
    //     errorParameterTeknis.pemakaianSendiri = false
    //     errorParameterTeknis.auxiliary = false
    //     errorParameterTeknis.susutTrafo = false
    //   }
    // }
    if (electricityPriceA.value === '') {
      errorParameterTeknis.electricityPriceA = true
    } else {
      errorParameterTeknis.electricityPriceA = false
    }
    if (electricityPriceB.value === '') {
      errorParameterTeknis.electricityPriceB = true
    } else {
      errorParameterTeknis.electricityPriceB = false
    }
    if (electricityPriceC.value === '') {
      errorParameterTeknis.electricityPriceC = true
    } else {
      errorParameterTeknis.electricityPriceC = false
    }
    if (electricityPriceD.value === '') {
      errorParameterTeknis.electricityPriceD = true
    } else {
      errorParameterTeknis.electricityPriceD = false
    }
    if (bahanBakars.value.some(obj => Object.values(obj).some(value => value === ""))) {
      errorParameterTeknis.bahanBakar = true
    } else {
      errorParameterTeknis.bahanBakar = false
    }
    if (Object.values(errorAsumsiInput).some(value => value === true) || Object.values(errorParameterTeknis).some(value => value === true)) {
      isShowModalNotification.value = true
      await wait(5000)
      isShowModalNotification.value = false
    } else {
      isLoading.value = true
      for (const item of bahanBakars.value) {
        delete item.id
      }
      const finalInterestRate = interestRate.value.includes('.') ? interestRate.value.replace(/[.]/g, '') : interestRate.value
      const finalLoanPortion = loanPortion.value.includes('.') ? loanPortion.value.replace(/[.]/g, '') : loanPortion.value
      if (idAsumsi.value !== 0) {
        const formAsumsiUpdate = {
          id_asumsi: idAsumsi.value,
          tahun: tahunBerjalan,
          tahun_realisasi: tahunBerjalan - 1,
          id_mesin: parseInt(idMesin.toString()),
          umur_teknis: parseInt(masaManfaat.value),
          interest_rate: parseFloat(finalInterestRate.replace(/,/g, '.')),
          loan_portion: parseFloat(finalLoanPortion.replace(/,/g, '.')),
          loan_tenor: parseInt(loanTenor.value),
        }
        await inputAsumsiParameterService.updateAsumsi(formAsumsiUpdate)
        const finalBahanBakars = bahanBakars.value.map(value => {
          let newValue = { ...value }
          let finalHargaBahanBakar = newValue.harga_bahan_bakar.includes('.') ? newValue.harga_bahan_bakar.replace(/[.]/g, '') : newValue.harga_bahan_bakar
          newValue.harga_bahan_bakar = parseFloat(finalHargaBahanBakar.replace(/,/g, '.'))
          let finalSFC = newValue.sfc.includes('.') ? newValue.sfc.replace(/[.]/g, '') : newValue.sfc
          newValue.sfc = parseFloat(finalSFC.replace(/,/g, '.'))
          newValue.tahun = (tahunBerjalan - 1).toString()
          return newValue
        });
        const finalAuxiliary = auxiliary.value.includes('.') ? auxiliary.value.replace(/[.]/g, '') : auxiliary.value;
        const finalNPHR = nphr.value.includes('.') ? nphr.value.replace(/[.]/g, '') : nphr.value;
        const finalPemakaianSendiri = pemakaianSendiri.value.includes('.') ? pemakaianSendiri.value.replace(/[.]/g, '') : pemakaianSendiri.value;
        const finalSusutTrafo = susutTrafo.value.includes('.') ? susutTrafo.value.replace(/[.]/g, '') : susutTrafo.value;
        const finalElecB = electricityPriceB.value.includes('.') ? electricityPriceB.value.replace(/[.]/g, '') : electricityPriceB.value;
        const finalElecA = electricityPriceA.value.includes('.') ? electricityPriceA.value.replace(/[.]/g, '') : electricityPriceA.value;
        const finalElecD = electricityPriceD.value.includes('.') ? electricityPriceD.value.replace(/[.]/g, '') : electricityPriceD.value;
        const finalElecC = electricityPriceC.value.includes('.') ? electricityPriceC.value.replace(/[.]/g, '') : electricityPriceC.value;
        console.log(bahanBakars.value, 'BahanBakars');
        console.log(finalBahanBakars, 'Final')
        const formParameterUpdate = {
          id_mesin: parseInt(idMesin.toString()),
          tahun_realisasi: tahunBerjalan - 1,
          id_asumsi: idAsumsi.value,
          auxiliary: parseFloat(finalAuxiliary.replace(/,/g, '.')),
          nphr: parseFloat(finalNPHR.replace(/,/g, '.')),
          tahun: tahunBerjalan,
          susut_trafo: parseFloat(finalSusutTrafo.replace(/,/g, '.')),
          electricity_price_b_rp_per_kwbln: parseFloat(finalElecB.replace(/,/g, '.')),
          ps: parseFloat(finalPemakaianSendiri.replace(/,/g, '.')),
          electricity_price_d_rp_per_kwh: parseFloat(finalElecD.replace(/,/g, '.')),
          harga_bahan_bakars: finalBahanBakars,
          electricity_price_a_rp_per_kwbln: parseFloat(finalElecA.replace(/,/g, '.')),
          electricity_price_c_rp_per_kwh: parseFloat(finalElecC.replace(/,/g, '.')),
        }
        await inputAsumsiParameterService.createParameter(formParameterUpdate);
        isLoading.value = false;
        isInsertSuccess.value = true;
        await wait(3000);
        router.replace({ path: '/rekap-kertas-kerja' });
      } else {
        const formAsumsiCreate = {
          tahun: tahunBerjalan,
          tahun_realisasi: tahunBerjalan - 1,
          id_mesin: parseInt(idMesin.toString()),
          interest_rate: parseFloat(finalInterestRate.replace(/,/g, '.')),
          umur_teknis: parseInt(masaManfaat.value),
          loan_tenor: parseInt(loanTenor.value),
          loan_portion: parseFloat(finalLoanPortion.replace(/,/g, '.')),
          status_fs: 0
        }
        await inputAsumsiParameterService.createAsumsi(formAsumsiCreate);
        await fetchAsumsiParameter(true);
        const finalAuxiliary = auxiliary.value.includes('.') ? auxiliary.value.replace(/[.]/g, '') : auxiliary.value;
        const finalNPHR = nphr.value.includes('.') ? nphr.value.replace(/[.]/g, '') : nphr.value;
        const finalPemakaianSendiri = pemakaianSendiri.value.includes('.') ? pemakaianSendiri.value.replace(/[.]/g, '') : pemakaianSendiri.value;
        const finalSusutTrafo = susutTrafo.value.includes('.') ? susutTrafo.value.replace(/[.]/g, '') : susutTrafo.value;
        const finalElecB = electricityPriceB.value.includes('.') ? electricityPriceB.value.replace(/[.]/g, '') : electricityPriceB.value;
        const finalElecA = electricityPriceA.value.includes('.') ? electricityPriceA.value.replace(/[.]/g, '') : electricityPriceA.value;
        const finalElecD = electricityPriceD.value.includes('.') ? electricityPriceD.value.replace(/[.]/g, '') : electricityPriceD.value;
        const finalElecC = electricityPriceC.value.includes('.') ? electricityPriceC.value.replace(/[.]/g, '') : electricityPriceC.value;
        const finalBahanBakars = bahanBakars.value.map(value => {
          let newValue = { ...value };
          let finalHargaBahanBakar = newValue.harga_bahan_bakar.includes('.') ? newValue.harga_bahan_bakar.replace(/[.]/g, '') : newValue.harga_bahan_bakar;
          newValue.harga_bahan_bakar = parseFloat(finalHargaBahanBakar.replace(/,/g, '.'));
          let finalSFC = newValue.sfc.includes('.') ? newValue.sfc.replace(/[.]/g, '') : newValue.sfc;
          newValue.sfc = parseFloat(finalSFC.replace(/,/g, '.'));
          newValue.tahun = (tahunBerjalan - 1).toString();
          return newValue;
        });
        const formParameterCreate = {
          id_mesin: parseInt(idMesin.toString()),
          id_asumsi: idAsumsi.value,
          tahun_realisasi: tahunBerjalan - 1,
          tahun: tahunBerjalan,
          auxiliary: parseFloat(finalAuxiliary.replace(/,/g, '.')),
          nphr: parseFloat(finalNPHR.replace(/,/g, '.')),
          ps: parseFloat(finalPemakaianSendiri.replace(/,/g, '.')),
          susut_trafo: parseFloat(finalSusutTrafo.replace(/,/g, '.')),
          electricity_price_b_rp_per_kwbln: parseFloat(finalElecB.replace(/,/g, '.')),
          electricity_price_a_rp_per_kwbln: parseFloat(finalElecA.replace(/,/g, '.')),
          electricity_price_d_rp_per_kwh: parseFloat(finalElecD.replace(/,/g, '.')),
          harga_bahan_bakars: finalBahanBakars,
          electricity_price_c_rp_per_kwh: parseFloat(finalElecC.replace(/,/g, '.')),
        }
        await inputAsumsiParameterService.createParameter(formParameterCreate);
        isLoading.value = false;
        isInsertSuccess.value = true;
        await wait(3000);
        router.replace({ path: '/rekap-kertas-kerja' });
      }
    }
  } catch (error: any) {
    if (error.response.data.code === 400) {
      notifyError('Data gagal dikirim, mohon coba lagi nanti', 5000);
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchStatusRealisasiById();
  await fetchMesinById();
  await fetchCheckIntegrasi();
  await fetchAsumsiParameter(false);
  await fetchUnitPengelola();
  await fetchComboBahanBakar();
  isLoading.value = false;
})
</script>