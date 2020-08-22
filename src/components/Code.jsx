import React, {useCallback, useEffect, useRef} from 'react'
import cm from 'codemirror';
import 'codemirror/mode/javascript/javascript';

const styles = {
    code: {
        padding: '0'
    }
};

const Code = ({onChange, className}) => {

    const editorRef = useRef(null);

    const handleCodeChanged = useCallback(edCodeMirror => {
        const code = edCodeMirror.getValue();
        localStorage.setItem('code', code);
        onChange(code)
    }, []);

    useEffect(() => {
        const codeMirror = cm.fromTextArea(editorRef.current, {
            mode: 'javascript',
            lineNumbers: true,
        });
        codeMirror.on('change', handleCodeChanged);
        const code = localStorage.getItem('code');
        if (code) {
            codeMirror.getDoc().setValue(code);
            onChange(code)
        }
    }, [])

    return <div className={`ui ${className} form`} style={styles.code}>
            <textarea
                autoComplete='off'
                ref={editorRef}
            />
    </div>
}

Code.displayName = 'Code';

export default Code;
