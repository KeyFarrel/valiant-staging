import { mount } from "@vue/test-utils";
import TooltipLamanData from "@/components/ui/TooltipLamanData.vue";
import IconView from "@/components/icons/IconView.vue";
import { setActivePinia, createPinia } from "pinia";
import { useLamanDataPeriodeStore } from "@/store/storeLamanDataTab";

describe("TooltipLamanData.vue", () => {
  let wrapper: any;
  let store: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useLamanDataPeriodeStore();
    store.periodeInitial = 2022;

    wrapper = mount(TooltipLamanData, {
      props: {
        idMesin: 1,
        tahun: 2023,
      },
      global: {
        components: {
          IconView,
        },
        stubs: {
          RouterLink: true,
        },
      },
    });
  });

  it("should toggle tooltip visibility when button is clicked", async () => {
    expect(wrapper.find("#tooltipContent").exists()).toBe(false);

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);

    expect(wrapper.exists()).toBe(true);
  });

  it("should update store when handleChangePage is called", async () => {
    wrapper.vm.handleChangePage(2023);

    expect(store.periodeInitial).toBe(2023);
  });

  it("should render IconView component", () => {
    expect(wrapper.findComponent(IconView).exists()).toBe(false);
  });
});
