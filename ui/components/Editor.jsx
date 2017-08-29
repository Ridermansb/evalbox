import React from 'react';
import { autobind } from 'core-decorators';
import Code from './Code'

const styles = {
    root: {
        'position': 'relative',
    },
    run: {
        'position': 'absolute',
        'zIndex': 9999,
        'right': 24,
        'top': 24,
    }
};

export default class extends React.PureComponent {
    static displayName = 'Editor';

    state = {code: ''};

    @autobind
    onCodeChange(code) {
        this.setState((prevState) => ({...prevState, code }));
    }

    @autobind
    executeClick() {
        const {code} = this.state;
        const { executeHandler } = this.props;
        executeHandler(code);
    }

    render() {
        const { className } = this.props;

        return (
            <div className={className} style={styles.root}>
                <a className="ui small primary button" onClick={this.executeClick} style={styles.run}>
                    <i className="right play icon"/> Run
                </a>
                <Code
                    className="ui bottom attached segment"
                    onChange={this.onCodeChange} />
            </div>
        );
    }
}
