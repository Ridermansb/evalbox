import React from 'react';
import { render } from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'semantic-ui-css';
import './assets/style.css';
import App from './App';

const root = document.querySelector('#root');

render(<App />, root);
