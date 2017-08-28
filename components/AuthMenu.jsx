import React from 'react'
import { autobind } from 'core-decorators';
import WeDeploy from 'wedeploy';

export default class extends React.PureComponent {
    state = {
        auth:  WeDeploy.auth(process.env.WEDEPLOY_AUTH_URL)
    };

    componentDidMount() {
        $(this.dropdown)
            .dropdown()
        ;
    }

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
        const {auth} = this.state;
        const currentUser = auth.currentUser;

        return <div className="right menu">
            {currentUser && <div className="item">
                {currentUser.name}
            </div>}

            {!currentUser &&
            <div className="item">
                <button className="ui github black button" onClick={this.githubAuthClick}>
                    <i className="github icon"/> Github
                </button>
            </div>
            }
            {!currentUser &&
            <div className="fitted item">
                <button className="ui google plus button" onClick={this.googleAuthClick}>
                    <i className="google plus icon"/> Google
                </button>
            </div>
            }
        </div>
    }

}