import { createSelector } from 'reselect'
import { WEEKDAY_NAMES, getSubstitutionsCacheKey, getTimetableCacheKey, specifySubstitutionType } from '../Common/const';
import moment from 'moment';

const getTimetableState = (state) => state.timetable;
const getMasterdata = createSelector(getTimetableState, (state) => state.masterdata);
const getTimetables = createSelector(getTimetableState, (state) => state.timetables);
const getSubstitutions = createSelector(getTimetableState, (state) => state.substitutions);

const getDate = createSelector(getTimetableState, (state) => state.timetableDate);
const getWeekSelector = createSelector(getDate, (date) => moment(date).week());
const getYearSelector = createSelector(getDate, (date) => moment(date).year());

const getType = createSelector(getTimetableState, (state) => state.currentTimeTableType);
const getId = createSelector(getTimetableState, (state) => state.currentTimeTableId);
const getPeriods = createSelector(getTimetableState, (state) => state.masterdata.Period_Time);

const getCurrentTimetableSelector = createSelector(
    getTimetables,
    getType,
    getId,
    (timetables, type, id) => timetables[getTimetableCacheKey({ type, id })]
);
const getCurrentSubstitutionsSelector = createSelector(
    getSubstitutions,
    getType,
    getId,
    getWeekSelector,
    getYearSelector,
    (substitutions, type, id, week, year) => substitutions[getSubstitutionsCacheKey({ type, id, week, year })]
);

function freeRooms(masterdata, day, periods) {
    if (day.holiday) {
        return;
    }
    for (let y = 0; y < periods.length; y++) {
        const period = day.periods[y];
        if (!period) {
            continue;
        }
        const lessons = period.lessons.map(lesson => lesson.room);
        delete period.lessons;
        const rooms = Object.values(masterdata.Room);
        period.freeRooms = lessons.reduce((prev, current) => {
            if (current.new) {
                const index = prev.findIndex(room => room.ROOM_ID === current.new.ROOM_ID);
                if (index !== -1) {
                    prev.splice(index, 1);
                }
            }
            return prev;
        }, rooms);
    }
}

export function translateDay(masterdata, timetable, x, substitutions, periods, type, id, date) {
    let day = readTimetable(timetable, x, periods, date);
    if (substitutions) {
        joinSubstitutions(day, substitutions.substitutions[x], type, id);
    }
    if (type !== 'all') {
        skipDuplications(day, periods);
    }
    translatePeriods(masterdata, day, periods, id, type);
    if (type === 'all') {
        freeRooms(masterdata, day, periods);
    }
    return day;
}

function translateTimetable(masterdata, timetable, substitutions, periods, type, id, date) {
    if (!timetable || !masterdata || !substitutions) return null;
    periods = Object.values(periods);
    let data = [];
    for (let x = 0; x < WEEKDAY_NAMES.length; x++) {
        data[x] = translateDay(masterdata, timetable, x, substitutions, periods, type, id, date);
    }
    return data;
}

function joinSubstitutions(day, subOnDay, type, id) {
    if (!subOnDay) return;
    if (subOnDay.holiday) {
        day.holiday = subOnDay.holiday;
        day.periods = undefined;
    } else if (subOnDay.substitutions && day.periods) {
        subOnDay.substitutions.forEach((substitution) => {
            let period = day.periods[substitution.PERIOD - 1];
            if (!period) return;
            let lessons = period.lessons;
            const lesson = specifySubstitutionType(id, type, substitution);
            if (!lessons) {
                period.lessons = lessons = [];
            }
            const index = lessons.findIndex((lesson) => lesson.TIMETABLE_ID === substitution.TIMETABLE_ID);
            if (index !== -1) {
                lessons[index] = lesson;
                period.lessons = lessons.filter(c => c);

            } else if (lesson) {
                lessons.push(lesson);
            }
        });
    }
    if (subOnDay.absences) {
        if (!day.periods) {
            day.periods = [];
        }
        subOnDay.absences.forEach((absence) => {
            for (let i = absence.PERIOD_FROM; i <= absence.PERIOD_TO; i++) {
                let period = day.periods[i - 1];
                if (!period) continue;
                let lessons = period.lessons;
                if (lessons && lessons.length) {
                    period.lessons = lessons.map((lesson) => ({ ...lesson, absence: absence }));
                } else {
                    period.lessons = [{ absence, absenceOnly: true }];
                }
            }
        });
    }

}
function comparePeriod(current, next) {
    if (!next || !current) return false;
    if (current.length !== next.length) return false;
    if (current.length === 0) return false;
    next = [...next];
    for (let i = 0; i < current.length; i++) {
        for (let j = 0; j < next.length; j++) {
            if (compareLesson(current[i], next[j])) {
                next.splice(j);
                break;
            }
        }
    }
    return next.length === 0;
}
function compareLesson(p1, p2) {
    if (!equalArrays(p1.TEACHER_IDS, p2.TEACHER_IDS)
        || p1.SUBJECT_ID !== p2.SUBJECT_ID
        || p1.ROOM_ID !== p2.ROOM_ID)
        return false;
    if (!equalArrays(p1.TEACHER_IDS_OLD, p2.TEACHER_IDS_OLD)
        || p1.SUBJECT_ID_OLD !== p2.SUBJECT_ID_OLD
        || p1.ROOM_ID_OLD !== p2.ROOM_ID_OLD) {
        return false;
    }
    let classIds1 = p1.CLASS_IDS || [];
    let classIds2 = p2.CLASS_IDS || [];

    if (!(classIds1.length === classIds2.length && classIds1.every((v, i) => classIds2.indexOf(v) >= 0)))
        return false;
    if (p1.substitutionType !== p2.substitutionType) {
        return false;
    }
    return true;
}

