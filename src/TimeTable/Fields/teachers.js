import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Description from './description';

const teacherToName = (teacher, small) =>
    teacher ?
        small
            ? teacher.LASTNAME
            : (teacher.FIRSTNAME || "")[0] + ". " + teacher.LASTNAME
        : '-';

const TeachersContainer = type => teachers => ({ small, left, themeClasses, description, setTimeTable, instead }) => {
    let output;
    if (type === 'new') {
        const NormalTeacher = !!teachers.old ? NewTeacher : Teacher;
        output = teachers.new.map(teacher =>
            <NormalTeacher
                left={left}
                onClick={description && (() => setTimeTable('teacher', teacher.TEACHER_ID))}
                className={themeClasses[!!teachers.old ? 'teacher-new' : 'teacher-normal']}
                key={teacher.TEACHER_ID}>
                {teacherToName(teacher, small)}
            </NormalTeacher>
        )
    }
    if (type === 'old') {
        output = teachers.old.map(teacher =>
            <OldTeacher
                left={left}
                onClick={description && (() => setTimeTable('teacher', teacher.TEACHER_ID))}
                className={themeClasses['teacher-old']} key={teacher.TEACHER_ID}>
                {teacherToName(teacher, small)}
            </OldTeacher>
        );
    }
    if (type === 'instead-of' || type === 'instead-by') {
        output = teachers.substitution.map(teacher =>
            <Teacher
                left={left}
                onClick={description && (() => setTimeTable('teacher', teacher.TEACHER_ID))}
                className={themeClasses[!!teachers.old ? 'teacher-new' : 'teacher-normal']}
                key={teacher.TEACHER_ID}>
                {teacherToName(teacher, small)}
            </Teacher>
        );
    }
    if(!description) return output;
    return <Description classes={themeClasses} label="Lehrer" type="teacher" instead={instead}>{output}</Description>;

}

export const teacherStyles = theme => ({
    'teacher': {

    }
});

TeachersContainer.propTypes = {
    teachers: PropTypes.object,
    small: PropTypes.bool,
};

const Teacher = styled.div`
    font-size: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-align: ${props => props.left ? 'left' : 'right'};
    ${props => props.onClick && `
        cursor: pointer;
        color: #123123;
    `}
`;

const NewTeacher = styled(Teacher)`
`;

const OldTeacher = styled(Teacher)`
    font-size: 50%;
`;

export default TeachersContainer;
