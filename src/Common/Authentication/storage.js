import TokenAuthContext from './contexts/TokenAuthContext';
import UserAuthContext from './contexts/UserAuthContext';
import localforage from 'localforage';

let LAST_TYPE = 'user';

const classMap = {
    'user': UserAuthContext,
    'token': TokenAuthContext,
};


const getKey = type => "authentication_" + type;

export const getAuthContext = async (type) => {
    type = type ? (LAST_TYPE = type) : LAST_TYPE;
    const key = getKey(type);

    let authContext = window[key];
    if (!authContext) {
        authContext = await localforage.getItem(key);
        authContext = new classMap[type](authContext);
        window[key] = authContext;
    }
    return authContext;
};

export const setAuthContext = async (authContext, type) => {
    type = type ? (LAST_TYPE = type) : LAST_TYPE;
    const key = getKey(type);
    window[key] = authContext;
    return await localforage.setItem(key, authContext.toObject && authContext.toObject());
};
