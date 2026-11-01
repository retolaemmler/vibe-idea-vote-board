import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface LoaderSquareProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color" | "children"> {
  /** Small for elements; large for empty pages without a skeleton. */
  size?: "small" | "large";
  /** Animated treatment is supplied by Figma only for neutral. */
  variant?: "neutral" | "brand";
  /** Loops between static and reference geometry using system motion tokens; reduced motion stays static. */
  animated?: boolean;
}

/** The source two-block loader. Applications own busy state and announcements. */
export const LoaderSquare = forwardRef<HTMLSpanElement, LoaderSquareProps>(function LoaderSquare(
  { size = "large", variant = "neutral", animated = false, className, ...props }, ref,
) {
  return <span {...props} ref={ref} aria-hidden="true"
    className={cn("rds-loader-square", `rds-loader-square-${size}`, `rds-loader-square-${variant}`, className)}
    data-animated={animated && variant === "neutral"}>
    <span className="rds-loader-square-block" /><span className="rds-loader-square-block-small" />
  </span>;
});