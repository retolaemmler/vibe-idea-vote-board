import { forwardRef, useEffect, type HTMLAttributes, type ButtonHTMLAttributes, type MouseEventHandler, type ReactElement } from "react";
import type { BadgeProps } from "./badge";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { LoaderSquare } from "./loader-square";
import type { IconName } from "../lib/icons";

const buttonVariants = cva("rds-button text-button", {
  variants: { variant: { primary: "rds-button-primary", secondary: "rds-button-secondary", link: "rds-button-link" } },
  defaultVariants: { variant: "primary" },
});

export interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, "onClick"> {
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  name?: string;
  value?: ButtonHTMLAttributes<HTMLButtonElement>["value"];
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  variant?: "primary" | "secondary" | "link";
  inverted?: boolean;
  isLoading?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  /** Non-interactive counter placed immediately after the label. */
  badge?: ReactElement<BadgeProps>;
  /** Navigation destination. Omit for an action button. */
  href?: string;
  target?: string;
  rel?: string;
  download?: string | boolean;
  hrefLang?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

/** Action or navigation control with stable dimensions during local processing. */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = "primary", inverted = false, isLoading = false, disabled = false, iconLeft, iconRight, badge,
    href, target, rel, download, hrefLang, children, className, onClick, type = "button", tabIndex,
    name, value, form, formAction, formEncType, formMethod, formNoValidate, formTarget, ...props }, ref,
) {
  useEffect(() => {
    if (import.meta.env.DEV && inverted && variant === "primary") {
      console.warn("Raiffeisen Button: inverted primary is not allowed; rendering secondary.");
    }
  }, [inverted, variant]);
  const effectiveVariant = inverted && variant === "primary" ? "secondary" : variant;
  const blocked = disabled || isLoading;
  const handleClick: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = (event) => {
    if (blocked) { event.preventDefault(); event.stopPropagation(); return; }
    onClick?.(event);
  };
  const setRef = (node: HTMLButtonElement | HTMLAnchorElement | null) => {
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  const content = <>
    <span className="rds-button-content" aria-hidden={isLoading ? true : undefined}>
      {iconLeft && <Icon name={iconLeft} />}
      <span className="rds-button-label-group"><span className="rds-button-label">{children}</span>{badge}</span>
      {iconRight && <Icon name={iconRight} />}
    </span>
    {isLoading && <><span className="rds-button-accessible-label">{children}{badge}</span><LoaderSquare size="small" animated className="rds-button-loader" /></>}
  </>;
  const shared = {
    ...props, className: cn(buttonVariants({ variant: effectiveVariant }), className),
    "data-inverted": inverted ? "true" : undefined,
    "data-loading": isLoading ? "true" : undefined,
    "data-disabled": disabled ? "true" : undefined,
    "aria-busy": isLoading || undefined,
    "aria-disabled": blocked || undefined,
    onClick: handleClick,
  };
  if (href !== undefined) {
    return <a {...shared} ref={setRef} href={disabled ? undefined : href} target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)} download={download} hrefLang={hrefLang}
      role="link" tabIndex={disabled ? -1 : (tabIndex ?? 0)}>{content}</a>;
  }
  return <button {...shared} ref={setRef} type={type} disabled={disabled} tabIndex={tabIndex}
    name={name} value={value} form={form} formAction={formAction} formEncType={formEncType}
    formMethod={formMethod} formNoValidate={formNoValidate} formTarget={formTarget}>{content}</button>;
});