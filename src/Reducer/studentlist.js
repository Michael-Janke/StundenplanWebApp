export default function studentlistReducer(state = { timetableId: null }, action) {
    switch (action.type) {
        case 'GET_STUDENTLIST':
            return { loading: true, timetableId: action.timetableId };
        case 'GET_STUDENTLIST_RECEIVED':
            return { list: action.payload, loading: false, timetableId: action.timetableId };
        case 'CLOSE_STUDENTLIST':
            return { loading: false, timetableId: null };

        default:
    }
    return state;
}
