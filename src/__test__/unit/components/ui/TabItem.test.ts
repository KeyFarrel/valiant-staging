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
    // Create a new wrapper with different selectedTitle
    const newWrapper = shallowMount(TabItem, {
      props: {
        title: 'Tab 1'
      },
      global: {
        provide: {
          selectedTitle: 'Tab 2' // Different title
        }
      },
      slots: {
        default: '<p>Tab 1 Content</p>'
      }
    });

    // Check if the div is hidden (v-show=false)
    const tabDiv = newWrapper.find('div');
    expect(tabDiv.isVisible()).toBe(false);
  });
});