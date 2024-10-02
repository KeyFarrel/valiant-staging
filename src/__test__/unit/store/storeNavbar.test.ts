import { setActivePinia, createPinia } from 'pinia';
import { useNavbarLabelStore } from '@/store/storeNavbar';

describe('storeNavbarLabel', () => {
  beforeEach(() => {
    // Set up Pinia for testing
    setActivePinia(createPinia());
  });

  it('should initialize label as an empty string', () => {
    const navbarStore = useNavbarLabelStore();

    // Check if the initial label is an empty string
    expect(navbarStore.label).toBe('');
  });

  it('should allow changing the label', () => {
    const navbarStore = useNavbarLabelStore();

    // Change the label value
    navbarStore.label = 'New Label';

    // Check if the value has been updated correctly
    expect(navbarStore.label).toBe('New Label');
  });
});
