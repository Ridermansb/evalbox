import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Clipboard from 'clipboard';

const errorRegex = /^Error:\s.+/gm;

const styles = {
    output: { minHeight: '100%' },
    root: {
        position: 'relative',
    },
    copy: {
        position: 'absolute',
        zIndex: 9999,
        right: 24,
        top: 24,
    },
};

const Console = ({ output, className }) => {
    const handleCopySuccessfully = useCallback((event) => {
        event.clearSelection();
    }, []);

    useEffect(() => {
        const self = this;
        const clipboard = new Clipboard('.copyButton', {
            target() {
                return document.querySelectorAll('.copyButton')[0];
            },
            text() {
                const { output } = self.props;
                return output;
            },
        });
        clipboard.on('success', handleCopySuccessfully);

        return () => {
            clipboard.off('success', handleCopySuccessfully);
            clipboard.destroy();
        };
    });

    const isError = errorRegex.test(output);
    const outputClassName = cx(
        'ui',
        {
            red: isError,
        },
        'bottom attached secondary segment'
    );

    const clipboardCopyIsSupport = Clipboard.isSupported();

    return (
        <div className={className} style={styles.root}>
            {clipboardCopyIsSupport && (
                <a className="ui icon button copyButton" style={styles.copy}>
                    <i className="copy icon" />
                </a>
            )}
            <div className={outputClassName} style={styles.output}>
                {output}
            </div>
        </div>
    );
};

Console.displayName = 'Console';
Console.propTypes = {
    output: PropTypes.string,
    className: PropTypes.string,
};
Console.defaultProps = {
    output: '',
    className: '',
};

export default Console;
