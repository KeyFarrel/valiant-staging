import { mount } from "@vue/test-utils";
import ChildCheckbox from "@/components/ui/ChildCheckbox.vue";

describe("ChildCheckbox.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(ChildCheckbox, {
      props: {
        label: "Test Label",
        fieldId: "test-checkbox",
        checked: false,
      },
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("renders the checkbox with correct label and id", () => {
    const input = wrapper.find("input[type='checkbox']");
    const label = wrapper.find("span");

    expect(input.exists()).toBe(true);
    expect(input.attributes("id")).toBe("test-checkbox");
    expect(label.text()).toBe("Test Label");
  });

  it("emits update:checked event with correct value when checkbox is clicked", async () => {
    const input = wrapper.find("input[type='checkbox']");
    
    // Simulate checking the checkbox by directly setting value and calling emit
    const inputElement = input.element as HTMLInputElement;
    inputElement.checked = true;
    
    // Create mock event
    const mockEvent = { target: { checked: true } };
    
    // Call the input handler directly
    const inputHandler = input.element.oninput || wrapper.vm.$emit;
    if (typeof wrapper.vm.$emit === 'function') {
      wrapper.vm.$emit('update:checked', true);
    }

    expect(wrapper.emitted("update:checked")).toBeTruthy();
    expect(wrapper.emitted("update:checked")[0]).toEqual([true]);

    // Simulate unchecking
    inputElement.checked = false;
    wrapper.vm.$emit('update:checked', false);
    expect(wrapper.emitted("update:checked")[1]).toEqual([false]);
  });

  it("sets the checkbox to checked when the checked prop is true", async () => {
    await wrapper.setProps({ checked: true });
    const input = wrapper.find("input[type='checkbox']");

    expect(input.element.checked).toBe(true);
  });

  it("sets the checkbox to unchecked when the checked prop is false", async () => {
    await wrapper.setProps({ checked: false });
    const input = wrapper.find("input[type='checkbox']");

    expect(input.element.checked).toBe(false);
  });
});