import { shallowMount } from '@vue/test-utils';
import TabItem from '@/components/ui/TabItem.vue';

describe('TabItem.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TabItem, {
      props: {
        title: 'Tab 1'
      },
      global: {
        provide: {
          selectedTitle: 'Tab 1'
        }
      },
      slots: {
        default: '<p>Tab 1 Content</p>'
      }
    });
  });

  it('renders the slot content when title matches selectedTitle', () => {
    // Check if the slot content is rendered
    expect(wrapper.find('p').text()).toBe('Tab 1 Content');
  });

  it('does not render the slot content when title does not match selectedTitle', async () => {
    // Update the provide value
    await wrapper.setProps({ title: 'Tab 2' });
    await wrapper.setGlobal({
      provide: {
        selectedTitle: 'Tab 2'
      }
    });

    // Check if the slot content is not rendered
    expect(wrapper.find('p').exists()).toBe(false);
  });
});