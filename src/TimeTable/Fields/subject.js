import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import { red800 } from 'material-ui/styles/colors';
import { grey600 } from 'material-ui/styles/colors';

function SubjectContainer({ subject, small }) {
    const changed = !!subject.old;
    const ClassNormal = changed ? NewSubject : Subject;
    const Arrow = changed && <ArrowForward style={{ height: 10, width: null }}/>;
    return (
        <Container>
            {!small && subject.old && <OldSubject>{subject.old.NAME}</OldSubject>}
            {!small && Arrow}
            <ClassNormal>{subject.new ? subject.new.NAME : '-'}</ClassNormal>
        </Container>
    )
}

SubjectContainer.propTypes = {
    subject: PropTypes.object,
    small: PropTypes.bool,
};

const Container = styled.div`
    flex-direction: row;
    display: flex;
    align-items: center;
`;

const Subject = styled.div`
    font-size: 75%;
    font-weight: 600;
`;

const NewSubject = styled(Subject) `
    color: ${red800};
    font-weight: 600;
    font-size: 80%;
`;

const OldSubject = styled(Subject) `
    color: ${grey600};
    font-size: 50%;
`;



export default SubjectContainer;