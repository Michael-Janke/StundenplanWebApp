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
        // back to '/' without reloading page
        var authState = state ? JSON.parse(state) : {};
        window.params.replaceState('', '', authState.post_redirect);
        authContext.handleCallback(code, session_state, authState);
    }
    if (!authContext.isLoggedIn() && authContext.isLoggingIn()) {
        authContext.loadAuthCode();
    } else {
        app();
    }
};
