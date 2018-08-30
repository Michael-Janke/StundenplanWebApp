import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Zoom from '@material-ui/core/Zoom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import indigo from '@material-ui/core/colors/indigo';
import SearchResult from './SearchResult';

import { classNames } from '../../Common/const';
import { connect } from 'react-redux';
import { setTimeTable } from '../actions';
import { ObjectIcon } from './Avatars';

function fuzzysearch(needle, haystack) {
    needle = needle.toLowerCase();
    haystack = haystack.toLowerCase();
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}


class Search extends React.PureComponent {
    state = { open: false, nonEmpty: false, value: "" };

    handleOpen = () => {
        if (!this.state.open) {
            this.input.focus();
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
        if (!this.state.open) {
            return;
        }
        let value = e.target.value;
        this.setState({ nonEmpty: value.length > 0, value });
    }

    handleClickAway = () => {
        if (this.state.open) {
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

    render() {
        const { classes, shrinkChildren, alwaysOpen, Keyboard } = this.props;
        const { open, nonEmpty } = this.state;
        const isOpen = alwaysOpen || open || this.props.open;
        return (
            <div className={classes.root}>
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
                                    onChange={this.handleInput}
                                    value={this.state.value}
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
                                !open && classes.dropDownContainerClosed
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
                            {this.state.result && !!this.state.result.length &&
                                <SearchResult
                                    results={this.state.result}
                                    className={classNames(
                                        classes.dropDown,
                                        classes.list,
                                        !open && classes.dropDownClosed
                                    )}>
                                    {(result, avatars) => (
                                        result.map((object, i) =>
                                            (
                                                <ListItem
                                                    key={object.id + object.type}
                                                    button
                                                    onClick={this.handleClick.bind(null, object)}
                                                    {...(i === 0 && { className: classes.listItemSelected })}
                                                >
                                                    <ListItemIcon>
                                                        <ObjectIcon
                                                            type={object.type}
                                                            avatars={object.upn && avatars}
                                                            upn={object.upn}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText inset primary={object.text} secondary={object.secondary} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton>
                                                            <SearchIcon onClick={this.onSearch} />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            )
                                        )
                                    )}
                                </SearchResult>
                            }
                        </div>
                    </div>
                </ClickAwayListener>
                <div style={{flex:1}}>

                </div>

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
    const { masterdata } = props;
    const { value } = state;
    const sortName = (o1, o2) => (o1.LASTNAME || o1.NAME).localeCompare(o2.LASTNAME || o2.NAME);
    const user = props.user;
    let data = [
        {
            searchString: "",
            type: "all",
            id: -1,
            text: "Freie Räume",
            secondary: "",
        },
        {
            searchString: "",
            upn: user.upn,
            type: user.type,
            id: user.id,
            text: `${user.firstname} ${user.lastname}`,
            secondary: "",
        },
        ...Object.values(masterdata.Class).sort(sortName).map((entry) => ({
            searchString: entry.NAME === "07-12" ? "" : "Klasse " + entry.NAME,
            type: "class",
            id: entry.CLASS_ID,
            text: entry.NAME === "07-12" ? "Nachschreiben" : entry.NAME,
            secondary: "Klasse",
        })),
        ...Object.values(masterdata.Room).sort(sortName).map((entry) => ({
            searchString: "Raum " + entry.NAME,
            type: "room",
            id: entry.ROOM_ID,
            text: entry.NAME,
            secondary: "Raum",
        })),
        ...Object.values(masterdata.Teacher).sort(sortName).map((entry) => ({
            searchString: `Lehrer ${entry.FIRSTNAME} ${entry.LASTNAME}`,
            upn: entry.UPN,
            type: "teacher",
            id: entry.TEACHER_ID,
            text: entry.FIRSTNAME[0] + '. ' + entry.LASTNAME,
            secondary: "Lehrer",
        })),
        ...Object.values(masterdata.Student).sort(sortName).map((entry) => ({
            searchString: `Schüler ${entry.FIRSTNAME} ${entry.LASTNAME}`,
            upn: entry.UPN,
            type: "student",
            id: entry.STUDENT_ID,
            text: entry.FIRSTNAME + " " + entry.LASTNAME,
            secondary: "Schüler",
        })),
    ];

    let filtered;
    filtered = data
        .filter(obj => fuzzysearch(value, obj.searchString));

    return { data, result: filtered };
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
        justifyContent: 'flex-end',

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
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 64px - 8px)',
        opacity: 1,

        transition: theme.transitions.create(['opacity']),
        WebkitTransition: theme.transitions.create(['opacity']),
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
        transform: 'translate3d(0,0,0)',
    },
    dropDownClosed: {
        // overflow: 'hidden',
        // maxHeight: '0%',
        boxShadow: 'none',
        transform: 'translate3d(0,-8px,0)',
    },
    list: {
        backgroundColor: theme.palette.background.paper,
        overflowY: 'auto',
        // height: '100%',
        flex: 1,
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
    }
});

const mapStateToProps = (state) => ({
    masterdata: state.timetable.masterdata,
    user: state.user
});

const mapDispatchToProps = dispatch => ({
    setTimetable: (object) => dispatch(setTimeTable(object.type, object.id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Search));