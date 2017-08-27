import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import 'semantic-ui-css';

import './assets/style.css';

const rootEl = document.getElementById('root');

render(<App />, rootEl);

if (module.hot) {
    module.hot.accept('./components/App', () => {
        const NewRoot = require('./components/App').default;
        render(<NewRoot />, rootEl);
    });
}
