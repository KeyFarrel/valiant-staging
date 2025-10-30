import DateFormat from "../../../services/format/date-format";

describe('DateFormat', () => {
  let dateFormat: DateFormat;

  beforeEach(() => {
    dateFormat = new DateFormat();
  });

  it('should format the date string correctly', () => {
    const testDate = '2023-09-24T10:30:00Z'; // UTC date string
    const expectedOutput = '24 September 2023\n10:30 WIB';

    const formattedDate = dateFormat.formatDate(testDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should handle leap years correctly', () => {
    const leapYearDate = '2024-02-29T12:15:00Z'; // A valid leap year date
    const expectedOutput = '29 Februari 2024\n12:15 WIB';

    const formattedDate = dateFormat.formatDate(leapYearDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should format midnight time correctly', () => {
    const midnightDate = '2023-12-01T00:00:00Z';
    const expectedOutput = '1 Desember 2023\n00:00 WIB';

    const formattedDate = dateFormat.formatDate(midnightDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should format late evening time correctly', () => {
    const lateDate = '2023-07-15T23:59:00Z';
    const expectedOutput = '15 Juli 2023\n23:59 WIB';

    const formattedDate = dateFormat.formatDate(lateDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should handle single digit dates and times with padding', () => {
    const singleDigitDate = '2023-01-05T08:07:00Z';
    const expectedOutput = '5 Januari 2023\n08:07 WIB';

    const formattedDate = dateFormat.formatDate(singleDigitDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should format all months correctly in Indonesian', () => {
    const testCases = [
      { date: '2023-01-15T12:00:00Z', expected: '15 Januari 2023\n12:00 WIB' },
      { date: '2023-02-15T12:00:00Z', expected: '15 Februari 2023\n12:00 WIB' },
      { date: '2023-03-15T12:00:00Z', expected: '15 Maret 2023\n12:00 WIB' },
      { date: '2023-04-15T12:00:00Z', expected: '15 April 2023\n12:00 WIB' },
      { date: '2023-05-15T12:00:00Z', expected: '15 Mei 2023\n12:00 WIB' },
      { date: '2023-06-15T12:00:00Z', expected: '15 Juni 2023\n12:00 WIB' },
      { date: '2023-07-15T12:00:00Z', expected: '15 Juli 2023\n12:00 WIB' },
      { date: '2023-08-15T12:00:00Z', expected: '15 Agustus 2023\n12:00 WIB' },
      { date: '2023-09-15T12:00:00Z', expected: '15 September 2023\n12:00 WIB' },
      { date: '2023-10-15T12:00:00Z', expected: '15 Oktober 2023\n12:00 WIB' },
      { date: '2023-11-15T12:00:00Z', expected: '15 November 2023\n12:00 WIB' },
      { date: '2023-12-15T12:00:00Z', expected: '15 Desember 2023\n12:00 WIB' }
    ];

    testCases.forEach(({ date, expected }) => {
      const formattedDate = dateFormat.formatDate(date);
      expect(formattedDate).toBe(expected);
    });
  });

  it('should handle different year formats', () => {
    const testCases = [
      { date: '2020-06-15T12:30:00Z', expected: '15 Juni 2020\n12:30 WIB' },
      { date: '2025-08-20T14:45:00Z', expected: '20 Agustus 2025\n14:45 WIB' },
      { date: '2030-03-10T15:00:00Z', expected: '10 Maret 2030\n15:00 WIB' }
    ];

    testCases.forEach(({ date, expected }) => {
      const formattedDate = dateFormat.formatDate(date);
      expect(formattedDate).toBe(expected);
    });
  });

  it('should handle end of month dates', () => {
    const testCases = [
      { date: '2023-01-31T10:00:00Z', expected: '31 Januari 2023\n10:00 WIB' },
      { date: '2023-04-30T11:00:00Z', expected: '30 April 2023\n11:00 WIB' },
      { date: '2023-06-30T12:00:00Z', expected: '30 Juni 2023\n12:00 WIB' },
      { date: '2023-09-30T13:00:00Z', expected: '30 September 2023\n13:00 WIB' }
    ];

    testCases.forEach(({ date, expected }) => {
      const formattedDate = dateFormat.formatDate(date);
      expect(formattedDate).toBe(expected);
    });
  });

  it('should handle February dates in non-leap years', () => {
    const nonLeapYearDate = '2023-02-28T15:30:00Z';
    const expectedOutput = '28 Februari 2023\n15:30 WIB';

    const formattedDate = dateFormat.formatDate(nonLeapYearDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should handle different date string formats', () => {
    const testCases = [
      { date: '2023-09-24T10:30:00.000Z', expected: '24 September 2023\n10:30 WIB' },
      { date: '2023-09-24T10:30:00Z', expected: '24 September 2023\n10:30 WIB' }
    ];

    testCases.forEach(({ date, expected }) => {
      const formattedDate = dateFormat.formatDate(date);
      expect(formattedDate).toBe(expected);
    });
  });

  it('should handle ISO date strings correctly', () => {
    const isoDate = '2023-11-25T16:45:30.123Z';
    const expectedOutput = '25 November 2023\n16:45 WIB';

    const formattedDate = dateFormat.formatDate(isoDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should consistently format time with zero padding', () => {
    const testCases = [
      { date: '2023-05-05T01:02:00Z', expected: '5 Mei 2023\n01:02 WIB' },
      { date: '2023-05-05T09:08:00Z', expected: '5 Mei 2023\n09:08 WIB' },
      { date: '2023-05-05T10:09:00Z', expected: '5 Mei 2023\n10:09 WIB' },
      { date: '2023-05-05T21:22:00Z', expected: '5 Mei 2023\n21:22 WIB' }
    ];

    testCases.forEach(({ date, expected }) => {
      const formattedDate = dateFormat.formatDate(date);
      expect(formattedDate).toBe(expected);
    });
  });

  it('should handle special dates like New Year', () => {
    const newYearDate = '2024-01-01T00:00:00Z';
    const expectedOutput = '1 Januari 2024\n00:00 WIB';

    const formattedDate = dateFormat.formatDate(newYearDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should handle Christmas date', () => {
    const christmasDate = '2023-12-25T12:00:00Z';
    const expectedOutput = '25 Desember 2023\n12:00 WIB';

    const formattedDate = dateFormat.formatDate(christmasDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  it('should handle Independence Day date', () => {
    const independenceDate = '2023-08-17T10:00:00Z';
    const expectedOutput = '17 Agustus 2023\n10:00 WIB';

    const formattedDate = dateFormat.formatDate(independenceDate);

    expect(formattedDate).toBe(expectedOutput);
  });

  // Test edge cases and potential error scenarios
  it('should handle valid Date object creation', () => {
    const validDate = '2023-06-15T14:30:00Z';
    const result = dateFormat.formatDate(validDate);
    
    // Should not be 'Invalid Date' or throw error
    expect(result).toMatch(/\d{1,2} \w+ \d{4}\n\d{2}:\d{2} WIB/);
    expect(result).toBe('15 Juni 2023\n14:30 WIB');
  });

  it('should handle current year dates', () => {
    const currentYearDate = '2025-03-15T09:30:00Z';
    const expectedOutput = '15 Maret 2025\n09:30 WIB';

    const formattedDate = dateFormat.formatDate(currentYearDate);

    expect(formattedDate).toBe(expectedOutput);
  });
});
