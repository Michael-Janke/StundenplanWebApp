import React, { Component } from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS, SUBJECT_COLORS_MAP } from '../Common/const';
import chroma from 'chroma-js';
import { Paper, Avatar } from 'material-ui';
import PersonIcon from 'material-ui/svg-icons/social/person';
import RoomIcon from 'material-ui/svg-icons/action/room';


const StudentView = (props) => {
    const upn = props.teacher.UPN;
    const { size, color } = props;
    return (
        <LessonContainer>
            <SubjectSpan>{props.subject.NAME}</SubjectSpan>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', alignContent: 'center'}}>
                <Block>
                    <RoomSpan>{props.room.NAME}</RoomSpan>
                    <RoomIcon style={{ width: size, height: size }} fontSize={size} color={color} />
                </Block>
                <Block>
                    <TeacherSpan>{(props.teacher.FIRSTNAME || "")[0] + ". " + props.teacher.LASTNAME}</TeacherSpan>
                    {props.avatars[upn]
                        && props.avatars[upn].img
                        ? <Avatar src={"data:image/jpg;base64," + props.avatars[upn].img} size={size} />
                        : <PersonIcon style={{ width: size, height: size }} fontSize={size} color={color} />
                    }
                </Block>
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
                    const { avatars } = this.props;
                    return (
                        <Container
                            key={i}
                            {...lesson}
                            avatars={avatars}
                            size={10}
                            color={color}
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
`;

const RoomSpan = styled.span`
    font-size: 70%;
`;

const TeacherSpan = styled.span`
    font-size: 60%;
`;

const LessonContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    align-content: center;
    overflow: hidden;
    flex-wrap: wrap;
`;

export default Period;