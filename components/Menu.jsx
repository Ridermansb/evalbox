import React from 'react'
import logo from '../favicon.png';

export default class extends React.PureComponent {
    static displayName = 'Menu';

    render() {
        const libraryItem = (name) => <div className="item" key={name}>
            <div className="ui teal basic label">{name}<i className="delete icon"/></div>
        </div>;
        const libraries = [ 'jQuery', 'upper', 'RamdaJS' ];

        return (<div className="ui left fixed vertical menu">
            <div className="item">
                <img className="ui tiny image" src={logo}/>
            </div>
            <div className="item">
                <div className="ui transparent input">
                    <input type="text" placeholder="Add library ..."/>
                </div>
            </div>
            <div className="item">
                Libraries
                <div className="ui teal label">2</div>
                <div className="menu">
                    <div className="item">
                        <div className="ui left aligned vertical segment">
                            <div className="ui ordered list">
                                {libraries.map(it => libraryItem(it))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}