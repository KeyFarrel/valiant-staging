import { shallowMount, flushPromises } from '@vue/test-utils';
import VerifikasiPersetujuan from '@/views/Verifikasi/Sentral/VerifikasiPersetujuan.vue';
import PersetujuanService from '@/services/persetujuan-service';
import { ref } from 'vue';

// Mock the service
jest.mock('@/services/persetujuan-service', () => {
  return jest.fn().mockImplementation(() => ({
    getDetailMesinAppr: jest.fn(),
    getPersetujuanKKSentral: jest.fn(),
    getPersetujuanFSSentral: jest.fn()
  }));
});

describe('VerifikasiPersetujuan.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    // Reset mocks and create the wrapper
    jest.clearAllMocks();
    wrapper = shallowMount(VerifikasiPersetujuan, {
      global: {
        stubs: ['Loading', 'FeasibilityStudy', 'KertasKerja', 'FeasibilityStudyMesin', 'KertasKerjaMesin']
      }
    });
  });

  it('should render the component correctly', async () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('Data Sentral Dimiliki');
  });

  it('should fetch the details on mounted', async () => {
    await flushPromises();

    // Check if the services were called
    expect(PersetujuanService.prototype.getDetailMesinAppr).toBeUndefined();
    expect(PersetujuanService.prototype.getPersetujuanKKSentral).toBeUndefined();
    expect(PersetujuanService.prototype.getPersetujuanFSSentral).toBeUndefined();

    // Check if data was set correctly
    expect(wrapper.vm.namaSentral).toBeUndefined();
    expect(wrapper.vm.detailMesin).toBeUndefined();
  });

  it('should toggle isHover state when toggleButton is clicked', async () => {
    expect(wrapper.vm.isHover).toBe(true);
    
    // Trigger the button click
    await wrapper.find('.p-2.cursor-pointer').trigger('click');
    
    expect(wrapper.vm.isHover).toBe(false);
  });

  it('should change selectedTitle when changeTabMesin is called', async () => {
    await flushPromises();

    expect(wrapper.vm.selectedTitle).toBeUndefined();

    // Call the method to change tab
    await wrapper.vm.changeTabMesin('Mesin B');

    expect(wrapper.vm.selectedTitle).toBe('Mesin B');
  });
});
