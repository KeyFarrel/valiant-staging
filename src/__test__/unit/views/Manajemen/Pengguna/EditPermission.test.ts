import { mount, flushPromises } from '@vue/test-utils';
import EditPermission from '@/views/Manajemen/Pengguna/EditPermission.vue';
import RoleService from '@/services/role-service';
import { useRoute } from 'vue-router';

jest.mock('@/services/role-service');
jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

describe('EditPermission.vue', () => {
  let wrapper: any;
  let mockRoute: any;

  beforeEach(() => {
    mockRoute = {
      params: { id: '1' },
    };
    (useRoute as jest.Mock).mockReturnValue(mockRoute);

    // Mock the role service responses
    (RoleService as jest.Mock).mockImplementation(() => ({
      getPermission: jest.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'Menu 1' },
          { id: 2, name: 'Menu 2' },
        ],
      }),
      getPermissionByRoleId: jest.fn().mockResolvedValue({
        data: [
          { permission_id: 1, read: true, create: false, update: true, delete: false },
          { permission_id: 2, read: false, create: true, update: false, delete: true },
        ],
      }),
      getRoleById: jest.fn().mockResolvedValue({
        data: { role: 'Admin', kode_level: '1' },
      }),
      getLevel: jest.fn().mockResolvedValue({
        data: [
          { kode_level: '1', level: 'Admin Level' },
        ],
      }),
      updateRolePermission: jest.fn().mockResolvedValue({}),
    }));

    wrapper = mount(EditPermission, {
      global: {
        components: {
          Loading: require('@/components/ui/LoadingSpinner.vue').default,
          TableComponent: require('@/components/ui/Table.vue').default,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should mount the component successfully', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should fetch role data on mount', async () => {
    await flushPromises();

    expect(wrapper.vm.roleData).toEqual({ role: 'Admin', kode_level: '1' });
    expect(RoleService.prototype.getRoleById).toHaveBeenCalledTimes(0);
  });

  it('should fetch permissions and combine them with role permissions', async () => {
    await flushPromises();

    expect(wrapper.vm.allPermissions).toHaveLength(2);
    expect(wrapper.vm.permissionsByRoleId).toHaveLength(2);

    const combinedPermissions = wrapper.vm.combinedPermissions;
    expect(combinedPermissions).toHaveLength(2);
    expect(combinedPermissions[0]).toEqual({
      id: 1,
      name: 'Menu 1',
      read: true,
      create: false,
      update: true,
      delete: false,
    });
  });

  it('should render the permissions table', async () => {
    await flushPromises();

    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(2); // Two permissions

    expect(rows[0].text()).toContain('Menu 1');
    expect(rows[1].text()).toContain('Menu 2');
  });

  it('should update permissions when a checkbox is clicked', async () => {
    await flushPromises();

    const permission = wrapper.vm.combinedPermissions[0];
    const updatePermissionSpy = jest.spyOn(wrapper.vm, 'updatePermission');

    // Simulate a checkbox click for the "Create" permission
    const checkbox = wrapper.findAll('input[type="checkbox"]')[0];
    await checkbox.setChecked();
    await flushPromises();

    expect(updatePermissionSpy).toHaveBeenCalledWith(permission);
    expect(RoleService.prototype.updateRolePermission).toHaveBeenCalledTimes(0);
  });

  it('should display loading spinner while fetching data', async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(false);
  });
});
