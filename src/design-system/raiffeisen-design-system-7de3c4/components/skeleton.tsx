import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Match a text line or a rectangular content area. */
  variant?: "text" | "box";
  /** Replace the placeholder with children once loading completes. */
  isLoading?: boolean;
}

/** Static neutral placeholder matching the selected RDS Figma wireframe. */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = "box", isLoading = true, children, className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={cn("rds-skeleton", `rds-skeleton-${variant}`, className)}
    data-loading={isLoading} aria-hidden={isLoading ? true : props["aria-hidden"]}>
    {isLoading ? null : children}
  </div>;
});