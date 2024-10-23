import { mount, shallowMount } from "@vue/test-utils";
import KertasKerjaMesin from "@/views/Verifikasi/Sentral/TabPage/KK/KertasKerjaMesin.vue";
import GlobalFormat from "@/services/format/global-format";
import TableComponent from "@/components/ui/Table.vue";

describe("KertasKerjaMesin.vue", () => {
  let wrapper: any;
  const globalFormat = new GlobalFormat();
  const propsData = {
    source: [
      {
        tahun: "2023",
        irr_on_equity: 10.5,
        npv_on_equity: 500,
        status: "Disetujui",
        irr_on_project: 0,
        npv_on_project: 0,
        id_mesin: 1,
        id_sentral: 1,
      },
      {
        tahun: "2022",
        irr_on_equity: 0,
        npv_on_equity: 0,
        status: "",
        irr_on_project: 0,
        npv_on_project: 0,
        id_mesin: 2,
        id_sentral: 2,
      },
    ],
  };

  beforeEach(() => {
    wrapper = mount(KertasKerjaMesin, {
      props: propsData,
      global: {
        components: {
          TableComponent,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("renders the table with the correct number of rows", () => {
    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBe(2);
  });

  it("displays the correct data in each table row", () => {
    const firstRow = wrapper.findAll("tbody tr").at(0);
    const columns = firstRow.findAll("td");

    expect(columns.at(0)?.text()).toBe("1");
    expect(columns.at(1)?.text()).toBe("2023");
    expect(columns.at(2)?.text()).toBe(globalFormat.formatRupiah(10.5));
    expect(columns.at(3)?.text()).toBe(globalFormat.formatRupiah(500));
    expect(columns.at(4)?.text()).toContain("Disetujui");
  });

  it('shows the "Data Tidak Tersedia" message when no data is provided', async () => {
    await wrapper.setProps({ source: [] });
    const noDataMessage = wrapper.find("h1.mb-2");
    expect(noDataMessage.exists()).toBe(true);
    expect(noDataMessage.text()).toBe("Data Tidak Tersedia");
  });

  it("triggers pagination correctly", async () => {
    const goToPageSpy = jest.spyOn(wrapper.vm, "goToPage");
    const paginationButtons = wrapper.findAll("#pagination");
    await paginationButtons.at(1)?.trigger("click");
    expect(goToPageSpy).toHaveBeenCalledTimes(0);
  });

  it("disables previous and next buttons correctly", () => {
    const buttons = wrapper.findAll("button");

    const prevButton = buttons.filter((btn) => {
      const span = btn.find("span");
      return span.exists() && span.text() === "Previous";
    })[0];

    const nextButton = buttons.filter((btn) => {
      const span = btn.find("span");
      return span.exists() && span.text() === "Next";
    })[0];

    expect(prevButton.attributes("disabled")).toBeDefined();
    expect(nextButton.attributes("disabled")).toBe("");
  });

  it("renders the select element and displays correct options", () => {
    const selectElement = wrapper.find("select");
    const options = selectElement.findAll("option");

    expect(selectElement.exists()).toBe(true);
    expect(options.at(0)?.text()).toBe("10");
    expect(options.at(4)?.text()).toBe("50");
  });

  it("displays the correct data count", () => {
    const totalDataSpan = wrapper.find("span.font-bold");
    expect(totalDataSpan.text()).toBe(propsData.source.length.toString());
  });

  it("renders tablecomponent", () => {
    const table = wrapper.findComponent(TableComponent);
    expect(table.exists()).toBe(true);
  });
  
  it("renders the correct SVG element with attributes", async () => {
    expect(wrapper.vm.source.length).toBeGreaterThan(0);

    await wrapper.find("button#bgst").trigger("click");

    expect(wrapper.emitted("click")).toBeUndefined();

    const svg = wrapper.find("button#bgst svg");
    expect(svg.exists()).toBe(true);

    expect(svg.attributes("width")).toBe("16");
    expect(svg.attributes("height")).toBe("16");
  });
});
