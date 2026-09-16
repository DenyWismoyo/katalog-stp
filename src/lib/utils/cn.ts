import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Penggabungan class Tailwind CSS secara cerdas dengan clsx dan tailwind-merge.
 * Mengatasi konflik class Tailwind dan mendukung kondisi boolean/object fleksibel.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
