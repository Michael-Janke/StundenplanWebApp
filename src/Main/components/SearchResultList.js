import React, { useState } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { loadAvatars } from '../actions';
import makeGetSearchResult from '../../Selector/search';
import SearchItem from './SearchItem';
import VList from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import makeStyles from '@material-ui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
    overflow: {
        overflowY: 'auto',
        flex: 1,
    },
}));

const SearchResult = props => {
    const classes = useStyles();

    const { results, onClick, selected } = props;
    return (
        <div className={classes.overflow}>
            <AutoSizer disableHeight>
                {({ width }) => (
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
                                    selected={selected === index}
                                    style={style}
                                />
                            );
                        }}
                        scrollToIndex={0}
                        width={width}
                        height={Math.min(results.length * 61, window.innerHeight - 200)}
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
