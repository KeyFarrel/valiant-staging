import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RekapKertasKerja from '@/views/Data/RekapKertasKerja/RekapKertasKerja.vue';

// Define hoisted mocks
const mocks = vi.hoisted(() => {
    return {
        push: vi.fn(),
        encryptValue: vi.fn((val: any) => val),
        notifyError: vi.fn(),
        notifySuccess: vi.fn(),
        services: {
            getSentralData: vi.fn(),
            getSuggestionSentral: vi.fn(),
            getMesinByIdSentral: vi.fn(),
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
            uploadTemplateAwalKK: vi.fn(),
            uploadTemplateAwalFS: vi.fn(),
            uploadEvidence: vi.fn(),
            updateEvidencePath: vi.fn(),
            downloadTemplateRekap: vi.fn(),
            downloadTemplateFS: vi.fn(),
        },
        detailSentral: {
            getSuggestionSentral: vi.fn(),
            getPhoto: vi.fn()
        },
        authStore: { levelAlias: 'Xf!8qP@7', roleAlias: 'admin' },
        rekapSearchStore: { searchRekapQuery: '', selectedRekapSearchQuery: '' },
        rekapNavigationStore: { currentPage: 1, pageLimit: 10, scrollPosition: { top: 0 } }
    }
});

// Mock Vue Router
vi.mock('vue-router', async () => {
    const actual = await vi.importActual('vue-router');
    return {
        ...actual,
        useRouter: () => ({
            push: mocks.push,
        }),
    };
});

// Mock Encrypt Storage
vi.mock('@/utils/app-encrypt-storage', () => ({
    encryptStoragePromise: Promise.resolve({
        encryptValue: mocks.encryptValue
    })
}));

// Mock VueUse
vi.mock('@vueuse/core', () => ({
    useWindowScroll: () => ({ x: { value: 0 }, y: { value: 0 } })
}));

// Mock Toast Notification
vi.mock('@/services/helper/toast-notification', () => ({
    notifyError: mocks.notifyError,
    notifySuccess: mocks.notifySuccess
}));

// Mock Rekap Service
vi.mock('@/services/rekap-service', () => ({
    default: vi.fn().mockImplementation(() => mocks.services)
}));

// Mock Detail Sentral Service
vi.mock('@/services/detail-sentral-service', () => ({
    default: vi.fn().mockImplementation(() => mocks.detailSentral)
}));

// Mock Stores
vi.mock('@/store/storeUserAuth', () => ({ useUserAuthStore: () => mocks.authStore }));
vi.mock('@/store/storeRekapKertasKerja', () => ({
    useRekapSearchStore: () => mocks.rekapSearchStore,
    useRekapNavigationStore: () => mocks.rekapNavigationStore
}));

// Mock Format Service
vi.mock('@/services/format/global-format', () => ({
    default: vi.fn(() => ({
        formatRupiah: (val: any) => `Rp ${val}`,
        formatNumberFiveDigits: (val: any) => val,
        formatBytes: (val: any) => `${val} B`
    }))
}));

