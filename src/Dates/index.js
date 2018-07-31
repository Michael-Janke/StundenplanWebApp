import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import { connect } from 'react-redux';
import MonthView from './month';
import { getDates, deleteDate } from "./actions";
import makeGetCurrentDates from "../Selector/dates";
import AddDialog from "./Dialogs/addDialog";
import DatePickerComponent from 'material-ui-pickers/DatePicker/DatePicker';
import { classNames } from "../Common/const";
import { setDate } from "../Main/actions";
import AppointmentDay from "./day";
import datePickerEnhancer from "./datePickerEnhancer";

const DatePicker = datePickerEnhancer(DatePickerComponent);

const styles = theme => ({
    datePicker: {
        overflow: 'hidden',
        minWidth: 310,
    },
    dayWrapper: {
        position: 'relative',
    },
    root: {
        height: '100%',
    },
    content: {
        height: 'calc(100vh - 498px)',
        overflowY: 'auto',
        padding: theme.spacing.unit,
    },
    day: {
        width: 36,
        height: 36,
        fontSize: theme.typography.caption.fontSize,
        margin: '0 2px',
        color: theme.palette.text.primary,
    },
    customDayHighlight: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '2px',
        right: '2px',
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: '50%',
    },
    nonCurrentMonthDay: {
        color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
        color: '#676767',
    },
    highlight: {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    firstHighlight: {
        extend: 'highlight',
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    },
    endHighlight: {
        extend: 'highlight',
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
    },
});

class Dates extends Component {

    constructor(props) {
        super(props);
        this.props.getDates();
        this.state = {
            date: moment(),
        };
    }

    handleInnerRefAddDialog = (r) => {
        this.addDialog = r;
    }

    handleOnEdit = (appointment) => {
        this.addDialog.getWrappedInstance().open(appointment);
    }

    handleOnDelete = (appointment) => {
        this.props.deleteDate(appointment);
    }

    handleOnAdd = () => {
        this.addDialog.getWrappedInstance().open();
    }

    renderMonths() {
        let months = [];
        const props = { isAdmin: this.props.isAdmin };
        for (let i = 0; i < this.state.monthCount; i++) {
            months.push(
                <li
                    key={i}
                >
                    <MonthView
                        ref={i}
                        startMonth={this.state.min}
                        index={i}
                        dates={this.props.dates}
                        {...props} />
                </li>
            )
        }
        return months;
    }


    renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
        const { classes } = this.props;
        const start = selectedDate.clone().startOf('week');
        const end = selectedDate.clone().endOf('week');
        const dayIsBetween = date.isBetween(start, end, 'day', "[]");
        const isFirstDay = date.isSame(start, 'day');
        const isLastDay = date.isSame(end, 'day');

        const wrapperClassName = classNames({
            [classes.highlight]: dayIsBetween,
            [classes.firstHighlight]: isFirstDay,
            [classes.endHighlight]: isLastDay,
        });

        const dayClassName = classNames(classes.day, {
            [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
            [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
        });

        return (
            <div className={wrapperClassName}>
                <IconButton className={dayClassName}>
                    <span> {date.format('D')} </span>
                </IconButton>
            </div>
        );
    }

    render() {
        const { classes, setDate, timetableDate } = this.props;
        const dates = this.props.dates.filter(d => d.DATE.month() === timetableDate.month());

        return (
            <Paper className={classes.root}>
                <div className={classes.datePicker}>
                    <DatePicker
                        date={timetableDate}
                        onChange={setDate}
                        renderDay={this.renderWrappedWeekDay}
                    />
                </div>
                <div className={classes.content}>
                    {dates.map((date, i) =>
                        <AppointmentDay
                            key={i}
                            date={date.DATE}
                            onEdit={this.props.isAdmin ? this.handleOnEdit : undefined}
                            onDelete={this.props.isAdmin ? this.handleOnDelete : undefined}
                            appointments={date.dates} />
                    )}
                </div>
                <AddDialog innerRef={this.handleInnerRefAddDialog} />
            </Paper>
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
    setDate: (date) => dispatch(setDate(date)),
    getDates: () => dispatch(getDates()),
    deleteDate: (date) => dispatch(deleteDate(date)),
});

export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styles)(Dates)); 