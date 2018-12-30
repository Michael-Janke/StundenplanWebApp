import { AuthenticationContext } from './authContext';
import { getAuthContext, setAuthContext } from './storage';


export function getToken(resource) {
    return new Promise((resolve, reject) => {
        if (!navigator.onLine) {
            return reject({ message: "offline", msg: "offline" });
        }
        const authContext = getAuthContext();
        if (!authContext.isLoggedIn()) {
            authContext.login();
        }
        authContext.getToken(resource)
            .then(token => {
                resolve(token.access_token);
            }).catch(error => {
                reject(error);
            });
    });
}

export const runApplication = (app) => {
    let authContext = getAuthContext();
    const { code, session_state, state } = window.params;

    if (!authContext) {
        authContext = new AuthenticationContext();
        authContext.login();
        setAuthContext(authContext);
    } else {
        if (code) {
            // back to '/' without reloading page
            window.history.pushState("", "", "/");
            authContext.handleCallback(code, session_state, state);
        }
        app();
    }
}