export function formatBytes (bytes: number|string, decimals = 2): { value: number, unit: string, combined: string } {
  if (typeof bytes === 'string') {
    const num = Number(bytes)
    if (isNaN(num)) return { value: 0, unit: 'Bytes', combined: '0 Bytes' }
    bytes = num
  }
  if (bytes === 0 || bytes === undefined) return { value: 0, unit: 'Bytes', combined: '0 Bytes' }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
  const unit = sizes[i]

  return {
    value,
    unit,
    combined: `${value} ${unit}`,
  }
}
