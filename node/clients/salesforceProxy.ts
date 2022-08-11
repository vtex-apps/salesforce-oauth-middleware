import type {
  InstanceOptions,
  IOContext,
  IOResponse,
  RequestConfig,
} from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import { createTracing } from '../utils/'
import { statusToError } from '../utils/'

export default class SalesforceProxy extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    // TO-DO: Fix production URL with the correct one
    super(
      context.production && context.account === "arcaplanet"
        ? 'https://my.arcaplanet.it'
        : 'https://dev1-agrifarma.cs84.force.com',
      context,
      options
    )
  }

  public async proxyGet(path: string, accessToken: string): Promise<IOResponse<any>> {
    const metric = `${this.context.account}-Salesforce-OAuth-Proxy-GET`
    const host = this.getHost(this.context)
    return this.get(path, {
      params: {
        access_token: accessToken
      },
      headers: {
        'host': host,
        'x-forwarded-host': host
      },
      metric,
      tracing: createTracing(metric),
    })
  }

  public async proxyPost(path: string, body: any, accessToken: string): Promise<IOResponse<any>> {
    const metric = `${this.context.account}-Salesforce-OAuth-Proxy-POST`
    const host = this.getHost(this.context)
    return this.post(path, body, {
      params: {
        access_token: accessToken
      },
      headers: {
        'host': host,
        'x-forwarded-host': host
      },
      metric,
      tracing: createTracing(metric),
    })
  }

  protected getHost = (ctx: IOContext) => {
     return ctx.production && ctx.account === "arcaplanet"
        ? 'my.arcaplanet.it'
        : 'dev1-agrifarma.cs84.force.com'
  }

  protected get = <T = any>(url: string, config?: RequestConfig) =>
    this.http.getRaw<T>(url, config).catch(statusToError) as Promise<
      IOResponse<T>
    >

  protected put = <T = any>(url: string, data?: any, config?: RequestConfig) =>
    this.http.put<T>(url, data, config).catch(statusToError) as Promise<
      IOResponse<T>
    >

  protected post = <T = any>(url: string, data?: any, config?: RequestConfig) =>
    this.http.post<T>(url, data, config).catch(statusToError) as Promise<
      IOResponse<T>
    >

  protected delete = <T = any>(url: string, config?: RequestConfig) =>
    this.http.delete<T>(url, config).catch(statusToError) as Promise<
      IOResponse<T>
    >
}
