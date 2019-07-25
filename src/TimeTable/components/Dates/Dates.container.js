import Dates from './Dates.component';
import { connect } from 'react-redux';
import { layoutedDatesSelector } from './Dates.selector';

const mapStateToProps = (state, props) => ({
    dates: layoutedDatesSelector(state),
    date: state.timetable.timetableDate,
});

const ConnectedDates = connect(mapStateToProps)(Dates);
export default ConnectedDates;
