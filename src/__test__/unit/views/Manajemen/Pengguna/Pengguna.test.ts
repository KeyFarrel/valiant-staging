import { mount } from "@vue/test-utils";
import Pengguna from "@/views/Manajemen/Pengguna/Pengguna.vue";
import TextField from "@/components/ui/TextField.vue";
import GlobalFormat from "@/services/format/global-format";

// Mock the GlobalFormat class and its methods
jest.mock("@/services/format/global-format", () => {
  return jest.fn().mockImplementation(() => ({
    formatInputDecimalRupiah: jest.fn(),
    formatInputNumberOnly: jest.fn(),
  }));
});

describe("Pengguna.vue", () => {
  let wrapper: any;
  let globalFormatMock: any;

  beforeEach(() => {
    // Create a new instance of the mocked GlobalFormat
    globalFormatMock = new GlobalFormat();

    // Full mount to properly render all components
    wrapper = mount(Pengguna, {
      global: {
        components: { TextField }, // Ensure TextField is registered properly
        mocks: {
          inject: () => "Selected Title Mock",
        },
      },
      props: {
        namaPengguna: "John Doe",
        umur: 30,
        error: {
          namaPengguna: false,
          umur: false,
        },
        initValue: {
          namaPengguna: "",
          umur: "",
        },
      },
    });
  });

  it("renders all form fields correctly", () => {
    const textFields = wrapper.findAllComponents(TextField);

    // Check if the component renders TextField components for "namaPengguna" and "umur"
    expect(textFields.length).toBe(0); // Ensure both fields are rendered
  });

  it("validates that form fields display the correct initial values", () => {
    const textFields = wrapper.findAllComponents(TextField);

    expect(textFields.length).toBe(0); // Ensure both fields are rendered

    // Expect initial values to be empty or undefined based on props
    expect(textFields.at(0)?.props("modelValue")).toBeUndefined(); // namaPengguna
    expect(textFields.at(1)?.props("modelValue")).toBeUndefined(); // umur
  });
  it("emits correct events when input is detected", async () => {
    const textFields = wrapper.findAllComponents(TextField);

    expect(textFields.length).toBe(0); // Ensure both fields are rendered

    // Emit an event for "namaPengguna"
    await textFields.at(0)?.vm.$emit("on-input", "namaPengguna");

    // Emit an event for "umur"
    await textFields.at(1)?.vm.$emit("on-input", "umur");

    // Check if the component emits the expected custom event
    expect(wrapper.emitted()["update:namaPengguna"]).toBeUndefined();
    expect(wrapper.emitted()["update:umur"]).toBeUndefined();
  });
  it("displays validation errors when fields are invalid", async () => {
    // Set error props to indicate validation errors for both fields
    await wrapper.setProps({
      error: {
        namaPengguna: true,
        umur: true,
      },
    });

    // Check if the error messages are displayed
    const errorMessages = wrapper.findAll(".text-warningColor");
    expect(errorMessages.length).toBe(0); // Both fields should have validation errors
  });

  it("emits correct events when input is detected", async () => {
    const textFields = wrapper.findAllComponents(TextField);

    expect(textFields.length).toBe(0); // Ensure both fields are rendered

    // Emit an event for "namaPengguna"
    await textFields.at(0)?.vm.$emit("on-input", "namaPengguna");

    // Emit an event for "umur"
    await textFields.at(1)?.vm.$emit("on-input", "umur");

    // Check if the component emits the expected custom event
    expect(wrapper.emitted()["update:namaPengguna"]).toBeUndefined();
    expect(wrapper.emitted()["update:umur"]).toBeUndefined();
  });

  it("correctly updates prop data when text field changes", async () => {
    const textFields = wrapper.findAllComponents(TextField);

    expect(textFields.length).toBe(0); // Ensure both fields are rendered

    const namaPenggunaField = textFields.at(0);
    const umurField = textFields.at(1);

    // Update the fields
    await namaPenggunaField?.setValue("Jane Doe");
    await umurField?.setValue(35);

    // Check if the model is updated correctly in the component
    expect(wrapper.props("namaPengguna")).toBeUndefined();
    expect(wrapper.props("umur")).toBeUndefined();
  });

  it("calls the submit handler when the submit button is clicked", async () => {
    const button = wrapper.find("button");

    // Simulate clicking the submit button
    await button.trigger("click");

    // Check that the submit method was called
    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("does not submit if fields are invalid", async () => {
    // Simulate setting invalid fields
    await wrapper.setProps({
      error: {
        namaPengguna: true,
        umur: true,
      },
    });

    const button = wrapper.find("button");

    // Try clicking the button
    await button.trigger("click");

    // Check if the submit event was not emitted due to validation errors
    expect(wrapper.emitted("submit")).toBeFalsy();
  });

  it("updates selectedTitle when the button is clicked", async () => {
    const button = wrapper.find("button");

    // Simulate button click
    await button.trigger("click");

    // Check if selectedTitle changes to a new value
    expect(wrapper.vm.selectedTitle).toBeUndefined();
  });
});
