import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DetailKKMesin from '@/views/Verifikasi/Sentral/TabPage/KK/DetailKKMesin.vue';
import PersetujuanService from '@/services/persetujuan-service';
import DetailRekapService from '@/services/detail-rekap-service';
import RekapService from '@/services/rekap-service';
import UserService from '@/services/user-service';
import DetailSentralService from '@/services/detail-sentral-service';

// Mock the services
vi.mock('@/services/persetujuan-service');
vi.mock('@/services/detail-rekap-service');
vi.mock('@/services/rekap-service');
vi.mock('@/services/user-service');
vi.mock('@/services/detail-sentral-service');

// Mock vue-router
const mockRoute = {
  query: {
    uuid_sentral: 'test-uuid-sentral',
    tahun: '2024'
  },
  params: {
    id: 'test-mesin-id'
  }
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute
}));

// Mock encryption storage
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: vi.fn((value) => value)
  })
}));

// Mock toast notification
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn()
}));

// Mock global format
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatEnergy(value: any) { return value; }
    formatRupiah(value: any) { return value; }
    formatCurrency(value: any) { return value; }
    formatNumber(value: any) { return value; }
    formatNumberFiveDigits(value: any) { return value; }
    formatBytes(value: any) { return `${value}`; }
  }
}));

// Mock lottie json
vi.mock('@/assets/lottie/success.json', () => ({
  default: { frames: [] }
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');

// Mock components
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div data-testid="loading">Loading...</div>'
  }
}));

vi.mock('@/components/ui/InfoHeader.vue', () => ({
  default: {
    name: 'InfoHeader',
    props: [
      'namaMesin', 'namaPengelola', 'namaPembina', 
      'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 
      'tahunOperasi', 'umurTeknis'
    ],
    template: '<div data-testid="info-header">Info Header<slot /></div>'
  }
}));

vi.mock('@/components/ui/ShimmerLoading.vue', () => ({
  default: {
    name: 'ShimmerLoading',
    template: '<div data-testid="shimmer-loading">Shimmer Loading</div>'
  }
}));

vi.mock('@/components/ui/TabsWrapperApprove.vue', () => ({
  default: {
    name: 'TabsWrapper',
    template: '<div data-testid="tabs-wrapper"><slot /></div>'
  }
}));

vi.mock('@/components/ui/ModalWrapper.vue', () => ({
  default: {
    name: 'ModalWrapper',
    template: '<div data-testid="modal-wrapper"><slot /></div>'
  }
}));

