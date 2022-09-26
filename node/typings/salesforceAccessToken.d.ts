interface ISalesforceAccessTokenRes {
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

interface ISalesforceAccessToken extends ISalesforceAccessTokenRes {
    end_date: Date
}

interface ISalesforceRefreshToken {
  access_token: string
  id: string
  id_token?: string
  instance_url: string
  issued_at: string
  refresh_token?: string
  scope: string
  sfdc_community_id: string
  sfdc_community_url: string
  signature: string
  token_type: string
}
