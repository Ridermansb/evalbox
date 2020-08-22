import React from 'react';
import {render} from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import App from './App';
import 'semantic-ui-css';
import './assets/style.css';

const root = document.querySelector('#root');

render(<App />, root);
