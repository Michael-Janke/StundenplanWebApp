import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import makeGetSearchResult from '../../Selector/search';
import SearchItem from './SearchItem';
import VList from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import makeStyles from '@material-ui/styles/makeStyles';
import useKeyPress from '../../Common/hooks/useKeyDown';

const useStyles = makeStyles((theme) => ({
    overflow: {
        overflowY: 'auto',
        flex: 1,
    },
}));

const SearchResult = ({ results, onClick, tv, onEmptyResult }) => {
    const classes = useStyles();
    const [selected, setSelected] = useState(0);
    const small = useSelector((state) => state.browser.lessThan.medium);
    useKeyPress((e) => {
        if (e.keyCode === 38 || e.key === 'ArrowUp') {
            setSelected(Math.max(0, selected - 1));
        }
        if (e.keyCode === 40 || e.key === 'ArrowDown') {
            setSelected(Math.min(results.length - 1, selected + 1));
        }
        if (e.charCode === 13 || e.key === 'Enter') {
            onClick(results[selected]);
        }
    });

    useEffect(() => {
        setSelected(0);
    }, [results]);
    useEffect(() => {
        if (onEmptyResult && results && results.length === 0) {
            onEmptyResult();
        }
    }, [results, onEmptyResult]);

    return (
        <div className={classes.overflow}>
            <AutoSizer>
                {({ width, height }) => (
                    <VList
                        rowCount={results.length}
                        rowHeight={({ index }) => (results[index].secondary ? 61 : 48)}
                        rowRenderer={({ index, key, style }) => {
                            const object = results[index];

                            return (
                                <SearchItem
                                    key={key}
                                    object={object}
                                    onClick={onClick}
                                    selected={!small && selected === index}
                                    style={style}
                                    tv={tv}
                                />
                            );
                        }}
                        scrollToIndex={0}
                        width={width}
                        height={Math.min(results.length * 61, height - 2)}
                    />
                )}
            </AutoSizer>
        </div>
    );
};

const makeMapStateToProps = () => {
    const getSearchResult = makeGetSearchResult();
    return (state, { filter, value }) => ({
        results: getSearchResult(state, { filter, value }),
    });
};

export default connect(makeMapStateToProps)(SearchResult);
