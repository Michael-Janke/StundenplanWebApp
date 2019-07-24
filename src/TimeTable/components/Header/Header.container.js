import Header from './Header.component';
import { connect } from 'react-redux';
import moment from 'moment';

import { changeWeek } from '../../../Main/actions';

const mapStateToProps = (state, props) => ({
    lastCheck: !state.online.counter && moment(state.user.lastCheck).fromNow(),
    offline: !state.online.counter,
    id: state.timetable.currentTimeTableId,
    type: state.timetable.currentTimeTableType,
    date: state.timetable.timetableDate,
    isMin: state.timetable.dateIsMin,
    isMax: state.timetable.dateIsMax,
    ...props,
});

const mapDispatchToProps = dispatch => ({
    setNextWeek: () => dispatch(changeWeek(1)),
    setThisWeek: () => dispatch(changeWeek('now')),
    setPreviousWeek: () => dispatch(changeWeek(-1)),
});

const ConnectedTimeTableHeader = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
export default ConnectedTimeTableHeader;
