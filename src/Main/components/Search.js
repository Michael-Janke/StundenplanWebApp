import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Zoom from '@material-ui/core/Zoom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import grey from '@material-ui/core/colors/grey';

import SearchResult from './SearchResult';

import { classNames } from '../../Common/const';
import { connect } from 'react-redux';
import { setTimeTable, loadMe } from '../actions';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';

class Search extends React.PureComponent {
    state = { open: false, nonEmpty: false, value: '', select: 0, filter: '' };

    handleOpen = () => {
        if (!this.state.open) {
            this.input.focus();
            this.props.loadMe();
        }
        this.setState({ open: !this.state.open, value: '' });
    };

    handleFocus = () => {
        this.setState({ open: true });
    };

    handleInputRef = ref => {
        this.input = ref;
    };

    handleClear = () => {
        this.setState({ nonEmpty: false, value: '', select: 0 });
    };

    handleClickAway = () => {
        if (this.state.open && !this.props.open) {
            this.setState({ open: false, nonEmpty: false, value: '' });
        }
    };

    handleClick = obj => {
        this.setState({ open: false, nonEmpty: false, value: '' });
        this.props.setTimetable(obj);
    };

    handleKeyboardInput = transform => {
        this.handleInput({ target: { value: transform(this.state.value) } });
    };

    setFilter(filter) {
        this.setState({
            filter,
        });
    }

    setCurrentItem = object => {
        this.setState({ currentItem: object });
    };

    render() {
        const { classes, shrinkChildren, alwaysOpen, Keyboard, small, style } = this.props;
        const { open, value } = this.state;
        const isOpen = alwaysOpen || open || this.props.open;
        return (
            <div className={classes.root} style={style}>
                <ClickAwayListener mouseEvent="onClick" onClickAway={this.handleClickAway}>
                    <div className={classes.searchbarWrapper}>
                        <SearchBar
                            handleInputRef={this.handleInputRef}
                            value={value}
                            open={isOpen}
                            onOpen={() => this.setState({ open: true })}
                            onClose={() => this.setState({ open: false, value: '' })}
                            onChange={value => this.setState({ value })}
                        ></SearchBar>
                        <div
                            className={classNames(
                                classes.dropDownContainer,
                                !open && classes.dropDownContainerClosed,
                                small && classes.dropDownContainerFullscreen
                            )}
                        >
                            {Keyboard && (
                                <Keyboard
                                    className={classNames(
                                        classes.dropDown,
                                        classes.keyboard,
                                        !open && classes.dropDownClosed
                                    )}
                                    onInput={this.handleKeyboardInput}
                                />
                            )}
                            <SearchResult
                                open={this.state.open}
                                value={this.state.value}
                                selectedFilter={this.state.filter}
                                onClick={this.handleClick}
                                tv={this.props.tv}
                                selected={small ? -1 : this.state.select}
                                setCurrentItem={this.setCurrentItem}
                            />
                        </div>
                    </div>
                </ClickAwayListener>
                <div className={classNames(classes.children, isOpen && shrinkChildren && classes.childrenOpen)}>
                    {React.Children.map(this.props.children, child => {
                        if (!child) return;
                        return (
                            <Zoom in={!shrinkChildren || !isOpen} className={classes.child}>
                                <div>{child}</div>
                            </Zoom>
                        );
                    })}
                </div>
            </div>
        );
    }
}

Search.getDerivedStateFromProps = (props, state) => {
    const { open: openProps } = props;
    const { open, prevOpenProps } = state;

    return {
        prevOpenProps: openProps,
        open: prevOpenProps !== openProps ? openProps : open || openProps,
    };
};

const styles = theme => ({
    icon: {
        transition: theme.transitions.create(['transform']),
        WebkitTransition: theme.transitions.create(['transform']),
        color: 'rgb(158, 158, 158)',
        transform: 'scale(1,1)',
    },
    listItemSelected: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    root: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
    },
    rootClosed: {},
    searchbarWrapper: {
        width: '100%',
        position: 'relative',
        maxWidth: 840,
    },

    dropDownContainer: {
        position: 'absolute',
        width: '100%',
        color: theme.palette.text.primary,
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 64px - 8px)',
        opacity: 1,
        display: 'flex',
        transition: theme.transitions.create(['opacity']),
        WebkitTransition: theme.transitions.create(['opacity']),
    },
    dropDownContainerFullscreen: {
        position: 'fixed',
        right: 0,
        left: 0,
    },
    dropDownContainerClosed: {
        opacity: 0,
        pointerEvents: 'none',
    },

    keyboard: {
        backgroundColor: theme.palette.background.paper,
        height: '100%',
    },

    children: {
        transform: 'translate3d(0,0,0)',
        display: 'flex',
        maxWidth: '100%',
        transition: theme.transitions.create(['max-width']),
        WebkitTransition: theme.transitions.create(['max-width']),
    },
    childrenOpen: {
        maxWidth: '0%',
    },
    child: {
        width: '100%',
    },
    type: {
        color: grey[500],
    },
    name: {
        minWidth: 100,
        display: 'inline-block',
    },
});

const mapStateToProps = state => ({
    masterdata: state.timetable.masterdata,
    small: state.browser.lessThan.medium,
});

const mapDispatchToProps = dispatch => ({
    setTimetable: object => dispatch(setTimeTable(object.type, object.id)),
    loadMe: () => dispatch(loadMe()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Search));
