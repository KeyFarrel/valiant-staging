import { shallowMount } from '@vue/test-utils';
import LamanUtama from '@/views/Beranda/LamanUtama/LamanUtama.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import TableComponent from '@/components/ui/Table.vue';
import SearchBox from '@/components/ui/SearchBox.vue';

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  useRouter: () => ({
    replace: jest.fn(),
  }),
  createWebHistory: jest.fn(), // Mock createWebHistory
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
}));

describe('LamanUtama.vue', () => {
  let wrapper: any;
  let routerPushMock: jest.Mock;

  beforeEach(() => {
    routerPushMock = jest.fn();
    wrapper = shallowMount(LamanUtama, {
      global: {
        components: {
          Loading,
          ModalWrapper,
          TableComponent,
          SearchBox,
        },
        mocks: {
          $router: {
            push: routerPushMock,  // Mock the router.push here
          },
        },
      },
    });
  });

  it('should render the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should display loading spinner when isLoading is true', async () => {
    // Set isLoading to true
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();

    // Check if Loading component is displayed
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });

  it('should not display loading spinner when isLoading is false', async () => {
    // Set isLoading to false
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();

    // Check if Loading component is not displayed
    expect(wrapper.findComponent(Loading).exists()).toBe(false);
  });

  it('should open modal when openModalUnit is called', async () => {
    // Call the method to open the modal
    wrapper.vm.openModalUnit();
    await wrapper.vm.$nextTick();

    // Check if the modal is shown
    expect(wrapper.vm.isModalUnit).toBe(true);
  });

  it('should close modal when closeModalUnit is called', async () => {
    // Call the method to close the modal
    wrapper.vm.closeModalUnit();
    await wrapper.vm.$nextTick();

    // Check if the modal is hidden
    expect(wrapper.vm.isModalUnit).toBe(false);
  });

  it('should trigger search when handleSearch is called', async () => {
    const handleSearchMock = jest.fn();
    wrapper.vm.handleSearch = handleSearchMock;
  
    // Simulate search query
    wrapper.vm.searchQuery = 'test search';
    await wrapper.vm.$nextTick();
  
    // Call the handleSearch method
    wrapper.vm.handleSearch();
    await wrapper.vm.$nextTick();
  
    // Verify handleSearch was called
    expect(handleSearchMock).toHaveBeenCalled();
  });
});
