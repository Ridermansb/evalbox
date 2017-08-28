import React from 'react';
import { autobind } from 'core-decorators';

export default class extends React.PureComponent {
    static displayName = 'AddLibrary';

    state = {
        value: ''
    };

    @autobind
    handleChange(event) {
        const value = event.target.value;
        this.setState((prevState) => ({...prevState, value }));
    }

    @autobind
    handleSubmit(e) {
        e.preventDefault();
        const { value } = this.state;
        const { onAdded } = this.props;

        const splited = value.split('/');
        let fileName = splited.pop();
        if (!fileName || fileName.trim() === '') {
            fileName = splited.pop();
        }

        if (fileName) {
            onAdded({url: value, fileName});
            this.setState({value: ''});
        }
    }

    render() {
        return <form className="ui form" onSubmit={this.handleSubmit}>
            <div className="ui transparent icon input">
                <input type="text" value={this.state.value}
                       placeholder="Add library ..."
                       onChange={this.handleChange} />
                <i className="add circle icon" type="submit"/>
            </div>
        </form>
    }
}