import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Counter by default; dot is the selected numberless indicator. */
  variant?: "counter" | "dot";
  /** Non-negative integer count. Counts above 99 display as 99+. */
  count?: number;
}

/** Compact, non-interactive RDS counter, including inline Button usage. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { count, variant = "counter", className, ...props }, ref,
) {
  if (variant === "counter" && (count === undefined || !Number.isSafeInteger(count) || count < 0)) throw new RangeError("Badge count must be a non-negative safe integer.");
  return <span {...props} ref={ref} className={cn("rds-badge", variant === "dot" && "rds-badge-dot", className)}>{variant === "counter" && count !== undefined ? count > 99 ? "99+" : count : null}</span>;
});