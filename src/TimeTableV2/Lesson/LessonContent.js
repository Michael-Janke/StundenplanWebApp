import React from 'react';
import { makeStyles } from '@material-ui/styles';
import StudentView from './Fields/Views/StudentView';
import { useMediaQuery } from '@material-ui/core';
import TeacherView from './Fields/Views/TeacherView';
import RoomView from './Fields/Views/RoomView';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    small: {
        overflow: 'hidden',
        
    },
    left: {
        float: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    right: {
        float: 'right',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
        textAlign: 'right',
    }
}), { name: 'LessonContent' });

export default function LessonContent({ type, lesson }) {
    const small = useMediaQuery('(max-width:600px)');
    
    const View = {
        'student': StudentView,
        'class': StudentView,
        'teacher': TeacherView,
        'room': RoomView,
    }[type];
    const { left, right } = View(lesson);

    const classes = useStyles();

    if (small) {
        return (
            <div className={classes.small}>
                {left}
                {right}
            </div>
        )
    }

    return (
        <div className={classes.root}>
            <div className={classes.left}>
                {left}
            </div>
            <div className={classes.right}>
                {right}
            </div>
        </div>
    )
}