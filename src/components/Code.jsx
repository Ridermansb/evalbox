import React, { useCallback, useEffect, useRef } from 'react';
import cm from 'codemirror';
import PropTypes from 'prop-types';
import 'codemirror/mode/javascript/javascript';

const styles = {
    code: {
        padding: '0',
    },
};

const Code = ({ onChange, className }) => {
    const editorReference = useRef(null);

    const handleCodeChanged = useCallback(
        (edCodeMirror) => {
            const code = edCodeMirror.getValue();
            localStorage.setItem('code', code);
            onChange(code);
        },
        [onChange]
    );

    useEffect(() => {
        const codeMirror = cm.fromTextArea(editorReference.current, {
            mode: 'javascript',
            lineNumbers: true,
        });
        codeMirror.on('change', handleCodeChanged);
        const code = localStorage.getItem('code');
        if (code) {
            codeMirror.getDoc().setValue(code);
            onChange(code);
        }
    }, [handleCodeChanged, onChange]);

    return (
        <div className={`ui ${className} form`} style={styles.code}>
            <textarea autoComplete="off" ref={editorReference} />
        </div>
    );
};

Code.displayName = 'Code';
Code.propTypes = {
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
};
Code.defaultProps = {
    className: '',
};

export default Code;
