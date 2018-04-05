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
        case "ADD_DATE_RECEIVED":
            return {
                ...state,
                dates: [...state.dates, action.payload]
            };
        case "EDIT_DATE_RECEIVED":
            return {
                ...state,
                dates: [...(state.dates || []).filter(date => date.DATE_ID !== action.DATE_ID), action.payload]
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