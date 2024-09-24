import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IconCheckedPersetujuan from '@/components/icons/IconCheckedPersetujuan.vue';

describe('IconCheckedPersetujuan.vue', () => {
  it('should render the SVG correctly', () => {
    const wrapper = mount(IconCheckedPersetujuan);

    const svgElement = wrapper.find('svg');
    expect(svgElement.exists()).toBe(true);

    expect(svgElement.attributes('width')).toBe('10');
    expect(svgElement.attributes('height')).toBe('11');

    const pathElement = svgElement.find('path');
    expect(pathElement.exists()).toBe(true);
    expect(pathElement.attributes('fill')).toBe('#0EA976');
  });
});
