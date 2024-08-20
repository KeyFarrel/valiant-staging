export default class YearPickerService {
  filterYears = (data: { tahun: string }[], startYear: number, endYear: number) => {
    const allYears = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    const existingYears = data.map(item => parseInt(item.tahun, 10));
    const missingYears = allYears.filter(year => !existingYears.includes(year));
    return {years: missingYears};
  };
}
