import { ResolverError } from '@vtex/api'

import { proxyGetHandler } from './proxyGetHandler'
import { proxyPostHandler } from './proxyPostHandler'
import { errorParser } from '../parsers/errorParses'
import SalesforceAccessToken from '../services/salesforceAccessToken'
import SalesforceRefreshToken from '../services/salesforceRefreshToken'
import { getUserInfo } from './getUserInfoHandler'

export async function proxyRequest(ctx: Context) {
  try {
    const {
      vtex: {
        logger,
        route: {
          params: { path },
        },
      },
      req: { method: reqMethod }
    } = ctx

    let proxyResponse: proxyResponse | any

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
    } else if (path.includes('services/oauth2/token')) {
      const salesforceRefreshToken = new SalesforceRefreshToken()
      const { data: { email } } = await getUserInfo(ctx, proxyResponse.access_token)

      if(!email)
        throw new ResolverError("No user email found")

      salesforceRefreshToken.save(ctx, email, proxyResponse)

    }

    logger.info({
      message: 'Salesforce OAuth Provider request success',
      path,
      reqMethod,
    })

    ctx.set('Cache-Control', 'no-cache,no-store')
    ctx.status = proxyResponse.status || 200
    ctx.body = proxyResponse?.data || proxyResponse

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
