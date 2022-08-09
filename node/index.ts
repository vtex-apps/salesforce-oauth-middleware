import type { ClientsConfig } from '@vtex/api'
import { Service, method } from '@vtex/api'

import { Clients } from './clients'
import { getAccessToken } from './handlers/getAccessToken'
import { proxyRequest } from './handlers/proxyRequest'
import { checkUserAuth } from './middlewares/checkUserAuth'
import { prepare } from './middlewares/prepare'

const TIMEOUT_MS = 800
const TWO_SECONDS_MS = 2.5 * TIMEOUT_MS

// This is the configuration for clients available in `ctx.clients`.
const clients: ClientsConfig<Clients> = {
  // We pass our custom implementation of the clients bag, containing the Status client.
  implementation: Clients,
  options: {
    // All IO Clients will be initialized with these options, unless otherwise specified.
    default: {
      retries: 2,
      timeout: TWO_SECONDS_MS,
    },
  },
}

// Export a service that defines route handlers and client options.
export default new Service({
  clients,
  routes: {
    // `status` is the route ID from service.json. It maps to an array of middlewares (or a single handler).
    proxy: [prepare, proxyRequest],
    access_token: method({
      GET: [checkUserAuth, getAccessToken],
    }),
  },
})
