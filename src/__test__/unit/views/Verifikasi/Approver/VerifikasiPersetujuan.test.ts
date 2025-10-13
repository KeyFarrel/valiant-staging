import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VerifikasiPersetujuan from '@/views/Verifikasi/Approver/VerifikasiPersetujuan.vue';

// Mock services
const mockPersetujuanService = {
  getPersetujuanKertasKerja: vi.fn(),
  getPersetujuanFS: vi.fn(),
};

const mockPetaService = {
  getPengelola: vi.fn(),
  getPembina: vi.fn(),
};

// Mock dependencies
vi.mock('@/services/persetujuan-service', () => ({
  default: vi.fn(() => mockPersetujuanService),
}));

vi.mock('@/services/peta-service', () => ({
  default: vi.fn(() => mockPetaService),
}));

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn(() => ({})),
}));

vi.mock('@/services/auth-service', () => ({
  default: vi.fn(() => ({})),
}));

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({}),
}));

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: vi.fn(() => ({})),
}));

// Mock components
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: { name: 'Loading', template: '<div>Loading...</div>' },
}));

vi.mock('@/components/ui/SearchBox.vue', () => ({
  default: { name: 'SearchBox', template: '<div>SearchBox</div>', props: ['modelValue'], emits: ['update:modelValue'] },
}));

vi.mock('@/components/ui/TabsWrapper.vue', () => ({
  default: { name: 'TabsWrapper', template: '<div><slot /></div>', props: ['isLihatGrafik', 'lamanData'] },
}));

vi.mock('@/components/ui/TabItem.vue', () => ({
  default: { name: 'TabItem', template: '<div><slot /></div>', props: ['title'] },
}));

vi.mock('@/components/ui/ModalWrapper.vue', () => ({
  default: { name: 'ModalWrapper', template: '<div><slot /></div>', props: ['showModal', 'width', 'height'] },
}));

vi.mock('@/components/ui/Table.vue', () => ({
  default: { name: 'TableComponent', template: '<div>Table</div>' },
}));

vi.mock('@/components/ui/EmptyData.vue', () => ({
  default: { name: 'Empty', template: '<div>Empty Data</div>' },
}));

