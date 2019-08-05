import { getAuthContext, setAuthContext } from './storage';
import UserAuthContext from './contexts/UserAuthContext';
import TokenAuthContext from './contexts/TokenAuthContext';

export function getToken(resource) {
    return new Promise((resolve, reject) => {
        const authContext = getAuthContext();
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
    setAuthContext(new TokenAuthContext(token));
    app();
};

export const runApplication = app => {
    const { code, session_state, state } = window.params;
    let authContext = getAuthContext();

    if (!authContext) {
        authContext = new UserAuthContext();
        setAuthContext(authContext);
    }
    if (code) {
        // back to '/' without reloading page
        window.history.replaceState('', '', window.location.pathname);
        authContext.handleCallback(code, session_state, state);
    }
    if (!authContext.isLoggedIn() && authContext.isLoggingIn()) {
        authContext.loadAuthCode();
    } else {
        app();
    }
};
