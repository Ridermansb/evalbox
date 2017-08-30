import React from 'react'
import { autobind } from 'core-decorators';

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.auth = WeDeploy.auth(process.env.WEDEPLOY_AUTH_URL);
    }
    componentDidMount() {
        $(this.dropdown).dropdown();
    }

    @autobind
    githubAuthClick(e) {
        e.preventDefault();
        const provider = new this.auth.provider.Github();
        provider.setProviderScope("user:email");
        this.auth.signInWithRedirect(provider);
        this.auth.onSignIn(function(user) {
            // Fires when user is signed in after redirect.
        });
    }
    @autobind
    googleAuthClick(e) {
        e.preventDefault();
        const provider = new this.auth.provider.Google();
        provider.setProviderScope("email");
        this.auth.signInWithRedirect(provider);
        this.auth.onSignIn(function(user) {
            // Fires when user is signed in after redirect.
        });
    }

    render() {
        const currentUser = this.auth.currentUser;

        return <div className="right menu">
            {currentUser && <div className="item">
                {currentUser.name}
            </div>}

            {!currentUser &&
            <div className="fitted item">
                <button className="ui github black button" onClick={this.githubAuthClick}>
                    <i className="github icon"/> Github
                </button>
            </div>
            }
            {!currentUser &&
            <div className="item">
                <button className="ui google plus button" onClick={this.googleAuthClick}>
                    <i className="google plus icon"/> Google
                </button>
            </div>
            }
        </div>
    }

}