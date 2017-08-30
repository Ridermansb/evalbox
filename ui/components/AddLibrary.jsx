import React from 'react';
import cx from 'classnames';
import {autobind} from 'core-decorators';

export default class extends React.PureComponent {
    static displayName = 'AddLibrary';

    state = {
        value: ''
    };

    componentDidMount() {
        const {onAdded} = this.props;
        const self = this;

        const $search = $(this.search);

        const searchCommumSettings = {
            onSelect(result) {
                const url = result.cdn;
                onAdded({url, fileName: result.title});
                self.setState({value: ''});
                $search.search('set value', '');
            },
            minCharacters: 2,
        };

        // onSearchQuery(query)	module	Callback on search query
        // onResults(response)

        const npmSettings = Object.assign({}, searchCommumSettings, {
            apiSettings: {
                url: 'https://api.npms.io/v2/search?q={query}',
                throttle: 600,
                onResponse(resp) {
                    return {
                        results: resp.results.map((it) => ({
                            title: it.package.name,
                            cdn: `${window.location.protocol}//unpkg.com/${it.package.name}`,
                            description: it.package.description
                        }))
                    }
                }
            },
        });

        const cdnSettings = Object.assign({}, searchCommumSettings, {
            apiSettings: {
                url: 'https://api.cdnjs.com/libraries?search={query}&fields=name,description',
                throttle: 600,
                onResponse(resp) {
                    return {
                        results: resp.results.map((it) => ({
                            title: it.name,
                            description: it.description,
                            cdn: it.latest
                        }))
                    }
                }
            },
        });

        $(this.dropDown).dropdown({
            on: 'hover',
            onChange: function(value) {
                $search.search('cancel query');
                $search.search('clear cache');
                $search.search('destroy');
                if (value === 'npmjs') {
                    $search.search(npmSettings);
                } else {
                    $search.search(cdnSettings);
                }
            }
        });

        $search.search(npmSettings);
    }

    componentWillUnmount() {
        $(this.search).search('destroy');
        $(this.dropDown).dropdown('destroy');
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
                this.setState((prevState) => ({...prevState, value: ''}));
            }
        }
    }

    render() {
        const {  isLoading } = this.state;
        const searchClassName = cx('ui', {
            loading: isLoading
        }, 'search');

        return <div className={searchClassName}
                     ref={(el) => {this.search = el;}}>

            <div className="ui left labeled small input">
                <div className="ui dropdown label" ref={(el) => { this.dropDown = el; }}>
                    <div className="text">npmjs</div>
                    <i className="dropdown icon"/>
                    <div className="menu">
                        <div className="item">npmjs</div>
                        <div className="item">cdnjs</div>
                    </div>
                </div>
                <input type="text"
                       value={this.state.value}
                       placeholder="lodash"
                       className="prompt"
                       onKeyPress={this.handleKey}
                       onChange={this.handleChange}
                />
            </div>
        </div>
    }
}