import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Code from './Code';

const styles = {
    root: {
        position: 'relative',
    },
    run: {
        position: 'absolute',
        zIndex: 9999,
        right: 24,
        top: 24,
    },
};

const Editor = ({
    executeHandler,
    onChange,
    className = '',
    displayRunButton = true,
    ...properties
}) => {
    const [code, setCode] = useState('');

    const onCodeChange = useCallback(
        (code) => {
            setCode(code);
            onChange(code);
        },
        [onChange]
    );

    const executeClick = useCallback(() => {
        executeHandler(code);
    }, [code, executeHandler]);

    return (
        <div className={className} style={styles.root} {...properties}>
            {displayRunButton && (
                <a
                    className="ui small primary button"
                    onClick={executeClick}
                    style={styles.run}
                >
                    <i className="right play icon" /> Run
                </a>
            )}
            <Code className="attached segment" onChange={onCodeChange} />
        </div>
    );
};

Editor.displayName = 'Editor';
Editor.propTypes = {
    executeHandler: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    displayRunButton: PropTypes.bool.isRequired,
};
Editor.defaultProps = {
    className: '',
    displayRunButton: true,
};

export default Editor;
