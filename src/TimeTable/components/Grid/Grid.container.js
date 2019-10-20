import Grid from './Grid.component';
import makeGetCurrentTimetable from '../../../Selector/timetable';
import { connect } from 'react-redux';

const getCurrentTimetable = makeGetCurrentTimetable();

const mapStateToProps = (state, props) => ({
    id: state.timetable.currentTimeTableId,
    type: state.timetable.currentTimeTableType,
    date: state.timetable.timetableDate,
    currentTimetable: getCurrentTimetable(state, props),
    periods: state.timetable.masterdata.Period_Time,
    warning: state.user.warning,
    counterChanged: state.user.counterChanged,
    offline: !state.online.timetable,
    me:
        state.timetable.currentTimeTableType === state.user.type &&
        state.timetable.currentTimeTableId === state.user.id,
    currentPeriod: state.period.currentPeriod,
});

const ConnectedTimeTableGrid = connect(mapStateToProps)(Grid);
export default ConnectedTimeTableGrid;
