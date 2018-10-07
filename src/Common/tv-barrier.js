
let timeout;

const tvBarrier = store => next => action => {

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
            return;
        case 'SET_TIMETABLE':
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => next({ type: 'SET_TIMETABLE', payload: { type: null, id: 0 } }), 1000 * 60);
            break;
        default: ;
    }
    next(action);
}

export default tvBarrier;