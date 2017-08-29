import React from 'react';
import cx from 'classnames';
import Clipboard from 'clipboard';

const errorRegex = /^Error:\s.+/gm;

const styles = {
    output: {minHeight: '100%'}
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
            <div className={className}>
                <div className="ui top attached menu">
                    <div className="header item">Console</div>
                    {clipboardCopyIsSupport &&
                        <div className="right menu">
                            <a className="item copyButton">
                                <i className="copy icon"/>
                            </a>
                        </div>
                    }
                </div>
                <div className={outputClassName} style={styles.output}>
                    {output}
                </div>
            </div>
        );
    }
}
