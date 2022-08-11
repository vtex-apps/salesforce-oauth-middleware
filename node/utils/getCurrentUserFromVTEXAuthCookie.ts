import { ResolverError } from '@vtex/api'
import { cleanErrorParser } from '../parsers/cleanErrorParser'

export async function getCurrentUserFromVTEXAuthCookie(
  ctx: Context
): Promise<CurrentUser | null> {
  try {
    const {
      clients: { vtexid },
      vtex: { logger }
    } = ctx

    const { data: currentAuthUser } = await vtexid.getUserFromVTEXID()

    if (!currentAuthUser || !currentAuthUser.user) {
      const warn = cleanErrorParser("Error getting logged user info from cookie", new ResolverError('Error fetching VTEX ID user data'))
      logger.warn(warn)
      return null
    }

    return {
      email: currentAuthUser.user as string,
      userId: currentAuthUser.userId as string,
    }
  } catch (error) {
    const {
      vtex: { logger },
    } = ctx

    const log = cleanErrorParser("Error getting logged user info from cookie", error)
    logger.error(log)

    return null
  }
}
