import React, { Component } from 'react';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import Main from './Main';
import ResponsiveFontSize from './Common/ResponsiveFontSize';

import './App.css';
import createStore from './store';
import PrintProvider from 'react-easy-print';

const { store, persistor } = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PrintProvider>
            <ResponsiveFontSize>
              <Main />
            </ResponsiveFontSize>
          </PrintProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;