import React from 'react';
import { makeStyles } from '@material-ui/core';

const teacherToName = (teacher, small) =>
    teacher ? (small ? teacher.LASTNAME : (teacher.FIRSTNAME || '')[0] + '. ' + teacher.LASTNAME) : '-';

const useStyles = makeStyles(theme => ({
    teacher: {
        fontSize: '70%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
    },
    'teacher-old': {
        extend: 'teacher',
        fontSize: '50%',
    },
}));

const Teachers = ({ type, teachers, small }) => {
    const themeClasses = useStyles();
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
    return field.map(teacher => (
        <div
            type={type}
            className={className}
            key={teacher.TEACHER_ID}
        >
            {teacherToName(teacher, small)}
        </div>
    ));
};


export default Teachers;
