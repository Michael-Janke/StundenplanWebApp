import { AuthenticationContext, adalFetch } from './react-adal';

export const adalConfig = {
  tenant: '778d176d-0f75-472a-afcc-a85553ab06dd',
  clientId: 'fb82e2a9-1efd-4a8e-9ac6-92413ab4b58b',
  endpoints: {
    "https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/": 'cc7342c1-42a3-4fa7-8f42-08d39285cac9',
    "https://graph.microsoft.com/": "https://graph.microsoft.com/"
  },
  cacheLocation: 'localStorage',
  popUp: false,
  postLogoutRedirectUri: 'https://www.wolkenberg-gymnasium.de'
};

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (fetch, url, options) =>
  adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);