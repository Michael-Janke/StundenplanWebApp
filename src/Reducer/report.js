export default function reportReducer(state = {}, action) {
    switch (action.type) {
        case 'GET_REPORT':
            return {
                ...state,
                [action.id]: { loading: true, error: false },
            };
        case 'GET_REPORT_RECEIVED':
            return {
                ...state,
                [action.id]: action.payload,
            };
        case 'GET_REPORT_RECEIVED':
            return {
                ...state,
                [action.id]: { error: true },
            };
        default:
    }
    return state;
}
