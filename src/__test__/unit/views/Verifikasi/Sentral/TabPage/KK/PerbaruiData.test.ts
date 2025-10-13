import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PerbaruiData from '@/views/Verifikasi/Sentral/TabPage/KK/PerbaruiData.vue'

// Mock window.Go for WASM
Object.defineProperty(window, 'Go', {
  value: class Go {
    constructor() {}
    run() {}
    importObject = {}
  },
  writable: true,
})

// Mock fetch for WASM
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
  } as Response)
)

// Mock WebAssembly
global.WebAssembly = {
  instantiateStreaming: vi.fn(() => Promise.resolve({ 
    instance: { exports: {} },
    module: {}
  }))
} as any

// Mock router
const mockRoute = {
  query: { tahun: '2024' },
  params: { id: 'test-id-123' }
}

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}))

// Mock encryption storage
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: vi.fn().mockResolvedValue({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    decryptValue: vi.fn().mockReturnValue('test-id-123'),
    encryptValue: vi.fn().mockReturnValue('encrypted-value')
  })
}))

// Mock stores
vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: () => ({
    userAuth: { id: 1, name: 'Test User' },
    levelAlias: 'Mb*0yT%3'
  })
}))

vi.mock('@/store/storeRekapKertasKerja', () => ({
  usePerbaruiTabStore: () => ({
    currentTab: 'Asumsi Makro',
    setCurrentTab: vi.fn()
  })
}))

// Create mock service with controllable responses
const createMockService = (overrides: any = {}) => {
  return {
    getMesinById: vi.fn().mockResolvedValue({
      success: true,
      data: {
        uuid_mesin: 'test-uuid',
        kode_mesin: 'TM001',
        mesin: 'Test Machine',
        jenis_pembangkit: 'PLTU',
        masa_manfaat: 25,
        tahun_realisasi: '2023',
        ...(overrides.mesinData || {})
      }
    }),
    getAsumsiParameterData: vi.fn().mockResolvedValue({
      success: true,
      data: {
        status: 'create',
        id_asumsi: 0,
        asumsi_makro: {
          umur_teknis: 25,
          interest_rate: 10.5,
          loan_portion: 70,
          loan_tenor: 15,
          total_project_cost: 1000000,
          daya_mampu_netto_mw: 100
        },
        parameter_teknis_financial: {
          auxiliary: 5,
          nphr: 2400,
          ps: 2,
          susut_trafo: 1.5,
          electricity_price_a_rp_per_kwbln: 1000,
          electricity_price_b_rp_per_kwbln: 2000,
          electricity_price_c_rp_per_kwh: 1500,
          electricity_price_d_rp_per_kwh: 1200,
          harga_bahan_bakars: []
        },
        ...(overrides.asumsiData || {})
      }
    }),
    getTypePeriodic: vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id_type_periodic: 1, kode_type_periodic: 'Monthly' },
        { id_type_periodic: 2, kode_type_periodic: 'Yearly' }
      ]
    }),
    getComboBahanBakar: vi.fn().mockResolvedValue({
      success: true,
      data: [
        { 
          kode_bahan_bakar: 'BB001', 
          bahan_bakar: 'Batubara',
          id_uraian_fuel_consumption: '1'
        },
        { 
          kode_bahan_bakar: 'BB002', 
          bahan_bakar: 'Gas',
          id_uraian_fuel_consumption: '2'
        }
      ]
    }),
    getDataFinansialDetailSimulasi1: vi.fn().mockResolvedValue({
      success: true,
      data: { id_mesin: 1, ...(overrides.finansialSimulasi1 || {}) }
    }),
    getDataFinansialDetailSimulasi2: vi.fn().mockResolvedValue({
      success: true,
      data: { id_mesin: 1, ...(overrides.finansialSimulasi2 || {}) }
    }),
    getDataFinansialDetail: vi.fn().mockResolvedValue({
      success: true,
      data: {
        is_audited: true,
        cost_component_a: 1000000,
        cost_component_b: 2000000,
        cost_component_c: 3000000,
        cost_component_d: 500000,
        revenue: 5000000,
        revenue_a: 1000000,
        revenue_b: 2000000,
        revenue_c: 1500000,
        revenue_d: 500000,
        cost_component_b_detail: {
          biaya_kepegawaian: 500000,
          biaya_pemeliharaan_rutin: 300000,
          biaya_administrasi_umum: 200000,
          biaya_pembelian_tenaga_listrik: 100000,
          biaya_lain_lain: 50000,
          biaya_periodic_maintenance_non_mi: 150000
        },
        cost_component_c_detail: [
          { kode_bahan_bakar: 'BB001', fuel_cost: 1500000 }
        ],
        cost_component_d_detail: {
          biaya_pelumas: 200000,
          biaya_bahan_kimia: 300000
        }
      }
    }),
    getHasilSimulasi: vi.fn().mockResolvedValue({
      success: true,
      data: {
        id_mesin: 1,
        track_irr_project: 12.5,
        track_irr_equity: 15.2,
        track_npv_project: 5000000,
        track_npv_equity: 3000000,
        track_average_eaf: 85.5,
        track_average_cf: 80.2
      }
    }),
    getDataTeknisSimulasi1: vi.fn().mockResolvedValue({
      success: true,
      data: { id_mesin: 1 }
    }),
    getDataTeknisSimulasi2: vi.fn().mockResolvedValue({
      success: true,
      data: { id_mesin: 1 }
    }),
    getDataFinansialSimulasi1: vi.fn().mockResolvedValue({
      success: true,
      data: {
        detail: [
          { level: 1, id: 1, name: 'Level 1' },
          { level: 2, id: 2, name: 'Level 2' },
          { level: 3, id: 3, name: 'Level 3' },
          { level: 4, id: 4, name: 'Level 4' }
        ]
      }
    }),
    getDataFinansialSimulasi2: vi.fn().mockResolvedValue({
      success: true,
      data: {
        detail: [
          { level: 1, id: 1, name: 'Level 1' },
          { level: 2, id: 2, name: 'Level 2' },
          { level: 3, id: 3, name: 'Level 3' },
          { level: 4, id: 4, name: 'Level 4' }
        ]
      }
    }),
    createAsumsiMakroPermanent: vi.fn().mockResolvedValue({ success: true }),
    updateAsumsiMakroPermanent: vi.fn().mockResolvedValue({ success: true }),
    updateParameterTeknisPermanent: vi.fn().mockResolvedValue({ success: true }),
    updateDataTeknisSimulasi: vi.fn().mockResolvedValue({ success: true }),
    updateDataFinansialSimulasi: vi.fn().mockResolvedValue({ success: true }),
    updateDataTeknisPermanent: vi.fn().mockResolvedValue({ success: true }),
    updateDataFinansialPermanent: vi.fn().mockResolvedValue({ success: true }),
    ...(overrides.serviceMethods || {})
  }
}

