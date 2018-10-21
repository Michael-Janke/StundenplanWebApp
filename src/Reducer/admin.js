
export default function adminReducer(state = {}, action) {
    switch (action.type) {
        case "GET_LOGIN_STATISTICS_RECEIVED":
            return {
                ...state,
                [action.request.action]: action.payload,
            };
        default: ;
    }
    return state;
}