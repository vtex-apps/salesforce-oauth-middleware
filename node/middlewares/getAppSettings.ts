import { ResolverError } from '@vtex/api'

import { appSettingsService } from "../services/appSettingsService";
import type { AppSettings } from '../typings/appSettings';

export async function getAppSettings(ctx: Context, next: () => Promise<any>) {
  const {
        clients: { apps}
  } = ctx

  const service = appSettingsService(ctx.vtex.account, ctx.vtex.workspace, apps)
  const appSettings: AppSettings = await service.getSettings()

  if (!appSettings) {
    throw new ResolverError('No app settings found')
  }

  if (!appSettings.staging.enpoint || !appSettings.production.enpoint ) {
    throw new ResolverError('Missing Staging or Production endpoint app config')
  }

  if (
    !appSettings.staging.credentials.clientId || !appSettings.staging.credentials.clientSecret
    || !appSettings.production.credentials.clientId || !appSettings.production.credentials.clientSecret
  ) {
    throw new ResolverError('Missing Staging or Production credentials app config')
  }

  ctx.vtex.appSettings = appSettings


  await next()
}
