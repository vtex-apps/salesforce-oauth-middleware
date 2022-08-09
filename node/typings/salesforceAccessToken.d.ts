interface SalesforceAccessTokenRes {
  access_token: string
  id: string
  id_token: string
  instance_url: string
  issued_at: string
  refresh_token: string
  scope: string
  sfdc_community_id: string
  sfdc_community_url: string
  signature: string
  token_type: string
}

interface SalesForceAccessToken {
  access_token: string
  id: string
  id_token: string
  instance_url: string
  issued_at: string
  refresh_token: string
  scope: string
  sfdc_community_id: string
  sfdc_community_url: string
  signature: string
  token_type: string
  endDate: Date
}
