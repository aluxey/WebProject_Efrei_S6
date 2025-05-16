import * as msal from '@azure/msal-browser'

export const loginRequest = {
  scopes: ['User.Read']
}

export const msalInstance = new msal.PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
    redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI
  }
})
