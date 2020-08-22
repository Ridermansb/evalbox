import React, {useCallback, useState} from 'react';
import Code from './Code'

const styles = {
    root: {
        'position': 'relative',
    },
    run: {
        'position': 'absolute',
        'zIndex': 9999,
        'right': 24,
        'top': 24,
    }
};

const Editor = ({executeHandler, onChange, className, displayRunButton}) => {
    const [code, setCode] = useState('')

    const onCodeChange = useCallback(code => {
        setCode(code)
        onChange(code);
    }, []);

    const executeClick = useCallback(() => {
        executeHandler(code);
    }, []);

    return (
        <div className={className} style={styles.root}>
            {displayRunButton &&
            <a className="ui small primary button" onClick={executeClick} style={styles.run}>
                <i className="right play icon"/> Run
            </a>
            }
            <Code
                className="ui bottom attached segment"
                onChange={onCodeChange}/>
        </div>
    );
}

Editor.displayName = 'Editor';


export default Editor;
