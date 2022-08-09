import { cleanError, ResolverError } from '@vtex/api'
import { path } from 'ramda'

export async function getCurrentUserFromSession(
  ctx: Context
): Promise<CurrentUser | null> {
  try {
    const {
      clients: { session },
    } = ctx

    const currentSession = await session.getSession(
      ctx.vtex.sessionToken as string,
      ['*']
    )
    const thisSession = currentSession.sessionData as Session

    if (!thisSession || !thisSession.namespaces) {
      throw new ResolverError('Error fetching session data')
    }

    const idPath = ['namespaces', 'authentication', 'storeUserId', 'value']
    const emailPath = [
      'namespaces',
      'authentication',
      'storeUserEmail',
      'value',
    ]

    return {
      email: path(emailPath, thisSession) as string,
      userId: path(idPath, thisSession) as string,
    }
  } catch (error) {
    const {
      vtex: { logger },
    } = ctx

    const cleanedError = cleanError(error)
    const log = {
      ...cleanedError,
      ...{
        customMessage: 'Error getting logged user info',
      },
    }

    logger.error(log)

    return null
  }
}
