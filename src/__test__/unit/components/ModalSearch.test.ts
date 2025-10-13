import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ModalSearch from '@/components/ModalSearch.vue';
import { notifyError } from '@/services/helper/toast-notification';

// Mock the dependencies
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
}));

// Mock scrollBy method for testing
Object.defineProperty(HTMLUListElement.prototype, 'scrollBy', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  value: vi.fn(() => ({
    bottom: 100,
    top: 50,
    left: 0,
    right: 200,
    width: 200,
    height: 50,
  })),
  writable: true,
});

describe('ModalSearch', () => {
  const mockSource = [
    { sentral: 'PLTU Suralaya' },
    { sentral: 'PLTU Paiton' },
    { sentral: 'PLTG Muara Karang' },
  ];

  const defaultProps = {
    showModal: true,
    source: mockSource,
    modelValue: '', // Add modelValue for searchQuery
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component with search input', () => {
    const wrapper = mount(ModalSearch, {
      props: defaultProps,
    });

    expect(wrapper.find('input[type="search"]').exists()).toBe(true);
    expect(wrapper.find('input').attributes('placeholder')).toBe('Cari...');
  });

  it('should display all source items when search query is empty', async () => {
    const wrapper = mount(ModalSearch, {
      props: defaultProps,
    });

    await nextTick();
    
    const listItems = wrapper.findAll('li');
    expect(listItems).toHaveLength(3);
    expect(listItems[0].text()).toBe('PLTU Suralaya');
    expect(listItems[1].text()).toBe('PLTU Paiton');
    expect(listItems[2].text()).toBe('PLTG Muara Karang');
  });

  it('should emit onClickSentral when a list item is clicked', async () => {
    const wrapper = mount(ModalSearch, {
      props: defaultProps,
    });

    await nextTick();
    
    const listItems = wrapper.findAll('li');
    await listItems[0].trigger('click');

    expect(wrapper.emitted('onClickSentral')).toBeTruthy();
  });

  it('should filter search results based on search query', async () => {
    const wrapper = mount(ModalSearch, {
      props: {
        ...defaultProps,
        modelValue: 'PLTU',
      },
    });

    await nextTick();
    
    const listItems = wrapper.findAll('li');
    expect(listItems).toHaveLength(2);
    expect(listItems[0].text()).toBe('PLTU Suralaya');
    expect(listItems[1].text()).toBe('PLTU Paiton');
  });

  it('should handle keyboard navigation - arrow down', async () => {
    const wrapper = mount(ModalSearch, {
      props: defaultProps,
    });

    await nextTick();
    
    const input = wrapper.find('input');
    await input.trigger('keydown.down');
    
    // Check if selected item changes
    const selectedItem = wrapper.find('.selected-item');
    expect(selectedItem.exists()).toBe(true);
  });

  it('should handle keyboard navigation - arrow up', async () => {
    const wrapper = mount(ModalSearch, {
      props: defaultProps,
    });

    await nextTick();
    
    const input = wrapper.find('input');
    // First go down to select second item, then go up
    await input.trigger('keydown.down');
    await input.trigger('keydown.up');
    
    const selectedItem = wrapper.find('.selected-item');
    expect(selectedItem.exists()).toBe(true);
  });

  it('should handle enter key when search results exist', async () => {
    const wrapper = mount(ModalSearch, {
      props: defaultProps,
    });

    await nextTick();
    
    const input = wrapper.find('input');
    await input.trigger('keyup.enter');
    
    expect(wrapper.emitted('onKeyEnter')).toBeTruthy();
  });

  it('should show error notification when no search results and enter is pressed', async () => {
    const wrapper = mount(ModalSearch, {
      props: {
        ...defaultProps,
        modelValue: 'NonExistentSentral',
      },
    });

    await nextTick();
    
    const input = wrapper.find('input');
    await input.trigger('keyup.enter');
    
    expect(notifyError).toHaveBeenCalledWith(
      'Data tidak ditemukan, silahkan cari sentral yang lain',
      5000
    );
  });

  it('should display EmptyData component when no search results', async () => {
    const wrapper = mount(ModalSearch, {
      props: {
        ...defaultProps,
        modelValue: 'NonExistentSentral',
      },
    });

    await nextTick();
    
    expect(wrapper.findComponent({ name: 'EmptyData' }).exists()).toBe(true);
    expect(wrapper.findAll('li')).toHaveLength(0);
  });

  it('should emit onClickClose when close button is clicked', async () => {
    const wrapper = mount(ModalSearch, {
      props: defaultProps,
    });

    const closeButton = wrapper.find('button');
    await closeButton.trigger('click');
    
    expect(wrapper.emitted('onClickClose')).toBeTruthy();
  });

  it('should focus on input when component is mounted', async () => {
    const wrapper = mount(ModalSearch, {
      props: defaultProps,
      attachTo: document.body, // Required for focus testing
    });

    await nextTick();
    
    const input = wrapper.find('input').element as HTMLInputElement;
    expect(document.activeElement).toBe(input);
    
    wrapper.unmount();
  });

  it('should handle setSelected function with null item', async () => {
    const wrapper = mount(ModalSearch, {
      props: defaultProps,
    });

    await nextTick();
    
    const input = wrapper.find('input');
    // This will trigger setSelected with null due to empty search
    await input.setValue('');
    
    // Component should still work
    expect(wrapper.find('input').element.value).toBe('');
  });
});
