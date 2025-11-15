import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: number | string | null) {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value?: string | Date | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(date);
}

export function tenantAccent(seed: string) {
  const palette = ["#2563eb", "#16a34a", "#f97316", "#a855f7", "#0ea5e9", "#dc2626"];
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

