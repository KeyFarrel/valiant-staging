import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AsumsiMakro from '@/components/ui/AsumsiMakro.vue';

describe('AsumsiMakro', () => {
  const defaultProps = {
    isFetchingError: false,
    corporateTaxRate: 25,
    discountRate: 10,
    interestRate: 8,
    loanTenor: 15,
    loanPortion: 70,
    equityPortion: 30,
    selectedYear: 2024
  };

  it('should render component with data when props are provided', () => {
    const wrapper = mount(AsumsiMakro, {
      props: defaultProps
    });

    expect(wrapper.find('.text-base.font-bold').text()).toBe('Asumsi Makro');
    expect(wrapper.text()).toContain('Corporate Tax Rate');
    expect(wrapper.text()).toContain('Equity Portion');
  });

  it('should display formatted values correctly', () => {
    const wrapper = mount(AsumsiMakro, {
      props: defaultProps
    });

    expect(wrapper.text()).toContain('25');
    expect(wrapper.text()).toContain('10');
    expect(wrapper.text()).toContain('30');
  });

  it('should show selected year when provided', () => {
    const wrapper = mount(AsumsiMakro, {
      props: {
        ...defaultProps,
        selectedYear: 2025
      }
    });

    expect(wrapper.text()).toContain('Periode');
    expect(wrapper.text()).toContain('2025');
  });

  it('should show ReloadComponent when isFetchingError is true and required props are missing', () => {
    const wrapper = mount(AsumsiMakro, {
      props: {
        isFetchingError: true,
        corporateTaxRate: '',
        discountRate: 10,
        interestRate: 8,
        loanTenor: 15,
        loanPortion: 70,
        equityPortion: '',
        selectedYear: 2024
      }
    });

    expect(wrapper.findComponent({ name: 'ReloadComponent' }).exists()).toBe(true);
  });

  it('should emit onClickReload when ReloadComponent emits on-clicks', async () => {
    const wrapper = mount(AsumsiMakro, {
      props: {
        isFetchingError: true,
        corporateTaxRate: '',
        discountRate: 10,
        interestRate: 8,
        loanTenor: 15,
        loanPortion: 70,
        equityPortion: '',
        selectedYear: 2024
      }
    });

    const reloadComponent = wrapper.findComponent({ name: 'ReloadComponent' });
    await reloadComponent.vm.$emit('on-clicks');

    expect(wrapper.emitted('onClickReload')).toBeTruthy();
  });

  it('should emit onKeyDown when ReloadComponent emits on-key-down', async () => {
    const wrapper = mount(AsumsiMakro, {
      props: {
        isFetchingError: true,
        corporateTaxRate: '',
        discountRate: 10,
        interestRate: 8,
        loanTenor: 15,
        loanPortion: 70,
        equityPortion: '',
        selectedYear: 2024
      }
    });

    const reloadComponent = wrapper.findComponent({ name: 'ReloadComponent' });
    await reloadComponent.vm.$emit('on-key-down');

    expect(wrapper.emitted('onKeyDown')).toBeTruthy();
  });

  it('should show ShimmerLoading when data is not available and no error', () => {
    const wrapper = mount(AsumsiMakro, {
      props: {
        isFetchingError: false,
        corporateTaxRate: '',
        discountRate: '',
        interestRate: '',
        loanTenor: '',
        loanPortion: '',
        equityPortion: '',
        selectedYear: 2024
      }
    });

    expect(wrapper.findComponent({ name: 'ShimmerLoading' }).exists()).toBe(true);
  });

  it('should display dash (-) when values are dash string', () => {
    const wrapper = mount(AsumsiMakro, {
      props: {
        ...defaultProps,
        corporateTaxRate: '-',
        discountRate: '-',
        interestRate: '-',
        loanTenor: '-',
        loanPortion: '-',
        equityPortion: '-'
      }
    });

    expect(wrapper.text()).toContain('-');
  });

  it('should not show period section when selectedYear is not provided', () => {
    const wrapper = mount(AsumsiMakro, {
      props: {
        ...defaultProps,
        selectedYear: undefined
      }
    });

    expect(wrapper.text()).not.toContain('Periode');
  });

  it('should handle edge case when isFetchingError is true but one required prop is available', () => {
    const wrapper = mount(AsumsiMakro, {
      props: {
        isFetchingError: true,
        corporateTaxRate: 25, // available
        discountRate: 10,
        interestRate: 8,
        loanTenor: 15,
        loanPortion: 70,
        equityPortion: '', // missing but corporateTaxRate is available
        selectedYear: 2024
      }
    });

    // Should show main content because corporateTaxRate is available (OR condition)
    expect(wrapper.find('.text-base.font-bold').text()).toBe('Asumsi Makro');
    expect(wrapper.findComponent({ name: 'ReloadComponent' }).exists()).toBe(false);
  });

  it('should show main content when isFetchingError is true but all required props are available', () => {
    const wrapper = mount(AsumsiMakro, {
      props: {
        isFetchingError: true, // error is true
        corporateTaxRate: 25, // but both required props are available
        discountRate: 10,
        interestRate: 8,
        loanTenor: 15,
        loanPortion: 70,
        equityPortion: 30, // available
        selectedYear: 2024
      }
    });

    // Should show main content because both required props are available
    expect(wrapper.find('.text-base.font-bold').text()).toBe('Asumsi Makro');
    expect(wrapper.findComponent({ name: 'ReloadComponent' }).exists()).toBe(false);
  });
});