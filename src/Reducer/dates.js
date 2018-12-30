const initalState = {
    dates: [],
};


export default function datesReducer(state = initalState, action) {
    switch (action.type) {
        case "persist/REHYDRATE":
            if (!action.payload || !action.payload.dates) return { ...state };
            return {
                ...state,
                ...action.payload.dates,
            };
        case "GET_DATES_RECEIVED":
            return {
                ...state,
                dates: action.payload,
            };
        default:
            return state;
    }
}