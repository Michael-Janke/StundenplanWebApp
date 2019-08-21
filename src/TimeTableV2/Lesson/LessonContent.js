import React from 'react';
import { useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Subject from './Fields/Subject';
import Room from './Fields/Room';

const useStyles = makeStyles(theme => ({
    substitutionText: {

    },
    root: {
        display: 'grid',
        
    }
}), { name: 'LessonContent' });

export default function LessonContent({ type, specificSubstitutionType, substitutionText, subject, room, lessonType }) {
    const theme = useTheme();
    const styles = specificSubstitutionType ? specificSubstitutionType.style(theme) : {};
    const classes = useStyles();
    const substitutionTextStyles = React.useMemo(() => ({ color: styles.color }), [styles.color]);

    return (
        <div className={classes.root}>
            <div className={classes.substitutionText} style={substitutionTextStyles}>
                {substitutionText}
            </div>
            <Subject subject={subject} type={lessonType}></Subject>
            <Room room={room} type={lessonType}></Room>
        </div>
    )
}