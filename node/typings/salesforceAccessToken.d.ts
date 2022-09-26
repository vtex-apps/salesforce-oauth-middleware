interface SalesforceAccessTokenRes {
  sub: string
  user_id: string
  organization_id: string
  preferred_username: string
  nickname: string
  name: string
  email: string
  email_verified: boolean
  given_name: string
  family_name: string
  zoneinfo: string
  photos: {
      picture: string
      thumbnail: string
  }
  profile: string
  picture: string
  address: {
      country: string
  }
  urls: {
      enterprise: string
      metadata: string
      partner: string
      rest: string
      sobjects: string
      search: string
      query: string
      recent: string
      tooling_soap: string
      tooling_rest: string
      profile: string
      feeds: string
      groups: string
      users: string
      feed_items: string
      feed_elements: string
      custom_domain: string
  }
  active: boolean
  user_type: string
  language: string
  locale: string
  utcOffset: number
  updated_at: string
}

interface SalesForceAccessToken {
  sub: string
  user_id: string
  organization_id: string
  preferred_username: string
  nickname: string
  name: string
  email: string
  email_verified: boolean
  given_name: string
  family_name: string
  zoneinfo: string
  photos: {
      picture: string
      thumbnail: string
  }
  profile: string
  picture: string
  address: {
      country: string
  }
  urls: {
      enterprise: string
      metadata: string
      partner: string
      rest: string
      sobjects: string
      search: string
      query: string
      recent: string
      tooling_soap: string
      tooling_rest: string
      profile: string
      feeds: string
      groups: string
      users: string
      feed_items: string
      feed_elements: string
      custom_domain: string
  }
  active: boolean
  user_type: string
  language: string
  locale: string
  utcOffset: number
  updated_at: string
  access_token: string
  end_date: Date
}
