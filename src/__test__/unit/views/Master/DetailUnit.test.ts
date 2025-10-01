import { shallowMount, VueWrapper } from "@vue/test-utils"
import { nextTick } from "vue"
import DetailUnit from "@/views/Master/DetailUnit.vue"

// Mock router objects first
const mockRoute = {
  query: { 
    kode_pengelola: "test-kode-pengelola",
    tab: "Sentral"
  },
  params: { id: "123" },
  path: "/test-path",
  meta: {},
  name: "test-route",
  fullPath: "/test-path?kode_pengelola=test-kode-pengelola&tab=Sentral"
}

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  go: jest.fn(),
  back: jest.fn(),
  forward: jest.fn()
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

// Mock router module dengan implementasi yang benar
jest.mock("@/router", () => ({
  default: {
    replace: jest.fn(),
    push: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn()
  }
}))

// Dapatkan referensi ke mock setelah jest.mock
const mockRouterModule = require("@/router").default

// Mock services
jest.mock("@/services/detail-sentral-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPengelolaData: jest.fn().mockResolvedValue({
      data: [
        { kode_pengelola: "test-kode-pengelola", pengelola: "Test Pengelola" }
      ]
    }),
    getSentralById: jest.fn().mockResolvedValue({
      data: [{
        uuid_sentral: 1,
        kode_sentral: "TEST001",
        nama_sentral: "Test Sentral",
        provinsi: "Test Province",
        alamat: "Test Address",
        latitude: "-6.2088",
        longitude: "106.8456",
        photo: "test-photo.jpg",
        mesins: [
          {
            mesin: "Mesin 1",
            daya_terpasang: 100,
            daya_mampu: 90,
            nilai_asset_awal: 1000000000,
            masa_manfaat: 20,
            tahun_nilai_perolehan: 2020,
            latitude: "-6.2088",
            longitude: "106.8456",
            photo1: "mesin1.jpg"
          }
        ]
      }]
    }),
    getPhoto: jest.fn().mockResolvedValue({
      data: new Blob(['test image'], { type: 'image/jpeg' })
    }),
    uploadPhoto: jest.fn().mockResolvedValue({
      data: "uploaded-photo-id"
    }),
    updateMesinById: jest.fn().mockResolvedValue({}),
    updateSentral: jest.fn().mockResolvedValue({})
  }))
})

jest.mock("@/services/user-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPembina: jest.fn().mockResolvedValue({
      data: [
        { uuid_pembina: "uuid1", pembina: "Test Pembina" }
      ]
    })
  }))
})

jest.mock("@/services/perbarui-data", () => {
  return jest.fn().mockImplementation(() => ({
    getPembangkitByKode: jest.fn().mockResolvedValue({
      data: {
        kode_pengelola: "test-kode-pengelola",
        uuid_pembina: "uuid1"
      }
    }),
    getPengelolaData: jest.fn().mockResolvedValue({
      data: [
        { kode_pengelola: "test-kode-pengelola", pengelola: "Test Pengelola" }
      ]
    })
  }))
})

jest.mock("@/services/auth-service", () => {
  return jest.fn().mockImplementation(() => ({}))
})

jest.mock("@/services/format/global-format", () => {
  return jest.fn().mockImplementation(() => ({
    formatInputNumberOnly: jest.fn((value) => value),
    formatCurrencyNotFixed: jest.fn((value) => value.toString()),
    formatRupiah: jest.fn((value) => `Rp ${value.toLocaleString()}`),
    formatNumber: jest.fn((value) => value.toString()),
    formatDate: jest.fn((value) => value)
  }))
})

