import { mount } from "@vue/test-utils";
import Pengguna from "@/views/Manajemen/Pengguna/Pengguna.vue";
import TextField from "@/components/ui/TextField.vue";


describe("Pengguna.vue", () => {
  let wrapper: any;
  interface RoleItem {
    id: number;
    role: string;
  }

  beforeEach(() => {
    wrapper = mount(Pengguna, {
      global: {
        components: TextField,
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
  });

  it("is fetching fetchPembina", async () => {
    const fetchPembinaSpy = jest.spyOn(wrapper.vm, "fetchPembina");
    await wrapper.vm.fetchPembina();
    expect(fetchPembinaSpy).toHaveBeenCalled();
  });

  // it("is fetching fetchData", async () => {
  //   const fetchDataSpy = jest.spyOn(wrapper.vm, "fetchData");
  //   await wrapper.vm.fetchData();
  //   expect(fetchDataSpy).toHaveBeenCalled();
  // });
});
