import React from 'react';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';

const routes = [
    { path: '/', action: () => <HomePage /> },
    { path: '/signin', action: () => <SignInPage /> }
];

export default routes;