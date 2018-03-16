import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reactTabEventPlugin from 'react-tap-event-plugin';
reactTabEventPlugin();

ReactDOM.render(<App/>, document.getElementById('root'));

registerServiceWorker();
