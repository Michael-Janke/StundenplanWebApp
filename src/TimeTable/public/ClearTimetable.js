import { useEffect } from 'react';
import { connect } from 'react-redux';

function ClearTimetable({ id, clearTimetable }) {
    useEffect(() => {
        let timeout = setTimeout(clearTimetable, 30 * 1000);
        return () => clearTimeout(timeout);
    }, [clearTimetable, id]);
    return null;
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearTimetable: () => dispatch({ type: 'SET_TIMETABLE', payload: { type: null, id: 0 } }),
    };
};

const mapStateToProps = (state) => {
    return {
        id: state.timetable.currentTimeTableId + state.timetable.currentTimeTableType + state.timetable.timetableDate,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClearTimetable);
