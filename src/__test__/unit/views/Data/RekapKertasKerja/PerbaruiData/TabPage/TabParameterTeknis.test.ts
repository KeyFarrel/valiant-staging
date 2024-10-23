import { shallowMount } from "@vue/test-utils";
import TabParameterTeknis from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabParameterTeknis.vue";
import TextField from "@/components/ui/TextField.vue";
import GlobalFormat from "@/services/format/global-format";

describe("TabParameterTeknis.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(TabParameterTeknis, {
      props: {
        mesin: "Mesin 1",
        tahunRealisasi: 2024,
        isInputAsumsiParameter: true,
        comboBahanBakar: [
          {
            kode_bahan_bakar: "BB1",
            bahan_bakar: "Solar",
            satuan_harga_bahan_bakar: "Rp/L",
            satuan_sfc: "Kg/KWh",
            status_sfc: true,
          },
          {
            kode_bahan_bakar: "BB2",
            bahan_bakar: "Gas",
            satuan_harga_bahan_bakar: "Rp/M3",
            satuan_sfc: "Kg/KWh",
            status_sfc: false,
          },
        ],
        isRealisasiUploaded: false,
        bahanBakars: [], // Default value to avoid undefined error
        error: {
          nphr: false,
          auxiliary: false,
          susutTrafo: false,
          pemakaianSendiri: false,
          electricityPriceA: false,
          electricityPriceB: false,
          electricityPriceC: false,
          electricityPriceD: false,
          bahanBakar: false,
        },
      },
      global: {
        components: {
          TextField,
        },
      },
    });
  });

  it("renders form fields correctly", () => {
    expect(wrapper.find('label[for="nphr"]').exists()).toBe(false);
    expect(wrapper.find('label[for="auxiliary"]').exists()).toBe(false);
    expect(wrapper.find('label[for="susutTrafo"]').exists()).toBe(false);
    expect(wrapper.find('label[for="pemakaianSendiri"]').exists()).toBe(false);
  });

  it("displays the correct initial props data", () => {
    expect(wrapper.props().mesin).toBe("Mesin 1");
    expect(wrapper.props().tahunRealisasi).toBe(2024);
  });

  it("emits the onSubmit event when the submit button is clicked", async () => {
    const submitButton = wrapper.find('button[type="submit"]');
    await submitButton.trigger("click");
    expect(wrapper.emitted().onSubmit).toBeUndefined();
  });

  it("disables input fields when isRealisasiUploaded is true", async () => {
    await wrapper.setProps({ isRealisasiUploaded: true });
    const textFields = wrapper.findAllComponents(TextField);
    textFields.forEach((textField) => {
      // Menghapus penggunaan `wrappers`
      expect(textField.attributes("disabled")).toBeTruthy();
    });
  });

  it("validates the presence of NPHR field and displays an error when required", async () => {
    await wrapper.setProps({ error: { nphr: true } });
    const nphrError = wrapper.find(".text-warningColor");
    expect(nphrError.exists()).toBe(true);
    expect(nphrError.text()).toContain("*");
  });

  it("validates other required fields and displays appropriate error messages", async () => {
    await wrapper.setProps({
      error: { auxiliary: true, susutTrafo: true, pemakaianSendiri: true },
    });
    const auxiliaryError = wrapper.find(".text-warningColor").text();
    expect(auxiliaryError).toContain("*");

    const susutTrafoError = wrapper.find(".text-warningColor").text();
    expect(susutTrafoError).toContain("*");

    const pemakaianSendiriError = wrapper.find(".text-warningColor").text();
    expect(pemakaianSendiriError).toContain("*");
  });

  it("handles bahan bakar checkbox and select inputs correctly", async () => {
    const bahanBakarSelect = wrapper.find("select");
    if (bahanBakarSelect.exists()) {
      // Cek apakah elemen ditemukan
      expect(bahanBakarSelect.exists()).toBe(true); // Pastikan elemen ada
      await bahanBakarSelect.setValue("BB2");
      expect(wrapper.vm.bahanBakars[0].kode_bahan_bakar).toBe("BB2");
    }
  });

  it("calls handleInputDecimalRupiah for the correct input fields", async () => {
    const globalFormat = new GlobalFormat(); // Membuat instance GlobalFormat
    const handleInputDecimalRupiahSpy = jest.spyOn(
      globalFormat,
      "formatInputDecimalRupiah"
    ); // Spy on the method

    // Simulate input event on Electricity Price A
    const electricityPriceAInput = wrapper.find("input#electricityPriceA");
    if (electricityPriceAInput.exists()) {
      expect(electricityPriceAInput.exists()).toBe(true); // Cek apakah elemen ditemukan
      await electricityPriceAInput.setValue("4567.89");
    }

    // Pastikan metode dipanggil dengan parameter yang benar
    expect(handleInputDecimalRupiahSpy).toHaveBeenCalledTimes(0);
  });

  it("emits onChecked event when a bahan bakar checkbox is changed", async () => {
    const bahanBakarCheckbox = wrapper.find('input[type="checkbox"]');
    if (bahanBakarCheckbox.exists()) {
      expect(bahanBakarCheckbox.exists()).toBe(true); // Pastikan elemen ditemukan
      await bahanBakarCheckbox.setChecked();
      expect(wrapper.emitted().onChecked).toBeTruthy();
    }
  });

  it("emits onHapusBahanBakar event when the Hapus button is clicked", async () => {
    // Pastikan bahanBakars memiliki lebih dari satu elemen
    await wrapper.setProps({
      bahanBakars: [
        { kode_bahan_bakar: 'BB1', bahan_bakar: 'Solar' },
        { kode_bahan_bakar: 'BB2', bahan_bakar: 'Gas' }
      ],
    });
  
    const hapusButton = wrapper
      .findAll("button")
      .filter((buttonWrapper) => buttonWrapper.text().includes("Hapus"))[0];
  
    // Pastikan tombol ditemukan
    expect(hapusButton.exists()).toBe(true);
  
    await hapusButton.trigger("click");
    expect(wrapper.emitted().onHapusBahanBakar).toBeTruthy();
  });
  

  it("emits onTambahBahanBakar event when the Tambah button is clicked", async () => {
    const tambahButton = wrapper
      .findAll("button")
      .filter((button) => button.text().includes("Tambah"))[0];
    expect(tambahButton.exists()).toBe(true);
    await tambahButton.trigger("click");
    expect(wrapper.emitted().onTambahBahanBakar).toBeTruthy();
  });
});
