import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TimeTableGrid from './grid';
import TimeTableHeader from './header';
import makeGetCurrentTimetable from '../../Selector/timetable';
import { connect } from 'react-redux';
import moment from 'moment';

const defaultMapStateToProps = (state, props) => ({
    id: state.timetable.currentTimeTableId,
    type: state.timetable.currentTimeTableType,
    date: state.timetable.timetableDate,
    ...props,
});

const getCurrentTimetable = makeGetCurrentTimetable();
{
    const mapStateToProps = (state, props) => ({
        currentTimetable: getCurrentTimetable(state, props),
        periods: state.timetable.masterdata.Period_Time,
        warning: state.user.warning,
        counterChanged: state.user.counterChanged,
        offline: !state.online.timetable || !state.online.adal,
        me:
            state.timetable.currentTimeTableType === state.user.type &&
            state.timetable.currentTimeTableId === state.user.id,
        ...defaultMapStateToProps(state, props),
    });
    var ConnectedTimeTableGrid = connect(mapStateToProps)(TimeTableGrid);
}
{
    const mapStateToProps = (state, props) => ({
        lastCheck: !state.online.counter && moment(state.user.lastCheck).fromNow(),
        offline: !state.online.counter,
        ...defaultMapStateToProps(state, props),
    });
    var ConnectedTimeTableHeader = connect(mapStateToProps)(TimeTableHeader);
}

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
};

const TimeTableContainer = ({ classes, ...other }) => (
    <div className={classes.root}>
        <ConnectedTimeTableHeader {...other} />
        <ConnectedTimeTableGrid {...other} />
    </div>
);

export default withStyles(styles)(TimeTableContainer);
