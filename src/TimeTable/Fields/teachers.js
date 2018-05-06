import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const teacherToName = (teacher, small) =>
    teacher ?
        small
            ? teacher.LASTNAME
            : (teacher.FIRSTNAME || "")[0] + ". " + teacher.LASTNAME
        : '-';

function TeachersContainer({ teachers, small, left, themeClasses }) {
    const NormalTeacher = !!teachers.old ? NewTeacher : Teacher;
    return (
        <Container left={left} className={themeClasses['teacher']}>
            {teachers.new.map((teacher, i) =>
                <NormalTeacher className={themeClasses.teacher[!!teachers.old ? 'teacher-new' : 'teacher-normal']} key={i}>
                    {teacherToName(teacher, small)}
                </NormalTeacher>
            )}
            {teachers.old &&
                teachers.old.map((teacher, i) =>
                    <OldTeacher className={themeClasses['teacher-old']} key={"o" + i}>
                        {teacherToName(teacher, small)}
                    </OldTeacher>
                )}
        </Container>
    )
}

export const teacherStyles = () => ({
    'teacher': {

    }
});

TeachersContainer.propTypes = {
    teachers: PropTypes.object,
    small: PropTypes.bool,
};

const Container = styled.div`
    flex-direction: column;
    display: flex;
    width: 100%;
    ${props => !props.left && `
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