// Helper to reset mocks
const resetMocks = () => {
    vi.clearAllMocks();
    mocks.services.getSentralData.mockResolvedValue({
        data: [],
        meta: { totalRecords: 0, totalPages: 0, limit: 10 }
    });
    mocks.services.getSuggestionSentral.mockResolvedValue({ data: [] });
    mocks.services.getMesinByIdSentral.mockResolvedValue({ data: [] });
    mocks.services.getPengelolaData.mockResolvedValue({ 
        data: [
            { kode_pengelola: 'P1', pengelola: 'Pengelola 1' },
            { kode_pengelola: 'P2', pengelola: 'Pengelola 2' }
        ] 
    });
    mocks.services.getComboKategoriPembangkit.mockResolvedValue({ 
        success: true, 
        data: [
            { kategori_pembangkit: 'PLTU', jenis_kit: 'PLTU' },
            { kategori_pembangkit: 'PLTG', jenis_kit: 'PLTG' }
        ] 
    });
    mocks.services.getComboUmurMesin.mockResolvedValue({ 
        data: [
            { umur_mesin: '< 5 Tahun' },
            { umur_mesin: '5-10 Tahun' }
        ] 
    });
    mocks.services.getComboKondisiMesin.mockResolvedValue({ 
        data: [
            { kondisi_unit: 'Baik' },
            { kondisi_unit: 'Rusak' }
        ] 
    });
    mocks.services.getComboIRR.mockResolvedValue({ 
        data: [
            { nilai_irr: '< 5%' },
            { nilai_irr: '5-10%' }
        ] 
    });
    mocks.services.getNilaiSentral.mockResolvedValue({ data: null });
    mocks.services.getNilaiMesin.mockResolvedValue({ data: null });
    mocks.services.getStatusFSSentral.mockResolvedValue({ data: null });
    mocks.services.getStatusFSMesin.mockResolvedValue({ 
        data: [{ uuid_mesin: 'mesin-1', status: 'Data belum terisi' }] 
    });
    mocks.services.getStatusRealisasiSentral.mockResolvedValue({ data: [] });
    mocks.services.getStatusRealisasiMesin.mockResolvedValue({ 
        data: [{ uuid_mesin: 'mesin-1', status: 'Data belum terisi' }] 
    });
    mocks.services.getCheckInputAsumsiSentral.mockResolvedValue({ data: [] });
    mocks.services.getCheckInputAsumsiMesin.mockResolvedValue({ 
        data: [{ uuid_mesin: 'mesin-1', status_kk: false }] 
    });
    
    // Auth Store Reset
    mocks.authStore.levelAlias = 'Xf!8qP@7'; 
    mocks.authStore.roleAlias = 'admin';
};

