/** Curated RDS names mapped to PrimeIcons 7.0.0. No additional icons are approved. */
export const iconNames = {
  calendar: "calendar",
  check: "check",
  "check-60": "check-circle",
  "chevron-down": "chevron-down",
  "chevron-up": "chevron-up",
  close: "times",
  "close-tiny": "times",
  contact: "id-card",
  copy: "copy",
  download: "download",
  edit: "pencil",
  "error-circle-strong": "times-circle",
  warning: "exclamation-triangle",
  "info-circle": "info-circle",
  filter: "filter",
  move: "arrows-alt",
  "navigation-arrow-left": "arrow-left",
  "option-horizontal": "ellipsis-h",
  "option-vertical": "ellipsis-v",
  support: "question-circle",
  "external link": "external-link",
  "external-link": "external-link",
} as const;

export type IconName = keyof typeof iconNames;