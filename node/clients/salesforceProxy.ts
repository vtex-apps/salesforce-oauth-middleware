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
      context.production || (context as CustomIOContext).appSettings.configs.forceProduction
        ? (context as CustomIOContext).appSettings.production.endpoint
        : (context as CustomIOContext).appSettings.staging.endpoint,
      context,
      options
    )
  }

  public async proxyGet(path: string, params: {}): Promise<IOResponse<any>> {
    const metric = `${this.context.account}-Salesforce-OAuth-Proxy-GET`
    const host = this.getHost()
    return this.get(path, {
      params,
      headers: {
        'host': host,
        'x-forwarded-host': host
      },
      metric,
      tracing: createTracing(metric),
    })
  }

  public async proxyPost(path: string, body: any, params: {}): Promise<IOResponse<any>> {
    const metric = `${this.context.account}-Salesforce-OAuth-Proxy-POST`
    const host = this.getHost()
    return this.post(path, body, {
      params,
      headers: {
        'host': host,
        'x-forwarded-host': host
      },
      metric,
      tracing: createTracing(metric),
    })
  }

  public async refreshToken(refreshToken: string): Promise<IOResponse<any>> {
    const metric = `${this.context.account}-Salesforce-OAuth-RefreshToken-POST`
    const host = this.getHost()
    const env = this.context.production || (this.context as CustomIOContext).appSettings.configs.forceProduction ? "production" : "staging"
    const credentials = (this.context as CustomIOContext).appSettings[env].credentials

    return this.post('/services/oauth2/token', null, {
      params: {
        grant_type: "refresh_token",
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: refreshToken
      },
      headers: {
        'host': host,
        'x-forwarded-host': host
      },
      metric,
      tracing: createTracing(metric),
    })
  }

  protected getHost: () => string = () => {
    return new URL(this.options?.baseURL as string).hostname
  }

  protected get = <T = any>(url: string, config?: RequestConfig) =>
    this.http.getRaw<T>(url, config).catch(statusToError) as Promise<
      IOResponse<T>
    >

  protected put = <T = any>(url: string, data?: any, config?: RequestConfig) =>
    this.http.putRaw<T>(url, data, config).catch(statusToError) as Promise<
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
