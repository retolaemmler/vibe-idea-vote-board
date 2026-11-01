import { forwardRef, type ReactElement, type ComponentPropsWithoutRef } from "react";
import * as Primitive from "@radix-ui/react-tooltip";
import { cn } from "../lib/utils";

export interface TooltipProps extends Omit<ComponentPropsWithoutRef<typeof Primitive.Content>, "content"> {
  trigger: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Supplementary, non-interactive text available on hover and keyboard focus. */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { trigger, children, open, defaultOpen, onOpenChange, className, side = "top", align = "start", ...props }, ref,
) {
  return <Primitive.Provider delayDuration={0}><Primitive.Root {...(open === undefined ? {} : { open })} {...(defaultOpen === undefined ? {} : { defaultOpen })} {...(onOpenChange ? { onOpenChange } : {})}>
    <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
    <Primitive.Portal><Primitive.Content {...props} ref={ref} side={side} align={align} sideOffset={10} collisionPadding={10}
      className={cn("rds-tooltip inverted text-small", className)}>
      {children}<Primitive.Arrow className="rds-floating-arrow" width={13} height={6} />
    </Primitive.Content></Primitive.Portal>
  </Primitive.Root></Primitive.Provider>;
});