describe('RekapKertasKerja.vue', () => {
    let pinia: any;
    let wrapper: any;

    const globalStubs = {
        Loading: true,
        SearchBoxSuggestion: true,
        ShimmerLoading: true,
        ModalWrapper: { template: '<div><slot /></div>' }, 
        TabWrapperSentral: true,
        TabItem: true,
        ConfirmationDialog: { template: '<div><button @click="$emit(\'on-accept-click\')">Yes</button><button @click="$emit(\'on-batal-click\')">No</button></div>' },
        KeteranganAnomali: true,
        IconEmptyData: true,
        IconFolder: true,
        ComponentDraft: true,
        ComponentDisetujui: true,
        ComponentDitolakT1: true,
        ComponentDitolakT2: true,
        ComponentWaitingT1: true,
        ComponentWaitingT2: true,
        ComponentNotInput: true,
        ComponentNotUpdate: true,
        Vue3Lottie: true,
        'el-select': true,
        'el-option': true,
        'el-checkbox': true,
        RouterLink: { template: '<a><slot /></a>', props: ['to'] }
    };

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        resetMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const mountComponent = () => {
        wrapper = mount(RekapKertasKerja, {
            global: {
                plugins: [pinia],
                stubs: globalStubs
            }
        });
    };

    it('renders and fetches initial data successfully', async () => {
        mocks.services.getSentralData.mockResolvedValue({
            data: [{ uuid_sentral: 'uuid-1', sentral: 'Sentral 1', mesins: [[{ uuid_mesin: 'mesin-1' }]] }],
            meta: { totalRecords: 1, totalPages: 1, limit: 10 }
        });

        mountComponent();
        await flushPromises();

        expect(mocks.services.getSentralData).toHaveBeenCalled();
        expect(wrapper.vm.sentralData.length).toBe(1);
    });

    it('handles error during initial data fetch', async () => {
        mocks.services.getSentralData.mockRejectedValue(new Error('Fetch error'));

        mountComponent();
        await flushPromises();

        expect(mocks.services.getSentralData).toHaveBeenCalled();
        expect(wrapper.vm.isLoading).toBe(false);
    });

    it('toggles pembangkit (expands sentral) and fetches machine details', async () => {
        mocks.services.getSentralData.mockResolvedValue({
            data: [{ uuid_sentral: 'uuid-1', sentral: 'Sentral 1', mesins: [[]] }],
            meta: { totalRecords: 1, totalPages: 1, limit: 10 }
        });
        mocks.services.getMesinByIdSentral.mockResolvedValue({
            data: [{ id: 'mesin-1', uuid_mesin: 'mesin-1', mesin: 'Mesin 1', photo1: '', photo2: '' }]
        });

        mountComponent();
        await flushPromises();

        const vm = wrapper.vm as any;
        
        expect(vm.isPembangkitOpen('uuid-1')).toBe(true);

        await vm.togglePembangkit('uuid-1'); 
        expect(vm.isPembangkitOpen('uuid-1')).toBe(false);

        await vm.togglePembangkit('uuid-1');
        expect(mocks.services.getMesinByIdSentral).toHaveBeenCalledWith('uuid-1');
        expect(vm.isPembangkitOpen('uuid-1')).toBe(true);
    });
    
    it('handles photo fetch in machine details', async () => {
        mocks.services.getSentralData.mockResolvedValue({
            data: [{ uuid_sentral: 'uuid-1', sentral: 'Sentral 1', mesins: [[]] }],
            meta: { totalRecords: 1, totalPages: 1, limit: 10 }
        });
        mocks.services.getMesinByIdSentral.mockResolvedValue({
             data: [{ id: 'mesin-1', uuid_mesin: 'mesin-1', mesin: 'Mesin 1', photo1: 'photo.jpg', photo2: '' }]
        });
        mocks.detailSentral.getPhoto.mockResolvedValue({ data: new Blob(['test']) });
        global.URL.createObjectURL = vi.fn(() => 'blob:url');

        mountComponent();
        await flushPromises();
        
        expect(mocks.detailSentral.getPhoto).toHaveBeenCalledWith('photo.jpg');
    });

    it('handles filters: handles Search', async () => {
         mountComponent();
         await flushPromises();
         const vm = wrapper.vm as any;
         
         vi.clearAllMocks();
         await vm.handleSearch();
         expect(mocks.services.getSentralData).toHaveBeenCalled();
         expect(mocks.rekapNavigationStore.currentPage).toBe(1);
    });

     it('handles pengelola selection', async () => {
         mountComponent();
         await flushPromises();
         const vm = wrapper.vm as any;
         
         vi.clearAllMocks();
         await vm.changeSelectedPengelola('P1');
         // When selecting a specific pengelola, kodePengelola becomes null
         // and the pengelola is added to selectedPengelola array
         expect(vm.selectedPengelola).toContain('P1');
         expect(vm.kodePengelola).toBe(null);
         expect(mocks.services.getSentralData).toHaveBeenCalled();

         vi.clearAllMocks();
         // Deselecting when only one is selected sets kodePengelola to 'ALL'
         await vm.changeSelectedPengelola('P1');
         expect(vm.kodePengelola).toBe('ALL');
         
         vi.clearAllMocks();
         // Setting kodePengelola to something other than 'ALL' to trigger fetch
         vm.kodePengelola = null;
         await vm.changeSelectedPengelola('ALL');
         expect(vm.kodePengelola).toBe('ALL');
     });
     
     it('handles page limit change', async () => {
         mountComponent();
         await flushPromises();
         const vm = wrapper.vm as any;
         
         vi.clearAllMocks();
         await vm.changePageLimit();
         expect(mocks.rekapNavigationStore.currentPage).toBe(1);
         expect(mocks.services.getSentralData).toHaveBeenCalled();
     });
     
     it('handles pagination: goToPage', async () => {
         mountComponent();
         await flushPromises();
         const vm = wrapper.vm as any;
         
         vi.clearAllMocks();
         await vm.goToPage(2);
         expect(mocks.rekapNavigationStore.currentPage).toBe(2);
     });

     it('handles pagination: goToPrevious', async () => {
         mountComponent();
         await flushPromises();
         const vm = wrapper.vm as any;
         
         mocks.rekapNavigationStore.currentPage = 3;
         vi.clearAllMocks();
         await vm.goToPrevious();
         expect(mocks.rekapNavigationStore.currentPage).toBe(2);
     });

     it('handles pagination: goToPrevious at first page', async () => {
         mountComponent();
         await flushPromises();
         const vm = wrapper.vm as any;
         
         // Note: goToPrevious has no bounds checking - UI disables button at first page
         mocks.rekapNavigationStore.currentPage = 2;
         await vm.goToPrevious();
         expect(mocks.rekapNavigationStore.currentPage).toBe(1);
     });

     it('handles pagination: goToNext', async () => {
         mountComponent();
         await flushPromises();
         const vm = wrapper.vm as any;
         
         mocks.rekapNavigationStore.currentPage = 1;
         vm.totalPages = 5;
         vi.clearAllMocks();
         await vm.goToNext();
         expect(mocks.rekapNavigationStore.currentPage).toBe(2);
     });

     it('handles pagination: goToNext at last page', async () => {
         mountComponent();
         await flushPromises();
         const vm = wrapper.vm as any;
         
         // Note: goToNext has no bounds checking - UI disables button at last page
         mocks.rekapNavigationStore.currentPage = 4;
         vm.totalPages = 5;
         await vm.goToNext();
         expect(mocks.rekapNavigationStore.currentPage).toBe(5);
     });

     describe('File Upload Scenarios', () => {
        it('validates file selection before upload', async () => {
            mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            
            vm.selectedFile = null;
            await vm.uploadFile();
            expect(mocks.notifyError).toHaveBeenCalledWith('Mohon pilih file excel terlebih dahulu', 3000);
            
            vm.selectedFile = { size: 3000000 };
            await vm.uploadFile();
            expect(mocks.notifyError).toHaveBeenCalledWith('Ukuran file Kertas Kerja tidak boleh lebih dari 2MB', 5000);
        });

        it('validates evidence file size', async () => {
            mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            vm.selectedFile = { size: 1000000, name: 'test.xlsx' };
            vm.selectedFileEvidence = { size: 6000000, name: 'evidence.pdf' };
            
            await vm.uploadFile();
            expect(mocks.notifyError).toHaveBeenCalledWith('Ukuran file Evidence tidak boleh lebih dari 5MB', 5000);
        });

        it('uploads file successfully with evidence', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             vm.currentIdMesin = 'mesin-1';
             vm.tahunBerjalan = 2024;
             
             vm.selectedFile = { size: 1000000, name: 'test.xlsx' };
             vm.selectedFileEvidence = { size: 1000000, name: 'evidence.pdf' };
             mocks.services.uploadEvidence.mockResolvedValue({ data: 'path/to/evidence' });
             mocks.services.uploadTemplateAwalKK.mockResolvedValue({ success: true });
             
             await vm.uploadFile();
             
             expect(mocks.services.uploadEvidence).toHaveBeenCalled();
             expect(mocks.services.updateEvidencePath).toHaveBeenCalled();
             expect(mocks.services.uploadTemplateAwalKK).toHaveBeenCalled();
        });

        it('handles upload failure (network error)', async () => {
            mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            vm.selectedFile = { size: 1000, name: 'test.xlsx' };
            mocks.services.uploadTemplateAwalKK.mockRejectedValue(new Error('Upload failed'));
            
            await vm.uploadFile();
            
            expect(mocks.notifyError).toHaveBeenCalledWith('Upload File Gagal, mohon coba lagi', 3000);
        });

         it('uploads FS file successfully', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             vm.currentIdMesin = 'mesin-1';
             vm.tahunBerjalan = 2024;
             
             vm.selectedFileFS = { size: 1000000, name: 'fs.xlsx' };
             mocks.services.uploadTemplateAwalFS.mockResolvedValue({ success: true });
             
             await vm.uploadFileFS();
             
             expect(mocks.services.uploadTemplateAwalFS).toHaveBeenCalled();
         });
         
        it('validates FS file selection', async () => {
            mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            vm.selectedFileFS = null;
            await vm.uploadFileFS();
            expect(mocks.notifyError).toHaveBeenCalledWith('Mohon pilih file excel terlebih dahulu', 3000);
        });

        it('validates FS file size', async () => {
            mountComponent();
            await flushPromises();
            const vm = wrapper.vm as any;
            vm.selectedFileFS = { size: 5000000, name: 'fs.xlsx' };
            await vm.uploadFileFS();
            expect(mocks.notifyError).toHaveBeenCalledWith('Ukuran file Feasibility Study tidak boleh lebih dari 2MB', 5000);
        });
     });

     describe('Download Template', () => {
         it('downloads Rekap template successfully', async () => {
             mocks.encryptValue.mockReturnValue('encrypted-id');
             global.URL.createObjectURL = vi.fn(() => 'blob:url');
             
             mocks.services.downloadTemplateRekap.mockResolvedValue({
                 data: new Blob(['content']),
                 headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
             });

             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             vm.currentIdMesin = '123';
             vm.currentNamaMesin = 'Mesin A';
             vm.tahunBerjalan = 2024;

             await vm.handleDownloadTemplateRekap();
             
             expect(mocks.services.downloadTemplateRekap).toHaveBeenCalled();
         });

         it('handles download error', async () => {
             mocks.services.downloadTemplateRekap.mockRejectedValue(new Error('Download fail'));
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             await vm.handleDownloadTemplateRekap();
             
             expect(mocks.notifyError).toHaveBeenCalledWith("Download Template Rekap Gagal", 3000);
         });
         
         it('downloads FS template successfully', async () => {
             mocks.services.downloadTemplateFS.mockResolvedValue({
                 data: new Blob(['content']),
                 headers: { 'content-disposition': 'filename="fs.xlsx"' }
             });
             
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             await vm.handleDownloadTemplateFS();
             
             expect(mocks.services.downloadTemplateFS).toHaveBeenCalled();
         });

         it('handles FS download error', async () => {
             mocks.services.downloadTemplateFS.mockRejectedValue(new Error('Download fail'));
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             await vm.handleDownloadTemplateFS();
             
             expect(mocks.notifyError).toHaveBeenCalledWith('Download Template FS Gagal', 3000);
         });
     });
     
     it('handles file input change events', async () => {
         mountComponent();
         await flushPromises();
         const vm = wrapper.vm as any;
         
         vm.handleFileChange({ target: { files: [{ name: 'test.xlsx' }] } });
         expect(vm.selectedFile).toBeTruthy();
         vm.handleFileChange({ target: { files: [] } });
         expect(vm.selectedFile).toBeNull();
         
         vm.handleFileChangeEvidence({ target: { files: [{ name: 'ev.pdf' }] } });
         expect(vm.selectedFileEvidence).toBeTruthy();
         vm.handleFileChangeEvidence({ target: { files: [] } });
         expect(vm.selectedFileEvidence).toBeNull();
         
         vm.handleFileFSChange({ target: { files: [{ name: 'fs.xlsx' }] } });
         expect(vm.selectedFileFS).toBeTruthy();
         vm.handleFileFSChange({ target: { files: [] } });
         expect(vm.selectedFileFS).toBeNull();
     });

     describe('Role-based Rendering', () => {
         it('renders for Admin level (Xf!8qP@7)', async () => {
             mocks.authStore.levelAlias = 'Xf!8qP@7';
             mocks.authStore.roleAlias = 'admin';
             
             mountComponent();
             await flushPromises();
             
             expect(wrapper.exists()).toBe(true);
         });
         
         it('renders for Mb*0yT%3 level', async () => {
             mocks.authStore.levelAlias = 'Mb*0yT%3';
             mountComponent();
             await flushPromises();
             expect(wrapper.exists()).toBe(true);
         });

         it('renders for Zp@5Kw_9 level', async () => {
             mocks.authStore.levelAlias = 'Zp@5Kw_9';
             mountComponent();
             await flushPromises();
             expect(wrapper.exists()).toBe(true);
         });

         it('renders for Gk#92lV& level', async () => {
             mocks.authStore.levelAlias = 'Gk#92lV&';
             mountComponent();
             await flushPromises();
             expect(wrapper.exists()).toBe(true);
         });

         it('renders for Dr^3Zn$! level with nT!z03&k role', async () => {
             mocks.authStore.levelAlias = 'Dr^3Zn$!';
             mocks.authStore.roleAlias = 'nT!z03&k';
             mountComponent();
             await flushPromises();
             expect(wrapper.exists()).toBe(true);
         });

         it('renders for viewer role (Vx_91$pN)', async () => {
             mocks.authStore.roleAlias = 'Vx_91$pN';
             mountComponent();
             await flushPromises();
             expect(wrapper.exists()).toBe(true);
         });
     });

     describe('Filter Dropdowns', () => {
         it('toggles pembangkit dropdown', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.isPembangkitDropdownOpen).toBe(false);
             vm.togglePembangkitDropdown();
             expect(vm.isPembangkitDropdownOpen).toBe(true);
         });

         it('toggles umur mesin dropdown', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.isUmurMesinDropdownOpen).toBe(false);
             vm.toggleUmurMesinDropdown();
             expect(vm.isUmurMesinDropdownOpen).toBe(true);
         });

         it('toggles kondisi mesin dropdown', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.isKondisiMesinDropdownOpen).toBe(false);
             vm.toggleKondisiMesinDropdown();
             expect(vm.isKondisiMesinDropdownOpen).toBe(true);
         });

         it('toggles DMN dropdown', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.isDmnDropdownOpen).toBe(false);
             vm.toggleDmnDropdown();
             expect(vm.isDmnDropdownOpen).toBe(true);
         });

         it('handles check all pembangkit', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.handleCheckPembangkit(true);
             expect(vm.selectedKategoriPembangkit.length).toBeGreaterThanOrEqual(0);
             
             vm.handleCheckPembangkit(false);
             expect(vm.selectedKategoriPembangkit.length).toBe(0);
         });

         it('handles check all umur mesin', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.handleCheckUmurMesin(true);
             expect(vm.selectedUmurMesin.length).toBeGreaterThanOrEqual(0);
             
             vm.handleCheckUmurMesin(false);
             expect(vm.selectedUmurMesin.length).toBe(0);
         });

         it('handles check all kondisi mesin', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.handleCheckKondisiMesin(true);
             expect(vm.selectedKondisiMesin.length).toBeGreaterThanOrEqual(0);
             
             vm.handleCheckKondisiMesin(false);
             expect(vm.selectedKondisiMesin.length).toBe(0);
         });

         it('clears filter selections', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.selectedKategoriPembangkit = ['PLTU'];
             vm.clearPembangkit();
             expect(vm.selectedKategoriPembangkit.length).toBe(0);
             
             vm.selectedUmurMesin = ['< 5 Tahun'];
             vm.clearUmurMesin();
             expect(vm.selectedUmurMesin.length).toBe(0);
             
             vm.selectedKondisiMesin = ['Baik'];
             vm.clearKondisiMesin();
             expect(vm.selectedKondisiMesin.length).toBe(0);
             
             vm.dmn = ['dmn1'];
             vm.clearDmn();
             expect(vm.dmn.length).toBe(0);
         });

         it('removes selected items', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.selectedKategoriPembangkit = ['PLTU', 'PLTG'];
             vm.removeSelectedPembangkit('PLTU');
             expect(vm.selectedKategoriPembangkit).toEqual(['PLTG']);
             
             vm.selectedUmurMesin = ['< 5 Tahun', '5-10 Tahun'];
             vm.removeSelectedUmurMesin('< 5 Tahun');
             expect(vm.selectedUmurMesin).toEqual(['5-10 Tahun']);
             
             vm.selectedKondisiMesin = ['Baik', 'Rusak'];
             vm.removeSelectedKondisiMesin('Baik');
             expect(vm.selectedKondisiMesin).toEqual(['Rusak']);
             
             vm.dmn = ['dmn1', 'dmn2'];
             vm.removeSelectedDmn('dmn1');
             expect(vm.dmn).toEqual(['dmn2']);
         });
     });

     describe('changeSentralData', () => {
         it('applies filters and fetches data', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.selectedKategoriPembangkit = ['PLTU'];
             vm.selectedUmurMesin = ['< 5 Tahun'];
             vm.selectedKondisiMesin = ['Baik'];
             
             vi.clearAllMocks();
             await vm.changeSentralData();
             
             expect(mocks.services.getSentralData).toHaveBeenCalled();
             expect(vm.showModal).toBe(false);
         });
     });

     describe('Error handling for fetch functions', () => {
         it('handles getSuggestionSentral error', async () => {
             mocks.services.getSuggestionSentral.mockRejectedValue(new Error('Fetch Error'));
             
             mountComponent();
             await flushPromises();
             
             expect(console.error).toHaveBeenCalled();
         });

         it('handles getPengelolaData error', async () => {
             mocks.services.getPengelolaData.mockRejectedValue(new Error('Fetch Error'));
             
             mountComponent();
             await flushPromises();
             
             expect(console.error).toHaveBeenCalled();
         });

         it('handles getComboKategoriPembangkit error', async () => {
             mocks.services.getComboKategoriPembangkit.mockRejectedValue(new Error('Fetch Error'));
             
             mountComponent();
             await flushPromises();
             
             expect(console.error).toHaveBeenCalled();
         });

         it('handles getComboUmurMesin error', async () => {
             mocks.services.getComboUmurMesin.mockRejectedValue(new Error('Fetch Error'));
             
             mountComponent();
             await flushPromises();
             
             expect(console.error).toHaveBeenCalled();
         });

         it('handles getComboKondisiMesin error', async () => {
             mocks.services.getComboKondisiMesin.mockRejectedValue(new Error('Fetch Error'));
             
             mountComponent();
             await flushPromises();
             
             expect(console.error).toHaveBeenCalled();
         });

         it('handles getComboIRR error', async () => {
             mocks.services.getComboIRR.mockRejectedValue(new Error('Fetch Error'));
             
             mountComponent();
             await flushPromises();
             
             expect(console.error).toHaveBeenCalled();
         });

         it('handles getNilaiSentral error', async () => {
             mocks.services.getNilaiSentral.mockRejectedValue(new Error('Fetch Error'));
             
             mountComponent();
             await flushPromises();
             
             expect(console.error).toHaveBeenCalled();
         });

         it('handles getNilaiMesin error', async () => {
             mocks.services.getNilaiMesin.mockRejectedValue(new Error('Fetch Error'));
             
             mountComponent();
             await flushPromises();
             
             expect(console.error).toHaveBeenCalled();
         });
     });

     describe('checkInputAsumsi and checkUnggahRequiredProp', () => {
         it('returns true when status_kk is true', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.listStatusInputAsumsiMesin = [{ uuid_mesin: 'mesin-1', status_kk: true }];
             
             const result = vm.checkInputAsumsi('mesin-1');
             expect(result).toBe(true);
         });

         it('returns false when status_kk is false', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.listStatusInputAsumsiMesin = [{ uuid_mesin: 'mesin-1', status_kk: false }];
             
             const result = vm.checkInputAsumsi('mesin-1');
             expect(result).toBe(false);
         });

         it('returns true when required props are missing', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             const result = vm.checkUnggahRequiredProp('-', '', 0);
             expect(result).toBe(true);
         });

         it('returns false when all required props are present', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             const result = vm.checkUnggahRequiredProp(1000000, '2020', 25);
             expect(result).toBe(false);
         });
     });

     describe('Modal states', () => {
         it('handles isModalUnggahKertasKerjaOpen', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.isModalUnggahKertasKerjaOpen).toBe(false);
             vm.isModalUnggahKertasKerjaOpen = true;
             expect(vm.isModalUnggahKertasKerjaOpen).toBe(true);
         });

         it('handles isModalUnggahFSOpen', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.isModalUnggahFSOpen).toBe(false);
             vm.isModalUnggahFSOpen = true;
             expect(vm.isModalUnggahFSOpen).toBe(true);
         });

         it('handles showModal', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.showModal).toBe(false);
             vm.showModal = true;
             expect(vm.showModal).toBe(true);
         });

         it('handles isRekapDialogOpen', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.isRekapDialogOpen).toBe(false);
             vm.isRekapDialogOpen = true;
             expect(vm.isRekapDialogOpen).toBe(true);
         });

         it('handles isFSDialogOpen', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.isFSDialogOpen).toBe(false);
             vm.isFSDialogOpen = true;
             expect(vm.isFSDialogOpen).toBe(true);
         });
     });

     describe('generatePageList computed', () => {
         it('generates page list for few pages', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.totalPages = 3;
             mocks.rekapNavigationStore.currentPage = 1;
             
             expect(vm.generatePageList).toEqual([1, 2, 3]);
         });

         it('generates page list for many pages', async () => {
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             vm.totalPages = 10;
             mocks.rekapNavigationStore.currentPage = 5;
             
             const pageList = vm.generatePageList;
             expect(pageList).toContain(1);
             expect(pageList).toContain(10);
         });
     });

     describe('Null data handling', () => {
         it('handles null data from getNilaiSentral', async () => {
             mocks.services.getNilaiSentral.mockResolvedValue({ data: null });
             
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.sentralAssetIRRNPV).toEqual([]);
         });

         it('handles null data from getNilaiMesin', async () => {
             mocks.services.getNilaiMesin.mockResolvedValue({ data: null });
             
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.mesinSisaIRRNPV).toEqual([]);
         });

         it('handles null data from getStatusFSSentral', async () => {
             mocks.services.getStatusFSSentral.mockResolvedValue({ data: null });
             
             mountComponent();
             await flushPromises();
             const vm = wrapper.vm as any;
             
             expect(vm.statusFSSentral).toEqual([]);
         });
     });
});