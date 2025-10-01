import { shallowMount, VueWrapper } from "@vue/test-utils"
import { nextTick } from "vue"
import PerbaruiData from "@/views/Verifikasi/Sentral/TabPage/KK/PerbaruiData.vue"

// Mock route params
const mockRoute = {
  query: { 
    uuid_sentral: "test-sentral-uuid",
    tahun: "2024"
  },
  params: { 
    id: "test-mesin-id" 
  }
}

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn()
}

// Mock vue-router
jest.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
  createRouter: jest.fn(),
  createWebHistory: jest.fn(),
  RouterView: {},
  RouterLink: {}
}))

// Simple mock services
jest.mock("@/services/perbarui-data", () => {
  return jest.fn().mockImplementation(() => ({
    getMesinById: jest.fn().mockResolvedValue({ data: {} }),
    getCheckIntegrasi: jest.fn().mockResolvedValue({ data: { status_data_integrasi: true } }),
    getComboBahanBakar: jest.fn().mockResolvedValue({ data: [] }),
    getAsumsiParameterData: jest.fn().mockResolvedValue({ data: { asumsi_makro: { corporate_tax_rate: { toString: () => "25" } } } }),
    getTypePeriodic: jest.fn().mockResolvedValue({ data: [] }),
    getDataFinansialDetailSimulasi1: jest.fn().mockResolvedValue({ data: { detail: [] } }),
    getDataTeknisByPeriodeSimulasi1: jest.fn().mockResolvedValue({ data: { detail: [] } }),
    getDataTeknisSimulasi1: jest.fn().mockResolvedValue({ data: { detail: [] } }),
    getDataTeknisSimulasi2: jest.fn().mockResolvedValue({ data: { detail: [] } }),
    getDataFinansialSimulasi1: jest.fn().mockResolvedValue({ data: { detail: [] } }),
    getDataFinansialSimulasi2: jest.fn().mockResolvedValue({ data: { detail: [] } }),
    getHasilSimulasi: jest.fn().mockResolvedValue({ data: {} })
  }))
})

jest.mock("@/services/user-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPembina: jest.fn().mockResolvedValue({ data: [] })
  }))
})

jest.mock("@/services/auth-service", () => {
  return jest.fn().mockImplementation(() => ({}))
})

jest.mock("@/services/rekap-service", () => {
  return jest.fn().mockImplementation(() => ({}))
})

jest.mock("@/services/persetujuan-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPersetujuanKKSentral: jest.fn().mockResolvedValue({ data: [] })
  }))
})

jest.mock("@/services/format/global-format", () => {
  return jest.fn().mockImplementation(() => ({
    formatInputNumberOnly: jest.fn((value) => value || ""),
    formatCurrencyNotFixed: jest.fn((value) => value?.toString() || ""),
    formatRupiah: jest.fn((value) => `Rp ${value || 0}`),
    formatNumber: jest.fn((value) => value?.toString() || ""),
    formatDate: jest.fn((value) => value || ""),
    formatNumberFiveDigits: jest.fn((value) => value?.toString() || "")
  }))
})

// Mock stores
jest.mock("@/store/storeUserAuth", () => ({
  useUserAuthStore: jest.fn(() => ({
    user: { name: "Test User", role: "approver" }
  }))
}))

jest.mock("@/store/storeRekapKertasKerja", () => ({
  usePerbaruiTabStore: jest.fn(() => ({
    currentTab: 'Asumsi Makro'
  }))
}))

// Mock utils
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: jest.fn((value) => value)
  })
}))

jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn()
}))

// Mock lottie files
jest.mock("@/assets/lottie/error.json", () => ({
  default: {}
}))

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

