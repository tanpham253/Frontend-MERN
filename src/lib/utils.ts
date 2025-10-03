import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, locale = 'vi-VN', currency = 'VND') {
  try {
    return value.toLocaleString(locale, { style: 'currency', currency });
  } catch {
    return `${value}`;
  }
}
