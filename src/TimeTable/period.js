import React, { Component } from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS, SUBJECT_COLORS_MAP } from '../Common/const';
import chroma from 'chroma-js';
import { Paper, Avatar } from 'material-ui';
import PersonIcon from 'material-ui-icons/Person';
import RoomIcon from 'material-ui-icons/Room';
import { indigo } from 'material-ui/colors';

const extractSubject = (name) => {
    return name.replace(/[0-9]/g, "").substring(0, 3).toLowerCase();
}

const joinClasses = (classes) => {
    if (classes.length === 0) return "";
    if (classes.length === 1) return classes[0].NAME;
    classes = classes.map((_class) => {
        let split = _class.NAME.match(/[a-zA-Z]+|[0-9]+/g)
        return {
            grade: split[0],
            letter: split[1]
        }
    });
    classes.sort((a, b) => {
        if (a.grade < b.grade) return -1;
        if (a.grade > b.grade) return 1;
        if (a.letter < b.letter) return -1;
        if (a.letter > b.letter) return 1;
        return 0;
    });

    let outcome = "";
    classes.reduce((prev, _class) => {
        if (!prev || prev.grade !== _class.grade) {
            outcome += _class.grade;
        }
        outcome += _class.letter;
        return _class;
    }, null);
    return outcome;
}

const AbstractLesson = ({ colorBar, small, last, specificSubstitutionType, field1, field2, fields3 }) => {

    if (!small) return (
        <Lesson color={(specificSubstitutionType || {}).backgroundColor} flex>
            <ColorBar lineColor={colorBar} />

            <LessonContainer>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                    {specificSubstitutionType && <Substitution color={specificSubstitutionType.color}>{specificSubstitutionType.name}</Substitution>}
                    <Subject>{field1}</Subject>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', paddingLeft: 5 }}>
                    <Room>{field2}</Room>
                    {fields3.map((text, i) =>
                        <Teacher style={{ textAlign: 'right' }} key={i}>{text}</Teacher>
                    )}
                </div>
            </LessonContainer>

        </Lesson>
    );
    if (small) return (
        <Lesson color={(specificSubstitutionType || {}).backgroundColor} flex={last}>
            <ColorBar lineColor={colorBar} />
            <LessonContainer small>
                {specificSubstitutionType && <Substitution>{specificSubstitutionType.name}</Substitution>}
                <Subject>{field1}</Subject>
                {fields3.map((text, i) =>
                    <Teacher key={i}>{text}</Teacher>
                )}
                <Room>{field2}</Room>
            </LessonContainer>
        </Lesson>
    );
};


class Period extends Component {

    getStudentFields(lesson) {
        const { subject, room, teacher } = lesson;
        return {
            colorBar: subject
                ? SUBJECT_COLORS_MAP[extractSubject(subject.NAME)]
                : indigo[100],
            field1: subject ? subject.NAME : '-',
            field2: room ? room.NAME : '-',
            fields3: teacher.map((teacher, i) =>
                this.props.small
                    ? teacher.LASTNAME
                    : (teacher.FIRSTNAME || "")[0] + ". " + teacher.LASTNAME),
        }
    }

    getTeacherFields(lesson) {
        const { subject, room, classes } = lesson;
        return {
            colorBar: subject
                ? SUBJECT_COLORS_MAP[extractSubject(subject.NAME)]
                : indigo[100],
            field1: subject ? subject.NAME : '-',
            field2: room ? room.NAME : '-',
            fields3: [joinClasses(classes)],
        }
    }

    getRoomFields(lesson) {
        const { subject, teacher, classes } = lesson;
        return {
            colorBar: subject
                ? SUBJECT_COLORS_MAP[extractSubject(subject.NAME)]
                : indigo[100],
            field1: joinClasses(classes),
            field2: subject ? subject.NAME : '-',
            fields3: teacher.map((teacher, i) =>
                this.props.small
                    ? teacher.LASTNAME
                    : (teacher.FIRSTNAME || "")[0] + ". " + teacher.LASTNAME),
        }
    }

    render() {
        if (!this.props.lessons || !this.props.type) {
            return null;
        }
        return (
            <PeriodsContainer>
                {this.props.lessons.map((lesson, i) => {
                    let fields = {
                        student: this.getStudentFields,
                        teacher: this.getTeacherFields,
                        room: this.getRoomFields,
                        class: this.getStudentFields
                    }[this.props.type.toLowerCase()].bind(this, lesson)();
                    const { small } = this.props;
                    return (
                        <AbstractLesson
                            key={i}
                            {...lesson}
                            last={this.props.lessons.length - 1 === i}
                            small={small}
                            {...fields}
                        />
                    );
                })}
            </PeriodsContainer>
        );
    }
}

const ColorBar = styled.div`
    width: 3%;
    margin-right:5px;
    background-color: ${props => props.lineColor};
`;

const PeriodsContainer = styled.div`
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    border-radius: 0px;
    flex-direction: column;
`;

const Subject = styled.div`
    font-size: 75%;
    font-weight: 600;
    margin-right: 1vmin;

`;

const Substitution = styled.div`
    font-size: 60%;
    font-weight: 600;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: ${props => props.color};
`;

const Room = styled.div`
    font-size: 70%;
`;

const Teacher = styled.div`
    font-size: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
`;

const LessonContainer = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
    width: 100%;
    ${props => (props.small ? `
        flex-direction: column;  
        padding-top: 0.25vmin;
        padding-bottom: 0.25vmin;
    `: `
        flex-direction: row;
        align-items: center; 
        justify-content: space-between;
        padding-top: 0.5vmin;
        padding-bottom: 0.5vmin;
    `)}
`;
const LessonSubstitutuion = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;  
    padding: 0;
    align-items:center;
    padding-top: 0.5vmin;
    padding-bottom: 0.5vmin 
`;

const Lesson = styled.div`
    flex: ${props => props.flex ? 1 : 'none'};
    display: flex;
    overflow: hidden;
    text-align: left;
    padding-right: 1vmin;
    flex-direction: row;
    background-color: ${props => props.color || indigo[50]};
`;

export default Period;