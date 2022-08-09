import { IOClients } from '@vtex/api'

import SalesforceProxy from './salesforceProxy'
import VTEXID from './vtexid'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get salesforceProxy() {
    return this.getOrSet('salesforceProxy', SalesforceProxy)
  }

  public get vtexid() {
    return this.getOrSet('vtexid', VTEXID)
  }
}
