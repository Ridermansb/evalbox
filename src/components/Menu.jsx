import React, {useCallback, useEffect, useRef, useState} from 'react'
import logo from '../../favicon.png';
import AddLibrary from './AddLibrary';
import Libraries from './Libraries'

const styles = {
    menu: {
        'marginTop': 10
    }
};

const Menu = ({autoRun, onAutoRunChange, onLibrariesChanged}) => {
    const [libraries, setLibraries] = useState([])
    const autoRunRef = useRef(null);

    useEffect(() => {
        const libraries = localStorage.getItem('libraries');
        if (libraries) {
            setLibraries(JSON.parse(libraries))
        }

        const $autorun = $(autoRunRef.current);
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
    }, []);

    const onLibraryAdded = useCallback(library => {
        const newLibraries = [...libraries, library];
        onLibrariesChanged(newLibraries);
    }, []);

    const handleLibrariesChanged = useCallback(libraries => {
        setLibraries(libraries)
        onLibrariesChanged(libraries);
    }, []);

    const hasLibraries = libraries && libraries.length > 0;

    return (
        <div className="ui borderless menu" style={styles.menu}>
            <a href="/" className="header item">
                <img src={logo} alt="Logo of EvalBox"/> EvalBox
            </a>
            <div className="item">
                <AddLibrary onAdded={onLibraryAdded}/>
            </div>
            {hasLibraries && (
                <Libraries className="fitted item" libraries={libraries} onChange={handleLibrariesChanged}/>
            )}
            <div className="right menu">
                <div className="ui item toggle checkbox" ref={autoRunRef}>
                    <input type="checkbox"/>
                    <label>Auto run</label>
                </div>
            </div>
        </div>
    )
}

Menu.displaName = 'Menu';

export default Menu
