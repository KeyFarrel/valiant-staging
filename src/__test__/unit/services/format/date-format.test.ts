import DateFormat from "../../../../services/format/date-format";

describe('DateFormat', () => {
  let dateFormat: DateFormat;

  beforeEach(() => {
    dateFormat = new DateFormat();
  });

  it('should format the date string correctly', () => {
    const testDate = '2023-09-24T10:30:00Z'; // UTC date string
    const expectedOutput = '24 September 2023<br>10:30 WIB';

    const formattedDate = dateFormat.formatDate(testDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should handle leap years correctly', () => {
    const leapYearDate = '2024-02-29T12:15:00Z'; // A valid leap year date
    const expectedOutput = '29 Februari 2024<br>12:15 WIB';

    const formattedDate = dateFormat.formatDate(leapYearDate);

    expect(formattedDate).toBe(expectedOutput);
  });
});
