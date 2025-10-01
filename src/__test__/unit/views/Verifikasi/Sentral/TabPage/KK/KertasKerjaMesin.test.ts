import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import KertasKerjaMesin from '@/views/Verifikasi/Sentral/TabPage/KK/KertasKerjaMesin.vue';
import TableComponent from '@/components/ui/Table.vue';

// Mock the dependencies
jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: jest.fn((value) => `encrypted_${value}`)
  })
}));

jest.mock('@/services/format/global-format', () => {
  return jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn((value) => {
      if (value === '' || value === null || value === undefined) return '0';
      return `Rp ${value.toLocaleString()}`;
    })
  }));
});

// Mock vue-router
const mockRouterLink = {
  template: '<a><slot /></a>',
  props: ['to']
};

const mockSource = [
  {
    tahun: '2023',
    irr_on_project: 15.5,
    irr_on_equity: 12.3,
    npv_on_project: 150000,
    npv_on_equity: 120000,
    status: 'Disetujui',
    uuid_mesin: 'mesin-123',
    uuid_sentral: 'sentral-123'
  },
  {
    tahun: '2024',
    irr_on_project: 18.2,
    irr_on_equity: '',
    npv_on_project: 200000,
    npv_on_equity: 180000,
    status: 'Ditolak T1',
    uuid_mesin: 'mesin-456',
    uuid_sentral: 'sentral-456'
  },
  {
    tahun: '2025',
    irr_on_project: 20.1,
    irr_on_equity: 16.8,
    npv_on_project: 250000,
    npv_on_equity: 220000,
    status: 'Menunggu Persetujuan T1',
    uuid_mesin: 'mesin-789',
    uuid_sentral: 'sentral-789'
  }
];

