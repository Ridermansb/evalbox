import {hot} from 'react-hot-loader/root';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Editor from '@components/Editor';
import Console from '@components/Console';
import Menu from '@components/Menu';

const styles = {
    iframe: {
        display: 'none'
    },
    fork: {
        'position': 'absolute',
        'top': 0, 'left': 0, 'border': 0,
    }
};

const iFrameDocCompile = (scripts = []) => {
    const tagScripts = scripts.reduce((acc, next) => {
        acc += `<script async=false src="${next}" ></script>`;
        return acc;
    }, '');

    return `<!DOCTYPE html>
<html lang="en-US">
<head>
    <title>Evalbox's Frame</title>
    ${tagScripts}
    <script>

        function formatString() {
          
          let formatRegExp = /%[sdj%]/g;
                    
          let i = 1;
          let args = arguments;
          let len = args.length;
          let str = String(args[0]).replace(formatRegExp, function(x) {
            if (x === '%%') return '%';
            if (i >= len) return x;
            switch (x) {
              case '%s': return String(args[i++]);
              case '%d': return Number(args[i++]);
              case '%j':
                try {
                  return JSON.stringify(args[i++]);
                } catch (_) {
                  return '[Circular]';
                }
              default:
                return x;
            }
          });
          for (let x = args[i]; i < len; x = args[++i]) {
            if (isNull(x) || !isObject(x)) {
              str += ' ' + x;
            } else {
              str += ' ' + inspect(x);
            }
          }
          return str;
        }

        let executionId;
        window.addEventListener('message', function (e) {
            
            let mainWindow = e.source;
            let result = '';
            
            if (executionId){
                clearInterval(executionId);
                mainWindow.postMessage(result, e.origin);
            }
            
            try {
                // From https://stackoverflow.com/a/44073447/491181
                let cons = {
                    log: (...args) => {
                        result += formatString.apply(this, args) + '\\n'
                    },
                };
                eval('((console) => { ' + e.data + ' })')(cons);
            } catch (e) {
                result = 'Error: ' + e.message + '\\n' + e.stack;
            }
            mainWindow.postMessage(result, e.origin);
            let cacheResult = '';
            executionId = setInterval(() => {
                if (cacheResult !== result) {
                  mainWindow.postMessage(result, e.origin);
                  cacheResult = result;
                }
            }, 2000);
        });
    </script>
</head>
<body>
</body>
</html>`
};

/**
 * https://stackoverflow.com/a/44913401/491181
 */
const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(null, args)
        }, delay)
    }
};

const App = () => {

    const [output, setOutput] = useState('');
    const [code, setCode] = useState('');
    const [autoRun, setAutoRun] = useState(true);
    const [iFrameDoc, setIFrameDoc] = useState(iFrameDocCompile());
    const sandboxRef = useRef(null);

    const handleOnMessage = useCallback((e) => {
        if (e.origin === "null" && e.source === sandboxRef.current.contentWindow) {
            setOutput(e.data)
        }
    }, []);

    const execute = useCallback(code => {
        sandboxRef.current.contentWindow.postMessage(code, '*');
    }, []);
    const autoExecute = useRef(debounce(execute, 1000))

    const codeChanged = useCallback(code => {
        setCode(code)
        if (autoRun && autoExecute.current) {
            autoExecute.current(code)
        }
    }, []);

    const autoRunChanged = useCallback(autoRun => {
        setAutoRun(autoRun)
    }, []);

    useEffect(() => {
        window.addEventListener('message', handleOnMessage);

        const code = localStorage.getItem('code');
        if (code) {
            execute(code);
        }

        return () => {
            window.removeEventListener('message', handleOnMessage);
        }
    }, []);

    const librariesChanged = useCallback(libraries => {
        const iFrameDoc = iFrameDocCompile(libraries.map(l => l.url));
        setIFrameDoc(iFrameDoc);
        localStorage.setItem('libraries', JSON.stringify(libraries));
        if (autoRun && autoExecute.current) {
            autoExecute.current(code)
        }
    }, []);

    return (
        <div className="ui container">
            <Menu
                onLibrariesChanged={librariesChanged}
                autoRun={autoRun}
                onAutoRunChange={autoRunChanged}
            />
            <div className="ui stackable two column grid">
                <Editor className="column"
                        executeHandler={execute}
                        onChange={codeChanged}
                        displayRunButton={!autoRun}
                />
                <Console className="column" output={output}/>
            </div>
            <iframe
                style={styles.iframe}
                sandbox='allow-scripts allow-same-origin allow-forms'
                ref={sandboxRef}
                src="about:blank"
                srcDoc={iFrameDoc}/>
        </div>
    );
}

App.displayName = 'App';

export default __DEVELOPMENT__ ? hot(App) : App;
