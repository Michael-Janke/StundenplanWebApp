import { connect } from 'react-redux';
import Dates from './Dates.component';
import { getDates, deleteDate, editDate, addDate } from './actions';

const mapStateToProps = state => {
    return {
        timetableDate: state.timetable.timetableDate,
        dates: state.dates.dates,
        isAdmin: state.user.scope === 'admin',
    };
};

const mapDispatchToProps = dispatch => ({
    getDates: () => dispatch(getDates()),
    deleteDate: date => dispatch(deleteDate(date)),
    addDate: date => dispatch(addDate(date)),
    editDate: date => dispatch(editDate(date)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dates);
