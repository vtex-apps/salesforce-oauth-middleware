import { ResolverError } from '@vtex/api'
import { errorParser } from '../parsers/errorParses'
import SalesforceAccessToken from '../services/salesforceAccessToken'
import SalesforceRefreshToken from '../services/salesforceRefreshToken'

export async function refreshAccessToken(ctx: Context) {
  try {
    const {
      clients: { salesforceProxy },
      state: { currentUser },
    } = ctx

    let refreshedData

    const salesforceRefreshToken = new SalesforceRefreshToken()
    const refreshTokenData: ISalesforceRefreshToken = await salesforceRefreshToken.get(
      ctx,
      currentUser.email
    )
    const salesforceAccessToken = new SalesforceAccessToken()
    const accessTokenData: ISalesforceAccessToken = await salesforceAccessToken.get(
      ctx,
      currentUser.email
    )

    const refreshToken = refreshTokenData.refresh_token

    if (!refreshToken) {
      throw new ResolverError("No refresh token found")
    }

    const refreshAccessTokenRes: ISalesforceRefreshToken = await salesforceProxy.refreshToken(refreshToken)
    const refreshedAccessToken: string = refreshAccessTokenRes.access_token

    if(refreshedAccessToken) {
      refreshedData = await salesforceAccessToken.save(ctx, currentUser.email, accessTokenData, refreshedAccessToken)
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
