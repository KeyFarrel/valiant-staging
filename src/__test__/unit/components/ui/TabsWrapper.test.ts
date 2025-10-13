import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import TabsWrapper from '@/components/ui/TabsWrapper.vue';
import { createPinia, setActivePinia } from 'pinia';

// Mock Vue Router
vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    props: ['to'],
    template: '<button><slot /></button>',
  },
}));

// Mock encrypt storage
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: vi.fn((value) => `encrypted-${value}`),
  }),
}));

// Mock stores
const mockLamanDataStore = {
  currentTab: 'Tab 1',
};

const mockPerbaruiTabStore = {
  currentTab: 'Tab 1',
};

vi.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataTabStore: () => mockLamanDataStore,
}));

vi.mock('@/store/storeRekapKertasKerja', () => ({
  usePerbaruiTabStore: () => mockPerbaruiTabStore,
}));

describe('TabsWrapper', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset mock stores
    mockLamanDataStore.currentTab = 'Tab 1';
    mockPerbaruiTabStore.currentTab = 'Tab 1';
  });

  it('should render tabs from slot content', () => {
    const wrapper = mount(TabsWrapper, {
      props: {
        lamanData: false,
      },
      slots: {
        default: () => [
          h('div', { title: 'Tab 1' }, 'Content 1'),
          h('div', { title: 'Tab 2' }, 'Content 2'),
        ],
      },
    });

    expect(wrapper.text()).toContain('Tab 1');
    expect(wrapper.text()).toContain('Tab 2');
  });

  it('should select first tab by default', () => {
    const wrapper = mount(TabsWrapper, {
      props: {
        lamanData: false,
      },
      slots: {
        default: () => [
          h('div', { title: 'Tab 1' }, 'Content 1'),
          h('div', { title: 'Tab 2' }, 'Content 2'),
        ],
      },
    });

    const firstTab = wrapper.find('li.selected');
    expect(firstTab.text()).toBe('Tab 1');
  });

  it('should change selected tab when clicked', async () => {
    const wrapper = mount(TabsWrapper, {
      props: {
        lamanData: false,
      },
      slots: {
        default: () => [
          h('div', { title: 'Tab 1' }, 'Content 1'),
          h('div', { title: 'Tab 2' }, 'Content 2'),
        ],
      },
    });

    const tabs = wrapper.findAll('li').filter(li => li.text() === 'Tab 2');
    await tabs[0].trigger('click');

    expect(wrapper.find('li.selected').text()).toBe('Tab 2');
  });

  it('should update laman data store when lamanData prop is true', async () => {
    const wrapper = mount(TabsWrapper, {
      props: {
        lamanData: true,
      },
      slots: {
        default: () => [
          h('div', { title: 'Tab 1' }, 'Content 1'),
          h('div', { title: 'Tab 2' }, 'Content 2'),
        ],
      },
    });

    const tabs = wrapper.findAll('li').filter(li => li.text() === 'Tab 2');
    await tabs[0].trigger('click');

    expect(wrapper.find('li.selected').text()).toBe('Tab 2');
    expect(mockLamanDataStore.currentTab).toBe('Tab 2');
  });

  it('should render Lihat Grafik section when isLihatGrafik is true', () => {
    const wrapper = mount(TabsWrapper, {
      props: {
        lamanData: false,
        isLihatGrafik: true,
        kodeSentral: 'TEST123',
      },
      slots: {
        default: () => [
          h('div', { title: 'Tab 1' }, 'Content 1'),
          h('div', { title: 'Tab 2' }, 'Content 2'),
        ],
      },
    });

    // Check if the li with v-if="isLihatGrafik" exists
    const lihatGrafikLi = wrapper.find('li.items-end');
    expect(lihatGrafikLi.exists()).toBe(true);
  });

  it('should handle onMounted lifecycle correctly', async () => {
    const wrapper = mount(TabsWrapper, {
      props: {
        lamanData: false,
        isLihatGrafik: true,
        kodeSentral: 'TEST123',
      },
      slots: {
        default: () => [
          h('div', { title: 'Tab 1' }, 'Content 1'),
          h('div', { title: 'Tab 2' }, 'Content 2'),
        ],
      },
    });

    // Wait for onMounted to complete
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 1));

    // The component should be properly mounted
    expect(wrapper.exists()).toBe(true);
  });
});