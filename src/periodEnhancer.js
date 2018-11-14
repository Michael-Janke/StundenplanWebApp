
const enhanceStore = (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer);

    const dispatchReduxAction = () => {
        return store.dispatch({
            type: 'CHECK_CURRENT_PERIOD',
        });
    };

    // call action every minute
    setInterval(dispatchReduxAction, 1000 * 60);
    dispatchReduxAction();

    return store;
}

export default enhanceStore;