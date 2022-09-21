import { AxiosError } from 'axios'
import {
  inflightURL,
  InstanceOptions,
  IOResponse,
  RequestTracingConfig,
} from '@vtex/api/lib/HttpClient'
import { InfraClient, IOContext } from '@vtex/api'
import { IgnoreNotFoundRequestConfig } from '@vtex/api/lib/HttpClient/middlewares/notFound'
import { Logger } from '@vtex/api/lib/service/logger/logger'

const appId = process.env.VTEX_APP_ID
const [runningAppName] = appId ? appId.split('@') : ['']

const routes = {
  Bucket: (bucket: string) => `/buckets/${runningAppName}/${bucket}`,
  File: (bucket: string, path: string) => `${routes.Bucket(bucket)}/files/${path}`,
  Files: (bucket: string) => `${routes.Bucket(bucket)}/files`,
}

export class CustomVBase extends InfraClient {
  constructor (context: IOContext, options?: InstanceOptions) {
    super('vbase@2.x', { ...context, workspace: "master" }, options)
    if (runningAppName === '') {
      throw new Error(`Invalid path to access VBase. Variable VTEX_APP_ID is not available.`)
    }
  }

  public getJSON = <T>(bucket: string, path: string, nullIfNotFound?: boolean, conflictsResolver?: ConflictsResolver<T>, tracingConfig?: RequestTracingConfig) => {
    return this.getRawJSON<T>(bucket, path, nullIfNotFound, conflictsResolver, tracingConfig)
      .then(response => response.data)
  }

  public getRawJSON = <T>(bucket: string, path: string, nullIfNotFound?: boolean, conflictsResolver?: ConflictsResolver<T>, tracingConfig?: RequestTracingConfig) => {
    const headers = conflictsResolver? {'X-Vtex-Detect-Conflicts': true}: {}
    const inflightKey = inflightURL
    const metric = 'vbase-get-json'
    return this.http.getRaw<T>(routes.File(bucket, path), { headers, inflightKey, metric, nullIfNotFound, tracing: {
      requestSpanNameSuffix: metric,
      ...tracingConfig?.tracing,
    }} as IgnoreNotFoundRequestConfig)
      .catch(async (error: AxiosError<T>) => {
        const { response } = error
        if (response && response.status === 409 && conflictsResolver) {
          const conflictsMergedData = await conflictsResolver.resolve(this.context.logger)
          return { ...response, data: conflictsMergedData } as IOResponse<T>
        }
        throw error
      })
  }

  public saveJSON = <T>(bucket: string, path: string, data: T, tracingConfig?: RequestTracingConfig, ifMatch?: string) => {
    const headers: Headers = { 'Content-Type': 'application/json' }
    if (ifMatch) {
      headers['If-Match'] = ifMatch
    }
    const metric = 'vbase-save-json'
    return this.http.put(routes.File(bucket, path), data, {headers, metric, tracing: {
      requestSpanNameSuffix: metric,
      ...tracingConfig?.tracing,
    }})
  }
}

interface Headers { [key: string]: string | number }

export interface ConflictsResolver<T>{
  resolve: (logger?: Logger) => T | Promise<T>
}
