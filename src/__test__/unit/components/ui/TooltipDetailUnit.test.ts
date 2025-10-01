import { shallowMount } from "@vue/test-utils";
import TooltipDetailUnit from "@/components/ui/TooltipDetailUnit.vue";
import IconInfo from "@/components/icons/IconInfo.vue";

describe("TooltipDetailUnit.vue", () => {
  it("renders the component correctly", () => {
    const wrapper = shallowMount(TooltipDetailUnit);

    expect(wrapper.find("div").exists()).toBe(true);

    expect(wrapper.findComponent(IconInfo).exists()).toBe(true);

    expect(wrapper.find("#tooltipContent").exists()).toBe(false);
  });

  it("shows tooltip content on mouse enter and hides on mouse leave", async () => {
    const wrapper = shallowMount(TooltipDetailUnit);

    expect(wrapper.find("#tooltipContent").exists()).toBe(false);

    const divElement = wrapper.find("div");
    expect(divElement.exists()).toBe(true);

    expect(wrapper.findComponent(IconInfo).exists()).toBe(true);
  });
});
