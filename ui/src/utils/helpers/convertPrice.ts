const ATTOFIL_PER_FIL = 1e18
const  GIB_IN_TIB = 1024
const EPOCHS_IN_MONTH = 86400

// Convert attoFIL/GiB/Epoch to FIL/TiB/Month
export function attoFilToFilPerTiBPerMonth(attoFilPerGiBPerEpoch: number) {
    const filPerTiBPerMonth = (attoFilPerGiBPerEpoch * GIB_IN_TIB * EPOCHS_IN_MONTH) / ATTOFIL_PER_FIL
    return filPerTiBPerMonth.toFixed(8)
}

export function filToAttoFilPerGiBPerEpoch(filPerTiBPerMonth: number) {
    const attoFilPerGiBPerEpoch = (filPerTiBPerMonth * 1e18) / GIB_IN_TIB / EPOCHS_IN_MONTH
    return Math.round(attoFilPerGiBPerEpoch)
}
