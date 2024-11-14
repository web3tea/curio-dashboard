import { getError, getInfo, getPrimary, getSuccess, getWarning } from '@/theme/UpdateColors'

export const getColorByType = (type: string) :string => {
  switch (type) {
    case 'Hybrid': return getSuccess.value!
    case 'Seal': return getError.value!
    case 'Store': return getWarning.value!
    case 'Readonly': return getInfo.value!
    default: return getPrimary.value!
  }
}
