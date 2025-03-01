import moment from 'moment'

export function formatDuration(durationMs: number): string {
  const duration = moment.duration(durationMs)

  if (duration.asDays() >= 1) {
    const days = Math.floor(duration.asDays())
    const hours = duration.hours()
    if (hours > 0) {
      return `${days}d ${hours}h`
    }
    return `${days}d`
  }

  if (duration.asHours() >= 1) {
    const hours = Math.floor(duration.asHours())
    const minutes = duration.minutes()
    if (minutes > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${hours}h`
  }

  if (duration.asMinutes() >= 1) {
    const minutes = Math.floor(duration.asMinutes())
    const seconds = duration.seconds()
    if (seconds > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${minutes}m`
  }

  if (duration.asSeconds() >= 1) {
    const seconds = Math.floor(duration.asSeconds())
    const milliseconds = Math.round(duration.milliseconds())
    if (milliseconds > 0) {
      return `${seconds}.${milliseconds}s`
    }
    return `${seconds}s`
  }

  const formatMs = (ms: number) => {
      return ms.toFixed(2).replace(/\.?0+$/, '')
    }
  return `${formatMs(duration.milliseconds())}ms`
}

export function formatDurationSeconds (durationSec: number): string {
  return formatDuration(durationSec * 1000)
}
