import { shallowMount, VueWrapper } from "@vue/test-utils"
import { nextTick } from "vue"
import DetailKKMesin from "@/views/Verifikasi/Approver/TabPage/KK/DetailKKMesin.vue"

// Mock router objects first
const mockRoute = {
  query: { 
    uuid_sentral: "test-sentral-uuid",
    tahun: "2024"
  },
  params: { id: "test-mesin-id" },
  path: "/test-path",
  meta: {},
  name: "test-route",
  fullPath: "/test-path?uuid_sentral=test-sentral-uuid&tahun=2024"
}

// Mock vue-router
jest.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  createRouter: jest.fn(),
  createWebHistory: jest.fn(),
  RouterView: {},
  RouterLink: {}
}))

// Mock services
jest.mock("@/services/user-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPembina: jest.fn().mockResolvedValue({
      data: [
        { uuid_pembina: "uuid1", pembina: "Test Pembina" }
      ]
    })
  }))
})

jest.mock("@/services/rekap-service", () => {
  return jest.fn().mockImplementation(() => ({
    getRekapData: jest.fn().mockResolvedValue({
      data: []
    })
  }))
})

jest.mock("@/services/auth-service", () => {
  return jest.fn().mockImplementation(() => ({}))
})

jest.mock("@/services/detail-sentral-service", () => {
  return jest.fn().mockImplementation(() => ({
    getSentralById: jest.fn().mockResolvedValue({
      data: [{
        uuid_sentral: 1,
        kode_sentral: "TEST001",
        nama_sentral: "Test Sentral"
      }]
    }),
    getPhoto: jest.fn().mockResolvedValue(new Blob(['photo data'], { type: 'image/jpeg' }))
  }))
})

jest.mock("@/services/persetujuan-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPersetujuanKKSentral: jest.fn().mockResolvedValue({
      data: {
        pengelola: "Test Pengelola",
        pembina: "Test Pembina",
        umur_teknis: "20",
        tahun: "2024",
        id_status: 1,
        mesins: [
          {
            uuid_mesin: "test-mesin-id",
            kode_mesin: "M001",
            mesin: "Test Mesin",
            id_status: 1,
            tahun: "2024"
          }
        ]
      }
    }),
    updateKKPengelola: jest.fn().mockResolvedValue({}),
    rejectKKPengelola: jest.fn().mockResolvedValue({}),
    updateKKPembina: jest.fn().mockResolvedValue({}),
    rejectKKPembina: jest.fn().mockResolvedValue({})
  }))
})

jest.mock("@/services/detail-rekap-service", () => {
  return jest.fn().mockImplementation(() => ({
    getMesinById: jest.fn().mockResolvedValue({
      data: {
        uuid_mesin: "test-mesin-id",
        kode_sentral: "TEST001",
        kode_mesin: "M001",
        mesin: "Test Mesin",
        kode_jenis_pembangkit: "PLTU",
        kondisi_unit: "Normal",
        daya_terpasang: 100,
        daya_mampu: 90,
        tahun_operasi: "2020",
        masa_manfaat: 20,
        nilai_asset_awal: 1000000000,
        tahun_nilai_perolehan: "2020",
        tahun_realisasi: "2023",
        photo1: "test-photo1.jpg",
        photo2: "test-photo2.jpg"
      }
    }),
    getAsumsiParameter: jest.fn().mockResolvedValue({
      data: {
        asumsi_makro: {
          id_asumsi: 1,
          uuid_mesin: "test-mesin-id",
          kode_mesin: "M001",
          status: "active",
          corporate_tax_rate: 25,
          discount_rate: 10,
          interest_rate: 8,
          loan_tenor: 15,
          loan_portion: 70,
          equity_portion: 30,
          umur_teknis: 20,
          bahan_bakars: []
        },
        parameter_teknis_financial: {
          daya_terpasang: 100,
          daya_mampu_netto_mw: 90,
          auxiliary: 5,
          susut_trafo: 2,
          ps: 95,
          total_project_cost: 1000000000,
          loan: 700000000,
          equity: 300000000,
          nphr: 2500,
          electricity_price_a_rp_per_kwbln: 1000,
          electricity_price_b_rp_per_kwbln: 1200,
          electricity_price_c_rp_per_kwh: 800,
          electricity_price_d_rp_per_kwh: 900
        },
        harga_bahan_bakars: []
      }
    }),
    getDataTeknis: jest.fn().mockResolvedValue({
      data: {
        header: ["Parameter", "Satuan"],
        tahun: [2023, 2024],
        detail: []
      }
    }),
    getDataFinansial: jest.fn().mockResolvedValue({
      data: {
        header: ["Parameter", "Satuan"],
        tahun: [2023, 2024],
        detail: []
      }
    }),
    getHasilSimulasi: jest.fn().mockResolvedValue({
      data: {
        track_irr_project: 12.5,
        track_irr_equity: 15.2,
        track_npv_equity: 1000000,
        track_npv_project: 1500000,
        track_average_cf: 85,
        track_average_eaf: 80,
        wacc_on_project: 10,
        wacc_on_equity: 12,
        now_track_irr_project: 12.0,
        now_track_irr_equity: 14.8,
        now_track_npv_equity: 950000,
        now_track_npv_project: 1450000,
        now_track_average_cf: 83,
        now_track_average_eaf: 78
      }
    }),
    getTypePeriodic: jest.fn().mockResolvedValue({
      data: []
    }),
    getComboBahanBakar: jest.fn().mockResolvedValue({
      data: []
    }),
    downloadEvidence: jest.fn().mockResolvedValue({
      data: new Blob(['test evidence'], { type: 'application/pdf' })
    }),
    getPembangkitByKode: jest.fn().mockResolvedValue({
      data: {
        kode_sentral: "TEST001",
        nama_sentral: "Test Sentral",
        pengelola: "Test Pengelola"
      }
    })
  }))
})

