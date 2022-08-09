import { cleanError, ResolverError } from '@vtex/api'

export async function getCurrentUserFromVTEXAuthCookie(
  ctx: Context
): Promise<CurrentUser | null> {
  try {
    const {
      clients: { vtexid },
    } = ctx

    const { data: currentAuthUser } = await vtexid.getUserFromVTEXID()

    if (!currentAuthUser || !currentAuthUser.user) {
      throw new ResolverError('Error fetching VTEX ID user data')
    }

    return {
      email: currentAuthUser.user as string,
      userId: currentAuthUser.userId as string,
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
