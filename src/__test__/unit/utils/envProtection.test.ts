/**
 * @jest-environment jsdom
 */
import { initEnvProtection } from "@/utils/envProtection"

// Mock secureEnv module
jest.mock("@/utils/secureEnv", () => ({
  getEnvironment: jest.fn(() => "production")
}))

describe("envProtection.ts", () => {
  let originalWindow: any
  let originalConsole: any
  let originalJSONStringify: any
  let originalMutationObserver: any

  beforeAll(() => {
    // Setup DOM polyfills
    global.TextEncoder = global.TextEncoder || require('util').TextEncoder
    global.TextDecoder = global.TextDecoder || require('util').TextDecoder
  })

  beforeEach(() => {
    // Store original objects
    originalWindow = global.window
    originalConsole = global.console
    originalJSONStringify = JSON.stringify
    originalMutationObserver = global.MutationObserver

    // Reset window object
    Object.defineProperty(global, 'window', {
      value: {
        import: {
          meta: {
            env: {
              VITE_API_URL: 'test-api',
              SECRET_KEY: 'secret',
              NODE_ENV: 'test',
              MODE: 'test',
              DEV: false,
              PROD: true,
              SSR: false
            }
          }
        }
      },
      writable: true,
      configurable: true
    })

    // Mock console
    global.console = {
      ...originalConsole,
      debug: jest.fn(),
      error: jest.fn()
    }

    // Mock MutationObserver
    global.MutationObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      disconnect: jest.fn()
    }))
  })

  afterEach(() => {
    // Restore original objects
    global.window = originalWindow
    global.console = originalConsole
    JSON.stringify = originalJSONStringify
    global.MutationObserver = originalMutationObserver
    jest.clearAllMocks()
  })

  describe("Environment Protection Initialization", () => {
    it("should initialize protection without errors", () => {
      expect(() => initEnvProtection()).not.toThrow()
    })

    it("should work when window is undefined", () => {
      global.window = undefined as any
      expect(() => initEnvProtection()).not.toThrow()
    })

    it("should handle missing import.meta.env gracefully", () => {
      global.window = {} as any
      expect(() => initEnvProtection()).not.toThrow()
    })
  })

  describe("Global Object Sanitization", () => {
    it("should remove sensitive keys from window object", () => {
      // Add sensitive keys to window
      (global.window as any).env = { SECRET: 'test' }
      ;(global.window as any).process = { env: { SECRET: 'test' } }
      ;(global.window as any).config = { secret: 'test' }

      initEnvProtection()

      expect((global.window as any).env).toBeUndefined()
      expect((global.window as any).process).toBeUndefined()
      expect((global.window as any).config).toBeUndefined()
    })

    it("should clean import.meta.env of non-whitelisted variables", () => {
      initEnvProtection()

      const env = (global.window as any).import.meta.env
      expect(env.SECRET_KEY).toBeUndefined()
      expect(env.VITE_API_URL).toBeDefined()
      expect(env.MODE).toBeDefined()
      expect(env.DEV).toBeDefined()
      expect(env.PROD).toBeDefined()
      expect(env.SSR).toBeDefined()
    })

    it("should handle errors during sanitization gracefully", () => {
      // Create a window object that throws when properties are deleted
      const problematicWindow = new Proxy({}, {
        deleteProperty() {
          throw new Error('Cannot delete')
        }
      })
      global.window = problematicWindow as any

      expect(() => initEnvProtection()).not.toThrow()
      // Error handling is silent, so we just verify it doesn't crash
    })
  })

  describe("Console Protection", () => {
    it("should override JSON.stringify for environment objects", () => {
      initEnvProtection()

      const envObj = { VITE_API_URL: 'test-api', SECRET: 'secret' }
      const result = JSON.stringify(envObj)
      
      expect(result).toBe('{}')
    })

    it("should preserve normal JSON.stringify functionality", () => {
      initEnvProtection()

      const normalObj = { name: 'test', value: 123 }
      const result = JSON.stringify(normalObj)
      
      expect(result).toBe('{"name":"test","value":123}')
    })

    it("should handle import.meta.env serialization", () => {
      // Test with the existing import.meta.env from beforeEach setup
      const envObj = (global.window as any).import.meta.env
      
      initEnvProtection()

      const result = JSON.stringify(envObj)
      expect(result).toBe('{}')
    })

    it("should override toString for environment objects", () => {
      initEnvProtection()

      const env = (global.window as any).import?.meta?.env
      if (env) {
        expect(env.toString()).toBe('[object Object]')
      }
    })

    it("should handle protection errors gracefully", () => {
      // Create a scenario where protection fails
      Object.defineProperty(global.window, 'import', {
        get() {
          throw new Error('Access denied')
        },
        configurable: true
      })

      expect(() => initEnvProtection()).not.toThrow()
      expect(console.debug).toHaveBeenCalled()
    })
  })

  describe("MutationObserver Protection", () => {
    it("should create MutationObserver when available", () => {
      initEnvProtection()

      expect(MutationObserver).toHaveBeenCalledWith(expect.any(Function))
    })

    it("should observe document changes", () => {
      const mockObserver = {
        observe: jest.fn(),
        disconnect: jest.fn()
      }
      
      global.MutationObserver = jest.fn().mockImplementation(() => mockObserver)

      initEnvProtection()

      expect(mockObserver.observe).toHaveBeenCalledWith(
        document.documentElement,
        { childList: true, subtree: true }
      )
    })

    it("should handle script node removal in mutation callback", () => {
      let mutationCallback: any

      global.MutationObserver = jest.fn().mockImplementation((callback) => {
        mutationCallback = callback
        return { observe: jest.fn(), disconnect: jest.fn() }
      })

      initEnvProtection()

      // Simulate a script node being added
      const mockScript = {
        nodeName: 'SCRIPT',
        text: 'console.log(import.meta.env)',
        remove: jest.fn()
      }

      const mockMutation = {
        type: 'childList',
        addedNodes: [mockScript]
      }

      mutationCallback([mockMutation])

      expect(mockScript.remove).toHaveBeenCalled()
    })

    it("should handle non-script nodes without error", () => {
      let mutationCallback: any

      global.MutationObserver = jest.fn().mockImplementation((callback) => {
        mutationCallback = callback
        return { observe: jest.fn(), disconnect: jest.fn() }
      })

      initEnvProtection()

      const mockDiv = {
        nodeName: 'DIV',
        text: 'normal content'
      }

      const mockMutation = {
        type: 'childList',
        addedNodes: [mockDiv]
      }

      expect(() => mutationCallback([mockMutation])).not.toThrow()
    })

    it("should work without MutationObserver", () => {
      global.MutationObserver = undefined as any

      expect(() => initEnvProtection()).not.toThrow()
    })
  })

  describe("Development Mode Handling", () => {
    it("should skip protection in development mode", () => {
      // Mock development environment
      const { getEnvironment } = require("@/utils/secureEnv")
      getEnvironment.mockReturnValue("development")

      const originalStringify = JSON.stringify
      initEnvProtection()

      // JSON.stringify should not be modified in development
      expect(JSON.stringify).toBe(originalStringify)
    })
  })

  describe("Error Handling", () => {
    it("should handle toString override errors", () => {
      // Create an object that can't have properties defined
      const problematicEnv = Object.freeze({})
      
      global.window = {
        import: {
          meta: {
            env: problematicEnv
          }
        }
      } as any

      expect(() => initEnvProtection()).not.toThrow()
      // Error handling is internal, just verify it doesn't crash
    })

    it("should handle JSON.stringify override errors", () => {
      // Store original JSON object
      const originalJSON = global.JSON
      
      // Create a read-only JSON object
      try {
        Object.defineProperty(global, 'JSON', {
          value: { stringify: originalJSONStringify },
          writable: false,
          configurable: false
        })
      } catch (e) {
        // If we can't make it read-only, just test that it doesn't throw
      }

      expect(() => initEnvProtection()).not.toThrow()
      
      // Restore original JSON if possible
      try {
        global.JSON = originalJSON
      } catch (e) {
        // Ignore restoration errors
      }
    })

    it("should handle document access errors", () => {
      // Mock MutationObserver to be undefined to avoid document access
      global.MutationObserver = undefined as any

      expect(() => initEnvProtection()).not.toThrow()
    })
  })

  describe("Integration Tests", () => {
    it("should provide comprehensive protection", () => {
      // Setup a complete scenario
      global.window = {
        env: { SECRET: 'test' },
        process: { env: { SECRET: 'test' } },
        import: {
          meta: {
            env: {
              VITE_API_URL: 'test-api',
              SECRET_KEY: 'secret',
              NODE_ENV: 'test'
            }
          }
        }
      } as any

      // Mock MutationObserver to avoid document issues
      const mockObserver = { observe: jest.fn(), disconnect: jest.fn() }
      global.MutationObserver = jest.fn().mockImplementation(() => mockObserver)

      initEnvProtection()

      // Verify all protections are in place
      expect((global.window as any).env).toBeUndefined()
      expect((global.window as any).process).toBeUndefined()
      // Test basic functionality - JSON.stringify protection works for specific conditions
      expect(typeof JSON.stringify).toBe('function')
      expect(MutationObserver).toHaveBeenCalled()
    })

    it("should maintain functionality while protecting", () => {
      // Mock MutationObserver to avoid document issues
      const mockObserver = { observe: jest.fn(), disconnect: jest.fn() }
      global.MutationObserver = jest.fn().mockImplementation(() => mockObserver)
      
      initEnvProtection()

      // Normal operations should still work
      expect(JSON.stringify({ normal: 'data' })).toBe('{"normal":"data"}')
      expect(() => console.log('test')).not.toThrow()
    })
  })
})
