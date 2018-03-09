import { AuthenticationContext, adalFetch } from 'react-adal';

export const adalConfig = {
  tenant: '778d176d-0f75-472a-afcc-a85553ab06dd',
  clientId: 'fb82e2a9-1efd-4a8e-9ac6-92413ab4b58b',
  endpoints: {
    "https://www.wolkenberg-gymnasium.de/wolkenberg-app/api-2/": 'cc7342c1-42a3-4fa7-8f42-08d39285cac9',
    "https://outlook.office.com/": "https://outlook.office.com/"
  },
  cacheLocation: 'localStorage',
};

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (fetch, url, options) =>
  adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);