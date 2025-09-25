import { mount } from "@vue/test-utils";
import Pengguna from "@/views/Manajemen/Pengguna/Pengguna.vue";
import TextField from "@/components/ui/TextField.vue";
import UserService from "@/services/user-service";

// Mock Vue3Lottie component
const MockVue3Lottie = {
  name: 'Vue3Lottie',
  template: '<div class="mock-lottie"></div>'
};

// Mock UserService
jest.mock("@/services/user-service");
const mockUserService = UserService as jest.MockedClass<typeof UserService>;

describe("Pengguna.vue", () => {
  let wrapper: any;
  let mockUserServiceInstance: jest.Mocked<UserService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock UserService instance methods
    mockUserServiceInstance = {
      getUserData: jest.fn().mockResolvedValue({
        data: [],
        meta: {
          totalPages: 1,
          totalRecords: 0
        }
      }),
      getPembina: jest.fn().mockResolvedValue({
        data: []
      }),
      getLevel: jest.fn().mockResolvedValue({
        data: []
      }),
      getRole: jest.fn().mockResolvedValue({
        data: []
      }),
      getInduk: jest.fn().mockResolvedValue({
        data: []
      })
    } as any;
    
    mockUserService.mockImplementation(() => mockUserServiceInstance);
    
    wrapper = mount(Pengguna, {
      global: {
        components: {
          TextField,
          Vue3Lottie: MockVue3Lottie
        },
      },
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("is fetching fetchData", async () => {
    const fetchDataSpy = jest.spyOn(wrapper.vm, "fetchData");
    await wrapper.vm.fetchData();
    expect(fetchDataSpy).toHaveBeenCalled();
    expect(mockUserServiceInstance.getUserData).toHaveBeenCalled();
  });

  it("is fetching fetchPembina", async () => {
    const fetchPembinaSpy = jest.spyOn(wrapper.vm, "fetchPembina");
    await wrapper.vm.fetchPembina();
    expect(fetchPembinaSpy).toHaveBeenCalled();
    expect(mockUserServiceInstance.getPembina).toHaveBeenCalled();
  });

  // it("is fetching fetchData", async () => {
  //   const fetchDataSpy = jest.spyOn(wrapper.vm, "fetchData");
  //   await wrapper.vm.fetchData();
  //   expect(fetchDataSpy).toHaveBeenCalled();
  // });
});
