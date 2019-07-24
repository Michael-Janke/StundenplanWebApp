const counterMiddleware = store => next => action => {
    switch (action.type) {
        case 'COUNTER_RECEIVED':
            next(action);
            if (store.getState().user.counterChanged === 'detected') {
                store.dispatch({ type: 'GET_ME' });
                store.dispatch({ type: 'GET_MASTERDATA' });
                store.dispatch({ type: 'COUNTER_CHANGED' });
            }
            break;
        case 'GET_ME_RECEIVED':
            next({ type: 'REFERSH_LOADING' });
            next(action);
            next({ type: 'REFRESH_COMPLETE' });
            break;
        default:
            next(action);
            break;
    }
};

export default counterMiddleware;
