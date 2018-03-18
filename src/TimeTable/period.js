import React, { Component } from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS, SUBJECT_COLORS_MAP } from '../Common/const';
import chroma from 'chroma-js';
import { Paper, Avatar } from 'material-ui';
import PersonIcon from 'material-ui/svg-icons/social/person';
import RoomIcon from 'material-ui/svg-icons/action/room';
import {indigo50} from 'material-ui/styles/colors';

const extractSubject = (name) => {
    return name.replace(/[0-9]/g, "").substring(0, 3).toLowerCase();
}


const StudentView = (props) => {
    const { size, color, small } = props;
    const backgroundColor = SUBJECT_COLORS_MAP[extractSubject(props.subject.NAME)];
    let colorT = chroma.contrast(backgroundColor || 'white', 'white') > 3 ? 'white' : 'black';
    if(!small) return (
        <LessonContainer>
            <ColorBar style={{backgroundColor}} />
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', overflow: 'hidden', paddingTop: '0.5vmin',
        paddingBottom: '0.5vmin' }}>
                <Subject>{props.subject.NAME}</Subject>
                <div style={{ display: 'flex', flex:1, flexDirection: 'column', alignItems: 'flex-end', justifyContent:'center' }}>
                    <Room>{props.room.NAME}</Room>
                    {props.teacher.map((teacher, i) => <Teacher key={i}>{(teacher.FIRSTNAME || "")[0] + ". " + teacher.LASTNAME}</Teacher>)}
                </div>
            </div>
        </LessonContainer>
    );

    if(small) return (
        <LessonContainer>
            <ColorBar style={{backgroundColor}} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column',  overflow: 'hidden', paddingTop: '0.25vmin',
        paddingBottom: '0.25vmin' }}>
                <Subject>{props.subject.NAME}</Subject>
                {props.teacher.map((teacher, i) => <Teacher key={i}>{teacher.LASTNAME}</Teacher>)}
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
        let lastColor = indigo50;
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

const ColorBar = styled.div`
    width: 0.5vmin;
    margin-right:5px;
    height:100%;
`;

const PeriodContainer = styled.div`
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
`;

const LessonContainer = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
    text-align: left;
    padding-right: 1vmin;
    flex-direction: row;
`;

export default Period;