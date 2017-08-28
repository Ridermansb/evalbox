import React from 'react';
import {autobind} from 'core-decorators';
import Editor from './Editor'
import Console from './Console'

export default class extends React.PureComponent {
    static displayName = 'App';

    state = {output: '', iframeDoc: ''};

    componentDidMount() {
        window.addEventListener('message', this.onMessage);
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
    execute(code) {
        const frame = this.sandboxed;
        frame.contentWindow.postMessage(code, '*');
    }

    @autobind
    handleIframeDoc(libraries) {
        const scripts = libraries.map(library => {
            return `<script async=false src="${library.url}" ></script>`
        });

        const iframeDoc = `<!DOCTYPE html>
<html>
<head>
    <title>Evalbox's Frame</title>
    ${scripts}
    <script>
        window.addEventListener('message', function (e) {
            var mainWindow = e.source;
            var result = '';
            try {
                var cons = {
                    log: (...args) => result += args + '\\n',
                };
                eval('((console) => { ' + e.data + ' })')(cons);
            } catch (e) {
                result = 'Error: ' + e.message + '\\n' + e.stack;
            }
            mainWindow.postMessage(result, event.origin);
        });
    </script>
</head>
<body>
</body>
</html>`
        this.setState((prevState) => ({...prevState, iframeDoc}));
    }

    render() {
        const {output, iframeDoc} = this.state;

        return (
            <div className="ui equal width internally celled container grid">
                <div className="row">
                    <Editor
                        className="column"
                        executeHandler={this.execute}
                        librariesChanged={this.handleIframeDoc}
                    />
                    <Console className="column" output={output}/>
                </div>
                <iframe
                    className="ui basic mobile only row segment"
                    sandbox='allow-scripts'
                    ref={(el) => {
                        this.sandboxed = el;
                    }}
                    src="about:blank"
                    srcDoc={iframeDoc}/>
            </div>
        );
    }
}
