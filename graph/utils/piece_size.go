package utils

func IsValidPieceSize(size uint64) bool {
	baseSize := uint64(128)
	for i := 0; i < 30; i++ {
		if size == baseSize {
			return true
		}
		baseSize *= 2
	}
	return false
}
