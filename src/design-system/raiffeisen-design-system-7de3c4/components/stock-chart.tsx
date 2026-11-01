import { forwardRef, useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, type DotProps } from "recharts";
import { cn } from "../lib/utils";
import { formatAmount } from "../lib/format";

export interface StockPoint {
  /** Time label, e.g. "08:00". */
  time: string;
  /** Finite quote value. */
  value: number;
}

export interface StockChartProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Instrument name, e.g. "DAX". */
  name: string;
  /** Optional market or exchange, e.g. "Schweiz". */
  market?: string;
  /** Current value, already formatted for display (e.g. "13’008.00"). */
  value: string;
  /** Change in percentage points; its sign decides the trend color. */
  change: number;
  /** Date label shown bottom-left, e.g. "26.08.2025". */
  date: string;
  /** Ordered intraday quotes. */
  data: readonly StockPoint[];
  /** Reference value (e.g. previous close) drawn as a dashed line. */
  reference?: number;
  /** Time labels shown under the graph; defaults to first, middle and last point. */
  ticks?: readonly string[];
}

/** Quote changes show two decimals, e.g. +0.11% / −8.11%. */
const formatChange = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(2)}%`;

function EndDot({ cx, cy, index, last }: DotProps & { index?: number; last: number }) {
  if (index !== last || cx === undefined || cy === undefined) return null;
  return <circle cx={cx} cy={cy} r={8} className="rds-stock-dot" />;
}

/** Compact intraday stock card: name, value, signed change, line graph with reference and end dot. */
export const StockChart = forwardRef<HTMLElement, StockChartProps>(function StockChart(
  { name, market, value, change, date, data, reference, ticks, className, ...props }, ref,
) {
  if (data.some(point => !Number.isFinite(point.value)) || !Number.isFinite(change)) {
    throw new TypeError("StockChart values must be finite numbers.");
  }
  const [hover, setHover] = useState<{ index: number; x: number } | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; arrow: number; below: boolean } | null>(null);
  const figureRef = useRef<HTMLElement | null>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!hover) { setPos(null); return; }
    let frame = 0, tries = 0;
    const place = () => {
      const figure = figureRef.current, graph = graphRef.current, pop = popRef.current;
      const dot = graph?.querySelector(".recharts-active-dot circle");
      if (!figure || !graph || !pop || !dot) { if (tries++ < 20) frame = requestAnimationFrame(place); return; }
      const f = figure.getBoundingClientRect(), g = graph.getBoundingClientRect(), d = dot.getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(figure).getPropertyValue("--s20")) || 10;
      const x = d.left + d.width / 2 - f.left, dotTop = d.top - f.top, dotBottom = d.bottom - f.top;
      const below = d.top + d.height / 2 < g.top + g.height / 2;
      const minLeft = g.left - f.left, maxLeft = Math.max(minLeft, figure.clientWidth - pop.offsetWidth);
      const left = Math.max(minLeft, Math.min(x - pop.offsetWidth / 2, maxLeft));
      setPos({ left, arrow: x - left, below, top: below ? dotBottom + gap : dotTop - gap - pop.offsetHeight });
    };
    frame = requestAnimationFrame(place);
    return () => cancelAnimationFrame(frame);
  }, [hover]);
  const active = hover ? data[hover.index] : undefined;
  const negative = change < 0;
  const timeTicks = ticks ?? [data[0]?.time, data[Math.floor((data.length - 1) / 2)]?.time, data[data.length - 1]?.time].filter((time): time is string => time !== undefined);
  const title = [name, market].filter(Boolean).join(" ");
  return <figure {...props} ref={node => { figureRef.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} aria-label={`${title}: ${value}, ${formatChange(change)}`}
    className={cn("rds-stock-chart", negative ? "rds-stock-negative" : "rds-stock-positive", className)}>
    <div className="rds-stock-info">
      <p className="rds-stock-title"><span className="text-standard-bold">{name}</span>{market && <span className="text-small">{market}</span>}</p>
      <p className="rds-stock-value text-t400 tabular-nums">{value}</p>
      <p className={`text-standard-bold tabular-nums ${negative ? "text-trend-negative" : "text-trend-positive"}`}>{formatChange(change)}</p>
    </div>
    <div className="rds-stock-graph" aria-hidden="true" ref={graphRef}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={data as StockPoint[]} margin={{ top: 10, right: 10, bottom: 10, left: 0 }} accessibilityLayer={false}
          onMouseMove={state => {
            const index = Number(state?.activeTooltipIndex);
            const x = state?.activeCoordinate?.x;
            setHover(Number.isInteger(index) && index >= 0 && x !== undefined ? { index, x } : null);
          }}
          onMouseLeave={() => setHover(null)}>
          <XAxis dataKey="time" hide />
          <YAxis hide domain={["dataMin", "dataMax"]} />
          {reference !== undefined && <ReferenceLine y={reference} stroke="var(--text-default)" strokeWidth={1} strokeDasharray="4 4" ifOverflow="extendDomain" />}
          <Tooltip offset={15} allowEscapeViewBox={{ x: false, y: false }} wrapperStyle={{ zIndex: 1, pointerEvents: "none" }} cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }} isAnimationActive={false}
            content={() => null} />
          <Line type="linear" dataKey="value" stroke="var(--stock-line)" strokeWidth={4} strokeLinejoin="round"
            dot={(dotProps: DotProps & { index?: number }) => <EndDot key="end" {...dotProps} last={data.length - 1} />}
            activeDot={{ r: 6, className: "rds-stock-dot" }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    {active && <div ref={popRef} className="rds-popover rds-stock-popover" aria-hidden="true" data-placement={pos?.below ? "below" : "above"}
      style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, visibility: pos ? "visible" : "hidden" }}>
      <span className="text-small">{active.time}</span>
      <span className="text-standard-bold tabular-nums">{formatAmount(active.value)}</span>
      <svg className="rds-floating-arrow rds-stock-popover-arrow" viewBox="0 0 13 6" style={{ left: (pos?.arrow ?? 0) - 4 }}><path d="M0 0h13L6.5 6z" /></svg>
    </div>}
    <p className="rds-stock-date text-small tabular-nums">{date}</p>
    <div className="rds-stock-times text-small tabular-nums" aria-hidden="true">{timeTicks.map(tick => <span key={tick}>{tick}</span>)}</div>
    <table className="sr-only">
      <caption>{title} · {date}</caption>
      <thead><tr><th scope="col">Zeit</th><th scope="col">Wert</th></tr></thead>
      <tbody>{data.map((point, index) => <tr key={`${index}-${point.time}`}><th scope="row">{point.time}</th><td>{point.value}</td></tr>)}</tbody>
    </table>
  </figure>;
});
