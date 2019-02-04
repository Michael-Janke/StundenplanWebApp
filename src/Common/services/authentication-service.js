import { getAuthContext } from "../Authentication/storage";


export default store => next => action => {
    if (!getAuthContext().isAllowed()) {
        switch (action.type) {

            case 'GET_ME':
            case 'ADD_DATE':
            case 'DELETE_DATE':
            case 'EDIT_DATE':
            case "SEND_LOGIN_STATISTIC":
            case "SEND_FEEDBACK":
            case "PATCH_REMIND_SETTINGS":
            case "ADD_FAVORITE": case "REMOVE_FAVORITE":
            case 'SET_NOTIFICATION':
            case 'GET_PROFILE_PICTURE':
            case 'GET_PROFILE_PICTURE_SMALL':
            case 'GET_BATCH_AVATARS':
            case 'GET_UNREAD_MESSAGES':
            case 'GET_ASSIGNMENTS':
                return;
            default: ;
        }
    }
    next(action);
}