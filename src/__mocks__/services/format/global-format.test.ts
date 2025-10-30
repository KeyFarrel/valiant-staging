import GlobalFormat from "../../../services/format/global-format";

describe('GlobalFormat', () => {
  let formatter: GlobalFormat;

  beforeEach(() => {
    formatter = new GlobalFormat();
  });

  test('formatEnergy should format energy amount correctly', () => {
    expect(formatter.formatEnergy(1234.567)).toBe('1234,57');
    expect(formatter.formatEnergy(1000)).toBe('1000,00');
  });

  test('formatPercent should format percentage correctly', () => {
    expect(formatter.formatPercent(0.1234)).toBe('0.12');
    expect(formatter.formatPercent(50)).toBe('50.00');
  });

  test('formatCurrencyNotFixed should format currency without fixed decimal', () => {
    expect(formatter.formatCurrencyNotFixed(1234.567)).toBe('1.234,567');
    expect(formatter.formatCurrencyNotFixed(1000)).toBe('1.000,00');
    expect(formatter.formatCurrencyNotFixed(1234.5)).toBe('1.234,5');
  });

  test('formatDecimal should format decimal number correctly', () => {
    expect(formatter.formatDecimal(123456)).toBe('123.456');
    expect(formatter.formatDecimal(1000)).toBe('1.000');
  });

  test('formatRupiah should format amount to Rupiah correctly', () => {
    expect(formatter.formatRupiah(1234.567)).toBe('1.234,567');
    expect(formatter.formatRupiah(null)).toBe('0,00');
    expect(formatter.formatRupiah(undefined)).toBe('0,00');
  });

  test('formatInputDecimalRupiah should format input decimal Rupiah correctly', () => {
    expect(formatter.formatInputDecimalRupiah('1.234,56')).toBe('1.234,56');
    expect(formatter.formatInputDecimalRupiah('1234.56')).toBe('123.456');
    expect(formatter.formatInputDecimalRupiah('1,234')).toBe('1,234');
  });

  test('formatInputDecimal should format input decimal correctly', () => {
    expect(formatter.formatInputDecimal('123456')).toBe('1234,56');
    expect(formatter.formatInputDecimal('123')).toBe('1,23');
  });

  test('formatInputNumberOnly should keep only digits', () => {
    expect(formatter.formatInputNumberOnly('abc123')).toBe('123');
    expect(formatter.formatInputNumberOnly('1.234')).toBe('1234');
  });

  test('formatNumberFiveDigits should format number to five digits', () => {
    expect(formatter.formatNumberFiveDigits(123)).toBe('00123');
    expect(formatter.formatNumberFiveDigits(12345)).toBe('12345');
    expect(formatter.formatNumberFiveDigits(1)).toBe('00001');
  });

  test('formatBytes should format bytes correctly', () => {
    expect(formatter.formatBytes(0)).toBe('0 Bytes');
    expect(formatter.formatBytes(1000)).toBe('1.00 KB');
    expect(formatter.formatBytes(1048576)).toBe('1.05 MB');
  });
});
