import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function generateApplicationId(): string {
  return `APP-${Math.floor(100000 + Math.random() * 900000)}`
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
    case "shortlisted":
      return "bg-green-100 text-green-800"
    case "under review":
    case "reviewing":
    case "interviewing":
      return "bg-yellow-100 text-yellow-800"
    case "submitted":
    case "new":
      return "bg-blue-100 text-blue-800"
    case "rejected":
    case "inactive":
      return "bg-red-100 text-red-800"
    case "incomplete":
    case "draft":
    case "paused":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
