const amountFormatter = new Intl.NumberFormat("de-CH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Swiss amount with exactly two decimals and Figma's straight apostrophe, e.g. 1'234.50. */
export function formatAmount(value: number): string {
  return amountFormatter.formatToParts(value).map(part => part.type === "group" ? "'" : part.value).join("");
}

/** Signed percentage; input is percentage points, so 3.7 produces +3.7%. */
export function formatTrend(value: number): string {
  return `${value < 0 ? "−" : "+"}${Math.abs(value).toFixed(1)}%`;
}

export type TrendToken = "trend-positive" | "trend-negative";

/** Visualization-only color token, never a UI error token. Zero uses positive treatment. */
export function getTrendToken(value: number): TrendToken {
  return value < 0 ? "trend-negative" : "trend-positive";
}