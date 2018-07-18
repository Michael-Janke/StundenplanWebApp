import React from 'react';
// import styled from 'styled-components';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';


const SubjectContainer = type => subject => (props) => {
    const { themeClasses } = props;
    const changed = !!subject.old || subject.old === 0;
    if (type === 'new') {
        const ClassNormal = changed ? NewSubject : Subject;
        return (
            <ClassNormal className={themeClasses[changed ? 'subject-new' : 'subject-normal']}>{subject.new ? subject.new.NAME : '-'}</ClassNormal>
        );
    }
    if (type === 'old') {
        return (
            <OldSubject className={themeClasses['subject-old']}>{subject.old.NAME}</OldSubject>
        );
    }
    if (type === 'instead-by' || type === 'instead-of') {
        return (
            <Subject className={themeClasses['subject-substitution']}>
                {subject.substitution ? subject.substitution.NAME : '-'}
            </Subject>
        );
    }
};


export const subjectStyles = theme => ({
    'subject-normal': {
        fontSize: '75%',
        fontWeight: 600,
    },
    'subject-new': {
        color: theme.palette.type === 'dark' ? red[500] : red[800],
        fontWeight: 600,
        fontSize: '80%',
    },
    'subject-old': {
        color: theme.palette.type === 'dark' ? grey[300] : grey[600],
        fontSize: '70%',
        fontWeight: 600,
        textDecoration: `line-through ${theme.palette.divider}`,
    },
    'subject-substitution': {
        color: theme.palette.type === 'dark' ? grey[300] : grey[600],
        fontSize: '70%',
        fontWeight: 600,
        textDecoration: `line-through ${theme.palette.divider}`,
    }
});

// const Container = styled.div`
//     flex-direction: row;
//     display: flex;
//     align-items: center;
// `;

const Subject = 'div';

const NewSubject = Subject;

const OldSubject = Subject;



export default SubjectContainer;