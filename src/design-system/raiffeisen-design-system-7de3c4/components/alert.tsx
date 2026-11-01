import { forwardRef, type HTMLAttributes, type ReactNode, type ReactElement } from "react";
import { cn } from "../lib/utils";
import type { ButtonProps } from "./button";
import type { IconButtonProps } from "./icon-button";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** All four Figma severities; success default retained for existing consumers. */
  variant?: "info" | "success" | "warning" | "danger";
  /** Optional title; provide meaningful children when omitted. */
  title?: ReactNode;
  /** Optional link-style Button below the message. */
  action?: ReactElement<ButtonProps>;
  /** Optional named IconButton beside the message; behavior belongs to the app. */
  iconAction?: ReactElement<IconButtonProps>;
}

/** Persistent in-page feedback with text meaning as well as semantic color. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = "success", title, children, action, iconAction, className, role, ...props }, ref,
) {
  return <div {...props} ref={ref} role={role ?? (variant === "danger" ? "alert" : "status")}
    aria-atomic={props["aria-atomic"] ?? true} className={cn("rds-alert", `rds-alert-${variant}`, className)} data-icon-action={Boolean(iconAction)}>
    <div className="rds-alert-content">
      <div className="rds-alert-copy">
        {title != null && <div className="rds-alert-title text-standard-bold">{title}</div>}
        {children != null && <div className="rds-alert-body text-standard">{children}</div>}
      </div>
      {action && <div className="rds-alert-action">{action}</div>}
    </div>
    {iconAction && <div className="rds-alert-icon-action">{iconAction}</div>}
  </div>;
});