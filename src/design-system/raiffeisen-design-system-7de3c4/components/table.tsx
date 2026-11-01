import { forwardRef, type TableHTMLAttributes, type HTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Required accessible name, also used for the keyboard-scrollable wrapper. */
  label: string;
  caption?: ReactNode;
}
export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}
export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {}
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}
export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: "left" | "right" | "center";
}
export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: "left" | "right" | "center";
  /** Actions retain the existing IconButton target without extra vertical inset. */
  variant?: "text" | "numeric" | "actions";
}

/** Native row-based table with a named, keyboard-scrollable overflow region. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { label, caption, className, children, ...props }, ref,
) {
  return <div className="rds-table-scroll" role="region" aria-label={label} tabIndex={0}>
    <table {...props} ref={ref} aria-label={props["aria-label"] ?? label} className={cn("rds-table", className)}>
      {caption && <caption className="rds-table-caption text-small">{caption}</caption>}{children}
    </table>
  </div>;
});
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader({ className, ...props }, ref) {
  return <thead {...props} ref={ref} className={cn("rds-table-header", className)} />;
});
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody({ className, ...props }, ref) {
  return <tbody {...props} ref={ref} className={cn("rds-table-body", className)} />;
});
export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(function TableFooter({ className, ...props }, ref) {
  return <tfoot {...props} ref={ref} className={cn("rds-table-footer", className)} />;
});
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ className, ...props }, ref) {
  return <tr {...props} ref={ref} className={cn("rds-table-row", className)} />;
});
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead({ align = "left", scope = "col", className, ...props }, ref) {
  return <th {...props} ref={ref} scope={scope} className={cn("rds-table-head text-small-bold", `rds-table-align-${align}`, className)} />;
});
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ align, variant = "text", className, ...props }, ref) {
  return <td {...props} ref={ref} className={cn("rds-table-cell text-standard", `rds-table-cell-${variant}`, `rds-table-align-${align ?? (variant === "text" ? "left" : "right")}`, className)} />;
});