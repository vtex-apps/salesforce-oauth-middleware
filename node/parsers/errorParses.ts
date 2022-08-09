export function errorParser(
  ctx: Context,
  error: any,
  message: string,
  method: string
) {
  const {
    vtex: {
      route: { params },
    },
    state: { currentUser },
    req: { method: reqMethod },
  } = ctx

  const path = params?.path as string
  const requestMethod = reqMethod?.toLowerCase() as string

  let appMessage: string = ''
  let stackTrace: any = null

  if (error.isAxiosError) {
    appMessage = `${message} ${error.response?.status}`
  } else {
    appMessage = 'Unhandled exception'
    stackTrace = error.stack
  }

  return {
    appMessage,
    config: error.response?.config,
    data: error.response?.data,
    message: error.message,
    path,
    method,
    requestMethod,
    stackTrace,
    status: error.response?.status,
    statusText: error.response?.statusText,
    currentUser,
  }
}
