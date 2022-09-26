export interface AppSettings {
  production: {
    endpoint: string
    credentials: Credentials
  },
  staging: {
    endpoint: string
    credentials: Credentials
  },
  configs: {
    forceProduction: boolean
  }
}

export interface Credentials {
  clientId: string
  clientSecret: string
}
