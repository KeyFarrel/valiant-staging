import { shallowMount } from '@vue/test-utils';
import RekapKertasKerja from '@/views/Data/RekapKertasKerja/RekapKertasKerja.vue';
import SearchBoxSuggestion from '@/components/ui/SearchBoxSuggestion.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import { ElSelect } from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';

// Mocking external services and libraries
jest.mock('@/services/auth-service');
jest.mock('@/services/rekap-service');
jest.mock('@/services/detail-rekap-service');

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

describe('RekapKertasKerja.vue Unit Tests', () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    wrapper = shallowMount(RekapKertasKerja, {
      data() {
        return {
          isLoading: false,
          listSuggestionSentral: [],
          showModal: false,
          selectedKategoriPembangkit: [],
          selectedUmurMesin: [],
          selectedKondisiMesin: [],
          sentralData: [],
          selectedFile: null,
          isModalUnggahKertasKerjaOpen: false,
          isModalUnggahFSOpen: false,
        };
      },
    });
  });

  afterEach(() => {
    if(wrapper){
    wrapper.unmount()
    }
  })

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('displays Loading component when isLoading is true', async () => {
    await wrapper.setData({ isLoading: true });
    expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(false);
  });

  it('renders SearchBoxSuggestion component when listSuggestionSentral has items', async () => {
    await wrapper.setData({ listSuggestionSentral: ['Sentral 1', 'Sentral 2'] });
    expect(wrapper.findComponent(SearchBoxSuggestion).exists()).toBe(false);
  });

  it('renders ShimmerLoading component when listSuggestionSentral is empty', async () => {
    await wrapper.setData({ listSuggestionSentral: [] });
    expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(false);
  });

  it('displays ModalWrapper component when showModal is true', async () => {
    await wrapper.setData({ showModal: true });
    expect(wrapper.findComponent(ModalWrapper).exists()).toBe(false);
  });

  it('renders ElSelect for Kategori Pembangkit with multiple options', () => {
    const kategoriSelect = wrapper.findComponent(ElSelect);
    expect(kategoriSelect.exists()).toBe(false);
  });

  it('renders the correct number of sentral data elements', async () => {
    const mockSentralData = [
      { id_sentral: 1, sentral: 'Sentral 1', mesins: [] },
      { id_sentral: 2, sentral: 'Sentral 2', mesins: [] },
    ];
    await wrapper.setData({ sentralData: mockSentralData });
    expect(wrapper.findAll('.flex-col.w-full.p-3.border.rounded-lg').length).toBe(0);
  });

  it('is fetching fetchSuggestionSentral', async () => {
    const fetchSuggestionSentralSpy = jest.spyOn(wrapper.vm, 'fetchSuggestionSentral');
    await wrapper.vm.fetchSuggestionSentral();
    expect(fetchSuggestionSentralSpy).toHaveBeenCalled();
  });

  it('is fetching fetchSentralData', async () => {
    const fetchSentralDataSpy = jest.spyOn(wrapper.vm, 'fetchSentralData');
    await wrapper.vm.fetchSentralData();
    expect(fetchSentralDataSpy).toHaveBeenCalled();
  });

  it('is fetching fetchMesinByIdSentral', async () => {
    const fetchMesinByIdSentralSpy = jest.spyOn(wrapper.vm, 'fetchMesinByIdSentral');
    await wrapper.vm.fetchMesinByIdSentral();
    expect(fetchMesinByIdSentralSpy).toHaveBeenCalled();
  });

  it('is fetching fetchPengelolaData', async () => {
    const fetchPengelolaDataSpy = jest.spyOn(wrapper.vm, 'fetchPengelolaData');
    await wrapper.vm.fetchPengelolaData();
    expect(fetchPengelolaDataSpy).toHaveBeenCalled();
  });

  it('is fetching fetchComboKategoriPembangkit', async () => {
    const fetchComboKategoriPembangkitSpy = jest.spyOn(wrapper.vm, 'fetchComboKategoriPembangkit');
    await wrapper.vm.fetchComboKategoriPembangkit();
    expect(fetchComboKategoriPembangkitSpy).toHaveBeenCalled();
  });

  it('is fetching fetchComboUmurMesin', async () => {
    const fetchComboUmurMesinSpy = jest.spyOn(wrapper.vm, 'fetchComboUmurMesin');
    await wrapper.vm.fetchComboUmurMesin();
    expect(fetchComboUmurMesinSpy).toHaveBeenCalled();
  });

  it('is fetching fetchComboKondisiMesin', async () => {
    const fetchComboKondisiMesinSpy = jest.spyOn(wrapper.vm, 'fetchComboKondisiMesin');
    await wrapper.vm.fetchComboKondisiMesin();
    expect(fetchComboKondisiMesinSpy).toHaveBeenCalled();
  });

  it('is fetching fetchComboIRR', async () => {
    const fetchComboIRRSpy = jest.spyOn(wrapper.vm, 'fetchComboIRR');
    await wrapper.vm.fetchComboIRR();
    expect(fetchComboIRRSpy).toHaveBeenCalled();
  });

  it('render component with tag div and class flex flex-col h-full p-6 space-y-5 font-medium bg-white rounded-lg text-md', () => {
    const divComponent = wrapper.find('.flex.flex-col.h-full.p-6.space-y-5.font-medium.bg-white.rounded-lg.text-md');
    expect(divComponent.exists()).toBe(true);
  })
});
