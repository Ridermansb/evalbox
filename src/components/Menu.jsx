import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import logo from '../../favicon.png';
import AddLibrary from './AddLibrary';
import Libraries from './Libraries';

const Menu = ({ autoRun = true, onAutoRunChange, onLibrariesChanged }) => {
    const [libraries, setLibraries] = useState([]);
    const autoRunReference = useRef(null);

    useEffect(() => {
        const libraries = localStorage.getItem('libraries');
        if (libraries) {
            setLibraries(JSON.parse(libraries));
        }

        const $autorun = $(autoRunReference.current);
        $autorun.checkbox({
            onChange() {
                const isEnabled = $autorun.checkbox('is checked');
                onAutoRunChange(isEnabled);
            },
        });

        if (autoRun) {
            $autorun.checkbox('set checked');
        } else {
            $autorun.checkbox('set unchecked');
        }
    }, [autoRun, onAutoRunChange]);

    const onLibraryAdded = useCallback(
        (library) => {
            const newLibraries = [...libraries, library];
            onLibrariesChanged(newLibraries);
        },
        [libraries, onLibrariesChanged]
    );

    const handleLibrariesChanged = useCallback(
        (libraries) => {
            setLibraries(libraries);
            onLibrariesChanged(libraries);
        },
        [onLibrariesChanged]
    );

    const hasLibraries = libraries && libraries.length > 0;

    return (
        <div className="ui top fixed container menu">
            <a href="/" className="header item">
                <img src={logo} alt="Logo of EvalBox" /> EvalBox
            </a>
            <div className="item">
                <AddLibrary onAdded={onLibraryAdded} />
            </div>
            {hasLibraries && (
                <Libraries
                    className="fitted item"
                    libraries={libraries}
                    onChange={handleLibrariesChanged}
                />
            )}
            <div className="right menu">
                <div className="ui item toggle checkbox" ref={autoRunReference}>
                    <input type="checkbox" />
                    <label>Auto run</label>
                </div>
            </div>
        </div>
    );
};

Menu.displaName = 'Menu';
Menu.propTypes = {
    autoRun: PropTypes.bool,
    onAutoRunChange: PropTypes.func.isRequired,
    onLibrariesChanged: PropTypes.func.isRequired,
};
Menu.propTypes = {
    autoRun: true,
};

export default Menu;
