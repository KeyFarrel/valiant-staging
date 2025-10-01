// jest.setup.ts
import { createApp } from 'vue';

// Make Vue available globally for @vue/test-utils
global.Vue = require('vue');

// Mock `import.meta.env` for Jest testing
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        MODE: "development",
        VITE_API_URL: "https://portalapp.iconpln.co.id:5080/valiant-be/v1/",
        BASE_URL: '/',
      },
    },
  },
});

// Mock browser APIs for FingerprintJS
(global as any).MessageChannel = class MockMessageChannel {
  port1 = { 
    postMessage: jest.fn(), 
    onmessage: null,
    close: jest.fn(),
    start: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
  port2 = { 
    postMessage: jest.fn(), 
    onmessage: null,
    close: jest.fn(),
    start: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = MockResizeObserver;

// Mock window with crypto for WASM (without Event constructors)
Object.defineProperty(global, 'window', {
  value: {
    crypto: {
      subtle: {},
      getRandomValues: jest.fn(),
    },
    encryptAESPayload: jest.fn().mockResolvedValue('encrypted'),
    encryptStorageSecretKey: jest.fn().mockResolvedValue('encrypted-key'),
    location: {
      href: 'http://localhost:3000',
      origin: 'http://localhost:3000',
      protocol: 'http:',
      host: 'localhost:3000',
      hostname: 'localhost',
      port: '3000',
      pathname: '/',
      search: '',
      hash: '',
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    document: global.document,
  },
  writable: true,
});

// Mock location globally
Object.defineProperty(global, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock navigator for element-plus
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Node.js Jest Test Environment)',
    platform: 'linux',
    appVersion: '5.0 (Node.js Jest Test Environment)',
    language: 'en-US',
    languages: ['en-US', 'en'],
    cookieEnabled: true,
  },
  writable: true,
});

// Mock WASM ready state
global.wasmReady = true;

// Mock window.Go for WASM
Object.defineProperty(global, 'Go', {
  value: class MockGo {
    constructor() {}
    run() {}
    importObject = {};
  },
  writable: true,
});

// Add Go to window as well
(global as any).window.Go = global.Go;

// Simplified DOM mocking for Vue Test Utils compatibility

// Mock fetch API
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(''),
  headers: new Headers(),
});

// Mock HTMLCanvasElement.getContext for fingerprintjs
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Array(4).fill(0)
  })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
});

// Mock WebAssembly
global.WebAssembly = {
  instantiate: jest.fn().mockResolvedValue({
    instance: {
      exports: {}
    }
  }),
  compile: jest.fn().mockResolvedValue({}),
  validate: jest.fn().mockReturnValue(true),
  compileStreaming: jest.fn().mockResolvedValue({}),
  instantiateStreaming: jest.fn().mockResolvedValue({
    instance: {
      exports: {}
    }
  })
} as any;
