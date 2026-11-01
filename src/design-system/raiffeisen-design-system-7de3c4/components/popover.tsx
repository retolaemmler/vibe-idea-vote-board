import { forwardRef, type ReactElement, type ComponentPropsWithoutRef } from "react";
import * as Primitive from "@radix-ui/react-popover";
import { cn } from "../lib/utils";

export interface PopoverProps extends ComponentPropsWithoutRef<typeof Primitive.Content> {
  trigger: ReactElement;
  /** Accessible name for the floating dialog. */
  label: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Anchored supplementary content with native trigger and focus restoration. */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { trigger, label, children, open, defaultOpen, onOpenChange, className, side = "bottom", align = "start", ...props }, ref,
) {
  return <Primitive.Root {...(open === undefined ? {} : { open })} {...(defaultOpen === undefined ? {} : { defaultOpen })} {...(onOpenChange ? { onOpenChange } : {})}>
    <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
    <Primitive.Portal><Primitive.Content {...props} ref={ref} aria-label={label} side={side} align={align}
      sideOffset={10} collisionPadding={10} className={cn("rds-popover text-standard", className)}>
      <div className="rds-popover-body">{children}</div><Primitive.Arrow className="rds-floating-arrow" width={13} height={6} />
    </Primitive.Content></Primitive.Portal>
  </Primitive.Root>;
});