import { shallowMount, mount } from '@vue/test-utils';
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
        modelValue: '',
      },
    });

    // Cast wrapper.vm to the expected type
    const vm = wrapper.vm as unknown as {
      searchQuery: string;
      searchResults: { sentral: string }[];
      isOpen: boolean;
    };

    // Update the modelValue prop to simulate typing
    await wrapper.setProps({ modelValue: 'PAITON' });
    vm.isOpen = true;
    await wrapper.vm.$nextTick();  // Wait for DOM update

    // Check if the dropdown opens and displays the filtered result
    expect(vm.searchResults).toEqual([{ sentral: 'PLTU PAITON' }]);
    expect(wrapper.html()).toContain('PLTU PAITON');
  });

  it('should emit onKeyEnter when Enter key is pressed', async () => {
    const wrapper = shallowMount(Autocomplete, {
      props: {
        data: mockData,
        modelValue: '',
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
        modelValue: 'PLTU',
      },
    });

    // Cast wrapper.vm to the expected type
    const vm = wrapper.vm as unknown as {
      searchQuery: string;
      isOpen: boolean;
      setSelected: (item: string) => void;
    };

    vm.isOpen = true;
    await wrapper.vm.$nextTick();

    // Directly call the setSelected method to simulate click
    vm.setSelected('PLTU PAITON');

    // Verify modelValue update is emitted
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['PLTU PAITON']);
  });

  it('should filter search results based on query', async () => {
    const wrapper = shallowMount(Autocomplete, {
      props: {
        data: mockData,
        modelValue: '',
      },
    });

    // Cast wrapper.vm to the expected type
    const vm = wrapper.vm as unknown as {
      searchQuery: string;
      searchResults: { sentral: string }[];
      isOpen: boolean;
    };

    // Update the modelValue prop to simulate typing
    await wrapper.setProps({ modelValue: 'SURALAYA' });
    vm.isOpen = true;
    await wrapper.vm.$nextTick();  // Wait for DOM update

    expect(vm.searchResults).toEqual([{ sentral: 'PLTU SURALAYA' }]);
    expect(wrapper.html()).toContain('PLTU SURALAYA');
  });

  it('should not show results if search query is empty', async () => {
    const wrapper = shallowMount(Autocomplete, {
      props: {
        data: mockData,
        modelValue: '',
      },
    });

    // Cast wrapper.vm to the expected type
    const vm = wrapper.vm as unknown as {
      searchQuery: string;
      searchResults: { sentral: string }[];
      isOpen: boolean;
    };

    await wrapper.vm.$nextTick();  // Wait for DOM update

    expect(vm.searchResults).toEqual([]);
    // Check if ul is hidden due to v-show condition (searchResults.length && isOpen)
    const ul = wrapper.find('ul');
    expect(ul.attributes('style')).toContain('display: none');
  });
});
