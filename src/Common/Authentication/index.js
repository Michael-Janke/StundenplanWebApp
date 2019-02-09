import { AuthenticationContext } from './authContext';
import { getAuthContext, setAuthContext } from './storage';
import { TokenAuthContext } from './tokenAuthContext';


export function getToken(resource) {
    return new Promise((resolve, reject) => {
        const authContext = getAuthContext();

        if (!authContext.isLoggedIn() && !authContext.isLoggingIn()) {
            console.log("not logged in");
            // authContext.login();
            return reject('not logged in');
        }
        authContext.getToken(resource)
            .then(token => {
                resolve(token.access_token);
            }).catch(error => {
                reject(error);
            });
    });
}


export const runApplicationToken = (token, app) => {
    setAuthContext(new TokenAuthContext(token));
    app();
}

export const runApplication = (app) => {
    const { code, session_state, state } = window.params;
    let authContext = getAuthContext();

    if (!authContext) {
        authContext = new AuthenticationContext();
        setAuthContext(authContext);
    }
    if (code) {
        // back to '/' without reloading page
        window.history.replaceState("", "", window.location.pathname);
        authContext.handleCallback(code, session_state, state);
    }
    if (authContext.isLoggingIn() && !authContext.isLoggedIn()) {
        authContext.allowAuthentication();
        authContext.loadAuthCode();
    } else {
        app();
    }
}