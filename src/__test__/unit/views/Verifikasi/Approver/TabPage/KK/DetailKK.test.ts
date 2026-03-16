import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import DetailKK from '@/views/Verifikasi/Approver/TabPage/KK/DetailKK.vue';

// Mock services
vi.mock('@/services/persetujuan-service', () => ({
  default: vi.fn(function() { return {
    getPersetujuanKKSentral: vi.fn().mockResolvedValue({
      data: {
        sentral: 'Test Sentral',
        pengelola: 'Test Pengelola',
        pembina: 'Test Pembina',
        jenis_kit: 'PLTU',
        daya_terpasang: '100',
        daya_mampu: '90',
        tahun_operasi: '2020',
        umur_teknis: '25'
      }
    })
  }; })
}));

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    query: {
      uuid_sentral: 'test-uuid',
      tahun: '2023'
    }
  }))
}));

describe('DetailKK.vue', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('should render component successfully', async () => {
    wrapper = mount(DetailKK, {
      global: {
        stubs: {
          Loading: true,
          InfoHeader: true
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.flex.justify-between').exists()).toBe(true);
  });

  it('should display download evidence button', async () => {
    wrapper = mount(DetailKK, {
      global: {
        stubs: {
          Loading: true,
          InfoHeader: true
        }
      }
    });

    const downloadButton = wrapper.find('button');
    expect(downloadButton.exists()).toBe(true);
    expect(downloadButton.text()).toContain('Download Evidence');
  });

  it('should have correct initial reactive data', async () => {
    wrapper = mount(DetailKK, {
      global: {
        stubs: {
          Loading: true,
          InfoHeader: true
        }
      }
    });

    const vm = wrapper.vm;
    
    // Check reactive properties are initialized
    expect(typeof vm.isLoading).toBe('boolean');
    expect(vm.approveSentralKK).toBeDefined();
    expect(typeof vm.approveSentralKK).toBe('object');
  });
});
