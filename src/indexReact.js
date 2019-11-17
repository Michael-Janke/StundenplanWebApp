import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { register } from './serviceWorker';
import moment from 'moment';
import 'moment/locale/de';
import { dispatch } from './store';

moment.locale('de');

const renderApp = () => {
    const App = require('./App').default;
    return ReactDOM.render(<App />, document.getElementById('root'));
};

register({
    onSuccess: registration => {
        dispatch({ type: 'SERVICE_WORKER_AVAILABLE' });
    },
    onUpdate: registration => {
        const waitingServiceWorker = registration.waiting;

        if (waitingServiceWorker) {
            waitingServiceWorker.addEventListener('statechange', event => {
                if (event.target.state === 'activated') {
                    dispatch({ type: 'UPDATE_AVAILABLE' });
                }
            });
            waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    },
});

renderApp();

if (module.hot) {
    module.hot.accept('./App', renderApp);
}
