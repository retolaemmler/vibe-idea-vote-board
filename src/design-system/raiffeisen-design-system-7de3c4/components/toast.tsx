import { Children, Fragment, cloneElement, forwardRef, isValidElement, type HTMLAttributes, type ReactNode } from "react";
import { Button, type ButtonProps } from "./button";
import { Link } from "./link";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import type { IconName } from "../lib/icons";
import { cn } from "../lib/utils";

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  icon?: IconName;
  actions?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dismissLabel?: string;
}

function flattenActions(actions: ReactNode, prefix = ""): ReactNode[] {
  return Children.toArray(actions).flatMap((action, index) => {
    if (!isValidElement<{ children?: ReactNode }>(action)) return [action];
    const key = `${prefix}/${action.key ?? index}`;
    return action.type === Fragment ? flattenActions(action.props.children, key) : [cloneElement(action, { key })];
  });
}
function isLinkAction(action: ReactNode) {
  return isValidElement<ButtonProps>(action) && (action.type === Link || action.type === "a" || (action.type === Button && action.props.variant === "link"));
}

/** Rich non-blocking feedback; Secondary precedes tertiary Link actions at every viewport. */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { title, icon = "check", actions, open = true, onOpenChange, dismissLabel = "Mitteilung schließen", children, className, ...props }, ref,
) {
  const items = flattenActions(actions);
  const ordered = [...items].sort((a, b) => Number(isLinkAction(a)) - Number(isLinkAction(b)));
  if (!open) return null;
  return <div {...props} ref={ref} className={cn("rds-toast inverted", className)}>
    {onOpenChange && <div className="rds-toast-dismiss"><IconButton inverted icon="close" label={dismissLabel} onClick={() => onOpenChange(false)} /></div>}
    <div className="rds-toast-scroll" role="status" aria-live="polite" aria-atomic="true" tabIndex={0}>
      <Icon name={icon} size={32} className="rds-toast-icon" />
      <div className="text-t400">{title}</div>
      {children && <div className="rds-toast-copy text-standard">{children}</div>}
    </div>
    {actions && <div className="rds-toast-actions">{ordered}</div>}
  </div>;
});