import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import dataService from './Common/data-service'
import {responsiveStoreEnhancer} from 'redux-responsive'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['browser','responsiveDrawer', 'error']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(dataService), responsiveStoreEnhancer));
  let persistor = persistStore(store);
  return { store, persistor }
}