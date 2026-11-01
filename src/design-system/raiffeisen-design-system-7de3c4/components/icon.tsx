import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import { iconNames, type IconName } from "../lib/icons";

const iconVariants = cva("pi inline-flex shrink-0 items-center justify-center align-middle leading-none", {
  variants: { size: { 20: "icon-default", 32: "icon-large" } },
  defaultVariants: { size: 20 },
});

export interface IconProps extends Omit<ComponentPropsWithoutRef<"i">, "children"> {
  /** Approved RDS icon name, not an arbitrary PrimeIcons class. */
  name: IconName;
  /** Default (20) or large (32) token-backed size. */
  size?: 20 | 32;
}

/** Decorative, currentColor icon. Icon-only controls require an accessible parent label. */
export const Icon = forwardRef<HTMLElement, IconProps>(function Icon(
  { name, size = 20, className, ...props }, ref,
) {
  const glyph = iconNames[name];
  if (!glyph) return null;
  return <i {...props} ref={ref} className={cn(iconVariants({ size }), `pi-${glyph}`, className)} aria-hidden="true" />;
});