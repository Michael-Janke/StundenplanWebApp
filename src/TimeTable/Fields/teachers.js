import React from 'react';
import Description from './description';

const teacherToName = (teacher, small) =>
    teacher ?
        small
            ? teacher.LASTNAME
            : (teacher.FIRSTNAME || "")[0] + ". " + teacher.LASTNAME
        : '-';

function Container({ className, description, type, children, setTimeTable, teacher }) {
    if (description) {
        return (
            <Description
                onClick={(() => setTimeTable('teacher', teacher.TEACHER_ID))}
                type="teacher"
                upn={teacher.UPN}
                instead={type}>
                {children}
            </Description>
        )
    }
    return (
        <div className={className}>
            {children}
        </div>
    )
}

const TeachersContainer = type => teachers => ({ small, left, themeClasses, description, setTimeTable }) => {
    const className = {
        new: themeClasses.teacher,
        old: themeClasses['teacher-old'],
        'instead-of': themeClasses.teacher,
        'instead-by': themeClasses.teacher,
    }[type];
    const field = {
        new: teachers.new,
        old: teachers.old,
        'instead-by': teachers.substitution,
        'instead-of': teachers.substitution,
    }[type];
    return field.map(teacher =>
        <Container
            left={left}
            teacher={teacher}
            description={description}
            setTimeTable={setTimeTable}
            type={type}
            className={className}
            key={teacher.TEACHER_ID}>
            {teacherToName(teacher, small)}
        </Container>
    )
}

export const teacherStyles = theme => ({
    'teacher': {
        fontSize: '70%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%'
    },
    'teacher-old': {
        extend: 'teacher',
        fontSize: '50%',
    }
});


export default TeachersContainer;
