import { getAuthContext, setAuthContext } from './storage';
import UserAuthContext from './contexts/UserAuthContext';
import TokenAuthContext from './contexts/TokenAuthContext';
import trackError from '../trackError';

export function getToken(resource) {
    return new Promise(async (resolve, reject) => {
        const authContext = await getAuthContext();
        authContext
            .getToken(resource)
            .then((token) => {
                resolve(token.access_token);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export const runApplicationToken = (token, app) => {
    setAuthContext(new TokenAuthContext(token), 'token');
    app();
};

export const runApplication = async (app) => {
    const { code, state } = window.params;
    let authContext = await getAuthContext('user');

    if (!authContext) {
        authContext = new UserAuthContext();
        authContext.save();
    }
    if (code) {
        // back to previous path without reloading page
        const hash = JSON.parse(decodeURIComponent(state) || '{}').hash || '';
        window.history.replaceState('', '', window.location.pathname);
        window.history.pushState('', '', window.location.pathname + hash);
        try {
            await authContext.handleCallback(code);
        } catch (error) {
            document.getElementById('loading-heart').innerHTML = '';
            document.getElementById('text-on-splash-screen').innerHTML =
                'Fehler bei der Anmeldung<BR>' + JSON.stringify(error);

            trackError({ upn: authContext.upn || 'login error', code: 1000, error });
            return;
        }
    }

    if (!authContext.isLoggedIn()) {
        authContext.authorize();
    } else {
        document.getElementById('text-on-splash-screen').innerHTML = 'App wird geladen...';
        app();
    }
};
