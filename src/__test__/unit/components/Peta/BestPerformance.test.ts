import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BestPerformance from '@/components/Peta/BestPerformance.vue';

describe('BestPerformance.vue', () => {
  it('should render the SVG correctly', () => {
    const wrapper = mount(BestPerformance);

    const svgElement = wrapper.find('svg');
    expect(svgElement.exists()).toBe(true);

    expect(svgElement.attributes('width')).toBe('16');
    expect(svgElement.attributes('height')).toBe('16');

    const pathElement = svgElement.find('path');
    expect(pathElement.exists()).toBe(true);
    expect(pathElement.attributes('fill')).toBe('#0099AD');
  });
});
