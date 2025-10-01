/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import { nextTick } from "vue"
import DetailFSMesin from "@/views/Verifikasi/Approver/TabPage/FS/DetailFSMesin.vue"

// Mock router
const mockRoute = {
  query: { uuid_sentral: "test-sentral-uuid", tahun: "2024" },
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
jest.mock("@/services/auth-service")

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

// Mock user auth store
jest.mock("@/store/storeUserAuth", () => ({
  useUserAuthStore: jest.fn(() => ({
    levelAlias: "Xf!8qP@7",
    roleAlias: "Vx_91$pN"
  }))
}))

// Mock vue3-lottie
jest.mock("vue3-lottie", () => ({
  Vue3Lottie: {
    name: "Vue3Lottie",
    template: '<div class="lottie-mock"></div>',
    props: ["animationData", "autoPlay", "loop", "speed", "width", "height"]
  }
}))

describe("DetailFSMesin.vue (Approver)", () => {
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
            TabItem: true,
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
            TabItem: true,
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
            TabItem: true,
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
      expect(wrapper.vm.isReject).toBeDefined()
      expect(wrapper.vm.modalCancel).toBeDefined()
    })

    it("should have service instances", () => {
      expect(wrapper.vm.feasibilityStudyService).toBeDefined()
      expect(wrapper.vm.detailRekapService).toBeDefined()
      expect(wrapper.vm.persetujuanService).toBeDefined()
      expect(wrapper.vm.globalFormat).toBeDefined()
      expect(wrapper.vm.userService).toBeDefined()
      expect(wrapper.vm.rekapService).toBeDefined()
    })

    it("should have approval state properties", () => {
      expect(wrapper.vm.namaPengelola).toBeDefined()
      expect(wrapper.vm.namaPembina).toBeDefined()
      expect(wrapper.vm.pesan).toBeDefined()
      expect(wrapper.vm.statusMesin).toBeDefined()
      // Component successfully mounted dengan properti yang ada
      expect(wrapper.exists()).toBe(true)
    })

    it("should have data properties", () => {
      expect(wrapper.vm.bahanBakars).toBeDefined()
      expect(wrapper.vm.finansialMappingResult).toBeDefined()
      expect(wrapper.vm.tahunBerjalan).toBeDefined()
      expect(wrapper.vm.idGrafik).toBeDefined()
      expect(wrapper.vm.jumlahMesin).toBeDefined()
    })
  })

  describe("Async Functions", () => {
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
            TabItem: true,
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

    it("should have fetch functions", () => {
      expect(typeof wrapper.vm.fetchMesinById).toBe('function')
      expect(typeof wrapper.vm.fetchPersetujuanFS).toBe('function')
      expect(typeof wrapper.vm.fetchAsumsiFeasibility).toBe('function')
      expect(typeof wrapper.vm.fetchDataTeknis).toBe('function')
      expect(typeof wrapper.vm.fetchDataFinansial).toBe('function')
      expect(typeof wrapper.vm.fetchHasilSimulasi).toBe('function')
    })

    it("should have approval functions", () => {
      expect(typeof wrapper.vm.updateFSPengelola).toBe('function')
      expect(typeof wrapper.vm.rejectFSPengelola).toBe('function')
      expect(typeof wrapper.vm.updateFSPembina).toBe('function')
      expect(typeof wrapper.vm.rejectFSPembina).toBe('function')
    })

    it("should have utility functions", () => {
      expect(typeof wrapper.vm.downloadEvidence).toBe('function')
      expect(typeof wrapper.vm.fetchListPembina).toBe('function')
      expect(typeof wrapper.vm.fetchUnitPengelola).toBe('function')
      expect(typeof wrapper.vm.fetchComboBahanBakar).toBe('function')
    })
  })

  describe("Component State", () => {
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
            TabItem: true,
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

    it("should have error handling state", () => {
      expect(wrapper.vm.error).toBeDefined()
      expect(wrapper.vm.error.pesanPenolakan).toBe(false)
    })

    it("should have initial data state", () => {
      expect(wrapper.vm.selectedTab).toBe("Akhir Masa")
      expect(wrapper.vm.data).toBe('Feasibility Study')
      expect(wrapper.vm.bahanBakars).toEqual([])
      expect(wrapper.vm.typePeriodic).toEqual([])
    })

    it("should have user auth store access", () => {
      expect(wrapper.vm.userAuthStore).toBeDefined()
      expect(wrapper.vm.userAuthStore.levelAlias).toBe("Xf!8qP@7")
      expect(wrapper.vm.userAuthStore.roleAlias).toBe("Vx_91$pN")
    })
  })
})
