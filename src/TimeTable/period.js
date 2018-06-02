import React from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS_MAP } from '../Common/const';
import AbstractLesson from './lesson';
import Absence from './absence';
import { equalPeriods } from '../Selector/timetable';
import SubjectContainer from './Fields/subject';
import RoomContainer from './Fields/room';
import TeachersContainer from './Fields/teachers';
import ClassesContainer from './Fields/classes';

const extractSubject = (name) => {
    return name.replace(/[0-9]/g, "").substring(0, 3).toLowerCase();
}
function getStudentFields(lesson) {
    const { subject, room, teachers } = lesson;
    return {
        colorBar: subject.new
            && SUBJECT_COLORS_MAP[extractSubject(subject.new.NAME)],
        fields: {
            new: !lesson.isOld && [
                SubjectContainer('new')(subject),
                RoomContainer('new')(room),
                TeachersContainer('new')(teachers),
            ],
            old: lesson.isOld && [
                SubjectContainer('old')(subject),
            ]
        }
    }
}

function getTeacherFields(lesson) {
    const { subject, room, classes, teachers } = lesson;
    return {
        colorBar: subject.new
            && SUBJECT_COLORS_MAP[extractSubject(subject.new.NAME)],
        fields: {
            new: !lesson.isOld && [
                SubjectContainer('new')(subject),
                RoomContainer('new')(room),
                ClassesContainer('new')(classes),
            ],
            old: lesson.isOld && [
                SubjectContainer('old')(subject),
                ClassesContainer('old')(classes),
            ],
            substitution: lesson.substitutionInfo && [
                SubjectContainer(lesson.substitutionInfo)(subject),
                TeachersContainer(lesson.substitutionInfo)(teachers),
            ],

        },
    }
}

function getRoomFields(lesson) {
    const { subject, teachers, classes } = lesson;
    return {
        colorBar: subject.new
            && SUBJECT_COLORS_MAP[extractSubject(subject.new.NAME)],
        fields: {
            new: !lesson.isOld && [
                ClassesContainer('new')(classes),
                SubjectContainer('new')(subject),
                TeachersContainer('new')(teachers),
            ],
            old: lesson.isOld && [
                ClassesContainer('old')(classes),
                SubjectContainer('old')(subject),
            ]
        },
    }
}

class Period extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.type !== this.props.type || nextProps.small !== this.props.small) {
            return true;
        }
        let l1 = this.props.lessons;
        let l2 = nextProps.lessons;
        if (l1.length !== l2.length) return true;
        for (let i = 0; i < l1.length; i++) {
            let o1 = l1[i];
            let o2 = l2[i];
            if (!equalPeriods(o1.reference, o2.reference)) {
                return true;
            }
        }
        return false;
    }
    render() {
        const { lessons, type, small } = this.props;
        if (!lessons || !type) {
            return null;
        }
        return (
            <PeriodsContainer>
                {lessons.map((lesson, i) => {
                    let { classes, subject, teachers, room, ...other } = lesson;
                    if (other.absenceOnly) {
                        return (
                            <Absence
                                {...other}
                                key={i}
                                small={small}
                            />
                        );
                    } else {
                        let fields = {
                            student: getStudentFields,
                            teacher: getTeacherFields,
                            room: getRoomFields,
                            class: getStudentFields
                        }[type.toLowerCase()](lesson);
                        return (
                            <AbstractLesson
                                {...other}
                                key={i}
                                last={lessons.length - 1 === i}
                                multiple={lessons.length > 1}
                                small={small}
                                {...fields}
                            />
                        );
                    }
                })}
            </PeriodsContainer>
        );
    }
}

const PeriodsContainer = styled.div`
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    border-radius: 0px;
    flex-direction: column;
`;

export default Period;