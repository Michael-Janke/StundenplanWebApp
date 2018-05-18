import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ArrowForward from '@material-ui/icons/ArrowForward';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';


function RoomContainer({ room, small, themeClasses, irrelevanceLevel }) {
    const changed = irrelevanceLevel <= 3 && !!room.old;
    const RoomNormal = changed ? NewRoom : Room;
    const Arrow = changed && <ArrowForward style={{ height: 10, width: null }} />;
    return (
        <Container className={themeClasses.room.root}>
            {!small && changed && <OldRoom className={themeClasses['room-old']}>{room.old.NAME}</OldRoom>}
            {!small && Arrow}
            <RoomNormal className={themeClasses[changed ? 'room-new' : 'room-normal']}>{room.new ? room.new.NAME : '-'}</RoomNormal>
        </Container>
    )
}

export const roomStyles = (theme) => ({
    'room': {

    },
    'room-new': {
        color: blue[theme.palette.type === 'dark' ? 400 : 800],
    },
    'room-old': {
        color: grey[600],
    },
});

RoomContainer.propTypes = {
    room: PropTypes.object,
    small: PropTypes.bool,
};

const Container = styled.div`
    flex-direction: row;
    display: flex;
    align-items: center;
`;

const Room = styled.div`
    font-size: 70%;
`;

const NewRoom = styled(Room)`
    font-weight: 600;
    font-size: 65%;
`;

const OldRoom = styled(Room)`
    font-size: 50%;
`;



export default RoomContainer;