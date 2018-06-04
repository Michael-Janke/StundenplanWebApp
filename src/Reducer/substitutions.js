import { getSubstitutionsCacheKey } from "../Common/const";

const initialState = {
    substitutions: {}
}

export default function substitutionsReducer(state = initialState, action) {
    switch (action.type) {
        case "GET_SUBSTITUTIONS_RECEIVED":
            if (action.request.type === 'all') {
                return {
                    ...state,
                    substitutions: {
                        ...state.substitutions,
                        [getSubstitutionsCacheKey(action.request)]: action.payload
                    }
                }
            }
            break;
        default: ;
    }
    return state;
};