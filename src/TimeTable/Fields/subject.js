import React from 'react';
// import styled from 'styled-components';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';

const SubjectContainer = type => subject => (props) => {
    const { themeClasses, description } = props;
    const field = description ? 'DESCRIPTION' : 'NAME';

    const changed = subject.old === 0 || subject.new === 0;
    let output;
    if (type === 'new') {
        const ClassNormal = changed ? NewSubject : Subject;
        output = (
            <ClassNormal className={themeClasses[changed ? 'subject-new' : 'subject-normal']}>{subject.new ? subject.new[field] : '-'}</ClassNormal>
        );
    }
    if (type === 'old') {
        output = (
            <OldSubject className={themeClasses['subject-old']}>{subject.old[field]}</OldSubject>
        );
    }
    if (type === 'instead-by' || type === 'instead-of') {
        if (!changed) {
            return null;
        }
        output = (
            <Subject className={themeClasses['subject-normal']}>
                {subject.substitution ? subject.substitution[field] : '-'}
            </Subject>
        );
    }
    return description ? null : output;
};


export const subjectStyles = theme => ({
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
        textDecoration: 'line-through ' + (theme.palette.type === 'dark' ? "white" : "black"),
    },
    'subject-description': {
        fontSize: '70%',
        fontWeight: 600,
    }
});

const Subject = 'div';

const NewSubject = Subject;

const OldSubject = Subject;

export default SubjectContainer;