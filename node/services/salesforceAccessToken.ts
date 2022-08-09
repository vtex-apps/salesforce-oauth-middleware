import { createHash } from 'crypto'

export default class SalesforceAccessToken {
  constructor() {}

  public async get(
    ctx: Context,
    userEmail: string
  ): Promise<SalesForceAccessToken> {
    const {
      clients: { vbase },
    } = ctx

    const normalizedFilePath = this.normalizedJSONFile(userEmail)

    return vbase.getJSON<SalesForceAccessToken>(
      'salesforce_access_token',
      normalizedFilePath
    )
  }

  public async save(
    ctx: Context,
    userEmail: string,
    res: SalesforceAccessTokenRes
  ): Promise<SalesForceAccessToken> {
    const {
      clients: { vbase },
    } = ctx

    const endDate = this.getTTL()
    const accessToken = {
      ...res,
      ...{
        endDate,
      },
    }

    const normalizedFilePath = this.normalizedJSONFile(userEmail)

    vbase.saveJSON<SalesForceAccessToken>(
      'salesforce_access_token',
      normalizedFilePath,
      accessToken
    )

    return accessToken
  }

  protected getTTL = (expirationInMinutes?: number) => {
    const ttl = new Date()

    ttl.setMinutes(ttl.getMinutes() + (expirationInMinutes || 1440))

    return ttl
  }

  protected normalizedJSONFile = (filePath: string) =>
    createHash('md5').update(filePath).digest('hex') + '.json'
}