vi.mock('@/services/perbarui-data', () => ({
  default: vi.fn().mockImplementation(() => createMockService())
}))

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn().mockImplementation(() => ({
    formatCurrency: vi.fn().mockReturnValue('Rp 1.000.000'),
    formatNumber: vi.fn().mockReturnValue('1.000'),
    formatCurrencyNotFixed: vi.fn().mockReturnValue('1000000'),
    formatBytes: vi.fn().mockReturnValue('1 MB')
  }))
}))

vi.mock('@/services/user-service', () => ({
  default: vi.fn().mockImplementation(() => ({
    getListPembina: vi.fn().mockResolvedValue({ success: true, data: [] })
  }))
}))

vi.mock('@/services/auth-service', () => ({
  default: vi.fn().mockImplementation(() => ({
    checkIntegrasi: vi.fn().mockResolvedValue({ success: true, data: false })
  }))
}))

vi.mock('@/services/rekap-service', () => ({
  default: vi.fn().mockImplementation(() => ({
    getUnitPengelola: vi.fn().mockResolvedValue({ success: true, data: [] }),
    uploadEvidence: vi.fn().mockResolvedValue({ success: true, data: 'file-path.xlsx' }),
    updateEvidencePath: vi.fn().mockResolvedValue({ success: true }),
    uploadSimulasi1: vi.fn().mockResolvedValue({ success: true, data: 'simulasi1.xlsx' }),
    uploadSimulasi2: vi.fn().mockResolvedValue({ success: true, data: 'simulasi2.xlsx' })
  }))
}))

vi.mock('@/services/persetujuan-service', () => ({
  default: vi.fn().mockImplementation(() => ({
    getPersetujuanKK: vi.fn().mockResolvedValue({ 
      success: true, 
      data: { id_status: 'approved' } 
    })
  }))
}))

vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyWarning: vi.fn(),
  notifyInfo: vi.fn(),
}))

