const initialState = {
    counter: true,
    timetable: true,
};

export default function onlineReducer(state = initialState, action) {
    switch (action.type) {
        case 'COUNTER_ERROR':
            return {
                ...state,
                counter: false,
            };
        case 'COUNTER_RECEIVED':
            return {
                ...state,
                counter: true,
            };
        case 'GET_SUBSTITUTIONS_ERROR':
        case 'GET_TIMETABLE_ERROR': {
            return {
                ...state,
                timetable: false,
            };
        }
        case 'GET_SUBSTITUTIONS':
        case 'GET_TIMETABLE':
        case 'RETRY_TIMETABLE':
            return {
                ...state,
                timetable: true,
            };

        default:
    }
    return state;
}
