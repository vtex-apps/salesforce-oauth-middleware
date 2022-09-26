import { ResolverError, UserInputError } from '@vtex/api'
import { json } from 'co-body'

export async function prepare(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: {
        params: { path },
      },
    },
    method: reqMethod,
    query:  { access_token },
    req
  } = ctx

  const url: string = req.url || ""
  const { groups: { handler } }: any = /_v\/oauth-proxy\/(?<handler>[^\/]+)\/.*/.exec(url)
  let args: any;

  if (!['POST'].includes(reqMethod)) {
    args = await json(req)
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

  if (['POST'].includes(reqMethod) && ctx.request.type !== 'application/json') {
    ctx.throw(406, 'Content type not allowed')
  }

  if (['POST'].includes(reqMethod) && Object.keys(args).length === 0) {
    throw new UserInputError('Request body is not valid')
  }

  if (['POST'].includes(reqMethod) && Object.keys(args).length) {
    ctx.state.body = args
  }

  if(access_token) {
    ctx.state.salesforceAccessToken = access_token
  }

  await next()
}
