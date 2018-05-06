import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import reactTabEventPlugin from 'react-tap-event-plugin';
import firebase from 'firebase';
import moment from 'moment';
import 'moment/locale/de';
moment.locale('de')

reactTabEventPlugin();
firebase.initializeApp({
    'messagingSenderId': '1089330166521'
});
firebase.messaging().usePublicVapidKey("BFM3t4WACinSsfYyZfnlLtYmDsEk8Uk-TXHh-fNnKcrb9avPfJ-rDLdiMJvVLLyQRywcbE3nC0LEZ2L3OEKsn4w");

var App = require('./App').default;
ReactDOM.render(<App/>, document.getElementById('root'));

registerServiceWorker();
