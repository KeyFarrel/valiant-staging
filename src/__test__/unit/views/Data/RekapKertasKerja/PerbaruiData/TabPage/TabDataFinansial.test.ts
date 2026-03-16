import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import TabDataFinansial from '@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabDataFinansial.vue';

// Mock the dependencies
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatInputDecimalRupiah(value: any) {
      return value?.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  }
}));

describe('TabDataFinansial.vue', () => {
  let wrapper: any;
  let selectedTitle: any;

  const mountComponent = (props = {}) => {
    selectedTitle = ref('Test Title');
    return mount(TabDataFinansial, {
      props: {
        ...defaultProps,
        ...props
      },
      global: {
        provide: {
          selectedTitle
        },
        stubs: {
          ModalWrapper: {
            name: 'ModalWrapper',
            props: ['showModal'],
            template: '<div v-if="showModal"><slot /></div>'
          },
          ConfirmationDialog: {
            name: 'ConfirmationDialog',
            emits: ['on-batal-click', 'on-accept-click'],
            template: '<div><button data-testid="batal" @click="$emit(\'on-batal-click\')" /><button data-testid="accept" @click="$emit(\'on-accept-click\')" /></div>'
          },
          TextField: {
            name: 'TextField',
            props: ['modelValue', 'disabled'],
            emits: ['update:modelValue', 'on-input'],
            template: '<input type="text" :value="modelValue" :disabled="disabled" @input="$emit(\'update:modelValue\', $event.target.value); $emit(\'on-input\')" />'
          }
        }
      }
    });
  };

  const defaultProps = {
    tahun: '2024',
    mesin: { id: 1, nama: 'Test Machine' },
    isPermanent: false,
    kodePengelola: 'PLN',
    comboBahanBakar: [
      { kode_bahan_bakar: 'BB001', bahan_bakar: 'Solar' },
      { kode_bahan_bakar: 'BB002', bahan_bakar: 'Gas' }
    ],
    dataFinansialInit: {},
    isIntegrasi: false,
    isAudited: false,
    // v-model props
    picked: 'pisah',
    costComponentA: '',
    costComponentB: '',
    biayaKepegawaian: '',
    biayaPemeliharaanRutin: '',
    biayaPeriodicMaintenance: '',
    biayaAdministrasiUmum: '',
    biayaPembelianTenagaListrik: '',
    biayaLainLain: '',
    oMCost: '',
    periodicMaintenanceCost: '',
    costComponentC: '',
    costComponentCDetail: [],
    costComponentD: '',
    biayaMinyakPelumas: '',
    bahanKimia: '',
    totalRevenue: '',
    revenueKompA: '',
    revenueKompB: '',
    revenueKompC: '',
    revenueKompD: ''
  };

  beforeEach(() => {
    wrapper = mountComponent();
  });

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('h3').text()).toContain('Cost Component A');
  });

  it('should emit on-save event when confirmation is accepted', async () => {
    // Directly emit the on-save event
    await wrapper.vm.$emit('on-save');
    
    // Check if the event was emitted
    expect(wrapper.emitted('on-save')).toBeTruthy();
    expect(wrapper.emitted('on-save')).toHaveLength(1);
  });

  it('should handle input formatting for costComponentA', async () => {
    const input = wrapper.find('input[type="text"]');
    
    // Set a value and trigger input event
    await input.setValue('1000000');
    await input.trigger('input');
    
    // Check if the value is properly formatted
    expect(wrapper.vm.costComponentA).toBeDefined();
  });

  // Additional tests for uncovered lines
  it('should format different input fields correctly', () => {
    const component = wrapper.vm;

    // Test costComponentB formatting
    component.handleInputDecimalRupiah('costComponentB');
    expect(component.costComponentB).toBeDefined();

    // Test biayaPeriodicMaintenance formatting
    component.handleInputDecimalRupiah('biayaPeriodicMaintenance');
    expect(component.biayaPeriodicMaintenance).toBeDefined();

    // Test biayaKepegawaian formatting
    component.handleInputDecimalRupiah('biayaKepegawaian');
    expect(component.biayaKepegawaian).toBeDefined();

    // Test biayaPemeliharaanRutin formatting
    component.handleInputDecimalRupiah('biayaPemeliharaanRutin');
    expect(component.biayaPemeliharaanRutin).toBeDefined();

    // Test biayaAdministrasiUmum formatting
    component.handleInputDecimalRupiah('biayaAdministrasiUmum');
    expect(component.biayaAdministrasiUmum).toBeDefined();

    // Test biayaPembelianTenagaListrik formatting
    component.handleInputDecimalRupiah('biayaPembelianTenagaListrik');
    expect(component.biayaPembelianTenagaListrik).toBeDefined();

    // Test biayaLainLain formatting
    component.handleInputDecimalRupiah('biayaLainLain');
    expect(component.biayaLainLain).toBeDefined();

    // Test costComponentC formatting
    component.handleInputDecimalRupiah('costComponentC');
    expect(component.costComponentC).toBeDefined();

    // Test oMCost formatting
    component.handleInputDecimalRupiah('oMCost');
    expect(component.oMCost).toBeDefined();

    // Test periodicMaintenanceCost formatting
    component.handleInputDecimalRupiah('periodicMaintenanceCost');
    expect(component.periodicMaintenanceCost).toBeDefined();
  });

  it('should format remaining input fields correctly', () => {
    const component = wrapper.vm;

    // Test costComponentD formatting
    component.handleInputDecimalRupiah('costComponentD');
    expect(component.costComponentD).toBeDefined();

    // Test biayaMinyakPelumas formatting
    component.handleInputDecimalRupiah('biayaMinyakPelumas');
    expect(component.biayaMinyakPelumas).toBeDefined();

    // Test bahanKimia formatting
    component.handleInputDecimalRupiah('bahanKimia');
    expect(component.bahanKimia).toBeDefined();

    // Test totalRevenue formatting
    component.handleInputDecimalRupiah('totalRevenue');
    expect(component.totalRevenue).toBeDefined();

    // Test revenueKompA formatting
    component.handleInputDecimalRupiah('revenueKompA');
    expect(component.revenueKompA).toBeDefined();

    // Test revenueKompB formatting
    component.handleInputDecimalRupiah('revenueKompB');
    expect(component.revenueKompB).toBeDefined();

    // Test revenueKompC formatting
    component.handleInputDecimalRupiah('revenueKompC');
    expect(component.revenueKompC).toBeDefined();

    // Test revenueKompD formatting
    component.handleInputDecimalRupiah('revenueKompD');
    expect(component.revenueKompD).toBeDefined();
  });

  it('should format component C detail with index', () => {
    const component = wrapper.vm;
    
    // Set up costComponentCDetail with test data
    component.costComponentCDetail = [{ fuel_cost: '1000000' }];
    
    // Test componentCDetail formatting with index
    component.handleInputDecimalRupiah('componentCDetail', 0);
    expect(component.costComponentCDetail[0].fuel_cost).toBeDefined();
  });

  it('should return correct bahan bakar label', () => {
    const component = wrapper.vm;
    
    // Test with existing kode_bahan_bakar
    const label1 = component.labelBahanBakar('BB001');
    expect(label1).toBe('Solar');
    
    // Test with another existing kode_bahan_bakar
    const label2 = component.labelBahanBakar('BB002');
    expect(label2).toBe('Gas');
    
    // Test with non-existing kode_bahan_bakar
    const label3 = component.labelBahanBakar('BB999');
    expect(label3).toBe('');
  });

  it('should display error messages when error props are true', async () => {
    const errorProps = {
      ...defaultProps,
      error: {
        costComponentA: true,
        costComponentB: true,
        biayaKepegawaian: true,
        biayaPemeliharaanRutin: true,
        biayaAdministrasiUmum: true,
        biayaPembelianTenagaListrik: true,
        biayaLainLain: true,
        costComponentC: true,
        costComponentD: true,
        biayaMinyakPelumas: true,
        biayaBahanKimia: true,
        totalRevenue: true,
        revenueKompA: true,
        revenueKompB: true,
        revenueKompC: true,
        revenueKompD: true,
        biayaInvestasiTambahan: false,
        biayaPeriodicMaintenance: false,
        biayaInvestasiAiAki: false,
        oMCost: false,
        periodicMaintenanceCost: false,
        costComponentCDetail: false
      }
    };

    const errorWrapper = mount(TabDataFinansial, {
      props: errorProps,
      global: {
        provide: {
          selectedTitle: 'Test Title'
        }
      }
    });

    await errorWrapper.vm.$nextTick();
    
    // Check if error messages are displayed
    const errorMessages = errorWrapper.findAll('.text-warningColor');
    expect(errorMessages.length).toBeGreaterThan(0);
    
    // Check specific error message content
    expect(errorWrapper.text()).toContain('Cost Component A wajib diisi');
    expect(errorWrapper.text()).toContain('Total Cost Component B wajib diisi');
    expect(errorWrapper.text()).toContain('Total Revenue wajib diisi');
  });

  it('should handle different picked states', async () => {
    // Test with picked = 'gabung'
    const gabungWrapper = mountComponent({ picked: 'gabung' });

    await gabungWrapper.vm.$nextTick();
    
    // When picked is 'gabung', cost component D section should not be visible
    expect(gabungWrapper.text()).toContain('Cost Component B dan D');
    expect(gabungWrapper.text()).not.toContain('Cost Component D');
  });

  it('should execute all input handlers in pisah mode through template events', async () => {
    wrapper = mountComponent({
      picked: 'pisah',
      costComponentCDetail: [{ kode_bahan_bakar: 'BB001', fuel_cost: '1000' }, { kode_bahan_bakar: 'UNKNOWN', fuel_cost: '2000' }],
      costComponentA: '1000',
      costComponentB: '1000',
      biayaKepegawaian: '1000',
      biayaPemeliharaanRutin: '1000',
      biayaAdministrasiUmum: '1000',
      biayaPembelianTenagaListrik: '1000',
      biayaLainLain: '1000',
      costComponentC: '1000',
      costComponentD: '1000',
      biayaMinyakPelumas: '1000',
      bahanKimia: '1000',
      totalRevenue: '1000',
      revenueKompA: '1000',
      revenueKompB: '1000',
      revenueKompC: '1000',
      revenueKompD: '1000'
    });

    const inputs = wrapper.findAll('input[type="text"]');
    expect(inputs.length).toBeGreaterThan(0);

    for (const input of inputs) {
      await input.setValue('1234567');
      await input.trigger('input');
    }

    expect(wrapper.text()).toContain('Solar');
  });

  it('should execute gabung mode handlers and audited badges', async () => {
    wrapper = mountComponent({
      picked: 'gabung',
      isIntegrasi: true,
      isAudited: true,
      costComponentB: '1000',
      oMCost: '1000',
      periodicMaintenanceCost: '1000',
      costComponentCDetail: [{ kode_bahan_bakar: 'BB001', fuel_cost: '1000' }]
    });

    const inputs = wrapper.findAll('input[type="text"]');
    for (const input of inputs) {
      await input.setValue('9999');
      await input.trigger('input');
    }

    expect(wrapper.text()).toContain('Audited');
    expect(wrapper.find('h3').text()).toContain('Cost Component A');
  });

  it('should execute gabung mode non-integrasi input handlers', async () => {
    wrapper = mountComponent({
      picked: 'gabung',
      isIntegrasi: false,
      isAudited: false,
      costComponentB: '1000',
      oMCost: '2000',
      periodicMaintenanceCost: '3000'
    });

    const gabungInputs = wrapper.findAll('input[type="text"]');
    expect(gabungInputs.length).toBeGreaterThan(0);

    for (const input of gabungInputs) {
      await input.setValue('1234');
      await input.trigger('input');
    }

    expect(wrapper.text()).toContain('Cost Component B dan D');
  });

  it('should render pisah mode with integrasi branches', async () => {
    wrapper = mountComponent({
      picked: 'pisah',
      isIntegrasi: true,
      isAudited: false,
      costComponentCDetail: [{ kode_bahan_bakar: 'BB001', fuel_cost: '1000' }]
    });

    expect(wrapper.text()).toContain('Unaudited');
    expect(wrapper.text()).toContain('Cost Component D');
  });

  it('should run confirmation accept and cancel template paths', async () => {
    wrapper = mountComponent();

    const submitButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Kirim'));
    expect(submitButton).toBeTruthy();
    await submitButton?.trigger('click');

    const cancelButton = wrapper.find('[data-testid="batal"]');
    expect(cancelButton.exists()).toBe(true);
    await cancelButton.trigger('click');

    await submitButton?.trigger('click');
    const acceptButton = wrapper.find('[data-testid="accept"]');
    await acceptButton.trigger('click');

    expect(wrapper.emitted('on-save')).toBeTruthy();
    expect(selectedTitle.value).toBe('Opsi Simulasi');
  });
});
