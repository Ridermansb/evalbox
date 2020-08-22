import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const LibraryType = PropTypes.shape({
    url: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
}).isRequired;

const LibraryItem = ({ library, onRemove }) => {
    const handleRemoveClick = useCallback(
        (event) => {
            event.preventDefault();
            onRemove(library);
        },
        [library, onRemove]
    );

    return (
        <div
            data-tooltip={library.url}
            data-position="left center"
            className="item"
            key={library.fileName}
        >
            <div className="ui teal label">
                {library.fileName}
                <i className="delete link icon" onClick={handleRemoveClick} />
            </div>
        </div>
    );
};
LibraryItem.displayName = 'LibraryItem';
LibraryItem.propTypes = {
    library: LibraryType,
    onRemove: PropTypes.func.isRequired,
};

const Libraries = ({ libraries, onChange, className }) => {
    const removeLibraryClick = useCallback(
        (library) => {
            const newLibraries = libraries.filter(
                (it) => it.fileName !== library.fileName
            );
            if (onChange) {
                onChange(newLibraries);
            }
        },
        [libraries, onChange]
    );

    return (
        <div className={`ui horizontal ${className} list`}>
            {libraries.map((it) => (
                <LibraryItem
                    key={it.title}
                    library={it}
                    onRemove={removeLibraryClick}
                />
            ))}
        </div>
    );
};

Libraries.displayName = 'Libraries';
Libraries.propTypes = {
    libraries: PropTypes.arrayOf(LibraryType),
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};
Libraries.defaultProps = {
    className: '',
};

export default Libraries;
