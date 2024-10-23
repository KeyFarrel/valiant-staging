import { shallowMount } from '@vue/test-utils';
import InfoComponent from '@/views/Data/RekapKertasKerja/PerbaruiData/InfoComponent.vue';

describe('InfoComponent.vue Unit Tests', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(InfoComponent, {
      props: {
        simulasi: 'Simulasi Test',
        proyeksi: 'Proyeksi Test',
      },
    });
  });

  it('renders the information title correctly', () => {
    const title = wrapper.find('p.text-xs.font-semibold');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Informasi');
  });

  it('renders the correct simulasi and proyeksi values', () => {
    const infoText = wrapper.find('p.text-xs.text-primaryTextColor');
    expect(infoText.exists()).toBe(true);
    expect(infoText.text()).toContain('Informasi');
  });

  it('contains the correct icon SVG', () => {
    const svgIcon = wrapper.find('svg');
    expect(svgIcon.exists()).toBe(true);
    expect(svgIcon.attributes('width')).toBe('16');
    expect(svgIcon.attributes('height')).toBe('16');
  });

  it('applies the correct background and border styles', () => {
    const container = wrapper.find('div.w-full');
    expect(container.classes()).toContain('bg-infoComponentBgColor');
    expect(container.classes()).toContain('border-infoComponentBorderColor');
  });

  it('displays the correct props data', () => {
    expect(wrapper.props().simulasi).toBe('Simulasi Test');
    expect(wrapper.props().proyeksi).toBe('Proyeksi Test');
  });
});
