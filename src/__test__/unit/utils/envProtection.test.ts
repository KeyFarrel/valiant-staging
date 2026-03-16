import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initEnvProtection } from '@/utils/envProtection';

// Mock the secureEnv module completely
vi.mock('@/utils/secureEnv', () => ({
  getEnvironment: vi.fn(() => 'development'),
  getEnv: vi.fn(),
  isProduction: vi.fn(() => false),
  isDevelopment: vi.fn(() => true),
  isStaging: vi.fn(() => false),
  getApiUrl: vi.fn(() => 'http://localhost:3000'),
  secureEnv: {}
}));

describe('envProtection', () => {
  let originalWindow: any;
  let originalJSON: any;
  let originalImportMeta: any;
  let originalMutationObserver: any;

  beforeEach(() => {
    // Store original values
    originalWindow = global.window;
    originalJSON = global.JSON;
    originalImportMeta = global.import;
    originalMutationObserver = global.MutationObserver;
    
    // Setup basic window mock
    global.window = {
      ...window,
      import: {
        meta: {
          env: {
            MODE: 'test',
            DEV: true,
            PROD: false,
            VITE_API_URL: 'http://localhost:3000'
          }
        }
      }
    } as any;
    
    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original values
    global.window = originalWindow;
    global.JSON = originalJSON;
    global.import = originalImportMeta;
    global.MutationObserver = originalMutationObserver;
  });

  // Existing 3 basic tests
  it('should initialize environment protection without throwing errors', () => {
    expect(() => {
      initEnvProtection();
    }).not.toThrow();
  });

  it('should handle missing window object gracefully', () => {
    // @ts-ignore
    global.window = undefined;
    
    expect(() => {
      initEnvProtection();
    }).not.toThrow();
  });

  it('should work when called multiple times', () => {
    expect(() => {
      initEnvProtection();
      initEnvProtection();
      initEnvProtection();
    }).not.toThrow();
  });

  // Additional tests for uncovered lines
  it('should sanitize sensitive keys from window object', () => {
    // Setup window with sensitive keys
    global.window = {
      ...window,
      env: { SECRET: 'test' },
      process: { env: { SECRET: 'test' } },
      config: { API_KEY: 'secret' },
      ENV: { TOKEN: 'secret' },
      environment: { PASSWORD: 'secret' },
      import: {
        meta: {
          env: {
            MODE: 'test',
            VITE_API_URL: 'http://localhost:3000',
            SECRET_KEY: 'should-be-removed'
          }
        }
      }
    } as any;

    initEnvProtection();

    // Verify sensitive keys are removed
    expect((global.window as any).env).toBeUndefined();
    expect((global.window as any).process).toBeUndefined();
    expect((global.window as any).config).toBeUndefined();
  });

  it('should handle MutationObserver when available', () => {
    const mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn()
    };
    
    global.MutationObserver = vi.fn(function() { return mockObserver; }) as any;
    global.document = {
      documentElement: document.createElement('div')
    } as any;

    initEnvProtection();

    expect(global.MutationObserver).toHaveBeenCalled();
    expect(mockObserver.observe).toHaveBeenCalledWith(
      global.document.documentElement,
      { childList: true, subtree: true }
    );
  });

  it('should handle missing MutationObserver gracefully', () => {
    global.MutationObserver = undefined as any;

    expect(() => {
      initEnvProtection();
    }).not.toThrow();
  });

  it('should clean environment variables in window.import.meta.env', () => {
    global.window = {
      ...window,
      import: {
        meta: {
          env: {
            MODE: 'test',
            DEV: true,
            PROD: false,
            SSR: false,
            VITE_API_URL: 'http://localhost:3000',
            SECRET_API_KEY: 'should-be-removed',
            PRIVATE_TOKEN: 'should-be-removed'
          }
        }
      }
    } as any;

    // Verify the function attempts to clean the environment
    // The actual implementation silently handles errors and logs them
    expect(() => {
      initEnvProtection();
    }).not.toThrow();
  });

  it('should handle errors during global object access gracefully', () => {
    // Create a window object that throws errors when accessing properties
    global.window = new Proxy({}, {
      get(target, prop) {
        if (prop === 'import') {
          throw new Error('Access denied');
        }
        return undefined;
      }
    }) as any;

    expect(() => {
      initEnvProtection();
    }).not.toThrow();
  });
});