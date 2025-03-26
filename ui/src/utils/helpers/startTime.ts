import { TimeRangeType } from "@/typed-graph"

export function calculateStartTime(timeRange: TimeRangeType, endTime: Date = new Date()): Date {
  const endTimeMs = endTime.getTime()
  let startTimeMs: number

  switch (timeRange) {
    case "HOUR_1":
      startTimeMs = endTimeMs - 60 * 60 * 1000
      break
    case "HOUR_24":
      startTimeMs = endTimeMs - 24 * 60 * 60 * 1000
      break
    case "DAY_7":
      startTimeMs = endTimeMs - 7 * 24 * 60 * 60 * 1000
      break
    case "DAY_30":
      startTimeMs = endTimeMs - 30 * 24 * 60 * 60 * 1000
      break
    case "DAY_90":
      startTimeMs = endTimeMs - 90 * 24 * 60 * 60 * 1000
      break
    case "DAY_180":
      startTimeMs = endTimeMs - 180 * 24 * 60 * 60 * 1000
      break
    case "DAY_365":
      startTimeMs = endTimeMs - 365 * 24 * 60 * 60 * 1000
      break
    default:
      throw new Error(`Unsupported time range: ${timeRange}`)
  }

  return new Date(startTimeMs)
}
