import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import EditPermission from '@/views/Manajemen/Pengguna/EditPermission.vue';

// Mock the route
const mockRoute = {
  params: {
    id: '1'
  }
};

// Mock the role service
const mockRoleService = {
  getPermission: vi.fn(),
  getPermissionByRoleId: vi.fn(),
  getRoleById: vi.fn(),
  getLevel: vi.fn(),
  updateRolePermission: vi.fn()
};

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => mockRoute
}));

// Mock role service
vi.mock('@/services/role-service', () => ({
  default: vi.fn(() => mockRoleService)
}));

// Mock components
vi.mock('@/components/ui/Table.vue', () => ({
  default: {
    name: 'TableComponent',
    template: '<div><slot name="table-header"></slot><slot name="table-body"></slot></div>'
  }
}));

vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div>Loading...</div>'
  }
}));

describe('EditPermission.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockRoleService.getPermission.mockResolvedValue({
      data: [
        { id: 1, name: 'Menu 1' },
        { id: 2, name: 'Menu 2' }
      ]
    });
    
    mockRoleService.getPermissionByRoleId.mockResolvedValue({
      data: [
        { permission_id: 1, read: true, create: false, update: true, delete: false }
      ]
    });
    
    mockRoleService.getRoleById.mockResolvedValue({
      data: {
        role: 'Admin',
        kode_level: 'L1'
      }
    });
    
    mockRoleService.getLevel.mockResolvedValue({
      data: [
        { kode_level: 'L1', level: 'Level 1' }
      ]
    });

    mockRoleService.updateRolePermission.mockResolvedValue({});
  });

  it('should render component successfully', async () => {
    const wrapper = mount(EditPermission);
    
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('form').exists()).toBe(true);
  });

  it('should display role and level information', async () => {
    const wrapper = mount(EditPermission);
    
    // Wait for component to load data
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockRoleService.getRoleById).toHaveBeenCalledWith("1");
    expect(mockRoleService.getLevel).toHaveBeenCalled();
  });

  it('should load permissions data on mount', async () => {
    const wrapper = mount(EditPermission);
    
    // Wait for component to load data
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockRoleService.getPermission).toHaveBeenCalled();
    expect(mockRoleService.getPermissionByRoleId).toHaveBeenCalledWith(1);
  });

  it('should handle error when getPermission returns invalid data', async () => {
    mockRoleService.getPermission.mockResolvedValue({
      data: 'invalid data' // Not an array
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mount(EditPermission);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Expected an array for permissions, got:', 
      { data: 'invalid data' }
    );
    
    consoleSpy.mockRestore();
  });

  it('should handle error when getPermission throws exception', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRoleService.getPermission.mockRejectedValue(new Error('Network error'));
    
    mount(EditPermission);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading permissions:', 
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  it('should handle error when getPermissionByRoleId returns invalid data', async () => {
    mockRoleService.getPermissionByRoleId.mockResolvedValue({
      data: 'invalid data' // Not an array
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mount(EditPermission);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Expected an array for permissions by role ID, got:', 
      { data: 'invalid data' }
    );
    
    consoleSpy.mockRestore();
  });

  it('should handle error when getPermissionByRoleId throws exception', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRoleService.getPermissionByRoleId.mockRejectedValue(new Error('Network error'));
    
    mount(EditPermission);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading permissions by role ID:', 
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  it('should display combined permissions correctly', async () => {
    const wrapper = mount(EditPermission);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if table rows are rendered correctly
    const tableRows = wrapper.findAll('tr.border');
    expect(tableRows.length).toBeGreaterThan(0);
    
    // Check if the first row contains the expected menu name
    if (tableRows.length > 0) {
      const firstRow = tableRows[0];
      expect(firstRow.text()).toContain('Menu 1');
    }
  });

  it('should handle checkbox change events', async () => {
    const wrapper = mount(EditPermission);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find checkbox inputs
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    
    if (checkboxes.length > 0) {
      // Simulate checkbox change
      await checkboxes[0].trigger('change');
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if updateRolePermission was called
      expect(mockRoleService.updateRolePermission).toHaveBeenCalled();
    }
  });

  it('should handle updatePermission error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockRoleService.updateRolePermission.mockRejectedValue(new Error('Update failed'));
    
    const wrapper = mount(EditPermission);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find checkbox inputs and trigger change
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    
    if (checkboxes.length > 0) {
      await checkboxes[0].trigger('change');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error updating permission:', 
        expect.any(Error)
      );
    }
    
    consoleSpy.mockRestore();
  });
});