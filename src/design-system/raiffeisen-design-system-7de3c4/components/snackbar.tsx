import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { IconButton } from "./icon-button";
import { cn } from "../lib/utils";

export interface SnackbarProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dismissLabel?: string;
  action?: ReactNode;
}

/** Brief, non-blocking feedback. The application owns visibility and lifetime. */
export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(
  { open = true, onOpenChange, dismissLabel = "Mitteilung schließen", action, children, className, ...props }, ref,
) {
  if (!open) return null;
  return <div {...props} ref={ref} className={cn("rds-snackbar inverted text-standard", className)}>
    <div className="rds-snackbar-message" role="status" aria-live="polite" aria-atomic="true">{children}</div>
    {action && <div className="rds-snackbar-action">{action}</div>}
    {onOpenChange && <IconButton inverted icon="close" label={dismissLabel} onClick={() => onOpenChange(false)} />}
  </div>;
});