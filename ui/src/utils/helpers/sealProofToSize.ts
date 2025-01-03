const sealProofSizes: Record<number, string> = {
  0: '2KiB',
  1: '8MiB',
  2: '512MiB',
  3: '32GiB',
  4: '64GiB',
  5: '2KiB',
  6: '8MiB',
  7: '512MiB',
  8: '32GiB',
  9: '64GiB',
  10: '2KiB',
  11: '8MiB',
  12: '512MiB',
  13: '32GiB',
  14: '64GiB',
  15: '2KiB',
  16: '8MiB',
  17: '512MiB',
  18: '32GiB',
  19: '64GiB',
}

export function sealProofToSize (sealProof: number): string {
  return sealProofSizes[sealProof] || 'Unknown'
}
