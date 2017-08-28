import React from 'react';
import { autobind } from 'core-decorators';
import AddLibrary from './AddLibrary';
import Libraries from './Libraries'

export default class extends React.PureComponent {
    static displayName = 'Editor';

    state = {code: '', libraries: []};

    @autobind
    handleChange(event) {
        const code = event.target.value;
        this.setState((prevState) => ({...prevState, code }));
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

    @autobind
    executeClick() {
        const {code, libraries} = this.state;
        const { executeHandler } = this.props;
        executeHandler(code, libraries);
    }

    render() {
        const { className } = this.props;
        const { libraries } = this.state;

        const hasLibraries = libraries && libraries.length > 0;

        return (
            <div className={className}>
                <div className="ui pointing menu">
                    <div className="header item">
                        Editor
                    </div>
                    <div className="active item">
                        Libraries
                        {hasLibraries &&
                            <div className="ui teal left pointing label">
                                {libraries.length}
                            </div>
                        }
                    </div>
                    <div className="item">
                        <AddLibrary onAdded={this.onLibraryAdded} />
                    </div>
                    <div className="right menu">
                        <a className="item" onClick={this.executeClick}>
                            <i className="right play icon"/> Run
                        </a>
                    </div>
                </div>
                {hasLibraries &&
                    <Libraries libraries={libraries} onChange={this.onLibrariesChanged} />
                }
                <div className="ui form">
                    <textarea onChange={this.handleChange} />
                </div>
            </div>
        );
    }
}
