import ls from 'local-storage';
import { AuthenticationContext } from './authContext';

const CONTEXT_KEY = 'authorization_v3';

// remove old keys
['authorization', 'authorization_v2'].forEach(ls.remove);

/**
 * @param {Window} win
 * @returns {AuthenticationContext}
 */
export const getAuthContext = (win = window) => {
    let authContext = win[CONTEXT_KEY] || ls(CONTEXT_KEY);
    if (authContext) {
        if (!authContext.toObject) {
            authContext = new AuthenticationContext(authContext);
            setAuthContext(authContext, win);
        }
        return authContext;
    }
    return null;
};

export const setAuthContext = (authContext, win = window) => {
    win[CONTEXT_KEY] = authContext;
    ls(CONTEXT_KEY, authContext && authContext.toObject());
};
