import React, { Component } from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS, SUBJECT_COLORS_MAP } from '../Common/const';
import chroma from 'chroma-js';
import { Paper, Avatar } from 'material-ui';
import PersonIcon from 'material-ui/svg-icons/social/person';
import RoomIcon from 'material-ui/svg-icons/action/room';
import { indigo50, indigo100 } from 'material-ui/styles/colors';

const extractSubject = (name) => {
    return name.replace(/[0-9]/g, "").substring(0, 3).toLowerCase();
}

const StudentView = ({ size, color, small, specificSubstitutionType, subject, room, teacher }) => {

    const lineColor = subject 
        ? SUBJECT_COLORS_MAP[extractSubject(subject.NAME)]
        : indigo100;
    let textLineColor = chroma.contrast(lineColor || 'white', 'white') > 3 ? 'white' : 'black';

    if (!small) return (
        <PeriodContainer color={(specificSubstitutionType || {}).backgroundColor}>
            <ColorBar lineColor={lineColor} />
            <LessonContainer>
                <Subject>{subject ? subject.NAME : '-'}</Subject>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                    <Room>{room.NAME}</Room>
                    {teacher.map((teacher, i) => <Teacher style={{ textAlign: 'right' }} key={i}>{(teacher.FIRSTNAME || "")[0] + ". " + teacher.LASTNAME}</Teacher>)}
                </div>
            </LessonContainer>
        </PeriodContainer>
    );
    if (small) return (
        <PeriodContainer color={(specificSubstitutionType || {}).backgroundColor}>
            <ColorBar lineColor={lineColor} />
            <LessonContainer small>
                <Subject>{subject.NAME}</Subject>
                {teacher.map((teacher, i) => <Teacher key={i}>{teacher.LASTNAME}</Teacher>)}
                <Room>{room.NAME}</Room>
            </LessonContainer>
        </PeriodContainer>
    );
};

const TeacherView = StudentView;
const ClassView = StudentView;
const RoomView = StudentView;


class Period extends Component {
    render() {
        if (!this.props.lessons || !this.props.type) {
            return null;
        }
        return (
            <PeriodsContainer>
                {this.props.lessons.map((lesson, i) => {
                    let Container = {
                        student: StudentView,
                        teacher: TeacherView,
                        room: RoomView,
                        class: ClassView
                    }[this.props.type.toLowerCase()];
                    const { avatars, small } = this.props;
                    return (
                        <Container
                            key={i}
                            {...lesson}
                            avatars={avatars}
                            size={10}
                            small={small}
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
    height:100%;
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
    ${props => (props.small ? `
        flex-direction: column;  
        padding-top: 0.25vmin;
        padding-bottom: 0.25vmin;
    `: `
        flex-direction: row;
        align-items: center; 
        padding-top: 0.5vmin;
        padding-bottom: 0.5vmin 
    `)}
`;

const PeriodContainer = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
    text-align: left;
    padding-right: 1vmin;
    flex-direction: row;
    background-color: ${props => props.color || indigo50};
`;

export default Period;