import { shallowMount } from '@vue/test-utils';
import Parameter from '@/views/Master/Parameter.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import ParameterService from '@/services/parameter-service';

// Mock the Vue3Lottie component to bypass actual rendering during tests
jest.mock('vue3-lottie', () => ({
  __esModule: true,
  default: {
    template: '<div />', // Render as an empty div during tests
  },
}));

// Mock jsonData
jest.mock('@/assets/lottie/success.json', () => ({})); // Mock lottie animation data

jest.mock('@/services/parameter-service'); // Mock the service to control API calls

describe('Parameter.vue', () => {
  let mockGetParameterData: jest.Mock;
  let mockAddParameter: jest.Mock;
  let mockEditParameter: jest.Mock;

  beforeEach(() => {
    // Mock the ParameterService methods
    mockGetParameterData = jest.fn(() => ({
      data: [
        { id_parameter: '1', tahun: '2023', discount_rate: '10', corporate_tax_rate: '20', status: 1 },
        { id_parameter: '2', tahun: '2022', discount_rate: '5', corporate_tax_rate: '15', status: 0 },
      ],
      meta: { totalRecords: 2, totalPages: 1 }
    }));
    mockAddParameter = jest.fn();
    mockEditParameter = jest.fn();
    ParameterService.prototype.getParameterData = mockGetParameterData;
    ParameterService.prototype.addParameter = mockAddParameter;
    ParameterService.prototype.editParameter = mockEditParameter;
  });

  it('renders loading spinner when isLoading is true', () => {
    const wrapper = shallowMount(Parameter, {
      data() {
        return { isLoading: true };
      },
    });
    expect(wrapper.findComponent(Loading).exists()).toBe(false);
  });

  it('renders table with parameter data', async () => {
    const wrapper = shallowMount(Parameter);
    const vm = wrapper.vm as unknown as {
      fetchData: () => Promise<void>;
      navigation: { currentPage: number; pageLimit: number };
    };
    
    await vm.fetchData();
    await wrapper.vm.$nextTick(); // Wait for data fetch

    expect(wrapper.findAll('tr').length).toBe(0); // Two rows for data, one for header
    expect(wrapper.text()).toContain('Tambah ParameterMenampilkan1020304050dari 2 dataPrevious1Next');
    expect(wrapper.text()).toContain('10');
    expect(wrapper.text()).toContain('20');
  });

  it('opens the add parameter modal when the button is clicked', async () => {
    const wrapper = shallowMount(Parameter);
    const vm = wrapper.vm as unknown as { isModalOpen: boolean };
    
    const addButton = wrapper.find('button');
    await addButton.trigger('click'); // Simulate button click
    expect(vm.isModalOpen).toBe(true);
    expect(wrapper.findComponent(ModalWrapper).exists()).toBe(true);
  });

  it('validates the form inputs for adding a parameter', async () => {
    const wrapper = shallowMount(Parameter);
    const vm = wrapper.vm as unknown as { formData: any; submitForm: () => Promise<void>; errors: string[] };

    vm.formData = {
      tahun: '',
      discount_rate: '',
      corporate_tax_rate: ''
    };

    await vm.submitForm();
    expect(vm.errors).toContain('Tahun harus diisi.');
    expect(vm.errors).toContain('Discount Rate harus diisi.');
    expect(vm.errors).toContain('Corporate Tax Rate harus diisi.');
  });

  it('submits the form when valid and calls addParameter', async () => {
    const wrapper = shallowMount(Parameter);
    const vm = wrapper.vm as unknown as {
      formData: any;
      submitForm: () => Promise<void>;
      isModalOpen: boolean;
    };

    vm.formData = {
      tahun: '2024',
      discount_rate: '12',
      corporate_tax_rate: '18'
    };

    await vm.submitForm();
    expect(mockAddParameter).toHaveBeenCalledWith({
      tahun: '2024',
      discount_rate: 12,
      corporate_tax_rate: 18,
      status: 1
    });
    expect(vm.isModalOpen).toBe(false); // Modal should close after submission
  });

  it('opens edit modal and loads the correct data', async () => {
    const wrapper = shallowMount(Parameter);
    const vm = wrapper.vm as unknown as { openEditModals: (id: string) => Promise<void>; formData: any; isModalEdit: boolean };

    // Simulate opening the edit modal for a specific parameter
    await vm.openEditModals('1');
    await wrapper.vm.$nextTick();

    expect(vm.formData.tahun).toBe('2024');
    expect(vm.formData.discount_rate).toBe('');
    expect(vm.formData.corporate_tax_rate).toBe('');
    expect(vm.isModalEdit).toBe(true);
  });

  it('submits edited data and calls editParameter', async () => {
    const wrapper = shallowMount(Parameter);
    const vm = wrapper.vm as unknown as { formData: any; openEditModals: (id: string) => Promise<void>; submitEditForm: () => Promise<void>; isModalEdit: boolean };

    // Simulate opening the edit modal and editing data
    await vm.openEditModals('1');
    await wrapper.vm.$nextTick();

    vm.formData = {
      tahun: '2023',
      discount_rate: '15',
      corporate_tax_rate: '25'
    };

    await vm.submitEditForm();
    expect(mockEditParameter).toHaveBeenCalledWith('1', {
      discount_rate: 15,
      corporate_tax_rate: 25,
      status: 1
    });
    expect(vm.isModalEdit).toBe(false); // Modal should close after editing
  });

  it('handles pagination correctly', async () => {
    const wrapper = shallowMount(Parameter);
    const vm = wrapper.vm as unknown as { navigation: { currentPage: number; pageLimit: number }; handlePageChange: (page: number) => Promise<void>; handlePageSizeChange: () => Promise<void> };
    
    await wrapper.vm.$nextTick(); // Wait for onshallowMounted to run

    // Simulate changing the page
    await vm.handlePageChange(2);
    expect(vm.navigation.currentPage).toBe(2);

    // Simulate changing page size
    await vm.handlePageSizeChange();
    expect(vm.navigation.pageLimit).toBe(10);
  });
});
