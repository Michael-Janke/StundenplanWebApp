import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ArrowForward from '@material-ui/icons/ArrowForward';
import red from 'material-ui/colors/red';
import grey from 'material-ui/colors/grey';

function SubjectContainer({ subject, small, themeClasses }) {
    const changed = !!subject.old;
    const ClassNormal = changed ? NewSubject : Subject;
    const Arrow = changed && <ArrowForward style={{ height: 10, width: null }} />;
    return (
        <Container className={themeClasses.subject}>
            {!small && subject.old && <OldSubject className={themeClasses['subject-old']}>{subject.old.NAME}</OldSubject>}
            {!small && Arrow}
            <ClassNormal className={themeClasses[changed ? 'subject-new' : 'subject-normal']}>{subject.new ? subject.new.NAME : '-'}</ClassNormal>
        </Container>
    )
}

export const subjectStyles = theme => ({
    'subject-normal': {
        fontSize: '75%',
        fontWeight: 600,
    },
    'subject-new': {
        color: theme.palette.type === 'dark' ? red.A700 : red[800],
        fontWeight: 600,
        fontSize: '80%',
    },
    'subject-old': {
        color: grey[600],
        fontSize: '50%',
    },
});

SubjectContainer.propTypes = {
    subject: PropTypes.object,
    small: PropTypes.bool,
};

const Container = styled.div`
    flex-direction: row;
    display: flex;
    align-items: center;
`;

const Subject = 'div';

const NewSubject = Subject;

const OldSubject = Subject;



export default SubjectContainer;