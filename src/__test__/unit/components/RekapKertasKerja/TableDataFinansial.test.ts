import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import TableDataFinansial from '@/components/RekapKertasKerja/TableDataFinansial.vue';

// Mock global format
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatRupiah(value: number) {
      return `Rp ${value.toLocaleString()}`;
    }
  }
}));

describe('TableDataFinansial', () => {
  let wrapper: VueWrapper<any>;

  const mockDataFinansial = {
    tahun: [2023, 2024, 2025]
  };

  const mockSource = [
    {
      id_uraian: 1,
      uraian: 'Level 1 Item',
      level2: [
        {
          id_uraian: 2,
          uraian: 'Level 2 Item',
          t2023: 1000000,
          t2024: 2000000,
          t2025: 3000000,
          level3: [
            {
              id_uraian: 3,
              uraian: 'Level 3 Item',
              t2023: 500000,
              t2024: 1000000,
              t2025: 1500000,
              level4: [
                {
                  id_uraian: 4,
                  uraian: 'Level 4 Item',
                  t2023: 250000,
                  t2024: 500000,
                  t2025: 750000
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  beforeEach(() => {
    wrapper = mount(TableDataFinansial, {
      props: {
        isFetchingError: false,
        dataFinansial: mockDataFinansial,
        source: mockSource,
        tahunTerakhirRealisasi: 2024
      }
    });
  });

  it('should render table with correct data', () => {
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('thead').exists()).toBe(true);
    expect(wrapper.find('tbody').exists()).toBe(true);
    
    // Check if years are rendered in header
    const headers = wrapper.findAll('th');
    expect(headers.length).toBe(4); // Nama + 3 years
    expect(headers[1].text()).toContain('2023');
    expect(headers[2].text()).toContain('2024');
    expect(headers[3].text()).toContain('2025');
  });

  it('should toggle row visibility when clicked', async () => {
    // Initially level 2 should not be visible
    expect(wrapper.find('#level2').exists()).toBe(false);
    
    // Click on level 1 row to expand
    const level1Row = wrapper.find('tbody tr');
    await level1Row.trigger('click');
    
    // Now level 2 should be visible
    expect(wrapper.find('#level2').exists()).toBe(true);
  });

  it('should display shimmer loading when data is empty', () => {
    const loadingWrapper = mount(TableDataFinansial, {
      props: {
        isFetchingError: false,
        dataFinansial: { tahun: [] },
        source: [],
        tahunTerakhirRealisasi: 2024
      }
    });
    
    expect(loadingWrapper.findComponent({ name: 'ShimmerLoading' }).exists()).toBe(true);
  });

  it('should display reload component when there is fetching error and no data', () => {
    const errorWrapper = mount(TableDataFinansial, {
      props: {
        isFetchingError: true,
        dataFinansial: { tahun: [] },
        source: [],
        tahunTerakhirRealisasi: 2024
      }
    });
    
    expect(errorWrapper.findComponent({ name: 'ReloadComponent' }).exists()).toBe(true);
  });

  it('should emit onClickReload when reload component is clicked', async () => {
    const errorWrapper = mount(TableDataFinansial, {
      props: {
        isFetchingError: true,
        dataFinansial: { tahun: [] },
        source: [],
        tahunTerakhirRealisasi: 2024
      }
    });
    
    const reloadComponent = errorWrapper.findComponent({ name: 'ReloadComponent' });
    await reloadComponent.vm.$emit('on-clicks');
    
    expect(errorWrapper.emitted('onClickReload')).toBeTruthy();
  });

  it('should toggle row expansion correctly - close already opened row', async () => {
    // First expand a row
    const level1Row = wrapper.find('tbody tr');
    await level1Row.trigger('click');
    
    // Verify level 2 is visible
    expect(wrapper.find('#level2').exists()).toBe(true);
    
    // Click again to close
    await level1Row.trigger('click');
    
    // Now level 2 should not be visible
    expect(wrapper.find('#level2').exists()).toBe(false);
  });

  it('should expand multiple nested levels correctly', async () => {
    // Expand level 1
    const level1Row = wrapper.find('tbody tr');
    await level1Row.trigger('click');
    expect(wrapper.find('#level2').exists()).toBe(true);
    
    // Expand level 2 - find the row containing level2
    const level2Rows = wrapper.findAll('tr').filter(row => row.find('#level2').exists());
    if (level2Rows.length > 0) {
      await level2Rows[0].trigger('click');
      expect(wrapper.find('#level3').exists()).toBe(true);
      
      // Expand level 3 - find the row containing level3
      const level3Rows = wrapper.findAll('tr').filter(row => row.find('#level3').exists());
      if (level3Rows.length > 0) {
        await level3Rows[0].trigger('click');
        expect(wrapper.find('#level4').exists()).toBe(true);
      }
    }
  });

  it('should format currency values correctly', async () => {
    // Expand to show level 2 with data
    const level1Row = wrapper.find('tbody tr');
    await level1Row.trigger('click');
    
    // Check if currency formatting is applied - find row with level2 and check its data cells
    const allRows = wrapper.findAll('tr');
    const level2Row = allRows.find(row => row.find('#level2').exists());
    
    if (level2Row) {
      const dataCells = level2Row.findAll('td');
      if (dataCells.length > 1) {
        const valueCell = dataCells[1]; // First year column
        expect(valueCell.text()).toContain('Rp');
      }
    }
  });
});