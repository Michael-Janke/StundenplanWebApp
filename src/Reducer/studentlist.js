export default function studentlistReducer(state = { loading: true }, action) {
    switch (action.type) {
        case 'GET_STUDENTLIST':
            return { loading: true, error: false };
        case 'GET_STUDENTLIST_RECEIVED':
            return { list: action.payload, loading: false, error: false };
        case 'GET_STUDENTLIST_ERROR':
            return { error: true, loading: false };
        default:
    }
    return state;
}
