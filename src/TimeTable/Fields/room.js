import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';


const RoomContainer = type => room => ({ small, themeClasses }) => {
    const changed = !!room.old || room.old === 0;
    if (type === 'old') {
        return (
            <OldRoom className={themeClasses['room-old']}>{room.old.NAME}</OldRoom>
        );
    }
    if (type === 'new') {
        const RoomNormal = changed ? NewRoom : Room;
        return (
            <RoomNormal className={themeClasses[changed ? 'room-new' : 'room-normal']}>{room.new ? room.new.NAME : '-'}</RoomNormal>
        );
    }
    if (type === 'instead-of') {
        return (
            <Room className={themeClasses[changed ? 'room-new' : 'room-normal']}>{room.substitution ? room.substitution.NAME : '-'}</Room>
        );
    }
    if (type === 'instead-by') {
        return (
            <Room className={themeClasses[changed ? 'room-new' : 'room-normal']}>{room.substitution ? room.substitution.NAME : '-'}</Room>
        );
    }
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

// const Container = styled.div`
//     flex-direction: row;
//     display: flex;
//     align-items: center;
// `;

const Room = styled.div`
    font-size: 70%;
`;

const NewRoom = styled(Room) `
    font-weight: 600;
    font-size: 65%;
`;

const OldRoom = styled(Room) `
    font-size: 50%;
`;



export default RoomContainer;