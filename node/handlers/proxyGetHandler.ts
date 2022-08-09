export async function proxyGetHandler(ctx: Context) {
  const {
    clients: { salesforceProxy },
    vtex: {
      route: {
        params: { path },
      },
    },
  } = ctx

  const { data, status } = await salesforceProxy.proxyGet(path as string)

  return {
    data,
    status,
  }
}
