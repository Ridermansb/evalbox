import React from 'react';
import cx from 'classnames';
import Clipboard from 'clipboard';

const errorRegex = /^Error:\s.+/gm;

const styles = {
    output: {minHeight: '100%'},
    root: {
        'position': 'relative',
    },
    copy: {
        'position': 'absolute',
        'zIndex': 9999,
        'right': 24,
        'top': 24,
    }
};

export default class extends React.PureComponent {
    static displayName = 'Console';

    componentDidMount() {
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
        }, 'bottom attached secondary segment');

        const clipboardCopyIsSupport = Clipboard.isSupported();

        return (
            <div className={className} style={styles.root}>
                {clipboardCopyIsSupport &&
                    <a className="ui icon button copyButton" style={styles.copy}>
                        <i className="copy icon"/>
                    </a>
                }
                <div className={outputClassName} style={styles.output}>
                    {output}
                </div>
            </div>
        );
    }
}
