## Objective

The purpose of this document is to detail the implementation of the middleware responsible for communicating with the Salesforce OAuth provider to store the unique access token per user to enable the front end on the ecommerce my account page to retrieve it later.

## Limitations

Currently, the VTEX ID authentication cookie has a 24 hours lifetime, and the frontend should manage the token refresh. During that process, the VTEX ID will not call the Salesforce OAuth provider to refresh their token.

So, in specific cases, it will be possible that we have a valid VTEX ID token and an expired Salesforce token. When it happens, until we develop the process to refresh it in the current app and the frontend, we will need to redirect the user to the login page to re-authenticate.


## Middleware Workflow

Currently, the VTEX ID speaks directly with the Salesforce OAuth. With the current implementation, the VTEX ID will talk with the middleware, who will be responsible for communicating with Salesforce.

During the user authentication flow, at the moment, the VTEX ID requests to exchange the user's data with Salesforce we will get the user's email and token and store it in a database to be retrieved thru an API exposed by the app.


###Frontend Workflow

The frontend must handle the process of calling the middleware API and then store the access token in the local storage. The response also contains the expiration date, so it is possible to manage when it is about to expire and handle the user behavior.


## API Reference

### Proxy Endpoint

Endpoint used as a proxy to the Salesforce OAuth. The path from Salesforce should be exactly the same as in the Salesforce documentation. The only difference is that we need to add the /_v/oauth-proxy in the beginning of each route.


##### Método GET, POST:
```
https://{{accountName}}.myvtex.com/_v/oauth-proxy/authorizations/{{salesforce-path}}
```

Headers and body should be the same as described in OAuth Provider documentation from Salesforce.

### Retrieve Access Token

Endpoint used to retrieve a user Salesforce access token.

##### Método GET:
```
https://{{accountName}}.myvtex.com/_v/oauth-proxy/autheticated/access-token/
```

##### Header:
```
Accept: application/json 
Content-Type: application/json 
VtexIdclientAutCookie: {{VtexIdclientAutCookie}}
```

##### Response:
```Status: 200 OK```  

```
{
    "access_token": "00D5t0000008hj9!AQ8AQA_xkPvedrofhOyhlqVV42Fnj77a9bDInvg5zLK_v3DyqfT9rvY0HP97JNNQbSjGO4hFivEirriZG_SzBWJXV5geuQjk",
    "refresh_token": "5Aep861lc_wYYUnDaiW1zKDagpX92OZZ4mTIiZ.peKrDFOJ2jUULYIQeNMyz2vc3zjf6sleN6d5q49lnyiU4bEL",
    "issued_at": "1660006320273"
    "expires_at": "1660006320273"
}
```

If the response has the 401 status code, you should refresh the token following what is described in the limitations section.
