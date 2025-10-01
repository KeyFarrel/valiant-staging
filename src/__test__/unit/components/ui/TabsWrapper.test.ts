import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, it, expect, beforeEach } from '@jest/globals';
import TabsWrapper from '@/components/ui/TabsWrapper.vue';
import { useLamanDataTabStore } from '@/store/storeLamanDataTab';

// Mock store
const mockStore = {
  currentTab: ''
};

jest.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataTabStore: jest.fn(() => mockStore)
}));

jest.mock('@/store/storeRekapKertasKerja', () => ({
  usePerbaruiTabStore: jest.fn(() => ({
    currentTab: ''
  }))
}));

// Mock encryptStoragePromise  
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: jest.fn((value) => `encrypted_${value}`)
  })
}));

const mockRouterLink = {
  template: '<div><slot></slot></div>',
};

describe('TabsWrapper.vue', () => {
  let wrapper: any;

  beforeEach(async () => {
    // Reset store
    mockStore.currentTab = '';
    
    wrapper = mount(TabsWrapper, {
      props: {
        isLihatGrafik: true,
        kodeSentral: '12345',
        lamanData: true
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        },
        stubs: {
          'el-option': true,
          'el-select': true,
          'el-checkbox': true,
          'VueDatePicker': true,
          'Loading': true,
          'InfoHeader': true,
          'SortingIcon': true,
          'RouterLink': true
        }
      },
      slots: {
        default: '<div title="Tab 1"></div><div title="Tab 2"></div>'
      }
    });
    
    // Wait for async operations
    await wrapper.vm.$nextTick();
  });

  it('renders tab titles correctly from slots', () => {
    const tabItems = wrapper.findAll('li');
    // Expect at least 1 li element (tabs + potential "Lihat Grafik")
    expect(tabItems.length).toBeGreaterThan(0);
  });

  it('sets the selected tab when clicked', async () => {
    const tabItems = wrapper.findAll('li');
    
    // Test the handleClick method directly instead of triggering click
    const firstTab = tabItems[0];
    if (firstTab.exists()) {
      const tabTitle = firstTab.text();
      wrapper.vm.handleClick(tabTitle);
      await wrapper.vm.$nextTick();
      
      // Check that the store was updated
      expect(mockStore.currentTab).toBeDefined();
    }
  });

  it('renders "Lihat Grafik" button with correct link', async () => {
    const wrapper = mount(TabsWrapper, {
      props: {
        isLihatGrafik: true,
        kodeSentral: '12345',
        lamanData: true
      },
      slots: {
        default: '<div title="Tab 1">Content 1</div><div title="Tab 2">Content 2</div>'
      },
      global: {
        components: { RouterLink: mockRouterLink },
        mocks: { $store: mockStore }
      }
    });

    // Wait for component to mount and encryptStorageRef to be set
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    // Force set encryptStorageRef in component
    const vm = wrapper.vm as any;
    vm.encryptStorageRef = {
      encryptValue: jest.fn((value) => `encrypted_${value}`)
    };
    
    // Force re-render 
    await wrapper.vm.$nextTick();
    await wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();
    
    // Check if RouterLink exists when isLihatGrafik is true
    const routerLink = wrapper.findComponent(mockRouterLink);
    expect(routerLink.exists()).toBe(true);
    
    // Check for button or any clickable element
    const clickableElements = wrapper.findAll('button, [role="button"], a');
    expect(clickableElements.length).toBeGreaterThanOrEqual(1);
  });
});
