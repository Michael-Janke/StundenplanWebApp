import React, { Component } from "react";
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { getDates, deleteDate, editDate, addDate } from "./actions";
import makeGetCurrentDates from "../Selector/dates";
import DateDialog from "./DateDialog";
import Date from "./Date";
import Button from '@material-ui/core/Button';
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
import { RootRef } from "@material-ui/core";
import DateDeletionDialog from "./DateDeletionDialog";
import { classNames } from "../Common/const";

const styles = theme => ({
    fabButton: {
        position: "absolute",
        right: theme.spacing.unit * 2,
        bottom: theme.spacing.unit * 2,
        zIndex: 2,
    },
    header: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
    },
    list: {
        position: 'relative',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 140px)',
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
        height: '75vh'
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
        margin: 0,
    },
});

class Dates extends Component {

    constructor(props) {
        super(props);
        this.props.getDates();
        this.state = {
            selectedDate: {},
            dialogOpen: false,
            editMode: false,
            dialogDeleteOpen: false,
        };
    }

    handleDateAddEdit = (date) => {
        this.setState({
            dialogOpen: false,
            selectedDate: {}
        });
        if (!date) return;
        if (date.DATE_ID) {
            this.props.editDate(date);
        } else {
            this.props.addDate(date);
        }
    }

    openDialog = (date) => {
        this.setState({
            selectedDate: date || {},
            edit: !!date,
            dialogOpen: true
        });
    }

    openDeleteDialog = (date) => {
        this.setState({
            dialogDeleteOpen: true,
            deleteDate: date,
        });
    }

    handleDeletionDialogClose = () => {
        this.setState({
            dialogDeleteOpen: false,
        })
    }

    deleteDate = () => {
        if (this.state.deleteDate) {
            this.props.deleteDate(this.state.deleteDate);
        }
        this.setState({
            dialogDeleteOpen: false,
            deleteDate: null,
        });
    }

    setEditMode = () => {
        this.setState({ editMode: !this.state.editMode });
    }

    renderDates = (dates) => {
        let array = [];
        dates.reduce((prev, current) => {
            let date = moment(current.DATE_FROM.date);
            if (!prev || prev.month !== date.month()) {
                let c = { month: date.month(), title: date.format("MMMM YY"), dates: [current] };
                array.push(c);
                return c;
            }
            prev.dates.push(current);
            return prev;
        }, null);
        return array;
    }


    componentDidMount() {
        this.scrollToMonth();
    }

    componentDidUpdate() {
        this.scrollToMonth();
    }

    monthRefs = {};

    scrollToMonth = () => {
        if (this.props.singleMonth) return;
        const selectedMonth = this.props.timetableDate.format("MMMM YY");
        this.monthRefs[selectedMonth]
            && this.monthRefs[selectedMonth].scrollIntoView({ block: 'start', behavior: 'smooth', inline: 'start' });
    }

    render() {
        const { classes, isAdmin, timetableDate, singleMonth } = this.props;
        const { editMode } = this.state;

        const dates = singleMonth
            ? this.props.dates.filter((date = {}) => moment(date.DATE_FROM.date).month() === timetableDate.month())
            : this.props.dates;

        return (
            <React.Fragment>
                <ListItem ContainerComponent="div" className={classes.header}>
                    <ListItemIcon>
                        <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText primary="Termine" />
                    <ListItemSecondaryAction>
                        {isAdmin && <IconButton onClick={this.setEditMode}><EditIcon /></IconButton>}
                    </ListItemSecondaryAction>
                </ListItem>
                <List className={classNames(classes.list, singleMonth && classes.listSmall)}>
                    {this.renderDates(dates)
                        .map(month => (
                            <RootRef key={month.title} rootRef={(node) => this.monthRefs[month.title] = node}>
                                <ul className={classes.ul}>
                                    <ListSubheader
                                        key={-1}
                                        className={classes.subheader}>
                                        {month.title}
                                    </ListSubheader>
                                    {month.dates.map((date, i) => (
                                        <Date
                                            date={date}
                                            key={date.DATE_ID}
                                            onEdit={isAdmin && editMode && date.DATE_ID > 0 ? () => this.openDialog(date) : undefined}
                                            onDelete={isAdmin && editMode && date.DATE_ID > 0 ? () => this.openDeleteDialog(date) : undefined}
                                        />
                                    ))}
                                </ul>
                            </RootRef>
                        ))}

                    {!singleMonth && <div className={classes.buffer}>
                        {!dates && "Keine Termine eingetragen"}
                    </div>}

                    <DateDeletionDialog
                        open={this.state.dialogDeleteOpen}
                        handleClose={this.handleDeletionDialogClose}
                        handleDelete={this.deleteDate}
                        date={this.state.deleteDate}
                    />

                    {isAdmin && <DateDialog
                        open={this.state.dialogOpen}
                        handleClose={this.handleDateAddEdit}
                        date={this.state.selectedDate}
                        edit={this.state.edit}
                    />}
                    {editMode &&
                        <Button
                            variant="fab"
                            mini
                            className={classes.fabButton}
                            color="primary"
                            onClick={this.openDialog} >
                            <AddIcon />
                        </Button>}
                </List>
            </React.Fragment>
        );
    }
}

const makeMapStateToProps = () => {
    const getCurrentDates = makeGetCurrentDates();
    const mapStateToProps = (state, props) => {
        return {
            timetableDate: state.timetable.timetableDate,
            min: state.timetable.masterdata.minMaxDates.min,
            max: state.timetable.masterdata.minMaxDates.max,
            dates: getCurrentDates(state),
            isAdmin: state.user.scope === 'admin'
        }
    }
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
    getDates: () => dispatch(getDates()),
    deleteDate: (date) => dispatch(deleteDate(date)),
    addDate: (date) => dispatch(addDate(date)),
    editDate: (date) => dispatch(editDate(date)),
});

export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styles)(Dates)); 