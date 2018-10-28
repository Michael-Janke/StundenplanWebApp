import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TimeTableGrid from './grid';
import TimeTableHeader from './header';
import makeGetCurrentTimetable from '../../Selector/timetable';
import { connect } from 'react-redux';

const defaultMapStateToProps = (state, props) => ({
    small: state.browser.lessThan.medium,
    id: state.timetable.currentTimeTableId,
    type: state.timetable.currentTimeTableType,
    date: state.timetable.timetableDate,
    ...props,
})

const getCurrentTimetable = makeGetCurrentTimetable();
{
    const mapStateToProps = (state, props) => ({
        currentTimetable: getCurrentTimetable(state, props),
        periods: state.timetable.masterdata.Period_Time,
        warning: state.user.warning,
        lastCheck: state.user.lastCheck,
        counterChanged: state.user.counterChanged,
        ...(defaultMapStateToProps(state, props))
    });
    var ConnectedTimeTableGrid = connect(mapStateToProps)(TimeTableGrid);
}
{
    const mapStateToProps = (state, props) => ({
        ...(defaultMapStateToProps(state, props))
    });
    var ConnectedTimeTableHeader = connect(mapStateToProps)(TimeTableHeader);
}


const styles = ({
    root: {
        width: '100%',
        height: '100%',
    }
});

const TimeTableContainer = ({ classes, ...other }) => (
    <div className={classes.root}>
        <ConnectedTimeTableHeader {...other}/>
        <ConnectedTimeTableGrid {...other}/>
    </div>
);

export default withStyles(styles)(TimeTableContainer);