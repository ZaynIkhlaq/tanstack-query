import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// This function combines class names and merges Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}