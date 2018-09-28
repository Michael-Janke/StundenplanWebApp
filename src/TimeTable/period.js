import React from 'react';
import styled from 'styled-components';
import AbstractLesson from './lesson';
import Absence from './absence';
import { equalPeriods } from '../Selector/timetable';
import { getFields } from './Fields';


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
        const { lessons, type, small, supervisions, continueation, setTimeTable } = this.props;
        if (!lessons || !type) {
            return null;
        }
        return (
            <PeriodsContainer>
                {lessons.map((lesson, i) => {
                    let { classes, subject, teachers, room, ...other } = lesson;
                    if (other.absenceOnly || (other.absence && other.type)) {
                        return (
                            <Absence
                                {...other}
                                key={i}
                                small={small}
                            />
                        );
                    } else {
                        return (
                            <AbstractLesson
                                {...other}
                                continueation={continueation}
                                key={i}
                                supervisions={supervisions}
                                last={lessons.length - 1 === i}
                                multiple={lessons.length > 1}
                                small={small}
                                setTimeTable={setTimeTable}
                                {...getFields(type)(lesson)}
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