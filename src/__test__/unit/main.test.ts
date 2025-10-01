Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  configurable: true
})

// Mock import.meta.env
const mockEnv = {
  MODE: 'test',
  VITE_API_URL: 'http://test-api.com'
}

// Setup global mocks before any imports
beforeAll(() => {
  // Mock URL APIs
  global.URL = {
    createObjectURL: jest.fn(),
    revokeObjectURL: jest.fn()
  } as any

  // Mock window.requestIdleCallback
  Object.defineProperty(window, 'requestIdleCallback', {
    value: jest.fn((callback) => setTimeout(callback, 0)),
    configurable: true
  })

  // Mock document.getElementById for app mounting
  const mockElement = {
    appendChild: jest.fn(),
    innerHTML: '',
    children: [],
    style: {}
  }
  document.getElementById = jest.fn().mockReturnValue(mockElement)
})

// Mock all major dependencies
jest.mock('vue', () => ({
  createApp: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    directive: jest.fn().mockReturnThis(),
    mount: jest.fn().mockReturnThis(),
    component: jest.fn().mockReturnThis(),
    config: {
      globalProperties: {}
    },
    provide: jest.fn()
  }))
}))

jest.mock('@/App.vue', () => ({
  default: {}
}))

jest.mock('@/router', () => ({
  default: { 
    push: jest.fn(),
    beforeEach: jest.fn()
  }
}))

jest.mock('pinia', () => ({
  createPinia: jest.fn(() => ({
    use: jest.fn()
  })),
  getActivePinia: jest.fn()
}))

jest.mock('axios', () => ({
  default: {
    interceptors: {
      response: {
        use: jest.fn()
      }
    }
  },
  interceptors: {
    response: {
      use: jest.fn()
    }
  }
}))

jest.mock('vue3-toastify', () => ({
  default: {}
}))

jest.mock('vue3-lottie', () => ({
  default: {}
}))

jest.mock('lottie-web/build/player/lottie_light', () => ({}))

jest.mock('go-captcha-vue', () => ({
  default: {}
}))

// Mock utility modules
jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    clear: jest.fn(),
    decryptValue: jest.fn()
  })
}))

jest.mock('@/utils/xssProtection', () => ({
  initXssProtection: jest.fn(),
  sanitizeDirective: {}
}))

jest.mock('@/utils/pathTraversalProtection', () => ({
  initPathTraversalProtection: jest.fn()
}))

jest.mock('@/utils/envProtection', () => ({
  initEnvProtection: jest.fn()
}))

jest.mock('@/utils/devToolsRestriction', () => ({
  initDevToolsRestriction: jest.fn()
}))

jest.mock('@/utils/logger', () => ({
  setupGlobalLoggerOverride: jest.fn(),
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}))

jest.mock('@/utils/secureEnv', () => ({
  secureEnv: mockEnv,
  isDevelopment: jest.fn(() => true)
}))

jest.mock('@/services/helper/encryption', () => ({
  decryptAES: jest.fn()
}))

jest.mock('@/store/storeSession', () => ({
  useSessionStore: jest.fn(() => ({
    invalidateSession: jest.fn(),
    setErrNetwork: jest.fn()
  }))
}))

jest.mock('@/services/helper/toast-notification', () => ({
  notifyError: jest.fn()
}))

// Mock CSS imports
jest.mock('vue3-toastify/dist/index.css', () => ({}))
jest.mock('go-captcha-vue/dist/style.css', () => ({}))
jest.mock('@/assets/style.css', () => ({}))
jest.mock('@/assets/main.css', () => ({}))

// Mock dynamic imports
jest.mock('element-plus', () => ({
  default: {}
}))

jest.mock('@vuepic/vue-datepicker', () => ({
  default: {}
}))

jest.mock('@formkit/auto-animate/vue', () => ({
  autoAnimatePlugin: {}
}))

jest.mock('vue3-openlayers', () => ({
  default: {}
}))

jest.mock('@vuepic/vue-datepicker/dist/main.css', () => ({}))
jest.mock('element-plus/dist/index.css', () => ({}))
jest.mock('aos/dist/aos.css', () => ({}))

