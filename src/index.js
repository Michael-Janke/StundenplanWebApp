import { runApplication, runApplicationToken } from './Common/Authentication';
import 'react-app-polyfill/stable';
import localForage from 'localforage';
import { unregister } from './serviceWorkerRegistration';

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
window.params = deparam(window.location.href);

if (window.location.hash === '#reset') {
    unregister();
    localForage.clear().then(() => {
        window.location.hash = '';
        window.location.reload();
    });
} else {
    if (window.params.token) {
        let client_secret = window.params.token;
        runApplicationToken(client_secret, () => {
            // eslint-disable-next-line
            require('./indexReact.js');
        });
    } else {
        runApplication(() => {
            // eslint-disable-next-line
            require('./indexReact.js');
        });
    }
}
