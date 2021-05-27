import { createSelector } from 'reselect';
import makeGetCurrentTimetable from './timetable';
import moment from 'moment';

function getInformation(timetable, periods, date) {
    if (!timetable || !periods) {
        return {};
    }
    const weekday = moment(date).isoWeekday();
    const weekdayData = timetable[weekday - 1];

    return Object.keys(periods).reduce((acc, periodNumber) => {
        let studentsInSchool, teachersInSchool, period;
        if (weekdayData.periods) {
            period = weekdayData.periods[periodNumber - 1];
            studentsInSchool = period.lessons.reduce((prev, current) => {
                return (
                    prev + (current && !current.isOld ? (current.reference && current.reference.STUDENT_COUNT) || 0 : 0)
                );
            }, 0);
            teachersInSchool = period.lessons.reduce((prev, current) => {
                return prev + (current && !current.isOld ? (current.teachers && current.teachers.new.length) || 0 : 0);
            }, 0);
        }

        acc[periodNumber - 1] = {
            lessons: period && period.lessons,
            absentClasses: (weekdayData.absences || []).filter((absence) => absence.class),
            teachersInSchool,
            studentsInSchool,
        };
        return acc;
    }, {});
}

export function makeGetInformation() {
    const getTimetable = makeGetCurrentTimetable();
    const getCurrentTimetable = (state, props) => getTimetable(state, { id: -1, type: 'all', date: props.date });
    const getPeriods = (state) => state.timetable.masterdata.Period_Time;
    const getDate = (state, props) => props.date;

    return createSelector(getCurrentTimetable, getPeriods, getDate, getInformation);
}
