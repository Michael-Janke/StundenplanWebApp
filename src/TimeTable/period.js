import React from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS_MAP } from '../Common/const';

import { indigo } from 'material-ui/colors';
import Subject from './Fields/subject';
import Room from './Fields/room';
import Classes from './Fields/classes';
import Teachers from './Fields/teachers';
import AbstractLesson from './lesson';

const extractSubject = (name) => {
    return name.replace(/[0-9]/g, "").substring(0, 3).toLowerCase();
}

const FieldDescription = (reactClass, props) => ({ reactClass, props });

function getStudentFields(lesson) {
    const { subject, room, teachers } = lesson;
    return {
        colorBar: subject.new
            ? SUBJECT_COLORS_MAP[extractSubject(subject.new.NAME)]
            : indigo[100],
        fields: [
            FieldDescription(Subject, { subject }),
            FieldDescription(Room, { room }),
            FieldDescription(Teachers, { teachers }),
        ],
        removalField: null // cannot happen
    }
}

function getTeacherFields(lesson) {
    const { subject, room, classes, teachers, substitutionRemove } = lesson;
    return {
        colorBar: subject.new
            ? SUBJECT_COLORS_MAP[extractSubject(subject.new.NAME)]
            : indigo[100],
        fields: [
            FieldDescription(Subject, { subject }),
            FieldDescription(Room, { room }),
            FieldDescription(Classes, { classes }),
        ],
        removalField: substitutionRemove
            && FieldDescription(Teachers, { teachers })
    }
}

function getRoomFields(lesson) {
    const { subject, teachers, classes, substitutionRemove, room } = lesson;
    return {
        colorBar: subject.new
            ? SUBJECT_COLORS_MAP[extractSubject(subject.new.NAME)]
            : indigo[100],
        fields: [
            FieldDescription(Classes, { classes }),
            FieldDescription(Subject, { subject }),
            FieldDescription(Teachers, { teachers }),
        ],
        removalField: substitutionRemove
            && FieldDescription(Room, { room })
    }
}

const Period = ({ lessons, type, small }) => {
    if (!lessons || !type) {
        return null;
    }
    return (
        <PeriodsContainer>
            {lessons.map((lesson, i) => {
                let { classes, subject, teachers, room, ...other } = lesson;
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
            })}
        </PeriodsContainer>
    );
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