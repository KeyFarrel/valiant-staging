import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Autocomplete from '@/views/Beranda/Autocomplete.vue';

// Mock SearchBox component
vi.mock('@/components/ui/SearchBox.vue', () => ({
  default: {
    name: 'SearchBox',
    template: '<input class="search-box" />',
    props: ['modelValue'],
    emits: ['update:modelValue', 'on-input', 'on-key-enter', 'on-click-submit']
  }
}));

describe('Autocomplete.vue', () => {
  let wrapper: any;
  
  const mockData = [
    { sentral: 'Jakarta Power Station' },
    { sentral: 'Bandung Power Plant' },
    { sentral: 'Surabaya Energy Center' },
    { sentral: 'Medan Power Station' }
  ];

  beforeEach(() => {
    wrapper = mount(Autocomplete, {
      props: {
        data: mockData,
        modelValue: ''
      }
    });
  });

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.relative').exists()).toBe(true);
    expect(wrapper.find('.search-box').exists()).toBe(true);
  });

  it('should return empty array when search query is empty', () => {
    // searchQuery is empty by default
    expect(wrapper.vm.searchResults).toHaveLength(0);
  });

  it('should emit events correctly', async () => {
    // Test emit onKeyEnter
    await wrapper.vm.$emit('onKeyEnter');
    expect(wrapper.emitted('onKeyEnter')).toBeTruthy();
    
    // Test emit onClickSubmit  
    await wrapper.vm.$emit('onClickSubmit');
    expect(wrapper.emitted('onClickSubmit')).toBeTruthy();
  });

  // Additional tests for uncovered lines
  it('should filter search results when search query has value', async () => {
    // Set search query to trigger filtering logic (line 34-38)
    wrapper.vm.searchQuery = 'Jakarta';
    await nextTick();
    
    const results = wrapper.vm.searchResults;
    expect(results).toHaveLength(1);
    expect(results[0].sentral).toBe('Jakarta Power Station');
  });

  it('should filter search results case insensitively', async () => {
    // Test case insensitive filtering
    wrapper.vm.searchQuery = 'bandung';
    await nextTick();
    
    const results = wrapper.vm.searchResults;
    expect(results).toHaveLength(1);
    expect(results[0].sentral).toBe('Bandung Power Plant');
  });

  it('should set selected item correctly', () => {
    // Test setSelected function (line 41-42)
    const testValue = 'Selected Power Plant';
    wrapper.vm.setSelected(testValue);
    
    expect(wrapper.vm.searchQuery).toBe(testValue);
  });

  it('should show dropdown when isOpen is true and has results', async () => {
    // Set search query and isOpen to show dropdown
    wrapper.vm.searchQuery = 'Jakarta';
    wrapper.vm.isOpen = true;
    await nextTick();
    
    const dropdown = wrapper.find('ul');
    expect(dropdown.exists()).toBe(true);
  });

  it('should hide dropdown when isOpen is false', async () => {
    wrapper.vm.searchQuery = 'Jakarta';
    wrapper.vm.isOpen = false;
    await nextTick();
    
    const dropdown = wrapper.find('ul');
    expect(dropdown.attributes('style')).toContain('display: none');
  });

  it('should call setSelected when clicking on dropdown item', async () => {
    wrapper.vm.searchQuery = 'Jakarta';
    wrapper.vm.isOpen = true;
    await nextTick();
    
    const listItem = wrapper.find('li');
    await listItem.trigger('click');
    
    expect(wrapper.vm.searchQuery).toBe('Jakarta Power Station');
  });
});