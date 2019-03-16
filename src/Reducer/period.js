const initialState = {
    currentPeriod: null,
};

export default function periodReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_CURRENT_PERIOD': {
            return {
                ...state,
                currentPeriod: action.payload,
            };
        }
        default:
    }
    return state;
}