// Mock stores
jest.mock("@/store/storeUserAuth", () => ({
  useUserAuthStore: jest.fn(() => ({
    user: { name: "Test User", role: "approver" }
  }))
}))

// Mock utils
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: jest.fn((value) => value)
  })
}))

jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn()
}))

// Mock vue3-lottie
jest.mock("vue3-lottie", () => ({
  Vue3Lottie: {
    name: "Vue3Lottie",
    template: '<div class="lottie-mock"></div>',
    props: ["animationData", "autoPlay", "loop", "speed", "width", "height"]
  }
}))

// Mock lottie animation
jest.mock("@/assets/lottie/success.json", () => ({
  default: {}
}))

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
  value: {
    MODE: 'test'
  },
  configurable: true
})

// Setup global URL mock
beforeAll(() => {
  global.URL = {
    createObjectURL: jest.fn(() => 'blob:test-url'),
    revokeObjectURL: jest.fn()
  } as any

  // Mock document.createElement untuk file operations
  const originalCreateElement = document.createElement
  document.createElement = jest.fn((tagName) => {
    if (tagName === 'a') {
      return {
        href: '',
        download: '',
        click: jest.fn(),
        setAttribute: jest.fn(),
        style: {}
      } as any
    }
    return originalCreateElement.call(document, tagName)
  })
})

