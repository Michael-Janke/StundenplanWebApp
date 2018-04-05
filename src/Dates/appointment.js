import React from 'react';
import styled from 'styled-components';
import { green800, lightGreen600, lime600, orange600 } from 'material-ui/styles/colors';
import RoomIcon from 'material-ui/svg-icons/action/room';
import TimeIcon from 'material-ui/svg-icons/device/access-time';
import ClassIcon from 'material-ui/svg-icons/social/group';
import EditIcon from 'material-ui/svg-icons/content/create';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import IconButton from 'material-ui/IconButton/IconButton';

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
                {/* <Paragraph>
                    <RoomIcon style={styles.icon} />
                </Paragraph>
                <Paragraph>
                    <TimeIcon style={styles.icon} />
                </Paragraph>
                <Paragraph>
                    <ClassIcon style={styles.icon} />
                </Paragraph> */}
            </Content>
        </Container>
    )
}

const Text = styled.div`
    font-size: 100%;
    width: 100%;
    margin-left: 10px;
`;

const Paragraph = styled.div`
    margin: 2px;
    display: flex;
    align-items: center;
`;

const Container = styled.div`
    background-color: ${orange600};
    color: white;
    padding: 8px;
    border-radius: 2px;
    box-shadow: rgba(0,0,0,0.1) 0px 0px 10px;
    word-wrap: break-word;
    width: 100%;
`;

const Toolbar = styled.div`
    float: right;
`;

const Header = styled.div`
    font-size: 90%;
    font-weight: 600;
    margin-bottom: 1vmin;
`;
const Content = styled.div`
    font-size: 75%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export default Appointment;
