import React, {useCallback, useEffect, useRef, useState} from 'react';
import cx from 'classnames';

const AddLibrary = ({onAdded}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState('');

    const searchRef = useRef();
    const dropDownRef = useRef();

    useEffect(() => {
        const $search = $(searchRef.current);
        const searchCommonSettings = {
            onSelect(result) {
                const url = result.cdn;
                onAdded({url, fileName: result.title});
                setValue('');
                $search.search('set value', '');
            },
            minCharacters: 2,
        };

        // onSearchQuery(query)	module	Callback on search query
        // onResults(response)

        const npmSettings = Object.assign({}, searchCommonSettings, {
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

        const cdnSettings = Object.assign({}, searchCommonSettings, {
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

        const $dropDown = $(dropDownRef.current)
        $dropDown.dropdown({
            on: 'hover',
            onChange: function (value) {
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

        return () => {
            $search.search('destroy');
            $dropDown.dropdown('destroy');
        }

    }, [])

    const handleChange = useCallback(event => {
        const value = event.target.value;
        setValue(value)
    }, []);

    const handleKey = useCallback(e => {
        if (e.charCode === 13) {
            const splited = value.split('/');
            let fileName = splited.pop();
            if (!fileName || fileName.trim() === '') {
                fileName = splited.pop();
            }

            if (fileName) {
                onAdded({url: value, fileName});
                setValue('');
            }
        }
    }, []);

    const searchClassName = cx('ui', {
        loading: isLoading
    }, 'search');

    return (
        <div className={searchClassName}
             ref={searchRef}>

            <div className="ui left labeled small input">
                <div className="ui dropdown label" ref={dropDownRef}>
                    <div className="text">npmjs</div>
                    <i className="dropdown icon"/>
                    <div className="menu">
                        <div className="item">npmjs</div>
                        <div className="item">cdnjs</div>
                    </div>
                </div>
                <input type="text"
                       value={value}
                       placeholder="lodash"
                       className="prompt"
                       onKeyPress={handleKey}
                       onChange={handleChange}
                />
            </div>
        </div>
    )
}

AddLibrary.displayName = 'AddLibrary';

export default AddLibrary
