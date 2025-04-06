import type { LocationQueryValue } from 'vue-router'

export function parseNumber(value: LocationQueryValue | LocationQueryValue[] | undefined): number | undefined {
  if (value === undefined || value === null) return undefined

  const val = Array.isArray(value) ? value[0] : value

  if (val === null) return undefined
  const parsed = Number(val)
  return isNaN(parsed) ? undefined : parsed
}

export function parseBoolean(value: LocationQueryValue | LocationQueryValue[] | undefined): boolean | undefined {
  if (value === undefined || value === null) return undefined

  const val = Array.isArray(value) ? value[0] : value

  if (val === null) return undefined
  return val === 'true' ? true : val === 'false' ? false : undefined
}
