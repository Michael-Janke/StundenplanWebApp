import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Provider} from "react-redux";
import {PersistGate} from 'redux-persist/integration/react';
import LogIn from './LogIn';

import './App.css';
import configStores from './configStores';

const {store, persistor} = configStores();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MuiThemeProvider >
            <LogIn></LogIn>
          </MuiThemeProvider >
        </PersistGate>
      </Provider>
    );
  }
}

export default App;