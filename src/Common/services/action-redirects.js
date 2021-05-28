const actionRedirector = (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case 'RETRY_TIMETABLE':
        case 'NETWORK_ONLINE':
        case 'GET_TIMETABLE':
        case 'SET_TIMETABLE':
        case 'SET_MY_TIMETABLE':
        case 'ITERATE_TIMETABLE':
        case 'GET_ME_RECEIVED':
        case 'COUNTER_CHANGED':
        case 'COUNTER_RECEIVED':
        case 'CHANGE_WEEK':
        case 'SET_DATE': {
            let { currentTimeTableId, currentTimeTableType } = store.getState().timetable;
            let { id, type } = action.payload || {};
            id = id || currentTimeTableId;
            type = type || currentTimeTableType;
            if (id && type) {
                next({ type: 'GET_TIMETABLE', payload: { id, type } });
                next({
                    type: 'GET_SUBSTITUTIONS',
                    payload: { id, type },
                });
            }
            break;
        }
        default:
    }
};

export default actionRedirector;
