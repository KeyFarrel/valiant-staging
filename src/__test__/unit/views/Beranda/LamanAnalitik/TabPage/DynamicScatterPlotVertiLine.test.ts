import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DynamicScatterPlotVertiLine from '@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlotVertiLine.vue';

// Mock VChart component
vi.mock('vue-echarts', () => ({
  default: {
    name: 'VChart',
    template: '<div class="chart-mock">VChart Mock</div>',
    props: ['option', 'wFull', 'autocapitalize'],
  },
  THEME_KEY: 'test-theme-key',
}));

describe('DynamicScatterPlotVertiLine', () => {
  const defaultProps = {
    series: [
      {
        name: 'Test Series',
        type: 'scatter' as const,
        data: [[2020, 100, 1000, 'Test Point']],
      },
    ],
    xData: { name: 'Year', satuan: 'Tahun' },
    yData: { name: 'OPEX', satuan: 'Rp/kWh' },
    legends: [{ label: 'PLTU', color: '#ff0000' }],
    years: [2020, 2021, 2022],
    yValues: [100, 200, 300],
  };

  it('should render component successfully', () => {
    const wrapper = mount(DynamicScatterPlotVertiLine, {
      props: defaultProps,
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.chart-mock').exists()).toBe(true);
  });

  it('should display legends correctly', () => {
    const wrapper = mount(DynamicScatterPlotVertiLine, {
      props: defaultProps,
    });

    const legendItems = wrapper.findAll('.flex.flex-row.items-center.space-x-1\\.5');
    expect(legendItems).toHaveLength(1);
    expect(wrapper.text()).toContain('PLTU');
  });

  it('should emit update:series when option is set', () => {
    const wrapper = mount(DynamicScatterPlotVertiLine, {
      props: defaultProps,
    });

    // Trigger the setter by accessing the computed property
    const component = wrapper.vm as any;
    component.option = { test: 'value' };

    expect(wrapper.emitted('update:series')).toBeTruthy();
    expect(wrapper.emitted('update:series')[0]).toEqual([{ test: 'value' }]);
  });

  it('should handle tooltip formatter correctly', () => {
    const wrapper = mount(DynamicScatterPlotVertiLine, {
      props: defaultProps,
    });

    const component = wrapper.vm as any;
    const tooltipFormatter = component.option.tooltip.formatter;
    
    // Test tooltip formatter with mock data
    const mockParams = {
      value: [2020, 150000, 1000, 'Test Machine']
    };

    const result = tooltipFormatter(mockParams);
    expect(result).toContain('Test Machine');
    expect(result).toContain('Tahun : 2020');
    expect(result).toContain('OPEX');
  });

  it('should handle xAxis label formatter correctly', () => {
    const wrapper = mount(DynamicScatterPlotVertiLine, {
      props: defaultProps,
    });

    const component = wrapper.vm as any;
    const xAxisFormatter = component.option.xAxis.axisLabel.formatter;
    
    // Test xAxis formatter with numeric value
    const result = xAxisFormatter(2020.5);
    expect(result).toBe('2021');
  });

  it('should handle yAxis label formatter correctly', () => {
    const wrapper = mount(DynamicScatterPlotVertiLine, {
      props: defaultProps,
    });

    const component = wrapper.vm as any;
    const yAxisFormatter = component.option.yAxis.axisLabel.formatter;
    
    // Test yAxis formatter with numeric value
    const result = yAxisFormatter(150000);
    expect(typeof result).toBe('string');
    expect(result).toBeTruthy();
  });
});