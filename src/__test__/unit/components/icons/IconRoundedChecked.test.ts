import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IconRoundedChecked from '@/components/icons/IconRoundedChecked.vue';

describe('IconRoundedChecked.vue', () => {
  it('should render the SVG correctly', () => {
    const wrapper = mount(IconRoundedChecked);

    const svgElement = wrapper.find('svg');
    expect(svgElement.exists()).toBe(true);

    expect(svgElement.attributes('width')).toBe('16');
    expect(svgElement.attributes('height')).toBe('16');

    const pathElement = svgElement.find('path');
    expect(pathElement.exists()).toBe(true);
    expect(pathElement.attributes('fill')).toBe('white');
  });
});
