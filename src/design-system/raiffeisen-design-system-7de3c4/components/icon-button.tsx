import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { Icon } from "./icon";
import type { IconName } from "../lib/icons";
import { cn } from "../lib/utils";

const iconButtonVariants = cva("rds-icon-button", {
  variants: { size: { 20: "rds-icon-button-default", 32: "rds-icon-button-large" } },
  defaultVariants: { size: 20 },
});

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  icon: IconName;
  /** Required accessible action name. */
  label: string;
  size?: 20 | 32;
  inverted?: boolean;
}

/** Icon-only action with a fixed touch target and an inner keyboard-focus frame. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, size = 20, inverted = false, disabled = false, className, type = "button", ...props }, ref,
) {
  return <button {...props} ref={ref} type={type} disabled={disabled} aria-label={label}
    data-inverted={inverted ? "true" : undefined} className={cn(iconButtonVariants({ size }), className)}>
    <span className="rds-icon-button-inner"><Icon name={icon} size={size} /></span>
  </button>;
});