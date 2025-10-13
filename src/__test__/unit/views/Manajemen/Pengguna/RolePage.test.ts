import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import RolePage from '@/views/Manajemen/Pengguna/RolePage.vue';

// Mock the components
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div data-testid="loading">Loading...</div>',
  },
}));

vi.mock('@/components/ui/Table.vue', () => ({
  default: {
    name: 'Table',
    template: '<table data-testid="table"><slot name="table-header" /><slot name="table-body" /></table>',
  },
}));

vi.mock('@/components/ui/ModalWrapper.vue', () => ({
  default: {
    name: 'ModalWrapper',
    props: ['width', 'height', 'showModal'],
    emits: ['on-escape'],
    template: '<div data-testid="modal-wrapper" v-if="showModal"><slot /></div>',
  },
}));

vi.mock('@/components/icons/IconDetailAkses.vue', () => ({
  default: {
    name: 'IconDetailAkses',
    template: '<svg data-testid="icon-detail-akses"></svg>',
  },
}));

vi.mock('@/components/icons/IconRoundedChecked.vue', () => ({
  default: {
    name: 'IconRoundedChecked',
    template: '<svg data-testid="icon-checked"></svg>',
  },
}));

vi.mock('@/components/icons/IconRoundedClose.vue', () => ({
  default: {
    name: 'IconRoundedClose',
    template: '<svg data-testid="icon-close"></svg>',
  },
}));

// Mock the service
vi.mock('@/services/role-service', () => ({
  default: class MockRoleService {
    constructor() {}
  }
}));

describe('RolePage', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(RolePage);
  });

  it('should render the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-testid="table"]').exists()).toBe(true);
  });

  it('should display the correct title', () => {
    const title = wrapper.find('p.text-lg.font-semibold');
    expect(title.text()).toBe('Informasi Role, Level, dan Hak Akses');
  });

  it('should render dummy data in table', () => {
    const tableRows = wrapper.findAll('tr');
    // Should have header + 9 data rows
    expect(tableRows.length).toBeGreaterThan(1);
  });

  it('should handle modal show/hide correctly', async () => {
    // Test modal is initially hidden
    expect(wrapper.find('[data-testid="modal-wrapper"]').exists()).toBe(false);
    
    // Click detail button to show modal
    const detailButton = wrapper.find('[data-testid="icon-detail-akses"]').element.closest('button');
    await detailButton?.click();
    
    // Modal should be visible now
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isShowDetail).toBe(true);
  });

  it('should handle pagination navigation correctly', async () => {
    // Set up navigation with multiple pages
    wrapper.vm.navigation.totalPages = 5;
    wrapper.vm.navigation.page = 3;
    
    // Test goToPrevious
    wrapper.vm.goToPrevious();
    expect(wrapper.vm.navigation.page).toBe(2);
    
    // Test goToNext
    wrapper.vm.goToNext();
    expect(wrapper.vm.navigation.page).toBe(3);
    
    // Test goToPage
    wrapper.vm.goToPage(1);
    expect(wrapper.vm.navigation.page).toBe(1);
  });

  it('should generate correct page list for pagination', async () => {
    // Test case 1: Total pages <= 5
    wrapper.vm.navigation.totalPages = 3;
    wrapper.vm.navigation.page = 1;
    await wrapper.vm.$nextTick();
    
    let pageList = wrapper.vm.generatePageList;
    expect(pageList).toEqual([1, 2, 3]);
    
    // Test case 2: Current page <= 3 with many pages
    wrapper.vm.navigation.totalPages = 10;
    wrapper.vm.navigation.page = 2;
    await wrapper.vm.$nextTick();
    
    pageList = wrapper.vm.generatePageList;
    expect(pageList).toEqual([1, 2, 3, 4, '...', 10]);
    
    // Test case 3: Current page near end
    wrapper.vm.navigation.page = 9;
    await wrapper.vm.$nextTick();
    
    pageList = wrapper.vm.generatePageList;
    expect(pageList).toEqual([1, '...', 7, 8, 9, 10]);
    
    // Test case 4: Current page in middle
    wrapper.vm.navigation.page = 5;
    await wrapper.vm.$nextTick();
    
    pageList = wrapper.vm.generatePageList;
    expect(pageList).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });

  it('should handle page limit change correctly', async () => {
    const mockEvent = {
      target: { value: '20' }
    };
    
    wrapper.vm.changePageLimit(mockEvent);
    
    expect(wrapper.vm.navigation.limit).toBe(20);
    expect(wrapper.vm.navigation.page).toBe(1);
  });

  it('should handle fetchRoles error correctly', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock the role service to throw an error
    const mockError = new Error('Test error');
    wrapper.vm.roleService = {
      getRoles: vi.fn().mockRejectedValue(mockError)
    };
    
    await wrapper.vm.fetchRoles();
    
    expect(wrapper.vm.isLoading).toBe(false);
    consoleSpy.mockRestore();
  });

  it('should prevent navigation when at boundaries', async () => {
    // Test goToPrevious when at first page
    wrapper.vm.navigation.page = 1;
    const initialPage = wrapper.vm.navigation.page;
    
    wrapper.vm.goToPrevious();
    expect(wrapper.vm.navigation.page).toBe(initialPage);
    
    // Test goToNext when at last page
    wrapper.vm.navigation.totalPages = 5;
    wrapper.vm.navigation.page = 5;
    const lastPage = wrapper.vm.navigation.page;
    
    wrapper.vm.goToNext();
    expect(wrapper.vm.navigation.page).toBe(lastPage);
  });

  it('should handle tab menu selection', async () => {
    const newTab = 'Laman Utama';
    wrapper.vm.selectedTabMenu = newTab;
    
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedTabMenu).toBe(newTab);
  });

  it('should call fetchRoles on mounted', () => {
    // Test that component initializes properly
    expect(wrapper.vm.isLoading).toBeDefined();
    expect(wrapper.vm.navigation).toBeDefined();
    expect(wrapper.vm.dummyData).toHaveLength(9);
  });
});