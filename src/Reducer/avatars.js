import moment from 'moment';

export default function avatarsReducer(state = { loading: false }, action = {}) {
    switch (action.type) {
        case "GET_BATCH_AVATARS":
            return action.payload.reduce((state, upn) => (
                {
                    ...state,
                    [upn]: {
                        expires: moment().add('30', 'seconds')
                    }
                }), state);
        case "BATCH_AVATARS_RECEIVED":
            let filtered = Object.keys(action.payload).reduce((prev, key) => {
                let object = action.payload[key];
                if (object.img && !object.img.error) {
                    prev[key] = object;
                }
                return prev;
            }, {});
            return {
                ...state,
                ...filtered
            };
        case "BATCH_AVATARS_ERROR":
            return {
                ...state
            };
        default:
            return state;
    }
}
