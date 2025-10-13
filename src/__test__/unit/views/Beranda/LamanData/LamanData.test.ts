import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LamanData from '@/views/Beranda/LamanData/LamanData.vue';
import TabsWrapper from '@/components/ui/TabsWrapper.vue';
import TabItem from '@/components/ui/TabItem.vue';
import PageFinansial from '@/views/Beranda/LamanData/TabPage/PageFinansial.vue';
import PageTeknis from '@/views/Beranda/LamanData/TabPage/PageTeknis.vue';
import PageCAPEXOPEX from '@/views/Beranda/LamanData/TabPage/PageCAPEXOPEX.vue';

// Mock the child components
vi.mock('@/components/ui/TabsWrapper.vue', () => ({
  default: {
    name: 'TabsWrapper',
    props: ['lamanData', 'isLihatGrafik'],
    template: '<div data-testid="tabs-wrapper"><slot /></div>',
  }
}));

vi.mock('@/components/ui/TabItem.vue', () => ({
  default: {
    name: 'TabItem',
    props: ['title'],
    template: '<div data-testid="tab-item" :data-title="title"><slot /></div>',
  }
}));

vi.mock('@/views/Beranda/LamanData/TabPage/PageFinansial.vue', () => ({
  default: {
    name: 'PageFinansial',
    template: '<div data-testid="page-finansial">PageFinansial Component</div>',
  }
}));

vi.mock('@/views/Beranda/LamanData/TabPage/PageTeknis.vue', () => ({
  default: {
    name: 'PageTeknis',
    template: '<div data-testid="page-teknis">PageTeknis Component</div>',
  }
}));

vi.mock('@/views/Beranda/LamanData/TabPage/PageCAPEXOPEX.vue', () => ({
  default: {
    name: 'PageCAPEXOPEX',
    template: '<div data-testid="page-capexopex">PageCAPEXOPEX Component</div>',
  }
}));

describe('LamanData.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(LamanData);
  });

  it('should render the component successfully', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.bg-white').exists()).toBe(true);
  });

  it('should render TabsWrapper with correct props', () => {
    const tabsWrapper = wrapper.findComponent(TabsWrapper);
    expect(tabsWrapper.exists()).toBe(true);
    expect(tabsWrapper.props('lamanData')).toBe(true);
    expect(tabsWrapper.props('isLihatGrafik')).toBe(false);
  });

  it('should render all three TabItem components with correct titles', () => {
    const tabItems = wrapper.findAllComponents(TabItem);
    expect(tabItems).toHaveLength(3);
    
    expect(tabItems[0].props('title')).toBe('CAPEX - OPEX');
    expect(tabItems[1].props('title')).toBe('Finansial');
    expect(tabItems[2].props('title')).toBe('Teknis');
  });
});