const counterMiddleware = store => next => action => {
    switch (action.type) {
        case 'COUNTER_RECEIVED':
            const state = store.getState();
            const user = state.user;

            if (user.counter !== action.payload.COUNTER) {
                store.dispatch({ type: 'GET_ME' });
                store.dispatch({ type: 'GET_MASTERDATA' });
                store.dispatch({ type: 'COUNTER_CHANGED' });
            }
            const dates = state.dates;
            if (!dates.loading && dates.currentHash !== action.payload.DATES_HASH) {
                store.dispatch({ type: 'GET_DATES' });
            }
            next(action);
            break;
        default:
            next(action);
            break;
    }
};

export default counterMiddleware;
