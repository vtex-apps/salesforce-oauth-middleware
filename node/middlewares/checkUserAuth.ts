import { AuthenticationError } from '@vtex/api'

import { getCurrentUserFromSession } from '../utils/getCurrentUserFromSession'
import { getCurrentUserFromVTEXAuthCookie } from '../utils/getCurrentUserFromVTEXAuthCookie'

function isLogged(user: CurrentUser | null) {
  return user?.email
}

export async function checkUserAuth(ctx: Context, next: () => Promise<any>) {
  let currentUser: CurrentUser | null

  currentUser = await getCurrentUserFromSession(ctx)

  if (!isLogged(currentUser)) {
    currentUser = await getCurrentUserFromVTEXAuthCookie(ctx)
  }

  if (!isLogged(currentUser)) {
    throw new AuthenticationError('User not authenticated')
  }

  ctx.state.currentUser = currentUser as CurrentUser

  await next()
}
