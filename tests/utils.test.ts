import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats numeric values", () => {
    expect(formatCurrency(1250000)).toBe("$1,250,000");
  });

  it("handles undefined input", () => {
    expect(formatCurrency()).toBe("$0");
  });
});

describe("formatDate", () => {
  it("returns placeholder for invalid dates", () => {
    expect(formatDate(undefined)).toBe("—");
  });

  it("formats ISO strings", () => {
    expect(formatDate("2024-05-10")).toMatch(/2024/);
  });
});
