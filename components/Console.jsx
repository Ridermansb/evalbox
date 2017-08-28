import React from 'react';
import cx from 'classnames';
import hljs from 'highlight.js';
import Clipboard from 'clipboard';

import 'highlight.js/styles/github-gist.css';

const errorRegex = /^Error:\s.+/gm;

const styles = {
    output: {minHeight: '100%'}
};

export default class extends React.PureComponent {
    static displayName = 'Console';

    componentDidMount() {
        hljs.configure({useBR: true});
        hljs.initHighlighting();

        const self = this;
        this.clipboard = new Clipboard('.copyButton', {
            target() {
                return document.getElementsByClassName('copyButton')[0];
            },
            text() {
                const {output} = self.props;
                return output;
            }
        });
        this.clipboard.on('success', function (e) {
            e.clearSelection();
        });
    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    render() {
        const {output, className} = this.props;

        const isError = errorRegex.test(output);
        const outputClassName = cx('ui', {
            'red': isError,
        }, 'segment');

        const clipboardCopyIsSupport = Clipboard.isSupported();

        return (
            <div className={className}>
                <div className="ui pointing menu">
                    <a className="active item">Console</a>
                    {clipboardCopyIsSupport &&
                        <div className="right menu">
                            <a className="item copyButton">
                                <i className="copy icon"/>
                            </a>
                        </div>
                    }
                </div>
                <div className={outputClassName} style={styles.output}>
                    <pre>
                        <code
                            className="js"
                            dangerouslySetInnerHTML={{__html: hljs.highlight('js', output).value}} />
                    </pre>
                </div>
            </div>
        );
    }
}
