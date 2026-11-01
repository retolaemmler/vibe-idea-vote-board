import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { formatAmount } from "../lib/format";
import { chartTokens, validateChartData, type ChartSeries } from "../lib/chart";

export interface LegendProps extends HTMLAttributes<HTMLUListElement> {
  data: readonly ChartSeries[];
  withAmount?: boolean;
}

/** Ordered chart key with optional CHF figures beneath each category. */
export const Legend = forwardRef<HTMLUListElement, LegendProps>(function Legend(
  { data, withAmount = false, className, ...props }, ref,
) {
  validateChartData(data);
  return <ul {...props} ref={ref} className={cn("rds-legend", className)}>
    {data.map((item, index) => <li key={`${index}-${item.label}`} className="rds-legend-item">
      <span aria-hidden="true" className={cn("rds-legend-swatch", `rds-chart-color-${index + 1}`, item.amount < 0 && "rds-chart-negative")} data-color-token={item.amount < 0 ? "trend-negative" : chartTokens[index]} />
       <span><span className="text-small text-default">{item.label}</span>
         {withAmount && <span className={cn("rds-legend-amount text-small-bold tabular-nums", item.amount < 0 ? "text-trend-negative" : "text-default")}>CHF {formatAmount(item.amount)}</span>}
      </span>
    </li>)}
  </ul>;
});