export default function avatarsReducer(state = { loading: false }, action = {}) {
    switch (action.type) {
        case 'persist/REHYDRATE': {
            // prevent dead error objects in avatars
            // can happen if upgrading from old persisted state
            if (!action.payload || !action.payload.avatars) return state;
            let filtered = Object.keys(action.payload.avatars).reduce((prev, key) => {
                let object = action.payload.avatars[key];
                if (object && object.img && !object.img.error) {
                    prev[key] = object;
                }
                return prev;
            }, {});
            return {
                ...state,
                ...filtered,
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
