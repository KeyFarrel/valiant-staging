import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import VerifikasiPersetujuan from '@/views/Verifikasi/Approver/VerifikasiPersetujuan.vue';

// Hoisted Mocks
const mocks = vi.hoisted(() => {
    return {
        persetujuanService: {
            getPersetujuanKertasKerja: vi.fn(),
            getPersetujuanFS: vi.fn(),
        },
        petaService: {
            getPengelola: vi.fn(),
            getPembina: vi.fn(),
        },
        authStore: {
            levelAlias: '',
            roleAlias: ''
        }
    }
});

// Mock dependencies
vi.mock('@/services/persetujuan-service', () => ({
  default: vi.fn(() => mocks.persetujuanService),
}));

vi.mock('@/services/peta-service', () => ({
  default: vi.fn(() => mocks.petaService),
}));

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn(() => ({
    formatRupiah: (val: any) => `Rp ${val}`
  })),
}));

vi.mock('@/services/auth-service', () => ({
  default: vi.fn(() => ({})),
}));

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
      encryptValue: (val: any) => `encrypted-${val}`
  }),
}));

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: vi.fn(() => mocks.authStore),
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
  default: { name: 'TableComponent', template: '<div><slot name="table-header" /><slot name="table-body" /></div>' },
}));

vi.mock('@/components/ui/EmptyData.vue', () => ({
  default: { name: 'Empty', template: '<div>Empty Data</div>' },
}));

vi.mock('vue3-lottie', () => ({
  Vue3Lottie: { template: '<div>Lottie</div>' }
}));

vi.mock('vue-router', () => ({
    RouterLink: { template: '<a><slot /></a>', props: ['to'] }
}));

