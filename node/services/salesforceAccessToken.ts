import { createHash } from 'crypto'

export default class SalesforceAccessToken {
  constructor() {}

  public async get(
    ctx: Context,
    userEmail: string
  ): Promise<SalesForceAccessToken> {
    const {
      clients: { customVBase },
    } = ctx

    const normalizedFilePath = this.normalizedJSONFile(userEmail)

    return customVBase.getJSON<SalesForceAccessToken>(
      'sf_token',
      normalizedFilePath
    )
  }

  public async save(
    ctx: Context,
    userEmail: string,
    res: SalesforceAccessTokenRes,
    accessToken?: string
  ): Promise<SalesForceAccessToken> {
    const {
      clients: { customVBase },
      state: { salesforceAccessToken }
    } = ctx

    const endDate = this.getTTL()
    const userInfo = {
      ...res,
      ...{
        access_token: accessToken ?? salesforceAccessToken,
        end_date: endDate,
      },
    }

    const normalizedFilePath = this.normalizedJSONFile(userEmail)

    customVBase.saveJSON<SalesForceAccessToken>(
      'sf_token',
      normalizedFilePath,
      userInfo
    )

    return userInfo
  }

  protected getTTL = (expirationInMinutes?: number) => {
    const ttl = new Date()

    ttl.setMinutes(ttl.getMinutes() + (expirationInMinutes || 1440))

    return ttl
  }

  protected normalizedJSONFile = (filePath: string) =>
    createHash('md5').update(filePath).digest('hex') + '.json'
}
