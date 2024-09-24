import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IconEdit from '@/components/icons/IconEdit.vue';

describe('IconEdit.vue', () => {
  it('should render the SVG correctly', () => {
    const wrapper = mount(IconEdit);

    const svgElement = wrapper.find('svg');
    expect(svgElement.exists()).toBe(true);

    expect(svgElement.attributes('width')).toBe('14');
    expect(svgElement.attributes('height')).toBe('14');

    const pathElement = svgElement.find('path');
    expect(pathElement.exists()).toBe(true);
    expect(pathElement.attributes('fill')).toBe('#0099AD');
  });
});
