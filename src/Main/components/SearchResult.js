import React from 'react';
import { connect } from 'react-redux';
import { loadAvatars } from '../actions';
import List from '@material-ui/core/List';
import { RootRef } from '@material-ui/core';
import VList from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import makeGetSearchResult from '../../Selector/search';
import SearchItem from './SearchItem';

class SearchResult extends React.PureComponent {
    render() {
        const { className, selected } = this.props;
        return (
            <RootRef rootRef={this.handleRef}>
                <List className={className}>
                    {this.props.results ? (
                        <React.Fragment>
                            {this.props.filterBar}
                            <AutoSizer disableHeight>
                                {({ width }) => (
                                    <VList
                                        rowCount={this.props.results.length}
                                        rowHeight={61}
                                        rowRenderer={({ index, key, style }) => {
                                            const object = this.props.results[index];

                                            return (
                                                <SearchItem
                                                    key={key}
                                                    object={object}
                                                    onClick={this.props.onClick}
                                                    selected={selected === index}
                                                    style={style}
                                                />
                                            );
                                        }}
                                        width={width}
                                        height={Math.min(
                                            500,
                                            this.props.results.length * 61,
                                            window.screen.height - 150
                                        )}
                                    />
                                )}
                            </AutoSizer>
                        </React.Fragment>
                    ) : null}
                </List>
            </RootRef>
        );
    }
}

const makeMapStateToProps = () => {
    const getSearchResult = makeGetSearchResult();
    return (state, props) => ({
        results: getSearchResult(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    loadAvatars: upns => {
        dispatch(loadAvatars(upns));
    },
});

export default connect(
    makeMapStateToProps,
    mapDispatchToProps
)(SearchResult);
