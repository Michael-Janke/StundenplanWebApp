import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Zoom from '@material-ui/core/Zoom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import SearchResult from './SearchResult';

import classNames from 'classnames';
import { connect } from 'react-redux';
import { setTimeTable, loadMe } from '../actions';
import SearchBar from './SearchBar';

class Search extends React.PureComponent {
    state = { open: false, value: '', filter: '' };

    handleOpen = () => {
        if (!this.state.open) {
            this.props.loadMe();
        }
        this.setState({ open: !this.state.open, value: '' });
    };

    handleClickAway = () => {
        if (this.state.open && !this.props.open) {
            this.setState({ open: false, value: '' });
        }
    };

    handleClick = obj => {
        this.setState({ open: false, value: '' });
        this.props.setTimetable(obj);
    };

    handleKeyboardInput = transform => {
        this.setState({ value: transform(this.state.value) });
    };

    render() {
        const { classes, shrinkChildren, alwaysOpen, Keyboard, small, style, tv } = this.props;
        const { open: openState, value } = this.state;
        const open = openState || this.props.open;
        return (
            <div className={classes.root} style={{ ...style, height: tv && open ? '100%' : 'unset' }}>
                <ClickAwayListener mouseEvent="onClick" onClickAway={this.handleClickAway}>
                    <div className={classNames(classes.searchbarWrapper, { [classes.searchbarWrapperTv]: tv })}>
                        <SearchBar
                            value={value}
                            preOpen={alwaysOpen || open}
                            open={open}
                            onOpen={() => this.setState({ open: true })}
                            onClose={() => this.setState({ open: false, value: '' })}
                            onChange={value => this.setState({ value, open: value !== '' })}
                        />
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
                            <SearchResult open={open} value={this.state.value} onClick={this.handleClick} tv={tv} />
                        </div>
                    </div>
                </ClickAwayListener>
                <div className={classNames(classes.children, open && shrinkChildren && classes.childrenOpen)}>
                    {React.Children.map(this.props.children, child => {
                        if (!child) return;
                        return (
                            <Zoom in={!shrinkChildren || !open} className={classes.child}>
                                <div>{child}</div>
                            </Zoom>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
    },
    searchbarWrapper: {
        width: '100%',
        position: 'relative',
        maxWidth: 840,
        flexDirection: 'column',
    },
    searchbarWrapperTv: {
        display: 'flex',
        '& $dropDownContainer': {
            position: 'unset',
        },
        '& $dropDownContainerClosed': {
            maxHeight: 0,
        },
    },
    dropDownContainer: {
        width: '100%',
        position: 'absolute',
        color: theme.palette.text.primary,
        flexDirection: 'column',
        flex: 1,
        opacity: 1,
        display: 'flex',
        transition: theme.transitions.create(['opacity']),
        WebkitTransition: theme.transitions.create(['opacity']),
        height: 'calc(100vh - 64px)',
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
    keyboard: {
        backgroundColor: theme.palette.background.paper,
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
});

const mapStateToProps = state => ({
    masterdata: state.timetable.masterdata,
    small: state.browser.lessThan.medium,
});

const mapDispatchToProps = dispatch => ({
    setTimetable: object => dispatch(setTimeTable(object.type, object.id)),
    loadMe: () => dispatch(loadMe()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Search));
