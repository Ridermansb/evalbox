import React from 'react';
import Menu from './Menu'

export default class extends React.PureComponent {
    static displayName = 'App';

    render() {
        return (
            <div>
                <Menu />
                <h2>Hi</h2>
            </div>
        );
    }
}
