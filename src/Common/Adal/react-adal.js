/* eslint-disable */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthenticationContext = undefined;
exports.adalGetToken = adalGetToken;
exports.runWithAdal = runWithAdal;
exports.adalFetch = adalFetch;

var _adal = require('./adal');

var _adal2 = _interopRequireDefault(_adal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AuthenticationContext = exports.AuthenticationContext = _adal2.default;

function adalGetToken(authContext, resourceGuiId) {
  return new Promise(function (resolve, reject) {
    authContext.acquireToken(resourceGuiId, function (message, token, msg) {
      if (!msg) resolve(token);
      // eslint-disable-next-line
      else reject({ message: message, msg: msg });
    });
  });
}


function runWithAdal(authContext, app) {
  //it must run in iframe to for refreshToken (parsing hash and get token)
  authContext.handleWindowCallback();
  //progressive web apps do not handle a window.location same origin change as reload, but as simple hash change
  //so we have to reload the page if the hash changes and react is not already loaded or we have a blank white page, 
  //if adal redirects back the new token via the new hash url
  window.addEventListener("hashchange", () => {
    authContext.handleWindowCallback.bind(authContext)();
    window.setTimeout(() => {
      if(window.document.getElementById("root").childElementCount == 0) {
        window.location.reload();
      }
    }, 100);
  }, false);
  //prevent iframe double app !!!
  if (window === window.parent) {
    if (!authContext.isCallback(window.location.hash)) {
      if (!authContext.getCachedToken(authContext.config.clientId) || !authContext.getCachedUser()) {
        authContext.login();
      } else {
        app();
      }
    }
  }
}

function adalFetch(authContext, resourceGuiId, fetch, url, options) {
  return adalGetToken(authContext, resourceGuiId).then(function (token) {
    var o = options;
    if (!o.headers) o.headers = {};
    o.headers.Authorization = 'Bearer ' + token;
    return fetch(url, options);
  });
}