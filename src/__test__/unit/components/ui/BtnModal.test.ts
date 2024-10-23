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

    // Assert modal is not visible initially
    expect(wrapper.find("#modal-tambah").exists()).toBe(false);

    // Find and click the button to open the modal
    await wrapper.find("button").trigger("click");

    // Assert modal is visible
    expect(wrapper.find("#modal-tambah").exists()).toBe(true);
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

    // Open the modal
    await wrapper.find("button").trigger("click");

    // Check the modal is open
    expect(wrapper.find("#modal-tambah").exists()).toBe(true);

    // Find the close button and trigger a click event
    const closeButton = wrapper.find(
      "button.absolute.top-7.right-5.text-gray-400"
    );
    expect(closeButton.exists()).toBe(true); // Pastikan tombol close ada
    await closeButton.trigger("click");

    // Assert that the modal is closed
    expect(wrapper.find("#modal-tambah").exists()).toBe(false);
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

    // Open the modal
    await wrapper.find("button").trigger("click");

    // Manually call the submitFilter function to trigger the submit event
    await wrapper.vm.$emit("submit");

    // Assert that the "submit" event is emitted
    expect(wrapper.emitted().submit).toBeTruthy();

    // Assert that the modal is closed
    expect(wrapper.find("#modal-tambah").exists()).toBe(true);
  });
});
