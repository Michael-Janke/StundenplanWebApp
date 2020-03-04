import RoomContainer, { roomStyles } from './room';
import SubjectContainer, { subjectStyles } from './subject';
import TeachersContainer, { teacherStyles } from './teachers';
import ClassesContainer, { classStyles } from './classes';

export const styles = theme => ({
    ...subjectStyles(theme),
    ...roomStyles(theme),
    ...teacherStyles(theme),
    ...classStyles(theme),
});

export function getFields(type) {
    return {
        student: getStudentFields,
        teacher: getTeacherFields,
        room: getRoomFields,
        class: getStudentFields,
    }[type.toLowerCase()];
}

export function getStudentFields(lesson) {
    const { subject, room, teachers } = lesson;
    return {
        fields: {
            new: lesson.lessonType === 'new' && [
                SubjectContainer('new')(subject),
                RoomContainer('new')(room),
                TeachersContainer('new')(teachers),
            ],
            old: lesson.lessonType === 'old' && [SubjectContainer('old')(subject), TeachersContainer('old')(teachers)],
            substitution: lesson.lessonType === 'substitution' && [
                SubjectContainer(lesson.substitutionInfo)(subject),
                TeachersContainer(lesson.substitutionInfo)(teachers),
            ],
        },
    };
}

export function getTeacherFields(lesson) {
    const { subject, room, classes, teachers } = lesson;
    return {
        fields: {
            new: lesson.lessonType === 'new' && [
                SubjectContainer('new')(subject),
                ClassesContainer('new')(classes),
                RoomContainer('new')(room),
            ],
            old: lesson.lessonType === 'old' && [SubjectContainer('old')(subject), ClassesContainer('old')(classes)],
            substitution: lesson.lessonType === 'substitution' && [
                SubjectContainer(lesson.substitutionInfo)(subject),
                TeachersContainer(lesson.substitutionInfo)(teachers),
            ],
        },
    };
}

export function getRoomFields(lesson) {
    const { subject, teachers, classes } = lesson;
    return {
        fields: {
            new: lesson.lessonType === 'new' && [
                SubjectContainer('new')(subject),
                ClassesContainer('new')(classes),
                TeachersContainer('new')(teachers),
            ],
            old: lesson.lessonType === 'old' && [ClassesContainer('old')(classes), TeachersContainer('old')(teachers)],
        },
    };
}
