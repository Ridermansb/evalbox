import React from 'react'
import {autobind} from 'core-decorators';
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
            this.setState((prevState) => ({...prevState, libraries: JSON.parse(libraries)}));
        }

        const { autoRun, onAutoRunChange } = this.props;
        const $autorun = $(this.autorun);
        $autorun.checkbox({
            onChange() {
                const isEnabled = $autorun.checkbox('is checked');
                onAutoRunChange(isEnabled);
            }
        });

        if (autoRun) {
            $autorun.checkbox('set checked');
        } else {
            $autorun.checkbox('set unchecked');
        }
    }

    @autobind
    onLibraryAdded(library) {
        const {onLibrariesChanged} = this.props;
        const {libraries} = this.state;
        const newLibraries = [...libraries, library];
        this.setState((prevState) => ({...prevState, libraries: newLibraries}));
        onLibrariesChanged(newLibraries);
    }

    @autobind
    onLibrariesChanged(libraries) {
        const {onLibrariesChanged} = this.props;
        this.setState((prevState) => ({...prevState, libraries}));
        onLibrariesChanged(libraries);
    }

    render() {
        const {libraries} = this.state;

        const hasLibraries = libraries && libraries.length > 0;

        return <div className="ui borderless menu" style={styles.menu}>
            <a href="/" className="header item">
                <img src={logo}/> Evalbox
            </a>
            <div className="item">
                <AddLibrary onAdded={this.onLibraryAdded}/>
            </div>
            {hasLibraries &&
            <Libraries className="fitted item"
                       libraries={libraries}
                       onChange={this.onLibrariesChanged}/>
            }
            <div className="right menu">
                <div className="ui item toggle checkbox" ref={(el) => { this.autorun = el; }}>
                    <input type="checkbox"/>
                    <label>Auto run</label>
                </div>
            </div>
        </div>
    }
}
