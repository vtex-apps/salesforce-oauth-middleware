export async function getUserInfo(ctx: Context, accessToken: string) {
  const {
    clients: { salesforceProxy }
  } = ctx

  return salesforceProxy.proxyGet("/services/oauth2/userinfo", { access_token: accessToken })
}