export function skipDuplications(day, periods) {
    if (!day || !day.periods || day.holiday) {
        return;
    }
    for (let y = 0; y < periods.length; y++) {
        let current = day.periods[y];
        current.skip = 0;
        while (y + 1 < periods.length
            && comparePeriod(current.lessons, day.periods[y + 1].lessons)) {
            y++;
            delete day.periods[y];
            current.skip++;
        }
        if (current.lessons) {
            skipTeacherDuplications(current.lessons);
        }
    }
}

function skipTeacherDuplications(lessons) {
    for (let i = 0; i < lessons.length; i++) {
        let last = lessons[i] = { ...lessons[i] };
        for (let j = i + 1; j < lessons.length; j++) {
            let lesson = lessons[j];
            if (lesson.ROOM_ID === last.ROOM_ID
                && lesson.SUBJECT_ID === last.SUBJECT_ID
                && lesson.ROOM_ID_OLD === last.ROOM_ID_OLD
                && lesson.SUBJECT_ID_OLD === last.SUBJECT_ID_OLD
                && lesson.absence === last.absence
                // && equalArrays(lesson.CLASS_IDS, last.CLASS_IDS)
                // && lesson.substitutionType === last.substitutionType
            ) {
                if (lesson.TEACHER_IDS)
                    last.TEACHER_IDS ? lesson.TEACHER_IDS.forEach(item =>
                        last.TEACHER_IDS.includes(item) ? null : last.TEACHER_IDS.push(item))
                        : last.TEACHER_IDS = lesson.TEACHER_IDS;
                if (lesson.TEACHER_IDS_OLD)
                    last.TEACHER_IDS_OLD ? lesson.TEACHER_IDS_OLD.forEach(item =>
                        last.TEACHER_IDS_OLD.includes(item) ? null : last.TEACHER_IDS_OLD.push(item))
                        : last.TEACHER_IDS_OLD = lesson.TEACHER_IDS_OLD;
                if (lesson.TEACHER_IDS_SUBSTITUTING)
                    last.TEACHER_IDS_SUBSTITUTING ? lesson.TEACHER_IDS_SUBSTITUTING.forEach(item =>
                        last.TEACHER_IDS_SUBSTITUTING.includes(item) ? null : last.TEACHER_IDS_SUBSTITUTING.push(item))
                        : last.TEACHER_IDS_SUBSTITUTING = lesson.TEACHER_IDS_SUBSTITUTING;

                combineSubstitutions(last, lesson);
                lessons.splice(j, 1);
            }
        }
    }
}

function combineSubstitutions(receiver, lesson) {
    if (!lesson.specificSubstitutionType) {
        return;
    }
    let receiverPriority = (receiver.specificSubstitutionType || {}).priority || -1;
    let priority = lesson.specificSubstitutionType.priority || 0;
    if (priority > receiverPriority) {
        receiver.specificSubstitutionType = lesson.specificSubstitutionType;
    }
}

function readTimetable(_data, day, periods, date) {
    if (!_data) return {};
    let data = [];
    let timetableDate = moment(date).weekday(0).startOf('day').add(day, 'day');
    for (let y = 0; y < periods.length; y++) {
        let lessons = (_data[day] || [])[y + 1] || [];
        if (lessons) {
            lessons = lessons.map((lesson) => ({
                ...lesson,
                TEACHER_IDS: lesson.TEACHER_ID ? [lesson.TEACHER_ID] : [],
                TEACHER_ID: undefined,
            })).filter((lesson) =>
                lesson.DATE_FROM
                && lesson.DATE_TO
                && moment(lesson.DATE_FROM.date).isSameOrBefore(timetableDate)
                && moment(lesson.DATE_TO.date).isSameOrAfter(timetableDate)
            );
        }
        data[y] = { lessons };
    }
    return { periods: data };
}

