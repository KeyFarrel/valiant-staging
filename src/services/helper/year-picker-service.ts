export default class YearPickerService {
  filterYears = (firstYear: number, lastYear: number) => {
    let years = [firstYear, lastYear];
    let minYear = Math.min(...years);
    let maxYear = Math.max(...years);

    let valuesInRange = [];
    for (let year = minYear + 1; year < maxYear; year++) {
      valuesInRange.push(year);
    }

    return {years: valuesInRange};
  };
}
