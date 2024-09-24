import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IconDraft from '@/components/icons/LogActivity/IconDraft.vue';

describe('IconDraft.vue', () => {
  it('should render the SVG correctly', () => {
    const wrapper = mount(IconDraft);

    const svgElement = wrapper.find('svg');
    expect(svgElement.exists()).toBe(true);

    expect(svgElement.attributes('width')).toBe('24');
    expect(svgElement.attributes('height')).toBe('24');

    const pathElement = svgElement.find('path');
    expect(pathElement.exists()).toBe(true);
    expect(pathElement.attributes('stroke')).toBe('#0A448F');
  });
});
