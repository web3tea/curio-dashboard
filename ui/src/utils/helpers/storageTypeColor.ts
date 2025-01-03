import { getError, getInfo, getPrimary, getSuccess, getWarning } from '@/theme/UpdateColors'

export const getColorByType = (type: string) :string => {
  switch (type) {
    case 'Hybrid':
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return getSuccess.value!
    case 'Seal':
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return getError.value!
    case 'Store':
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return getWarning.value!
    case 'Readonly':
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return getInfo.value!
    default:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return getPrimary.value!
  }
}
