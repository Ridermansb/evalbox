import React from 'react';
import { render } from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'semantic-ui-css';
import './assets/style.css';
import App from './App';

const root = document.querySelector('#root');

console.log(
    `%cEvalBox%cversion %c${__VERSION__}`,
    'color: #fff; background-color: #3864af; padding: 2px 4px; border-radius: 2px',
    'margin-left: 2px; color: #000000f2',
    'font-weight: bold; color: #000000f2'
);
console.log(
    `%cby @ridermansb (ridermansb@gmail.com)`,
    'color: #3864af; font-style: italic; font-size: 10px;'
);

render(<App />, root);
