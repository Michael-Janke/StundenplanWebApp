import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';
import { grey, green } from '@material-ui/core/colors';
import { Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import useIsScope from './useIsScope';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: 'auto',
        '&:allDoneAssignments': {
            backgroundColor: green[600],
        }
    },

}), { name: "LessonBadge" });

export default function LessonBadge({ type, lesson, children }) {
    const classes = useStyles();
    const { assignments } = lesson;

    const isTeacher = useIsScope('teacher');
    
    if (assignments.length === 0) {
        return children;
    }

    const allDoneAssignments = assignments.every(assignment =>
        assignment.submissions ? assignment.submissions.every(submission => submission.status === 'submitted') : false
    );
    const hasDrafts = assignments.some(assignment => assignment.status === 'draft');
    const badgeContent = isTeacher ? (
        <AssignmentIcon style={{ fontSize: '1rem', marginRight: '5px', marginTop: '5px', color: hasDrafts ? grey[500] : undefined }} />
    ) : allDoneAssignments ? (
        <DoneIcon />
    ) : (assignments.length);

    return (
        <Badge
            component="div"
            color={allDoneAssignments ? 'default' : 'secondary'}
            className={classNames(classes.root, allDoneAssignments && classes.allDoneAssignments)}
            badgeContent={badgeContent}
        >
            {children}
        </Badge>
    );
}

