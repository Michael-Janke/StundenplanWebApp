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

    // call action every 10 seconds
    let intervalId;
    const startInterval = () => {
        stopInterval();
        intervalId = setInterval(dispatchReduxAction, 1000 * 10);
        dispatchReduxAction();
    };
    const stopInterval = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
        }
    };
    startInterval();

    var hidden, visibilityChange;
    if (typeof document.hidden !== 'undefined') {
        // Opera 12.10 and Firefox 18 and later support
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
    }

    function handleVisibilityChange() {
        if (document[hidden]) {
            stopInterval();
        } else {
            startInterval();
        }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    if (module.hot) {
        module.hot.dispose(() => {
            stopInterval();
            document.removeEventListener(visibilityChange, handleVisibilityChange);
        });
    }
    return store;
};

export default enhanceStore;
