import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import classNames from 'classnames';
import makeStyles from '@material-ui/styles/makeStyles';
import FilterBar from './FilterBar';
import SearchList from './SearchResultList';

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
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flex: 1,
    },
}));

const SearchResult = ({ open, onClick, value, tv }) => {
    const classes = useStyles();
    const [filter, setFilter] = useState('');
    const small = useSelector(state => state.browser.lessThan.medium);
    return (
        <List className={classNames(classes.dropDown, classes.list, !open && classes.dropDownClosed)}>
            {open && <FilterBar onChange={filter => setFilter(filter)} small={small} filter={filter} />}
            {open && <SearchList onClick={onClick} filter={filter} value={value} tv={tv} />}
        </List>
    );
};

export default SearchResult;
