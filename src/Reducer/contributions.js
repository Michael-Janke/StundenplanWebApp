
export default function contributionsReducer(state = {}, action) {
    switch (action.type) {
        case "persist/REHYDRATE":
            if (!action.payload || !action.payload.contributions) return { ...state };
            return {
                ...state,
                ...action.payload.contributions,
            };
        case "ADD_CONTRIBUTION_RECEIVED":
            return {
                ...state,
                contributions: [...state.contributions, action.payload]
            };
        case "DELETE_CONTRIBUTION_RECEIVED":
            return {
                ...state,
                contributions: [...(state.contributions || []).filter(date => date.CONTRIBUTION_ID !== action.request.CONTRIBUTION_ID)]
            }    
        case "EDIT_CONTRIBUTION_RECEIVED":
            return {
                ...state,
                contributions: [...(state.contributions || []).filter(date => date.CONTRIBUTION_ID !== action.payload.CONTRIBUTION_ID), action.payload]
            };
        case "GET_CONTRIBUTIONS_RECEIVED":
            return {
                ...state,
                contributions: action.payload,
            };
        default: ;
    }
    return state;
}