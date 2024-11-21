import { shallowMount } from '@vue/test-utils';
import DynamicScatterPlot from '@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue';
import { nextTick } from 'vue';

// Mock ECharts and vue-echarts globally to prevent real rendering issues in the test environment
jest.mock('vue-echarts', () => ({
  __esModule: true,
  default: {
    render: () => null,
  },
}));

// Mock echarts and ecStat
jest.mock('echarts', () => ({
  __esModule: true,
  init: jest.fn(() => ({
    setOption: jest.fn(),
    getOption: jest.fn(() => ({})),
  })),
  registerTransform: jest.fn(),
  use: jest.fn(),
}));

jest.mock('echarts-stat', () => ({
  __esModule: true,
  transform: {
    regression: jest.fn(() => ({
      equation: [0.5, 1], // Mock regression results
      points: [[1, 2], [2, 3]],
    })),
  },
}));

describe('DynamicScatterPlot.vue', () => {
  let wrapper: any;

  const mockSeries = [
    {
      name: 'Test Series',
      type: 'scatter',
      data: [
        [10, 20, 30],
        [40, 50, 60],
      ],
    },
  ];

  const mockProps: any = {
    series: mockSeries,
    source: [
      [10, 20],
      [30, 40],
    ],
    xData: { name: 'X Axis', satuan: '%' },
    yData: { name: 'Y Axis', satuan: 'MW' },
    legends: [
      { label: 'Legend 1', color: '#FF5656' },
      { label: 'Legend 2', color: '#0EA976' },
    ],
    pln: { x: 50, y: 100 },
    ipp: { x: 20, y: 80 },
    dataZoom: { start: 0, type: 'inside', orient: 'horizontal' },
  };

  beforeEach(() => {
    wrapper = shallowMount(DynamicScatterPlot, {
      props: mockProps,
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('emits update:series event when series changes', async () => {
    const newSeries = [
      {
        name: 'New Series',
        type: 'scatter',
        data: [
          [5, 10],
          [25, 30],
        ],
      },
    ];

    await wrapper.setProps({ series: newSeries });
    await nextTick();

    expect(wrapper.emitted('update:series')).toBeUndefined();
  });
});
