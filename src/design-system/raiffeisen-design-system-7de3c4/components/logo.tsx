import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";
import logoUrl from "../assets/logos/raiffeisen-logo.svg";

const logoVariants = cva("rds-logo", {
  variants: { size: { default: "rds-logo-default", large: "rds-logo-large" } },
  defaultVariants: { size: "default" },
});

export interface LogoProps extends Omit<ComponentPropsWithoutRef<"img">, "src" | "alt" | "children"> {
  /** Token-backed height: default (30) or large (40). Width scales with the wordmark. */
  size?: "default" | "large";
  /** Hide from assistive technology when adjacent text already names Raiffeisen. */
  decorative?: boolean;
}

/**
 * The Raiffeisen wordmark. The artwork is the verbatim brand asset; only its
 * height is tokenized. Never recolor, stretch or redraw it.
 */
export const Logo = forwardRef<HTMLImageElement, LogoProps>(function Logo(
  { size = "default", decorative = false, className, ...props }, ref,
) {
  return (
    <img
      {...props}
      ref={ref}
      src={logoUrl}
      alt={decorative ? "" : "Raiffeisen"}
      aria-hidden={decorative || undefined}
      className={cn(logoVariants({ size }), className)}
    />
  );
});
