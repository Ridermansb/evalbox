import React from 'react'
import WeDeploy from 'wedeploy';

export default class extends React.PureComponent {
    state = {
        auth:  WeDeploy.auth(process.env.WEDEPLOY_AUTH_URL)
    };

    render() {
        const {auth} = this.state;
        const currentUser = auth.currentUser;

        if (currentUser) {
            return <div className="ui dropdown item">
                Me
                <i className="dropdown icon"/>
                <div className="menu">
                    <a className="item"><i className="edit icon"/> Edit Profile</a>
                    <a className="item"><i className="globe icon"/> Choose Language</a>
                    <a className="item"><i className="settings icon"/> Account Settings</a>
                </div>
            </div>
        }

        return <a href="/signin" className="item">Sign-in</a>


    }

}