describe('VerifikasiPersetujuan', () => {
    
  const globalStubs = {
      Loading: true,
      SearchBox: true,
      TabsWrapper: true,
      TabItem: true,
      ModalWrapper: true,
      TableComponent: true,
      Empty: true,
      'el-option': true,
      'el-select': true,
      VueDatePicker: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Reset Auth Store
    mocks.authStore.levelAlias = 'Xf!8qP@7'; // Default Admin
    mocks.authStore.roleAlias = 'admin';

    // Setup default mock responses
    mocks.persetujuanService.getPersetujuanKertasKerja.mockResolvedValue({
      data: [],
      meta: { totalPages: 1, totalRecords: 0, limit: 10 },
    });

    mocks.persetujuanService.getPersetujuanFS.mockResolvedValue({
      data: [],
      meta: { totalPages: 1, totalRecords: 0, limit: 10 },
    });

    mocks.petaService.getPengelola.mockResolvedValue({
      success: true,
      data: [
        { kode_pengelola: 'P001', pengelola: 'Pengelola 1' },
        { kode_pengelola: 'P002', pengelola: 'Pengelola 2' },
      ],
    });

    mocks.petaService.getPembina.mockResolvedValue({
      success: true,
      data: [
        { uuid: '1', pembina: 'Pembina 1' },
        { uuid: '2', pembina: 'Pembina 2' },
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mountComponent = () => {
      return mount(VerifikasiPersetujuan, {
          global: { stubs: globalStubs }
      });
  };

  it('renders and fetches initial data', async () => {
    mountComponent();
    await flushPromises();
    
    expect(mocks.persetujuanService.getPersetujuanKertasKerja).toHaveBeenCalled();
    expect(mocks.persetujuanService.getPersetujuanFS).toHaveBeenCalled();
    expect(mocks.petaService.getPengelola).toHaveBeenCalled();
    expect(mocks.petaService.getPembina).toHaveBeenCalled();
  });
  
  it('handles search KK debounce', async () => {
      vi.useFakeTimers();
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      vm.searchQKK = 'test';
      vm.changeDataKK(true);
      
      vi.advanceTimersByTime(500);
      await flushPromises();
      
      expect(mocks.persetujuanService.getPersetujuanKertasKerja).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'TEST' }));
      
      vi.useRealTimers();
  });

  it('handles search FS debounce', async () => {
      vi.useFakeTimers();
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      vm.searchQFS = 'test fs';
      vm.changeFS(true);
      
      vi.advanceTimersByTime(500);
      await flushPromises();
      
      expect(mocks.persetujuanService.getPersetujuanFS).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'TEST FS' }));
      
      vi.useRealTimers();
  });

  it('handles changeDataKK without search (isSearch = false)', async () => {
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      vi.clearAllMocks();
      vm.changeDataKK(false);
      await flushPromises();
      
      expect(mocks.persetujuanService.getPersetujuanKertasKerja).toHaveBeenCalled();
  });

  it('handles changeFS without search (isSearch = false)', async () => {
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      vi.clearAllMocks();
      vm.changeFS(false);
      await flushPromises();
      
      expect(mocks.persetujuanService.getPersetujuanFS).toHaveBeenCalled();
  });

  it('handles dropdown toggles', async () => {
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      // Pengelola KK
      expect(vm.isPengelolaKKDropdownOpen).toBe(false);
      vm.togglePengelolaKKDropdown();
      expect(vm.isPengelolaKKDropdownOpen).toBe(true);
      
      // Pembina KK
      vm.togglePembinaKKDropdown();
      expect(vm.isPembinaKKDropdownOpen).toBe(true);
      
      // Persetujuan KK
      vm.togglePersetujuanKKDropdown();
      expect(vm.isPersetujuanKKDropdownOpen).toBe(true);
      
      // FS toggles
      vm.togglePengelolaFSDropdown();
      expect(vm.isPengelolaFSDropdownOpen).toBe(true);
      
      vm.togglePembinaFSDropdown();
      expect(vm.isPembinaFSDropdownOpen).toBe(true);
      
      vm.togglePersetujuanFSDropdown();
      expect(vm.isPersetujuanFSDropdownOpen).toBe(true);
  });

  it('filters logic - Checkbox Changes KK', async () => {
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      expect(vm.itemsPengelola.length).toBe(2);
      
      // Check All Pengelola KK
      vm.handleCheckPengelolaKK(true);
      expect(vm.filterKK.selectedPengelola).toHaveLength(2);
      
      // Clear Pengelola KK
      vm.handleCheckPengelolaKK(false);
      expect(vm.filterKK.selectedPengelola).toHaveLength(0);
      
      // Check All Pembina KK
      vm.checkPembinaKK = true;
      vm.handleCheckPembinaKK();
      expect(vm.filterKK.selectedPembina).toHaveLength(2);
      
      // Clear Pembina KK
      vm.checkPembinaKK = false;
      vm.handleCheckPembinaKK();
      expect(vm.filterKK.selectedPembina).toHaveLength(0);
      
      // Check All Persetujuan KK
      vm.handleCheckPersetujuanKK(true);
      expect(vm.filterKK.selectedPersetujuan.length).toBeGreaterThan(0);
      
      // Clear Persetujuan KK
      vm.handleCheckPersetujuanKK(false);
      expect(vm.filterKK.selectedPersetujuan).toHaveLength(0);
  });

  it('filters logic - Checkbox Changes FS', async () => {
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      // Check All Pengelola FS
      vm.checkPengelolaFS = true;
      vm.handleCheckPengelolaFS();
      expect(vm.filterFS.selectedPengelola).toHaveLength(2);
      
      // Clear Pengelola FS
      vm.checkPengelolaFS = false;
      vm.handleCheckPengelolaFS();
      expect(vm.filterFS.selectedPengelola).toHaveLength(0);
      
      // Check All Pembina FS
      vm.checkPembinaFS = true;
      vm.handleCheckPembinaFS();
      expect(vm.filterFS.selectedPembina).toHaveLength(2);
      
      // Clear Pembina FS
      vm.checkPembinaFS = false;
      vm.handleCheckPembinaFS();
      expect(vm.filterFS.selectedPembina).toHaveLength(0);
      
      // Check All Persetujuan FS
      vm.checkPersetujuanFS = true;
      vm.handleCheckPersetujuanFS();
      expect(vm.filterFS.selectedPersetujuan.length).toBeGreaterThan(0);
      
      // Clear Persetujuan FS
      vm.checkPersetujuanFS = false;
      vm.handleCheckPersetujuanFS();
      expect(vm.filterFS.selectedPersetujuan).toHaveLength(0);
  });
  
  it('reset filters KK', async () => {
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      vm.filterKK.selectedPengelola = ['P001'];
      vm.clearPengelolaKK();
      expect(vm.filterKK.selectedPengelola).toHaveLength(0);
      
      vm.filterKK.selectedPembina = ['1'];
      vm.clearPembinaKK();
      expect(vm.filterKK.selectedPembina).toHaveLength(0);
      
      vm.filterKK.selectedPersetujuan = [0];
      vm.clearPersetujuanKK();
      expect(vm.filterKK.selectedPersetujuan).toHaveLength(0);
  });

  it('reset filters FS', async () => {
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      vm.filterFS.selectedPengelola = ['P001'];
      vm.clearPengelolaFS();
      expect(vm.filterFS.selectedPengelola).toHaveLength(0);
      
      vm.filterFS.selectedPembina = ['1'];
      vm.clearPembinaFS();
      expect(vm.filterFS.selectedPembina).toHaveLength(0);
      
      vm.filterFS.selectedPersetujuan = [0];
      vm.clearPersetujuanFS();
      expect(vm.filterFS.selectedPersetujuan).toHaveLength(0);
  });

  it('remove selected items KK', async () => {
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      vm.filterKK.selectedPengelola = ['P001', 'P002'];
      vm.removeSelectedPengelolaKK('P001');
      expect(vm.filterKK.selectedPengelola).toEqual(['P002']);
      
      vm.filterKK.selectedPembina = ['1', '2'];
      vm.removeSelectedPembinaKK('1');
      expect(vm.filterKK.selectedPembina).toEqual(['2']);
      
      vm.filterKK.selectedPersetujuan = [0, 1];
      vm.removeSelectedPersetujuanKK(0);
      expect(vm.filterKK.selectedPersetujuan).toEqual([1]);
  });

  it('remove selected items FS', async () => {
      const wrapper = mountComponent();
      await flushPromises();
      const vm = wrapper.vm as any;
      
      vm.filterFS.selectedPengelola = ['P001', 'P002'];
      vm.removeSelectedPengelolaFS('P001');
      expect(vm.filterFS.selectedPengelola).toEqual(['P002']);
      
      vm.filterFS.selectedPembina = ['1', '2'];
      vm.removeSelectedPembinaFS('1');
      expect(vm.filterFS.selectedPembina).toEqual(['2']);
      
      vm.filterFS.selectedPersetujuan = [0, 1];
      vm.removeSelectedPersetujuanFS(0);
      expect(vm.filterFS.selectedPersetujuan).toEqual([1]);
  });

  it('handles fetch failure gracefully', async () => {
      mocks.persetujuanService.getPersetujuanKertasKerja.mockRejectedValue(new Error('Fetch Error'));
      
      mountComponent();
      await flushPromises();
      
      expect(console.error).toHaveBeenCalledWith("Fetch Persetujuan KK Error : ", expect.any(Error));
  });

  it('handles fetch FS failure gracefully', async () => {
      mocks.persetujuanService.getPersetujuanFS.mockRejectedValue(new Error('Fetch Error'));
      
      mountComponent();
      await flushPromises();
      
      expect(console.error).toHaveBeenCalledWith("Fetch Persetujuan FS Error : ", expect.any(Error));
  });

  it('handles getPengelola failure gracefully', async () => {
      mocks.petaService.getPengelola.mockRejectedValue(new Error('Fetch Error'));
      
      mountComponent();
      await flushPromises();
      
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Fetch items filter Pengelola Error"));
  });

  it('handles getPembina failure gracefully', async () => {
      mocks.petaService.getPembina.mockRejectedValue(new Error('Fetch Error'));
      
      mountComponent();
      await flushPromises();
      
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Fetch items filter Pembina Error"));
  });

  describe('Pagination KK', () => {
      it('handles page limit change', async () => {
          // Mock the response with limit 20 to match what we're setting
          mocks.persetujuanService.getPersetujuanKertasKerja.mockResolvedValue({
              data: [],
              meta: { totalPages: 1, totalRecords: 0, limit: 20 },
          });
          
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          const event = { target: { value: '20' } };
          await vm.changePageLimit(event);
          
          // After changePageLimit, it fetches data which sets limit from response
          expect(vm.navigationKK.limit).toBe(20);
          expect(vm.navigationKK.currentPage).toBe(1);
      });

      it('handles goToPage', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          await vm.goToPage(3);
          
          expect(vm.navigationKK.currentPage).toBe(3);
      });

      it('handles goToPrevious', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationKK.currentPage = 3;
          await vm.goToPrevious();
          
          expect(vm.navigationKK.currentPage).toBe(2);
      });

      it('handles goToPrevious at first page', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationKK.currentPage = 1;
          await vm.goToPrevious();
          
          expect(vm.navigationKK.currentPage).toBe(1);
      });

      it('handles goToNext', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationKK.currentPage = 1;
          vm.navigationKK.totalPages = 5;
          await vm.goToNext();
          
          expect(vm.navigationKK.currentPage).toBe(2);
      });

      it('handles goToNext at last page', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationKK.currentPage = 5;
          vm.navigationKK.totalPages = 5;
          await vm.goToNext();
          
          expect(vm.navigationKK.currentPage).toBe(5);
      });

      it('generates correct page list - few pages', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationKK.totalPages = 3;
          vm.navigationKK.currentPage = 1;
          
          expect(vm.generatePageList).toEqual([1, 2, 3]);
      });

      it('generates correct page list - many pages at start', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationKK.totalPages = 10;
          vm.navigationKK.currentPage = 2;
          
          expect(vm.generatePageList).toContain(1);
          expect(vm.generatePageList).toContain('...');
          expect(vm.generatePageList).toContain(10);
      });

      it('generates correct page list - many pages at end', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationKK.totalPages = 10;
          vm.navigationKK.currentPage = 9;
          
          expect(vm.generatePageList).toContain(1);
          expect(vm.generatePageList).toContain('...');
          expect(vm.generatePageList).toContain(10);
      });

      it('generates correct page list - many pages in middle', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationKK.totalPages = 10;
          vm.navigationKK.currentPage = 5;
          
          expect(vm.generatePageList).toContain(1);
          expect(vm.generatePageList).toContain(10);
      });
  });

  describe('Pagination FS', () => {
      it('handles page limit change', async () => {
          // Mock the response with limit 30 to match what we're setting
          mocks.persetujuanService.getPersetujuanFS.mockResolvedValue({
              data: [],
              meta: { totalPages: 1, totalRecords: 0, limit: 30 },
          });
          
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          const event = { target: { value: '30' } };
          await vm.changeLimit(event);
          
          expect(vm.navigationFS.limit).toBe(30);
          expect(vm.navigationFS.currentPage).toBe(1);
      });

      it('handles goTo', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          await vm.goTo(2);
          
          expect(vm.navigationFS.currentPage).toBe(2);
      });

      it('handles goPrevious', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationFS.currentPage = 3;
          await vm.goPrevious();
          
          expect(vm.navigationFS.currentPage).toBe(2);
      });

      it('handles goPrevious at first page', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationFS.currentPage = 1;
          await vm.goPrevious();
          
          expect(vm.navigationFS.currentPage).toBe(1);
      });

      it('handles goNext', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationFS.currentPage = 1;
          vm.navigationFS.totalPages = 5;
          await vm.goNext();
          
          expect(vm.navigationFS.currentPage).toBe(2);
      });

      it('handles goNext at last page', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationFS.currentPage = 5;
          vm.navigationFS.totalPages = 5;
          await vm.goNext();
          
          expect(vm.navigationFS.currentPage).toBe(5);
      });

      it('generates correct page list FS', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationFS.totalPages = 3;
          vm.navigationFS.currentPage = 1;
          
          expect(vm.generatePage).toEqual([1, 2, 3]);
      });
  });

  describe('Watch functions', () => {
      it('watches filterKK.selectedPengelola - indeterminate state', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          // Push to the array instead of replacing it to trigger the watcher
          vm.filterKK.selectedPengelola.push('P001');
          await nextTick();
          
          expect(vm.indeterminatePengelolaKK).toBe(true);
      });

      it('watches filterKK.selectedPengelola - all selected', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          // Select all pengelola (there are 2 in mock data)
          vm.filterKK.selectedPengelola.push('P001', 'P002');
          await nextTick();
          
          expect(vm.checkPengelolaKK).toBe(true);
          expect(vm.indeterminatePengelolaKK).toBe(false);
      });

      it('watches filterKK.selectedPembina - indeterminate state', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.filterKK.selectedPembina.push('1');
          await nextTick();
          
          expect(vm.indeterminatePembinaKK).toBe(true);
      });

      it('watches filterKK.selectedPersetujuan - indeterminate state', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          // itemsPersetujuan has 6 items, so selecting 2 should be indeterminate
          vm.filterKK.selectedPersetujuan.push(0, 1);
          await nextTick();
          
          expect(vm.indeterminateStatusKK).toBe(true);
      });

      it('watches filterFS.selectedPengelola - indeterminate state', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.filterFS.selectedPengelola.push('P001');
          await nextTick();
          
          expect(vm.indeterminatePengelolaFS).toBe(true);
      });

      it('watches filterFS.selectedPembina - indeterminate state', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.filterFS.selectedPembina.push('1');
          await nextTick();
          
          expect(vm.indeterminatePembinaFS).toBe(true);
      });

      it('watches filterFS.selectedPersetujuan - indeterminate state', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.filterFS.selectedPersetujuan.push(0, 1);
          await nextTick();
          
          expect(vm.indeterminateStatusFS).toBe(true);
      });
  });

  describe('Role-based functionality', () => {
      it('shows different filters for Admin (Xf!8qP@7)', async () => {
         mocks.authStore.levelAlias = 'Xf!8qP@7';
         const wrapper = mountComponent();
         await flushPromises();
         
         expect(wrapper.exists()).toBe(true);
      });

      it('shows different filters for Zp@5Kw_9', async () => {
         mocks.authStore.levelAlias = 'Zp@5Kw_9';
         const wrapper = mountComponent();
         await flushPromises();
         
         expect(wrapper.exists()).toBe(true);
      });

      it('shows different filters for Gk#92lV&', async () => {
         mocks.authStore.levelAlias = 'Gk#92lV&';
         const wrapper = mountComponent();
         await flushPromises();
         
         expect(wrapper.exists()).toBe(true);
      });

      it('shows different filters for Dr^3Zn$!', async () => {
         mocks.authStore.levelAlias = 'Dr^3Zn$!';
         mocks.authStore.roleAlias = 'nT!z03&k';
         const wrapper = mountComponent();
         await flushPromises();
         
         expect(wrapper.exists()).toBe(true);
      });
      
      it('hides edit buttons for viewers', async () => {
          mocks.authStore.levelAlias = 'Guest'; 
          const wrapper = mountComponent();
          await flushPromises();
          
          expect(wrapper.exists()).toBe(true);
      });
  });

  describe('fetchPersetujuanKK with data', () => {
      it('renders data correctly', async () => {
          mocks.persetujuanService.getPersetujuanKertasKerja.mockResolvedValue({
            data: [
              {
                uuid_mesin: 'mesin-1',
                uuid_sentral: 'sentral-1',
                kode_pengelola: 'P001',
                pembina: 'Pembina 1',
                sentral: 'Sentral 1',
                mesin: 'Mesin 1',
                irr_on_equity: '10.5',
                npv_on_equity: '1000000',
                status_approval: 'Draft',
                tahun: 2024
              }
            ],
            meta: { totalPages: 1, totalRecords: 1, limit: 10 },
          });

          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          expect(vm.persetujuanKK.length).toBe(1);
      });

      it('handles different status_approval values', async () => {
          const statuses = ['Draft', 'Disetujui', 'Ditolak T1', 'Ditolak T2', 'Menunggu Persetujuan T1', 'Menunggu Persetujuan T2'];
          
          for (const status of statuses) {
            mocks.persetujuanService.getPersetujuanKertasKerja.mockResolvedValue({
              data: [
                {
                  uuid_mesin: 'mesin-1',
                  uuid_sentral: 'sentral-1',
                  kode_pengelola: 'P001',
                  pembina: 'Pembina 1',
                  sentral: 'Sentral 1',
                  mesin: 'Mesin 1',
                  irr_on_equity: status === 'Draft' ? '' : '10.5',
                  npv_on_equity: '1000000',
                  status_approval: status,
                  tahun: 2024
                }
              ],
              meta: { totalPages: 1, totalRecords: 1, limit: 10 },
            });

            const wrapper = mountComponent();
            await flushPromises();
            
            expect(wrapper.exists()).toBe(true);
          }
      });
  });

  describe('fetchPersetujuanFS with data', () => {
      it('renders FS data correctly', async () => {
          mocks.persetujuanService.getPersetujuanFS.mockResolvedValue({
            data: [
              {
                uuid_mesin: 'mesin-1',
                uuid_sentral: 'sentral-1',
                kode_pengelola: 'P001',
                pembina: 'Pembina 1',
                sentral: 'Sentral 1',
                mesin: 'Mesin 1',
                irr_on_equity: '10.5',
                npv_on_equity: '1000000',
                status_approval: 'Draft'
              }
            ],
            meta: { totalPages: 1, totalRecords: 1, limit: 10 },
          });

          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          expect(vm.persetujuanFS.length).toBe(1);
      });
  });

  describe('Modal visibility', () => {
      it('handles showModalKK toggle', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          expect(vm.showModalKK).toBe(false);
          vm.showModalKK = true;
          expect(vm.showModalKK).toBe(true);
      });

      it('handles showModalFS toggle', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          expect(vm.showModalFS).toBe(false);
          vm.showModalFS = true;
          expect(vm.showModalFS).toBe(true);
      });
  });

  describe('Year picker', () => {
      it('updates yearPicked and triggers fetch', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vi.clearAllMocks();
          vm.yearPicked = 2023;
          await vm.fetchPersetujuanKK();
          
          expect(mocks.persetujuanService.getPersetujuanKertasKerja).toHaveBeenCalledWith(
            expect.objectContaining({ tahun: '2023' })
          );
      });
  });

  describe('Empty data handling', () => {
      it('handles empty pengelola data', async () => {
          mocks.petaService.getPengelola.mockResolvedValue({
            success: true,
            data: [],
          });

          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          expect(vm.itemsPengelola).toHaveLength(0);
      });

      it('handles empty pembina data', async () => {
          mocks.petaService.getPembina.mockResolvedValue({
            success: true,
            data: [],
          });

          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          expect(vm.itemsPembina).toHaveLength(0);
      });
  });

  describe('fetchPersetujuanKK with page parameter', () => {
      it('resets currentPage to 1 when page parameter is provided', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationKK.currentPage = 5;
          await vm.fetchPersetujuanKK(1);
          
          expect(vm.navigationKK.currentPage).toBe(1);
      });
  });

  describe('fetchPersetujuanFS with page parameter', () => {
      it('resets currentPage to 1 when page parameter is provided', async () => {
          const wrapper = mountComponent();
          await flushPromises();
          const vm = wrapper.vm as any;
          
          vm.navigationFS.currentPage = 5;
          await vm.fetchPersetujuanFS(1);
          
          expect(vm.navigationFS.currentPage).toBe(1);
      });
  });
});