describe("PerbaruiData.vue", () => {
  let wrapper: VueWrapper<any>

  const createWrapper = () => {
    return shallowMount(PerbaruiData, {
      global: {
        stubs: {
          Loading: true,
          ModalNotification: true,
          ModalWrapper: true,
          ConfirmationDialog: true,
          TabsWrapper: true,
          TabItem: true,
          InfoHeader: true,
          InfoComponent: true,
          AsumsiInfoBox: true,
          ParameterTeknisInfoBox: true,
          IconFolder: true,
          IconFolderBlue: true,
          TableDataTeknis: true,
          TableDataFinansial: true,
          AkhirMasaManfaat: true,
          TabAsumsiMakro: true,
          TabParameterTeknis: true,
          TabDataTeknis: true,
          TabDataFinansial: true,
          Vue3Lottie: true
        },
        directives: {
          'auto-animate': {
            mounted: () => {},
            updated: () => {},
            unmounted: () => {}
          }
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
      expect(wrapper.vm).toBeDefined()
    })

    it("should have route parameters accessible", () => {
      wrapper = createWrapper()
      
      // Test route access through useRoute mock
      expect(mockRoute.query.uuid_sentral).toBe("test-sentral-uuid")
      expect(mockRoute.query.tahun).toBe("2024")
      expect(mockRoute.params.id).toBe("test-mesin-id")
    })

    it("should initialize with basic reactive properties", async () => {
      wrapper = createWrapper()
      await nextTick()
      
      // Test that component has basic reactive properties
      expect('isLoading' in wrapper.vm).toBe(true)
      expect('selectedAside' in wrapper.vm).toBe(true)
      expect('selectedSimulasiTab' in wrapper.vm).toBe(true)
    })
  })

  describe("Component Properties", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have service instances defined", () => {
      // Test that services are instantiated
      expect('perbaruiDataService' in wrapper.vm).toBe(true)
      expect('userService' in wrapper.vm).toBe(true)
      expect('authService' in wrapper.vm).toBe(true)
      expect('rekapService' in wrapper.vm).toBe(true)
      expect('persetujuanService' in wrapper.vm).toBe(true)
      expect('globalFormat' in wrapper.vm).toBe(true)
    })

    it("should have data model properties", () => {
      // Test essential reactive properties exist
      expect('mesinDataById' in wrapper.vm).toBe(true)
      expect('asumsiParameter' in wrapper.vm).toBe(true)
      expect('asumsiParameterInit' in wrapper.vm).toBe(true)
      expect('bahanBakarGroup' in wrapper.vm).toBe(true)
      expect('comboBahanBakar' in wrapper.vm).toBe(true)
    })

    it("should have modal properties", () => {
      // Test modal properties exist
      expect('isShowModalNotification' in wrapper.vm).toBe(true)
      expect('isShowFinalConfirmation' in wrapper.vm).toBe(true)
      expect('isShowModalEvidence' in wrapper.vm).toBe(true)
    })
  })

  describe("Component Methods", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have data fetching methods", () => {
      // Test that essential methods exist
      expect(typeof wrapper.vm.fetchMesinById === 'function').toBe(true)
      expect(typeof wrapper.vm.fetchAsumsiParameter === 'function').toBe(true)
      expect(typeof wrapper.vm.fetchDataTeknisByPeriode === 'function').toBe(true)
      expect(typeof wrapper.vm.fetchDataFinansialDetail === 'function').toBe(true)
    })

    it("should have file handling methods", () => {
      expect(typeof wrapper.vm.handleFileChange === 'function').toBe(true)
      expect(typeof wrapper.vm.uploadFile === 'function').toBe(true)
    })

    it("should have form submit methods", () => {
      expect(typeof wrapper.vm.handleSubmit === 'function').toBe(true)
      expect(typeof wrapper.vm.handleFinalSubmit === 'function').toBe(true)
    })

    it("should have bahan bakar handling methods", () => {
      expect(typeof wrapper.vm.handleTambahBahanBakar === 'function').toBe(true)
      expect(typeof wrapper.vm.handleHapusBahanBakar === 'function').toBe(true)
    })

    it("should have simulation toggle methods", () => {
      expect(typeof wrapper.vm.toggleRowSimulasi1 === 'function').toBe(true)
      expect(typeof wrapper.vm.toggleRowSimulasi2 === 'function').toBe(true)
    })
  })
})
