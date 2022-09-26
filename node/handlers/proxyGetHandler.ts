export async function proxyGetHandler(ctx: Context) {
  const {
    clients: { salesforceProxy },
    vtex: {
      route: {
        params: { path },
      },
    },
    query
  } = ctx

  return salesforceProxy.proxyGet(path as string, query)
}