// Mock stores
jest.mock("@/store/storeUserAuth", () => ({
  useUserAuthStore: jest.fn(() => ({
    user: { name: "Test User" }
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

// Mock lottie animation
jest.mock("@/assets/lottie/success.json", () => ({
  default: {}
}))

// Mock CSS imports
jest.mock("leaflet/dist/leaflet.css", () => ({}))

// Mock import.meta.env
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  configurable: true
})

// Setup global URL mock
beforeAll(() => {
  global.URL = {
    createObjectURL: jest.fn(() => 'blob:test-url'),
    revokeObjectURL: jest.fn()
  } as any
})

describe("DetailUnit.vue", () => {
  let wrapper: VueWrapper<any>

  const createWrapper = () => {
    return shallowMount(DetailUnit, {
      global: {
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        },
        stubs: {
          Loading: true,
          ModalWrapper: true,
          ConfirmationDialog: true,
          ModalNotification: true,
          TextInputPrefix: true,
          TooltipDetailUnit: true,
          'ol-map': true,
          'ol-view': true,
          'ol-tile-layer': true,
          'ol-source-osm': true,
          'ol-vector-layer': true,
          'ol-source-vector': true,
          'ol-feature': true,
          'ol-geom-point': true,
          'ol-style': true,
          'ol-style-icon': true,
          'ol-overlay': true
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

  beforeEach(() => {
    // Reset mock sebelum setiap test
    mockRouterModule.replace.mockClear()
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
      
      expect(wrapper.vm.$route).toBeDefined()
      expect(wrapper.vm.$route.query.kode_pengelola).toBe("test-kode-pengelola")
    })
  })

  describe("Component Properties", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have initial reactive properties", () => {
      expect(wrapper.vm.isLoading).toBeDefined()
      expect(wrapper.vm.isConfirmationOpen).toBeDefined()
      expect(wrapper.vm.isConfirmationOpenSentral).toBeDefined()
      expect(wrapper.vm.showModal).toBeDefined()
      expect(wrapper.vm.selectedTitle).toBeDefined()
      expect(wrapper.vm.sentralDataById).toBeDefined()
      expect(wrapper.vm.mesin).toBeDefined()
    })

    it("should have service instances", () => {
      expect(wrapper.vm.detailSentralService).toBeDefined()
      expect(wrapper.vm.userService).toBeDefined()
      expect(wrapper.vm.perbaruiDataService).toBeDefined()
      expect(wrapper.vm.authService).toBeDefined()
      expect(wrapper.vm.globalFormat).toBeDefined()
    })

    it("should have form model properties", () => {
      expect(wrapper.vm.mesinFormModel).toBeDefined()
      expect(wrapper.vm.nilaiAsetAwalSentral).toBeDefined()
      expect(wrapper.vm.dayaTerpasangSentral).toBeDefined()
      expect(wrapper.vm.dayaMampuSentral).toBeDefined()
    })

    it("should have coordinate and map properties", () => {
      expect(wrapper.vm.center).toBeDefined()
      expect(wrapper.vm.zoom).toBeDefined()
      expect(wrapper.vm.projection).toBeDefined()
      expect(wrapper.vm.rotation).toBeDefined()
    })
  })

  describe("Tab Navigation", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should initialize with correct selected tab", () => {
      expect(wrapper.vm.selectedTitle).toBe("Sentral")
    })

    it("should have replaceUnitTab method", () => {
      expect(typeof wrapper.vm.replaceUnitTab).toBe('function')
    })

    it("should have replaceSentralTab method", () => {
      expect(typeof wrapper.vm.replaceSentralTab).toBe('function')
    })
  })

  describe("Edit Functionality", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have toggleEdit method", () => {
      expect(typeof wrapper.vm.toggleEdit).toBe('function')
    })

    it("should have isEditOpen method", () => {
      expect(typeof wrapper.vm.isEditOpen).toBe('function')
    })

    it("should toggle edit state correctly", () => {
      const itemId = "Sentral"
      
      // Initially not in edit mode
      expect(wrapper.vm.isEditOpen(itemId)).toBe(false)
      
      // Toggle to edit mode
      wrapper.vm.toggleEdit(itemId)
      expect(wrapper.vm.isEditOpen(itemId)).toBe(true)
      
      // Toggle back to non-edit mode
      wrapper.vm.toggleEdit(itemId)
      expect(wrapper.vm.isEditOpen(itemId)).toBe(false)
    })
  })

  describe("Form Validation Methods", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have handleInputMasaManfaat method", () => {
      expect(typeof wrapper.vm.handleInputMasaManfaat).toBe('function')
    })

    it("should have handleInputTahunDataAwal method", () => {
      expect(typeof wrapper.vm.handleInputTahunDataAwal).toBe('function')
    })

    it("should have checkYearIsValid method", () => {
      expect(typeof wrapper.vm.checkYearIsValid).toBe('function')
    })

    it("should format input correctly", () => {
      const mockTarget = { masaManfaat: "123abc" }
      wrapper.vm.handleInputMasaManfaat(mockTarget)
      
      expect(wrapper.vm.globalFormat.formatInputNumberOnly).toHaveBeenCalled()
    })
  })

  describe("File Upload Functionality", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have onFileChangeSentral method", () => {
      expect(typeof wrapper.vm.onFileChangeSentral).toBe('function')
    })

    it("should have onFileChange method", () => {
      expect(typeof wrapper.vm.onFileChange).toBe('function')
    })

    it("should handle file upload for sentral", () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockEvent = {
        target: { files: [mockFile] }
      } as any

      wrapper.vm.onFileChangeSentral(mockEvent)
      
      expect(wrapper.vm.imageToUploadSentral).toBe(mockFile)
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockFile)
    })
  })

  describe("Data Management Methods", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should have getSentralById method", () => {
      expect(typeof wrapper.vm.getSentralById).toBe('function')
    })

    it("should have updateMesinById method", () => {
      expect(typeof wrapper.vm.updateMesinById).toBe('function')
    })

    it("should have updateSentral method", () => {
      expect(typeof wrapper.vm.updateSentral).toBe('function')
    })

    it("should have fetchPengelola method", () => {
      expect(typeof wrapper.vm.fetchPengelola).toBe('function')
    })
  })

  describe("Component Integration", () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await nextTick()
    })

    it("should render loading component when isLoading is true", async () => {
      wrapper.vm.isLoading = true
      await nextTick()
      
      const loadingComponent = wrapper.findComponent({ name: 'Loading' })
      expect(loadingComponent.exists()).toBe(true)
    })

    it("should render modal components", () => {
      const modalWrappers = wrapper.findAllComponents({ name: 'ModalWrapper' })
      expect(modalWrappers.length).toBeGreaterThan(0)
    })
  })
})