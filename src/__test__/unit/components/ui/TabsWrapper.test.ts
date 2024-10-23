import { mount } from '@vue/test-utils';
import TabsWrapper from '@/components/ui/TabsWrapper.vue';
import { useLamanDataTabStore } from '@/store/storeLamanDataTab';

jest.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataTabStore: jest.fn(() => ({
    currentTab: ''
  }))
}));

jest.mock('@/store/storeRekapKertasKerja', () => ({
  usePerbaruiTabStore: jest.fn(() => ({
    currentTab: ''
  }))
}));

const mockRouterLink = {
  template: '<div><slot></slot></div>',
};

describe('TabsWrapper.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(TabsWrapper, {
      props: {
        isLihatGrafik: true,
        kodeSentral: '12345',
        lamanData: true
      },
      global: {
        components: {
          RouterLink: mockRouterLink
        }
      },
      slots: {
        default: '<div title="Tab 1"></div><div title="Tab 2"></div>'
      }
    });
  });

  it('renders tab titles correctly from slots', () => {
    const tabItems = wrapper.findAll('li');
    expect(tabItems).toHaveLength(3); // 2 slots + 1 "Lihat Grafik"
    expect(tabItems[0].text()).toBe('Tab 1');
    expect(tabItems[1].text()).toBe('Tab 2');
  });

  it('sets the selected tab when clicked', async () => {
    const tabItems = wrapper.findAll('li');
    await tabItems[1].trigger('click');
    const store = useLamanDataTabStore();
    expect(store.currentTab).toBe('');
  });

  it('renders "Lihat Grafik" button with correct link', () => {
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    const routerLink = wrapper.findComponent(mockRouterLink);
    expect(routerLink.props('to')).toBeUndefined();
  });
});
