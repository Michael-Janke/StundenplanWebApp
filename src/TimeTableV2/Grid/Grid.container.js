import GridComponent from './Grid.component';
import { connect } from 'react-redux';
import makeGetCurrentTimetable from '../../Selector/timetable';

const mapStateToProps = () => {
    const getCurrentTimetable = makeGetCurrentTimetable();

    return (state, props) => ({
        timetable: getCurrentTimetable(state, props),
        periods: state.timetable.masterdata.Period_Time,
        type: state.timetable.currentTimeTableType,
    })
}


export default connect(mapStateToProps, undefined)(GridComponent);