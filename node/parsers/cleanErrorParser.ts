import { cleanError } from '@vtex/api'

export const cleanErrorParser = (
  customMessage: string,
  error: any
) => {
  const cleanedError = cleanError(error)
  return {
    ...cleanedError,
    ...{
      customMessage,
    },
  }
}
