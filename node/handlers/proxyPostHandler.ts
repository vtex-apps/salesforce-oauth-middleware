import qs from 'qs';

export async function proxyPostHandler(ctx: Context) {
  const {
    clients: { salesforceProxy },
    state: { body },
    vtex: {
      route: {
        params: { path },
      },
    },
    query
  } = ctx
  let reqBody = body

  if (ctx.request.type.includes('application/x-www-form-urlencoded')) {
    reqBody = qs.stringify(body)
  }

  return salesforceProxy.proxyPost(path as string, reqBody, query)
}
