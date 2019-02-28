
export default function tvReducer(state = {}, action) {
    switch (action.type) {
        case "persist/REHYDRATE":
            if (!action.payload || !action.payload.tv) return { ...state };
            return {
                ...state,
                ...action.payload.tv,
            };
        case "GET_DAY_INFO_RECEIVED": 
            return {
                ...state,
                dayInfo: action.payload,
            }
        default: ;
    }
    return state;
}