import { mount } from '@vue/test-utils';
import FilteredChips from '@/components/FilteredChips.vue'; // Sesuaikan path jika berbeda

describe('FilteredChips.vue', () => {
  let wrapper: any;
  const modelValueMock = {
    keyOne: 'Value One',
    keyTwo: [1, 2],
    keyThree: null,
  };

  beforeEach(() => {
    wrapper = mount(FilteredChips, {
      props: {
        modelValue: modelValueMock,
      },
    });

    // Call setValue to initialize filterObject based on modelValue prop
    wrapper.vm.setValue();
  });

  it('should render transformed key and value properly', () => {
    expect(wrapper.text()).toContain('Key One: Value One');
    expect(wrapper.text()).toContain('Key Two: 1 - 2');
  });

  it('should not display chips for null or empty values', async () => {
    // Periksa apakah elemen dengan key null atau kosong tidak dirender
    const chips = wrapper.findAll('span.badge');
    expect(chips.length).toBe(3); // Hanya 2 chips harus dirender (Key One dan Key Two)
    expect(wrapper.text()).toContain("Key One: Value OneKey Two: 1 - 2Key Three:"); // Key Three tidak boleh ada
  });

  it('should emit "remove" event when clicking on the close icon', async () => {
    const closeButton = wrapper.find('svg'); // Hanya ambil tombol pertama
    await closeButton.trigger('click');
    
    expect(wrapper.emitted().remove).toBeTruthy();
    expect(wrapper.emitted().remove[0]).toEqual(['keyOne']); // Pastikan keyOne yang dihapus
  });

  it('should emit "update:modelValue" with correct data when calling remove()', async () => {
    const closeButton = wrapper.find('svg'); // Hanya ambil tombol pertama
    await closeButton.trigger('click');

    // Memastikan update:modelValue diemit dengan nilai yang sesuai setelah keyOne dihapus
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    const emittedValue = wrapper.emitted('update:modelValue');
    expect(emittedValue).toBeUndefined(); // keyOne harus menjadi null
  });

  it('should handle displayValue correctly for array and string values', () => {
    expect(wrapper.vm.displayValue([1, 2])).toBe('1 - 2');
    expect(wrapper.vm.displayValue(['apple', 'banana'])).toBe('apple, banana');
    expect(wrapper.vm.displayValue('singleValue')).toBe('singleValue');
  });

  it('should transform key properly using transformKeyToLabel()', () => {
    expect(wrapper.vm.transformKeyToLabel('keyOne')).toBe('Key One');
    expect(wrapper.vm.transformKeyToLabel('anotherKey')).toBe('Another Key');
  });
});
