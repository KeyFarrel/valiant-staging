import { shallowMount } from '@vue/test-utils';
import RangeIcon from '@/views/Beranda/LamanData/RangeIcon.vue';

describe('RangeIcon.vue', () => {
  it('renders the SVG with correct attributes', () => {
    const wrapper = shallowMount(RangeIcon);

    // Check if the SVG is rendered
    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);

    // Check if the SVG has the correct attributes
    expect(svg.attributes('width')).toBe('16');
    expect(svg.attributes('height')).toBe('12');
    expect(svg.attributes('viewBox')).toBe('0 0 16 12');
    expect(svg.attributes('fill')).toBe('none');
    expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg');
  });

  it('renders the first path with correct attributes', () => {
    const wrapper = shallowMount(RangeIcon);

    // Check if the first path is rendered
    const path1 = wrapper.findAll('path').at(0);
    expect(path1.exists()).toBe(true);

    // Check if the first path has the correct attributes
    expect(path1.attributes('fill-rule')).toBe('evenodd');
    expect(path1.attributes('clip-rule')).toBe('evenodd');
    expect(path1.attributes('d')).toBe('M10.4252 0.143555C10.7073 0.143555 10.9359 0.364186 10.9359 0.636348L10.9359 8.31691L13.1282 6.2014C13.3276 6.00896 13.651 6.00896 13.8504 6.2014C14.0499 6.39385 14.0499 6.70587 13.8504 6.89832L10.7863 9.85507C10.6906 9.94749 10.5607 9.99941 10.4252 9.99941C10.2898 9.99941 10.1599 9.94749 10.0641 9.85507L7.00001 6.89832C6.80057 6.70587 6.80057 6.39385 7.00001 6.2014C7.19944 6.00895 7.52279 6.00895 7.72223 6.2014L9.91454 8.31691L9.91454 0.636348C9.91454 0.364186 10.1432 0.143555 10.4252 0.143555Z');
    expect(path1.attributes('fill')).toBe('#20899F');
    expect(path1.attributes('fill-opacity')).toBe('0.5');
  });

  it('renders the second path with correct attributes', () => {
    const wrapper = shallowMount(RangeIcon);

    // Check if the second path is rendered
    const path2 = wrapper.findAll('path').at(1);
    expect(path2.exists()).toBe(true);

    // Check if the second path has the correct attributes
    expect(path2.attributes('d')).toBe('M3.21369 0.144336C3.41312 -0.0481119 3.73647 -0.0481119 3.9359 0.144336L7.00001 3.10109C7.19945 3.29354 7.19945 3.60556 7.00001 3.79801C6.80058 3.99045 6.47723 3.99045 6.27779 3.79801L4.08548 1.6825V9.36306C4.08548 9.63522 3.85684 9.85585 3.57479 9.85585C3.29275 9.85585 3.06411 9.63522 3.06411 9.36306V1.6825L0.871794 3.79801C0.672359 3.99045 0.349011 3.99045 0.149576 3.79801C-0.0498587 3.60556 -0.0498587 3.29354 0.149576 3.10109L3.21369 0.144336Z');
    expect(path2.attributes('fill')).toBe('#20899F');
    expect(path2.attributes('fill-opacity')).toBe('0.5');
  });
});