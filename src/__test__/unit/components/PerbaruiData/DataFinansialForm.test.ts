import { mount } from "@vue/test-utils";
import DataFinansialForm from "@/components/PerbaruiData/DataFinansialForm.vue";
import TextField from "@/components/ui/TextField.vue";

describe("DataFinansialForm.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(DataFinansialForm, {
      global: {
        components: {
          TextField,
        },
      },
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("renders the correct label for Nama Program", () => {
    const label = wrapper.find("label[for='']");
    expect(label.exists()).toBe(true);
    expect(label.text()).toContain("Nama Program");
    expect(label.text()).toContain("2024");
  });

  it("renders the correct label for AI", () => {
    const label = wrapper.findAll("label").at(1);
    expect(label.exists()).toBe(true);
    expect(label.text()).toBe("AI");
  });

  it("renders TextField components with correct classes", () => {
    const textFields = wrapper.findAllComponents(TextField);
    expect(textFields.length).toBe(2);

    textFields.wrappers.forEach((textFieldWrapper) => {
      expect(textFieldWrapper.classes()).toContain("pl-9");
    });
  });

  it("renders Rp. labels with correct classes", () => {
    const rpLabels = wrapper.findAll("label.text-primaryColor");
    expect(rpLabels.length).toBe(2);

    rpLabels.wrappers.forEach((rpLabelWrapper) => {
      expect(rpLabelWrapper.classes()).toContain("absolute");
      expect(rpLabelWrapper.classes()).toContain("pl-3");
      expect(rpLabelWrapper.text()).toBe("Rp.");
    });
  });
});