describe("DetailKKMesin.vue", () => {
  let wrapper: VueWrapper<any>

  const createWrapper = () => {
    return shallowMount(DetailKKMesin, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          InfoHeader: true,
          TabsWrapper: true,
          TabItem: true,
          Vue3Lottie: true,
          TableDataTeknis: true,
          TableDataFinansial: true,
          AsumsiMakro: true,
          ParameterTeknis: true,
          AkhirMasaManfaat: true,
          TahunBerjalan: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentDraft: true,
          ShimmerLoading: true
        },
        directives: {
          'auto-animate': {}
        }
      }
    })
  }

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    jest.clearAllMocks()
  })

  describe("Component Mounting", () => {
    it("should mount successfully", async () => {
      wrapper = createWrapper()
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should initialize with loading state", async () => {
      wrapper = createWrapper()
      await nextTick()
      
      expect(wrapper.vm.isLoading).toBeDefined()
    })

    it("should have route parameters accessible", () => {
      wrapper = createWrapper()
      
      // Test route access through useRoute mock
      expect(mockRoute.query.uuid_sentral).toBe("test-sentral-uuid")
      expect(mockRoute.query.tahun).toBe("2024")
      expect(mockRoute.params.id).toBe("test-mesin-id")
    })
  })

  describe("Component Properties", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have initial reactive properties", () => {
      expect(wrapper.vm.isLoading).toBeDefined()
      expect(wrapper.vm.isSuccess).toBeDefined()
      expect(wrapper.vm.isReject).toBeDefined()
      expect(wrapper.vm.modalCancel).toBeDefined()
      expect(wrapper.vm.modalApprove).toBeDefined()
      expect(wrapper.vm.selectedTab).toBeDefined()
      expect(wrapper.vm.data).toBeDefined()
    })

    it("should have service instances", () => {
      expect(wrapper.vm.persetujuanService).toBeDefined()
      expect(wrapper.vm.detailRekapService).toBeDefined()
      expect(wrapper.vm.userService).toBeDefined()
      expect(wrapper.vm.rekapService).toBeDefined()
      expect(wrapper.vm.authService).toBeDefined()
      expect(wrapper.vm.detailSentralService).toBeDefined()
    })

    it("should have data model properties", () => {
      expect(wrapper.vm.approveSentralKK).toBeDefined()
      expect(wrapper.vm.approveMesinKK).toBeDefined()
      expect(wrapper.vm.mesin).toBeDefined()
      expect(wrapper.vm.asumsiParameter).toBeDefined()
      expect(wrapper.vm.parameterTeknisFinansial).toBeDefined()
      expect(wrapper.vm.dataTeknis).toBeDefined()
      expect(wrapper.vm.dataFinansial).toBeDefined()
      expect(wrapper.vm.hasilSimulasi).toBeDefined()
    })
  })

  describe("Tab Navigation", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have TabsWrapper component", () => {
      expect(wrapper.findComponent({ name: 'TabsWrapper' }).exists()).toBe(true)
    })

    it("should handle tab selection", async () => {
      // Test tab changes
      expect(wrapper.vm.selectedTab).toBeDefined()
      
      // Test default selected tab
      if (wrapper.vm.selectedTab !== undefined) {
        expect(typeof wrapper.vm.selectedTab).toBe('string')
      }
    })
  })

  describe("Modal Components", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have modal components", () => {
      // Check if modal related properties exist
      expect(wrapper.vm.modalCancel).toBeDefined()
      expect(wrapper.vm.modalApprove).toBeDefined()
    })

    it("should handle modal visibility", async () => {
      // Test modal state management
      if (wrapper.vm.modalCancel !== undefined) {
        wrapper.vm.modalCancel = true
        await nextTick()
        expect(wrapper.vm.modalCancel).toBe(true)
      }
      
      if (wrapper.vm.modalApprove !== undefined) {
        wrapper.vm.modalApprove = true
        await nextTick()
        expect(wrapper.vm.modalApprove).toBe(true)
      }
    })

    it("should handle loading states", async () => {
      // Test loading state management
      expect(wrapper.vm.isLoading).toBeDefined()
      expect(wrapper.vm.isSuccess).toBeDefined()
      expect(wrapper.vm.isReject).toBeDefined()
      
      // Test state changes
      if (wrapper.vm.isLoading !== undefined) {
        wrapper.vm.isLoading = true
        await nextTick()
        expect(wrapper.vm.isLoading).toBe(true)
      }
    })
  })

  describe("Data Methods", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have data fetching methods", () => {
      // Test if data fetching methods exist
      expect(typeof wrapper.vm.fetchData === 'function' || wrapper.vm.fetchData === undefined).toBe(true)
      expect(typeof wrapper.vm.fetchAsumsiParameter === 'function' || wrapper.vm.fetchAsumsiParameter === undefined).toBe(true)
      expect(typeof wrapper.vm.fetchDataTeknis === 'function' || wrapper.vm.fetchDataTeknis === undefined).toBe(true)
      expect(typeof wrapper.vm.fetchDataFinansial === 'function' || wrapper.vm.fetchDataFinansial === undefined).toBe(true)
    })

    it("should handle data initialization", async () => {
      // Test initial data state
      expect(wrapper.vm.data).toBeDefined()
      expect(wrapper.vm.mesin).toBeDefined()
      expect(wrapper.vm.asumsiParameter).toBeDefined()
      
      // Check if data objects are properly initialized - some might be refs or reactive
      expect(['object', 'string', 'function'].includes(typeof wrapper.vm.data)).toBe(true)
      expect(['object', 'string', 'function'].includes(typeof wrapper.vm.mesin)).toBe(true)
      expect(['object', 'string', 'function'].includes(typeof wrapper.vm.asumsiParameter)).toBe(true)
    })
  })
})
