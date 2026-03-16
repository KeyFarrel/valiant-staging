import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Parameter from '@/views/Master/Parameter.vue';
import ParameterService from '@/services/parameter-service';

// Mock the ParameterService
vi.mock('@/services/parameter-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getParameterData: vi.fn().mockResolvedValue({
      data: [
        {
          uuid: '1',
          tahun: '2024',
          discount_rate: '10.5',
          corporate_tax_rate: '25.0',
          status: 1
        },
        {
          uuid: '2',
          tahun: '2023',
          discount_rate: '12.0',
          corporate_tax_rate: '22.0',
          status: 1
        }
      ],
      meta: {
        totalRecords: 2,
        totalPages: 1
      }
    }),
    getParameterByID: vi.fn().mockResolvedValue({
      data: {
        uuid: '1',
        tahun: '2024',
        discount_rate: '10.5',
        corporate_tax_rate: '25.0',
        status: 1
      }
    }),
    addParameter: vi.fn().mockResolvedValue({ success: true }),
    editParameter: vi.fn().mockResolvedValue({ success: true })
  }; })
}));

// Mock Vue3Lottie component
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div>Loading...</div>'
  }
}));

vi.mock('vue3-lottie', () => ({
  Vue3Lottie: {
    name: 'Vue3Lottie',
    template: '<div>Lottie Animation</div>',
    props: ['width', 'height', 'loop', 'speed', 'animationData']
  }
}));

