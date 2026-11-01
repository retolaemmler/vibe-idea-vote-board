import { forwardRef, type AnchorHTMLAttributes, type MouseEventHandler } from "react";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "download"> {
  /** Identifiable navigation destination; removed when disabled. */
  href: string;
  /** Marks an external destination without changing the tab behavior. */
  external?: boolean;
  /** Native download behavior, optionally with a suggested filename. */
  download?: boolean | string;
  /** Explicitly open a new tab and announce that outcome. */
  newTab?: boolean;
  disabled?: boolean;
  /** Inverse treatment; also inherited from an .inverted ancestor. */
  inverted?: boolean;
}

/** Inline navigation with native browser behavior and an always-visible underline. Never use for actions. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, external = false, download, newTab = false, disabled = false, inverted = false,
    children, className, rel, tabIndex, onClick, onAuxClick, "aria-label": ariaLabel, ...props }, ref,
) {
  const isDownload = download !== undefined && download !== false;
  const announcements = `${newTab ? " (öffnet in neuem Tab)" : ""}${isDownload ? " (Download)" : ""}`;
  const guard = (handler?: MouseEventHandler<HTMLAnchorElement>): MouseEventHandler<HTMLAnchorElement> => event => {
    if (disabled) { event.preventDefault(); event.stopPropagation(); return; }
    handler?.(event);
  };
  const safeRel = newTab ? [...new Set([...(rel?.split(/\s+/).filter(Boolean) ?? []), "noopener", "noreferrer"])].join(" ") : rel;
  return <a {...props} ref={ref} className={cn("rds-link", className)}
    href={disabled ? undefined : href} target={newTab ? "_blank" : undefined} rel={safeRel}
    download={download} data-external={external || undefined} data-inverted={inverted || undefined}
    role={disabled ? "link" : undefined} aria-disabled={disabled || undefined}
    aria-label={ariaLabel ? `${ariaLabel}${announcements}` : undefined}
    tabIndex={disabled ? -1 : tabIndex} onClick={guard(onClick)} onAuxClick={guard(onAuxClick)}>
    {children}
    {newTab && <><span className="rds-link-icon"><Icon name="external-link" /></span><span className="sr-only"> (öffnet in neuem Tab)</span></>}
    {isDownload && <><span className="rds-link-icon"><Icon name="download" /></span><span className="sr-only"> (Download)</span></>}
  </a>;
});