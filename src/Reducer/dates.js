const initalState = {
    dates: [],
    loading: false,
    editMode: false,
};

export default function datesReducer(state = initalState, action) {
    switch (action.type) {
        case 'persist/REHYDRATE':
            if (!action.payload || !action.payload.dates) return { ...state };
            return {
                ...state,
                ...action.payload.dates,
                loading: false,
            };
        case 'GET_DATES_RECEIVED':
            return {
                ...state,
                dates: action.payload,
                currentHash: state.availableHash,
                loading: false,
            };
        case 'GET_DATES_ERROR':
            return {
                ...state,
                loading: false,
            };
        case 'GET_DATES':
            return {
                ...state,
                loading: true,
            };
        case 'COUNTER_RECEIVED':
            return {
                ...state,
                availableHash: action.payload.DATES_HASH,
            };
        case 'SET_EDIT_MODE':
            return {
                ...state,
                editMode: action.payload,
            };
        default:
            return state;
    }
}
