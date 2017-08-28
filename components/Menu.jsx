import React from 'react'
import logo from 'favicon.png';

export default class extends React.PureComponent {
    render() {
        return <div className="ui container">
            <a href="/" className="header item">
                <img src={logo} /> Evalbox
            </a>
            <div className="right menu">
                <a href="/signin" className="item">Sign-in</a>
            </div>
        </div>
    }
}