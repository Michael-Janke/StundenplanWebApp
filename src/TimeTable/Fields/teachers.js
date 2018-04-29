import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const teacherToName = (teacher, small) =>
    teacher ?
        small
            ? teacher.LASTNAME
            : (teacher.FIRSTNAME || "")[0] + ". " + teacher.LASTNAME
        : '-';

function TeachersContainer({ teachers, small }) {
    const NormalTeacher = !!teachers.old ? NewTeacher : Teacher;
    return (
        <Container small={small}>
            {teachers.new.map((teacher, i) => <NormalTeacher key={i}>{teacherToName(teacher, small)}</NormalTeacher>)}
            {teachers.old && teachers.old.map((teacher, i) => <OldTeacher key={"o" + i}>{teacherToName(teacher, small)}</OldTeacher>)}
        </Container>
    )
}

TeachersContainer.propTypes = {
    teachers: PropTypes.object,
    small: PropTypes.bool,
};

const Container = styled.div`
    flex-direction: column;
    display: flex;
    width: 100%;
    ${props => !props.small && `
        align-items: flex-end; 
        text-align: right;
    `};
`;

const Teacher = styled.div`
    width: 100%;
    font-size: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const NewTeacher = styled(Teacher) `
`;

const OldTeacher = styled(Teacher) `
    font-size: 50%;
    text-decoration: line-through;
`;


export default TeachersContainer;
