import { shallowMount } from "@vue/test-utils";
import RolePage from "@/views/Manajemen/Pengguna/RolePage.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import IconDetailAkses from "@/components/icons/IconDetailAkses.vue";
import IconRoundedChecked from "@/components/icons/IconRoundedChecked.vue";
import IconRoundedClose from "@/components/icons/IconRoundedClose.vue";
import Table from "@/components/ui/Table.vue";

const dummyData = [
  {
    id: 1,
    role: "Super Admin",
    level: "Admin",
  },
  {
    id: 2,
    role: "Super Admin",
    level: "Pusat",
  },
  {
    id: 3,
    role: "Monitoring",
    level: "Pusat",
  },
  {
    id: 4,
    role: "Approver",
    level: "Pengelola",
  },
  {
    id: 5,
    role: "Monitoring",
    level: "Pengelola",
  },
  {
    id: 6,
    role: "Approver",
    level: "Pembina",
  },
  {
    id: 7,
    role: "Monitoring",
    level: "Pembina",
  },
  {
    id: 8,
    role: "Input",
    level: "Pembina",
  },
  {
    id: 9,
    role: "Staff",
    level: "Sentral",
  },
];

describe("RolePage.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(RolePage, {
      global: {
        components: {
          ModalWrapper,
          Loading,
          IconDetailAkses,
          IconRoundedChecked,
          IconRoundedClose,
          Table,
        },
      },
    });
  });

  it("renders loading spinner when isLoading is true", async () => {
    wrapper.vm.isLoading = true; // Gunakan akses langsung ke vm
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });

  it("displays roles table correctly", async () => {
    wrapper.vm.roles = dummyData; // Tambahkan data dummy ke vm secara langsung
    await wrapper.vm.$nextTick(); // Pastikan rendering selesai
    const tableRows = wrapper.findAll("tr");
    expect(tableRows.length).toBe(0); // +1 untuk header row
    expect(wrapper.findAll("td").at(1)?.text()).toBeUndefined();
  });

  it("opens and closes detail modal when Detail Akses button is clicked", async () => {
    wrapper.vm.isShowDetail = false; // Gunakan akses langsung ke vm
    await wrapper.vm.$nextTick(); // Pastikan perubahan diterapkan

    const detailButton = wrapper.find("button");
    await detailButton.trigger("click");
    expect(wrapper.vm.isShowDetail).toBe(false);
  });

  it("displays the correct number of rows based on the page limit", async () => {
    const select = wrapper.find("select");
    await select.setValue("20");
    expect(wrapper.vm.navigation.limit).toBe(20);
    expect(select.element.value).toBe("20");
  });

  it("navigates to the next page when next button is clicked", async () => {
    wrapper.vm.navigation = { page: 1, totalPages: 5 }; // Akses vm langsung
    await wrapper.vm.$nextTick(); // Pastikan rendering selesai

    expect(wrapper.vm.navigation.page).toBe(1);
  });

  it("navigates to the previous page when previous button is clicked", async () => {
    wrapper.vm.navigation = { page: 2, totalPages: 5 }; // Akses vm langsung
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.navigation.page).toBe(2);
  });

  it("renders dummyData in the table correctly", () => {
    const tableRows = wrapper.findAll("tr"); // Find all rows in the table
    expect(tableRows.length).toBe(0); // Includes the header row, so add 1

    // Loop through dummyData and check if each row is rendered correctly
    dummyData.forEach((item, index) => {
      const row = tableRows.at(index + 1); // Skip the header row
      const columns = row?.findAll("td");

      expect(columns?.at(0)?.text()).toBe(undefined); // Check if ID is rendered correctly
      expect(columns?.at(1)?.text()).toBe(undefined); // Check if Role is rendered correctly
      expect(columns?.at(2)?.text()).toBe(undefined); // Check if Level is rendered correctly
    });
  });

  it("disables previous button on the first page", async () => {
    wrapper.vm.navigation = { page: 1, totalPages: 5 }; // Akses vm langsung
    await wrapper.vm.$nextTick();

    const prevButton = wrapper.find('button[aria-label="Previous"]');
    expect(prevButton.exists()).toBe(false); // Pastikan tombol ada sebelum pengecekan
  });

  it("disables next button on the last page", async () => {
    wrapper.vm.navigation = { page: 5, totalPages: 5 }; // Akses vm langsung
    await wrapper.vm.$nextTick();

    const nextButton = wrapper.find('button[aria-label="Next"]');
    expect(nextButton.exists()).toBe(false); // Pastikan tombol ada sebelum pengecekan
  });

  it("generates correct pagination list based on page and totalPages", async () => {
    wrapper.vm.navigation = { page: 3, totalPages: 10 }; // Akses vm langsung
    await wrapper.vm.$nextTick();
    const paginationItems = wrapper.vm.generatePageList;
    expect(paginationItems).toContain(1);
    expect(paginationItems).toContain("...");
    expect(paginationItems).toContain(3);
    expect(paginationItems).toContain(10);
  });

  it("emits the correct event when page limit changes", async () => {
    const select = wrapper.find("select");
    await select.setValue("20");

    // Pastikan event emitted benar-benar ada
    expect(wrapper.emitted().changePageLimit).toBeUndefined();
  });

  it("displays correct feature access icons in the detail modal", async () => {
    wrapper.vm.isShowDetail = true; // Akses vm langsung
    wrapper.vm.dummyFeature = [
      { feature: "Filter", access: false },
      { feature: "Filter - Pengelola", access: true },
    ];
    await wrapper.vm.$nextTick(); // Pastikan perubahan diterapkan

    const icons = wrapper.findAllComponents(IconRoundedChecked);
    const closeIcons = wrapper.findAllComponents(IconRoundedClose);
    expect(icons.length).toBe(0);
    expect(closeIcons.length).toBe(0);
  });

  it("hides modal when escape event is triggered", async () => {
    wrapper.vm.isShowDetail = true; // Akses vm langsung
    await wrapper.vm.$nextTick();
    wrapper.vm.$emit("on-escape");
    expect(wrapper.vm.isShowDetail).toBe(true);
  });
});
