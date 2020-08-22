import React, { useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

const AddLibrary = ({ onAdded }) => {
    const [isLoading] = useState(true);
    const [value, setValue] = useState('');

    const searchReference = useRef();
    const dropDownReference = useRef();

    useEffect(() => {
        const $search = $(searchReference.current);
        const searchCommonSettings = {
            onSelect(result) {
                const url = result.cdn;
                onAdded({ url, fileName: result.title });
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
                            description: it.package.description,
                        })),
                    };
                },
            },
        });

        const cdnSettings = Object.assign({}, searchCommonSettings, {
            apiSettings: {
                url:
                    'https://api.cdnjs.com/libraries?search={query}&fields=name,description',
                throttle: 600,
                onResponse(resp) {
                    return {
                        results: resp.results.map((it) => ({
                            title: it.name,
                            description: it.description,
                            cdn: it.latest,
                        })),
                    };
                },
            },
        });

        const $dropDown = $(dropDownReference.current);
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
            },
        });
        $search.search(npmSettings);

        return () => {
            $search.search('destroy');
            $dropDown.dropdown('destroy');
        };
    }, [onAdded]);

    const handleChange = useCallback((event) => {
        const value = event.target.value;
        setValue(value);
    }, []);

    const handleKey = useCallback(
        (event) => {
            if (event.charCode === 13) {
                const splited = value.split('/');
                let fileName = splited.pop();
                if (!fileName || fileName.trim() === '') {
                    fileName = splited.pop();
                }

                if (fileName) {
                    onAdded({ url: value, fileName });
                    setValue('');
                }
            }
        },
        [onAdded, value]
    );

    const searchClassName = cx(
        'ui',
        {
            loading: isLoading,
        },
        'search'
    );

    return (
        <div className={searchClassName} ref={searchReference}>
            <div className="ui left labeled small input">
                <div className="ui dropdown label" ref={dropDownReference}>
                    <div className="text">npmjs</div>
                    <i className="dropdown icon" />
                    <div className="menu">
                        <div className="item">npmjs</div>
                        <div className="item">cdnjs</div>
                    </div>
                </div>
                <input
                    type="text"
                    value={value}
                    placeholder="lodash"
                    className="prompt"
                    onKeyPress={handleKey}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

AddLibrary.displayName = 'AddLibrary';
AddLibrary.propTypes = {
    onAdded: PropTypes.func.isRequired,
};

export default AddLibrary;
