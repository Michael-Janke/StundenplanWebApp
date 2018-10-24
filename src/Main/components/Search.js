import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Zoom from '@material-ui/core/Zoom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import FilterIcon from '@material-ui/icons/FilterList';

import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';
import SearchResult from './SearchResult';

import { classNames } from '../../Common/const';
import { connect } from 'react-redux';
import { setTimeTable, addFavorite, removeFavorite, loadMe } from '../actions';


const isTv = process.env.REACT_APP_MODE === 'tv';

class Search extends React.PureComponent {
    state = { open: false, nonEmpty: false, value: "" };

    handleOpen = () => {
        if (!this.state.open) {
            this.input.focus();
            if (!isTv) {
                this.props.loadMe();
            }
        }
        this.setState({ open: !this.state.open, value: "" });
    }

    handleFocus = () => {
        this.setState({ open: true });
    }

    handleInputRef = (ref) => {
        this.input = ref;
    }

    handleClear = () => {
        this.setState({ nonEmpty: false, value: "" });
    }

    handleInput = (e) => {
        let selectedFilter = this.state.selectedFilter;
        let value = e.target.value;
        let nonEmpty = value.length > 0;
        if (selectedFilter && !this.state.nonEmpty && nonEmpty) {
            // disable filter when typing in
            selectedFilter = "";
        }
        this.setState({ nonEmpty, value, selectedFilter, open: true });
    }

    handleClickAway = () => {
        if (this.state.open && !this.props.open) {
            this.setState({ open: false, nonEmpty: false, value: "" });
        }
    }

    handleClick = (obj) => {
        this.setState({ open: false, nonEmpty: false, value: "" });
        this.props.setTimetable(obj);
    }

    handleKeyUp = (e) => {
        if ((e.charCode === 13 || e.key === 'Enter') && this.state.result && this.state.result.length) {
            this.handleClick(this.state.result[0]);
        }
        if ((e.keyCode === 27 || e.key === 'ESC')) {
            this.setState({ open: false, value: "", nonEmpty: false });
        }
    }
    handleKeyboardInput = (transform) => {
        this.handleInput({ target: { value: transform(this.state.value) } });
    }

    setFilter(selectedFilter) {
        this.setState({
            selectedFilter: (this.state.selectedFilter === selectedFilter)
                ? ""
                : selectedFilter
        });
    }

    toggleFavorite = (object) => {
        object.favorite
            ? this.props.removeFavorite(object.upn || object.text)
            : this.props.addFavorite(object.upn || object.text)
    }

    renderFilterBar = () => {
        const { classes, small } = this.props;
        const { selectedFilter } = this.state;
        const filter = ["Lehrer", "Schüler", "Raum", "Klasse"];
        return <ListItem
            key={"Filter"}
            className={classes.filter}
        >
            <ListItemIcon>
                <FilterIcon />
            </ListItemIcon>
            <ListItemText className={classes.buttonGroup}>
                {filter.map((type) =>
                    <Button
                        key={type}
                        size={small ? "small" : "medium"}
                        className={classes.button}
                        onClick={() => this.setFilter(type)}
                        variant={selectedFilter === type ? "contained" : "outlined"}>
                        {type}
                    </Button>
                )}
            </ListItemText>
        </ListItem>
    };

