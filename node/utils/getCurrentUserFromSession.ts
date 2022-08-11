import { ResolverError } from '@vtex/api'
import { path } from 'ramda'
import { cleanErrorParser } from '../parsers/cleanErrorParser'

export async function getCurrentUserFromSession(
  ctx: Context
): Promise<CurrentUser | null> {
  try {
    const {
      clients: { session },
      vtex: { logger }
    } = ctx

    const currentSession = await session.getSession(
      ctx.vtex.sessionToken as string,
      ['*']
    )
    const thisSession = currentSession.sessionData as Session

    if (!thisSession || !thisSession.namespaces) {
      const warn = cleanErrorParser("Error getting logged user info from session", new ResolverError('Error fetching session data'))
      logger.warn(warn)
      return null
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

    const log = cleanErrorParser("Error getting logged user info from session", error)
    logger.error(log)

    return null
  }
}
