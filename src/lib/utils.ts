import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FormatDateOptions = {
  formatStr?: string;
  includeTime?: boolean;
};

export function formatDate(
  date: string | Date,
  options: FormatDateOptions = {}
): string {
  const { formatStr = "MMMM d, yyyy", includeTime = false } = options;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return "";
  }
  
  let formattedDate = format(dateObj, formatStr);
  
  if (includeTime) {
    formattedDate += ` at ${format(dateObj, "h:mm a")}`;
  }
  
  return formattedDate;
}
