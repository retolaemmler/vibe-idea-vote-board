export interface ChartSeries {
  /** Destination/category name displayed for every value. */
  label: string;
  /** Signed CHF amount. Bars compare absolute magnitude. */
  amount: number;
  /** Optional change in percentage points. */
  trend?: number;
}

export const chartTokens = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "chart-7"] as const;

/** Shared validation keeps visual labels, legend and accessible data in sync. */
export function validateChartData(data: readonly ChartSeries[]) {
  if (data.length > 7) throw new RangeError("Raiffeisen charts support at most 7 series.");
  for (const item of data) {
    if (!Number.isFinite(item.amount) || (item.trend !== undefined && !Number.isFinite(item.trend))) {
      throw new TypeError("Raiffeisen chart amounts and trends must be finite numbers.");
    }
  }
}

export function chartMaximum(data: readonly ChartSeries[], max?: number) {
  validateChartData(data);
  if (max !== undefined && (!Number.isFinite(max) || max <= 0)) throw new RangeError("Chart max must be a positive finite number.");
  return max ?? Math.max(1, ...data.map(item => Math.abs(item.amount)));
}