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
      context.production
        ? 'https://agrifarma.cs162.force.com'
        : 'https://partial-agrifarma.cs162.force.com',
      context,
      options
    )
  }

  public async proxyGet(path: string): Promise<IOResponse<any>> {
    const metric = `${this.context.account}-Salesforce-OAuth-Proxy-GET`

    return this.get(path, {
      metric,
      tracing: createTracing(metric),
    })
  }

  public async proxyPost(path: string, body: any): Promise<IOResponse<any>> {
    const metric = `${this.context.account}-Salesforce-OAuth-Proxy-POST`

    return this.post(path, body, {
      metric,
      tracing: createTracing(metric),
    })
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
