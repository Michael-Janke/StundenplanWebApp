import React, { Component } from 'react';
import styled from 'styled-components';
import { SUBJECT_COLORS, SUBJECT_COLORS_MAP } from '../Common/const';
import chroma from 'chroma-js';

class Period extends Component {
    render() {
        if (!this.props.lessons) {
            return null;
        }
        return (
            <PeriodContainer>
                {this.props.lessons.map((lesson, i) => {
                    let backgroundColor = SUBJECT_COLORS_MAP[lesson.subject.NAME.replace(/[0-9]/g, "").toLowerCase()];
                    return (
                        <LessonContainer key={i} style={{ backgroundColor, color: chroma.contrast(backgroundColor || 'white', 'white') > 3 ? 'white' : 'black' }}>
                            {/* <span>{lesson.teacher.NAME}</span> */}
                            <span>{lesson.subject.NAME}</span>
                            {/* <span>{lesson.room.NAME}</span> */}
                        </LessonContainer>
                    );
                })}
            </PeriodContainer>
        );
    }
}

const PeriodContainer = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const LessonContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: space-around;
`;

export default Period;