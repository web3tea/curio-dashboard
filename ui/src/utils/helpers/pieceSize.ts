export const pieceSizeOptions = Array.from({ length: 30 }, (_, i) => {
  const value = 128 * Math.pow(2, i)
  let title
  if (value < 1024) {
    title = `${value} Bytes`
  } else if (value < 1024 * 1024) {
    title = `${value / 1024} KiB`
  } else if (value < 1024 * 1024 * 1024) {
    title = `${value / (1024 * 1024)} MiB`
  } else {
    title = `${value / (1024 * 1024 * 1024)} GiB`
  }
  return { title, value }
})
