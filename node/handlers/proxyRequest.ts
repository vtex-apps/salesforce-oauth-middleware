import { proxyGetHandler } from './proxyGetHandler'
import { proxyPostHandler } from './proxyPostHandler'
import { errorParser } from '../parsers/errorParses'
import SalesforceAccessToken from '../services/salesforceAccessToken'
import { ResolverError } from '@vtex/api'

export async function proxyRequest(ctx: Context) {
  try {
    const {
      vtex: {
        logger,
        route: {
          params: { path },
        },
      },
      req: { method: reqMethod },
    } = ctx

    let proxyResponse: proxyResponse

    if (!reqMethod) {
      throw new ResolverError('Empty request method')
    }

    switch (reqMethod.toLocaleLowerCase()) {
      case 'get':
        proxyResponse = await proxyGetHandler(ctx)
        break
      case 'post':
        proxyResponse = await proxyPostHandler(ctx)
        break
      default:
        throw new Error(`Proxy request handler for ${reqMethod} not implementd`)
    }

    if (path.includes('services/oauth2/userinfo') && proxyResponse.data) {
      const salesforceAccessToken = new SalesforceAccessToken()
      const userEmail = proxyResponse.data?.email
      salesforceAccessToken.save(ctx, userEmail, proxyResponse.data)
    }

    logger.info({
      message: 'Salesforce OAuth Provider request success',
      path,
      reqMethod,
    })

    ctx.set('Cache-Control', 'no-cache,no-store')
    ctx.status = proxyResponse.status
    ctx.body = proxyResponse.data

  } catch (error) {
    const {
      vtex: { logger },
    } = ctx

    const log = errorParser(
      ctx,
      error,
      'Request to Salesforce OAuth Provider failed with status',
      'proxyRequest'
    )

    logger.error(log)

    ctx.status = log.status || 500
    ctx.set('Cache-Control', 'no-cache,no-store')
    ctx.body = {
      message: log.message,
      status: log.status
    }
  }
}
