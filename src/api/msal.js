// src/api/msal.js
import * as msal from '@azure/msal-browser'

export const loginRequest = {
  scopes: ["User.Read"]
}

export const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId: import.meta.env.VUE_APP_OAUTH_MICROSOFT_CLIENT_ID,
    redirectUri: import.meta.env.VUE_APP_OAUTH_REDIRECT_URI
  }
})
