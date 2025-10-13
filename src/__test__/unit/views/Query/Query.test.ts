import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Query from '@/views/Query/Query.vue';

describe('Query.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(Query);
  });

  it('should render the Query component successfully', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should display all three main sections (Unit, Data, Query)', () => {
    const sections = wrapper.findAll('section');
    expect(sections).toHaveLength(4); // Unit, Data, Query, Pratinjau Data
    
    const headings = wrapper.findAll('h1');
    expect(headings[0].text()).toBe('Unit');
    expect(headings[1].text()).toBe('Data');
    expect(headings[2].text()).toBe('Query');
    expect(headings[3].text()).toBe('Pratinjau Data');
  });

  it('should have initial reactive data values set correctly', () => {
    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.isUnitSectionOpen).toBe(true);
    expect(wrapper.vm.isDataSectionOpen).toBe(true);
    expect(wrapper.vm.isQuerySectionOpen).toBe(true);
  });

  it('should toggle Unit section visibility when clicking section header', async () => {
    // Find the clickable header for Unit section using @click event
    const unitHeaders = wrapper.findAll('div').filter((div: any) => {
      const clickHandler = div.element.__vueParentComponent?.props?.onClick;
      return clickHandler && div.text().includes('Unit');
    });
    
    let unitHeader;
    if (unitHeaders.length === 0) {
      // Alternative: find by cursor-pointer class
      unitHeader = wrapper.find('div.cursor-pointer');
    } else {
      unitHeader = unitHeaders[0];
    }
    
    // Initially should be open
    expect(wrapper.vm.isUnitSectionOpen).toBe(true);
    
    // Click to toggle
    await unitHeader.trigger('click');
    expect(wrapper.vm.isUnitSectionOpen).toBe(false);
    
    // Click to toggle back
    await unitHeader.trigger('click');
    expect(wrapper.vm.isUnitSectionOpen).toBe(true);
  });

  it('should toggle Data section visibility when clicking section header', async () => {
    // Find the second cursor-pointer div for Data section
    const dataHeader = wrapper.findAll('div.cursor-pointer')[1];
    
    // Initially should be open
    expect(wrapper.vm.isDataSectionOpen).toBe(true);
    
    // Click to toggle
    await dataHeader.trigger('click');
    expect(wrapper.vm.isDataSectionOpen).toBe(false);
    
    // Click to toggle back
    await dataHeader.trigger('click');
    expect(wrapper.vm.isDataSectionOpen).toBe(true);
  });

  it('should toggle Query section visibility when clicking section header', async () => {
    // Find the third cursor-pointer div for Query section
    const queryHeader = wrapper.findAll('div.cursor-pointer')[2];
    
    // Initially should be open
    expect(wrapper.vm.isQuerySectionOpen).toBe(true);
    
    // Click to toggle
    await queryHeader.trigger('click');
    expect(wrapper.vm.isQuerySectionOpen).toBe(false);
    
    // Click to toggle back
    await queryHeader.trigger('click');
    expect(wrapper.vm.isQuerySectionOpen).toBe(true);
  });

  it('should display correct SVG icons based on section state', () => {
    // Initially all sections are open, check for expanded SVGs (v-else)
    const expandedSvgs = wrapper.findAll('svg').filter((svg: any) => 
      svg.html().includes('M7.29289 4.79289')
    );
    expect(expandedSvgs.length).toBeGreaterThanOrEqual(3);
  });

  it('should show collapsed SVG icons when sections are closed', async () => {
    // Close Unit section first
    const unitHeader = wrapper.find('div.cursor-pointer');
    await unitHeader.trigger('click');
    
    // Check if collapsed SVG appears (v-if="!isUnitSectionOpen")
    const collapsedSvgs = wrapper.findAll('svg').filter((svg: any) => 
      svg.html().includes('M9.04048 11.2071')
    );
    expect(collapsedSvgs.length).toBeGreaterThanOrEqual(1);
  });
});