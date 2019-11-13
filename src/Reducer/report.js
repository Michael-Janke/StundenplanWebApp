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
                [action.id]: { report: action.payload },
            };
        case 'GET_REPORT_ERROR':
            return {
                ...state,
                [action.id]: { error: true },
            };
        case 'COMMIT_REPORT':
            return {
                ...state,
                commit: { loading: true },
            };
        case 'COMMIT_REPORT_RECEIVED':
            return {
                ...state,
                commit: action.payload,
            };
        case 'COMMIT_REPORT_ERROR':
            return {
                ...state,
                commit: { error: action.payload },
            };
        default:
    }
    return state;
}
