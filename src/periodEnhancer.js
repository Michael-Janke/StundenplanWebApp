
const enhanceStore = (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer);
    
    const dispatchReduxAction = () => {
        store.dispatch({
            type: 'CHECK_CURRENT_PERIOD',
        });
        store.dispatch({
            type: 'GET_UNREAD_MESSAGES',
        });
    };
    window.addEventListener('online', store.dispatch.bind(null, { type: 'NETWORK_ONLINE' }));
    window.addEventListener('offline', store.dispatch.bind(null, { type: 'NETWORK_OFFLINE' }));

    // call action every minute
    setInterval(dispatchReduxAction, 1000 * 60);
    dispatchReduxAction();

    return store;
}

export default enhanceStore;