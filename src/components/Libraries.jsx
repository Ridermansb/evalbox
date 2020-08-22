import React from 'react'
import { autobind } from 'core-decorators';

export default class extends React.PureComponent {
    static displayName = 'Libraries';

    @autobind
    removeLibraryClick(library) {
        const { libraries, onChange } = this.props;
        const newLibraries = libraries.filter(it => it.fileName !== library.fileName);
        if (onChange) {
            onChange(newLibraries);
        }
    }

    render() {
        const { libraries, className } = this.props;
        const libraryItem = (library) => <div
            data-tooltip={library.url}
            data-position="left center"
            className="item" key={library.fileName}>
            <div className="ui teal label">
                {library.fileName}
                <i className="delete link icon" onClick={() => this.removeLibraryClick(library)}/>
            </div>
        </div>;

        return <div className={`ui horizontal ${className} list`}>
            {libraries.map(it => libraryItem(it))}
        </div>
    }
}