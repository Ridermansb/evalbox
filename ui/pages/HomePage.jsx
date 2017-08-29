import React from 'react';
import {autobind} from 'core-decorators';
import Editor from 'ui/components/Editor'
import Console from 'ui/components/Console'
import Menu from 'ui/components/Menu'

const styles = {
    iframe: {
        display: 'none'
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

export default class extends React.PureComponent {
    static displayName = 'Home';

    state = {
        output: '',
        iFrameDoc: iFrameDocCompile()
    };

    componentDidMount() {
        window.addEventListener('message', this.onMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.onMessage);
    }

    @autobind
    onMessage(e) {
        const frame = this.sandboxed;
        console.log('message .. ', e);
        if (e.origin === "null" && e.source === frame.contentWindow) {
            this.setState((prevState) => ({...prevState, output: e.data}));
        }
    }

    @autobind
    execute(code) {
        const frame = this.sandboxed;
        frame.contentWindow.postMessage(code, '*');
    }

    @autobind
    handleIframeDoc(libraries) {
        const iFrameDoc = iFrameDocCompile(libraries.map(l => l.url));
        this.setState((prevState) => ({...prevState, iFrameDoc}));

        localStorage.setItem('libraries', JSON.stringify(libraries));
    }

    render() {
        const {output, iFrameDoc} = this.state;

        return (
            <div>
                <Menu/>
                <div className="ui equal width internally celled container grid">
                    <div className="row">
                        <Editor
                            className="column"
                            executeHandler={this.execute}
                            librariesChanged={this.handleIframeDoc}
                        />
                        <Console className="column" output={output}/>
                    </div>
                </div>
                <iframe
                    style={styles.iframe}
                    sandbox='allow-scripts'
                    ref={(el) => {
                        this.sandboxed = el;
                    }}
                    src="about:blank"
                    srcDoc={iFrameDoc}/>
            </div>
        );
    }
}
