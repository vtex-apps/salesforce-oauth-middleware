interface Session {
  namespaces?: {
    profile?: {
      id: {
        value: string
      }
      email: {
        value: string
      }
    }
    authentication?: {
      storeUserId: {
        value: string
      }
      storeUserEmail: {
        value: string
      }
    }
  }
}
