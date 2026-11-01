import { Children, Fragment, cloneElement, forwardRef, isValidElement, useEffect, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from "react";
import { cva } from "class-variance-authority";
import { Button, type ButtonProps } from "./button";
import { cn } from "../lib/utils";

const setVariants = cva("rds-button-set", {
  variants: {
    type: { buttons: "rds-button-set-buttons", links: "rds-button-set-links", "icon-buttons": "rds-button-set-icons", "icon-links": "rds-button-set-icon-links" },
    align: { left: "rds-button-set-left", center: "rds-button-set-center" },
  },
  defaultVariants: { type: "buttons", align: "left" },
});

export interface ButtonSetProps extends HTMLAttributes<HTMLDivElement> {
  type?: "buttons" | "links" | "icon-buttons" | "icon-links";
  align?: "left" | "center";
  /** Related single-function toolbar with roving focus. Provide an accessible name. */
  toolbar?: boolean;
}

function flatten(children: ReactNode, prefix = ""): ReactNode[] {
  return Children.toArray(children).flatMap((child, index) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return [child];
    const key = `${prefix}/${child.key ?? index}`;
    return child.type === Fragment ? flatten(child.props.children, key) : [cloneElement(child, { key })];
  });
}
function variant(child: ReactNode) {
  if (!isValidElement<ButtonProps>(child) || child.type !== Button) return "link";
  return child.props.inverted && (child.props.variant ?? "primary") === "primary" ? "secondary" : child.props.variant ?? "primary";
}
function controls(root: HTMLDivElement) {
  return Array.from(root.querySelectorAll<HTMLElement>('button, a[href], [role="button"], [role="link"]'))
    .filter(item => !item.matches(':disabled, [aria-disabled="true"], [hidden]') && !item.closest('[hidden], [inert]'));
}
function rove(items: HTMLElement[], active: HTMLElement) {
  for (const item of items) item.tabIndex = item === active ? 0 : -1;
}

/** Related navigation/actions with built-in responsive layout and optional toolbar focus. */
export const ButtonSet = forwardRef<HTMLDivElement, ButtonSetProps>(function ButtonSet(
  { type = "buttons", align = "left", toolbar = false, children, className, onKeyDown, onFocusCapture, ...props }, ref,
) {
  const root = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLElement | null>(null);
  const items = flatten(children);
  const primaryCount = items.filter(item => variant(item) === "primary").length;
  const secondaryCount = items.filter(item => variant(item) === "secondary").length;
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (primaryCount > 1) console.warn("Raiffeisen ButtonSet: use at most one primary per set.");
    if (secondaryCount > 0 && primaryCount === 0 && secondaryCount !== 2) console.warn("Raiffeisen ButtonSet: secondary requires a primary, except two equally weighted secondary buttons.");
  }, [primaryCount, secondaryCount]);
  useEffect(() => {
    if (!toolbar || !root.current) return;
    const enabled = controls(root.current);
    const previous = enabled.map(item => [item, item.getAttribute("tabindex")] as const);
    const selected = enabled.find(item => item === active.current) ?? enabled[0];
    if (selected) { active.current = selected; rove(enabled, selected); }
    return () => {
      for (const [item, value] of previous) {
        if (value === null) item.removeAttribute("tabindex"); else item.setAttribute("tabindex", value);
      }
    };
  });
  const ordered = type === "buttons" ? [...items].sort((a, b) =>
    ["primary", "secondary", "link"].indexOf(variant(a)) - ["primary", "secondary", "link"].indexOf(variant(b)),
  ) : items;
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!toolbar || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !root.current) return;
    const enabled = controls(root.current);
    const index = enabled.findIndex(item => item === event.target);
    if (index < 0 || !["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const backwards = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const next = enabled[event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + (backwards ? -1 : 1) + enabled.length) % enabled.length];
    if (next) { active.current = next; rove(enabled, next); next.focus(); }
  };
  return <div {...props} ref={node => { root.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
    role={toolbar ? "toolbar" : props.role} className={cn(setVariants({ type, align }), className)}
    onKeyDown={handleKeyDown} onFocusCapture={event => {
      onFocusCapture?.(event);
      if (!toolbar || !root.current) return;
      const enabled = controls(root.current);
      const focused = enabled.find(item => item === event.target);
      if (focused) { active.current = focused; rove(enabled, focused); }
    }}>
    {ordered.map((item, index) => <div key={isValidElement(item) ? item.key ?? index : index}
      className={cn("rds-button-set-item", type === "buttons" && variant(item) !== "link" && "rds-button-set-action")}>{item}</div>)}
  </div>;
});