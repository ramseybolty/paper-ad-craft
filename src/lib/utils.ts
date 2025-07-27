import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Centralized date formatting utilities
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";
  
  return format(dateObj, "dd/MM/yyyy");
}

export function formatDateLong(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";
  
  return format(dateObj, "dd MMM yyyy");
}

export function formatDateForInput(date: string | Date | undefined | null): string {
  if (!date) return "";
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";
  
  return format(dateObj, "yyyy-MM-dd");
}
