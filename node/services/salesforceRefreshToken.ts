import { createHash } from 'crypto'

export default class SalesforceRefreshToken {
  constructor() {}

  public async get(
    ctx: Context,
    userEmail: string
  ): Promise<ISalesforceRefreshToken> {
    const {
      clients: { customVBase },
    } = ctx

    const normalizedFilePath = this.normalizedJSONFile(userEmail)

    return customVBase.getJSON<ISalesforceRefreshToken>(
      'sf_refresh_token',
      normalizedFilePath
    )
  }

  public async save(
    ctx: Context,
    userEmail: string,
    res: ISalesforceRefreshToken
  ): Promise<ISalesforceRefreshToken> {
    const {
      clients: { customVBase }
    } = ctx

    const normalizedFilePath = this.normalizedJSONFile(userEmail)

    customVBase.saveJSON<ISalesforceRefreshToken>(
      'sf_refresh_token',
      normalizedFilePath,
      res
    )

    return res
  }

  protected getTTL = (expirationInMinutes?: number) => {
    const ttl = new Date()

    ttl.setMinutes(ttl.getMinutes() + (expirationInMinutes || 1440))

    return ttl
  }

  protected normalizedJSONFile = (filePath: string) =>
    createHash('md5').update(filePath).digest('hex') + '.json'
}
