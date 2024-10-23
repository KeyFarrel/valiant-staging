import { shallowMount } from '@vue/test-utils';
import Autocomplete from '@/views/Beranda/Autocomplete.vue';
import SearchBox from '@/components/ui/SearchBox.vue';

describe('Autocomplete.vue', () => {
  const mockData = [
    { sentral: 'PLTU PAITON' },
    { sentral: 'PLTU SURALAYA' },
    { sentral: 'PLTU TAMBORA' },
  ];

  it('renders search box and list of filtered results', async () => {
    const wrapper = shallowMount(Autocomplete, {
      props: {
        data: mockData,
      },
    });

    // Cast wrapper.vm to the expected type
    const vm = wrapper.vm as unknown as {
      searchQuery: string;
      searchResults: { sentral: string }[];
      isOpen: boolean;
    };

    // Simulate typing in search box
    const searchBox = wrapper.findComponent(SearchBox);
    vm.searchQuery = 'PAITON';  // Set searchQuery value
    await searchBox.vm.$emit('on-input');
    await wrapper.vm.$nextTick();  // Wait for DOM update

    // Check if the dropdown opens and displays the filtered result
    expect(vm.searchResults).toEqual([{ sentral: 'PLTU PAITON' }]);
    expect(wrapper.html()).toContain('PLTU PAITON');
  });

  it('should emit onKeyEnter when Enter key is pressed', async () => {
    const wrapper = shallowMount(Autocomplete, {
      props: {
        data: mockData,
      },
    });

    const searchBox = wrapper.findComponent(SearchBox);
    await searchBox.vm.$emit('on-key-enter');

    expect(wrapper.emitted('onKeyEnter')).toBeTruthy();
  });

  it('should emit onClick when result item is clicked', async () => {
    const wrapper = shallowMount(Autocomplete, {
      props: {
        data: mockData,
      },
    });

    // Cast wrapper.vm to the expected type
    const vm = wrapper.vm as unknown as {
      searchQuery: string;
      isOpen: boolean;
    };

    vm.isOpen = true;
    vm.searchQuery = 'PLTU';  // Simulate typing
    await wrapper.vm.$nextTick();

    const resultItem = wrapper.find('li');
    await resultItem.trigger('click');

    // Verify searchQuery is updated with selected item
    expect(vm.searchQuery).toBe('PLTU PAITON');
  });

  it('should filter search results based on query', async () => {
    const wrapper = shallowMount(Autocomplete, {
      props: {
        data: mockData,
      },
    });

    // Cast wrapper.vm to the expected type
    const vm = wrapper.vm as unknown as {
      searchQuery: string;
      searchResults: { sentral: string }[];
    };

    const searchBox = wrapper.findComponent(SearchBox);
    vm.searchQuery = 'SURALAYA';  // Simulate typing
    await searchBox.vm.$emit('on-input');
    await wrapper.vm.$nextTick();  // Wait for DOM update

    expect(vm.searchResults).toEqual([{ sentral: 'PLTU SURALAYA' }]);
    expect(wrapper.html()).toContain('PLTU SURALAYA');
  });

  it('should not show results if search query is empty', async () => {
    const wrapper = shallowMount(Autocomplete, {
      props: {
        data: mockData,
      },
    });

    // Cast wrapper.vm to the expected type
    const vm = wrapper.vm as unknown as {
      searchQuery: string;
      searchResults: { sentral: string }[];
    };

    const searchBox = wrapper.findComponent(SearchBox);
    vm.searchQuery = '';  // Set empty search query
    await searchBox.vm.$emit('on-input');
    await wrapper.vm.$nextTick();  // Wait for DOM update

    expect(vm.searchResults).toEqual([]);
    expect(wrapper.find('ul').exists()).toBe(false);
  });
});