    render() {
        const { classes, shrinkChildren, alwaysOpen, Keyboard, small, style } = this.props;
        const { open, nonEmpty, value } = this.state;
        const isOpen = alwaysOpen || open || this.props.open;
        return (
            <div className={classes.root} style={style}>
                <ClickAwayListener mouseEvent="onClick" onClickAway={this.handleClickAway}>
                    <div className={classes.searchbarWrapper}>
                        <div className={classNames(
                            classes.searchbar,
                            !isOpen && classes.searchbarClosed
                        )}>
                            <div className={classNames(
                                classes.inputField,
                                isOpen && classes.inputFieldOpen
                            )}>
                                <Input
                                    inputRef={this.handleInputRef}
                                    placeholder="Suchen"
                                    fullWidth
                                    disableUnderline
                                    onFocus={this.handleFocus}
                                    onClick={this.handleFocus}
                                    onChange={this.handleInput}
                                    value={value}
                                    inputProps={{ className: classes.nativeInput }}
                                    onKeyUp={this.handleKeyUp}
                                />
                            </div>
                            <IconButton onClick={this.handleOpen}
                                className={classNames(
                                    classes.icon,
                                    classes.searchIcon,
                                    nonEmpty && classes.iconHidden,
                                    !isOpen && classes.searchIconActive
                                )}>
                                <SearchIcon />
                            </IconButton>
                            <IconButton onClick={this.handleClear}
                                className={classNames(
                                    classes.icon,
                                    classes.closeIcon,
                                    !nonEmpty && classes.iconHidden
                                )}>
                                <ClearIcon />
                            </IconButton>
                        </div>
                        <div
                            className={classNames(
                                classes.dropDownContainer,
                                !open && classes.dropDownContainerClosed,
                                small && classes.dropDownContainerFullscreen,
                            )}>
                            {Keyboard &&
                                <Keyboard
                                    className={classNames(
                                        classes.dropDown,
                                        classes.keyboard,
                                        !open && classes.dropDownClosed
                                    )}
                                    onInput={this.handleKeyboardInput}>
                                </Keyboard>
                            }
                            <SearchResult
                                open={this.state.open}
                                value={this.state.value}
                                selectedFilter={this.state.selectedFilter}
                                className={classNames(
                                    classes.dropDown,
                                    classes.list,
                                    !open && classes.dropDownClosed
                                )}
                                onClick={this.handleClick}
                                toggleFavorite={this.toggleFavorite}
                                filterBar={this.renderFilterBar()}>
                            </SearchResult>
                        </div>
                    </div>
                </ClickAwayListener>
                <div className={classNames(
                    classes.children,
                    isOpen && shrinkChildren && classes.childrenOpen
                )}>
                    {React.Children.map(this.props.children, child => {
                        if (!child) return;
                        return (
                            <Zoom in={!shrinkChildren || !isOpen} className={classes.child}>
                                <div>
                                    {child}
                                </div>
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
    const { open, ...prevProps } = state;

    return {
        open: (prevProps && prevProps.open !== openProps) ? openProps : open || openProps,
    };
}

const styles = theme => ({
    icon: {
        transition: theme.transitions.create(['transform']),
        WebkitTransition: theme.transitions.create(['transform']),
        color: 'rgb(158, 158, 158)',
        transform: 'scale(1,1)',
    },
    listItemSelected: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
    },

    iconHidden: {
        transform: 'scale(0,0)',
    },
    searchIcon: {
        transitionProperty: 'transform, color',
        WebkitTransitionProperty: 'transform, color',
    },
    searchIconActive: {
        color: 'white',
    },
    closeIcon: {
        marginLeft: -48,
    },
    root: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',

    },
    rootClosed: {

    },
    searchbarWrapper: {
        width: '100%',
        position: 'relative',
        maxWidth: 800,
    },
    searchbar: {
        width: '100%',
        transform: 'translate3d(0,0,0)',
        transition: theme.transitions.create(['background', 'box-shadow']),
        WebkitTransition: theme.transitions.create(['background', 'box-shadow']),
        willChange: 'background, box-shadow',
        boxShadow: theme.shadows[4],
        borderRadius: 2,
        background: `rgb(197, 202, 233) radial-gradient(circle, transparent 1%, ${indigo[600]} 1%) center/15000%;`,
        display: 'flex',
        justifyContent: 'flex-end',
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
        height: '100vh',
    },
    dropDownContainerClosed: {
        opacity: 0,
        pointerEvents: 'none',

    },
    dropDown: {
        marginTop: theme.spacing.unit,
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
        overflowY: 'auto',
        paddingTop: 0,
    },
    filter: {
        top: 0,
        position: 'sticky',
        backgroundColor: theme.palette.background.paper,
        zIndex: 1,
    },
    keyboard: {
        backgroundColor: theme.palette.background.paper,
        height: '100%',
    },
    searchbarClosed: {
        backgroundSize: '100%',
        backgroundColor: indigo[600],
        boxShadow: 'none',
    },
    nativeInput: {
        width: '100%',
        color: 'rgba(0, 0, 0, 0.87)',
        // remove clear icon on edge
        '&::-ms-clear': {
            display: 'none',
        }
    },
    inputField: {
        width: '0%',
        opacity: 0,
        transition: theme.transitions.create(['width', 'opacity']),
        WebkitTransition: theme.transitions.create(['width', 'opacity']),
        willChange: 'width, opacity',
        height: '100%',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    inputFieldOpen: {
        width: '100%',
        opacity: 1,
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
        color: grey[500]
    },
    name: {
        minWidth: 100,
        display: 'inline-block'
    }
});

const mapStateToProps = (state) => ({
    masterdata: state.timetable.masterdata,
    small: state.browser.lessThan.medium,
});

const mapDispatchToProps = dispatch => ({
    setTimetable: (object) => dispatch(setTimeTable(object.type, object.id)),
    addFavorite: (key) => dispatch(addFavorite(key)),
    removeFavorite: (key) => dispatch(removeFavorite(key)),
    loadMe: () => dispatch(loadMe()),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Search));