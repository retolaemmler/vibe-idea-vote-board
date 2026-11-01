import { forwardRef, type HTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import * as Primitive from "@radix-ui/react-accordion";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "dir"> {
  /** Single expansion by default; multiple allows independent panels. */
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
}
export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}
export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Match the page's heading hierarchy without changing t400 styling. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}
export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Figma-width accordion with Radix-managed expansion and keyboard navigation. */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { type = "single", value, defaultValue, onValueChange, className, dir, disabled, ...props }, ref,
) {
  const shared = { ...props, ref, className: cn("rds-accordion", className), ...(dir !== undefined ? { dir } : {}), ...(disabled !== undefined ? { disabled } : {}) };
  return type === "multiple"
    ? <Primitive.Root {...shared} type="multiple" {...(value !== undefined ? { value } : {})} {...(defaultValue !== undefined ? { defaultValue } : {})} {...(onValueChange !== undefined ? { onValueChange } : {})} />
    : <Primitive.Root {...shared} type="single" collapsible {...(value !== undefined ? { value: value[0] ?? "" } : {})} {...(defaultValue !== undefined ? { defaultValue: defaultValue[0] ?? "" } : {})} onValueChange={next => onValueChange?.(next ? [next] : [])} />;
});

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, ...props }, ref,
) { return <Primitive.Item {...props} ref={ref} className={cn("rds-accordion-item", className)} />; });

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger(
  { headingLevel = 3, className, children, ...props }, ref,
) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";
  return <Primitive.Header asChild><Heading className="rds-accordion-heading">
    <Primitive.Trigger {...props} ref={ref} className={cn("rds-accordion-trigger text-t400", className)}>
      <span className="rds-accordion-label">{children}</span>
      <span className="rds-accordion-chevron" aria-hidden="true"><Icon name="chevron-down" size={20} /></span>
    </Primitive.Trigger>
  </Heading></Primitive.Header>;
});

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(function AccordionContent(
  { className, children, ...props }, ref,
) { return <Primitive.Content {...props} ref={ref} className={cn("rds-accordion-content text-standard", className)}>{children}</Primitive.Content>; });