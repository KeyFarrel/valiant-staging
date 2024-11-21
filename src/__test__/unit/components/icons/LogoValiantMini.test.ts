import { shallowMount } from '@vue/test-utils';
import LogoValiantMini from '@/components/icons/LogoValiantMini.vue';

describe('LogoValiantMini.vue', () => {
  it('renders svg with correct attributes', () => {
    const wrapper = shallowMount(LogoValiantMini);
    const svg = wrapper.find('svg');
    expect(svg.attributes('width')).toBe('36');
    expect(svg.attributes('height')).toBe('40');
    expect(svg.attributes('viewBox')).toBe('0 0 36 38');
    expect(svg.attributes('fill')).toBe('none');
    expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg');
    expect(svg.attributes('xmlns:xlink')).toBe('http://www.w3.org/1999/xlink');
  });

  it('renders rect with correct attributes', () => {
    const wrapper = shallowMount(LogoValiantMini);
    const rect = wrapper.find('rect');
    expect(rect.attributes('y')).toBe('0.538086');
    expect(rect.attributes('width')).toBe('36');
    expect(rect.attributes('height')).toBe('36.9231');
    expect(rect.attributes('fill')).toBe('url(#pattern0)');
  });

  it('renders pattern with correct attributes', () => {
    const wrapper = shallowMount(LogoValiantMini);
    const pattern = wrapper.find('pattern');
    expect(pattern.attributes('id')).toBe('pattern0');
    expect(pattern.attributes('patternContentUnits')).toBe('objectBoundingBox');
    expect(pattern.attributes('width')).toBe('1');
    expect(pattern.attributes('height')).toBe('1');
  });
});