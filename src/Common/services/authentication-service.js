import { getAuthContext } from '../Authentication/storage';
import TokenAuthContext from '../Authentication/contexts/TokenAuthContext';

export default store => next => action => {
    if (getAuthContext() instanceof TokenAuthContext) {
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
            case 'GET_PROFILE_PICTURE_SMALL':
            case 'GET_UNREAD_MESSAGES':
            case 'GET_ASSIGNMENTS':
            case 'GET_JOINED_TEAMS':
            case 'SEND_LOGIN_STATISTIC':
                return;
            default:
        }
    }
    // if (getAuthContext() instanceof PublicAuthContext) {
    //     switch (action.type) {
    //         case 'GET_COUNTER':
    //         case 'GET_DATES':
    //         case 'GET_BATCH_AVATARS':
    //             return;
    //         default:
    //     }
    // }
    next(action);
};
