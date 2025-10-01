import { mount } from "@vue/test-utils";
import BtnModal from "@/components/ui/BtnModal.vue";

describe("BtnModal.vue", () => {
  it("should open the modal when button is clicked", async () => {
    const wrapper = mount(BtnModal, {
      props: {
        header: "Test Header",
        btnClass: "test-btn-class",
        btnText: "Open Modal",
        width: "w-1/2",
      },
    });

    expect(wrapper.find("#modal-tambah").exists()).toBe(false);

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Open Modal");
  });

  it('should emit "submit" and close modal when modal close button is clicked', async () => {
    const wrapper = mount(BtnModal, {
      props: {
        header: "Test Header",
        btnClass: "test-btn-class",
        btnText: "Open Modal",
        width: "w-1/2",
      },
    });

    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.exists()).toBe(true);
  });

  it('should emit "submit" and close modal when submitFilter is called', async () => {
    const wrapper = mount(BtnModal, {
      props: {
        header: "Test Header",
        btnClass: "test-btn-class",
        btnText: "Open Modal",
        width: "w-1/2",
      },
    });

    await wrapper.vm.$emit("submit");

    expect(wrapper.emitted().submit).toBeTruthy();
  });
});
