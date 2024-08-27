import moment from 'moment'

export function formatDuration (durationMs: number): string {
  const duration = moment.duration(durationMs)
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()

  let formattedDuration = ''
  if (hours > 0) {
    formattedDuration += `${hours}h`
  }
  if (minutes > 0 || hours > 0) {
    formattedDuration += `${minutes}m`
  }
  formattedDuration += `${seconds}s`

  return formattedDuration
}
