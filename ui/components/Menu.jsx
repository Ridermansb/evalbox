import React from 'react'
import logo from '../../favicon.png';
import AuthMenu from './AuthMenu';

const styles = {
    menu: {
        'marginTop': 10
    }
};

export default class extends React.PureComponent {
    render() {
        return <div className="ui borderless menu" style={styles.menu}>
                <a href="/" className="header item">
                    <img src={logo}/> Evalbox
                </a>
                <div className="right menu">
                    <AuthMenu className="item"/>
                </div>
            </div>
    }
}