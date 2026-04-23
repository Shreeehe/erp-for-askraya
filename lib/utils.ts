import { clsx, type ClassValue } from 'clsx';
import { formatInTimeZone } from 'date-fns-tz';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(value);
}

export function formatIST(value: string | Date, pattern = 'dd MMM yyyy, hh:mm a') {
  return formatInTimeZone(value, 'Asia/Kolkata', pattern);
}
