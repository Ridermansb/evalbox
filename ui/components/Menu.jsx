import React from 'react'
import { autobind } from 'core-decorators';
import logo from '../../favicon.png';
import AuthMenu from './AuthMenu';
import AddLibrary from './AddLibrary';
import Libraries from './Libraries'

const styles = {
    menu: {
        'marginTop': 10
    }
};

export default class extends React.PureComponent {
    static displaName = 'Menu';

    state = {
        libraries: []
    };

    componentDidMount() {
        const libraries = localStorage.getItem('libraries');
        if (libraries) {
            this.setState((prevState) => ({ ...prevState, libraries: JSON.parse(libraries) }));
        }
    }

    @autobind
    onLibraryAdded(library) {
        const { librariesChanged } = this.props;
        const { libraries } = this.state;
        const newLibraries = [ ...libraries, library];
        this.setState((prevState) => ({ ...prevState, libraries: newLibraries }));
        librariesChanged(newLibraries);
    }

    @autobind
    onLibrariesChanged(libraries) {
        const { librariesChanged } = this.props;
        this.setState((prevState) => ({ ...prevState, libraries }));
        librariesChanged(libraries);
    }

    render() {
        const { libraries } = this.state;

        const hasLibraries = libraries && libraries.length > 0;

        return <div className="ui borderless menu" style={styles.menu}>
                <a href="/" className="header item">
                    <img src={logo}/> Evalbox
                </a>
                <div className="item">
                    <AddLibrary onAdded={this.onLibraryAdded} />
                </div>
                {hasLibraries &&
                    <Libraries className="fitted item"
                        libraries={libraries}
                        onChange={this.onLibrariesChanged} />
                }
                <div className="right menu">
                    <AuthMenu className="item"/>
                </div>
            </div>
    }
}