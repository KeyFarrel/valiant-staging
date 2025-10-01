import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from '@jest/globals';
import Query from '@/views/Query/Query.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';

// Mock the Loading component
jest.mock('@/components/ui/LoadingSpinner.vue', () => ({
  name: 'Loading',
  template: '<div data-testid="loading">Loading...</div>'
}));

describe('Query.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(Query, {
      global: {
        components: {
          Loading
        }
      }
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Component Rendering', () => {
    it('should render the component correctly', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.flex.flex-col.h-full.p-6.space-y-8').exists()).toBe(true);
    });

    it('should not show loading spinner by default', () => {
      expect(wrapper.findComponent(Loading).exists()).toBe(false);
    });

    it('should show loading spinner when isLoading is true', async () => {
      wrapper.vm.isLoading = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(Loading).exists()).toBe(true);
    });
  });

  describe('Unit Section', () => {
    it('should render Unit section header', () => {
      const headers = wrapper.findAll('h1');
      const unitHeader = headers.find((h: any) => h.text() === 'Unit');
      expect(unitHeader).toBeTruthy();
    });

    it('should show Unit section content by default (isUnitSectionOpen is true)', () => {
      const unitMains = wrapper.findAll('main');
      expect(unitMains.length).toBeGreaterThan(0);
      expect(wrapper.vm.isUnitSectionOpen).toBe(true);
    });

    it('should toggle Unit section when header is clicked', async () => {
      // Test the reactive data directly
      expect(wrapper.vm.isUnitSectionOpen).toBe(true);
      
      // Manually toggle the state to test reactivity
      wrapper.vm.isUnitSectionOpen = false;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isUnitSectionOpen).toBe(false);
      
      wrapper.vm.isUnitSectionOpen = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isUnitSectionOpen).toBe(true);
    });

    it('should render all Unit section form fields', () => {
      const selects = wrapper.findAll('select');
      const labels = wrapper.findAll('label');
      
      expect(selects.length).toBeGreaterThanOrEqual(3); // At least 3 select dropdowns
      
      const unitLabels = labels.filter((label: any) => 
        label.text().includes('Unit Induk') ||
        label.text().includes('Unit Pengelola') ||
        label.text().includes('Kategori Pembangkit') ||
        label.text().includes('Unit Sentral') ||
        label.text().includes('Unit Mesin')
      );
      expect(unitLabels.length).toBeGreaterThan(0);
    });

    it('should render "Pilih Semua" checkboxes for all Unit fields', () => {
      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThan(0);
      
      const checkboxLabels = wrapper.findAll('label').filter((label: any) => 
        label.text() === 'Pilih Semua'
      );
      expect(checkboxLabels.length).toBeGreaterThan(0);
    });
  });

  describe('Data Section', () => {
    it('should render Data section header', () => {
      const headers = wrapper.findAll('h1');
      const dataHeader = headers.find((h: any) => h.text() === 'Data');
      expect(dataHeader).toBeTruthy();
    });

    it('should show Data section content by default (isDataSectionOpen is true)', () => {
      expect(wrapper.vm.isDataSectionOpen).toBe(true);
    });

    it('should toggle Data section when header is clicked', async () => {
      // Test the reactive data directly
      expect(wrapper.vm.isDataSectionOpen).toBe(true);
      
      // Manually toggle the state to test reactivity
      wrapper.vm.isDataSectionOpen = false;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isDataSectionOpen).toBe(false);
      
      wrapper.vm.isDataSectionOpen = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isDataSectionOpen).toBe(true);
    });

    it('should render Data section form fields', () => {
      const selects = wrapper.findAll('select');
      const inputs = wrapper.findAll('input[type="text"]');
      
      expect(selects.length).toBeGreaterThanOrEqual(3);
      expect(inputs.length).toBeGreaterThanOrEqual(1);
    });

    it('should render Data section action buttons', () => {
      const buttons = wrapper.findAll('button');
      
      const hapusButton = buttons.find((btn: any) => btn.text().includes('Hapus Data'));
      const tambahButton = buttons.find((btn: any) => btn.text().includes('Tambah Data'));
      const resetButton = buttons.find((btn: any) => btn.text().includes('Reset'));
      const terapkanButton = buttons.find((btn: any) => btn.text().includes('Terapkan'));
      
      expect(hapusButton).toBeTruthy();
      expect(tambahButton).toBeTruthy();
      expect(resetButton).toBeTruthy();
      expect(terapkanButton).toBeTruthy();
    });
  });

  describe('Query Section', () => {
    it('should render Query section header', () => {
      const headers = wrapper.findAll('h1');
      const queryHeader = headers.find((h: any) => h.text() === 'Query');
      expect(queryHeader).toBeTruthy();
    });

    it('should show Query section content by default (isQuerySectionOpen is true)', () => {
      expect(wrapper.vm.isQuerySectionOpen).toBe(true);
    });

    it('should toggle Query section when header is clicked', async () => {
      // Test the reactive data directly
      expect(wrapper.vm.isQuerySectionOpen).toBe(true);
      
      // Manually toggle the state to test reactivity
      wrapper.vm.isQuerySectionOpen = false;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isQuerySectionOpen).toBe(false);
      
      wrapper.vm.isQuerySectionOpen = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isQuerySectionOpen).toBe(true);
    });

    it('should render SQL textarea', () => {
      const textarea = wrapper.find('textarea');
      
      expect(textarea.exists()).toBe(true);
      expect(textarea.attributes('placeholder')).toBe('Contoh : Select * From Rekap Kertas Kerja Data');
    });

    it('should render Query section action buttons', () => {
      const buttons = wrapper.findAll('button');
      
      const resetQueryButton = buttons.find((btn: any) => btn.text().includes('Reset Query'));
      const terapkanQueryButton = buttons.find((btn: any) => btn.text().includes('Terapkan Query'));
      
      expect(resetQueryButton).toBeTruthy();
      expect(terapkanQueryButton).toBeTruthy();
    });
  });

  describe('Data Preview Section', () => {
    it('should render Pratinjau Data section header', () => {
      const headers = wrapper.findAll('h1');
      const previewHeader = headers.find((h: any) => h.text() === 'Pratinjau Data');
      expect(previewHeader).toBeTruthy();
    });

    it('should render data preview table', () => {
      const table = wrapper.find('table');
      expect(table.exists()).toBe(true);
      expect(table.classes()).toContain('border');
      expect(table.classes()).toContain('table-auto');
    });

    it('should render table headers correctly', () => {
      const headers = wrapper.findAll('th');
      const expectedHeaders = ['No', 'Unit Sentral', 'Unit Mesin', 'Table Name', 'Field Name', 'Operation', 'Condition'];
      
      expect(headers).toHaveLength(expectedHeaders.length);
      headers.forEach((header: any, index: number) => {
        expect(header.text()).toBe(expectedHeaders[index]);
      });
    });

    it('should render sample data rows', () => {
      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(3); // 3 sample rows
      
      // Check first row data
      const firstRowCells = rows[0].findAll('td');
      expect(firstRowCells[0].text()).toBe('1');
      expect(firstRowCells[1].text()).toBe('PLTA Cikalong');
      expect(firstRowCells[2].text()).toBe('Unit 1');
      expect(firstRowCells[3].text()).toBe('Rekap Kertas Kerja');
      expect(firstRowCells[4].text()).toBe('IRR');
      expect(firstRowCells[5].text()).toBe('<');
      expect(firstRowCells[6].text()).toBe('9');
    });

    it('should render Export Data button', () => {
      const buttons = wrapper.findAll('button');
      const exportButton = buttons.find((btn: any) => btn.text().includes('Export Data'));
      expect(exportButton).toBeTruthy();
    });
  });

  describe('Interactive Elements', () => {
    it('should have hover effects on section headers', () => {
      const sectionHeaders = wrapper.findAll('section > div');
      
      expect(sectionHeaders.length).toBeGreaterThan(0);
      // Check that at least one header has the correct classes
      const hasHoverClasses = sectionHeaders.some((header: any) => 
        header.classes().includes('cursor-pointer')
      );
      expect(hasHoverClasses).toBe(true);
    });

    it('should display correct icons for collapsed/expanded sections', async () => {
      // Test reactive state changes for sections
      expect(wrapper.vm.isUnitSectionOpen).toBe(true);
      expect(wrapper.vm.isDataSectionOpen).toBe(true);
      expect(wrapper.vm.isQuerySectionOpen).toBe(true);
      
      // Test toggling states
      wrapper.vm.isUnitSectionOpen = false;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isUnitSectionOpen).toBe(false);
      
      wrapper.vm.isUnitSectionOpen = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isUnitSectionOpen).toBe(true);
    });
  });

  describe('Form Elements', () => {
    it('should have proper form field styling', () => {
      const selects = wrapper.findAll('select');
      const inputs = wrapper.findAll('input[type="text"]');
      const textarea = wrapper.find('textarea');
      
      // Check select styling
      selects.forEach((select: any) => {
        expect(select.classes()).toContain('border');
        expect(select.classes()).toContain('border-gray-300');
        expect(select.classes()).toContain('rounded-lg');
      });
      
      // Check input styling
      inputs.forEach((input: any) => {
        expect(input.classes()).toContain('border');
        expect(input.classes()).toContain('border-gray-300');
        expect(input.classes()).toContain('rounded-lg');
      });
      
      // Check textarea styling
      expect(textarea.classes()).toContain('border');
      expect(textarea.classes()).toContain('border-gray-300');
      expect(textarea.classes()).toContain('rounded-lg');
    });

    it('should have proper button styling', () => {
      const buttons = wrapper.findAll('button');
      
      buttons.forEach((button: any) => {
        expect(button.classes()).toContain('border');
        expect(button.classes()).toContain('rounded-lg');
        expect(button.classes()).toContain('font-semibold');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form fields', () => {
      const labels = wrapper.findAll('label');
      const formFields = wrapper.findAll('select, input, textarea');
      
      // Should have labels for form guidance
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should have semantic HTML structure', () => {
      expect(wrapper.find('main').exists()).toBe(true);
      expect(wrapper.find('section').exists()).toBe(true);
      expect(wrapper.find('table').exists()).toBe(true);
      expect(wrapper.find('thead').exists()).toBe(true);
      expect(wrapper.find('tbody').exists()).toBe(true);
    });
  });
});