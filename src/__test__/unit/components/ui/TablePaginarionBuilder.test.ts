import { shallowMount } from '@vue/test-utils';
import TablePaginarionBuilder from '@/components/ui/TablePaginarionBuilder.vue';
import { nextTick } from 'vue';

describe('TablePaginationBuilder.vue', () => {
  let wrapper: any;

  const propsData = {
    header: [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
      { key: 'email', label: 'Email' },
    ],
    items: [
      { name: 'John Doe', age: 30, email: 'john@example.com' },
      { name: 'Jane Doe', age: 25, email: 'jane@example.com' },
      { name: 'Mark Smith', age: 40, email: 'mark@example.com' },
      { name: 'Sara Johnson', age: 35, email: 'sara@example.com' },
      { name: 'Jake White', age: 22, email: 'jake@example.com' },
      { name: 'Chris Evans', age: 28, email: 'chris@example.com' },
      { name: 'Alice Brown', age: 45, email: 'alice@example.com' },
    ],
  };

  beforeEach(() => {
    wrapper = shallowMount(TablePaginarionBuilder, {
      props: propsData,
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders table headers correctly', () => {
    const headers = wrapper.findAll('thead th');
    expect(headers.length).toBe(propsData.header.length);

    propsData.header.forEach((header, index) => {
      expect(headers[index].text()).toBe(header.label);
    });
  });

  it('displays the correct number of rows based on itemsPerPage', async () => {
    // Initially, the default value of itemsPerPage is 5, so 5 items should be displayed.
    await nextTick();
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(5);
  });

  it('correctly updates displayed items when changing pages', async () => {
    wrapper.vm.handlePage(2);
    await nextTick();

    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(2); // 2 items on the second page (since there are only 7 total items)
  });

  it('displays the correct pagination buttons', async () => {
    await nextTick();
    const paginationButtons = wrapper.findAll('nav ul li button');
    expect(paginationButtons.length).toBe(4); // 2 pages based on 5 items per page

    // Test the "Next" button is enabled
    const nextButton = wrapper.find('nav ul li:last-child button');
    expect(nextButton.attributes('disabled')).toBe(undefined);

    // Navigate to the last page and ensure the "Next" button is disabled
    wrapper.vm.handlePage(2);
    await nextTick();
    expect(nextButton.attributes('disabled')).toBe('');
  });

  it('correctly handles changing itemsPerPage', async () => {
    await nextTick();
    const select = wrapper.find('select');
    await select.setValue(10); // Change itemsPerPage to 10

    await nextTick();
    expect(wrapper.vm.itemsPerPage).toBe(10);

    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(7); // All 7 items should be displayed
  });

  it('disables the "Previous" button when on the first page', async () => {
    await nextTick();
    const prevButton = wrapper.find('nav ul li:first-child button');
    expect(prevButton.attributes('disabled')).toBe('');

    wrapper.vm.handlePage(2);
    await nextTick();
    expect(prevButton.attributes('disabled')).toBe(undefined);
  });
});
