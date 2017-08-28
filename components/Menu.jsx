import React from 'react'
import logo from 'favicon.png';
import AuthMenu from './AuthMenu';

export default class extends React.PureComponent {
    render() {
        return <div className="ui attached stackable borderless tiny menu">
            <div className="ui container">
                <a href="/" className="header item">
                    <img src={logo}/> Evalbox
                </a>
                <div className="right menu">
                    <AuthMenu className="item"/>
                </div>
            </div>
        </div>
    }
}