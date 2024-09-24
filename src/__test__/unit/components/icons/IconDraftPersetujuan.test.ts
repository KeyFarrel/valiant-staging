import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IconDraftPersetujuan from '@/components/icons/IconDraftPersetujuan.vue';

describe('IconDraftPersetujuan.vue', () => {
  it('should render the SVG correctly', () => {
    const wrapper = mount(IconDraftPersetujuan);

    const svgElement = wrapper.find('svg');
    expect(svgElement.exists()).toBe(true);

    expect(svgElement.attributes('width')).toBe('10');
    expect(svgElement.attributes('height')).toBe('10');

    const pathElement = svgElement.find('path');
    expect(pathElement.exists()).toBe(true);
    expect(pathElement.attributes('fill')).toBe('#4791F2');
  });
});
