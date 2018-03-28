import moment from 'moment';


const actionRedirector = store => next => action => {
    next(action);
    switch (action.type) {
        case "SET_TIMETABLE": case "GET_ME_RECEIVED": case "COUNTER_CHANGED": {
            let { timetableDate } = store.getState().timetable;
            let { id, type } = action.payload;
            next({
                type: 'GET_SUBSTITUTIONS',
                payload: {
                    id,
                    type,
                    year: moment(timetableDate).year(),
                    week: moment(timetableDate).week()
                }
            });

            return next({ type: "GET_TIMETABLE", payload: { id, type } });
        }
        case "CHANGE_WEEK": case "SET_DATE": {
            let { currentTimeTableId, currentTimeTableType, timetableDate } = store.getState().timetable;
            return next({
                type: 'GET_SUBSTITUTIONS',
                payload: {
                    id: currentTimeTableId,
                    type: currentTimeTableType,
                    year: moment(timetableDate).year(),
                    week: moment(timetableDate).week()
                }
            });
        }
        default: ;    
    }
};

export default actionRedirector;