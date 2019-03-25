import { createSelector } from 'reselect';
import {
    WEEKDAY_NAMES,
    getSubstitutionsCacheKey,
    getTimetableCacheKey,
    specifySubstitutionType,
} from '../Common/const';
import moment from 'moment';

const getTimetableState = state => state.timetable;
const getMasterdata = createSelector(
    getTimetableState,
    state => state.masterdata
);
const getTimetables = createSelector(
    getTimetableState,
    state => state.timetables
);
const getTeams = state => state.teams.joinedTeams;
const getAssignments = state => state.teams.assignments;
const getSubstitutions = createSelector(
    getTimetableState,
    state => state.substitutions
);

const getDate = createSelector(
    getTimetableState,
    state => state.timetableDate
);
const getWeekSelector = createSelector(
    getDate,
    date => moment(date).week()
);
const getYearSelector = createSelector(
    getDate,
    date => moment(date).weekYear()
);
const getAssignmentsSelector = createSelector(
    getDate,
    getAssignments,
    (date, assignments) => assignments.filter(assignment => moment(date).isSame(moment(assignment.dueDateTime), 'week'))
);

const getType = createSelector(
    getTimetableState,
    state => state.currentTimeTableType
);
const getId = createSelector(
    getTimetableState,
    state => state.currentTimeTableId
);
const getPeriods = createSelector(
    getTimetableState,
    state => state.masterdata.Period_Time
);

const getIgnore = (state, props) => props && props.noSubstitutions;

const getCurrentTimetableSelector = createSelector(
    getTimetables,
    getType,
    getId,
    (timetables, type, id) => timetables[getTimetableCacheKey({ type, id })]
);

const getCurrentSubstitutionsSelector = createSelector(
    getIgnore,
    getSubstitutions,
    getType,
    getId,
    getWeekSelector,
    getYearSelector,
    (ignore, substitutions, type, id, week, year) =>
        ignore ? { substitutions: [] } : substitutions[getSubstitutionsCacheKey({ type, id, week, year })]
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
        let rooms = Object.values(masterdata.Room);
        const absencesFiltered = day.absences
            ? day.absences.filter(
                  absence => absence.PERIOD_FROM - 1 <= y && absence.PERIOD_TO - 1 >= y && absence.ROOM_ID
              )
            : [];
        rooms = rooms.map(room => {
            return {
                ...room,
                status:
                    !lessons.find(current => (current.new || {}).ROOM_ID === room.ROOM_ID) &&
                    !absencesFiltered.find(absence => Number(absence.ROOM_ID) === room.ROOM_ID),
            };
        });
        period.freeRooms = rooms;
    }
    delete day.absences;
}

export function translateDay(masterdata, timetable, x, substitutions, periods, type, id, date, teams, assignments) {
    let day = readTimetable(timetable, x, periods, date);
    if (substitutions) {
        joinSubstitutions(day, substitutions.substitutions[x], type, id);
    }
    if (type !== 'all') {
        skipDuplications(day, periods);
    }
    let assignmentsOfDay = assignments.filter(assignment =>
        moment(assignment.dueDateTime).isSame(moment(date).weekday(x), 'day')
    );
    let assignmentsMatching = {
        toMatch: assignmentsOfDay,
        match: [],
    };
    translatePeriods(masterdata, day, periods, teams, assignmentsMatching);
    if (type === 'all') {
        freeRooms(masterdata, day, periods);
    }
    day.unmatchedAssignments = assignmentsMatching.toMatch;
    return day;
}

function translateTimetable(masterdata, timetable, substitutions, periods, type, id, date, teams, assignments) {
    if (!timetable || !masterdata || !substitutions) return null;
    periods = Object.values(periods);
    let data = [];
    for (let x = 0; x < WEEKDAY_NAMES.length; x++) {
        data[x] = translateDay(masterdata, timetable, x, substitutions, periods, type, id, date, teams, assignments);
    }
    return data;
}

