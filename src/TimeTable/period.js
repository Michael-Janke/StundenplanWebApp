import React, { Component } from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS, SUBJECT_COLORS_MAP } from '../Common/const';
import chroma from 'chroma-js';
import { Paper, Avatar } from 'material-ui';
import PersonIcon from 'material-ui/svg-icons/social/person';
import RoomIcon from 'material-ui/svg-icons/action/room';


const StudentView = (props) => {
    const { size, color, small } = props;
    if(!small) return (
        <LessonContainer style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <SubjectSpan>{props.subject.NAME}</SubjectSpan>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', overflow: 'hidden' }}>
                <Room>{props.room.NAME}</Room>
                <Teacher>{(props.teacher.FIRSTNAME || "")[0] + ". " + props.teacher.LASTNAME}</Teacher>
            </div>
        </LessonContainer>
    );

    if(small) return (
        <LessonContainer style={{ flexDirection: 'column' }}>
            <SubjectSpan>{props.subject.NAME}</SubjectSpan>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Teacher>{props.teacher.LASTNAME}</Teacher>
                <Room>{props.room.NAME}</Room>
            </div>
        </LessonContainer>
    );
};

const TeacherView = StudentView;
const ClassView = StudentView;
const RoomView = StudentView;


class Period extends Component {
    render() {
        if (!this.props.lessons) {
            return null;
        }
        let backgroundColors = this.props.lessons.map((lesson) => SUBJECT_COLORS_MAP[lesson.subject.NAME.replace(/[0-9]/g, "").substring(0, 3).toLowerCase()]);
        let lastColor = backgroundColors[0];
        for (let i = 1; i < backgroundColors.length; i++) {
            lastColor = chroma.mix(lastColor, backgroundColors[i]);
        }
        let color = chroma.contrast(lastColor || 'white', 'white') > 3 ? 'white' : 'black';
        return (
            <PeriodContainer style={{
                backgroundColor: lastColor,
                color
            }}>
                {this.props.lessons.map((lesson, i) => {
                    let Container = {
                        student: StudentView,
                        teacher: TeacherView,
                        room: RoomView,
                        class: ClassView
                    }[this.props.type];
                    const { avatars, small } = this.props;
                    return (
                        <Container
                            key={i}
                            {...lesson}
                            avatars={avatars}
                            size={10}
                            color={color}
                            small={small}
                        />
                    );
                })}
            </PeriodContainer>
        );
    }
}

const Block = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    overflow: hidden;
`;

const PeriodContainer = styled.div`
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    border-radius: 0px;
    padding: 1vmin;
    flex-direction: column;
`;

const SubjectSpan = styled.span`
    font-size: 100%;
    font-weight: bold;
    margin-right: 1vmin;
`;

const Room = styled.div`
    font-size: 70%;
`;

const Teacher = styled.div`
    font-size: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    width:100%;
`;

const LessonContainer = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
    text-align: left;
    
`;

export default Period;