import { TimeRangeType } from "@/typed-graph"

export function calculateStartTime(timeRange: TimeRangeType, endTime: Date = new Date()): number {
  const endTimeMs = endTime.getTime()

  switch (timeRange) {
    case "HOUR_1":
      return endTimeMs - 60 * 60 * 1000
    case "HOUR_24":
      return endTimeMs - 24 * 60 * 60 * 1000
    case "DAY_7":
      return endTimeMs - 7 * 24 * 60 * 60 * 1000
    case "DAY_30":
      return endTimeMs - 30 * 24 * 60 * 60 * 1000
    case "DAY_90":
      return endTimeMs - 90 * 24 * 60 * 60 * 1000
    case "DAY_180":
      return endTimeMs - 180 * 24 * 60 * 60 * 1000
    case "DAY_365":
      return endTimeMs - 365 * 24 * 60 * 60 * 1000
    default:
      throw new Error(`Unsupported time range: ${timeRange}`)
  }
}
