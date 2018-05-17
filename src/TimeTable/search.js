import React, { Component } from 'react';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, ListItemIcon, ListItem, List, ListItemText, ListItemSecondaryAction, Input, Paper } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import ClassIcon from '@material-ui/icons/Group';
import RoomIcon from '@material-ui/icons/Room';
import indigo from '@material-ui/core/colors/indigo';
import CloseIcon from '@material-ui/icons/ArrowBack';
import { setTimeTable, changeWeek } from '../Main/actions';

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

const style = theme => ({
    'table-header': {
        // textAlign: 'right',
        // borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        // transition: 'transform 100ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        overflow: 'visible',
        backgroundColor: indigo[600],

    },
    list: {
        maxHeight: '70vh',
        overflowY: 'auto',
    },
    header: {
        display: 'flex',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,

    },
    icons: {
        display: 'flex'
    },
    'search': {
        display: 'flex',
        flexDirection: 'column',
        width: '75%',
        paddingBottom: 8,
    },
    'title': {
        display: 'flex',
    },
    'information': {
        display: 'flex',
        alignItems: 'center',
    },
    'information-container': {
        display: 'flex',
        paddingLeft: theme.spacing.unit,
        width: '100%',
    },
    listPaper: {
        marginTop: theme.spacing.unit,
    }
});

const getStyles = (state) => {
    const { open } = state;
    return {
        iconButtonClose: {
            style: {
                opacity: 1,
                transform: open ? 'scale(1, 1)' : 'scale(0, 0)',
                transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                zIndex: 1,
            },
            iconStyle: {
                opacity: open ? 1 : 0,
                transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
            }
        },
        iconButtonSearch: {
            style: {
                // position: 'absolute',
                opacity: 1,
                transform: open ? 'scale(0, 0)' : 'scale(1, 1)',
                transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                zIndex: 1,
            },
            iconStyle: {
                opacity: open ? 0 : 1,
                transition: 'opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
            }
        },
        searchContainer: {
            margin: 'auto 16px',
            width: '100%',
        },
        'search-bar': {
            display: 'flex',
            width: '100%',
            height: '48px',
            // width: open ? '100%' : '0%',
            zIndex: 0,

        }
    }
}

const ProfilePicture = (upn, avatars) => avatars[upn] && avatars[upn].img
    ? <Avatar src={"data:image/jpg;base64," + avatars[upn].img} size={32} />
    : <ListItemIcon><PersonIcon /></ListItemIcon>;

class Search extends Component {
    state = {
        value: "",
    }

    static getDerivedStateFromProps(props) {
        const { masterdata, avatars, currentTimeTableId, currentTimeTableType } = props;
        let currentEntry = currentTimeTableId && currentTimeTableType &&
            { teacher: masterdata.Teacher, class: masterdata.Class, student: masterdata.Student, room: masterdata.Room }[currentTimeTableType][currentTimeTableId];
        let current;
        if (currentEntry) {
            let icon;
            switch (currentTimeTableType) {
                case 'class':
                    icon = <ListItemIcon><ClassIcon /></ListItemIcon>;
                    break;
                case 'room':
                    icon = <ListItemIcon><RoomIcon /></ListItemIcon>;
                    break;
                case 'student':
                case 'teacher':
                    icon = ProfilePicture(currentEntry.UPN, avatars);
                    break;
                default: break;
            }

            current = currentEntry && {
                type: currentTimeTableType,
                text: currentEntry.FIRSTNAME ?
                    currentTimeTableType === 'teacher' ?
                        currentEntry.FIRSTNAME[0] + "." + currentEntry.LASTNAME
                        : currentEntry.FIRSTNAME + " " + currentEntry.LASTNAME
                    : currentEntry.NAME,
                icon: icon
            };
        }
        return {
            current,
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

    search(searchString) {
        return this.state.data
            .slice()
            .filter(obj => fuzzysearch(searchString, obj.searchString));
    }

    handleInputRef = (ref) => {
        this.inputField = ref;
    }

    handleInput = (e) => {
        let value = e.target.value;
        this.setState({ value: value, result: value.length ? this.search(value) : null })
    }

    handleClose = () => {
        this.setState({ value: '' });
        this.props.onClose && this.props.onClose();
    }

    handleBlur = () => {
        this.setState({ value: '', result: null });
        this.props.onClose && this.props.onClose();
    }

    handleKeyPressed = (e) => {
        if (e.charCode === 13 || e.key === 'Enter') {

        }
    }

    render() {
        const { classes, open } = this.props;
        const styles = getStyles(this.props);
        const { disabled, value } = this.state;


        return (
            <div>
                <div className={classes['table-header']}
                    style={{ transform: `translateY(${open ? 0 : '-100%'})` }}>
                    <div className={classes['header']}>
                        <div className={classes['title']}>
                            <IconButton
                                onClick={this.handleClose}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className={classes['search']}>
                            <Paper style={styles['search-bar']}>
                                <Input
                                    inputRef={this.handleInputRef}
                                    onBlur={this.handleBlur}
                                    value={value}
                                    fullWidth
                                    onChange={this.handleInput}
                                    onKeyUp={this.handleKeyPressed}
                                    onFocus={this.handleFocus}
                                    style={styles.input}
                                    disableUnderline
                                    disabled={disabled}
                                />
                                <IconButton
                                    onClick={this.handleCancel}
                                    style={styles.iconButtonClose.style}                                >
                                    <CloseIcon style={styles.iconButtonClose.iconStyle} />
                                </IconButton>
                            </Paper>
                            {this.state.result && !!this.state.result.length && open &&
                                <Paper className={classes.listPaper}>
                                    <List
                                        className={classes.list}
                                        component="div">
                                        {this.state.result
                                            .slice(0, 20)
                                            .map((object, i) =>
                                                (
                                                    <ListItem key={i} button
                                                        onClick={this.props.setTimetable.bind(null, object)}>
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
                                    </List>
                                </Paper>
                            }
                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    masterdata: state.timetable.masterdata,
    avatars: state.avatars,
    currentTimeTableId: state.timetable.currentTimeTableId,
    currentTimeTableType: state.timetable.currentTimeTableType,
});

const mapDispatchToProps = dispatch => ({
    setTimetable: (object) => dispatch(setTimeTable(object.type, object.id)),
    setNextWeek: () => dispatch(changeWeek(1)),
    setPreviousWeek: () => dispatch(changeWeek(-1)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Search));