import React, {useCallback} from 'react'


const LibraryItem = ({library, onRemove}) => {

    const handleRemoveClick = useCallback(e => {
        e.preventDefault();
        onRemove(library);
    }, []);

    return (
        <div
            data-tooltip={library.url}
            data-position="left center"
            className="item" key={library.fileName}>
            <div className="ui teal label">
                {library.fileName}
                <i className="delete link icon" onClick={handleRemoveClick}/>
            </div>
        </div>
    )
};


const Libraries = ({libraries, onChange, className}) => {

    const removeLibraryClick = useCallback(library => {
        const newLibraries = libraries.filter(it => it.fileName !== library.fileName);
        if (onChange) {
            onChange(newLibraries);
        }
    }, []);

    return <div className={`ui horizontal ${className} list`}>
        {libraries.map(it => <LibraryItem key={it.title} library={it} onRemove={removeLibraryClick}/>)}
    </div>
}

Libraries.displayName = 'Libraries';

export default Libraries;
