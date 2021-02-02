export default function eventsReducer(state = { events: [] }, action) {
    switch (action.type) {
        case 'GET_GLOBAL_EVENTS':
            return state;
        case 'GET_GLOBAL_EVENTS_RECEIVED':
            return {
                events: action.payload,
            };
        default:
    }
    return state;
}
