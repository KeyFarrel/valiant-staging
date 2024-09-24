import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InformationMesin from '@/views/Data/Grafik/InformationMesin.vue';

describe('InformationMesin.vue', () => {
  it('should render the SVG correctly', () => {
    const wrapper = mount(InformationMesin);

    const svgElement = wrapper.find('svg');
    expect(svgElement.exists()).toBe(true);

    expect(svgElement.attributes('width')).toBe('18');
    expect(svgElement.attributes('height')).toBe('18');

    const pathElement = svgElement.find('path');
    expect(pathElement.exists()).toBe(true);
    expect(pathElement.attributes('fill')).toBe('#4D5E80');
  });
});
