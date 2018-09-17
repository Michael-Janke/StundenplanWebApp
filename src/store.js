import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './Reducer'
import thunk from 'redux-thunk';
import dataService from './Common/data-service'
import actionRedirector from './Common/action-redirects';
import cacheService from './Common/cache-service';
import counterChanged from './Common/counter';
import profilePictureService from './Common/profilePictureService'
import { responsiveStoreEnhancer } from 'redux-responsive'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['browser', 'error', 'favorites']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer,
  composeWithDevTools(
    applyMiddleware(
      actionRedirector,
      cacheService,
      dataService,
      profilePictureService,
      counterChanged,
      thunk),
    responsiveStoreEnhancer)
);

const persistor = persistStore(store);

export default () => {
  return { store, persistor }
}

export function purge() {
  return persistor.purge();
} 