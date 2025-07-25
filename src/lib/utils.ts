import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Centralized date formatting utilities
export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy")
}

export function formatDateLong(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy")
}

export function formatDateForInput(date: string | Date): string {
  return format(new Date(date), "yyyy-MM-dd")
}
