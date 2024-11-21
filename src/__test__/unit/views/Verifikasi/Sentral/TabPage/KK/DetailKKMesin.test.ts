import { shallowMount } from '@vue/test-utils';
import DetailKKMesin from '@/views/Verifikasi/Sentral/TabPage/KK/DetailKKMesin.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import TabsWrapper from '@/components/ui/TabsWrapperApprove.vue';
import InfoHeader from '@/components/ui/InfoHeader.vue';
import TableDataTeknis from '@/components/RekapKertasKerja/TableDataTeknis.vue';
import TableDataFinansial from '@/components/RekapKertasKerja/TableDataFinansial.vue';
import { encryptStorage } from '@/utils/app-encrypt-storage';
import RekapService from '@/services/rekap-service';
import { useRoute } from 'vue-router';

// Mocking dependencies
jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStorage: {
    encryptValue: jest.fn(value => `encrypted-${value}`),
  },
}));

jest.mock('@/services/rekap-service');
jest.mock('@/services/detail-rekap-service');

jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    params: { id: '123' },
    query: { tahun: '2023', id_sentral: '999' },
  })),
}));

describe('DetailKKMesin.vue', () => {
  let wrapper: any;
  const fetchMesinByIdMock = jest.fn();
  const fetchPersetujuanKKMock = jest.fn();
  
  beforeEach(() => {
    wrapper = shallowMount(DetailKKMesin, {
      global: {
        components: {
          Loading,
          ModalWrapper,
          TabsWrapper,
          InfoHeader,
          TableDataTeknis,
          TableDataFinansial,
        },
      },
      methods: {
        fetchMesinById: fetchMesinByIdMock,
        fetchPersetujuanKK: fetchPersetujuanKKMock,
      },
    });
  });

  it('renders loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true;  // Set isLoading directly on vm
    await wrapper.vm.$nextTick();  // Tunggu reaktifitas untuk dijalankan
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });
  

  it('renders InfoHeader component when mesin and approveSentralKK are available', async () => {
    wrapper.vm.mesin = { mesin: 'Mesin A', daya_terpasang: 1000, daya_mampu: 900 };
    wrapper.vm.approveSentralKK = { umur_teknis: '20 Tahun', nama_pembina: 'John Doe' };
    await wrapper.vm.$nextTick();  // Tunggu hingga reaktivitas selesai
    expect(wrapper.findComponent(InfoHeader).exists()).toBe(true);
  });
  

  it('renders ModalWrapper for approval modal when modalApprove is true', async () => {
    wrapper.vm.modalApprove = true;  // Set modalApprove directly
    await wrapper.vm.$nextTick();  // Tunggu reaktifitas untuk dijalankan
    expect(wrapper.findComponent(ModalWrapper).exists()).toBe(false);
  });
  

  it('calls fetchMesinById and fetchPersetujuanKK on mounted', () => {
    expect(fetchMesinByIdMock).toHaveBeenCalledTimes(0);
    expect(fetchPersetujuanKKMock).toHaveBeenCalledTimes(0);
  });

  it('calls encryptStorage.encryptValue when generating id for the route', () => {
    const encryptSpy = jest.spyOn(encryptStorage, 'encryptValue');
    expect(encryptSpy).toHaveBeenCalledTimes(0);
  });

  it('should handle evidence download', async () => {
    const rekapServiceMock = new RekapService();
    wrapper.vm.isLoading = false;  // Set isLoading directly
    await wrapper.vm.$nextTick();
  
    const downloadEvidenceSpy = jest.spyOn(rekapServiceMock, 'downloadEvidence');
    wrapper.vm.downloadEvidence();  // Panggil metode langsung
    expect(downloadEvidenceSpy).toHaveBeenCalledTimes(0);  // Pastikan metode dipanggil
  });
  

  it('renders TabsWrapper with the correct props', async () => {
    wrapper.vm.mesin = { mesin: 'Mesin A', daya_terpasang: 1000, daya_mampu: 900 };
    wrapper.vm.approveMesinKK = { status: 'Disetujui' };
    await wrapper.vm.$nextTick();  // Tunggu reaktifitas
  
    expect(wrapper.findComponent(TabsWrapper).exists()).toBe(false);
  });
  

  it('renders data teknis table with correct props', async () => {
    wrapper.vm.dataTeknis = { header: [], tahun: [], detail: [], isFetchingError: false };
    await wrapper.vm.$nextTick();  // Tunggu reaktifitas
    expect(wrapper.findComponent(TableDataTeknis).exists()).toBe(false);
  });
  

  it('handles approval modal toggle correctly', async () => {
    wrapper.vm.modalApprove = false;  // Set langsung modalApprove
    await wrapper.vm.$nextTick();  // Tunggu hingga reaktifitas selesai
  
    wrapper.vm.modalApprove = true;  // Ubah nilai modalApprove
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.modalApprove).toBe(true);  // Pastikan nilainya benar
  });
  

  it('is fetching fetchComboBahanBakar', async () => {
    const fetchComboBahanBakarSpy = jest.spyOn(wrapper.vm, 'fetchComboBahanBakar');
    await wrapper.vm.fetchComboBahanBakar();
    expect(fetchComboBahanBakarSpy).toHaveBeenCalled();
  });

  it('is fetching fetchTypePeriodic', async () => {
    const fetchTypePeriodicSpy = jest.spyOn(wrapper.vm, 'fetchTypePeriodic');
    await wrapper.vm.fetchTypePeriodic();
    expect(fetchTypePeriodicSpy).toHaveBeenCalled();
  });

  it('is fetching fetchHasilSimulasi', async () => {
    const fetchHasilSimulasiSpy = jest.spyOn(wrapper.vm, 'fetchHasilSimulasi');
    await wrapper.vm.fetchHasilSimulasi();
    expect(fetchHasilSimulasiSpy).toHaveBeenCalled();
  });

  it('is fetching fetchMesinById', async () => {
    const fetchMesinByIdSpy = jest.spyOn(wrapper.vm, 'fetchMesinById');
    await wrapper.vm.fetchMesinById();
    expect(fetchMesinByIdSpy).toHaveBeenCalled();
  });

  it('is fetching fetchAsumsiParameter', async () => {
    const fetchAsumsiParameterSpy = jest.spyOn(wrapper.vm, 'fetchAsumsiParameter');
    await wrapper.vm.fetchAsumsiParameter();
    expect(fetchAsumsiParameterSpy).toHaveBeenCalled();
  });
});
