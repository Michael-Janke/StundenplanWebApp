import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import './App.css';
import createStore from './store';
import AppRouter from './Router/AppRouter';
import UpdateGate from './Common/UpdateGate';

const { store, persistor } = createStore();

const App = () => {
    return (
        <Provider store={store}>
            <UpdateGate>
                <PersistGate loading={null} persistor={persistor}>
                    <AppRouter />
                </PersistGate>
            </UpdateGate>
        </Provider>
    );
};

export default App;