describe('KertasKerjaMesin.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(KertasKerjaMesin, {
      props: {
        source: mockSource
      },
      global: {
        components: {
          TableComponent,
          RouterLink: mockRouterLink
        }
      }
    });
  });

  describe('Component Rendering', () => {
    it('should render the component correctly', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findComponent(TableComponent).exists()).toBe(true);
    });

    it('should render table headers correctly', () => {
      const headers = wrapper.findAll('th');
      expect(headers).toHaveLength(6);
      expect(headers[0].text()).toContain('No');
      expect(headers[1].text()).toContain('Periode');
      expect(headers[2].text()).toContain('IRR on Equity (%)');
      expect(headers[3].text()).toContain('NPV on Equity (Rp Juta)');
      expect(headers[4].text()).toContain('Status');
      expect(headers[5].text()).toContain('Aksi');
    });

    it('should render data rows when source is provided', () => {
      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(3);
    });

    it('should display "Data Tidak Tersedia" when source is empty', async () => {
      await wrapper.setProps({ source: [] });
      const emptyMessage = wrapper.find('td[colspan="8"]');
      expect(emptyMessage.exists()).toBe(true);
      expect(emptyMessage.text()).toContain('Data Tidak Tersedia');
      expect(emptyMessage.text()).toContain('Silahkan lakukan pengisian atau hubungi unit terkait');
    });
  });

  describe('Data Display', () => {
    it('should display row numbers correctly', () => {
      const firstRowNumber = wrapper.find('tbody tr:first-child td:first-child');
      expect(firstRowNumber.text()).toBe('1');
      
      const secondRowNumber = wrapper.find('tbody tr:nth-child(2) td:first-child');
      expect(secondRowNumber.text()).toBe('2');
    });

    it('should display tahun correctly', () => {
      const firstRowTahun = wrapper.find('tbody tr:first-child td:nth-child(2)');
      expect(firstRowTahun.text()).toBe('2023');
    });

    it('should display "-" when tahun is not available', async () => {
      const sourceWithoutTahun = [{ ...mockSource[0], tahun: null }];
      await wrapper.setProps({ source: sourceWithoutTahun });
      
      const tahunCell = wrapper.find('tbody tr:first-child td:nth-child(2)');
      expect(tahunCell.text()).toBe('-');
    });

    it('should format IRR on Equity correctly', () => {
      const firstRowIRR = wrapper.find('tbody tr:first-child td:nth-child(3)');
      expect(firstRowIRR.text()).toContain('Rp 12');
      
      const secondRowIRR = wrapper.find('tbody tr:nth-child(2) td:nth-child(3)');
      expect(secondRowIRR.text()).toBe('NUM');
    });

    it('should format NPV on Equity correctly', () => {
      const firstRowNPV = wrapper.find('tbody tr:first-child td:nth-child(4)');
      expect(firstRowNPV.text()).toContain('Rp 120');
    });
  });

  describe('Status Display', () => {
    it('should display "Disetujui" status with correct styling', () => {
      const statusDiv = wrapper.find('tbody tr:first-child .bg-\\[\\#EDF7F2\\]');
      expect(statusDiv.exists()).toBe(true);
      expect(statusDiv.text()).toBe('Disetujui');
      expect(statusDiv.classes()).toContain('text-[#397E5D]');
    });

    it('should display "Ditolak T1" status with correct styling', () => {
      const statusDiv = wrapper.find('tbody tr:nth-child(2) .bg-\\[\\#FAEBEA\\]');
      expect(statusDiv.exists()).toBe(true);
      expect(statusDiv.text()).toBe('Ditolak oleh Pembina');
      expect(statusDiv.classes()).toContain('text-[#C53830]');
    });

    it('should display "Menunggu Persetujuan T1" status with correct styling', () => {
      const statusDiv = wrapper.find('tbody tr:nth-child(3) .bg-\\[\\#FFF3E6\\]');
      expect(statusDiv.exists()).toBe(true);
      expect(statusDiv.text()).toBe('Menunggu Persetujuan Pembina');
      expect(statusDiv.classes()).toContain('text-[#FF8000]');
    });

    it('should handle all status types correctly', async () => {
      const allStatusSource = [
        { ...mockSource[0], status: 'Ditolak T2' },
        { ...mockSource[0], status: 'Draft' },
        { ...mockSource[0], status: 'Menunggu Persetujuan T2' }
      ];

      await wrapper.setProps({ source: allStatusSource });

      const ditolakT2 = wrapper.find('tbody tr:first-child .bg-\\[\\#FAEBEA\\]');
      expect(ditolakT2.text()).toBe('Ditolak oleh Pengelola');

      const draft = wrapper.find('tbody tr:nth-child(2) .bg-\\[\\#B7CAF5\\]');
      expect(draft.text()).toBe('Draft');

      const menungguT2 = wrapper.find('tbody tr:nth-child(3) .bg-\\[\\#FFF3E6\\]');
      expect(menungguT2.text()).toBe('Menunggu Persetujuan Pengelola');
    });
  });

  describe('Action Links', () => {
    it('should render RouterLink with correct props', () => {
      const routerLinks = wrapper.findAllComponents(mockRouterLink);
      expect(routerLinks).toHaveLength(3);
      
      const firstLink = routerLinks[0];
      expect(firstLink.props('to')).toEqual({
        name: 'persetujuan-kk',
        params: { id: 'mesin-123' },
        query: { uuid_sentral: 'sentral-123', tahun: '2023' }
      });
    });

    it('should render eye icon in action button', () => {
      const eyeIcon = wrapper.find('svg[viewBox="0 0 16 16"]');
      expect(eyeIcon.exists()).toBe(true);
    });
  });

  describe('Pagination', () => {
    it('should display pagination information', () => {
      const paginationInfo = wrapper.find('.flex.items-center.space-x-2.text-sm');
      expect(paginationInfo.text()).toContain('Menampilkan');
      expect(paginationInfo.text()).toContain('dari 3 data');
    });

    it('should render pagination select options', () => {
      const select = wrapper.find('select');
      expect(select.exists()).toBe(true);
      
      const options = select.findAll('option');
      expect(options).toHaveLength(5);
      expect(options[0].attributes('value')).toBe('10');
      expect(options[4].attributes('value')).toBe('50');
    });

    it('should render pagination buttons', () => {
      const buttons = wrapper.findAll('button');
      const prevButton = buttons.find(btn => btn.find('svg path[d*="12.707 5.293"]').exists());
      const nextButton = buttons.find(btn => btn.find('svg path[d*="7.293 14.707"]').exists());
      
      expect(prevButton).toBeTruthy();
      expect(nextButton).toBeTruthy();
    });

    it('should disable previous button on first page', () => {
      const prevButton = wrapper.find('.disabled\\:hover\\:cursor-not-allowed');
      expect(prevButton.attributes('disabled')).toBeDefined();
    });
  });

  describe('Pagination Navigation', () => {
    it('should call goToNext when next button is clicked', async () => {
      // Setup initial state
      wrapper.vm.navigation.totalPages = 5;
      wrapper.vm.navigation.currentPage = 1;
      await wrapper.vm.$nextTick();
      
      // Call the method directly to test the logic
      wrapper.vm.goToNext();
      expect(wrapper.vm.navigation.currentPage).toBe(2);
    });

    it('should call goToPrevious when previous button is clicked', async () => {
      // Setup initial state
      wrapper.vm.navigation.currentPage = 2;
      wrapper.vm.navigation.totalPages = 5;
      await wrapper.vm.$nextTick();
      
      // Call the method directly to test the logic
      wrapper.vm.goToPrevious();
      expect(wrapper.vm.navigation.currentPage).toBe(1);
    });

    it('should call goToPage with specific page number', async () => {
      await wrapper.vm.goToPage(3);
      expect(wrapper.vm.navigation.currentPage).toBe(3);
    });

    it('should generate correct page list', () => {
      wrapper.vm.navigation.totalPages = 10;
      wrapper.vm.navigation.currentPage = 1;
      
      const pageList = wrapper.vm.generatePageList;
      expect(pageList).toContain(1);
      expect(pageList).toContain('...');
      expect(pageList).toContain(10);
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize navigation state correctly', () => {
      expect(wrapper.vm.navigation.currentPage).toBe(1);
      expect(wrapper.vm.navigation.totalPages).toBe(1);
      expect(wrapper.vm.navigation.totalRecords).toBe(0);
      expect(wrapper.vm.navigation.limit).toBe(10);
    });

    it('should set encryptStorageRef on mount', async () => {
      // Wait for the onMounted hook to complete
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.encryptStorageRef).toBeTruthy();
    });
  });

  describe('Data Formatting', () => {
    it('should handle empty IRR on Equity values', async () => {
      const sourceWithEmptyIRR = [{ ...mockSource[0], irr_on_equity: '' }];
      await wrapper.setProps({ source: sourceWithEmptyIRR });
      
      const irrCell = wrapper.find('tbody tr:first-child td:nth-child(3)');
      expect(irrCell.text()).toBe('NUM');
    });

    it('should format numbers using GlobalFormat service', () => {
      // The mock GlobalFormat should be called for formatting
      expect(wrapper.vm.globalFormat.formatRupiah).toBeDefined();
    });
  });

  describe('Environmental Mode Handling', () => {
    it('should handle production mode for encryption', () => {
      // The nodeMode is set from import.meta.env.MODE in the component
      expect(wrapper.vm.nodeMode).toBeDefined();
      expect(typeof wrapper.vm.nodeMode).toBe('string');
    });
  });
});
