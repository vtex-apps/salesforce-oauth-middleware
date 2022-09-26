export async function proxyPostHandler(ctx: Context) {
  const {
    clients: { salesforceProxy },
    state: { body },
    vtex: {
      route: {
        params: { path },
      },
    },
    state: { salesforceAccessToken }
  } = ctx

  return salesforceProxy.proxyPost(path as string, body, salesforceAccessToken)
}
