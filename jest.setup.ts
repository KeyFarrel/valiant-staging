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

// Mock DOM Event constructors (as any to avoid TypeScript conflicts)
(global as any).Event = class MockEvent {
  constructor(public type: string, options: any = {}) {
    this.bubbles = options.bubbles || false;
    this.cancelable = options.cancelable || false;
  }
  bubbles: boolean;
  cancelable: boolean;
};

(global as any).MouseEvent = class MockMouseEvent extends (global as any).Event {
  constructor(type: string, options: any = {}) {
    super(type, options);
    this.button = options.button || 0;
    this.clientX = options.clientX || 0;
    this.clientY = options.clientY || 0;
  }
  button: number;
  clientX: number;
  clientY: number;
};

(global as any).KeyboardEvent = class MockKeyboardEvent extends (global as any).Event {
  constructor(type: string, options: any = {}) {
    super(type, options);
    this.key = options.key || '';
    this.code = options.code || '';
  }
  key: string;
  code: string;
};

(global as any).InputEvent = class MockInputEvent extends (global as any).Event {
  constructor(type: string, options: any = {}) {
    super(type, options);
    this.data = options.data || null;
  }
  data: any;
};

// Mock window with crypto for WASM
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
    Event: (global as any).Event,
    MouseEvent: (global as any).MouseEvent,
    KeyboardEvent: (global as any).KeyboardEvent,
    InputEvent: (global as any).InputEvent,
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

// Mock DOM insertBefore method
if (typeof global.document !== 'undefined') {
  const originalInsertBefore = global.document.head.insertBefore;
  global.document.head.insertBefore = function(newNode: any, referenceNode: any) {
    if (referenceNode && referenceNode.parentNode) {
      return originalInsertBefore.call(this, newNode, referenceNode);
    }
    return this.appendChild(newNode);
  };
}

// Mock comment insertion
const originalCreateComment = global.document?.createComment;
if (originalCreateComment) {
  global.document.createComment = function(data: string) {
    const comment = originalCreateComment.call(this, data);
    // Mock insertBefore for comments
    comment.insertBefore = function(newNode: any, referenceNode: any) {
      if (this.parentNode) {
        return this.parentNode.insertBefore(newNode, referenceNode || this);
      }
      return newNode;
    };
    return comment;
  };
}

// Mock Node methods
const mockNode = {
  parentNode: null,
  childNodes: [],
  insertBefore: jest.fn((newNode, referenceNode) => {
    if (newNode) {
      newNode.parentNode = mockNode;
      if (referenceNode) {
        const index = mockNode.childNodes.indexOf(referenceNode);
        if (index !== -1) {
          mockNode.childNodes.splice(index, 0, newNode);
        } else {
          mockNode.childNodes.push(newNode);
        }
      } else {
        mockNode.childNodes.push(newNode);
      }
    }
    return newNode;
  }),
  appendChild: jest.fn((node) => {
    if (node) {
      node.parentNode = mockNode;
      mockNode.childNodes.push(node);
    }
    return node;
  }),
  removeChild: jest.fn((node) => {
    if (node) {
      const index = mockNode.childNodes.indexOf(node);
      if (index !== -1) {
        mockNode.childNodes.splice(index, 1);
      }
      node.parentNode = null;
    }
    return node;
  }),
  contains: jest.fn(() => false)
};

// Enhanced document mock - use Object.defineProperty for protected properties
Object.defineProperty(global.document, 'head', {
  value: {
    ...mockNode,
    appendChild: jest.fn(),
    insertBefore: jest.fn((newNode, referenceNode) => {
      if (newNode) {
        newNode.parentNode = global.document.head;
      }
      return newNode;
    })
  },
  writable: true,
  configurable: true
});

Object.defineProperty(global.document, 'body', {
  value: {
    ...mockNode,
    appendChild: jest.fn(),
    insertBefore: jest.fn((newNode, referenceNode) => {
      if (newNode) {
        newNode.parentNode = global.document.body;
      }
      return newNode;
    })
  },
  writable: true,
  configurable: true
});

// Safe to use Object.assign for methods that aren't protected
Object.assign(global.document, {
  createComment: jest.fn(() => ({
    ...mockNode,
    nodeType: 8,
    nodeValue: '',
    textContent: ''
  })),
  createTextNode: jest.fn((text) => ({
    ...mockNode,
    nodeType: 3,
    nodeValue: text,
    textContent: text
  })),
  createElement: jest.fn((tagName) => ({
    ...mockNode,
    tagName: tagName.toUpperCase(),
    nodeType: 1,
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    style: {},
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
      toggle: jest.fn()
    }
  })),
  createDocumentFragment: jest.fn(() => ({
    ...mockNode,
    nodeType: 11
  }))
});

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
