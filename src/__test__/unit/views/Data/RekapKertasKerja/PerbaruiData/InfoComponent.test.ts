import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InfoComponent from '@/views/Data/RekapKertasKerja/PerbaruiData/InfoComponent.vue';

const mockProps = {
  simulasi: 'simulasi makro',
  proyeksi: 'proyeksi finansial 2024'
};

describe('InfoComponent', () => {
  it('should render the component successfully', () => {
    const wrapper = mount(InfoComponent, {
      props: mockProps
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should display the correct simulasi and proyeksi text', () => {
    const wrapper = mount(InfoComponent, {
      props: mockProps
    });
    
    // Get the second p element which contains the dynamic text
    const textElements = wrapper.findAll('p.text-xs.text-primaryTextColor');
    const dynamicTextElement = textElements[1]; // Second p element
    expect(dynamicTextElement.text()).toContain('simulasi makro');
    expect(dynamicTextElement.text()).toContain('proyeksi finansial 2024');
  });

  it('should display Informasi title with correct icon', () => {
    const wrapper = mount(InfoComponent, {
      props: mockProps
    });
    
    const titleElement = wrapper.find('.text-xs.font-semibold.text-primaryTextColor');
    expect(titleElement.text()).toBe('Informasi');
    
    // Check if SVG icon exists
    const svgIcon = wrapper.find('svg');
    expect(svgIcon.exists()).toBe(true);
  });
});