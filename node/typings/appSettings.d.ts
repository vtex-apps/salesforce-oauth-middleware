export interface AppSettings {
  production: {
    enpoint: string
    credentials: Credentials
  },
  staging: {
    enpoint: string
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