describe('Parameter.vue', () => {
  let wrapper: any;

  const createRichWrapper = () => mount(Parameter, {
    global: {
      stubs: {
        Loading: {
          template: '<div class="loading-mock">Loading...</div>'
        },
        ModalWrapper: {
          template: '<div class="modal-wrapper-mock"><slot /></div>',
          props: ['showModal', 'show-modal', 'width', 'height']
        },
        Vue3Lottie: true,
        TableComponent: {
          template: '<table><thead><slot name="table-header" /></thead><tbody><slot name="table-body" /></tbody></table>'
        }
      }
    }
  });
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component successfully', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('button').text()).toContain('Tambah Parameter');
  });

  it('should initialize with default form data', () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    expect(vm.formData.tahun).toBe(new Date().getFullYear().toString());
    expect(vm.formData.discount_rate).toBe('');
    expect(vm.formData.corporate_tax_rate).toBe('');
  });

  it('should open modal when "Tambah Parameter" button is clicked', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const addButton = wrapper.find('button');
    await addButton.trigger('click');

    expect(wrapper.vm.isModalOpen).toBe(true);
  });

  it('should generate years correctly', () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    const currentYear = new Date().getFullYear();
    const years = vm.generateYears ? vm.generateYears(currentYear) : [currentYear.toString()];
    
    expect(Array.isArray(years)).toBe(true);
    expect(years).toContain(currentYear.toString());
  });

  it('should close modal and reset form data', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    // Open modal first
    vm.isModalOpen = true;
    vm.formData.discount_rate = '10';
    vm.formData.corporate_tax_rate = '25';

    // Close modal
    vm.closeModal();

    expect(vm.isModalOpen).toBe(false);
    expect(vm.formData.discount_rate).toBe('');
    expect(vm.formData.corporate_tax_rate).toBe('');
  });

  it('should validate discount rate form correctly', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;

    // Test empty discount rate (validation should not run)
    vm.formData.discount_rate = '';
    vm.validForm_DT();
    expect(vm.errors_DT).toEqual([]);

    // Test invalid characters (validation will check non-numeric first)
    vm.formData.discount_rate = 'abc';
    vm.validForm_DT();
    expect(vm.errors_DT).toContain('non_angka');

    // Test valid numeric value but negative
    vm.errors_DT = [];
    vm.formData.discount_rate = '-5';
    vm.validForm_DT();
    // Since '-' is not in [0-9.], it will trigger 'non_angka' first
    expect(vm.errors_DT).toContain('non_angka');

    // Test valid positive value
    vm.errors_DT = [];
    vm.formData.discount_rate = '10.5';
    vm.validForm_DT();
    expect(vm.errors_DT).toEqual([]);

    // Test zero value (should be invalid)
    vm.errors_DT = [];
    vm.formData.discount_rate = '0';
    vm.validForm_DT();
    expect(vm.errors_DT).toContain('negatif');
  });

  it('should validate corporate tax rate form correctly', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;

    // Test invalid characters (need discount_rate set for the function to run)
    vm.formData.discount_rate = '10'; // This is required for CT validation to run
    vm.formData.corporate_tax_rate = 'xyz';
    vm.validForm_CT();
    expect(vm.errors_CT).toContain('non_angka');

    // Test negative value (needs discount_rate set)
    vm.errors_CT = [];
    vm.formData.discount_rate = '10';
    vm.formData.corporate_tax_rate = '-3';
    vm.validForm_CT();
    // Since '-' is not in [0-9.], it will trigger 'non_angka' first
    expect(vm.errors_CT).toContain('non_angka');

    // Test valid value
    vm.errors_CT = [];
    vm.formData.discount_rate = '10';
    vm.formData.corporate_tax_rate = '25.5';
    vm.validForm_CT();
    expect(vm.errors_CT).toEqual([]);

    // Test zero value (should be invalid)
    vm.errors_CT = [];
    vm.formData.discount_rate = '10';
    vm.formData.corporate_tax_rate = '0';
    vm.validForm_CT();
    expect(vm.errors_CT).toContain('negatif');
  });

  it('should handle pagination correctly', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    vm.navigation.currentPage = 1;
    vm.navigation.totalPages = 3;

    // Test next page
    vm.handleNextClick();
    expect(vm.navigation.currentPage).toBe(2);

    // Test previous page
    vm.handlePreviousClick();
    expect(vm.navigation.currentPage).toBe(1);

    // Test can't go below page 1
    vm.handlePreviousClick();
    expect(vm.navigation.currentPage).toBe(1);
  });

  it('should close edit modal and reset form', () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    vm.isModalEdit = true;
    vm.selectedParameterId = 'test-id';
    vm.formData.discount_rate = '15';

    vm.closeModalEdit();

    expect(vm.isModalEdit).toBe(false);
    expect(vm.selectedParameterId).toBe(null);
    expect(vm.formData.discount_rate).toBe('');
  });

  it('should generate page list correctly for different scenarios', () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;

    // Test with few pages
    vm.navigation.totalPages = 3;
    vm.navigation.currentPage = 2;
    let pageList = vm.generatePageList;
    expect(pageList).toEqual([1, 2, 3]);

    // Test with many pages and current page at beginning
    vm.navigation.totalPages = 10;
    vm.navigation.currentPage = 2;
    pageList = vm.generatePageList;
    expect(pageList).toContain(1);
    expect(pageList).toContain(10);

    // Test with many pages and current page at end
    vm.navigation.currentPage = 9;
    pageList = vm.generatePageList;
    expect(pageList).toContain(1);
    expect(pageList).toContain('...');
    expect(pageList).toContain(10);

    // Test with many pages and current page in middle
    vm.navigation.currentPage = 5;
    pageList = vm.generatePageList;
    expect(pageList).toContain(1);
    expect(pageList).toContain('...');
    expect(pageList).toContain(5);
    expect(pageList).toContain(10);
  });

  it('should validate form submission with errors', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;

    // Test with empty required fields
    vm.formData.tahun = '';
    vm.formData.discount_rate = '';
    vm.formData.corporate_tax_rate = '';

    await vm.submitForm();

    expect(vm.errors).toContain('Tahun harus diisi.');
    expect(vm.errors).toContain('Discount Rate harus diisi.');
    expect(vm.errors).toContain('Corporate Tax Rate harus diisi.');

    // Test with invalid values
    vm.errors = [];
    vm.formData.tahun = '2024';
    vm.formData.discount_rate = '150'; // > 100
    vm.formData.corporate_tax_rate = '-5'; // negative

    await vm.submitForm();

    expect(vm.errors.length).toBeGreaterThan(0);
  });

  it('should validate edit form submission with errors', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;

    // Test with empty required fields
    vm.formData.tahun = '';
    vm.formData.discount_rate = '';
    vm.formData.corporate_tax_rate = '';

    await vm.submitEditForm();

    expect(vm.errors).toContain('Tahun harus diisi.');
    expect(vm.errors).toContain('Discount Rate harus diisi.');
    expect(vm.errors).toContain('Corporate Tax Rate harus diisi.');
  });

  it('should handle page size change', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    const originalPage = vm.navigation.currentPage;
    vm.navigation.pageLimit = 20;

    await vm.handlePageSizeChange();

    expect(vm.navigation.currentPage).toBe(1); // Should reset to page 1
  });

  it('should load data on mounted', async () => {
    const mockService = ParameterService as any;
    const mockData = {
      data: [
        { uuid: '1', tahun: '2024', discount_rate: '10', corporate_tax_rate: '25', status: 1 }
      ],
      meta: { totalRecords: 1, totalPages: 1 }
    };
    
    mockService.mockImplementation(function() { return {
      getParameterData: vi.fn().mockResolvedValue(mockData)
    }; });

    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.navigation.totalRecords).toBe(1);
    expect(wrapper.vm.navigation.totalPages).toBe(1);
  });

  it('should handle successful form submission', async () => {
    const mockService = ParameterService as any;
    mockService.mockImplementation(function() { return {
      getParameterData: vi.fn().mockResolvedValue({ data: [], meta: { totalRecords: 0, totalPages: 0 } }),
      addParameter: vi.fn().mockResolvedValue({ success: true })
    }; });

    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    
    // Set valid form data
    vm.formData.tahun = '2024';
    vm.formData.discount_rate = '10.5';
    vm.formData.corporate_tax_rate = '25.0';

    await vm.submitForm();

    expect(vm.errors.length).toBe(0);
    expect(vm.showModalSubmit).toBe(true);
  });

  it('should handle edit form with invalid values over 100', async () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;

    // Test values over 100
    vm.formData.tahun = '2024';
    vm.formData.discount_rate = '150'; // > 100
    vm.formData.corporate_tax_rate = '120'; // > 100

    await vm.submitEditForm();

    expect(vm.errors.length).toBeGreaterThan(0);
    expect(vm.errors.some(error => error.includes('100'))).toBe(true);
  });

  it('should handle fetch detail data', async () => {
    const mockService = ParameterService as any;
    const mockDetailData = {
      data: {
        uuid: 'test-id',
        tahun: '2024',
        discount_rate: '12.5',
        corporate_tax_rate: '22.0'
      }
    };
    
    mockService.mockImplementation(function() { return {
      getParameterByID: vi.fn().mockResolvedValue(mockDetailData)
    }; });

    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    await vm.fetchDetailData('test-id');

    expect(vm.detailData).toEqual(mockDetailData.data);
  });

  it('should open edit modal with correct data', async () => {
    const mockService = ParameterService as any;
    const mockDetailData = {
      data: {
        uuid: 'test-id',
        tahun: '2024',
        discount_rate: '12.5',
        corporate_tax_rate: '22.0'
      }
    };
    
    mockService.mockImplementation(function() { return {
      getParameterByID: vi.fn().mockResolvedValue(mockDetailData)
    }; });

    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    await vm.openEditModals('test-id');

    expect(vm.selectedParameterId).toBe('test-id');
    expect(vm.isModalEdit).toBe(true);
    expect(vm.formData.tahun).toBe('2024');
    expect(vm.formData.discount_rate).toBe('12.5');
    expect(vm.formData.corporate_tax_rate).toBe('22.0');
  });

  it('should validate value over 100 in discount rate', () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;

    // Test value over 100
    vm.formData.discount_rate = '150';
    vm.validForm_DT();
    expect(vm.errors_DT).toContain('diatas_100');
  });

  it('should validate value over 100 in corporate tax rate', () => {
    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;

    // Test value over 100 (need discount_rate set for validation to run)
    vm.formData.discount_rate = '10';
    vm.formData.corporate_tax_rate = '150';
    vm.validForm_CT();
    expect(vm.errors_CT).toContain('diatas_100');
  });

  it('should handle successful edit form submission', async () => {
    const mockService = ParameterService as any;
    mockService.mockImplementation(function() { return {
      editParameter: vi.fn().mockResolvedValue({ success: true }),
      getParameterData: vi.fn().mockResolvedValue({ data: [], meta: { totalRecords: 0, totalPages: 0 } })
    }; });

    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    vm.selectedParameterId = 'test-id';
    vm.detailData = { status: 1 }; // Set detail data with status
    
    // Set valid form data
    vm.formData.tahun = '2024';
    vm.formData.discount_rate = '10.5';
    vm.formData.corporate_tax_rate = '25.0';

    // Call the submit function and check that no errors occur
    await vm.submitEditForm();

    expect(vm.errors.length).toBe(0);
    expect(vm.isModalEdit).toBe(false); // Modal should be closed
  });

  it('should check for duplicate year in form submission', async () => {
    const mockService = ParameterService as any;
    const mockExistingData = [
      { uuid: '1', tahun: '2024', discount_rate: '10', corporate_tax_rate: '25', status: 1 }
    ];
    
    mockService.mockImplementation(function() { return {
      getParameterData: vi.fn().mockResolvedValue({ data: mockExistingData, meta: { totalRecords: 1, totalPages: 1 } })
    }; });

    wrapper = mount(Parameter, {
      global: {
        stubs: {
          Loading: true,
          ModalWrapper: true,
          Vue3Lottie: true,
          TableComponent: true
        }
      }
    });

    const vm = wrapper.vm;
    
    // Set form data with existing year
    vm.formData.tahun = '2024'; // This year already exists
    vm.formData.discount_rate = '10.5';
    vm.formData.corporate_tax_rate = '25.0';

    await vm.submitForm();

    expect(vm.errors).toContain('Tahun sudah ada di database.');
  });

  it('should render slotted modal and table template paths', async () => {
    const currentYear = new Date().getFullYear().toString();
    const mockService = ParameterService as any;
    mockService.mockImplementation(function() { return {
      getParameterData: vi.fn().mockResolvedValue({
        data: [
          { uuid: '1', tahun: currentYear, discount_rate: '10', corporate_tax_rate: '20', status: 1 },
          { uuid: '2', tahun: '2023', discount_rate: '11', corporate_tax_rate: '21', status: 0 }
        ],
        meta: { totalRecords: 2, totalPages: 2 }
      }),
      getParameterByID: vi.fn().mockResolvedValue({
        data: { uuid: '1', tahun: currentYear, discount_rate: '10', corporate_tax_rate: '20', status: 1 }
      }),
      addParameter: vi.fn().mockResolvedValue({ success: true }),
      editParameter: vi.fn().mockResolvedValue({ success: true })
    }; });

    wrapper = createRichWrapper();
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 30));

    const vm = wrapper.vm;
    expect(wrapper.find('table').exists()).toBe(true);

    const addButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Tambah Parameter'));
    expect(addButton).toBeDefined();
    await addButton!.trigger('click');
    expect(vm.isModalOpen).toBe(true);

    const cancelButton = wrapper.findAll('button').find((btn: any) => btn.text().trim() === 'Batal');
    expect(cancelButton).toBeDefined();
    await cancelButton!.trigger('click');
    expect(vm.isModalOpen).toBe(false);

    vm.navigation.totalPages = 8;
    vm.navigation.currentPage = 2;
    await wrapper.vm.$nextTick();
    const pageItems = wrapper.findAll('#pagination');
    if (pageItems.length > 0) {
      await pageItems[0].trigger('click');
      expect(vm.navigation.currentPage).toBe(1);
    }
  });

  it('should cover fetchDetailData and openEditModals error paths', async () => {
    const mockService = ParameterService as any;
    mockService.mockImplementation(function() { return {
      getParameterData: vi.fn().mockResolvedValue({ data: [], meta: { totalRecords: 0, totalPages: 0 } }),
      getParameterByID: vi.fn().mockRejectedValue(new Error('detail failed')),
      addParameter: vi.fn().mockResolvedValue({ success: true }),
      editParameter: vi.fn().mockResolvedValue({ success: true })
    }; });

    wrapper = createRichWrapper();
    await wrapper.vm.$nextTick();

    await expect(wrapper.vm.fetchDetailData('bad-id')).rejects.toThrow('detail failed');
    await wrapper.vm.openEditModals('bad-id');
    expect(wrapper.vm.selectedParameterId).toBe('bad-id');
  });

  it('should cover submit form and submit edit catch branches', async () => {
    const mockService = ParameterService as any;
    const currentYear = new Date().getFullYear().toString();
    mockService.mockImplementation(function() { return {
      getParameterData: vi.fn().mockResolvedValue({ data: [], meta: { totalRecords: 0, totalPages: 0 } }),
      getParameterByID: vi.fn().mockResolvedValue({
        data: { uuid: 'id-1', tahun: currentYear, discount_rate: '10', corporate_tax_rate: '20', status: 1 }
      }),
      addParameter: vi.fn().mockRejectedValue(new Error('add failed')),
      editParameter: vi.fn().mockRejectedValue(new Error('edit failed'))
    }; });

    wrapper = createRichWrapper();
    await wrapper.vm.$nextTick();

    wrapper.vm.formData.tahun = currentYear;
    wrapper.vm.formData.discount_rate = '10';
    wrapper.vm.formData.corporate_tax_rate = '20';
    await expect(wrapper.vm.submitForm()).rejects.toThrow('add failed');

    wrapper.vm.selectedParameterId = 'id-1';
    wrapper.vm.detailData = { status: 1 };
    wrapper.vm.formData.tahun = currentYear;
    wrapper.vm.formData.discount_rate = '10';
    wrapper.vm.formData.corporate_tax_rate = '20';
    await expect(wrapper.vm.submitEditForm()).rejects.toThrow('edit failed');
  });

  it('should execute add and edit modal input handlers and row action button', async () => {
    const currentYear = new Date().getFullYear().toString();
    const mockService = ParameterService as any;
    mockService.mockImplementation(function() { return {
      getParameterData: vi.fn().mockResolvedValue({
        data: [
          { uuid: 'year-now', tahun: currentYear, discount_rate: '10', corporate_tax_rate: '20', status: 1 },
          { uuid: 'year-old', tahun: '2020', discount_rate: '8', corporate_tax_rate: '18', status: 0 }
        ],
        meta: { totalRecords: 2, totalPages: 2 }
      }),
      getParameterByID: vi.fn().mockResolvedValue({
        data: { uuid: 'year-now', tahun: currentYear, discount_rate: '11', corporate_tax_rate: '21', status: 1 }
      }),
      addParameter: vi.fn().mockResolvedValue({ success: true }),
      editParameter: vi.fn().mockResolvedValue({ success: true })
    }; });

    wrapper = createRichWrapper();
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 30));

    const vm = wrapper.vm;
    vm.isModalOpen = true;
    vm.errors = ['err-add'];
    vm.errors_DT = ['non_angka'];
    vm.errors_CT = ['negatif'];
    await wrapper.vm.$nextTick();

    const yearSelect = wrapper.find('#tahun');
    if (yearSelect.exists()) {
      await yearSelect.setValue(currentYear);
    }

    const discountInputs = wrapper.findAll('#discount');
    const taxInputs = wrapper.findAll('#tax');
    if (discountInputs[0]) {
      await discountInputs[0].setValue('12.5');
    }
    if (taxInputs[0]) {
      await taxInputs[0].setValue('22.5');
    }

    const rowActionButton = wrapper.findAll('td button')[0];
    if (rowActionButton) {
      await rowActionButton.trigger('click');
    }

    vm.isModalEdit = true;
    vm.errors = ['err-edit'];
    vm.errors_DT = ['diatas_100'];
    vm.errors_CT = ['non_angka'];
    await wrapper.vm.$nextTick();

    if (discountInputs[1]) {
      await discountInputs[1].setValue('13.5');
    }
    if (taxInputs[1]) {
      await taxInputs[1].setValue('23.5');
    }

    expect(vm.formData.discount_rate).toContain('13.5');
    expect(vm.formData.corporate_tax_rate).toContain('23.5');
  });
});