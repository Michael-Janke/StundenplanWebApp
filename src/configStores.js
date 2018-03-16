import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import dataService from './Common/data-service'
import profilePictureService from './Common/profilePictureService'
import { responsiveStoreEnhancer } from 'redux-responsive'
import thunk from 'redux-thunk'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['browser', 'responsiveDrawer', 'error']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk, dataService, profilePictureService), responsiveStoreEnhancer));
const persistor = persistStore(store);

export default () => {
  return { store, persistor }
}

export function purge() {
  return persistor.purge();
} 