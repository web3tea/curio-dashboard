import { useI18n } from 'vue-i18n'

/**
 * Calculate relative time from now
 * @param date - Date to calculate relative time from
 * @param originTimeFormat - Original time format to display (default: 'short')
 * @param maxUnits - Maximum number of time units to display (default: 2)
 * @returns Formatted relative time string or 'N/A' for invalid dates
 */
export function getRelativeTime(
  date: Date | string | number | null | undefined,
  originTimeFormat: string | undefined | null = undefined,
  maxUnits = 2
): string {
  // Check for null, undefined or invalid date
  if (date === null || date === undefined) {
    return 'N/A'
  }

  // Try to convert input to Date object
  const targetDate = date instanceof Date ? date : new Date(date)

  // Check if date is valid
  if (isNaN(targetDate.getTime())) {
    return 'N/A'
  }

  // Get current time
  const now = new Date()

  // Calculate time difference in milliseconds
  const diffMs = targetDate.getTime() - now.getTime()
  const isPast = diffMs < 0

  // Get absolute difference in seconds
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000)

  // Calculate days, hours, minutes and seconds
  const days = Math.floor(diffSeconds / 86400)
  const hours = Math.floor((diffSeconds % 86400) / 3600)
  const minutes = Math.floor((diffSeconds % 3600) / 60)
  const seconds = diffSeconds % 60

  // Build relative time parts array
  const parts: string[] = []

  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

  // Limit the number of units displayed
  const limitedParts = parts.slice(0, maxUnits)

  // Format the relative time string
  const relativeTime = isPast
    ? `${limitedParts.join('')} ago`
    : `in ${limitedParts.join('')}`

  // Format original time if needed
  if (originTimeFormat) {
    const { d } = useI18n()

    const formattedDate = d(targetDate, originTimeFormat)
    return `${formattedDate} (${relativeTime})`
  }

  return relativeTime
}
