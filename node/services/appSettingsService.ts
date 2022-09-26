import type { Apps } from '@vtex/api'
import { LRUCache } from '@vtex/api'

import type { AppSettings } from '../typings/appSettings'
import { DEFAULT_SETTINGS_CACHE_MAX_AGE_IN_MS } from '../utils/constants'

export const appSettingsService = (
  account: string,
  workspace: string,
  apps: Apps
) => {
  const getSettings = async () => {
    const SettingsCache = new LRUCache<string, AppSettings>({ max: 5000 })
    const cacheKey = `${account}-${workspace}-${process.env.VTEX_APP_ID}`

    return (await SettingsCache.getOrSet(cacheKey, () =>
      apps.getAppSettings(process.env.VTEX_APP_ID as string).then((res) => {
        return {
          value: res,
          maxAge: DEFAULT_SETTINGS_CACHE_MAX_AGE_IN_MS,
        }
      })
    )) as AppSettings
  }

  return {
    getSettings,
  }
}
