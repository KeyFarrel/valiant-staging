import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import RekapKertasKerjaV1 from '@/views/Data/RekapKertasKerjaV1/RekapKertasKerjaV1.vue';

// Hoisted Mocks
const mocks = vi.hoisted(() => {
    return {
        rekapService: {
            getSentralData: vi.fn(),
            getSuggestionSentral: vi.fn(),
            getPengelolaData: vi.fn(),
            getComboKategoriPembangkit: vi.fn(),
            getComboUmurMesin: vi.fn(),
            getComboKondisiMesin: vi.fn(),
            getComboIRR: vi.fn(),
            getNilaiSentral: vi.fn(),
            getNilaiMesin: vi.fn(),
            getStatusFSSentral: vi.fn(),
            getStatusFSMesin: vi.fn(),
            getStatusRealisasiSentral: vi.fn(),
            getStatusRealisasiMesin: vi.fn(),
            getCheckInputAsumsiSentral: vi.fn(),
            getCheckInputAsumsiMesin: vi.fn(),
            getMesinByIdSentral: vi.fn(),
            uploadTemplateAwalKK: vi.fn(),
            uploadTemplateAwalFS: vi.fn(),
            uploadEvidence: vi.fn(),
            updateEvidencePath: vi.fn(),
            downloadTemplateRekap: vi.fn(),
            downloadTemplateFS: vi.fn(),
        },
        detailSentralService: {
            getPhoto: vi.fn()
        },
        authStore: {
            levelAlias: 'Xf!8qP@7',
            roleAlias: 'admin'
        },
        router: {
            push: vi.fn()
        },
        rekapSearchStore: {
            searchRekapQuery: '',
            selectedRekapSearchQuery: ''
        },
        rekapNavigationStore: {
            currentPage: 1,
            pageLimit: 10,
            scrollPosition: { top: 0 }
        },
        notifyError: vi.fn(),
        notifySuccess: vi.fn()
    }
});

// Mock dependencies
vi.mock('vue-router', () => ({
    useRouter: () => mocks.router,
    RouterLink: { template: '<a><slot /></a>', props: ['to'] }
}));

vi.mock('@/services/rekap-service', () => ({
  default: vi.fn(() => mocks.rekapService),
}));

vi.mock('@/services/detail-sentral-service', () => ({
  default: vi.fn(() => mocks.detailSentralService),
}));

vi.mock('@/services/auth-service', () => ({
  default: vi.fn(() => ({ checkSession: vi.fn().mockResolvedValue({ success: true }) })),
}));

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn(() => ({
    formatRupiah: (val: any) => `Rp ${val}`,
    formatNumberFiveDigits: (val: any) => val,
    formatBytes: (val: any) => `${val} B`
  })),
}));

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
      encryptValue: (val: any) => `encrypted-${val}`
  }),
}));

vi.mock('@/store/storeRekapKertasKerja', () => ({
    useRekapSearchStore: () => mocks.rekapSearchStore,
    useRekapNavigationStore: () => mocks.rekapNavigationStore
}));

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: vi.fn(() => mocks.authStore),
}));

vi.mock('@/services/helper/toast-notification', () => ({
    notifyError: mocks.notifyError,
    notifySuccess: mocks.notifySuccess
}));

// Mock components
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({ default: { template: '<div>Loading</div>' } }));
vi.mock('@/components/ui/SearchBoxSuggestion.vue', () => ({ default: { template: '<div>SearchBox</div>', props: ['source', 'modelValue'], emits: ['update:modelValue', 'on-key-enter', 'on-click-sentral'] } }));
vi.mock('@/components/ui/ShimmerLoading.vue', () => ({ default: { template: '<div>Shimmer</div>' } }));
vi.mock('@/components/ui/ModalWrapper.vue', () => ({ default: { template: '<div><slot /></div>', props: ['showModal'] } }));
vi.mock('@/components/MasterUnitSentral/TabWrapperSentral.vue', () => ({ default: { template: '<div><slot /></div>', props: ['tabsTitles'] } }));
vi.mock('@/components/ui/TabItem.vue', () => ({ default: { template: '<div><slot /></div>', props: ['title'] } }));
vi.mock('vue3-lottie', () => ({ Vue3Lottie: { template: '<div>Lottie</div>' } }));
vi.mock('@/components/ui/ConfirmationDialog.vue', () => ({ default: { template: '<div>ConfirmationDialog</div>', emits: ['on-batal-click', 'on-accept-click'] } }));