export function translatePeriods(masterdata, day, periods) {
    if (day.holiday) {
        return day;
    }
    for (let y = 0; y < periods.length; y++) {
        if (day.periods[y] && day.periods[y].lessons) {
            translate(masterdata, day.periods[y]);
        }
    }
}

function equalArrays(array1, array2) {
    if (array1 === array2) {
        return true;
    }
    if (!array1 || !array2) {
        return false;
    }
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0; i < array1.length; i++) {
        let o1 = array1[i];
        let o2 = array2[i];
        if (o1 !== o2) {
            return false;
        }
    }
    return true;
}

export function equalPeriods(period1, period2) {

    if (((!!period1.TIMETABLE_ID)
        ? (period1.TIMETABLE_ID === period2.TIMETABLE_ID && period1.absence === period2.absence) : false)
        || (period1.absence === period2.absence
            && period1.absenceOnly === period2.absenceOnly
            && period1.substitutionText === period2.substitutionText
            && period1.substitutionRemove === period2.substitutionRemove
            && period1.specificSubstitutionType === period2.specificSubstitutionType
            && period1.SUBJECT_ID === period2.SUBJECT_ID
            && period1.SUBJECT_ID_OLD === period2.SUBJECT_ID_OLD
            && period1.ROOM_ID === period2.ROOM_ID
            && period1.ROOM_ID_OLD === period2.ROOM_ID_OLD
            && equalArrays(period1.TEACHER_IDS, period2.TEACHER_IDS)
            && equalArrays(period1.TEACHER_IDS_OLD, period2.TEACHER_IDS_OLD)
            && equalArrays(period1.CLASS_IDS, period2.CLASS_IDS)
            && equalArrays(period1.CLASS_IDS_OLD, period2.CLASS_IDS_OLD))) {
        return true;
    }
    return false;
}
function translate(masterdata, period) {
    if (!period) return null;
    period.lessons = period.lessons.map(translateLesson.bind(null, masterdata));
}

export function translateLesson(masterdata, lesson) {
    return {
        reference: lesson,
        absenceOnly: lesson.absenceOnly,
        isOld: lesson.isOld,
        substitutionInfo: lesson.substitutionInfo,
        substitutionText: lesson.substitutionText,
        substitutionType: lesson.substitutionType,
        specificSubstitutionType: lesson.specificSubstitutionType,
        substitutionRemove: lesson.substitutionRemove,
        absence: lesson.absence,
        teachers: {
            new: lesson.TEACHER_IDS && lesson.TEACHER_IDS.map((t) => masterdata.Teacher[t]),
            old: lesson.TEACHER_IDS_OLD && lesson.TEACHER_IDS_OLD.map((t) => masterdata.Teacher[t]),
            substitution: lesson.TEACHER_IDS_SUBSTITUTING && lesson.TEACHER_IDS_SUBSTITUTING.map((t) => masterdata.Teacher[t]),
        },
        subject: {
            new: lesson.SUBJECT_ID && masterdata.Subject[lesson.SUBJECT_ID],
            old: lesson.SUBJECT_ID_OLD && masterdata.Subject[lesson.SUBJECT_ID_OLD],
            substitution: lesson.SUBJECT_ID_SUBSTITUTING && masterdata.Subject[lesson.SUBJECT_ID_SUBSTITUTING],
        },
        room: {
            new: lesson.ROOM_ID && masterdata.Room[lesson.ROOM_ID],
            old: lesson.ROOM_ID_OLD && masterdata.Room[lesson.ROOM_ID_OLD],
            substitution: lesson.ROOM_ID_SUBSTITUTING && masterdata.Room[lesson.ROOM_ID_SUBSTITUTING],
        },
        classes: {
            new: lesson.CLASS_IDS && lesson.CLASS_IDS.map((c) => masterdata.Class[c]),
            old: lesson.CLASS_IDS_OLD && lesson.CLASS_IDS_OLD.map((c) => masterdata.Class[c]),
            substitution: lesson.CLASS_IDS_SUBSTITUTING && lesson.CLASS_IDS_SUBSTITUTING.map((c) => masterdata.Class[c]),
        }
    }
}

const makeGetCurrentTimetable = () => {
    return createSelector(
        getMasterdata,
        getCurrentTimetableSelector,
        getCurrentSubstitutionsSelector,
        getPeriods,
        getType,
        getId,
        getDate,
        translateTimetable
    );
};

export default makeGetCurrentTimetable;
