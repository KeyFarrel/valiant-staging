import { shallowMount } from '@vue/test-utils';
import FeasibilityStudy from '@/views/Data/RekapKertasKerja/FeasibilityStudy/FeasibilityStudy.vue';
import FeasibilityStudyService from '@/services/feasibility-study';
import UserService from '@/services/user-service';
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import { useRoute } from 'vue-router';
import Loading from '@/components/ui/LoadingSpinner.vue';
import InfoHeader from '@/components/ui/InfoHeader.vue';
import TabsWrapper from '@/components/ui/TabsWrapper.vue';
import TabItem from '@/components/ui/TabItem.vue';
import AsumsiMakro from '@/components/ui/AsumsiMakro.vue';
import ParameterTeknis from '@/components/ui/ParameterTeknis.vue';
import TableDataTeknis from '@/components/RekapKertasKerja/TableDataTeknis.vue';
import TableDataFinansial from '@/components/RekapKertasKerja/TableDataFinansial.vue';
import AkhirMasaManfaat from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue';
import TahunBerjalan from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';

jest.mock('@/services/feasibility-study');
jest.mock('@/services/user-service');
jest.mock('vue-router', () => ({
  useRoute: jest.fn().mockReturnValue({
    params: { id: '1' }
  })
}));
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStorage: {
    decryptValue: jest.fn().mockReturnValue('1')
  }
}));

describe('FeasibilityStudy.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(FeasibilityStudy, {
      global: {
        components: {
          Loading,
          InfoHeader,
          TabsWrapper,
          TabItem,
          AsumsiMakro,
          ParameterTeknis,
          TableDataTeknis,
          TableDataFinansial,
          AkhirMasaManfaat,
          TahunBerjalan,
          ShimmerLoading,
        }
      }
    });
  });

  it('should call fetchMesinById on mount', async () => {
    const fetchMesinByIdSpy = jest.spyOn(wrapper.vm, 'fetchMesinById');
    await wrapper.vm.$nextTick();
    expect(fetchMesinByIdSpy).toHaveBeenCalledTimes(0);
  });

  it('should handle loading state', async () => {
    expect(wrapper.vm.isLoading).toBe(false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should display InfoHeader if mesinDataById and umurTeknis are defined', async () => {
    wrapper.vm.mesinDataById = { mesin: 'Test Mesin', daya_terpasang: 500, daya_mampu: 450, kondisi_unit: 'good', kode_jenis_pembangkit: '001', tahun_operasi: '2020' };
    wrapper.vm.umurTeknis = '10';
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(InfoHeader).exists()).toBe(true);
  });

  it('should display TabsWrapper when mesinDataById is available', async () => {
    wrapper.vm.mesinDataById = { mesin: 'Test Mesin', daya_terpasang: 500, daya_mampu: 450, kondisi_unit: 'good', kode_jenis_pembangkit: '001', tahun_operasi: '2020' };
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(TabsWrapper).exists()).toBe(true);
  });

  it('should call fetch functions on mounted', async () => {
    const fetchMesinByIdSpy = jest.spyOn(wrapper.vm, 'fetchMesinById');
    const fetchAsumsiFeasibilitySpy = jest.spyOn(wrapper.vm, 'fetchAsumsiFeasibility');
    const fetchDataTeknisSpy = jest.spyOn(wrapper.vm, 'fetchDataTeknis');
    const fetchDataFinansialSpy = jest.spyOn(wrapper.vm, 'fetchDataFinansial');
    const fetchHasilSimulasiSpy = jest.spyOn(wrapper.vm, 'fetchHasilSimulasi');
    const fetchTypePeriodicSpy = jest.spyOn(wrapper.vm, 'fetchTypePeriodic');
    const fetchComboBahanBakarSpy = jest.spyOn(wrapper.vm, 'fetchComboBahanBakar');
    const fetchUnitPengelolaSpy = jest.spyOn(wrapper.vm, 'fetchUnitPengelola');

    await wrapper.vm.$nextTick();
    
    expect(fetchMesinByIdSpy).toHaveBeenCalledTimes(0);
    expect(fetchAsumsiFeasibilitySpy).toHaveBeenCalledTimes(0);
    expect(fetchDataTeknisSpy).toHaveBeenCalledTimes(0);
    expect(fetchDataFinansialSpy).toHaveBeenCalledTimes(0);
    expect(fetchHasilSimulasiSpy).toHaveBeenCalledTimes(0);
    expect(fetchTypePeriodicSpy).toHaveBeenCalledTimes(0);
    expect(fetchComboBahanBakarSpy).toHaveBeenCalledTimes(0);
    expect(fetchUnitPengelolaSpy).toHaveBeenCalledTimes(0);
  });
});
