import { errorParser } from '../parsers/errorParses'
import SalesforceAccessToken from '../services/salesforceAccessToken'

export async function getAccessToken(ctx: Context) {
  try {
    const {
      vtex: { logger },
      state: { currentUser },
    } = ctx

    const salesforceAccessToken = new SalesforceAccessToken()
    const salesforceUserAccessToken = await salesforceAccessToken.get(
      ctx,
      currentUser.email
    )

    logger.info({
      message: 'Retrieve user access token success',
      currentUser,
    })

    ctx.set('Cache-Control', 'no-cache,no-store')
    ctx.status = 200
    ctx.body = salesforceUserAccessToken

  } catch (error) {
    const {
      vtex: { logger },
    } = ctx

    const log = errorParser(
      ctx,
      error,
      'Retrieve user access token failed with status',
      'getAccessToken'
    )

    logger.error(log)

    ctx.status = log.status || 500
    ctx.set('Cache-Control', 'no-cache,no-store')
    ctx.body = {
      appMessage: log.appMessage,
      method: log.method,
      status: log.status,
      statusText: log.statusText
    }
  }
}
