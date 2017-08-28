import React from 'react';
import {autobind} from 'core-decorators';
import WeDeploy from 'wedeploy';
import Menu from 'components/Menu'

export default class extends React.PureComponent {
    state = {
        auth:  WeDeploy.auth(process.env.WEDEPLOY_AUTH_URL)
    };

    @autobind
    githubAuthClick(e) {
        e.preventDefault();
        const { auth } = this.state;

        const provider = new auth.provider.Github();
        provider.setProviderScope("user:email");
        auth.signInWithRedirect(provider);
        auth.onSignIn(function(user) {
            // Fires when user is signed in after redirect.
        });
    }
    @autobind
    googleAuthClick(e) {
        e.preventDefault();
        const { auth } = this.state;

        var provider = new auth.provider.Google();
        provider.setProviderScope("email");
        auth.signInWithRedirect(provider);
        auth.onSignIn(function(user) {
            // Fires when user is signed in after redirect.
        });
    }

    render() {
        return <div>
            <div className="ui attached stackable menu">
                <Menu/>
            </div>
            <div className="ui internally celled centered container grid">
                <div className="sixteen wide mobile ten wide tablet six wide computer column">
                    <div className="ui top attached menu">
                        <div className="header item">SignIn</div>
                    </div>
                    <div className="ui bottom attached segment">
                        <div className="ui items">
                            <div className="item">
                                <button className="ui google plus fluid button" onClick={this.googleAuthClick}>
                                    <i className="google plus icon"/>
                                    Google Plus
                                </button>
                            </div>
                            <div className="item">
                                <button className="ui github black fluid button" onClick={this.githubAuthClick}>
                                    <i className="github icon"/>
                                    Github
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}