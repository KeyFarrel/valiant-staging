import { mount } from "@vue/test-utils";
import CardNotification from "@/components/ui/CardNotification.vue";

describe("CardNotification.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(CardNotification);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("renders the notification structure correctly", () => {
    const notificationDiv = wrapper.find("div.flex.flex-row.space-x-3");
    expect(notificationDiv.exists()).toBe(true);

    const indicators = notificationDiv.findAll("div.rounded-full");
    expect(indicators.length).toBe(2);
    expect(indicators.at(0)?.classes()).toContain("w-2");
    expect(indicators.at(0)?.classes()).toContain("h-2");
    expect(indicators.at(0)?.classes()).toContain("bg-[#2671D9]");
    expect(indicators.at(1)?.classes()).toContain("w-6");
    expect(indicators.at(1)?.classes()).toContain("h-6");
    expect(indicators.at(1)?.classes()).toContain("bg-warningColor");
  });

  it("renders the user action message correctly", () => {
    const userActionDiv = wrapper.find("div.text-sm.text-primaryTextColor");
    expect(userActionDiv.exists()).toBe(true);
    expect(userActionDiv.text()).toContain("User A menolak Laporan Kertas Kerja");
  });

  it("renders the date correctly", () => {
    const dateParagraph = wrapper.find("p.text-xs.text-[#989899]");
    expect(dateParagraph.exists()).toBe(true);
    expect(dateParagraph.text()).toBe("04/04/2023");
  });

  it("renders the detailed message correctly", () => {
    const detailedMessageDiv = wrapper.find("div.p-2.border.rounded-md");
    expect(detailedMessageDiv.exists()).toBe(true);

    const detailedMessageParagraph = detailedMessageDiv.find("p.text-sm.text-primaryTextColor");
    expect(detailedMessageParagraph.exists()).toBe(true);
    expect(detailedMessageParagraph.text()).toBe("Disesuaikan dengan Kertas Kerja");
  });
});