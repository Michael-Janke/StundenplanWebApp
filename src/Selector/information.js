import { createSelector } from 'reselect';
import makeGetCurrentTimetable from './timetable';
import moment from 'moment';

function getInformation(timetable, currentPeriod, date) {
    if (!timetable || !currentPeriod) {
        return {};
    }
    const weekday = moment(date).isoWeekday();
    const weekdayData = timetable[weekday - 1];
    let studentsInSchool, teachersInSchool, period;
    if (weekdayData.periods) {
        period = weekdayData.periods[currentPeriod.PERIOD_TIME_ID - 1];
        studentsInSchool = period.lessons.reduce((prev, current) => {
            return prev + (current && !current.isOld ? (current.reference && current.reference.STUDENT_COUNT) || 0 : 0);
        }, 0);
        teachersInSchool = period.lessons.reduce((prev, current) => {
            return prev + (current && !current.isOld ? (current.teachers && current.teachers.new.length) || 0 : 0);
        }, 0);
    }

    return {
        lessons: period && period.lessons,
        absentClasses: (weekdayData.absences || []).filter(absence => absence.class),
        teachersInSchool,
        studentsInSchool,
    };
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
