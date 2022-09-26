import { ServiceContext, RecorderState, ParamsContext } from '@vtex/api'
import type { IOContext } from '@vtex/api'
import { Clients } from '../clients'
import { AppSettings } from './appSettings'

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, State, ParamsContextm, CustomIOContext>

  interface State extends RecorderState {
    body: any
    salesforceAccessToken: string
    currentUser: CurrentUser
  }

  interface CustomIOContext extends IOContext {
    appSettings: AppSettings
  }

  interface CurrentUser {
    email: string
    userId: string
  }
}