function joinSubstitutions(day, subOnDay, type, id) {
    if (!subOnDay) return;
    if (subOnDay.holiday) {
        day.holiday = subOnDay.holiday;
        day.periods = undefined;
        return;
    }
    if (subOnDay.substitutions && day.periods) {
        subOnDay.substitutions.forEach(substitution => {
            let period = day.periods[substitution.PERIOD - 1];
            if (!period) return;
            let lessons = period.lessons;
            const lesson = specifySubstitutionType(id, type, substitution);
            if (!lessons) {
                period.lessons = lessons = [];
            }
            const index = lessons.findIndex(lesson => lesson.TIMETABLE_ID === substitution.TIMETABLE_ID);
            if (index !== -1) {
                lessons[index] = lesson ? { ...lesson, LESSON_ID: lessons[index].LESSON_ID } : null;
                period.lessons = lessons.filter(c => c);
            } else if (lesson) {
                lessons.push(lesson);
            }
        });
    }
    if (subOnDay.supervisions) {
        subOnDay.supervisions.forEach(supervision => {
            const period = day.periods[supervision.PERIOD - 1];
            period.supervision = supervision;
        });
    }
    if (subOnDay.absences) {
        if (type === 'room') {
            // sort in table
            subOnDay.absences.forEach(absence => {
                for (let i = absence.PERIOD_FROM - 1; i < absence.PERIOD_TO; i++) {
                    const period = day.periods[i];
                    period.lessons = [{ absence }];
                }
            });
        } else {
            // sort in header
            day.absences = subOnDay.absences;
        }
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
                combineSubstitutions(current[i], next[j]);
                next.splice(j);
                break;
            }
        }
    }
    return next.length === 0;
}
function compareLesson(p1, p2) {
    if (p1.isOld !== p2.isOld) return false;
    if (p1.isOld) {
        if (
            !equalArrays(p1.TEACHER_IDS_OLD, p2.TEACHER_IDS_OLD) ||
            p1.SUBJECT_ID_OLD !== p2.SUBJECT_ID_OLD ||
            p1.ROOM_ID_OLD !== p2.ROOM_ID_OLD ||
            !equalArrays(p1.CLASS_IDS_OLD, p2.CLASS_IDS_OLD)
        ) {
            return false;
        }
    } else {
        if (
            !equalArrays(p1.TEACHER_IDS, p2.TEACHER_IDS) ||
            p1.SUBJECT_ID !== p2.SUBJECT_ID ||
            p1.ROOM_ID !== p2.ROOM_ID ||
            !equalArrays(p1.CLASS_IDS, p2.CLASS_IDS)
        )
            return false;
    }
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
        while (y + 1 < periods.length && comparePeriod(current.lessons, day.periods[y + 1].lessons)) {
            y++;
            let period = day.periods[y];
            if (period.supervision) {
                period.continueation = true;
            } else {
                delete day.periods[y];
                current.skip++;
            }
        }
        if (current.lessons) {
            skipTeacherDuplications(current.lessons);
        }
    }
}