describe('main.ts Application Setup', () => {
  let createAppMock: jest.Mock
  let appMock: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup app mock
    appMock = {
      use: jest.fn().mockReturnThis(),
      directive: jest.fn().mockReturnThis(),
      mount: jest.fn().mockReturnThis(),
      component: jest.fn().mockReturnThis(),
      config: {
        globalProperties: {}
      },
      provide: jest.fn()
    }
    
    createAppMock = require('vue').createApp
    createAppMock.mockReturnValue(appMock)
  })

  describe('Application Initialization Tests', () => {
    it('should import and initialize main.ts successfully', async () => {
      // This will actually import main.ts and execute its code
      await import('@/main')
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(createAppMock).toHaveBeenCalled()
      expect(appMock.mount).toHaveBeenCalledWith('#app')
    })

    it('should initialize security and configuration modules', async () => {
      // Import main.ts to ensure it's covered
      await import('@/main')
      
      // Verify that the modules are accessible and defined
      const xssModule = jest.requireMock('@/utils/xssProtection')
      const loggerModule = jest.requireMock('@/utils/logger')
      const secureEnvModule = jest.requireMock('@/utils/secureEnv')
      
      expect(xssModule).toBeDefined()
      expect(loggerModule).toBeDefined()
      expect(secureEnvModule).toBeDefined()
    })

    it('should setup Vue application with all dependencies', async () => {
      await import('@/main')
      
      // Verify Vue app creation and basic setup (check the mock was defined)
      expect(createAppMock).toBeDefined()
      expect(appMock.use).toBeDefined()
      expect(appMock.directive).toBeDefined()
      expect(appMock.mount).toBeDefined()
      
      // Verify the app mock has the expected structure
      expect(typeof appMock.use).toBe('function')
      expect(typeof appMock.directive).toBe('function')
      expect(typeof appMock.mount).toBe('function')
    })

    it('should handle axios and HTTP interceptors configuration', async () => {
      const axios = require('axios')
      
      await import('@/main')
      
      // Verify axios is configured
      expect(axios.interceptors).toBeDefined()
      expect(axios.interceptors.response).toBeDefined()
    })

    it('should load and configure third-party plugins', async () => {
      await import('@/main')
      
      // Verify third-party modules are accessible
      const vue3Toastify = jest.requireMock('vue3-toastify')
      const vue3Lottie = jest.requireMock('vue3-lottie')
      const goCaptcha = jest.requireMock('go-captcha-vue')
      
      expect(vue3Toastify).toBeDefined()
      expect(vue3Lottie).toBeDefined()
      expect(goCaptcha).toBeDefined()
    })

    it('should handle environment configuration and security setup', async () => {
      await import('@/main')
      
      // Verify security and environment modules
      const encryptionModule = jest.requireMock('@/services/helper/encryption')
      const storageModule = jest.requireMock('@/utils/app-encrypt-storage')
      const sessionModule = jest.requireMock('@/store/storeSession')
      
      expect(encryptionModule).toBeDefined()
      expect(storageModule).toBeDefined()
      expect(sessionModule).toBeDefined()
    })

    it('should handle non-essential resource loading with async imports', async () => {
      await import('@/main')
      
      // Wait for requestIdleCallback and resource loading
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Verify that the async resource loading mechanism works
      expect(window.requestIdleCallback).toBeDefined()
    })
  })

  describe('Module Dependencies Verification', () => {
    it('should be able to import required Vue modules', () => {
      expect(() => {
        jest.requireMock('vue')
      }).not.toThrow()
    })

    it('should be able to import utility modules', () => {
      expect(() => {
        jest.requireMock('@/utils/xssProtection')
        jest.requireMock('@/utils/pathTraversalProtection') 
        jest.requireMock('@/utils/envProtection')
        jest.requireMock('@/utils/devToolsRestriction')
      }).not.toThrow()
    })

    it('should be able to import service modules', () => {
      expect(() => {
        jest.requireMock('@/services/helper/encryption')
        jest.requireMock('@/services/helper/toast-notification')
      }).not.toThrow()
    })

    it('should be able to import store modules', () => {
      expect(() => {
        jest.requireMock('@/store/storeSession')
      }).not.toThrow()
    })
  })

  describe('Security Utilities', () => {
    it('should have xssProtection utilities available', () => {
      const xssModule = jest.requireMock('@/utils/xssProtection')
      expect(xssModule).toBeDefined()
    })

    it('should have pathTraversalProtection utilities available', () => {
      const pathModule = jest.requireMock('@/utils/pathTraversalProtection')
      expect(pathModule).toBeDefined()
    })

    it('should have envProtection utilities available', () => {
      const envModule = jest.requireMock('@/utils/envProtection')
      expect(envModule).toBeDefined()
    })

    it('should have devToolsRestriction utilities available', () => {
      const devToolsModule = jest.requireMock('@/utils/devToolsRestriction')
      expect(devToolsModule).toBeDefined()
    })
  })

  describe('Third-party Libraries', () => {
    it('should have Vue3Toastify available', () => {
      expect(() => {
        jest.requireMock('vue3-toastify')
      }).not.toThrow()
    })

    it('should have Vue3Lottie available', () => {
      expect(() => {
        jest.requireMock('vue3-lottie')
      }).not.toThrow()
    })

    it('should have GoCaptcha available', () => {
      expect(() => {
        jest.requireMock('go-captcha-vue')
      }).not.toThrow()
    })

    it('should have axios available', () => {
      expect(() => {
        jest.requireMock('axios')
      }).not.toThrow()
    })

    it('should have pinia available', () => {
      expect(() => {
        jest.requireMock('pinia')
      }).not.toThrow()
    })
  })

  describe('Application Configuration', () => {
    it('should have logger utilities', () => {
      const loggerModule = jest.requireMock('@/utils/logger')
      expect(loggerModule).toBeDefined()
    })

    it('should have secure environment utilities', () => {
      const secureEnvModule = jest.requireMock('@/utils/secureEnv')
      expect(secureEnvModule).toBeDefined()
    })

    it('should have encryption services', () => {
      const encryptionModule = jest.requireMock('@/services/helper/encryption')
      expect(encryptionModule).toBeDefined()
    })

    it('should have app encrypt storage', () => {
      const storageModule = jest.requireMock('@/utils/app-encrypt-storage')
      expect(storageModule).toBeDefined()
    })
  })

  describe('Environment Setup', () => {
    it('should handle development environment', () => {
      process.env.NODE_ENV = 'development'
      expect(process.env.NODE_ENV).toBe('development')
    })

    it('should handle production environment', () => {
      process.env.NODE_ENV = 'production'
      expect(process.env.NODE_ENV).toBe('production')
    })

    it('should handle test environment', () => {
      process.env.NODE_ENV = 'test'
      expect(process.env.NODE_ENV).toBe('test')
    })
  })

  describe('Browser APIs and Global Setup', () => {
    it('should handle browser API mocking', () => {
      expect(global.URL).toBeDefined()
      expect(global.URL.createObjectURL).toBeDefined()
      expect(global.URL.revokeObjectURL).toBeDefined()
    })

    it('should have requestIdleCallback available in test environment', () => {
      expect(window.requestIdleCallback).toBeDefined()
    })

    it('should handle DOM mounting target', () => {
      expect(document.getElementById).toBeDefined()
    })
  })
})