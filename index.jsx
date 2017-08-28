import React from 'react';
import { render } from 'react-dom';
import history from './history'
import routes from './routes';
import router from './router';
import 'semantic-ui-css';

import './assets/style.css';

const rootEl = document.getElementById('root');

function renderComponent(component) {
    render(component, rootEl);
}

function renderLocation(location) {
    router.resolve(routes, location)
        .then(renderComponent)
        .catch(error => router.resolve(routes, { ...location, error })
        .then(renderComponent));
}
renderLocation(history.location);
history.listen(render);