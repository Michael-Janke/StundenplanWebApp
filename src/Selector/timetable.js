import { createSelector } from 'reselect'
import { getSpecificSubstitutionType, WEEKDAY_NAMES, getSubstitutionsCacheKey, getTimetableCacheKey } from '../Common/const';
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




function translateTimetable(masterdata, timetable, substitutions, periods, type, id, date) {
    if (!timetable || !masterdata || !substitutions) return null;
    periods = Object.values(periods);
    let data = [];
    for (let x = 0; x < WEEKDAY_NAMES.length; x++) {
        let day = readTimetable(timetable, x, periods, date);
        if (substitutions) {
            joinSubstitutions(day, substitutions.substitutions[x], type, id);
        }
        skipDuplications(day, periods);
        translatePeriods(masterdata, day, periods, id, type);
        data[x] = day;
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
            if (lessons) {
                for (let i = 0; i < lessons.length; i++) {
                    let lesson = lessons[i];
                    if (lesson.TIMETABLE_ID === substitution.TIMETABLE_ID) {
                        let remove = !!['ROOM', 'TEACHER'].find((key) =>
                            type === key.toLowerCase()
                            && substitution[key + "_ID"] === lesson[key + "_ID"]
                            && substitution[key + "_ID_NEW"]
                            && lesson[key + "_ID"] !== substitution[key + "_ID_NEW"]
                        );
                        lessons[i] = {
                            substitutionRemove: remove,
                            substitutionType: substitution.TYPE,
                            substitutionText: substitution.TEXT,
                            specificSubstitutionType: getSpecificSubstitutionType(substitution),
                            CLASS_IDS: substitution.CLASS_IDS_NEW.length ? substitution.CLASS_IDS_NEW : substitution.CLASS_IDS,
                            CLASS_IDS_OLD: substitution.CLASS_IDS_NEW.length ? substitution.CLASS_IDS : [],
                            CLASS_IDS_ABSENT: substitution.CLASS_IDS_ABSENT,
                            TEACHER_ID: substitution.TEACHER_ID_NEW || lesson.TEACHER_ID,
                            TEACHER_ID_OLD: substitution.TEACHER_ID_NEW && substitution.TEACHER_ID_NEW !== lesson.TEACHER_ID && lesson.TEACHER_ID,
                            SUBJECT_ID: substitution.SUBJECT_ID_NEW || lesson.SUBJECT_ID,
                            SUBJECT_ID_OLD: substitution.SUBJECT_ID_NEW && substitution.SUBJECT_ID_NEW !== lesson.SUBJECT_ID && lesson.SUBJECT_ID,
                            ROOM_ID: substitution.ROOM_ID_NEW || lesson.ROOM_ID,
                            ROOM_ID_OLD: substitution.ROOM_ID_NEW && substitution.ROOM_ID_NEW !== lesson.ROOM_ID && lesson.ROOM_ID

                        };
                        return;
                    }
                }
            }
            if (!lessons) {
                period.lessons = lessons = [];
            }
            lessons.push({
                substitutionText: substitution.TEXT,
                substitutionRemove:
                    (type === 'teacher' && !!substitution.TEACHER_ID)
                    || (type === 'room' && !!substitution.ROOM_ID),
                substitutionType: substitution.TYPE,
                CLASS_IDS: substitution.CLASS_IDS_NEW.length ? substitution.CLASS_IDS_NEW : substitution.CLASS_IDS,
                CLASS_IDS_OLD: substitution.CLASS_IDS_NEW.length ? substitution.CLASS_IDS : [],
                CLASS_IDS_ABSENT: substitution.CLASS_IDS_ABSENT,
                TEACHER_ID: substitution.TEACHER_ID_NEW || substitution.TEACHER_ID,
                TEACHER_ID_OLD: substitution.TEACHER_ID_NEW && substitution.TEACHER_ID_NEW !== substitution.TEACHER_ID && substitution.TEACHER_ID,
                SUBJECT_ID: substitution.SUBJECT_ID_NEW || substitution.SUBJECT_ID,
                SUBJECT_ID_OLD: substitution.SUBJECT_ID_NEW && substitution.SUBJECT_ID_NEW !== substitution.SUBJECT_ID && substitution.SUBJECT_ID,
                ROOM_ID: substitution.ROOM_ID_NEW || substitution.ROOM_ID,
                ROOM_ID_OLD: substitution.ROOM_ID_NEW && substitution.ROOM_ID_NEW !== substitution.ROOM_ID && substitution.ROOM_ID,
                specificSubstitutionType: getSpecificSubstitutionType(substitution),
            });
        });
    }
    if (subOnDay.absences) {
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
    if (p1.TEACHER_ID !== p2.TEACHER_ID
        || p1.SUBJECT_ID !== p2.SUBJECT_ID
        || p1.ROOM_ID !== p2.ROOM_ID)
        return false;
    let classIds1 = p1.CLASS_IDS || [];
    let classIds2 = p2.CLASS_IDS || [];

    if (!(classIds1.length === classIds2.length && classIds1.every((v, i) => classIds2.indexOf(v) >= 0)))
        return false;
    if (p1.substitutionType !== p2.substitutionType) {
        return false;
    }
    return true;
}

