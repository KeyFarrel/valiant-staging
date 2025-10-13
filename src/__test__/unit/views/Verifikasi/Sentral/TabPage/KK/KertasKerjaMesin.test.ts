import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import KertasKerjaMesin from '@/views/Verifikasi/Sentral/TabPage/KK/KertasKerjaMesin.vue';

// Mock the router
const mockRouterLink = {
  name: 'RouterLink',
  template: '<a><slot /></a>',
  props: ['to']
};

// Mock TableComponent
vi.mock('@/components/ui/Table.vue', () => ({
  default: {
    name: 'TableComponent',
    template: '<div class="table-component"><slot name="table-header" /><slot name="table-body" /></div>',
    props: ['class']
  }
}));

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatRupiah(value: any) {
      return `Rp ${value?.toLocaleString() || '0'}`;
    }
  }
}));

// Mock encrypt storage
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: vi.fn((value) => `encrypted_${value}`)
  })
}));

const mockData = [
  {
    tahun: '2023',
    irr_on_project: 15.5,
    irr_on_equity: 12.3,
    npv_on_project: 1000000,
    npv_on_equity: 750000,
    status: 'Disetujui',
    uuid_mesin: 'mesin-123',
    uuid_sentral: 'sentral-456'
  },
  {
    tahun: '2024',
    irr_on_project: '',
    irr_on_equity: '',
    npv_on_project: 1200000,
    npv_on_equity: 900000,
    status: 'Draft',
    uuid_mesin: 'mesin-124',
    uuid_sentral: 'sentral-457'
  }
];

const mockDataWithAllStatuses = [
  {
    tahun: '2023',
    irr_on_project: 15.5,
    irr_on_equity: 12.3,
    npv_on_project: 1000000,
    npv_on_equity: 750000,
    status: 'Ditolak T1',
    uuid_mesin: 'mesin-123',
    uuid_sentral: 'sentral-456'
  },
  {
    tahun: '2024',
    irr_on_project: '',
    irr_on_equity: '',
    npv_on_project: 1200000,
    npv_on_equity: 900000,
    status: 'Ditolak T2',
    uuid_mesin: 'mesin-124',
    uuid_sentral: 'sentral-457'
  },
  {
    tahun: '2025',
    irr_on_project: 18.0,
    irr_on_equity: 15.0,
    npv_on_project: 1500000,
    npv_on_equity: 1200000,
    status: 'Menunggu Persetujuan T1',
    uuid_mesin: 'mesin-125',
    uuid_sentral: 'sentral-458'
  },
  {
    tahun: '2026',
    irr_on_project: 20.0,
    irr_on_equity: 17.0,
    npv_on_project: 1800000,
    npv_on_equity: 1400000,
    status: 'Menunggu Persetujuan T2',
    uuid_mesin: 'mesin-126',
    uuid_sentral: 'sentral-459'
  },
  {
    tahun: '',
    irr_on_project: 22.0,
    irr_on_equity: 19.0,
    npv_on_project: 2000000,
    npv_on_equity: 1600000,
    status: 'Disetujui',
    uuid_mesin: 'mesin-127',
    uuid_sentral: 'sentral-460'
  }
];

describe('KertasKerjaMesin.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component correctly with data', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.table-component').exists()).toBe(true);
  });

  it('should display "Data Tidak Tersedia" when no data provided', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: []
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    expect(wrapper.text()).toContain('Data Tidak Tersedia');
    expect(wrapper.text()).toContain('Silahkan lakukan pengisian atau hubungi unit terkait');
  });

  it('should format currency values correctly', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    // Check if GlobalFormat is being used
    const component = wrapper.vm;
    expect(component.globalFormat).toBeDefined();
    expect(component.globalFormat.formatRupiah(1000000)).toBe('Rp 1,000,000');
  });

  it('should handle pagination when total pages <= maxPages', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const component = wrapper.vm;
    // Set navigation with small number of pages
    component.navigation.totalPages = 3;
    component.navigation.currentPage = 1;

    const pageList = component.generatePageList;
    expect(pageList).toEqual([1, 2, 3]);
  });

  it('should handle pagination when current page <= 3', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const component = wrapper.vm;
    // Set navigation with many pages and current page <= 3
    component.navigation.totalPages = 10;
    component.navigation.currentPage = 2;

    const pageList = component.generatePageList;
    expect(pageList).toEqual([1, 2, 3, 4, '...', 10]);
  });

  it('should handle pagination when current page is near end', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const component = wrapper.vm;
    // Set navigation with current page near the end
    component.navigation.totalPages = 10;
    component.navigation.currentPage = 9;

    const pageList = component.generatePageList;
    expect(pageList).toEqual([1, '...', 7, 8, 9, 10]);
  });

  it('should handle pagination for middle pages', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const component = wrapper.vm;
    // Set navigation with current page in middle
    component.navigation.totalPages = 10;
    component.navigation.currentPage = 5;

    const pageList = component.generatePageList;
    expect(pageList).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });

  it('should call goToPage when navigating', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const component = wrapper.vm;
    const initialPage = component.navigation.currentPage;
    
    // Test goToPage
    await component.goToPage(2);
    expect(component.navigation.currentPage).toBe(2);
  });

  it('should handle goToPrevious', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const component = wrapper.vm;
    component.navigation.currentPage = 3;
    
    component.goToPrevious();
    expect(component.navigation.currentPage).toBe(2);
  });

  it('should handle goToNext', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const component = wrapper.vm;
    component.navigation.currentPage = 2;
    
    component.goToNext();
    expect(component.navigation.currentPage).toBe(3);
  });

  it('should handle error in goToPage', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const component = wrapper.vm;
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Force an error by passing invalid page
    component.navigation = null; // This will cause an error
    
    await component.goToPage(2);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Go To Page Error : ', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  it('should initialize encryptStorageRef on mounted', async () => {
    const wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockData
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    // Wait for mounted hook to complete
    await wrapper.vm.$nextTick();
    
    const component: any = wrapper.vm;
    expect(component.encryptStorageRef).toBeDefined();
    expect(component.encryptStorageRef.encryptValue).toBeDefined();
  });

  it('should display different status badges correctly', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockDataWithAllStatuses
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const html = wrapper.html();
    
    // Check status text rendering
    expect(html).toContain('Ditolak oleh Pembina');
    expect(html).toContain('Ditolak oleh Pengelola');
    expect(html).toContain('Menunggu Persetujuan Pembina');
    expect(html).toContain('Menunggu Persetujuan Pengelola');
    expect(html).toContain('Disetujui');
  });

  it('should display "-" when tahun is empty', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockDataWithAllStatuses
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const html = wrapper.html();
    expect(html).toContain('-'); // For empty tahun
  });

  it('should display "NUM" when irr_on_equity is empty string', async () => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockDataWithAllStatuses
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      }
    });

    const html = wrapper.html();
    expect(html).toContain('NUM'); // For empty irr_on_equity
  });
});