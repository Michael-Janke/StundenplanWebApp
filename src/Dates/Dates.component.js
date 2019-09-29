import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Date from './Date';
import AddIcon from '@material-ui/icons/Add';
import grey from '@material-ui/core/colors/grey';
import CalendarIcon from '@material-ui/icons/Event';
import EditIcon from '@material-ui/icons/Create';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import moment from 'moment';
import { RootRef, Fab } from '@material-ui/core';
import { classNames } from '../Common/const';
import { asynchronize } from '../Router/asynchronize';
import { EditButton, DeleteButton, HomepageButton, HomepageBoxButton } from './DateEditButtons';

const DateDialog = asynchronize()(() => import('./DateDialog'));
const DateDeletionDialog = asynchronize()(() => import('./DateDeletionDialog'));

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
    },
    fabButton: {
        position: 'absolute',
        right: theme.spacing(2),
        bottom: theme.spacing(2),
        zIndex: 2,
    },
    header: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
    },
    list: {
        position: 'relative',
        overflow: 'auto',
        flex: '1 0 0',
        paddingTop: 0,
        backgroundColor: theme.palette.background.default,
    },
    listSmall: {
        maxHeight: 'unset',
        overflow: 'initial',
    },
    subheader: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
    },
    buffer: {
        height: '75vh',
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
        margin: 0,
    },
    edit: {
        width: '90vw',
    },
});

class Dates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: {},
            dialogOpen: false,
            editMode: false,
            dialogDeleteOpen: false,
        };
    }

    handleDateAddEdit = date => {
        this.setState({
            dialogOpen: false,
            selectedDate: {},
        });
        if (!date) return;
        if (date.DATE_ID) {
            this.props.editDate(date);
        } else {
            this.props.addDate(date);
        }
    };

    openDialog = date => {
        this.setState({
            selectedDate: date || {},
            edit: !!date,
            dialogOpen: true,
        });
    };

    openDeleteDialog = date => {
        this.setState({
            dialogDeleteOpen: true,
            deleteDate: date,
        });
    };

    toggleHomepage = date => {
        this.props.editDate({
            DATE_ID: date.DATE_ID,
            HOMEPAGE: !date.HOMEPAGE + 0,
        });
    };

    toggleHomepageBox = date => {
        this.props.editDate({
            DATE_ID: date.DATE_ID,
            HOMEPAGE_BOX: !date.HOMEPAGE_BOX + 0,
        });
    };

    handleDeletionDialogClose = () => {
        this.setState({
            dialogDeleteOpen: false,
        });
    };

    deleteDate = () => {
        if (this.state.deleteDate) {
            this.props.deleteDate(this.state.deleteDate);
        }
        this.setState({
            dialogDeleteOpen: false,
            deleteDate: null,
        });
    };

    setEditMode = () => {
        this.setState({ editMode: !this.state.editMode });
    };

    renderDates = (dates = [], filterDate) => {
        let monthKeyed = {};
        dates
            .filter(date => moment.utc(date.DATE_FROM.date) >= filterDate)
            .forEach(date => {
                const utcDate = moment.utc(date.DATE_FROM.date);
                const key = utcDate.format('YYYY MM');
                monthKeyed[key] = monthKeyed[key] ? monthKeyed[key] : [];
                monthKeyed[key].push(date);
            });
        Object.keys(monthKeyed).forEach(month =>
            monthKeyed[month].sort((a, b) => moment(a.DATE_FROM.date) - moment(b.DATE_FROM.date))
        );
        return monthKeyed;
    };

    componentDidMount() {
        this.scrollToMonth(this.props);
    }

    componentDidUpdate() {
        this.scrollToMonth(this.props);
    }

    monthRefs = {};

    scrollToMonth = props => {
        if (props.filterDate) return;
        const selectedMonth = props.timetableDate.format('YYYY MM');
        if (!this.monthRefs[selectedMonth]) return;
        const target = this.monthRefs[selectedMonth];
        target.parentNode.scrollTop = target.offsetTop;
    };

    render() {
        const { classes, isAdmin, filterDate, dates, timetableDate } = this.props;
        const { editMode } = this.state;
        const monthKeyedDates = this.renderDates(dates, filterDate && timetableDate);

        return (
            <div className={classNames(classes.root, editMode && classes.edit)}>
                <ListItem ContainerComponent="div" className={classes.header}>
                    <ListItemIcon>
                        <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText primary="Termine" />
                    <ListItemSecondaryAction>
                        {isAdmin && (
                            <IconButton onClick={this.setEditMode}>
                                <EditIcon />
                            </IconButton>
                        )}
                    </ListItemSecondaryAction>
                </ListItem>
                <List className={classNames(classes.list, filterDate && classes.listSmall)}>
                    {Object.keys(monthKeyedDates)
                        .sort()
                        .map(month => (
                            <RootRef key={month} rootRef={node => (this.monthRefs[month] = node)}>
                                <ul className={classes.ul}>
                                    <ListSubheader key={-1} className={classes.subheader}>
                                        {moment(month, 'YYYY MM').format('MMMM YYYY')}
                                    </ListSubheader>
                                    {monthKeyedDates[month].map((date, i) => (
                                        <Date
                                            date={date}
                                            key={date.DATE_ID}
                                            buttons={
                                                editMode &&
                                                date.DATE_ID > 0 && (
                                                    <>
                                                        <HomepageButton
                                                            toggled={date.HOMEPAGE}
                                                            onClick={() => this.toggleHomepage(date)}
                                                        />
                                                        <HomepageBoxButton
                                                            toggled={date.HOMEPAGE_BOX}
                                                            onClick={() => this.toggleHomepageBox(date)}
                                                        />
                                                        <EditButton onClick={() => this.openDialog(date)} />
                                                        <DeleteButton onClick={() => this.openDeleteDialog(date)} />
                                                    </>
                                                )
                                            }
                                        />
                                    ))}
                                </ul>
                            </RootRef>
                        ))}

                    {!filterDate && <div className={classes.buffer}>{!dates && 'Keine Termine eingetragen'}</div>}

                    {isAdmin && editMode && (
                        <DateDeletionDialog
                            open={this.state.dialogDeleteOpen}
                            handleClose={this.handleDeletionDialogClose}
                            handleDelete={this.deleteDate}
                            date={this.state.deleteDate}
                        />
                    )}

                    {isAdmin && editMode && (
                        <DateDialog
                            open={this.state.dialogOpen}
                            handleClose={this.handleDateAddEdit}
                            date={this.state.selectedDate}
                            edit={this.state.edit}
                        />
                    )}
                </List>
                {editMode && (
                    <Fab size="small" className={classes.fabButton} color="primary" onClick={this.openDialog}>
                        <AddIcon />
                    </Fab>
                )}
            </div>
        );
    }
}

export default withStyles(styles)(Dates);
