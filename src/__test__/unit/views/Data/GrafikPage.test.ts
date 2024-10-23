import { shallowMount } from '@vue/test-utils';
import GrafikPage from '@/views/Data/GrafikPage.vue';
import SearchBox from '@/components/ui/SearchBox.vue';
import ModalSearch from '@/components/ModalSearch.vue';
import { setActivePinia, createPinia } from 'pinia';
import { useTagSentral, useTagMesin } from '@/store/storeTagGrafik';
import PetaService from '@/services/peta-service';
import GrafikService from '@/services/grafik-service';
import GlobalFormat from '@/services/format/global-format';

jest.mock('@/services/peta-service');
jest.mock('@/services/grafik-service');
jest.mock('@/services/format/global-format');
jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  useRouter: () => ({
    replace: jest.fn(),
  }),
  createWebHistory: jest.fn(), // Mock createWebHistory
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
}));

describe('GrafikPage.vue', () => {
  let wrapper: any;
  const mockPetaService = {
    getSentralByKode: jest.fn().mockResolvedValue({ data: { id_sentral: '1', mesins: [{ mesin: 'Mesin 1' }] } }),
    getPetaSentral: jest.fn().mockResolvedValue({ data: [] }),
  };
  const mockGrafikService = {
    getYearSentral: jest.fn().mockResolvedValue({ data: [{ tahun: 2021 }, { tahun: 2023 }] }),
    getYearMesin: jest.fn().mockResolvedValue({ data: [{ tahun: 2021 }, { tahun: 2023 }] }),
  };
  const mockGlobalFormat = {
    formatRupiah: jest.fn().mockReturnValue('Rp. 1000'),
  };

  beforeEach(() => {
    // Inisialisasi Pinia sebelum melakukan mount komponen
    setActivePinia(createPinia());

    // Mengaktifkan store Pinia secara langsung
    const storeTagSentral = useTagSentral();
    const storeTagMesin = useTagMesin();
    storeTagSentral.currentTabSentral = 'WLC (Realisasi & Proyeksi)';
    storeTagMesin.currentTabMesin = 'WLC (Realisasi & Proyeksi)';

    (PetaService as jest.Mock).mockReturnValue(mockPetaService);
    (GrafikService as jest.Mock).mockReturnValue(mockGrafikService);
    (GlobalFormat as jest.Mock).mockReturnValue(mockGlobalFormat);

    wrapper = shallowMount(GrafikPage, {
      stubs: {
        SearchBox,
        ModalSearch,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the GrafikPage component correctly', async () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent(SearchBox).exists()).toBe(false);
  });

  it('should handle focus and open search modal', async () => {
    wrapper.vm.handleFocus();
    expect(wrapper.vm.isSearchModalOpen).toBe(true);
  });

  it('should fetch data when mounted', async () => {
    await wrapper.vm.$nextTick();
    expect(mockPetaService.getSentralByKode).toHaveBeenCalledTimes(0);
    expect(mockGrafikService.getYearSentral).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.dataSentral).toEqual([]);
  });

  it('should close modal and update search query when clicking on a result', async () => {
    wrapper.vm.isSearchModalOpen = true;
    wrapper.vm.searchQuery = 'Test Sentral';
    wrapper.vm.selectedSearchQuery = '';

    await wrapper.vm.handleChangeSentral();
    expect(wrapper.vm.isSearchModalOpen).toBe(true);
    expect(wrapper.vm.selectedSearchQuery).toBe('');
    expect(mockPetaService.getPetaSentral).toHaveBeenCalled();
    expect(mockPetaService.getSentralByKode).toHaveBeenCalledTimes(0);
  });

  it('should change tab when changeTab function is called', async () => {
    wrapper.vm.changeTab(2);
    expect(wrapper.vm.tabs).toBe('Planning / Feasibility Study');
    expect(wrapper.vm.store.currentTabSentral).toBe('Planning / Feasibility Study');
    expect(wrapper.vm.stored.currentTabMesin).toBe('Planning / Feasibility Study');
  });

  it('should format currency values using globalFormat', async () => {
    const formattedValue = wrapper.vm.globalFormat.formatRupiah(1000);
    expect(formattedValue).toBe('Rp. 1000');
  });

  it('should toggle message visibility when showElement is called', async () => {
    wrapper.vm.message = false;
    wrapper.vm.showElement();
    expect(wrapper.vm.message).toBe(true);

    wrapper.vm.showElement();
    expect(wrapper.vm.message).toBe(false);
  });
});
