import { errorParser } from '../parsers/errorParses'
import SalesforceAccessToken from '../services/salesforceAccessToken'

export async function refreshAccessToken(ctx: Context) {
  try {
    const {
      clients: { salesforceProxy },
      state: { currentUser },
    } = ctx

    let refreshedData

    const salesforceAccessToken = new SalesforceAccessToken()
    const salesforceUserInfo = await salesforceAccessToken.get(
      ctx,
      currentUser.email
    )

    const accessToken = salesforceUserInfo.access_token
    const refreshAccessTokenRes = await salesforceProxy.refreshAccessToken(accessToken)
    const refreshedAccessToken = refreshAccessTokenRes.access_token

    if(refreshedAccessToken) {
      const salesforceAccessToken = new SalesforceAccessToken()
      const userEmail = currentUser.email
      refreshedData = await salesforceAccessToken.save(ctx, userEmail, salesforceUserInfo, refreshedAccessToken)
    }

    ctx.set('Cache-Control', 'no-cache,no-store')
    ctx.status = 200
    ctx.body = refreshedData

  } catch (error) {
    const {
      vtex: { logger },
    } = ctx
    let body

    const log = errorParser(
      ctx,
      error,
      'Refresh user access token failed with status',
      'refreshAccessToken'
    )

    logger.error(log)

    if (log.status === 400) {
      body = error.response?.data
    } else {
      body = {
        appMessage: log.appMessage,
        method: log.method,
        status: log.status,
        statusText: log.statusText
      }
    }

    ctx.status = log.status || 500
    ctx.set('Cache-Control', 'no-cache,no-store')
    ctx.body = body
  }
}
