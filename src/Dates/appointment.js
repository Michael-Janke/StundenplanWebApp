import React from 'react';
import styled from 'styled-components';
import EditIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';

const styles = {
    icon: {
        height: 16,
        width: null,
        color: 'inherit',
    }
}
function Appointment({ TEXT, SUBTEXT, onEdit, onDelete }) {
    return (
        <Container>
            {onEdit &&
                <Toolbar>
                    <IconButton onClick={onEdit} style={styles.icon}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={onDelete}>
                        <DeleteIcon style={styles.icon} />
                    </IconButton>
                </Toolbar>
            }
            <Header>
                {TEXT}
            </Header>
            <Content>
                <Paragraph>
                    {SUBTEXT}
                </Paragraph>
            </Content>
        </Container>
    )
}


const Paragraph = styled.div`
    margin: 2px;
    display: flex;
    align-items: center;
`;

const Container = styled.div`
    word-break: break-word;
    width: 100%;
`;

const Toolbar = styled.div`
    float: right;
`;

const Header = styled.div`
    font-size: 70%;
    font-weight: 600;
    margin-bottom: 1vmin;
`;
const Content = styled.div`
    font-size: 60%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export default Appointment;
