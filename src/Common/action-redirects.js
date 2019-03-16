import moment from 'moment';

const actionRedirector = store => next => action => {
    next(action);
    switch (action.type) {
        case 'RETRY_TIMETABLE':
        case 'NETWORK_ONLINE':
        case 'SET_TIMETABLE':
        case 'SET_MY_TIMETABLE':
        case 'GET_ME_RECEIVED':
        case 'COUNTER_CHANGED':
        case 'CHANGE_WEEK':
        case 'SET_DATE': {
            let { timetableDate, currentTimeTableId, currentTimeTableType } = store.getState().timetable;
            let { id, type } = action.payload || {};
            id = currentTimeTableId || id;
            type = currentTimeTableType || type;
            if (id && type) {
                next({ type: 'GET_TIMETABLE', payload: { id, type } });
                next({
                    type: 'GET_SUBSTITUTIONS',
                    payload: {
                        id,
                        type,
                        year: moment(timetableDate).weekYear(),
                        week: moment(timetableDate).week(),
                    },
                });
            }
            break;
        }
        default:
    }
};

export default actionRedirector;
