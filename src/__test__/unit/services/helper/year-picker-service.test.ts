import YearPickerService from "@/services/helper/year-picker-service";

describe('YearPickerService', () => {
  let service: YearPickerService;

  beforeEach(() => {
    service = new YearPickerService();
  });

  it('should return the missing years between startYear and endYear', () => {
    const data = [
      { tahun: '2018' },
      { tahun: '2020' }
    ];
    const startYear = 2018;
    const endYear = 2022;

    const result = service.filterYears(data, startYear, endYear);

    expect(result).toEqual({ years: [2019, 2021, 2022] });
  });

  it('should return all years if no years in data', () => {
    const data: { tahun: string }[] = [];
    const startYear = 2015;
    const endYear = 2018;

    const result = service.filterYears(data, startYear, endYear);

    expect(result).toEqual({ years: [2015, 2016, 2017, 2018] });
  });

  it('should return an empty array if all years are present', () => {
    const data = [
      { tahun: '2018' },
      { tahun: '2019' },
      { tahun: '2020' },
      { tahun: '2021' },
      { tahun: '2022' }
    ];
    const startYear = 2018;
    const endYear = 2022;

    const result = service.filterYears(data, startYear, endYear);

    expect(result).toEqual({ years: [] });
  });

  it('should handle edge cases where data is null or undefined', () => {
    const startYear = 2018;
    const endYear = 2022;

    const result = service.filterYears(null, startYear, endYear);

    expect(result).toBeUndefined();
  });
});
