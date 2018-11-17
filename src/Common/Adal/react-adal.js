import AuthenticationContext_ from './adal';

export const AuthenticationContext = AuthenticationContext_;

export function adalGetToken(authContext, resourceGuiId, callback) {
  return new Promise((resolve, reject) => {
    if (!navigator.onLine) {
        return reject({ message: "offline", msg: "offline" });
    }
    if (!authContext.getCachedToken(authContext.config.clientId) || !authContext.getCachedUser()) {
      return authContext.login();
    }
    authContext.acquireToken(resourceGuiId, (message, token, msg) => {
      if (!msg) {
        resolve(token);
      } else
        if (message.includes('AADSTS50076') || message.includes('AADSTS50079')) {
          // Default to redirect for multi-factor authentication,
          // but allow using popup if a callback is provided
          callback ? authContext.acquireTokenPopup(resourceGuiId, callback)
            : authContext.acquireTokenRedirect(resourceGuiId);

        } else reject({ message, msg });  // eslint-disable-line
    });
  });
}

export function runWithToken(authContext, app) {
  app();
};

export function runWithAdal(authContext, app) {
  //it must run in iframe to for refreshToken (parsing hash and get token)
  authContext.handleWindowCallback();
  //progressive web apps do not handle a window.location same origin change as reload, but as simple hash change
  //so we have to reload the page if the hash changes and react is not already loaded or we have a blank white page, 
  //if adal redirects back the new token via the new hash url
  window.addEventListener("hashchange", () => {
    authContext.handleWindowCallback.bind(authContext)();
    window.setTimeout(() => {
      if (window.document.getElementById("root").childElementCount === 0) {
        window.location.reload();
        console.log("reloaded for pwa-bug")
      }
    }, 100);
  }, false);
  //prevent iframe double app !!!
  if (window === window.parent) {
    if (!authContext.isCallback(window.location.hash)) {
      if (!authContext.getCachedUser()) {
        authContext.login();
      } else {
        app();
      }
    }
  }
}

export function adalFetch(authContext, resourceGuiId, fetch, url, options) {
  return adalGetToken(authContext, resourceGuiId).then((token) => {
    const o = options || {};
    if (!o.headers) o.headers = {};
    o.headers.Authorization = `Bearer ${token}`;
    return fetch(url, o);
  });
}