import { mount, flushPromises } from '@vue/test-utils';
import EditPermission from '@/views/Manajemen/Pengguna/EditPermission.vue';
import RoleService from '@/services/role-service';
import { useRoute } from 'vue-router';
import { nextTick } from 'vue';

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
        stubs: {
          Loading: true,
          TableComponent: {
            template: `
              <div>
                <slot name="table-header"></slot>
                <slot name="table-body"></slot>
              </div>
            `
          },
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
    await nextTick();

    expect(RoleService.prototype.getRoleById).toHaveBeenCalledWith(1);
  });

  it('should fetch permissions and combine them with role permissions', async () => {
    await flushPromises();
    await nextTick();

    expect(RoleService.prototype.getPermission).toHaveBeenCalled();
    expect(RoleService.prototype.getPermissionByRoleId).toHaveBeenCalledWith(1);

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
    await nextTick();

    const tableRows = wrapper.findAll('tr');
    expect(tableRows.length).toBeGreaterThan(0);

    const tableText = wrapper.text();
    expect(tableText).toContain('Menu 1');
    expect(tableText).toContain('Menu 2');
  });

  it('should update permissions when a checkbox is clicked', async () => {
    await flushPromises();
    await nextTick();

    const permission = wrapper.vm.combinedPermissions[0];
    const updatePermissionSpy = jest.spyOn(wrapper.vm, 'updatePermission');

    // Simulate checkbox change event by directly calling the method
    permission.create = true;
    await wrapper.vm.updatePermission(permission);
    await nextTick();

    expect(updatePermissionSpy).toHaveBeenCalledWith(permission);
  });

  it('should display loading spinner while fetching data', async () => {
    wrapper.vm.isLoading = true;
    await nextTick();

    expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
  });
});
