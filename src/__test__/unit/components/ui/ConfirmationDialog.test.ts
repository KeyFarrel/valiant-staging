import { mount } from "@vue/test-utils";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog.vue";

describe("ConfirmationDialog.vue", () => {
  it("renders title and subtitle correctly", () => {
    const props = {
      title: "Test Title",
      subtitle: "Test Subtitle",
      buttonTitle: "Accept",
    };

    const wrapper = mount(ConfirmationDialog, {
      props,
    });

    expect(wrapper.find("p.text-xl").text()).toBe(props.title);
    expect(wrapper.find("p.text-base").html()).toContain(props.subtitle);
  });

  it("emits onBatalClick when Batal button is clicked", async () => {
    const props = {
      title: "Test Title",
      subtitle: "Test Subtitle",
      buttonTitle: "Accept",
    };

    const wrapper = mount(ConfirmationDialog, {
      props,
    });

    await wrapper.vm.$emit("onBatalClick");

    expect(wrapper.emitted("onBatalClick")).toBeTruthy();
  });

  it("emits onAcceptClick when Accept button is clicked", async () => {
    const props = {
      title: "Test Title",
      subtitle: "Test Subtitle",
      buttonTitle: "Accept",
    };

    const wrapper = mount(ConfirmationDialog, {
      props,
    });

    await wrapper.vm.$emit("onAcceptClick");

    expect(wrapper.emitted("onAcceptClick")).toBeTruthy();
  });
});
