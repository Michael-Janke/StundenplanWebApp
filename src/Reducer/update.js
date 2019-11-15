import version from '../version.json';

const initialState = {
    updateAvailable: false,
    ignoreUpdate: false,
};

export default function updateReducer(state = initialState, action) {
    switch (action.type) {
        case 'COUNTER_RECEIVED': {
            return {
                ...state,
                updateAvailable:
                    !state.ignoreUpdate && (state.updateAvailable || action.payload.MIN_VERSION > version.build),
            };
        }
        case 'UPDATE_AVAILABLE': {
            return {
                ...state,
                updateAvailable: !state.ignoreUpdate,
                fromServiceWorker: true,
            };
        }
        case 'IGNORE_UPDATE': {
            return {
                ...state,
                updateAvailable: false,
                ignoreUpdate: true,
            };
        }

        default:
    }
    return state;
}
