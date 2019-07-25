export default function avatarsReducer(state = { loading: false }, action = {}) {
    switch (action.type) {
        case 'persist/REHYDRATE': {
            if (!action.payload || !action.payload.avatars) return state;
            return {
                ...state,
                ...action.payload.avatars,
            };
        }
        case 'GET_BATCH_AVATARS':
            return state;
        case 'BATCH_AVATARS_RECEIVED':
            return {
                ...state,
                ...action.payload,
            };
        case 'BATCH_AVATARS_ERROR':
            return state;
        default:
            return state;
    }
}
