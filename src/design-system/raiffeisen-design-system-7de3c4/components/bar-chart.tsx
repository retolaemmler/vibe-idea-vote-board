import { forwardRef, type HTMLAttributes } from "react";
import { BarChart as RechartsBarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { cn } from "../lib/utils";
import { formatAmount, formatTrend } from "../lib/format";
import { chartMaximum, chartTokens, type ChartSeries } from "../lib/chart";

export interface BarChartProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  data: readonly ChartSeries[];
  /** Accessible chart/table title. */
  title: string;
  /** Shared full-track magnitude; defaults to the largest absolute amount. */
  max?: number;
}

/** Horizontal progress bars with visible signed values and an equivalent accessible table. */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(
  { data, title, max, className, children, ...props }, ref,
) {
  const maximum = chartMaximum(data, max);
  const hasTrends = data.some(item => item.trend !== undefined);
  return <figure {...props} ref={ref} aria-label={title} className={cn("rds-bar-chart", className)}>
    <div className="rds-chart-rows" aria-hidden="true">
      {data.map((item, index) => <div key={`${index}-${item.label}`} className="rds-chart-row">
        <div className="rds-chart-row-heading">
           <span className="text-small text-default">{item.label}</span>
          <span className="rds-chart-figures text-small-bold tabular-nums">
             <span className={item.amount < 0 ? "text-trend-negative" : "text-default"}>CHF {formatAmount(item.amount)}</span>
            {item.trend !== undefined && <span className={item.trend < 0 ? "text-trend-negative" : "text-trend-positive"}>{formatTrend(item.trend)}</span>}
          </span>
        </div>
        <div className={cn("rds-chart-track", `rds-chart-color-${index + 1}`, item.amount < 0 && "rds-chart-negative")} data-color-token={item.amount < 0 ? "trend-negative" : chartTokens[index]}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <RechartsBarChart layout="vertical" barCategoryGap={0} barGap={0} data={[{ value: Math.min(Math.abs(item.amount), maximum) }]} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} accessibilityLayer={false}>
              <XAxis hide type="number" domain={[0, maximum]} />
              <YAxis hide type="category" />
              <Bar dataKey="value" fill="var(--chart-fill)" background={{ fill: "var(--chart-empty)" }} radius={0} isAnimationActive={false} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>)}
    </div>
    <table className="sr-only">
      <caption>{title}</caption>
      <thead><tr><th scope="col">Kategorie</th><th scope="col">Betrag (CHF)</th>{hasTrends && <th scope="col">Trend</th>}</tr></thead>
      <tbody>{data.map((item, index) => <tr key={`${index}-${item.label}`}>
        <th scope="row">{item.label}</th><td>CHF {formatAmount(item.amount)}</td>{hasTrends && <td>{item.trend !== undefined ? formatTrend(item.trend) : "—"}</td>}
      </tr>)}</tbody>
    </table>
    {children}
  </figure>;
});