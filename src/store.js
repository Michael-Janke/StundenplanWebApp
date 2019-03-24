import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import localForage from 'localforage';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './Reducer';
import thunk from 'redux-thunk';
import services from './Common/services';
import actionRedirector from './Common/action-redirects';
import cacheService from './Common/cache-service';
import counterChanged from './Common/counter';
import { responsiveStoreEnhancer } from 'redux-responsive';
import periodEnhancer from './intervalDispatch';
if (process.env.REACT_APP_MODE === 'tv') {
    var tvBarrier = require('./Common/tv-barrier').default;
}

const persistConfig = {
    key: 'root',
    storage: localForage,
    blacklist: ['browser', 'error', 'favorites', 'assignments'],
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    composeWithDevTools(
        periodEnhancer,
        applyMiddleware(
            ...[...(tvBarrier ? [tvBarrier] : []), actionRedirector, cacheService, ...services, counterChanged, thunk]
        ),
        responsiveStoreEnhancer
    )
);

const persistor = persistStore(store);

export default () => {
    return { store, persistor };
};

export function purge() {
    return persistor.purge();
}
