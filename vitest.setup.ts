import { vi } from 'vitest';

// Global DOM setup for happy-dom
global.window = window;
global.document = document;
global.navigator = navigator;
global.location = location;

// Mock global objects
Object.defineProperty(window, 'SVGElement', {
  value: class SVGElement {},
  writable: true,
});

// Mock Canvas for lottie
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    fillStyle: '',
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    isPointInPath: vi.fn(),
    createLinearGradient: vi.fn(),
    createRadialGradient: vi.fn(),
    createPattern: vi.fn(),
  })),
  writable: true,
});

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};

// Mock FingerprintJS
vi.mock('@fingerprintjs/fingerprintjs', () => ({
  default: {
    load: vi.fn(() => Promise.resolve({
      get: vi.fn(() => Promise.resolve({ visitorId: 'test-visitor-id' }))
    }))
  }
}));

// Mock services
vi.mock('@/services/grafik-service');
vi.mock('@/services/peta-service');

// Mock base service dependencies
vi.mock('@/services/base-service', () => ({
  default: class MockBaseService {
    constructor() {}
    get() { return Promise.resolve({}); }
    post() { return Promise.resolve({}); }
  }
}));

// Mock vue-echarts and echarts
vi.mock('vue-echarts', () => ({
  default: {
    name: 'VChart',
    template: '<div>VChart Mock</div>',
  },
  THEME_KEY: 'test-theme-key',
}));

vi.mock('echarts/core', () => ({
  use: vi.fn(),
}));

// Mock Vue components
vi.mock('@/components/icons/IconEmptyData.vue', () => ({
  default: {
    name: 'IconEmptyData',
    template: '<div>Empty Data</div>',
  },
}));

vi.mock('@/components/ui/ShimmerLoading.vue', () => ({
  default: {
    name: 'ShimmerLoading',
    template: '<div>Loading...</div>',
  },
}));

vi.mock('@/components/ui/ModalWrapper.vue', () => ({
  default: {
    name: 'ModalWrapper',
    props: ['showModal', 'width', 'height'],
    template: '<div><slot /></div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue', () => ({
  default: {
    name: 'DynamicScatterPlot',
    props: ['source', 'series', 'legends', 'pln', 'ipp', 'xData', 'yData', 'dataZoom'],
    template: '<div>Scatter Plot</div>',
  },
}));

// Mock toast notifications
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyWarning: vi.fn(),
  notifyInfo: vi.fn(),
}));

// Mock date-fns locale
vi.mock('date-fns/locale', () => ({
  id: {},
}));

// Mock Element Plus components globally
vi.mock('element-plus', () => ({
  ElSelect: {
    name: 'ElSelect',
    template: '<div><slot name="header" /><slot /></div>',
    props: ['modelValue', 'multiple', 'clearable', 'collapseTagselect', 'placeholder', 'popperClass', 'maxCollapseTags'],
    emits: ['update:modelValue'],
  },
  ElOption: {
    name: 'ElOption',
    template: '<div></div>',
    props: ['label', 'value'],
  },
  ElCheckbox: {
    name: 'ElCheckbox',
    template: '<div></div>',
    props: ['modelValue', 'indeterminate'],
    emits: ['update:modelValue', 'change'],
  },
}));

// Mock VueDatePicker
vi.mock('@vuepic/vue-datepicker', () => ({
  default: {
    name: 'VueDatePicker',
    template: '<div></div>',
    props: ['modelValue', 'placeholder', 'formatLocale', 'yearRange', 'enableTimePicker', 'hideInputIcon', 'clearable', 'showNowButton', 'yearPicker', 'monthChangeOnScroll', 'teleport', 'autoApply'],
    emits: ['update:modelValue'],
  },
}));

// Mock Pinia store
vi.mock('pinia', () => ({
  createPinia: vi.fn(() => ({})),
  defineStore: vi.fn(() => vi.fn()),
  setActivePinia: vi.fn(),
}));

// Mock Vue Router
vi.mock('vue-router', () => ({
  createRouter: vi.fn(() => ({})),
  createWebHistory: vi.fn(() => ({})),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    params: {},
    query: {},
    path: '/',
    name: 'test',
  })),
}));

// Global test utilities
export const createMockStore = () => ({
  state: {},
  getters: {},
  actions: {},
  mutations: {},
});

export const createMockResponse = (data: any, success = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error',
});

// Export common test data
export const mockGraphicData = {
  success: true,
  data: [{
    grafik: [
      {
        kode_jenis_kit: 'PLTU',
        data: {
          daya_terpasang: 100,
          value_b: 50,
          value_d: 30,
        },
        nama_mesin: 'Test Machine 1',
      },
      {
        kode_jenis_kit: 'PLTG',
        data: {
          daya_terpasang: 150,
          value_b: 60,
          value_d: 40,
        },
        nama_mesin: 'Test Machine 2',
      },
    ],
    legend: [
      { label: 'PLTU', color: '#ff0000' },
      { label: 'PLTG', color: '#00ff00' },
    ],
    average_daya_terpasang: 125,
    average_opex: 75,
    average_ipp_opex: 65,
  }]
};

export const defaultProps = {
  itemsPembangkit: [
    { id: 'PLTU', name: 'PLTU' },
    { id: 'PLTG', name: 'PLTG' },
    { id: 'PLTS', name: 'PLTS' },
  ],
  itemsDayaMampu: [
    { id: '1', name: 'PLTU < 100' },
    { id: '2', name: 'PLTU 100 - 400' },
    { id: '3', name: 'PLTU > 400' },
  ],
  title: 'Test Graphic OpexBD',
  yearRange: [2020, 2025],
};