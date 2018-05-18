import React from 'react';
import styled from 'styled-components';
import grey from '@material-ui/core/colors/grey';

const Absence = ({ absence }) => {
    return (
        <Container>
            {absence.TEXT}
        </Container>
    );
};


const Container = styled.div`
    font-size: 60%;
    color: ${grey[600]};
    flex: 1;
    background-color: ${grey[100]};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default Absence;