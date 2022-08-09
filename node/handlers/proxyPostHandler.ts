export async function proxyPostHandler(ctx: Context) {
  const {
    clients: { salesforceProxy },
    state: { body },
    vtex: {
      route: {
        params: { path },
      },
    },
  } = ctx

  const { data, status } = await salesforceProxy.proxyPost(path as string, body)

  return {
    data,
    status,
  }
}
