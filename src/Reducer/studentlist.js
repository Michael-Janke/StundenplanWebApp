export default function studentlistReducer(state = { timetableId: null }, action) {
    switch (action.type) {
        case 'GET_STUDENTLIST':
            return { loading: true, timetableId: action.timetableId, reference: action.reference };
        case 'GET_STUDENTLIST_RECEIVED':
            return {
                list: action.payload,
                loading: false,
                timetableId: action.timetableId,
                reference: action.reference,
            };
        case 'CLOSE_STUDENTLIST':
            return { loading: false, timetableId: null };

        default:
    }
    return state;
}
