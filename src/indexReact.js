import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { register } from './serviceWorker';
import moment from 'moment';
import 'moment/locale/de';
import { install } from '@material-ui/styles';
moment.locale('de');
install();

console.log('REACT_APP_MODE: ' + process.env.REACT_APP_MODE);

if (process.env.NODE_ENV !== 'production') {
    //const { whyDidYouUpdate } = require('why-did-you-update');
    //whyDidYouUpdate(React);
}

const renderApp = () => {
    const App = require('./App').default;
    return ReactDOM.render(<App />, document.getElementById('root'));
};

renderApp();

if (module.hot) {
    module.hot.accept('./App', renderApp);
}

register({
    onUpdate: registration => {
        console.log('reload app due to new files');
        window.location.reload();
    },
});
