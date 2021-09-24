import { getAuthContext } from '../Authentication/storage';
import TokenAuthContext from '../Authentication/contexts/TokenAuthContext';

const AuthenticationService = (store) => (next) => (action) => {
    switch (action.type) {
        case 'GET_ME':
        case 'ADD_DATE':
        case 'DELETE_DATE':
        case 'EDIT_DATE':
        case 'SEND_FEEDBACK':
        case 'PATCH_REMIND_SETTINGS':
        case 'ADD_FAVORITE':
        case 'REMOVE_FAVORITE':
        case 'SET_NOTIFICATION':
        case 'GET_PROFILE_PICTURE':
        case 'GET_UNREAD_MESSAGES':
        case 'GET_ASSIGNMENTS':
        case 'GET_JOINED_TEAMS':
        case 'SEND_LOGIN_STATISTIC':
            getAuthContext().then((authContext) => {
                if (!(authContext instanceof TokenAuthContext)) {
                    next(action);
                }
            });
            return;
        default:
    }

    next(action);
};

export default AuthenticationService;
