import InformationComponent from './Information.component';
import makeGetCurrentTimetable from '../../../Selector/timetable';
import { connect } from 'react-redux';
import moment from 'moment';
import { getTimetable } from '../../../Main/actions';



const date = moment();
const mapStateToProps = () => {
    const getCurrentTimetable = makeGetCurrentTimetable();
    return state => ({
        timetable: getCurrentTimetable(state, { id: -1, type: 'all', date }),
        period: state.period.currentPeriod,
        date: date,
    });
}
const mapDispatchToProps = (dispatch) => ({
    getAllTimetable: (date) => dispatch(getTimetable(-1, 'all', date)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InformationComponent);