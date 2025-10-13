import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FeasibilityStudyMesin from '@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudyMesin.vue';

// Mock encryptStoragePromise
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: vi.fn((value) => `encrypted-${value}`)
  })
}));

// Mock TableComponent
const mockTableComponent = {
  name: 'TableComponent',
  template: `
    <div>
      <slot name="table-header"></slot>
      <slot name="table-body"></slot>
    </div>
  `,
};

// Mock RouterLink
const mockRouterLink = {
  name: 'RouterLink',
  props: ['to'],
  template: '<div><slot /></div>',
};

describe('FeasibilityStudyMesin', () => {
  let wrapper: any;

  const mockProps = {
    source: [
      {
        tahun: '2024',
        irr_on_equity: 15.5,
        npv_on_equity: 1000000,
        irr_on_project: 12.3,
        npv_on_project: 800000,
        status: 'Disetujui',
        uuid_sentral: 'test-sentral-uuid',
        uuid_mesin: 'test-mesin-uuid'
      },
      {
        tahun: '2025',
        irr_on_equity: '',
        npv_on_equity: 2000000,
        irr_on_project: 10.5,
        npv_on_project: 1500000,
        status: 'Draft',
        uuid_sentral: 'test-sentral-uuid-2',
        uuid_mesin: 'test-mesin-uuid-2'
      }
    ]
  };

  beforeEach(() => {
    wrapper = mount(FeasibilityStudyMesin, {
      props: mockProps,
      global: {
        components: {
          TableComponent: mockTableComponent,
          RouterLink: mockRouterLink,
        },
        stubs: {
          TableComponent: mockTableComponent,
          RouterLink: mockRouterLink,
        }
      }
    });
  });

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-testid="table-component"]').exists() || wrapper.text().includes('No')).toBe(true);
  });

  it('should display table data when source prop has data', () => {
    expect(wrapper.text()).toContain('2024');
    expect(wrapper.text()).toContain('2025');
    expect(wrapper.text()).toContain('Disetujui');
    expect(wrapper.text()).toContain('Draft');
  });

  it('should show empty state when source prop is empty', async () => {
    await wrapper.setProps({ source: [] });
    expect(wrapper.text()).toContain('Data Tidak Tersedia');
    expect(wrapper.text()).toContain('Silahkan lakukan pengisian atau hubungi unit terkait');
  });

  it('should generate correct pagination list for small number of pages', async () => {
    // Set navigation untuk 3 halaman (kurang dari maxPages = 5)
    wrapper.vm.navigation.totalPages = 3;
    wrapper.vm.navigation.currentPage = 1;
    await nextTick();
    
    const pageList = wrapper.vm.generatePageList;
    expect(pageList).toEqual([1, 2, 3]);
  });

  it('should generate correct pagination list for many pages with current page <= 3', async () => {
    // Set navigation untuk 10 halaman dengan current page 2
    wrapper.vm.navigation.totalPages = 10;
    wrapper.vm.navigation.currentPage = 2;
    await nextTick();
    
    const pageList = wrapper.vm.generatePageList;
    expect(pageList).toEqual([1, 2, 3, 4, '...', 10]);
  });

  it('should generate correct pagination list for many pages with current page near end', async () => {
    // Set navigation untuk 10 halaman dengan current page 9
    wrapper.vm.navigation.totalPages = 10;
    wrapper.vm.navigation.currentPage = 9;
    await nextTick();
    
    const pageList = wrapper.vm.generatePageList;
    expect(pageList).toEqual([1, '...', 7, 8, 9, 10]);
  });

  it('should generate correct pagination list for middle pages', async () => {
    // Set navigation untuk 15 halaman dengan current page 8
    wrapper.vm.navigation.totalPages = 15;
    wrapper.vm.navigation.currentPage = 8;
    await nextTick();
    
    const pageList = wrapper.vm.generatePageList;
    expect(pageList).toEqual([1, '...', 7, 8, 9, '...', 15]);
  });

  it('should navigate to page correctly', async () => {
    await wrapper.vm.goToPage(3);
    expect(wrapper.vm.navigation.currentPage).toBe(3);
  });

  it('should navigate to previous page correctly', async () => {
    wrapper.vm.navigation.currentPage = 5;
    await wrapper.vm.goToPrevious();
    expect(wrapper.vm.navigation.currentPage).toBe(4);
  });

  it('should navigate to next page correctly', async () => {
    wrapper.vm.navigation.currentPage = 3;
    await wrapper.vm.goToNext();
    expect(wrapper.vm.navigation.currentPage).toBe(4);
  });

  it('should handle error in goToPage function', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock an error scenario by temporarily breaking something
    const originalCurrentPage = wrapper.vm.navigation.currentPage;
    
    // Create a scenario that might throw an error
    Object.defineProperty(wrapper.vm.navigation, 'currentPage', {
      set: () => {
        throw new Error('Test error');
      },
      configurable: true
    });
    
    await wrapper.vm.goToPage(2);
    
    expect(consoleSpy).toHaveBeenCalledWith('Go To Page Error : ', expect.any(Error));
    
    // Restore
    Object.defineProperty(wrapper.vm.navigation, 'currentPage', {
      value: originalCurrentPage,
      writable: true,
      configurable: true
    });
    
    consoleSpy.mockRestore();
  });
});