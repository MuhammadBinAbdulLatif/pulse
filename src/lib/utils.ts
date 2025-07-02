import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function timeAgo(timestamp: string): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000);

  const intervals = [
    { label: "year", value: 60 * 60 * 24 * 365 },
    { label: "month", value: 60 * 60 * 24 * 30 }, // Approximation for months
    { label: "day", value: 60 * 60 * 24 }, // Changed to 'day' for singular base
    { label: "hour", value: 60 * 60 },     // Changed to 'hour'
    { label: "minute", value: 60 },      // Changed to 'minute'
    { label: "second", value: 1 },       // Changed to 'second'
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const count = Math.floor(diffInSeconds / interval.value);

    if (count >= 1) {
      // Handle pluralization
      const label = count === 1 ? interval.label : `${interval.label}s`;
      return `${count} ${label} ago`;
    }
  }

  // If the difference is less than 1 second, or if timestamp is in the future
  // (though current logic won't show "in the future" explicitly)
  return "just now";
}