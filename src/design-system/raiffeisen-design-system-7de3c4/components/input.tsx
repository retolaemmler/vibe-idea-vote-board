import { forwardRef, useId, useRef, useState, useEffect, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import type { IconName } from "../lib/icons";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "children"> {
  /** Persistent accessible label; floats when focused, filled or read-only. */
  label: ReactNode;
  /** The single input treatment, with an optional error treatment. */
  variant?: "default" | "danger";
  helperText?: ReactNode;
  /** Application-owned validation message; enables aria-invalid. */
  error?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Decorative approved icon, not an action. */
  icon?: IconName;
  showCharacterCount?: boolean;
  /** Optional format hint, not a formatter or input mask engine. */
  maskHint?: string;
  inputClassName?: string;
}

/** Native single-line text entry, preserving browser editing and form semantics. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, variant = "default", helperText, error, prefix, suffix, icon, showCharacterCount = false,
    maskHint, inputClassName, className, id, value, defaultValue, disabled, readOnly, maxLength,
    onChange, onInput, onFocus, onBlur, placeholder, "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid, ...props }, ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const localRef = useRef<HTMLInputElement | null>(null);
  const [current, setCurrent] = useState(String(value ?? defaultValue ?? ""));
  const [focused, setFocused] = useState(false);
  const text = value !== undefined ? String(value) : current;
  const invalid = Boolean(error) || variant === "danger" || ariaInvalid === true || ariaInvalid === "true";
  const floating = focused || text.length > 0 || Boolean(readOnly);
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const countId = `${inputId}-count`;
  const description = [describedBy, helperText ? helperId : undefined, error ? errorId : undefined,
    showCharacterCount ? countId : undefined].filter(Boolean).join(" ") || undefined;
  useEffect(() => {
    const field = localRef.current;
    const form = field?.form;
    const reset = () => queueMicrotask(() => { if (field) setCurrent(field.value); });
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, []);
  return <div className={cn("rds-input", className)} data-floating={floating} data-invalid={invalid}
    data-disabled={Boolean(disabled)} data-readonly={Boolean(readOnly)}>
    <div className="rds-input-control">
      <div className="rds-input-wrapper">
        <label htmlFor={inputId} className="rds-input-label">{label}</label>
        <div className="rds-input-entry text-standard-bold">
          {prefix != null && <span className="rds-input-affix" aria-hidden="true">{prefix}</span>}
          <input {...props} id={inputId} ref={element => {
            localRef.current = element;
            if (typeof ref === "function") ref(element); else if (ref) ref.current = element;
          }} className={cn("rds-input-native text-standard-bold", inputClassName)}
            value={value} defaultValue={defaultValue} disabled={disabled} readOnly={readOnly}
            maxLength={maxLength} placeholder={placeholder ?? maskHint} aria-describedby={description}
            aria-invalid={invalid || ariaInvalid} aria-errormessage={error ? errorId : undefined}
            onChange={event => { setCurrent(event.currentTarget.value); onChange?.(event); }}
            onInput={event => { setCurrent(event.currentTarget.value); onInput?.(event); }}
            onFocus={event => { setFocused(true); onFocus?.(event); }}
            onBlur={event => { setFocused(false); setCurrent(event.currentTarget.value); onBlur?.(event); }} />
          {suffix != null && <span className="rds-input-affix" aria-hidden="true">{suffix}</span>}
        </div>
      </div>
      {icon && <span className="rds-input-icon"><Icon name={icon} /></span>}
    </div>
    {(helperText || showCharacterCount || error) && <div className="rds-input-messages text-small">
      {(helperText || showCharacterCount) && <div className="rds-input-helper-row">
        {helperText && <div id={helperId} className="rds-input-helper">{helperText}</div>}
        {showCharacterCount && <span id={countId} className="rds-input-count">{text.length}{maxLength !== undefined && <> / {maxLength}</>}</span>}
      </div>}
      {error && <div id={errorId} className="rds-input-error"><Icon name="error-circle-strong" /><span>{error}</span></div>}
    </div>}
  </div>;
});