const globalStubs = {
    Loading: true,
    SearchBoxSuggestion: true,
    ShimmerLoading: true,
    ModalWrapper: true,
    TabWrapperSentral: true,
    TabItem: true,
    Vue3Lottie: true,
    ConfirmationDialog: true,
    ComponentDraft: true,
    ComponentDisetujui: true,
    ComponentDitolakT1: true,
    ComponentDitolakT2: true,
    ComponentWaitingT1: true,
    ComponentWaitingT2: true,
    ComponentNotInput: true,
    ComponentNotUpdate: true,
    KeteranganAnomali: true,
    IconEmptyData: true,
    IconFolder: true,
    'el-select': true,
    'el-option': true
};

describe('RekapKertasKerjaV1', () => {
    
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'log').mockImplementation(() => {});
        
        // Default Auth
        mocks.authStore.levelAlias = 'Xf!8qP@7';
        mocks.authStore.roleAlias = 'admin';

        // Default Service Responses
        mocks.rekapService.getSentralData.mockResolvedValue({
            data: [{ uuid_sentral: 'sentral-1', sentral: 'Sentral 1', mesins: [[{ uuid_mesin: 'mesin-1', mesin: 'Mesin 1', photo1: '', photo2: '' }]], kode_pengelola: 'P1' }],
            meta: { totalRecords: 1, totalPages: 1, limit: 10 },
            success: true
        });
        mocks.rekapService.getSuggestionSentral.mockResolvedValue({ data: [{ sentral: 'Sentral 1' }], success: true });
        mocks.rekapService.getPengelolaData.mockResolvedValue({ 
            data: [
                { kode_pengelola: 'P1', pengelola: 'Pengelola 1' },
                { kode_pengelola: 'P2', pengelola: 'Pengelola 2' }
            ], 
            success: true 
        });
        mocks.rekapService.getComboKategoriPembangkit.mockResolvedValue({ 
            data: [
                { kategori_pembangkit: 'PLTU', jenis_kit: 'PLTU', daya_mampu: null },
                { kategori_pembangkit: 'PLTG', jenis_kit: 'PLTG', daya_mampu: null }
            ], 
            success: true 
        });
        mocks.rekapService.getComboUmurMesin.mockResolvedValue({ 
            data: [
                { umur_mesin: '< 5 Tahun' },
                { umur_mesin: '5-10 Tahun' }
            ], 
            success: true 
        });
        mocks.rekapService.getComboKondisiMesin.mockResolvedValue({ 
            data: [
                { kondisi_unit: 'Baik' },
                { kondisi_unit: 'Rusak' }
            ], 
            success: true 
        });
        mocks.rekapService.getComboIRR.mockResolvedValue({ 
            data: [
                { nilai_irr: '< 5%' },
                { nilai_irr: '5-10%' }
            ], 
            success: true 
        });
        mocks.rekapService.getNilaiSentral.mockResolvedValue({ data: [], success: true });
        mocks.rekapService.getNilaiMesin.mockResolvedValue({ data: [], success: true });
        mocks.rekapService.getStatusFSSentral.mockResolvedValue({ data: [], success: true });
        mocks.rekapService.getStatusFSMesin.mockResolvedValue({ 
            data: [{ uuid_mesin: 'mesin-1', status: 'Data belum terisi' }], 
            success: true 
        });
        mocks.rekapService.getStatusRealisasiSentral.mockResolvedValue({ data: [], success: true });
        mocks.rekapService.getStatusRealisasiMesin.mockResolvedValue({ 
            data: [{ uuid_mesin: 'mesin-1', status: 'Data belum terisi' }], 
            success: true 
        });
        mocks.rekapService.getCheckInputAsumsiSentral.mockResolvedValue({ data: [], success: true });
        mocks.rekapService.getCheckInputAsumsiMesin.mockResolvedValue({ 
            data: [{ uuid_mesin: 'mesin-1', status_kk: false }], 
            success: true 
        });
        mocks.rekapService.getMesinByIdSentral.mockResolvedValue({
             data: [{ id: 'mesin-1', uuid_mesin: 'mesin-1', mesin: 'Mesin 1', photo1: '', photo2: '' }],
             success: true
        });
        global.URL.createObjectURL = vi.fn(() => 'blob:url');
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const mountComponent = () => {
        return mount(RekapKertasKerjaV1, {
            global: { stubs: globalStubs }
        });
    };

    it('renders and fetches initial data', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        expect(mocks.rekapService.getSentralData).toHaveBeenCalled();
        expect(mocks.rekapService.getSuggestionSentral).toHaveBeenCalled();
    });

    it('handles file upload flow for Kertas Kerja', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        vm.currentIdMesin = 'mesin-1';
        vm.currentIdSentral = 'sentral-1';
        vm.isModalUnggahKertasKerjaOpen = true;
        
        const file = new File(['content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        vm.selectedFile = file;

        mocks.rekapService.uploadTemplateAwalKK.mockResolvedValue({ success: true });
        
        await vm.uploadFile();
        
        expect(mocks.rekapService.uploadTemplateAwalKK).toHaveBeenCalled();
    });

    it('handles file upload flow for FS', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        vm.currentIdMesin = 'mesin-1';
        vm.isModalUnggahFSOpen = true;
        
        const file = new File(['content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        vm.selectedFileFS = file;

        mocks.rekapService.uploadTemplateAwalFS.mockResolvedValue({ success: true });
        
        await vm.uploadFileFS();
        
        expect(mocks.rekapService.uploadTemplateAwalFS).toHaveBeenCalled();
    });

    it('downloads template logic', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        vm.currentIdMesin = '123';
        mocks.rekapService.downloadTemplateRekap.mockResolvedValue({
            data: new Blob(['']),
            headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
        });

        await vm.handleDownloadTemplateRekap();
        expect(mocks.rekapService.downloadTemplateRekap).toHaveBeenCalled();
    });
    
    it('handles download template FS', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        vm.currentIdMesin = '123';
        mocks.rekapService.downloadTemplateFS.mockResolvedValue({
             data: new Blob(['']),
             headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
        });
        
        await vm.handleDownloadTemplateFS();
        expect(mocks.rekapService.downloadTemplateFS).toHaveBeenCalled();
    });

    it('handles search interaction', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        vi.clearAllMocks();
        await vm.handleSearch();
        
        expect(mocks.rekapService.getSentralData).toHaveBeenCalled();
    });
    
    it('handles pagination - goToPage', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        vi.clearAllMocks();
        await vm.goToPage(2);
        
        expect(mocks.rekapService.getSentralData).toHaveBeenCalled();
    });

    it('handles pagination - goToPrevious', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        mocks.rekapNavigationStore.currentPage = 3;
        vi.clearAllMocks();
        await vm.goToPrevious();
        
        expect(mocks.rekapNavigationStore.currentPage).toBe(2);
    });

    it('handles pagination - goToPrevious calls goToPage with decremented page', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        // Note: goToPrevious doesn't have bounds checking - it just calls goToPage(currentPage - 1)
        // The UI disables the button when at first page
        mocks.rekapNavigationStore.currentPage = 2;
        vi.clearAllMocks();
        await vm.goToPrevious();
        
        // After calling goToPrevious from page 2, it goes to page 1
        expect(mocks.rekapNavigationStore.currentPage).toBe(1);
    });

    it('handles pagination - goToNext', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        mocks.rekapNavigationStore.currentPage = 1;
        vm.totalPages = 5;
        vi.clearAllMocks();
        await vm.goToNext();
        
        expect(mocks.rekapNavigationStore.currentPage).toBe(2);
    });

    it('handles pagination - goToNext calls goToPage with incremented page', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        // Note: goToNext doesn't have bounds checking - it just calls goToPage(currentPage + 1)
        // The UI disables the button when at last page
        vm.totalPages = 5;
        mocks.rekapNavigationStore.currentPage = 4;
        vi.clearAllMocks();
        await vm.goToNext();
        
        // After calling goToNext from page 4, it goes to page 5
        expect(mocks.rekapNavigationStore.currentPage).toBe(5);
    });

    it('handles toggle pembangkit to expand', async () => {
        const wrapper = mountComponent();
        await flushPromises(); 
        const vm = wrapper.vm as any;
        
        mocks.rekapService.getMesinByIdSentral.mockResolvedValue({
             data: [{ id: 'mesin-2', uuid_mesin: 'mesin-2', mesin: 'Mesin 2', photo1: '', photo2: '' }],
             success: true
        });
        
        expect(vm.isPembangkitOpen('sentral-1')).toBe(true);
        await vm.togglePembangkit('sentral-1');
        expect(vm.isPembangkitOpen('sentral-1')).toBe(false);

        await vm.togglePembangkit('sentral-1');
        expect(vm.isPembangkitOpen('sentral-1')).toBe(true);
        expect(mocks.rekapService.getMesinByIdSentral).toHaveBeenCalledWith('sentral-1');
    });

    it('handles file change events', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        const file = new File([''], 'test.xlsx');
        const event = { target: { files: [file] } };
        
        vm.handleFileChange(event);
        expect(vm.selectedFile).toEqual(file);
        
        vm.handleFileChangeEvidence(event);
        expect(vm.selectedFileEvidence).toEqual(file);
        
        vm.handleFileFSChange(event);
        expect(vm.selectedFileFS).toEqual(file);
    });

    it('handles file change events - empty files', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        const event = { target: { files: [] } };
        
        vm.selectedFile = 'prev';
        vm.handleFileChange(event);
        expect(vm.selectedFile).toBeNull();
        
        vm.selectedFileEvidence = 'prev';
        vm.handleFileChangeEvidence(event);
        expect(vm.selectedFileEvidence).toBeNull();
        
        vm.selectedFileFS = 'prev';
        vm.handleFileFSChange(event);
        expect(vm.selectedFileFS).toBeNull();
    });
    
    it('validates file size uploads - KK oversized', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        const largeFile = { size: 5000000, name: 'big.xlsx' };
        vm.selectedFile = largeFile;
        
        await vm.uploadFile();
        expect(mocks.notifyError).toHaveBeenCalledWith(expect.stringContaining('2MB'), expect.any(Number));
        expect(mocks.rekapService.uploadTemplateAwalKK).not.toHaveBeenCalled();
    });

    it('validates file size uploads - FS oversized', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        const largeFile = { size: 5000000, name: 'big.xlsx' };
        vm.selectedFileFS = largeFile;
        
        await vm.uploadFileFS();
        expect(mocks.notifyError).toHaveBeenCalledWith(expect.stringContaining('2MB'), expect.any(Number));
        expect(mocks.rekapService.uploadTemplateAwalFS).not.toHaveBeenCalled();
    });

    it('validates no file selected - KK', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        vm.selectedFile = null;
        await vm.uploadFile();
        
        expect(mocks.notifyError).toHaveBeenCalledWith(expect.stringContaining('pilih file'), expect.any(Number));
    });

    it('validates no file selected - FS', async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const vm = wrapper.vm as any;
        
        vm.selectedFileFS = null;
        await vm.uploadFileFS();
        
        expect(mocks.notifyError).toHaveBeenCalledWith(expect.stringContaining('pilih file'), expect.any(Number));
    });

    describe('Filter Dropdowns', () => {
        it('toggles pembangkit dropdown', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.isPembangkitDropdownOpen).toBe(false);
            vm.togglePembangkitDropdown();
            expect(vm.isPembangkitDropdownOpen).toBe(true);
            vm.togglePembangkitDropdown();
            expect(vm.isPembangkitDropdownOpen).toBe(false);
        });

        it('toggles umur mesin dropdown', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.isUmurMesinDropdownOpen).toBe(false);
            vm.toggleUmurMesinDropdown();
            expect(vm.isUmurMesinDropdownOpen).toBe(true);
        });

        it('toggles kondisi mesin dropdown', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.isKondisiMesinDropdownOpen).toBe(false);
            vm.toggleKondisiMesinDropdown();
            expect(vm.isKondisiMesinDropdownOpen).toBe(true);
        });

        it('toggles DMN dropdown', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.isDmnDropdownOpen).toBe(false);
            vm.toggleDmnDropdown();
            expect(vm.isDmnDropdownOpen).toBe(true);
        });

        it('handles check all pembangkit', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.handleCheckPembangkit(true);
            expect(vm.selectedKategoriPembangkit.length).toBeGreaterThan(0);
            
            vm.handleCheckPembangkit(false);
            expect(vm.selectedKategoriPembangkit.length).toBe(0);
        });

        it('handles check all umur mesin', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.handleCheckUmurMesin(true);
            expect(vm.selectedUmurMesin.length).toBeGreaterThan(0);
            
            vm.handleCheckUmurMesin(false);
            expect(vm.selectedUmurMesin.length).toBe(0);
        });

        it('handles check all kondisi mesin', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.handleCheckKondisiMesin(true);
            expect(vm.selectedKondisiMesin.length).toBeGreaterThan(0);
            
            vm.handleCheckKondisiMesin(false);
            expect(vm.selectedKondisiMesin.length).toBe(0);
        });

        it('handles check all DMN', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            // Need to set up childDmn data first
            vm.childDmn = [{ id: 'dmn1', name: 'DMN 1' }, { id: 'dmn2', name: 'DMN 2' }];
            
            vm.handleCheckDmn(true);
            expect(vm.dmn.length).toBeGreaterThan(0);
            
            vm.handleCheckDmn(false);
            expect(vm.dmn.length).toBe(0);
        });

        it('clears pembangkit selection', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.selectedKategoriPembangkit = ['PLTU'];
            vm.clearPembangkit();
            expect(vm.selectedKategoriPembangkit.length).toBe(0);
        });

        it('clears umur mesin selection', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.selectedUmurMesin = ['< 5 Tahun'];
            vm.clearUmurMesin();
            expect(vm.selectedUmurMesin.length).toBe(0);
        });

        it('clears kondisi mesin selection', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.selectedKondisiMesin = ['Baik'];
            vm.clearKondisiMesin();
            expect(vm.selectedKondisiMesin.length).toBe(0);
        });

        it('clears DMN selection', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.dmn = ['dmn1'];
            vm.clearDmn();
            expect(vm.dmn.length).toBe(0);
        });

        it('removes selected pembangkit', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.selectedKategoriPembangkit = ['PLTU', 'PLTG'];
            vm.removeSelectedPembangkit('PLTU');
            expect(vm.selectedKategoriPembangkit).toEqual(['PLTG']);
        });

        it('removes selected umur mesin', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.selectedUmurMesin = ['< 5 Tahun', '5-10 Tahun'];
            vm.removeSelectedUmurMesin('< 5 Tahun');
            expect(vm.selectedUmurMesin).toEqual(['5-10 Tahun']);
        });

        it('removes selected kondisi mesin', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.selectedKondisiMesin = ['Baik', 'Rusak'];
            vm.removeSelectedKondisiMesin('Baik');
            expect(vm.selectedKondisiMesin).toEqual(['Rusak']);
        });

        it('removes selected DMN', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.dmn = ['dmn1', 'dmn2'];
            vm.removeSelectedDmn('dmn1');
            expect(vm.dmn).toEqual(['dmn2']);
        });
    });

    describe('Pengelola Selection', () => {
        it('changes selected pengelola', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vi.clearAllMocks();
            await vm.changeSelectedPengelola('P1');
            
            // When selecting a specific pengelola, it gets added to selectedPengelola array
            // and kodePengelola becomes null
            expect(vm.selectedPengelola).toContain('P1');
            expect(vm.kodePengelola).toBe(null);
            expect(mocks.rekapService.getSentralData).toHaveBeenCalled();
        });

        it('deselects pengelola if already selected', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            // First select the pengelola
            vm.selectedPengelola = ['P1'];
            vm.kodePengelola = null;
            vi.clearAllMocks();
            
            // Then deselect it
            await vm.changeSelectedPengelola('P1');
            
            // When only one pengelola is selected and deselected, kodePengelola becomes 'ALL'
            expect(vm.kodePengelola).toBe('ALL');
            expect(vm.selectedPengelola).not.toContain('P1');
        });

        it('selects ALL pengelola', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            // Set kodePengelola to something other than 'ALL' so selecting 'ALL' triggers fetch
            vm.kodePengelola = null;
            vm.selectedPengelola = ['P1'];
            vi.clearAllMocks();
            await vm.changeSelectedPengelola('ALL');
            
            expect(vm.kodePengelola).toBe('ALL');
            expect(vm.selectedPengelola).toEqual([]);
            expect(mocks.rekapService.getSentralData).toHaveBeenCalled();
        });

        it('does not refetch when ALL is already selected', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            // Set kodePengelola to 'ALL' already
            vm.kodePengelola = 'ALL';
            vm.selectedPengelola = [];
            vi.clearAllMocks();
            await vm.changeSelectedPengelola('ALL');
            
            // Should NOT call getSentralData because it was already 'ALL'
            expect(mocks.rekapService.getSentralData).not.toHaveBeenCalled();
        });
    });

    describe('changeSentralData', () => {
        it('applies filters and fetches data', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.selectedKategoriPembangkit = ['PLTU'];
            vm.selectedUmurMesin = ['< 5 Tahun'];
            vm.selectedKondisiMesin = ['Baik'];
            
            vi.clearAllMocks();
            await vm.changeSentralData();
            
            expect(mocks.rekapService.getSentralData).toHaveBeenCalled();
            expect(vm.showModal).toBe(false);
        });
    });

    describe('Error handling', () => {
        it('handles getSentralData error', async () => {
            mocks.rekapService.getSentralData.mockRejectedValue(new Error('Fetch Error'));
            
            mountComponent();
            await flushPromises();
            
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Sentral Data Error'), expect.any(Error));
        });

        it('handles getSuggestionSentral error', async () => {
            mocks.rekapService.getSuggestionSentral.mockRejectedValue(new Error('Fetch Error'));
            
            mountComponent();
            await flushPromises();
            
            expect(console.error).toHaveBeenCalled();
        });

        it('handles getPengelolaData error', async () => {
            mocks.rekapService.getPengelolaData.mockRejectedValue(new Error('Fetch Error'));
            
            mountComponent();
            await flushPromises();
            
            expect(console.error).toHaveBeenCalled();
        });

        it('handles getComboKategoriPembangkit error', async () => {
            mocks.rekapService.getComboKategoriPembangkit.mockRejectedValue(new Error('Fetch Error'));
            
            mountComponent();
            await flushPromises();
            
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Kategori Error'), expect.any(Error));
        });

        it('handles getComboUmurMesin error', async () => {
            mocks.rekapService.getComboUmurMesin.mockRejectedValue(new Error('Fetch Error'));
            
            mountComponent();
            await flushPromises();
            
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Umur Mesin Error'), expect.any(Error));
        });

        it('handles getComboKondisiMesin error', async () => {
            mocks.rekapService.getComboKondisiMesin.mockRejectedValue(new Error('Fetch Error'));
            
            mountComponent();
            await flushPromises();
            
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Kondisi Mesin Error'), expect.any(Error));
        });

        it('handles getComboIRR error', async () => {
            mocks.rekapService.getComboIRR.mockRejectedValue(new Error('Fetch Error'));
            
            mountComponent();
            await flushPromises();
            
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('IRR Error'), expect.any(Error));
        });

        it('handles getNilaiSentral error', async () => {
            mocks.rekapService.getNilaiSentral.mockRejectedValue(new Error('Fetch Error'));
            
            mountComponent();
            await flushPromises();
            
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Nilai Sentral Error'), expect.any(Error));
        });

        it('handles getNilaiMesin error', async () => {
            mocks.rekapService.getNilaiMesin.mockRejectedValue(new Error('Fetch Error'));
            
            mountComponent();
            await flushPromises();
            
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Nilai Mesin Error'), expect.any(Error));
        });

        it('handles downloadTemplateRekap error', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            mocks.rekapService.downloadTemplateRekap.mockRejectedValue(new Error('Download Error'));
            
            await vm.handleDownloadTemplateRekap();
            
            expect(mocks.notifyError).toHaveBeenCalledWith(expect.stringContaining('Gagal'), expect.any(Number));
        });

        it('handles downloadTemplateFS error', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            mocks.rekapService.downloadTemplateFS.mockRejectedValue(new Error('Download Error'));
            
            await vm.handleDownloadTemplateFS();
            
            expect(mocks.notifyError).toHaveBeenCalledWith(expect.stringContaining('Gagal'), expect.any(Number));
        });

        it('handles uploadFile error', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            const file = new File(['content'], 'test.xlsx');
            vm.selectedFile = file;
            
            mocks.rekapService.uploadTemplateAwalKK.mockRejectedValue(new Error('Upload Error'));
            
            await vm.uploadFile();
            
            expect(mocks.notifyError).toHaveBeenCalledWith(expect.stringContaining('Upload File Gagal'), expect.any(Number));
        });
    });

    describe('Role-based functionality', () => {
        it('renders for Admin level (Xf!8qP@7)', async () => {
            mocks.authStore.levelAlias = 'Xf!8qP@7';
            const wrapper = mountComponent();
            await flushPromises();
            expect(wrapper.exists()).toBe(true);
        });

        it('renders for Zp@5Kw_9 level', async () => {
            mocks.authStore.levelAlias = 'Zp@5Kw_9';
            const wrapper = mountComponent();
            await flushPromises();
            expect(wrapper.exists()).toBe(true);
        });

        it('renders for Gk#92lV& level', async () => {
            mocks.authStore.levelAlias = 'Gk#92lV&';
            const wrapper = mountComponent();
            await flushPromises();
            expect(wrapper.exists()).toBe(true);
        });

        it('renders for Dr^3Zn$! level with nT!z03&k role', async () => {
            mocks.authStore.levelAlias = 'Dr^3Zn$!';
            mocks.authStore.roleAlias = 'nT!z03&k';
            const wrapper = mountComponent();
            await flushPromises();
            expect(wrapper.exists()).toBe(true);
        });

        it('renders for Mb*0yT%3 level', async () => {
            mocks.authStore.levelAlias = 'Mb*0yT%3';
            const wrapper = mountComponent();
            await flushPromises();
            expect(wrapper.exists()).toBe(true);
        });

        it('handles viewer role (Vx_91$pN)', async () => {
            mocks.authStore.roleAlias = 'Vx_91$pN';
            const wrapper = mountComponent();
            await flushPromises();
            expect(wrapper.exists()).toBe(true);
        });
    });

    describe('checkInputAsumsi', () => {
        it('returns true when status_kk is true', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.listStatusInputAsumsiMesin = [{ uuid_mesin: 'mesin-1', status_kk: true }];
            
            const result = vm.checkInputAsumsi('mesin-1');
            expect(result).toBe(true);
        });

        it('returns false when status_kk is false', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.listStatusInputAsumsiMesin = [{ uuid_mesin: 'mesin-1', status_kk: false }];
            
            const result = vm.checkInputAsumsi('mesin-1');
            expect(result).toBe(false);
        });

        it('throws error when mesin not found (array access on undefined)', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.listStatusInputAsumsiMesin = [{ uuid_mesin: 'mesin-1', status_kk: false }];
            
            // The function will throw because filter returns empty array and [0].status_kk fails
            expect(() => vm.checkInputAsumsi('mesin-not-found')).toThrow();
        });
    });

    describe('checkUnggahRequiredProp', () => {
        it('returns true when required props are missing', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            const result = vm.checkUnggahRequiredProp('-', '', 0);
            expect(result).toBe(true);
        });

        it('returns false when all required props are present', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            const result = vm.checkUnggahRequiredProp(1000000, '2020', 25);
            expect(result).toBe(false);
        });
    });

    describe('Page limit change', () => {
        it('changes page limit and resets to page 1', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            // Set initial state
            mocks.rekapNavigationStore.currentPage = 5;
            vi.clearAllMocks();
            
            // changePageLimit doesn't take parameters - it uses the store's pageLimit
            await vm.changePageLimit();
            
            // It should reset currentPage to 1 and fetch data
            expect(mocks.rekapNavigationStore.currentPage).toBe(1);
            expect(mocks.rekapService.getSentralData).toHaveBeenCalled();
        });
    });

    describe('generatePageList computed', () => {
        it('generates page list for few pages', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.totalPages = 3;
            vm.currentPage = 1;
            
            expect(vm.generatePageList).toEqual([1, 2, 3]);
        });

        it('generates page list for many pages at start', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.totalPages = 10;
            vm.currentPage = 2;
            
            const pageList = vm.generatePageList;
            expect(pageList).toContain(1);
            expect(pageList).toContain('...');
            expect(pageList).toContain(10);
        });

        it('generates page list for many pages at end', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.totalPages = 10;
            vm.currentPage = 9;
            
            const pageList = vm.generatePageList;
            expect(pageList).toContain(1);
            expect(pageList).toContain('...');
            expect(pageList).toContain(10);
        });

        it('generates page list for many pages in middle', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.totalPages = 10;
            vm.currentPage = 5;
            
            const pageList = vm.generatePageList;
            expect(pageList).toContain(1);
            expect(pageList).toContain(10);
        });
    });

    describe('Modal states', () => {
        it('handles isModalUnggahKertasKerjaOpen', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.isModalUnggahKertasKerjaOpen).toBe(false);
            vm.isModalUnggahKertasKerjaOpen = true;
            expect(vm.isModalUnggahKertasKerjaOpen).toBe(true);
        });

        it('handles isModalUnggahFSOpen', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.isModalUnggahFSOpen).toBe(false);
            vm.isModalUnggahFSOpen = true;
            expect(vm.isModalUnggahFSOpen).toBe(true);
        });

        it('handles showModal', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.showModal).toBe(false);
            vm.showModal = true;
            expect(vm.showModal).toBe(true);
        });

        it('handles isRekapDialogOpen', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.isRekapDialogOpen).toBe(false);
            vm.isRekapDialogOpen = true;
            expect(vm.isRekapDialogOpen).toBe(true);
        });

        it('handles isFSDialogOpen', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.isFSDialogOpen).toBe(false);
            vm.isFSDialogOpen = true;
            expect(vm.isFSDialogOpen).toBe(true);
        });
    });

    describe('Upload with evidence', () => {
        it('uploads KK with evidence file', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            const file = new File(['content'], 'test.xlsx');
            const evidenceFile = new File(['evidence'], 'evidence.pdf');
            vm.selectedFile = file;
            vm.selectedFileEvidence = evidenceFile;
            vm.currentIdMesin = 'mesin-1';
            
            mocks.rekapService.uploadTemplateAwalKK.mockResolvedValue({ success: true });
            mocks.rekapService.uploadEvidence.mockResolvedValue({ data: 'path/to/evidence' });
            mocks.rekapService.updateEvidencePath.mockResolvedValue({ success: true });
            
            await vm.uploadFile();
            
            expect(mocks.rekapService.uploadEvidence).toHaveBeenCalled();
        });

        it('validates evidence file size', async () => {
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            const file = new File(['content'], 'test.xlsx');
            const largeEvidenceFile = { size: 10000000, name: 'evidence.pdf' };
            vm.selectedFile = file;
            vm.selectedFileEvidence = largeEvidenceFile;
            
            await vm.uploadFile();
            
            expect(mocks.notifyError).toHaveBeenCalledWith(expect.stringContaining('5MB'), expect.any(Number));
        });
    });

    describe('Null data handling', () => {
        it('handles null data from getNilaiSentral', async () => {
            mocks.rekapService.getNilaiSentral.mockResolvedValue({ data: null, success: true });
            
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.sentralAssetIRRNPV).toEqual([]);
        });

        it('handles null data from getNilaiMesin', async () => {
            mocks.rekapService.getNilaiMesin.mockResolvedValue({ data: null, success: true });
            
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.mesinSisaIRRNPV).toEqual([]);
        });

        it('handles null data from getStatusFSSentral', async () => {
            mocks.rekapService.getStatusFSSentral.mockResolvedValue({ data: null, success: true });
            
            const wrapper = mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            expect(vm.statusFSSentral).toEqual([]);
        });
    });
});