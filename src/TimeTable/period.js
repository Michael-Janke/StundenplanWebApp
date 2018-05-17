import React from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS_MAP } from '../Common/const';

import { indigo } from '@material-ui/core/colors';
import Subject from './Fields/subject';
import Room from './Fields/room';
import Classes from './Fields/classes';
import Teachers from './Fields/teachers';
import AbstractLesson from './lesson';
import { equalPeriods } from '../Selector/timetable';

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