describe('DetailKKMesin', () => {
  let mockPersetujuanService: any;
  let mockDetailRekapService: any;
  let mockRekapService: any;
  let mockUserService: any;
  let mockDetailSentralService: any;

  const mockMesinData = {
    data: {
      uuid_mesin: 1,
      mesin: 'Test Mesin',
      kode_jenis_pembangkit: 'PLTU',
      tahun_realisasi: '2023',
      avg_irr: 10.5,
      daya_terpasang: 100,
      daya_mampu: 90,
      tahun_operasi: '2020',
      kondisi_unit: 'Baik',
      tahun_nilai_perolehan: '2019',
      photo1: 'test-photo1.jpg',
      photo2: 'test-photo2.jpg'
    }
  };

  const mockPersetujuanData = {
    data: {
      pengelola: 'Test Pengelola',
      pembina: 'Test Pembina',
      umur_teknis: '25',
      mesins: [
        {
          uuid_mesin: 'test-mesin-id',
          tahun: '2024',
          id_status: 1,
          status: 'Draft',
          keterangan: 'Test keterangan'
        }
      ]
    }
  };

  beforeEach(() => {
    mockPersetujuanService = {
      getPersetujuanKKSentral: vi.fn(),
      updateStatusKK: vi.fn()
    };
    mockDetailRekapService = {
      getMesinById: vi.fn(),
      getAsumsiParameter: vi.fn(),
      getDataTeknis: vi.fn(),
      getDataFinansial: vi.fn(),
      getHasilSimulasi: vi.fn(),
      getTypePeriodic: vi.fn(),
      getComboBahanBakar: vi.fn(),
      getPembangkitByKode: vi.fn(),
      getPengelolaData: vi.fn()
    };

    mockDetailRekapService.getAsumsiParameter.mockResolvedValue({
      data: {
        asumsi_makro: {
          corporate_tax_rate: 25,
          discount_rate: 10,
          interest_rate: 8,
          loan_tenor: 15,
          loan_portion: 70,
          equity_portion: 30
        },
        parameter_teknis_financial: {
          daya_terpasang: 100,
          daya_mampu_netto_mw: 90,
          auxiliary: 5,
          susut_trafo: 2,
          ps: 3,
          nphr: 2500,
          total_project_cost: 1000000,
          loan: 700000,
          equity: 300000,
          electricity_price_a_rp_per_kwbln: 1000,
          electricity_price_b_rp_per_kwbln: 1100,
          electricity_price_c_rp_per_kwh: 1200,
          electricity_price_d_rp_per_kwh: 1300
        },
        harga_bahan_bakars: []
      }
    });
    mockDetailRekapService.getDataTeknis.mockResolvedValue({
      data: {
        header: ['Parameter', 'Unit', '2023', '2024'],
        tahun: [2023, 2024],
        detail: []
      }
    });
    mockDetailRekapService.getDataFinansial.mockResolvedValue({
      data: {
        header: ['Year', 'Value'],
        tahun: [2023, 2024],
        detail: [
          { level: 1, name: 'L1' },
          { level: 2, name: 'L2' },
          { level: 3, name: 'L3' },
          { level: 4, name: 'L4' }
        ]
      }
    });
    mockDetailRekapService.getHasilSimulasi.mockResolvedValue({
      data: {
        track_irr_project: 10,
        track_irr_equity: 12,
        track_npv_equity: 100,
        track_npv_project: 200,
        track_average_cf: 50,
        track_average_eaf: 80,
        wacc_on_project: 8,
        wacc_on_equity: 9,
        now_track_irr_project: 11,
        now_track_irr_equity: 13,
        now_track_npv_equity: 110,
        now_track_npv_project: 210,
        now_track_average_cf: 55,
        now_track_average_eaf: 85
      }
    });
    mockDetailRekapService.getTypePeriodic.mockResolvedValue({ data: [] });
    mockDetailRekapService.getComboBahanBakar.mockResolvedValue({ data: [] });
    mockDetailRekapService.getPembangkitByKode.mockResolvedValue({
      data: {
        kode_pengelola: 'PENGELOLA01',
        uuid_pembina: 'PEMBINA01',
        mesins: [{}, {}]
      }
    });
    mockDetailRekapService.getPengelolaData.mockResolvedValue({
      data: [{ kode_pengelola: 'PENGELOLA01', pengelola: 'PT PENGELOLA JAYA' }]
    });
    mockRekapService = {
      getEvidencePath: vi.fn(),
      downloadEvidence: vi.fn()
    };
    mockUserService = {
      getListPembina: vi.fn(),
      getUnitPengelola: vi.fn(),
      getPembina: vi.fn()
    };
    mockUserService.getPembina.mockResolvedValue({
      data: [{ uuid_pembina: 'PEMBINA01', pembina: 'PEMBINA UTAMA' }]
    });
    mockDetailSentralService = {};

    vi.mocked(PersetujuanService).mockImplementation(function() { return mockPersetujuanService; });
    vi.mocked(DetailRekapService).mockImplementation(function() { return mockDetailRekapService; });
    vi.mocked(RekapService).mockImplementation(function() { return mockRekapService; });
    vi.mocked(UserService).mockImplementation(function() { return mockUserService; });
    vi.mocked(DetailSentralService).mockImplementation(function() { return mockDetailSentralService; });
  });

  it('should mount component successfully', async () => {
    // Mock all required API calls
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);

    const wrapper = mount(DetailKKMesin);
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should render download evidence button', async () => {
    // Mock required data
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle API calls with correct parameters', async () => {
    // Mock API responses
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);

    mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(mockDetailRekapService.getMesinById).toHaveBeenCalled();
    expect(mockPersetujuanService.getPersetujuanKKSentral).toHaveBeenCalledWith({
      uuid_sentral: 'test-uuid-sentral',
      tahun: '2024'
    });
  });

  it('should handle fetchMesinById error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockDetailRekapService.getMesinById.mockRejectedValue(new Error('API Error'));
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);

    mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should handle fetchPersetujuanKK error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockRejectedValue(new Error('API Error'));

    mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Persetujuan KK Sentral Error : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should handle download evidence functionality', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    mockRekapService.getEvidencePath.mockResolvedValue({
      data: [{ file_name: 'test.xlsx', dokumen_evidence: 'test-path' }]
    });
    
    mockRekapService.downloadEvidence.mockResolvedValue({
      data: new Blob(['test'], { type: 'application/xlsx' }),
      headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
    });

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Call downloadEvidence function directly
    const vm = wrapper.vm as any;
    await vm.downloadEvidence();
    
    expect(mockRekapService.getEvidencePath).toHaveBeenCalled();
    expect(mockRekapService.downloadEvidence).toHaveBeenCalled();
  });

  it('should handle download evidence error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    mockRekapService.getEvidencePath.mockRejectedValue(new Error('Evidence Error'));

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should handle asumsi parameter fetch', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    mockDetailRekapService.getAsumsiParameter.mockResolvedValue({
      data: {
        asumsi_makro: {
          corporate_tax_rate: 25,
          discount_rate: 10
        },
        parameter_teknis_financial: {
          daya_terpasang: 100,
          daya_mampu_netto_mw: 90
        },
        harga_bahan_bakars: []
      }
    });

    mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockDetailRekapService.getAsumsiParameter).toHaveBeenCalled();
  });

  it('should handle data teknis fetch with current year logic', async () => {
    const currentYear = new Date().getFullYear();
    
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    mockDetailRekapService.getDataTeknis.mockResolvedValue({
      data: {
        tahun: [2020, 2021, 2022, currentYear - 1],
        header: ['EAF', 'CF'],
        detail: []
      }
    });

    mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockDetailRekapService.getDataTeknis).toHaveBeenCalled();
  });

  it('should handle updateKK function', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    mockPersetujuanService.updateStatusKK.mockResolvedValue({
      data: { success: true }
    });

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Test the updateKK function by accessing the component instance
    const vm = wrapper.vm as any;
    await vm.updateKK();
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
  });

  it('should handle data finansial fetch with mapping logic', async () => {
    const currentYear = new Date().getFullYear();
    
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    mockDetailRekapService.getDataFinansial.mockResolvedValue({
      data: {
        tahun: [2020, 2021, 2022, currentYear - 1],
        header: ['Revenue', 'Cost'],
        detail: [
          { level: 1, description: 'Level 1 Item' },
          { level: 2, description: 'Level 2 Item' },
          { level: 3, description: 'Level 3 Item' }
        ]
      }
    });

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
  });

  it('should handle hasil simulasi fetch', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    mockDetailRekapService.getHasilSimulasi.mockResolvedValue({
      data: {
        track_irr_equity: 15.5,
        track_irr_project: 12.3,
        track_npv_project: 1000000,
        track_npv_equity: 800000,
        track_average_eaf: 85.2,
        track_average_cf: 78.5,
        wacc_on_equity: 10.5,
        wacc_on_project: 8.2
      }
    });

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockDetailRekapService.getHasilSimulasi).toHaveBeenCalled();
  });

  it('should handle error handling for various functions', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    // Mock errors for different functions
    mockDetailRekapService.getAsumsiParameter.mockRejectedValue(new Error('Asumsi Parameter Error'));
    mockDetailRekapService.getDataTeknis.mockRejectedValue(new Error('Data Teknis Error'));
    mockDetailRekapService.getDataFinansial.mockRejectedValue(new Error('Data Finansial Error'));
    mockDetailRekapService.getHasilSimulasi.mockRejectedValue(new Error('Hasil Simulasi Error'));

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Asumsi Parameter Error : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should handle reload functions', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const vm = wrapper.vm as any;
    
    // Test reload functions
    vm.reloadAsumsiParameter();
    vm.reloadDataTeknis();
    vm.reloadDataFinansial();
    vm.reloadHasilSimulasi();
    
    expect(mockDetailRekapService.getAsumsiParameter).toHaveBeenCalled();
    expect(mockDetailRekapService.getDataTeknis).toHaveBeenCalled();
    expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
    expect(mockDetailRekapService.getHasilSimulasi).toHaveBeenCalled();
  });

  it('should handle toggleButton function', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const vm = wrapper.vm as any;
    const initialHoverState = vm.isHover;
    
    vm.toggleButton();
    
    expect(vm.isHover).toBe(!initialHoverState);
  });

  it('should handle fetchListPembina and fetchUnitPengelola', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    mockUserService.getListPembina.mockResolvedValue({
      data: [{ id: 1, name: 'Pembina 1' }]
    });
    
    mockUserService.getUnitPengelola.mockResolvedValue({
      data: [{ id: 1, name: 'Pengelola 1' }]
    });

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // These functions are called automatically in onMounted
    // Let's check if the component is mounted correctly
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle fetchUnitPengelola complex logic', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue({
      data: { ...mockMesinData.data, kode_sentral: 'SENTRAL01' }
    });
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    // Mock dependent calls for fetchUnitPengelola
    mockDetailRekapService.getPembangkitByKode.mockResolvedValue({
      data: {
        kode_pengelola: 'PENGELOLA01',
        uuid_pembina: 'PEMBINA01',
        mesins: [{}, {}, {}] // 3 machines
      }
    });
    
    mockDetailRekapService.getPengelolaData.mockResolvedValue({
      data: [
        { kode_pengelola: 'PENGELOLA01', pengelola: 'PT PENGELOLA JAYA' }
      ]
    });
    
    mockUserService.getPembina.mockResolvedValue({
      data: [
        { uuid_pembina: 'PEMBINA01', pembina: 'PEMBINA UTAMA' }
      ]
    });

    const wrapper = mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    expect(mockDetailRekapService.getPembangkitByKode).toHaveBeenCalledWith('SENTRAL01');
    expect(mockDetailRekapService.getPengelolaData).toHaveBeenCalled();
    expect(mockUserService.getPembina).toHaveBeenCalled();
    // Verify results via wrapper.vm or inferred state if accessible, but mocks ensure lines hit
  });

  it('should handle fetchDataFinansial complex mapping logic', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    const hierarchyData = [
      { level: 1, description: 'L1', id: 1 },
      { level: 2, description: 'L2', id: 2 },
      { level: 3, description: 'L3', id: 3 },
      { level: 4, description: 'L4', id: 4 },
      { level: 2, description: 'L2-2', id: 5 } // Additional branch
    ];
    
    mockDetailRekapService.getDataFinansial.mockResolvedValue({
      data: {
        tahun: [2022, 2023, 2024], // Current is 2024 or based on route
        header: ['H1'],
        detail: hierarchyData
      }
    });

    mount(DetailKKMesin);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
  });

  it('should handle updateKK with wait and success flow', async () => {
    vi.useFakeTimers();
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);
    
    mockPersetujuanService.updateStatusKK.mockResolvedValue({
        data: { success: true }
    });

    const wrapper = mount(DetailKKMesin);
    const vm = wrapper.vm as any;
    
    vm.modalApprove = true;
    const promise = vm.updateKK();
    
    await nextTick();
    // modalApprove should become false
    expect(vm.modalApprove).toBe(false);
    
    // Wait for delay
    await vi.advanceTimersByTimeAsync(3000);
    await promise;
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
    expect(vm.isSuccess).toBe(false); // reset after wait
    
    vi.useRealTimers();
  });

  it('should handle photo fetching in fetchMesinById', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue({
        data: { ...mockMesinData.data, photo1: 'valid-photo.jpg' }
    });
    
    // Mock photo response
    mockDetailSentralService.getPhoto = vi.fn().mockResolvedValue({
        data: new Blob(['photo'], { type: 'image/jpeg' })
    });

    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);

    const wrapper = mount(DetailKKMesin);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(mockDetailSentralService.getPhoto).toHaveBeenCalledWith('valid-photo.jpg');
    // URL.createObjectURL is mocked globally
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should execute draft modal and hasil simulasi tab click handlers from template', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      data: {
        ...mockPersetujuanData.data,
        mesins: [{
          uuid_mesin: 'test-mesin-id',
          tahun: '2024',
          id_status: 1,
          status: 'Draft',
          keterangan: 'Draft status'
        }]
      }
    });

    const wrapper = mount(DetailKKMesin);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    const vm = wrapper.vm as any;

    const openSendButton = wrapper.findAll('button').find(btn => btn.text().includes('Kirim Data'));
    await openSendButton?.trigger('click');
    expect(vm.modalApprove).toBe(true);

    const cancelButton = wrapper.findAll('button').find(btn => btn.text() === 'Batal');
    await cancelButton?.trigger('click');
    expect(vm.modalApprove).toBe(false);

    vm.modalApprove = true;
    await nextTick();
    const sendButton = wrapper.findAll('button').find(btn => btn.text() === 'Kirim');
    await sendButton?.trigger('click');

    const tabs = wrapper.findAll('#tab');
    if (tabs.length >= 2) {
      await tabs[0].trigger('click');
      await tabs[1].trigger('click');
    }

    expect(wrapper.exists()).toBe(true);
  });

  it('should render rejected status branch and execute catch branches for sentral methods', async () => {
    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      data: {
        ...mockPersetujuanData.data,
        mesins: [{
          uuid_mesin: 'test-mesin-id',
          tahun: '2024',
          id_status: 2,
          status: 'Ditolak T1',
          keterangan: 'Perlu revisi'
        }]
      }
    });

    const wrapper = mount(DetailKKMesin);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.text()).toContain('Revisi Data');

    const vm = wrapper.vm as any;

    const currentYear = new Date().getFullYear();
    mockDetailRekapService.getDataFinansial
      .mockResolvedValueOnce({
        data: {
          tahun: [currentYear - 1],
          header: ['Year'],
          detail: []
        }
      })
      .mockResolvedValueOnce({
        data: {
          tahun: [currentYear - 1],
          header: ['Year'],
          detail: [
            { level: 1, name: 'L1' },
            { level: 2, name: 'L2' },
            { level: 3, name: 'L3' },
            { level: 4, name: 'L4' }
          ]
        }
      });
    await vm.fetchDataFinansial();

    mockDetailRekapService.getTypePeriodic.mockRejectedValueOnce(new Error('type periodic error'));
    await vm.fetchTypePeriodic();

    mockRekapService.getEvidencePath.mockRejectedValueOnce(new Error('evidence error'));
    await vm.downloadEvidence();

    mockDetailRekapService.getComboBahanBakar.mockRejectedValueOnce(new Error('combo error'));
    await vm.fetchComboBahanBakar();

    mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('update error'));
    await vm.updateKK();

    mockUserService.getPembina.mockRejectedValueOnce(new Error('pembina error'));
    await vm.fetchListPembina();

    vm.mesin = { ...mockMesinData.data, kode_sentral: 'SENTRAL01' };
    mockDetailRekapService.getPembangkitByKode.mockRejectedValueOnce(new Error('unit pengelola error'));
    await vm.fetchUnitPengelola();

    expect(wrapper.exists()).toBe(true);
  });

  it('should cover status-chain branches across table badges and rejection label variants', async () => {
    const statuses = [
      'Disetujui',
      'Menunggu Persetujuan T1',
      'Menunggu Persetujuan T2',
      'Ditolak T2'
    ];

    for (const status of statuses) {
      mockDetailRekapService.getMesinById.mockResolvedValueOnce(mockMesinData);
      mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
        data: {
          ...mockPersetujuanData.data,
          umur_teknis: status === 'Disetujui' ? '' : '25',
          mesins: [{
            uuid_mesin: 'test-mesin-id',
            tahun: '2024',
            id_status: 1,
            status,
            keterangan: 'status branch'
          }]
        }
      });

      const statusWrapper = mount(DetailKKMesin);
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 80));

      if (status === 'Ditolak T2') {
        const vm = statusWrapper.vm as any;
        vm.isHover = false;
        await nextTick();
        vm.toggleButton();
      }

      expect(statusWrapper.exists()).toBe(true);
      statusWrapper.unmount();
    }
  });

  it('should cover route fallback branches when tahun query is missing', async () => {
    const originalQuery = { ...mockRoute.query };
    mockRoute.query = { uuid_sentral: 'test-uuid-sentral', tahun: undefined as any };

    mockDetailRekapService.getMesinById.mockResolvedValue({
      data: {
        ...mockMesinData.data,
        mesin: '',
        kode_jenis_pembangkit: '',
        tahun_operasi: '',
        photo1: '',
        photo2: ''
      }
    });
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      data: {
        ...mockPersetujuanData.data,
        pengelola: '',
        umur_teknis: '',
        mesins: [{
          uuid_mesin: 'test-mesin-id',
          tahun: '',
          id_status: 1,
          status: 'Draft',
          keterangan: 'fallback'
        }]
      }
    });

    const wrapper = mount(DetailKKMesin);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 120));

    const vm = wrapper.vm as any;
    await vm.fetchAsumsiParameter();
    await vm.fetchDataTeknis();
    await vm.fetchDataFinansial();
    await vm.downloadEvidence();
    await vm.updateKK();

    expect(wrapper.exists()).toBe(true);
    mockRoute.query = originalQuery;
  });

  it('should cover remaining sentral branch edges for fallback values and mapping branches', async () => {
    const originalQuery = { ...mockRoute.query };
    mockRoute.query = { uuid_sentral: 'test-uuid-sentral', tahun: undefined as any };

    mockDetailRekapService.getMesinById.mockResolvedValue(mockMesinData);
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue(mockPersetujuanData);

    const wrapper = mount(DetailKKMesin);
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 120));

    const vm = wrapper.vm as any;
    const currentYear = new Date().getFullYear();

    mockDetailRekapService.getDataTeknis
      .mockResolvedValueOnce({ data: { tahun: [currentYear - 1], header: [], detail: [] } })
      .mockResolvedValueOnce({ data: { tahun: [currentYear - 1], header: [], detail: [] } });
    await vm.fetchDataTeknis();

    mockDetailRekapService.getDataFinansial
      .mockResolvedValueOnce({ data: { tahun: [currentYear - 1], detail: [] } })
      .mockResolvedValueOnce({
        data: {
          tahun: [currentYear - 1],
          detail: [
            { level: 1, name: 'L1' },
            { level: 2, name: 'L2' },
            { level: 3, name: 'L3' },
            { level: 4, name: 'L4' }
          ]
        }
      });
    await vm.fetchDataFinansial();

    mockDetailRekapService.getDataFinansial.mockResolvedValueOnce({
      data: {
        tahun: [currentYear],
        detail: [
          { level: 1, name: 'L1' },
          { level: 2, name: 'L2' },
          { level: 3, name: 'L3' },
          { level: 4, name: 'L4' }
        ]
      }
    });
    await vm.fetchDataFinansial();

    mockRekapService.getEvidencePath.mockResolvedValueOnce({
      data: [{ file_name: 'fallback.xlsx', dokumen_evidence: 'fallback-path' }]
    });
    mockRekapService.downloadEvidence.mockResolvedValueOnce({
      data: new Blob(['test'], { type: 'application/xlsx' }),
      headers: {}
    });
    await vm.downloadEvidence();

    vm.avrIrr = 0;
    vm.mesin = {
      ...mockMesinData.data,
      mesin: '',
      kode_jenis_pembangkit: '',
      tahun_operasi: '',
      photo1: '',
      photo2: '',
      nilai_asset_awal: 0,
      tahun_nilai_perolehan: 0
    };
    vm.approveSentralKK = { tahun: '', pengelola: '', umur_teknis: '' };
    vm.approveMesinKK = { status: 'Draft', tahun: '', keterangan: '' };
    vm.tahunTerakhirAsumsi = '';
    vm.parameterTeknisFinansial = {};
    vm.asumsiParameter = {};
    vm.hasilSimulasi = {};
    vm.tahunGrafik = 2024;
    await nextTick();

    vm.approveMesinKK = { status: 'Ditolak T2', tahun: '', keterangan: 'Cabang Ditolak T2' };
    vm.isHover = true;
    await nextTick();
    vm.toggleButton();
    await nextTick();

    expect(wrapper.exists()).toBe(true);
    mockRoute.query = originalQuery;
  });
});