import React from 'react';
import { connect } from 'react-redux';
import { loadAvatars } from '../actions';
import List from '@material-ui/core/List';
import classNames from 'classnames';
import makeGetSearchResult from '../../Selector/search';
import SearchItem from './SearchItem';
import ReactProgressiveList from 'react-progressive-list';
import makeStyles from '@material-ui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
    dropDown: {
        marginTop: theme.spacing(1),
        boxShadow: theme.shadows[4],
        borderRadius: 2,
        transition: theme.transitions.create(['opacity', 'transform', 'box-shadow']),
        WebkitTransition: theme.transitions.create(['opacity', 'transform', 'box-shadow']),
        willChange: 'opacity, transform',
        transform: 'translate(0,0)',
        maxHeight: 'inherit',
    },
    dropDownClosed: {
        boxShadow: 'none',
        transform: 'translate(0,-8px)',
    },
    list: {
        backgroundColor: theme.palette.background.paper,
        paddingTop: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    overflow: {
        overflowY: 'auto',
        flex: 1,
        marginBottom: -1, //fix bug
    },
}));

const SearchResult = props => {
    const classes = useStyles();

    const { selected, open, filterBar, results, onClick } = props;
    return (
        <List className={classNames(classes.dropDown, classes.list, !open && classes.dropDownClosed)}>
            {results ? (
                <React.Fragment>
                    {filterBar}
                    <div className={classes.overflow}>
                        <ReactProgressiveList
                            rowCount={results.length}
                            style={{ overflowY: 'auto' }}
                            initialAmount={20}
                            renderItem={index => {
                                const object = results[index];
                                if (!object) return null;
                                return (
                                    <SearchItem
                                        key={object.upn}
                                        object={object}
                                        onClick={onClick}
                                        selected={selected === index}
                                    />
                                );
                            }}
                        />
                    </div>
                </React.Fragment>
            ) : null}
        </List>
    );
};

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
