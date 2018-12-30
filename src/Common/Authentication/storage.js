import ls from 'local-storage';
import {AuthenticationContext} from './authContext';

let cachedContext;

export const getAuthContext = () => {
    let authContext = cachedContext || ls('authorization');
    if (authContext) {
        if (!(authContext instanceof AuthenticationContext)) {
            authContext = new AuthenticationContext(authContext);
            cachedContext = authContext;
        }
        return authContext;
    }
    return null;
}

export const setAuthContext = (authContext) => {
    ls('authorization', authContext);
}