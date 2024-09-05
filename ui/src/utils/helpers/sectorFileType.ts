type SectorFileType = number;

const FTUnsealed: SectorFileType = 1 << 0
const FTSealed: SectorFileType = 1 << 1
const FTCache: SectorFileType = 1 << 2
const FTUpdate: SectorFileType = 1 << 3
const FTUpdateCache: SectorFileType = 1 << 4
const FTPiece: SectorFileType = 1 << 5

const sectorFileTypeMap: { [key: number]: string } = {
  [FTUnsealed]: 'Unsealed',
  [FTSealed]: 'Sealed',
  [FTCache]: 'Cache',
  [FTUpdate]: 'Update',
  [FTUpdateCache]: 'UpdateCache',
  [FTPiece]: 'Piece',
}

export function sectorFileTypeToName (fileType: SectorFileType): string {
  return sectorFileTypeMap[fileType] || 'Unknown'
}