function skipTeacherDuplications(lessons) {
    for (let i = 0; i < lessons.length; i++) {
        let last = (lessons[i] = { ...lessons[i] });
        for (let j = i + 1; j < lessons.length; j++) {
            let lesson = lessons[j];
            if (
                lesson.ROOM_ID === last.ROOM_ID &&
                lesson.SUBJECT_ID === last.SUBJECT_ID &&
                lesson.ROOM_ID_OLD === last.ROOM_ID_OLD &&
                lesson.SUBJECT_ID_OLD === last.SUBJECT_ID_OLD
                // && equalArrays(lesson.CLASS_IDS, last.CLASS_IDS)
                // && lesson.substitutionType === last.substitutionType
            ) {
                if (lesson.TEACHER_IDS)
                    last.TEACHER_IDS
                        ? lesson.TEACHER_IDS.forEach(item =>
                              last.TEACHER_IDS.includes(item) ? null : last.TEACHER_IDS.push(item)
                          )
                        : (last.TEACHER_IDS = lesson.TEACHER_IDS);
                if (lesson.TEACHER_IDS_OLD)
                    last.TEACHER_IDS_OLD
                        ? lesson.TEACHER_IDS_OLD.forEach(item =>
                              last.TEACHER_IDS_OLD.includes(item) ? null : last.TEACHER_IDS_OLD.push(item)
                          )
                        : (last.TEACHER_IDS_OLD = lesson.TEACHER_IDS_OLD);
                if (lesson.TEACHER_IDS_SUBSTITUTING)
                    last.TEACHER_IDS_SUBSTITUTING
                        ? lesson.TEACHER_IDS_SUBSTITUTING.forEach(item =>
                              last.TEACHER_IDS_SUBSTITUTING.includes(item)
                                  ? null
                                  : last.TEACHER_IDS_SUBSTITUTING.push(item)
                          )
                        : (last.TEACHER_IDS_SUBSTITUTING = lesson.TEACHER_IDS_SUBSTITUTING);

                combineSubstitutions(last, lesson);
                lessons.splice(j, 1);
                j--;
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
    let timetableDate = moment(date)
        .weekday(0)
        .startOf('day')
        .add(day, 'day');
    for (let y = 0; y < periods.length; y++) {
        let lessons = (_data[day] || [])[y + 1] || [];
        if (lessons) {
            lessons = lessons
                .map(lesson => ({
                    ...lesson,
                    TEACHER_IDS: lesson.TEACHER_ID ? [lesson.TEACHER_ID] : [],
                    TEACHER_ID: undefined,
                }))
                .filter(
                    lesson =>
                        lesson.DATE_FROM &&
                        lesson.DATE_TO &&
                        moment(lesson.DATE_FROM.date).isSameOrBefore(timetableDate) &&
                        moment(lesson.DATE_TO.date).isSameOrAfter(timetableDate)
                );
        }
        data[y] = { lessons };
    }
    return { periods: data };
}

export function translatePeriods(masterdata, day, periods, teams, assignmentsMatching) {
    if (day.holiday) {
        return day;
    }
    for (let y = 0; y < periods.length; y++) {
        if (day.periods[y] && day.periods[y].lessons) {
            translate(masterdata, day.periods[y], teams, assignmentsMatching);
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

export function equalPeriods(p1, p2) {
    const period1 = p1.reference;
    const period2 = p2.reference;

    if (p1.assignments !== p2.assignments) {
        return false;
    }
    if (
        (!!period1.TIMETABLE_ID ? period1.TIMETABLE_ID === period2.TIMETABLE_ID : false) ||
        (period1.substitutionText === period2.substitutionText &&
            period1.substitutionRemove === period2.substitutionRemove &&
            period1.specificSubstitutionType === period2.specificSubstitutionType &&
            period1.SUBJECT_ID === period2.SUBJECT_ID &&
            period1.SUBJECT_ID_OLD === period2.SUBJECT_ID_OLD &&
            period1.ROOM_ID === period2.ROOM_ID &&
            period1.ROOM_ID_OLD === period2.ROOM_ID_OLD &&
            equalArrays(period1.TEACHER_IDS, period2.TEACHER_IDS) &&
            equalArrays(period1.TEACHER_IDS_OLD, period2.TEACHER_IDS_OLD) &&
            equalArrays(period1.CLASS_IDS, period2.CLASS_IDS) &&
            equalArrays(period1.CLASS_IDS_OLD, period2.CLASS_IDS_OLD))
    ) {
        return true;
    }
    return false;
}
function translate(masterdata, period, teams, assignmentsMatching) {
    if (!period) return null;
    period.lessons = period.lessons.map(lesson => translateLesson(masterdata, lesson, teams, assignmentsMatching));
}

export function translateLesson(masterdata, lesson, teams = {}, assignmentsMatching = { toMatch: [] }) {
    if (lesson.absence) {
        return { absence: lesson.absence };
    }
    let matchedTeams = Object.values(teams).filter(team => {
        const [className, subject] = team.externalName.split(' ');
        const classIsGrade = !(className || '').match(/[a-z]/i); //10 Inf1
        const matchingClass = (lesson.CLASS_IDS || []).some(c => {
            const lessonClassName = masterdata.Class[c].NAME;
            if (lessonClassName === className) return true;
            if (classIsGrade) return lessonClassName.indexOf(className) >= 0;
            return false;
        });
        const matchingClassOld = (lesson.CLASS_IDS_OLD || []).some(c => {
            const lessonClassName = masterdata.Class[c].NAME;
            if (lessonClassName === className) return true;
            if (classIsGrade) return lessonClassName.indexOf(className) >= 0;
            return false;
        });
        const matchingSubject = lesson.SUBJECT_ID && masterdata.Subject[lesson.SUBJECT_ID].NAME === subject;
        const matchingSubjectOld = lesson.SUBJECT_ID_OLD && masterdata.Subject[lesson.SUBJECT_ID_OLD].NAME === subject;
        return (matchingClass && matchingSubject) || (matchingClassOld && matchingSubjectOld);
    });

    let validAssignments = [];
    let stillToMatch = [];

    assignmentsMatching.toMatch.forEach(assignment => {
        if (matchedTeams.some(t => t.id === assignment.classId)) {
            validAssignments.push(assignment);
        } else {
            stillToMatch.push(assignment);
        }
    });
    assignmentsMatching.toMatch = stillToMatch;
    return {
        reference: lesson,
        isOld: lesson.isOld,
        substitutionInfo: lesson.substitutionInfo,
        substitutionText: lesson.substitutionText,
        substitutionType: lesson.substitutionType,
        specificSubstitutionType: lesson.specificSubstitutionType,
        substitutionRemove: lesson.substitutionRemove,
        teachers: {
            new: lesson.TEACHER_IDS && lesson.TEACHER_IDS.map(t => masterdata.Teacher[t]),
            old: lesson.TEACHER_IDS_OLD && lesson.TEACHER_IDS_OLD.map(t => masterdata.Teacher[t]),
            substitution:
                lesson.TEACHER_IDS_SUBSTITUTING && lesson.TEACHER_IDS_SUBSTITUTING.map(t => masterdata.Teacher[t]),
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
            new: lesson.CLASS_IDS && lesson.CLASS_IDS.map(c => masterdata.Class[c]),
            old: lesson.CLASS_IDS_OLD && lesson.CLASS_IDS_OLD.map(c => masterdata.Class[c]),
            substitution: lesson.CLASS_IDS_SUBSTITUTING && lesson.CLASS_IDS_SUBSTITUTING.map(c => masterdata.Class[c]),
        },
        teams: matchedTeams,
        assignments: validAssignments,
    };
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
        getTeams,
        getAssignmentsSelector,
        translateTimetable
    );
};

export default makeGetCurrentTimetable;
