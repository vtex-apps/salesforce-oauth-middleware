import { ResolverError, UserInputError } from '@vtex/api'
import { form, json } from 'co-body'

export async function prepare(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: {
        params: { path },
      },
    },
    method: reqMethod,
    query,
    req
  } = ctx

  const url: string = req.url || ""
  const { groups: { handler } }: any = /_v\/oauth-proxy\/(?<handler>[^\/]+)\/.*/.exec(url)
  let args: any;

  if (['POST'].includes(reqMethod) && (!ctx.request.type.includes('application/json') && !ctx.request.type.includes('application/x-www-form-urlencoded'))) {
    ctx.throw(406, 'Content type not allowed')
  }

  if (['POST'].includes(reqMethod) && ctx.request.type.includes('application/json')) {
    args = await json(req)
  }

  if (['POST'].includes(reqMethod) && ctx.request.type.includes('application/x-www-form-urlencoded')) {
    args = await form(req)
  }

  if (handler === "authorizations" && !path) {
    throw new UserInputError('No request path provided')
  }

  if (!reqMethod) {
    throw new ResolverError('Empty request method')
  }

  if (!['GET', 'POST'].includes(reqMethod)) {
    ctx.throw(405)
  }

  if (['POST'].includes(reqMethod) && args) {
    ctx.state.body = args
  }

  if(query && query.access_token) {
    ctx.state.salesforceAccessToken = query.access_token
  }

  await next()
}