function skipDuplications(day, periods) {
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
        last.TEACHER_IDS = [last.TEACHER_ID];
        last.TEACHER_IDS_OLD = [];
        if (last.TEACHER_ID_OLD) {
            last.TEACHER_IDS_OLD.push(last.TEACHER_ID_OLD);
        }
        delete last.TEACHER_ID;
        delete last.TEACHER_ID_OLD;
        for (let j = i + 1; j < lessons.length; j++) {
            let lesson = lessons[j];
            if (lesson.ROOM_ID === last.ROOM_ID
                && lesson.SUBJECT_ID === last.SUBJECT_ID
                && lesson.absence === last.absence
                && equalArrays(lesson.CLASS_IDS, last.CLASS_IDS)
                // && lesson.substitutionType === last.substitutionType
            ) {
                if (!last.TEACHER_IDS.includes(lesson.TEACHER_ID)) {
                    last.TEACHER_IDS.push(lesson.TEACHER_ID);
                }
                if (lesson.TEACHER_ID_OLD && !last.TEACHER_IDS_OLD.includes(lesson.TEACHER_ID_OLD)) {
                    last.TEACHER_IDS_OLD.push(lesson.TEACHER_ID_OLD);
                }
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
    let timetableDate = moment(date).weekday(0).add(day, 'day');
    for (let y = 0; y < periods.length; y++) {
        let lessons = (_data[day] || [])[y + 1] || [];
        if (lessons) {
            lessons = lessons.filter((lesson) =>
                lesson.DATE_FROM
                && lesson.DATE_TO
                && moment(lesson.DATE_FROM.date).isBefore(timetableDate)
                && moment(lesson.DATE_TO.date).isAfter(timetableDate)
            );
        }
        data[y] = { lessons };
    }
    return { periods: data };
}

function translatePeriods(masterdata, day, periods, id, type) {
    if (day.holiday) {
        return day;
    }
    for (let y = 0; y < periods.length; y++) {
        if (day.periods[y] && day.periods[y].lessons) {
            translate(masterdata, day.periods[y], id, type);
        }
    }
}

function equalArrays(array1, array2) {
    if (array1 === array2) {
        return true;
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

    if (
        ((!!period1.TIMETABLE_ID) ? (period1.TIMETABLE_ID === period2.TIMETABLE_ID && period1.absence === period2.absence) : false)
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

function getIrrelevanceLevel(size, lesson, type, id) {
    let irrelevanceLevel = 0;
    if (lesson.substitutionRemove) {
        if (type === 'teacher' && lesson.SUBJECT_ID !== lesson.SUBJECT_ID_OLD && lesson.SUBJECT_ID_OLD) {
            irrelevanceLevel += 2;
        }
        if (type === 'room' && lesson.ROOM_ID_OLD === id) {
            irrelevanceLevel += 4;
        }
        if (type === 'teacher' && lesson.TEACHER_IDS.indexOf(id) === -1) {
            irrelevanceLevel += 3;
        }
    }
    if (lesson.substitutionType === 'REDUNDANCY' || lesson.substitutionType === 'ELIMINATION') {
        irrelevanceLevel += type === 'room' ? 2 : (size > 1 ? 5 : 3);
    }
    if (lesson.substitutionType === 'ASSIGNMENT' && type === 'room') {
        irrelevanceLevel += 5;
    }
    return irrelevanceLevel;
}

function translate(masterdata, period, id, type) {
    if (!period) return period;
    period.lessons = period.lessons.map((lesson) => ({
        reference: lesson,
        irrelevanceLevel: getIrrelevanceLevel(period.lessons.length, lesson, type, id),
        absenceOnly: lesson.absenceOnly,
        substitutionText: lesson.substitutionText,
        substitutionType: lesson.substitutionType,
        specificSubstitutionType: lesson.specificSubstitutionType,
        substitutionRemove: lesson.substitutionRemove,
        absence: lesson.absence,
        teachers: {
            new: lesson.TEACHER_IDS.map((t) => masterdata.Teacher[t]),
            old: !!lesson.TEACHER_IDS_OLD.length && lesson.TEACHER_IDS_OLD.map((t) => masterdata.Teacher[t])
        },
        subject: {
            new: masterdata.Subject[lesson.SUBJECT_ID],
            old: masterdata.Subject[lesson.SUBJECT_ID_OLD]
        },
        room: {
            new: masterdata.Room[lesson.ROOM_ID],
            old: masterdata.Room[lesson.ROOM_ID_OLD]
        },
        classes: {
            new: (lesson.CLASS_IDS || []).map((c) => masterdata.Class[c]),
            old: !!(lesson.CLASS_IDS_OLD || []).length && lesson.CLASS_IDS_OLD.map((c) => masterdata.Class[c]),
            absent: !!(lesson.CLASS_IDS_ABSENT || []).length && lesson.CLASS_IDS_ABSENT.map((c) => masterdata.Class[c])
        }
    }));
    return period;
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