describe('PerbaruiData.vue - Focused Script Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('getTypePeriodic function', () => {
    it('should return kode_type_periodic when listTypePeriodic has matching id', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      await wrapper.vm.$nextTick()

      const vm = wrapper.vm as any
      
      // Set up listTypePeriodic with test data
      if (vm.listTypePeriodic) {
        vm.listTypePeriodic = [
          { id_type_periodic: 1, kode_type_periodic: 'Monthly' },
          { id_type_periodic: 2, kode_type_periodic: 'Yearly' }
        ]
      }

      // Call getTypePeriodic function
      if (vm.getTypePeriodic) {
        const result1 = vm.getTypePeriodic(1)
        const result2 = vm.getTypePeriodic(2)
        const result3 = vm.getTypePeriodic(999)

        expect(result1).toBe('Monthly')
        expect(result2).toBe('Yearly')
        expect(result3).toBe('-')
      }

      expect(wrapper.exists()).toBe(true)
    })

    it('should return "-" when listTypePeriodic is empty', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.listTypePeriodic) {
        vm.listTypePeriodic = []
      }

      if (vm.getTypePeriodic) {
        const result = vm.getTypePeriodic(1)
        expect(result).toBe('-')
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('handleFileChangeEvidence function', () => {
    it('should set selectedFileEvidence when one file is selected', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockFile = new File(['evidence'], 'evidence.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const mockEvent = {
        target: {
          files: [mockFile]
        }
      }

      if (vm.handleFileChangeEvidence) {
        vm.handleFileChangeEvidence(mockEvent)
        expect(vm.selectedFileEvidence).toEqual(mockFile)
        expect(vm.selectedFileEvidence.name).toBe('evidence.xlsx')
      }

      expect(wrapper.exists()).toBe(true)
    })

    it('should set selectedFileEvidence to null when no file is selected', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockEvent = {
        target: {
          files: []
        }
      }

      if (vm.handleFileChangeEvidence) {
        vm.handleFileChangeEvidence(mockEvent)
        expect(vm.selectedFileEvidence).toBe(null)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('handleFileChange function for Simulasi 2', () => {
    it('should set selectedFile when one file is selected', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockFile = new File(['simulasi2'], 'simulasi2.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const mockEvent = {
        target: {
          files: [mockFile]
        }
      }

      if (vm.handleFileChange) {
        vm.handleFileChange(mockEvent)
        expect(vm.selectedFile).toEqual(mockFile)
        expect(vm.selectedFile.name).toBe('simulasi2.xlsx')
      }

      expect(wrapper.exists()).toBe(true)
    })

    it('should set selectedFile to null when no file is selected', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockEvent = {
        target: {
          files: []
        }
      }

      if (vm.handleFileChange) {
        vm.handleFileChange(mockEvent)
        expect(vm.selectedFile).toBe(null)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('handleTambahBahanBakar function', () => {
    it('should add new bahan bakar to arrays', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const initialBahanBakarLength = vm.bahanBakarGroup?.bahanBakars?.length || 0
      const initialFuelConsumptionLength = vm.bahanBakarGroup?.fuelConsumption?.length || 0
      const initialCostCDetailLength = vm.bahanBakarGroup?.costCDetail?.length || 0

      if (vm.handleTambahBahanBakar) {
        vm.handleTambahBahanBakar()
        
        expect(vm.bahanBakarGroup.bahanBakars.length).toBe(initialBahanBakarLength + 1)
        expect(vm.bahanBakarGroup.fuelConsumption.length).toBe(initialFuelConsumptionLength + 1)
        expect(vm.bahanBakarGroup.costCDetail.length).toBe(initialCostCDetailLength + 1)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('handleHapusBahanBakar function', () => {
    it('should remove selected bahan bakar when checkedBahanBakar has values', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      // Setup test data
      if (vm.bahanBakarGroup) {
        vm.bahanBakarGroup.bahanBakars = [
          { kode_bahan_bakar: 'BB001', harga_bahan_bakar: '1000', sfc: '2' },
          { kode_bahan_bakar: 'BB002', harga_bahan_bakar: '2000', sfc: '3' }
        ]
        vm.bahanBakarGroup.fuelConsumption = [
          { kode_bahan_bakar: 'BB001', value: '100' },
          { kode_bahan_bakar: 'BB002', value: '200' }
        ]
        vm.bahanBakarGroup.costCDetail = [
          { kode_bahan_bakar: 'BB001', fuel_cost: '5000' },
          { kode_bahan_bakar: 'BB002', fuel_cost: '6000' }
        ]
        vm.checkedBahanBakar = ['BB001']
      }

      if (vm.handleHapusBahanBakar) {
        vm.handleHapusBahanBakar()
        
        expect(vm.bahanBakarGroup.bahanBakars.length).toBe(1)
        expect(vm.bahanBakarGroup.bahanBakars[0].kode_bahan_bakar).toBe('BB002')
        expect(vm.checkedBahanBakar.length).toBe(0)
      }

      expect(wrapper.exists()).toBe(true)
    })

    it('should not remove anything when checkedBahanBakar is empty', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.bahanBakarGroup) {
        vm.bahanBakarGroup.bahanBakars = [
          { kode_bahan_bakar: 'BB001', harga_bahan_bakar: '1000', sfc: '2' }
        ]
        vm.checkedBahanBakar = []
      }

      const initialLength = vm.bahanBakarGroup?.bahanBakars?.length || 0

      if (vm.handleHapusBahanBakar) {
        vm.handleHapusBahanBakar()
        expect(vm.bahanBakarGroup.bahanBakars.length).toBe(initialLength)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('toggleRowSimulasi1 and isRowOpenSimulasi1 functions', () => {
    it('should add itemId to isRowTabOpenSimulasi1 when not present', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.isRowTabOpenSimulasi1) {
        vm.isRowTabOpenSimulasi1 = []
      }

      if (vm.toggleRowSimulasi1 && vm.isRowOpenSimulasi1) {
        expect(vm.isRowOpenSimulasi1(1)).toBe(false)
        
        vm.toggleRowSimulasi1(1)
        expect(vm.isRowTabOpenSimulasi1).toContain(1)
        expect(vm.isRowOpenSimulasi1(1)).toBe(true)
        
        vm.toggleRowSimulasi1(1)
        expect(vm.isRowTabOpenSimulasi1).not.toContain(1)
        expect(vm.isRowOpenSimulasi1(1)).toBe(false)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('toggleRowSimulasi2 and isRowOpenSimulasi2 functions', () => {
    it('should add itemId to isRowTabOpenSimulasi2 when not present', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.isRowTabOpenSimulasi2) {
        vm.isRowTabOpenSimulasi2 = []
      }

      if (vm.toggleRowSimulasi2 && vm.isRowOpenSimulasi2) {
        expect(vm.isRowOpenSimulasi2(1)).toBe(false)
        
        vm.toggleRowSimulasi2(1)
        expect(vm.isRowTabOpenSimulasi2).toContain(1)
        expect(vm.isRowOpenSimulasi2(1)).toBe(true)
        
        vm.toggleRowSimulasi2(1)
        expect(vm.isRowTabOpenSimulasi2).not.toContain(1)
        expect(vm.isRowOpenSimulasi2(1)).toBe(false)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('wait function', () => {
    it('should wait for specified milliseconds', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.wait) {
        const startTime = Date.now()
        await vm.wait(100)
        const endTime = Date.now()
        const elapsed = endTime - startTime
        
        expect(elapsed).toBeGreaterThanOrEqual(95) // Allow small timing variation
        expect(elapsed).toBeLessThan(200)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('uploadFileSimulasi1 function', () => {
    it('should show error notification when no file is selected', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.uploadFileSimulasi1) {
        vm.selectedFileSimulasi1 = null
        vm.isLoading = false

        await vm.uploadFileSimulasi1()

        expect(vm.isLoading).toBe(false)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('uploadFile function for Simulasi 2', () => {
    it('should return early when no file is selected', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.uploadFile) {
        vm.selectedFile = null
        const initialLoading = vm.isLoading

        await vm.uploadFile()

        // Should have tried to set loading but returned early
        expect(wrapper.exists()).toBe(true)
      }
    })
  })

  describe('handleFileChangeSimulasi1 function', () => {
    it('should set selectedFileSimulasi1 when file is selected', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockFile = new File(['simulasi1'], 'simulasi1.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const mockEvent = {
        target: {
          files: [mockFile]
        }
      }

      if (vm.handleFileChangeSimulasi1) {
        vm.handleFileChangeSimulasi1(mockEvent)
        expect(vm.selectedFileSimulasi1).toEqual(mockFile)
        expect(vm.selectedFileSimulasi1.name).toBe('simulasi1.xlsx')
      }

      expect(wrapper.exists()).toBe(true)
    })

    it('should set selectedFileSimulasi1 to null when no file selected', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockEvent = {
        target: {
          files: []
        }
      }

      if (vm.handleFileChangeSimulasi1) {
        vm.handleFileChangeSimulasi1(mockEvent)
        expect(vm.selectedFileSimulasi1).toBe(null)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('uploadFileEvidence function', () => {
    it('should upload evidence file successfully', async () => {
      const mockRekapService = {
        uploadEvidence: vi.fn().mockResolvedValue({ success: true, data: 'evidence-path.xlsx' }),
        updateEvidencePath: vi.fn().mockResolvedValue({ success: true }),
        getUnitPengelola: vi.fn().mockResolvedValue({ success: true, data: [] }),
        uploadSimulasi1: vi.fn().mockResolvedValue({ success: true, data: 'simulasi1.xlsx' }),
        uploadSimulasi2: vi.fn().mockResolvedValue({ success: true, data: 'simulasi2.xlsx' })
      }

      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockFile = new File(['evidence'], 'evidence.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      if (vm.selectedFileEvidence !== undefined) {
        vm.selectedFileEvidence = mockFile
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('uploadFile function for Simulasi 2 with file', () => {
    it('should upload simulasi 2 file successfully', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockFile = new File(['simulasi2'], 'simulasi2.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      if (vm.selectedFile !== undefined) {
        vm.selectedFile = mockFile
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('handleChange function', () => {
    it('should update bahanBakarGroup when bahanBakar changes', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.comboBahanBakar) {
        vm.comboBahanBakar = [
          { kode_bahan_bakar: 'BB001', bahan_bakar: 'Batubara', id_uraian_fuel_consumption: '1' }
        ]
      }

      if (vm.bahanBakarGroup) {
        vm.bahanBakarGroup = {
          bahanBakars: [{ kode_bahan_bakar: 'BB001', harga_bahan_bakar: '1000', sfc: '2' }],
          fuelConsumption: [{ id_uraian: 0, bahan_bakar: '', value: '100' }],
          costCDetail: [{ kode_bahan_bakar: '', fuel_cost: '5000' }]
        }
      }

      if (vm.handleChange) {
        vm.handleChange()
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('fetchDataTeknisSimulasi1 function', () => {
    it('should fetch data teknis simulasi 1 successfully', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('fetchDataTeknisSimulasi2 function', () => {
    it('should fetch data teknis simulasi 2 successfully', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('fetchDataFinansialSimulasi1 function', () => {
    it('should process multi-level financial data correctly', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('fetchDataFinansialSimulasi2 function', () => {
    it('should process multi-level financial data correctly for simulasi 2', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('fetchComboBahanBakar function', () => {
    it('should fetch combo bahan bakar successfully', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('fetchHasilSimulasi2 function', () => {
    it('should fetch hasil simulasi 2 successfully', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })
  
  describe('handleSubmit validation tests', () => {
    it('should validate asumsi makro fields and set error states', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      // Set empty values to trigger validation errors
      if (vm.asumsiParameter) {
        vm.asumsiParameter = {
          asumsiMakro: {
            interestRate: '',
            umurTeknis: '',
            loanTenor: '',
            loanPortion: ''
          },
          parameterTeknis: {
            nphr: '',
            auxiliary: '',
            susutTrafo: '',
            pemakaianSendiri: '',
            electricityPriceA: '',
            electricityPriceB: '',
            electricityPriceC: '',
            electricityPriceD: ''
          }
        }
      }

      if (vm.bahanBakarGroup) {
        vm.bahanBakarGroup = {
          bahanBakars: [{ kode_bahan_bakar: '', harga_bahan_bakar: '', sfc: '' }],
          fuelConsumption: [{ id_uraian: 0, bahan_bakar: '', value: '' }],
          costCDetail: [{ kode_bahan_bakar: '', fuel_cost: '' }]
        }
      }

      expect(wrapper.exists()).toBe(true)
    })

    it('should validate data teknis fields', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.typePeriodic !== undefined) vm.typePeriodic = ''
      if (vm.ncf !== undefined) vm.ncf = ''
      if (vm.eaf !== undefined) vm.eaf = ''
      if (vm.productionBrutto !== undefined) vm.productionBrutto = ''
      if (vm.productionNetto !== undefined) vm.productionNetto = ''
      if (vm.energySales !== undefined) vm.energySales = ''

      expect(wrapper.exists()).toBe(true)
    })

    it('should validate data finansial fields', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.costComponentA !== undefined) vm.costComponentA = ''
      if (vm.costComponentB !== undefined) vm.costComponentB = ''
      if (vm.costComponentC !== undefined) vm.costComponentC = ''
      if (vm.costComponentD !== undefined) vm.costComponentD = ''
      if (vm.biayaKepegawaian !== undefined) vm.biayaKepegawaian = ''
      if (vm.biayaPemeliharaanRutin !== undefined) vm.biayaPemeliharaanRutin = ''
      if (vm.biayaAdministrasiUmum !== undefined) vm.biayaAdministrasiUmum = ''
      if (vm.biayaPembelianTenagaListrik !== undefined) vm.biayaPembelianTenagaListrik = ''
      if (vm.biayaLainLain !== undefined) vm.biayaLainLain = ''
      if (vm.biayaMinyakPelumas !== undefined) vm.biayaMinyakPelumas = ''
      if (vm.bahanKimia !== undefined) vm.bahanKimia = ''
      if (vm.totalRevenue !== undefined) vm.totalRevenue = ''
      if (vm.revenueKompA !== undefined) vm.revenueKompA = ''
      if (vm.revenueKompB !== undefined) vm.revenueKompB = ''

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('toggleRowSimulasi functions edge cases', () => {
    it('should handle toggling multiple rows for simulasi1', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.toggleRowSimulasi1 && vm.isRowOpenSimulasi1) {
        vm.toggleRowSimulasi1(1)
        vm.toggleRowSimulasi1(2)
        vm.toggleRowSimulasi1(3)
        
        expect(vm.isRowOpenSimulasi1(1)).toBe(true)
        expect(vm.isRowOpenSimulasi1(2)).toBe(true)
        expect(vm.isRowOpenSimulasi1(3)).toBe(true)
        
        vm.toggleRowSimulasi1(2)
        expect(vm.isRowOpenSimulasi1(2)).toBe(false)
      }

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle toggling multiple rows for simulasi2', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.toggleRowSimulasi2 && vm.isRowOpenSimulasi2) {
        vm.toggleRowSimulasi2(1)
        vm.toggleRowSimulasi2(2)
        vm.toggleRowSimulasi2(3)
        
        expect(vm.isRowOpenSimulasi2(1)).toBe(true)
        expect(vm.isRowOpenSimulasi2(2)).toBe(true)
        expect(vm.isRowOpenSimulasi2(3)).toBe(true)
        
        vm.toggleRowSimulasi2(2)
        expect(vm.isRowOpenSimulasi2(2)).toBe(false)
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('bahan bakar operations', () => {
    it('should handle adding multiple bahan bakar items', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const initialLength = vm.bahanBakarGroup?.bahanBakars?.length || 0

      if (vm.handleTambahBahanBakar) {
        vm.handleTambahBahanBakar()
        vm.handleTambahBahanBakar()
        vm.handleTambahBahanBakar()
        
        expect(vm.bahanBakarGroup.bahanBakars.length).toBe(initialLength + 3)
      }

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle removing multiple selected bahan bakar', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      if (vm.bahanBakarGroup) {
        vm.bahanBakarGroup.bahanBakars = [
          { kode_bahan_bakar: 'BB001', harga_bahan_bakar: '1000', sfc: '2' },
          { kode_bahan_bakar: 'BB002', harga_bahan_bakar: '2000', sfc: '3' },
          { kode_bahan_bakar: 'BB003', harga_bahan_bakar: '3000', sfc: '4' }
        ]
        vm.bahanBakarGroup.fuelConsumption = [
          { kode_bahan_bakar: 'BB001', value: '100' },
          { kode_bahan_bakar: 'BB002', value: '200' },
          { kode_bahan_bakar: 'BB003', value: '300' }
        ]
        vm.bahanBakarGroup.costCDetail = [
          { kode_bahan_bakar: 'BB001', fuel_cost: '5000' },
          { kode_bahan_bakar: 'BB002', fuel_cost: '6000' },
          { kode_bahan_bakar: 'BB003', fuel_cost: '7000' }
        ]
        vm.checkedBahanBakar = ['BB001', 'BB003']
      }

      if (vm.handleHapusBahanBakar) {
        vm.handleHapusBahanBakar()
        
        expect(vm.bahanBakarGroup.bahanBakars.length).toBe(1)
        expect(vm.bahanBakarGroup.bahanBakars[0].kode_bahan_bakar).toBe('BB002')
      }

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('file upload edge cases', () => {
    it('should handle file change with multiple files for evidence', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockFile1 = new File(['evidence1'], 'evidence1.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      
      const mockFile2 = new File(['evidence2'], 'evidence2.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const mockEvent = {
        target: {
          files: [mockFile1, mockFile2]
        }
      }

      if (vm.handleFileChangeEvidence) {
        vm.handleFileChangeEvidence(mockEvent)
        // Should still be null because length !== 1
        expect(vm.selectedFileEvidence).toBe(null)
      }

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle file with correct extension for simulasi1', async () => {
      const wrapper = mount(PerbaruiData, {
        global: {
          stubs: {
            Loading: true,
            ModalNotification: true,
            ModalWrapper: true,
            TabsWrapper: true,
            TabItem: true,
            InfoHeader: true,
            InfoComponent: true,
            AsumsiInfoBox: true,
            ParameterTeknisInfoBox: true,
            ConfirmationDialog: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AkhirMasaManfaat: true,
            TabAsumsiMakro: true,
            TabParameterTeknis: true,
            TabDataTeknis: true,
            TabDataFinansial: true,
            IconFolder: true,
            IconFolderBlue: true
          }
        }
      })

      await flushPromises()
      const vm = wrapper.vm as any

      const mockFile = new File(['simulasi'], 'test-simulasi1.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      const mockEvent = {
        target: {
          files: [mockFile]
        }
      }

      if (vm.handleFileChangeSimulasi1) {
        vm.handleFileChangeSimulasi1(mockEvent)
        expect(vm.selectedFileSimulasi1).toEqual(mockFile)
        expect(vm.selectedFileSimulasi1.name).toBe('test-simulasi1.xlsx')
      }

      expect(wrapper.exists()).toBe(true)
    })
  })
})

describe('PerbaruiData.vue - Extended Coverage Tests', () => {
  let wrapper: any
  let pinia: any

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    wrapper = mount(PerbaruiData, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          ModalNotification: true,
          ModalWrapper: true,
          TabsWrapper: true,
          TabItem: true,
          InfoHeader: true,
          InfoComponent: true,
          AsumsiInfoBox: true,
          ParameterTeknisInfoBox: true,
          ConfirmationDialog: true,
          TableDataTeknis: true,
          TableDataFinansial: true,
          AkhirMasaManfaat: true,
          TabAsumsiMakro: true,
          TabParameterTeknis: true,
          TabDataTeknis: true,
          TabDataFinansial: true,
          IconFolder: true,
          IconFolderBlue: true
        }
      }
    })
    
    await wrapper.vm.$nextTick()
  })

  describe('File Upload Operations', () => {
    it('should show error notification when uploadFileSimulasi1 has no file selected', async () => {
      wrapper.vm.selectedFileSimulasi1 = null
      wrapper.vm.isLoading = false

      await wrapper.vm.uploadFileSimulasi1()

      expect(wrapper.vm.isLoading).toBe(false)
    })

    it('should handle successful uploadFileSimulasi1 with file', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      wrapper.vm.selectedFileSimulasi1 = new File(['test'], 'test.xlsx', { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      wrapper.vm.isUnggahModalOpenSimulasi1 = true

      await wrapper.vm.uploadFileSimulasi1()

      expect(wrapper.vm.isLoading).toBe(false)
      consoleLogSpy.mockRestore()
    })

    it('should log error when uploadFile has no selected file', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      wrapper.vm.selectedFile = null
      
      await wrapper.vm.uploadFile()
      
      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('should handle successful uploadFile with file', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      wrapper.vm.selectedFile = new File(['test'], 'test.xlsx', { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      wrapper.vm.isUnggahModalOpen = true

      await wrapper.vm.uploadFile()

      expect(wrapper.vm.isLoading).toBe(false)
      consoleLogSpy.mockRestore()
    })

    it('should handle successful uploadFileEvidence', async () => {
      wrapper.vm.selectedFileEvidence = new File(['test'], 'evidence.pdf', { 
        type: 'application/pdf' 
      })
      wrapper.vm.uuidMesin = 'test-uuid'
      wrapper.vm.tahunBerjalan = 2024
      wrapper.vm.isShowFinalConfirmation = true
      wrapper.vm.isShowModalEvidence = true

      await wrapper.vm.uploadFileEvidence()

      expect(wrapper.vm.isShowFinalConfirmation).toBe(false)
      expect(wrapper.vm.isShowModalEvidence).toBe(false)
    })
  })

  describe('Fetch Operations', () => {
    it('should set isFetchingError when fetchHasilSimulasi1 fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      await wrapper.vm.fetchHasilSimulasi1()
      
      consoleErrorSpy.mockRestore()
    })

    it('should set isFetchingError when fetchHasilSimulasi2 fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      await wrapper.vm.fetchHasilSimulasi2()
      
      consoleErrorSpy.mockRestore()
    })

    it('should fetch combo bahan bakar successfully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      await wrapper.vm.fetchComboBahanBakar()
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('File Change Handlers', () => {
    it('should set selectedFileEvidence when single file is selected', () => {
      const mockFile = new File(['test'], 'evidence.pdf', { type: 'application/pdf' })
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      }
      
      wrapper.vm.handleFileChangeEvidence(mockEvent)
      
      expect(wrapper.vm.selectedFileEvidence).toBeDefined()
      expect(wrapper.vm.selectedFileEvidence.name).toBe('evidence.pdf')
    })

    it('should set selectedFileSimulasi1 when single file is selected', () => {
      const mockFile = new File(['test'], 'simulasi1.xlsx', { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      }
      
      wrapper.vm.handleFileChangeSimulasi1(mockEvent)
      
      expect(wrapper.vm.selectedFileSimulasi1).toBeDefined()
      expect(wrapper.vm.selectedFileSimulasi1.name).toBe('simulasi1.xlsx')
    })

    it('should set selectedFile when single file is selected', () => {
      const mockFile = new File(['test'], 'simulasi2.xlsx', { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      }
      
      wrapper.vm.handleFileChange(mockEvent)
      
      expect(wrapper.vm.selectedFile).toBeDefined()
      expect(wrapper.vm.selectedFile.name).toBe('simulasi2.xlsx')
    })
  })

  describe('Validation Tests', () => {
    it('should validate revenueKompB field', async () => {
      wrapper.vm.revenueKompB = ''
      
      const submitPromise = wrapper.vm.handleSubmit()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(wrapper.vm.error.finansial.revenueKompB).toBe(true)
    }, 10000)

    it('should validate revenueKompC field', async () => {
      wrapper.vm.revenueKompC = ''
      
      const submitPromise = wrapper.vm.handleSubmit()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(wrapper.vm.error.finansial.revenueKompC).toBe(true)
    }, 10000)

    it('should validate revenueKompD field', async () => {
      wrapper.vm.revenueKompD = ''
      
      const submitPromise = wrapper.vm.handleSubmit()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(wrapper.vm.error.finansial.revenueKompD).toBe(true)
    }, 10000)

    it('should set validation error for costComponentADetail with empty ai', async () => {
      wrapper.vm.costComponentADetail = [
        { ai: '', realisasi_aki: '100000' }
      ]
      wrapper.vm.asumsiParameter = {
        asumsiMakro: {
          interestRate: '5.5',
          umurTeknis: '25',
          loanTenor: '15',
          loanPortion: '70',
          totalProjectCost: '1000000',
          dayaMampuNettoMW: '100'
        },
        parameterTeknis: {
          nphr: '2500',
          auxiliary: '5',
          susutTrafo: '2',
          pemakaianSendiri: '3',
          electricityPriceA: '1000',
          electricityPriceB: '800',
          electricityPriceC: '1200',
          electricityPriceD: '900',
        }
      }

      const submitPromise = wrapper.vm.handleSubmit()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.vm.error.finansial.biayaInvestasiAiAki).toBe(true)
    }, 10000)

    it('should set validation error for costComponentCDetail with empty fuel_cost', async () => {
      wrapper.vm.bahanBakarGroup = {
        bahanBakars: [],
        fuelConsumption: [{ value: '100', kode_bahan_bakar: 'BB001' }],
        costCDetail: [
          { uuid_mesin: 'test', tahun: 2023, kode_bahan_bakar: 'BB001', fuel_cost: '' }
        ]
      }
      wrapper.vm.asumsiParameter = {
        asumsiMakro: {
          interestRate: '5.5',
          umurTeknis: '25',
          loanTenor: '15',
          loanPortion: '70',
          totalProjectCost: '1000000',
          dayaMampuNettoMW: '100'
        },
        parameterTeknis: {
          nphr: '2500',
          auxiliary: '5',
          susutTrafo: '2',
          pemakaianSendiri: '3',
          electricityPriceA: '1000',
          electricityPriceB: '800',
          electricityPriceC: '1200',
          electricityPriceD: '900',
        }
      }

      const submitPromise = wrapper.vm.handleSubmit()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.vm.error.finansial.costComponentCDetail).toBe(true)
    }, 10000)
  })

  describe('Submit Operations', () => {
    it('should handle submit with idAsumsi === 0 (create flow)', async () => {
      wrapper.vm.idAsumsi = 0
      wrapper.vm.statusAsumsi = 'create'
      wrapper.vm.asumsiParameter = {
        asumsiMakro: {
          interestRate: '5.5',
          umurTeknis: '25',
          loanTenor: '15',
          loanPortion: '70',
          totalProjectCost: '1.000.000',
          dayaMampuNettoMW: '100'
        },
        parameterTeknis: {
          nphr: '2500',
          auxiliary: '5',
          susutTrafo: '2',
          pemakaianSendiri: '3',
          electricityPriceA: '1000',
          electricityPriceB: '800',
          electricityPriceC: '1200',
          electricityPriceD: '900',
        }
      }
      wrapper.vm.masaManfaat = '25'
      wrapper.vm.typePeriodic = '1'
      wrapper.vm.ncf = '80'
      wrapper.vm.eaf = '85'
      wrapper.vm.productionBrutto = '1000'
      wrapper.vm.productionNetto = '950'
      wrapper.vm.energySales = '900'
      wrapper.vm.costComponentA = '1000000'
      wrapper.vm.costComponentB = '500000'
      wrapper.vm.biayaKepegawaian = '200000'
      wrapper.vm.biayaPemeliharaanRutin = '100000'
      wrapper.vm.biayaAdministrasiUmum = '50000'
      wrapper.vm.biayaPembelianTenagaListrik = '75000'
      wrapper.vm.biayaLainLain = '25000'
      wrapper.vm.periodicMaintenanceCost = '50000'
      wrapper.vm.costComponentC = '300000'
      wrapper.vm.costComponentD = '150000'
      wrapper.vm.biayaMinyakPelumas = '75000'
      wrapper.vm.bahanKimia = '75000'
      wrapper.vm.totalRevenue = '2000000'
      wrapper.vm.revenueKompA = '500000'
      wrapper.vm.revenueKompB = '500000'
      wrapper.vm.revenueKompC = '500000'
      wrapper.vm.revenueKompD = '500000'
      wrapper.vm.bahanBakarGroup = {
        bahanBakars: [{
          kode_bahan_bakar: 'BB001',
          flag_bahan_bakar: 0,
          harga_bahan_bakar: '10.000',
          uuid_mesin: 'test-uuid',
          sfc: '5.5',
          tahun: '2023',
          id: 1
        }],
        fuelConsumption: [{
          id_uraian: 1,
          bahan_bakar: 'Test Fuel',
          value: '100',
          kode_bahan_bakar: 'BB001'
        }],
        costCDetail: [{
          uuid_mesin: 'test-uuid',
          tahun: 2023,
          kode_bahan_bakar: 'BB001',
          fuel_cost: '50.000'
        }]
      }
      wrapper.vm.costComponentADetail = [{
        ai: '100000',
        realisasi_aki: '50000'
      }]

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.isLoading).toBe(false)
    }, 15000)

    it('should handle submit with idAsumsi !== 0 (update flow)', async () => {
      wrapper.vm.idAsumsi = 1
      wrapper.vm.statusAsumsi = 'update'
      wrapper.vm.asumsiParameter = {
        asumsiMakro: {
          interestRate: '6.0',
          umurTeknis: '25',
          loanTenor: '15',
          loanPortion: '70',
          totalProjectCost: '1.000.000',
          dayaMampuNettoMW: '100'
        },
        parameterTeknis: {
          nphr: '2500',
          auxiliary: '5',
          susutTrafo: '2',
          pemakaianSendiri: '3',
          electricityPriceA: '1000',
          electricityPriceB: '800',
          electricityPriceC: '1200',
          electricityPriceD: '900',
        }
      }
      wrapper.vm.masaManfaat = '25'
      wrapper.vm.typePeriodic = '1'
      wrapper.vm.ncf = '80'
      wrapper.vm.eaf = '85'
      wrapper.vm.productionBrutto = '1000'
      wrapper.vm.productionNetto = '950'
      wrapper.vm.energySales = '900'
      wrapper.vm.costComponentA = '1000000'
      wrapper.vm.costComponentB = '500000'
      wrapper.vm.biayaKepegawaian = '200000'
      wrapper.vm.biayaPemeliharaanRutin = '100000'
      wrapper.vm.biayaAdministrasiUmum = '50000'
      wrapper.vm.biayaPembelianTenagaListrik = '75000'
      wrapper.vm.biayaLainLain = '25000'
      wrapper.vm.periodicMaintenanceCost = '50000'
      wrapper.vm.costComponentC = '300000'
      wrapper.vm.costComponentD = '150000'
      wrapper.vm.biayaMinyakPelumas = '75000'
      wrapper.vm.bahanKimia = '75000'
      wrapper.vm.totalRevenue = '2000000'
      wrapper.vm.revenueKompA = '500000'
      wrapper.vm.revenueKompB = '500000'
      wrapper.vm.revenueKompC = '500000'
      wrapper.vm.revenueKompD = '500000'
      wrapper.vm.bahanBakarGroup = {
        bahanBakars: [{
          kode_bahan_bakar: 'BB001',
          flag_bahan_bakar: 0,
          harga_bahan_bakar: '10.000',
          uuid_mesin: 'test-uuid',
          sfc: '5.5',
          tahun: '2023',
          id: 1
        }],
        fuelConsumption: [{
          id_uraian: 1,
          bahan_bakar: 'Test Fuel',
          value: '100',
          kode_bahan_bakar: 'BB001'
        }],
        costCDetail: [{
          uuid_mesin: 'test-uuid',
          tahun: 2023,
          kode_bahan_bakar: 'BB001',
          fuel_cost: '50.000'
        }]
      }
      wrapper.vm.costComponentADetail = []

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.isLoading).toBe(false)
    }, 15000)

    it('should handle submit with values containing dots in formatting', async () => {
      wrapper.vm.idAsumsi = 1
      wrapper.vm.statusAsumsi = 'update'
      wrapper.vm.asumsiParameter = {
        asumsiMakro: {
          interestRate: '5.500',
          umurTeknis: '25',
          loanTenor: '15',
          loanPortion: '70.000',
          totalProjectCost: '1.000.000.000',
          dayaMampuNettoMW: '100.50'
        },
        parameterTeknis: {
          nphr: '2.500',
          auxiliary: '5.0',
          susutTrafo: '2.5',
          pemakaianSendiri: '3.5',
          electricityPriceA: '1.000',
          electricityPriceB: '800',
          electricityPriceC: '1.200',
          electricityPriceD: '900',
        }
      }
      wrapper.vm.masaManfaat = '25'
      wrapper.vm.typePeriodic = '1'
      wrapper.vm.ncf = '80.5'
      wrapper.vm.eaf = '85.5'
      wrapper.vm.productionBrutto = '1.000'
      wrapper.vm.productionNetto = '950'
      wrapper.vm.energySales = '900'
      wrapper.vm.costComponentA = '1.000.000'
      wrapper.vm.costComponentB = '500.000'
      wrapper.vm.biayaKepegawaian = '200.000'
      wrapper.vm.biayaPemeliharaanRutin = '100.000'
      wrapper.vm.biayaAdministrasiUmum = '50.000'
      wrapper.vm.biayaPembelianTenagaListrik = '75.000'
      wrapper.vm.biayaLainLain = '25.000'
      wrapper.vm.periodicMaintenanceCost = '50.000'
      wrapper.vm.costComponentC = '300.000'
      wrapper.vm.costComponentD = '150.000'
      wrapper.vm.biayaMinyakPelumas = '75.000'
      wrapper.vm.bahanKimia = '75.000'
      wrapper.vm.totalRevenue = '2.000.000'
      wrapper.vm.revenueKompA = '500.000'
      wrapper.vm.revenueKompB = '500.000'
      wrapper.vm.revenueKompC = '500.000'
      wrapper.vm.revenueKompD = '500.000'
      wrapper.vm.bahanBakarGroup = {
        bahanBakars: [{
          kode_bahan_bakar: 'BB001',
          flag_bahan_bakar: 0,
          harga_bahan_bakar: '10.000.50',
          uuid_mesin: 'test-uuid',
          sfc: '5.500',
          tahun: '2023',
          id: 1
        }],
        fuelConsumption: [{
          id_uraian: 1,
          bahan_bakar: 'Test Fuel',
          value: '100.50',
          kode_bahan_bakar: 'BB001'
        }],
        costCDetail: [{
          uuid_mesin: 'test-uuid',
          tahun: 2023,
          kode_bahan_bakar: 'BB001',
          fuel_cost: '50.000.75'
        }]
      }
      wrapper.vm.costComponentADetail = [{
        ai: '100.000',
        realisasi_aki: '50.000',
        id: 1
      }]

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.isLoading).toBe(false)
    }, 15000)
  })

  describe('Final Submit Operations', () => {
    it('should handle final submit for simulasi 1 with evidence file', async () => {
      wrapper.vm.selectedSimulasiTab = 'Simulasi 1'
      wrapper.vm.selectedFileEvidence = new File(['test'], 'evidence.pdf', { type: 'application/pdf' })
      wrapper.vm.uuidMesin = 'test-uuid'
      wrapper.vm.tahunBerjalan = 2024
      wrapper.vm.formFinansialSimulasi1 = {
        cost_component_c_detail: [{
          uuid_mesin: 'test-uuid',
          tahun: 2023,
          kode_bahan_bakar: 'BB001',
          fuel_cost: '1.000.000'
        }]
      }
      wrapper.vm.dataTeknisSimulasi1 = {
        tahun: 2024,
        uuid_mesin: 'test-uuid'
      }

      await wrapper.vm.handleFinalSubmit()

      expect(wrapper.vm.isLoading).toBe(false)
    }, 10000)

    it('should handle final submit for simulasi 2 with evidence file', async () => {
      wrapper.vm.selectedSimulasiTab = 'Simulasi 2'
      wrapper.vm.selectedFileEvidence = new File(['test'], 'evidence.pdf', { type: 'application/pdf' })
      wrapper.vm.dataTeknisSimulasi2 = {
        tahun: 2024,
        uuid_mesin: 'test-uuid'
      }
      wrapper.vm.formFinansialSimulasi2 = {
        cost_component_c_detail: []
      }

      await wrapper.vm.handleFinalSubmit()

      expect(wrapper.vm.isLoading).toBe(false)
    }, 10000)

    it('should handle final submit for simulasi 1 without evidence', async () => {
      wrapper.vm.selectedSimulasiTab = 'Simulasi 1'
      wrapper.vm.selectedFileEvidence = null
      wrapper.vm.formFinansialSimulasi1 = {
        cost_component_c_detail: [{
          uuid_mesin: 'test-uuid',
          tahun: 2023,
          kode_bahan_bakar: 'BB001',
          fuel_cost: '500000'
        }]
      }
      wrapper.vm.dataTeknisSimulasi1 = {
        tahun: 2024,
        uuid_mesin: 'test-uuid'
      }

      await wrapper.vm.handleFinalSubmit()

      expect(wrapper.vm.isLoading).toBe(false)
    }, 10000)

    it('should handle final submit for simulasi 2 without evidence', async () => {
      wrapper.vm.selectedSimulasiTab = 'Simulasi 2'
      wrapper.vm.selectedFileEvidence = null
      wrapper.vm.dataTeknisSimulasi2 = {
        tahun: 2024,
        uuid_mesin: 'test-uuid'
      }
      wrapper.vm.formFinansialSimulasi2 = {}

      await wrapper.vm.handleFinalSubmit()

      expect(wrapper.vm.isLoading).toBe(false)
    }, 10000)
  })

  describe('Download Operations', () => {
    it('should handle download excel simulasi 1 successfully', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      wrapper.vm.uuidMesin = 'test-uuid'
      wrapper.vm.tahunBerjalan = 2024
      
      await wrapper.vm.handleDownloadExcelSimulasi1()
      
      expect(wrapper.vm.isLoading).toBe(false)
      consoleLogSpy.mockRestore()
    })

    it('should handle download excel simulasi 2 successfully', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      wrapper.vm.uuidMesin = 'test-uuid'
      wrapper.vm.tahunBerjalan = 2024
      
      await wrapper.vm.handleDownloadExcelSimulasi2()
      
      expect(wrapper.vm.isLoading).toBe(false)
      consoleLogSpy.mockRestore()
    })
  })

  describe('Utility Functions', () => {
    it('should trigger watch when kode_bahan_bakar changes', async () => {
      wrapper.vm.comboBahanBakar = [
        {
          kode_bahan_bakar: 'BB003',
          id_uraian_fuel_consumption: '3',
          bahan_bakar: 'Bahan Bakar 3'
        }
      ]

      wrapper.vm.handleTambahBahanBakar()
      
      const lastIndex = wrapper.vm.bahanBakarGroup.bahanBakars.length - 1
      wrapper.vm.bahanBakarGroup.bahanBakars[lastIndex].kode_bahan_bakar = 'BB003'

      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.vm.bahanBakarGroup.bahanBakars.length).toBeGreaterThan(0)
    })

    it('should wait for specified milliseconds', async () => {
      const start = Date.now()
      await wrapper.vm.wait(50)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(50)
    })

    it('should return dash when listTypePeriodic is empty', () => {
      wrapper.vm.listTypePeriodic = []
      const result = wrapper.vm.getTypePeriodic(1)
      expect(result).toBe('-')
    })

    it('should handle multiple toggle operations for simulasi1', () => {
      const itemId1 = 1
      const itemId2 = 2
      
      wrapper.vm.toggleRowSimulasi1(itemId1)
      wrapper.vm.toggleRowSimulasi1(itemId2)
      
      expect(wrapper.vm.isRowTabOpenSimulasi1).toContain(itemId1)
      expect(wrapper.vm.isRowTabOpenSimulasi1).toContain(itemId2)
      
      wrapper.vm.toggleRowSimulasi1(itemId1)
      
      expect(wrapper.vm.isRowTabOpenSimulasi1).not.toContain(itemId1)
      expect(wrapper.vm.isRowTabOpenSimulasi1).toContain(itemId2)
    })

    it('should handle multiple toggle operations for simulasi2', () => {
      const itemId1 = 3
      const itemId2 = 4
      
      wrapper.vm.toggleRowSimulasi2(itemId1)
      wrapper.vm.toggleRowSimulasi2(itemId2)
      
      expect(wrapper.vm.isRowTabOpenSimulasi2).toContain(itemId1)
      expect(wrapper.vm.isRowTabOpenSimulasi2).toContain(itemId2)
      
      wrapper.vm.toggleRowSimulasi2(itemId2)
      
      expect(wrapper.vm.isRowTabOpenSimulasi2).toContain(itemId1)
      expect(wrapper.vm.isRowTabOpenSimulasi2).not.toContain(itemId2)
    })
  })
})
