
import { runApplication } from './Common/Authentication';

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

} else {
    runApplication(() => {
        // eslint-disable-next-line
        require('./indexReact.js');
    })

}
