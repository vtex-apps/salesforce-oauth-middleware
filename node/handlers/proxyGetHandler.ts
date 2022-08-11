export async function proxyGetHandler(ctx: Context) {
  const {
    clients: { salesforceProxy },
    vtex: {
      route: {
        params: { path },
      },
    },
    state: { salesforceAccessToken }
  } = ctx

  return salesforceProxy.proxyGet(path as string, salesforceAccessToken)
}
