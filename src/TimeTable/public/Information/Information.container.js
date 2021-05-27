import InformationComponent from './Information.component';
import { connect } from 'react-redux';
import moment from 'moment';
import { getTimetable } from '../../../Main/actions';
import { loadSupervisions } from '../../actions';
import { makeGetInformation } from '../../../Selector/information';

const date = moment();
if (date.isoWeekday() > 5) {
    date.add(8 - date.isoWeekday(), 'days');
}
const mapStateToProps = () => {
    const getInformation = makeGetInformation();
    return (state) => ({
        substitutions: getInformation(state, { date }),
        currentPeriod: state.period.currentPeriod,
        date: date,
        supervisions:
            state.substitutions.sortBy &&
            state.substitutions.sortBy.type.singular === 'teacher' &&
            state.tv.supervisions,
        counter: state.user.counter,
    });
};
const mapDispatchToProps = (dispatch) => ({
    getAllTimetable: (date) => dispatch(getTimetable(-1, 'all', date)),
    loadSupervisions: () => dispatch(loadSupervisions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(InformationComponent);
