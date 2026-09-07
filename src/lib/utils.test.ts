import { describe, expect, it } from "vitest";
import { formatCurrency, formatPercent, formatQuantity, getPnlColor } from "@/lib/utils";

describe("financial formatters", () => {
  it("formats currency using Indian currency notation", () => {
    expect(formatCurrency(124500.5)).toBe("₹1,24,500.50");
  });

  it("formats percentages with an explicit sign", () => {
    expect(formatPercent(2.45)).toBe("+2.45%");
    expect(formatPercent(-1.2)).toBe("-1.20%");
  });

  it("handles invalid values safely", () => {
    expect(formatQuantity("not-a-number")).toBe("0");
    expect(getPnlColor(-1)).toBe("text-loss");
  });
});
