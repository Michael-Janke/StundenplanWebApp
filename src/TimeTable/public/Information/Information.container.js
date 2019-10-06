import InformationComponent from './Information.component';
import { connect } from 'react-redux';
import moment from 'moment';
import { getTimetable } from '../../../Main/actions';
import { makeGetInformation } from '../../../Selector/information';

const date = moment();
if (date.isoWeekday() > 5) {
    date.add(8 - date.isoWeekday(), 'days');
}
const mapStateToProps = () => {
    const getInformation = makeGetInformation();
    return state => ({
        ...getInformation(state, { date }),
        period: state.period.currentPeriod,
        date: date,
    });
};
const mapDispatchToProps = dispatch => ({
    getAllTimetable: date => dispatch(getTimetable(-1, 'all', date)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InformationComponent);