describe('VerifikasiPersetujuan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockPersetujuanService.getPersetujuanKertasKerja.mockResolvedValue({
      data: [],
      meta: {
        totalPages: 1,
        totalRecords: 0,
        limit: 10,
      },
    });

    mockPersetujuanService.getPersetujuanFS.mockResolvedValue({
      data: [],
      meta: {
        totalPages: 1,
        totalRecords: 0,
        limit: 10,
      },
    });

    mockPetaService.getPengelola.mockResolvedValue({
      success: true,
      data: [
        { kode: 'P001', nama: 'Pengelola 1' },
        { kode: 'P002', nama: 'Pengelola 2' },
      ],
    });

    mockPetaService.getPembina.mockResolvedValue({
      success: true,
      data: [
        { id: 1, nama: 'Pembina 1' },
        { id: 2, nama: 'Pembina 2' },
      ],
    });
  });

  it('should render the component successfully', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.min-h-full').exists()).toBe(true);
    
    // Wait for mounted hook to complete
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(wrapper.vm).toBeTruthy();
  });

  it('should fetch initial data on mount', async () => {
    mount(VerifikasiPersetujuan);
    
    // Wait for mounted hook to complete
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockPersetujuanService.getPersetujuanKertasKerja).toHaveBeenCalled();
    expect(mockPersetujuanService.getPersetujuanFS).toHaveBeenCalled();
    expect(mockPetaService.getPengelola).toHaveBeenCalled();
    expect(mockPetaService.getPembina).toHaveBeenCalled();
  });

  it('should initialize with correct default values', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const vm = wrapper.vm as any;
    
    expect(vm.isLoading).toBe(false);
    expect(vm.showModalKK).toBe(false);
    expect(vm.showModalFS).toBe(false);
    expect(vm.searchQKK).toBe('');
    expect(vm.searchQFS).toBe('');
    expect(vm.yearPicked).toBe(new Date().getFullYear());
  });

  it('should handle search functionality for KK', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Test search change
    vm.searchQKK = 'test search';
    vm.changeDataKK();
    
    await new Promise(resolve => setTimeout(resolve, 600)); // Wait for debounce
    
    expect(mockPersetujuanService.getPersetujuanKertasKerja).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'TEST SEARCH',
      })
    );
  });

  it('should handle search functionality for FS', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Test search change
    vm.searchQFS = 'test search fs';
    vm.changeFS();
    
    await new Promise(resolve => setTimeout(resolve, 600)); // Wait for debounce
    
    expect(mockPersetujuanService.getPersetujuanFS).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'TEST SEARCH FS',
      })
    );
  });

  it('should handle pagination for KK', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Test page change
    await vm.goToPage(2);
    
    expect(vm.navigationKK.currentPage).toBe(2);
    expect(mockPersetujuanService.getPersetujuanKertasKerja).toHaveBeenCalled();
  });

  it('should handle pagination navigation for KK', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Set up navigation state
    vm.navigationKK.currentPage = 2;
    vm.navigationKK.totalPages = 5;
    
    // Test previous page
    vm.goToPrevious();
    expect(vm.navigationKK.currentPage).toBe(1);
    
    // Test next page
    vm.navigationKK.currentPage = 2;
    vm.goToNext();
    expect(vm.navigationKK.currentPage).toBe(3);
  });

  it('should handle pagination for FS', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Test page change
    await vm.goTo(2);
    
    expect(vm.navigationFS.currentPage).toBe(2);
    expect(mockPersetujuanService.getPersetujuanFS).toHaveBeenCalled();
  });

  it('should handle pagination navigation for FS', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Set up navigation state
    vm.navigationFS.currentPage = 2;
    vm.navigationFS.totalPages = 5;
    
    // Test previous page
    vm.goPrevious();
    expect(vm.navigationFS.currentPage).toBe(1);
    
    // Test next page
    vm.navigationFS.currentPage = 2;
    vm.goNext();
    expect(vm.navigationFS.currentPage).toBe(3);
  });

  it('should handle checkbox changes for Pengelola KK', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Setup items
    vm.itemsPengelola = [{ id: 'P001', name: 'Pengelola 1' }, { id: 'P002', name: 'Pengelola 2' }];
    
    // Test select all
    vm.handleCheckPengelolaKK(true);
    expect(vm.filterKK.selectedPengelola).toEqual(['P001', 'P002']);
    
    // Test deselect all
    vm.handleCheckPengelolaKK(false);
    expect(vm.filterKK.selectedPengelola).toEqual([]);
  });

  it('should handle checkbox changes for Pembina KK', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Setup items
    vm.itemsPembina = [{ id: 1, name: 'Pembina 1' }, { id: 2, name: 'Pembina 2' }];
    
    // Test select all
    vm.handleCheckPembinaKK(true);
    expect(vm.filterKK.selectedPembina).toEqual([1, 2]);
    
    // Test deselect all
    vm.handleCheckPembinaKK(false);
    expect(vm.filterKK.selectedPembina).toEqual([]);
  });

  it('should handle checkbox changes for Persetujuan KK', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Test select all
    vm.handleCheckPersetujuanKK(true);
    expect(vm.filterKK.selectedPersetujuan).toEqual([3, 4, 2, 5, 0, 1]);
    
    // Test deselect all
    vm.handleCheckPersetujuanKK(false);
    expect(vm.filterKK.selectedPersetujuan).toEqual([]);
  });

  it('should handle checkbox changes for FS filters', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Setup items for FS
    vm.itemsPengelola = [{ id: 'P001', name: 'Pengelola 1' }, { id: 'P002', name: 'Pengelola 2' }];
    vm.itemsPembina = [{ id: 1, name: 'Pembina 1' }, { id: 2, name: 'Pembina 2' }];
    
    // Test FS Pengelola
    vm.handleCheckPengelolaFS(true);
    expect(vm.filterFS.selectedPengelola).toEqual(['P001', 'P002']);
    
    vm.handleCheckPengelolaFS(false);
    expect(vm.filterFS.selectedPengelola).toEqual([]);
    
    // Test FS Pembina
    vm.handleCheckPembinaFS(true);
    expect(vm.filterFS.selectedPembina).toEqual([1, 2]);
    
    vm.handleCheckPembinaFS(false);
    expect(vm.filterFS.selectedPembina).toEqual([]);
    
    // Test FS Persetujuan
    vm.handleCheckPersetujuanFS(true);
    expect(vm.filterFS.selectedPersetujuan).toEqual([3, 4, 2, 5, 0, 1]);
    
    vm.handleCheckPersetujuanFS(false);
    expect(vm.filterFS.selectedPersetujuan).toEqual([]);
  });

  it('should test year picker default value', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    const currentYear = new Date().getFullYear();
    
    expect(vm.yearPicked).toBe(currentYear);
    expect(vm.tahunBerjalan).toBe(currentYear);
  });

  it('should handle error cases in data fetching', async () => {
    // Setup mock to reject
    mockPetaService.getPengelola.mockRejectedValue(new Error('Network error'));
    mockPetaService.getPembina.mockRejectedValue(new Error('Network error'));
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const wrapper = mount(VerifikasiPersetujuan);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Should handle errors gracefully
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
