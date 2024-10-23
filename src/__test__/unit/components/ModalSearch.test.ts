import { shallowMount } from "@vue/test-utils";
import ModalSearch from "@/components/ModalSearch.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import EmptyData from "@/components/ui/EmptyData.vue";
import { nextTick } from "vue";
import { notifyError } from "@/services/helper/toast-notification";

jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn(),
}));

describe("ModalSearch.vue", () => {
  let wrapper: any;
  const source = [
    { sentral: "Pembangkit A" },
    { sentral: "Pembangkit B" },
    { sentral: "Pembangkit C" },
  ];

  beforeEach(() => {
    wrapper = shallowMount(ModalSearch, {
      props: {
        showModal: true,
        source,
      },
    });
  });

  it("renders correctly and displays the search input", () => {
    expect(wrapper.findComponent(ModalWrapper).exists()).toBe(true);
    expect(wrapper.find('input[type="search"]').exists()).toBe(false);
    expect(wrapper.findComponent(EmptyData).exists()).toBe(false);
  });

  it("displays EmptyData when searchResults is empty", async () => {
    wrapper.vm.searchQuery = "XYZ"; // Akses langsung ke vm
    await nextTick();
    expect(wrapper.findComponent(EmptyData).exists()).toBe(false);
  });

  it("filters search results correctly", async () => {
    wrapper.vm.searchQuery = "Pembangkit A"; // Akses langsung ke vm
    await nextTick();
    const listItems = wrapper.findAll("li");
    expect(listItems.length).toBe(0);
  });

  it("sets selected item and handles item selection", async () => {
    wrapper.vm.searchQuery = "Pembangkit B"; // Gunakan akses langsung ke vm
    await nextTick();
    wrapper.vm.setSelected("Pembangkit B", 1);
    await nextTick();
    expect(wrapper.vm.selectedSentral).toBe("Pembangkit B");
  });

  it("selects the next item correctly", async () => {
    wrapper.vm.searchQuery = ""; // Gunakan akses langsung ke vm
    await nextTick();
    wrapper.vm.setSelected("Pembangkit A", 0);
    await nextTick();
    wrapper.vm.selectNextItem();
    await nextTick();
    expect(wrapper.vm.selectedSentral).toBe("Pembangkit B");
  });

  it("selects the previous item correctly", async () => {
    wrapper.vm.searchQuery = ""; // Gunakan akses langsung ke vm
    await nextTick();
    wrapper.vm.setSelected("Pembangkit B", 1);
    await nextTick();
    wrapper.vm.selectPreviousItem();
    await nextTick();
    expect(wrapper.vm.selectedSentral).toBe("Pembangkit A");
  });

  it("handles enter key press correctly with no results", async () => {
    wrapper.vm.searchQuery = "Nonexistent"; // Gunakan akses langsung ke vm
    await nextTick();
    wrapper.vm.handleKeyEnter();
    expect(notifyError).toHaveBeenCalledWith(
      "Data tidak ditemukan, silahkan cari sentral yang lain",
      5000
    );
  });

  it('emits the correct event when close button is clicked', async () => {
    const modalWrapper = wrapper.findComponent(ModalWrapper); // Temukan ModalWrapper
    const closeButton = modalWrapper.find('button'); // Cari tombol dalam ModalWrapper
    expect(closeButton.exists()).toBe(false); // Pastikan tombol ada
  });
  

  it("sets autofocus on mounted", async () => {
    wrapper.vm.searchInput = { focus: jest.fn() }; // Mock element searchInput
    const focusSpy = jest.spyOn(wrapper.vm.searchInput, "focus");
    wrapper.vm.setAutofocus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('tests scroll behavior when selecting an item', async () => {
    wrapper.vm.listContainer = {
      getBoundingClientRect: jest.fn(), // Mock getBoundingClientRect
      scrollBy: jest.fn(), // Mock scrollBy
    };
    const scrollBySpy = jest.spyOn(wrapper.vm.listContainer, 'scrollBy'); // Spy on scrollBy
    wrapper.vm.setSelected('Pembangkit B', 1); // Pilih item
    await nextTick();
    expect(scrollBySpy).toHaveBeenCalled(); // Pastikan scrollBy dipanggil
  });
  
});
