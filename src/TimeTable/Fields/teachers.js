import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const teacherToName = (teacher, small) =>
    teacher ?
        small
            ? teacher.LASTNAME
            : (teacher.FIRSTNAME || "")[0] + ". " + teacher.LASTNAME
        : '-';

const TeachersContainer = type => teachers => ({ small, left, themeClasses }) => {
    if (type === 'new') {
        const NormalTeacher = !!teachers.old ? NewTeacher : Teacher;
        return teachers.new.map((teacher, i) =>
            <NormalTeacher className={themeClasses.teacher[!!teachers.old ? 'teacher-new' : 'teacher-normal']} key={i}>
                {teacherToName(teacher, small)}
            </NormalTeacher>
        )
    }
    if (type === 'old') {
        return teachers.old.map((teacher, i) =>
            <OldTeacher className={themeClasses['teacher-old']} key={"o" + i}>
                {teacherToName(teacher, small)}
            </OldTeacher>
        );
    }
    if (type === 'instead-of' || type === 'instead-by') {
        return teachers.substitution.map((teacher, i) =>
            <Teacher className={themeClasses.teacher[!!teachers.old ? 'teacher-new' : 'teacher-normal']} key={i}>
                {teacherToName(teacher, small)}
            </Teacher>
        );
    }
}

export const teacherStyles = () => ({
    'teacher': {

    }
});

TeachersContainer.propTypes = {
    teachers: PropTypes.object,
    small: PropTypes.bool,
};

// const Container = styled.div`
//     flex-direction: column;
//     display: flex;
//     width: 100%;
//     ${props => !props.left && `
//         align-items: flex-end; 
//         text-align: right;
//     `};
// `;

const Teacher = styled.div`
    font-size: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-align: right;
`;

const NewTeacher = styled(Teacher) `
`;

const OldTeacher = styled(Teacher) `
    font-size: 50%;
`;


export default TeachersContainer;
