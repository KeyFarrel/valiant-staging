import { setActivePinia, createPinia } from 'pinia';
import { useRoleMenuStore } from '@/store/storeRoleMenu';

describe('storeRoleMenu', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize roleMenu as undefined', () => {
    const roleMenuStore = useRoleMenuStore();

    expect(roleMenuStore.roleMenu).toBeUndefined();
  });

  it('should allow updating roleMenu', () => {
    const roleMenuStore = useRoleMenuStore();

    const newRoleMenu = { name: 'Admin', permissions: ['read', 'write'] };
    roleMenuStore.roleMenu = newRoleMenu;

    expect(roleMenuStore.roleMenu).toEqual(newRoleMenu);
  });
});
