import {
  runWithAdal,
  runWithToken,
  AuthenticationContext,
} from './Common/Adal/react-adal';
import {
  authContext,
  provideAuthContext,
  adalConfig,
} from './Common/Adal/adalConfig';
import { TokenAuthContext } from './Common/Adal/tokenAuthContext';

let deparam = function (querystring) {
  // remove any preceding url and split
  querystring = querystring.substring(querystring.indexOf('?') + 1).split('&');
  var params = {},
    pair,
    d = decodeURIComponent;
  // march and parse
  for (var i = querystring.length - 1; i >= 0; i--) {
    pair = querystring[i].split('=');
    params[d(pair[0])] = d(pair[1] || '');
  }

  return params;
};
let params = (window.params = deparam(window.location.href));
console.log(window.params);
if (params.token) {
  provideAuthContext(new TokenAuthContext(params.token, adalConfig));
  runWithToken(params.token, () => {
    require('./indexReact.js');
  });
} else {
  provideAuthContext(new AuthenticationContext(adalConfig));
  runWithAdal(authContext, () => {
    // eslint-disable-next-line
    require('./indexReact.js');
  });
}
