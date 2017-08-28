import React from 'react'
import cm from 'codemirror';
import 'codemirror/mode/javascript/javascript';

const styles = {
    code: {
        padding: '0'
    }
};

export default class extends React.PureComponent {
    componentDidMount() {
        const codeMirror = cm.fromTextArea(this.editor, {
            mode: 'javascript',
            lineNumbers: true,
        });
        const { onChange } = this.props;
        codeMirror.on("change", function(ed) {
            onChange(ed.getValue())
        });
    }
    render() {
        return <div className="ui segment form" style={styles.code}>
            <textarea
                autoComplete='off'
                ref={(el) => {this.editor = el;}}
            />
        </div>
    }
}