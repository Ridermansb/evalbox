import React from 'react';
import {autobind} from 'core-decorators';
import Editor from 'ui/components/Editor';
import Console from 'ui/components/Console';
import Menu from 'ui/components/Menu';

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
<html>
<head>
    <title>Evalbox's Frame</title>
    ${tagScripts}
    <script>

        function formatString() {
          
          var formatRegExp = /%[sdj%]/g;
                    
          var i = 1;
          var args = arguments;
          var len = args.length;
          var str = String(args[0]).replace(formatRegExp, function(x) {
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
          for (var x = args[i]; i < len; x = args[++i]) {
            if (isNull(x) || !isObject(x)) {
              str += ' ' + x;
            } else {
              str += ' ' + inspect(x);
            }
          }
          return str;
        }

        var executionId;
        window.addEventListener('message', function (e) {
            
            var mainWindow = e.source;
            var result = '';
            
            if (executionId){
                clearInterval(executionId);
                mainWindow.postMessage(result, e.origin);
            }
            
            try {
                // From https://stackoverflow.com/a/44073447/491181
                var cons = {
                    log: (...args) => {
                        result += formatString.apply(this, args) + '\\n'
                    },
                };
                eval('((console) => { ' + e.data + ' })')(cons);
            } catch (e) {
                result = 'Error: ' + e.message + '\\n' + e.stack;
            }
            mainWindow.postMessage(result, e.origin);
            var cacheResult = '';
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

export default class extends React.PureComponent {
    static displayName = 'Home';

    state = {
        output: '',
        autoRun: true,
        iFrameDoc: iFrameDocCompile()
    };

    componentDidMount() {
        window.addEventListener('message', this.onMessage);
        this.autoExecute = debounce(this.execute, 800);

        const code = localStorage.getItem('code');
        if (code) {
            this.execute(code);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.onMessage);
    }

    @autobind
    onMessage(e) {
        const frame = this.sandboxed;
        if (e.origin === "null" && e.source === frame.contentWindow) {
            this.setState((prevState) => ({...prevState, output: e.data}));
        }
    }

    @autobind
    codeChanged(code) {
        this.setState((prevState) => ({...prevState, code}));
        const { autoRun } = this.state;
        if (autoRun && this.autoExecute) {
            this.autoExecute(code)
        }
    }

    @autobind
    autoRunChanged(autoRun) {
        this.setState((prevState) => ({...prevState, autoRun}));
    }

    @autobind
    execute(code) {
        const frame = this.sandboxed;
        frame.contentWindow.postMessage(code, '*');
    }

    @autobind
    librariesChanged(libraries) {
        const iFrameDoc = iFrameDocCompile(libraries.map(l => l.url));
        this.setState((prevState) => ({...prevState, iFrameDoc}));

        localStorage.setItem('libraries', JSON.stringify(libraries));

        const { autoRun, code } = this.state;
        if (autoRun && this.autoExecute) {
            this.autoExecute(code)
        }
    }

    render() {
        const {output, iFrameDoc, autoRun} = this.state;

        return (
            <div className="ui container">
                <Menu
                    onLibrariesChanged={this.librariesChanged}
                    autoRun={autoRun}
                    onAutoRunChange={this.autoRunChanged}
                />
                <div className="ui stackable two column grid">
                    <Editor className="column"
                            executeHandler={this.execute}
                            onChange={this.codeChanged}
                            displayRunButton={!autoRun}
                    />
                    <Console className="column" output={output} />
                </div>
                <iframe
                    style={styles.iframe}
                    sandbox='allow-scripts allow-same-origin allow-forms'
                    ref={(el) => {
                        this.sandboxed = el;
                    }}
                    src="about:blank"
                    srcDoc={iFrameDoc}/>
            </div>
        );
    }
}
