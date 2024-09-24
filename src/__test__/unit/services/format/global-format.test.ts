import { describe, it, expect } from "vitest";
import GlobalFormat from "@/services/format/global-format";

describe("GlobalFormat", () => {
  const globalFormat = new GlobalFormat();

  it("should format the number correctly to percent format", () => {
    // Test case 1: angka biasa
    const result = globalFormat.formatPercent(12.3456);
    expect(result).toBe("12.35");

    // Test case 2: angka bulat
    const result2 = globalFormat.formatPercent(100);
    expect(result2).toBe("100.00");

    // Test case 3: string yang bisa dikonversi ke angka
    const result3 = globalFormat.formatPercent("45.678");
    expect(result3).toBe("45.68");

    // Test case 4: Input non-numeric
    const result4 = globalFormat.formatPercent("abc");
    expect(result4).toBe("NaN");
  });
});
