import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import localForage from 'localforage';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './Reducer';
import thunk from 'redux-thunk';
import services from './Common/services';
import actionRedirector from './Common/services/action-redirects';
import cacheService from './Common/services/cache-service';
import counterChanged from './Common/services/counter-service';
import { responsiveStoreEnhancer } from 'redux-responsive';
import networkStatusEnhancer from './networkStatusEnhancer';
import version from './version.json';
import EditorStateTransform from './Posts/Common/EditorStateTransform';

const persistConfig = {
    key: 'root',
    storage: localForage,
    blacklist: ['browser', 'error', 'favorites', 'assignments', 'notifications'],
    version: version.build,
    transforms: [EditorStateTransform],
    migrate: state => {
        if (!state || !state._persist || state._persist.version === version.build) return Promise.resolve(state);
        console.log('purge state, new build');
        return Promise.resolve({});
    },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    composeWithDevTools(
        networkStatusEnhancer,
        applyMiddleware(actionRedirector, cacheService, ...services, counterChanged, thunk),
        responsiveStoreEnhancer
    )
);

const persistor = persistStore(store);

export default () => {
    return { store, persistor };
};

export const dispatch = (...args) => store.dispatch(...args);

export function purge() {
    return persistor.purge();
}
