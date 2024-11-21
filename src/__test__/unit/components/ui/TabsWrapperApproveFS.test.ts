import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia"; // Import Pinia
import TabsWrapperApproveFS from "@/components/ui/TabsWrapperApproveFS.vue";
import TabItem from "@/components/ui/TabItem.vue";

describe("TabsWrapperApproveFS.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    // Ganti mount dengan mount untuk pengujian mendalam
    wrapper = mount(TabsWrapperApproveFS, {
      global: {
        plugins: [pinia],
        components: {
          TabItem,
        },
      },
      props: {
        isLihatGrafik: true,
        photo: "some-photo-url",
        lamanData: false,
        idMesin: "123",
        tahunGrafik: 2024,
        irrOnProject: 12.5,
        irrOnEquity: 11.5,
        npvOnEquity: 1000000,
        npvOnProject: 900000,
        averageNcf: 500000,
        averageEaf: 85,
        waccOnProject: 7.5,
        waccOnEquity: 6.5,
        namaMesin: "Mesin Test",
        namaPengelola: "Pengelola Test",
        namaPembina: "Pembina Test",
        dayaTerpasang: 1000,
        dayaMampu: 900,
        tahunPerolehanData: "2020",
        tahunOperasi: "2019",
        jumlahMesin: 2,
        statusGrafik: "Menunggu Persetujuan",
        tahun: 2023,
        nilaiAssetAwal: 5000000,
      },
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount(); // Bersihkan setelah setiap pengujian
    }
  });

  it("should render tabs correctly", () => {
    const tabs = wrapper.findAllComponents(TabItem);
    expect(tabs.length).toBeGreaterThan(0); // Pastikan ada tab-item
  });

  it("should show the correct title in the first tab", () => {
    const tabs = wrapper.findAllComponents(TabItem);
    expect(tabs.length).toBeGreaterThan(0); // Pastikan ada tab-item sebelum akses
    const firstTab = tabs.at(0);
    expect(firstTab).not.toBeUndefined(); // Pastikan tab tidak undefined
    expect(firstTab.props("title")).toBe("Asumsi Makro");
  });

  it("should change the selected tab when clicked", async () => {
    const tabs = wrapper.findAllComponents(TabItem);
    expect(tabs.length).toBeGreaterThan(1); // Pastikan ada lebih dari satu tab
    const secondTab = tabs.at(1);
    expect(secondTab).not.toBeUndefined(); // Pastikan tab kedua tidak undefined
    await secondTab.trigger("click");
    expect(wrapper.vm.selectedTab).toBe("Parameter Teknis & Finansial");
  });

  it("should render content based on the selected tab", async () => {
    wrapper.setData({ selectedTab: "Asumsi Makro" });
    await wrapper.vm.$nextTick();

    const content = wrapper.findComponent({ name: "AsumsiMakro" });
    expect(content.exists()).toBe(true);

    wrapper.setData({ selectedTab: "Parameter Teknis & Finansial" });
    await wrapper.vm.$nextTick();

    const contentTeknis = wrapper.findComponent({ name: "ParameterTeknis" });
    expect(contentTeknis.exists()).toBe(true);
  });

  it("should render the correct data for the active tab", async () => {
    wrapper.setData({ selectedTab: "Asumsi Makro" });
    await wrapper.vm.$nextTick();

    const content = wrapper.findComponent({ name: "AsumsiMakro" });
    expect(content.props("corporateTaxRate")).toBe(wrapper.vm.asumsiMakro.corporate_tax_rate);
  });

  it("should render the correct props for TabsWrapperApproveFS", () => {
    expect(wrapper.props("idMesin")).toBe("123");
    expect(wrapper.props("tahunGrafik")).toBe(2024);
    expect(wrapper.props("irrOnProject")).toBe(12.5);
    expect(wrapper.props("waccOnProject")).toBe(7.5);
  });

  it("should pass the correct props to the child TabItem components", () => {
    const tabItem = wrapper.findComponent(TabItem);
    expect(tabItem.props("idMesin")).toBe("123");
    expect(tabItem.props("tahunGrafik")).toBe(2024);
  })

  it('should render li element with class items-end content-end justify-end ml-auto justify-items-end when isLihatGrafik is true', () => {
    const li = wrapper.find('li.items-end.content-end.justify-end.ml-auto.justify-items-end');
    expect(li.exists()).toBe(true);
  });

  it('should not render li element with class items-end content-end justify-end ml-auto justify-items-end when isLihatGrafik is false', async () => {
    await wrapper.setProps({ isLihatGrafik: false });
    const li = wrapper.find('li.items-end.content-end.justify-end.ml-auto.justify-items-end');
    expect(li.exists()).toBe(false);
  });
});
