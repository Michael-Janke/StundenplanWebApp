import React from 'react';
import { withStyles, IconButton, Input, Zoom, ClickAwayListener, ListItemIcon, Avatar, List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import indigo from '@material-ui/core/colors/indigo';
import PersonIcon from '@material-ui/icons/Person';
import ClassIcon from '@material-ui/icons/Group';
import RoomIcon from '@material-ui/icons/Room';
import moment from 'moment';
import { connect } from 'react-redux';
import { setTimeTable, loadAvatars } from '../actions';

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

const ProfilePicture = (upn, avatars) => avatars[upn] && avatars[upn].img
    ? <Avatar src={"data:image/jpg;base64," + avatars[upn].img} size={32} />
    : <ListItemIcon><PersonIcon /></ListItemIcon>;


class Search extends React.Component {
    state = { open: false, nonEmpty: false, value: "" };

    handleOpen = () => {
        if (!this.state.open) {
            this.input.focus();
        }
        this.setState({ open: !this.state.open, value: "", result: null });
    }

    handleInputRef = (ref) => {
        this.input = ref;
    }

    handleClear = () => {
        this.setState({ nonEmpty: false, value: "", result: null });
    }

    handleInput = (e) => {
        let value = e.target.value;
        this.setState({ nonEmpty: value.length > 0, value, result: this.search(value) });
        this.loadAvatars();
    }

    handleClickAway = () => {
        this.setState({ open: false, nonEmpty: false, value: "", result: null });
    }

    handleClick = (obj) => {
        this.setState({ open: false, nonEmpty: false, value: "", result: null });
        this.props.setTimetable(obj);
    }

    handleKeyUp = (e) => {
        if ((e.charCode === 13 || e.key === 'Enter') && this.state.result && this.state.result.length) {
            this.handleClick(this.state.result[0]);
        }
    }

    loadAvatars() {
        if (!this.state.result) return;
        var subset = this.state.result.slice();
        subset = subset.filter((value, i) => i < 10
            && value.upn
            && (this.props.avatars[value.upn] === undefined
                || moment(this.props.avatars[value.upn].expires).isBefore(moment()))
        );
        if (subset.length > 0) {
            this.props.loadAvatars(subset.map((a) => a.upn));
        }
    }

    search(searchString) {
        return this.state.data
            .slice()
            .filter(obj => fuzzysearch(searchString, obj.searchString));
    }

    render() {
        const { classes, shrinkChildren, alwaysOpen } = this.props;
        const { open, nonEmpty } = this.state;
        const isOpen = alwaysOpen || open;
        return (
            <ClickAwayListener onClickAway={this.handleClickAway}>
                <div className={classes.root}>
                    <div className={classes.searchbarWrapper}>
                        <div className={classes.searchbar + (!isOpen ? " " + classes.searchbarClosed : "")}>
                            <div className={classes.inputField + (isOpen ? " " + classes.inputFieldOpen : "")}>
                                <Input
                                    inputRef={this.handleInputRef}
                                    placeholder="Suchen"
                                    fullWidth
                                    disableUnderline
                                    onChange={this.handleInput}
                                    value={this.state.value}
                                    inputProps={{ className: classes.nativeInput }}
                                    onKeyUp={this.handleKeyUp}
                                />
                            </div>
                            <IconButton onClick={this.handleOpen} className={
                                classes.icon
                                + " " + classes.searchIcon
                                + (nonEmpty ? " " + classes.iconHidden : "")
                                + (!isOpen ? " " + classes.searchIconActive : "")
                            }>
                                <SearchIcon />
                            </IconButton>
                            <IconButton onClick={this.handleClear} className={
                                classes.icon
                                + " " + classes.closeIcon
                                + (!nonEmpty ? " " + classes.iconHidden : "")
                            }>
                                <ClearIcon />
                            </IconButton>
                        </div>
                        <div className={classes.dropDown + (!isOpen ? " " + classes.dropDownClosed : "")}>
                            {this.state.result && !!this.state.result.length &&
                                <List
                                    className={classes.list}
                                    component="div">
                                    {this.state.result
                                        .slice(0, 10)
                                        .map((object, i) =>
                                            (
                                                <ListItem
                                                    key={i}
                                                    button
                                                    onClick={this.handleClick.bind(null, object)}
                                                    {...(i === 0 && { className: classes.listItemSelected })}
                                                >
                                                    {object.icon}
                                                    <ListItemText inset primary={object.text} secondary={object.secondary} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton>
                                                            <SearchIcon onClick={this.onSearch} />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            )
                                        )}
                                </List>}
                        </div>
                    </div>
                    <div className={classes.children + (isOpen && shrinkChildren ? " " + classes.childrenOpen : "")}>
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
            </ClickAwayListener >
        );
    }
}

Search.getDerivedStateFromProps = (props) => {
    const { masterdata, avatars } = props;
    return {
        data: [
            ...Object.values(masterdata.Class).map((entry) => ({
                searchString: "Klasse " + entry.NAME,
                type: "class",
                id: entry.CLASS_ID,
                text: entry.NAME,
                secondary: "Klasse",
                icon: <ListItemIcon><ClassIcon /></ListItemIcon>
            })),
            ...Object.values(masterdata.Teacher).map((entry) => ({
                searchString: `Lehrer ${entry.FIRSTNAME} ${entry.LASTNAME}`,
                upn: entry.UPN,
                type: "teacher",
                id: entry.TEACHER_ID,
                text: entry.FIRSTNAME[0] + '. ' + entry.LASTNAME,
                secondary: "Lehrer",
                icon: ProfilePicture(entry.UPN, avatars)
            })),
            ...Object.values(masterdata.Student).map((entry) => ({
                searchString: `Schüler ${entry.FIRSTNAME} ${entry.LASTNAME}`,
                upn: entry.UPN,
                type: "student",
                id: entry.STUDENT_ID,
                text: entry.FIRSTNAME + " " + entry.LASTNAME,
                secondary: "Schüler",
                icon: ProfilePicture(entry.UPN, avatars)
            })),
            ...Object.values(masterdata.Room).map((entry) => ({
                searchString: "Raum " + entry.NAME,
                type: "room",
                id: entry.ROOM_ID,
                text: entry.NAME,
                secondary: "Klasse",
                icon: <ListItemIcon><RoomIcon /></ListItemIcon>
            })),
        ]
    };
}

const styles = theme => ({
    icon: {
        transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        color: 'rgb(158, 158, 158)',
        transform: 'scale(1,1)',
    },
    listItemSelected: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)'
    },
    list: {
        overflowY: 'auto',
        maxHeight: '500px',
    },
    iconHidden: {
        transform: 'scale(0,0)',
    },
    searchIcon: {
        transitionProperty: 'transform, color',
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
        transition: 'all 400ms',
        boxShadow: theme.shadows[2],
        borderRadius: 2,
        background: `rgb(197, 202, 233) radial-gradient(circle, transparent 1%, ${indigo[600]} 1%) center/15000%;`,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    dropDown: {
        backgroundColor: theme.palette.background.paper,
        position: 'absolute',
        width: '100%',
        opacity: 1,
        marginTop: theme.spacing.unit,
        boxShadow: theme.shadows[2],
    },
    dropDownClosed: {
        height: '0%',
        opacity: 0,
    },
    searchbarClosed: {
        backgroundSize: '100%',
        backgroundColor: indigo[600],
        boxShadow: 'none',
    },
    nativeInput: {
        width: '100%',
    },
    inputField: {
        width: '0%',
        opacity: 0,
        transition: 'all 400ms',
        height: '100%',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    inputFieldOpen: {
        width: '100%',
        opacity: 1,
    },
    children: {
        display: 'flex',
        maxWidth: '100%',
        transition: 'max-width 400ms',
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
    avatars: state.avatars,
});

const mapDispatchToProps = dispatch => ({
    setTimetable: (object) => dispatch(setTimeTable(object.type, object.id)),
    loadAvatars: (upns) => { dispatch(loadAvatars(upns)); },
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Search));