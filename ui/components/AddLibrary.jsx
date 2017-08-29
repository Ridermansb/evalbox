import React from 'react';
import {autobind} from 'core-decorators';

export default class extends React.PureComponent {
    static displayName = 'AddLibrary';

    state = {
        value: ''
    };

    componentDidMount() {
        const {onAdded} = this.props;
        const self = this;
        $(this.search)
            .search({
                onSelect(result) {
                    const url = `${window.location.protocol}//unpkg.com/${result.title}`;
                    onAdded({url, fileName: result.title});
                    self.setState({value: ''});

                },
                minCharacters: 2,
                apiSettings: {
                    url: 'https://api.npms.io/v2/search?q={query}',
                    throttle: 600,
                    onResponse(resp) {
                        return {
                            results: resp.results.map((it) => ({
                                title: it.package.name,
                                description: it.package.description
                            }))
                        }
                    }
                },
            });
    }

    @autobind
    handleChange(event) {
        const value = event.target.value;
        this.setState((prevState) => ({...prevState, value}));
    }

    @autobind
    handleKey(e) {
        if (e.charCode === 13) {
            const {value} = this.state;
            const {onAdded} = this.props;

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
    }

    render() {
        return <div className="ui search"
                     ref={(el) => {this.search = el;}}>
            <div className="ui label right pointing">Add Library</div>
            <div className="ui small input">
                <input type="text" value={this.state.value}
                       placeholder="lodash"
                       className="prompt"
                       onKeyPress={this.handleKey}
                       onChange={this.handleChange}
                />
            </div>
        </div>
    }
}