import { getAuthContext } from './Common/Authentication/storage';

const enhanceStore = createStore => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer);

    const dispatchReduxAction = () => {
        const isAllowed = getAuthContext().isAllowed('authentication', 'token');
        if (!isAllowed && isAllowed !== undefined) {
            stopInterval();
            return;
        }
        store.dispatch({
            type: 'CHECK_CURRENT_PERIOD',
        });
        store.dispatch({
            type: 'GET_UNREAD_MESSAGES',
        });
        store.dispatch({
            type: 'GET_COUNTER',
        });
        store.dispatch({
            type: 'GET_ASSIGNMENTS',
        });
    };
    window.addEventListener('online', store.dispatch.bind(null, { type: 'NETWORK_ONLINE' }));
    window.addEventListener('offline', store.dispatch.bind(null, { type: 'NETWORK_OFFLINE' }));

    // call action every minute
    let intervalId;
    const startInterval = () => {
        stopInterval();
        intervalId = setInterval(dispatchReduxAction, 1000 * 60);
        dispatchReduxAction();
    };
    const stopInterval = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
        }
    };
    startInterval();
    window.addEventListener('blur', stopInterval);
    window.addEventListener('focus', startInterval);

    if (module.hot) {
        module.hot.dispose(() => {
            stopInterval();
            window.removeEventListener('blur', stopInterval);
            window.removeEventListener('focus', startInterval);
        });
    }
    return store;
};

export default enhanceStore;
