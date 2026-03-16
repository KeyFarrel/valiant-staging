import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SearchBoxSuggestion from '@/components/ui/SearchBoxSuggestion.vue';

const defaultSource = [
  { sentral: 'Sentral Alpha' },
  { sentral: 'Sentral Beta' },
  { sentral: 'Sentral Gamma' },
];

describe('SearchBoxSuggestion.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render component successfully', () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('input[type="search"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('should not show suggestion list initially', () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    expect(wrapper.find('ul').exists()).toBe(false);
  });

  it('should show suggestion list when input is focused', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.find('ul').exists()).toBe(true);
  });

  it('should hide suggestion list when submit button is clicked', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.find('ul').exists()).toBe(true);

    await wrapper.find('button[type="submit"]').trigger('click');
    expect(wrapper.find('ul').exists()).toBe(false);
  });

  it('should show all source items when searchQuery is empty', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.findAll('li').length).toBe(3);
  });

  it('should filter items matching searchQuery by sentral', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: 'Alpha' }
    });
    await wrapper.find('input').trigger('focus');
    const listItems = wrapper.findAll('li');
    expect(listItems.length).toBe(1);
    expect(listItems[0].text()).toContain('Sentral Alpha');
  });

  it('should filter case-insensitively by sentral', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: 'alpha' }
    });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.findAll('li').length).toBe(1);
  });

  it('should filter by nama_sentral when sentral is falsy', async () => {
    const mixedSource: any = [
      { sentral: null, nama_sentral: 'Pembangkit XYZ' },
      { sentral: 'Sentral Regular' },
    ];
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: mixedSource, modelValue: 'XYZ' }
    });
    await wrapper.find('input').trigger('focus');
    const items = wrapper.findAll('li');
    expect(items.length).toBe(1);
  });

  it('should initialize selectedSentral from first source item', () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    const vm = wrapper.vm as any;
    expect(vm.selectedSentral).toBe('Sentral Alpha');
  });

  it('should set selectedSentral via setSelected method', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');
    const vm = wrapper.vm as any;
    vm.setSelected('Sentral Beta', 1);
    expect(vm.selectedSentral).toBe('Sentral Beta');
  });

  it('should set selectedSentral using scroll fallback when DOM refs not fully available', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    const vm = wrapper.vm as any;
    // Without opening suggestion, listContainer may be null → else branch hits
    vm.setSelected('Sentral Gamma', 2);
    expect(vm.selectedSentral).toBe('Sentral Gamma');
  });

  it('should use offset scroll path when list/input/selected rects are available', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' },
      attachTo: document.body
    });

    await wrapper.find('input').trigger('focus');

    const vm = wrapper.vm as any;
    const listEl = wrapper.find('ul').element as any;
    const inputEl = wrapper.find('input').element as any;
    const selectedEl = wrapper.find('.selected-item').element as any;

    listEl.scrollBy = vi.fn();
    vi.spyOn(listEl, 'getBoundingClientRect').mockReturnValue({ bottom: 100 } as DOMRect);
    vi.spyOn(inputEl, 'getBoundingClientRect').mockReturnValue({ height: 20 } as DOMRect);
    vi.spyOn(selectedEl, 'getBoundingClientRect').mockReturnValue({ bottom: 140 } as DOMRect);

    vm.setSelected('Sentral Alpha', 0);

    expect(listEl.scrollBy).toHaveBeenCalledWith(0, 60);
  });

  it('should navigate to next item with selectNextItem', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');
    const vm = wrapper.vm as any;

    expect(vm.selectedSentral).toBe('Sentral Alpha');
    vm.selectNextItem();
    expect(vm.selectedSentral).toBe('Sentral Beta');
    vm.selectNextItem();
    expect(vm.selectedSentral).toBe('Sentral Gamma');
    // At last item — should not advance
    vm.selectNextItem();
    expect(vm.selectedSentral).toBe('Sentral Gamma');
  });

  it('should navigate to previous item with selectPreviousItem', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');
    const vm = wrapper.vm as any;

    vm.selectNextItem(); // Alpha → Beta
    expect(vm.selectedSentral).toBe('Sentral Beta');

    vm.selectPreviousItem(); // Beta → Alpha
    expect(vm.selectedSentral).toBe('Sentral Alpha');

    // At first item — should not go below
    vm.selectPreviousItem();
    expect(vm.selectedSentral).toBe('Sentral Alpha');
  });

  it('should navigate down via ArrowDown keydown event', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' });
    const vm = wrapper.vm as any;
    expect(vm.selectedSentral).toBe('Sentral Beta');
  });

  it('should navigate up via ArrowUp keydown event', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');
    const vm = wrapper.vm as any;
    vm.selectNextItem(); // Move to Beta
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' });
    expect(vm.selectedSentral).toBe('Sentral Alpha');
  });

  it('should emit onKeyEnter and hide suggestion on Enter keyup', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: 'Sentral Alpha' }
    });
    await wrapper.find('input').trigger('focus');
    await wrapper.find('input').trigger('keyup', { key: 'Enter' });
    expect(wrapper.emitted('onKeyEnter')).toBeTruthy();
    expect(wrapper.find('ul').exists()).toBe(false);
  });

  it('should emit onClickSentral and hide suggestion when list item is clicked', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.find('ul').exists()).toBe(true);

    const firstItem = wrapper.find('li');
    await firstItem.trigger('click');

    expect(wrapper.emitted('onClickSentral')).toBeTruthy();
    expect(wrapper.find('ul').exists()).toBe(false);
  });

  it('should close suggestion when clicking outside the container', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' },
      attachTo: document.body
    });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.find('ul').exists()).toBe(true);

    // Click outside the component
    const outsideEl = document.createElement('div');
    document.body.appendChild(outsideEl);
    outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushPromises();

    expect(wrapper.find('ul').exists()).toBe(false);
    document.body.removeChild(outsideEl);
  });

  it('should NOT close suggestion when clicking inside the container', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' },
      attachTo: document.body
    });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.find('ul').exists()).toBe(true);

    // Click inside the component (the input itself)
    wrapper.find('input').element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flushPromises();

    // Suggestion should still be visible
    expect(wrapper.find('ul').exists()).toBe(true);
  });

  it('should add event listener on mount and remove on unmount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const w = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });

    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function));

    w.unmount();
    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('should update modelValue when item is clicked and emit update:modelValue', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });
    await wrapper.find('input').trigger('focus');

    const secondItem = wrapper.findAll('li')[1];
    await secondItem.trigger('click');

    // Should emit update:modelValue with the clicked item's sentral
    const emits = wrapper.emitted('update:modelValue');
    expect(emits).toBeTruthy();
    if (emits) {
      expect(emits[0][0]).toBe('Sentral Beta');
    }
  });

  it('should handle source with single item without crashing', () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: [{ sentral: 'Only Sentral' }], modelValue: '' }
    });
    const vm = wrapper.vm as any;
    expect(vm.selectedSentral).toBe('Only Sentral');
    // Navigate from single item — no-op
    vm.selectNextItem();
    expect(vm.selectedSentral).toBe('Only Sentral');
    vm.selectPreviousItem();
    expect(vm.selectedSentral).toBe('Only Sentral');
  });

  it('should show filtered suggestions when modelValue changes', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: 'Beta' }
    });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.findAll('li').length).toBe(1);
    expect(wrapper.find('li').text()).toContain('Beta');
  });

  it('should run input handler and keep first matching item selected', async () => {
    wrapper = mount(SearchBoxSuggestion, {
      props: { source: defaultSource, modelValue: '' }
    });

    const input = wrapper.find('input');
    await input.setValue('Sentral');

    const vm = wrapper.vm as any;
    expect(vm.selectedSentral).toBe('Sentral Alpha');
  });
});
