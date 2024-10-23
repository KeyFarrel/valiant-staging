import { shallowMount } from '@vue/test-utils';
import RekapKertasKerja from '@/views/Data/RekapKertasKerja/RekapKertasKerja.vue';
import SearchBoxSuggestion from '@/components/ui/SearchBoxSuggestion.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import { ElSelect } from 'element-plus';
import { createPinia, setActivePinia } from 'pinia';

// Mocking external services and libraries
jest.mock('@/services/auth-service');

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
    expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
  });

  it('renders SearchBoxSuggestion component when listSuggestionSentral has items', async () => {
    await wrapper.setData({ listSuggestionSentral: ['Sentral 1', 'Sentral 2'] });
    expect(wrapper.findComponent(SearchBoxSuggestion).exists()).toBe(true);
  });

  it('renders ShimmerLoading component when listSuggestionSentral is empty', async () => {
    await wrapper.setData({ listSuggestionSentral: [] });
    expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(true);
  });

  it('displays ModalWrapper component when showModal is true', async () => {
    await wrapper.setData({ showModal: true });
    expect(wrapper.findComponent(ModalWrapper).exists()).toBe(true);
  });

  it('opens filter modal when Filter button is clicked', async () => {
    const filterButton = wrapper.find('#hover-button');
    await filterButton.trigger('click');
    expect(wrapper.vm.showModal).toBe(true);
  });

  it('renders ElSelect for Kategori Pembangkit with multiple options', () => {
    const kategoriSelect = wrapper.findComponent(ElSelect);
    expect(kategoriSelect.exists()).toBe(true);
    expect(kategoriSelect.attributes('multiple')).toBe('true');
  });

  it('resets all filters when reset button is clicked', async () => {
    const resetButton = wrapper.find('button[role="reset"]');
    await resetButton.trigger('click');
    expect(wrapper.vm.selectedKategoriPembangkit).toEqual([]);
    expect(wrapper.vm.selectedUmurMesin).toEqual([]);
    expect(wrapper.vm.selectedKondisiMesin).toEqual([]);
  });

  it('uploads file when Kirim button is clicked', async () => {
    wrapper.vm.uploadFile = jest.fn();
    const kirimButton = wrapper.find('button[role="submit"]');
    await kirimButton.trigger('click');
    expect(wrapper.vm.uploadFile).toHaveBeenCalled();
  });

  it('displays selected file name after a file is selected', async () => {
    const mockFile = new File(['sample content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    await wrapper.setData({ selectedFile: mockFile });
    expect(wrapper.html()).toContain('test.xlsx');
  });

  it('renders the correct number of sentral data elements', async () => {
    const mockSentralData = [
      { id_sentral: 1, sentral: 'Sentral 1', mesins: [] },
      { id_sentral: 2, sentral: 'Sentral 2', mesins: [] },
    ];
    await wrapper.setData({ sentralData: mockSentralData });
    expect(wrapper.findAll('.flex-col.w-full.p-3.border.rounded-lg').length).toBe(mockSentralData.length);
  });

  it('closes modal when on-escape event is emitted from ModalWrapper', async () => {
    await wrapper.setData({ isModalUnggahKertasKerjaOpen: true });
    const modalWrapper = wrapper.findComponent(ModalWrapper);
    modalWrapper.vm.$emit('on-escape');
    expect(wrapper.vm.isModalUnggahKertasKerjaOpen).toBe(false);
  });
});
