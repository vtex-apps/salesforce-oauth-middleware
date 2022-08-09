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
    req,
  } = ctx

  const args = await json(req)

  if (!path) {
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

  if (Object.keys(args).length === 0) {
    throw new UserInputError('Request body is not valid')
  }

  ctx.state.body = args

  await next()
}
