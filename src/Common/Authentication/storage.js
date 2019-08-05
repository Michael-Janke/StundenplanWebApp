import ls from 'local-storage';
import TokenAuthContext from './contexts/TokenAuthContext';
import UserAuthContext from './contexts/UserAuthContext';
const classMap = {
    'user': UserAuthContext,
    'token': TokenAuthContext,
};

const CONTEXT_KEY = 'authorization_v4';

// remove old keys
['authorization', 'authorization_v2', 'authorization_v3'].forEach(ls.remove);

/**
 * @param {Window} win
 * @returns {AuthenticationContext}
 */
export const getAuthContext = (win = window) => {
    let authContext = win[CONTEXT_KEY] || ls(CONTEXT_KEY);
    if (authContext) {
        if (authContext.type) {
            authContext = new classMap[authContext.type](authContext);
            setAuthContext(authContext, win);
        }
        return authContext;
    }
    return null;
};

export const setAuthContext = (authContext, win = window) => {
    win[CONTEXT_KEY] = authContext;
    ls(CONTEXT_KEY, authContext && {
        ...authContext.toObject(),
        type: Object.entries(classMap).find(entry => {
            return authContext instanceof entry[1]
        })[0]
    });
};
