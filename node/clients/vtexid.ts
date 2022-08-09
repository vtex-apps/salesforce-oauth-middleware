import type {
  InstanceOptions,
  IOContext,
  IOResponse,
  RequestConfig,
} from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { createTracing } from '../utils/'
import { statusToError } from '../utils/'

export default class VTEXID extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    // TO-DO: Fix production URL with the correct one
    super('vtexid.vtex.com.br', context, options)
  }

  public async getUserFromVTEXID(): Promise<IOResponse<AuthUser>> {
    const metric = `${this.context.account}-VTEXID-User-GET`

    return this.get('/api/vtexid/pub/authenticated/user', {
      params: {
        account: this.context.account,
        authToken: this.context.storeUserAuthToken,
      },
      metric,
      tracing: createTracing(metric),
    })
  }

  protected get = <T = any>(url: string, config?: RequestConfig) =>
    this.http.getRaw<T>(url, config).catch(statusToError) as Promise<
      IOResponse<T>
    >
}
