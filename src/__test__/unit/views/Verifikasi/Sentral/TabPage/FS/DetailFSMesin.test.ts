/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import { nextTick } from "vue"
import DetailFSMesin from "@/views/Verifikasi/Sentral/TabPage/FS/DetailFSMesin.vue"

// Mock router
const mockRoute = {
  query: { uuid_sentral: "test-sentral-uuid" },
  params: { id: "123" }
}

jest.mock("vue-router", () => ({
  useRoute: () => mockRoute
}))

// Mock services
jest.mock("@/services/user-service")
jest.mock("@/services/detail-sentral-service")
jest.mock("@/services/rekap-service")
jest.mock("@/services/persetujuan-service")
jest.mock("@/services/feasibility-study")
jest.mock("@/services/detail-rekap-service")
jest.mock("@/services/format/global-format")

// Mock encrypt storage
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: jest.fn((value) => value)
  })
}))

// Mock toast notification
jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn()
}))

// Mock vue3-lottie
jest.mock("vue3-lottie", () => ({
  Vue3Lottie: {
    name: "Vue3Lottie",
    template: '<div class="lottie-mock"></div>',
    props: ["animationData", "autoPlay", "loop", "speed", "width", "height"]
  }
}))

describe("DetailFSMesin.vue", () => {
  let wrapper: VueWrapper<any>

  // Setup environment DOM polyfills
  beforeAll(() => {
    global.TextEncoder = global.TextEncoder || require('util').TextEncoder
    global.TextDecoder = global.TextDecoder || require('util').TextDecoder
    global.URL.createObjectURL = jest.fn()
    global.URL.revokeObjectURL = jest.fn()
    
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

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    jest.clearAllMocks()
  })

  describe("Component Mounting", () => {
    it("should mount successfully", async () => {
      wrapper = shallowMount(DetailFSMesin, {
        global: {
          stubs: {
            Loading: true,
            InfoHeader: true,
            ModalWrapper: true,
            TabsWrapper: true,
            Vue3Lottie: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AsumsiMakro: true,
            ParameterTeknis: true,
            AkhirMasaManfaat: true,
            TahunBerjalan: true,
            IconFolder: true,
            ComponentDisetujui: true,
            ComponentDitolakT1: true,
            ComponentDitolakT2: true,
            ComponentWaitingT1: true,
            ComponentWaitingT2: true,
            ComponentDraft: true
          },
          directives: {
            'auto-animate': {}
          }
        }
      })
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should initialize with loading state", async () => {
      wrapper = shallowMount(DetailFSMesin, {
        global: {
          stubs: {
            Loading: true,
            InfoHeader: true,
            ModalWrapper: true,
            TabsWrapper: true,
            Vue3Lottie: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AsumsiMakro: true,
            ParameterTeknis: true,
            AkhirMasaManfaat: true,
            TahunBerjalan: true,
            IconFolder: true,
            ComponentDisetujui: true,
            ComponentDitolakT1: true,
            ComponentDitolakT2: true,
            ComponentWaitingT1: true,
            ComponentWaitingT2: true,
            ComponentDraft: true
          },
          directives: {
            'auto-animate': {}
          }
        }
      })
      
      await nextTick()
      
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.isLoading).toBeDefined()
    })
  })

  describe("Component Properties", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailFSMesin, {
        global: {
          stubs: {
            Loading: true,
            InfoHeader: true,
            ModalWrapper: true,
            TabsWrapper: true,
            Vue3Lottie: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AsumsiMakro: true,
            ParameterTeknis: true,
            AkhirMasaManfaat: true,
            TahunBerjalan: true,
            IconFolder: true,
            ComponentDisetujui: true,
            ComponentDitolakT1: true,
            ComponentDitolakT2: true,
            ComponentWaitingT1: true,
            ComponentWaitingT2: true,
            ComponentDraft: true
          },
          directives: {
            'auto-animate': {}
          }
        }
      })
      await nextTick()
    })

    it("should have initial reactive properties", () => {
      expect(wrapper.vm.isLoading).toBeDefined()
      expect(wrapper.vm.modalApprove).toBeDefined()
      expect(wrapper.vm.selectedTab).toBeDefined()
      expect(wrapper.vm.data).toBeDefined()
      expect(wrapper.vm.isSuccess).toBeDefined()
      expect(wrapper.vm.isHover).toBeDefined()
    })

    it("should have service instances", () => {
      expect(wrapper.vm.feasibilityStudyService).toBeDefined()
      expect(wrapper.vm.detailRekapService).toBeDefined()
      expect(wrapper.vm.persetujuanService).toBeDefined()
      expect(wrapper.vm.globalFormat).toBeDefined()
    })

    it("should have modal state properties", () => {
      expect(wrapper.vm.isFSUploadSuccess).toBeDefined()
      expect(wrapper.vm.isModalUnggahFSOpen).toBeDefined()
      expect(wrapper.vm.isEvidenceSuccess).toBeDefined()
    })
  })

  describe("Utility Functions", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailFSMesin, {
        global: {
          stubs: {
            Loading: true,
            InfoHeader: true,
            ModalWrapper: true,
            TabsWrapper: true,
            Vue3Lottie: true,
            TableDataTeknis: true,
            TableDataFinansial: true,
            AsumsiMakro: true,
            ParameterTeknis: true,
            AkhirMasaManfaat: true,
            TahunBerjalan: true,
            IconFolder: true,
            ComponentDisetujui: true,
            ComponentDitolakT1: true,
            ComponentDitolakT2: true,
            ComponentWaitingT1: true,
            ComponentWaitingT2: true,
            ComponentDraft: true
          },
          directives: {
            'auto-animate': {}
          }
        }
      })
      await nextTick()
    })

    it("should have toggleButton function", () => {
      expect(typeof wrapper.vm.toggleButton).toBe('function')
      
      const initialHover = wrapper.vm.isHover
      wrapper.vm.toggleButton()
      expect(wrapper.vm.isHover).toBe(!initialHover)
    })

    it("should have formatBytes function", () => {
      expect(typeof wrapper.vm.formatBytes).toBe('function')
      
      // Test formatBytes
      expect(wrapper.vm.formatBytes(0)).toBe('0 Bytes')
      expect(wrapper.vm.formatBytes(1024)).toBe('1 KB')
      expect(wrapper.vm.formatBytes(1048576)).toBe('1 MB')
    })
  })
})
