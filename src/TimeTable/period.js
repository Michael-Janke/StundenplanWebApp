import React, { Component } from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS_MAP } from '../Common/const';
import { indigo50, indigo100, grey600, grey500 } from 'material-ui/styles/colors';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Subject from './Fields/subject';
import Room from './Fields/room';
import Classes from './Fields/classes';
import Teachers from './Fields/teachers';

const extractSubject = (name) => {
    return name.replace(/[0-9]/g, "").substring(0, 3).toLowerCase();
}


const AbstractLesson = ({ colorBar, small, last, multiple, specificSubstitutionType, substitutionText, fields, removalField }) => {

    const additionalProps = { small };
    const ClassField1 = React.cloneElement(fields[0], additionalProps);
    const ClassField2 = React.cloneElement(fields[1], additionalProps);
    const ClassField3 = React.cloneElement(fields[2], additionalProps);
    const ClassRemovalField = removalField && React.cloneElement(removalField, additionalProps);

    if (!small) return (
        <Lesson color={(specificSubstitutionType || {}).backgroundColor} flex={!specificSubstitutionType || !multiple}>
            <ColorBar lineColor={colorBar} />
            <LessonWrapper>
                <LessonContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
                        {specificSubstitutionType &&
                            <Substitution color={specificSubstitutionType.color}>{specificSubstitutionType.name}</Substitution>
                        }
                        {ClassField1}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden', paddingLeft: 5 }}>
                        {ClassField2}
                        {ClassField3}
                    </div>
                </LessonContainer>
                {ClassRemovalField}
                {substitutionText &&
                    <SubstitutionText color={grey600}>
                        <ActionInfo style={{ width: 16, height: 16, marginRight: '0.3vmin' }} color={grey500} />
                        <div style={{ flex: 1 }}>{substitutionText}</div>
                    </SubstitutionText>}
            </LessonWrapper>

        </Lesson>
    );
    if (small) return (
        <Lesson color={(specificSubstitutionType || {}).backgroundColor} flex={last}>
            <ColorBar lineColor={colorBar} />
            <LessonContainer small>
                {specificSubstitutionType && <Substitution>{specificSubstitutionType.name}</Substitution>}
                {ClassField1}
                {ClassField3}
                {ClassField2}
                {ClassRemovalField}
                {substitutionText &&
                    <SubstitutionText color={grey600}>
                        <ActionInfo style={{ width: 16, height: 16, marginRight: '0.3vmin' }} color={grey500} />
                        <div style={{ flex: 1 }}>{substitutionText}</div>
                    </SubstitutionText>}
            </LessonContainer>
        </Lesson>
    );
};


class Period extends Component {

    getStudentFields(lesson) {
        const { subject, room, teachers } = lesson;
        return {
            colorBar: subject.new
                ? SUBJECT_COLORS_MAP[extractSubject(subject.new.NAME)]
                : indigo100,
            fields: [<Subject subject={subject} />, <Room room={room} />, <Teachers teachers={teachers} />],
            removalField: null // cannot happen
        }
    }

    getTeacherFields(lesson) {
        const { subject, room, classes, teachers, substitutionRemove } = lesson;
        return {
            colorBar: subject.new
                ? SUBJECT_COLORS_MAP[extractSubject(subject.new.NAME)]
                : indigo100,
            fields: [<Subject subject={subject} />, <Room room={room} />, <Classes classes={classes} />],
            removalField: substitutionRemove && <Teachers teachers={teachers}/>
        }
    }

    getRoomFields(lesson) {
        const { subject, teachers, classes, substitutionRemove, room } = lesson;
        return {
            colorBar: subject.new
                ? SUBJECT_COLORS_MAP[extractSubject(subject.new.NAME)]
                : indigo100,
            fields: [<Classes classes={classes} />, <Subject subject={subject} />, <Teachers teachers={teachers} />],
            removalField: substitutionRemove && <Room room={room}/>
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
                            multiple={this.props.lessons.length > 1}
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

const Substitution = styled.div`
    font-size: 60%;
    font-weight: 600;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: ${props => props.color};
`;

const SubstitutionText = styled.div`
    font-size: 70%;
    color: ${props => props.color};
    white-space: normal;
    align-items: center;
    display: flex;
`;



const LessonContainer = styled.div`
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

const LessonWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    overflow: hidden;
    justify-content: center;
`;

const Lesson = styled.div`
    flex: ${props => props.flex ? 1 : 'none'};
    display: flex;
    overflow: hidden;
    text-align: left;
    padding-right: 1vmin;
    flex-direction: row;
    background-color: ${props => props.color || indigo50};
`;

export default Period;