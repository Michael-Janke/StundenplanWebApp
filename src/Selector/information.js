import { createSelector } from 'reselect';
import makeGetCurrentTimetable from './timetable';
import moment from 'moment';

function getInformation(timetable, period, date) {
    if (!timetable || !period) {
        return {};
    }
    let periods = timetable[moment(date).weekday()];
    let day = periods.periods[period.PERIOD_TIME_ID - 1];
    const studentsInSchool = day.lessons.reduce((prev, current) => {
        return prev + ((current && !current.isOld) ? ((current.reference && current.reference.STUDENT_COUNT) || 0) : 0);
    }, 0)
    const teachersInSchool = day.lessons.reduce((prev, current) => {
        return prev + ((current && !current.isOld) ? ((current.teachers && current.teachers.new.length) || 0) : 0);
    }, 0);
    
    return {
        lessons: day.lessons,
        absentClasses: periods.absences.filter(absence => absence.class),
        teachersInSchool,
        studentsInSchool,
    }
}

export function makeGetInformation() {

    const getTimetable = makeGetCurrentTimetable();
    const getCurrentTimetable = (state, props) => getTimetable(state, { id: -1, type: 'all', date: props.date });
    const getPeriod = (state, props) => state.period.currentPeriod;
    const getDate = (state, props) => props.date;

    return createSelector(
        getCurrentTimetable,
        getPeriod,
        getDate,
        getInformation
    );
}