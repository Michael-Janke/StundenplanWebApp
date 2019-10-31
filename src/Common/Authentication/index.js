import { getAuthContext, setAuthContext } from './storage';
import UserAuthContext from './contexts/UserAuthContext';
import TokenAuthContext from './contexts/TokenAuthContext';

export function getToken(resource) {
    return new Promise(async (resolve, reject) => {
        const authContext = await getAuthContext();
        authContext
            .getToken(resource)
            .then(token => {
                resolve(token.access_token);
            })
            .catch(error => {
                reject(error);
            });
    });
}

export const runApplicationToken = (token, app) => {
    setAuthContext(new TokenAuthContext(token), 'token');
    app();
};

export const runApplication = async app => {
    const { code, session_state, state } = window.params;
    let authContext = await getAuthContext('user');

    if (!authContext) {
        authContext = new UserAuthContext();
        setAuthContext(authContext);
    }
    if (code) {
        // back to previous path without reloading page
        const hash = JSON.parse(decodeURIComponent(state) || '{}').hash || '';
        window.history.replaceState('', '', window.location.pathname + hash);
        authContext.handleCallback(code, session_state, state);
    }
    if (!authContext.isLoggedIn() && authContext.isLoggingIn()) {
        authContext.loadAuthCode();
    } else {
        app();
    }
};
