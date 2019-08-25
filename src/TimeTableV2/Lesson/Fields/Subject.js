import React from 'react';
// import styled from 'styled-components';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    'subject-normal': {
        fontSize: '72%',
        fontWeight: 600,
    },
    'subject-new': {
        color: theme.palette.type === 'dark' ? red[500] : red[800],
        fontWeight: 600,
        fontSize: '72%',
    },
    'subject-old': {
        color: theme.palette.type === 'dark' ? grey[300] : grey[600],
        fontSize: '70%',
        fontWeight: 600,
        textDecoration: 'line-through ' + (theme.palette.type === 'dark' ? 'white' : 'black'),
    },
    'subject-description': {
        fontSize: '70%',
        fontWeight: 600,
    },
}), {name: "Subject"});

const Subject = props => {
    const { subject, type } = props;
    const themeClasses = useStyles();

    const field = 'NAME';
    const changed = subject.old === 0 || subject.new === 0;
    let output;
    if (type === 'new') {
        output = (
            <div className={themeClasses[changed ? 'subject-new' : 'subject-normal']}>
                {subject.new ? subject.new[field] : '-'}
            </div>
        );
    }
    if (type === 'old') {
        output = (
            <div className={themeClasses['subject-old']}>
                {subject.old[field]}
            </div>
        );
    }
    if (type === 'instead-by' || type === 'instead-of') {
        output = (
            <div className={themeClasses['subject-normal']}>
                {subject.substitution ? subject.substitution[field] : '-'}
            </div>
        );
    }
    return output;
};

export default Subject;
