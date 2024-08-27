export function formatFIL (attoFil: number | string, decimals = 2): string {
  if (typeof attoFil === 'string') {
    attoFil = Number(attoFil)
  }
  if (attoFil === 0) return '0'
  const k = 1000000000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['attoFil', 'nanoFil', 'FIL']

  const i = Math.floor(Math.log(attoFil) / Math.log(k))

  return parseFloat((attoFil / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
